"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { Event } from "@/types/event";
import { CenterFilterSelect } from "@/components/CenterFilterSelect";
import { RecentWaterStories } from "@/components/RecentWaterStories";
import { EventWriteModal } from "@/components/EventWriteModal";

type Props = {
  filteredEvents: Event[];
  selectedEvent: Event | null;
  center: string;
  type: string;
  storiesLive: boolean;
};

// 외부/깨진 이미지 URL을 로컬 고화질 이미지 자산으로 안전하게 변환
function resolveEventImageUrl(url?: string): string | undefined {
  if (!url) return undefined;
  if (url.includes("wikimedia.org") && url.includes("SoyangDam")) {
    return "/images/cards/soyang_cherry_blossom_walk.jpg";
  }
  if (url.includes("wikimedia.org") && url.includes("Daecheong_Dam")) {
    return "/images/cards/children_drawing_contest.jpg";
  }
  if (url.includes("wikimedia.org") && url.includes("Chungju_Lake")) {
    return "/images/cards/daecheong_upcycling.jpg";
  }
  return url;
}

function EventCardItem({
  event,
  center,
  type,
  status,
  formatDate,
}: {
  event: Event;
  center: string;
  type: string;
  status: { label: string; style: string };
  formatDate: (d: string) => string;
}) {
  const [imgFailed, setImgFailed] = useState(false);
  const resolvedUrl = resolveEventImageUrl(event.imageUrl);

  return (
    <Link
      href={`/events?id=${event.id}&center=${center}&type=${type}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm hover:border-sky-400 hover:shadow-md transition duration-200"
    >
      {/* 포스터 배너 영역 */}
      <div className="relative h-44 w-full bg-slate-100 overflow-hidden shrink-0">
        <span
          className={[
            "absolute top-3 left-3 z-10 rounded border text-[10px] font-bold px-2 py-0.5 shadow-sm backdrop-blur-xs",
            status.style,
          ].join(" ")}
        >
          {status.label}
        </span>

        {resolvedUrl && !imgFailed ? (
          <img
            src={resolvedUrl}
            alt={event.title}
            onError={() => setImgFailed(true)}
            className="h-full w-full object-cover group-hover:scale-105 transition duration-300"
          />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-sky-400 via-sky-500 to-indigo-600 text-white p-4 text-center">
            <span className="text-3xl mb-1">🎈</span>
            <span className="text-xs font-bold text-white/90 tracking-wide">{event.centerName}</span>
          </div>
        )}
      </div>

      {/* 정보 영역 */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <span className="inline-block rounded bg-sky-50 text-[10px] font-bold text-sky-700 px-2 py-0.5">
            {event.centerName}
          </span>
          <h3 className="mt-2.5 text-base font-bold text-slate-900 group-hover:text-sky-600 line-clamp-2 leading-snug">
            {event.title}
          </h3>
          <p className="mt-1.5 text-xs text-slate-500 line-clamp-2 leading-relaxed font-semibold">
            {event.content}
          </p>
        </div>

        <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-slate-400 font-semibold">
          기간: {formatDate(event.startDate)} ~ {formatDate(event.endDate)}
        </div>
      </div>
    </Link>
  );
}

export function EventBoard({ filteredEvents, selectedEvent, center, type, storiesLive }: Props) {
  const [showWriteModal, setShowWriteModal] = useState(false);
  const router = useRouter();

  // Format date helper
  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, "0")}.${String(
      d.getDate()
    ).padStart(2, "0")}`;
  };

  // Helper to determine status: 진행중, 예정, 종료
  const getEventStatus = (start: string, end: string) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const startDate = new Date(start);
    startDate.setHours(0, 0, 0, 0);
    const endDate = new Date(end);
    endDate.setHours(23, 59, 59, 999);

    if (today >= startDate && today <= endDate) {
      return { label: "진행중", style: "bg-emerald-50 text-emerald-700 border-emerald-200" };
    } else if (today < startDate) {
      return { label: "진행예정", style: "bg-blue-50 text-blue-700 border-blue-200" };
    } else {
      return { label: "종료", style: "bg-slate-100 text-slate-500 border-slate-200" };
    }
  };

  const handleWriteSuccess = () => {
    router.refresh(); // refresh Server Component data
  };

  const selectedEventImageUrl = resolveEventImageUrl(selectedEvent?.imageUrl);

  return (
    <>
      {selectedEvent ? (
        /* ================= 상세 보기 화면 ================= */
        <div className="mx-auto max-w-3xl rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-10">
          <div className="border-b border-slate-100 pb-6">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-block rounded bg-sky-50 text-xs font-bold text-sky-700 px-2.5 py-1">
                {selectedEvent.centerName}
              </span>
              <span
                className={[
                  "inline-block rounded border text-xs font-bold px-2 py-0.5",
                  getEventStatus(selectedEvent.startDate, selectedEvent.endDate).style,
                ].join(" ")}
              >
                {getEventStatus(selectedEvent.startDate, selectedEvent.endDate).label}
              </span>
            </div>
            <h2 className="mt-4 text-2xl font-black tracking-tight text-slate-900 sm:text-3xl leading-snug">
              {selectedEvent.title}
            </h2>
            <p className="mt-3 text-sm text-slate-500 font-semibold">
              이벤트 기간: {formatDate(selectedEvent.startDate)} ~ {formatDate(selectedEvent.endDate)}
            </p>
          </div>

          {/* 포스터 이미지 */}
          {selectedEventImageUrl && (
            <div className="my-8 overflow-hidden rounded-xl border border-slate-100 bg-slate-50">
              <img
                src={selectedEventImageUrl}
                alt={selectedEvent.title}
                className="max-h-[500px] w-full object-contain mx-auto"
              />
            </div>
          )}

          {/* 본문 */}
          <div className="prose prose-slate max-w-none text-sm sm:text-base leading-relaxed text-slate-700 whitespace-pre-wrap py-4 font-medium">
            {selectedEvent.content}
          </div>

          <div className="mt-8 pt-8 border-t border-slate-100 text-center">
            <Link
              href={`/events?center=${center}&type=${type}`}
              className="inline-flex min-h-11 items-center justify-center rounded-xl bg-slate-900 hover:bg-slate-800 text-sm font-bold text-white px-6 transition"
            >
              목록으로 돌아가기
            </Link>
          </div>
        </div>
      ) : (
        /* ================= 목록 화면 (좌측: 이달의 물 이야기 사진전 / 우측: 체험 및 이벤트 목록) ================= */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* 1. 좌측 (lg:col-span-5): 대표 참여형 이벤트 - 이달의 물 이야기 사진전 */}
          <section aria-label="이달의 물 이야기 사진전" className="lg:col-span-5">
            <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 shadow-sm space-y-5">
              <div className="space-y-3 border-b border-slate-100 pb-5">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 text-[#004D95] border border-blue-100 text-[11px] font-black px-3 py-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#004D95]"></span>
                    K-WATER GALLERY
                  </span>
                  <span className="inline-flex rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[11px] font-bold px-2.5 py-0.5">
                    상시 참여 이벤트
                  </span>
                </div>
                <h2 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                  <svg className="w-5 h-5 text-[#004D95] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span>이달의 물 이야기 사진전</span>
                </h2>
                <p className="text-xs text-slate-600 leading-relaxed font-medium">
                  전국 15개 물문화관과 수변 산책로에서 포착한 특별한 순간을 공유해 보세요. 
                  매월 우수작을 선정하여 명예의 전당인 <strong className="font-bold text-[#004D95]">&apos;이달의 사진&apos;</strong> 등재 및 문화상품권을 드립니다.
                </p>
                <div className="flex flex-col sm:flex-row gap-2 pt-1">
                  <Link
                    href="/mul-iyagi"
                    className="flex-1 inline-flex min-h-10 items-center justify-center gap-1.5 rounded-xl bg-[#004D95] hover:bg-[#003870] text-xs font-bold text-white px-4 transition shadow-xs text-center"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    <span>사진 응모하기</span>
                  </Link>
                  <Link
                    href="/mul-iyagi"
                    className="flex-1 inline-flex min-h-10 items-center justify-center gap-1.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold px-4 transition text-center"
                  >
                    <svg className="w-3.5 h-3.5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span>전체 갤러리</span>
                  </Link>
                </div>
              </div>

              {/* 최근 응모작 실시간 썸네일 */}
              <RecentWaterStories storiesLive={storiesLive} />
            </div>
          </section>

          {/* 2. 우측 (lg:col-span-7): 기타 체험 및 이벤트 목록 */}
          <section aria-label="체험 및 이벤트 목록" className="lg:col-span-7 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-slate-200 pb-5">
              <div>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-3 py-1 text-xs font-black tracking-wider uppercase text-[#004D95]">
                  EXPERIENCE &amp; PROGRAMS
                </span>
                <h2 className="mt-2 text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                  현장 체험 및 이벤트 목록
                </h2>
                <p className="mt-1 text-xs sm:text-sm font-medium text-slate-500">
                  전국 물문화관에서 진행 중이거나 예정된 다채로운 문화·생태 프로그램입니다.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowWriteModal(true)}
                className="self-start sm:self-auto inline-flex min-h-10 items-center justify-center gap-1.5 rounded-xl bg-[#004D95] hover:bg-[#003870] text-xs sm:text-sm font-bold text-white px-4 transition shadow-sm whitespace-nowrap shrink-0"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                <span>새 이벤트 등록</span>
              </button>
            </div>

            {/* 필터 및 컨트롤 바 */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
              <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
                <span className="text-xs font-bold text-slate-500 shrink-0 mr-1">구분:</span>
                {[
                  { key: "all", label: "전체" },
                  { key: "hq", label: "본사 공통" },
                  { key: "centers", label: "개별 문화관" },
                ].map((t) => (
                  <Link
                    key={t.key}
                    href={`/events?type=${t.key}&center=${center}`}
                    className={[
                      "min-h-9 inline-flex items-center justify-center rounded-lg px-3 py-1.5 text-xs font-bold transition whitespace-nowrap",
                      type === t.key
                        ? "bg-[#004D95] text-white shadow-xs"
                        : "bg-slate-50 border border-slate-200 text-slate-600 hover:bg-slate-100",
                    ].join(" ")}
                  >
                    {t.label}
                  </Link>
                ))}
              </div>

              {type !== "hq" && (
                <div className="w-full sm:w-48 shrink-0">
                  <CenterFilterSelect includeHeadquarters={false} />
                </div>
              )}
            </div>

            {/* 카드 리스트 */}
            {filteredEvents.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-slate-200 bg-white py-16 text-center text-slate-400">
                <span className="text-4xl block mb-3">🎈</span>
                등록된 이벤트가 없습니다.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {filteredEvents.map((event) => {
                  const status = getEventStatus(event.startDate, event.endDate);
                  return (
                    <EventCardItem
                      key={event.id}
                      event={event}
                      center={center}
                      type={type}
                      status={status}
                      formatDate={formatDate}
                    />
                  );
                })}
              </div>
            )}
          </section>
        </div>
      )}

      {/* 새 이벤트 작성 모달 */}
      <EventWriteModal
        isOpen={showWriteModal}
        onClose={() => setShowWriteModal(false)}
        onSuccess={handleWriteSuccess}
      />
    </>
  );
}
