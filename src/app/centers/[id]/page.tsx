import Link from "next/link";
import { notFound } from "next/navigation";
import fs from "fs";
import path from "path";
import { CenterDetailLiveStatus } from "@/components/CenterDetailLiveStatus";
import { CenterPhotoGallery } from "@/components/CenterPhotoGallery";
import { CenterSurroundingsGallery } from "@/components/CenterSurroundingsGallery";
import { FloorPhotoUpload } from "@/components/FloorPhotoUpload";
import {
  formatWeeklyClosureSentence,
  getCenterById,
  waterCenters,
} from "@/data/centers";
import { formatCenterRegionLine } from "@/lib/center-display";
import { centerThemeBadgeClass } from "@/lib/centerExplorerUi";
import { naverMapSearchHref } from "@/lib/mapLinks";
import { createClient } from "@/utils/supabase/server";
import { FloorGuideAccordion } from "@/components/FloorGuideAccordion";
import { FacilityTabs } from "@/components/FacilityTabs";
import type { CenterFloor, CenterFacility } from "@/types/database";

type Props = { params: Promise<{ id: string }> };

/** 빌드 타임에 `isWaterStoriesLive()`가 고정되면 층별 사진이 항상 디스크 업로드로 남아 Vercel에서 실패함 → 런타임 env 반영 */
export const dynamic = "force-dynamic";

export function generateStaticParams() {
  return waterCenters.map((c) => ({ id: c.id }));
}

export async function generateMetadata({ params }: Props) {
  const { id } = await params;
  const center = getCenterById(id);
  if (!center) return { title: "시설을 찾을 수 없습니다" };
  return {
    title: `${center.name} | 물문화관 안내`,
    description: center.summary,
  };
}

export default async function CenterDetailPage({ params }: Props) {
  const { id } = await params;
  const center = getCenterById(id);
  if (!center) notFound();

  let dbFloors: CenterFloor[] = [];
  let dbFacilities: CenterFacility[] = [];

  try {
    const supabase = await createClient();
    const [floorsRes, facilitiesRes] = await Promise.all([
      supabase
        .from("center_floors")
        .select("*")
        .eq("center_id", id)
        .order("sort_order", { ascending: true }),
      supabase
        .from("center_facilities")
        .select("*")
        .eq("center_id", id)
        .order("sort_order", { ascending: true }),
    ]);

    if (floorsRes.data) dbFloors = floorsRes.data;
    if (facilitiesRes.data) dbFacilities = facilitiesRes.data;
  } catch (err) {
    console.error("Supabase fetch error for center details:", err);
  }

  // 데이터가 없을 경우 정적 데이터를 기반으로 폴백
  const floors: CenterFloor[] = dbFloors && dbFloors.length > 0
    ? dbFloors
    : center.floors.map((f, i) => ({
        id: `static-floor-${i}`,
        center_id: id,
        floor_key: `${i + 1}F`,
        floor_name: f.floorLabel,
        floor_map_url: null,
        description: null,
        rooms: f.highlights.map(h => ({ name: h, link: null })),
        amenities: [],
        sort_order: i,
        created_at: "",
      }));

  // 로컬 이미지 스캔 후 각 층에 매핑
  const floorsWithPhotos: CenterFloor[] = floors.map((f) => {
    let internal_photos: string[] = [];
    try {
      const dirPath = path.join(process.cwd(), "public", "images", "floors", id, f.floor_key);
      if (fs.existsSync(dirPath)) {
        const files = fs.readdirSync(dirPath);
        internal_photos = files
          .filter((file) => /\.(png|jpe?g|webp|gif)$/i.test(file))
          .map((file) => `/images/floors/${id}/${f.floor_key}/${file}`);
      }
    } catch (e) {
      console.error("Failed to read local photos for floor:", e);
    }
    return {
      ...f,
      internal_photos,
    };
  });

  // 주변 경관 및 주차 시설 로컬 이미지 스캔
  let surroundingsPhotos: string[] = [];
  try {
    const surroundingsDir = path.join(process.cwd(), "public", "images", "surroundings", id);
    if (fs.existsSync(surroundingsDir)) {
      const files = fs.readdirSync(surroundingsDir);
      surroundingsPhotos = files
        .filter((file) => /\.(png|jpe?g|webp|gif)$/i.test(file))
        .map((file) => `/images/surroundings/${id}/${file}`);
    }
  } catch (e) {
    console.error("Failed to read surroundings photos:", e);
  }

  return (
    <div className="min-h-screen bg-white text-slate-900">

      {/* ── 헤더 (다크) ── */}
      <header className="sticky top-0 z-40 border-b border-white/10 bg-[#0b111e]/98">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-3 px-6 py-4 sm:px-10">
          <Link
            href="/status"
            className="flex items-center gap-2 text-sm font-medium text-white/60 transition hover:text-white"
          >
            <span aria-hidden>←</span> 문화관 목록
          </Link>
          <div className="flex items-center gap-3">
            <Link
              href={`/reserve?center=${center.id}`}
              className="rounded-full bg-sky-500 px-5 py-1.5 text-sm font-bold text-white shadow shadow-sky-500/30 transition hover:bg-sky-400"
            >
              투어 예약
            </Link>
            <a
              href="https://www.kwater.or.kr"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full border border-white/20 px-4 py-1.5 text-sm text-white/60 transition hover:border-white/50 hover:text-white"
            >
              K-water
            </a>
          </div>
        </div>
      </header>

      {/* ── 다크 타이틀 히어로 ── */}
      <div className="relative overflow-hidden bg-[#0b111e]">
        <div className="pointer-events-none absolute inset-0" aria-hidden>
          <div className="absolute left-0 top-0 h-64 w-64 rounded-full bg-sky-600/15 blur-[80px]" />
          <div className="absolute right-0 bottom-0 h-48 w-48 rounded-full bg-blue-700/10 blur-[60px]" />
        </div>
        <div className="relative mx-auto max-w-5xl px-6 py-14 sm:px-10 sm:py-20">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-bold uppercase tracking-widest text-sky-400">
                {center.kind}
              </p>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {center.themes.map((t) => (
                  <span
                    key={t}
                    className={`inline-flex rounded-full px-3 py-1 text-sm font-bold ring-1 ring-inset ring-white/25 ${centerThemeBadgeClass[t]}`}
                  >
                    {t}
                  </span>
                ))}
              </div>
              <h1 className="mt-3 text-3xl font-black leading-tight tracking-tight text-white sm:text-4xl lg:text-5xl">
                {center.name}
              </h1>
              <p className="mt-3 text-sm font-medium text-white/70">
                {formatCenterRegionLine(center)}
              </p>
            </div>
            <Link
              href={`/reserve?center=${center.id}`}
              className="shrink-0 inline-flex items-center gap-2 rounded-2xl bg-sky-500 px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-sky-500/30 transition hover:bg-sky-400"
            >
              <span>🗓</span> 가이드 투어 예약
            </Link>
          </div>
        </div>
      </div>

      <main className="mx-auto max-w-5xl px-6 py-12 sm:px-10">

        {center.visitorNotice && (
          <div
            className="mb-10 rounded-2xl border border-amber-200/80 bg-amber-50 px-5 py-4 sm:px-6 sm:py-5"
            role="status"
            aria-live="polite"
          >
            <p className="text-sm font-bold uppercase tracking-widest text-amber-800/90">
              방문 전 안내
            </p>
            <p className="mt-2 text-sm font-semibold leading-relaxed text-amber-950 sm:text-[15px]">
              {center.visitorNotice}
            </p>
          </div>
        )}

        {/* 요약 + 운영 상태 */}
        <div className="flex flex-col gap-6 border-b border-slate-100 pb-10 sm:flex-row sm:items-start sm:justify-between">
          <p className="max-w-2xl text-lg leading-relaxed text-slate-600">
            {center.summary}
          </p>
          <CenterDetailLiveStatus center={center} />
        </div>


        {/* 시설현황 */}
        <section className="mt-12" aria-labelledby="facility-profile">
          <div className="mb-6 flex items-center gap-4">
            <div className="h-px flex-1 bg-slate-100" />
            <h2
              id="facility-profile"
              className="text-sm font-bold uppercase tracking-widest text-slate-400"
            >
              Facility Profile
            </h2>
            <div className="h-px flex-1 bg-slate-100" />
          </div>
          <h2 className="mb-6 text-2xl font-black tracking-tight text-slate-900">
            시설현황
          </h2>
          <div className="mb-8 space-y-3.5 text-base leading-relaxed text-slate-600 sm:text-[17px]">
            {center.profileIntro
              .trim()
              .split(/\n\n+/)
              .filter(Boolean)
              .map((para, i) => (
                <p key={i} className="max-w-3xl">
                  {para.trim()}
                </p>
              ))}
          </div>
          <dl className="grid gap-4 sm:grid-cols-2">
            {center.facilityProfile.map((row) => (
              <div
                key={row.label}
                className="group rounded-2xl border border-slate-200 bg-white p-5 transition hover:border-sky-300 hover:shadow-md hover:shadow-sky-50"
              >
                <dt className="flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-sky-600">
                  <span className="h-1 w-4 rounded-full bg-sky-500" />
                  {row.label}
                </dt>
                <dd className="mt-3 text-sm leading-relaxed text-slate-700">
                  {row.value}
                </dd>
              </div>
            ))}
          </dl>
        </section>

        {/* 층별 주요 시설 */}
        <section className="mt-16" aria-labelledby="floors">
          <div className="mb-6 flex items-center gap-4">
            <div className="h-px flex-1 bg-slate-100" />
            <h2
              id="floors"
              className="text-sm font-bold uppercase tracking-widest text-slate-400"
            >
              Floor Guide
            </h2>
            <div className="h-px flex-1 bg-slate-100" />
          </div>
          <h2 className="mb-6 text-2xl font-black tracking-tight text-slate-900">
            층별 주요 시설
          </h2>
          <FloorGuideAccordion floors={floorsWithPhotos} />
        </section>

        {/* 부대 및 편의시설 (간송 스타일 탭) */}
        {dbFacilities && dbFacilities.length > 0 && (
          <section className="mt-16" aria-labelledby="facilities">
            <div className="mb-6 flex items-center gap-4">
              <div className="h-px flex-1 bg-slate-100" />
              <h2
                id="facilities"
                className="text-sm font-bold uppercase tracking-widest text-slate-400"
              >
                Facilities
              </h2>
              <div className="h-px flex-1 bg-slate-100" />
            </div>
            <h2 className="mb-6 text-2xl font-black tracking-tight text-slate-900">
              부대 · 편의시설
            </h2>
            <FacilityTabs facilities={dbFacilities} />
          </section>
        )}

        {/* 주변 경관 및 주차 시설 갤러리 */}
        <CenterSurroundingsGallery images={surroundingsPhotos} />

        {/* 방문·위치 */}
        <section
          className="mt-16 overflow-hidden rounded-2xl border border-slate-200 bg-white"
          aria-labelledby="visit-info"
        >
          <div className="border-b border-slate-100 bg-slate-50 px-6 py-4">
            <h2 id="visit-info" className="text-sm font-bold uppercase tracking-widest text-slate-500">
              방문 · 위치 안내
            </h2>
          </div>
          <div className="space-y-4 px-6 py-6 text-sm text-slate-700">
            <div className="flex gap-3">
              <span className="w-20 shrink-0 font-bold text-slate-900">위치</span>
              <span className="text-slate-600">{center.address}</span>
            </div>
            <div className="flex gap-3">
              <span className="w-20 shrink-0 font-bold text-slate-900">휴관일</span>
              <span className="text-slate-600">
                {formatWeeklyClosureSentence(center.weeklyClosedDays)}
              </span>
            </div>
            <div className="flex gap-3">
              <span className="w-20 shrink-0 font-bold text-slate-900">명절·기타</span>
              <span className="text-slate-600">{center.holidayClosureSummary}</span>
            </div>
            <p className="text-xs text-slate-400">{center.statusNote}</p>
          </div>
          <div className="flex flex-wrap gap-3 border-t border-slate-100 px-6 py-5">
            <a
              href={naverMapSearchHref(center)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-5 py-3 text-sm font-bold text-slate-700 transition hover:border-slate-400"
            >
              지도에서 위치 열기
            </a>
            <Link
              href={`/reserve?center=${center.id}`}
              className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-6 py-3 text-sm font-bold text-white transition hover:bg-slate-700"
            >
              <span>🗓</span> 가이드 투어 예약하기
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}
