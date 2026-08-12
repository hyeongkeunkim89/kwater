"use client";

import { useCallback, useEffect, useState } from "react";

interface Props {
  images: string[];
}

export function CenterSurroundingsGallery({ images }: Props) {
  const [lightbox, setLightbox] = useState<string | null>(null);
  const [lightboxIdx, setLightboxIdx] = useState(0);

  const getCaption = (src: string) => {
    try {
      const fileName = src.split("/").pop() || "";
      const dotIndex = fileName.lastIndexOf(".");
      const nameWithoutExt = dotIndex !== -1 ? fileName.slice(0, dotIndex) : fileName;
      return decodeURIComponent(nameWithoutExt);
    } catch {
      return "";
    }
  };

  const openByIdx = useCallback((idx: number) => {
    const clamped = Math.max(0, Math.min(images.length - 1, idx));
    setLightboxIdx(clamped);
    setLightbox(images[clamped] ?? null);
  }, [images]);

  /* 키보드 네비게이션 */
  useEffect(() => {
    if (!lightbox) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") openByIdx(lightboxIdx + 1);
      if (e.key === "ArrowLeft") openByIdx(lightboxIdx - 1);
      if (e.key === "Escape") setLightbox(null);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [lightbox, lightboxIdx, openByIdx]);

  const openLightbox = (src: string) => {
    const idx = images.indexOf(src);
    setLightboxIdx(idx);
    setLightbox(src);
  };

  return (
    <section className="mt-16" aria-labelledby="surroundings-gallery">
      {/* 섹션 헤더 */}
      <div className="mb-6 flex items-center gap-4">
        <div className="h-px flex-1 bg-slate-100" />
        <h2
          id="surroundings-gallery"
          className="text-sm font-bold uppercase tracking-widest text-slate-400"
        >
          Surroundings & Parking
        </h2>
        <div className="h-px flex-1 bg-slate-100" />
      </div>
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-black tracking-tight text-slate-900">
          주변 경관 & 주차 시설
        </h2>
        <span className="text-sm text-slate-400">{images.length}장</span>
      </div>

      {images.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 py-16 text-center text-sm text-slate-400">
          아직 등록된 주변 경관 및 주차 시설 사진이 없습니다.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {images.map((src) => {
            const caption = getCaption(src);
            return (
              <div
                key={src}
                onClick={() => openLightbox(src)}
                className="group cursor-pointer overflow-hidden rounded-2xl border border-slate-200 bg-white transition hover:border-sky-300 hover:shadow-lg hover:shadow-sky-50"
              >
                <div className="relative aspect-video w-full overflow-hidden bg-slate-150">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={src}
                    alt={caption}
                    loading="lazy"
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/10 opacity-0 transition duration-300 group-hover:opacity-100" />
                </div>
                {caption && (
                  <div className="border-t border-slate-100 px-5 py-4">
                    <p className="text-sm font-bold leading-snug text-slate-800 transition group-hover:text-sky-600">
                      {caption}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* 라이트박스 */}
      {lightbox && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
          onClick={() => setLightbox(null)}
        >
          {/* 이전 */}
          {lightboxIdx > 0 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                openByIdx(lightboxIdx - 1);
              }}
              className="absolute left-4 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition text-2xl font-bold"
              aria-label="이전 사진"
            >
              ‹
            </button>
          )}

          {/* 이미지 컨테이너 */}
          <div 
            className="relative max-h-[85vh] max-w-full flex flex-col items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={lightbox}
              alt=""
              className="max-h-[80vh] max-w-full rounded-xl object-contain shadow-2xl"
            />
            {getCaption(lightbox) && (
              <p className="mt-4 text-center text-sm font-semibold text-white/95 bg-black/40 backdrop-blur-md px-4 py-2 rounded-full">
                {getCaption(lightbox)}
              </p>
            )}
          </div>

          {/* 다음 */}
          {lightboxIdx < images.length - 1 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                openByIdx(lightboxIdx + 1);
              }}
              className="absolute right-4 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition text-2xl font-bold"
              aria-label="다음 사진"
            >
              ›
            </button>
          )}

          {/* 닫기 + 카운터 */}
          <button
            onClick={() => setLightbox(null)}
            className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition"
            aria-label="닫기"
          >
            ✕
          </button>
          <span className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-black/60 px-4 py-1.5 text-xs text-white/90 font-medium">
            {lightboxIdx + 1} / {images.length}
          </span>
        </div>
      )}
    </section>
  );
}
