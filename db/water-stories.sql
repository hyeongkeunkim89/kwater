-- Supabase SQL Editor 등에서 1회 실행 (앱이 자동 생성하기도 함)
CREATE TABLE IF NOT EXISTS water_stories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  center_id text NOT NULL,
  center_name text NOT NULL,
  image_url text NOT NULL,
  nickname text NOT NULL,
  caption text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  is_photo_of_month boolean NOT NULL DEFAULT false
);

CREATE INDEX IF NOT EXISTS water_stories_created_idx ON water_stories (created_at DESC);
CREATE INDEX IF NOT EXISTS water_stories_center_idx ON water_stories (center_id);
