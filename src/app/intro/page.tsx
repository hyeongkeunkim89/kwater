import Image from "next/image";
import Link from "next/link";
import { WaterHubHeader } from "@/components/WaterHubHeader";
import { WaterHubFooter } from "@/components/WaterHubFooter";

export const metadata = {
  title: "문화관 소개 | K-water 물문화관",
  description: "대한민국 수자원의 역사와 가치를 체계적으로 보존하고 국민과 함께하는 복합 문화·체험 공간 K-water 물문화관을 소개합니다.",
};

export default function IntroPage() {
  // 물문화관 4대 주요 시설 & 대표 체험 역할
  const mainFeatures = [
    {
      title: "수자원 역사 & 사료관",
      subtitle: "50년 수자원 발전사 기록",
      desc: "대한민국 50년 치수(治水)와 이수(利水)의 역사를 디지털 파노라마와 사료 전시로 생생하게 관람할 수 있습니다.",
      badge: "역사 보존",
      icon: (
        <svg className="w-6 h-6 text-sky-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      ),
    },
    {
      title: "디지털 생태 체험존",
      subtitle: "미래 환경 & 생태 교육",
      desc: "어린이와 청소년을 위한 생태 환경 체험 공간 및 VR·실감 미디어를 통해 물 순환의 소중함을 배웁니다.",
      badge: "생태 체험",
      icon: (
        <svg className="w-6 h-6 text-sky-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L5.597 15.1a2 2 0 00-1.879 1.158L2.3 19.1A2 2 0 004.135 22h15.73a2 2 0 001.835-2.9l-2.272-3.672zM12 3v9m0 0l-3-3m3 3l3-3" />
        </svg>
      ),
    },
    {
      title: "힐링 수변 문화 공간",
      subtitle: "전망대 & 수변 북카페",
      desc: "아름다운 댐 수변 경관을 조망하는 전망대와 북카페, 산책로에서 지역 주민과 방문객이 편안히 휴식합니다.",
      badge: "지역 상생",
      icon: (
        <svg className="w-6 h-6 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5 5 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
    },
    {
      title: "전문 가이드 해설 투어",
      subtitle: "도슨트 동행 가이드 프로그램",
      desc: "전문 해설사의 스토리텔링과 함께 물문화관 전시와 시설을 더 깊이 이해할 수 있는 무료 예약 투어입니다.",
      badge: "투어 서비스",
      icon: (
        <svg className="w-6 h-6 text-sky-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
    },
  ];

  // 관람 핵심 서비스 안내 4가지
  const visitorGuides = [
    {
      title: "관람료 및 주차 무료",
      desc: "전국 15개 물문화관은 전 관람객 대상 전액 무료 입장 및 무료 대형 주차장을 제공합니다.",
      tag: "전 관람객 대상",
      icon: (
        <svg className="h-5 w-5 text-sky-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 002 2h14a2 2 0 002-2V7a2 2 0 00-2-2H5z" />
        </svg>
      ),
    },
    {
      title: "관람 시간 (09:00 ~ 18:00)",
      desc: "기본 관람 시간은 09:00~18:00 (입장 마감 17:30)이며 매주 월요일과 명절 당일은 정기 휴관합니다.",
      tag: "월요일 정기 휴관",
      icon: (
        <svg className="h-5 w-5 text-sky-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    {
      title: "무료 가이드 해설 예약",
      desc: "가족 및 단체 방문객을 위한 전문 도슨트 해설 투어를 사전 온라인 신청하실 수 있습니다.",
      tag: "사전 온라인 예약",
      icon: (
        <svg className="h-5 w-5 text-sky-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
    },
    {
      title: "전국 15개 거점 수변 네트워크",
      desc: "수도권, 강원, 충청, 호남, 영남의 주요 댐 수역에 위치하여 지역 수변 문화를 연결합니다.",
      tag: "전국 15개 거점",
      icon: (
        <svg className="h-5 w-5 text-sky-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
        </svg>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans break-keep">
      <WaterHubHeader activeNav="intro" />

      {/* 1. 고화질 전경 사진 히어로 배너 */}
      <section className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 mt-4 sm:mt-6">
        <div className="relative min-h-[500px] sm:min-h-[540px] lg:min-h-[580px] w-full overflow-hidden rounded-tl-[48px] rounded-bl-[48px] rounded-tr-[24px] rounded-br-[24px] bg-slate-100 shadow-xl flex items-center justify-end p-6 sm:p-10 lg:p-12">
          {/* 전달받은 횡성댐 물문화관 전경 고화질 배경 이미지 */}
          <Image
            src="/images/intro-bg.jpg"
            alt="K-water 물문화관 전경 고화질 배경"
            fill
            priority
            className="object-cover object-[left_center] opacity-85 brightness-105"
          />

          {/* 수평 화이트 그라디언트 오버레이 */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/60 to-white/90 md:via-white/70 md:to-white/95" />
          <div className="absolute inset-0 bg-gradient-to-t from-white/40 via-transparent to-white/30" />

          {/* 콘텐츠 영역 */}
          <div className="relative z-10 w-full lg:w-[60%] flex flex-col items-center text-center max-w-xl mx-auto lg:mr-4">
            {/* 공식 슬로건 이미지 */}
            <div className="mb-4 sm:mb-5">
              <Image
                src="/images/slogan.png"
                alt="세상에 행복을 水 놓다"
                width={480}
                height={120}
                priority
                className="h-auto w-auto max-w-[280px] sm:max-w-[360px] md:max-w-[420px] object-contain mx-auto filter drop-shadow-xs"
              />
            </div>

            {/* 타이틀 및 소개 카피 */}
            <h1 className="text-xl sm:text-2xl md:text-3xl font-black text-slate-900 tracking-tight mb-3">
              K-water 물문화관
            </h1>
            <p className="text-xs sm:text-sm font-semibold text-slate-800 leading-relaxed break-keep max-w-xl mx-auto mb-8 opacity-90">
              한국수자원공사 물문화관은 지난 50년간 대한민국의 수자원 관리<br className="hidden sm:inline" />
              역사를 체계적으로 기록하고 보존해왔습니다. 물(水)의 가치를 전파하고,<br className="hidden sm:inline" />
              지역사회와 호흡하는 지속 가능한 상생의 공간을 지향합니다.
            </p>

            {/* 3대 핵심 가치 한글 뱃지 카드 */}
            <div className="grid grid-cols-3 gap-3 sm:gap-4 pt-5 border-t border-slate-900/15 w-full max-w-lg mx-auto">
              <div className="flex flex-col items-center justify-center rounded-xl bg-white/80 border border-slate-200/80 p-3 sm:p-3.5 text-center shadow-xs backdrop-blur-xs transition hover:bg-white hover:border-sky-300 hover:shadow-sm">
                <div className="mb-1.5 flex h-9 w-9 items-center justify-center rounded-lg bg-sky-100/80 text-[#004D95]">
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <span className="text-xs sm:text-sm font-black text-slate-900 tracking-tight">
                  역사 보존
                </span>
                <span className="text-[10px] sm:text-[11px] font-semibold text-slate-500 mt-0.5 whitespace-nowrap">
                  50년 수자원 기록
                </span>
              </div>

              <div className="flex flex-col items-center justify-center rounded-xl bg-white/80 border border-slate-200/80 p-3 sm:p-3.5 text-center shadow-xs backdrop-blur-xs transition hover:bg-white hover:border-sky-300 hover:shadow-sm">
                <div className="mb-1.5 flex h-9 w-9 items-center justify-center rounded-lg bg-sky-100/80 text-sky-600">
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L5.597 15.1a2 2 0 00-1.879 1.158L2.3 19.1A2 2 0 004.135 22h15.73a2 2 0 001.835-2.9l-2.272-3.672zM12 3v9m0 0l-3-3m3 3l3-3" />
                  </svg>
                </div>
                <span className="text-xs sm:text-sm font-black text-slate-900 tracking-tight">
                  생태 체험
                </span>
                <span className="text-[10px] sm:text-[11px] font-semibold text-slate-500 mt-0.5 whitespace-nowrap">
                  디지털 미디어 체험
                </span>
              </div>

              <div className="flex flex-col items-center justify-center rounded-xl bg-white/80 border border-slate-200/80 p-3 sm:p-3.5 text-center shadow-xs backdrop-blur-xs transition hover:bg-white hover:border-sky-300 hover:shadow-sm">
                <div className="mb-1.5 flex h-9 w-9 items-center justify-center rounded-lg bg-sky-100/80 text-teal-600">
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5 5 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <span className="text-xs sm:text-sm font-black text-slate-900 tracking-tight">
                  지역 상생
                </span>
                <span className="text-[10px] sm:text-[11px] font-semibold text-slate-500 mt-0.5 whitespace-nowrap">
                  힐링 수변 문화 공간
                </span>
              </div>
            </div>

            {/* 바로가기 버튼 (상단 히어로: 공간 안내 & 거점 지도) */}
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3 w-full sm:w-auto">
              <a
                href="#features"
                className="w-full sm:w-auto inline-flex min-h-11 items-center justify-center rounded-xl bg-[#004D95] hover:bg-[#003870] text-white font-bold text-xs sm:text-sm px-7 transition shadow-md gap-1.5"
              >
                <span>주요 공간 &amp; 서비스</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </a>
              <Link
                href="/status"
                className="w-full sm:w-auto inline-flex min-h-11 items-center justify-center rounded-xl border border-slate-300 bg-white/80 hover:bg-white text-slate-800 font-bold text-xs sm:text-sm px-7 transition shadow-xs gap-1.5"
              >
                <span>전국 거점 현황 지도</span>
                <svg className="w-4 h-4 text-sky-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 2. 물문화관 주요 시설 & 체험 역할 (id="features" 앵커 추가) */}
      <section id="features" className="py-16 sm:py-20 bg-white border-b border-slate-200 mt-8 sm:mt-12 scroll-mt-6">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-sky-100 px-3 py-1 text-xs font-black tracking-wider uppercase text-sky-700 mb-3">
              KEY FEATURES &amp; SPACES
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight break-keep">
              물문화관 주요 공간 &amp; 체험 프로그램
            </h2>
            <p className="mt-3 text-sm text-slate-600 font-medium break-keep">
              역사 사료 전시부터 생태 체험존, 힐링 수변 전망대까지 국민을 위한 다채로운 공간을 선사합니다.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {mainFeatures.map((item) => (
              <div
                key={item.title}
                className="rounded-2xl bg-slate-50/80 border border-slate-200 p-6 flex flex-col justify-between hover:bg-white hover:border-[#004D95]/40 hover:shadow-xl transition-all duration-300 group"
              >
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <div className="w-12 h-12 rounded-xl bg-white border border-slate-200/80 flex items-center justify-center shadow-xs group-hover:border-[#004D95]/30 group-hover:bg-blue-50/50 transition-colors">
                      {item.icon}
                    </div>
                    <span className="text-[11px] font-bold text-[#004D95] bg-blue-50 px-2.5 py-1 rounded-full border border-blue-100">
                      {item.badge}
                    </span>
                  </div>
                  <h3 className="text-lg font-black text-slate-900 mb-1 group-hover:text-[#004D95] transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-xs font-bold text-sky-600 mb-3">
                    {item.subtitle}
                  </p>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium break-keep">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. 방문객 관람 핵심 가이드 & 서비스 (팩트 카드) */}
      <section className="py-16 sm:py-20 bg-slate-50/70 border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-sky-100 px-3 py-1 text-xs font-black tracking-wider uppercase text-sky-700 mb-3">
              VISITOR GUIDE
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight break-keep">
              방문객 관람 핵심 서비스 안내
            </h2>
            <p className="mt-3 text-sm text-slate-600 font-medium break-keep">
              쾌적하고 편리한 방문을 위해 K-water 물문화관이 제공하는 필수 안내 사항입니다.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {visitorGuides.map((guide) => (
              <div
                key={guide.title}
                className="rounded-2xl bg-white border border-slate-200 p-6 shadow-xs flex flex-col justify-between hover:shadow-md hover:border-sky-300 transition-all duration-300"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-10 rounded-xl bg-sky-50 flex items-center justify-center">
                      {guide.icon}
                    </div>
                    <span className="text-[10px] font-extrabold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                      {guide.tag}
                    </span>
                  </div>
                  <h3 className="text-base font-black text-slate-900 mb-2">
                    {guide.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium break-keep">
                    {guide.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. 하단 둘러보기 CTA 섹션 */}
      <section className="py-14 sm:py-16 bg-white text-center">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight break-keep mb-3">
            지금 가까운 K-water 물문화관을 탐방해 보세요!
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 font-medium break-keep mb-8 max-w-xl mx-auto">
            자연과 수자원의 역사가 숨 쉬는 전국 15개 물문화관에서 뜻깊은 추억과 생태 체험을 만끽해 보세요.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/centers"
              className="w-full sm:w-auto inline-flex min-h-12 items-center justify-center rounded-xl bg-[#004D95] hover:bg-[#003870] text-white font-bold text-sm px-8 transition shadow-md hover:shadow-lg gap-2"
            >
              <span>전국 15개 물문화관 둘러보기</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </Link>
            <Link
              href="/reserve"
              className="w-full sm:w-auto inline-flex min-h-12 items-center justify-center rounded-xl border border-slate-300 bg-slate-50 hover:bg-slate-100 text-slate-800 font-bold text-sm px-8 transition shadow-xs gap-2"
            >
              <span>무료 가이드 투어 사전 예약</span>
              <svg className="w-4 h-4 text-sky-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      <WaterHubFooter />
    </div>
  );
}
