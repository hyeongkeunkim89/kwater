import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/** Storage 버킷 이름 — Supabase 대시보드에서 동일 이름으로 public 버킷 생성 */
export const STORIES_STORAGE_BUCKET = "water-stories";

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
    console.error(error);
    return { error: "이미지 저장에 실패했습니다." };
  }

  const { data } = sb.storage.from(STORIES_STORAGE_BUCKET).getPublicUrl(objectPath);
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
