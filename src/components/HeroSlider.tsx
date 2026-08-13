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
    <div className="relative h-full min-h-0 w-full flex-1 overflow-hidden bg-slate-950">
      {/* ── 슬라이드 이미지 레이어 + 시네마틱 오버레이 (water.or.kr 스타일) ── */}
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
            {/* water.or.kr 스타일의 어두운 시네마틱 그라데이션 오버레이 */}
            <div className="absolute inset-0 bg-gradient-to-r from-slate-950/80 via-slate-950/45 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/20 to-slate-950/30" />
          </div>
        );
      })}

      {/* ── 텍스트 콘텐츠 ── */}
      <div className="relative z-10 flex h-full min-h-0 items-end px-5 pb-12 pt-4 sm:px-12 sm:pb-16 lg:px-20 lg:pb-16">

        {/* 왼쪽: 슬라이드 정보 (water.or.kr 스타일 고대비 선명한 흰색 텍스트 & 다크 글래스 카드) */}
        <div key={current} className="hero-caption-animate max-w-lg bg-slate-900/60 backdrop-blur-md rounded-2xl sm:rounded-[24px] p-6 sm:p-7 border border-white/20 shadow-2xl">
          <span className="inline-flex items-center gap-1.5 text-[11px] sm:text-xs font-bold text-sky-300 bg-sky-500/25 px-3 py-1 rounded-full border border-sky-400/30 tracking-wide">
            📍 {SLIDES[current].location}
          </span>
          <h2 className="mt-3 text-xl sm:text-3xl font-black leading-tight tracking-tight text-white drop-shadow-md">
            {SLIDES[current].centerName}
          </h2>
          <p className="mt-3 text-xs sm:text-sm leading-relaxed text-slate-200 font-semibold break-keep">
            {SLIDES[current].caption}
          </p>
        </div>

        {/* 오른쪽: 물문화관 개요 (water.or.kr 스타일 다크 다이내믹 패널) */}
        <div className="absolute bottom-14 right-6 hidden max-w-[260px] flex-col justify-end bg-slate-900/65 backdrop-blur-md rounded-[28px] p-6 border border-white/20 shadow-2xl sm:flex md:max-w-xs md:right-12 lg:right-16 text-white">
          <p className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-sky-400">
            K-water Water Culture Center
          </p>
          <h3 className="mt-2 text-xl font-black leading-snug tracking-tight text-white sm:mt-3 sm:text-2xl">
            물은 흐르고,<br />
            <span className="bg-gradient-to-r from-sky-400 to-cyan-300 bg-clip-text text-transparent">
              기억은 남는다
            </span>
          </h3>
          <div className="mt-3 space-y-2 text-[11px] leading-relaxed text-slate-300 sm:mt-4 font-medium">
            <p>
              댐은 단순한 구조물이 아닙니다. 강의 흐름을 바꾸고, 마을을 품으며,
              수백만의 삶을 지탱해 온 거대한 역사입니다.
              <strong className="text-sky-300 font-extrabold"> 물문화관은 그 역사 위에 서 있습니다.</strong>
            </p>
            <p>
              전국 {waterCenters.length}곳의 물문화관에는 각각의 강이 흐르고,
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
            className="group relative flex h-2 overflow-hidden rounded-full transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900"
            style={{ width: i === current ? "32px" : "8px" }}
          >
            <span
              className={[
                "absolute inset-0 rounded-full transition-colors",
                i === current
                  ? "bg-sky-400"
                  : "bg-white/40 group-hover:bg-white/70",
              ].join(" ")}
            />
          </button>
        ))}
      </div>

      {/* ── 좌우 화살표 ── */}
      <button
        onClick={goPrev}
        aria-label="이전 슬라이드"
        className="absolute left-4 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-slate-900/50 backdrop-blur-md text-white transition hover:bg-sky-500 hover:border-sky-500 shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 sm:left-6"
      >
        ‹
      </button>
      <button
        onClick={goNext}
        aria-label="다음 슬라이드"
        className="absolute right-4 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-slate-900/50 backdrop-blur-md text-white transition hover:bg-sky-500 hover:border-sky-500 shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 sm:right-6"
      >
        ›
      </button>

      {/* ── 슬라이드 카운터 ── */}
      <div className="absolute bottom-5 right-6 z-10 font-mono text-[10px] text-slate-300 sm:right-12 sm:text-xs bg-slate-900/60 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/10">
        <span className="text-sky-400 font-bold">{String(current + 1).padStart(2, "0")}</span> / {String(SLIDES.length).padStart(2, "0")}
      </div>
    </div>
  );
}
