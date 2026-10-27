"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

const THEMES = [
  {
    id: "technology",
    code: "01 · TECHNOLOGY",
    title: "기술",
    desc: "스마트 수자원·댐 엔지니어링·수력발전",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8d/Daecheong_Dam_after_rain_-_%EB%8C%80%EC%B2%AD%EB%8C%90.jpg/1280px-Daecheong_Dam_after_rain_-_%EB%8C%80%EC%B2%AD%EB%8C%90.jpg",
    link: "/main",
  },
  {
    id: "ecology",
    code: "02 · ECOLOGY",
    title: "생태",
    desc: "강과 호수·수변 생태계·둘레길",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ea/SoyangDam.JPG/1280px-SoyangDam.JPG",
    link: "/main",
  },
  {
    id: "history",
    code: "03 · HISTORY",
    title: "역사",
    desc: "치수 발자취·수몰 마을 기록",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/2/23/Chungju_Lake.jpg/1280px-Chungju_Lake.jpg",
    link: "/main",
  },
  {
    id: "culture",
    code: "04 · CULTURE & ARTS",
    title: "문화",
    desc: "미디어아트·지역 문화행사·휴식 공간",
    image: "/peace-dam-trench.jpg",
    link: "/main",
  },
];

const NAV_LINKS = [
  { label: "문화관 소개", href: "/intro", desc: "개요, 목적 및 3대 핵심 가치" },
  { label: "문화관 현황", href: "/status?view=map", desc: "전국 15개 거점 인터랙티브 지도" },
  { label: "새소식 & 이벤트", href: "/news", desc: "공지사항, 체험행사 및 갤러리" },
  { label: "투어 예약", href: "/reserve", desc: "물문화관 가이드 투어 신청 및 조회" },
  { label: "소통창구", href: "/feedback", desc: "문의·건의 및 자주 묻는 질문" },
];

export default function GatewayLandingPage() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#030712] text-white selection:bg-[#0094FF] selection:text-white flex flex-col items-center">
      <div className="w-full max-w-xl md:max-w-4xl lg:max-w-5xl mx-auto flex flex-col min-h-screen relative">
        {/* ── 1. 상단 헤더: 방울이 마스코트 (좌측) + 햄버거 메뉴 (우측) ── */}
        <header className="relative z-30 flex items-center justify-between px-5 py-4 sm:px-6 sm:py-5">
          <Link
            href="/main"
            className="flex items-center gap-2 group transition-transform active:scale-95"
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

          <button
            type="button"
            onClick={() => setMenuOpen(true)}
            className="w-10 h-10 rounded-xl bg-white/5 hover:bg-white/10 active:bg-white/15 text-white flex items-center justify-center transition active:scale-95 cursor-pointer border border-white/10"
            aria-label="메뉴 열기"
          >
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.4} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </header>

        {/* ── 2. 히어로 섹션 (소양강댐 실사 배경 + 심볼 로고 + 물문화관 타이틀 + 설명문 + 둘러보기 버튼) ── */}
        <section className="relative pt-2 pb-8 sm:pt-4 sm:pb-12 px-5 sm:px-6 flex flex-col items-center text-center">
          {/* 소양강댐 배경 이미지 (상단 은은하게 비치고 아래로 자연스럽게 페이드아웃) */}
          <div className="absolute inset-0 -top-16 overflow-hidden pointer-events-none">
            <div
              className="absolute inset-0 bg-cover bg-center brightness-[0.75] contrast-[1.1] animate-ken-burns will-change-transform"
              style={{
                backgroundImage: `url('https://upload.wikimedia.org/wikipedia/commons/thumb/e/ea/SoyangDam.JPG/1280px-SoyangDam.JPG')`,
              }}
            />
            {/* 상단 및 하단 부드러운 딥 네이비 비네트 그라데이션 */}
            <div className="absolute inset-0 bg-gradient-to-b from-[#030712]/50 via-[#030712]/75 to-[#030712]" />
          </div>

          {/* 중앙 심볼 로고 배지 (부드러운 플로팅 & 글로우 모션) */}
          <div className="relative z-10 mb-3 animate-float-up">
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-[26px] bg-[#05152e]/85 border border-sky-400/30 flex items-center justify-center shadow-2xl shadow-sky-950/60 backdrop-blur-md transition-transform duration-500 hover:scale-105">
              <Image
                src="/images/landing_color_symbol.png"
                alt="물문화관 로고 심볼"
                width={815}
                height={921}
                style={{ width: "auto" }}
                className="h-12 w-auto sm:h-14 object-contain drop-shadow-md"
                priority
              />
            </div>
          </div>

          {/* 타이틀 및 영문 서브타이틀 */}
          <div className="relative z-10 space-y-1">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight drop-shadow-md">
              물문화관
            </h1>
            <p className="text-[11px] sm:text-xs md:text-sm font-black text-[#0094FF] tracking-[0.18em] uppercase pt-0.5">
              WATER CULTURE PORTAL
            </p>
          </div>

          {/* 2줄 설명 문구 */}
          <p className="relative z-10 mt-3 text-[13px] sm:text-sm md:text-base text-slate-200/90 font-medium leading-relaxed max-w-xs sm:max-w-md mx-auto break-keep">
            물과 함께한 기술·생태·역사·문화를
            <br />
            한곳에서 만나보세요.
          </p>

          {/* 대표 액션 버튼: 전국 물문화관 둘러보기 (반짝이는 쉬머 모션 적용) */}
          <div className="relative z-10 w-full max-w-sm sm:max-w-md mt-6">
            <Link
              href="/main"
              className="group relative overflow-hidden w-full min-h-[52px] sm:min-h-[56px] px-6 py-3.5 inline-flex items-center justify-center rounded-2xl bg-[#0094FF] hover:bg-[#0084e6] active:bg-[#0074cc] text-white font-black text-sm sm:text-base transition-all duration-200 shadow-xl shadow-[#0094FF]/30 tracking-tight active:scale-[0.98]"
            >
              {/* 은은하게 스쳐 지나가는 사선 빛줄기 (Shimmer Effect) */}
              <span className="absolute inset-0 w-1/2 h-full bg-gradient-to-r from-transparent via-white/35 to-transparent pointer-events-none animate-shimmer" />

              <span className="relative z-10">전국 물문화관 둘러보기</span>
              <span className="relative z-10 ml-2 transform group-hover:translate-x-1.5 transition-transform font-black">→</span>
            </Link>
          </div>
        </section>

        {/* ── 3. 중간 섹션: 주제별 둘러보기 (4개 테마 2x2 카드 그리드) ── */}
        <section className="relative z-10 px-5 sm:px-6 pt-2 pb-6 flex-1 flex flex-col justify-center">
          {/* 섹션 헤더 (좌측: 주제별 둘러보기 / 우측: 4개 테마) */}
          <div className="flex items-center justify-between mb-3.5 px-0.5">
            <h2 className="text-lg sm:text-xl font-black text-white tracking-tight">
              주제별 둘러보기
            </h2>
            <span className="text-xs sm:text-sm font-bold text-slate-400">
              4개 테마
            </span>
          </div>

          {/* 2x2 카드 그리드 (모바일 2열, 큰 화면 4열 반응형 지원) */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 md:gap-4 w-full">
            {THEMES.map((theme) => (
              <Link
                key={theme.id}
                href={theme.link}
                className="group relative aspect-[4/5] sm:aspect-[3/4] rounded-2xl sm:rounded-3xl overflow-hidden border border-white/10 hover:border-sky-400/50 shadow-lg hover:shadow-sky-500/20 transition-all duration-300 hover:-translate-y-1 active:scale-[0.98] flex flex-col justify-end p-4 sm:p-5"
              >
                {/* 카드 배경 이미지 (호버 시 부드러운 줌 인 모션) */}
                <div
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-700 ease-out group-hover:scale-110 will-change-transform brightness-[0.85] contrast-[1.05]"
                  style={{ backgroundImage: `url('${theme.image}')` }}
                />

                {/* 카드 내부 다크 그라데이션 오버레이 */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/50 to-transparent group-hover:from-slate-950/90 transition-all duration-300" />

                {/* 카드 텍스트 콘텐츠 */}
                <div className="relative z-10 space-y-1">
                  <span className="text-[9.5px] sm:text-[10.5px] font-black tracking-wider text-sky-400 uppercase">
                    {theme.code}
                  </span>
                  <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight group-hover:text-sky-300 transition-colors">
                    {theme.title}
                  </h3>
                  <p className="text-[11px] sm:text-xs text-slate-300 font-medium leading-tight line-clamp-2">
                    {theme.desc}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* ── 4. 하단 섹션: 2차 아웃라인 둘러보기 버튼 & 개인정보처리방침 ── */}
        <footer className="relative z-10 px-5 sm:px-6 pt-2 pb-8 flex flex-col items-center gap-3 w-full">
          {/* 하단 둘러보기 버튼 (다크 배경 + 블루 테두리 + 쉬머 모션) */}
          <div className="w-full max-w-sm sm:max-w-md">
            <Link
              href="/main"
              className="group relative overflow-hidden w-full min-h-[50px] sm:min-h-[54px] px-6 py-3.5 inline-flex items-center justify-center rounded-2xl border-2 border-[#0094FF] bg-[#020b18]/85 hover:bg-[#0094FF]/10 text-white font-black text-sm sm:text-base transition-all duration-200 shadow-lg shadow-[#0094FF]/15 tracking-tight active:scale-[0.98]"
            >
              {/* 은은한 사선 빛줄기 모션 (하단 버튼에도 쉬머 적용) */}
              <span className="absolute inset-0 w-1/2 h-full bg-gradient-to-r from-transparent via-[#0094FF]/25 to-transparent pointer-events-none animate-shimmer" />

              <span className="relative z-10">전국 물문화관 둘러보기</span>
              <span className="relative z-10 ml-2 transform group-hover:translate-x-1.5 transition-transform font-black text-[#0094FF]">→</span>
            </Link>
          </div>

          {/* 개인정보처리방침 링크 (스크린샷과 동일한 스타일) */}
          <div className="pt-1">
            <Link
              href="/privacy"
              className="text-xs font-bold text-yellow-400 hover:text-yellow-300 underline underline-offset-4 transition"
            >
              개인정보처리방침
            </Link>
          </div>
        </footer>

        {/* ── 5. 우측 슬라이드 메뉴 드로어 (햄버거 클릭 시 표시) ── */}
        {menuOpen && (
          <div className="fixed inset-0 z-50">
            {/* 딤드 배경 */}
            <div
              className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs transition-opacity duration-300 cursor-pointer"
              onClick={() => setMenuOpen(false)}
            />

            {/* 슬라이드 드로어 본체 */}
            <div className="fixed top-0 right-0 bottom-0 w-[85%] max-w-[340px] bg-[#082752] text-white shadow-2xl flex flex-col z-51 animate-in slide-in-from-right duration-300">
              {/* 상단 드로어 헤더 */}
              <div className="px-5 pt-6 pb-5 flex items-center justify-between border-b border-white/10">
                <div className="flex items-center gap-2.5">
                  <Image
                    src="/images/landing_color_symbol.png"
                    alt="물문화관 로고"
                    width={34}
                    height={38}
                    style={{ width: "auto" }}
                    className="h-8 w-auto object-contain drop-shadow"
                  />
                  <div>
                    <p className="text-base font-black text-white leading-tight">물문화관</p>
                    <p className="text-[9px] font-extrabold text-sky-300 tracking-wider uppercase leading-tight mt-0.5">
                      WATER CULTURE PORTAL
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setMenuOpen(false)}
                  className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition cursor-pointer"
                  aria-label="닫기"
                >
                  ✕
                </button>
              </div>

              {/* 메뉴 리스트 */}
              <div className="flex-1 overflow-y-auto px-5 py-4 space-y-2">
                <p className="text-[11px] font-bold text-sky-300 uppercase tracking-wider mb-2">
                  바로가기 메뉴
                </p>
                {NAV_LINKS.map((nav) => (
                  <Link
                    key={nav.href}
                    href={nav.href}
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center justify-between py-3 px-3 rounded-xl hover:bg-white/10 active:bg-white/15 transition group"
                  >
                    <div>
                      <p className="text-sm font-bold text-white group-hover:text-sky-300 transition-colors">
                        {nav.label}
                      </p>
                      <p className="text-[11px] text-slate-300/80 mt-0.5">
                        {nav.desc}
                      </p>
                    </div>
                    <span className="text-slate-400 group-hover:text-white group-hover:translate-x-1 transition-transform">
                      →
                    </span>
                  </Link>
                ))}
              </div>

              {/* 드로어 하단 CTA */}
              <div className="p-5 border-t border-white/10 bg-slate-950/40">
                <Link
                  href="/main"
                  onClick={() => setMenuOpen(false)}
                  className="w-full py-3 rounded-xl bg-[#0094FF] hover:bg-[#0084e6] text-white text-xs font-bold text-center block transition shadow-md"
                >
                  전국 물문화관 둘러보기 →
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
