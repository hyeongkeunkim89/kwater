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

export type SubItem = {
  label: string;
  href: string;
  desc?: string;
};

export type MenuItem = {
  key: ActiveNav;
  label: string;
  href: string;
  subItems: SubItem[];
};

export const menuItems: MenuItem[] = [
  {
    key: "intro",
    label: "문화관 소개",
    href: "/intro",
    subItems: [
      { label: "개요·목적", href: "/intro" },
      { label: "3대 가치", href: "/intro#values" },
    ],
  },
  {
    key: "status",
    label: "문화관 현황",
    href: "/status",
    subItems: [
      { label: "전국 지도", href: "/status" },
      { label: "15개 문화관", href: "/status?view=list" },
    ],
  },
  {
    key: "news",
    label: "새소식",
    href: "/news",
    subItems: [
      { label: "공지사항", href: "/news" },
      { label: "행사·이벤트", href: "/events" },
      { label: "물이야기", href: "/mul-iyagi" },
    ],
  },
  {
    key: "reserve",
    label: "예약",
    href: "/reserve",
    subItems: [
      { label: "투어 예약", href: "/reserve" },
      { label: "조회·취소", href: "/reserve/guest-check" },
    ],
  },
  {
    key: "feedback",
    label: "소통창구",
    href: "/feedback",
    subItems: [
      { label: "문의·건의", href: "/feedback" },
      { label: "FAQ", href: "/feedback#faq" },
      { label: "분실·습득물 센터", href: "/lost-found" },
      { label: "개인정보처리방침", href: "/privacy" },
      { label: "이메일무단수집거부", href: "/email-rejection" },
    ],
  },
];

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
  const [expandedMenu, setExpandedMenu] = useState<ActiveNav | null>(null);
  const [isMegaMenuOpen, setIsMegaMenuOpen] = useState(false);
  const [activeHoverKey, setActiveHoverKey] = useState<ActiveNav | null>(null);
  const { user, openAuthModal, logout } = useAuth();

  const toggleMenu = (key: ActiveNav) => {
    setExpandedMenu((prev) => (prev === key ? null : key));
  };

  const isTabActive = (itemKey: ActiveNav) => {
    if (activeNav === itemKey) return true;
    if (itemKey === "news" && (activeNav === "events" || activeNav === "stories")) return true;
    return false;
  };

  return (
    <header
      className="sticky top-0 z-50 shrink-0 border-b border-slate-200 bg-white shadow-xs"
      onMouseLeave={() => {
        setIsMegaMenuOpen(false);
        setActiveHoverKey(null);
      }}
    >
      <div
        className={[
          "w-full max-w-[1920px] mx-auto flex items-center justify-between px-4 sm:px-8 lg:px-10 xl:px-14 h-[84px] sm:h-[92px] md:h-[98px]",
          dense ? "py-1.5" : "py-2",
        ].join(" ")}
      >
        {/* 로고 영역 (화면 좌측 끝으로 시원하게 배치) */}
        <div className="flex items-center shrink-0 w-[220px] lg:w-[260px] xl:w-[280px]">
          <Link
            href="/main"
            onClick={(e) => {
              if (window.location.pathname === "/main") {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: "smooth" });
              }
            }}
            className="flex items-center transition-transform duration-300 ease-out hover:scale-[1.03] active:scale-[0.98]"
          >
            <Image
              src="/images/kwater_waterhub_logo.png"
              alt="K-water 온라인 물문화관"
              width={1024}
              height={341}
              className="h-[56px] sm:h-[68px] md:h-[76px] w-auto max-w-[240px] shrink-0 object-contain"
              priority
            />
          </Link>
        </div>

        {/* 데스크톱 메인 내비게이션 GNB (탭 구간별 정확히 1/5 균등 분할 및 동일한 간격 유지) */}
        <nav
          className="hidden lg:flex items-center justify-center flex-1 max-w-3xl xl:max-w-4xl 2xl:max-w-5xl mx-auto h-full px-2"
          onMouseEnter={() => setIsMegaMenuOpen(true)}
        >
          <div className="grid grid-cols-5 w-full h-full">
            {menuItems.map((item) => {
              const isHovered = activeHoverKey === item.key;
              const isCurrentActive = isTabActive(item.key);

              return (
                <div
                  key={item.key}
                  className={[
                    "relative flex items-center justify-center text-center h-full cursor-pointer px-2 transition-colors duration-200",
                    isHovered
                      ? "text-[#3054b0] font-black"
                      : isCurrentActive
                      ? "text-[#3054b0] font-black"
                      : "text-slate-900 font-black hover:text-[#3054b0]",
                  ].join(" ")}
                  onMouseEnter={() => {
                    setActiveHoverKey(item.key);
                    setIsMegaMenuOpen(true);
                  }}
                >
                  <Link
                    href={item.href}
                    className="w-full text-center py-2 text-base lg:text-[1.08rem] font-black tracking-tight truncate"
                  >
                    {item.label}
                  </Link>
                </div>
              );
            })}
          </div>
        </nav>

        {/* 우측 회원/로그인 영역 (화면 우측 끝으로 정렬 및 대칭 너비 슬롯) */}
        <div className="hidden lg:flex items-center justify-end shrink-0 w-[220px] lg:w-[260px] xl:w-[280px]">
          {user ? (
            <div className="flex items-center gap-x-2">
              {user.role === "admin" ? (
                <Link
                  href="/mypage"
                  className="inline-flex items-center gap-1.5 rounded-full bg-amber-600 px-3.5 py-1.5 text-xs sm:text-sm font-black text-white hover:bg-amber-500 transition shadow-sm shadow-amber-600/20 whitespace-nowrap"
                >
                  <span>🏛️</span>
                  <span>관리자 콘솔</span>
                </Link>
              ) : (
                <>
                  <Link
                    href="/mypage"
                    className="inline-flex items-center gap-1.5 rounded-full bg-sky-50 px-3 py-1.5 text-xs sm:text-sm font-black text-sky-800 border border-sky-200 transition hover:bg-sky-100 whitespace-nowrap"
                  >
                    <span>👤</span>
                    <span>{user.name} 님</span>
                  </Link>
                  <Link
                    href="/mypage"
                    className="rounded-full border border-slate-300 bg-white px-3.5 py-1.5 text-xs sm:text-sm font-black text-slate-700 transition hover:bg-sky-50 hover:text-sky-700 hover:border-sky-300 shadow-2xs whitespace-nowrap"
                  >
                    마이페이지
                  </Link>
                </>
              )}
              <button
                onClick={logout}
                className="text-xs sm:text-sm font-extrabold text-slate-500 hover:text-slate-900 transition px-1.5 whitespace-nowrap"
              >
                로그아웃
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-x-2">
              <button
                onClick={() => openAuthModal("login")}
                className="text-sm font-extrabold text-slate-700 transition hover:text-sky-600 px-2.5 py-2 whitespace-nowrap"
              >
                로그인
              </button>
              <button
                onClick={() => openAuthModal("signup")}
                className="inline-flex items-center gap-1.5 rounded-full bg-sky-50 px-4 py-2 text-sm font-black text-sky-700 border border-sky-200/80 transition hover:bg-sky-100 hover:border-sky-300 shadow-2xs whitespace-nowrap"
              >
                <span>회원가입</span>
              </button>
            </div>
          )}
        </div>

        {/* 모바일 햄버거 토글 버튼 */}
        <button
          type="button"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className={[
            "inline-flex min-h-11 min-w-11 items-center justify-center rounded-xl p-2.5 transition duration-200 lg:hidden shadow-xs",
            mobileMenuOpen
              ? "bg-slate-900 text-white border-2 border-slate-900 ring-2 ring-slate-900/20"
              : "bg-white text-slate-800 border border-slate-300 hover:bg-slate-100",
          ].join(" ")}
          aria-expanded={mobileMenuOpen}
          aria-label="메뉴 토글"
        >
          {mobileMenuOpen ? (
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </div>

      {/* 데스크톱 마우스 호버 부드러운 펼침 슬라이드 애니메이션 패널 */}
      <div
        className={[
          "hidden lg:block absolute left-0 right-0 top-full bg-white border-b border-slate-200/80 shadow-lg z-40 overflow-hidden transition-all duration-300 ease-out origin-top",
          isMegaMenuOpen
            ? "max-h-[320px] opacity-100 translate-y-0"
            : "max-h-0 opacity-0 -translate-y-2 pointer-events-none",
        ].join(" ")}
        onMouseEnter={() => setIsMegaMenuOpen(true)}
        onMouseLeave={() => {
          setIsMegaMenuOpen(false);
          setActiveHoverKey(null);
        }}
      >
        <div className="w-full max-w-[1920px] mx-auto flex items-stretch justify-between px-4 sm:px-8 lg:px-10 xl:px-14">
          {/* 좌측 로고 영역 대응 투명 가이드 앵커 (너비 완벽 일치) */}
          <div className="w-[220px] lg:w-[260px] xl:w-[280px] shrink-0 invisible pointer-events-none" />

          {/* GNB 5개 탭과 수직 1:1 라인 위치 완벽 정렬 그리드 */}
          <div className="grid grid-cols-5 w-full flex-1 max-w-3xl xl:max-w-4xl 2xl:max-w-5xl mx-auto divide-x divide-slate-100/90 px-2">
            {menuItems.map((item) => {
              const isHovered = activeHoverKey === item.key;
              const isCurrentActive = isTabActive(item.key);

              return (
                <div
                  key={item.key}
                  className={[
                    "py-6 px-2 text-center min-h-[220px] transition-colors duration-200 flex flex-col items-center justify-start",
                    isHovered
                      ? "bg-[#edf4fb]"
                      : isCurrentActive && !activeHoverKey
                      ? "bg-[#edf4fb]/70"
                      : "bg-white",
                  ].join(" ")}
                  onMouseEnter={() => setActiveHoverKey(item.key)}
                >
                  <ul className="space-y-3.5 text-sm w-full text-center">
                    {item.subItems.map((sub) => (
                      <li key={sub.href + sub.label}>
                        <Link
                          href={sub.href}
                          onClick={() => {
                            setIsMegaMenuOpen(false);
                            setActiveHoverKey(null);
                          }}
                          className="inline-block whitespace-nowrap transition-colors duration-150 py-0.5 text-[0.88rem] sm:text-[0.92rem] text-slate-700 font-semibold hover:text-[#3054b0] hover:font-bold hover:underline underline-offset-4 decoration-1 decoration-[#3054b0]"
                        >
                          {sub.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>

          {/* 우측 로그인 영역 대응 투명 가이드 앵커 (너비 완벽 일치) */}
          <div className="w-[220px] lg:w-[260px] xl:w-[280px] shrink-0 invisible pointer-events-none" />
        </div>
      </div>

      {/* 모바일 드로어 메뉴 */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-[100] flex flex-col bg-white lg:hidden overflow-hidden animate-in fade-in duration-200">
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200 bg-slate-900 text-white shrink-0">
            <div className="flex items-center gap-2">
              <span className="text-lg">🌊</span>
              <span className="font-black text-sm text-white tracking-wide">
                K-water 온라인 물문화관 전체메뉴
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

          <div className="flex-1 px-5 py-6 overflow-y-auto bg-white flex flex-col justify-between">
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
                    className="flex w-full items-center justify-center rounded-xl border border-slate-300 bg-white py-2.5 text-xs font-black text-slate-700 hover:bg-sky-50 hover:text-sky-700 hover:border-sky-300 transition shadow-2xs"
                  >
                    {user.role === "admin" ? "🏛️ 통합 관리자 콘솔 바로가기" : "👤 마이페이지 바로가기"}
                  </Link>
                </div>
              ) : (
                <div className="space-y-2.5">
                  <p className="text-xs font-bold text-slate-500">K-water 온라인 물문화관 방문을 환영합니다!</p>
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
                      <span>회원가입</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div className="flex flex-col gap-2.5">
              {menuItems.map((item) => {
                const isExpanded = expandedMenu === item.key;
                const isCurrentActive = isTabActive(item.key);

                return (
                  <div
                    key={item.key}
                    className={`rounded-2xl border transition duration-200 overflow-hidden ${
                      isExpanded
                        ? "border-[#3054b0]/40 bg-sky-50/30 shadow-xs"
                        : "border-slate-200/90 bg-white"
                    }`}
                  >
                    {/* 대메뉴 헤더 (탭 전체 클릭 시 아코디언 토글) */}
                    <button
                      type="button"
                      onClick={() => toggleMenu(item.key)}
                      className={`w-full flex items-center justify-between py-3.5 px-4 font-black text-base transition ${
                        isCurrentActive ? "text-[#3054b0]" : "text-slate-900 hover:text-[#3054b0]"
                      }`}
                      aria-expanded={isExpanded}
                      aria-label={`${item.label} 하위 메뉴 ${isExpanded ? "닫기" : "열기"}`}
                    >
                      <span className="flex items-center gap-2.5">
                        <span>{item.label}</span>
                        {isCurrentActive && (
                          <span className="rounded-full bg-[#3054b0] px-2 py-0.5 text-[10px] font-bold text-white">
                            현재위치
                          </span>
                        )}
                      </span>
                      <svg
                        className={`h-5 w-5 shrink-0 transform transition-transform duration-200 ${
                          isExpanded ? "rotate-180 text-[#3054b0]" : "text-slate-400"
                        }`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2.5}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </button>

                    {/* 아코디언 하위 메뉴 리스트 (최대한 축약된 간결한 명칭) */}
                    {isExpanded && (
                      <div className="border-t border-slate-100 bg-slate-50/80 p-3 grid grid-cols-2 gap-2 animate-in slide-in-from-top-1 duration-150">
                        {item.subItems.map((sub) => (
                          <Link
                            key={sub.href + sub.label}
                            href={sub.href}
                            onClick={() => setMobileMenuOpen(false)}
                            className="flex items-center gap-2 rounded-xl bg-white px-3 py-2.5 text-xs font-bold text-slate-700 border border-slate-200/80 shadow-2xs hover:border-[#3054b0]/40 hover:bg-[#edf4fb] hover:text-[#3054b0] transition"
                          >
                            <span className="h-1.5 w-1.5 rounded-full bg-[#3054b0] shrink-0" />
                            <span className="truncate">{sub.label}</span>
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

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
