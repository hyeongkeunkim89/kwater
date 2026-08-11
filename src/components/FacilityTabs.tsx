"use client";

import { useState } from "react";
import type { CenterFacility } from "@/types/database";

interface FacilityTabsProps {
  facilities: CenterFacility[];
}

export function FacilityTabs({ facilities }: FacilityTabsProps) {
  const [activeTabId, setActiveTabId] = useState<string | null>(
    facilities.length > 0 ? facilities[0].id : null
  );

  const activeFac = facilities.find((fac) => fac.id === activeTabId);

  if (facilities.length === 0) {
    return null; // 편의시설 정보가 없을 경우 섹션 자체를 숨김
  }

  return (
    <div className="space-y-6">
      {/* 1. 가로 탭 바 (모바일 스크롤 가능) */}
      <div className="border-b border-slate-200">
        <ul className="-mb-px flex gap-2 overflow-x-auto pb-1 scrollbar-none snap-x snap-mandatory">
          {facilities.map((fac) => {
            const isActive = fac.id === activeTabId;
            return (
              <li key={fac.id} className="snap-start shrink-0">
                <button
                  type="button"
                  onClick={() => setActiveTabId(fac.id)}
                  aria-selected={isActive}
                  role="tab"
                  className={`inline-block border-b-2 px-4 py-2.5 text-sm font-semibold transition focus:outline-none ${
                    isActive
                      ? "border-sky-500 text-sky-600"
                      : "border-transparent text-slate-500 hover:border-slate-300 hover:text-slate-700"
                  }`}
                >
                  {fac.name}
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      {/* 2. 탭 콘텐츠 상세 정보 카드 */}
      {activeFac && (
        <div className="grid gap-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm md:grid-cols-[1fr_1.3fr] transition-opacity duration-200">
          {/* 이미지 영역 */}
          {activeFac.image_url ? (
            <div className="relative flex min-h-[220px] items-center justify-center overflow-hidden rounded-xl border border-slate-100 bg-slate-50">
              <img
                src={activeFac.image_url}
                alt={activeFac.name}
                className="max-h-[300px] w-full object-cover rounded-lg"
              />
            </div>
          ) : (
            <div className="flex min-h-[200px] items-center justify-center rounded-xl bg-slate-50 border border-slate-100 text-xs text-slate-400">
              시설 사진이 없습니다.
            </div>
          )}

          {/* 세부 항목 정보 */}
          <div className="flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <h3 className="text-xl font-black text-slate-900">
                {activeFac.name}
              </h3>
              {activeFac.description && (
                <p className="text-sm leading-relaxed text-slate-600">
                  {activeFac.description}
                </p>
              )}
            </div>

            {/* 항목 상세 스펙 테이블 */}
            <div className="rounded-xl border border-slate-100 bg-slate-50/50 p-4">
              <dl className="space-y-3 text-xs leading-relaxed">
                {activeFac.location && (
                  <div className="grid grid-cols-[80px_1fr] gap-2">
                    <dt className="font-extrabold text-slate-500">위치</dt>
                    <dd className="text-slate-800 font-medium">{activeFac.location}</dd>
                  </div>
                )}
                {activeFac.operating_hours && (
                  <div className="grid grid-cols-[80px_1fr] gap-2">
                    <dt className="font-extrabold text-slate-500">운영시간</dt>
                    <dd className="text-slate-800 font-medium">{activeFac.operating_hours}</dd>
                  </div>
                )}
                {activeFac.area && (
                  <div className="grid grid-cols-[80px_1fr] gap-2">
                    <dt className="font-extrabold text-slate-500">시설면적</dt>
                    <dd className="text-slate-800 font-medium">{activeFac.area}</dd>
                  </div>
                )}
                {activeFac.notes && (
                  <div className="grid grid-cols-[80px_1fr] gap-2 pt-1 border-t border-slate-100">
                    <dt className="font-extrabold text-slate-500">유의사항</dt>
                    <dd className="text-slate-600 font-medium whitespace-pre-line leading-relaxed">
                      {activeFac.notes}
                    </dd>
                  </div>
                )}
              </dl>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
