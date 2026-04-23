import Link from "next/link";
import { ReservationForm } from "@/components/ReservationForm";
import { isReservationsLive } from "@/lib/reservationsConfig";
import { STAFF_CONSOLE_HREF } from "@/lib/sitePaths";

export const metadata = {
  title: "가이드 투어 예약 | 물문화관",
  description: "K-water 물문화관 가이드 투어를 예약하세요.",
};

type Props = { searchParams: Promise<{ center?: string }> };

export default async function ReservePage({ searchParams }: Props) {
  const { center } = await searchParams;
  const reservationsLive = isReservationsLive();

  return (
    <div className="min-h-screen bg-white text-slate-900">
      {/* 다크 헤더 */}
      <header className="sticky top-0 z-40 border-b border-white/10 bg-[#0b111e]/98">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-3 px-6 py-4 sm:px-10">
          <Link href="/" className="flex items-center gap-2 text-sm font-medium text-white/60 transition hover:text-white">
            <span aria-hidden>←</span> 홈으로
          </Link>
          <div className="flex items-center gap-3">
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-sky-500 text-xs font-black text-white">K</span>
            <span className="text-sm font-bold text-white">물문화관</span>
          </div>
          <Link
            href={STAFF_CONSOLE_HREF}
            className="inline-flex min-h-[44px] items-center text-sm text-white/50 transition hover:text-white"
          >
            운영 콘솔
          </Link>
        </div>
      </header>

      {/* 다크 히어로 타이틀 */}
      <div className="relative overflow-hidden bg-[#0b111e]">
        <div className="pointer-events-none absolute inset-0" aria-hidden>
          <div className="absolute left-1/3 top-0 h-60 w-60 -translate-x-1/2 rounded-full bg-sky-600/15 blur-[80px]" />
        </div>
        <div className="relative mx-auto max-w-5xl px-6 py-16 sm:px-10 sm:py-24 text-center">
          <p className="text-xs font-bold uppercase tracking-widest text-sky-400">
            GUIDED TOUR
          </p>
          <h1 className="mt-4 text-3xl font-black tracking-tight text-white sm:text-4xl">
            가이드 투어 예약
          </h1>
          <p className="mt-4 text-sm leading-relaxed text-white/50">
            문화관·날짜·시간을 선택하고 방문자 정보를 입력하면 예약이 접수됩니다.
            <br className="hidden sm:block" />
            담당자 확인 후 예약이 확정됩니다.
          </p>
        </div>
      </div>

      {/* 폼 */}
      <main className="mx-auto max-w-5xl px-6 py-14 sm:px-10">
        <ReservationForm defaultCenterId={center} reservationsLive={reservationsLive} />
      </main>

      <footer className="border-t border-slate-100 bg-[#0b111e] py-10">
        <p className="text-center text-xs text-white/30">
          © {new Date().getFullYear()} K-water 물문화관 · 문의는 해당 시설 담당자에게 연락하세요.
        </p>
      </footer>
    </div>
  );
}
