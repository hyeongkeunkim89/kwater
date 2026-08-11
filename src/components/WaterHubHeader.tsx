"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { STAFF_CONSOLE_HREF } from "@/lib/sitePaths";

export type ActiveNav =
  | "intro"
  | "status"
  | "stories"
  | "news"
  | "events"
  | "reserve"
  | "feedback"
  | "none";

const navInactive =
  "link-underline text-slate-700 font-medium transition hover:text-[#00A3E0] py-1 px-1";
const navActive =
  "text-[#00A3E0] font-bold border-b-2 border-[#00A3E0] pb-0.5 py-1 px-1";

export function WaterHubHeader({
  activeNav = "none",
  dense = false,
  showStaffConsoleLink = true,
}: {
  activeNav?: ActiveNav;
  dense?: boolean;
  showStaffConsoleLink?: boolean;
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const menuItems = [
    { href: "/intro", key: "intro", label: "문화관 소개", subText: "거점 안내" },
    { href: "/status", key: "status", label: "문화관 현황", subText: "전국 거점 지도" },
    { href: "/mul-iyagi", key: "stories", label: "물 이야기", subText: "포토 갤러리" },
    { href: "/news", key: "news", label: "소식", subText: "공지사항 & 소식" },
    { href: "/events", key: "events", label: "이벤트", subText: "교육 & 프로그램" },
    { href: "/reserve", key: "reserve", label: "투어 예약", subText: "무료 관람 예약" },
    { href: "/feedback", key: "feedback", label: "소통창구", subText: "설문 & 건의사항" },
  ] as const;

  return (
    <header className="sticky top-0 z-45 shrink-0 border-b border-sky-100 bg-white/95 backdrop-blur-md shadow-sm supports-[backdrop-filter]:bg-white/90">
      <div
        className={[
          "mx-auto flex max-w-7xl items-center justify-between gap-4",
          dense ? "px-4 py-2.5 sm:px-8" : "px-4 py-3 sm:px-8 sm:py-4",
        ].join(" ")}
      >
        {/* 로고 영역 (K-water 브랜드 캐릭터 및 공식 로고) */}
        <Link
          href="/"
          className="group flex min-w-0 max-w-full shrink-0 items-center gap-2 sm:gap-3"
        >
          <div className="relative flex items-center justify-center">
            <Image
              src="/images/bangwoori.png"
              alt="K-water 공식 마스코트 방울이"
              width={36}
              height={36}
              className="h-8 w-auto shrink-0 transition-transform group-hover:scale-110 sm:h-9 drop-shadow-sm"
              priority
              unoptimized
            />
          </div>
          <Image
            src="/kwater-logo.svg"
            alt="K-water 한국수자원공사"
            width={120}
            height={22}
            className="h-5 w-auto shrink-0 transition-opacity group-hover:opacity-90 sm:h-6"
            priority
          />
          <div className="hidden h-4 w-px bg-slate-350 sm:block sm:h-5" aria-hidden />
          <span className="hidden min-w-0 truncate text-xs font-extrabold tracking-tight text-slate-800 transition-colors group-hover:text-[#00A3E0] sm:inline sm:text-sm">
            물문화관 홍보 허브
          </span>
        </Link>

        {/* 데스크톱 내비게이션 (전체 7개 메뉴 지원) */}
        <nav className="hidden xl:flex items-center gap-x-5 text-sm font-medium">
          {menuItems.map((item) => (
            <Link
              key={item.key}
              href={item.href}
              className={activeNav === item.key ? navActive : navInactive}
              aria-current={activeNav === item.key ? "page" : undefined}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* 우측 공통 링크 버튼 (데스크톱) */}
        <div className="hidden md:flex items-center gap-x-4 shrink-0">
          <a
            href="https://www.kwater.or.kr"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-[38px] items-center whitespace-nowrap rounded-full border border-[#00A3E0] bg-cyan-50/60 px-4 py-1 text-xs font-bold text-[#00A3E0] shadow-sm transition hover:bg-[#00A3E0] hover:text-white"
            aria-label="K-water 공식 홈페이지"
          >
            공식 홈페이지 ↗
          </a>
          {showStaffConsoleLink && (
            <Link
              href={STAFF_CONSOLE_HREF}
              className="inline-flex min-h-[38px] min-w-0 items-center whitespace-nowrap text-xs text-slate-500 transition hover:text-[#00A3E0]"
            >
              관리자 페이지
            </Link>
          )}
        </div>

        {/* 모바일 햄버거 토글 버튼 */}
        <button
          type="button"
          onClick={() => setMobileMenuOpen((prev) => !prev)}
          aria-expanded={mobileMenuOpen}
          aria-label={mobileMenuOpen ? "메뉴 닫기" : "메뉴 열기"}
          className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-2xl border border-sky-200 bg-sky-50/70 text-slate-700 transition-colors hover:bg-sky-100 hover:text-[#00A3E0] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#00A3E0] xl:hidden"
        >
          {mobileMenuOpen ? (
            <svg className="h-6 w-6 stroke-current" fill="none" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="h-6 w-6 stroke-current" fill="none" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </div>

      {/* 모바일 GNB: 방울이 환영 카드 및 대화형 이동 버튼 */}
      {mobileMenuOpen && (
        <div className="border-t border-sky-100 bg-white/98 px-4 py-4 shadow-xl backdrop-blur-lg xl:hidden max-h-[85vh] overflow-y-auto">
          {/* 방울이 환영 카드 */}
          <div className="mb-3 flex items-center gap-3 rounded-2xl bg-gradient-to-r from-sky-50 via-cyan-50 to-amber-50/70 p-3 shadow-sm ring-1 ring-sky-200/50">
            <Image
              src="/images/bangwoori.png"
              alt="방울이 환영 캐릭터"
              width={48}
              height={48}
              className="h-11 w-auto shrink-0 drop-shadow-sm animate-bounce-subtle"
              unoptimized
            />
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="rounded-full bg-[#FF9E1B] px-1.5 py-0.5 text-[9px] font-black text-white">
                  방울이 환영
                </span>
                <p className="text-xs font-extrabold text-slate-800">반가워요! K-water 물문화관</p>
              </div>
              <p className="mt-0.5 text-[10px] font-semibold text-slate-500">
                원하는 메뉴를 선택하여 신나게 탐방해보세요! 💧
              </p>
            </div>
          </div>

          {/* 모바일 메뉴 목록 7개 지원 */}
          <nav className="flex flex-col gap-1.5">
            {menuItems.map((item) => {
              const isItemActive = activeNav === item.key;
              return (
                <Link
                  key={item.key}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={[
                    "flex min-h-[46px] items-center justify-between rounded-xl px-4 py-2.5 text-sm font-bold transition-all",
                    isItemActive
                      ? "bg-[#00A3E0] text-white shadow-md shadow-[#00A3E0]/20"
                      : "bg-slate-50 text-slate-700 hover:bg-sky-50 hover:text-[#00A3E0]",
                  ].join(" ")}
                >
                  <span>{item.label}</span>
                  <span className={`text-[10px] font-normal ${isItemActive ? "text-sky-100" : "text-slate-400"}`}>
                    {item.subText} →
                  </span>
                </Link>
              );
            })}

            <div className="h-px bg-slate-100 my-2" />

            <a
              href="https://www.kwater.or.kr"
              target="_blank"
              rel="noopener noreferrer"
              className="flex min-h-[46px] items-center justify-center gap-2 rounded-xl border border-[#00A3E0] bg-cyan-50/50 px-4 py-2 text-sm font-extrabold text-[#00A3E0] transition-all hover:bg-[#00A3E0] hover:text-white"
            >
              <span>K-water 공식 홈페이지 바로가기 ↗</span>
            </a>

            {showStaffConsoleLink && (
              <Link
                href={STAFF_CONSOLE_HREF}
                onClick={() => setMobileMenuOpen(false)}
                className="mt-1 flex min-h-[40px] items-center justify-center rounded-xl text-xs font-semibold text-slate-400 hover:text-slate-700"
              >
                관리자 전용 로그인 페이지
              </Link>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
