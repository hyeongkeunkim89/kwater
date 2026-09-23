"use client";

import { useEffect, useState } from "react";

/**
 * K-water 공식 웹사이트 스타일 탑(TOP) 버튼
 * - 스크롤 300px 이상 시 플로팅 표출
 * - 클릭 시 맨 위로 부드러운 스크롤 (smooth scroll)
 */
export function ScrollToTopButton() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 250) {
        setVisible(true);
      } else {
        setVisible(false);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  if (!visible) return null;

  return (
    <button
      onClick={scrollToTop}
      type="button"
      aria-label="페이지 맨 위로 이동"
      className="fixed bottom-6 right-6 z-50 flex h-12 w-12 sm:h-14 sm:w-14 flex-col items-center justify-center gap-0.5 rounded-full border border-white/25 bg-slate-900/90 text-white shadow-xl shadow-slate-950/30 backdrop-blur-md transition-all duration-300 hover:scale-110 hover:border-sky-400 hover:bg-sky-500 hover:shadow-sky-500/30 active:scale-95 group focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400"
    >
      <svg
        className="h-5 w-5 transition-transform duration-200 group-hover:-translate-y-0.5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2.8}
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
      </svg>
      <span className="text-[9px] font-black tracking-widest uppercase leading-none opacity-90">
        TOP
      </span>
    </button>
  );
}
