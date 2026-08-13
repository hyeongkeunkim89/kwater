-- 충주다목적댐 층별 주요시설 SQL 데이터 (1층 / 2층 2개 층 구성)
-- Supabase SQL Editor에서 실행하시면 충주댐 데이터가 즉시 주입됩니다.

-- 1. 기존 충주댐 데이터 삭제 (중복 생성 방지)
DELETE FROM center_floors WHERE center_id = 'chungju';

-- 2. 1층 데이터 주입
INSERT INTO center_floors (center_id, floor_key, floor_name, floor_map_url, description, rooms, amenities, sort_order)
VALUES (
  'chungju', 
  '1층', 
  '1층 (상설전시 & 입체영상관)', 
  '/chungju-1f.jpg', -- 💡 1층 도면 이미지를 public/chungju-1f.jpg 에 넣을 경우 연동
  '충주댐의 수계 관리 및 역사를 소개하는 상설전시실과 입체영상관이 위치한 1층 공간입니다.', 
  '[{"name": "상설전시실", "link": null}, {"name": "입체영상관", "link": null}, {"name": "안내데스크", "link": null}]'::jsonb, 
  '[{"label": "화장실", "icon": "toilet"}, {"label": "엘리베이터", "icon": "elevator"}, {"label": "수유실", "icon": "baby"}]'::jsonb, 
  1
);

-- 3. 2층 데이터 주입
INSERT INTO center_floors (center_id, floor_key, floor_name, floor_map_url, description, rooms, amenities, sort_order)
VALUES (
  'chungju', 
  '2층', 
  '2층 (체험존 & 전망 라운지)', 
  '/chungju-2f.jpg', -- 💡 2층 도면 이미지를 public/chungju-2f.jpg 에 넣을 경우 연동
  '체험형 전시존과 충주호의 수려한 경관을 한눈에 감상할 수 있는 전망대가 마련된 2층 공간입니다.', 
  '[{"name": "체험전시존", "link": null}, {"name": "전망 라운지", "link": null}, {"name": "휴게공간", "link": null}]'::jsonb, 
  '[{"label": "화장실", "icon": "toilet"}, {"label": "엘리베이터", "icon": "elevator"}]'::jsonb, 
  2
);
