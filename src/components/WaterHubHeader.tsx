"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { STAFF_CONSOLE_HREF } from "@/lib/sitePaths";

type ActiveNav = "status" | "stories" | "none";

const navInactive =
  "link-underline text-slate-700 font-medium transition hover:text-[#00A3E0]";
const navActive = "text-[#00A3E0] font-bold border-b-2 border-[#00A3E0] pb-0.5";

export function WaterHubHeader({
  activeNav = "none",
  dense = false,
  /** 홈(/)에서만 true — 관리자 페이지 링크를 헤더 오른쪽 끝에 표시 */
  showStaffConsoleLink = false,
}: {
  activeNav?: ActiveNav;
  /** 홈 한 화면 레이아웃용 — 세로·가로 여백 축소 */
  dense?: boolean;
  showStaffConsoleLink?: boolean;
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 shrink-0 border-b border-sky-100 bg-white/95 backdrop-blur-md shadow-xs supports-[backdrop-filter]:bg-white/90">
      <div
        className={[
          "mx-auto flex max-w-7xl items-center justify-between",
          dense ? "px-4 py-2.5 sm:px-8" : "px-4 py-3 sm:px-10 sm:py-4",
        ].join(" ")}
      >
        {/* K-water 공식 브랜드 브랜드 헤더 영역 */}
        <Link
          href="/"
          className="group flex min-w-0 max-w-full shrink-0 items-center gap-2 sm:gap-3"
        >
          {/* 방울이 마스코트 PNG 공식 브랜드 캐릭터 배치 */}
          <div className="relative flex items-center justify-center">
            <Image
              src="/images/bangwoori.png"
              alt="K-water 공식 마스코트 방울이"
              width={36}
              height={36}
              className="h-8 w-auto shrink-0 transition-transform group-hover:scale-110 sm:h-9 drop-shadow-xs"
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
          <div className="hidden h-4 w-px bg-slate-300 sm:block sm:h-5" aria-hidden />
          <span className="hidden min-w-0 truncate text-xs font-extrabold tracking-tight text-slate-800 transition-colors group-hover:text-[#00A3E0] sm:inline sm:text-sm">
            물문화관 홍보 허브
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-x-5 text-sm font-medium md:flex">
          <Link
            href="/status"
            className={activeNav === "status" ? navActive : navInactive}
            aria-current={activeNav === "status" ? "page" : undefined}
          >
            문화관 현황
          </Link>
          <Link
            href="/mul-iyagi"
            className={activeNav === "stories" ? navActive : navInactive}
            aria-current={activeNav === "stories" ? "page" : undefined}
          >
            물 이야기
          </Link>
          <Link href="/reserve" className={navInactive}>
            투어 예약
          </Link>
          <a
            href="https://www.kwater.or.kr"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-[42px] items-center whitespace-nowrap rounded-full border border-[#00A3E0] bg-cyan-50/60 px-4 py-1.5 text-xs font-bold text-[#00A3E0] shadow-xs transition hover:bg-[#00A3E0] hover:text-white sm:text-sm"
            aria-label="K-water 공식 홈페이지"
          >
            공식 홈페이지
          </a>
          {showStaffConsoleLink ? (
            <Link
              href={STAFF_CONSOLE_HREF}
              className="inline-flex min-h-[42px] min-w-0 items-center whitespace-nowrap text-xs text-slate-500 transition hover:text-[#00A3E0] sm:text-sm"
            >
              관리자 페이지
            </Link>
          ) : null}
        </nav>

        {/* Mobile Hamburger Button */}
        <button
          type="button"
          onClick={() => setMobileMenuOpen((prev) => !prev)}
          aria-expanded={mobileMenuOpen}
          aria-label={mobileMenuOpen ? "메뉴 닫기" : "메뉴 열기"}
          className="flex min-h-[48px] min-w-[48px] items-center justify-center rounded-2xl border border-sky-200 bg-sky-50/70 text-slate-700 transition-colors hover:bg-sky-100 hover:text-[#00A3E0] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#00A3E0] md:hidden"
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
        <div className="border-t border-sky-100 bg-white/98 px-5 py-4 shadow-xl backdrop-blur-lg md:hidden">
          {/* 방울이 환영 카드 */}
          <div className="mb-3.5 flex items-center gap-3 rounded-2xl bg-gradient-to-r from-sky-50 via-cyan-50 to-amber-50/70 p-3.5 ring-1 ring-sky-200/60 shadow-xs">
            <Image
              src="/images/bangwoori.png"
              alt="방울이 환영 캐릭터"
              width={48}
              height={48}
              className="h-12 w-auto shrink-0 drop-shadow-sm animate-bounce-subtle"
              unoptimized
            />
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="rounded-full bg-[#FF9E1B] px-2 py-0.5 text-[10px] font-black text-white">
                  방울이 환영
                </span>
                <p className="text-xs font-extrabold text-slate-800">반가워요! K-water 물문화관</p>
              </div>
              <p className="mt-0.5 text-[11px] font-semibold text-slate-600">
                원하는 메뉴를 터치해서 신나게 둘러보세요! 💧
              </p>
            </div>
          </div>

          <nav className="flex flex-col gap-2">
            <Link
              href="/status"
              onClick={() => setMobileMenuOpen(false)}
              className={[
                "flex min-h-[48px] items-center justify-between rounded-2xl px-4 py-3 text-sm font-bold transition-all",
                activeNav === "status"
                  ? "bg-[#00A3E0] text-white shadow-md shadow-[#00A3E0]/25"
                  : "bg-slate-50 text-slate-800 hover:bg-sky-50 hover:text-[#00A3E0]",
              ].join(" ")}
            >
              <span>문화관 현황</span>
              <span className="text-xs font-normal opacity-90">전국 24개 거점 지도 →</span>
            </Link>

            <Link
              href="/mul-iyagi"
              onClick={() => setMobileMenuOpen(false)}
              className={[
                "flex min-h-[48px] items-center justify-between rounded-2xl px-4 py-3 text-sm font-bold transition-all",
                activeNav === "stories"
                  ? "bg-[#00A3E0] text-white shadow-md shadow-[#00A3E0]/25"
                  : "bg-slate-50 text-slate-800 hover:bg-sky-50 hover:text-[#00A3E0]",
              ].join(" ")}
            >
              <span>물 이야기 갤러리</span>
              <span className="text-xs font-normal opacity-90">방문자 포토 후기 →</span>
            </Link>

            <Link
              href="/reserve"
              onClick={() => setMobileMenuOpen(false)}
              className="flex min-h-[48px] items-center justify-between rounded-2xl bg-slate-50 px-4 py-3 text-sm font-bold text-slate-800 transition-all hover:bg-sky-50 hover:text-[#00A3E0]"
            >
              <span>투어 예약</span>
              <span className="rounded-full bg-[#FF9E1B]/15 px-2 py-0.5 text-xs font-extrabold text-[#FF9E1B]">
                무료 예약 →
              </span>
            </Link>

            <a
              href="https://www.kwater.or.kr"
              target="_blank"
              rel="noopener noreferrer"
              className="flex min-h-[48px] items-center justify-center gap-2 rounded-2xl border-2 border-[#00A3E0] bg-cyan-50/80 px-4 py-3 text-sm font-extrabold text-[#00A3E0] transition-all hover:bg-[#00A3E0] hover:text-white"
            >
              <span>K-water 공식 홈페이지 바로가기</span>
              <span>↗</span>
            </a>

            {showStaffConsoleLink && (
              <Link
                href={STAFF_CONSOLE_HREF}
                onClick={() => setMobileMenuOpen(false)}
                className="mt-1 flex min-h-[44px] items-center justify-center rounded-2xl text-xs font-medium text-slate-400 hover:text-slate-700"
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
