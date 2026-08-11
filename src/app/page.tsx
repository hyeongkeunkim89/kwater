import Link from "next/link";
import Image from "next/image";
import { HeroSliderWrapper } from "@/components/HeroSliderWrapper";
import { WaterHubHeader } from "@/components/WaterHubHeader";
import { sidoList, waterCenters } from "@/data/centers";

export default function Home() {
  return (
    <div className="flex h-dvh max-h-dvh flex-col overflow-hidden bg-[#0c1527] text-white">
      <WaterHubHeader dense showStaffConsoleLink />

      <section
        aria-label="물문화관 소개 슬라이드쇼"
        className="min-h-0 flex-1 flex flex-col"
      >
        <HeroSliderWrapper />
      </section>

      {/* ── 하단 통계 수치 둥근 카드 그리드 (CI 컬러 포인트 반영) ── */}
      <div className="shrink-0 border-t border-sky-300/10 bg-[#0e192e]/95 px-3 py-2.5 sm:px-8 sm:py-3">
        <div className="mx-auto grid max-w-7xl grid-cols-3 gap-2 sm:gap-4">
          {[
            { num: `${waterCenters.length}개`, label: "전국 물문화관", icon: "💧", badge: "K-water 거점" },
            { num: `${sidoList.length}개`, label: "시·도 지역 거점", icon: "🏛️", badge: "전국 네트워크" },
            { num: "무료", label: "입장·전시 운영", icon: "✨", badge: "방울이 강추", isHighlight: true },
          ].map((s) => (
            <div
              key={s.label}
              className={[
                "flex min-w-0 flex-col items-center justify-center rounded-2xl p-2.5 text-center backdrop-blur-md transition-all sm:items-start sm:px-5 sm:py-3 sm:text-left",
                s.isHighlight
                  ? "border-2 border-[#FF9E1B]/70 bg-[#FF9E1B]/10 shadow-md shadow-[#FF9E1B]/15"
                  : "border border-[#00A3E0]/30 bg-white/10 hover:border-[#00A3E0]/60 hover:bg-white/15",
              ].join(" ")}
            >
              <div className="flex flex-wrap items-center justify-center gap-1.5 sm:justify-start">
                <span className="text-xs sm:text-sm">{s.icon}</span>
                <p
                  className={[
                    "text-base font-black tabular-nums sm:text-xl md:text-2xl",
                    s.isHighlight ? "text-[#FF9E1B]" : "text-[#00A3E0]",
                  ].join(" ")}
                >
                  {s.num}
                </p>
                <span
                  className={[
                    "hidden rounded-full px-2 py-0.5 text-[9px] font-extrabold text-white sm:inline-block",
                    s.isHighlight ? "bg-[#FF9E1B]" : "bg-[#00A3E0]",
                  ].join(" ")}
                >
                  {s.badge}
                </span>
              </div>
              <p className="mt-0.5 text-[10px] font-extrabold tracking-tight text-slate-200 sm:text-xs">
                {s.label}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* ── 방울이와 함께하는 갤러리 CTA ── */}
      <div className="shrink-0 border-t border-sky-300/15 bg-[#091122] px-4 py-3 sm:px-8 sm:py-3.5">
        <div className="mx-auto flex max-w-7xl flex-col gap-2.5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <Image
              src="/images/bangwoori.png"
              alt="방울이"
              width={32}
              height={32}
              className="h-8 w-auto shrink-0 drop-shadow-sm animate-bounce-subtle"
              unoptimized
            />
            <p className="min-w-0 text-xs leading-snug text-slate-200 sm:text-sm">
              <span className="rounded-full bg-[#00A3E0] px-2.5 py-0.5 text-[10px] font-black text-white">
                물 이야기 갤러리
              </span>{" "}
              산책로·풍경 사진을 공유하고 방울이가 들려주는 이달의 소식에 참여하세요!
            </p>
          </div>
          <Link
            href="/mul-iyagi"
            className="inline-flex min-h-[48px] shrink-0 items-center justify-center gap-1.5 rounded-full bg-[#FF9E1B] px-6 py-2.5 text-xs font-black text-white shadow-md shadow-[#FF9E1B]/30 transition-all hover:bg-[#E5890D] hover:scale-105 active:scale-95 sm:text-sm"
          >
            <span>갤러리 참여하기</span>
            <span>→</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
