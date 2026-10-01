import { Suspense } from "react";
import { isReservationsLive } from "@/lib/reservationsConfig";
import { WaterHubHeader } from "@/components/WaterHubHeader";
import { WaterHubFooter } from "@/components/WaterHubFooter";
import ReservePageClient from "./ReservePageClient";

export const metadata = {
  title: "가이드 투어 예약 & 조회 | K-water 물문화관",
  description: "K-water 물문화관 가이드 투어 예약 신청 및 실시간 예약 내역 조회를 한번에 이용하세요.",
};

export default function ReservePage() {
  const reservationsLive = isReservationsLive();

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col justify-between">
      <WaterHubHeader activeNav="reserve" />

      {/* 라이트 히어로 타이틀 */}
      <div className="relative overflow-hidden bg-gradient-to-r from-sky-50 to-indigo-50 border-b border-slate-200/80 shrink-0">
        <div className="pointer-events-none absolute inset-0" aria-hidden>
          <div className="absolute right-1/4 top-0 h-48 w-48 rounded-full bg-teal-50/5 blur-[80px]" />
        </div>
        <div className="relative mx-auto max-w-7xl px-6 py-10 sm:px-8 text-left">
          <span className="text-xs font-extrabold uppercase tracking-widest text-[#2F9FF3]">
            GUIDED TOUR & LOOKUP
          </span>
          <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
            가이드 투어 예약 및 조회
          </h1>
          <p className="mt-2.5 text-sm sm:text-base text-slate-600 leading-relaxed font-semibold max-w-3xl">
            원하시는 물문화관의 투어를 새롭게 예약 신청하거나, 기존에 신청하신 예약 내역을 조회·취소하실 수 있습니다.
          </p>
        </div>
      </div>

      <Suspense fallback={<div className="py-20 text-center text-sm font-semibold text-slate-500">로딩 중...</div>}>
        <ReservePageClient reservationsLive={reservationsLive} />
      </Suspense>

      <WaterHubFooter />
    </div>
  );
}
