/**
 * 문화관 층별 시설 사진 — Postgres `center_floor_photos` 테이블 CRUD
 * 스키마: db/center-floor-photos.sql · Storage: db/supabase-center-floor-bucket.sql
 * DATABASE_URL(waterStoriesDb와 동일 연결) 사용
 */
import { getStoriesSql, skipDatabaseRuntimeSchemaDdl } from "@/lib/waterStoriesDb";

export type CenterFloorPhoto = {
  id: string;
  imageUrl: string;
};

let centerFloorPhotosSchemaPromise: Promise<void> | null = null;

/** pooler 6543이 아니면 앱 기동 시 테이블·인덱스 자동 생성 (1회만) */
function ensureCenterFloorPhotosSchema(sql: NonNullable<ReturnType<typeof getStoriesSql>>) {
  if (!centerFloorPhotosSchemaPromise) {
    if (skipDatabaseRuntimeSchemaDdl()) {
      centerFloorPhotosSchemaPromise = Promise.resolve();
      return centerFloorPhotosSchemaPromise;
    }
    centerFloorPhotosSchemaPromise = (async () => {
      await sql`
        CREATE TABLE IF NOT EXISTS center_floor_photos (
          id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
          center_id text NOT NULL,
          floor_key text NOT NULL,
          storage_path text NOT NULL,
          image_url text NOT NULL,
          sort_order int NOT NULL DEFAULT 0,
          created_at timestamptz NOT NULL DEFAULT now(),
          CONSTRAINT center_floor_photos_storage_path_key UNIQUE (storage_path)
        )
      `;
      await sql`
        CREATE INDEX IF NOT EXISTS center_floor_photos_center_floor_idx
        ON center_floor_photos (center_id, floor_key, sort_order, created_at DESC)
      `;
    })();
  }
  return centerFloorPhotosSchemaPromise;
}

/** 문화관·층별 사진 목록 (sort_order → created_at 순) */
export async function listCenterFloorPhotosFromDb(
  centerId: string,
  floorKey: string,
): Promise<CenterFloorPhoto[]> {
  const sql = getStoriesSql();
  if (!sql) return [];
  if (!/^[a-zA-Z0-9_-]+$/.test(centerId) || !/^[a-zA-Z0-9_-]+$/.test(floorKey)) return [];
  await ensureCenterFloorPhotosSchema(sql);
  const rows = await sql<{ id: string; image_url: string }[]>`
    SELECT id, image_url
    FROM center_floor_photos
    WHERE center_id = ${centerId} AND floor_key = ${floorKey}
    ORDER BY sort_order ASC, created_at DESC
  `;
  return rows.map((r) => ({ id: String(r.id), imageUrl: r.image_url }));
}

/** 새 사진 INSERT — 같은 층의 MAX(sort_order)+1 로 순서 부여 */
export async function insertCenterFloorPhotoDb(input: {
  centerId: string;
  floorKey: string;
  storagePath: string;
  imageUrl: string;
}): Promise<CenterFloorPhoto> {
  const sql = getStoriesSql();
  if (!sql) throw new Error("DATABASE_URL 없음");
  await ensureCenterFloorPhotosSchema(sql);
  const [agg] = await sql<{ n: number }[]>`
    SELECT COALESCE(MAX(sort_order), 0)::int AS n
    FROM center_floor_photos
    WHERE center_id = ${input.centerId} AND floor_key = ${input.floorKey}
  `;
  const nextOrder = (agg?.n ?? 0) + 1;
  const [row] = await sql<{ id: string; image_url: string }[]>`
    INSERT INTO center_floor_photos (center_id, floor_key, storage_path, image_url, sort_order)
    VALUES (${input.centerId}, ${input.floorKey}, ${input.storagePath}, ${input.imageUrl}, ${nextOrder})
    RETURNING id, image_url
  `;
  if (!row) throw new Error("INSERT 실패");
  return { id: String(row.id), imageUrl: row.image_url };
}

/** 삭제 전 Storage 경로 확인 등에 사용 — UUID 형식만 허용 */
export async function getCenterFloorPhotoRowById(id: string): Promise<{
  id: string;
  center_id: string;
  floor_key: string;
  image_url: string;
} | null> {
  const sql = getStoriesSql();
  if (!sql || !/^[0-9a-f-]{36}$/i.test(id)) return null;
  await ensureCenterFloorPhotosSchema(sql);
  const [row] = await sql<
    { id: string; center_id: string; floor_key: string; image_url: string }[]
  >`
    SELECT id, center_id, floor_key, image_url
    FROM center_floor_photos
    WHERE id = ${id}::uuid
  `;
  if (!row) return null;
  return {
    id: String(row.id),
    center_id: row.center_id,
    floor_key: row.floor_key,
    image_url: row.image_url,
  };
}

/** 행 삭제 후 image_url 반환 (Storage 객체 삭제용) */
export async function deleteCenterFloorPhotoDbById(id: string): Promise<string | null> {
  const sql = getStoriesSql();
  if (!sql || !/^[0-9a-f-]{36}$/i.test(id)) return null;
  await ensureCenterFloorPhotosSchema(sql);
  const [row] = await sql<{ image_url: string }[]>`
    DELETE FROM center_floor_photos
    WHERE id = ${id}::uuid
    RETURNING image_url
  `;
  return row?.image_url ?? null;
}
