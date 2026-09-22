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
  bgPosition?: string;
}

const SLIDES: Slide[] = [
  {
    // 소양강댐 실제 전경 (Wikimedia Commons, CC BY-SA 3.0, Jjw)
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ea/SoyangDam.JPG/1280px-SoyangDam.JPG",
    centerName: "소양강댐 물문화관",
    location: "강원 춘천시",
    kind: "SOYANGGANG DAM",
    caption: "아시아 최대 사력댐 — 높이 123m, 저수용량 29억 톤의 웅장한 호수 전경",
    bgPosition: "center 12%",
  },
  {
    // 충주댐·충주호 실제 전경 (Wikimedia Commons, CC BY-SA 3.0, 방창현겨울아찌)
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/2/23/Chungju_Lake.jpg/1280px-Chungju_Lake.jpg",
    centerName: "충주댐 물문화관",
    location: "충북 충주시",
    kind: "CHUNGJU DAM",
    caption: "국내 최대 다목적댐이 빚어낸 27.5억 톤 규모의 청풍호반 자연 물길",
    bgPosition: "center center",
  },
  {
    // 대청댐 방류 실제 전경 (Wikimedia Commons, CC BY-SA 4.0, Rickinasia)
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8d/Daecheong_Dam_after_rain_-_%EB%8C%80%EC%B2%AD%EB%8C%90.jpg/1280px-Daecheong_Dam_after_rain_-_%EB%8C%80%EC%B2%AD%EB%8C%90.jpg",
    centerName: "대청댐 물문화관",
    location: "대전 대덕구",
    kind: "DAECHEONG DAM",
    caption: "장마 후 힘차게 방류하는 대청댐 — 금강 유역 생태와 물 안전의 핵심 기지",
    bgPosition: "center center",
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
    <div className="relative h-full min-h-0 w-full flex-1 overflow-hidden bg-slate-900">
      {/* ── 슬라이드 이미지 레이어 + 상단 산문구(한국수자원공사 소양강 다목적댐) 보존 선명한 시네마틱 오버레이 ── */}
      {SLIDES.map((slide, i) => {
        const isActive = i === current;
        const isPrev = i === prev;
        const kenBurnsOn = isActive && !prefersReducedMotion;
        const bgPos = slide.bgPosition || "center center";
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
              className="absolute inset-0 bg-cover"
              style={{
                backgroundImage: `url(${slide.imageUrl})`,
                backgroundPosition: bgPos,
                transformOrigin: bgPos,
                transform: kenBurnsOn ? "scale(1.025)" : "scale(1)",
                transition: kenBurnsOn ? "transform 6000ms ease-out" : "none",
              }}
            />
            {/* 상단 산 표지 문구가 잘리지 않고 투명하게 보이도록 그라데이션 정교화 */}
            <div className="absolute inset-0 bg-gradient-to-r from-slate-950/70 via-slate-950/30 to-transparent md:from-slate-950/65 md:via-slate-950/20" />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
          </div>
        );
      })}

      {/* ── 텍스트 콘텐츠 (하얀 박스 없는 깔끔한 내추럴 타이포그래피) ── */}
      <div className="relative z-10 flex h-full min-h-0 items-end px-6 pb-14 pt-4 sm:px-12 sm:pb-16 lg:px-20 lg:pb-16">

        {/* 왼쪽: 슬라이드 정보 (자연스럽게 떠 있는 시네마틱 텍스트) */}
        <div key={current} className="hero-caption-animate max-w-xl space-y-2.5 sm:space-y-3.5">
          <span className="inline-flex items-center gap-1.5 text-[11px] sm:text-xs font-bold text-sky-200 bg-sky-950/50 px-3 py-1 rounded-full border border-sky-400/30 tracking-wide backdrop-blur-md shadow-sm">
            📍 {SLIDES[current].location}
          </span>
          <h2 className="text-3xl sm:text-4.5xl font-black leading-tight tracking-tight text-white drop-shadow-md">
            {SLIDES[current].centerName}
          </h2>
          <p className="text-xs sm:text-base leading-relaxed text-slate-100 font-semibold drop-shadow-sm break-keep max-w-lg">
            {SLIDES[current].caption}
          </p>
        </div>

        {/* 오른쪽: 물문화관 개요 (박스 없는 청량 타이포그래피) */}
        <div className="absolute bottom-16 right-6 hidden max-w-[280px] flex-col justify-end p-2 sm:flex md:max-w-sm md:right-12 lg:right-16 text-white drop-shadow-md">
          <p className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-sky-300">
            K-water Water Culture Center
          </p>
          <h3 className="mt-1.5 text-xl font-black leading-snug tracking-tight text-white sm:text-2xl">
            물은 흐르고,<br />
            <span className="bg-gradient-to-r from-sky-300 via-cyan-200 to-sky-100 bg-clip-text text-transparent">
              기억은 남는다
            </span>
          </h3>
          <div className="mt-3 space-y-2 text-[11px] sm:text-xs leading-relaxed text-slate-100 font-medium opacity-90">
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
            className="group relative flex h-2.5 overflow-hidden rounded-full transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400"
            style={{ width: i === current ? "32px" : "10px" }}
          >
            <span
              className={[
                "absolute inset-0 rounded-full transition-colors",
                i === current
                  ? "bg-sky-400 shadow-sm shadow-sky-400/50"
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
        className="absolute left-4 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-slate-950/40 backdrop-blur-md text-white transition hover:bg-sky-500 hover:border-sky-500 shadow-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 sm:left-6 font-bold text-lg"
      >
        ‹
      </button>
      <button
        onClick={goNext}
        aria-label="다음 슬라이드"
        className="absolute right-4 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-slate-950/40 backdrop-blur-md text-white transition hover:bg-sky-500 hover:border-sky-500 shadow-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 sm:right-6 font-bold text-lg"
      >
        ›
      </button>

      {/* ── 슬라이드 카운터 ── */}
      <div className="absolute bottom-5 right-6 z-10 font-mono text-[10px] text-slate-200 sm:right-12 sm:text-xs bg-slate-950/40 backdrop-blur-md px-3 py-1 rounded-full border border-white/20 shadow-xs font-bold">
        <span className="text-sky-300 font-black">{String(current + 1).padStart(2, "0")}</span> / {String(SLIDES.length).padStart(2, "0")}
      </div>
    </div>
  );
}
