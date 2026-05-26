-- Supabase SQL Editor에서 1회 실행 (Transaction pooler 6543 사용 시 앱 자동 CREATE 생략 → 이 스크립트 필수)
-- Storage 버킷 `center-floor-photos`는 db/supabase-center-floor-bucket.sql 로 별도 생성

CREATE TABLE IF NOT EXISTS center_floor_photos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  center_id text NOT NULL,
  floor_key text NOT NULL,
  storage_path text NOT NULL,
  image_url text NOT NULL,
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT center_floor_photos_storage_path_key UNIQUE (storage_path)
);

CREATE INDEX IF NOT EXISTS center_floor_photos_center_floor_idx
  ON center_floor_photos (center_id, floor_key, sort_order ASC, created_at DESC);
