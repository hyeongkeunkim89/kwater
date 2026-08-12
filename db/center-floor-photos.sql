-- =============================================================================
-- 문화관 상세 「층별 주요 시설」 사진 메타데이터
-- =============================================================================
-- 실행: Supabase SQL Editor에서 1회 실행
-- Transaction pooler(6543) 사용 시 앱 런타임 CREATE TABLE이 생략되므로 이 스크립트 필수
-- 실제 이미지 파일은 Storage 버킷 `center-floor-photos`
--   → db/supabase-center-floor-bucket.sql 로 별도 생성
-- 앱 코드: src/lib/centerFloorPhotosDb.ts
-- =============================================================================

CREATE TABLE IF NOT EXISTS center_floor_photos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  center_id text NOT NULL,       -- 문화관 slug (centers.ts id와 동일)
  floor_key text NOT NULL,       -- 층 식별자 (예: b1, f1, f2)
  storage_path text NOT NULL,    -- Storage 객체 경로 (버킷 내 상대 경로)
  image_url text NOT NULL,       -- 공개 URL (갤러리 렌더링용)
  sort_order int NOT NULL DEFAULT 0,  -- 같은 층 내 표시 순서 (작을수록 앞)
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT center_floor_photos_storage_path_key UNIQUE (storage_path)
  -- storage_path 유니크: 동일 파일 중복 업로드 방지
);

-- 문화관·층별 목록 조회 + sort_order·created_at 정렬에 사용
CREATE INDEX IF NOT EXISTS center_floor_photos_center_floor_idx
  ON center_floor_photos (center_id, floor_key, sort_order ASC, created_at DESC);
