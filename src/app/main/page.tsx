import Link from "next/link";
import Image from "next/image";
import { HeroSliderWrapper } from "@/components/HeroSliderWrapper";
import { WaterHubFooter } from "@/components/WaterHubFooter";
import { WaterHubHeader } from "@/components/WaterHubHeader";
import { KwaterHighlightSection } from "@/components/KwaterHighlightSection";
import { sidoList, waterCenters } from "@/data/centers";

export default function MainPage() {
  const QUICK_CARDS = [
    {
      title: "가이드 투어 사전 예약",
      desc: "전국 15대 물문화관에서 제공하는 다채로운 전문 가이드 해설 투어를 사전 신청하세요.",
      btnLabel: "투어 예약하기",
      badge: "현장 체험존",
      image: "/images/cards/kwater_official_tour.png",
      path: "/reserve",
      icon: (
        <svg className="h-3.5 w-3.5 text-sky-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
    },
    {
      title: "전국 거점 현황 지도",
      desc: "15개 거점 물문화관의 실시간 관람 상태, 운영시간 및 위치 정보를 대화형 지도에서 한눈에 확인하세요.",
      btnLabel: "현황지도 보기",
      badge: "기획 파노라마관",
      image: "/images/cards/kwater_official_map.png",
      path: "/status",
      icon: (
        <svg className="h-3.5 w-3.5 text-teal-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
        </svg>
      ),
    },
    {
      title: "시설 및 층별 전시 안내",
      desc: "물문화관 층별 전시 공간과 편의시설 안내, 실내 도면 및 대표 전경을 한눈에 살펴보세요.",
      btnLabel: "시설 안내 보기",
      badge: "시청각 영상실",
      image: "/images/cards/kwater_official_facility.png",
      path: "/intro",
      icon: (
        <svg className="h-3.5 w-3.5 text-amber-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5m0 0h6m-6 0V11m0 0h6" />
        </svg>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col justify-between">
      <WaterHubHeader showStaffConsoleLink activeNav="none" />

      {/* 메인 히어로 비주얼 슬라이더 */}
      <section
        aria-label="물문화관 대표 소개 슬라이드쇼"
        className="h-[480px] sm:h-[560px] md:h-[620px] lg:h-[680px] xl:h-[720px] w-full shrink-0 relative overflow-hidden bg-slate-900"
      >
        <HeroSliderWrapper />
      </section>

      {/* 메인 홈페이지 콘텐츠 영역 */}
      <main className="mx-auto max-w-7xl w-full px-6 py-8 sm:py-10 flex-1">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* 좌측 5컬럼: K-water 미디어 하이라이트 */}
          <section className="lg:col-span-5">
            <KwaterHighlightSection />
          </section>

          {/* 우측 7컬럼: 주요 물문화 서비스 바로가기 & 전국 거점 종합안내 */}
          <div className="lg:col-span-7 space-y-6">
            {/* 1. 주요 물문화 서비스 바로가기 */}
            <section
              aria-label="주요 물문화 서비스 바로가기"
              className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm transition-all duration-300"
            >
              <div className="border-b border-slate-100 pb-5">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-sky-100 px-3 py-1 text-xs font-black tracking-wider uppercase text-sky-700">
                  K-WATER GATEWAY
                </span>
                <h2 className="mt-2 text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                  주요 물문화 서비스 바로가기
                </h2>
                <p className="mt-1 text-xs sm:text-sm font-medium text-slate-500">
                  전국 15개 물문화관의 핵심 서비스와 가이드 해설 투어, 현황 지도를 한눈에 이용해 보세요.
                </p>
              </div>

              <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-3">
                {QUICK_CARDS.map((card) => (
                  <Link
                    key={card.title}
                    href={card.path}
                    className="group relative flex flex-col overflow-hidden rounded-xl border border-slate-200/90 bg-white shadow-xs transition-all duration-300 hover:-translate-y-1 hover:border-sky-400 hover:shadow-xl"
                  >
                    {/* 1. 상단 카드 썸네일 이미지 */}
                    <div className="relative h-44 sm:h-48 w-full overflow-hidden bg-slate-100">
                      <Image
                        src={card.image}
                        alt={card.title}
                        fill
                        className="object-cover object-center transition-transform duration-500 ease-out group-hover:scale-105"
                        sizes="(max-width: 768px) 100vw, 33vw"
                      />
                      {/* 상단 뱃지 */}
                      <div className="absolute left-3.5 top-3.5 z-10">
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-900/80 border border-white/20 px-3 py-1 text-xs font-bold text-white backdrop-blur-md shadow-xs">
                          {card.icon}
                          <span>{card.badge}</span>
                        </span>
                      </div>
                    </div>

                    {/* 2. 하단 정보 및 버튼 영역 */}
                    <div className="p-5 flex flex-col justify-between flex-1 bg-white">
                      <div>
                        <h3 className="text-lg sm:text-xl font-black text-slate-900 group-hover:text-sky-600 transition-colors duration-200">
                          {card.title}
                        </h3>
                        <p className="mt-1.5 mb-4 text-xs sm:text-sm font-medium text-slate-600 leading-relaxed line-clamp-2 break-keep">
                          {card.desc}
                        </p>
                      </div>

                      <div className="pt-3.5 border-t border-slate-100 flex items-center justify-between text-xs sm:text-sm font-black text-sky-600 group-hover:text-sky-700 transition-colors duration-200">
                        <span>{card.btnLabel}</span>
                        <span className="text-base font-black transform group-hover:translate-x-1.5 transition-transform duration-200">
                          →
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </section>

            {/* 2. 전국 15대 댐 물문화관 거점 종합안내 */}
            <section
              aria-label="물문화관 전국 현황 현황판"
              className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm transition-all duration-300"
            >
              <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
                <div className="flex-1 min-w-0">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-sky-100 px-3 py-1 text-xs font-black tracking-wider uppercase text-sky-700">
                    K-WATER NETWORK
                  </span>
                  <h3 className="mt-2 text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                    전국 15대 댐 물문화관 거점 종합안내
                  </h3>
                  <p className="mt-1 text-xs sm:text-sm font-medium text-slate-500">
                    전국 댐 수역에 조성된 15개 물문화관의 운영시간, 관람 상태, 실시간 안내 정보를 지도로 경험해 보세요.
                  </p>
                </div>

                <div className="shrink-0 flex flex-col sm:flex-row items-center gap-4 sm:gap-6 sm:divide-x sm:divide-slate-200/80">
                  <div className="flex w-full sm:w-auto items-center justify-evenly sm:justify-start gap-6 sm:gap-2">
                    <div className="sm:px-4 text-center">
                      <span className="text-lg sm:text-xl font-black text-sky-600 tabular-nums">
                        {waterCenters.length}개소
                      </span>
                      <span className="text-[10px] text-slate-400 font-bold block mt-0.5 whitespace-nowrap uppercase tracking-wider">
                        전국 거점 수
                      </span>
                    </div>
                    <div className="h-7 w-px bg-slate-200/80 sm:hidden" />
                    <div className="sm:px-4 text-center">
                      <span className="text-lg sm:text-xl font-black text-sky-600 tabular-nums">
                        {sidoList.length}개
                      </span>
                      <span className="text-[10px] text-slate-400 font-bold block mt-0.5 whitespace-nowrap uppercase tracking-wider">
                        광역 시·도
                      </span>
                    </div>
                  </div>
                  <div className="w-full sm:w-auto sm:pl-6">
                    <Link
                      href="/status"
                      className="inline-flex items-center justify-center gap-1.5 rounded-full bg-slate-900 hover:bg-sky-600 text-xs sm:text-sm font-black text-white px-5 py-2.5 transition-all duration-200 shadow-xs hover:shadow-md group whitespace-nowrap w-full sm:w-auto"
                    >
                      <span>전국 현황지도 바로가기</span>
                      <span className="transform group-hover:translate-x-0.5 transition-transform duration-200">→</span>
                    </Link>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </main>

      <WaterHubFooter />
    </div>
  );
}
