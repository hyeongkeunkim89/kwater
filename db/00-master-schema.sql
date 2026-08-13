-- =============================================================================
-- K-water 물문화관 통합 포털 MASTER SQL 스키마
-- Supabase 대시보드 -> SQL Editor에 전체 복사-붙여넣기 후 Run 클릭!
-- =============================================================================

-- 1. 사용자 회원/비회원 테이블 (users)
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(100) NOT NULL,
  phone VARCHAR(50),
  provider VARCHAR(20) NOT NULL DEFAULT 'email',
  role VARCHAR(20) NOT NULL DEFAULT 'user',
  favorite_center VARCHAR(50),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public Read Users" ON public.users;
DROP POLICY IF EXISTS "Public Insert Users" ON public.users;
DROP POLICY IF EXISTS "Public Update Users" ON public.users;
CREATE POLICY "Public Read Users" ON public.users FOR SELECT USING (true);
CREATE POLICY "Public Insert Users" ON public.users FOR INSERT WITH CHECK (true);
CREATE POLICY "Public Update Users" ON public.users FOR UPDATE USING (true);


-- 2. 가이드 투어 예약 테이블 (tour_reservations)
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
  created_at timestamptz NOT NULL DEFAULT now(),
  user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  guest_pin VARCHAR(10)
);

CREATE INDEX IF NOT EXISTS tour_reservations_slot_idx ON public.tour_reservations (center_id, visit_date, visit_time);
CREATE INDEX IF NOT EXISTS tour_reservations_created_idx ON public.tour_reservations (created_at DESC);
ALTER TABLE public.tour_reservations ENABLE ROW LEVEL SECURITY;


-- 3. 소통과 의견 게시판 (feedbacks)
CREATE TABLE IF NOT EXISTS public.feedbacks (
  id text PRIMARY KEY,
  center_id text NOT NULL,
  author_name text NOT NULL,
  contact text NOT NULL DEFAULT '',
  title text NOT NULL,
  content text NOT NULL,
  password_hash text NOT NULL DEFAULT '',
  is_private boolean NOT NULL DEFAULT false,
  answer text,
  answered_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS feedbacks_center_created_idx ON public.feedbacks (center_id, created_at DESC);
ALTER TABLE public.feedbacks ENABLE ROW LEVEL SECURITY;


-- 4. 체험 이벤트 (events)
CREATE TABLE IF NOT EXISTS public.events (
  id text PRIMARY KEY,
  title text NOT NULL,
  center_id text NOT NULL,
  category text NOT NULL DEFAULT '체험',
  status text NOT NULL DEFAULT '접수중',
  event_date text NOT NULL DEFAULT '',
  target text NOT NULL DEFAULT '',
  summary text NOT NULL DEFAULT '',
  content text NOT NULL DEFAULT '',
  image_url text NOT NULL DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;


-- 5. 공지 및 소식 (news)
CREATE TABLE IF NOT EXISTS public.news (
  id text PRIMARY KEY,
  title text NOT NULL,
  center_id text NOT NULL,
  category text NOT NULL DEFAULT '공지',
  important boolean NOT NULL DEFAULT false,
  summary text NOT NULL DEFAULT '',
  content text NOT NULL DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.news ENABLE ROW LEVEL SECURITY;


-- 6. 물 이야기 (water_stories)
CREATE TABLE IF NOT EXISTS public.water_stories (
  id text PRIMARY KEY,
  center_id text NOT NULL,
  title text NOT NULL,
  summary text NOT NULL,
  body text NOT NULL,
  photo_url text,
  author text NOT NULL,
  is_photo_of_month boolean NOT NULL DEFAULT false,
  month_tag text,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.water_stories ENABLE ROW LEVEL SECURITY;


-- 7. Storage Public 버킷 생성 (water-stories, center-floor-photos)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES 
  ('water-stories', 'water-stories', true, 12582912, ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']),
  ('center-floor-photos', 'center-floor-photos', true, 20971520, ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif'])
ON CONFLICT (id) DO UPDATE SET public = true;

-- Storage RLS Read 정책
DROP POLICY IF EXISTS "Public Read water-stories" ON storage.objects;
CREATE POLICY "Public Read water-stories" ON storage.objects FOR SELECT USING (bucket_id = 'water-stories');

DROP POLICY IF EXISTS "Public Read center-floor-photos" ON storage.objects;
CREATE POLICY "Public Read center-floor-photos" ON storage.objects FOR SELECT USING (bucket_id = 'center-floor-photos');
