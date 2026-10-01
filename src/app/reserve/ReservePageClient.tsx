"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { ReservationForm } from "@/components/ReservationForm";
import { ReservationLookupCard } from "@/components/ReservationLookupCard";

export default function ReservePageClient({
  reservationsLive,
}: {
  reservationsLive: boolean;
}) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const defaultCenter = searchParams.get("center") || undefined;
  const initialTabParam = searchParams.get("tab");

  const [activeTab, setActiveTab] = useState<"apply" | "lookup">(() => {
    if (initialTabParam === "lookup" || initialTabParam === "check" || initialTabParam === "2") {
      return "lookup";
    }
    return "apply";
  });

  useEffect(() => {
    if (initialTabParam === "lookup" || initialTabParam === "check" || initialTabParam === "2") {
      setActiveTab("lookup");
    } else if (initialTabParam === "apply" || initialTabParam === "form" || initialTabParam === "1") {
      setActiveTab("apply");
    }
  }, [initialTabParam]);

  const handleTabChange = (tab: "apply" | "lookup") => {
    setActiveTab(tab);
    const params = new URLSearchParams(searchParams.toString());
    params.set("tab", tab);
    router.replace(`/reserve?${params.toString()}`, { scroll: false });
  };

  return (
    <main className="mx-auto max-w-5xl w-full px-4 sm:px-6 lg:px-8 py-8 sm:py-12 flex-1">
      {/* 1. 상단 전환용 세그먼트 탭(Tab) 컴포넌트 */}
      <div className="flex justify-center mb-8 sm:mb-10">
        <div className="inline-flex p-1.5 rounded-2xl bg-slate-200/80 border border-slate-300/60 shadow-inner w-full max-w-lg sm:max-w-xl">
          <button
            type="button"
            onClick={() => handleTabChange("apply")}
            className={`flex-1 py-3 px-3 sm:px-5 rounded-xl text-xs sm:text-sm font-black transition-all duration-200 flex items-center justify-center gap-2 ${
              activeTab === "apply"
                ? "bg-white text-sky-700 shadow-md ring-1 ring-black/5"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <span
              className={`flex h-5 w-5 items-center justify-center rounded-full text-[11px] font-extrabold shrink-0 ${
                activeTab === "apply" ? "bg-sky-600 text-white" : "bg-slate-400 text-white"
              }`}
            >
              1
            </span>
            <span>가이드 투어 예약 신청</span>
          </button>

          <button
            type="button"
            onClick={() => handleTabChange("lookup")}
            className={`flex-1 py-3 px-3 sm:px-5 rounded-xl text-xs sm:text-sm font-black transition-all duration-200 flex items-center justify-center gap-2 ${
              activeTab === "lookup"
                ? "bg-white text-emerald-700 shadow-md ring-1 ring-black/5"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <span
              className={`flex h-5 w-5 items-center justify-center rounded-full text-[11px] font-extrabold shrink-0 ${
                activeTab === "lookup" ? "bg-emerald-600 text-white" : "bg-slate-400 text-white"
              }`}
            >
              2
            </span>
            <span>예약 내역 조회 & 취소</span>
          </button>
        </div>
      </div>

      {/* 2. 탭별 중앙 정렬 노출 영역 */}
      <div className="max-w-3xl mx-auto">
        {activeTab === "apply" ? (
          <section className="space-y-6 animate-in fade-in duration-200">
            <div className="flex items-center gap-2.5 pb-3 border-b border-slate-200/80 mb-4">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-sky-600 text-white text-xs font-extrabold shadow-sm shrink-0">
                1
              </span>
              <h2 className="text-xl font-black text-slate-900 tracking-tight">
                가이드 투어 예약 신청
              </h2>
            </div>
            <ReservationForm defaultCenterId={defaultCenter} reservationsLive={reservationsLive} />
          </section>
        ) : (
          <section className="space-y-6 animate-in fade-in duration-200">
            <div className="flex items-center gap-2.5 pb-3 border-b border-slate-200/80 mb-4">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-600 text-white text-xs font-extrabold shadow-sm shrink-0">
                2
              </span>
              <h2 className="text-xl font-black text-slate-900 tracking-tight">
                예약 내역 조회 & 취소
              </h2>
            </div>
            <ReservationLookupCard />
          </section>
        )}
      </div>
    </main>
  );
}
