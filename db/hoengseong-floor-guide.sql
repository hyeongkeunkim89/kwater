-- 횡성다목적댐 층별 주요시설 SQL 데이터 (1층 / 2층 업로드 이미지 매핑 반영)
-- Supabase SQL Editor에서 실행하시면 횡성댐 데이터가 즉시 주입됩니다.

-- 1. 기존 횡성댐 데이터 삭제 (중복 생성 방지)
DELETE FROM center_floors WHERE center_id = 'hoengseong';

-- 2. 1층 데이터 주입
INSERT INTO center_floors (center_id, floor_key, floor_name, floor_map_url, description, rooms, amenities, sort_order)
VALUES (
  'hoengseong', 
  '1층', 
  '1층 (주제관 & 체험관 & 편의시설)', 
  '/hoengseong-1f.PNG', 
  '물의 소중함과 순환 과정을 다룬 주제관, 어린이 체험관, 안내데스크 및 휴게실이 위치한 1층입니다.', 
  '[{"name": "주제관", "link": null}, {"name": "체험관", "link": null}, {"name": "안내데스크", "link": null}, {"name": "휴게실", "link": null}]'::jsonb, 
  '[{"label": "화장실", "icon": "toilet"}, {"label": "엘리베이터", "icon": "elevator"}, {"label": "수유실", "icon": "baby"}]'::jsonb, 
  1
);

-- 3. 2층 데이터 주입
INSERT INTO center_floors (center_id, floor_key, floor_name, floor_map_url, description, rooms, amenities, sort_order)
VALUES (
  'hoengseong', 
  '2층', 
  '2층 (영상실 & 계획전시)', 
  '/hoengseong-2f.PNG', 
  '홍보 영상물 상영이 이루어지는 영상실과 다양한 기획전시가 펼쳐지는 2층 공간입니다.', 
  '[{"name": "영상실", "link": null}, {"name": "계획전시", "link": null}]'::jsonb, 
  '[{"label": "화장실", "icon": "toilet"}, {"label": "엘리베이터", "icon": "elevator"}]'::jsonb, 
  2
);
