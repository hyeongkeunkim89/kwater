"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { STAFF_CONSOLE_HREF } from "@/lib/sitePaths";

import { useAuth } from "@/context/AuthContext";

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
  const { user, openAuthModal, logout } = useAuth();

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
          "mx-auto flex max-w-7xl items-center justify-between gap-4 h-[88px] sm:h-[96px] md:h-[102px]",
          dense ? "px-4 py-1.5 sm:px-8" : "px-4 py-2 sm:px-8",
        ].join(" ")}
      >
        {/* 로고 영역 */}
        <Link
          href="/main"
          className="flex shrink-0 items-center transition-opacity hover:opacity-95"
        >
          <Image
            src="/images/logo.png"
            alt="K-water 한국수자원공사 물문화관"
            width={470}
            height={107}
            className="h-[60px] sm:h-[70px] md:h-[80px] w-auto max-w-[260px] sm:max-w-none shrink-0 object-contain"
            priority
          />
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

        {/* 우측 회원/로그인 & 공통 링크 버튼 (데스크톱) */}
        <div className="hidden lg:flex items-center gap-x-3">
          {user ? (
            <div className="flex items-center gap-x-2.5">
              {user.role === "admin" ? (
                <>
                  <Link
                    href="/mypage"
                    className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1.5 text-xs font-black text-amber-900 border border-amber-300 transition hover:bg-amber-100"
                  >
                    <span>🏛️</span>
                    <span>{user.name}</span>
                  </Link>
                  <Link
                    href="/mypage"
                    className="rounded-full bg-amber-600 px-3.5 py-1.5 text-xs font-black text-white hover:bg-amber-500 transition shadow-sm shadow-amber-600/20"
                  >
                    관리자 콘솔
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    href="/mypage"
                    className="inline-flex items-center gap-1.5 rounded-full bg-sky-50 px-3 py-1.5 text-xs font-black text-sky-800 border border-sky-200 transition hover:bg-sky-100"
                  >
                    <span>👤</span>
                    <span>{user.name} 님</span>
                  </Link>
                  <Link
                    href="/mypage"
                    className="rounded-full bg-slate-900 px-3.5 py-1.5 text-xs font-black text-white hover:bg-slate-800 transition"
                  >
                    마이페이지
                  </Link>
                </>
              )}
              <button
                onClick={logout}
                className="text-xs font-semibold text-slate-500 hover:text-slate-900 transition px-1"
              >
                로그아웃
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-x-2.5">
              <button
                onClick={() => openAuthModal("login")}
                className="text-xs font-extrabold text-slate-600 transition hover:text-sky-600 px-2 py-1.5"
              >
                로그인
              </button>
              <button
                onClick={() => openAuthModal("signup")}
                className="inline-flex items-center gap-1.5 rounded-full bg-sky-50 px-3.5 py-1.5 text-xs font-black text-sky-700 border border-sky-200/80 transition hover:bg-sky-100 hover:border-sky-300 shadow-2xs"
              >
                <svg
                  className="h-3.5 w-3.5 text-sky-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
                  />
                </svg>
                <span>회원가입</span>
              </button>
            </div>
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
            {/* 모바일 사용자 계정 영역 */}
            <div className="mb-6 rounded-2xl bg-slate-50 border border-slate-200 p-4">
              {user ? (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-100 text-sky-700 font-black text-base border border-sky-200">
                        {user.role === "admin" ? "🏛️" : "👤"}
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-sm font-black text-slate-900">{user.name}</span>
                          <span className="rounded-full bg-sky-100 px-2 py-0.5 text-[10px] font-bold text-sky-800">
                            {user.role === "admin" ? "관리자" : "회원"}
                          </span>
                        </div>
                        <p className="text-xs text-slate-400 font-medium truncate max-w-[180px]">{user.email}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        setMobileMenuOpen(false);
                        logout();
                      }}
                      className="text-xs font-bold text-slate-500 hover:text-slate-900 bg-white border border-slate-200 px-2.5 py-1 rounded-lg"
                    >
                      로그아웃
                    </button>
                  </div>
                  <Link
                    href="/mypage"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex w-full items-center justify-center rounded-xl bg-slate-900 py-2.5 text-xs font-black text-white hover:bg-slate-800 transition"
                  >
                    {user.role === "admin" ? "🏛️ 통합 관리자 콘솔 바로가기" : "👤 마이페이지 바로가기"}
                  </Link>
                </div>
              ) : (
                <div className="space-y-2.5">
                  <p className="text-xs font-bold text-slate-500">물문화관 방문을 환영합니다!</p>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => {
                        setMobileMenuOpen(false);
                        openAuthModal("login");
                      }}
                      className="flex items-center justify-center rounded-xl bg-white border border-slate-300 py-2.5 text-xs font-black text-slate-700 hover:bg-slate-50 hover:text-sky-600 transition shadow-2xs"
                    >
                      <span>로그인</span>
                    </button>
                    <button
                      onClick={() => {
                        setMobileMenuOpen(false);
                        openAuthModal("signup");
                      }}
                      className="flex items-center justify-center gap-1.5 rounded-xl bg-sky-50 border border-sky-200 py-2.5 text-xs font-black text-sky-700 hover:bg-sky-100 transition shadow-2xs"
                    >
                      <svg
                        className="h-3.5 w-3.5 text-sky-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
                        />
                      </svg>
                      <span>회원가입</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

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

