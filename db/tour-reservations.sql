-- =============================================================================
-- 가이드 투어 예약
-- =============================================================================
-- 실행: Supabase SQL Editor 등에서 1회 실행 권장
-- Transaction pooler(6543) 사용 시 앱 DDL이 생략될 수 있음
-- 물 이야기와 같은 Postgres를 쓰면 DATABASE_URL DB에 생성 (tour_reservations 테이블)
-- 별도 URL이면 RESERVATIONS_DATABASE_URL DB에 생성
-- 앱 코드: src/lib/reservationsDb.ts, src/lib/reservationsPostgres.ts
-- =============================================================================

CREATE TABLE IF NOT EXISTS tour_reservations (
  id text PRIMARY KEY,           -- KWM-{timestamp}-{random} 형식 (앱에서 생성)
  center_id text NOT NULL,
  center_name text NOT NULL,
  visit_date date NOT NULL,
  visit_time text NOT NULL,      -- TOUR_SLOTS 키 (예: 10:00) — text로 저장해 슬롯 집계
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

-- 슬롯별 잔여 인원 집계 (center_id + visit_date + visit_time)
CREATE INDEX IF NOT EXISTS tour_reservations_slot_idx
  ON tour_reservations (center_id, visit_date, visit_time);

-- 관리자 목록 최신순
CREATE INDEX IF NOT EXISTS tour_reservations_created_idx
  ON tour_reservations (created_at DESC);

-- RLS: PostgREST(anon) 직접 접근 차단. Next.js 서버는 postgres 역할로 RLS 우회.
-- Table Editor에 "RLS is disabled"가 뜨면 아래 한 줄 실행.
ALTER TABLE tour_reservations ENABLE ROW LEVEL SECURITY;
