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

-- Supabase Table Editor에 "RLS is disabled"가 뜨면 아래 한 줄을 실행해 RLS를 켤 수 있음.
-- · 의미: anon/authenticated 등에 대해 "행 단위 접근 제어"를 켠다. 정책이 없으면 PostgREST(공개 API)로는 이 테이블을 읽기 어렵다.
-- · Next.js 서버가 `RESERVATIONS_DATABASE_URL`의 postgres 역할로 붙는 경우, 해당 역할은 보통 RLS를 우회하므로
--   기존 `/api/reservations` 동작은 그대로인 경우가 많다(문제 시 한 번만 예약 API로 smoke 테스트).
ALTER TABLE tour_reservations ENABLE ROW LEVEL SECURITY;
