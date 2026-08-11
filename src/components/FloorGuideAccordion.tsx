"use client";

import { useState } from "react";
import type { CenterFloor } from "@/types/database";

interface FloorGuideAccordionProps {
  floors: CenterFloor[];
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
                        <p className="text-[15px] sm:text-base leading-relaxed text-slate-600">
                          {f.description}
                        </p>
                      )}

                      {/* 주요 시설 및 링크 */}
                      {f.rooms && f.rooms.length > 0 && (
                        <div className="space-y-2">
                          <h4 className="text-[11px] sm:text-xs font-extrabold uppercase tracking-widest text-slate-400">
                            주요 시설 / 전시실
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            {f.rooms.map((room, idx) =>
                              room.link ? (
                                <a
                                  key={idx}
                                  href={room.link}
                                  className="inline-flex items-center gap-1.5 rounded-xl border border-sky-200 bg-sky-50/50 px-3 py-1.5 text-sm font-semibold text-sky-800 hover:bg-sky-50 transition"
                                >
                                  <span>{room.name}</span>
                                  <span className="text-[10px]" aria-hidden>↗</span>
                                </a>
                              ) : (
                                <span
                                  key={idx}
                                  className="inline-block rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-sm font-semibold text-slate-700"
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
                      <div className="space-y-2 pt-2">
                        <h4 className="text-[11px] sm:text-xs font-extrabold uppercase tracking-widest text-slate-400">
                          제공 편의시설
                        </h4>
                        <div className="flex flex-wrap gap-1.5">
                          {f.amenities.map((item, idx) => (
                            <span
                              key={idx}
                              className="inline-flex items-center gap-1.5 rounded-lg bg-slate-100 px-3 py-1 text-sm font-medium text-slate-700"
                            >
                              <span aria-hidden>
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
                      <div className="space-y-3 pt-3 border-t border-slate-100">
                        <h4 className="text-[11px] sm:text-xs font-extrabold uppercase tracking-widest text-slate-400">
                          내부 전경 사진 ({f.internal_photos.length})
                        </h4>
                        <div className="grid grid-cols-3 gap-2">
                          {f.internal_photos.map((photo, idx) => (
                            <button
                              key={idx}
                              type="button"
                              onClick={() => setLightbox(photo)}
                              className="group relative aspect-square overflow-hidden rounded-xl border border-slate-200 bg-slate-100 transition hover:border-sky-300"
                            >
                              <img
                                src={photo}
                                alt={`내부 전경 ${idx + 1}`}
                                className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                              />
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* 오른쪽: 도면 이미지 */}
                  {f.floor_map_url ? (
                    <div className="relative flex min-h-[220px] items-center justify-center overflow-hidden rounded-xl border border-slate-100 bg-slate-50/50 p-2">
                      <img
                        src={f.floor_map_url}
                        alt={`${f.floor_name} 도면`}
                        className="max-h-[300px] w-full object-contain rounded-lg transition-transform duration-300 hover:scale-102"
                      />
                    </div>
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
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 cursor-pointer"
          onClick={() => setLightbox(null)}
          role="presentation"
        >
          <img
            src={lightbox}
            alt="내부 사진 크게 보기"
            className="max-h-[90vh] max-w-full rounded-xl object-contain shadow-2xl"
          />
          <button
            type="button"
            onClick={() => setLightbox(null)}
            className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-white/15 text-white hover:bg-white/25"
            aria-label="닫기"
          >
            ✕
          </button>
        </div>
      )}
    </div>
  );
}
