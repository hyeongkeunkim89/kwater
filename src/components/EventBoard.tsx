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
          {selectedEvent.imageUrl && (
            <div className="my-8 overflow-hidden rounded-xl border border-slate-100 bg-slate-50">
              <img
                src={selectedEvent.imageUrl}
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
        /* ================= 목록 화면 ================= */
        <div className="space-y-10">
          {/* 🌟 대표 참여형 이벤트: 물 이야기 사진전 */}
          <div className="rounded-2xl border border-sky-100 bg-gradient-to-br from-sky-50/50 via-teal-50/20 to-white p-5 sm:p-6 shadow-sm border-l-4 border-l-sky-500">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              <div className="space-y-2.5 max-w-2xl">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="inline-flex rounded-full bg-sky-100 text-sky-700 text-[10px] font-black px-2.5 py-0.5 uppercase tracking-wider">
                    대표 시그니처 이벤트 (상시 운영)
                  </span>
                  <span className="inline-flex rounded-full bg-emerald-500 text-white text-[10px] font-bold px-2 py-0.5 shadow-sm shadow-emerald-500/10">
                    진행중
                  </span>
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 leading-tight">
                  📷 이달의 물 이야기 사진전
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
                  물문화관의 수려한 자연 경관과 산책로를 걸으며 포착한 소중한 순간들을 사진으로 공유해 주세요! 
                  매월 1편의 우수작을 선정하여 명예의 전당인 <strong>&apos;이달의 사진&apos;</strong>에 등재하고 상품을 드립니다.
                </p>
              </div>
              <div className="shrink-0 flex flex-col sm:flex-row md:flex-col gap-2 w-full md:w-auto">
                <Link
                  href="/mul-iyagi"
                  className="flex-1 md:flex-initial inline-flex min-h-[44px] items-center justify-center rounded-xl bg-sky-500 hover:bg-sky-400 text-xs font-bold text-white px-5 transition shadow-lg shadow-sky-500/10 text-center"
                >
                  📸 내 사진 업로드 (참여하기)
                </Link>
                <Link
                  href="/mul-iyagi"
                  className="flex-1 md:flex-initial inline-flex min-h-[44px] items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 text-xs font-bold px-5 transition text-center"
                >
                  🖼️ 전체 사진 갤러리 구경
                </Link>
              </div>
            </div>

            {/* 최근 응모작 실시간 썸네일 */}
            <RecentWaterStories storiesLive={storiesLive} />
          </div>

          {/* 기타 체험/이벤트 */}
          <div className="border-t border-slate-200/80 pt-8 space-y-8">
            {/* 필터 및 작성 버튼 */}
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
              <div className="flex flex-col sm:flex-row sm:items-end sm:justify-start gap-4 flex-1">
                {/* 이벤트 구분 */}
                <div className="flex flex-col gap-2 shrink-0">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    이벤트 구분
                  </label>
                  <div className="flex gap-2">
                    {[
                      { key: "all", label: "전체 이벤트" },
                      { key: "hq", label: "본사 주관 공통" },
                      { key: "centers", label: "개별 문화관 전용" },
                    ].map((t) => (
                      <Link
                        key={t.key}
                        href={`/events?type=${t.key}&center=${center}`}
                        className={[
                          "min-h-10 inline-flex items-center justify-center rounded-xl px-4 py-2 text-xs font-bold transition",
                          type === t.key
                            ? "bg-slate-900 text-white shadow-sm"
                            : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50",
                        ].join(" ")}
                      >
                        {t.label}
                      </Link>
                    ))}
                  </div>
                </div>

                {/* 개별 문화관 필터 */}
                {type !== "hq" && (
                  <div className="flex flex-col gap-2 w-full max-w-xs">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                      문화관 선택
                    </label>
                    <CenterFilterSelect includeHeadquarters={false} />
                  </div>
                )}
              </div>

              <button
                type="button"
                onClick={() => setShowWriteModal(true)}
                className="inline-flex min-h-11 items-center justify-center rounded-xl bg-sky-500 hover:bg-sky-400 text-sm font-bold text-white px-5 transition shadow-md shadow-sky-500/10 self-start md:self-auto"
              >
                ✍️ 새 이벤트 등록하기
              </button>
            </div>

            {/* 카드 리스트 */}
            {filteredEvents.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-slate-200 bg-white py-16 text-center text-slate-400">
                <span className="text-4xl block mb-3">🎈</span>
                등록된 이벤트가 없습니다.
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {filteredEvents.map((event) => {
                  const status = getEventStatus(event.startDate, event.endDate);
                  return (
                    <Link
                      key={event.id}
                      href={`/events?id=${event.id}&center=${center}&type=${type}`}
                      className="group flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm hover:border-sky-400 hover:shadow-md transition duration-200"
                    >
                      {/* 포스터 배너 영역 (이미지 없을 시 물빛 그라데이션) */}
                      <div className="relative h-44 w-full bg-gradient-to-r from-sky-400 to-indigo-500 overflow-hidden shrink-0">
                        {event.imageUrl ? (
                          <img
                            src={event.imageUrl}
                            alt={event.title}
                            className="h-full w-full object-cover group-hover:scale-105 transition duration-300"
                          />
                        ) : (
                          <div className="absolute inset-0 flex items-center justify-center text-white/30 font-black text-lg">
                            K-water Event
                          </div>
                        )}
                        <span
                          className={[
                            "absolute top-3 left-3 rounded border text-[10px] font-bold px-2 py-0.5 shadow-sm",
                            status.style,
                          ].join(" ")}
                        >
                          {status.label}
                        </span>
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
                })}
              </div>
            )}
          </div>
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
