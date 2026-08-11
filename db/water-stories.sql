-- =============================================================================
-- 물 이야기(방문자 사진·한 줄) 게시글
-- =============================================================================
-- 실행: Supabase SQL Editor 등에서 1회 실행 (앱이 자동 CREATE하기도 함)
-- 이미지 파일은 Storage 버킷 `water-stories` → db/supabase-bucket.sql
-- 앱 코드: src/lib/waterStoriesDb.ts
-- =============================================================================

CREATE TABLE IF NOT EXISTS water_stories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  center_id text NOT NULL,       -- 문화관 slug
  center_name text NOT NULL,     -- 당시 표시명 (스냅샷, 문화관명 변경 시에도 유지)
  image_url text NOT NULL,       -- Storage 공개 URL
  nickname text NOT NULL,        -- 작성자 닉네임
  caption text NOT NULL,         -- 한 줄 설명
  created_at timestamptz NOT NULL DEFAULT now(),
  is_photo_of_month boolean NOT NULL DEFAULT false
  -- 이달의 사진: 전체 중 최대 1건만 true (앱에서 트랜잭션으로 보장)
);

-- 최신순 목록 (전체·문화관별)
CREATE INDEX IF NOT EXISTS water_stories_created_idx ON water_stories (created_at DESC);

-- 문화관 필터 조회
CREATE INDEX IF NOT EXISTS water_stories_center_idx ON water_stories (center_id);
