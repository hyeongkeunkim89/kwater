-- 충주다목적댐 층별 주요시설 SQL 데이터 (1층 / 2층 업로드 이미지 매핑 반영)
-- Supabase SQL Editor에서 실행하시면 충주댐 데이터가 즉시 주입됩니다.

-- 1. 기존 충주댐 데이터 삭제 (중복 생성 방지)
DELETE FROM center_floors WHERE center_id = 'chungju';

-- 2. 1층 데이터 주입
INSERT INTO center_floors (center_id, floor_key, floor_name, floor_map_url, description, rooms, amenities, sort_order)
VALUES (
  'chungju', 
  '1층', 
  '1층 (다목적전시실 & 휴게공간)', 
  '/chungju-1f.PNG', 
  '충주댐의 역사를 만나는 다목적전시실과 편안한 휴게공간이 마련되어 있는 1층입니다.', 
  '[{"name": "다목적전시실", "link": null}, {"name": "휴게공간", "link": null}]'::jsonb, 
  '[{"label": "화장실", "icon": "toilet"}, {"label": "엘리베이터", "icon": "elevator"}, {"label": "수유실", "icon": "baby"}]'::jsonb, 
  1
);

-- 3. 2층 데이터 주입
INSERT INTO center_floors (center_id, floor_key, floor_name, floor_map_url, description, rooms, amenities, sort_order)
VALUES (
  'chungju', 
  '2층', 
  '2층 (물전시관 & 기획전시 & 편의시설)', 
  '/chungju-2f.PNG', 
  '물전시관, 로비 기획전시, 동요동시 체험공간 및 매점과 안내데스크가 조성된 2층 공간입니다.', 
  '[{"name": "물전시관", "link": null}, {"name": "로비 기획전시", "link": null}, {"name": "로비 동요동시 체험", "link": null}, {"name": "안내데스크", "link": null}, {"name": "매점", "link": null}]'::jsonb, 
  '[{"label": "화장실", "icon": "toilet"}, {"label": "엘리베이터", "icon": "elevator"}]'::jsonb, 
  2
);
