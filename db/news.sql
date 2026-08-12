-- =============================================================================
-- 소식(News) 게시글 테이블
-- =============================================================================

CREATE TABLE IF NOT EXISTS news (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  center_id text NOT NULL,        -- 문화관 slug (예: 'sihwa', 'soyang', 'all'은 본사/전체 공지)
  center_name text NOT NULL,      -- 문화관 한글명 (예: '시화나래 조력문화관', '본사')
  title text NOT NULL,
  content text NOT NULL,
  views integer NOT NULL DEFAULT 0,
  is_pinned boolean NOT NULL DEFAULT false, -- 중요 소식 상단 고정 여부
  image_url text,                 -- 첨부/대표 이미지 URL
  created_at timestamptz NOT NULL DEFAULT now()
);

-- 최신순 목록 조회용 인덱스
CREATE INDEX IF NOT EXISTS news_created_idx ON news (created_at DESC);

-- 문화관별 필터 조회용 인덱스
CREATE INDEX IF NOT EXISTS news_center_idx ON news (center_id);
