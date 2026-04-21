/**
 * 한국수자원공사(K-water)가 운영·관리하는 댐·조력 시설의 물문화관·조력문화관·한강문화관 등입니다.
 * 정기 휴무 요일은 공개 관광 안내를 참고했으나 변경될 수 있으니 방문 전 시설 공지·kwater.or.kr로 반드시 확인하세요.
 */

import {
  centerDetailsById,
  type CenterDetailFields,
} from "./center-details";
import { centerCoords } from "./center-coords";

export type { FacilityProfileItem, FloorPlan } from "./center-details";

export type FacilityKind =
  | "댐 물문화관"
  | "조력·발전 문화관"
  | "보 문화관"
  | "기념센터";

export type OperatingStatus = "운영중" | "부분운영" | "점검·휴관" | "준비중";

/** 문화관 현황·탐색용 콘텐츠 테마(전시 성격 기준, 순서 앞이 목록 그룹의 대표 테마) */
export const CENTER_THEME_ORDER = [
  "역사",
  "생태",
  "기술",
  "체험·교육",
  "건축·조망",
] as const;

export type CenterTheme = (typeof CENTER_THEME_ORDER)[number];

/** 한국어 요일 한 글자 — 서울(Asia/Seoul) 달력과 매칭 */
export const WEEKDAY_ORDER = [
  "월",
  "화",
  "수",
  "목",
  "금",
  "토",
  "일",
] as const;

export type WeekdayHan = (typeof WEEKDAY_ORDER)[number];

export type WaterCenterBase = {
  id: string;
  name: string;
  kind: FacilityKind;
  sido: string;
  sigungu: string;
  /** 관람객 안내용 대표 주소 */
  address: string;
  /**
   * 네이버 지도 등 외부 검색 링크에만 사용할 문자열.
   * 없으면 `address`로 링크를 만듭니다.
   */
  mapSearchQuery?: string;
  summary: string;
  /** 장기 운영 구분(시설 공지 기준). 화면에서는 오늘이 정기무면「오늘 휴관」으로 덮어씁니다 */
  status: OperatingStatus;
  statusNote: string;
  /** 매주 반복되는 휴무 요일(서울 기준). 명절·임시 휴관은 holidayClosureSummary에 적습니다 */
  weeklyClosedDays: readonly WeekdayHan[];
  /** 설·추석, 법정공휴일 등 정기 휴무 요일 외 안내(텍스트만, 자동 판별하지 않음) */
  holidayClosureSummary: string;
  /** 임시 휴관·공사 등 방문객이 꼭 알아야 할 안내(선택). 있으면 시설 상세 상단에 강조 표시 */
  visitorNotice?: string;
};

export type WaterCenter = WaterCenterBase &
  CenterDetailFields & {
    themes: readonly CenterTheme[];
    /** [경도, 위도] — react-simple-maps Marker coordinates 형식 */
    coordinates: readonly [number, number];
  };

/** 시설 id별 테마(첫 번째가 「전체」목록에서의 그룹 기준) */
const centerThemesById: Record<string, readonly CenterTheme[]> = {
  sihwa: ["기술", "생태", "체험·교육"],
  chungju: ["기술", "체험·교육", "역사"],
  daecheong: ["역사", "생태"],
  buan: ["생태", "역사"],
  soyang: ["생태", "기술"],
  hantan: ["기술", "체험·교육"],
  hapcheon: ["기술", "생태"],
  "worldwater-forum": ["역사", "체험·교육", "기술"],
  juam: ["기술", "생태"],
  jangheung: ["체험·교육", "생태"],
  yeongju: ["생태", "체험·교육"],
  seomjin: ["기술", "생태"],
  imha: ["기술", "생태"],
  gimcheon: ["기술", "생태", "체험·교육"],
  yongdam: ["생태", "체험·교육"],
  "hangang-yeoju": ["역사", "기술"],
  namgang: ["생태", "역사"],
  miryang: ["기술", "생태"],
  hoengseong: ["체험·교육", "역사"],
  "peace-dam": ["역사", "기술"],
  geumgang: ["역사", "건축·조망", "생태"],
  yeongsangang: ["역사", "생태", "체험·교육"],
  diarc: ["건축·조망", "역사", "기술"],
  nakdonggang: ["체험·교육", "기술", "생태"],
};

const waterCenterBaseList: WaterCenterBase[] = [
  {
    id: "sihwa",
    name: "시화나래 조력문화관",
    kind: "조력·발전 문화관",
    sido: "경기",
    sigungu: "안산시 단원구",
    address: "경기도 안산시 단원구 대부황금로 1927 (대부동)",
    summary:
      "시화호 조력발전과 바다·호수가 어우러진 해안형 문화관으로, 조력 원리와 에너지·물 순환을 쉽게 풀어 전시합니다.",
    status: "운영중",
    statusNote: "전망대·조력문화관 등 구역별 운영 시간이 다를 수 있음",
    weeklyClosedDays: ["일", "월"],
    holidayClosureSummary:
      "설·추석 연휴, 법정공휴일 등은 시설 공지에 따름",
  },
  {
    id: "chungju",
    name: "충주다목적댐 물문화관",
    kind: "댐 물문화관",
    sido: "충북",
    sigungu: "충주시",
    address: "충청북도 충주시 동량면 지등로 745",
    summary:
      "국내 대표 다목적댐의 역할과 안전, 홍수 조절·발전·상수원 기능을 한눈에 볼 수 있는 대형 전시·체험 공간입니다.",
    status: "운영중",
    statusNote: "입장 마감·주차 등은 시설 안내 확인",
    weeklyClosedDays: ["월"],
    holidayClosureSummary:
      "설·추석 연휴, 법정공휴일 및 시설 점검일 휴관 가능",
  },
  {
    id: "daecheong",
    name: "대청댐 물문화관",
    kind: "댐 물문화관",
    sido: "대전",
    sigungu: "대덕구",
    address: "대전광역시 대덕구 대청로 618-136",
    summary:
      "금강 수계와 대청호의 역사·환경을 주제로, 댐이 지역과 함께 성장해 온 이야기를 전시합니다.",
    status: "점검·휴관",
    statusNote: "그린리모델링·전시 리뉴얼 — 2026년 11월 말까지 임시 휴관 예정",
    weeklyClosedDays: ["월"],
    holidayClosureSummary:
      "설·추석 당일 등 명절·법정공휴일 휴관(연도별 공지 확인)",
    visitorNotice:
      "그린리모델링 공사 및 전시 리뉴얼로 현재 임시 휴관 중입니다. 휴관은 2026년 11월 말까지 예정되어 있으며, 재개 일정·변동 사항은 시설 현장 안내와 K-water 공식 공지를 확인해 주세요.",
  },
  {
    id: "buan",
    name: "부안댐 물문화관",
    kind: "댐 물문화관",
    sido: "전북",
    sigungu: "부안군",
    address: "전북특별자치도 부안군 변산면 부안댐로 290",
    summary:
      "국립공원 인접 수계의 생태·생활 물 이야기를 전시실과 영상으로 소개합니다.",
    status: "운영중",
    statusNote: "점심시간(12:00~13:00) 휴게 등 시설 안내 확인",
    weeklyClosedDays: ["월"],
    holidayClosureSummary:
      "설·추석 연휴, 법정공휴일·업체 사정에 따른 추가 휴무 가능",
  },
  {
    id: "soyang",
    name: "소양강댐 물문화관",
    kind: "댐 물문화관",
    sido: "강원",
    sigungu: "춘천시",
    address: "강원특별자치도 춘천시 신북읍 신샘밭로 1128",
    summary:
      "소양호와 상수원 보호, 겨울 스포츠와 연계된 지역 물 문화를 함께 전합니다.",
    status: "운영중",
    statusNote: "기상·시설 점검에 따라 일시 휴관 가능",
    weeklyClosedDays: ["월"],
    holidayClosureSummary:
      "설·추석 연휴, 법정공휴일 등은 시설 공지 확인",
  },
  {
    id: "hantan",
    name: "한탄강댐 물문화관",
    kind: "댐 물문화관",
    sido: "경기",
    sigungu: "연천군",
    address: "경기도 연천군 연천읍 고문리 902",
    summary:
      "한탄강 홍수 조절댐과 함께 조성된 전시·교육 공간으로, 수계 관리와 재해 안전 메시지를 전합니다.",
    status: "운영중",
    statusNote: "댐 구역·인접 군사지역 통행 제한이 있을 수 있음",
    weeklyClosedDays: ["월"],
    holidayClosureSummary:
      "설·추석, 법정공휴일·긴급 점검 시 휴관(현장 공지)",
  },
  {
    id: "hapcheon",
    name: "합천댐 물문화관",
    kind: "댐 물문화관",
    sido: "경남",
    sigungu: "합천군",
    address: "경상남도 합천군 대병면 합천호수로 197",
    summary:
      "낙동강 수계 홍수 조절과 농업·생활용수, 발전을 아우르는 합천호 이야기를 담습니다.",
    status: "운영중",
    statusNote: "호수 주변 안전 수칙 준수",
    weeklyClosedDays: ["월"],
    holidayClosureSummary:
      "설·추석 연휴, 법정공휴일 휴관 등은 시설 안내 확인",
  },
  {
    id: "worldwater-forum",
    name: "세계물포럼기념센터",
    kind: "기념센터",
    sido: "경북",
    sigungu: "안동시",
    address: "경상북도 안동시 석주로 383 (성곡동, 안동댐 좌안)",
    summary:
      "2015 대구·경북 세계물포럼 개최를 기념하여 안동댐 좌안에 건립된 복합 전시·교육 공간입니다. 워터볼(파노라마 영상), 세계 병물 전시 '워터 바', 수천지 전망대 등 물의 가치를 풀어낸 시설로, 매년 10만여 명이 방문합니다.",
    status: "운영중",
    statusNote: "운영시간 09:00~18:00 (화~일), 월요일·법정공휴일 휴관",
    weeklyClosedDays: ["월"],
    holidayClosureSummary:
      "법정공휴일·근로자의 날 휴관 — 시설 공지 확인",
  },
  {
    id: "juam",
    name: "주암댐 물문화관",
    kind: "댐 물문화관",
    sido: "전남",
    sigungu: "순천시",
    address: "전라남도 순천시 상사면 상사호길 555",
    summary:
      "주암호와 섬진강 상류 보전, 수력발전·용수 공급을 한자리에서 이해할 수 있는 전시·전망 시설입니다.",
    status: "운영중",
    statusNote: "주중 공휴일 포함 휴관 규정은 공지 확인",
    weeklyClosedDays: ["월", "화"],
    holidayClosureSummary:
      "설·추석 연휴, 법정공휴일(안내에 따른 주중 공휴일 포함) 휴관 가능",
  },
  {
    id: "jangheung",
    name: "장흥댐 물문화관",
    kind: "댐 물문화관",
    sido: "전남",
    sigungu: "장흥군",
    address: "전라남도 장흥군 부산면 지천길 142",
    summary:
      "담수호와 농업·상수원 연계, 지역 축제와 연계한 체험형 프로그램이 운영됩니다.",
    status: "운영중",
    statusNote: "체험·단체 관람은 사전 예약 여부 확인",
    weeklyClosedDays: ["월"],
    holidayClosureSummary:
      "설·추석, 법정공휴일 및 지자체·시설 사정에 따른 휴관",
  },
  {
    id: "yeongju",
    name: "영주댐 물문화관",
    kind: "댐 물문화관",
    sido: "경북",
    sigungu: "영주시",
    address: "경상북도 영주시 평은면 용혈리 897-2",
    summary:
      "낙동강 상류 댐군과 생태숲·출렁다리 등 주변 관광과 연계한 물 해설 거점입니다.",
    status: "운영중",
    statusNote: "전망대·전시실 운영이 상이할 수 있음",
    weeklyClosedDays: ["월", "화"],
    holidayClosureSummary:
      "법정공휴일, 설·추석 명절 연휴 휴관(공지 확인)",
  },
  {
    id: "seomjin",
    name: "섬진강댐 물문화관",
    kind: "댐 물문화관",
    sido: "전북",
    sigungu: "임실군",
    address: "전북특별자치도 임실군 운암면 강운로 1239",
    summary:
      "섬진강 수계 보전과 취수·홍수 관리, 지역 농업과 연계한 물 이야기를 소개합니다.",
    status: "운영중",
    statusNote: "댐 주변 안전구역 통제 구간 준수",
    weeklyClosedDays: ["월"],
    holidayClosureSummary:
      "설·추석 당일, 1월 1일, 법정공휴일 휴관 등(공지)",
  },
  {
    id: "imha",
    name: "임하댐 물문화관",
    kind: "댐 물문화관",
    sido: "경북",
    sigungu: "안동시",
    address: "경상북도 안동시 임하면 (임하댐 물문화관)",
    mapSearchQuery: "경상북도 안동시 임하댐 물문화관",
    summary:
      "임하호 광역 상수원과 발전·홍수 조절의 다면적 역할을 다루는 전시 공간입니다.",
    status: "운영중",
    statusNote: "도로명·운영 세부는 방문 전 시설 안내 확인",
    weeklyClosedDays: ["월"],
    holidayClosureSummary:
      "설·추석 연휴, 법정공휴일·점검일 휴관 가능",
  },
  {
    id: "gimcheon",
    name: "김천부항댐 물문화관",
    kind: "댐 물문화관",
    sido: "경북",
    sigungu: "김천시",
    address: "경상북도 김천시 부항면 부항댐길 352",
    summary:
      "낙동강 본류 항·댐 연계 운영과 농업용수, 하천 환경 복원 사례를 소개합니다.",
    status: "운영중",
    statusNote: "철새 도래기에는 주변 도로 통제 안내가 있을 수 있음",
    weeklyClosedDays: ["월"],
    holidayClosureSummary:
      "설·추석, 법정공휴일 및 시설 점검 시 휴관",
  },
  {
    id: "yongdam",
    name: "용담댐 물문화관",
    kind: "댐 물문화관",
    sido: "전북",
    sigungu: "진안군",
    address: "전북특별자치도 진안군 안천면 안용로 747",
    summary:
      "금강 상류 댐군과 스키장·산악 관광과 연계한 겨울철 물·눈 테마 해설이 특징입니다.",
    status: "운영중",
    statusNote: "동절기 결빙·안개로 운영 시간 변동 가능",
    weeklyClosedDays: ["월"],
    holidayClosureSummary:
      "설·추석 연휴, 법정공휴일·기상 악화 시 휴관 가능",
  },
  {
    id: "hangang-yeoju",
    name: "한강문화관",
    kind: "보 문화관",
    sido: "경기",
    sigungu: "여주시",
    address: "경기도 여주시 신단1길 83 (단현동)",
    summary:
      "한강 수계와 이포·강천보 등 한강 보·댐 사업을 소개하는 K-water 한강권 복합 전시·갤러리·전망 시설입니다.",
    status: "운영중",
    statusNote: "전망타워·전시실 입장 마감은 안내 시간 준수",
    weeklyClosedDays: ["월"],
    holidayClosureSummary:
      "1월 1일, 설·추석 당일 휴관(공지) — 그 외 법정공휴일은 안내 확인",
  },
  {
    id: "namgang",
    name: "남강댐 물문화관",
    kind: "댐 물문화관",
    sido: "경남",
    sigungu: "진주시",
    address: "경상남도 진주시 내동면 삼계로 455-46",
    summary:
      "남강 수계 취수와 농업용수, 지리산권 생활권 물 이용 스토리를 전시합니다.",
    status: "운영중",
    statusNote: "장마·태풍 시 침수 구간 통제에 유의",
    weeklyClosedDays: ["일", "월"],
    holidayClosureSummary:
      "법정공휴일, 근로자의 날 등 안내에 따른 휴관",
  },
  {
    id: "miryang",
    name: "밀양댐 물문화관",
    kind: "댐 물문화관",
    sido: "경남",
    sigungu: "밀양시",
    address: "경상남도 밀양시 단장면 고례2길 79-10",
    summary:
      "낙동강 본류 홍수 조절과 하구둑·보와 연계한 광역 수계 관리를 소개합니다.",
    status: "운영중",
    statusNote: "밀양강·낙동강 수계 연계 프로그램은 시즌별 상이",
    weeklyClosedDays: ["일", "월"],
    holidayClosureSummary:
      "법정공휴일, 설·추석 연휴 휴관 등은 시설 공지 확인",
  },
  {
    id: "hoengseong",
    name: "횡성댐 물문화관",
    kind: "댐 물문화관",
    sido: "강원",
    sigungu: "횡성군",
    address: "강원특별자치도 횡성군 갑천면 태기로구방5길 40",
    summary:
      "물의 소중함을 일깨우는 주제관과 체험관으로 구성되며, 하루 3회 물 홍보 영상을 상영합니다. 수몰지역의 역사를 보존한 「화성의 옛터」 전시관도 인접해 있습니다.",
    status: "운영중",
    statusNote: "영상 상영 시간(11:00·14:00·16:00) 사전 확인 권장",
    weeklyClosedDays: ["월"],
    holidayClosureSummary:
      "설·추석 연휴, 법정공휴일 휴관(현장 공지 확인)",
  },
  {
    id: "peace-dam",
    name: "평화의댐 물문화관",
    kind: "댐 물문화관",
    sido: "강원",
    sigungu: "화천군",
    address: "강원특별자치도 화천군 화천읍 평화로 3481-18",
    summary:
      "1987년 안보 목적으로 건설된 평화의댐의 역사·배경과 물의 역할을 전시합니다. 세계종공원·비목공원 등 주변 안보 관광지와 연계됩니다.",
    status: "운영중",
    statusNote: "관람 시간 10:00~17:00, 입장 마감 확인",
    weeklyClosedDays: ["월"],
    holidayClosureSummary:
      "설·추석 연휴, 법정공휴일 휴관",
  },
  {
    id: "geumgang",
    name: "금강문화관",
    kind: "보 문화관",
    sido: "충남",
    sigungu: "부여군",
    address: "충청남도 부여군 부여읍 북포로 451 (금강문화관, 백제보)",
    summary:
      "4대강 살리기 사업으로 조성된 금강문화관으로, 백제보 인근에서 금강과 백제 역사·문화를 함께 경험할 수 있습니다. 높이 30m 전망타워와 '빛의 공간' 등 다양한 전시가 특징입니다.",
    status: "운영중",
    statusNote: "운영시간 09:00~18:00, 전망타워·전시실 별도 안내",
    weeklyClosedDays: ["월"],
    holidayClosureSummary: "1월 1일, 법정공휴일 휴관",
  },
  {
    id: "yeongsangang",
    name: "영산강문화관",
    kind: "보 문화관",
    sido: "광주",
    sigungu: "남구",
    address: "광주광역시 남구 승촌보길 90 (영산강문화관, 승촌보)",
    summary:
      "영산강과 4대강 살리기 사업을 주제로 남도의 역사·문화·생태·환경을 체험합니다. 대지의 자연환경에 순응한 열린 공간 구성으로 옥상 경사 산책로가 인상적입니다.",
    status: "운영중",
    statusNote: "운영시간 09:00~18:00",
    weeklyClosedDays: ["월"],
    holidayClosureSummary: "1월 1일 휴관, 월요일 공휴일 시 익일 평일 휴관",
  },
  {
    id: "diarc",
    name: "디아크 문화관",
    kind: "보 문화관",
    sido: "대구",
    sigungu: "달성군",
    address: "대구광역시 달성군 다사읍 강정본길 57-1",
    summary:
      "세계적 건축가 하니 라시드가 설계한 물수제비·물고기 형상의 건축물로, 낙동강·금호강 합수지점에 자리한 강 문화 복합 공간입니다. 4대강 강문화전시실·서클영상존·전망대와 함께 야경으로도 유명합니다.",
    status: "운영중",
    statusNote: "전시 관람 10:00~17:30, 하절기 23:00·동절기 22:00까지 개방",
    weeklyClosedDays: ["월"],
    holidayClosureSummary: "1월 1일 휴관(공휴일이 월요일과 겹칠 시 운영 — 시설 공지 확인)",
  },
  {
    id: "nakdonggang",
    name: "낙동강문화관",
    kind: "보 문화관",
    sido: "부산",
    sigungu: "사하구",
    address: "부산광역시 사하구 낙동남로1233번길 1 (낙동강문화관, 낙동강하굿둑)",
    summary:
      "낙동강 하굿둑 인근에 위치한 문화관으로, 낙동강과 4대강 살리기 사업을 감성적 체험 프로그램과 미디어아트로 소개합니다. 어린이·가족 체험 시설이 충실하게 갖춰져 있습니다.",
    status: "운영중",
    statusNote: "운영시간 09:30~17:30, 낙동강하굿둑 인근 위치",
    weeklyClosedDays: ["월"],
    holidayClosureSummary: "추석·설 당일, 1월 1일 휴관",
  },
];

export const waterCenters: WaterCenter[] = waterCenterBaseList.map((row) => {
  const detail = centerDetailsById[row.id];
  if (!detail) throw new Error(`center-details 누락: ${row.id}`);
  const coordinates = centerCoords[row.id];
  if (!coordinates) throw new Error(`center-coords 누락: ${row.id}`);
  const themes = centerThemesById[row.id];
  if (!themes) throw new Error(`themes 누락: ${row.id}`);
  return { ...row, themes, ...detail, coordinates };
});

export function getCenterById(id: string): WaterCenter | undefined {
  return waterCenters.find((c) => c.id === id);
}

export const sidoList = Array.from(
  new Set(waterCenters.map((c) => c.sido)),
).sort((a, b) => a.localeCompare(b, "ko"));

/** 휴관 요일만 표기 (예: 매주 월요일, 화요일) */
export function formatWeeklyClosureSentence(
  days: readonly WeekdayHan[],
): string {
  if (days.length === 0) return "시설 안내 확인";
  const sorted = [...days].sort(
    (a, b) => WEEKDAY_ORDER.indexOf(a) - WEEKDAY_ORDER.indexOf(b),
  );
  const labels = sorted.map((d) => `${d}요일`);
  return `매주 ${labels.join(", ")}`;
}
