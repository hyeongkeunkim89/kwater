import Image from "next/image";
import Link from "next/link";
import { WaterHubHeader } from "@/components/WaterHubHeader";
import { WaterHubFooter } from "@/components/WaterHubFooter";

export const metadata = {
  title: "문화관 소개 & 인사말 | K-water 물문화관",
  description:
    "사람과 물, 문화가 어우러지는 수변 공간. 한국수자원공사 물문화관 웹사이트를 찾아주신 국민 여러분께 전하는 인사말입니다.",
};

export default function IntroPage() {
  // 물문화관이 함께 가꿔가는 3가지 주요 가치
  const culturalValues = [
    {
      title: "역사와 삶의 기록",
      subtitle: "수자원 발자취 보존",
      desc: "대한민국 50년 치수와 이수의 역사를 차곡차곡 기록하여, 댐 건설과 물 관리의 귀중한 가치를 후대에 전달합니다.",
      icon: (
        <svg className="w-6 h-6 text-[#004D95]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      ),
    },
    {
      title: "자연 속 휴식과 상생",
      subtitle: "수변 문화 쉼터",
      desc: "아름다운 댐 호수 경관을 조망하는 수변 산책로와 북카페를 조성하여, 지역 주민과 방문객이 편안히 쉬어가는 공간을 만들어갑니다.",
      icon: (
        <svg className="w-6 h-6 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5 5 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
    },
    {
      title: "체험과 생태 교육",
      subtitle: "물 사랑 디지털 체험",
      desc: "어린이와 가족이 즐길 수 있는 미디어 체험존과 전문 해설 투어를 통해 물의 소중함과 환경 가치를 배웁니다.",
      icon: (
        <svg className="w-6 h-6 text-sky-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L5.597 15.1a2 2 0 00-1.879 1.158L2.3 19.1A2 2 0 004.135 22h15.73a2 2 0 001.835-2.9l-2.272-3.672zM12 3v9m0 0l-3-3m3 3l3-3" />
        </svg>
      ),
    },
  ];

  // 통합 웹사이트 주요 제공 서비스
  const hubServices = [
    {
      title: "전국 15개 거점 현황 지도",
      desc: "수도권, 강원, 충청, 호남, 영남 15개 물문화관의 실시간 관람 상태와 운영시간을 확인하세요.",
      btnLabel: "지도 현황보기",
      path: "/status",
      icon: "🗺️",
    },
    {
      title: "무료 가이드 투어 예약",
      desc: "전문 도슨트 해설사와 함께 물문화관 전시장과 대표 시설을 둘러보는 해설 프로그램을 신청하세요.",
      btnLabel: "투어 예약하기",
      path: "/reserve",
      icon: "📅",
    },
    {
      title: "층별 시설 & 전시 안내",
      desc: "각 물문화관별 실내 전시 공간 구성, 층별 주요 시설, 힐링 쉼터 안내 정보를 살펴보세요.",
      btnLabel: "시설안내 보기",
      path: "/centers",
      icon: "🏛️",
    },
    {
      title: "물문화 소식 & 행사",
      desc: "물문화관에서 진행되는 최신 문화 행사 소식과 공지사항, 시민 소통 소식을 확인하세요.",
      btnLabel: "소식 바로가기",
      path: "/news",
      icon: "📣",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans break-keep">
      <WaterHubHeader activeNav="intro" />

      {/* 1. 상단 히어로 영역 (밝은 라이트 모드 스타일) */}
      <section className="relative overflow-hidden bg-gradient-to-b from-sky-50 via-blue-50/40 to-slate-50 border-b border-slate-200/80 text-slate-900 py-16 sm:py-24 lg:py-28">
        {/* 배경 은은한 풍경 사진 */}
        <Image
          src="/images/intro-bg.jpg"
          alt="K-water 물문화관 대표 전경"
          fill
          priority
          className="object-cover object-center opacity-15 mix-blend-multiply"
        />

        {/* 은은한 수평/수직 밝은 오버레이 */}
        <div className="absolute inset-0 bg-gradient-to-b from-white/70 via-sky-50/50 to-slate-50" />
        <div className="absolute inset-0 bg-gradient-to-r from-sky-50/60 via-transparent to-sky-50/60" />

        <div className="relative mx-auto max-w-4xl px-6 text-center">
          {/* 상단 뱃지 */}
          <div className="mb-4 inline-flex items-center gap-1.5 rounded-full bg-sky-100/80 px-4 py-1 text-xs font-black text-[#004D95] border border-sky-200/80 shadow-2xs">
            <span>🌊</span>
            <span>K-water 물문화관 소개</span>
          </div>

          {/* 공식 슬로건 로고 */}
          <div className="mb-6 sm:mb-8 flex justify-center">
            <Image
              src="/images/slogan.png"
              alt="세상에 행복을 水 놓다"
              width={380}
              height={95}
              priority
              className="h-auto w-auto max-w-[240px] sm:max-w-[320px] md:max-w-[360px] object-contain filter drop-shadow-xs"
            />
          </div>

          {/* 메인 타이틀 */}
          <h1 className="text-2xl sm:text-4xl md:text-5xl font-black tracking-tight leading-snug text-slate-900 mb-6 break-keep">
            물(水)과 사람이 함께하는<br className="hidden sm:inline" />
            <span className="text-[#004D95]"> 따뜻한 수변 문화 공간</span>
          </h1>

          {/* 서브 타이틀 카피 */}
          <p className="text-sm sm:text-base md:text-lg font-medium text-slate-600 leading-relaxed sm:leading-loose max-w-2xl mx-auto break-keep">
            전국 15개 댐 유역에 위치한 K-water 물문화관은 물의 가치를 기록하고,<br className="hidden sm:inline" />
            지역 주민과 방문객이 소중한 추억을 나누는 복합 문화 쉼터입니다.
          </p>
        </div>
      </section>

      {/* 2. 인사말 및 웹사이트 안내 (공식 서한 스타일) */}
      <main className="mx-auto max-w-7xl w-full px-6 py-12 sm:py-16 space-y-16 flex-1">
        <section aria-label="K-water 물문화관 인사말">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-10 lg:p-12 shadow-sm space-y-8">
            {/* 인사말 상단 헤더 */}
            <div className="border-b border-slate-100 pb-6">
              <span className="text-xs font-bold uppercase tracking-wider text-sky-700 block mb-1">
                GREETINGS &amp; PURPOSE
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                인사말
              </h2>
              <p className="mt-1 text-xs sm:text-sm font-semibold text-slate-500">
                한국수자원공사 공간경관처 문화공간부
              </p>
            </div>

            {/* 자연스럽고 따뜻한 인사말 본문 글 */}
            <div className="space-y-6 text-sm sm:text-base text-slate-700 leading-relaxed font-normal">
              <p className="text-base sm:text-lg font-bold text-slate-900 leading-relaxed">
                안녕하십니까, 국민 여러분.<br />
                K-water 물문화관 통합 웹사이트를 방문해 주셔서 진심으로 감사드립니다.
              </p>

              <p>
                대한민국의 맑은 물이 흐르는 주요 댐 유역에는 물의 소중함과 수자원 관리의 역사를 나누는 <strong>전국 15개의 K-water 물문화관</strong>이 자리하고 있습니다. 물문화관은 지난 50년 치수와 이수의 발자취를 보존하는 기록관이자, 사계절 아름다운 댐 호수 풍경 속에서 자연과 사람이 호흡하는 휴식처입니다.
              </p>

              <p>
                그동안 각 현장별로 나뉘어 있던 관람 시간, 주차 안내, 가이드 해설 예약 소식을 한곳에서 편리하게 확인하실 수 있도록 이 온라인 공간을 준비했습니다. 방문을 계획하시는 순간부터 현장에 머무시는 시간까지, 더욱 편안하고 유익한 경험이 되기를 바라는 마음을 담았습니다.
              </p>

              <p>
                저희는 댐 시설이라는 고유의 인프라가 차가운 구조물에 머물지 않고, 자연 경관과 어우러져 지역 주민과 방문객 모두에게 온기를 전하는 수변 문화 공간이 되길 소망합니다. 아이들에게는 재미있는 생태 배움터가 되고, 지친 일상 속 어른들에게는 고즈넉한 쉼터가 될 수 있도록 정성껏 가꿔 나가겠습니다.
              </p>

              <p>
                사계절 빛깔이 달라지는 전국 물문화관에서 사랑하는 가족, 이웃과 함께 물이 주는 평온함을 만끽해 보시길 권해드립니다. 늘 국민 곁에서 가치 있는 공간으로 답하겠습니다.
              </p>

              <p className="font-semibold text-slate-800">
                감사합니다.
              </p>

              {/* 정갈한 하단 서명란 */}
              <div className="pt-8 border-t border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-full bg-[#004D95] text-white flex items-center justify-center font-black text-xs shadow-sm">
                    K
                  </div>
                  <span className="text-xs sm:text-sm font-bold text-slate-800">
                    K-water 물문화관
                  </span>
                </div>
                <span className="text-xs sm:text-sm font-bold text-sky-800">
                  한국수자원공사 공간경관처 문화공간부
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* 3. 물문화관이 만들어가는 3가지 가치 */}
        <section aria-label="물문화관 핵심 가치" className="space-y-6">
          <div className="text-center max-w-xl mx-auto space-y-1.5">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-sky-100 px-3 py-0.5 text-xs font-bold text-sky-700 uppercase tracking-wider">
              OUR VALUES
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              물문화관이 가꿔가는 세 가지 가치
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 font-medium">
              자연과 역사, 사람이 수변 공간에서 함께 어우러집니다.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {culturalValues.map((v) => (
              <div
                key={v.title}
                className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs hover:border-sky-300 hover:shadow-md transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="w-12 h-12 rounded-xl bg-sky-50 border border-sky-100 flex items-center justify-center mb-5">
                    {v.icon}
                  </div>
                  <h3 className="text-lg font-black text-slate-900 mb-1">
                    {v.title}
                  </h3>
                  <p className="text-xs font-bold text-sky-600 mb-3">
                    {v.subtitle}
                  </p>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
                    {v.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 4. 웹사이트 주요 이용 안내 */}
        <section aria-label="웹사이트 서비스 안내" className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-4 border-b border-slate-200">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-sky-700 block mb-1">
                SERVICES
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                통합 웹사이트 이용 안내
              </h2>
              <p className="mt-1 text-xs sm:text-sm text-slate-500 font-medium">
                국민 여러분의 편리한 방문을 지원하는 4가지 핵심 기능입니다.
              </p>
            </div>

            <Link
              href="/status"
              className="inline-flex items-center justify-center gap-1.5 rounded-full bg-slate-900 hover:bg-sky-600 text-xs sm:text-sm font-bold text-white px-5 py-2.5 transition shadow-xs whitespace-nowrap"
            >
              <span>전국 거점 현황지도</span>
              <span>→</span>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {hubServices.map((s) => (
              <Link
                key={s.title}
                href={s.path}
                className="group flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-5 hover:border-sky-400 hover:shadow-md transition-all duration-200"
              >
                <div>
                  <div className="text-2xl mb-3">{s.icon}</div>
                  <h3 className="text-base font-bold text-slate-900 group-hover:text-sky-600 transition-colors mb-1.5">
                    {s.title}
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed font-medium mb-4">
                    {s.desc}
                  </p>
                </div>
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-sky-600 group-hover:text-sky-700">
                  <span>{s.btnLabel}</span>
                  <span className="transform group-hover:translate-x-1 transition-transform">→</span>
                </div>
              </Link>
            ))}
          </div>
        </section>


      </main>

      <WaterHubFooter />
    </div>
  );
}
