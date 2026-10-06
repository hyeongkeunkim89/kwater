import Image from "next/image";
import Link from "next/link";
import { WaterHubHeader } from "@/components/WaterHubHeader";
import { WaterHubFooter } from "@/components/WaterHubFooter";

export const metadata = {
  title: "문화관 소개 & 인사말 | K-water 물문화관",
  description:
    "한국수자원공사 공간경관처 문화공간부에서 전하는 물문화관 웹사이트 구축 취지와 인사말입니다. 전국 15개 물문화관에서 국민과 물을 잇는 가치를 만들어갑니다.",
};

export default function IntroPage() {
  // 공간경관처 문화공간부 3대 추진 방향
  const coreMissions = [
    {
      number: "01",
      title: "수자원 역사의 체계적 보존 & 전파",
      subtitle: "50년 치수·이수 역사 사료",
      desc: "대한민국 수자원 개발과 댐 건설의 50년 역사를 디지털 사료와 전시로 기록하여, 물의 소중함과 수자원의 가치를 미래 세대에 전달합니다.",
      tag: "역사 & 보존",
      icon: (
        <svg className="w-6 h-6 text-sky-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      ),
    },
    {
      number: "02",
      title: "친환경 수변 공간경관 조성 & 상생",
      subtitle: "지역과 호흡하는 문화 쉼터",
      desc: "댐 유역 수변 경관에 지역 고유의 인문·자연 요소를 입혀, 단순한 치수 시설을 넘어 지역 주민과 방문객이 휴식하는 복합 수변 문화공간을 가꿉니다.",
      tag: "경관 & 상생",
      icon: (
        <svg className="w-6 h-6 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5 5 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
    },
    {
      number: "03",
      title: "국민 중심의 디지털 통합 소통",
      subtitle: "실시간 정보 & 원스톱 서비스",
      desc: "전국 15개 거점 물문화관의 운영 현황, 가이드 투어 사전 예약, 층별 도면 및 행사를 한눈에 조회할 수 있는 디지털 허브를 운영합니다.",
      tag: "디지털 소통",
      icon: (
        <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
    },
  ];

  // 통합 웹사이트 주요 제공 서비스
  const hubServices = [
    {
      title: "전국 15개 거점 현황 지도",
      desc: "수도권부터 강원, 충청, 호남, 영남 15개 물문화관의 실시간 관람 가능 상태와 운영시간을 확인하세요.",
      btnLabel: "현황지도 조회",
      path: "/status",
      icon: "🗺️",
    },
    {
      title: "무료 가이드 투어 사전 예약",
      desc: "전문 도슨트 해설사와 함께 물문화관 전시장과 시설을 깊이 있게 체험하는 해설 프로그램을 예약하세요.",
      btnLabel: "투어 예약하기",
      path: "/reserve",
      icon: "📅",
    },
    {
      title: "층별 시설 & 대표 전시 안내",
      desc: "각 물문화관별 실내 공간 구성, 층별 주요 전시물, 힐링 북카페 및 편의시설 안내를 살펴보세요.",
      btnLabel: "시설안내 보기",
      path: "/centers",
      icon: "🏛️",
    },
    {
      title: "물문화 소식 & 시민 참여",
      desc: "물문화관에서 펼쳐지는 다채로운 문화 행사, 생태 체험 클래스, 현장 방문 후기를 공유해 보세요.",
      btnLabel: "소식 & 소통하기",
      path: "/news",
      icon: "📣",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans break-keep">
      <WaterHubHeader activeNav="intro" />

      {/* 1. 히어로 비주얼 배너 */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-[#003870] to-[#004D95] text-white">
        {/* 히어로 배경 패턴 및 은은한 광원 효과 */}
        <div className="pointer-events-none absolute inset-0 opacity-20 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:24px_24px]" />
        <div className="pointer-events-none absolute -left-20 -top-20 h-96 w-96 rounded-full bg-sky-400/20 blur-[120px]" />
        <div className="pointer-events-none absolute right-0 bottom-0 h-96 w-96 rounded-full bg-indigo-500/20 blur-[140px]" />

        <div className="relative mx-auto max-w-7xl px-6 py-16 sm:py-20 lg:px-8 lg:py-24 text-center sm:text-left">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* 좌측 메인 타이틀 & 부서 뱃지 */}
            <div className="lg:col-span-8 space-y-4">
              <div className="inline-flex items-center gap-2 rounded-full bg-sky-400/15 border border-sky-300/30 px-4 py-1.5 backdrop-blur-md">
                <span className="h-2 w-2 rounded-full bg-sky-400 animate-pulse" />
                <span className="text-xs font-bold text-sky-200 tracking-wide uppercase">
                  한국수자원공사 공간경관처 문화공간부
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black tracking-tight leading-tight text-white drop-shadow-md">
                사람과 물, 문화가 만나는 수변 공간 —<br className="hidden sm:inline" />
                <span className="text-sky-300">K-water 물문화관</span>이 함께합니다.
              </h1>

              <p className="text-xs sm:text-sm md:text-base font-medium text-slate-200 leading-relaxed max-w-2xl">
                전국 15개 댐 유역의 물문화관을 하나의 네트워크로 연결하여,<br className="hidden sm:inline" />
                국민 여러분께 더욱 가까이 다가가는 문화·체험 공간을 가꾸어 나가겠습니다.
              </p>
            </div>

            {/* 우측 공식 슬로건 이미지 카체 */}
            <div className="lg:col-span-4 flex justify-center lg:justify-end">
              <div className="rounded-2xl border border-white/20 bg-white/10 p-6 backdrop-blur-md shadow-2xl text-center max-w-xs w-full">
                <Image
                  src="/images/slogan.png"
                  alt="세상에 행복을 水 놓다"
                  width={320}
                  height={90}
                  priority
                  className="h-auto w-auto max-w-[220px] sm:max-w-[260px] object-contain mx-auto filter drop-shadow-md mb-3 brightness-110"
                />
                <p className="text-[11px] font-bold text-sky-200 tracking-wider uppercase">
                  K-water Spatial Landscape &amp; Culture
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. 공간경관처 문화공간부 공식 인사말 & 웹사이트 구축 취지 (CEO/부서장 서한 스타일) */}
      <main className="mx-auto max-w-7xl w-full px-6 py-12 sm:py-16 space-y-16 flex-1">
        <section aria-label="한국수자원공사 공간경관처 문화공간부 인사말">
          <div className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 sm:p-10 lg:p-14 shadow-lg">
            {/* 상단 장식 구역 */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-8 border-b border-slate-150">
              <div>
                <span className="text-xs font-black uppercase tracking-widest text-sky-700 block mb-1">
                  GREETING &amp; PURPOSE
                </span>
                <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900">
                  문화공간부 인사말 및 홍보 허브 구축 취지
                </h2>
              </div>

              <div className="shrink-0 inline-flex items-center gap-2 rounded-xl bg-slate-100 border border-slate-200/80 px-4 py-2 text-xs font-bold text-slate-700">
                <svg className="h-4 w-4 text-[#004D95]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5m0 0h6m-6 0V11m0 0h6" />
                </svg>
                <span>K-water 공간경관처 문화공간부</span>
              </div>
            </div>

            {/* 인사말 본문 서한 */}
            <div className="mt-8 sm:mt-10 space-y-6 text-sm sm:text-base text-slate-700 leading-relaxed font-normal">
              {/* 메인 쿼트 인용구 */}
              <div className="rounded-2xl bg-gradient-to-r from-sky-50 via-indigo-50/50 to-sky-50 p-5 sm:p-6 border-l-4 border-[#004D95] font-semibold text-slate-800 text-base sm:text-lg">
                &ldquo;안녕하십니까, 국민 여러분. 한국수자원공사(K-water) 공간경관처 문화공간부 홈페이지를 찾아주셔서 진심으로 감사드립니다.&rdquo;
              </div>

              <p className="break-keep">
                대한민국 주요 댐 수역에 조성된 <strong>전국 15개 K-water 물문화관</strong>은 수자원 개발 50년의 역사 사료를 보존하는 가치 있는 기록관이자, 생태 교육과 아름다운 수변 휴식을 제공하는 국민 복합문화공간입니다.
              </p>

              <p className="break-keep">
                그동안 각 지역 물문화관별로 흩어져 있던 관람 정보, 가이드 투어 신청, 층별 시설 안내를 국민 여러분께서 보다 편리하고 쉽게 이용하실 수 있도록, 저희 <strong>공간경관처 문화공간부에서는 전국 물문화관 통합 홍보 허브 웹사이트를 새롭게 구축</strong>하게 되었습니다.
              </p>

              {/* 3대 핵심 역할 서술 서브 카드 */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 py-4">
                <div className="rounded-xl bg-slate-50 border border-slate-200/90 p-4 space-y-1.5">
                  <span className="text-xs font-bold text-sky-700 block uppercase">1. 정보의 파편화 해소</span>
                  <p className="text-xs sm:text-sm font-semibold text-slate-800">
                    전국 15개 거점의 운영시간, 관람 상태, 휴관일 정보를 한눈에 실시간 확인
                  </p>
                </div>
                <div className="rounded-xl bg-slate-50 border border-slate-200/90 p-4 space-y-1.5">
                  <span className="text-xs font-bold text-sky-700 block uppercase">2. 예약 편의성 대폭 강화</span>
                  <p className="text-xs sm:text-sm font-semibold text-slate-800">
                    전문 도슨트 해설사의 무료 가이드 투어 프로그램을 원스톱 온라인 사전 예약
                  </p>
                </div>
                <div className="rounded-xl bg-slate-50 border border-slate-200/90 p-4 space-y-1.5">
                  <span className="text-xs font-bold text-sky-700 block uppercase">3. 수변 문화 가치 창출</span>
                  <p className="text-xs sm:text-sm font-semibold text-slate-800">
                    댐 시설 경관과 어우러지는 수변 생태·문화 콘텐츠를 지속적으로 공유
                  </p>
                </div>
              </div>

              <p className="break-keep">
                저희 문화공간부는 단순히 건물을 관리하는 것을 넘어, 댐이라는 웅장한 수자원 인프라에 <strong>친환경 공간 경관 가치</strong>와 <strong>주민 상생의 스토리</strong>를 입히고 있습니다. 물의 소중함을 배우는 생태 교육 공간이자, 가족과 이웃이 부담 없이 쉬어갈 수 있는 따뜻한 쉼터가 되도록 가꾸어 나가겠습니다.
              </p>

              <p className="break-keep">
                언제든 전국 15개 물문화관을 찾으셔서 물과 사람이 함께 만드는 행복한 순간을 경험해 보시길 바라며, 늘 국민의 목소리에 귀 기울이는 공간경관처 문화공간부가 되겠습니다. 감사합니다.
              </p>

              {/* 하단 서명란 */}
              <div className="pt-8 border-t border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-[#004D95] text-white flex items-center justify-center font-black text-sm shadow-md">
                    K
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-500 block">K-water 수자원 문화공간 통합 관리</span>
                    <span className="text-sm font-black text-slate-900">한국수자원공사 공간경관처 문화공간부</span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-xs text-slate-400 font-semibold block">Spatial Landscape &amp; Cultural Space Dept.</span>
                  <span className="text-sm font-bold text-sky-800">임직원 일동 敬上</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 3. 공간경관처 문화공간부 3대 핵심 추진 방향 */}
        <section aria-label="문화공간부 3대 핵심 추진 방향" className="space-y-6">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-sky-100 px-3.5 py-1 text-xs font-black tracking-wider uppercase text-sky-700">
              OUR CORE MISSIONS
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              문화공간부가 만들어가는 3대 가치
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 font-medium">
              대한민국 수자원의 역사를 보존하고 친환경 수변 경관으로 국민과 소통합니다.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {coreMissions.map((m) => (
              <div
                key={m.title}
                className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-sky-400 hover:shadow-xl"
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <span className="text-3xl font-black text-sky-200 group-hover:text-sky-500 transition-colors">
                      {m.number}
                    </span>
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-50 border border-slate-200/80 group-hover:bg-sky-50 group-hover:border-sky-200 transition-colors">
                      {m.icon}
                    </div>
                  </div>

                  <span className="inline-block rounded-md bg-sky-50 px-2.5 py-0.5 text-xs font-bold text-sky-700 mb-2 border border-sky-100">
                    {m.tag}
                  </span>
                  <h3 className="text-lg font-black text-slate-900 tracking-tight mb-1 group-hover:text-[#004D95] transition-colors">
                    {m.title}
                  </h3>
                  <p className="text-xs font-bold text-slate-400 mb-3">
                    {m.subtitle}
                  </p>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
                    {m.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 4. 물문화관 통합 홍보 허브 주요 제공 서비스 */}
        <section aria-label="통합 웹사이트 주요 제공 서비스" className="rounded-3xl bg-slate-900 text-white p-8 sm:p-12 space-y-8 shadow-xl">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-800 pb-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-sky-400 block mb-1">
                INTEGRATED SERVICES
              </span>
              <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
                웹사이트 주요 이용 안내
              </h2>
              <p className="mt-1 text-xs sm:text-sm text-slate-400 font-medium">
                국민 여러분의 편리한 방문을 돕기 위해 제공되는 4가지 핵심 기능입니다.
              </p>
            </div>

            <Link
              href="/status"
              className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-xs sm:text-sm font-bold text-white px-5 py-2.5 transition shadow-sm"
            >
              <span>전국 거점 현황지도 바로가기</span>
              <span>→</span>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {hubServices.map((s) => (
              <Link
                key={s.title}
                href={s.path}
                className="group flex flex-col justify-between rounded-2xl border border-slate-800 bg-slate-800/60 p-5 transition hover:bg-slate-800 hover:border-sky-500/50 hover:shadow-lg"
              >
                <div>
                  <div className="text-2xl mb-3">{s.icon}</div>
                  <h3 className="text-base font-bold text-white group-hover:text-sky-300 transition-colors mb-2">
                    {s.title}
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed font-medium mb-4">
                    {s.desc}
                  </p>
                </div>
                <div className="pt-3 border-t border-slate-700/60 flex items-center justify-between text-xs font-bold text-sky-400 group-hover:text-sky-300">
                  <span>{s.btnLabel}</span>
                  <span className="transform group-hover:translate-x-1 transition-transform">→</span>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* 5. 하단 CTA 바로가기 섹션 */}
        <section aria-label="방문 권유 하단 CTA" className="rounded-3xl bg-gradient-to-r from-sky-50 via-indigo-50 to-sky-50 border border-sky-200/70 p-8 sm:p-12 text-center space-y-6">
          <div className="max-w-2xl mx-auto space-y-3">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-sky-100 px-3.5 py-1 text-xs font-black tracking-wider uppercase text-sky-800">
              K-WATER WATER CULTURE HUB
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              전국 15개 물문화관에서 소중한 추억을 만드세요
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 font-medium">
              한국수자원공사 공간경관처 문화공간부가 국민 여러분의 따뜻하고 유익한 방문을 정성껏 준비하겠습니다.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <Link
              href="/status"
              className="w-full sm:w-auto inline-flex min-h-12 items-center justify-center rounded-xl bg-[#004D95] hover:bg-[#003870] text-white font-bold text-sm px-8 transition shadow-md gap-2"
            >
              <span>전국 거점 지도 둘러보기</span>
              <span>→</span>
            </Link>
            <Link
              href="/reserve"
              className="w-full sm:w-auto inline-flex min-h-12 items-center justify-center rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-800 font-bold text-sm px-8 transition shadow-xs gap-2"
            >
              <span>가이드 해설 투어 예약</span>
              <span>📅</span>
            </Link>
          </div>
        </section>
      </main>

      <WaterHubFooter />
    </div>
  );
}
