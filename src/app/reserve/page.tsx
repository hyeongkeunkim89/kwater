import { ReservationForm } from "@/components/ReservationForm";
import { isReservationsLive } from "@/lib/reservationsConfig";
import { WaterHubHeader } from "@/components/WaterHubHeader";
import { WaterHubFooter } from "@/components/WaterHubFooter";

export const metadata = {
  title: "가이드 투어 예약 | K-water 물문화관",
  description: "K-water 물문화관 가이드 투어를 예약하세요.",
};

type Props = { searchParams: Promise<{ center?: string }> };

export default async function ReservePage({ searchParams }: Props) {
  const { center } = await searchParams;
  const reservationsLive = isReservationsLive();

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col justify-between">
      <WaterHubHeader activeNav="reserve" />

      {/* 다크 히어로 타이틀 */}
      <div className="relative overflow-hidden bg-[#0b111e] shrink-0">
        <div className="pointer-events-none absolute inset-0" aria-hidden>
          <div className="absolute left-1/3 top-0 h-60 w-60 -translate-x-1/2 rounded-full bg-sky-600/15 blur-[80px]" />
        </div>
        <div className="relative mx-auto max-w-5xl px-6 py-12 sm:px-10 sm:py-16 text-center">
          <p className="text-xs font-bold uppercase tracking-widest text-sky-400">
            GUIDED TOUR
          </p>
          <h1 className="mt-3 text-3xl font-black tracking-tight text-white sm:text-4xl">
            가이드 투어 예약
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-white/50">
            문화관·날짜·시간을 선택하고 방문자 정보를 입력하면 예약이 접수됩니다.
            <br className="hidden sm:block" />
            담당자 확인 후 예약이 확정됩니다.
          </p>
        </div>
      </div>

      {/* 폼 */}
      <main className="mx-auto max-w-5xl w-full px-6 py-10 sm:px-10 flex-1">
        <ReservationForm defaultCenterId={center} reservationsLive={reservationsLive} />
      </main>

      <WaterHubFooter />
    </div>
  );
}
