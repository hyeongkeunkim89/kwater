import type { CenterTheme, WeekdayHan } from "@/data/centers";
import type { DisplayStatus } from "@/lib/center-display";

/** SSR·하이드레이션 직전 고정 요일 (마운트 후 실제 요일로 교체) */
export const HYDRATION_WEEKDAY_PLACEHOLDER: WeekdayHan = "월";

/**
 * 문화관 현황(목록·지도) UI 문구 — UTF-8 소스로 유지해 표시 깨짐을 방지합니다.
 */
export const centerExplorerUi = {
  mapLoading: "지도 로딩 중…",
  listTab: "목록으로 보기",
  mapTab: "지도로 보기",
  searchPlaceholder: "문화관 이름, 지역, 테마로 검색…",
  clearSearch: "검색어 지우기",
  sidoLabel: "시·도",
  themeLabel: "테마",
  themeFilterAll: "전체",
  allSido: "전체",
  statsSuffix: (n: number, total: number, weekday: string) =>
    `${n} / ${total}곳 표시 중 · 오늘 ${weekday}요일`,
  emptyNoQuery: "선택한 시·도에 해당하는 시설이 없습니다.",
  emptyWithQuery: (q: string) => `"${q}"에 해당하는 시설이 없습니다.`,
  resetSearch: "검색어 초기화",
  location: "위치",
  weeklyClosed: "휴관일",
} as const;

export const koreaMapUi = {
  legendOperating: "운영 상태",
  legendRegions: "지역 구분",
  regionLabels: [
    { label: "수도권·경기", color: "#bfdbfe" },
    { label: "강원", color: "#dcfce7" },
    { label: "충청", color: "#fef9c3" },
    { label: "전라", color: "#fed7aa" },
    { label: "경상", color: "#e9d5ff" },
    { label: "제주", color: "#fbcfe8" },
  ] as const,
  emptyTitle: "지도에서 방울이를 선택하세요",
  emptyBodyLine1: "물문화관 시설현황·층별 안내·",
  emptyBodyLine2: "위치 정보를 확인할 수 있습니다.",
  panelClose: "패널 닫기",
  facilitySummary: "시설현황",
  address: "위치",
  weeklyOff: "휴관일",
  detail: "상세 보기",
  openMap: "지도 열기",
} as const;

/** 운영 상태 집계 순서 (데이터 타입과 동일한 문자열) */
export const STATS_ORDER: DisplayStatus[] = ["운영중", "오늘 휴관", "임시휴관"];

export function emptyDisplayStatusCounts(): Record<DisplayStatus, number> {
  return { 운영중: 0, "오늘 휴관": 0, 임시휴관: 0 };
}

/** 목록·카드에서 테마 뱃지 스타일 */
export const centerThemeBadgeClass: Record<CenterTheme, string> = {
  역사: "bg-amber-50 text-amber-900 ring-amber-200/90",
  생태: "bg-emerald-50 text-emerald-900 ring-emerald-200/90",
  기술: "bg-sky-50 text-sky-900 ring-sky-200/90",
  "체험·교육": "bg-violet-50 text-violet-900 ring-violet-200/90",
  "건축·조망": "bg-slate-100 text-slate-800 ring-slate-300/90",
};

export const centerThemeSectionAccent: Record<CenterTheme, string> = {
  역사: "border-l-4 border-l-amber-400",
  생태: "border-l-4 border-l-emerald-400",
  기술: "border-l-4 border-l-sky-400",
  "체험·교육": "border-l-4 border-l-violet-400",
  "건축·조망": "border-l-4 border-l-slate-400",
};
