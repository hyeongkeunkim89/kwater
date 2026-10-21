"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

const THEMES = [
  {
    id: "technology",
    num: "01",
    code: "01 · TECHNOLOGY",
    title: "기술",
    en: "TECHNOLOGY",
    desc: "스마트 수자원 관리, 댐 엔지니어링, 친환경 수력발전 기술 안내",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8d/Daecheong_Dam_after_rain_-_%EB%8C%80%EC%B2%AD%EB%8C%90.jpg/1280px-Daecheong_Dam_after_rain_-_%EB%8C%80%EC%B2%AD%EB%8C%90.jpg",
    link: "/main",
  },
  {
    id: "ecology",
    num: "02",
    code: "02 · ECOLOGY",
    title: "생태",
    en: "ECOLOGY",
    desc: "강과 호수, 수변 동식물 생태계, 아름다운 수변 둘레길 산책 안내",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ea/SoyangDam.JPG/1280px-SoyangDam.JPG",
    link: "/main",
  },
  {
    id: "history",
    num: "03",
    code: "03 · HISTORY",
    title: "역사",
    en: "HISTORY",
    desc: "대한민국 치수 발자취, 수몰 마을 사람들의 생활 사료와 추억 기록",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/2/23/Chungju_Lake.jpg/1280px-Chungju_Lake.jpg",
    link: "/main",
  },
  {
    id: "culture",
    num: "04",
    code: "04 · CULTURE & ARTS",
    title: "문화",
    en: "CULTURE & ARTS",
    desc: "수변 미디어아트, 레저 및 지역 문화행사, 대중 복합 휴식 공간 안내",
    image: "/peace-dam-trench.jpg",
    link: "/main",
  },
];

export default function GatewayLandingPage() {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <div className="selection:bg-sky-500 selection:text-white">
      {/* ══════════════════════════════════════════════════════════════
          1. 모바일 및 태블릿 세로 전용 UI (lg:hidden): C안 아코디언 인터랙티브 레이아웃
         ══════════════════════════════════════════════════════════════ */}
      <div className="flex lg:hidden h-[100dvh] w-full relative overflow-hidden flex-col justify-between p-4 sm:p-6 md:p-8 text-white bg-slate-950">
        {/* 전체 배경: 딥 오션블루 그라데이션 */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#020b18] via-[#010814] to-[#01040a]" />

        {/* 태블릿(md) 화면에서도 최적의 밸런스를 유지하도록 max-w 래퍼 적용 */}
        <div className="relative z-10 w-full max-w-xl md:max-w-2xl mx-auto h-full flex flex-col justify-between">
          {/* ── 1. 상단: 브랜드 로고 & 햄버거 메뉴 ── */}
          <header className="shrink-0 flex items-center justify-between pb-1 sm:pb-2">
            <div className="flex items-center gap-2 sm:gap-2.5">
              <Image
                src="/images/landing_color_symbol.png"
                alt="물문화관 로고"
                width={56}
                height={64}
                className="h-8 sm:h-9 md:h-10 w-auto object-contain drop-shadow"
                priority
              />
              <div className="flex flex-col">
                <span className="text-base sm:text-lg md:text-xl font-black tracking-tight text-white leading-tight">
                  물문화관
                </span>
                <span className="text-[8.5px] sm:text-[9.5px] md:text-[10px] font-extrabold text-sky-400 tracking-[0.16em] uppercase leading-tight">
                  WATER CULTURE PORTAL
                </span>
              </div>
            </div>

            <Link
              href="/main"
              aria-label="전체 둘러보기"
              className="p-2 -mr-1 text-white/90 hover:text-white active:scale-95 transition-transform"
            >
              <svg className="w-6 h-6 sm:w-7 sm:h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </Link>
          </header>

          {/* ── 2. 중앙: 인터랙티브 아코디언 카드 영역 (핸드폰/태블릿 최적화) ── */}
          <div className="flex-1 min-h-0 my-2.5 sm:my-3 md:my-4 flex flex-col gap-2 sm:gap-2.5 md:gap-3 w-full">
            {THEMES.map((theme, index) => {
              const isActive = activeIndex === index;

              if (isActive) {
                return (
                  <div
                    key={theme.id}
                    className="flex-1 min-h-[200px] sm:min-h-[240px] md:min-h-[280px] rounded-2xl sm:rounded-3xl overflow-hidden relative border border-white/20 shadow-2xl transition-all duration-500 ease-out flex flex-col justify-between p-5 sm:p-6 md:p-8"
                  >
                    {/* 배경 이미지 */}
                    <div
                      className="absolute inset-0 bg-cover bg-center brightness-[0.8] contrast-[1.05] transition-transform duration-700 ease-out"
                      style={{ backgroundImage: `url('${theme.image}')` }}
                    />
                    {/* 그라데이션 오버레이 */}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/95 via-slate-950/45 to-black/30" />

                    {/* 상단 뱃지 */}
                    <div className="relative z-10 flex items-center justify-between">
                      <span className="inline-flex items-center gap-1.5 text-[9.5px] sm:text-[10.5px] md:text-xs font-black tracking-widest text-sky-300 uppercase bg-slate-900/85 px-3 py-1 rounded-full border border-sky-400/40 backdrop-blur-md shadow-md">
                        {theme.code}
                      </span>
                    </div>

                    {/* 하단 텍스트 및 액션 링크 */}
                    <div className="relative z-10 space-y-1 sm:space-y-1.5">
                      <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight drop-shadow-md">
                        {theme.title}
                      </h2>
                      <p className="text-xs sm:text-[13px] md:text-sm text-slate-200/90 font-medium leading-relaxed max-w-sm md:max-w-lg line-clamp-2">
                        {theme.desc}
                      </p>
                      <div className="pt-2">
                        <Link
                          href={theme.link}
                          className="inline-flex items-center gap-1.5 text-xs sm:text-sm md:text-base font-bold text-sky-400 hover:text-sky-300 active:text-sky-200 group"
                        >
                          <span>자세히 보기</span>
                          <span className="transform group-hover:translate-x-1 group-active:translate-x-1 transition-transform">→</span>
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              }

              return (
                <button
                  key={theme.id}
                  type="button"
                  onClick={() => setActiveIndex(index)}
                  className="group h-13 sm:h-14 md:h-16 shrink-0 rounded-2xl overflow-hidden relative border border-white/10 shadow-md transition-all duration-300 ease-out flex items-center justify-between px-4 sm:px-5 md:px-6 active:scale-[0.99] text-left w-full cursor-pointer"
                >
                  {/* 배경 이미지 (어둡게 블러 처리) */}
                  <div
                    className="absolute inset-0 bg-cover bg-center brightness-[0.35] contrast-[1.1] transition-transform duration-500 group-hover:scale-105"
                    style={{ backgroundImage: `url('${theme.image}')` }}
                  />
                  <div className="absolute inset-0 bg-slate-950/75 group-hover:bg-slate-950/60 transition-colors" />

                  {/* 타이틀 및 번호 */}
                  <div className="relative z-10 flex items-center gap-2.5 sm:gap-3 md:gap-4">
                    <span className="text-sm sm:text-base md:text-lg font-black text-sky-400">
                      {theme.num}
                    </span>
                    <span className="text-base sm:text-lg md:text-xl font-black text-white">
                      {theme.title}
                    </span>
                    <span className="text-[11px] sm:text-xs md:text-sm font-bold text-slate-400 tracking-wider uppercase">
                      {theme.en}
                    </span>
                  </div>

                  {/* + 아이콘 */}
                  <div className="relative z-10 text-white/70 group-hover:text-white transition-colors">
                    <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M12 5v14m7-7H5" />
                    </svg>
                  </div>
                </button>
              );
            })}
          </div>

          {/* ── 3. 하단: 메인 탐색 CTA 버튼 & 푸터 고지 ── */}
          <footer className="shrink-0 pt-1 flex flex-col gap-2">
            <Link
              href="/main"
              className="group w-full min-h-[50px] sm:min-h-[54px] md:min-h-[58px] px-6 py-3.5 inline-flex items-center justify-center rounded-2xl bg-[#0094FF] hover:bg-[#0082e6] active:bg-[#0070c5] text-white font-black text-sm sm:text-base md:text-lg transition duration-200 shadow-xl shadow-[#0094FF]/25 tracking-tight active:scale-[0.98]"
            >
              <span>전국 물문화관 둘러보기</span>
              <span className="ml-2 transform group-hover:translate-x-1 group-active:translate-x-1 transition-transform font-black">→</span>
            </Link>
            <div className="flex items-center justify-center py-0.5">
              <Link
                href="/privacy"
                className="text-[11px] sm:text-xs md:text-sm font-bold text-[#FFD200] hover:text-yellow-300 underline underline-offset-4 transition"
              >
                개인정보처리방침
              </Link>
            </div>
          </footer>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════
          2. 데스크톱 및 태블릿 가로 전용 UI (hidden lg:flex): 웅장한 5열 분할 인터랙티브 레이아웃
         ══════════════════════════════════════════════════════════════ */}
      <div className="hidden lg:flex min-h-screen bg-slate-950 text-white flex-row overflow-x-hidden">
        {/* ── 컬럼 1 (맨 좌측): 브랜딩 사이드바 ── */}
        <div className="w-[19%] lg:w-[17%] xl:w-[16%] min-w-[200px] lg:min-w-[210px] max-w-[270px] shrink-0 bg-slate-950 border-r border-white/10 text-white p-5 lg:p-6 xl:p-7 flex flex-col justify-between items-center text-center relative z-20 shadow-2xl">
          
          {/* 1. 좌측 상단: 방울이 캐릭터 아이콘 */}
          <div className="w-full flex justify-start items-center">
            <div className="relative w-16 h-16 sm:w-18 sm:h-18 flex items-center justify-start group">
              <Image
                src="/bangwoori.png"
                alt="K-water 방울이 마스코트"
                width={72}
                height={72}
                className="object-contain drop-shadow-md group-hover:scale-105 transition duration-300"
                priority
              />
            </div>
          </div>

          {/* 2. 가운데: K-water 물문화관 컬러풀 브랜드 상징 로고 */}
          <div className="my-6 sm:my-8 flex flex-col items-center w-full px-1">
            <Image
              src="/images/landing_color_symbol.png"
              alt="K-water 물문화관 심볼"
              width={815}
              height={921}
              className="h-20 sm:h-24 lg:h-28 w-auto object-contain drop-shadow-xl hover:scale-105 transition duration-300"
              priority
            />
            <h1 className="mt-3 text-2xl sm:text-3xl font-black text-white tracking-tight whitespace-nowrap drop-shadow-md">
              물문화관
            </h1>
            <p className="mt-2 text-[10px] sm:text-[11px] font-black text-sky-400 tracking-[0.16em] uppercase whitespace-nowrap opacity-90">
              WATER CULTURE PORTAL
            </p>
          </div>

          {/* 3. 하단: 전국 물문화관 둘러보기 버튼 및 개인정보처리방침 */}
          <div className="w-full pt-5 border-t border-white/10 px-1">
            <Link
              href="/main"
              className="w-full min-h-12 px-3 py-3 inline-flex items-center justify-center rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 text-xs sm:text-sm font-black transition duration-200 shadow-lg shadow-sky-500/25 group whitespace-nowrap tracking-tight"
            >
              <span>전국 물문화관 둘러보기</span>
              <span className="ml-1.5 transform group-hover:translate-x-1 transition duration-200">→</span>
            </Link>
            <div className="mt-3 flex items-center justify-center gap-2.5 text-[11px] text-white/50">
              <Link
                href="/privacy"
                className="font-bold text-yellow-400 hover:text-yellow-300 underline underline-offset-2 transition"
              >
                개인정보처리방침
              </Link>
            </div>
          </div>
        </div>

        {/* ── 컬럼 2~5 (우측 4대 핵심 분야: 기술 / 생태 / 역사 / 문화) ── */}
        <div className="flex-1 flex flex-row min-h-screen">
          
          {/* ── 컬럼 2: 기술 (Technology) ── */}
          <Link
            href="/main"
            className="group relative flex-1 min-h-screen border-r border-white/10 overflow-hidden transition-all duration-500 ease-out hover:flex-[1.35] flex flex-col justify-end p-5 lg:p-6 xl:p-8"
          >
            <div
              className="absolute inset-0 bg-cover bg-center transition-transform duration-700 ease-out group-hover:scale-105 brightness-[0.9] contrast-[1.05]"
              style={{
                backgroundImage: `url('https://upload.wikimedia.org/wikipedia/commons/thumb/8/8d/Daecheong_Dam_after_rain_-_%EB%8C%80%EC%B2%AD%EB%8C%90.jpg/1280px-Daecheong_Dam_after_rain_-_%EB%8C%80%EC%B2%AD%EB%8C%90.jpg')`,
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/95 via-slate-950/40 to-slate-950/10 group-hover:from-slate-950/90 transition duration-300" />

            <div className="relative z-10">
              <span className="inline-flex items-center gap-1.5 text-[10px] font-black tracking-widest text-sky-300 uppercase bg-slate-900/80 px-3 py-1 rounded-full border border-sky-400/30 backdrop-blur-md">
                <span className="w-1.5 h-1.5 rounded-full bg-sky-400 animate-pulse" />
                01 · TECHNOLOGY
              </span>
              <h2 className="mt-3 text-xl lg:text-2xl xl:text-3xl font-black text-white group-hover:text-sky-300 transition drop-shadow-md flex items-center gap-2.5">
                <svg className="w-6 h-6 text-sky-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span>기술</span>
              </h2>
              <p className="mt-1.5 text-xs text-slate-300 font-medium leading-relaxed tracking-[-0.03em] break-keep line-clamp-2">
                스마트 수자원 관리, 댐 엔지니어링, 친환경 수력발전 기술 안내
              </p>
            </div>
          </Link>

          {/* ── 컬럼 3: 생태 (Ecology) ── */}
          <Link
            href="/main"
            className="group relative flex-1 min-h-screen border-r border-white/10 overflow-hidden transition-all duration-500 ease-out hover:flex-[1.35] flex flex-col justify-end p-5 lg:p-6 xl:p-8"
          >
            <div
              className="absolute inset-0 bg-cover bg-center transition-transform duration-700 ease-out group-hover:scale-105 brightness-[0.9] contrast-[1.05]"
              style={{
                backgroundImage: `url('https://upload.wikimedia.org/wikipedia/commons/thumb/e/ea/SoyangDam.JPG/1280px-SoyangDam.JPG')`,
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/95 via-slate-950/40 to-slate-950/10 group-hover:from-slate-950/90 transition duration-300" />

            <div className="relative z-10">
              <span className="inline-flex items-center gap-1.5 text-[10px] font-black tracking-widest text-sky-300 uppercase bg-slate-900/80 px-3 py-1 rounded-full border border-sky-400/30 backdrop-blur-md">
                <span className="w-1.5 h-1.5 rounded-full bg-sky-400 animate-pulse" />
                02 · ECOLOGY
              </span>
              <h2 className="mt-3 text-xl lg:text-2xl xl:text-3xl font-black text-white group-hover:text-sky-300 transition drop-shadow-md flex items-center gap-2.5">
                <svg className="w-6 h-6 text-sky-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                </svg>
                <span>생태</span>
              </h2>
              <p className="mt-1.5 text-xs text-slate-300 font-medium leading-relaxed tracking-[-0.03em] break-keep line-clamp-2">
                강과 호수, 수변 동식물 생태계, 아름다운 수변 둘레길 산책 안내
              </p>
            </div>
          </Link>

          {/* ── 컬럼 4: 역사 (History) ── */}
          <Link
            href="/main"
            className="group relative flex-1 min-h-screen border-r border-white/10 overflow-hidden transition-all duration-500 ease-out hover:flex-[1.35] flex flex-col justify-end p-5 lg:p-6 xl:p-8"
          >
            <div
              className="absolute inset-0 bg-cover bg-center transition-transform duration-700 ease-out group-hover:scale-105 brightness-[0.9] contrast-[1.05]"
              style={{
                backgroundImage: `url('https://upload.wikimedia.org/wikipedia/commons/thumb/2/23/Chungju_Lake.jpg/1280px-Chungju_Lake.jpg')`,
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/95 via-slate-950/40 to-slate-950/10 group-hover:from-slate-950/90 transition duration-300" />

            <div className="relative z-10">
              <span className="inline-flex items-center gap-1.5 text-[10px] font-black tracking-widest text-sky-300 uppercase bg-slate-900/80 px-3 py-1 rounded-full border border-sky-400/30 backdrop-blur-md">
                <span className="w-1.5 h-1.5 rounded-full bg-sky-400 animate-pulse" />
                03 · HISTORY
              </span>
              <h2 className="mt-3 text-xl lg:text-2xl xl:text-3xl font-black text-white group-hover:text-sky-300 transition drop-shadow-md flex items-center gap-2.5">
                <svg className="w-6 h-6 text-sky-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5m0 0h4m-4 0V11m0 0V7m0 4h4m-4 0H7" />
                </svg>
                <span>역사</span>
              </h2>
              <p className="mt-1.5 text-xs text-slate-300 font-medium leading-relaxed tracking-[-0.03em] break-keep line-clamp-2">
                대한민국 치수 발자취, 수몰 마을 사람들의 생활 사료와 추억 기록
              </p>
            </div>
          </Link>

          {/* ── 컬럼 5: 문화 (Culture) ── */}
          <Link
            href="/main"
            className="group relative flex-1 min-h-screen overflow-hidden transition-all duration-500 ease-out hover:flex-[1.35] flex flex-col justify-end p-5 lg:p-6 xl:p-8"
          >
            <div
              className="absolute inset-0 bg-cover bg-center transition-transform duration-700 ease-out group-hover:scale-105 brightness-[0.9] contrast-[1.05]"
              style={{
                backgroundImage: `url('/peace-dam-trench.jpg')`,
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/95 via-slate-950/40 to-slate-950/10 group-hover:from-slate-950/90 transition duration-300" />

            <div className="relative z-10">
              <span className="inline-flex items-center gap-1.5 text-[10px] font-black tracking-widest text-sky-300 uppercase bg-slate-900/80 px-3 py-1 rounded-full border border-sky-400/30 backdrop-blur-md">
                <span className="w-1.5 h-1.5 rounded-full bg-sky-400 animate-pulse" />
                04 · CULTURE &amp; ARTS
              </span>
              <h2 className="mt-3 text-xl lg:text-2xl xl:text-3xl font-black text-white group-hover:text-sky-300 transition drop-shadow-md flex items-center gap-2.5">
                <svg className="w-6 h-6 text-sky-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
                </svg>
                <span>문화</span>
              </h2>
              <p className="mt-1.5 text-xs text-slate-300 font-medium leading-relaxed tracking-[-0.03em] break-keep line-clamp-2">
                수변 미디어아트, 레저 및 지역 문화행사, 대중 복합 휴식 공간 안내
              </p>
            </div>
          </Link>

        </div>
      </div>
    </div>
  );
}
