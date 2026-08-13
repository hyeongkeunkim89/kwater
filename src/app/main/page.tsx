import Link from "next/link";
import { HeroSliderWrapper } from "@/components/HeroSliderWrapper";
import { WaterHubFooter } from "@/components/WaterHubFooter";
import { WaterHubHeader } from "@/components/WaterHubHeader";
import { FourCoreSections } from "@/components/FourCoreSections";
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
        
        {/* 4대 핵심 주제 섹션 (기술 / 생태 / 역사 / 교육) */}
        <FourCoreSections />

        {/* 자주 묻는 질문 FAQ */}
        <section aria-label="자주 묻는 질문 FAQ">
          <QuickFAQAccordion />
        </section>

        {/* 전국 거점 현황 요약 및 바로가기 바 */}
        <section
          aria-label="물문화관 전국 현황 현황판"
          className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6"
        >
          <div className="flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left">
            <span className="text-3xl shrink-0" role="img" aria-label="지도">🗺️</span>
            <div>
              <h4 className="text-base font-black text-slate-800 break-keep">
                전국 15대 댐 물문화관 현황지도
              </h4>
              <p className="text-xs text-slate-500 mt-1 font-semibold break-keep">
                전국 곳곳의 댐 수역에 아름답게 개설된 15개의 물문화관 운영 정보와 관람 상태를 바로 확인해 보세요.
              </p>
            </div>
          </div>
          <div className="w-full md:w-auto shrink-0 flex flex-col sm:flex-row items-center gap-4 sm:gap-6 sm:divide-x sm:divide-slate-100">
            <div className="flex w-full items-center justify-center gap-8 sm:gap-6 sm:justify-start">
              <div className="sm:px-4 text-center">
                <span className="text-lg font-black text-sky-500 tabular-nums">{waterCenters.length}개소</span>
                <span className="text-[10px] text-slate-400 font-semibold block mt-0.5 whitespace-nowrap">물문화관 수</span>
              </div>
              <div className="h-8 w-px bg-slate-100 sm:hidden" />
              <div className="sm:px-4 text-center">
                <span className="text-lg font-black text-sky-500 tabular-nums">{sidoList.length}개</span>
                <span className="text-[10px] text-slate-400 font-semibold block mt-0.5 whitespace-nowrap">광역 시·도 거점</span>
              </div>
            </div>
            <div className="w-full sm:w-auto sm:pl-6">
              <Link
                href="/status"
                className="inline-flex min-h-11 items-center justify-center rounded-xl bg-slate-900 hover:bg-slate-800 text-xs font-bold text-white px-5 transition w-full text-center whitespace-nowrap"
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
