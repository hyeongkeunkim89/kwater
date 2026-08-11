"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
} from "react-simple-maps";
import type { WaterCenter } from "@/data/centers";
import { formatWeeklyClosureSentence, waterCenters } from "@/data/centers";
import {
  displayStatusStyles,
  formatCenterRegionLine,
  getSeoulWeekdayHan,
  resolveDisplayStatus,
  type DisplayStatus,
} from "@/lib/center-display";
import { centerThemeBadgeClass, koreaMapUi } from "@/lib/centerExplorerUi";
import { naverMapSearchHref } from "@/lib/mapLinks";

const PROVINCES_URL = "/korea-provinces.json";

const PIN_COLORS: Record<DisplayStatus, string> = {
  ["\uC6B4\uC601\uC911"]: "#0066B3",
  ["\uC624\uB298 \uD734\uAD00"]: "#7c3aed",
  ["\uC784\uC2DC\uD734\uAD00"]: "#ef4444",
};

const LEGEND_ITEMS: [DisplayStatus, string][] = [
  ["\uC6B4\uC601\uC911", PIN_COLORS["\uC6B4\uC601\uC911"]],
  ["\uC624\uB298 \uD734\uAD00", PIN_COLORS["\uC624\uB298 \uD734\uAD00"]],
  ["\uC784\uC2DC\uD734\uAD00", PIN_COLORS["\uC784\uC2DC\uD734\uAD00"]],
];

const PROVINCE_FILL: Record<string, string> = {
  "\uC11C\uC6B8\uD2B9\uBCC4\uC2DC": "#dbeafe",
  "\uC778\uCC9C\uAD11\uC5ED\uC2DC": "#bfdbfe",
  "\uACBD\uAE30\uB3C4": "#e0f2fe",
  "\uAC15\uC6D0\uB3C4": "#dcfce7",
  "\uAC15\uC6D0\uD2B9\uBCC4\uC790\uCE58\uB3C4": "#dcfce7",
  "\uCDA9\uCCAD\uBD81\uB3C4": "#fef9c3",
  "\uCDA9\uCCAD\uB0A8\uB3C4": "#fef08a",
  "\uB300\uC804\uAD11\uC5ED\uC2DC": "#fde68a",
  "\uC138\uC885\uD2B9\uBCC4\uC790\uCE58\uC2DC": "#fcd34d",
  "\uC804\uB77C\uBD81\uB3C4": "#fed7aa",
  "\uC804\uBD81\uD2B9\uBCC4\uC790\uCE58\uB3C4": "#fed7aa",
  "\uC804\uB77C\uB0A8\uB3C4": "#fdba74",
  "\uAD11\uC8FC\uAD11\uC5ED\uC2DC": "#fb923c",
  "\uACBD\uC0C1\uBD81\uB3C4": "#e9d5ff",
  "\uB300\uAD6C\uAD11\uC5ED\uC2DC": "#d8b4fe",
  "\uACBD\uC0C1\uB0A8\uB3C4": "#c4b5fd",
  "\uC6B8\uC0B0\uAD11\uC5ED\uC2DC": "#a78bfa",
  "\uBD80\uC0B0\uAD11\uC5ED\uC2DC": "#818cf8",
  "\uC81C\uC8FC\uD2B9\uBCC4\uC790\uCE58\uB3C4": "#fbcfe8",
};

const PROVINCE_STROKE: Record<string, string> = {
  "\uC11C\uC6B8\uD2B9\uBCC4\uC2DC": "#93c5fd",
  "\uC778\uCC9C\uAD11\uC5ED\uC2DC": "#93c5fd",
  "\uACBD\uAE30\uB3C4": "#7dd3fc",
  "\uAC15\uC6D0\uB3C4": "#86efac",
  "\uAC15\uC6D0\uD2B9\uBCC4\uC790\uCE58\uB3C4": "#86efac",
  "\uCDA9\uCCAD\uBD81\uB3C4": "#fde047",
  "\uCDA9\uCCAD\uB0A8\uB3C4": "#facc15",
  "\uB300\uC804\uAD11\uC5ED\uC2DC": "#f59e0b",
  "\uC138\uC885\uD2B9\uBCC4\uC790\uCE58\uC2DC": "#d97706",
  "\uC804\uB77C\uBD81\uB3C4": "#fb923c",
  "\uC804\uBD81\uD2B9\uBCC4\uC790\uCE58\uB3C4": "#fb923c",
  "\uC804\uB77C\uB0A8\uB3C4": "#f97316",
  "\uAD11\uC8FC\uAD11\uC5ED\uC2DC": "#ea580c",
  "\uACBD\uC0C1\uBD81\uB3C4": "#c084fc",
  "\uB300\uAD6C\uAD11\uC5ED\uC2DC": "#a855f7",
  "\uACBD\uC0C1\uB0A8\uB3C4": "#9333ea",
  "\uC6B8\uC0B0\uAD11\uC5ED\uC2DC": "#7c3aed",
  "\uBD80\uC0B0\uAD11\uC5ED\uC2DC": "#6d28d9",
  "\uC81C\uC8FC\uD2B9\uBCC4\uC790\uCE58\uB3C4": "#f472b6",
};

function getProvinceName(props: Record<string, unknown>): string {
  return (
    (props.name as string) ??
    (props.NAME as string) ??
    (props.name_kor as string) ??
    ""
  );
}

function BangulPin({
  color,
  selected,
}: {
  color: string;
  selected: boolean;
}) {
  const size = selected ? 36 : 26;
  const offset = selected ? -18 : -13;
  const padding = selected ? 4 : 3;
  const imgSize = size - padding * 2;

  return (
    <g transform={`translate(${offset}, ${offset})`} style={{ cursor: "pointer" }}>
      {/* 선택 시 그림자 효과 */}
      {selected && (
        <circle cx={size / 2} cy={size / 2} r={size / 2 + 3} fill={color} opacity="0.25" />
      )}
      {/* 바깥 링 (운영 현황 색상 표시) */}
      <circle
        cx={size / 2}
        cy={size / 2}
        r={size / 2 - 1.5}
        fill="white"
        stroke={color}
        strokeWidth={selected ? 3.5 : 2.5}
        className="transition-all duration-200"
      />
      {/* 캐릭터 사진 (public/character.png) */}
      <image
        href="/character.png"
        x={padding}
        y={padding}
        width={imgSize}
        height={imgSize}
        preserveAspectRatio="xMidYMid meet"
        onError={(e) => {
          // 이미지 미존재 시 기본 아이콘 표출
          (e.currentTarget as SVGElement).style.display = "none";
        }}
      />
    </g>
  );
}

type KoreaMapProps = {
  /** 시·도·검색·테마 필터와 맞추려면 상위에서 걸러 넘깁니다. 없으면 전체 시설 */
  centers?: readonly WaterCenter[];
};

export function KoreaMap({ centers: centersProp }: KoreaMapProps = {}) {
  const mapCenters = centersProp ?? waterCenters;
  const todaySeoul = useMemo(() => getSeoulWeekdayHan(), []);
  const [selected, setSelected] = useState<WaterCenter | null>(null);

  useEffect(() => {
    setSelected((prev) =>
      prev && mapCenters.some((c) => c.id === prev.id) ? prev : null,
    );
  }, [mapCenters]);

  return (
    <div className="flex flex-col gap-4 lg:flex-row lg:items-start">
      <div className="min-w-0 flex-1 overflow-hidden rounded-2xl shadow-lg">
        <ComposableMap
          projection="geoMercator"
          projectionConfig={{ center: [127.7, 36.2], scale: 5000 }}
          style={{ width: "100%", height: "auto", display: "block" }}
          viewBox="0 0 800 740"
        >
          <defs>
            <linearGradient id="seaGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#dbeafe" />
              <stop offset="60%" stopColor="#bfdbfe" />
              <stop offset="100%" stopColor="#93c5fd" />
            </linearGradient>
          </defs>

          <rect width="800" height="740" fill="url(#seaGrad)" />

          <Geographies geography={PROVINCES_URL}>
            {({ geographies }) =>
              geographies.map((geo) => {
                const name = getProvinceName(
                  geo.properties as Record<string, unknown>,
                );
                const fill = PROVINCE_FILL[name] ?? "#f0f9ff";
                const stroke = PROVINCE_STROKE[name] ?? "#bae6fd";
                return (
                  <Geography
                    key={(geo as { rsmKey: string }).rsmKey}
                    geography={geo}
                    fill={fill}
                    stroke={stroke}
                    strokeWidth={0.7}
                    style={{ outline: "none" }}
                  />
                );
              })
            }
          </Geographies>

          {mapCenters.map((center) => {
            const display = resolveDisplayStatus(center, todaySeoul);
            const isSelected = selected?.id === center.id;
            return (
              <Marker
                key={center.id}
                coordinates={center.coordinates as [number, number]}
                onClick={() => setSelected(isSelected ? null : center)}
              >
                <BangulPin color={PIN_COLORS[display]} selected={isSelected} />
              </Marker>
            );
          })}
        </ComposableMap>

        <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 border-t border-sky-200/60 bg-white px-4 py-2.5">
          <span className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
            {koreaMapUi.legendOperating}
          </span>
          {LEGEND_ITEMS.map(([label, color]) => (
            <span key={label} className="flex items-center gap-1.5">
              <span
                className="relative inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-white ring-2 p-0.5"
                style={{ boxShadow: `0 0 0 1.5px ${color}` }}
              >
                <img src="/character.png" alt="" className="h-full w-full object-contain" />
              </span>
              <span className="text-xs text-slate-700">{label}</span>
            </span>
          ))}

          <span className="ml-auto flex flex-wrap items-center gap-x-3 gap-y-1">
            <span className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
              {koreaMapUi.legendRegions}
            </span>
            {koreaMapUi.regionLabels.map(({ label, color }) => (
              <span key={label} className="flex items-center gap-1">
                <span className="inline-block h-3 w-3 rounded-sm border border-white/60 ring-1 ring-slate-300/40" style={{ backgroundColor: color }} />
                <span className="text-[11px] text-slate-600">{label}</span>
              </span>
            ))}
          </span>
        </div>
      </div>

      <div className="lg:w-[360px] lg:shrink-0">
        {selected ? (
          <CenterPanel
            center={selected}
            display={resolveDisplayStatus(selected, todaySeoul)}
            onClose={() => setSelected(null)}
          />
        ) : (
          <EmptyPanel />
        )}
      </div>
    </div>
  );
}

function EmptyPanel() {
  return (
    <div className="flex min-h-[280px] items-center justify-center rounded-2xl border border-dashed border-sky-200 bg-gradient-to-b from-sky-50/60 to-white lg:min-h-[540px]">
      <div className="space-y-4 p-8 text-center">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-white p-3 shadow-md ring-4 ring-sky-300/80">
          <img src="/character.png" alt="방울이 캐릭터" className="h-full w-full object-contain" />
        </div>
        <div>
          <p className="font-bold text-slate-800">
            {koreaMapUi.emptyTitle}
          </p>
          <p className="mt-1 text-sm text-slate-500">
            {koreaMapUi.emptyBodyLine1}
            <br />
            {koreaMapUi.emptyBodyLine2}
          </p>
        </div>
      </div>
    </div>
  );
}

function CenterPanel({
  center,
  display,
  onClose,
}: {
  center: WaterCenter;
  display: DisplayStatus;
  onClose: () => void;
}) {
  const mapHref = naverMapSearchHref(center);

  return (
    <article className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-lg">
      <div className="flex items-start justify-between gap-3 border-b border-slate-100 bg-sky-50/70 px-4 py-4">
        <div className="min-w-0">
          <p className="text-[11px] font-medium text-sky-700">{center.kind}</p>
          <div className="mt-1 flex flex-wrap gap-1">
            {center.themes.map((t) => (
              <span
                key={t}
                className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-bold ring-1 ring-inset ${centerThemeBadgeClass[t]}`}
              >
                {t}
              </span>
            ))}
          </div>
          <h3 className="mt-0.5 text-base font-bold leading-snug text-slate-900">{center.name}</h3>
          <p className="mt-0.5 text-xs font-medium text-slate-600">
            {formatCenterRegionLine(center)}
          </p>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label={koreaMapUi.panelClose}
          className="shrink-0 flex h-7 w-7 items-center justify-center rounded-full bg-slate-200 text-base leading-none text-slate-600 hover:bg-slate-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500"
        >
          <span aria-hidden>×</span>
        </button>
      </div>
      <div className="space-y-3 p-4">
        <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset ${displayStatusStyles[display].badge}`}>
          {display}
        </span>
        <p className="line-clamp-3 text-sm leading-relaxed text-slate-600">{center.summary}</p>
        <div>
          <p className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-slate-500">
            {koreaMapUi.facilitySummary}
          </p>
          <ul className="flex flex-wrap gap-1.5">
            {center.facilityProfile.slice(0, 3).map((item) => (
              <li key={item.label} className="rounded-lg bg-sky-50 px-2 py-1 text-xs text-sky-950 ring-1 ring-sky-100">
                <span className="font-medium text-sky-800">{item.label}</span>
                <span className="text-sky-900/80">{" \u00B7 "}{item.value}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-xl bg-slate-50 px-3 py-2.5 text-xs text-slate-700">
          <p>
            <span className="font-medium text-slate-900">{koreaMapUi.address}</span>{" "}
            <span className="break-all text-slate-600">{center.address}</span>
          </p>
          <p className="mt-1">
            <span className="font-medium text-slate-900">{koreaMapUi.weeklyOff}</span>{" "}
            {formatWeeklyClosureSentence(center.weeklyClosedDays)}
          </p>
        </div>
        <div className="flex gap-2 pt-0.5">
          <Link
            href={`/centers/${center.id}`}
            className="flex flex-1 items-center justify-center gap-1 rounded-xl border border-slate-200 py-2.5 text-sm font-semibold text-slate-800 hover:border-sky-400 hover:text-sky-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500"
          >
            {koreaMapUi.detail}
          </Link>
          <a
            href={mapHref}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-1 items-center justify-center gap-1 rounded-xl bg-sky-600 py-2.5 text-sm font-semibold text-white hover:bg-sky-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500"
          >
            {koreaMapUi.openMap}
          </a>
        </div>
      </div>
    </article>
  );
}
