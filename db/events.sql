-- =============================================================================
-- 이벤트(Event) 테이블
-- =============================================================================

CREATE TABLE IF NOT EXISTS events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  center_id text NOT NULL,        -- 문화관 slug (예: 'sihwa', 'soyang', 'all'은 본사/전체 이벤트)
  center_name text NOT NULL,      -- 문화관 한글명 (예: '시화나래 조력문화관', '본사')
  title text NOT NULL,
  content text NOT NULL,
  start_date date NOT NULL,       -- 이벤트 시작일 (YYYY-MM-DD)
  end_date date NOT NULL,         -- 이벤트 종료일 (YYYY-MM-DD)
  is_headquarters boolean NOT NULL DEFAULT false, -- 본사 주관 이벤트 여부
  image_url text,                 -- 이벤트 배너/포스터 이미지 URL
  created_at timestamptz NOT NULL DEFAULT now()
);

-- 최신순 목록 조회용 인덱스
CREATE INDEX IF NOT EXISTS events_created_idx ON events (created_at DESC);

-- 문화관별 필터 조회용 인덱스
CREATE INDEX IF NOT EXISTS events_center_idx ON events (center_id);
