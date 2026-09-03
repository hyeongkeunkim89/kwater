import Link from "next/link";
import { HeroSliderWrapper } from "@/components/HeroSliderWrapper";
import { WaterHubFooter } from "@/components/WaterHubFooter";
import { WaterHubHeader } from "@/components/WaterHubHeader";
import { QuickFAQAccordion } from "@/components/QuickFAQAccordion";
import { sidoList, waterCenters } from "@/data/centers";

export default function MainPage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col justify-between">
      <WaterHubHeader showStaffConsoleLink activeNav="none" />

      {/* 메인 히어로 비주얼 슬라이더 */}
      <section
        aria-label="물문화관 대표 소개 슬라이드쇼"
        className="h-[460px] md:h-[560px] lg:h-[620px] w-full shrink-0 relative overflow-hidden bg-slate-950"
      >
        <HeroSliderWrapper />
      </section>

      {/* 메인 홈페이지 콘텐츠 영역 */}
      <main className="mx-auto max-w-7xl w-full px-6 py-8 sm:py-10 space-y-10 sm:space-y-14 flex-1">
        
        {/* 1. 빠른 메뉴 예약 및 서비스 카드 */}
        <section aria-label="빠른 메뉴 및 예약 서비스">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            {[
              {
                title: "가이드 투어 예약",
                desc: "전국 15대 물문화관에서 제공하는 다채로운 가이드 투어 및 해설 서비스를 사전 신청해 보세요.",
                btnLabel: "투어 예약하러 가기",
                icon: "📅",
                path: "/reserve",
                bg: "from-sky-500/10 to-indigo-500/5 hover:from-sky-500/15 hover:to-indigo-500/10 border-sky-100",
                btnBg: "bg-sky-500 hover:bg-sky-400 text-white",
              },
              {
                title: "전국 물문화관 현황",
                desc: "전국 15개 거점 물문화관의 상세 정보, 운영 시간 및 위치를 대화형 지도에서 확인해 보세요.",
                btnLabel: "현황 지도 바로가기",
                icon: "🗺️",
                path: "/status",
                bg: "from-teal-500/10 to-sky-500/5 hover:from-teal-500/15 hover:to-sky-500/10 border-teal-100",
                btnBg: "bg-teal-600 hover:bg-teal-500 text-white",
              },
              {
                title: "시설 및 층별 안내",
                desc: "물문화관 층별 전시 공간과 편의시설 안내, 실내 도면 및 대표 전경을 한눈에 살펴보세요.",
                btnLabel: "시설 안내 보기",
                icon: "🏛️",
                path: "/intro",
                bg: "from-amber-500/10 to-orange-500/5 hover:from-amber-500/15 hover:to-orange-500/10 border-amber-100",
                btnBg: "bg-amber-500 hover:bg-amber-400 text-white",
              },
            ].map((card) => (
              <div
                key={card.title}
                className={[
                  "flex flex-col justify-between p-6 sm:p-8 rounded-2xl border bg-gradient-to-br shadow-sm hover:shadow-md transition duration-300 transform hover:-translate-y-0.5",
                  card.bg,
                ].join(" ")}
              >
                <div>
                  <span className="text-3xl block mb-4" role="img" aria-label={card.title}>
                    {card.icon}
                  </span>
                  <h3 className="text-lg font-black text-slate-800 tracking-tight leading-snug">
                    {card.title}
                  </h3>
                  <p className="mt-2 text-xs sm:text-sm text-slate-500 leading-relaxed font-semibold">
                    {card.desc}
                  </p>
                </div>
                <div className="mt-6">
                  <Link
                    href={card.path}
                    className={[
                      "inline-flex min-h-11 items-center justify-center rounded-xl text-xs font-black px-5 transition w-full text-center shadow-sm",
                      card.btnBg,
                    ].join(" ")}
                  >
                    {card.btnLabel}
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 2. 자주 묻는 질문 FAQ */}
        <section aria-label="자주 묻는 질문 FAQ">
          <QuickFAQAccordion />
        </section>

        {/* 전국 거점 현황 요약 및 바로가기 바 */}
        <section
          aria-label="물문화관 전국 현황 현황판"
          className="rounded-2xl border border-slate-200/90 bg-white p-5 sm:p-6 shadow-sm flex flex-col lg:flex-row items-center justify-between gap-5 lg:gap-6"
        >
          {/* 좌측: 지도 아이콘 & 타이틀/설명 문구 */}
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-3.5 sm:gap-4 text-center sm:text-left flex-1 min-w-0">
            <span className="text-3xl shrink-0 p-2 rounded-xl bg-sky-50 border border-sky-100" role="img" aria-label="지도">
              🗺️
            </span>
            <div className="min-w-0">
              <h4 className="text-base sm:text-lg font-black text-slate-800 tracking-tight break-keep">
                전국 15대 댐 물문화관 현황지도
              </h4>
              <p className="text-xs text-slate-500 mt-1 font-semibold break-keep leading-relaxed">
                전국 곳곳의 댐 수역에 위치한 15개 물문화관의 운영 정보와 실시간 관람 상태를 바로 확인해 보세요.
              </p>
            </div>
          </div>

          {/* 우측: 통계 수치 (15개소/8개 시도) & 현황지도 바로보기 버튼 */}
          <div className="w-full lg:w-auto shrink-0 flex flex-col sm:flex-row items-center justify-between sm:justify-end gap-4 sm:gap-6 sm:divide-x sm:divide-slate-200/80 pt-4 sm:pt-0 border-t sm:border-t-0 border-slate-100">
            <div className="flex w-full sm:w-auto items-center justify-evenly sm:justify-start gap-4 sm:gap-2">
              <div className="sm:px-4 text-center">
                <span className="text-base sm:text-lg font-black text-sky-600 tabular-nums">
                  {waterCenters.length}개소
                </span>
                <span className="text-[10px] text-slate-400 font-bold block mt-0.5 whitespace-nowrap uppercase tracking-wider">
                  물문화관 수
                </span>
              </div>
              <div className="h-7 w-px bg-slate-200/80 sm:hidden" />
              <div className="sm:px-4 text-center">
                <span className="text-base sm:text-lg font-black text-sky-600 tabular-nums">
                  {sidoList.length}개
                </span>
                <span className="text-[10px] text-slate-400 font-bold block mt-0.5 whitespace-nowrap uppercase tracking-wider">
                  광역 시·도 거점
                </span>
              </div>
            </div>
            <div className="w-full sm:w-auto sm:pl-6">
              <Link
                href="/status"
                className="inline-flex min-h-11 items-center justify-center rounded-xl bg-slate-900 hover:bg-slate-800 text-xs font-bold text-white px-6 transition w-full text-center whitespace-nowrap shadow-sm"
              >
                현황지도 바로보기 →
              </Link>
            </div>
          </div>
        </section>

      </main>

      <WaterHubFooter />
    </div>
  );
}
