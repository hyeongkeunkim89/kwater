"use client";

import { useMemo } from "react";
import type { WaterCenter } from "@/data/centers";
import {
  displayStatusStyles,
  getSeoulWeekdayHan,
  resolveDisplayStatus,
} from "@/lib/center-display";

export function CenterDetailLiveStatus({ center }: { center: WaterCenter }) {
  const todaySeoul = useMemo(() => getSeoulWeekdayHan(), []);
  const display = resolveDisplayStatus(center, todaySeoul);

  return (
    <div className="flex flex-col items-start gap-1 sm:items-end">
      <span
        className={`inline-flex rounded-full px-3 py-1 text-sm font-semibold ring-1 ring-inset ${displayStatusStyles[display].badge}`}
      >
        {display}
      </span>
      {display === "오늘 휴관" ? (
        <span className="text-xs text-slate-500">
          등록 상태(장기): {center.status}
        </span>
      ) : null}
      <span className="text-xs text-slate-500">
        오늘(서울): <strong>{todaySeoul}요일</strong>
      </span>
    </div>
  );
}
