import Link from "next/link";
import Image from "next/image";
import { HeroSliderWrapper } from "@/components/HeroSliderWrapper";
import { WaterHubFooter } from "@/components/WaterHubFooter";
import { WaterHubHeader } from "@/components/WaterHubHeader";
import { KwaterHighlightSection } from "@/components/KwaterHighlightSection";
import { MainKoreaMap } from "@/components/MainKoreaMap";
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
        className="h-[440px] sm:h-[520px] md:h-[580px] lg:h-[620px] w-full shrink-0 relative overflow-hidden bg-slate-900"
      >
        <HeroSliderWrapper />
      </section>

      {/* 메인 홈페이지 콘텐츠 영역 */}
      <main className="mx-auto max-w-7xl w-full px-6 py-8 sm:py-10 space-y-8 flex-1">
        {/* 상단 1컬럼: 전국 15대 댐 물문화관 거점 종합안내 (K-WATER NETWORK 지도 포함) */}
        <section
          aria-label="물문화관 전국 현황 현황판"
          className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm transition-all duration-300 space-y-6"
        >
          <div className="border-b border-slate-100 pb-4">
            <div className="flex items-center justify-between gap-2">
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-sky-100 px-3 py-1 text-xs font-black tracking-wider uppercase text-sky-700">
                  K-WATER NETWORK
                </span>
                <span className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600">
                  <span>전국 <strong className="text-sky-600 font-black">{waterCenters.length}개소</strong></span>
                  <span className="text-slate-300">•</span>
                  <span><strong className="text-sky-600 font-black">{sidoList.length}개</strong> 광역 시·도</span>
                </span>
              </div>

              <Link
                href="/status?view=list"
                className="inline-flex items-center gap-1 text-xs sm:text-sm font-bold text-sky-700 hover:text-sky-900 transition shrink-0 group"
              >
                <span>전체 상세 현황보기</span>
                <span className="transform group-hover:translate-x-0.5 transition-transform duration-200">→</span>
              </Link>
            </div>

            <h2 className="mt-2 text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              전국 15대 댐 물문화관 거점 종합안내
            </h2>
            <p className="mt-1 text-xs sm:text-sm font-medium text-slate-500">
              전국 댐 수역에 조성된 15개 물문화관의 운영시간, 관람 상태, 실시간 안내 정보를 지도로 경험해 보세요.
            </p>
          </div>

          {/* 전국 인터랙티브 현황 지도 영역 */}
          <div className="pt-2 min-w-0">
            <MainKoreaMap />
          </div>
        </section>

        {/* 하단 2컬럼 레이아웃 (동일 너비 50:50) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 items-start">
          {/* 좌측 1/2컬럼: 주요 물문화 서비스 바로가기 (K-WATER GATEWAY) */}
          <div className="lg:col-span-1">
            <section
              aria-label="주요 물문화 서비스 바로가기"
              className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 shadow-sm transition-all duration-300"
            >
              <div className="border-b border-slate-100 pb-4">
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

              <div className="mt-4 space-y-3.5">
                {QUICK_CARDS.map((card) => (
                  <Link
                    key={card.title}
                    href={card.path}
                    className="group relative flex flex-col sm:flex-row overflow-hidden rounded-xl border border-slate-200/90 bg-white shadow-xs transition-all duration-300 hover:-translate-y-0.5 hover:border-sky-400 hover:shadow-md h-32 sm:h-36"
                  >
                    {/* 1. 좌측 썸네일 이미지 (블루 박스 카드 규격) */}
                    <div className="relative h-32 sm:h-36 sm:w-48 shrink-0 overflow-hidden bg-slate-100">
                      <Image
                        src={card.image}
                        alt={card.title}
                        fill
                        className="object-cover object-center transition-transform duration-500 ease-out group-hover:scale-105"
                        sizes="(max-width: 640px) 100vw, 200px"
                      />
                      {/* 상단 뱃지 */}
                      <div className="absolute left-3 top-3 z-10">
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-900/80 border border-white/20 px-2.5 py-0.5 text-[11px] font-bold text-white backdrop-blur-md shadow-xs">
                          {card.icon}
                          <span>{card.badge}</span>
                        </span>
                      </div>
                    </div>

                    {/* 2. 우측 정보 및 버튼 영역 */}
                    <div className="p-3.5 sm:p-4 flex flex-col justify-between flex-1 bg-white min-w-0">
                      <div>
                        <h3 className="text-sm sm:text-base font-black text-slate-900 group-hover:text-sky-600 transition-colors duration-200">
                          {card.title}
                        </h3>
                        <p className="mt-1 text-xs sm:text-sm font-medium text-slate-600 leading-relaxed line-clamp-2 break-keep">
                          {card.desc}
                        </p>
                      </div>

                      <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs sm:text-sm font-black text-sky-600 group-hover:text-sky-700 transition-colors duration-200">
                        <span>{card.btnLabel}</span>
                        <span className="text-xs sm:text-sm font-black transform group-hover:translate-x-1.5 transition-transform duration-200">
                          →
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          </div>

          {/* 우측 1/2컬럼: K-water 미디어 하이라이트 (K-WATER HIGHLIGHT) */}
          <section className="lg:col-span-1">
            <KwaterHighlightSection />
          </section>
        </div>
      </main>

      <WaterHubFooter />
    </div>
  );
}
