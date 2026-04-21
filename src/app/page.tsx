import { HeroSliderWrapper } from "@/components/HeroSliderWrapper";
import { WaterHubFooter } from "@/components/WaterHubFooter";
import { WaterHubHeader } from "@/components/WaterHubHeader";
import { sidoList, waterCenters } from "@/data/centers";

export default function Home() {
  return (
    <div className="flex h-dvh max-h-dvh flex-col overflow-hidden bg-[#152035] text-white">
      <WaterHubHeader dense />

      <section
        aria-label="물문화관 소개 슬라이드쇼"
        className="min-h-0 flex-1 flex flex-col"
      >
        <HeroSliderWrapper />
      </section>

      <div className="shrink-0 border-b border-white/10 bg-[#152035]">
        <div className="mx-auto flex max-w-7xl flex-wrap divide-x divide-white/10 px-5 sm:px-8">
          {[
            { num: `${waterCenters.length}개`, label: "전국 물문화관" },
            { num: `${sidoList.length}개`, label: "시·도 거점" },
            { num: "무료", label: "입장 운영" },
          ].map((s) => (
            <div key={s.label} className="flex flex-col gap-0.5 px-5 py-3 first:pl-0 sm:px-6 sm:py-3.5">
              <p className="text-lg font-black text-sky-400 sm:text-xl">{s.num}</p>
              <p className="text-[10px] font-medium tracking-wide text-white/55 sm:text-[11px]">
                {s.label}
              </p>
            </div>
          ))}
        </div>
      </div>

      <WaterHubFooter compact />
    </div>
  );
}
