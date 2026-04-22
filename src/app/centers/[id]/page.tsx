import Link from "next/link";
import { notFound } from "next/navigation";
import { CenterDetailLiveStatus } from "@/components/CenterDetailLiveStatus";
import { CenterPhotoGallery } from "@/components/CenterPhotoGallery";
import { FloorPhotoUpload } from "@/components/FloorPhotoUpload";
import {
  formatWeeklyClosureSentence,
  getCenterById,
  waterCenters,
} from "@/data/centers";
import { formatCenterRegionLine } from "@/lib/center-display";
import { centerThemeBadgeClass } from "@/lib/centerExplorerUi";
import { naverMapSearchHref } from "@/lib/mapLinks";

type Props = { params: Promise<{ id: string }> };

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
              <p className="text-xs font-bold uppercase tracking-widest text-sky-400">
                {center.kind}
              </p>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {center.themes.map((t) => (
                  <span
                    key={t}
                    className={`inline-flex rounded-full px-2.5 py-0.5 text-[11px] font-bold ring-1 ring-inset ring-white/25 ${centerThemeBadgeClass[t]}`}
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
            <p className="text-xs font-bold uppercase tracking-widest text-amber-800/90">
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

        <aside className="mt-10 flex flex-col gap-3 rounded-2xl border border-slate-200 bg-slate-50/90 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6 sm:py-5">
          <p className="min-w-0 text-sm leading-relaxed text-slate-700">
            주변 산책로·전망 사진을 <strong className="text-slate-900">물 이야기</strong>에 올리면 다른
            방문객의 동선 참고에도 도움이 됩니다.
          </p>
          <Link
            href={`/mul-iyagi?center=${center.id}`}
            className="inline-flex min-h-11 shrink-0 items-center justify-center rounded-full border border-slate-300 bg-white px-5 py-2.5 text-sm font-bold text-slate-800 transition hover:border-sky-300 hover:text-sky-800"
          >
            이 거점으로 사진 올리기
          </Link>
        </aside>

        {/* 시설현황 */}
        <section className="mt-12" aria-labelledby="facility-profile">
          <div className="mb-6 flex items-center gap-4">
            <div className="h-px flex-1 bg-slate-100" />
            <h2
              id="facility-profile"
              className="text-xs font-bold uppercase tracking-widest text-slate-400"
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
                <dt className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-sky-600">
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
              className="text-xs font-bold uppercase tracking-widest text-slate-400"
            >
              Floor Guide
            </h2>
            <div className="h-px flex-1 bg-slate-100" />
          </div>
          <h2 className="mb-6 text-2xl font-black tracking-tight text-slate-900">
            층별 주요 시설
          </h2>
          <ol className="space-y-4">
            {center.floors.map((f, i) => (
              <li
                key={`${f.floorLabel}-${i}`}
                className="rounded-2xl border border-slate-200 bg-white p-5"
              >
                <div className="flex gap-4">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-900 text-xs font-black text-white">
                    {i + 1}F
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="text-sm font-bold text-slate-900">{f.floorLabel}</h3>
                    <ul className="mt-2 flex flex-wrap gap-2">
                      {f.highlights.map((h) => (
                        <li
                          key={h}
                          className="rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs text-slate-700"
                        >
                          {h}
                        </li>
                      ))}
                    </ul>
                    <FloorPhotoUpload
                      centerId={center.id}
                      floorKey={`floor-${i}`}
                      floorLabel={f.floorLabel}
                    />
                  </div>
                </div>
              </li>
            ))}
          </ol>
        </section>

        {/* 시설 사진 갤러리 */}
        <CenterPhotoGallery centerId={center.id} />

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

      {/* 푸터 */}
      <footer className="mt-16 border-t border-slate-100 bg-[#0b111e] py-10">
        <div className="mx-auto flex max-w-5xl flex-col gap-4 px-6 text-sm sm:flex-row sm:items-center sm:justify-between sm:px-10">
          <p className="text-white/40">
            © {new Date().getFullYear()} K-water 물문화관
          </p>
          <Link href="/" className="text-sky-400 transition hover:text-sky-300">
            ← 전체 문화관 보기
          </Link>
        </div>
      </footer>
    </div>
  );
}
