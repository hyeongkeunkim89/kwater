-- 대청댐 리모델링 층별 주요시설 SQL 데이터
-- Supabase SQL Editor에서 실행하시면 대청댐 데이터가 즉시 주입됩니다.

-- 1. 기존 대청댐 데이터 삭제 (중복 생성 방지)
DELETE FROM center_floors WHERE center_id = 'daecheong';

-- 2. 문화공간동 (좌측동) 데이터 주입
INSERT INTO center_floors (center_id, floor_key, floor_name, floor_map_url, description, rooms, amenities, sort_order)
VALUES (
  'daecheong', 
  '문화공간', 
  '문화공간동 (좌측동)', 
  '/daecheong-map-guide.jpg', -- public 폴더에 추가한 맞춤형 그래픽 도면 적용
  '기획전시 및 아늑한 문화 체험, 편안한 휴게공간이 가득한 좌측 문화공간동입니다.', 
  '[{"name": "기획전시실", "link": null}, {"name": "전시홀 1", "link": null}, {"name": "수유실", "link": null}, {"name": "발코니", "link": null}, {"name": "휴게전망공간", "link": null}]'::jsonb, 
  '[{"label": "수유실", "icon": "baby"}]'::jsonb, 
  1
);

-- 3. 상설전시동 (우측동) 데이터 주입
INSERT INTO center_floors (center_id, floor_key, floor_name, floor_map_url, description, rooms, amenities, sort_order)
VALUES (
  'daecheong', 
  '상설전시', 
  '상설전시동 (우측동)', 
  '/daecheong-map-guide.jpg', -- 동일 도면 이미지 공유
  '대청댐의 다채로운 역사와 상설 소장품을 관람할 수 있는 우측 상설전시동입니다.', 
  '[{"name": "상설전시실 1", "link": null}, {"name": "전시홀 1", "link": null}, {"name": "데크", "link": null}]'::jsonb, 
  '[{"label": "화장실", "icon": "toilet"}, {"label": "엘리베이터", "icon": "elevator"}]'::jsonb, 
  2
);
