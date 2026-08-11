import { CenterExplorer } from "@/components/CenterExplorer";
import { WaterHubHeader } from "@/components/WaterHubHeader";

export const metadata = {
  title: "문화관 현황 | 물문화관 홍보 허브",
  description:
    "전국 K-water 물문화관을 지도·목록으로 확인하고, 시·도별로 찾아보세요.",
};

export default function StatusPage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col justify-between">
      <WaterHubHeader activeNav="status" />

      {/* 웅장하고 밝은 히어로 타이틀 */}
      <div className="relative overflow-hidden bg-gradient-to-r from-sky-50 to-indigo-50 border-b border-slate-200/80 shrink-0">
        <div className="pointer-events-none absolute inset-0" aria-hidden>
          <div className="absolute right-1/4 top-0 h-48 w-48 rounded-full bg-sky-500/5 blur-[80px]" />
        </div>
        <div className="relative mx-auto max-w-7xl px-6 py-12 sm:px-8 text-center sm:text-left">
          <span className="text-xs font-bold uppercase tracking-widest text-sky-600">
            OVERVIEW & MAP
          </span>
          <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
            K-water 문화관 현황
          </h1>
          <p className="mt-2 text-sm text-slate-500 leading-relaxed max-w-xl font-semibold">
            전국 15대 댐 유역에 조성된 물문화관의 운영 정보와 실시간 관람 가능 상태를 지도와 목록에서 편리하게 조회하세요.
          </p>
        </div>
      </div>

      <main className="mx-auto max-w-7xl w-full px-6 py-10 sm:px-8 flex-1">
        <CenterExplorer />
      </main>
    </div>
  );
}
