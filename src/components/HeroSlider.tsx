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
    location: "강원 춘천시",
    kind: "댐 물문화관",
    caption: "아시아 최대 사력댐 — 높이 123m, 저수용량 29억 톤의 위용",
  },
  {
    // 충주댐·충주호 실제 전경 (Wikimedia Commons, CC BY-SA 3.0, 방창현겨울아찌)
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/2/23/Chungju_Lake.jpg/1280px-Chungju_Lake.jpg",
    centerName: "충주댐 물문화관",
    location: "충북 충주시",
    kind: "댐 물문화관",
    caption: "국내 최대 다목적댐이 빚어낸 27.5억 톤 규모의 충주호",
  },
  {
    // 대청댐 방류 실제 전경 (Wikimedia Commons, CC BY-SA 4.0, Rickinasia)
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8d/Daecheong_Dam_after_rain_-_%EB%8C%80%EC%B2%AD%EB%8C%90.jpg/1280px-Daecheong_Dam_after_rain_-_%EB%8C%80%EC%B2%AD%EB%8C%90.jpg",
    centerName: "대청댐 물문화관",
    location: "대전 대덕구",
    kind: "댐 물문화관",
    caption: "장마 후 힘차게 방류하는 대청댐 — 금강 유역의 물 안전 거점",
  },
  {
    // 낙동강 석양 실제 전경 (Wikimedia Commons, CC BY-SA 3.0, Tsolmonchimeg)
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7c/Sunset_on_the_Nakdong_river_-_Tsolmonchimeg.jpg/1280px-Sunset_on_the_Nakdong_river_-_Tsolmonchimeg.jpg",
    centerName: "디아크 문화관",
    location: "대구 달성군",
    kind: "보 문화관",
    caption: "낙동강과 금호강이 합류하는 강정고령보의 낙조 풍경",
  },
  {
    // 시화호 조력발전소 항공 실사 (Wikimedia Commons, CC BY-SA 3.0 DE, Arne Müseler)
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/0/09/Sihwa_Lake_Tidal_Power_Station_aerial_view.jpg/1280px-Sihwa_Lake_Tidal_Power_Station_aerial_view.jpg",
    centerName: "시화나래 조력문화관",
    location: "경기 안산시",
    kind: "조력·발전 문화관",
    caption: "세계 최대 시화호 조력발전소의 항공 전경 — 연간 5.5억 kWh 청정 에너지",
  },
  {
    // 광주 구간 영산강 본류 전경 (Wikimedia Commons, CC0 — Saigen Jiro)
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f7/Yeongsan_River_in_Gwangju.JPG/1280px-Yeongsan_River_in_Gwangju.JPG",
    centerName: "영산강문화관",
    location: "광주 남구",
    kind: "보 문화관",
    caption: "광주를 가로지르는 영산강 — 승촌보·문화관이 자리한 남도의 대표 하천 풍경",
  },
];

const INTERVAL = 5000;

export function HeroSlider() {
  const [current, setCurrent] = useState(0);
  const [prev, setPrev] = useState<number | null>(null);
  const [transitioning, setTransitioning] = useState(false);
  const transitionEndRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const goNextTickRef = useRef<() => void>(() => {});
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
    <div className="relative h-full min-h-0 w-full flex-1 overflow-hidden bg-[#0b111e]">
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
            <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/40 to-black/70" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30" />
          </div>
        );
      })}

      {/* ── 텍스트 콘텐츠 ── */}
      <div className="relative z-10 flex h-full min-h-0 items-end px-6 pb-14 pt-4 sm:px-12 sm:pb-16 lg:px-20 lg:pb-16">

        {/* 왼쪽: 슬라이드 정보 */}
        <div key={current} className="hero-caption-animate max-w-xl">
          <div className="mb-2 flex items-center gap-2 sm:mb-3 sm:gap-3">
            <span className="h-px w-8 bg-sky-400" />
            <span className="text-xs font-bold uppercase tracking-widest text-sky-300">
              {SLIDES[current].kind}
            </span>
          </div>
          <h2 className="text-3xl font-black leading-tight tracking-tight text-white sm:text-4xl lg:text-5xl">
            {SLIDES[current].centerName}
          </h2>
          <p className="mt-2 text-sm font-medium text-white/60 sm:mt-3 sm:text-base">
            {SLIDES[current].location}
          </p>
          <p className="mt-3 max-w-md text-xs leading-relaxed text-white/50 sm:mt-4 sm:text-sm">
            {SLIDES[current].caption}
          </p>

          <div className="mt-5 flex flex-wrap gap-2 sm:mt-7 sm:gap-3">
            <Link
              href="/status"
              className="inline-flex items-center gap-2 rounded-full bg-sky-500 px-5 py-2.5 text-xs font-bold text-white shadow-lg shadow-sky-500/30 transition hover:bg-sky-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#0b111e] sm:px-6 sm:py-3 sm:text-sm"
            >
              전체 문화관 보기
            </Link>
            <Link
              href="/reserve"
              className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-black/25 px-5 py-2.5 text-xs font-bold text-white transition hover:bg-black/35 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0b111e] sm:px-6 sm:py-3 sm:text-sm"
            >
              투어 예약하기
            </Link>
          </div>
        </div>

        {/* 오른쪽: 물문화관 개요 — 오른쪽 끝 고정 */}
        <div className="absolute bottom-14 right-6 hidden max-w-[220px] flex-col justify-end border-l border-white/15 pl-6 pb-0 sm:flex md:max-w-xs md:right-12 lg:right-16 lg:pl-8">
          <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-sky-400/80 sm:text-[10px]">
            K-water Water Culture Center
          </p>
          <h3 className="mt-2 text-xl font-black leading-snug tracking-tight text-white sm:mt-3 sm:text-2xl xl:text-3xl">
            물은 흐르고,<br />
            <span className="bg-gradient-to-r from-sky-400 to-blue-300 bg-clip-text text-transparent">
              기억은 남는다
            </span>
          </h3>
          <div className="mt-3 space-y-2 text-[11px] leading-relaxed text-white/55 sm:mt-4 sm:space-y-2.5 sm:text-[12px] md:text-[13px]">
            <p>
              댐은 단순한 구조물이 아닙니다. 강의 흐름을 바꾸고, 마을을 품으며,
              수백만의 삶을 지탱해 온 거대한 역사입니다.
              <strong className="text-white/75"> 물문화관은 그 역사 위에 서 있습니다.</strong>
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
            className="group relative flex h-2 overflow-hidden rounded-full transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0b111e]"
            style={{ width: i === current ? "32px" : "8px" }}
          >
            <span
              className={[
                "absolute inset-0 rounded-full transition-colors",
                i === current
                  ? "bg-sky-400"
                  : "bg-white/30 group-hover:bg-white/60",
              ].join(" ")}
            />
          </button>
        ))}
      </div>

      {/* ── 좌우 화살표 ── */}
      <button
        onClick={goPrev}
        aria-label="이전 슬라이드"
        className="absolute left-4 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-black/45 text-white/80 transition hover:bg-black/60 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 sm:left-6"
      >
        ‹
      </button>
      <button
        onClick={goNext}
        aria-label="다음 슬라이드"
        className="absolute right-4 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-black/45 text-white/80 transition hover:bg-black/60 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 sm:right-6"
      >
        ›
      </button>

      {/* ── 슬라이드 카운터 ── */}
      <div className="absolute bottom-5 right-6 z-10 font-mono text-[10px] text-white/30 sm:right-12 sm:text-xs">
        {String(current + 1).padStart(2, "0")} / {String(SLIDES.length).padStart(2, "0")}
      </div>

    </div>
  );
}
