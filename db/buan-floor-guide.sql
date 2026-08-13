-- 부안다목적댐 층별 주요시설 SQL 데이터 (1층 / 2층 2개 층 구성)
-- Supabase SQL Editor에서 실행하시면 부안댐 데이터가 즉시 주입됩니다.

-- 1. 기존 부안댐 데이터 삭제 (중복 생성 방지)
DELETE FROM center_floors WHERE center_id = 'buan';

-- 2. 1층 데이터 주입
INSERT INTO center_floors (center_id, floor_key, floor_name, floor_map_url, description, rooms, amenities, sort_order)
VALUES (
  'buan', 
  '1층', 
  '1층 (로비 & 제1전시실)', 
  '/buan-1f.PNG', 
  '국립공원 인접 부안댐의 생태와 물 이야기를 다루는 로비 및 제1전시실(물과 생명)이 위치한 1층입니다.', 
  '[{"name": "로비", "link": null}, {"name": "제1전시실", "link": null}, {"name": "기획전시실", "link": null}]'::jsonb, 
  '[{"label": "화장실", "icon": "toilet"}, {"label": "엘리베이터", "icon": "elevator"}, {"label": "수유실", "icon": "baby"}]'::jsonb, 
  1
);

-- 3. 2층 데이터 주입
INSERT INTO center_floors (center_id, floor_key, floor_name, floor_map_url, description, rooms, amenities, sort_order)
VALUES (
  'buan', 
  '2층', 
  '2층 (제2전시실 & 전망대)', 
  '/buan-2f.PNG', 
  '부안댐의 역할과 수몰 역사를 소개하는 제2전시실 및 수려한 수변 경관을 조망하는 전망 공간이 조성된 2층입니다.', 
  '[{"name": "제2전시실", "link": null}, {"name": "전망대", "link": null}]'::jsonb, 
  '[{"label": "화장실", "icon": "toilet"}, {"label": "엘리베이터", "icon": "elevator"}]'::jsonb, 
  2
);
