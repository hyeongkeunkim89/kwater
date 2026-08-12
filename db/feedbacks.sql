-- =============================================================================
-- 소통창구(Feedback) 게시글 테이블
-- =============================================================================

CREATE TABLE IF NOT EXISTS feedbacks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  center_id text NOT NULL,        -- 문의 대상 문화관 slug (예: 'sihwa', 'soyang', 'all'은 본사/전체 문의)
  center_name text NOT NULL,      -- 문의 대상 문화관 한글명 (예: '시화나래 조력문화관', '본사')
  title text NOT NULL,
  content text NOT NULL,
  writer_type text NOT NULL,      -- 작성 유형 ('실명' 또는 '익명')
  writer_name text NOT NULL,      -- 작성자명
  password text NOT NULL,         -- 본인 확인 및 비밀글 조회용 비밀번호 (평문 또는 해시)
  is_private boolean NOT NULL DEFAULT false, -- 비밀글 여부
  admin_reply text,               -- 관리자 답변 내용
  admin_replied_at timestamptz,   -- 관리자 답변 등록 시각
  created_at timestamptz NOT NULL DEFAULT now()
);

-- 최신순 목록 조회용 인덱스
CREATE INDEX IF NOT EXISTS feedbacks_created_idx ON feedbacks (created_at DESC);

-- 문화관별 필터 조회용 인덱스
CREATE INDEX IF NOT EXISTS feedbacks_center_idx ON feedbacks (center_id);
