"use client";

import { useState, useEffect } from "react";
import type { News } from "@/types/news";
import { waterCenters } from "@/data/centers";

export function AdminNewsPanel({
  adminSecret,
  storiesLive = false,
}: {
  adminSecret: string;
  storiesLive?: boolean;
}) {
  const [newsList, setNewsList] = useState<News[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Edit / Write Form State
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [centerId, setCenterId] = useState("all");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isPinned, setIsPinned] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const fetchNews = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/news");
      if (res.ok) {
        const data = await res.json();
        setNewsList(data);
      } else {
        setError("소식 목록을 불러오지 못했습니다.");
      }
    } catch {
      setError("서버와의 통신에 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void fetchNews();
  }, []);

  const openWriteForm = () => {
    setEditingId(null);
    setCenterId("all");
    setTitle("");
    setContent("");
    setIsPinned(false);
    setImageUrl("");
    setShowForm(true);
  };

  const openEditForm = (news: News) => {
    setEditingId(news.id);
    setCenterId(news.centerId);
    setTitle(news.title);
    setContent(news.content);
    setIsPinned(news.isPinned);
    setImageUrl(news.imageUrl ?? "");
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!title.trim() || !content.trim()) {
      setError("제목과 내용을 입력해 주세요.");
      return;
    }

    setSubmitting(true);
    const centerObj = waterCenters.find((w) => w.id === centerId);
    const centerName = centerObj ? centerObj.name : "본사";

    try {
      const method = editingId ? "PATCH" : "POST";
      const url = editingId ? `/api/news/${editingId}` : "/api/news";

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          "x-admin-secret": adminSecret,
        },
        body: JSON.stringify({
          centerId,
          centerName,
          title,
          content,
          isPinned,
          imageUrl: imageUrl.trim() || undefined,
        }),
      });

      if (!res.ok) {
        const j = await res.json();
        throw new Error(j.error ?? "저장에 실패했습니다.");
      }

      setShowForm(false);
      void fetchNews();
    } catch (err) {
      setError(err instanceof Error ? err.message : "저장 오류");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("정말 이 소식을 삭제하시겠습니까?")) return;

    setError("");
    try {
      const res = await fetch(`/api/news/${id}`, {
        method: "DELETE",
        headers: {
          "x-admin-secret": adminSecret,
        },
      });

      if (!res.ok) {
        const j = await res.json();
        throw new Error(j.error ?? "삭제에 실패했습니다.");
      }

      void fetchNews();
    } catch (err) {
      setError(err instanceof Error ? err.message : "삭제 오류");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-black text-slate-900">소식 및 공지사항 관리</h2>
        {!showForm && (
          <button
            type="button"
            onClick={openWriteForm}
            className="min-h-[40px] rounded-lg bg-sky-500 hover:bg-sky-400 text-xs font-bold text-white px-4 transition"
          >
            + 새 소식 등록
          </button>
        )}
      </div>

      {error && <p className="text-xs font-semibold text-rose-600">{error}</p>}

      {showForm ? (
        /* ================= 작성 및 수정 폼 ================= */
        <form onSubmit={handleSubmit} className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 space-y-4">
          <h3 className="text-sm font-bold text-slate-800 border-b border-slate-100 pb-3">
            {editingId ? "소식 수정하기" : "새 소식 작성하기"}
          </h3>

          {!storiesLive && (
            <div className="rounded-xl bg-amber-50 border border-amber-200 p-3.5 text-xs font-semibold text-amber-800 leading-normal">
              ⚠️ <strong>주의:</strong> 현재 데이터베이스(DATABASE_URL)가 설정되지 않아 임시 로컬 파일에 데이터를 저장 중입니다. 이 상태에서는 서버가 재시작되거나 사이트가 재배포되면 작성한 글이 휘발되어 삭제됩니다. 실 서비스 운영 시에는 반드시 데이터베이스를 연결해 주세요.
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-600">발행 구분 (대상 물문화관)</label>
              <select
                value={centerId}
                onChange={(e) => setCenterId(e.target.value)}
                className="min-h-11 rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-900 outline-none focus:ring-2 focus:ring-sky-500/40"
              >
                <option value="all">본사 공지</option>
                {waterCenters.map((wc) => (
                  <option key={wc.id} value={wc.id}>
                    {wc.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-1.5 justify-center pl-2 pt-4">
              <label className="flex items-center gap-2 text-xs sm:text-sm font-bold text-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isPinned}
                  onChange={(e) => setIsPinned(e.target.checked)}
                  className="rounded border-slate-300 text-sky-500 focus:ring-sky-400"
                />
                📌 상단 고정 (중요 공지사항)
              </label>
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-slate-600">제목</label>
            <input
              type="text"
              placeholder="공지 제목 입력"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="min-h-11 rounded-xl border border-slate-200 px-3 text-sm text-slate-900 outline-none focus:ring-2 focus:ring-sky-500/40"
              required
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-slate-600">이미지 URL (선택)</label>
            <input
              type="text"
              placeholder="예: https://... 또는 /centers/image.jpg"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              className="min-h-11 rounded-xl border border-slate-200 px-3 text-sm text-slate-900 outline-none focus:ring-2 focus:ring-sky-500/40"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-slate-600">내용</label>
            <textarea
              rows={8}
              placeholder="공지할 상세 내용을 입력해 주세요."
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
        /* ================= 소식 리스트 테이블 ================= */
        <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
          {loading ? (
            <div className="p-10 text-center text-slate-400 text-sm">불러오는 중...</div>
          ) : newsList.length === 0 ? (
            <div className="p-10 text-center text-slate-400 text-sm">등록된 소식이 없습니다.</div>
          ) : (
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold">
                <tr>
                  <th className="p-3 text-center">중요</th>
                  <th className="p-3">소속</th>
                  <th className="p-3">제목</th>
                  <th className="p-3 text-center">조회수</th>
                  <th className="p-3 text-center">등록일</th>
                  <th className="p-3 text-center">작업</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {newsList.map((news) => (
                  <tr key={news.id} className="hover:bg-slate-50/50">
                    <td className="p-3 text-center text-rose-500 font-bold">{news.isPinned ? "📌" : ""}</td>
                    <td className="p-3 font-semibold text-slate-500">{news.centerName}</td>
                    <td className="p-3 font-bold text-slate-800 max-w-[200px] truncate">{news.title}</td>
                    <td className="p-3 text-center">{news.views}</td>
                    <td className="p-3 text-center text-slate-400 font-medium">
                      {new Date(news.createdAt).toLocaleDateString()}
                    </td>
                    <td className="p-3 text-center space-x-2">
                      <button
                        type="button"
                        onClick={() => openEditForm(news)}
                        className="rounded border border-slate-200 px-2 py-1 text-xs font-semibold hover:bg-slate-100"
                      >
                        수정
                      </button>
                      <button
                        type="button"
                        onClick={() => void handleDelete(news.id)}
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
