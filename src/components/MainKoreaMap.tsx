"use client";

import dynamic from "next/dynamic";

const KoreaMap = dynamic(
  () => import("@/components/KoreaMap").then((m) => m.KoreaMap),
  {
    ssr: false,
    loading: () => (
      <div className="flex min-h-[440px] items-center justify-center rounded-2xl border border-slate-200 bg-slate-50">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-sky-500 border-t-transparent" />
          <p className="text-sm text-slate-400">전국 현황지도를 불러오는 중입니다...</p>
        </div>
      </div>
    ),
  }
);

export function MainKoreaMap() {
  return <KoreaMap />;
}
