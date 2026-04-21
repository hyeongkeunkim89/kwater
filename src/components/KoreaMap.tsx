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
  ["\uC6B4\uC601\uC911"]: "#0ea5e9",
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
  if (selected) {
    return (
      <g transform="translate(-17, -42)" style={{ cursor: "pointer" }}>
        <ellipse cx="17" cy="42" rx="10" ry="5" fill={color} opacity="0.22" />
        <path
          d="M17 2 C8 2, 1.5 9, 1.5 17 C1.5 25, 7.5 31.5, 13 37.5 L17 42 L21 37.5 C26.5 31.5, 32.5 25, 32.5 17 C32.5 9, 26 2, 17 2 Z"
          fill={color}
          stroke="white"
          strokeWidth="2"
          strokeLinejoin="round"
        />
        <ellipse cx="22" cy="10" rx="5" ry="3" fill="white" opacity="0.28" transform="rotate(-30, 22, 10)" />
        <circle cx="12" cy="17" r="3.2" fill="white" />
        <circle cx="13" cy="17.8" r="1.6" fill="#0f172a" />
        <circle cx="12.3" cy="17" r="0.6" fill="white" opacity="0.8" />
        <circle cx="22" cy="17" r="3.2" fill="white" />
        <circle cx="23" cy="17.8" r="1.6" fill="#0f172a" />
        <circle cx="22.3" cy="17" r="0.6" fill="white" opacity="0.8" />
        <path d="M12 23 Q17 27.5 22 23" stroke="white" strokeWidth="2" fill="none" strokeLinecap="round" />
      </g>
    );
  }
  return (
    <g transform="translate(-11, -28)" style={{ cursor: "pointer" }}>
      <path
        d="M11 1.5 C5.5 1.5, 1 7, 1 12.5 C1 18.5, 5 23.5, 8.5 26 L11 28 L13.5 26 C17 23.5, 21 18.5, 21 12.5 C21 7, 16.5 1.5, 11 1.5 Z"
        fill={color}
        stroke="white"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <ellipse cx="14.5" cy="7" rx="3.2" ry="2" fill="white" opacity="0.3" transform="rotate(-30, 14.5, 7)" />
      <circle cx="7.5" cy="13" r="2" fill="white" />
      <circle cx="8.2" cy="13.6" r="1" fill="#0f172a" />
      <circle cx="7.8" cy="12.9" r="0.4" fill="white" opacity="0.8" />
      <circle cx="14.5" cy="13" r="2" fill="white" />
      <circle cx="15.2" cy="13.6" r="1" fill="#0f172a" />
      <circle cx="14.8" cy="12.9" r="0.4" fill="white" opacity="0.8" />
      <path d="M7.5 17 Q11 20 14.5 17" stroke="white" strokeWidth="1.2" fill="none" strokeLinecap="round" />
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
              <svg width="12" height="16" viewBox="0 0 22 28" fill="none" aria-hidden="true">
                <path
                  d="M11 1.5 C5.5 1.5, 1 7, 1 12.5 C1 18.5, 5 23.5, 8.5 26 L11 28 L13.5 26 C17 23.5, 21 18.5, 21 12.5 C21 7, 16.5 1.5, 11 1.5 Z"
                  fill={color} stroke="white" strokeWidth="1"
                />
                <circle cx="7.5" cy="12" r="1.8" fill="white" />
                <circle cx="14.5" cy="12" r="1.8" fill="white" />
                <path d="M7.5 16.5 Q11 19 14.5 16.5" stroke="white" strokeWidth="1.1" fill="none" strokeLinecap="round" />
              </svg>
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
        <svg width="56" height="72" viewBox="0 0 22 28" fill="none" aria-hidden="true" className="mx-auto">
          <path d="M11 1.5 C5.5 1.5, 1 7, 1 12.5 C1 18.5, 5 23.5, 8.5 26 L11 28 L13.5 26 C17 23.5, 21 18.5, 21 12.5 C21 7, 16.5 1.5, 11 1.5 Z" fill="#0ea5e9" stroke="#7dd3fc" strokeWidth="0.5" />
          <ellipse cx="14.5" cy="7" rx="3.2" ry="2" fill="white" opacity="0.3" transform="rotate(-30, 14.5, 7)" />
          <circle cx="7.5" cy="13" r="2" fill="white" />
          <circle cx="8.2" cy="13.6" r="1" fill="#0f172a" />
          <circle cx="7.8" cy="12.9" r="0.4" fill="white" opacity="0.8" />
          <circle cx="14.5" cy="13" r="2" fill="white" />
          <circle cx="15.2" cy="13.6" r="1" fill="#0f172a" />
          <circle cx="14.8" cy="12.9" r="0.4" fill="white" opacity="0.8" />
          <path d="M7.5 17 Q11 20 14.5 17" stroke="white" strokeWidth="1.2" fill="none" strokeLinecap="round" />
        </svg>
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
