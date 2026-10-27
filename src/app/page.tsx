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
  const [isNavigating, setIsNavigating] = useState(false);

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
             100dvh 단일 뷰포트 맞춤형 스플래시 게이트웨이 (스크롤 없이 버튼 노출)
         ══════════════════════════════════════════════════════════════ */}
      <div className="flex lg:hidden h-[100dvh] max-h-[100dvh] bg-[#030712] text-white selection:bg-[#0094FF] selection:text-white flex-col items-center w-full relative overflow-hidden">
        {/* ── 상단 테마별 실사 배경 슬라이더 (2초 초완만 소프트 크로스페이드 + 화사한 밝기 적용) ── */}
        <div className="absolute top-0 left-0 right-0 h-[65dvh] sm:h-[70dvh] overflow-hidden pointer-events-none z-0">
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
          <div className="absolute inset-0 bg-gradient-to-b from-[#030712]/15 via-[#030712]/45 to-[#030712] z-2" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#030712]/30 via-transparent to-[#030712]/30 z-2" />
        </div>

        <div className="w-full max-w-xl md:max-w-2xl mx-auto h-full flex flex-col justify-between relative z-10 px-5 pt-3 pb-4 sm:px-6 sm:pt-4 sm:pb-6">
          
          {/* ── 1. 상단 헤더: 방울이 마스코트 (좌측) ── */}
          <header className="relative z-30 flex items-center justify-start shrink-0 pt-1">
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
                className="h-8 sm:h-9 w-auto object-contain drop-shadow-md group-hover:scale-105 transition-transform"
                priority
              />
            </Link>
          </header>

          {/* ── 2. 본문 영역: 상단 로고부와 하단 문구 분리 배치 (한 화면 100dvh 완전 맞춤) ── */}
          <section className="relative flex-1 flex flex-col justify-between items-center text-center py-2 sm:py-4 min-h-0">
            {/* 상단 배치: 중앙 심볼 로고 및 타이틀 (위쪽으로 이동) */}
            <div className="flex flex-col items-center pt-2 sm:pt-4 shrink-0">
              <Link
                href="/main"
                prefetch={true}
                onClick={() => setIsNavigating(true)}
                className={`relative z-10 flex flex-col items-center group cursor-pointer transition-all duration-150 ease-out select-none ${
                  isNavigating
                    ? "scale-90 opacity-90 brightness-125"
                    : "active:scale-90 active:brightness-125 hover:scale-[1.02]"
                }`}
                title="K-water 온라인 물문화관 메인으로 이동"
              >
                {/* 심볼 로고 (상단 집약형 실키 오로라 글로우 모션 + 터치 피드백) */}
                <div className="relative mb-2 flex items-center justify-center">
                  {/* 1차 외부 광배: 심볼 상단부에 집중되어 아래 텍스트를 침범하지 않는 포지셔닝 */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[65%] w-18 h-18 sm:w-22 sm:h-22 rounded-full bg-sky-400/20 blur-xl animate-aura-smooth pointer-events-none" />

                  {/* 2차 내부 광배: 로고 심볼 윤곽선에 밀착된 은은한 청록빛 */}
                  <div
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[65%] w-13 h-13 sm:w-16 sm:h-16 rounded-full bg-cyan-300/35 blur-md animate-aura-smooth pointer-events-none"
                    style={{ animationDelay: "-1.8s" }}
                  />

                  <Image
                    src="/images/landing_color_symbol.png"
                    alt="K-water 물문화관 심볼"
                    width={815}
                    height={921}
                    style={{ width: "auto" }}
                    className="relative z-10 h-14 sm:h-18 w-auto object-contain drop-shadow-[0_6px_16px_rgba(0,148,255,0.3)] transition-transform duration-200"
                    priority
                  />
                </div>

                {/* 타이틀 및 서브타이틀 (상위 z-index 부여로 후광 침범 없이 또렷하게 분리) */}
                <div className="relative z-20 flex flex-col items-center space-y-0.5 sm:space-y-1">
                  <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight whitespace-nowrap drop-shadow-[0_2px_8px_rgba(0,0,0,0.85)] group-hover:text-sky-300 transition-colors">
                    물문화관
                  </h1>
                  <p
                    className="text-[10.5px] sm:text-xs font-black text-white tracking-tight whitespace-nowrap pt-0.5"
                    style={{
                      textShadow: "0 1px 3px rgba(0, 0, 0, 0.95), 0 2px 8px rgba(0, 0, 0, 0.9)",
                    }}
                  >
                    K-water 온라인 물문화관
                  </p>
                </div>

                {/* 탭 즉시 반응: 1초 로딩 대기시간 동안 사용자에게 즉각 피드백 전달 */}
                {isNavigating && (
                  <div className="mt-2 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-500/90 text-white text-[10.5px] sm:text-[11px] font-bold shadow-lg animate-pulse">
                    <svg className="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                    </svg>
                    <span>메인으로 이동 중...</span>
                  </div>
                )}
              </Link>
            </div>

            {/* 사진 가운데 기준 하단 배치: 2줄 친근한 소개 문구 */}
            <div className="pb-1 sm:pb-3 shrink-0">
              <p
                className="relative z-10 text-[13px] sm:text-sm text-slate-100 font-medium leading-relaxed max-w-xs mx-auto break-keep"
                style={{
                  textShadow: "0 2px 8px rgba(0, 0, 0, 0.9), 0 1px 3px rgba(0, 0, 0, 0.95)",
                }}
              >
                물과 함께한 기술·생태·역사·문화를
                <br />
                한곳에서 만나보세요.
              </p>
            </div>
          </section>

          {/* ── 3. 하단 액션 버튼 & 개인정보처리방침 (한 화면 안에 항상 노출) ── */}
          <footer className="relative z-10 pt-2 pb-2 sm:pb-3 flex flex-col items-center gap-2.5 w-full shrink-0">
            {/* 대표 입장 버튼 (쉬머 빛줄기 모션 적용) */}
            <div className="w-full max-w-sm sm:max-w-md">
              <Link
                href="/main"
                className="group relative overflow-hidden w-full min-h-[50px] sm:min-h-[54px] px-6 py-3 inline-flex items-center justify-center rounded-2xl bg-[#0094FF] hover:bg-[#0084e6] active:bg-[#0074cc] text-white font-black text-sm sm:text-base transition-all duration-200 shadow-xl shadow-[#0094FF]/25 tracking-tight active:scale-[0.98]"
              >
                {/* 은은하게 스쳐 지나가는 사선 빛줄기 (Shimmer Effect) */}
                <span className="absolute inset-0 w-1/2 h-full bg-gradient-to-r from-transparent via-white/35 to-transparent pointer-events-none animate-shimmer" />

                <span className="relative z-10">온라인 물문화관 입장하기</span>
                <span className="relative z-10 ml-2 transform group-hover:translate-x-1.5 transition-transform font-black">→</span>
              </Link>
            </div>

            {/* 개인정보처리방침 (3번째 첨부 이미지 스타일: 기본 폰트 색상 및 굵기 적용) */}
            <div className="pt-0.5">
              <Link
                href="/privacy"
                className="text-[11px] sm:text-xs text-white/70 hover:text-white transition"
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

          {/* 3. 하단: 온라인 물문화관 입장하기 버튼 및 개인정보처리방침 */}
          <div className="w-full pt-5 border-t border-white/10 px-1">
            <Link
              href="/main"
              className="w-full min-h-12 px-3 py-3 inline-flex items-center justify-center rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 text-xs sm:text-sm font-black transition duration-200 shadow-lg shadow-sky-500/25 group whitespace-nowrap tracking-tight"
            >
              <span>온라인 물문화관 입장하기</span>
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
