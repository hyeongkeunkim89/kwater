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
  "기술",
  "생태",
  "문화",
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

/** 시설 id별 테마(문화관 현황·필터용, 첫 번째가 대표 테마) */
const centerThemesById: Record<string, readonly CenterTheme[]> = {
  soyang: ["역사", "기술"],
  andong: ["역사", "문화"],
  hoengseong: ["역사", "문화"],
  "peace-dam": ["역사", "기술"],
  chungju: ["기술", "문화"],
  hapcheon: ["기술", "생태"],
  daecheong: ["생태", "역사"],
  yongdam: ["생태", "문화"],
  juam: ["생태", "기술"],
  jangheung: ["생태", "문화"],
  buan: ["생태", "역사"],
  hantan: ["생태", "문화"],
  namgang: ["문화", "역사"],
  miryang: ["문화", "생태"],
  gimcheon: ["문화", "기술"],
};

const waterCenterBaseList: WaterCenterBase[] = [
  // 🏛️ 역사 (History - 4개소)
  {
    id: "soyang",
    name: "소양강댐 물문화관",
    kind: "댐 물문화관",
    sido: "강원",
    sigungu: "춘천시",
    address: "강원특별자치도 춘천시 신북읍 신샘밭로 1128",
    summary:
      "동양 최대 사급댐 건설사 및 수몰민 사료 중심의 근대 치수 역사관입니다.",
    status: "운영중",
    statusNote: "기상·시설 점검에 따라 일시 휴관 가능",
    weeklyClosedDays: ["월"],
    holidayClosureSummary: "설·추석 연휴, 법정공휴일 등은 시설 공지 확인",
  },
  {
    id: "andong",
    name: "안동댐 물문화관",
    kind: "댐 물문화관",
    sido: "경북",
    sigungu: "안동시",
    address: "경상북도 안동시 석주로 383",
    summary:
      "안동 유교 문화재 보존 및 수몰 역사를 중심으로 기록·전시하는 전통 역사관입니다.",
    status: "운영중",
    statusNote: "전망대·전시실 관람 시간 확인",
    weeklyClosedDays: ["월"],
    holidayClosureSummary: "설·추석 연휴, 법정공휴일 휴관",
  },
  {
    id: "hoengseong",
    name: "횡성댐 물문화관",
    kind: "댐 물문화관",
    sido: "강원",
    sigungu: "횡성군",
    address: "강원특별자치도 횡성군 갑천면 태기로구방5길 40",
    summary:
      "5개 수몰 마을 망향의 동산 및 향수를 보존하는 연계 역사 사료관입니다.",
    status: "운영중",
    statusNote: "영상 상영 시간(11:00·14:00·16:00) 사전 확인 권장",
    weeklyClosedDays: ["월"],
    holidayClosureSummary: "설·추석 연휴, 법정공휴일 휴관(현장 공지 확인)",
  },
  {
    id: "peace-dam",
    name: "평화의댐 물문화관",
    kind: "댐 물문화관",
    sido: "강원",
    sigungu: "화천군",
    address: "강원특별자치도 화천군 화천읍 평화로 3481-18",
    summary:
      "세계평화의 종, 남북 분단과 안보 역사의 기억을 전달하는 역사 안보관입니다.",
    status: "운영중",
    statusNote: "관람 시간 10:00~17:00, 입장 마감 확인",
    weeklyClosedDays: ["월"],
    holidayClosureSummary: "설·추석 연휴, 법정공휴일 휴관",
  },

  // 💡 기술 (Technology - 2개소)
  {
    id: "chungju",
    name: "충주댐 물문화관",
    kind: "댐 물문화관",
    sido: "충북",
    sigungu: "충주시",
    address: "충청북도 충주시 동량면 지등로 745",
    summary:
      "충주댐과 충주호를 중심으로, K-water의 첨단 스마트 수자원 관리 기술과 댐 본체 미디어파사드 연출을 관람할 수 있습니다.",
    status: "운영중",
    statusNote: "입장 마감·주차 등은 시설 안내 확인",
    weeklyClosedDays: ["월"],
    holidayClosureSummary: "설·추석 연휴, 법정공휴일 및 시설 점검일 휴관 가능",
  },
  {
    id: "hapcheon",
    name: "합천댐 물문화관",
    kind: "댐 물문화관",
    sido: "경남",
    sigungu: "합천군",
    address: "경상남도 합천군 대병면 회양리 14-1",
    summary:
      "세계 최대 붕어모양 수상태양광과 친환경 신재생 물 에너지 기술을 조망하는 미래 기술관입니다.",
    status: "운영중",
    statusNote: "시설 관람 및 주차 안내 확인",
    weeklyClosedDays: ["월"],
    holidayClosureSummary: "설·추석 연휴, 법정공휴일 휴관",
  },

  // 🍃 생태 (Ecology - 6개소)
  {
    id: "daecheong",
    name: "대청댐 물문화관",
    kind: "댐 물문화관",
    sido: "대전",
    sigungu: "대덕구",
    address: "대전광역시 대덕구 대청로 618-136",
    summary:
      "대청호 수생태계 보전과 금강 유역 민물고기 수족관 교육 중심의 청정 생태관입니다.",
    status: "점검·휴관",
    statusNote: "그린리모델링·전시 리뉴얼 — 2026년 11월 말까지 임시 휴관 예정",
    weeklyClosedDays: ["월"],
    holidayClosureSummary: "설·추석 당일 등 명절·법정공휴일 휴관(연도별 공지 확인)",
    visitorNotice:
      "그린리모델링 공사 및 전시 리뉴얼로 현재 임시 휴관 중입니다. 휴관은 2026년 11월 말까지 예정되어 있으며, 재개 일정·변동 사항은 시설 현장 안내와 K-water 공식 공지를 확인해 주세요.",
  },
  {
    id: "yongdam",
    name: "용담댐 물문화관",
    kind: "댐 물문화관",
    sido: "전북",
    sigungu: "진안군",
    address: "전북특별자치도 진안군 안천면 안용로 747",
    summary:
      "용담호 습지 및 숲 생태를 직접 관찰하는 6대 테마 정원 중심의 생태관입니다.",
    status: "운영중",
    statusNote: "동절기 결빙·안개로 운영 시간 변동 가능",
    weeklyClosedDays: ["월"],
    holidayClosureSummary: "설·추석 연휴, 법정공휴일·기상 악화 시 휴관 가능",
  },
  {
    id: "juam",
    name: "주암댐 물문화관",
    kind: "댐 물문화관",
    sido: "전남",
    sigungu: "순천시",
    address: "전라남도 순천시 상사면 상사호길 555",
    summary:
      "순천만 생태축 연계 주암호 수질과 습지 생태계를 보전하는 교육관입니다.",
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
      "탐진강 청정 유역 수생생물 관찰 및 습지 체험 중심의 수생태관입니다.",
    status: "운영중",
    statusNote: "체험·단체 관람은 사전 예약 여부 확인",
    weeklyClosedDays: ["월"],
    holidayClosureSummary: "설·추석, 법정공휴일 및 지자체·시설 사정에 따른 휴관",
  },
  {
    id: "buan",
    name: "부안댐 물문화관",
    kind: "댐 물문화관",
    sido: "전북",
    sigungu: "부안군",
    address: "전북특별자치도 부안군 변산면 부안댐로 290",
    summary:
      "변산반도 국립공원 청정 생태 보호 및 자연 환경 학습 중심의 국립공원 생태관입니다.",
    status: "운영중",
    statusNote: "점심시간(12:00~13:00) 휴게 등 시설 안내 확인",
    weeklyClosedDays: ["월"],
    holidayClosureSummary:
      "설·추석 연휴, 법정공휴일·업체 사정에 따른 추가 휴무 가능",
  },
  {
    id: "hantan",
    name: "한탄강댐 물문화관",
    kind: "댐 물문화관",
    sido: "경기",
    sigungu: "연천군",
    address: "경기도 연천군 연천읍 고문리 902",
    summary:
      "UNESCO 세계지질공원 주상절리 및 지질 생태 가치를 지키는 지질 생태관입니다.",
    status: "운영중",
    statusNote: "댐 구역·인접 군사지역 통행 제한이 있을 수 있음",
    weeklyClosedDays: ["월"],
    holidayClosureSummary: "설·추석, 법정공휴일·긴급 점검 시 휴관(현장 공지)",
  },

  // 🎭 문화 (Culture - 3개소)
  {
    id: "namgang",
    name: "남강댐 물문화관",
    kind: "댐 물문화관",
    sido: "경남",
    sigungu: "진주시",
    address: "경상남도 진주시 내동면 삼계로 455-46",
    summary:
      "진주 남강유등축제 연계 및 수변 미술 갤러리와 쉼터가 어우러진 복합 문화 공간입니다.",
    status: "운영중",
    statusNote: "장마·태풍 시 침수 구간 통제에 유의",
    weeklyClosedDays: ["일", "월"],
    holidayClosureSummary: "법정공휴일, 근로자의 날 등 안내에 따른 휴관",
  },
  {
    id: "miryang",
    name: "밀양댐 물문화관",
    kind: "댐 물문화관",
    sido: "경남",
    sigungu: "밀양시",
    address: "경상남도 밀양시 단장면 고례2길 79-10",
    summary:
      "밀양댐 수변공원 연계 주민 여가 문화공간 및 피크닉 쉼터를 제공합니다.",
    status: "운영중",
    statusNote: "밀양강·낙동강 수계 연계 프로그램은 시즌별 상이",
    weeklyClosedDays: ["일", "월"],
    holidayClosureSummary: "법정공휴일, 설·추석 연휴 휴관 등은 시설 공지 확인",
  },
  {
    id: "gimcheon",
    name: "김천부항댐 물문화관",
    kind: "댐 물문화관",
    sido: "경북",
    sigungu: "김천시",
    address: "경상북도 김천시 부항면 부항댐길 352",
    summary:
      "국내 최고 짚와이어, 출렁다리, 스카이워크 수변 레저 문화를 선도하는 레저 문화 거점입니다.",
    status: "운영중",
    statusNote: "철새 도래기에는 주변 도로 통제 안내가 있을 수 있음",
    weeklyClosedDays: ["월"],
    holidayClosureSummary: "설·추석, 법정공휴일 및 시설 점검 시 휴관",
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
