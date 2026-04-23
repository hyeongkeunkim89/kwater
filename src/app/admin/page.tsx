import { AdminDashboard } from "@/components/AdminDashboard";
import { isReservationsLive } from "@/lib/reservationsConfig";
import { isWaterStoriesLive } from "@/lib/storiesConfig";
import { adminStoriesConfigured } from "@/lib/waterStoriesAdminAuth";
import Link from "next/link";

export const metadata = {
  title: "예약 관리 | 물문화관",
};

export default function AdminPage() {
  const storiesLive = isWaterStoriesLive();
  const reservationsLive = isReservationsLive();
  const adminSecretConfigured = adminStoriesConfigured();

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      {/* 다크 헤더 */}
      <header className="sticky top-0 z-40 border-b border-white/10 bg-[#0b111e]/98">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-6 py-4 sm:px-10">
          <div className="flex items-center gap-3">
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-sky-500 text-xs font-black text-white">K</span>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-sky-400">Admin</p>
              <p className="text-sm font-bold leading-none text-white">예약 관리</p>
            </div>
          </div>
          <div className="flex gap-3">
            <Link
              href="/reserve"
              className="rounded-full bg-sky-500 px-4 py-1.5 text-sm font-bold text-white transition hover:bg-sky-400"
            >
              + 예약 신청
            </Link>
            <Link
              href="/"
              className="rounded-full border border-white/20 px-4 py-1.5 text-sm text-white/60 transition hover:border-white/50 hover:text-white"
            >
              홈으로
            </Link>
          </div>
        </div>
      </header>

      {/* 서브 타이틀 바 */}
      <div className="border-b border-slate-200 bg-white px-6 py-5 sm:px-10">
        <div className="mx-auto max-w-7xl">
          <p className="text-xs font-bold uppercase tracking-widest text-sky-600">
            Guided Tour
          </p>
          <h1 className="mt-1 text-2xl font-black tracking-tight text-slate-900">
            가이드 투어 예약 현황
          </h1>
        </div>
      </div>

      <main className="mx-auto max-w-7xl px-6 py-10 sm:px-10">
        <AdminDashboard
          storiesLive={storiesLive}
          reservationsLive={reservationsLive}
          adminSecretConfigured={adminSecretConfigured}
        />
      </main>

      <footer className="mt-8 border-t border-slate-200 bg-[#0b111e] py-10">
        <p className="text-center text-xs text-white/30">
          © {new Date().getFullYear()} K-water 물문화관 관리자
        </p>
      </footer>
    </div>
  );
}
