import Link from "next/link";
import { HeroSliderWrapper } from "@/components/HeroSliderWrapper";
import { WaterHubFooter } from "@/components/WaterHubFooter";
import { WaterHubHeader } from "@/components/WaterHubHeader";
import { sidoList, waterCenters } from "@/data/centers";

export default function Home() {
  return (
    <div className="flex h-dvh max-h-dvh flex-col overflow-hidden bg-[#152035] text-white">
      <WaterHubHeader dense showStaffConsoleLink />

      <section
        aria-label="물문화관 소개 슬라이드쇼"
        className="min-h-0 flex-1 flex flex-col"
      >
        <HeroSliderWrapper />
      </section>

      <div className="shrink-0 border-b border-white/10 bg-[#152035]">
        <div className="mx-auto grid max-w-7xl grid-cols-3 gap-0 divide-x divide-white/10 px-2 py-2.5 sm:flex sm:flex-wrap sm:px-8 sm:py-3">
          {[
            { num: `${waterCenters.length}개`, label: "전국 물문화관" },
            { num: `${sidoList.length}개`, label: "시·도 거점" },
            { num: "무료", label: "입장 운영" },
          ].map((s) => (
            <div
              key={s.label}
              className="flex min-w-0 flex-col items-center gap-0.5 px-1 py-1 text-center sm:min-w-0 sm:flex-1 sm:items-start sm:px-6 sm:py-1 sm:text-left"
            >
              <p className="text-base font-black tabular-nums text-sky-400 sm:text-lg md:text-xl">
                {s.num}
              </p>
              <p className="text-[9px] font-medium leading-tight tracking-wide text-white/55 sm:text-[11px]">
                {s.label}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="shrink-0 border-t border-white/10 bg-[#101a2e]">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-8 sm:py-3.5">
          <p className="min-w-0 text-[11px] leading-snug text-white/65 sm:text-sm">
            <span className="font-bold text-sky-300/95">물 이야기</span> — 산책로·풍경 사진을 올리고 이달의
            사진 이벤트와 연동해 보세요.
          </p>
          <Link
            href="/mul-iyagi"
            className="inline-flex min-h-10 shrink-0 items-center justify-center rounded-full border border-sky-400/50 bg-sky-500/15 px-4 py-2 text-xs font-bold text-sky-200 transition hover:border-sky-300 hover:bg-sky-500/25 sm:text-sm"
          >
            갤러리 열기 →
          </Link>
        </div>
      </div>

      <WaterHubFooter compact />
    </div>
  );
}
