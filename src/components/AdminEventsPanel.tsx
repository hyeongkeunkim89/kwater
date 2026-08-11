"use client";

import { useState, useEffect } from "react";
import type { Event } from "@/types/event";
import { waterCenters } from "@/data/centers";

export function AdminEventsPanel({ adminSecret }: { adminSecret: string }) {
  const [eventList, setEventList] = useState<Event[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Edit / Write Form State
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [centerId, setCenterId] = useState("all");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [isHeadquarters, setIsHeadquarters] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const fetchEvents = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/events");
      if (res.ok) {
        const data = await res.json();
        setEventList(data);
      } else {
        setError("이벤트 목록을 불러오지 못했습니다.");
      }
    } catch {
      setError("서버와의 통신에 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void fetchEvents();
  }, []);

  const openWriteForm = () => {
    setEditingId(null);
    setCenterId("all");
    setTitle("");
    setContent("");
    const today = new Date().toISOString().slice(0, 10);
    setStartDate(today);
    setEndDate(today);
    setIsHeadquarters(false);
    setImageUrl("");
    setShowForm(true);
  };

  const openEditForm = (event: Event) => {
    setEditingId(event.id);
    setCenterId(event.centerId);
    setTitle(event.title);
    setContent(event.content);
    setStartDate(event.startDate);
    setEndDate(event.endDate);
    setIsHeadquarters(event.isHeadquarters);
    setImageUrl(event.imageUrl ?? "");
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!title.trim() || !content.trim() || !startDate || !endDate) {
      setError("필수 입력란을 모두 기재해 주세요.");
      return;
    }

    if (new Date(startDate) > new Date(endDate)) {
      setError("시작일은 종료일보다 이전이어야 합니다.");
      return;
    }

    setSubmitting(true);
    const centerObj = waterCenters.find((w) => w.id === centerId);
    const centerName = isHeadquarters ? "본사" : centerObj ? centerObj.name : "본사";

    try {
      const method = editingId ? "PATCH" : "POST";
      const url = editingId ? `/api/events/${editingId}` : "/api/events";

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          "x-admin-secret": adminSecret,
        },
        body: JSON.stringify({
          centerId: isHeadquarters ? "all" : centerId,
          centerName,
          title,
          content,
          startDate,
          endDate,
          isHeadquarters,
          imageUrl: imageUrl.trim() || undefined,
        }),
      });

      if (!res.ok) {
        const j = await res.json();
        throw new Error(j.error ?? "저장에 실패했습니다.");
      }

      setShowForm(false);
      void fetchEvents();
    } catch (err) {
      setError(err instanceof Error ? err.message : "저장 오류");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("정말 이 이벤트를 삭제하시겠습니까?")) return;

    setError("");
    try {
      const res = await fetch(`/api/events/${id}`, {
        method: "DELETE",
        headers: {
          "x-admin-secret": adminSecret,
        },
      });

      if (!res.ok) {
        const j = await res.json();
        throw new Error(j.error ?? "삭제에 실패했습니다.");
      }

      void fetchEvents();
    } catch (err) {
      setError(err instanceof Error ? err.message : "삭제 오류");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-black text-slate-900">체험 및 이벤트 관리</h2>
        {!showForm && (
          <button
            type="button"
            onClick={openWriteForm}
            className="min-h-[40px] rounded-lg bg-sky-500 hover:bg-sky-400 text-xs font-bold text-white px-4 transition"
          >
            + 새 이벤트 등록
          </button>
        )}
      </div>

      {error && <p className="text-xs font-semibold text-rose-600">{error}</p>}

      {showForm ? (
        /* ================= 작성 및 수정 폼 ================= */
        <form onSubmit={handleSubmit} className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 space-y-4">
          <h3 className="text-sm font-bold text-slate-800 border-b border-slate-100 pb-3">
            {editingId ? "이벤트 수정하기" : "새 이벤트 등록하기"}
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5 justify-center pl-2 pt-4">
              <label className="flex items-center gap-2 text-xs sm:text-sm font-bold text-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isHeadquarters}
                  onChange={(e) => setIsHeadquarters(e.target.checked)}
                  className="rounded border-slate-300 text-sky-500 focus:ring-sky-400"
                />
                🏢 본사 주관 이벤트 (전체 공통)
              </label>
            </div>

            {!isHeadquarters && (
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-600">개최 물문화관</label>
                <select
                  value={centerId}
                  onChange={(e) => setCenterId(e.target.value)}
                  className="min-h-11 rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-900 outline-none focus:ring-2 focus:ring-sky-500/40"
                >
                  <option value="all">공통</option>
                  {waterCenters.map((wc) => (
                    <option key={wc.id} value={wc.id}>
                      {wc.name}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-600">이벤트 시작일</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="min-h-11 rounded-xl border border-slate-200 px-3 text-sm text-slate-900 outline-none focus:ring-2 focus:ring-sky-500/40"
                required
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-600">이벤트 종료일</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="min-h-11 rounded-xl border border-slate-200 px-3 text-sm text-slate-900 outline-none focus:ring-2 focus:ring-sky-500/40"
                required
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-slate-600">제목</label>
            <input
              type="text"
              placeholder="이벤트 제목 입력"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="min-h-11 rounded-xl border border-slate-200 px-3 text-sm text-slate-900 outline-none focus:ring-2 focus:ring-sky-500/40"
              required
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-slate-600">배너/포스터 이미지 URL (선택)</label>
            <input
              type="text"
              placeholder="예: https://... 또는 /centers/event.jpg"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              className="min-h-11 rounded-xl border border-slate-200 px-3 text-sm text-slate-900 outline-none focus:ring-2 focus:ring-sky-500/40"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-slate-600">내용</label>
            <textarea
              rows={8}
              placeholder="이벤트 상세 안내 및 신청 방법 등을 적어 주세요."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="rounded-xl border border-slate-200 px-3 py-2.5 text-sm text-slate-900 outline-none focus:ring-2 focus:ring-sky-500/40"
              required
            />
          </div>

          <div className="flex gap-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="min-h-11 flex-1 rounded-xl bg-slate-100 text-sm font-semibold text-slate-600 hover:bg-slate-200 transition"
            >
              취소
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="min-h-11 flex-1 rounded-xl bg-sky-500 text-sm font-bold text-white hover:bg-sky-400 transition"
            >
              {submitting ? "저장 중..." : "저장 완료"}
            </button>
          </div>
        </form>
      ) : (
        /* ================= 이벤트 리스트 테이블 ================= */
        <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
          {loading ? (
            <div className="p-10 text-center text-slate-400 text-sm">불러오는 중...</div>
          ) : eventList.length === 0 ? (
            <div className="p-10 text-center text-slate-400 text-sm">등록된 이벤트가 없습니다.</div>
          ) : (
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold">
                <tr>
                  <th className="p-3">소속</th>
                  <th className="p-3">구분</th>
                  <th className="p-3">제목</th>
                  <th className="p-3">기간</th>
                  <th className="p-3 text-center">작업</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {eventList.map((event) => (
                  <tr key={event.id} className="hover:bg-slate-50/50">
                    <td className="p-3 font-semibold text-slate-500">{event.centerName}</td>
                    <td className="p-3 font-medium">
                      {event.isHeadquarters ? (
                        <span className="rounded bg-indigo-50 border border-indigo-200 text-[10px] text-indigo-700 px-2 py-0.5">
                          본사 주관
                        </span>
                      ) : (
                        <span className="rounded bg-sky-50 border border-sky-200 text-[10px] text-sky-700 px-2 py-0.5">
                          개별 지점
                        </span>
                      )}
                    </td>
                    <td className="p-3 font-bold text-slate-800 max-w-[200px] truncate">{event.title}</td>
                    <td className="p-3 text-slate-500 font-medium">
                      {event.startDate} ~ {event.endDate}
                    </td>
                    <td className="p-3 text-center space-x-2">
                      <button
                        type="button"
                        onClick={() => openEditForm(event)}
                        className="rounded border border-slate-200 px-2 py-1 text-xs font-semibold hover:bg-slate-100"
                      >
                        수정
                      </button>
                      <button
                        type="button"
                        onClick={() => void handleDelete(event.id)}
                        className="rounded border border-rose-200 text-rose-600 px-2 py-1 text-xs font-semibold hover:bg-rose-50"
                      >
                        삭제
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
}
