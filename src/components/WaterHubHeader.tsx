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
  "text-slate-700 transition hover:text-slate-950 text-base py-3 border-b border-slate-100 font-semibold";
const mobileNavActive =
  "text-sky-600 font-bold text-base py-3 border-b border-slate-100";

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
    { href: "/intro", key: "intro", label: "문화관 소개" },
    { href: "/status", key: "status", label: "문화관 현황" },
    { href: "/news", key: "news", label: "소식" },
    { href: "/events", key: "events", label: "이벤트" },
    { href: "/reserve", key: "reserve", label: "예약" },
    { href: "/feedback", key: "feedback", label: "소통창구" },
  ] as const;

  return (
    <header className="sticky top-0 z-50 shrink-0 border-b border-slate-200/80 bg-white/95 backdrop-blur-md supports-[backdrop-filter]:bg-white/90 shadow-sm">
      <div
        className={[
          "mx-auto flex max-w-7xl items-center justify-between gap-4",
          dense ? "px-4 py-2.5 sm:px-8" : "px-4 py-3.5 sm:px-8 md:py-4",
        ].join(" ")}
      >
        {/* 로고 영역 */}
        <Link
          href="/"
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

        {/* 모바일 햄버거 토글 버튼 */}
        <button
          type="button"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="inline-flex min-h-10 min-w-10 items-center justify-center rounded-xl border border-slate-200 p-2 text-slate-600 transition hover:bg-slate-50 hover:text-slate-800 lg:hidden"
          aria-expanded={mobileMenuOpen}
          aria-label="메뉴 토글"
        >
          {mobileMenuOpen ? (
            <svg
              className="h-5 w-5"
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
              className="h-5 w-5"
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

      {/* 모바일 전체 화면 드로어 메뉴 */}
      {mobileMenuOpen && (
        <div className="fixed inset-x-0 top-[calc(4.5rem-2px)] bottom-0 z-40 flex flex-col bg-white/98 backdrop-blur-xl animate-hero-caption-in lg:hidden px-6 py-6 overflow-y-auto border-t border-slate-100">
          <div className="flex flex-col gap-1">
            {menuItems.map((item) => (
              <Link
                key={item.key}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={activeNav === item.key ? mobileNavActive : mobileNavInactive}
              >
                {item.label}
              </Link>
            ))}
          </div>

          <div className="mt-8 flex flex-col gap-3">
            <a
              href="https://www.kwater.or.kr"
              target="_blank"
              rel="noopener noreferrer"
              className="flex min-h-[44px] items-center justify-center rounded-xl bg-sky-500 px-4 py-2.5 text-center text-sm font-bold text-white transition hover:bg-sky-400"
            >
              K-water 공식 홈페이지
            </a>
            {showStaffConsoleLink && (
              <Link
                href={STAFF_CONSOLE_HREF}
                onClick={() => setMobileMenuOpen(false)}
                className="flex min-h-[44px] items-center justify-center rounded-xl border border-slate-200 px-4 py-2.5 text-center text-sm font-semibold text-slate-600 transition hover:bg-slate-50 hover:text-slate-800"
              >
                관리자 페이지
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
