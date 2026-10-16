-- =============================================================================
-- K-water 온라인 물문화관 MASTER SQL 스키마 (통합 최신판)
-- Supabase 대시보드 -> SQL Editor에 전체 복사-붙여넣기 후 [Run] 클릭!
-- =============================================================================

-- 1. 사용자 회원 테이블 (users)
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
  user_email text,
  user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  guest_pin text,
  status text NOT NULL DEFAULT '대기' CHECK (status IN ('대기', '확정', '취소')),
  created_at timestamptz NOT NULL DEFAULT now()
);

-- 기존 테이블이 있을 경우 필수 컬럼 안전 추가
ALTER TABLE public.tour_reservations ADD COLUMN IF NOT EXISTS user_email text;
ALTER TABLE public.tour_reservations ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES public.users(id) ON DELETE SET NULL;
ALTER TABLE public.tour_reservations ADD COLUMN IF NOT EXISTS guest_pin text;

CREATE INDEX IF NOT EXISTS tour_reservations_guest_lookup_idx ON public.tour_reservations (phone, guest_pin);
CREATE INDEX IF NOT EXISTS tour_reservations_user_email_idx ON public.tour_reservations (user_email);
CREATE INDEX IF NOT EXISTS tour_reservations_slot_idx ON public.tour_reservations (center_id, visit_date, visit_time);
CREATE INDEX IF NOT EXISTS tour_reservations_created_idx ON public.tour_reservations (created_at DESC);
ALTER TABLE public.tour_reservations ENABLE ROW LEVEL SECURITY;


-- 3. 소통과 의견 게시판 (feedbacks)
CREATE TABLE IF NOT EXISTS public.feedbacks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  center_id text NOT NULL,
  center_name text NOT NULL DEFAULT '',
  title text NOT NULL,
  content text NOT NULL,
  writer_type text NOT NULL DEFAULT '익명',
  writer_name text NOT NULL DEFAULT '익명',
  password text NOT NULL DEFAULT '',
  is_private boolean NOT NULL DEFAULT false,
  admin_reply text,
  admin_replied_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- 기존 테이블이 있을 경우 필수 컬럼 안전 추가
ALTER TABLE public.feedbacks ADD COLUMN IF NOT EXISTS center_name text NOT NULL DEFAULT '';
ALTER TABLE public.feedbacks ADD COLUMN IF NOT EXISTS writer_type text NOT NULL DEFAULT '익명';
ALTER TABLE public.feedbacks ADD COLUMN IF NOT EXISTS writer_name text NOT NULL DEFAULT '익명';
ALTER TABLE public.feedbacks ADD COLUMN IF NOT EXISTS password text NOT NULL DEFAULT '';
ALTER TABLE public.feedbacks ADD COLUMN IF NOT EXISTS is_private boolean NOT NULL DEFAULT false;
ALTER TABLE public.feedbacks ADD COLUMN IF NOT EXISTS admin_reply text;
ALTER TABLE public.feedbacks ADD COLUMN IF NOT EXISTS admin_replied_at timestamptz;

CREATE INDEX IF NOT EXISTS feedbacks_created_idx ON public.feedbacks (created_at DESC);
CREATE INDEX IF NOT EXISTS feedbacks_center_idx ON public.feedbacks (center_id);
ALTER TABLE public.feedbacks ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public Read Feedbacks" ON public.feedbacks;
CREATE POLICY "Public Read Feedbacks" ON public.feedbacks FOR SELECT USING (true);
DROP POLICY IF EXISTS "Public Insert Feedbacks" ON public.feedbacks;
CREATE POLICY "Public Insert Feedbacks" ON public.feedbacks FOR INSERT WITH CHECK (true);
DROP POLICY IF EXISTS "Public Update Feedbacks" ON public.feedbacks;
CREATE POLICY "Public Update Feedbacks" ON public.feedbacks FOR UPDATE USING (true);


-- 4. 문화·체험 행사 (events)
CREATE TABLE IF NOT EXISTS public.events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  center_id text NOT NULL,
  center_name text NOT NULL DEFAULT '',
  title text NOT NULL,
  content text NOT NULL,
  start_date date,
  end_date date,
  is_headquarters boolean NOT NULL DEFAULT false,
  image_url text,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- 기존 테이블이 있을 경우 필수 컬럼 안전 추가
ALTER TABLE public.events ADD COLUMN IF NOT EXISTS center_name text NOT NULL DEFAULT '';
ALTER TABLE public.events ADD COLUMN IF NOT EXISTS start_date date;
ALTER TABLE public.events ADD COLUMN IF NOT EXISTS end_date date;
ALTER TABLE public.events ADD COLUMN IF NOT EXISTS is_headquarters boolean NOT NULL DEFAULT false;
ALTER TABLE public.events ADD COLUMN IF NOT EXISTS image_url text;

CREATE INDEX IF NOT EXISTS events_created_idx ON public.events (created_at DESC);
CREATE INDEX IF NOT EXISTS events_center_idx ON public.events (center_id);
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public Read Events" ON public.events;
CREATE POLICY "Public Read Events" ON public.events FOR SELECT USING (true);


-- 5. 공지 및 새소식 (news)
CREATE TABLE IF NOT EXISTS public.news (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  center_id text NOT NULL,
  center_name text NOT NULL DEFAULT '',
  title text NOT NULL,
  content text NOT NULL,
  views integer NOT NULL DEFAULT 0,
  is_pinned boolean NOT NULL DEFAULT false,
  image_url text,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- 기존 테이블이 있을 경우 필수 컬럼 안전 추가
ALTER TABLE public.news ADD COLUMN IF NOT EXISTS center_name text NOT NULL DEFAULT '';
ALTER TABLE public.news ADD COLUMN IF NOT EXISTS views integer NOT NULL DEFAULT 0;
ALTER TABLE public.news ADD COLUMN IF NOT EXISTS is_pinned boolean NOT NULL DEFAULT false;
ALTER TABLE public.news ADD COLUMN IF NOT EXISTS image_url text;

CREATE INDEX IF NOT EXISTS news_created_idx ON public.news (created_at DESC);
CREATE INDEX IF NOT EXISTS news_center_idx ON public.news (center_id);
ALTER TABLE public.news ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public Read News" ON public.news;
CREATE POLICY "Public Read News" ON public.news FOR SELECT USING (true);


-- 6. 물 이야기 사진·한줄 게시글 (water_stories)
CREATE TABLE IF NOT EXISTS public.water_stories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  center_id text NOT NULL,
  center_name text NOT NULL DEFAULT '',
  image_url text NOT NULL DEFAULT '',
  nickname text NOT NULL DEFAULT '',
  caption text NOT NULL DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now(),
  is_photo_of_month boolean NOT NULL DEFAULT false
);

-- 기존 테이블이 있을 경우 필수 컬럼 안전 추가
ALTER TABLE public.water_stories ADD COLUMN IF NOT EXISTS center_name text NOT NULL DEFAULT '';
ALTER TABLE public.water_stories ADD COLUMN IF NOT EXISTS image_url text NOT NULL DEFAULT '';
ALTER TABLE public.water_stories ADD COLUMN IF NOT EXISTS nickname text NOT NULL DEFAULT '';
ALTER TABLE public.water_stories ADD COLUMN IF NOT EXISTS caption text NOT NULL DEFAULT '';
ALTER TABLE public.water_stories ADD COLUMN IF NOT EXISTS is_photo_of_month boolean NOT NULL DEFAULT false;

CREATE INDEX IF NOT EXISTS water_stories_created_idx ON public.water_stories (created_at DESC);
CREATE INDEX IF NOT EXISTS water_stories_center_idx ON public.water_stories (center_id);
ALTER TABLE public.water_stories ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public Read WaterStories" ON public.water_stories;
CREATE POLICY "Public Read WaterStories" ON public.water_stories FOR SELECT USING (true);


-- 7. 분실·습득물 센터 (lost_found)
CREATE TABLE IF NOT EXISTS public.lost_found (
  id text PRIMARY KEY,
  type text NOT NULL CHECK (type IN ('분실', '습득')),
  center_id text NOT NULL,
  center_name text NOT NULL,
  title text NOT NULL,
  item_name text NOT NULL,
  date text NOT NULL,
  place text NOT NULL,
  content text NOT NULL,
  writer_name text NOT NULL,
  contact text,
  password text,
  status text NOT NULL DEFAULT '접수' CHECK (status IN ('접수', '보관중', '수령완료')),
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS lost_found_created_idx ON public.lost_found (created_at DESC);
CREATE INDEX IF NOT EXISTS lost_found_center_idx ON public.lost_found (center_id);
ALTER TABLE public.lost_found ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public Read LostFound" ON public.lost_found;
CREATE POLICY "Public Read LostFound" ON public.lost_found FOR SELECT USING (true);
DROP POLICY IF EXISTS "Public Insert LostFound" ON public.lost_found;
CREATE POLICY "Public Insert LostFound" ON public.lost_found FOR INSERT WITH CHECK (true);
DROP POLICY IF EXISTS "Public Update LostFound" ON public.lost_found;
CREATE POLICY "Public Update LostFound" ON public.lost_found FOR UPDATE USING (true);
DROP POLICY IF EXISTS "Public Delete LostFound" ON public.lost_found;
CREATE POLICY "Public Delete LostFound" ON public.lost_found FOR DELETE USING (true);


-- 8. 층별 주요 시설 안내 (center_floors)
CREATE TABLE IF NOT EXISTS public.center_floors (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  center_id text NOT NULL,
  floor_key text NOT NULL,
  floor_name text NOT NULL,
  floor_map_url text,
  description text,
  rooms jsonb DEFAULT '[]'::jsonb,
  amenities jsonb DEFAULT '[]'::jsonb,
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS center_floors_center_idx ON public.center_floors (center_id, sort_order ASC);
ALTER TABLE public.center_floors ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public Read Center Floors" ON public.center_floors;
CREATE POLICY "Public Read Center Floors" ON public.center_floors FOR SELECT USING (true);
DROP POLICY IF EXISTS "Server Write Center Floors" ON public.center_floors;
CREATE POLICY "Server Write Center Floors" ON public.center_floors FOR ALL USING (true) WITH CHECK (true);


-- 9. 부대 및 편의시설 (center_facilities)
CREATE TABLE IF NOT EXISTS public.center_facilities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  center_id text NOT NULL,
  name text NOT NULL,
  image_url text,
  description text,
  location text,
  operating_hours text,
  area text,
  notes text,
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS center_facilities_center_idx ON public.center_facilities (center_id, sort_order ASC);
ALTER TABLE public.center_facilities ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public Read Center Facilities" ON public.center_facilities;
CREATE POLICY "Public Read Center Facilities" ON public.center_facilities FOR SELECT USING (true);
DROP POLICY IF EXISTS "Server Write Center Facilities" ON public.center_facilities;
CREATE POLICY "Server Write Center Facilities" ON public.center_facilities FOR ALL USING (true) WITH CHECK (true);


-- 10. 층별 시설 사진 메타데이터 (center_floor_photos)
CREATE TABLE IF NOT EXISTS public.center_floor_photos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  center_id text NOT NULL,
  floor_key text NOT NULL,
  storage_path text NOT NULL,
  image_url text NOT NULL,
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT center_floor_photos_storage_path_key UNIQUE (storage_path)
);

CREATE INDEX IF NOT EXISTS center_floor_photos_center_floor_idx 
  ON public.center_floor_photos (center_id, floor_key, sort_order ASC, created_at DESC);
ALTER TABLE public.center_floor_photos ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public Read Center Floor Photos" ON public.center_floor_photos;
CREATE POLICY "Public Read Center Floor Photos" ON public.center_floor_photos FOR SELECT USING (true);


-- 11. Storage 버킷 생성 및 RLS 정책
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES 
  ('water-stories', 'water-stories', true, 12582912, ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']),
  ('center-floor-photos', 'center-floor-photos', true, 20971520, ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif'])
ON CONFLICT (id) DO UPDATE SET public = true;

DROP POLICY IF EXISTS "Public Read water-stories" ON storage.objects;
CREATE POLICY "Public Read water-stories" ON storage.objects FOR SELECT USING (bucket_id = 'water-stories');

DROP POLICY IF EXISTS "Public Read center-floor-photos" ON storage.objects;
CREATE POLICY "Public Read center-floor-photos" ON storage.objects FOR SELECT USING (bucket_id = 'center-floor-photos');

DROP POLICY IF EXISTS "Public Upload water-stories" ON storage.objects;
CREATE POLICY "Public Upload water-stories" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'water-stories');

DROP POLICY IF EXISTS "Public Upload center-floor-photos" ON storage.objects;
CREATE POLICY "Public Upload center-floor-photos" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'center-floor-photos');
