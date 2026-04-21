import type { WaterCenter, WeekdayHan } from "@/data/centers";
import { WEEKDAY_ORDER } from "@/data/centers";

export type DisplayStatus = "운영중" | "오늘 휴관" | "임시휴관";

export const displayStatusStyles: Record<DisplayStatus, { badge: string }> = {
  운영중: {
    badge: "bg-emerald-500/15 text-emerald-800 ring-emerald-500/25",
  },
  "오늘 휴관": {
    badge: "bg-violet-500/15 text-violet-900 ring-violet-500/30",
  },
  임시휴관: {
    badge: "bg-rose-500/15 text-rose-900 ring-rose-500/25",
  },
};

export function getSeoulWeekdayHan(): WeekdayHan {
  const long = new Intl.DateTimeFormat("ko-KR", {
    timeZone: "Asia/Seoul",
    weekday: "long",
  })
    .formatToParts(new Date())
    .find((p) => p.type === "weekday")?.value;
  const ch = long?.[0];
  if (ch && (WEEKDAY_ORDER as readonly string[]).includes(ch)) {
    return ch as WeekdayHan;
  }
  return "월";
}

export function resolveDisplayStatus(
  c: WaterCenter,
  today: WeekdayHan,
): DisplayStatus {
  if (c.status === "점검·휴관" || c.status === "준비중") return "임시휴관";
  if (c.weeklyClosedDays.includes(today)) return "오늘 휴관";
  return "운영중";
}

/** 시설명 아래 등에 쓰는 한 줄 지역 표기 */
export function formatCenterRegionLine(
  c: Pick<WaterCenter, "sido" | "sigungu">,
): string {
  return `${c.sido} · ${c.sigungu}`;
}
