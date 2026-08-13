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
  "link-underline text-slate-600 transition hover:text-slate-950 py-1.5 px-1 font-semibold";
const navActive =
  "text-sky-600 font-bold border-b-2 border-sky-500 pb-0.5 py-1.5 px-1";

const mobileNavInactive =
  "flex items-center justify-between text-slate-800 hover:text-sky-600 font-extrabold text-base py-3.5 px-3 rounded-xl hover:bg-slate-100/70 border-b border-slate-100/80 transition duration-150";
const mobileNavActive =
  "flex items-center justify-between text-white bg-sky-500 font-black text-base py-3.5 px-4 rounded-xl shadow-md shadow-sky-500/20 transition duration-150";

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
    { href: "/intro", key: "intro", label: "문화관 소개", icon: "🏛️" },
    { href: "/status", key: "status", label: "문화관 현황", icon: "🗺️" },
    { href: "/news", key: "news", label: "소식", icon: "📢" },
    { href: "/events", key: "events", label: "이벤트", icon: "🎈" },
    { href: "/reserve", key: "reserve", label: "예약", icon: "📅" },
    { href: "/feedback", key: "feedback", label: "소통창구", icon: "💬" },
  ] as const;

  return (
    <header className="sticky top-0 z-50 shrink-0 border-b border-slate-200 bg-white shadow-sm">
      <div
        className={[
          "mx-auto flex max-w-7xl items-center justify-between gap-4",
          dense ? "px-4 py-2.5 sm:px-8" : "px-4 py-3.5 sm:px-8 md:py-4",
        ].join(" ")}
      >
        {/* 로고 영역 */}
        <Link
          href="/main"
          className="group flex min-w-0 max-w-full shrink-0 items-center gap-2 sm:gap-3"
        >
          <Image
            src="/kwater-logo.svg"
            alt="K-water 한국수자원공사"
            width={110}
            height={20}
            className="h-4.5 w-auto shrink-0 brightness-0 opacity-80 transition-opacity group-hover:opacity-100 sm:h-5"
            priority
          />
          <div className="hidden h-4 w-px bg-slate-200 sm:block sm:h-5" aria-hidden />
          <span className="min-w-0 truncate text-xs font-black tracking-tight text-slate-800 transition-colors group-hover:text-slate-900 sm:text-sm">
            물문화관 홍보관
          </span>
        </Link>

        {/* 데스크톱 내비게이션 */}
        <nav className="hidden lg:flex items-center gap-x-6 text-sm font-semibold">
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
        <div className="hidden lg:flex items-center gap-x-4">
          <a
            href="https://www.kwater.or.kr"
            target="_blank"
            rel="noopener noreferrer"
            className="whitespace-nowrap rounded-full border border-slate-200 bg-white px-4 py-1.5 text-xs font-semibold text-slate-700 transition hover:border-slate-350 hover:bg-slate-50 hover:text-slate-950"
            aria-label="K-water 공식 홈페이지"
          >
            공식 홈페이지
          </a>
          {showStaffConsoleLink && (
            <Link
              href={STAFF_CONSOLE_HREF}
              className="inline-flex min-h-10 items-center whitespace-nowrap text-xs font-semibold text-slate-400 transition hover:text-slate-655 hover:text-slate-750"
            >
              관리자 페이지
            </Link>
          )}
        </div>

        {/* 모바일 햄버거 토글 버튼 (선명한 고대비 디자인 적용) */}
        <button
          type="button"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className={[
            "inline-flex min-h-11 min-w-11 items-center justify-center rounded-xl p-2.5 transition duration-200 lg:hidden shadow-sm",
            mobileMenuOpen
              ? "bg-slate-900 text-white border-2 border-slate-900 ring-2 ring-slate-900/20"
              : "bg-white text-slate-800 border border-slate-300 hover:bg-slate-100",
          ].join(" ")}
          aria-expanded={mobileMenuOpen}
          aria-label="메뉴 토글"
        >
          {mobileMenuOpen ? (
            <svg
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2.5}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          ) : (
            <svg
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2.5}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          )}
        </button>
      </div>

      {/* 모바일 전체 화면 100% 불투명 드로어 메뉴 */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-[100] flex flex-col bg-white lg:hidden overflow-hidden animate-in fade-in duration-200">
          {/* 모바일 드로어 전용 상단 헤더 바 */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200 bg-slate-900 text-white shrink-0">
            <div className="flex items-center gap-2">
              <span className="text-lg">🌊</span>
              <span className="font-black text-sm text-white tracking-wide">
                K-water 물문화관 전체메뉴
              </span>
            </div>
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="p-2 text-slate-300 hover:text-white rounded-lg bg-slate-800 transition"
              aria-label="닫기"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* 메뉴 리스트 영역 */}
          <div className="flex-1 px-5 py-6 overflow-y-auto bg-white flex flex-col justify-between">
            <div className="flex flex-col gap-2">
              {menuItems.map((item) => (
                <Link
                  key={item.key}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={activeNav === item.key ? mobileNavActive : mobileNavInactive}
                >
                  <span className="flex items-center gap-3">
                    <span className="text-lg">{item.icon}</span>
                    <span>{item.label}</span>
                  </span>
                  <span className="text-xs font-bold opacity-60">→</span>
                </Link>
              ))}
            </div>

            {/* 하단 링크 영역 */}
            <div className="mt-8 pt-6 border-t border-slate-200 flex flex-col gap-3 shrink-0">
              <a
                href="https://www.kwater.or.kr"
                target="_blank"
                rel="noopener noreferrer"
                className="flex min-h-[48px] items-center justify-center rounded-xl bg-sky-500 px-4 py-3 text-center text-sm font-black text-white transition hover:bg-sky-600 shadow-md shadow-sky-500/20"
              >
                K-water 공식 홈페이지 ↗
              </a>
              {showStaffConsoleLink && (
                <Link
                  href={STAFF_CONSOLE_HREF}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex min-h-[44px] items-center justify-center rounded-xl border border-slate-300 bg-slate-100 px-4 py-2.5 text-center text-xs font-bold text-slate-700 transition hover:bg-slate-200"
                >
                  관리자 콘솔 접속
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

