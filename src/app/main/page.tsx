import Link from "next/link";
import Image from "next/image";
import { HeroSliderWrapper } from "@/components/HeroSliderWrapper";
import { WaterHubFooter } from "@/components/WaterHubFooter";
import { WaterHubHeader } from "@/components/WaterHubHeader";
import { QuickFAQAccordion } from "@/components/QuickFAQAccordion";
import { sidoList, waterCenters } from "@/data/centers";

export default function MainPage() {
  const QUICK_CARDS = [
    {
      title: "가이드 투어 사전 예약",
      desc: "전국 15대 물문화관에서 제공하는 다채로운 전문 가이드 해설 투어를 사전 신청하세요.",
      btnLabel: "투어 예약하기",
      badge: "K-water 현장 체험존",
      badgeColor: "bg-sky-50 text-sky-800 border-sky-200/80",
      image: "/images/cards/kwater_official_tour.png",
      path: "/reserve",
      icon: (
        <svg className="h-3.5 w-3.5 text-sky-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
    },
    {
      title: "전국 거점 현황 지도",
      desc: "15개 거점 물문화관의 실시간 관람 상태, 운영시간 및 위치 정보를 대화형 지도에서 한눈에 확인하세요.",
      btnLabel: "현황지도 보기",
      badge: "K-water 기획 파노라마관",
      badgeColor: "bg-teal-50 text-teal-800 border-teal-200/80",
      image: "/images/cards/kwater_official_map.png",
      path: "/status",
      icon: (
        <svg className="h-3.5 w-3.5 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
        </svg>
      ),
    },
    {
      title: "시설 및 층별 전시 안내",
      desc: "물문화관 층별 전시 공간과 편의시설 안내, 실내 도면 및 대표 전경을 한눈에 살펴보세요.",
      btnLabel: "시설 안내 보기",
      badge: "K-water 시청각 영상실",
      badgeColor: "bg-amber-50 text-amber-900 border-amber-200/80",
      image: "/images/cards/kwater_official_facility.png",
      path: "/intro",
      icon: (
        <svg className="h-3.5 w-3.5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
      <main className="mx-auto max-w-7xl w-full px-6 py-8 sm:py-10 space-y-10 sm:space-y-14 flex-1">
        
        {/* 1. 빠른 메뉴 예약 및 서비스 카드 (실사 썸네일 & 모던 포털) */}
        <section aria-label="빠른 메뉴 및 예약 서비스">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            {QUICK_CARDS.map((card) => (
              <div
                key={card.title}
                className="group flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-slate-300 hover:shadow-lg"
              >
                {/* 상단 비주얼 실사 썸네일 */}
                <div className="relative h-44 w-full overflow-hidden bg-slate-100 sm:h-48">
                  <Image
                    src={card.image}
                    alt={card.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent" />
                  <span
                    className={`absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-black backdrop-blur-md shadow-xs bg-white/90 ${card.badgeColor}`}
                  >
                    {card.icon}
                    <span>{card.badge}</span>
                  </span>
                </div>

                {/* 카드 본문 및 바로가기 버튼 */}
                <div className="flex flex-1 flex-col justify-between p-6">
                  <div>
                    <h3 className="text-lg font-black text-slate-900 tracking-tight transition group-hover:text-sky-600">
                      {card.title}
                    </h3>
                    <p className="mt-2 text-xs sm:text-sm font-semibold leading-relaxed text-slate-500">
                      {card.desc}
                    </p>
                  </div>
                  <div className="mt-6 pt-4 border-t border-slate-100">
                    <Link
                      href={card.path}
                      className="inline-flex w-full items-center justify-between rounded-xl bg-slate-50 px-4 py-3 text-xs font-extrabold text-slate-700 transition hover:bg-sky-50 hover:text-sky-700 group-hover:bg-sky-50 group-hover:text-sky-700"
                    >
                      <span>{card.btnLabel}</span>
                      <span className="text-sm font-black transition-transform group-hover:translate-x-1">→</span>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 2. 자주 묻는 질문 FAQ */}
        <section aria-label="자주 묻는 질문 FAQ">
          <QuickFAQAccordion />
        </section>

        {/* 3. 전국 거점 현황 요약 및 바로가기 바 */}
        <section
          aria-label="물문화관 전국 현황 현황판"
          className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-7 shadow-sm flex flex-col lg:flex-row items-center justify-between gap-6"
        >
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 text-center sm:text-left flex-1 min-w-0">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-500 to-cyan-600 text-white shadow-md shadow-sky-500/20">
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <div className="min-w-0">
              <h4 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
                전국 15대 댐 물문화관 거점 종합안내
              </h4>
              <p className="text-xs sm:text-sm text-slate-500 mt-1 font-semibold leading-relaxed">
                전국 댐 수역에 조성된 15개 물문화관의 운영시간, 관람 상태, 실시간 안내 정보를 지도로 경험해 보세요.
              </p>
            </div>
          </div>

          <div className="w-full lg:w-auto shrink-0 flex flex-col sm:flex-row items-center justify-between sm:justify-end gap-4 sm:gap-6 sm:divide-x sm:divide-slate-200/80 pt-4 sm:pt-0 border-t sm:border-t-0 border-slate-100">
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
                className="inline-flex min-h-11 items-center justify-center rounded-xl bg-slate-900 hover:bg-slate-800 text-xs font-extrabold text-white px-6 transition w-full text-center whitespace-nowrap shadow-sm hover:shadow-md"
              >
                <span>전국 현황지도 바로가기</span>
                <span className="ml-1 font-black">→</span>
              </Link>
            </div>
          </div>
        </section>

      </main>

      <WaterHubFooter />
    </div>
  );
}
