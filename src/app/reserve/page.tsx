import { ReservationForm } from "@/components/ReservationForm";
import { ReservationLookupCard } from "@/components/ReservationLookupCard";
import { isReservationsLive } from "@/lib/reservationsConfig";
import { WaterHubHeader } from "@/components/WaterHubHeader";
import { WaterHubFooter } from "@/components/WaterHubFooter";

export const metadata = {
  title: "가이드 투어 예약 & 조회 | K-water 물문화관",
  description: "K-water 물문화관 가이드 투어 예약 신청 및 실시간 예약 내역 조회를 한번에 이용하세요.",
};

type Props = { searchParams: Promise<{ center?: string }> };

export default async function ReservePage({ searchParams }: Props) {
  const { center } = await searchParams;
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
            원하시는 물문화관의 투어를 새롭게 예약 신청하거나, 기존에 신청하신 예약 내역을 조회·취소
          </p>
        </div>
      </div>

      {/* 메인 2열 레이아웃 (왼쪽: 예약 접수, 오른쪽: 예약 조회) */}
      <main className="mx-auto max-w-7xl w-full px-4 sm:px-6 lg:px-8 py-8 sm:py-12 flex-1">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
          {/* 1. 왼쪽: 가이드 투어 예약 접수 */}
          <section className="lg:col-span-7 space-y-6 min-w-0">
            <div className="flex items-center gap-2.5 pb-3 border-b border-slate-200/80 mb-4">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-sky-600 text-white text-xs font-extrabold shadow-sm shrink-0">
                1
              </span>
              <h2 className="text-xl font-black text-slate-900 tracking-tight">
                가이드 투어 예약 접수
              </h2>
            </div>
            <div className="pt-1">
              <ReservationForm defaultCenterId={center} reservationsLive={reservationsLive} />
            </div>
          </section>

          {/* 2. 오른쪽: 예약 신청 내역 조회 & 관리 */}
          <section className="lg:col-span-5 space-y-6 min-w-0">
            <div className="flex items-center gap-2.5 pb-3 border-b border-slate-200/80 mb-4">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-600 text-white text-xs font-extrabold shadow-sm shrink-0">
                2
              </span>
              <h2 className="text-xl font-black text-slate-900 tracking-tight">
                예약 내역 조회 & 취소
              </h2>
            </div>
            <div className="pt-1">
              <ReservationLookupCard />
            </div>
          </section>
        </div>
      </main>

      <WaterHubFooter />
    </div>
  );
}
