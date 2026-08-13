-- =======================================================
-- K-water 물문화관 사용자 & 회원가입/로그인 DB 스키마
-- Supabase SQL Editor에서 실행하세요.
-- =======================================================

-- 1. users 테이블 생성
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(100) NOT NULL,
  phone VARCHAR(50),
  provider VARCHAR(20) NOT NULL DEFAULT 'email', -- 'email', 'kakao', 'naver'
  role VARCHAR(20) NOT NULL DEFAULT 'user',      -- 'user', 'admin', 'guide'
  favorite_center VARCHAR(50),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- RLS (Row Level Security) 설정
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- 누구나 읽기/가입/수정 허용 (서버 키 접근 권한)
DROP POLICY IF EXISTS "Public Read Users" ON public.users;
DROP POLICY IF EXISTS "Public Insert Users" ON public.users;
DROP POLICY IF EXISTS "Public Update Users" ON public.users;

CREATE POLICY "Public Read Users" ON public.users FOR SELECT USING (true);
CREATE POLICY "Public Insert Users" ON public.users FOR INSERT WITH CHECK (true);
CREATE POLICY "Public Update Users" ON public.users FOR UPDATE USING (true);

-- 2. 가이드 투어 예약 테이블 (tour_reservations)에 user_id 및 비회원 guest_pin 추가
CREATE TABLE IF NOT EXISTS public.tour_reservations (
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
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.tour_reservations 
  ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS guest_pin VARCHAR(10);

ALTER TABLE public.tour_reservations ENABLE ROW LEVEL SECURITY;
