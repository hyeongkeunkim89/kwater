import postgres from "postgres";
import type { WaterStory } from "@/types/waterStory";

const globalForSql = globalThis as unknown as {
  waterStoriesSql: ReturnType<typeof postgres> | undefined;
};

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

/** Transaction pooler(6543)에서는 DDL(CREATE TABLE)이 막히는 경우가 많아, 테이블은 SQL Editor에서 미리 만들어야 함 */
function skipRuntimeSchemaDdl(): boolean {
  const u = process.env.DATABASE_URL?.trim() ?? "";
  return /pooler\.supabase\.com:6543/i.test(u);
}

let schemaPromise: Promise<void> | null = null;

export function getStoriesSql(): ReturnType<typeof postgres> | null {
  const url = process.env.DATABASE_URL?.trim();
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

export async function listWaterStoriesFromDb(centerId?: string): Promise<WaterStory[]> {
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
  return rows.map(rowToStory);
}

export async function insertWaterStoryDb(input: {
  centerId: string;
  centerName: string;
  imageUrl: string;
  nickname: string;
  caption: string;
}): Promise<WaterStory> {
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
  const sql = getStoriesSql();
  if (!sql) throw new Error("DATABASE_URL 없음");
  await ensureWaterStoriesSchema(sql);
  await sql`DELETE FROM water_stories WHERE id = ${id}::uuid`;
}

export async function setPhotoOfMonthDb(id: string): Promise<void> {
  const sql = getStoriesSql();
  if (!sql) throw new Error("DATABASE_URL 없음");
  await ensureWaterStoriesSchema(sql);
  await sql.begin(async (tx) => {
    await tx`UPDATE water_stories SET is_photo_of_month = false`;
    await tx`UPDATE water_stories SET is_photo_of_month = true WHERE id = ${id}::uuid`;
  });
}

export async function clearPhotoOfMonthDb(): Promise<void> {
  const sql = getStoriesSql();
  if (!sql) throw new Error("DATABASE_URL 없음");
  await ensureWaterStoriesSchema(sql);
  await sql`UPDATE water_stories SET is_photo_of_month = false`;
}
