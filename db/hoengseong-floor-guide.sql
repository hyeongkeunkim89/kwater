-- 횡성다목적댐 층별 주요시설 SQL 데이터 (1층 / 2층 2개 층 구성)
-- Supabase SQL Editor에서 실행하시면 횡성댐 데이터가 즉시 주입됩니다.

-- 1. 기존 횡성댐 데이터 삭제 (중복 생성 방지)
DELETE FROM center_floors WHERE center_id = 'hoengseong';

-- 2. 1층 데이터 주입
INSERT INTO center_floors (center_id, floor_key, floor_name, floor_map_url, description, rooms, amenities, sort_order)
VALUES (
  'hoengseong', 
  '1층', 
  '1층 (주제관 & 영상상영관)', 
  '/hoengseong-1f.PNG', 
  '물의 소중함과 순환 과정, 댐의 역할을 주제관과 영상상영관을 통해 소개하는 1층 공간입니다.', 
  '[{"name": "주제관", "link": null}, {"name": "물 순환 전시실", "link": null}, {"name": "영상상영관", "link": null}]'::jsonb, 
  '[{"label": "화장실", "icon": "toilet"}, {"label": "엘리베이터", "icon": "elevator"}, {"label": "수유실", "icon": "baby"}]'::jsonb, 
  1
);

-- 3. 2층 데이터 주입
INSERT INTO center_floors (center_id, floor_key, floor_name, floor_map_url, description, rooms, amenities, sort_order)
VALUES (
  'hoengseong', 
  '2층', 
  '2층 (체험관 & 화성의 옛터)', 
  '/hoengseong-2f.PNG', 
  '어린이와 가족을 위한 체험관과 횡성댐 수몰 지역의 역사를 간직한 화성의 옛터 전시관이 위치한 2층 공간입니다.', 
  '[{"name": "체험관", "link": null}, {"name": "화성의 옛터 전시관", "link": null}, {"name": "휴게공간", "link": null}]'::jsonb, 
  '[{"label": "화장실", "icon": "toilet"}, {"label": "엘리베이터", "icon": "elevator"}]'::jsonb, 
  2
);
