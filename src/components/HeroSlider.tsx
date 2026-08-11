"use client";

import Link from "next/link";
import Image from "next/image";
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
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ea/SoyangDam.JPG/1280px-SoyangDam.JPG",
    centerName: "소양강댐 물문화관",
    location: "강원 춘천시",
    kind: "SOYANGGANG DAM",
    caption: "아시아 최대 사력댐 — 높이 123m, 저수용량 29억 톤의 웅장한 호수 전경",
  },
  {
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/2/23/Chungju_Lake.jpg/1280px-Chungju_Lake.jpg",
    centerName: "충주댐 물문화관",
    location: "충북 충주시",
    kind: "CHUNGJU DAM",
    caption: "국내 최대 다목적댐이 빚어낸 27.5억 톤 규모의 청풍호반 자연 물길",
  },
  {
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8d/Daecheong_Dam_after_rain_-_%EB%8C%80%EC%B2%AD%EB%8C%90.jpg/1280px-Daecheong_Dam_after_rain_-_%EB%8C%80%EC%B2%AD%EB%8C%90.jpg",
    centerName: "대청댐 물문화관",
    location: "대전 대덕구",
    kind: "DAECHEONG DAM",
    caption: "장마 후 힘차게 방류하는 대청댐 — 금강 유역의 물 안전 거점",
  },
  {
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7c/Sunset_on_the_Nakdong_river_-_Tsolmonchimeg.jpg/1280px-Sunset_on_the_Nakdong_river_-_Tsolmonchimeg.jpg",
    centerName: "디아크 문화관",
    location: "대구 달성군",
    kind: "THE ARC",
    caption: "낙동강과 금호강이 합류하는 강정고령보의 낙조 풍경",
  },
  {
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/0/09/Sihwa_Lake_Tidal_Power_Station_aerial_view.jpg/1280px-Sihwa_Lake_Tidal_Power_Station_aerial_view.jpg",
    centerName: "시화나래 조력문화관",
    location: "경기 안산시",
    kind: "SIHWA NARE",
    caption: "세계 최대 시화호 조력발전소의 항공 전경 — 연간 5.5억 kWh 청정 에너지",
  },
  {
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f7/Yeongsan_River_in_Gwangju.JPG/1280px-Yeongsan_River_in_Gwangju.JPG",
    centerName: "영산강문화관",
    location: "광주 남구",
    kind: "YEONGSANGANG",
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
    [current, transitioning]
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
    []
  );

  return (
    <div className="relative h-full min-h-0 w-full flex-1 overflow-hidden bg-[#0b111e]">
      {/* ── 슬라이드 이미지 레이어 ── */}
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
            <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/50 to-black/75 md:via-black/40" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40" />
          </div>
        );
      })}

      {/* ── 메인 비주얼 콘텐츠 ── */}
      <div className="relative z-10 flex h-full min-h-0 flex-col justify-end px-5 pb-16 pt-6 sm:px-12 sm:pb-20 lg:flex-row lg:items-end lg:justify-between lg:px-20 lg:pb-18">
        
        {/* 왼쪽: 방울이 안내 말풍선 + 슬라이드 정보 (양각 효과 없이 플랫하고 선명하게 연출) */}
        <div key={current} className="hero-caption-animate max-w-xl">
          {/* 방울이가 말하는 말풍선 레이아웃 */}
          <div className="mb-3 flex items-center gap-3">
            <Image
              src="/images/bangwoori.png"
              alt="방울이 마스코트"
              width={44}
              height={44}
              className="h-11 w-auto shrink-0 animate-bounce-subtle drop-shadow-md"
              unoptimized
            />
            <div className="relative rounded-2xl bg-gradient-to-r from-[#00A3E0] to-[#0080FF] px-3.5 py-1.5 text-xs font-black text-white shadow-md">
              <span>방울이가 들려주는 K-water 이야기 💧</span>
              <span className="ml-1.5 rounded-full bg-[#FF9E1B] px-2 py-0.5 text-[10px] font-black">
                {SLIDES[current].kind}
              </span>
              {/* 말풍선 꼬리 */}
              <div className="absolute -left-1.5 top-1/2 -translate-y-1/2 border-y-4 border-r-6 border-y-transparent border-r-[#00A3E0]" />
            </div>
          </div>

          <h2 className="text-2.5xl font-black leading-tight tracking-tight text-white sm:text-4xl lg:text-5xl drop-shadow-md">
            {SLIDES[current].centerName}
          </h2>
          <p className="mt-2 text-sm font-semibold text-sky-200 sm:mt-3 sm:text-base">
            📍 {SLIDES[current].location}
          </p>
          <p className="mt-2.5 max-w-md text-xs leading-relaxed text-slate-200 sm:mt-3.5 sm:text-sm">
            {SLIDES[current].caption}
          </p>

          {/* K-water CI Water Blue (#00A3E0) & Point Orange (#FF9E1B) 터치 최적화 버튼 */}
          <div className="mt-5 flex flex-wrap gap-2.5 sm:mt-7 sm:gap-3">
            <Link
              href="/status"
              className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-full bg-[#00A3E0] px-6 py-3 text-sm font-black text-white shadow-lg shadow-[#00A3E0]/35 transition-all hover:bg-[#0088BD] hover:scale-105 active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
            >
              전체 문화관 보기
            </Link>
            <Link
              href="/reserve"
              className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-full bg-[#FF9E1B] px-6 py-3 text-sm font-black text-white shadow-lg shadow-[#FF9E1B]/35 transition-all hover:bg-[#E5890D] hover:scale-105 active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
            >
              무료 투어 예약하기 ✦
            </Link>
            <Link
              href="/mul-iyagi"
              className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-full border-2 border-white/30 bg-black/30 px-6 py-3 text-sm font-bold text-white backdrop-blur-md transition-all hover:border-white hover:bg-black/50 hover:scale-105 active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-200"
            >
              물 이야기 갤러리
            </Link>
          </div>
        </div>

        {/* 오른쪽: 방울이 캐릭터 안내 카드 레이아웃 (배경 블러와 오버레이 불투명도를 약하게 조정하여 맑게 연출) */}
        <div className="mt-6 rounded-3xl border border-[#00A3E0]/30 bg-slate-950/45 p-4 shadow-xl backdrop-blur-sm sm:mt-8 sm:p-5 lg:mt-0 lg:max-w-sm">
          <div className="flex items-center gap-3">
            <Image
              src="/images/bangwoori.png"
              alt="방울이 안내원"
              width={40}
              height={40}
              className="h-10 w-auto shrink-0 drop-shadow-sm"
              unoptimized
            />
            <div>
              <div className="flex items-center gap-1.5">
                <span className="rounded-full bg-[#00A3E0] px-2 py-0.5 text-[10px] font-black text-white">
                  K-water 마스코트
                </span>
                <span className="rounded-full bg-[#FF9E1B] px-2 py-0.5 text-[10px] font-black text-white">
                  방울이의 추천
                </span>
              </div>
              <h3 className="mt-1 text-base font-black text-white sm:text-lg">
                &quot;물은 흐르고, 기억은 남는다&quot;
              </h3>
            </div>
          </div>

          <div className="mt-3 space-y-2 text-xs leading-relaxed text-slate-100 sm:text-sm md:text-[13.5px] md:leading-relaxed">
            <p>
              댐은 단순한 구조물이 아닙니다. 강의 흐름을 바꾸고, 마을을 품으며,
              수백만의 삶을 지탱해 온 거대한 역사입니다.
            </p>
            <p>
              <strong className="font-extrabold text-[#00A3E0] underline decoration-[#FF9E1B] underline-offset-4">
                전국 {waterCenters.length}곳의 물문화관
              </strong>
              에서 물과 함께 살아온 사람들의 살아있는 기억을 만나보세요! 💧
            </p>
          </div>
        </div>

      </div>

      {/* ── 물방울 스타일 네비게이션 도트 ── */}
      <div className="absolute bottom-5 left-5 z-20 flex items-center gap-2 sm:left-12 lg:left-20">
        {SLIDES.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            aria-label={`슬라이드 ${i + 1}`}
            className="group relative flex h-3 items-center justify-center transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-300"
          >
            {i === current ? (
              <span className="h-3 w-9 rounded-full bg-gradient-to-r from-[#00A3E0] via-cyan-300 to-[#FF9E1B] shadow-md shadow-[#00A3E0]/50 ring-2 ring-white/60" />
            ) : (
              <span className="h-3 w-3 rounded-full bg-white/40 backdrop-blur-xs transition-colors group-hover:bg-white/80" />
            )}
          </button>
        ))}
      </div>

      {/* ── 물방울 모양 좌우 화살표 버튼 ── */}
      <button
        onClick={goPrev}
        aria-label="이전 슬라이드"
        className="absolute left-3 top-1/2 z-20 flex min-h-[48px] min-w-[48px] h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border-2 border-sky-300/40 bg-slate-950/65 text-white shadow-xl backdrop-blur-md transition-all duration-200 hover:scale-110 hover:bg-[#00A3E0] hover:border-[#00A3E0] hover:shadow-[#00A3E0]/60 active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 sm:left-6"
      >
        <svg className="h-6 w-6 stroke-white" fill="none" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.8" d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      <button
        onClick={goNext}
        aria-label="다음 슬라이드"
        className="absolute right-3 top-1/2 z-20 flex min-h-[48px] min-w-[48px] h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border-2 border-sky-300/40 bg-slate-950/65 text-white shadow-xl backdrop-blur-md transition-all duration-200 hover:scale-110 hover:bg-[#00A3E0] hover:border-[#00A3E0] hover:shadow-[#00A3E0]/60 active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 sm:right-6"
      >
        <svg className="h-6 w-6 stroke-white" fill="none" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.8" d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* ── 슬라이드 카운터 ── */}
      <div className="absolute bottom-5 right-5 z-20 rounded-full bg-slate-950/60 px-3 py-1 font-mono text-[11px] font-bold text-sky-200 backdrop-blur-sm sm:right-12">
        {String(current + 1).padStart(2, "0")} / {String(SLIDES.length).padStart(2, "0")}
      </div>
    </div>
  );
}
