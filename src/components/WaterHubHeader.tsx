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
      { label: "인사말 & 목적", href: "/intro", desc: "한국수자원공사 물문화관 소개" },
      { label: "물문화관 3대 가치", href: "/intro#values", desc: "역사, 휴식, 생태 체험 가치" },
    ],
  },
  {
    key: "status",
    label: "문화관 현황",
    href: "/status",
    subItems: [
      { label: "전국 거점 현황", href: "/status", desc: "전국 15개관 실시간 관람 상태" },
      { label: "층별 시설 & 전시 안내", href: "/centers", desc: "실내 공간 및 쉼터 시설 안내" },
    ],
  },
  {
    key: "news",
    label: "새소식",
    href: "/news",
    subItems: [
      { label: "공지·소식", href: "/news", desc: "최신 공지 및 물문화관 이슈" },
      { label: "행사·이벤트", href: "/events", desc: "수변 문화 축제 및 대시민 행사" },
      { label: "물문화 이야기", href: "/mul-iyagi", desc: "카드뉴스 및 탐방 스토리" },
    ],
  },
  {
    key: "reserve",
    label: "예약",
    href: "/reserve",
    subItems: [
      { label: "가이드 투어 예약", href: "/reserve", desc: "전문 도슨트 해설 신청" },
      { label: "예약 조회 & 취소", href: "/reserve/guest-check", desc: "신청 내역 확인 및 관리" },
    ],
  },
  {
    key: "feedback",
    label: "소통창구",
    href: "/feedback",
    subItems: [
      { label: "대시민 소통 게시판", href: "/feedback", desc: "의견 제안 및 칭찬하기" },
      { label: "자주 묻는 질문 (FAQ)", href: "/feedback#faq", desc: "방문/주차/예약 문의" },
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
  const [isMegaMenuOpen, setIsMegaMenuOpen] = useState(false);
  const [activeHoverKey, setActiveHoverKey] = useState<ActiveNav | null>(null);
  const { user, openAuthModal, logout } = useAuth();

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
          "mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-8 h-[84px] sm:h-[92px] md:h-[98px]",
          dense ? "py-1.5" : "py-2",
        ].join(" ")}
      >
        {/* 로고 영역 */}
        <div className="w-[260px] shrink-0 flex items-center">
          <Link
            href="/main"
            className="flex items-center transition-transform duration-300 ease-out hover:scale-[1.03] active:scale-[0.98]"
          >
            <Image
              src="/images/kwater_waterhub_logo.png"
              alt="K-water 한국수자원공사 물문화관"
              width={1024}
              height={341}
              className="h-[60px] sm:h-[72px] md:h-[80px] w-auto max-w-[260px] shrink-0 object-contain"
              priority
            />
          </Link>
        </div>

        {/* 데스크톱 메인 내비게이션 GNB (K-water 공식 홈페이지 1:1 그리드 구조) */}
        <nav
          className="hidden lg:flex items-center justify-center flex-1 max-w-3xl h-full px-2"
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
                    "relative flex items-center justify-center h-full transition-colors duration-150 cursor-pointer px-1 text-center",
                    isHovered
                      ? "bg-[#eef5fc] text-[#004D95] font-black"
                      : isCurrentActive
                      ? "text-[#004D95] font-black"
                      : "text-slate-800 font-extrabold hover:text-[#004D95] hover:bg-[#eef5fc]/60",
                  ].join(" ")}
                  onMouseEnter={() => {
                    setActiveHoverKey(item.key);
                    setIsMegaMenuOpen(true);
                  }}
                >
                  <Link
                    href={item.href}
                    className="w-full text-center py-2 text-base lg:text-[1.05rem] tracking-tight truncate"
                  >
                    {item.label}
                  </Link>
                </div>
              );
            })}
          </div>
        </nav>

        {/* 우측 회원/로그인 영역 */}
        <div className="hidden lg:flex items-center justify-end w-[220px] shrink-0 gap-x-3">
          {user ? (
            <div className="flex items-center gap-x-2.5">
              {user.role === "admin" ? (
                <>
                  <Link
                    href="/mypage"
                    className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-3.5 py-2 text-xs sm:text-sm font-black text-amber-900 border border-amber-300 transition hover:bg-amber-100"
                  >
                    <span>🏛️</span>
                    <span>{user.name}</span>
                  </Link>
                  <Link
                    href="/mypage"
                    className="rounded-full bg-amber-600 px-4 py-2 text-xs sm:text-sm font-black text-white hover:bg-amber-500 transition shadow-sm shadow-amber-600/20"
                  >
                    관리자
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    href="/mypage"
                    className="inline-flex items-center gap-1.5 rounded-full bg-sky-50 px-3.5 py-2 text-xs sm:text-sm font-black text-sky-800 border border-sky-200 transition hover:bg-sky-100"
                  >
                    <span>👤</span>
                    <span>{user.name} 님</span>
                  </Link>
                  <Link
                    href="/mypage"
                    className="rounded-full bg-slate-900 px-4 py-2 text-xs sm:text-sm font-black text-white hover:bg-slate-800 transition"
                  >
                    마이페이지
                  </Link>
                </>
              )}
              <button
                onClick={logout}
                className="text-xs sm:text-sm font-extrabold text-slate-500 hover:text-slate-900 transition px-1.5"
              >
                로그아웃
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-x-2">
              <button
                onClick={() => openAuthModal("login")}
                className="text-sm font-extrabold text-slate-700 transition hover:text-sky-600 px-2.5 py-2"
              >
                로그인
              </button>
              <button
                onClick={() => openAuthModal("signup")}
                className="inline-flex items-center gap-1.5 rounded-full bg-sky-50 px-4 py-2 text-sm font-black text-sky-700 border border-sky-200/80 transition hover:bg-sky-100 hover:border-sky-300 shadow-2xs"
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

      {/* 데스크톱 마우스 호버 전체 메가 메뉴 드롭다운 패널 (K-water 공식 홈페이지 1:1 완벽 컬럼 일치 매칭) */}
      {isMegaMenuOpen && (
        <div
          className="hidden lg:block absolute left-0 right-0 top-full bg-white border-b-2 border-slate-200 shadow-xl z-40 animate-in fade-in slide-in-from-top-1 duration-150"
          onMouseEnter={() => setIsMegaMenuOpen(true)}
          onMouseLeave={() => {
            setIsMegaMenuOpen(false);
            setActiveHoverKey(null);
          }}
        >
          <div className="mx-auto max-w-7xl flex justify-between px-4 sm:px-8">
            {/* 좌측 로고 너비 일치용 여백 */}
            <div className="w-[260px] shrink-0" />

            {/* GNB 5개 탭의 가로 영역과 1:1로 세로 라인이 정확히 일치하는 드롭다운 그리드 컬럼 */}
            <div className="grid grid-cols-5 w-full max-w-3xl">
              {menuItems.map((item) => {
                const isHovered = activeHoverKey === item.key;
                const isCurrentActive = isTabActive(item.key);

                return (
                  <div
                    key={item.key}
                    className={[
                      "py-6 px-4 space-y-3 transition-colors duration-150 min-h-[210px]",
                      isHovered
                        ? "bg-[#eef5fc]"
                        : isCurrentActive && !activeHoverKey
                        ? "bg-slate-50/70"
                        : "bg-white",
                    ].join(" ")}
                    onMouseEnter={() => setActiveHoverKey(item.key)}
                  >
                    <ul className="space-y-2.5 text-sm font-semibold">
                      {item.subItems.map((sub) => (
                        <li key={sub.href + sub.label}>
                          <Link
                            href={sub.href}
                            onClick={() => {
                              setIsMegaMenuOpen(false);
                              setActiveHoverKey(null);
                            }}
                            className="block text-slate-700 hover:text-[#004D95] hover:font-bold transition-colors py-1 px-1 rounded-sm hover:bg-white/80"
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

            {/* 우측 영역 너비 일치용 여백 */}
            <div className="w-[220px] shrink-0" />
          </div>
        </div>
      )}

      {/* 모바일 드로어 메뉴 */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-[100] flex flex-col bg-white lg:hidden overflow-hidden animate-in fade-in duration-200">
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
                      <span>회원가입</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div className="flex flex-col gap-3">
              {menuItems.map((item) => (
                <div key={item.key} className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <Link
                      href={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className="font-black text-base text-slate-900 hover:text-sky-600 flex items-center gap-2"
                    >
                      <span>{item.label}</span>
                      {isTabActive(item.key) && (
                        <span className="rounded-full bg-[#004D95] px-2 py-0.5 text-[10px] font-bold text-white">
                          현재위치
                        </span>
                      )}
                    </Link>
                  </div>
                  <div className="grid grid-cols-1 gap-1 pt-2 border-t border-slate-200/80">
                    {item.subItems.map((sub) => (
                      <Link
                        key={sub.href + sub.label}
                        href={sub.href}
                        onClick={() => setMobileMenuOpen(false)}
                        className="flex items-center justify-between text-xs font-bold text-slate-700 hover:text-sky-600 py-2 px-2.5 rounded-lg hover:bg-white transition"
                      >
                        <span>• {sub.label}</span>
                        <span className="text-[10px] opacity-40">→</span>
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
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
