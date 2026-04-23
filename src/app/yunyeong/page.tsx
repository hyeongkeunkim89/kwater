import { AdminDashboard } from "@/components/AdminDashboard";
import { isReservationsLive } from "@/lib/reservationsConfig";
import { STAFF_CONSOLE_HREF } from "@/lib/sitePaths";
import { isWaterStoriesLive } from "@/lib/storiesConfig";
import { adminStoriesConfigured } from "@/lib/waterStoriesAdminAuth";
import Link from "next/link";

export const metadata = {
  title: "문화관 운영 콘솔 | 물문화관",
  description: "가이드 투어 예약 현황과 물 이야기 사진을 한 곳에서 관리합니다.",
  robots: { index: false, follow: false },
};

export default function YunyeongConsolePage() {
  const storiesLive = isWaterStoriesLive();
  const reservationsLive = isReservationsLive();
  const adminSecretConfigured = adminStoriesConfigured();

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="sticky top-0 z-40 border-b border-white/10 bg-[#0b111e]/98">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-6 py-4 sm:px-10">
          <div className="flex items-center gap-3">
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-sky-500 text-xs font-black text-white">K</span>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-sky-400">Console</p>
              <p className="text-sm font-bold leading-none text-white">문화관 운영 콘솔</p>
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

      <div className="border-b border-slate-200 bg-white px-6 py-5 sm:px-10">
        <div className="mx-auto max-w-7xl">
          <p className="text-xs font-bold uppercase tracking-widest text-sky-600">Operations</p>
          <h1 className="mt-1 text-2xl font-black tracking-tight text-slate-900">
            예약·콘텐츠 현황
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-slate-500">
            가이드 투어 예약을 확인·처리하고, 물 이야기 갤러리를 같은 비밀번호로 관리합니다. 북마크는{" "}
            <span className="font-mono text-slate-700">{STAFF_CONSOLE_HREF}</span> 로 맞춰 주세요.
          </p>
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
          © {new Date().getFullYear()} K-water 물문화관 · 운영 콘솔
        </p>
      </footer>
    </div>
  );
}
