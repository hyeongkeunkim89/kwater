/**
 * Supabase Storage 서버 클라이언트 (service_role)
 * 물 이야기·층별 사진 업로드/삭제 — Postgres 메타는 *Db.ts 모듈
 * 버킷 설정 SQL: db/supabase-bucket.sql, db/supabase-center-floor-bucket.sql
 */
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/** Storage 버킷 이름 — Supabase 대시보드에서 동일 이름으로 public 버킷 생성 */
export const STORIES_STORAGE_BUCKET = "water-stories";

/** 문화관 상세 「층별 주요 시설」 사진 — db/supabase-center-floor-bucket.sql */
export const CENTER_FLOOR_STORAGE_BUCKET = "center-floor-photos";

/** Storage API가 주는 message·statusCode·error 문자열을 한 줄로 모음 */
function flattenStorageErr(err: unknown): string {
  if (err == null) return "";
  if (typeof err === "string") return err;
  if (typeof err !== "object") return String(err);
  const o = err as Record<string, unknown>;
  const bits: string[] = [];
  for (const k of ["message", "error", "statusCode", "status", "name", "hint"]) {
    const v = o[k];
    if (typeof v === "string" && v.trim()) bits.push(v.trim());
    if (typeof v === "number") bits.push(String(v));
  }
  return bits.join(" ").trim();
}

function storageUploadUserMessage(
  err: unknown,
  bucket: string,
  sqlSetupFile: string,
  maxMb: number,
): string {
  const raw = flattenStorageErr(err);
  const m = raw.toLowerCase();

  if (/bucket|not found|does not exist|404|no such bucket|unknown bucket/i.test(m)) {
    return `이미지 저장에 실패했습니다. Supabase Storage에 public 버킷 "${bucket}"를 만들고, ${sqlSetupFile}을 SQL Editor에서 실행했는지 확인해 주세요.`;
  }
  if (/row-level security|rls|violates.*policy|new row violates|unauthorized|forbidden|^403\b|statuscode.*403|permission denied|42501|insufficient privilege/i.test(m)) {
    return "이미지 저장에 실패했습니다. Vercel의 **SUPABASE_SERVICE_ROLE_KEY**가 Dashboard → API의 **service_role** 키(anon·publishable 아님)인지, **NEXT_PUBLIC_SUPABASE_URL**과 같은 프로젝트에서 복사했는지 확인해 주세요.";
  }
  if (/jwt|jws|signature|malformed|invalid.*token|invalid api|bad request.*key/i.test(m)) {
    return "이미지 저장에 실패했습니다. **SUPABASE_SERVICE_ROLE_KEY**가 잘렸거나 잘못 붙여넣기되었을 수 있습니다. 키 전체를 다시 넣고 Redeploy 하거나, **NEXT_PUBLIC_SUPABASE_URL**과 같은 Supabase 프로젝트의 키인지 확인해 주세요.";
  }
  if (/mime|invalid.*type|content-type|type not allowed|not acceptable/i.test(m)) {
    return "이미지 저장에 실패했습니다. JPEG/PNG/WebP/GIF 형식인지 확인해 주세요. (일부 기기는 다른 MIME으로 보낼 수 있습니다.)";
  }
  if (/payload too large|entity too large|413|exceeds|maximum.*size|file.?size|too large/i.test(m)) {
    return `이미지 저장에 실패했습니다. 파일이 ${maxMb} MB 이하인지 확인해 주세요.`;
  }
  if (/duplicate|already exists|resource already exists|unique constraint/i.test(m)) {
    return "이미지 저장에 실패했습니다. 동일 경로 충돌이 났습니다. 잠시 후 다시 시도해 주세요.";
  }
  if (/fetch failed|econnrefused|enotfound|network|socket|timeout|etimedout|getaddrinfo/i.test(m)) {
    return "이미지 저장에 실패했습니다. Supabase Storage로 **네트워크 연결**이 되지 않습니다. Vercel·회사망 방화벽에서 `*.supabase.co` 접근 가능 여부와 Supabase 프로젝트 **Paused** 여부를 확인해 주세요.";
  }

  const clip = raw.replace(/\s+/g, " ").trim().slice(0, 200);
  if (clip) {
    return `이미지 저장에 실패했습니다. (${clip}) Vercel의 NEXT_PUBLIC_SUPABASE_URL·SUPABASE_SERVICE_ROLE_KEY와 버킷 "${bucket}"(${sqlSetupFile})을 확인해 주세요.`;
  }
  return "이미지 저장에 실패했습니다. 잠시 후 다시 시도하거나, Vercel·Supabase 설정을 확인해 주세요.";
}

let adminClient: SupabaseClient | null = null;
let adminTried = false;

/** 서버 전용. SUPABASE_SERVICE_ROLE_KEY는 클라이언트에 넣지 마세요. */
export function getSupabaseAdmin(): SupabaseClient | null {
  if (adminTried) return adminClient;
  adminTried = true;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
  if (!url || !key) {
    adminClient = null;
    return null;
  }
  adminClient = createClient(url, key, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
  return adminClient;
}

export async function uploadStoryImageToStorage(
  objectPath: string,
  bytes: ArrayBuffer,
  contentType: string,
): Promise<{ publicUrl: string } | { error: string }> {
  const sb = getSupabaseAdmin();
  if (!sb) return { error: "Supabase가 구성되지 않았습니다." };

  const { error } = await sb.storage.from(STORIES_STORAGE_BUCKET).upload(objectPath, bytes, {
    contentType,
    upsert: false,
  });
  if (error) {
    console.error("Storage upload:", flattenStorageErr(error), error);
    return {
      error: storageUploadUserMessage(error, STORIES_STORAGE_BUCKET, "db/supabase-bucket.sql", 12),
    };
  }

  const { data } = sb.storage.from(STORIES_STORAGE_BUCKET).getPublicUrl(objectPath);
  return { publicUrl: data.publicUrl };
}

export async function uploadCenterFloorPhotoToStorage(
  objectPath: string,
  bytes: ArrayBuffer,
  contentType: string,
): Promise<{ publicUrl: string } | { error: string }> {
  const sb = getSupabaseAdmin();
  if (!sb) return { error: "Supabase가 구성되지 않았습니다." };

  const { error } = await sb.storage.from(CENTER_FLOOR_STORAGE_BUCKET).upload(objectPath, bytes, {
    contentType,
    upsert: false,
  });
  if (error) {
    console.error("Storage upload (floor):", flattenStorageErr(error), error);
    return {
      error: storageUploadUserMessage(
        error,
        CENTER_FLOOR_STORAGE_BUCKET,
        "db/supabase-center-floor-bucket.sql",
        20,
      ),
    };
  }

  const { data } = sb.storage.from(CENTER_FLOOR_STORAGE_BUCKET).getPublicUrl(objectPath);
  return { publicUrl: data.publicUrl };
}

/** 공개 URL에서 Storage 객체 경로 추출 (이 버킷만 처리) */
export function storageObjectPathFromPublicUrl(imageUrl: string): string | null {
  try {
    const u = new URL(imageUrl);
    const needle = `/object/public/${STORIES_STORAGE_BUCKET}/`;
    const i = u.pathname.indexOf(needle);
    if (i === -1) return null;
    return decodeURIComponent(u.pathname.slice(i + needle.length));
  } catch {
    return null;
  }
}

export async function removeStoryImageFromStorage(imageUrl: string): Promise<void> {
  const path = storageObjectPathFromPublicUrl(imageUrl);
  if (!path) return;
  const sb = getSupabaseAdmin();
  if (!sb) return;
  const { error } = await sb.storage.from(STORIES_STORAGE_BUCKET).remove([path]);
  if (error) console.warn("Storage 삭제 실패:", error.message);
}

/** 공개 URL에서 `center-floor-photos` 버킷 객체 경로 추출 */
export function centerFloorStorageObjectPathFromPublicUrl(imageUrl: string): string | null {
  try {
    const u = new URL(imageUrl);
    const needle = `/object/public/${CENTER_FLOOR_STORAGE_BUCKET}/`;
    const i = u.pathname.indexOf(needle);
    if (i === -1) return null;
    return decodeURIComponent(u.pathname.slice(i + needle.length));
  } catch {
    return null;
  }
}

export async function removeCenterFloorPhotoFromStorage(imageUrl: string): Promise<void> {
  const p = centerFloorStorageObjectPathFromPublicUrl(imageUrl);
  if (!p) return;
  const sb = getSupabaseAdmin();
  if (!sb) return;
  const { error } = await sb.storage.from(CENTER_FLOOR_STORAGE_BUCKET).remove([p]);
  if (error) console.warn("층별 Storage 삭제 실패:", error.message);
}
