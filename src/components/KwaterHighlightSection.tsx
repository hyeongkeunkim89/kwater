"use client";

import { useState } from "react";
import Image from "next/image";

type HighlightItem = {
  id: string;
  title: string;
  desc: string;
  tag: string;
  author: string;
  thumbnail: string;
  videoUrl: string;
  embedUrl: string;
  isShorts?: boolean;
};

const HIGHLIGHT_ITEMS: HighlightItem[] = [
  {
    id: "rO3a8hi0LUI",
    title: "우리나라에서 가장 인기 많은 댐은 어디일까요?",
    desc: "소양강댐, 충주댐, 대청댐의 숨은 매력을 K-water 공식 숏폼 영상으로 확인해 보세요.",
    tag: "🎬 인기 숏폼",
    author: "K-water 한국수자원공사 Official",
    thumbnail: "https://i.ytimg.com/vi/rO3a8hi0LUI/hqdefault.jpg",
    videoUrl: "https://www.youtube.com/shorts/rO3a8hi0LUI",
    embedUrl: "https://www.youtube.com/embed/rO3a8hi0LUI?autoplay=1",
    isShorts: true,
  },
  {
    id: "ENpfGPkKeQA",
    title: "[Vlog] 대청댐 물문화관 탐방 & 뷰 맛집 카페 투어",
    desc: "대청댐 물문화관 전시 공간과 주변 뷰 맛집 카페 투어까지! 대학생 서포터즈의 탐방 브이로그입니다.",
    tag: "🎥 문화관 브이로그",
    author: "K-water 대학생 서포터즈",
    thumbnail: "https://i.ytimg.com/vi/ENpfGPkKeQA/hqdefault.jpg",
    videoUrl: "https://www.youtube.com/watch?v=ENpfGPkKeQA",
    embedUrl: "https://www.youtube.com/embed/ENpfGPkKeQA?autoplay=1",
    isShorts: false,
  },
  {
    id: "jpsWBqvXWv0",
    title: "[출동 水퍼 서포터즈!] 낙동강 유역 K-WILL 물문화관 방문기",
    desc: "낙동강 유역 주요 거점 물문화관 탐방! 생태 환경 체험존과 K-WILL 투어 현장 방문기입니다.",
    tag: "🌊 낙동강 유역 투어",
    author: "K-water 대학생 서포터즈",
    thumbnail: "https://i.ytimg.com/vi/jpsWBqvXWv0/hqdefault.jpg",
    videoUrl: "https://www.youtube.com/watch?v=jpsWBqvXWv0",
    embedUrl: "https://www.youtube.com/embed/jpsWBqvXWv0?autoplay=1",
    isShorts: false,
  },
];

export function KwaterHighlightSection() {
  const [activeVideo, setActiveVideo] = useState<HighlightItem | null>(null);

  return (
    <section
      aria-label="K-water 미디어 하이라이트"
      className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm transition-all duration-300"
    >
      {/* 섹션 헤더 (Option A 표준 헤더 규격) */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-slate-100 pb-5">
        <div>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-sky-100 px-3 py-1 text-xs font-black tracking-wider uppercase text-sky-700">
            K-WATER HIGHLIGHT
          </span>
          <h2 className="mt-2 text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            생생한 물문화 영상 &amp; 숏폼
          </h2>
          <p className="mt-1 text-xs sm:text-sm font-medium text-slate-500">
            K-water 공식 유튜브 채널에서 전해드리는 전국 댐과 물문화관의 생생한 현장 영상입니다.
          </p>
        </div>

        <a
          href="https://www.youtube.com/@kwatertv"
          target="_blank"
          rel="noopener noreferrer"
          className="self-start sm:self-auto inline-flex items-center justify-center gap-1.5 rounded-full bg-slate-900 hover:bg-red-600 text-xs sm:text-sm font-black text-white px-5 py-2.5 transition-all duration-200 shadow-xs hover:shadow-md group whitespace-nowrap"
        >
          <svg className="h-4 w-4 text-red-500 group-hover:text-white transition-colors" fill="currentColor" viewBox="0 0 24 24">
            <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
          </svg>
          <span>K-water 공식 유튜브 채널</span>
          <span className="transform group-hover:translate-x-0.5 transition-transform duration-200">→</span>
        </a>
      </div>

      {/* 영상 카드 그리드 */}
      <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-3">
        {HIGHLIGHT_ITEMS.map((item) => (
          <div
            key={item.id}
            onClick={() => setActiveVideo(item)}
            className="group cursor-pointer relative flex flex-col overflow-hidden rounded-xl border border-slate-200/90 bg-white shadow-xs transition-all duration-300 hover:-translate-y-1 hover:border-sky-400 hover:shadow-xl"
          >
            {/* 비디오 썸네일 영역 */}
            <div className="relative h-48 sm:h-52 w-full overflow-hidden bg-slate-950">
              {item.thumbnail.startsWith("http") ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={item.thumbnail}
                  alt={item.title}
                  className="h-full w-full object-cover object-center opacity-90 transition-transform duration-500 ease-out group-hover:scale-105 group-hover:opacity-100"
                />
              ) : (
                <Image
                  src={item.thumbnail}
                  alt={item.title}
                  fill
                  className="object-cover object-center opacity-90 transition-transform duration-500 ease-out group-hover:scale-105 group-hover:opacity-100"
                />
              )}

              {/* 딤드 및 플레이 버튼 오버레이 */}
              <div className="absolute inset-0 bg-slate-950/30 group-hover:bg-slate-950/20 transition-colors duration-300" />

              {/* 태그 뱃지 */}
              <div className="absolute left-3.5 top-3.5 z-10">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-900/80 border border-white/20 px-3 py-1 text-xs font-bold text-white backdrop-blur-md shadow-xs">
                  {item.tag}
                </span>
              </div>

              {/* 재생 버튼 아이콘 (중앙 정렬) */}
              <div className="absolute inset-0 z-10 flex items-center justify-center">
                <div className="flex h-13 w-13 items-center justify-center rounded-full bg-slate-900/80 text-white border border-white/30 backdrop-blur-md transition-all duration-300 group-hover:scale-110 group-hover:bg-red-600 group-hover:border-red-400 shadow-xl">
                  <svg className="ml-1 h-6 w-6 fill-current" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
              </div>
            </div>

            {/* 비디오 설명 영역 */}
            <div className="p-5 flex flex-col justify-between flex-1 bg-white">
              <div>
                <p className="text-[11px] font-extrabold text-sky-600 tracking-tight">
                  {item.author}
                </p>
                <h3 className="mt-1 text-base sm:text-lg font-black text-slate-900 group-hover:text-sky-600 transition-colors duration-200 line-clamp-2 min-h-[3.25rem]">
                  {item.title}
                </h3>
                <p className="mt-1.5 mb-4 text-xs sm:text-sm font-medium text-slate-600 leading-relaxed break-keep min-h-[2.5rem]">
                  {item.desc}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-black text-sky-600 group-hover:text-sky-700 transition-colors duration-200">
                <span className="flex items-center gap-1">
                  <span>영상 재생하기</span>
                </span>
                <span className="text-sm font-black transform group-hover:translate-x-1.5 transition-transform duration-200">
                  ▶
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 비디오 재생 팝업 모달 */}
      {activeVideo && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4 transition-opacity duration-300"
          onClick={() => setActiveVideo(null)}
          role="presentation"
        >
          <div
            className={`relative w-full overflow-hidden rounded-2xl bg-black shadow-2xl ${
              activeVideo.isShorts
                ? "max-w-xs sm:max-w-sm aspect-[9/16] h-[80vh]"
                : "max-w-4xl aspect-video"
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            {/* 모달 닫기 버튼 */}
            <button
              onClick={() => setActiveVideo(null)}
              className="absolute right-3 top-3 z-20 flex h-9 w-9 items-center justify-center rounded-full bg-black/60 text-white hover:bg-black/90 transition border border-white/20"
              aria-label="닫기"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* 유튜브 아이프레임 재생 */}
            <iframe
              src={activeVideo.embedUrl}
              title={activeVideo.title}
              className="h-full w-full rounded-2xl"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />

            {/* 유튜브 외부 링크 버튼 */}
            <div className="absolute bottom-3 left-3 right-3 z-20 flex justify-center">
              <a
                href={activeVideo.videoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-full bg-red-600/90 hover:bg-red-600 px-4 py-1.5 text-xs font-bold text-white backdrop-blur-md shadow-md transition"
              >
                <span>유튜브 앱에서 보기</span>
                <span>↗</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
