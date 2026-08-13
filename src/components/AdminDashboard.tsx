"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import type { Reservation, ReservationStatus } from "@/types/reservation";
import {
  getAllReservations,
  updateStatus,
  deleteReservation,
} from "@/lib/reservations";
import { waterCenters } from "@/data/centers";
import { AdminWaterStoriesPanel } from "@/components/AdminWaterStoriesPanel";
import { AdminNewsPanel } from "@/components/AdminNewsPanel";
import { AdminEventsPanel } from "@/components/AdminEventsPanel";
import { AdminFeedbacksPanel } from "@/components/AdminFeedbacksPanel";

const ADMIN_KEY = "kwm_stories_admin_secret";

const STATUS_STYLES: Record<ReservationStatus, string> = {
  대기: "bg-amber-50 text-amber-800 ring-amber-300/60",
  확정: "bg-emerald-50 text-emerald-800 ring-emerald-300/60",
  취소: "bg-slate-100 text-slate-500 ring-slate-200",
};

function formatDateKo(dateStr: string) {
  const [y, m, d] = dateStr.split("-");
  const dow = new Date(dateStr).toLocaleDateString("ko-KR", { weekday: "short" });
  return `${y}.${m}.${d}(${dow})`;
}

export function AdminDashboard({
  storiesLive = false,
  reservationsLive = false,
  adminSecretConfigured = false,
}: {
  storiesLive?: boolean;
  reservationsLive?: boolean;
  adminSecretConfigured?: boolean;
}) {
  const [activeTab, setActiveTab] = useState<
    "reservations" | "stories" | "news" | "events" | "feedbacks"
  >("reservations");

  const [list, setList] = useState<Reservation[]>([]);
  const [filterCenter, setFilterCenter] = useState("전체");
  const [filterStatus, setFilterStatus] = useState<ReservationStatus | "전체">("전체");
  const [filterDate, setFilterDate] = useState("");
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [adminSecret, setAdminSecret] = useState("");
  const [storiesRefreshKey, setStoriesRefreshKey] = useState(0);
  const [listLoadError, setListLoadError] = useState<string | null>(null);

  const showAdminSecretBar = storiesLive || (reservationsLive && adminSecretConfigured);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setAdminSecret(sessionStorage.getItem(ADMIN_KEY) ?? "");
    }
  }, []);

  const persistAdminSecret = (value: string) => {
    setAdminSecret(value);
    if (typeof window !== "undefined") {
      const t = value.trim();
      if (t) sessionStorage.setItem(ADMIN_KEY, t);
      else sessionStorage.removeItem(ADMIN_KEY);
    }
  };

  const reload = useCallback(async () => {
    if (reservationsLive) {
      setListLoadError(null);
      if (!adminSecretConfigured) {
        setList([]);
        return;
      }
      const secret = adminSecret.trim();
      if (!secret) {
        setList([]);
        return;
      }
      try {
        const res = await fetch("/api/reservations", {
          headers: { "x-admin-secret": secret },
        });
        if (res.status === 401) {
          setListLoadError("관리자 비밀번호가 올바르지 않습니다.");
          setList([]);
          return;
        }
        if (!res.ok) {
          const j = (await res.json().catch(() => ({}))) as { error?: string };
          setListLoadError(j.error ?? "목록을 불러오지 못했습니다.");
          setList([]);
          return;
        }
        const data = (await res.json()) as Reservation[];
        setList(Array.isArray(data) ? data : []);
      } catch {
        setListLoadError("목록을 불러오지 못했습니다.");
        setList([]);
      }
      return;
    }
    setList(getAllReservations());
  }, [reservationsLive, adminSecretConfigured, adminSecret]);

  useEffect(() => {
    void reload();
  }, [reload]);

  const filtered = useMemo(() => {
    return list.filter((r) => {
      if (filterCenter !== "전체" && r.centerId !== filterCenter) return false;
      if (filterStatus !== "전체" && r.status !== filterStatus) return false;
      if (filterDate && r.date !== filterDate) return false;
      return true;
    });
  }, [list, filterCenter, filterStatus, filterDate]);

  // 요약 집계
  const stats = useMemo(
    () => ({
      total: list.length,
      대기: list.filter((r) => r.status === "대기").length,
      확정: list.filter((r) => r.status === "확정").length,
      취소: list.filter((r) => r.status === "취소").length,
    }),
    [list],
  );

  const authHeaders = (): HeadersInit => ({
    "x-admin-secret": adminSecret.trim(),
    "Content-Type": "application/json",
  });

  const handleStatus = async (id: string, s: ReservationStatus) => {
    if (reservationsLive) {
      const res = await fetch(`/api/reservations/${encodeURIComponent(id)}`, {
        method: "PATCH",
        headers: authHeaders(),
        body: JSON.stringify({ status: s }),
      });
      if (!res.ok) {
        const j = (await res.json().catch(() => ({}))) as { error?: string };
        setListLoadError(j.error ?? "상태 변경에 실패했습니다.");
        return;
      }
    } else {
      updateStatus(id, s);
    }
    await reload();
  };

  const handleDelete = async (id: string) => {
    if (reservationsLive) {
      const res = await fetch(`/api/reservations/${encodeURIComponent(id)}`, {
        method: "DELETE",
        headers: { "x-admin-secret": adminSecret.trim() },
      });
      if (!res.ok) {
        const j = (await res.json().catch(() => ({}))) as { error?: string };
        setListLoadError(j.error ?? "삭제에 실패했습니다.");
        return;
      }
    } else {
      deleteReservation(id);
    }
    setConfirmDelete(null);
    await reload();
  };

  return (
    <div className="space-y-6">
      {reservationsLive && !adminSecretConfigured && (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-950">
          예약 API를 쓰려면 배포에{" "}
          <code className="rounded bg-amber-100/80 px-1 py-0.5 text-xs">WATER_STORIES_ADMIN_SECRET</code>을
          설정하세요.
        </div>
      )}

      {showAdminSecretBar && (
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-sm font-semibold text-slate-800">관리자 비밀번호</p>
          <div className="mt-3 flex min-w-0 flex-col gap-2 sm:flex-row sm:items-center">
            <input
              type="password"
              autoComplete="off"
              value={adminSecret}
              onChange={(e) => persistAdminSecret(e.target.value)}
              placeholder="관리자 비밀번호"
              className="min-h-[44px] min-w-0 flex-1 rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-900 outline-none focus:ring-2 focus:ring-sky-500/40"
            />
            <button
              type="button"
              onClick={() => {
                setStoriesRefreshKey((k) => k + 1);
                void reload();
              }}
              className="min-h-[44px] shrink-0 rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800"
            >
              새로고침
            </button>
          </div>
          {listLoadError && <p className="mt-2 text-sm text-rose-600">{listLoadError}</p>}
        </div>
      )}

      {/* 탭 버튼 헤더 */}
      <div className="flex flex-wrap gap-1.5 border-b border-slate-200 pb-px">
        {[
          { id: "reservations", label: "🗓️ 예약 관리" },
          { id: "stories", label: "📷 물 이야기" },
          { id: "news", label: "📰 소식 관리" },
          { id: "events", label: "🎈 이벤트 관리" },
          { id: "feedbacks", label: "💬 소통창구 답변" },
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id as any)}
            className={[
              "min-h-10 rounded-t-xl px-4 py-2 text-xs sm:text-sm font-bold transition border-b-2 -mb-px",
              activeTab === tab.id
                ? "border-sky-500 text-sky-600 bg-white"
                : "border-transparent text-slate-500 hover:text-slate-700 bg-transparent",
            ].join(" ")}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* 탭별 패널 영역 */}
      <div className="rounded-2xl bg-white border border-slate-200 p-5 shadow-sm">
        {activeTab === "reservations" && (
          <div className="space-y-6">
            {/* 요약 카드 */}
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {[
                { label: "전체 예약", value: stats.total, color: "text-slate-900" },
                { label: "대기", value: stats.대기, color: "text-amber-700" },
                { label: "확정", value: stats.확정, color: "text-emerald-700" },
                { label: "취소", value: stats.취소, color: "text-slate-400" },
              ].map((s) => (
                <div
                  key={s.label}
                  className="rounded-2xl border border-slate-200 bg-slate-50/50 px-5 py-4"
                >
                  <p className="text-xs font-semibold text-slate-500">{s.label}</p>
                  <p className={`text-2xl sm:text-3xl font-black tabular-nums ${s.color}`}>{s.value}</p>
                </div>
              ))}
            </div>

            {/* 필터 */}
            <div className="flex flex-wrap gap-3 rounded-xl bg-slate-50 p-4 border border-slate-100">
              <select
                value={filterCenter}
                onChange={(e) => setFilterCenter(e.target.value)}
                className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs sm:text-sm text-slate-900 outline-none focus:ring-2 focus:ring-sky-500/40"
              >
                <option value="전체">전체 문화관</option>
                {waterCenters.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>

              <select
                value={filterStatus}
                onChange={(e) =>
                  setFilterStatus(e.target.value as ReservationStatus | "전체")
                }
                className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs sm:text-sm text-slate-900 outline-none focus:ring-2 focus:ring-sky-500/40"
              >
                <option value="전체">전체 상태</option>
                <option value="대기">대기</option>
                <option value="확정">확정</option>
                <option value="취소">취소</option>
              </select>

              <input
                type="date"
                value={filterDate}
                onChange={(e) => setFilterDate(e.target.value)}
                className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs sm:text-sm text-slate-900 outline-none focus:ring-2 focus:ring-sky-500/40"
              />

              {(filterCenter !== "전체" || filterStatus !== "전체" || filterDate) && (
                <button
                  onClick={() => {
                    setFilterCenter("전체");
                    setFilterStatus("전체");
                    setFilterDate("");
                  }}
                  className="rounded-xl border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-500 hover:border-rose-300 hover:text-rose-600"
                >
                  필터 초기화
                </button>
              )}

              <span className="ml-auto self-center text-xs sm:text-sm text-slate-500">
                {filtered.length}건 표시
              </span>
            </div>

            {/* 예약 리스트 */}
            {list.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-slate-300 py-16 text-center text-slate-400">
                {reservationsLive && adminSecretConfigured && !adminSecret.trim() ? (
                  <p>관리자 비밀번호를 입력한 뒤 새로고침을 누르세요.</p>
                ) : (
                  <p>아직 접수된 예약이 없습니다.</p>
                )}
              </div>
            ) : (
              <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
                <div className="overflow-x-auto">
                  <table className="w-full text-xs sm:text-sm text-left">
                    <thead className="border-b border-slate-200 bg-slate-50 text-xs font-bold uppercase tracking-wide text-slate-500">
                      <tr>
                        {[
                          "예약번호",
                          "문화관",
                          "날짜",
                          "시간",
                          "예약자",
                          "인원",
                          "목적",
                          "상태",
                          "관리",
                        ].map((h) => (
                          <th key={h} className="whitespace-nowrap px-4 py-3">
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-700">
                      {filtered.map((r) => (
                        <tr key={r.id} className="hover:bg-slate-50/50">
                          <td className="whitespace-nowrap px-4 py-3 font-mono text-xs text-sky-700">
                            {r.id.slice(0, 8)}...
                          </td>
                          <td className="whitespace-nowrap px-4 py-3 font-semibold text-slate-900">
                            {r.centerName}
                          </td>
                          <td className="whitespace-nowrap px-4 py-3">
                            {formatDateKo(r.date)}
                          </td>
                          <td className="whitespace-nowrap px-4 py-3 font-bold text-slate-800">
                            {r.time}
                          </td>
                          <td className="whitespace-nowrap px-4 py-3">
                            <div className="font-bold">{r.name}</div>
                            <div className="text-xs text-slate-400">{r.phone}</div>
                          </td>
                          <td className="whitespace-nowrap px-4 py-3 font-bold text-slate-900">
                            {r.partySize}명
                          </td>
                          <td className="whitespace-nowrap px-4 py-3 text-slate-600">
                            {r.purpose}
                          </td>
                          <td className="whitespace-nowrap px-4 py-3">
                            <span
                              className={`inline-flex rounded-full px-2 py-0.5 text-xs font-semibold ring-1 ring-inset ${STATUS_STYLES[r.status]}`}
                            >
                              {r.status}
                            </span>
                          </td>
                          <td className="whitespace-nowrap px-4 py-3">
                            <div className="flex gap-1.5">
                              {r.status !== "확정" && r.status !== "취소" && (
                                <button
                                  type="button"
                                  onClick={() => void handleStatus(r.id, "확정")}
                                  className="min-h-[36px] rounded-lg bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-700 hover:bg-emerald-100"
                                >
                                  확정
                                </button>
                              )}
                              {r.status !== "취소" && (
                                <button
                                  type="button"
                                  onClick={() => void handleStatus(r.id, "취소")}
                                  className="min-h-[36px] rounded-lg bg-amber-50 px-2.5 py-1 text-xs font-bold text-amber-700 hover:bg-amber-100"
                                >
                                  취소
                                </button>
                              )}
                              <button
                                type="button"
                                onClick={() => setConfirmDelete(r.id)}
                                className="min-h-[36px] rounded-lg bg-rose-50 px-2.5 py-1.5 text-xs font-bold text-rose-600 hover:bg-rose-100"
                              >
                                삭제
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === "stories" && (
          <AdminWaterStoriesPanel
            storiesLive={storiesLive}
            adminSecret={adminSecret}
            storiesRefreshKey={storiesRefreshKey}
          />
        )}

        {activeTab === "news" && (
          <AdminNewsPanel adminSecret={adminSecret} storiesLive={storiesLive} />
        )}

        {activeTab === "events" && (
          <AdminEventsPanel adminSecret={adminSecret} storiesLive={storiesLive} />
        )}

        {activeTab === "feedbacks" && (
          <AdminFeedbacksPanel adminSecret={adminSecret} />
        )}
      </div>

      {/* 예약 삭제 확인 모달 */}
      {confirmDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl">
            <h3 className="text-base font-bold text-slate-900">예약을 삭제하시겠습니까?</h3>
            <p className="mt-2 text-sm text-slate-500">
              삭제된 예약은 되돌릴 수 없습니다.
            </p>
            <div className="mt-5 flex gap-3 justify-end">
              <button
                onClick={() => setConfirmDelete(null)}
                className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:border-slate-400"
              >
                취소
              </button>
              <button
                type="button"
                onClick={() => void handleDelete(confirmDelete)}
                className="rounded-xl bg-rose-600 px-4 py-2 text-sm font-semibold text-white hover:bg-rose-700"
              >
                삭제
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
