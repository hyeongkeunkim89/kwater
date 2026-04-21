import Link from "next/link";
import { CenterExplorer } from "@/components/CenterExplorer";
import { WaterHubFooter } from "@/components/WaterHubFooter";
import { WaterHubHeader } from "@/components/WaterHubHeader";

export const metadata = {
  title: "문화관 현황 | 물문화관 홍보 허브",
  description:
    "전국 K-water 물문화관을 지도·목록으로 확인하고, 시·도별로 찾아보세요.",
};

export default function StatusPage() {
  return (
    <div className="min-h-screen bg-white text-slate-900">
      <WaterHubHeader activeNav="status" />

      <div className="border-b border-slate-200 bg-slate-50/80">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-3 px-6 py-3 text-sm text-slate-600 sm:px-10">
          <Link
            href="/"
            className="font-medium text-sky-700 transition hover:text-sky-900"
          >
            ← 홈으로
          </Link>
          <span className="text-slate-300" aria-hidden>
            /
          </span>
          <span className="text-slate-500">문화관 현황</span>
        </div>
      </div>

      <main className="mx-auto max-w-7xl px-6 py-12 sm:px-10 sm:py-16">
        <div className="mb-12 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-sky-600">
              Overview
            </p>
            <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
              K-water 문화관 현황
            </h1>
          </div>
          <p className="max-w-sm text-sm leading-relaxed text-slate-500">
            지도 핀을 눌러 문화관을 확인하거나, 목록 탭에서 시·도별로 조회하세요.
          </p>
        </div>

        <CenterExplorer />
      </main>

      <WaterHubFooter />
    </div>
  );
}
