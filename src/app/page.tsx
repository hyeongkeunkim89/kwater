import Link from "next/link";
import Image from "next/image";
import { WaterHubFooter } from "@/components/WaterHubFooter";
import { waterCenters, sidoList } from "@/data/centers";

export default function GatewayLandingPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col justify-between selection:bg-sky-500 selection:text-white">
      {/* 게이트웨이 상단 GNB 헤더 */}
      <header className="sticky top-0 z-50 shrink-0 border-b border-white/10 bg-slate-950/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-8">
          <Link href="/" className="flex items-center gap-3 group">
            <Image
              src="/kwater-logo.svg"
              alt="K-water 한국수자원공사"
              width={120}
              height={22}
              className="h-5 w-auto brightness-0 invert opacity-90 transition-opacity group-hover:opacity-100"
              priority
            />
            <div className="h-4 w-px bg-white/20 hidden sm:block" />
            <span className="text-xs sm:text-sm font-black tracking-tight text-white/90 group-hover:text-white transition">
              15대 댐 물문화관 대표 포털
            </span>
          </Link>

          <div className="flex items-center gap-3">
            <a
              href="https://www.kwater.or.kr"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex text-xs font-extrabold text-slate-300 hover:text-white px-4 py-2 rounded-full border border-white/15 bg-white/5 hover:bg-white/15 transition"
            >
              K-water 공식 홈페이지 ↗
            </a>
            <Link
              href="/main"
              className="inline-flex items-center justify-center text-xs font-black text-slate-950 bg-sky-400 hover:bg-sky-300 px-4 py-2 rounded-full shadow-lg shadow-sky-500/25 transition"
            >
              대표 홈페이지 진입 →
            </Link>
          </div>
        </div>
      </header>

      {/* 1. 관문 비주얼 히어로 섹션 (국립생태원 NIE 관문 스타일) */}
      <section className="relative w-full overflow-hidden py-16 sm:py-24 px-5 sm:px-8 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 border-b border-white/10">
        <div className="absolute inset-0 opacity-25 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />
        
        <div className="relative mx-auto max-w-5xl text-center flex flex-col items-center">
          <span className="inline-flex items-center gap-2 text-xs font-black text-sky-400 bg-sky-950/80 px-4 py-1.5 rounded-full border border-sky-500/30 tracking-widest uppercase shadow-inner">
            🌊 K-WATER WATER CULTURE CENTER PORTAL GATEWAY
          </span>

          <h1 className="mt-6 text-3xl sm:text-5xl lg:text-6xl font-black leading-tight sm:leading-tight tracking-tight text-white">
            강물이 만드는 역사와 생태,<br />
            <span className="bg-gradient-to-r from-sky-400 via-cyan-300 to-indigo-300 bg-clip-text text-transparent">
              전국 15대 물문화관 통합 관문
            </span>
          </h1>

          <p className="mt-5 text-sm sm:text-base text-slate-300 font-medium max-w-2xl leading-relaxed break-keep">
            소양강댐, 충주댐, 대청댐 등 한국수자원공사가 운영하는 전국 15개 수변 생태 거점의 종합 정보와 가이드 투어를 제공합니다. 아래 메인 버튼을 눌러 포털 홈페이지로 이동해 보세요.
          </p>

          {/* 핵심 진입 대형 버튼 (NIE 스타일) */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4 w-full max-w-md">
            <Link
              href="/main"
              className="w-full sm:w-auto min-h-14 px-8 inline-flex items-center justify-center rounded-2xl bg-sky-500 hover:bg-sky-400 text-slate-950 text-base font-black transition duration-200 shadow-xl shadow-sky-500/30 transform hover:-translate-y-0.5"
            >
              🌊 물문화관 대표 홈페이지 바로가기 →
            </Link>
            <Link
              href="/status"
              className="w-full sm:w-auto min-h-14 px-8 inline-flex items-center justify-center rounded-2xl bg-white/10 hover:bg-white/20 text-white text-base font-extrabold border border-white/20 transition duration-200"
            >
              🗺️ 현황 지도 바로가기
            </Link>
          </div>
        </div>
      </section>

      {/* 메인 관문 서비스 영역 */}
      <main className="mx-auto max-w-7xl w-full px-5 py-12 sm:py-16 space-y-12 sm:space-y-16 flex-1">
        
        {/* 2. NIE 스타일 4대 메인 관문 서비스 카드 그리드 */}
        <section aria-label="주요 관람 서비스">
          <div className="text-center mb-8">
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              K-water 물문화관 4대 서비스 관문
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 font-medium mt-1">
              원하시는 서비스를 선택하시면 대표 페이지로 즉시 연결됩니다.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                title: "물문화관 대표 포털",
                subtitle: "MAIN HOMEPAGE",
                desc: "15대 물문화관 종합 소식, 생태·역사·기술관 통합 메인 홈페이지",
                icon: "🌊",
                path: "/main",
                btnLabel: "대표 홈페이지 입장 →",
                accent: "from-sky-500/20 to-indigo-500/10 border-sky-500/30 hover:border-sky-400 text-sky-300",
                btnBg: "bg-sky-500 text-slate-950 font-black hover:bg-sky-400",
              },
              {
                title: "전국 15대 현황지도",
                subtitle: "NATIONWIDE MAP",
                desc: "전국 15개 수계별 물문화관 위치, 주소, 운영시간 대화형 지도",
                icon: "🗺️",
                path: "/status",
                btnLabel: "현황지도 보기 →",
                accent: "from-emerald-500/20 to-teal-500/10 border-emerald-500/30 hover:border-emerald-400 text-emerald-300",
                btnBg: "bg-emerald-500 text-slate-950 font-black hover:bg-emerald-400",
              },
              {
                title: "가이드 투어 예약",
                subtitle: "GUIDE TOUR",
                desc: "전문 해설사와 함께하는 전시관 & 댐 수변 탐방 맞춤형 사전 예약",
                icon: "📅",
                path: "/reserve",
                btnLabel: "투어 예약하기 →",
                accent: "from-amber-500/20 to-orange-500/10 border-amber-500/30 hover:border-amber-400 text-amber-300",
                btnBg: "bg-amber-500 text-slate-950 font-black hover:bg-amber-400",
              },
              {
                title: "시설 및 층별 도면",
                desc: "15대 물문화관 층별 실내 도면, 대표 전경 및 편의시설 사전 보기",
                subtitle: "FLOOR GUIDE",
                icon: "🏛️",
                path: "/yunyeong",
                btnLabel: "층별 도면보기 →",
                accent: "from-purple-500/20 to-indigo-500/10 border-purple-500/30 hover:border-purple-400 text-purple-300",
                btnBg: "bg-purple-500 text-slate-950 font-black hover:bg-purple-400",
              },
            ].map((item) => (
              <div
                key={item.title}
                className={[
                  "flex flex-col justify-between p-6 sm:p-7 rounded-3xl border bg-gradient-to-br transition duration-300 transform hover:-translate-y-1 shadow-xl",
                  item.accent,
                ].join(" ")}
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-4xl block mb-2" role="img" aria-label={item.title}>
                      {item.icon}
                    </span>
                    <span className="text-[9px] font-black tracking-widest uppercase opacity-70">
                      {item.subtitle}
                    </span>
                  </div>
                  <h3 className="mt-3 text-lg font-black text-white tracking-tight">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-xs text-slate-300 leading-relaxed font-medium">
                    {item.desc}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-white/10">
                  <Link
                    href={item.path}
                    className={[
                      "min-h-11 inline-flex items-center justify-center rounded-xl text-xs px-4 transition w-full text-center shadow-md",
                      item.btnBg,
                    ].join(" ")}
                  >
                    {item.btnLabel}
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 3. 4대 테마 관문 바로가기 (기술 / 생태 / 역사 / 교육) */}
        <section aria-label="4대 테마 관문" className="rounded-3xl border border-white/15 bg-slate-900/80 p-6 sm:p-8 shadow-2xl backdrop-blur-md">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-5">
            <div>
              <span className="text-xs font-black text-sky-400 tracking-widest uppercase">
                THEME GATEWAY
              </span>
              <h3 className="mt-1 text-xl sm:text-2xl font-black text-white">
                4대 테마관 안내 <span className="text-slate-400 font-normal">| 기술 · 생태 · 역사 · 교육</span>
              </h3>
            </div>
            <Link
              href="/main"
              className="text-xs font-extrabold text-sky-400 hover:text-sky-300 hover:underline"
            >
              전체 포털 바로가기 →
            </Link>
          </div>

          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              {
                title: "⚙️ 기술 (Technology)",
                desc: "첨단 댐 엔지니어링 및 스마트 수자원 통합 관리 기술관",
                path: "/main",
                badge: "기술관",
              },
              {
                title: "🌿 생태 (Ecology)",
                desc: "강과 호수, 습지 보전 및 친환경 수변 둘레길 생태관",
                path: "/status",
                badge: "생태관",
              },
              {
                title: "🏛️ 역사 (History)",
                desc: "대한민국 치수 발자취 및 수몰 마을 사람들의 기억 기록관",
                path: "/yunyeong",
                badge: "역사관",
              },
              {
                title: "🎓 교육 (Education)",
                desc: "가이드 해설 투어 예약 및 어린이 친환경 물 체험관",
                path: "/reserve",
                badge: "교육관",
              },
            ].map((theme) => (
              <Link
                key={theme.title}
                href={theme.path}
                className="group p-5 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-sky-400/40 transition duration-200 flex flex-col justify-between"
              >
                <div>
                  <span className="text-[10px] font-extrabold text-sky-300 bg-sky-950/80 px-2 py-0.5 rounded border border-sky-500/20">
                    {theme.badge}
                  </span>
                  <h4 className="mt-2.5 text-base font-black text-white group-hover:text-sky-300 transition">
                    {theme.title}
                  </h4>
                  <p className="mt-1.5 text-xs text-slate-300 leading-relaxed font-medium">
                    {theme.desc}
                  </p>
                </div>
                <span className="mt-4 text-[11px] font-extrabold text-sky-400 group-hover:underline">
                  홈페이지 연결 ↗
                </span>
              </Link>
            ))}
          </div>
        </section>

        {/* 4. 대표 정보 요약 바 */}
        <section className="rounded-2xl border border-white/10 bg-gradient-to-r from-slate-900 via-sky-950 to-slate-900 p-6 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4 text-center sm:text-left">
            <span className="text-3xl shrink-0">🏛️</span>
            <div>
              <h4 className="text-base font-black text-white">
                전국 15대 댐 물문화관 관람 안내
              </h4>
              <p className="text-xs text-slate-300 mt-0.5 font-medium">
                운영 시간: 09:00 ~ 18:00 (입장 마감 17:00) | 입장료 및 주차: 전 관람객 무료
              </p>
            </div>
          </div>
          <Link
            href="/main"
            className="shrink-0 min-h-11 px-6 inline-flex items-center justify-center rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 text-xs font-black transition shadow-lg shadow-sky-500/20"
          >
            대표 홈페이지로 이동 →
          </Link>
        </section>
      </main>

      <WaterHubFooter />
    </div>
  );
}
