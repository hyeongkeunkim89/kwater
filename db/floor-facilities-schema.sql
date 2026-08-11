-- 1. 층별 안내 테이블 생성 (center_floors)
CREATE TABLE IF NOT EXISTS center_floors (
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

-- center_id와 floor_key 조회 최적화를 위한 인덱스 생성
CREATE INDEX IF NOT EXISTS center_floors_center_idx ON center_floors (center_id, sort_order ASC);


-- 2. 부대 및 편의시설 상세 테이블 생성 (center_facilities)
CREATE TABLE IF NOT EXISTS center_facilities (
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

-- center_id 조회 최적화를 위한 인덱스 생성
CREATE INDEX IF NOT EXISTS center_facilities_center_idx ON center_facilities (center_id, sort_order ASC);


-- 3. 예시 데이터 (선택 사항: 복사해서 수정 후 사용하세요)
-- INSERT INTO center_floors (center_id, floor_key, floor_name, description, rooms, amenities, sort_order)
-- VALUES (
--   'daecheong', 
--   '1F', 
--   '1층', 
--   '기획전시실과 다목적 강당이 있는 문화 소통의 공간입니다.',
--   '[{"name": "기획전시실", "link": "/centers/daecheong/exhibit-1"}, {"name": "강당", "link": null}]'::jsonb,
--   '[{"label": "화장실", "icon": "toilet"}, {"label": "엘리베이터", "icon": "elevator"}, {"label": "유아휴게실", "icon": "baby"}]'::jsonb,
--   1
-- );
