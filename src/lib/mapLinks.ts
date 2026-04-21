import type { WaterCenter } from "@/data/centers";

/** 네이버 지도 `/p/search/`에 넣을 검색어 — `mapSearchQuery`가 있으면 우선합니다 */
export function naverMapSearchQuery(
  center: Pick<WaterCenter, "address" | "mapSearchQuery">,
): string {
  return (center.mapSearchQuery ?? center.address).trim();
}

export function naverMapSearchHref(
  center: Pick<WaterCenter, "address" | "mapSearchQuery">,
): string {
  return `https://map.naver.com/p/search/${encodeURIComponent(naverMapSearchQuery(center))}`;
}
