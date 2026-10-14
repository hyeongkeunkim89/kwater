/**
 * 시설별 대표 이미지·층별 구성·시설현황 초안입니다.
 * 실제 전시 구성은 시설 리플렛·kwater 공지와 맞춰 교체하세요.
 * 이미지: 위키미디어 공용 등 출처 명확한 실경·수계 사진 권장.
 */

export type FacilityProfileItem = { label: string; value: string };

export type FloorPlan = {
  floorLabel: string;
  highlights: string[];
  description?: string;
};

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
        description:
          "종합 안내 데스크와 함께 조력발전의 기초 원리를 배우는 입문 전시 및 어린이 체험 코너가 마련된 1층입니다.",
      },
      {
        floorLabel: "2층",
        highlights: ["심화 전시", "에너지·환경 스토리", "영상·디지털 해설"],
        description:
          "시화호의 역사와 청정에너지·환경 스토리를 심도 있게 탐구할 수 있는 심화 전시실과 디지털 영상 해설관이 위치한 2층 공간입니다.",
      },
      {
        floorLabel: "옥외·연계",
        highlights: ["전망 동선 안내", "사진 존(시설별)"],
        description:
          "시화호와 서해의 수려한 경관을 한눈에 조망할 수 있는 전망 동선과 기념 사진 존으로 이어지는 옥외 연계 공간입니다.",
      },
    ],
  },
  chungju: {
    imageSrc:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/Chungju_Dam.JPG/960px-Chungju_Dam.JPG",
    imageAlt: "충주댐 본체 및 충주댐 물문화관 전경",
    profileIntro:
      "충주댐과 충주호를 중심으로, K-water의 첨단 스마트 수자원 관리 기술과 댐 본체 미디어파사드 연출을 관람할 수 있습니다.\n\n3D 디지털 전시와 모니터링 스토리를 통해 댐과 수자원 관리가 우리 일상과 어떻게 닿는지 이해하기 쉽게 구성되어 있습니다.\n\n어린이·청소년 및 가족 나들이객에게 첨단 미래 기술 체험을 전달하는 대표 과학·기술관입니다.",
    facilityProfile: [
      { label: "테마", value: "스마트 수자원 관리 & 첨단 미디어 기술" },
      { label: "대상", value: "IT·과학 기술 체험을 희망하는 아동·청소년 및 가족" },
    ],
    floors: [
      {
        floorLabel: "1층",
        highlights: ["다목적전시실", "휴게공간"],
        description:
          "충주댐의 건설 역사와 수자원 관리 스토리를 만나는 다목적전시실과 편안한 휴게공간이 마련되어 있는 1층입니다.",
      },
      {
        floorLabel: "2층",
        highlights: ["물전시관", "로비 기획전시", "로비 동요동시 체험", "안내데스크", "매점"],
        description:
          "첨단 스마트 수자원 물전시관, 기획전시, 동요동시 체험공간 및 매점과 안내데스크가 조성된 2층 공간입니다.",
      },
    ],
  },
  daecheong: {
    imageSrc:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/c/ca/Daecheong_Dam_Water_Culture_Center_-_%EB%8C%80%EC%B2%AD%EB%8C%90%EB%AC%BC%EB%AC%B8%ED%99%94%EA%B4%80.jpg/960px-Daecheong_Dam_Water_Culture_Center_-_%EB%8C%80%EC%B2%AD%EB%8C%90%EB%AC%BC%EB%AC%B8%ED%99%94%EA%B4%80.jpg",
    imageAlt: "대청댐 물문화관 건물 전경 및 대청호 수계",
    profileIntro:
      "금강 수계와 대청호를 아우르는 수생태계 전시로, 대청호의 청정 자연 생태와 민물고기 수족관을 갖추고 있습니다.\n\n상수원 보호와 금강 유역 생물 다양성 등 물이 갖는 생태적 가치를 전시와 영상으로 배울 수 있습니다.\n\n그린리모델링·전시 리뉴얼로 휴관 기간이 있을 수 있으니, 관람 전 시설 공지와 K-water 안내를 꼭 확인해 주세요.",
    facilityProfile: [
      { label: "테마", value: "대청호 수생태계 & 금강 민물고기 생태" },
      { label: "대상", value: "자연 생태 체험 및 생물 다양성 학습을 희망하는 어린이·가족" },
    ],
    floors: [
      {
        floorLabel: "1층",
        highlights: ["로비", "제1전시(입문)", "안내 데스크"],
        description:
          "종합 안내데스크와 로비, 대청호의 수생태계와 금강의 물길을 소개하는 제1전시실이 위치한 1층입니다.",
      },
      {
        floorLabel: "2층",
        highlights: ["제2전시", "호수·수계 심화 콘텐츠"],
        description:
          "대청호 수중 생태계와 금강 민물고기 생태를 생생하게 관찰할 수 있는 제2전시실과 심화 콘텐츠 공간이 마련된 2층입니다.",
      },
      {
        floorLabel: "3층",
        highlights: ["제3전시", "영상·요약 전시"],
        description:
          "물과 인간의 공존을 다룬 제3전시실과 실감영상 및 대청호의 수려한 풍광을 조망할 수 있는 3층 공간입니다.",
      },
    ],
  },
  buan: {
    imageSrc: "/centers/buan.jpg",
    imageAlt: "부안댐 본체 및 부안댐 물문화관 전경",
    profileIntro:
      "변산반도 국립공원과 맞닿은 수역을 품은 부안댐 일대의 청정 산림 및 호수 생태계를 전시실과 영상으로 만납니다.\n\n변산반도 자생 동식물과 부안호 상수원 보호 등 강과 호수 곁의 자연 환경 보호 스토리를 다룹니다.\n\n변산반도 국립공원 숲과 호수를 즐기려는 가족·성인 방문객에게 어울리는 청정 생태관입니다.",
    facilityProfile: [
      { label: "테마", value: "변산반도 국립공원 생태계 & 부안호 청정 환경" },
      { label: "대상", value: "변산반도 국립공원 숲·호수 자연 생태 탐방객" },
    ],
    floors: [
      {
        floorLabel: "1층",
        highlights: ["로비", "제1전시실(물과 생명)", "기획전시실"],
        description:
          "변산반도 국립공원의 생태와 물의 소중함을 다루는 제1전시실 및 다채로운 기획전시실이 위치한 1층입니다.",
      },
      {
        floorLabel: "2층",
        highlights: ["제2전시실(부안댐 스토리)", "전망대"],
        description:
          "부안댐의 역할과 수몰 역사, 생활 물 문화를 소개하는 제2전시실과 부안호를 조망하는 전망대가 마련된 2층 공간입니다.",
      },
    ],
  },
  soyang: {
    imageSrc:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ea/SoyangDam.JPG/960px-SoyangDam.JPG",
    imageAlt: "소양강댐 본체 및 소양강댐 물문화관 전경",
    profileIntro:
      "동양 최대 규모 사급댐 소양강댐의 축조 역사와 대한민국 근대 치수 사업의 발자취를 다룹니다.\n\n댐 건설로 인해 정든 터전을 떠나야 했던 수몰지 주민들의 삶과 옛 사료를 수몰전시관에 보존하고 있습니다.\n\n대한민국 산업화 및 치수 역사에 관심 있는 학생, 성인, 수몰민 가족에게 뜻깊은 대표 역사관입니다.",
    facilityProfile: [
      { label: "테마", value: "대한민국 근대 치수 & 사급댐 축조 역사" },
      { label: "대상", value: "근대사·치수 역사에 관심 있는 학생·성인 및 수몰민 가구" },
    ],
    floors: [
      {
        floorLabel: "1층",
        highlights: ["로비", "OT전시실", "수몰전시관"],
        description:
          "소양강댐 오리엔테이션 전시실과 댐 축조로 수몰된 마을 주민들의 기억과 사료를 보존한 수몰전시관이 자리한 1층입니다.",
      },
      {
        floorLabel: "2층",
        highlights: ["제1전시실", "제2전시실"],
        description:
          "대한민국 근대 치수 역사와 동양 최대 사급댐의 축조 기술 및 생태 환경을 다루는 제1·제2전시실이 위치한 2층입니다.",
      },
      {
        floorLabel: "3층",
        highlights: ["워터갤러리", "워터클래스"],
        description:
          "소양호의 수려한 전경을 감상할 수 있는 워터갤러리와 다양한 물 문화 교육 및 체험 프로그램이 열리는 3층 공간입니다.",
      },
    ],
  },
  hantan: {
    imageSrc:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3b/Hantan_River_nearby_Goseokjeong.jpg/960px-Hantan_River_nearby_Goseokjeong.jpg",
    imageAlt: "한탄강댐 본체 및 주상절리 협곡 전경",
    profileIntro:
      "UNESCO 세계지질공원으로 지정된 한탄강의 화산암 주상절리와 협곡 지질 생태계를 교육하는 지질 생태관입니다.\n\n화산 폭발로 형성된 독특한 주상절리 협곡과 한탄강 고유 수생태계의 보전 가치를 전달합니다.\n\n지질학적 가치와 이색 협곡 지형 생태를 학습하려는 학생 및 성인 탐방객에게 최적입니다.",
    facilityProfile: [
      { label: "테마", value: "UNESCO 한탄강 세계지질공원 & 주상절리 생태" },
      { label: "대상", value: "지질 생태 체험 및 화산암 협곡 지형을 학습하려는 탐방객" },
    ],
    floors: [
      {
        floorLabel: "1층",
        highlights: ["연천군 홍보관", "큰여울 놀이터"],
        description:
          "연천의 역사와 관광을 소개하는 연천군 홍보관과 어린이들이 안전하고 즐겁게 뛰어놀 수 있는 큰여울 놀이터가 위치한 1층입니다.",
      },
      {
        floorLabel: "2층",
        highlights: ["기획전시실", "복합문화공간", "어린이놀이터"],
        description:
          "한탄강 UNESCO 세계지질공원의 주상절리 생태를 다루는 기획전시실, 복합문화공간 및 어린이 체험놀이터가 조성된 2층입니다.",
      },
    ],
  },
  hapcheon: {
    imageSrc:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3e/HapcheonDam.jpg/960px-HapcheonDam.jpg",
    imageAlt: "합천다목적댐 본체 및 합천댐 물문화관 전경",
    profileIntro:
      "합천호 수면에 설치된 세계 최대 규모의 붕어모양 수상태양광과 친환경 신재생 물 에너지 기술을 조망합니다.\n\n수면을 활용한 친환경 태양광 발전 공학 메커니즘과 탄소중립 미래 기술의 성과를 전시합니다.\n\n친환경 신재생 에너지 기술과 차세대 물 기술에 관심 있는 학생·전문가에게 권장됩니다.",
    facilityProfile: [
      { label: "테마", value: "세계 최대 수상태양광 & 신재생 물 에너지 기술" },
      { label: "대상", value: "친환경 에너지·탄소중립 기술에 관심 있는 학생·전문가·가족" },
    ],
    floors: [
      {
        floorLabel: "1층",
        highlights: ["다목적전시실"],
        description:
          "합천호의 자연과 세계 최대 수상태양광, 친환경 신재생 물 에너지 기술을 한눈에 살펴보는 다목적전시실이 위치한 1층입니다.",
      },
      {
        floorLabel: "2층",
        highlights: ["로비", "복합문화공간", "옥외전망대"],
        description:
          "방문객을 맞이하는 로비와 주민 참여형 복합문화공간, 합천호의 수려한 풍광을 조망할 수 있는 옥외전망대가 마련된 2층입니다.",
      },
    ],
  },
  juam: {
    imageSrc: "/centers/juam.jpg",
    imageAlt: "주암댐 본체 및 주암댐 물문화관 전경",
    profileIntro:
      "대한민국 대표 생태 도시 순천만 생태축과 연결되어 주암호의 청정 수질 보존과 수생태계를 보호합니다.\n\n광주·전남의 젖줄인 주암호 수질 환경과 습지 생태계의 소중함을 다채로운 교육으로 전달합니다.\n\n청정 물 환경 교육 및 호수 자연 생태 탐방을 희망하는 가족·학생 단체에 맞춘 생태관입니다.",
    facilityProfile: [
      { label: "테마", value: "주암호 수생태계 보전 & 순천만 생태축 연계" },
      { label: "대상", value: "청정 물 환경 교육 및 호수 생태를 경험하고 싶은 학생·학부모" },
    ],
    floors: [
      {
        floorLabel: "1층",
        highlights: ["안내데스크", "물전시관1", "영상실"],
        description:
          "종합 안내데스크와 주암호의 청정 수생태계를 입문하는 제1물전시관, 몰입형 시청각 영상실이 위치한 1층입니다.",
      },
      {
        floorLabel: "2층",
        highlights: ["물전시관2", "기획전시실", "야외데크"],
        description:
          "순천만과 연결되는 물길의 가치를 배우는 제2물전시관, 기획전시실 및 주암호 전망을 즐길 수 있는 야외 데크가 마련된 2층입니다.",
      },
    ],
  },
  jangheung: {
    imageSrc: "/centers/jangheung.jpg",
    imageAlt: "장흥댐 본체 및 장흥댐 물문화관 전경",
    profileIntro:
      "전남 청정 탐진강 상류 유역의 맑은 물과 수생생물, 민물고기, 수변 식생 생태계를 전시합니다.\n\n탐진강과 장흥호 주변의 자연 습지 관찰 및 수생태계 보호 스토리관을 갖추고 있습니다.\n\n탐진강 생태 관찰 및 맑은 물 자연 교육을 원하는 유아·가족 관람객에게 추천됩니다.",
    facilityProfile: [
      { label: "테마", value: "탐진강 수생생물 & 장흥호 습지 생태" },
      { label: "대상", value: "탐진강 생태 관찰 및 맑은 물 자연 교육을 희망하는 가족·유아" },
    ],
    floors: [
      {
        floorLabel: "1층",
        highlights: ["역사문화실", "영상실", "화장실"],
        description:
          "탐진강 유역의 역사와 수몰지의 옛 삶을 담은 역사문화실과 생생한 시청각 영상실이 위치한 1층입니다.",
      },
      {
        floorLabel: "2층",
        highlights: ["물전시실", "전망대", "화장실"],
        description:
          "탐진강의 맑은 물과 수생태계를 관찰하는 물전시실 및 장흥호의 시원한 풍광을 조망하는 전망대가 위치한 2층 공간입니다.",
      },
    ],
  },
  yeongju: {
    imageSrc:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/c/cf/%EC%98%81%EC%A3%BC%EB%8C%90_%EB%92%B7%EB%A9%B4.jpg/960px-%EC%98%81%EC%A3%BC%EB%8C%90_%EB%92%B7%EB%A9%B4.jpg",
    imageAlt: "영주다목적댐 본체 전경",
    profileIntro:
      "낙동강 상류 영주호 주변 생태숲 및 출렁다리와 연계되어 수생태계 보전과 자연 탐방을 지원합니다.\n\n영주호 청정 자연 환경과 낙동강 상류 생물 다양성을 해설하고 안내합니다.\n\n생태숲 산책 및 호수 수생태 탐방을 즐기려는 등산·가족 방문객에게 조율된 생태관입니다.",
    facilityProfile: [
      { label: "테마", value: "영주호 생태숲 & 낙동 상류 수생태계 보전" },
      { label: "대상", value: "생태숲 산책 및 자연 탐방을 즐기는 탐방객·가족" },
    ],
    floors: [
      {
        floorLabel: "1층",
        highlights: ["로비", "영주댐·낙동강 상류 소개"],
        description:
          "영주댐의 건설 배경과 낙동강 상류 수생태계 및 청정 자연환경을 소개하는 로비와 입문 전시실이 위치한 1층입니다.",
      },
      {
        floorLabel: "2층",
        highlights: ["전시·전망 연계 공간"],
        description:
          "영주호 생태숲 및 출렁다리와 연계된 심화 전시와 수려한 호수 경관을 감상할 수 있는 전망 연계 공간이 마련된 2층입니다.",
      },
    ],
  },
  seomjin: {
    imageSrc:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a4/%EC%84%AC%EC%A7%84%EA%B0%95%EB%8C%90.jpg/960px-%EC%84%AC%EC%A7%84%EA%B0%95%EB%8C%90.jpg",
    imageAlt: "섬진강댐 본체 및 전면 전경",
    profileIntro:
      "섬진강 청정 유역의 수생태계 보정과 맑은 물 보전의 중요성을 교육하는 청정 생태관입니다.\n\n섬진강 수계의 동식물 보존과 자연 습지 환경 보호 스토리를 강조합니다.\n\n수생태계 환경 교육 및 청정 섬진강 자연을 탐방하고 싶은 학생·가족에게 적합합니다.",
    facilityProfile: [
      { label: "테마", value: "섬진강 청정 유역 & 수생태계 환경 보호" },
      { label: "대상", value: "섬진강 수생태 관찰 및 환경 습지 교육 방문객" },
    ],
    floors: [
      {
        floorLabel: "1층",
        highlights: ["안내", "섬진강·댐 입문"],
        description:
          "종합 안내 데스크와 대한민국 최초의 다목적댐인 섬진강댐의 역사 및 강 유역을 소개하는 입문 전시가 마련된 1층입니다.",
      },
      {
        floorLabel: "2층",
        highlights: ["전시·영상", "수계 보전 스토리"],
        description:
          "청정 섬진강의 수생태계 보전 스토리와 다양한 시청각 영상 콘텐츠를 만날 수 있는 2층 공간입니다.",
      },
    ],
  },
  imha: {
    imageSrc:
      "https://upload.wikimedia.org/wikipedia/commons/0/0e/Korea-Andong-Imha_Dam-01.jpg",
    imageAlt: "임하다목적댐 본체 전경",
    profileIntro:
      "임하호는 광역 상수원으로서 낙동강 수계의 자연 생태 보전과 수질 환경을 조명합니다.\n\n임하호 청정 수생태계 및 상수원 보호의 중요성을 교육하는 생태 관람관입니다.\n\n낙동강 수계 자연 환경과 호수 생태에 관심 있는 관람객에게 추천됩니다.",
    facilityProfile: [
      { label: "테마", value: "임하호 생태계 & 광역 상수원 자연 보전" },
      { label: "대상", value: "낙동강 수생태 보전 및 자연 환경 교육 관심층" },
    ],
    floors: [
      {
        floorLabel: "1층",
        highlights: ["로비", "임하호 개요"],
        description:
          "영남권 맑은 물 공급원인 임하댐의 개요와 낙동강 수계의 가치를 한눈에 조망할 수 있는 로비 및 안내 공간이 위치한 1층입니다.",
      },
      {
        floorLabel: "2층",
        highlights: ["복합 기능 전시", "영상·사진 자료"],
        description:
          "임하호 주변의 자연 생태와 댐 수몰 사료를 담은 복합 기능 전시실과 영상·사진 아카이브가 마련된 2층입니다.",
      },
    ],
  },
  gimcheon: {
    imageSrc: "/centers/gimcheon.jpg",
    imageAlt: "김천부항댐 본체 및 부항댐 물문화관 전경",
    profileIntro:
      "국내 최고 높이(93m) 부항댐 짚와이어, 출렁다리, 스카이워크 등 수변 익스트림 스포츠를 갖추고 있습니다.\n\n부항호 위를 거니는 수변 산책 코스와 활기찬 수변 레저 문화를 제공하는 레저 관광 거점입니다.\n\n익스트림 수변 레저 및 동적인 관광 문화를 즐기는 청년, 가족 단위 방문객에게 인기가 높습니다.",
    facilityProfile: [
      { label: "테마", value: "부항호 수변 짚와이어 & 액티비티 레저 문화" },
      { label: "대상", value: "익스트림 수변 레저 및 동적인 관광 문화를 즐기는 청년·가족" },
    ],
    floors: [
      {
        floorLabel: "1층",
        highlights: ["로비"],
        description:
          "방문객을 친절하게 맞이하는 안내 데스크와 쾌적한 쉼터가 마련되어 있는 1층 로비 공간입니다.",
      },
      {
        floorLabel: "2층",
        highlights: ["다목적전시실", "부항 이야기"],
        description:
          "부항댐의 건설 과정과 부항호의 역사·문화를 한눈에 살펴보는 다목적전시실과 부항 이야기 코너가 위치한 2층입니다.",
      },
      {
        floorLabel: "3층",
        highlights: ["옥상"],
        description:
          "부항호의 맑은 공기와 수려한 주변 산세를 감상하며 휴식을 취할 수 있는 옥상 쉼터 공간입니다.",
      },
      {
        floorLabel: "4층",
        highlights: ["전망대"],
        description:
          "부항호와 부항댐 출렁다리, 짚와이어의 역동적인 파노라마 전경을 360도로 조망할 수 있는 전망대입니다.",
      },
    ],
  },
  yongdam: {
    imageSrc: "/centers/yongdam.jpg",
    imageAlt: "용담댐 본체 및 용담댐 물문화관 전경",
    profileIntro:
      "용담호 주변 습지 및 숲 생태 자원을 관찰할 수 있는 6개 테마 정원과 디지털 생태학습관을 가집니다.\n\n숲, 계곡, 습지 등 용담호의 자연 동식물 생태계를 입체적인 디지털 콘텐츠로 안내합니다.\n\n자연 습지 관찰 및 호수 생태 힐링 탐방을 희망하는 가족·단체에 최적화되어 있습니다.",
    facilityProfile: [
      { label: "테마", value: "용담호 습지·숲 생태 & 디지털 생태 체험" },
      { label: "대상", value: "자연 습지 관찰 및 생태 힐링 탐방을 즐기는 관람객" },
    ],
    floors: [
      {
        floorLabel: "1층",
        highlights: ["다목적 전시실", "기획전시", "영상실", "화장실"],
        description:
          "용담호의 사계와 수생태계를 담은 다목적전시실, 테마 기획전시 및 시청각 영상실이 위치한 1층입니다.",
      },
      {
        floorLabel: "2층",
        highlights: ["북카페", "키즈존", "휴식공간"],
        description:
          "용담호를 바라보며 독서와 여유를 즐길 수 있는 북카페, 어린이 키즈존 및 편안한 휴식공간이 조성된 2층입니다.",
      },
    ],
  },
  "hangang-yeoju": {
    imageSrc:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8e/Namhan_River_in_front_of_Yeoju_Library.jpg/960px-Namhan_River_in_front_of_Yeoju_Library.jpg",
    imageAlt: "여주 강천보 및 한강문화관 전경",
    profileIntro:
      "남한강 수변 갤러리와 문화예술 프로그램, 전망타워가 결합된 수변 복합 문화 공간입니다.\n\n다양한 수변 기획 미술 전시와 지역 문화예술 연계 프로그램을 전면에 배치했습니다.\n\n수변 예술 감상과 휴식을 원하는 수도권 시민 및 가족 나들이객에게 적합합니다.",
    facilityProfile: [
      { label: "테마", value: "남한강 수변 갤러리 & 기획 문화예술" },
      { label: "대상", value: "수변 예술 감상 및 기획 문화를 선호하는 주말 나들이객" },
    ],
    floors: [
      {
        floorLabel: "지하 1층",
        highlights: ["다목적·교육 공간(시설별)"],
        description:
          "지역 주민과 청소년을 위한 다양한 물 문화 교육 및 세미나, 체험 프로그램이 열리는 다목적 교육 공간입니다.",
      },
      {
        floorLabel: "1층",
        highlights: ["로비", "한강 역사·정책 입문 전시"],
        description:
          "남한강의 유구한 역사와 한강 물길의 가치를 배우는 종합 로비 및 입문 상설전시실이 위치한 1층입니다.",
      },
      {
        floorLabel: "2~3층",
        highlights: ["갤러리", "기획전·문화 프로그램"],
        description:
          "남한강 수변 갤러리와 다채로운 현대미술 기획전, 시민 문화예술 프로그램이 펼쳐지는 문화 예술 공간입니다.",
      },
      {
        floorLabel: "전망타워",
        highlights: ["강천보·한강 조망", "사진 포인트"],
        description:
          "여주 강천보와 남한강의 웅장한 수변경관을 360도 파노라마로 감상할 수 있는 대표 전망타워입니다.",
      },
    ],
  },
  namgang: {
    imageSrc: "/centers/namgang.jpg",
    imageAlt: "남강댐 본체 및 진양호 물문화관 전경",
    profileIntro:
      "진주 대표 축제인 남강 유등 축제와 연계된 수변 기획 미술 전시 및 갤러리, 북카페를 갖추고 있습니다.\n\n진주 남강의 수변 문화예술을 즐기고 주민들이 휴식할 수 있는 친수 소통 공간을 선사합니다.\n\n수변 문화예술 전시와 진주 남강 풍경을 감상하려는 지역 주민 및 관광객에게 적합합니다.",
    facilityProfile: [
      { label: "테마", value: "진주 남강 유등 축제 연계 & 수변 미술 전시" },
      { label: "대상", value: "수변 문화예술 전시 및 여가를 즐기는 지역 주민·관광객" },
    ],
    floors: [
      {
        floorLabel: "1층",
        highlights: ["다목적전시실"],
        description:
          "진양호와 남강의 유역사, 맑은 물 공급 기술 및 남강 유등 축제의 문화를 함께 살펴보는 다목적전시실이 마련된 1층입니다.",
      },
      {
        floorLabel: "2층",
        highlights: ["영상실", "남강정원"],
        description:
          "몰입감 넘치는 시청각 영상실과 진양호의 아름다운 호수 풍경 및 노을을 조망할 수 있는 남강정원이 위치한 2층 공간입니다.",
      },
    ],
  },
  miryang: {
    imageSrc: "/centers/miryang.jpg",
    imageAlt: "밀양댐 본체 및 밀양댐 물문화관 전경",
    profileIntro:
      "밀양댐 수변공원 및 단장천 계곡과 어우러져 지역 주민들과 방문객들에게 문화행사와 여가를 제공합니다.\n\n밀양 지역 문화예술단체 협력 전시 및 소소한 문화 이벤트가 수변 잔디광장에서 펼쳐집니다.\n\n수변 피크닉, 산책 및 문화 이벤트를 함께 즐기고 싶은 가족·연인 단위 방문객에게 좋습니다.",
    facilityProfile: [
      { label: "테마", value: "밀양댐 수변공원 & 지역 소통 문화 쉼터" },
      { label: "대상", value: "수변 공원 피크닉 및 소소한 문화 행사를 즐기는 가족·연인" },
    ],
    floors: [
      {
        floorLabel: "1층",
        highlights: ["로비", "주제관", "체험관"],
        description:
          "밀양댐의 역할과 물의 소중함을 체험하는 주제관 및 어린이 체험관, 로비가 위치한 1층입니다.",
      },
      {
        floorLabel: "2층",
        highlights: ["영상실", "휴게실"],
        description:
          "밀양댐 주변 생태를 담은 홍보 영상실과 밀양호의 절경을 감상하며 쉴 수 있는 편안한 휴게실이 마련된 2층입니다.",
      },
    ],
  },
  hoengseong: {
    imageSrc: "/centers/hoengseong.jpg",
    imageAlt: "횡성댐 본체 및 횡성댐 물문화관 전경",
    profileIntro:
      "댐 축조로 수몰된 횡성군 5개 리(부동리, 중금리 등) 주민들의 옛 삶과 터전을 보존하는 망향의 동산 연계관입니다.\n\n수몰지 마을의 옛 사진, 생활 유물, 수몰민들의 아련한 이야기를 사료관에 기록해 두고 있습니다.\n\n횡성호수길 5구간 탐방과 함께 수몰 역사 사료를 되새기려는 방문객에게 뜻깊은 역사관입니다.",
    facilityProfile: [
      { label: "테마", value: "수몰지 5개 리 주민들의 옛 삶과 망향의 역사" },
      { label: "대상", value: "수몰 역사 사료 관람 및 횡성호수길 망향 탐방객" },
    ],
    floors: [
      {
        floorLabel: "1층",
        highlights: ["주제관", "물 순환 전시", "영상상영관"],
        description:
          "물의 소중함과 순환 과정을 다룬 주제관, 어린이 체험관, 안내데스크 및 휴게실이 위치한 1층입니다.",
      },
      {
        floorLabel: "2층",
        highlights: ["체험관", "어린이 참여형 코너", "화성의 옛터 전시관"],
        description:
          "홍보 영상물 상영이 이루어지는 영상실과 수몰지의 옛 삶을 기리는 기획전시가 펼쳐지는 2층 공간입니다.",
      },
      {
        floorLabel: "옥외·연계",
        highlights: [
          "화성의 옛터(수몰 지역 문화·역사 보존관)",
          "횡성호수길 연계",
        ],
        description:
          "수몰민의 망향의 한을 달래는 화성의 옛터와 아름다운 횡성호수길로 이어지는 옥외 연계 코스입니다.",
      },
    ],
  },
  "peace-dam": {
    imageSrc:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/8/84/Peace_Dam_2022.jpg/960px-Peace_Dam_2022.jpg",
    imageAlt: "평화의댐 본체 및 평화의댐 물문화관 전경",
    profileIntro:
      "북한 금강산댐 대응으로 시작된 댐의 특수한 건립 배경, 세계평화의 종, 남북 분단/안보 역사를 담고 있습니다.\n\n전 세계 60여 개 분쟁 지역의 탄피를 모아 주조한 세계평화의 종과 평화 메시지 전시가 상징적입니다.\n\nDMZ 접경 지역의 남북 분단 및 평화 안보 역사를 탐방하려는 학생·성인 관람객에 최적입니다.",
    facilityProfile: [
      { label: "테마", value: "세계평화의 종, 남북 분단/안보 역사 중심" },
      { label: "대상", value: "DMZ 안보 역사 탐방 및 평화 안보 교육 방문객" },
    ],
    floors: [
      {
        floorLabel: "1층",
        highlights: ["로비·안내", "평화의댐 역사 소개", "안보·통일 메시지"],
        description:
          "평화의댐의 건립 배경과 역사, 평화·안보의 소중함을 되새기는 로비 및 다목적 전시실이 위치한 1층입니다.",
      },
      {
        floorLabel: "2층",
        highlights: ["북한강 상류 수계 전시", "물 안보 스토리", "영상 상영"],
        description:
          "북한강 상류의 청정 수생태계와 물 안보 스토리를 담은 전시실 및 영상 상영관이 위치한 2층 공간입니다.",
      },
      {
        floorLabel: "옥외·연계",
        highlights: ["세계종공원", "비목공원 산책로", "댐 마루 전망 동선"],
        description:
          "세계평화의 종, 비목공원 및 댐 마루를 따라 평화의 염원을 느끼며 산책할 수 있는 옥외 연계 공간입니다.",
      },
    ],
  },
  andong: {
    imageSrc:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d7/Andong_dam.JPG/960px-Andong_dam.JPG",
    imageAlt: "안동댐 본체 및 안동댐 물문화관 전경",
    profileIntro:
      "안동댐 축조 당시 수몰 위기에 처했던 수많은 전통 유교 문화재의 이전 및 보존 역사와 안동호 형성 과정의 사료를 전합니다.\n\n안동의 역사 문화적 유산과 수몰민들의 삶의 터전을 기록한 역사문화 전시관을 함께 다룹니다.\n\n안동의 유교 문화재 보존 및 수몰 역사를 다각도로 학습하고 감상하려는 방문객에게 대표 역사관 역할을 합니다.",
    facilityProfile: [
      { label: "테마", value: "안동 유교 문화재 보존 및 수몰 역사 중심" },
      { label: "대상", value: "전통 역사·문화재 보존 및 안동의 역사적 가치를 탐방하는 방문객" },
    ],
    floors: [
      {
        floorLabel: "1층",
        highlights: ["대강당", "자료실"],
        description:
          "안동댐의 역사와 수몰 문화재 보존 사료를 열람할 수 있는 자료실과 다양한 문화 행사가 열리는 대강당이 위치한 1층입니다.",
      },
      {
        floorLabel: "2층",
        highlights: ["카페"],
        description:
          "안동호의 시원한 수변 경관을 감상하며 여유로운 티타임과 휴식을 즐길 수 있는 카페 공간입니다.",
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
      {
        floorLabel: "1층",
        highlights: ["안내데스크", "기념품샵", "상설전시실(금강·4대강)"],
        description:
          "안내데스크와 함께 금강 물길의 역사와 생태, 백제 문화의 흐름을 조명하는 상설전시실이 위치한 1층입니다.",
      },
      {
        floorLabel: "2층",
        highlights: ["기획전시실", "북카페·체험실", "학예실"],
        description:
          "다채로운 예술 기획전시와 어린이 교육 체험, 금강을 바라보며 쉴 수 있는 북카페가 마련된 2층 복합문화공간입니다.",
      },
      {
        floorLabel: "3층·전망대",
        highlights: ["전망대(금강 파노라마)", "교육실·회의실"],
        description:
          "백제보와 금강의 장엄한 물길을 360도 파노라마로 감상할 수 있는 전망대와 교육실이 마련된 3층 공간입니다.",
      },
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
      {
        floorLabel: "1층",
        highlights: ["안내데스크", "기념품샵", "상설전시실(영산강·생태)"],
        description:
          "남도 젖줄 영산강의 역사와 수생태계를 체험하는 상설전시실 및 방문객 안내데스크가 위치한 1층입니다.",
      },
      {
        floorLabel: "2층",
        highlights: ["기획전시실", "북카페(체험실)", "학예실"],
        description:
          "지역 예술가들의 기획전시실과 독서·체험을 즐길 수 있는 북카페 쉼터가 자리한 2층 공간입니다.",
      },
      {
        floorLabel: "3층·옥상",
        highlights: ["전망대", "교육실·회의실", "옥상 경사 산책로"],
        description:
          "승촌보와 영산강 유역의 수려한 풍광을 조망할 수 있는 전망대와 옥상 경사 산책로가 이어지는 3층 공간입니다.",
      },
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
        description:
          "낙동강과 금호강이 만나는 합수지점의 역사와 4대강 수변 문화를 몰입형으로 탐구할 수 있는 지하 1층 강문화전시실입니다.",
      },
      {
        floorLabel: "1~2층",
        highlights: ["서클영상존(생명의 순환)", "The River 갤러리", "미디어월"],
        description:
          "생명의 순환을 담은 360도 서클영상존, The River 갤러리 및 첨단 미디어월 전시가 펼쳐지는 1~2층 복합 전시공간입니다.",
      },
      {
        floorLabel: "3층·전망대",
        highlights: ["낙동강·금호강 조망 전망대", "야경 감상 포인트"],
        description:
          "낙동강과 금호강이 빚어내는 절경과 화려한 야경을 파노라마로 감상할 수 있는 3층 전망대와 카페 테라스입니다.",
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
        description:
          "세계 3,400여 종의 생수를 만나는 워터바, 서클 파노라마 영상관(워터볼), 워터갤러리 및 대강당이 위치한 1층입니다.",
      },
      {
        floorLabel: "2층·전망대",
        highlights: [
          "수천지(水天池) — 하늘을 비추는 수공간",
          "안동호·안동댐 파노라마 전망",
          "기획전시실·상설전시실",
        ],
        description:
          "하늘을 비추는 야외 수공간 '수천지'와 안동호의 장엄한 비경을 파노라마로 감상하는 전망대 및 상설·기획전시실이 마련된 2층입니다.",
      },
      {
        floorLabel: "야외 시설",
        highlights: [
          "물의 정원·물의 기둥",
          "생명의 못·기념정원",
          "야외공연장·치유의 숲",
          "전망카페·산책로",
        ],
        description:
          "물의 정원, 생명의 못, 야외공연장 및 치유의 숲 산책로가 조성되어 자연 속 힐링을 선사하는 야외 테마 공간입니다.",
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
      {
        floorLabel: "지하1층",
        highlights: ["관리 시설"],
        description:
          "문화관의 안정적인 운영과 시설 관리를 지원하는 지하 1층 관리 시설 공간입니다.",
      },
      {
        floorLabel: "지상1층",
        highlights: [
          "안내데스크·학예실",
          "새물결 꿈 전시실",
          "어린이 물길여행·감동소통 전시실",
        ],
        description:
          "안내데스크와 함께 낙동강 물길의 역사와 가치를 배우는 새물결꿈 전시실 및 어린이 물길여행 체험존이 위치한 지상 1층입니다.",
      },
      {
        floorLabel: "옥상정원",
        highlights: ["낙동강·을숙도 조망 정원"],
        description:
          "을숙도 철새 도래지와 낙동강 하구의 천혜 자연을 시원하게 조망할 수 있는 옥상 힐링 정원입니다.",
      },
    ],
  },
};
