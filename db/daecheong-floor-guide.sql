-- 대청댐 리모델링 층별 주요시설 SQL 데이터 (좌측동/우측동 도면 분리 적용)
-- Supabase SQL Editor에서 실행하시면 대청댐 데이터가 즉시 주입됩니다.

-- 1. 기존 대청댐 데이터 삭제 (중복 생성 방지)
DELETE FROM center_floors WHERE center_id = 'daecheong';

-- 2. 문화공간동 (좌측동) 데이터 주입 (좌측동 전용 도면 적용)
INSERT INTO center_floors (center_id, floor_key, floor_name, floor_map_url, description, rooms, amenities, sort_order)
VALUES (
  'daecheong', 
  '문화공간', 
  '문화공간동 (좌측동)', 
  '/daecheong-left-wing.jpg', -- 좌측동 전용 도면 적용
  '기획전시실과 넓고 쾌적한 전시홀, 수유실 및 편안한 발코니 휴게전망공간이 마련되어 있는 좌측 문화공간동입니다.', 
  '[{"name": "기획전시실", "link": null}, {"name": "전시홀 2", "link": null}, {"name": "수유실", "link": null}, {"name": "발코니", "link": null}, {"name": "휴게전망공간", "link": null}]'::jsonb, 
  '[{"label": "수유실", "icon": "baby"}]'::jsonb, 
  1
);

-- 3. 상설전시동 (우측동) 데이터 주입 (우측동 전용 도면 적용)
INSERT INTO center_floors (center_id, floor_key, floor_name, floor_map_url, description, rooms, amenities, sort_order)
VALUES (
  'daecheong', 
  '상설전시', 
  '상설전시동 (우측동)', 
  '/daecheong-right-wing.jpg', -- 우측동 전용 도면 적용
  '대청댐의 상설전시실 1호 및 넓은 전시홀, 야외 데크와 엘리베이터, 편리한 위생시설을 갖추고 있는 우측 상설전시동입니다.', 
  '[{"name": "상설전시실 1", "link": null}, {"name": "전시홀 1", "link": null}, {"name": "상상마루 (반원 전시관)", "link": null}, {"name": "데크", "link": null}]'::jsonb, 
  '[{"label": "화장실", "icon": "toilet"}, {"label": "엘리베이터", "icon": "elevator"}]'::jsonb, 
  2
);
