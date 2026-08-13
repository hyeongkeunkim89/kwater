"use client";

import { useState } from "react";
import Link from "next/link";
import { waterCenters, type WaterCenter, WEEKDAY_ORDER } from "@/data/centers";

const REGION_TABS = [
  { id: "ALL", label: "전체 (15개소)" },
  { id: "GANGWON_GYEONGGI", label: "경기·강원", sidos: ["경기", "강원"] },
  { id: "CHUNGCHEONG", label: "대전·충청", sidos: ["대전", "충북"] },
  { id: "JEONLA", label: "전라", sidos: ["전북", "전남"] },
  { id: "GYEONGSANG", label: "경상", sidos: ["경북", "경남"] },
];

export function QuickCenterFinder() {
  const [selectedRegion, setSelectedRegion] = useState("ALL");

  // 오늘 요일 판별 (한국 시간 기준)
  const getTodayHan = () => {
    const dayIdx = new Date().getDay(); // 0: 일, 1: 월, 2: 화...
    const map = ["일", "월", "화", "수", "목", "금", "토"] as const;
    return map[dayIdx];
  };

  const todayHan = getTodayHan();

  // 지역별 필터링
  const filteredCenters = waterCenters.filter((center) => {
    if (selectedRegion === "ALL") return true;
    const tab = REGION_TABS.find((t) => t.id === selectedRegion);
    return tab?.sidos?.includes(center.sido);
  });

  const getRealtimeStatus = (center: WaterCenter) => {
    if (center.status === "점검·휴관") {
      return {
        badge: "bg-rose-50 text-rose-600 border-rose-200",
        label: "🔴 리뉴얼/임시 휴관",
        desc: center.visitorNotice || center.statusNote,
      };
    }
    const isClosedToday = center.weeklyClosedDays.includes(todayHan as any);
    if (isClosedToday) {
      return {
        badge: "bg-amber-50 text-amber-700 border-amber-200",
        label: `🟡 오늘 정기 휴관 (${todayHan}요일)`,
        desc: "수변 산책로 및 외관 관람은 가능합니다.",
      };
    }
    return {
      badge: "bg-emerald-50 text-emerald-700 border-emerald-200",
      label: "🟢 오늘 정상 운영 (09:00~18:00)",
      desc: "무료 관람 및 당일 방문 가능",
    };
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-7 shadow-sm">
      {/* 헤더 타이틀 */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xl" role="img" aria-label="시계">⏰</span>
            <h3 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
              실시간 관람 정보 & 물문화관 퀵 검색
            </h3>
          </div>
          <p className="text-xs text-slate-500 font-semibold mt-1">
            원하시는 지역을 선택하여 오늘의 운영 상태와 위치를 바로 확인해 보세요.
          </p>
        </div>
        <span className="self-start sm:self-auto text-[11px] font-bold text-sky-700 bg-sky-50 px-3 py-1.5 rounded-full border border-sky-100">
          오늘 ({todayHan}요일) 관람 가능 현황
        </span>
      </div>

      {/* 모바일 가로 스크롤 가능한 지역 필터 탭 */}
      <div className="mt-4 flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {REGION_TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setSelectedRegion(tab.id)}
            className={[
              "min-h-10 shrink-0 px-4 py-2 text-xs font-extrabold rounded-xl transition duration-150 whitespace-nowrap",
              selectedRegion === tab.id
                ? "bg-sky-500 text-white shadow-sm shadow-sky-500/20"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900",
            ].join(" ")}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* 물문화관 카드 리스트 (모바일 터치 스와이프 & PC 3단 그리드) */}
      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filteredCenters.map((center) => {
          const statusInfo = getRealtimeStatus(center);
          return (
            <div
              key={center.id}
              className="flex flex-col justify-between rounded-xl border border-slate-200/80 bg-slate-50/50 p-4 transition hover:border-sky-300 hover:bg-white hover:shadow-md"
            >
              <div>
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[10px] font-extrabold text-slate-500 bg-slate-200/70 px-2 py-0.5 rounded">
                    {center.sido} {center.sigungu}
                  </span>
                  <span
                    className={`text-[10px] font-black px-2 py-0.5 rounded border ${statusInfo.badge}`}
                  >
                    {statusInfo.label}
                  </span>
                </div>

                <h4 className="mt-2.5 text-base font-black text-slate-800 tracking-tight">
                  {center.name}
                </h4>

                <p className="mt-1 text-xs text-slate-500 font-medium line-clamp-2 leading-relaxed">
                  {center.summary}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-200/60 flex items-center gap-2">
                <Link
                  href={`/reserve?center=${center.id}`}
                  className="flex-1 min-h-9 inline-flex items-center justify-center rounded-lg bg-sky-500 hover:bg-sky-600 text-white text-xs font-bold transition shadow-sm"
                >
                  투어 예약 📅
                </Link>
                <Link
                  href={`/centers/${center.id}`}
                  className="min-h-9 px-3 inline-flex items-center justify-center rounded-lg bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 text-xs font-bold transition"
                >
                  상세보기 →
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
