-- 가이드 투어 예약 전용 테이블 (물 이야기 `water_stories`와 무관 · `RESERVATIONS_DATABASE_URL` DB에 생성)
-- Supabase SQL Editor 등에서 1회 실행 권장; Transaction pooler 6543에서는 앱 DDL이 생략될 수 있음
CREATE TABLE IF NOT EXISTS tour_reservations (
  id text PRIMARY KEY,
  center_id text NOT NULL,
  center_name text NOT NULL,
  visit_date date NOT NULL,
  visit_time text NOT NULL,
  name text NOT NULL,
  phone text NOT NULL,
  party_size integer NOT NULL CHECK (party_size >= 1 AND party_size <= 100),
  purpose text NOT NULL,
  requests text NOT NULL DEFAULT '',
  status text NOT NULL DEFAULT '대기' CHECK (status IN ('대기', '확정', '취소')),
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT tour_reservations_purpose_chk CHECK (
    purpose IN ('개인·가족 관람', '단체·기관 방문', '교육 프로그램', '기타')
  )
);

CREATE INDEX IF NOT EXISTS tour_reservations_slot_idx
  ON tour_reservations (center_id, visit_date, visit_time);

CREATE INDEX IF NOT EXISTS tour_reservations_created_idx
  ON tour_reservations (created_at DESC);
