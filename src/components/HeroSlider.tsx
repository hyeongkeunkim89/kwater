"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { waterCenters } from "@/data/centers";

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const onChange = () => setReduced(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);
  return reduced;
}

interface Slide {
  imageUrl: string;
  centerName: string;
  location: string;
  kind: string;
  caption: string;
}

const SLIDES: Slide[] = [
  {
    // 소양강댐 실제 전경 (Wikimedia Commons, CC BY-SA 3.0, Jjw)
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ea/SoyangDam.JPG/1280px-SoyangDam.JPG",
    centerName: "소양강댐 물문화관",
    location: "강원 춘천시 · 댐 물문화관",
    kind: "SOYANGGANG DAM",
    caption: "아시아 최대 사력댐 — 높이 123m, 저수용량 29억 톤의 웅장한 호수 전경",
  },
  {
    // 충주댐·충주호 실제 전경 (Wikimedia Commons, CC BY-SA 3.0, 방창현겨울아찌)
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/2/23/Chungju_Lake.jpg/1280px-Chungju_Lake.jpg",
    centerName: "충주댐 물문화관",
    location: "충북 충주시 · 댐 물문화관",
    kind: "CHUNGJU DAM",
    caption: "국내 최대 다목적댐이 빚어낸 27.5억 톤 규모의 청풍호반 자연 물길",
  },
  {
    // 대청댐 방류 실제 전경 (Wikimedia Commons, CC BY-SA 4.0, Rickinasia)
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8d/Daecheong_Dam_after_rain_-_%EB%8C%80%EC%B2%AD%EB%8C%90.jpg/1280px-Daecheong_Dam_after_rain_-_%EB%8C%80%EC%B2%AD%EB%8C%90.jpg",
    centerName: "대청댐 물문화관",
    location: "대전 대덕구 · 댐 물문화관",
    kind: "DAECHEONG DAM",
    caption: "장마 후 힘차게 방류하는 대청댐 — 금강 유역 생태와 물 안전의 핵심 기지",
  },
];

const INTERVAL = 5000;

export function HeroSlider() {
  const [current, setCurrent] = useState(0);
  const [prev, setPrev] = useState<number | null>(null);
  const [transitioning, setTransitioning] = useState(false);
  const transitionEndRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const goNextTickRef = useRef<() => void>(() => { });
  const prefersReducedMotion = usePrefersReducedMotion();

  const goTo = useCallback(
    (idx: number) => {
      if (transitioning || idx === current) return;
      if (transitionEndRef.current) {
        clearTimeout(transitionEndRef.current);
        transitionEndRef.current = null;
      }
      setPrev(current);
      setCurrent(idx);
      setTransitioning(true);
      transitionEndRef.current = setTimeout(() => {
        setPrev(null);
        setTransitioning(false);
        transitionEndRef.current = null;
      }, 920);
    },
    [current, transitioning],
  );

  const goNext = useCallback(() => {
    goTo((current + 1) % SLIDES.length);
  }, [current, goTo]);

  const goPrev = useCallback(() => {
    goTo((current - 1 + SLIDES.length) % SLIDES.length);
  }, [current, goTo]);

  goNextTickRef.current = goNext;

  useEffect(() => {
    const id = window.setInterval(() => goNextTickRef.current(), INTERVAL);
    return () => clearInterval(id);
  }, []);

  useEffect(
    () => () => {
      if (transitionEndRef.current) clearTimeout(transitionEndRef.current);
    },
    [],
  );

  return (
    <div className="relative h-full min-h-0 w-full flex-1 overflow-hidden bg-slate-50">
      {/* ── 슬라이드 이미지 레이어(전체) + Ken Burns(감속 시 비활성) ── */}
      {SLIDES.map((slide, i) => {
        const isActive = i === current;
        const isPrev = i === prev;
        const kenBurnsOn = isActive && !prefersReducedMotion;
        return (
          <div
            key={slide.imageUrl}
            className="absolute inset-0 transition-opacity duration-[900ms] ease-in-out"
            style={{
              opacity: isActive ? 1 : isPrev ? 0 : 0,
              zIndex: isActive ? 2 : isPrev ? 1 : 0,
              pointerEvents: isActive ? "auto" : "none",
            }}
          >
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{
                backgroundImage: `url(${slide.imageUrl})`,
                transform: kenBurnsOn ? "scale(1.06)" : "scale(1)",
                transition: kenBurnsOn ? "transform 6000ms ease-out" : "none",
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-white/15 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-t from-white/10 via-transparent to-transparent" />
          </div>
        );
      })}

      {/* ── 텍스트 콘텐츠 ── */}
      <div className="relative z-10 flex h-full min-h-0 items-end px-4 pb-12 pt-4 sm:px-12 sm:pb-16 lg:px-20 lg:pb-16">

        {/* 왼쪽: 슬라이드 정보 (테두리를 배제하고 렌즈 블러 효과를 약하게 주어 댐 풍경과 자연스럽게 융합) */}
        <div key={current} className="hero-caption-animate max-w-lg bg-white/[0.05] backdrop-blur-md rounded-[32px] p-6 sm:p-8">
          <div className="mb-2 flex items-center gap-2 sm:mb-3 sm:gap-3">
            <span className="h-px w-8 bg-sky-500" />
            <span className="text-xs font-black uppercase tracking-widest text-sky-600">
              {SLIDES[current].kind}
            </span>
          </div>
          <h2 className="text-2xl font-black leading-tight tracking-tight text-slate-900 sm:text-3xl lg:text-4xl">
            {SLIDES[current].centerName}
          </h2>
          <p className="mt-2 text-xs font-bold text-slate-700 sm:mt-2.5 sm:text-sm">
            {SLIDES[current].location}
          </p>
          <p className="mt-3 text-xs leading-relaxed text-slate-500 sm:mt-4 font-semibold">
            {SLIDES[current].caption}
          </p>

          <div className="mt-5 flex flex-wrap gap-2 sm:mt-6">
            <Link
              href="/status"
              className="inline-flex items-center gap-2 rounded-full bg-sky-500 px-4 py-2 text-xs font-bold text-white shadow-lg shadow-sky-500/10 transition hover:bg-sky-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
            >
              전체 문화관 보기
            </Link>
            <Link
              href="/reserve"
              className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-bold text-slate-700 transition hover:bg-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 shadow-sm"
            >
              투어 예약하기
            </Link>
            <Link
              href="/mul-iyagi"
              className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-100/80 px-4 py-2 text-xs font-bold text-slate-700 transition hover:bg-slate-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500"
            >
              물 이야기
            </Link>
          </div>
        </div>

        {/* 오른쪽: 물문화관 개요 — 댐 풍경은 투명하게 비치고, 텍스트 부분만 부드러운 안개블러로 처리 */}
        <div className="absolute bottom-14 right-6 hidden max-w-[240px] flex-col justify-end bg-white/[0.05] backdrop-blur-md rounded-[32px] p-5 shadow-sm sm:flex md:max-w-xs md:right-12 lg:right-16">
          <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-sky-600 sm:text-[10px]">
            K-water Water Culture Center
          </p>
          <h3 className="mt-2 text-xl font-black leading-snug tracking-tight text-slate-800 sm:mt-3 sm:text-2xl">
            물은 흐르고,<br />
            <span className="bg-gradient-to-r from-sky-600 to-blue-600 bg-clip-text text-transparent">
              기억은 남는다
            </span>
          </h3>
          <div className="mt-3 space-y-2 text-[11px] leading-relaxed text-slate-500 sm:mt-4 font-semibold">
            <p>
              댐은 단순한 구조물이 아닙니다. 강의 흐름을 바꾸고, 마을을 품으며,
              수백만의 삶을 지탱해 온 거대한 역사입니다.
              <strong className="text-slate-850 font-extrabold text-slate-700"> 물문화관은 그 역사 위에 서 있습니다.</strong>
            </p>
            <p>
              전국 {waterCenters.length}곳 of 물문화관에는 각각의 강이 흐르고,
              수몰된 마을의 이야기가 남아 있으며,
              물과 함께 살아온 사람들의 기억이 새겨져 있습니다.
            </p>
          </div>
        </div>

      </div>

      {/* ── 네비게이션 도트 ── */}
      <div className="absolute bottom-5 left-6 z-10 flex items-center gap-2 sm:left-12 lg:left-20">
        {SLIDES.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            aria-label={`슬라이드 ${i + 1}`}
            className="group relative flex h-2 overflow-hidden rounded-full transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
            style={{ width: i === current ? "32px" : "8px" }}
          >
            <span
              className={[
                "absolute inset-0 rounded-full transition-colors",
                i === current
                  ? "bg-sky-500"
                  : "bg-slate-300 group-hover:bg-slate-400",
              ].join(" ")}
            />
          </button>
        ))}
      </div>

      {/* ── 좌우 화살표 ── */}
      <button
        onClick={goPrev}
        aria-label="이전 슬라이드"
        className="absolute left-4 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-slate-200 bg-white/80 text-slate-600 transition hover:bg-white hover:text-slate-800 hover:shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 sm:left-6"
      >
        ‹
      </button>
      <button
        onClick={goNext}
        aria-label="다음 슬라이드"
        className="absolute right-4 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-slate-200 bg-white/80 text-slate-600 transition hover:bg-white hover:text-slate-800 hover:shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 sm:right-6"
      >
        ›
      </button>

      {/* ── 슬라이드 카운터 ── */}
      <div className="absolute bottom-5 right-6 z-10 font-mono text-[10px] text-slate-400 sm:right-12 sm:text-xs">
        {String(current + 1).padStart(2, "0")} / {String(SLIDES.length).padStart(2, "0")}
      </div>
    </div>
  );
}
