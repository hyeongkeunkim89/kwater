/**
 * 시설별 대표 이미지·층별 구성·시설현황 초안입니다.
 * 실제 전시 구성은 시설 리플렛·kwater 공지와 맞춰 교체하세요.
 * 이미지: 위키미디어 공용 등 출처 명확한 실경·수계 사진 권장.
 */

export type FacilityProfileItem = { label: string; value: string };

export type FloorPlan = { floorLabel: string; highlights: string[] };

export type CenterDetailFields = {
  imageSrc: string;
  imageAlt: string;
  /** 상세 「시설현황」테마 카드 위 소개. 문단은 문자열 안에서 빈 줄로 구분(3문단 전후 권장). 목록 카드에는 미사용 */
  profileIntro: string;
  /** 카드·상단 요약용 — 테마=전시 주제, 대상=주 관람 대상(추천 층) */
  facilityProfile: FacilityProfileItem[];
  floors: FloorPlan[];
};

export const centerDetailsById: Record<string, CenterDetailFields> = {
  sihwa: {
    imageSrc:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c2/Sihwatidal.jpg/960px-Sihwatidal.jpg",
    imageAlt: "달전망대에서 내려다본 시화호 조력발전소 전경",
    profileIntro:
      "시화호와 바다가 맞닿은 해안에서, 조석(밀물·썰물)을 이용한 조력발전의 원리와 우리나라 최초의 시화호 조력발전이 갖는 의미를 만날 수 있습니다.\n\n전시와 영상·체험 코너를 통해 바다·호수·에너지가 어떻게 이어지는지 입문부터 차근차근 풀어 줍니다.\n\n전망 동선과 어우러져 가족·학교·기관 단체 관람에도 알맞은 물·에너지 테마의 문화 공간입니다.",
    facilityProfile: [
      { label: "테마", value: "바다·조석이 빚는 물과 에너지" },
      { label: "대상", value: "가족·학교·기관 단체에 적합, 조력·에너지 입문~전망 연계" },
    ],
    floors: [
      {
        floorLabel: "1층",
        highlights: ["안내·로비", "조력 원리 입문 전시", "어린이 체험 코너"],
      },
      {
        floorLabel: "2층",
        highlights: ["심화 전시", "에너지·환경 스토리", "영상·디지털 해설"],
      },
      { floorLabel: "옥외·연계", highlights: ["전망 동선 안내", "사진 존(시설별)"] },
    ],
  },
  chungju: {
    imageSrc:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/Chungju_Dam.JPG/960px-Chungju_Dam.JPG",
    imageAlt: "충주다목적댐 전경",
    profileIntro:
      "충주다목적댐과 충주호를 중심으로, 홍수 조절·상수원·발전 등 한곳의 댐이 갖는 여러 기능을 전시와 모형으로 살펴볼 수 있습니다.\n\n디지털 전시와 안전·모니터링 스토리를 통해 댐과 수자원 관리가 우리 일상과 어떻게 닿는지 이해하기 쉽게 구성되어 있습니다.\n\n수학여행·가족 나들이 등 대형 댐과 수자원에 관심 있는 방문객에게 널리 알려진 대표 시설입니다.",
    facilityProfile: [
      { label: "테마", value: "충주호와 다목적댐의 살아 있는 역할" },
      { label: "대상", value: "가족·수학여행급 단체, 대형댐·수자원 이해를 원하는 층" },
    ],
    floors: [
      {
        floorLabel: "1층",
        highlights: ["안내·매표", "댐 기본 구조·역할 소개", "어린이 체험"],
      },
      {
        floorLabel: "2층",
        highlights: ["디지털 전시", "안전·모니터링 스토리", "지역 상생 사례"],
      },
      {
        floorLabel: "3층·전망",
        highlights: ["전망 공간(시설별)", "기획전·갤러리"],
      },
    ],
  },
  daecheong: {
    imageSrc:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/c/ca/Daecheong_Dam_Water_Culture_Center_-_%EB%8C%80%EC%B2%AD%EB%8C%90%EB%AC%BC%EB%AC%B8%ED%99%94%EA%B4%80.jpg/960px-Daecheong_Dam_Water_Culture_Center_-_%EB%8C%80%EC%B2%AD%EB%8C%90%EB%AC%BC%EB%AC%B8%ED%99%94%EA%B4%80.jpg",
    imageAlt: "대청댐 물문화관 건물 전경",
    profileIntro:
      "금강 수계와 대청호를 아우르는 전시로, 댐과 호수가 지역과 함께 쌓아 온 시간과 환경·생활의 변화를 따라갑니다.\n\n상수원 보호와 홍수 관리 등 물이 갖는 공공적 역할을 전시와 영상으로 되새길 수 있습니다.\n\n그린리모델링·전시 리뉴얼로 휴관 기간이 있을 수 있으니, 관람 전 시설 공지와 K-water 안내를 꼭 확인해 주세요.",
    facilityProfile: [
      { label: "테마", value: "금강·대청호, 삶과 환경을 잇는 물" },
      { label: "대상", value: "가족·학습 방문, 금강·호수 환경·생활 물에 관심 있는 층" },
    ],
    floors: [
      { floorLabel: "1층", highlights: ["로비", "제1전시(입문)", "안내 데스크"] },
      { floorLabel: "2층", highlights: ["제2전시", "호수·수계 심화 콘텐츠"] },
      { floorLabel: "3층", highlights: ["제3전시", "영상·요약 전시"] },
    ],
  },
  buan: {
    imageSrc:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f5/%EB%B6%80%EC%95%88%EB%8C%90_%EC%A7%95%EA%B2%80%EB%8B%A4%EB%A6%AC.jpg/960px-%EB%B6%80%EC%95%88%EB%8C%90_%EC%A7%95%EA%B2%80%EB%8B%A4%EB%A6%AC.jpg",
    imageAlt: "부안댐 일대(징검다리·저수지)",
    profileIntro:
      "국립공원과 맞닿은 수역을 품은 부안댐 일대의 생태·생활 물 이야기를 전시실과 영상으로 만납니다.\n\n댐 건설과 수몰, 지역과의 상생 등 강과 호수 곁에서 펼쳐진 역사와 오늘을 함께 다룹니다.\n\n야외 조망·사진 동선을 즐기려는 가족·성인 방문객에게 어울리는 생태·역사형 물문화관입니다.",
    facilityProfile: [
      { label: "테마", value: "국립공원과 맞닿은 댐·생태·수몰의 물" },
      { label: "대상", value: "생태·역사 좋아하는 성인·가족, 사진·야외 조망 동선" },
    ],
    floors: [
      { floorLabel: "지하 1층", highlights: ["영상실", "다목적 공간(시설별)"] },
      {
        floorLabel: "1층",
        highlights: ["로비", "제1전시(물·생명)", "기획 코너"],
      },
      { floorLabel: "2층", highlights: ["제2전시(댐·지역)", "전망 창측 해설"] },
      { floorLabel: "3층", highlights: ["제3전시(삶과 문화)", "정리·감상 공간"] },
    ],
  },
  soyang: {
    imageSrc:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ea/SoyangDam.JPG/960px-SoyangDam.JPG",
    imageAlt: "소양강댐 전경",
    profileIntro:
      "사력댐 소양강댐과 소양호의 역할, 특히 상수원 보호와 겨울철 호수의 모습을 전시와 체험으로 전합니다.\n\n기상·수위·결빙 등 계절과 연계된 콘텐츠로 북한강 수계 물의 흐름을 가깝게 느낄 수 있습니다.\n\n춘천·인근 관광과 묶어 찾는 등산·레저 동반 가족에게 안내하기 좋은 전시·전망 공간입니다.",
    facilityProfile: [
      { label: "테마", value: "사력댐 소양호, 상수원과 겨울 물의 얼굴" },
      { label: "대상", value: "등산·겨울레저 동반 가족, 상수원·호수 설명이 필요한 관광객" },
    ],
    floors: [
      { floorLabel: "1층", highlights: ["안내", "상설 전시", "호수·댐 해설"] },
      { floorLabel: "2층", highlights: ["체험·미디어", "기상·수위 이해 코너"] },
      { floorLabel: "옥상·전망", highlights: ["전망대(시설별)", "야외 사진 포인트"] },
    ],
  },
  hantan: {
    imageSrc:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3b/Hantan_River_nearby_Goseokjeong.jpg/960px-Hantan_River_nearby_Goseokjeong.jpg",
    imageAlt: "한탄강 고석정 인근 현무암 협곡과 강",
    profileIntro:
      "접경 지역 한탄강의 홍수 조절과 댐 안전, 재해 대비의 중요성을 전시·교육 형태로 전합니다.\n\n홍수 피해 예방과 수계 관리가 왜 필요한지 실감할 수 있는 코너를 갖추고 있습니다.\n\n학급 단체 안전교육이나 접경·홍수 이슈에 관심 있는 성인 방문에 맞춘 구성입니다.",
    facilityProfile: [
      { label: "테마", value: "홍수·안전과 접경강 한탄의 물 이야기" },
      { label: "대상", value: "학급·안전교육 단체, 접경·홍수 이슈에 관심 있는 성인" },
    ],
    floors: [
      { floorLabel: "1층", highlights: ["로비·안내", "홍수·댐 역할 입문"] },
      { floorLabel: "2층", highlights: ["심화 전시", "안전·대피 교육 콘텐츠"] },
      { floorLabel: "옥외", highlights: ["둘레·전망 동선(시설 공지 준수)"] },
    ],
  },
  hapcheon: {
    imageSrc:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3e/HapcheonDam.jpg/960px-HapcheonDam.jpg",
    imageAlt: "합천다목적댐 전경",
    profileIntro:
      "낙동강 수계의 핵심 호수인 합천호와 합천댐을 중심으로 농업용수·홍수 조절·발전 역할을 한자리에서 소개합니다.\n\n호수 형성과 지역 농업·생활과 연결된 스토리를 전시와 영상으로 풀어 냅니다.\n\n드라이브·가족 여행과 연계하기 좋은 낙동강 물길 해설 거점입니다.",
    facilityProfile: [
      { label: "테마", value: "합천호와 낙동강, 농업·홍수·발전의 물" },
      { label: "대상", value: "가족·드라이브족, 농업·홍수 입문 설명이 필요한 일반 관광객" },
    ],
    floors: [
      { floorLabel: "1층", highlights: ["안내", "호수 형성·역할 소개"] },
      { floorLabel: "2층", highlights: ["전시·영상", "지역 상생 스토리"] },
      { floorLabel: "전망·옥외", highlights: ["전망 공간(시설별)"] },
    ],
  },
  juam: {
    imageSrc:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/0/02/Korea_suncheon_riverside.JPG/960px-Korea_suncheon_riverside.JPG",
    imageAlt: "순천 시내 하천(주암댐·주암호가 있는 순천시)",
    profileIntro:
      "주암호와 섬진강 상류 보전, 도수터널·수력발전·용수 공급이 어떻게 맞물리는지 전시와 체험으로 이해할 수 있습니다.\n\n발전 원리와 터널 체험 등 참여형 콘텐츠로 어린이·가족이 함께 보기 좋게 꾸며져 있습니다.\n\n학교·가족 단체와 전망·체험을 한 번에 계획하는 방문객에게 알맞습니다.",
    facilityProfile: [
      { label: "테마", value: "도수터널·발전이 잇는 주암호의 물" },
      { label: "대상", value: "가족·학교 단체, 발전·터널 체험·전망에 관심 있는 층" },
    ],
    floors: [
      { floorLabel: "1층", highlights: ["안내", "주암호·댐 개요"] },
      { floorLabel: "2층", highlights: ["발전·용수 전시", "체험 코너"] },
      { floorLabel: "기획·옥외", highlights: ["기획전시실", "야외 전망대"] },
    ],
  },
  jangheung: {
    imageSrc:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/5/51/Korea-Jangheung-Jeungsanji-01.jpg/960px-Korea-Jangheung-Jeungsanji-01.jpg",
    imageAlt: "장흥 증산지 일대(담수호·수몰 테마와 맞닿은 풍경)",
    profileIntro:
      "담수호와 연계된 지역 역사·수몰 마을의 기억, 그리고 물·댐 과학 체험을 한 건물 안에서 이어 갑니다.\n\n역사문화실과 워터리움 등 층별로 감상과 체험의 균형을 맞춰 두었습니다.\n\n연령대가 넓은 가족과 지역 이야기에 관심 있는 방문객에게 추천할 만한 공간입니다.",
    facilityProfile: [
      { label: "테마", value: "담수호에 잠긴 마을의 시간과 기억" },
      { label: "대상", value: "연령 넓은 가족·지역 주민, 수몰·역사 스토리에 끌리는 방문객" },
    ],
    floors: [
      { floorLabel: "1층", highlights: ["역사문화실", "지역 수몰·추억 스토리"] },
      { floorLabel: "2층", highlights: ["워터리움", "물·댐 과학 체험"] },
    ],
  },
  yeongju: {
    imageSrc:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/c/cf/%EC%98%81%EC%A3%BC%EB%8C%90_%EB%92%B7%EB%A9%B4.jpg/960px-%EC%98%81%EC%A3%BC%EB%8C%90_%EB%92%B7%EB%A9%B4.jpg",
    imageAlt: "영주다목적댐 전경",
    profileIntro:
      "낙동강 상류 영주댐과 주변 생태숲·출렁다리 등 관광지와 짝을 이루는 댐·물 해설 시설입니다.\n\n상류 수계 보전과 댐 운영의 기본을 입문 단계에서 짚어 줍니다.\n\n등산·생태 여행 동선에 묶어 오기 좋은 소규모 전시·전망 거점입니다.",
    facilityProfile: [
      { label: "테마", value: "낙동 상류 댐과 숲·다리가 잇는 물길" },
      { label: "대상", value: "등산·생태 관광 동반 가족, 댐·호수 입문 설명이 필요한 층" },
    ],
    floors: [
      { floorLabel: "1층", highlights: ["로비", "영주댐·낙동강 상류 소개"] },
      { floorLabel: "2층", highlights: ["전시·전망 연계 공간"] },
    ],
  },
  seomjin: {
    imageSrc:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a4/%EC%84%AC%EC%A7%84%EA%B0%95%EB%8C%90.jpg/960px-%EC%84%AC%EC%A7%84%EA%B0%95%EB%8C%90.jpg",
    imageAlt: "섬진강댐 전면 전경",
    profileIntro:
      "섬진강 본류 댐으로서 취수·농업·홍수 관리가 한 수계 안에서 어떻게 조화를 이루는지 소개합니다.\n\n임실·전북권 농업과 생활 물 실태를 전시와 영상으로 연결합니다.\n\n가족·학교·시민단체의 수계 입문 교육에 활용하기 좋습니다.",
    facilityProfile: [
      { label: "테마", value: "섬진강 본류, 농업·취수를 품은 물" },
      { label: "대상", value: "가족·학교·시민단체, 취수·농업·홍수 수계 입문에 적합" },
    ],
    floors: [
      { floorLabel: "1층", highlights: ["안내", "섬진강·댐 입문"] },
      { floorLabel: "2층", highlights: ["전시·영상", "수계 보전 스토리"] },
    ],
  },
  imha: {
    imageSrc:
      "https://upload.wikimedia.org/wikipedia/commons/0/0e/Korea-Andong-Imha_Dam-01.jpg",
    imageAlt: "임하다목적댐 전경",
    profileIntro:
      "임하호는 광역 상수원으로서 낙동강 수계에서 차지하는 비중이 큰 호수입니다. 전시는 광역 상수원·생태·수몰·댐 운영을 아우릅니다.\n\n학습자와 성인 관람객이 수자원 정책을 이해하는 데 도움이 되는 자료를 갖추고 있습니다.\n\n안동·구미 등 인근 도시권과 연계한 방문에 적합합니다.",
    facilityProfile: [
      { label: "테마", value: "임하호, 광역 상수원과 낙동의 물" },
      { label: "대상", value: "성인·학습자, 광역상수원·댐 역할·생태·수몰 전시 관심층" },
    ],
    floors: [
      { floorLabel: "1층", highlights: ["로비", "임하호 개요"] },
      { floorLabel: "2층", highlights: ["복합 기능 전시", "영상·사진 자료"] },
    ],
  },
  gimcheon: {
    imageSrc:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e8/Nakdong_River_seen_from_Gumi_20260216.jpg/960px-Nakdong_River_seen_from_Gumi_20260216.jpg",
    imageAlt: "구미에서 본 낙동강(김천 부항댐·부항보가 있는 낙동 본류)",
    profileIntro:
      "낙동강 본류의 부항댐·부항보가 항·댐으로 어떻게 엮여 운영되는지, 농업용수와 하천 환경 복원과의 연결을 다룹니다.\n\n전망대·아쿠아·비상 체험 등 볼거리와 체험이 층별로 나뉘어 있습니다.\n\n가족·청소년 나들이객에게 인기 있는 종합형 물문화관입니다.",
    facilityProfile: [
      { label: "테마", value: "항·댐이 엮는 낙동 본류의 물" },
      { label: "대상", value: "가족·청소년, 전망·아쿠아·비상체험을 즐기려는 나들이객" },
    ],
    floors: [
      { floorLabel: "지하 1층", highlights: ["부대 공간(시설별)"] },
      { floorLabel: "1~3층", highlights: ["상설전시", "항·댐 운영 해설"] },
      { floorLabel: "4층·전망", highlights: ["전망대", "낙동강·부항 조망"] },
    ],
  },
  yongdam: {
    imageSrc:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/0/05/%EC%9A%A9%EB%8B%B4%ED%98%B8.jpg/960px-%EC%9A%A9%EB%8B%B4%ED%98%B8.jpg",
    imageAlt: "용담댐과 용담호 전경",
    profileIntro:
      "금강 상류 용담호·용담댐의 겨울 풍경과 물·눈·기상 이야기를 전시로 만납니다.\n\n산악·스키 등 겨울 레저와 연계한 물·눈 테마 해설이 돋보입니다.\n\n겨울철 금강 상류 여행 계획에 넣기 좋은 전시·전망 코스입니다.",
    facilityProfile: [
      { label: "테마", value: "금강 상류 산과 겨울, 물과 눈의 이야기" },
      { label: "대상", value: "겨울 스키·산악 동반 가족, 금강 상류 물·눈 테마에 관심 있는 층" },
    ],
    floors: [
      { floorLabel: "1층", highlights: ["안내", "용담호·댐 소개"] },
      { floorLabel: "2층", highlights: ["전시·체험", "겨울철 안전·기상"] },
    ],
  },
  "hangang-yeoju": {
    imageSrc:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8e/Namhan_River_in_front_of_Yeoju_Library.jpg/960px-Namhan_River_in_front_of_Yeoju_Library.jpg",
    imageAlt: "여주 도서관 앞 남한강 전경",
    profileIntro:
      "한강과 이포보·강천보 등 보·정비 사업, 수계 회복과 공존에 관한 정책을 전시·갤러리 형태로 소개합니다.\n\n수도권에서 당일 코스로 찾기 쉬운 위치에 전망타워와 기획전이 함께합니다.\n\n한강·수변 정책에 관심 있는 성인·가족에게 유익한 복합 문화관입니다.",
    facilityProfile: [
      { label: "테마", value: "한강과 보, 회복과 공존의 물 정책" },
      { label: "대상", value: "수도권 가족 나들이, 한강·4대강 정책·전망에 관심 있는 성인" },
    ],
    floors: [
      { floorLabel: "지하 1층", highlights: ["다목적·교육 공간(시설별)"] },
      { floorLabel: "1층", highlights: ["로비", "한강 역사·정책 입문 전시"] },
      { floorLabel: "2~3층", highlights: ["갤러리", "기획전·문화 프로그램"] },
      { floorLabel: "전망타워", highlights: ["강천보·한강 조망", "사진 포인트"] },
    ],
  },
  namgang: {
    imageSrc:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0d/Jinu_Jinyang_lake.jpg/960px-Jinu_Jinyang_lake.jpg",
    imageAlt: "남강댐이 만든 진양호 전경",
    profileIntro:
      "지리산에서 흘러온 남강 물이 모여 이룬 진양호와 남강댐 일대의 취수·농업 스토리를 전합니다.\n\n미디어·워터스크린 등 시각적 전시로 아이·청소년 동반 가족도 즐겁게 관람할 수 있습니다.\n\n진주·경남권 대표 댐 물문화관으로 꼭 한번 들러 보기 좋습니다.",
    facilityProfile: [
      { label: "테마", value: "지리산 발 물, 남강·진양호의 삶" },
      { label: "대상", value: "가족·청소년, 미디어·워터스크린과 지역 취수 스토리에 적합" },
    ],
    floors: [
      { floorLabel: "1층", highlights: ["안내", "남강·취수 스토리"] },
      { floorLabel: "2층", highlights: ["전시·영상", "워터스크린(시설별)"] },
    ],
  },
  miryang: {
    imageSrc:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0b/Miryang_riverwalk.jpg/960px-Miryang_riverwalk.jpg",
    imageAlt: "밀양강 강변 전경",
    profileIntro:
      "낙동강 본류 밀양강과 밀양댐, 하구둑·보와 연계한 광역 하천 관리를 한눈에 짚습니다.\n\n홍수와 보의 역할을 입문 수준에서 차분히 설명하는 전시 구성입니다.\n\n학습·가족 방문과 드라이브 코스에 넣기 좋습니다.",
    facilityProfile: [
      { label: "테마", value: "낙동 본류 밀양강, 보와 광역 하천의 물" },
      { label: "대상", value: "가족·학습 방문, 광역 하천·보·홍수 입문 설명이 필요한 층" },
    ],
    floors: [
      { floorLabel: "1층", highlights: ["로비", "밀양댐·호수 입문"] },
      { floorLabel: "2층", highlights: ["전시·영상", "광역 수계 해설"] },
    ],
  },
  hoengseong: {
    imageSrc:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/7/73/2020-05-30_10.41.15_%ED%9A%A1%EC%84%B1%EA%B5%B0_%EB%B0%B1%EC%9A%B4%EC%95%94.jpg/960px-2020-05-30_10.41.15_%ED%9A%A1%EC%84%B1%EA%B5%B0_%EB%B0%B1%EC%9A%B4%EC%95%94.jpg",
    imageAlt: "횡성군 백운암 일대(섬강 상류·횡성호 수계 인근)",
    profileIntro:
      "횡성호와 횡성댐을 중심으로 물의 소중함·순환·댐 역할을 주제관·체험관으로 나누어 안내합니다.\n\n정해진 시간대의 홍보 영상과 수몰 역사를 다룬 「화성의 옛터」 등 연계 시설이 강점입니다.\n\n어린이 동반 가족에게 특히 알맞은 체험 중심 물문화관입니다.",
    facilityProfile: [
      { label: "테마", value: "섬강 상류, 물의 소중함을 체감하는 전시" },
      { label: "대상", value: "어린이 동반 가족, 영상·체험·수몰역사 연계 동선에 적합" },
    ],
    floors: [
      {
        floorLabel: "주제관",
        highlights: [
          "물의 소중함·물 순환 전시",
          "댐의 역할 해설",
          "영상 상영(약 15분)",
        ],
      },
      {
        floorLabel: "체험관",
        highlights: ["물의 물리적 성질 체험", "어린이·가족 참여형 코너"],
      },
      {
        floorLabel: "옥외·연계",
        highlights: [
          "화성의 옛터(수몰 지역 문화·역사 보존관)",
          "횡성호수길 연계",
        ],
      },
    ],
  },
  "peace-dam": {
    imageSrc:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/8/84/Peace_Dam_2022.jpg/960px-Peace_Dam_2022.jpg",
    imageAlt: "평화의댐 하류 방향 전경",
    profileIntro:
      "1987년 이후 한반도 물 안보와 연결되어 온 평화의댐의 역사·배경을 전시로 만납니다.\n\n북한강 최상류 수계와 안보·역사 메시지를 함께 담았습니다.\n\nDMZ권·강원 북부 관광 동선과 맞물리는 성인·학급 방문에 적합합니다.",
    facilityProfile: [
      { label: "테마", value: "안보·역사, 북한강 최상류의 물과 기억" },
      { label: "대상", value: "학급·성인, 안보·역사·DMZ권 관광과 맞는 방문 동선" },
    ],
    floors: [
      {
        floorLabel: "1층",
        highlights: ["로비·안내", "평화의댐 역사 소개", "안보·통일 메시지"],
      },
      {
        floorLabel: "2층",
        highlights: ["북한강 상류 수계 전시", "물 안보 스토리", "영상 상영"],
      },
      {
        floorLabel: "옥외·연계",
        highlights: ["세계종공원", "비목공원 산책로", "댐 마루 전망 동선"],
      },
    ],
  },
  geumgang: {
    imageSrc:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7b/Buyeo_Bridge_on_Geum_River.jpg/960px-Buyeo_Bridge_on_Geum_River.jpg",
    imageAlt: "금강 부여 일원 전경 (금강문화관 인근)",
    profileIntro:
      "백제보와 금강을 전면에 내세운 금강문화관으로, 금강 수계와 백제 역사·문화를 한자리에서 경험합니다.\n\n전망타워와 '빛의 공간' 등 건축·예술 요소가 돋보이는 대형 보 문화관입니다.\n\n백제권 여행·부여 일대 관람객에게 추천할 만한 목적지입니다.",
    facilityProfile: [
      { label: "테마", value: "금강·백제, 빛과 문명이 만나는 물" },
      { label: "대상", value: "백제권 여행객·가족, 전망·예술(빛의 공간)을 즐기려는 성인" },
    ],
    floors: [
      { floorLabel: "1층", highlights: ["안내데스크", "기념품샵", "상설전시실(금강·4대강)"] },
      { floorLabel: "2층", highlights: ["기획전시실", "북카페·체험실", "학예실"] },
      { floorLabel: "3층·전망대", highlights: ["전망대(금강 파노라마)", "교육실·회의실"] },
    ],
  },
  yeongsangang: {
    imageSrc:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f7/Yeongsan_River_in_Gwangju.JPG/960px-Yeongsan_River_in_Gwangju.JPG",
    imageAlt: "광주에서 본 영산강(영산강문화관·승촌보가 있는 본류 수계)",
    profileIntro:
      "영산강과 승촌보를 잇는 영산강문화관으로, 남도의 생태·역사·문화를 열린 공간에서 전합니다.\n\n대지의 자연환경에 순응한 구성과 옥상 경사 산책로 등 걷기·조망을 함께 즐길 수 있습니다.\n\n부모 동반 가족이 생태·역사 나들이와 함께 찾기 좋습니다.",
    facilityProfile: [
      { label: "테마", value: "영산강과 남도, 생태·삶을 잇는 물길" },
      { label: "대상", value: "부모 동반 가족, 남도 생태·역사·산책을 함께 계획하는 층" },
    ],
    floors: [
      { floorLabel: "1층", highlights: ["안내데스크", "기념품샵", "상설전시실(영산강·생태)"] },
      { floorLabel: "2층", highlights: ["기획전시실", "북카페(체험실)", "학예실"] },
      { floorLabel: "3층·옥상", highlights: ["전망대", "교육실·회의실", "옥상 경사 산책로"] },
    ],
  },
  diarc: {
    imageSrc:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/5/54/The_ARK_20221126_001.jpg/960px-The_ARK_20221126_001.jpg",
    imageAlt: "대구 디아크(The ARK) — 낙동강·금호강 합수지점",
    profileIntro:
      "세계적 건축가의 작품으로도 알려진 디아크에서 낙동강·금호강 합수지점의 강 문화를 만납니다.\n\n4대강 강문화전시실·서클영상존·미디어월 등 미디어 전시가 풍부합니다.\n\n야경·건축·사진을 즐기려는 청년·성인 방문에 잘 어울립니다.",
    facilityProfile: [
      { label: "테마", value: "낙동·금호 합수, 두 강이 만나는 이야기" },
      { label: "대상", value: "건축·야경·미디어 좋아하는 청년~성인, 4대강 전시 관심층" },
    ],
    floors: [
      {
        floorLabel: "지하 1층",
        highlights: ["4대강 문화관", "강 문화 역사 전시"],
      },
      {
        floorLabel: "1~2층",
        highlights: ["서클영상존(생명의 순환)", "The River 갤러리", "미디어월"],
      },
      {
        floorLabel: "3층·전망대",
        highlights: ["낙동강·금호강 조망 전망대", "야경 감상 포인트"],
      },
    ],
  },
  "worldwater-forum": {
    imageSrc:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d7/Andong_dam.JPG/960px-Andong_dam.JPG",
    imageAlt: "안동댐(세계물포럼기념센터가 자리한 안동호·댐 좌안 일대)",
    profileIntro:
      "2015 대구·경북 세계물포럼을 기념해 안동댐 좌안에 조성된 복합 전시·교육·전망 시설입니다.\n\n워터볼·워터 바·수천지 등 국제 행사의 흔적과 물의 가치를 다각도로 보여 줍니다.\n\n운영 시간·휴관일·전망 구역 등 세부 사항은 방문 전 시설 공지를 확인해 주세요.",
    facilityProfile: [
      { label: "테마", value: "세계가 말하는 물, 포럼이 남긴 기억" },
      { label: "대상", value: "가족·학습단체, 물·환경 국제행사 스토리·전망에 적합(무료)" },
    ],
    floors: [
      {
        floorLabel: "1층",
        highlights: [
          "워터볼(파노라마 서클 영상관)",
          "워터 갤러리(물 정보 검색)",
          "워터 바(세계 병물 전시 — 3,400여 브랜드)",
          "배리어프리 체험 콘텐츠",
          "강당(250석)·강의실",
        ],
      },
      {
        floorLabel: "2층·전망대",
        highlights: [
          "수천지(水天池) — 하늘을 비추는 수공간",
          "안동호·안동댐 파노라마 전망",
          "기획전시실·상설전시실",
        ],
      },
      {
        floorLabel: "야외 시설",
        highlights: [
          "물의 정원·물의 기둥",
          "생명의 못·기념정원",
          "야외공연장·치유의 숲",
          "전망카페·산책로",
        ],
      },
    ],
  },
  nakdonggang: {
    imageSrc:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0f/%EB%B6%80%EC%82%B0_%EB%82%99%EB%8F%99%EA%B0%95_%ED%95%98%EA%B5%AC%28%EC%95%84%EB%A6%AC%EB%9E%91_2%ED%98%B8%29_%28577%29.jpeg/960px-%EB%B6%80%EC%82%B0_%EB%82%99%EB%8F%99%EA%B0%95_%ED%95%98%EA%B5%AC%28%EC%95%84%EB%A6%AC%EB%9E%91_2%ED%98%B8%29_%28577%29.jpeg",
    imageAlt: "부산 낙동강 하구(을숙도·하굿둑 인근 낙동강문화관 수계)",
    profileIntro:
      "낙동강 하굿둑 인근에서 4대강 살리기와 낙동강의 새로운 물길을 미디어·체험으로 풀어 냅니다.\n\n어린이 물길여행 등 가족 프로그램과 옥상 정원 전망이 잘 갖춰져 있습니다.\n\n유아·가족 중심 나들이와 을숙도 생태 탐방을 엮기 좋습니다.",
    facilityProfile: [
      { label: "테마", value: "하굿둑 앞 낙동강, 감성과 체험의 물" },
      { label: "대상", value: "유아·가족 중심, 미디어·체험과 을숙도 생태 나들이 연계" },
    ],
    floors: [
      { floorLabel: "지하1층", highlights: ["관리 시설"] },
      {
        floorLabel: "지상1층",
        highlights: [
          "안내데스크·학예실",
          "새물결 꿈 전시실",
          "어린이 물길여행·감동소통 전시실",
        ],
      },
      { floorLabel: "옥상정원", highlights: ["낙동강·을숙도 조망 정원"] },
    ],
  },
};
