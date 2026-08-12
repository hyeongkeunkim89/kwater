-- 평화의댐 층별 주요시설 SQL 데이터
-- Supabase SQL Editor에서 실행하시면 평화의댐 데이터가 즉시 주입됩니다.

-- 1. 기존 평화의댐 데이터 삭제 (중복 생성 방지)
DELETE FROM center_floors WHERE center_id = 'peace-dam';

-- 2. 다목적 전시실 데이터 주입
INSERT INTO center_floors (center_id, floor_key, floor_name, floor_map_url, description, rooms, amenities, sort_order)
VALUES (
  'peace-dam', 
  '전시실', 
  '다목적 전시실', 
  '/peace-dam-exhibit.jpg', -- 다목적 전시실 하이라이트 도면
  '평화의댐의 건설 역사와 안보/평화 메시지, 물의 소중함을 주제로 한 다목적 전시 공간입니다.', 
  '[{"name": "역사전시구역", "link": null}, {"name": "안보체험존", "link": null}, {"name": "평화의 메시지관", "link": null}]'::jsonb, 
  '[]'::jsonb, 
  1
);

-- 3. 기타공간 데이터 주입
INSERT INTO center_floors (center_id, floor_key, floor_name, floor_map_url, description, rooms, amenities, sort_order)
VALUES (
  'peace-dam', 
  '기타공간', 
  '기타공간', 
  '/peace-dam-others.jpg', -- 기타공간 하이라이트 도면
  '안내데스크, 로비 및 방문객 편의를 위한 위생시설이 마련되어 있는 기타 공간입니다.', 
  '[{"name": "로비 및 안내데스크", "link": null}, {"name": "휴게 라운지", "link": null}]'::jsonb, 
  '[{"label": "화장실", "icon": "toilet"}]'::jsonb, 
  2
);
