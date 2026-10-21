"use client";

import { useState, useEffect, useRef } from "react";
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
    href: "/status?view=map",
    subItems: [
      { label: "전국 지도", href: "/status?view=map" },
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
      { label: "물 이야기 갤러리", href: "/mul-iyagi" },
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

function getMenuIcon(key: ActiveNav) {
  switch (key) {
    case "intro":
      return (
        <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.9} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5m0 0h4m-4 0V11m0 0V7m0 4h4m-4 0H7" />
        </svg>
      );
    case "status":
      return (
        <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.9} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
        </svg>
      );
    case "news":
      return (
        <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.9} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
        </svg>
      );
    case "reserve":
      return (
        <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.9} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      );
    case "feedback":
      return (
        <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.9} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
        </svg>
      );
    default:
      return null;
  }
}

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
  const [mobileMenuRendered, setMobileMenuRendered] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [expandedMenu, setExpandedMenu] = useState<ActiveNav | null>(null);
  const [isMegaMenuOpen, setIsMegaMenuOpen] = useState(false);
  const [activeHoverKey, setActiveHoverKey] = useState<ActiveNav | null>(null);
  const { user, openAuthModal, logout } = useAuth();

  const openMobileMenu = () => {
    setMobileMenuRendered(true);
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setMobileMenuOpen(true);
      });
    });
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
    setTimeout(() => {
      setMobileMenuRendered(false);
    }, 320);
  };

  // 모바일 메뉴 열림 시 배경 스크롤 방지
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  // 우측으로 슬라이드 터치(스와이프 제스처) 감지
  const touchStartXRef = useRef<number | null>(null);
  const touchStartYRef = useRef<number | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartXRef.current = e.touches[0].clientX;
    touchStartYRef.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartXRef.current === null || touchStartYRef.current === null) return;
    const deltaX = e.changedTouches[0].clientX - touchStartXRef.current;
    const deltaY = e.changedTouches[0].clientY - touchStartYRef.current;

    // 오른쪽으로 40px 이상 슬라이드 터치하고, 수평 이동 거리가 수직 이동보다 크면 부드럽게 닫기
    if (deltaX > 40 && Math.abs(deltaX) > Math.abs(deltaY) * 0.8) {
      closeMobileMenu();
    }

    touchStartXRef.current = null;
    touchStartYRef.current = null;
  };

  const toggleMenu = (key: ActiveNav) => {
    setExpandedMenu((prev) => (prev === key ? null : key));
  };

  const isTabActive = (itemKey: ActiveNav) => {
    if (activeNav === itemKey) return true;
    if (itemKey === "news" && (activeNav === "events" || activeNav === "stories")) return true;
    return false;
  };

  const filteredMenuItems = searchKeyword.trim()
    ? menuItems.filter((item) => {
        const query = searchKeyword.toLowerCase().trim();
        const matchesMain = item.label.toLowerCase().includes(query);
        const matchesSub = item.subItems.some((sub) =>
          sub.label.toLowerCase().includes(query)
        );
        return matchesMain || matchesSub;
      })
    : menuItems;

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
          onClick={() => (mobileMenuOpen ? closeMobileMenu() : openMobileMenu())}
          className={[
            "inline-flex min-h-11 min-w-11 items-center justify-center rounded-xl p-2.5 transition duration-200 lg:hidden shadow-xs cursor-pointer",
            mobileMenuOpen
              ? "bg-slate-900 text-white border-2 border-slate-900 ring-2 ring-slate-900/20"
              : "bg-white text-slate-800 border border-slate-300 hover:bg-slate-100",
          ].join(" ")}
          aria-expanded={mobileMenuOpen}
          aria-label={mobileMenuOpen ? "모바일 메뉴 닫기" : "모바일 메뉴 열기"}
        >
          {mobileMenuOpen ? (
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.4} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.4} d="M4 6h16M4 12h16M4 18h16" />
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

      {/* 모바일 우측 슬라이드 드로어 메뉴 (시안 2 전면 적용 + 부드러운 좌우 슬라이드 모션) */}
      {mobileMenuRendered && (
        <div className="fixed inset-0 z-[100] lg:hidden">
          {/* 1. 어두운 딤드 오버레이 (바깥 영역 터치 또는 오른쪽 슬라이드 터치 시 부드럽게 닫힘) */}
          <div
            onClick={closeMobileMenu}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            className={`fixed inset-0 bg-slate-950/65 backdrop-blur-xs transition-opacity duration-300 ease-out cursor-pointer ${
              mobileMenuOpen ? "opacity-100" : "opacity-0 pointer-events-none"
            }`}
            aria-hidden="true"
          />

          {/* 2. 슬라이드 드로어 본체 (오른쪽으로 슬라이드 터치 시에도 부드럽게 슬라이드 아웃) */}
          <div
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            className={`fixed top-0 right-0 bottom-0 w-[85%] max-w-[360px] sm:max-w-[390px] bg-white shadow-2xl flex flex-col z-[101] transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
              mobileMenuOpen ? "translate-x-0" : "translate-x-full"
            }`}
          >
            {/* 1. 상단 딥 네이비 헤더 (#082752) */}
            <div className="bg-[#082752] px-5 pt-6 pb-5 shrink-0 text-white shadow-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <Image
                    src="/images/landing_color_symbol.png"
                    alt="물문화관 로고"
                    width={34}
                    height={38}
                    className="h-8 w-auto object-contain drop-shadow-sm"
                  />
                  <div className="flex flex-col">
                    <span className="text-[17px] font-black text-white tracking-tight leading-none">
                      물문화관
                    </span>
                    <span className="text-[9px] font-extrabold text-sky-300 tracking-[0.14em] uppercase leading-none mt-1">
                      WATER CULTURE PORTAL
                    </span>
                  </div>
                </div>

                {/* 우측 상단 닫기(X) 버튼 (오른손 엄지 접근성 최적화 & 시원한 40px 터치 영역) */}
                <button
                  type="button"
                  onClick={closeMobileMenu}
                  className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 active:bg-white/30 text-white flex items-center justify-center transition active:scale-95 cursor-pointer shrink-0"
                  aria-label="메뉴 닫기"
                >
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.4} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* 환영 문구 */}
              <div className="mt-4 space-y-0.5">
                <p className="text-[13px] font-bold text-white leading-snug">
                  자연과 사람, 물이 머무는 곳
                </p>
                <p className="text-[11px] text-slate-300 leading-snug">
                  K-water 온라인 물문화관에 오신 것을 환영합니다!
                </p>
              </div>

              {/* 로그인 / 회원가입 or 계정 관리 */}
              {user ? (
                <div className="mt-4 pt-3 border-t border-white/15 flex items-center justify-between">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-8 h-8 rounded-lg bg-sky-500/25 border border-sky-300/30 flex items-center justify-center text-sm shrink-0">
                      {user.role === "admin" ? "🏛️" : "👤"}
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-white truncate">{user.name} 님</p>
                      <p className="text-[10px] text-sky-200 truncate">{user.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <Link
                      href="/mypage"
                      onClick={closeMobileMenu}
                      className="px-2.5 py-1.5 rounded-lg bg-white/15 hover:bg-white/25 text-xs font-bold text-white transition"
                    >
                      마이페이지
                    </Link>
                    <button
                      type="button"
                      onClick={() => {
                        closeMobileMenu();
                        logout();
                      }}
                      className="px-2 py-1.5 text-xs text-slate-300 hover:text-white transition cursor-pointer"
                    >
                      로그아웃
                    </button>
                  </div>
                </div>
              ) : (
                <div className="mt-4 grid grid-cols-2 gap-2.5">
                  <button
                    type="button"
                    onClick={() => {
                      closeMobileMenu();
                      openAuthModal("login");
                    }}
                    className="w-full py-2.5 rounded-xl border border-white/40 bg-transparent hover:bg-white/10 text-white text-xs font-bold text-center transition cursor-pointer active:scale-95"
                  >
                    로그인
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      closeMobileMenu();
                      openAuthModal("signup");
                    }}
                    className="w-full py-2.5 rounded-xl bg-[#0091ff] hover:bg-[#0080e6] text-white text-xs font-bold text-center transition shadow-xs cursor-pointer active:scale-95"
                  >
                    회원가입
                  </button>
                </div>
              )}
            </div>

            {/* 2. 본문 영역 (검색창 + 5대 카테고리) */}
            <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
              {/* 메뉴 · 전시 검색 바 */}
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <input
                  type="text"
                  placeholder="메뉴 · 전시 검색"
                  value={searchKeyword}
                  onChange={(e) => setSearchKeyword(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && searchKeyword.trim()) {
                      closeMobileMenu();
                      window.location.href = `/status?search=${encodeURIComponent(searchKeyword.trim())}`;
                    }
                  }}
                  className="w-full rounded-xl bg-[#f1f5f9] py-2.5 pl-10 pr-4 text-xs font-medium text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500/30 focus:border-sky-500 transition"
                />
              </div>

              {/* 5대 카테고리 메뉴 목록 */}
              <div className="space-y-1.5 pt-1">
                {filteredMenuItems.map((item) => {
                  const isExpanded = expandedMenu === item.key;
                  const isCurrentActive = isTabActive(item.key);

                  return (
                    <div key={item.key} className="rounded-xl transition">
                      {/* 대메뉴 클릭 행 */}
                      <button
                        type="button"
                        onClick={() => toggleMenu(item.key)}
                        className={`w-full flex items-center justify-between py-2.5 px-1 rounded-xl transition cursor-pointer text-left ${
                          isExpanded ? "bg-slate-50" : "hover:bg-slate-50/80"
                        }`}
                        aria-expanded={isExpanded}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-11 h-11 rounded-xl flex items-center justify-center transition-colors shrink-0 ${
                              isCurrentActive || isExpanded
                                ? "bg-sky-500 text-white shadow-xs"
                                : "bg-[#e8f1fc] text-[#1d6ee5]"
                            }`}
                          >
                            {getMenuIcon(item.key)}
                          </div>
                          <span
                            className={`text-[15px] font-bold transition-colors ${
                              isCurrentActive ? "text-sky-700 font-extrabold" : "text-slate-900"
                            }`}
                          >
                            {item.label}
                          </span>
                        </div>
                        <svg
                          className={`w-4 h-4 text-slate-400 transition-transform duration-200 mr-1.5 ${
                            isExpanded ? "rotate-90 text-sky-600" : ""
                          }`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.4} d="M9 5l7 7-7 7" />
                        </svg>
                      </button>

                      {/* 서브메뉴 아코디언 펼침 */}
                      {isExpanded && (
                        <div className="mt-1 ml-14 pl-1 pr-2 space-y-1 pb-1 animate-in slide-in-from-top-1 duration-150">
                          {item.subItems.map((sub) => (
                            <Link
                              key={sub.href + sub.label}
                              href={sub.href}
                              onClick={closeMobileMenu}
                              className="flex items-center justify-between py-2 px-3 rounded-lg text-xs font-semibold text-slate-600 hover:text-sky-600 hover:bg-sky-50 transition"
                            >
                              <span>{sub.label}</span>
                              <span className="text-[10px] text-slate-400">→</span>
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 3. 하단 테마 바로가기 & 개인정보처리방침 */}
            <div className="px-5 pt-4 pb-6 border-t border-slate-100 bg-white shrink-0 space-y-3.5">
              <div>
                <p className="text-xs font-bold text-slate-500 mb-2.5">테마 바로가기</p>
                <div className="grid grid-cols-4 gap-2">
                  {[
                    { label: "기술", id: "technology" },
                    { label: "생태", id: "ecology" },
                    { label: "역사", id: "history" },
                    { label: "문화", id: "culture" },
                  ].map((chip) => (
                    <Link
                      key={chip.id}
                      href={`/?theme=${chip.id}`}
                      onClick={closeMobileMenu}
                      className="py-2 rounded-full border border-slate-200 text-xs font-semibold text-slate-700 text-center hover:bg-sky-50 hover:border-sky-300 hover:text-sky-700 transition"
                    >
                      {chip.label}
                    </Link>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between pt-1">
                <Link
                  href="/privacy"
                  onClick={closeMobileMenu}
                  className="text-xs font-semibold text-[#92782b] hover:text-[#786221] underline underline-offset-4 transition"
                >
                  개인정보처리방침
                </Link>
                {showStaffConsoleLink && (
                  <Link
                    href={STAFF_CONSOLE_HREF}
                    onClick={closeMobileMenu}
                    className="text-[11px] text-slate-400 hover:text-slate-600 transition"
                  >
                    관리자 콘솔
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
