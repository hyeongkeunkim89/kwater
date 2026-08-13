/**
 * 물 이야기 게시글 — Postgres `water_stories` 테이블 CRUD
 * 스키마: db/water-stories.sql · 연결: DATABASE_URL (+ DATABASE_PASSWORD)
 * Transaction pooler(6543)면 DDL 생략 → SQL Editor에서 테이블 미리 생성
 */
import "./dnsPatch";
import postgres from "postgres";
import type { WaterStory } from "@/types/waterStory";

const globalForSql = globalThis as unknown as {
  waterStoriesSql: ReturnType<typeof postgres> | undefined;
};

/** Vercel에 따옴표·BOM·앞뒤 공백이 섞이면 `Invalid URL`이 날 수 있음 */
function normalizeDatabaseUrlEnv(raw: string | undefined): string {
  if (!raw) return "";
  let u = raw.trim();
  if (u.charCodeAt(0) === 0xfeff) u = u.slice(1).trim();
  if (u.length >= 2) {
    const q = u[0];
    if ((q === '"' || q === "'") && u[u.length - 1] === q) {
      u = u.slice(1, -1).trim();
    }
  }
  return u.replace(/\r\n/g, "").replace(/\n/g, "");
}

/**
 * Vercel 등에서 URI에 비밀번호를 넣으면 `+`·`#` 등이 깨져 28P01이 나는 경우가 있어,
 * `DATABASE_PASSWORD`(평문, 서버 전용)가 있으면 Node `URL`로 비밀번호만 안전히 붙입니다.
 */
function getResolvedDatabaseUrl(): string | null {
  const url = process.env.POSTGRES_URL || process.env.POSTGRES_PRISMA_URL || process.env.DATABASE_URL;
  const base = normalizeDatabaseUrlEnv(url);
  if (!base) return null;
  const plain = process.env.DATABASE_PASSWORD?.trim() || process.env.POSTGRES_PASSWORD?.trim();
  if (!plain) return base;
  try {
    const u = new URL(base);
    u.password = plain;
    return u.href;
  } catch {
    console.error("DATABASE_URL + DATABASE_PASSWORD 병합 실패(Invalid URL)");
    return base;
  }
}

/** Supabase 호스트인데 sslmode가 없으면 URI에만 붙임(라이브러리 ssl 옵션과 이중 적용 시 연결 실패할 수 있음) */
function ensureSupabaseSslQuery(raw: string): string {
  const u = raw.trim();
  if (!/supabase\.co|pooler\.supabase\.com/i.test(u)) return u;
  if (/[?&]sslmode=/i.test(u)) return u;
  return u.includes("?") ? `${u}&sslmode=require` : `${u}?sslmode=require`;
}

/** Supabase Transaction pooler(6543 등) + postgres.js 는 `prepare: false` 와 함께 `pgbouncer=true` 권장 */
function supabasePoolerDatabaseUrl(raw: string): string {
  const u = raw.trim();
  if (!/pooler\.supabase\.com/i.test(u)) return u;
  if (/[?&]pgbouncer=true/i.test(u)) return u;
  return u.includes("?") ? `${u}&pgbouncer=true` : `${u}?pgbouncer=true`;
}

/** Vercel 환경이거나 Supabase 클라우드 데이터베이스를 연결한 경우 DDL 검사를 항상 건너뛰어 랜딩 성능 극대화 */
function skipRuntimeSchemaDdl(): boolean {
  if (process.env.VERCEL || process.env.NODE_ENV === "production") {
    return true;
  }
  const u = getResolvedDatabaseUrl() ?? "";
  // 로컬 PostgreSQL이 아닌 클라우드 Supabase DB 연결(supabase.co)이면 항상 스키마 생성을 스킵합니다.
  return /supabase\.co|pooler\.supabase\.com/i.test(u);
}

/** 다른 서버 DB 모듈에서 동일 판별용 */
export function skipDatabaseRuntimeSchemaDdl(): boolean {
  return skipRuntimeSchemaDdl();
}

let schemaPromise: Promise<void> | null = null;

/** 싱글톤 postgres.js 클라이언트 (HMR·serverless 재사용) */
export function getStoriesSql(): ReturnType<typeof postgres> | null {
  const url = getResolvedDatabaseUrl();
  if (!url) return null;
  if (!globalForSql.waterStoriesSql) {
    const resolved = supabasePoolerDatabaseUrl(ensureSupabaseSslQuery(url));
    globalForSql.waterStoriesSql = postgres(resolved, {
      max: 1,
      prepare: false,
      connect_timeout: 90,
      idle_timeout: 60,
      keep_alive: 30,
    });
  }
  return globalForSql.waterStoriesSql;
}

async function disposeWaterStoriesSql(): Promise<void> {
  const c = globalForSql.waterStoriesSql;
  globalForSql.waterStoriesSql = undefined;
  schemaPromise = null;
  if (c) {
    try {
      await c.end({ timeout: 5 });
    } catch {
      /* 연결 끊김 시 무시 */
    }
  }
}

function isTransientConnectionFailure(err: unknown): boolean {
  const code =
    err && typeof err === "object" && "code" in err
      ? String((err as { code?: string }).code ?? "").toUpperCase()
      : "";
  const msg = (err instanceof Error ? err.message : String(err)).toUpperCase();
  return (
    code === "ETIMEDOUT" ||
    code === "ECONNRESET" ||
    code === "EPIPE" ||
    code === "ENOTFOUND" ||
    /ETIMEDOUT|ECONNRESET|EPIPE|ENOTFOUND|SOCKET HANG UP|CONNECT_TIMEOUT|UND_ERR_CONNECT_TIMEOUT/i.test(
      msg + code,
    )
  );
}

/** pooler 6543이 아니면 water_stories 테이블·인덱스 자동 생성 */
function ensureWaterStoriesSchema(sql: ReturnType<typeof postgres>) {
  if (!schemaPromise) {
    if (skipRuntimeSchemaDdl()) {
      schemaPromise = Promise.resolve();
      return schemaPromise;
    }
    schemaPromise = (async () => {
      await sql`
        CREATE TABLE IF NOT EXISTS water_stories (
          id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
          center_id text NOT NULL,
          center_name text NOT NULL,
          image_url text NOT NULL,
          nickname text NOT NULL,
          caption text NOT NULL,
          created_at timestamptz NOT NULL DEFAULT now(),
          is_photo_of_month boolean NOT NULL DEFAULT false
        )
      `;
      await sql`
        CREATE INDEX IF NOT EXISTS water_stories_created_idx
        ON water_stories (created_at DESC)
      `;
      await sql`
        CREATE INDEX IF NOT EXISTS water_stories_center_idx
        ON water_stories (center_id)
      `;
    })();
  }
  return schemaPromise;
}

function rowToStory(r: {
  id: string;
  center_id: string;
  center_name: string;
  image_url: string;
  nickname: string;
  caption: string;
  created_at: Date;
  is_photo_of_month: boolean;
}): WaterStory {
  return {
    id: String(r.id),
    centerId: r.center_id,
    centerName: r.center_name,
    imageSrc: r.image_url,
    nickname: r.nickname,
    caption: r.caption,
    createdAt:
      r.created_at instanceof Date ? r.created_at.toISOString() : String(r.created_at),
    isPhotoOfMonth: r.is_photo_of_month,
  };
}

// ── 메모리 캐싱 레이어 (성능 극대화 및 외부 스크립트 호환용) ──
interface CacheEntry<T> {
  timestamp: number;
  data: T;
}

let storiesListCache: Record<string, CacheEntry<WaterStory[]>> = {};
const CACHE_TTL = 10000; // 10초 캐시 유지

export function clearStoriesCache() {
  storiesListCache = {};
}

/** 전체 또는 centerId 필터 목록 (최신순) */
export async function listWaterStoriesFromDb(centerId?: string): Promise<WaterStory[]> {
  const cacheKey = centerId || "all";
  const now = Date.now();
  const cached = storiesListCache[cacheKey];

  if (cached && now - cached.timestamp < CACHE_TTL) {
    return cached.data;
  }

  const sql = getStoriesSql();
  if (!sql) return [];
  await ensureWaterStoriesSchema(sql);
  const rows =
    centerId && /^[a-zA-Z0-9_-]+$/.test(centerId)
      ? await sql<
          {
            id: string;
            center_id: string;
            center_name: string;
            image_url: string;
            nickname: string;
            caption: string;
            created_at: Date;
            is_photo_of_month: boolean;
          }[]
        >`
          SELECT id, center_id, center_name, image_url, nickname, caption, created_at, is_photo_of_month
          FROM water_stories
          WHERE center_id = ${centerId}
          ORDER BY created_at DESC
        `
      : await sql<
          {
            id: string;
            center_id: string;
            center_name: string;
            image_url: string;
            nickname: string;
            caption: string;
            created_at: Date;
            is_photo_of_month: boolean;
          }[]
        >`
          SELECT id, center_id, center_name, image_url, nickname, caption, created_at, is_photo_of_month
          FROM water_stories
          ORDER BY created_at DESC
        `;
  
  const result = rows.map(rowToStory);
  
  storiesListCache[cacheKey] = {
    timestamp: now,
    data: result,
  };

  return result;
}

/** 새 게시글 INSERT — 일시적 연결 오류 시 최대 3회 재시도 */
export async function insertWaterStoryDb(input: {
  centerId: string;
  centerName: string;
  imageUrl: string;
  nickname: string;
  caption: string;
}): Promise<WaterStory> {
  clearStoriesCache();
  let lastErr: unknown;
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      const sql = getStoriesSql();
      if (!sql) throw new Error("DATABASE_URL 없음");
      await ensureWaterStoriesSchema(sql);
      const [row] = await sql<
        {
          id: string;
          center_id: string;
          center_name: string;
          image_url: string;
          nickname: string;
          caption: string;
          created_at: Date;
          is_photo_of_month: boolean;
        }[]
      >`
        INSERT INTO water_stories (center_id, center_name, image_url, nickname, caption)
        VALUES (
          ${input.centerId},
          ${input.centerName},
          ${input.imageUrl},
          ${input.nickname},
          ${input.caption}
        )
        RETURNING id, center_id, center_name, image_url, nickname, caption, created_at, is_photo_of_month
      `;
      if (!row) throw new Error("INSERT 실패");
      return rowToStory(row);
    } catch (e) {
      lastErr = e;
      if (attempt < 2 && isTransientConnectionFailure(e)) {
        console.warn("insertWaterStoryDb: 연결 실패, 재시도", attempt + 1, e);
        await disposeWaterStoriesSql();
        await new Promise((r) => setTimeout(r, 500 * (attempt + 1)));
        continue;
      }
      throw e;
    }
  }
  throw lastErr;
}

/** Storage 삭제 전 image_url 조회 */
export async function getWaterStoryImageUrl(id: string): Promise<string | null> {
  const sql = getStoriesSql();
  if (!sql) return null;
  await ensureWaterStoriesSchema(sql);
  const [row] = await sql<{ image_url: string }[]>`
    SELECT image_url FROM water_stories WHERE id = ${id}::uuid
  `;
  return row?.image_url ?? null;
}

export async function deleteWaterStoryDb(id: string): Promise<void> {
  clearStoriesCache();
  const sql = getStoriesSql();
  if (!sql) throw new Error("DATABASE_URL 없음");
  await ensureWaterStoriesSchema(sql);
  await sql`DELETE FROM water_stories WHERE id = ${id}::uuid`;
}

/** 이달의 사진 지정 — 기존 true 전부 해제 후 대상 1건만 true */
export async function setPhotoOfMonthDb(id: string): Promise<void> {
  clearStoriesCache();
  const sql = getStoriesSql();
  if (!sql) throw new Error("DATABASE_URL 없음");
  await ensureWaterStoriesSchema(sql);
  await sql.begin(async (tx) => {
    await tx`UPDATE water_stories SET is_photo_of_month = false`;
    await tx`UPDATE water_stories SET is_photo_of_month = true WHERE id = ${id}::uuid`;
  });
}

/** 이달의 사진 플래그 전체 해제 */
export async function clearPhotoOfMonthDb(): Promise<void> {
  clearStoriesCache();
  const sql = getStoriesSql();
  if (!sql) throw new Error("DATABASE_URL 없음");
  await ensureWaterStoriesSchema(sql);
  await sql`UPDATE water_stories SET is_photo_of_month = false`;
}
