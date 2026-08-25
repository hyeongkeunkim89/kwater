"use client";

import Link from "next/link";
import Image from "next/image";
import dynamic from "next/dynamic";
import { memo, useEffect, useMemo, useState, type ReactNode } from "react";
import type { CenterTheme, WaterCenter, WeekdayHan } from "@/data/centers";
import {
  CENTER_THEME_ORDER,
  formatWeeklyClosureSentence,
  sidoList,
  waterCenters,
} from "@/data/centers";
import {
  displayStatusStyles,
  formatCenterRegionLine,
  getSeoulWeekdayHan,
  resolveDisplayStatus,
} from "@/lib/center-display";
import {
  centerExplorerUi,
  centerThemeBadgeClass,
  centerThemeSectionAccent,
  emptyDisplayStatusCounts,
  HYDRATION_WEEKDAY_PLACEHOLDER,
  STATS_ORDER,
} from "@/lib/centerExplorerUi";
import { naverMapSearchHref } from "@/lib/mapLinks";

const KoreaMap = dynamic(
  () => import("@/components/KoreaMap").then((m) => m.KoreaMap),
  {
    ssr: false,
    loading: () => (
      <div className="flex min-h-[520px] items-center justify-center rounded-2xl border border-slate-200 bg-slate-50">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-sky-500 border-t-transparent" />
          <p className="text-sm text-slate-400">{centerExplorerUi.mapLoading}</p>
        </div>
      </div>
    ),
  },
);

type TabView = "map" | "list";

type ThemeFilter = "전체" | CenterTheme;

export function CenterExplorer() {
  const [view, setView] = useState<TabView>("map");
  const [sido, setSido] = useState<string>(centerExplorerUi.allSido);
  const [themeFilter, setThemeFilter] = useState<ThemeFilter>("전체");
  const [query, setQuery] = useState<string>("");

  const [todaySeoul, setTodaySeoul] = useState<WeekdayHan>(HYDRATION_WEEKDAY_PLACEHOLDER);
  useEffect(() => {
    const t = window.setTimeout(() => {
      setTodaySeoul(getSeoulWeekdayHan());
    }, 0);
    return () => clearTimeout(t);
  }, []);

  const baseFiltered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return waterCenters.filter((c) => {
      const matchSido = sido === centerExplorerUi.allSido || c.sido === sido;
      const mapQ = c.mapSearchQuery?.toLowerCase() ?? "";
      const matchTheme =
        themeFilter === "전체" || c.themes[0] === themeFilter;
      const matchQuery =
        q === "" ||
        c.name.toLowerCase().includes(q) ||
        c.sigungu.toLowerCase().includes(q) ||
        c.sido.toLowerCase().includes(q) ||
        c.address.toLowerCase().includes(q) ||
        mapQ.includes(q) ||
        c.themes.some((t) => t.toLowerCase().includes(q));
      return matchSido && matchQuery && matchTheme;
    });
  }, [sido, query, themeFilter]);

  const listSections = useMemo(() => {
    if (themeFilter !== "전체") return null;
    return CENTER_THEME_ORDER.map((themeKey) => ({
      theme: themeKey,
      centers: baseFiltered.filter((c) => c.themes[0] === themeKey),
    })).filter((s) => s.centers.length > 0);
  }, [baseFiltered, themeFilter]);

  const stats = useMemo(
    () => countByResolvedStatus(waterCenters, todaySeoul),
    [todaySeoul],
  );

  return (
    <div className="space-y-6">
      <div
        role="tablist"
        aria-label="문화관 보기 방식"
        className="relative inline-flex w-full max-w-md rounded-2xl border border-slate-200/90 bg-gradient-to-b from-slate-50 via-white to-slate-100/90 p-1 shadow-[inset_0_1px_0_rgba(255,255,255,0.85),0_1px_2px_rgba(15,23,42,0.04)] sm:w-auto sm:max-w-none"
      >
        <TabBtn
          active={view === "map"}
          onClick={() => setView("map")}
          mode="map"
          label={centerExplorerUi.mapTab}
        />
        <TabBtn
          active={view === "list"}
          onClick={() => setView("list")}
          mode="list"
          label={centerExplorerUi.listTab}
        />
      </div>

      {view === "map" && <KoreaMap centers={baseFiltered} />}

      {view === "list" && (
        <div className="space-y-8">
          <div className="relative">
            <span className="pointer-events-none absolute inset-y-0 left-4 flex items-center text-slate-400">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
                <path fillRule="evenodd" d="M9 3.5a5.5 5.5 0 1 0 0 11 5.5 5.5 0 0 0 0-11ZM2 9a7 7 0 1 1 12.452 4.391l3.328 3.329a.75.75 0 1 1-1.06 1.06l-3.329-3.328A7 7 0 0 1 2 9Z" clipRule="evenodd" />
              </svg>
            </span>
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={centerExplorerUi.searchPlaceholder}
              aria-label={centerExplorerUi.searchPlaceholder}
              autoComplete="off"
              className="w-full rounded-2xl border border-slate-200 bg-white py-3.5 pl-11 pr-10 text-sm text-slate-900 placeholder:text-slate-400 outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-400/20 transition"
            />
            {query && (
              <button
                onClick={() => setQuery("")}
                className="absolute inset-y-0 right-3 flex items-center px-1 text-slate-400 hover:text-slate-700 transition"
                aria-label={centerExplorerUi.clearSearch}
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
                  <path d="M6.28 5.22a.75.75 0 0 0-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 1 0 1.06 1.06L10 11.06l3.72 3.72a.75.75 0 1 0 1.06-1.06L11.06 10l3.72-3.72a.75.75 0 0 0-1.06-1.06L10 8.94 6.28 5.22Z" />
                </svg>
              </button>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-4 rounded-2xl border border-slate-200 bg-white px-5 py-4">
            <div className="flex items-center gap-2">
              <label className="text-xs font-bold uppercase tracking-widest text-slate-400">
                {centerExplorerUi.sidoLabel}
              </label>
              <select
                value={sido}
                onChange={(e) => setSido(e.target.value)}
                className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-medium text-slate-900 outline-none focus:ring-2 focus:ring-sky-400/40"
              >
                <option value={centerExplorerUi.allSido}>{centerExplorerUi.allSido}</option>
                {sidoList.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>

            <div className="h-5 w-px bg-slate-200 hidden sm:block" />

            {STATS_ORDER.map((k) => (
              <div key={k} className="flex items-center gap-2">
                <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ring-inset ${displayStatusStyles[k].badge}`}>
                  {k}
                </span>
                <span className="text-sm font-bold tabular-nums text-slate-900">
                  {stats[k]}
                </span>
              </div>
            ))}

            <span className="ml-auto text-xs text-slate-400">
              {centerExplorerUi.statsSuffix(baseFiltered.length, waterCenters.length, todaySeoul)}
            </span>
          </div>

          <div className="flex flex-col gap-2 rounded-2xl border border-slate-200 bg-white px-5 py-4">
            <span className="text-xs font-bold uppercase tracking-widest text-slate-400">
              {centerExplorerUi.themeLabel}
            </span>
            <div className="flex flex-wrap gap-2" role="group" aria-label={centerExplorerUi.themeLabel}>
              <ThemeChip
                active={themeFilter === "전체"}
                onClick={() => setThemeFilter("전체")}
              >
                {centerExplorerUi.themeFilterAll}
              </ThemeChip>
              {CENTER_THEME_ORDER.map((t) => (
                <ThemeChip
                  key={t}
                  active={themeFilter === t}
                  onClick={() => setThemeFilter(t)}
                >
                  {t}
                </ThemeChip>
              ))}
            </div>
          </div>

          {themeFilter === "전체" && listSections ? (
            <div className="space-y-12">
              {listSections.map(({ theme, centers }) => (
                <section
                  key={theme}
                  aria-labelledby={`theme-heading-${theme}`}
                  className={`space-y-4 pl-4 sm:pl-5 ${centerThemeSectionAccent[theme]}`}
                >
                  <div className="flex flex-wrap items-end justify-between gap-2">
                    <h2
                      id={`theme-heading-${theme}`}
                      className="text-xl font-black tracking-tight text-slate-900"
                    >
                      {theme}
                    </h2>
                    <span className="text-xs font-medium text-slate-500">
                      {centers.length}곳
                    </span>
                  </div>
                  <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                    {centers.map((c) => (
                      <li key={c.id}>
                        <CenterCard center={c} todaySeoul={todaySeoul} />
                      </li>
                    ))}
                  </ul>
                </section>
              ))}
            </div>
          ) : (
            <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {baseFiltered.map((c) => (
                <li key={c.id}>
                  <CenterCard center={c} todaySeoul={todaySeoul} />
                </li>
              ))}
            </ul>
          )}

          {baseFiltered.length === 0 && (
            <div className="rounded-2xl border border-dashed border-slate-300 py-16 text-center space-y-2">
              <p className="text-2xl" aria-hidden>
                {"\uD83D\uDD0D"}
              </p>
              <p className="text-sm font-semibold text-slate-500">
                {query
                  ? centerExplorerUi.emptyWithQuery(query)
                  : centerExplorerUi.emptyNoQuery}
              </p>
              {query && (
                <button
                  onClick={() => setQuery("")}
                  className="mt-1 text-xs text-sky-600 underline underline-offset-2 hover:text-sky-800"
                >
                  {centerExplorerUi.resetSearch}
                </button>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function ThemeChip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={[
        "rounded-full px-3 py-1.5 text-xs font-semibold transition focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2",
        active
          ? "bg-sky-600 text-white shadow-sm shadow-sky-600/25"
          : "bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900",
      ].join(" ")}
    >
      {children}
    </button>
  );
}

function TabIcon({ mode, className }: { mode: "list" | "map"; className?: string }) {
  const cn = ["shrink-0", className].filter(Boolean).join(" ");
  if (mode === "list") {
    return (
      <svg viewBox="0 0 24 24" fill="none" className={cn} aria-hidden>
        <rect x="3.5" y="4.5" width="7.5" height="5.5" rx="1.25" stroke="currentColor" strokeWidth="1.5" />
        <rect x="13" y="4.5" width="7.5" height="5.5" rx="1.25" stroke="currentColor" strokeWidth="1.5" />
        <rect x="3.5" y="14" width="7.5" height="5.5" rx="1.25" stroke="currentColor" strokeWidth="1.5" />
        <rect x="13" y="14" width="7.5" height="5.5" rx="1.25" stroke="currentColor" strokeWidth="1.5" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" fill="none" className={cn} aria-hidden>
      <path
        d="M4 7.5 9 5l6 2.5 5-2.5v11l-5 2.5-6-2.5-5 2.5V7.5Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
        className="opacity-90"
      />
      <path
        d="M9 5v11l6 2.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        className="opacity-55"
      />
      <circle cx="12" cy="10" r="1.75" fill="currentColor" className="opacity-95" />
    </svg>
  );
}

function TabBtn({
  active,
  onClick,
  mode,
  label,
}: {
  active: boolean;
  onClick: () => void;
  mode: "list" | "map";
  label: string;
}) {
  const isMap = mode === "map";
  return (
    <button
      type="button"
      role="tab"
      aria-selected={active}
      onClick={onClick}
      className={[
        "relative flex min-h-[44px] flex-1 items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold tracking-tight transition-all duration-200 sm:flex-initial sm:min-w-[148px] sm:px-5",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2 focus-visible:ring-offset-white",
        active
          ? [
              "bg-white text-slate-900",
              "shadow-[0_10px_28px_-12px_rgba(14,165,233,0.35),0_2px_8px_-4px_rgba(15,23,42,0.08)]",
              isMap
                ? "ring-1 ring-sky-200/80"
                : "ring-1 ring-slate-200/90",
            ].join(" ")
          : "text-slate-500 hover:bg-white/40 hover:text-slate-800",
      ].join(" ")}
    >
      <TabIcon
        mode={mode}
        className={[
          "h-[18px] w-[18px] transition-colors",
          active ? (isMap ? "text-sky-600" : "text-slate-700") : "text-slate-400",
        ].join(" ")}
      />
      <span className="whitespace-nowrap">{label}</span>
    </button>
  );
}

export const CenterCard = memo(function CenterCard({
  center: c,
  todaySeoul,
}: {
  center: WaterCenter;
  todaySeoul: WeekdayHan;
}) {
  const display = resolveDisplayStatus(c, todaySeoul);
  const detailHref = `/centers/${c.id}`;
  const reserveHref = `/reserve?center=${c.id}`;
  const naverHref = naverMapSearchHref(c);

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white transition-all duration-300 hover:-translate-y-1 hover:border-sky-300 hover:shadow-xl shadow-sm">
      {/* 상단 대표 사진 이미지 커버 배너 */}
      <Link href={detailHref} className="relative h-48 w-full overflow-hidden bg-slate-100 block shrink-0">
        <Image
          src={c.imageSrc}
          alt={c.imageAlt || c.name}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          quality={85}
          className="object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />

        {/* 상단 뱃지 묶음 */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-1.5 z-10">
          <div className="flex flex-wrap gap-1.5">
            <span className="rounded-full bg-slate-900/80 backdrop-blur-md px-2.5 py-1 text-[10px] font-bold text-white shadow-sm">
              {c.kind}
            </span>
            <span className="rounded-full bg-sky-500/90 backdrop-blur-md px-2.5 py-1 text-[10px] font-bold text-white shadow-sm">
              {c.sido} · {c.sigungu}
            </span>
          </div>

          <span className={`inline-flex rounded-full px-2.5 py-1 text-[10px] font-bold backdrop-blur-md ring-1 ring-inset ${displayStatusStyles[display].badge}`}>
            {display}
          </span>
        </div>

        {/* 하단 타이틀 Overlay */}
        <div className="absolute bottom-3 left-3 right-3 text-white z-10">
          <h3 className="text-lg font-black leading-tight drop-shadow-md text-white">
            {c.name}
          </h3>
          <p className="text-[11px] font-medium text-slate-200 drop-shadow-sm mt-0.5">
            {formatCenterRegionLine(c)}
          </p>
        </div>
      </Link>

      {/* 본문 영역 */}
      <div className="flex flex-1 flex-col gap-3 p-4">
        <p className="line-clamp-2 text-xs sm:text-sm leading-relaxed text-slate-600 font-medium">
          {c.summary}
        </p>

        {/* 🏛️ 층별 주요 공간 (Floor Guide) */}
        {c.floors && c.floors.length > 0 && (
          <div className="rounded-xl bg-slate-50 border border-slate-100 p-2.5 text-xs space-y-1.5">
            <span className="text-[10px] font-bold text-sky-700 uppercase tracking-wide block">
              🏛️ 층별 주요 공간
            </span>
            <div className="space-y-1">
              {c.floors.slice(0, 3).map((f) => (
                <div key={f.floorLabel} className="flex items-baseline gap-2">
                  <span className="shrink-0 font-bold text-slate-800 text-[10px] bg-white px-1.5 py-0.5 rounded border border-slate-200">
                    {f.floorLabel}
                  </span>
                  <span className="text-slate-600 truncate text-[11px] font-medium">
                    {f.highlights.join(", ")}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 위치 및 주일 휴무 정보 */}
        <div className="grid grid-cols-[auto_minmax(0,1fr)] items-start gap-x-1.5 gap-y-1 rounded-xl bg-slate-50 p-2.5 text-xs text-slate-600 mt-auto">
          <span className="shrink-0 font-bold text-slate-800 leading-snug">
            {centerExplorerUi.location}
          </span>
          <a
            href={naverHref}
            target="_blank"
            rel="noopener noreferrer"
            title="네이버지도에서 해당 위치 보기 (새 창)"
            className="min-w-0 leading-snug font-bold text-sky-700 hover:text-sky-900 hover:underline hover:underline-offset-2 transition flex items-center gap-1 group/loc"
          >
            <span className="truncate">{c.address}</span>
            <span className="text-[10px] text-sky-500 group-hover/loc:translate-x-0.5 transition shrink-0">🗺️ ↗</span>
          </a>

          <span className="shrink-0 font-bold text-slate-800 leading-snug">
            {centerExplorerUi.weeklyClosed}
          </span>
          <span className="min-w-0 leading-snug font-semibold text-slate-700">
            {formatWeeklyClosureSentence(c.weeklyClosedDays)} (09:00~18:00)
          </span>
        </div>

        {/* 하단 버튼 묶음 */}
        <div className="flex gap-2 pt-1">
          <Link
            href={detailHref}
            className="flex flex-1 items-center justify-center gap-1 rounded-xl border border-slate-200 bg-white py-2.5 text-xs font-bold text-slate-800 transition hover:border-sky-400 hover:bg-sky-50 hover:text-sky-800 shadow-sm"
          >
            시설안내 →
          </Link>
          <Link
            href={reserveHref}
            className="flex flex-1 items-center justify-center gap-1 rounded-xl bg-sky-600 py-2.5 text-xs font-bold text-white transition hover:bg-sky-500 shadow-sm shadow-sky-600/20"
          >
            투어예약 📅
          </Link>
        </div>
      </div>
    </article>
  );
});

function countByResolvedStatus(list: WaterCenter[], today: WeekdayHan) {
  const init = emptyDisplayStatusCounts();
  for (const c of list) init[resolveDisplayStatus(c, today)] += 1;
  return init;
}
