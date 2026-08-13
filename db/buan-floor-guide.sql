-- 부안다목적댐 층별 주요시설 SQL 데이터 (1층 / 2층 업로드 이미지 매핑 반영)
-- Supabase SQL Editor에서 실행하시면 부안댐 데이터가 즉시 주입됩니다.

-- 1. 기존 부안댐 데이터 삭제 (중복 생성 방지)
DELETE FROM center_floors WHERE center_id = 'buan';

-- 2. 1층 데이터 주입
INSERT INTO center_floors (center_id, floor_key, floor_name, floor_map_url, description, rooms, amenities, sort_order)
VALUES (
  'buan', 
  '1층', 
  '1층 (제1전시실 & 기획전시)', 
  '/buan-1f.PNG', 
  '국립공원 인접 부안댐의 생태와 물 이야기를 다루는 제1전시실 및 기획전시가 위치한 1층입니다.', 
  '[{"name": "제1전시실", "link": null}, {"name": "기획전시", "link": null}]'::jsonb, 
  '[{"label": "화장실", "icon": "toilet"}, {"label": "엘리베이터", "icon": "elevator"}, {"label": "수유실", "icon": "baby"}]'::jsonb, 
  1
);

-- 3. 2층 데이터 주입
INSERT INTO center_floors (center_id, floor_key, floor_name, floor_map_url, description, rooms, amenities, sort_order)
VALUES (
  'buan', 
  '2층', 
  '2층 (제2전시실 & 제3전시실 & 영상실)', 
  '/buan-2f.PNG', 
  '부안댐의 역할과 수몰 역사, 생활 물 문화를 다루는 제2·제3전시실과 영상실이 위치한 2층 공간입니다.', 
  '[{"name": "제2전시실", "link": null}, {"name": "제3전시실", "link": null}, {"name": "영상실", "link": null}]'::jsonb, 
  '[{"label": "화장실", "icon": "toilet"}, {"label": "엘리베이터", "icon": "elevator"}]'::jsonb, 
  2
);
