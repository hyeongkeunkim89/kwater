"use client";

import { useState, useRef, useEffect } from "react";
import type { CenterFloor } from "@/types/database";

const getPhotoTitle = (photoUrl: string) => {
  try {
    const decodedUrl = decodeURIComponent(photoUrl);
    const parts = decodedUrl.split("/");
    const fileNameWithExt = parts[parts.length - 1];
    const lastDotIdx = fileNameWithExt.lastIndexOf(".");
    if (lastDotIdx === -1) return fileNameWithExt;
    return fileNameWithExt.substring(0, lastDotIdx);
  } catch (e) {
    return "";
  }
};

interface FloorGuideAccordionProps {
  floors: CenterFloor[];
}

function ZoomableMap({ mapUrl, floorName, floorKey }: { mapUrl: string; floorName: string; floorKey: string }) {
  const [isHovered, setIsHovered] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
  const dragStart = useRef({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseLeave = () => {
    setIsHovered(false);
    setIsDragging(false);
    setPanOffset({ x: 0, y: 0 });
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
    dragStart.current = {
      x: e.clientX - panOffset.x,
      y: e.clientY - panOffset.y,
    };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    const newX = e.clientX - dragStart.current.x;
    const newY = e.clientY - dragStart.current.y;
    
    // 드래그 제한 범위
    const limit = 220;
    const boundedX = Math.max(-limit, Math.min(limit, newX));
    const boundedY = Math.max(-limit, Math.min(limit, newY));
    
    setPanOffset({ x: boundedX, y: boundedY });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // 모바일 터치 지원
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      setIsHovered(true);
      setIsDragging(true);
      const touch = e.touches[0];
      dragStart.current = {
        x: touch.clientX - panOffset.x,
        y: touch.clientY - panOffset.y,
      };
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || e.touches.length !== 1) return;
    const touch = e.touches[0];
    const newX = touch.clientX - dragStart.current.x;
    const newY = touch.clientY - dragStart.current.y;
    
    const limit = 220;
    const boundedX = Math.max(-limit, Math.min(limit, newX));
    const boundedY = Math.max(-limit, Math.min(limit, newY));
    
    setPanOffset({ x: boundedX, y: boundedY });
  };

  return (
    <div
      ref={containerRef}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleMouseUp}
      className="relative flex min-h-[220px] items-center justify-center overflow-hidden rounded-xl border border-slate-100 bg-slate-50/50 p-2 select-none"
      style={{
        cursor: isDragging ? "grabbing" : isHovered ? "grab" : "zoom-in",
      }}
    >
      <img
        src={mapUrl}
        alt={`${floorName} 도면`}
        className="max-h-[300px] w-full object-contain rounded-lg pointer-events-none"
        style={{
          transform: isHovered
            ? `scale(1.8) translate(${panOffset.x / 1.8}px, ${panOffset.y / 1.8}px)`
            : "scale(1) translate(0px, 0px)",
          transformOrigin:
            floorKey === "문화공간"
              ? "25% 45%"
              : floorKey === "상설전시"
              ? "75% 65%"
              : "center center",
          transition: isDragging ? "none" : "transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
        }}
      />
    </div>
  );
}

// 아이콘 매핑 헬퍼
const AMENITY_ICONS: Record<string, string> = {
  toilet: "🚻",
  elevator: "🛗",
  info: "💁",
  desk: "💁",
  locker: "🛅",
  storage: "🛅",
  baby: "🍼",
  nursing: "🍼",
  parking: "🅿️",
  cafe: "☕",
  shop: "🛍️",
};

export function FloorGuideAccordion({ floors }: FloorGuideAccordionProps) {
  const [openFloorId, setOpenFloorId] = useState<string | null>(
    floors.length > 0 ? floors[0].id : null
  );
  const [lightbox, setLightbox] = useState<string | null>(null);
  const [lightboxPhotos, setLightboxPhotos] = useState<string[]>([]);
  const [expandedFloorPhotos, setExpandedFloorPhotos] = useState<Record<string, boolean>>({});

  const toggleExpandPhotos = (floorId: string) => {
    setExpandedFloorPhotos((prev) => ({
      ...prev,
      [floorId]: !prev[floorId],
    }));
  };

  const handlePrevPhoto = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (!lightbox || lightboxPhotos.length <= 1) return;
    const currentIndex = lightboxPhotos.indexOf(lightbox);
    if (currentIndex === -1) return;
    const prevIndex = (currentIndex - 1 + lightboxPhotos.length) % lightboxPhotos.length;
    setLightbox(lightboxPhotos[prevIndex]);
  };

  const handleNextPhoto = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (!lightbox || lightboxPhotos.length <= 1) return;
    const currentIndex = lightboxPhotos.indexOf(lightbox);
    if (currentIndex === -1) return;
    const nextIndex = (currentIndex + 1) % lightboxPhotos.length;
    setLightbox(lightboxPhotos[nextIndex]);
  };

  useEffect(() => {
    if (!lightbox) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") handlePrevPhoto();
      if (e.key === "ArrowRight") handleNextPhoto();
      if (e.key === "Escape") setLightbox(null);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [lightbox, lightboxPhotos]);

  const toggleFloor = (id: string) => {
    setOpenFloorId(openFloorId === id ? null : id);
  };

  if (floors.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-300 py-12 text-center text-sm text-slate-500">
        등록된 층별 안내 정보가 없습니다.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {floors.map((f) => {
        const isOpen = openFloorId === f.id;
        return (
          <div
            key={f.id}
            className="overflow-hidden rounded-2xl border border-slate-200 bg-white transition hover:border-slate-300"
          >
            {/* 1. 아코디언 헤더 */}
            <button
              type="button"
              onClick={() => toggleFloor(f.id)}
              className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left outline-none hover:bg-slate-50 focus-visible:bg-slate-50 focus-visible:ring-2 focus-visible:ring-sky-500"
            >
              <div className="flex min-w-0 flex-1 items-center gap-4">
                <span className="flex h-11 min-w-[4.2rem] px-4 shrink-0 items-center justify-center rounded-xl bg-slate-900 text-sm font-black text-white sm:text-base">
                  {f.floor_key.toLowerCase().startsWith("floor-") 
                    ? `${f.sort_order + 1}F` 
                    : f.floor_key}
                </span>
                <div className="min-w-0 flex-1">
                  {/* 주요 전시실/시설 목록 요약 */}
                  <p className="truncate text-base font-bold text-slate-900 sm:text-[17px]">
                    {f.rooms && f.rooms.length > 0
                      ? f.rooms.map((r) => r.name).join(" · ")
                      : "주요 시설 정보 없음"}
                  </p>
                </div>
              </div>

              {/* 내용 열기/닫기 화살표 버튼 */}
              <div className="flex items-center gap-2 shrink-0">
                <span className="hidden text-xs font-semibold text-slate-400 sm:inline">
                  {isOpen ? "내용 닫기" : "내용 열기"}
                </span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className={`h-5 w-5 text-slate-400 transition-transform duration-250 ${
                    isOpen ? "rotate-180 text-sky-500" : ""
                  }`}
                >
                  <path
                    fillRule="evenodd"
                    d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            </button>

            {/* 2. 아코디언 콘텐츠 */}
            <div
              className={`grid transition-all duration-300 ease-in-out ${
                isOpen ? "grid-rows-[1fr] opacity-100 border-t border-slate-100" : "grid-rows-[0fr] opacity-0"
              }`}
            >
              <div className="overflow-hidden">
                <div className="grid gap-6 p-6 md:grid-cols-[1.2fr_1fr]">
                  {/* 왼쪽: 설명 및 시설 정보 */}
                  <div className="flex flex-col justify-between space-y-5">
                    <div className="space-y-4">
                      {f.description && (
                        <p className="text-base sm:text-[17.5px] leading-relaxed text-slate-700 font-semibold">
                          {f.description}
                        </p>
                      )}

                      {/* 주요 시설 및 링크 */}
                      {f.rooms && f.rooms.length > 0 && (
                        <div className="space-y-2.5">
                          <h4 className="text-[14.5px] sm:text-[16.5px] font-black uppercase tracking-wide text-slate-800">
                            주요 시설 / 전시실
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            {f.rooms.map((room, idx) =>
                              room.link ? (
                                <a
                                  key={idx}
                                  href={room.link}
                                  className="inline-flex items-center gap-2 rounded-xl border border-sky-200 bg-sky-50 px-4 py-2.5 text-base font-extrabold text-sky-900 hover:bg-sky-100/70 transition shadow-sm"
                                >
                                  <span>{room.name}</span>
                                  <span className="text-xs" aria-hidden>↗</span>
                                </a>
                              ) : (
                                <span
                                  key={idx}
                                  className="inline-block rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-base font-extrabold text-slate-800 shadow-sm"
                                >
                                  {room.name}
                                </span>
                              )
                            )}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* 편의시설 아이콘 뱃지 */}
                    {f.amenities && f.amenities.length > 0 && (
                      <div className="space-y-2.5 pt-2">
                        <h4 className="text-[14.5px] sm:text-[16.5px] font-black uppercase tracking-wide text-slate-800">
                          제공 편의시설
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {f.amenities.map((item, idx) => (
                            <span
                              key={idx}
                              className="inline-flex items-center gap-2 rounded-xl bg-slate-100 px-4 py-2 text-base font-extrabold text-slate-800 shadow-sm"
                            >
                              <span aria-hidden className="text-lg">
                                {AMENITY_ICONS[item.icon] || "📍"}
                              </span>
                              <span>{item.label}</span>
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* 내부 사진 갤러리 */}
                    {f.internal_photos && f.internal_photos.length > 0 && (
                      <div className="space-y-3.5 pt-3 border-t border-slate-100">
                        <h4 className="text-[14.5px] sm:text-[16.5px] font-black uppercase tracking-wide text-slate-800">
                          내부 전경 사진 ({f.internal_photos.length})
                        </h4>
                        {(() => {
                          const photos = f.internal_photos || [];
                          const isExpanded = !!expandedFloorPhotos[f.id];
                          const hasMoreThanThree = photos.length > 3;
                          const displayedPhotos = isExpanded 
                            ? photos 
                            : photos.slice(0, 3);

                          return (
                            <div className="space-y-3">
                              <div className="grid grid-cols-3 gap-3.5">
                                {displayedPhotos.map((photo, idx) => {
                                  const title = getPhotoTitle(photo);
                                  const isLastItemAndCollapsed = !isExpanded && hasMoreThanThree && idx === 2;

                                  return (
                                    <div key={idx} className="flex flex-col items-center gap-2">
                                      <button
                                        type="button"
                                        onClick={() => {
                                          if (isLastItemAndCollapsed) {
                                            toggleExpandPhotos(f.id);
                                          } else {
                                            setLightbox(photo);
                                            setLightboxPhotos(photos);
                                          }
                                        }}
                                        className="group relative aspect-square w-full overflow-hidden rounded-xl border border-slate-200 bg-slate-100 transition hover:border-sky-300 shadow-sm"
                                      >
                                        <img
                                          src={photo}
                                          alt={title || `내부 전경 ${idx + 1}`}
                                          className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                                        />
                                        
                                        {/* 더보기 딤 오버레이 */}
                                        {isLastItemAndCollapsed && (
                                          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 backdrop-blur-[2px] transition hover:bg-black/50 text-white gap-1 select-none">
                                            <span className="text-[20px] sm:text-[24px] font-black">
                                              +{photos.length - 2}
                                            </span>
                                            <span className="text-[10px] sm:text-xs font-black tracking-wider uppercase">
                                              더보기
                                            </span>
                                          </div>
                                        )}
                                      </button>
                                      {title && (
                                        <span className="text-sm sm:text-base font-extrabold text-slate-700 truncate max-w-full text-center mt-1">
                                          &lt;{title}&gt;
                                        </span>
                                      )}
                                    </div>
                                  );
                                })}
                              </div>

                              {/* 사진 접기 버튼 (확장 상태에서만 표시) */}
                              {isExpanded && hasMoreThanThree && (
                                <button
                                  type="button"
                                  onClick={() => toggleExpandPhotos(f.id)}
                                  className="mx-auto flex items-center justify-center gap-1 text-xs sm:text-sm font-bold text-sky-600 hover:text-sky-700 transition"
                                >
                                  <span>사진 접기</span>
                                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="h-3.5 w-3.5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 15.75l7.5-7.5 7.5 7.5" />
                                  </svg>
                                </button>
                              )}
                            </div>
                          );
                        })()}
                      </div>
                    )}
                  </div>

                  {/* 오른쪽: 도면 이미지 (마우스 호버 시 줌인 및 마우스/터치 드래그 이동 기능 추가) */}
                  {f.floor_map_url ? (
                    <ZoomableMap
                      mapUrl={f.floor_map_url}
                      floorName={f.floor_name}
                      floorKey={f.floor_key}
                    />
                  ) : (
                    <div className="flex min-h-[160px] items-center justify-center rounded-xl bg-slate-50 border border-slate-100 text-xs text-slate-400">
                      도면 이미지가 등록되지 않았습니다.
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        );
      })}

      {/* 라이트박스 */}
      {lightbox && (
        <div
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/90 p-4 cursor-pointer select-none"
          onClick={() => setLightbox(null)}
          role="presentation"
        >
          {/* 이전 버튼 */}
          {lightboxPhotos.length > 1 && (
            <button
              type="button"
              onClick={handlePrevPhoto}
              className="absolute left-4 top-1/2 z-10 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/25 active:scale-95 sm:left-8 sm:h-14 sm:w-14"
              aria-label="이전 사진"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="h-6 w-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
              </svg>
            </button>
          )}

          {/* 메인 콘텐츠 영역 */}
          <div className="relative flex flex-col items-center gap-3.5 max-w-[90vw]" onClick={(e) => e.stopPropagation()}>
            <img
              src={lightbox}
              alt="내부 사진 크게 보기"
              className="max-h-[80vh] max-w-full rounded-xl object-contain shadow-2xl transition-all duration-300"
            />
            {getPhotoTitle(lightbox) && (
              <span className="text-sm sm:text-base font-extrabold text-white bg-black/55 px-4 py-1.5 rounded-full">
                &lt;{getPhotoTitle(lightbox)}&gt;
              </span>
            )}
          </div>

          {/* 다음 버튼 */}
          {lightboxPhotos.length > 1 && (
            <button
              type="button"
              onClick={handleNextPhoto}
              className="absolute right-4 top-1/2 z-10 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/25 active:scale-95 sm:right-8 sm:h-14 sm:w-14"
              aria-label="다음 사진"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="h-6 w-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
              </svg>
            </button>
          )}

          {/* 닫기 버튼 */}
          <button
            type="button"
            onClick={() => setLightbox(null)}
            className="absolute right-4 top-4 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/25 text-lg"
            aria-label="닫기"
          >
            ✕
          </button>
        </div>
      )}
    </div>
  );
}
