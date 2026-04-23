"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { waterCenters } from "@/data/centers";
import {
  deleteWaterStory,
  getAllWaterStories,
  getPhotoOfMonthStoryId,
  setPhotoOfMonthStoryId,
} from "@/lib/waterStories";
import type { WaterStory } from "@/types/waterStory";

function centerLabel(id: string) {
  return waterCenters.find((c) => c.id === id)?.name ?? id;
}

export function AdminWaterStoriesPanel({
  storiesLive,
  adminSecret,
  storiesRefreshKey = 0,
}: {
  storiesLive: boolean;
  /** 예약 영역과 동일 — `AdminDashboard`에서만 입력·sessionStorage 동기화 */
  adminSecret: string;
  /** 상단 새로고침 시 증가 → 목록 재요청 */
  storiesRefreshKey?: number;
}) {
  const [list, setList] = useState<WaterStory[]>([]);
  const [localPomId, setLocalPomId] = useState<string | null>(null);
  const [adminError, setAdminError] = useState<string | null>(null);

  const reload = useCallback(async () => {
    if (storiesLive) {
      setAdminError(null);
      try {
        const res = await fetch("/api/stories");
        if (res.ok) {
          const data = (await res.json()) as WaterStory[];
          setList(Array.isArray(data) ? data : []);
        } else {
          setList([]);
        }
      } catch {
        setList([]);
      }
    } else {
      setList(getAllWaterStories());
      setLocalPomId(getPhotoOfMonthStoryId());
    }
  }, [storiesLive]);

  useEffect(() => {
    void reload();
  }, [reload, storiesRefreshKey]);

  const authHeaders = (): HeadersInit => ({
    "x-admin-secret": adminSecret.trim(),
    "Content-Type": "application/json",
  });

  const setServerPhotoOfMonth = async (id: string) => {
    setAdminError(null);
    const res = await fetch(`/api/stories/${id}`, {
      method: "PATCH",
      headers: authHeaders(),
      body: JSON.stringify({ isPhotoOfMonth: true }),
    });
    if (!res.ok) {
      const j = (await res.json().catch(() => ({}))) as { error?: string };
      setAdminError(j.error ?? "선정에 실패했습니다.");
      return;
    }
    await reload();
  };

  const clearServerPhotoOfMonth = async () => {
    setAdminError(null);
    const res = await fetch("/api/stories/photo-of-month", {
      method: "DELETE",
      headers: { "x-admin-secret": adminSecret.trim() },
    });
    if (!res.ok) {
      const j = (await res.json().catch(() => ({}))) as { error?: string };
      setAdminError(j.error ?? "해제에 실패했습니다.");
      return;
    }
    await reload();
  };

  const deleteServerStory = async (id: string) => {
    setAdminError(null);
    const res = await fetch(`/api/stories/${id}`, {
      method: "DELETE",
      headers: { "x-admin-secret": adminSecret.trim() },
    });
    if (!res.ok) {
      const j = (await res.json().catch(() => ({}))) as { error?: string };
      setAdminError(j.error ?? "삭제에 실패했습니다.");
      return;
    }
    await reload();
  };

  const pomId = storiesLive ? list.find((s) => s.isPhotoOfMonth)?.id ?? null : localPomId;

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
      <div className="mb-6">
        <h2 className="text-lg font-black text-slate-900 sm:text-xl">물 이야기 · 이달의 사진</h2>
      </div>

      {adminError && (
        <p className="mb-4 rounded-xl bg-rose-50 px-4 py-3 text-sm text-rose-800" role="alert">
          {adminError}
        </p>
      )}

      {list.length === 0 ? (
        <p className="rounded-xl bg-slate-50 px-4 py-6 text-sm text-slate-500">
          등록된 글이 없습니다.{" "}
          <a href="/mul-iyagi" className="font-semibold text-sky-700 underline">
            물 이야기
          </a>
        </p>
      ) : (
        <ul className="space-y-4">
          {list.map((s) => (
            <li
              key={s.id}
              className="flex flex-col gap-4 rounded-xl border border-slate-100 bg-slate-50/80 p-4 sm:flex-row sm:items-center"
            >
              <div className="relative h-24 w-full shrink-0 overflow-hidden rounded-lg bg-slate-200 sm:h-20 sm:w-28">
                {s.imageSrc.startsWith("/") ? (
                  <Image src={s.imageSrc} alt="" fill className="object-cover" sizes="112px" />
                ) : (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={s.imageSrc} alt="" className="h-full w-full object-cover" />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-bold text-sky-700">{centerLabel(s.centerId)}</p>
                <p className="truncate text-sm font-bold text-slate-900">{s.nickname}</p>
                <p className="line-clamp-2 text-xs text-slate-600">{s.caption}</p>
              </div>
              <div className="flex shrink-0 flex-wrap gap-2">
                {storiesLive ? (
                  <>
                    <button
                      type="button"
                      onClick={() => void setServerPhotoOfMonth(s.id)}
                      className="min-h-10 rounded-lg bg-amber-100 px-3 py-2 text-xs font-bold text-amber-900 transition hover:bg-amber-200"
                    >
                      {pomId === s.id ? "선정됨" : "이달의 사진"}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        if (!window.confirm("이 글을 영구 삭제할까요?")) return;
                        void deleteServerStory(s.id);
                      }}
                      className="min-h-10 rounded-lg bg-rose-50 px-3 py-2 text-xs font-bold text-rose-700 hover:bg-rose-100"
                    >
                      삭제
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      type="button"
                      onClick={() => {
                        setPhotoOfMonthStoryId(s.id);
                        void reload();
                      }}
                      className="min-h-10 rounded-lg bg-amber-100 px-3 py-2 text-xs font-bold text-amber-900 transition hover:bg-amber-200"
                    >
                      {pomId === s.id ? "선정됨" : "이달의 사진"}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        if (!window.confirm("이 글을 삭제할까요?")) return;
                        deleteWaterStory(s.id);
                        void reload();
                      }}
                      className="min-h-10 rounded-lg bg-rose-50 px-3 py-2 text-xs font-bold text-rose-700 hover:bg-rose-100"
                    >
                      삭제
                    </button>
                  </>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}

      {storiesLive && pomId && (
        <button
          type="button"
          onClick={() => void clearServerPhotoOfMonth()}
          className="mt-6 text-xs font-bold text-slate-500 underline hover:text-slate-800"
        >
          이달의 사진 지정 해제
        </button>
      )}

      {!storiesLive && pomId && (
        <button
          type="button"
          onClick={() => {
            setPhotoOfMonthStoryId(null);
            void reload();
          }}
          className="mt-6 text-xs font-bold text-slate-500 underline hover:text-slate-800"
        >
          이달의 사진 지정 해제
        </button>
      )}
    </section>
  );
}
