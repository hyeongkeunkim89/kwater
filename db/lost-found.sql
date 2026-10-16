-- =============================================================================
-- K-water 온라인 물문화관: 분실·습득물 센터 (lost_found) 테이블 및 시드 데이터
-- Supabase 대시보드 -> SQL Editor에 붙여넣고 Run 버튼을 누르세요.
-- =============================================================================

CREATE TABLE IF NOT EXISTS public.lost_found (
  id text PRIMARY KEY,
  type text NOT NULL CHECK (type IN ('분실', '습득')),
  center_id text NOT NULL,
  center_name text NOT NULL,
  title text NOT NULL,
  item_name text NOT NULL,
  date text NOT NULL,
  place text NOT NULL,
  content text NOT NULL,
  writer_name text NOT NULL,
  contact text,
  password text,
  status text NOT NULL DEFAULT '접수' CHECK (status IN ('접수', '보관중', '수령완료')),
  created_at timestamptz NOT NULL DEFAULT now()
);

-- 인덱스
CREATE INDEX IF NOT EXISTS lost_found_created_idx ON public.lost_found (created_at DESC);
CREATE INDEX IF NOT EXISTS lost_found_center_idx ON public.lost_found (center_id);

-- RLS 정책 설정
ALTER TABLE public.lost_found ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public Read LostFound" ON public.lost_found;
CREATE POLICY "Public Read LostFound" ON public.lost_found FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public Insert LostFound" ON public.lost_found;
CREATE POLICY "Public Insert LostFound" ON public.lost_found FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Public Update LostFound" ON public.lost_found;
CREATE POLICY "Public Update LostFound" ON public.lost_found FOR UPDATE USING (true);

DROP POLICY IF EXISTS "Public Delete LostFound" ON public.lost_found;
CREATE POLICY "Public Delete LostFound" ON public.lost_found FOR DELETE USING (true);

-- 초기 대표 샘플 데이터 6건 등록
INSERT INTO public.lost_found (id, type, center_id, center_name, title, item_name, date, place, content, writer_name, contact, status, created_at)
VALUES
  ('lf-1', '분실', 'the-arc', '디아크 문화관', '디아크 2층 카페테리아 부근 무선 이어폰 케이스 분실', '화이트 무선 이어폰 케이스', '2026-10-12', '2층 카페테리아 창가 좌석', '10월 12일 오후 3시경 2층 카페테리아 창가 쪽에 머무르다 분실한 것 같습니다. 혹시 습득하신 분이나 보관 중이시면 연락 부탁드립니다.', '정*길', '010-****-1234', '접수', '2026-10-12T15:30:00.000Z'),
  ('lf-2', '습득', 'han-river', '한강물문화관', '한강물문화관 야외 광장 벤치 검정색 백팩 보관 안내', '검정색 나일론 백팩', '2026-10-10', '야외 수변 광장 시계탑 앞 벤치', '10월 10일 오후 야외 광장 벤치에서 습득되어 현재 1층 안내데스크에서 보관 중입니다. 소유자분께서는 신분증을 지참하시어 안내데스크로 방문해 주시기 바랍니다.', '안내데스크', '031-880-6200', '보관중', '2026-10-10T17:10:00.000Z'),
  ('lf-3', '분실', 'geum-river', '금강문화관', '금강문화관 자전거 종주인증센터 수첩 분실 (찾습니다)', '국토종주 자전거 인증수첩', '2026-09-28', '자전거 인증센터 부스 앞 거치대', '인증 도장을 찍고 거치대에 잠시 올려두었다가 두고 온 것 같습니다. 이름이 적혀 있습니다. 소중한 기록이라 꼭 찾고 싶습니다.', '김*석', '010-****-5678', '접수', '2026-09-28T11:20:00.000Z'),
  ('lf-4', '습득', 'nakdong-river', '낙동강문화관', '낙동강문화관 1층 어린이 체험실 캐릭터 파우치 습득', '노란색 캐릭터 파우치 (필기도구 포함)', '2026-09-15', '어린이 물체험존 쉼터', '어린이 단체 관람 후 쉼터 의자에 남아 있어 안내데스크에서 보관하고 있습니다. 분실하신 보호자께서는 안내데스크로 문의 바랍니다.', '안내데스크', '051-201-0884', '보관중', '2026-09-15T14:45:00.000Z'),
  ('lf-5', '습득', 'yeongsan-river', '영산강문화관', '영산강문화관 야외 쉼터 차량 스마트키 습득 (주인 수령완료)', '현대자동차 스마트키', '2026-08-30', '야외 그늘 쉼터', '야외 쉼터에서 습득되었던 차량 스마트키는 본인 확인 후 소유자분께 안전하게 인계 완료되었습니다.', '안내데스크', '061-335-0866', '수령완료', '2026-08-30T10:00:00.000Z'),
  ('lf-6', '분실', 'the-arc', '디아크 문화관', '디아크 수변데크 주변 검정색 선글라스 분실', '검정 뿔테 선글라스 (갈색 케이스)', '2026-08-18', '강변 수변 산책로 데크', '일몰 관람 후 산책로를 걷다가 케이스 채로 떨어뜨린 것으로 추정됩니다. 습득하신 분은 안내데스크에 맡겨주시면 감사하겠습니다.', '이*연', NULL, '접수', '2026-08-18T19:20:00.000Z')
ON CONFLICT (id) DO NOTHING;
