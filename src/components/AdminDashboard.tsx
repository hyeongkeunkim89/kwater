"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import type { Reservation, ReservationStatus } from "@/types/reservation";
import {
  getAllReservations,
  updateStatus,
  deleteReservation,
} from "@/lib/reservations";
import { waterCenters } from "@/data/centers";

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

export function AdminDashboard() {
  const [list, setList] = useState<Reservation[]>([]);
  const [filterCenter, setFilterCenter] = useState("전체");
  const [filterStatus, setFilterStatus] = useState<ReservationStatus | "전체">("전체");
  const [filterDate, setFilterDate] = useState("");
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  const reload = () => setList(getAllReservations());

  useEffect(() => {
    const t = window.setTimeout(() => reload(), 0);
    return () => clearTimeout(t);
  }, []);

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

  const handleStatus = (id: string, s: ReservationStatus) => {
    updateStatus(id, s);
    reload();
  };

  const handleDelete = (id: string) => {
    deleteReservation(id);
    setConfirmDelete(null);
    reload();
  };

  return (
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
            className="rounded-2xl border border-slate-200 bg-white px-5 py-4 shadow-sm"
          >
            <p className="text-xs font-medium text-slate-500">{s.label}</p>
            <p className={`text-3xl font-bold tabular-nums ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* 필터 */}
      <div className="flex flex-wrap gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <select
          value={filterCenter}
          onChange={(e) => setFilterCenter(e.target.value)}
          className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:ring-2 focus:ring-sky-500/40"
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
          className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:ring-2 focus:ring-sky-500/40"
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
          className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:ring-2 focus:ring-sky-500/40"
        />

        {(filterCenter !== "전체" || filterStatus !== "전체" || filterDate) && (
          <button
            onClick={() => {
              setFilterCenter("전체");
              setFilterStatus("전체");
              setFilterDate("");
            }}
            className="rounded-xl border border-slate-200 px-3 py-2 text-xs font-medium text-slate-500 hover:border-rose-300 hover:text-rose-600"
          >
            필터 초기화
          </button>
        )}

        <span className="ml-auto self-center text-sm text-slate-500">
          {filtered.length}건 표시
        </span>
      </div>

      {/* 예약 없을 때 */}
      {list.length === 0 && (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white py-16 text-center">
          <p className="text-slate-400">아직 접수된 예약이 없습니다.</p>
          <Link
            href="/reserve"
            className="mt-4 inline-flex items-center rounded-xl bg-sky-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-sky-700"
          >
            예약 신청하러 가기
          </Link>
        </div>
      )}

      {/* 예약 테이블 */}
      {list.length > 0 && (
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-slate-200 bg-slate-50 text-xs font-semibold uppercase tracking-wide text-slate-500">
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
                    <th key={h} className="whitespace-nowrap px-4 py-3 text-left">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((r) => (
                  <tr key={r.id} className="hover:bg-slate-50/70">
                    <td className="whitespace-nowrap px-4 py-3 font-mono text-xs text-sky-700">
                      {r.id}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 font-medium text-slate-900">
                      {r.centerName}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-slate-700">
                      {formatDateKo(r.date)}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 font-semibold text-slate-800">
                      {r.time}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-slate-700">
                      <div>{r.name}</div>
                      <div className="text-xs text-slate-400">{r.phone}</div>
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-center font-semibold text-slate-900">
                      {r.partySize}명
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-slate-600">
                      {r.purpose}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3">
                      <span
                        className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset ${STATUS_STYLES[r.status]}`}
                      >
                        {r.status}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-4 py-3">
                      <div className="flex gap-1.5">
                        {r.status !== "확정" && r.status !== "취소" && (
                          <button
                            onClick={() => handleStatus(r.id, "확정")}
                            className="rounded-lg bg-emerald-50 px-2.5 py-1.5 text-xs font-semibold text-emerald-700 hover:bg-emerald-100"
                          >
                            확정
                          </button>
                        )}
                        {r.status !== "취소" && (
                          <button
                            onClick={() => handleStatus(r.id, "취소")}
                            className="rounded-lg bg-amber-50 px-2.5 py-1.5 text-xs font-semibold text-amber-700 hover:bg-amber-100"
                          >
                            취소
                          </button>
                        )}
                        <button
                          onClick={() => setConfirmDelete(r.id)}
                          className="rounded-lg bg-rose-50 px-2.5 py-1.5 text-xs font-semibold text-rose-600 hover:bg-rose-100"
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

      {/* 삭제 확인 모달 */}
      {confirmDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl">
            <h3 className="text-base font-bold text-slate-900">예약을 삭제하시겠습니까?</h3>
            <p className="mt-2 text-sm text-slate-500">
              삭제된 예약은 복구할 수 없습니다.
            </p>
            <div className="mt-5 flex gap-3 justify-end">
              <button
                onClick={() => setConfirmDelete(null)}
                className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:border-slate-400"
              >
                취소
              </button>
              <button
                onClick={() => handleDelete(confirmDelete)}
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
