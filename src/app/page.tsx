"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";

const THEMES = [
  {
    id: "technology",
    num: "01",
    code: "01 · TECHNOLOGY",
    title: "기술",
    en: "TECHNOLOGY",
    desc: "스마트 수자원 관리와 친환경 댐 이야기",
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
    desc: "강과 호수가 어우러진 수변 생태 공간",
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
    desc: "치수의 발자취와 수몰 마을의 기억",
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
    desc: "물과 함께 즐기는 복합 문화 공간",
    image: "/peace-dam-trench.jpg",
    link: "/main",
  },
];

export default function GatewayLandingPage() {
  const [bgIndex, setBgIndex] = useState(0);

  // 몇 초에 한 번씩 PC UI의 4대 테마별 이미지를 부드럽게 순환 (2초 디졸브 크로스페이드)
  useEffect(() => {
    const timer = setInterval(() => {
      setBgIndex((prev) => (prev + 1) % THEMES.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="selection:bg-sky-500 selection:text-white">
      {/* ══════════════════════════════════════════════════════════════
          1. 모바일 및 태블릿 세로 전용 UI (lg:hidden): 
             테마별 실사 순환 히어로 + 물문화관 소개 카드 + 부드러운 인터랙션
         ══════════════════════════════════════════════════════════════ */}
      <div className="flex lg:hidden min-h-screen bg-[#030712] text-white selection:bg-[#0094FF] selection:text-white flex-col items-center w-full relative overflow-hidden">
        {/* ── 상단 테마별 실사 배경 슬라이더 (2초 초완만 소프트 크로스페이드 + 화사한 밝기 적용) ── */}
        <div className="absolute top-0 left-0 right-0 h-[420px] sm:h-[480px] overflow-hidden pointer-events-none z-0">
          {THEMES.map((theme, idx) => {
            const isActive = idx === bgIndex;
            return (
              <div
                key={theme.id}
                className="absolute inset-0 will-change-[opacity]"
                style={{
                  opacity: isActive ? 1 : 0,
                  transition: "opacity 2000ms cubic-bezier(0.4, 0, 0.2, 1)",
                  zIndex: isActive ? 1 : 0,
                }}
              >
                <div
                  className="w-full h-full bg-cover bg-center brightness-[0.95] contrast-[1.05] will-change-transform animate-ken-burns"
                  style={{
                    backgroundImage: `url('${theme.image}')`,
                  }}
                />
              </div>
            );
          })}

          {/* 사진의 디테일과 밝기를 선명하게 살리면서 하단 다크 배경과 자연스럽게 블렌딩되는 비네트 */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#030712]/15 via-[#030712]/40 to-[#030712] z-2" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#030712]/30 via-transparent to-[#030712]/30 z-2" />
        </div>

        <div className="w-full max-w-xl md:max-w-2xl mx-auto flex flex-col min-h-screen justify-between relative z-10 px-5 py-4 sm:px-6 sm:py-5">
          
          {/* ── 1. 상단 헤더: 방울이 마스코트 (좌측) ── */}
          <header className="relative z-30 flex items-center justify-start pb-1 shrink-0">
            <Link
              href="/main"
              className="flex items-center gap-2 group transition-transform active:scale-95 cursor-pointer"
              title="K-water 온라인 물문화관 메인으로 이동"
            >
              <Image
                src="/bangwoori.png"
                alt="K-water 방울이 마스코트"
                width={48}
                height={48}
                style={{ width: "auto" }}
                className="h-9 sm:h-10 w-auto object-contain drop-shadow-md group-hover:scale-105 transition-transform"
                priority
              />
            </Link>
          </header>

          {/* ── 2. 히어로 섹션 (중앙 심볼 로고 + 물문화관 타이틀 + 소개 문구) ── */}
          <section className="relative pt-2 pb-4 sm:pt-4 sm:pb-6 flex flex-col items-center text-center shrink-0">
            {/* 중앙 심볼 로고 및 타이틀 (탭 시 메인 페이지로 바로 이동 - PC UI와 일치된 개방형 디자인) */}
            <Link
              href="/main"
              className="relative z-10 flex flex-col items-center group cursor-pointer active:scale-95 transition-transform"
              title="K-water 온라인 물문화관 메인으로 이동"
            >
              {/* 심볼 로고 (박스 없이 깔끔하게 배치) */}
              <div className="mb-2 animate-float-up">
                <Image
                  src="/images/landing_color_symbol.png"
                  alt="K-water 물문화관 심볼"
                  width={815}
                  height={921}
                  style={{ width: "auto" }}
                  className="h-16 sm:h-20 w-auto object-contain drop-shadow-2xl group-hover:scale-105 transition-transform duration-300"
                  priority
                />
              </div>

              {/* 타이틀 및 서브타이틀 */}
              <div className="flex flex-col items-center space-y-1">
                <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight whitespace-nowrap drop-shadow-md group-hover:text-sky-300 transition-colors">
                  물문화관
                </h1>
                <p className="text-[11px] sm:text-xs font-bold text-sky-400 tracking-tight whitespace-nowrap drop-shadow-md pt-0.5 opacity-95">
                  K-water 온라인 물문화관
                </p>
              </div>
            </Link>

            {/* 2줄 친근한 소개 문구 */}
            <p className="relative z-10 mt-3 text-[13px] sm:text-sm text-slate-200/90 font-medium leading-relaxed max-w-xs mx-auto break-keep">
              물과 함께한 기술·생태·역사·문화를
              <br />
              한곳에서 만나보세요.
            </p>
          </section>

          {/* ── 3. 물문화관 소개 카드 (어디를 눌러도 자연스럽게 main 페이지로 이동) ── */}
          <section className="relative z-10 my-auto py-2 flex flex-col gap-2.5 w-full">
            {THEMES.map((theme, index) => {
              // 순차 등장 애니메이션 딜레이
              const delayClass =
                index === 0
                  ? "animate-float-up"
                  : index === 1
                  ? "animate-float-up-fast"
                  : index === 2
                  ? "animate-float-up-delay-1"
                  : "animate-float-up-delay-2";

              return (
                <Link
                  key={theme.id}
                  href="/main"
                  className={`group relative w-full rounded-2xl overflow-hidden border border-white/10 hover:border-sky-400/50 active:border-sky-400/70 bg-slate-900/80 hover:bg-slate-900/95 p-3.5 sm:p-4 flex items-center justify-between transition-all duration-300 active:scale-[0.98] shadow-md hover:shadow-sky-500/15 cursor-pointer ${delayClass}`}
                >
                  {/* 카드 배경 실사 이미지 (호버/터치 시 은은한 줌인 효과) */}
                  <div
                    className="absolute inset-0 bg-cover bg-center opacity-25 brightness-75 group-hover:opacity-40 group-hover:scale-105 group-active:scale-105 transition-all duration-500 ease-out"
                    style={{ backgroundImage: `url('${theme.image}')` }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-slate-950/95 via-slate-950/80 to-slate-950/60" />

                  {/* 좌측 콘텐츠: 번호 + 타이틀 + 영문 + 자연스러운 소개 한 줄 */}
                  <div className="relative z-10 flex flex-col justify-center min-w-0 pr-3">
                    <div className="flex items-baseline gap-2">
                      <span className="text-sky-400 font-black text-sm tracking-wider">
                        {theme.num}
                      </span>
                      <span className="text-white font-black text-base tracking-tight group-hover:text-sky-300 transition-colors">
                        {theme.title}
                      </span>
                      <span className="text-slate-400 font-bold text-[10px] sm:text-[10.5px] uppercase tracking-wider">
                        {theme.en}
                      </span>
                    </div>
                    <p className="text-[11.5px] sm:text-xs text-slate-300/85 font-medium truncate mt-0.5">
                      {theme.desc}
                    </p>
                  </div>

                  {/* 우측 바로가기 화살표 버튼 (호버/터치 시 오른쪽으로 살짝 이동하는 모션) */}
                  <div className="relative z-10 w-8 h-8 rounded-full bg-white/5 group-hover:bg-sky-500/20 group-active:bg-sky-500/30 flex items-center justify-center text-slate-300 group-hover:text-sky-300 transition-all shrink-0">
                    <svg
                      className="w-4 h-4 transform group-hover:translate-x-1 group-active:translate-x-1 transition-transform"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.4} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </Link>
              );
            })}
          </section>

          {/* ── 4. 하단 액션 버튼 & 개인정보처리방침 ── */}
          <footer className="relative z-10 pt-3 pb-2 flex flex-col items-center gap-3 w-full shrink-0">
            {/* 대표 둘러보기 버튼 (쉬머 빛줄기 모션 적용) */}
            <div className="w-full max-w-sm sm:max-w-md">
              <Link
                href="/main"
                className="group relative overflow-hidden w-full min-h-[52px] sm:min-h-[56px] px-6 py-3.5 inline-flex items-center justify-center rounded-2xl bg-[#0094FF] hover:bg-[#0084e6] active:bg-[#0074cc] text-white font-black text-sm sm:text-base transition-all duration-200 shadow-xl shadow-[#0094FF]/25 tracking-tight active:scale-[0.98]"
              >
                {/* 은은하게 스쳐 지나가는 사선 빛줄기 (Shimmer Effect) */}
                <span className="absolute inset-0 w-1/2 h-full bg-gradient-to-r from-transparent via-white/35 to-transparent pointer-events-none animate-shimmer" />

                <span className="relative z-10">전국 물문화관 둘러보기</span>
                <span className="relative z-10 ml-2 transform group-hover:translate-x-1.5 transition-transform font-black">→</span>
              </Link>
            </div>

            {/* 개인정보처리방침 (3번째 첨부 이미지 스타일: 기본 폰트 색상 및 굵기 적용) */}
            <div className="pt-0.5">
              <Link
                href="/privacy"
                className="text-xs text-white/70 hover:text-white transition"
              >
                개인정보처리방침
              </Link>
            </div>
          </footer>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════
          2. 데스크톱 및 태블릿 가로 전용 UI (hidden lg:flex): 
             5열 분할 인터랙티브 레이아웃
         ══════════════════════════════════════════════════════════════ */}
      <div className="hidden lg:flex min-h-screen bg-slate-950 text-white flex-row overflow-x-hidden">
        {/* ── 컬럼 1 (맨 좌측): 브랜딩 사이드바 ── */}
        <div className="w-[19%] lg:w-[17%] xl:w-[16%] min-w-[200px] lg:min-w-[210px] max-w-[270px] shrink-0 bg-slate-950 border-r border-white/10 text-white p-5 lg:p-6 xl:p-7 flex flex-col justify-between items-center text-center relative z-20 shadow-2xl">
          
          {/* 1. 좌측 상단: 방울이 캐릭터 아이콘 (클릭 시 메인 이동) */}
          <div className="w-full flex justify-start items-center">
            <Link
              href="/main"
              title="K-water 온라인 물문화관 메인으로 이동"
              className="relative w-16 h-16 sm:w-18 sm:h-18 flex items-center justify-start group cursor-pointer"
            >
              <Image
                src="/bangwoori.png"
                alt="K-water 방울이 마스코트"
                width={72}
                height={72}
                style={{ width: "auto" }}
                className="object-contain drop-shadow-md group-hover:scale-105 transition duration-300"
                priority
              />
            </Link>
          </div>

          {/* 2. 가운데: K-water 물문화관 컬러풀 브랜드 상징 로고 (클릭 시 메인 이동) */}
          <Link
            href="/main"
            title="K-water 온라인 물문화관 메인으로 이동"
            className="my-6 sm:my-8 flex flex-col items-center w-full px-1 group cursor-pointer"
          >
            <Image
              src="/images/landing_color_symbol.png"
              alt="K-water 물문화관 심볼"
              width={815}
              height={921}
              style={{ width: "auto" }}
              className="h-20 sm:h-24 lg:h-28 w-auto object-contain drop-shadow-xl group-hover:scale-105 transition duration-300"
              priority
            />
            <h1 className="mt-3 text-2xl sm:text-3xl font-black text-white tracking-tight whitespace-nowrap drop-shadow-md group-hover:text-sky-300 transition-colors">
              물문화관
            </h1>
            <p className="mt-2 text-[11px] sm:text-xs font-bold text-sky-400 tracking-tight whitespace-nowrap opacity-90">
              K-water 온라인 물문화관
            </p>
          </Link>

          {/* 3. 하단: 전국 물문화관 둘러보기 버튼 및 개인정보처리방침 */}
          <div className="w-full pt-5 border-t border-white/10 px-1">
            <Link
              href="/main"
              className="w-full min-h-12 px-3 py-3 inline-flex items-center justify-center rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 text-xs sm:text-sm font-black transition duration-200 shadow-lg shadow-sky-500/25 group whitespace-nowrap tracking-tight"
            >
              <span>전국 물문화관 둘러보기</span>
              <span className="ml-1.5 transform group-hover:translate-x-1 transition duration-200">→</span>
            </Link>
            <div className="mt-3 flex items-center justify-center gap-2.5 text-[11px]">
              <Link
                href="/privacy"
                className="text-white/70 hover:text-white transition"
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
