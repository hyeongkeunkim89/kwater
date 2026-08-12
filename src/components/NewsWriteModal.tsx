"use client";

import { useState, useEffect } from "react";
import { waterCenters } from "@/data/centers";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
};

export function NewsWriteModal({ isOpen, onClose, onSuccess }: Props) {
  const [centerId, setCenterId] = useState("all");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isPinned, setIsPinned] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const [adminSecret, setAdminSecret] = useState("");
  
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (isOpen) {
      if (typeof window !== "undefined") {
        setAdminSecret(sessionStorage.getItem("kwm_stories_admin_secret") ?? "");
      }
      setError("");
      setTitle("");
      setContent("");
      setIsPinned(false);
      setImageUrl("");
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!title.trim() || !content.trim()) {
      setError("제목과 내용을 입력해 주세요.");
      return;
    }

    if (!adminSecret.trim()) {
      setError("관리자 비밀번호를 입력해 주세요.");
      return;
    }

    setSubmitting(true);

    const selectedCenter = waterCenters.find((w) => w.id === centerId);
    const centerName = selectedCenter ? selectedCenter.name : "본사";

    try {
      const res = await fetch("/api/news", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-admin-secret": adminSecret.trim(),
        },
        body: JSON.stringify({
          centerId,
          centerName,
          title: title.trim(),
          content: content.trim(),
          isPinned,
          imageUrl: imageUrl.trim() || undefined,
        }),
      });

      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        throw new Error(j.error ?? "소식 등록에 실패했습니다.");
      }

      // 비밀번호 기억하기
      if (typeof window !== "undefined") {
        sessionStorage.setItem("kwm_stories_admin_secret", adminSecret.trim());
      }

      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.message ?? "오류가 발생했습니다.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/55 backdrop-blur-sm animate-hero-caption-in">
      <div className="w-full max-w-lg rounded-2xl bg-white border border-slate-200 p-6 shadow-2xl flex flex-col max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h3 className="text-lg font-black text-slate-800">✍️ 새 소식/공지사항 등록</h3>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 text-lg font-bold p-1"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4 text-sm">
          {error && (
            <div className="rounded-xl bg-rose-50 border border-rose-100 p-3.5 text-xs font-semibold text-rose-600 leading-normal">
              ⚠️ {error}
            </div>
          )}

          {/* 대상 문화관 */}
          <div className="flex flex-col gap-1.5">
            <label className="font-bold text-slate-700">작성 대상 (지점)</label>
            <select
              value={centerId}
              onChange={(e) => setCenterId(e.target.value)}
              className="w-full min-h-11 rounded-xl border border-slate-200 bg-slate-50 px-3 font-semibold text-slate-700 focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
            >
              <option value="all">본사 (전체 공통)</option>
              {waterCenters.map((w) => (
                <option key={w.id} value={w.id}>
                  {w.name}
                </option>
              ))}
            </select>
          </div>

          {/* 제목 */}
          <div className="flex flex-col gap-1.5">
            <label className="font-bold text-slate-700">소식 제목</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="공지 또는 알림 제목을 입력해 주세요."
              className="w-full min-h-11 rounded-xl border border-slate-200 px-3 font-semibold text-slate-700 placeholder:text-slate-400 focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
            />
          </div>

          {/* 본문 내용 */}
          <div className="flex flex-col gap-1.5">
            <label className="font-bold text-slate-700">본문 내용</label>
            <textarea
              rows={6}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="안내할 내용을 상세하게 작성해 주세요."
              className="w-full rounded-xl border border-slate-200 px-3 py-2.5 font-medium text-slate-700 placeholder:text-slate-400 focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500 resize-y"
            />
          </div>

          {/* 이미지 URL */}
          <div className="flex flex-col gap-1.5">
            <label className="font-bold text-slate-700 flex items-center gap-1.5">
              <span>대표 이미지 URL (선택)</span>
              <span className="text-[10px] font-medium text-slate-400">외부 이미지 주소 기입 가능</span>
            </label>
            <input
              type="url"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="https://example.com/image.jpg"
              className="w-full min-h-11 rounded-xl border border-slate-200 px-3 font-semibold text-slate-700 placeholder:text-slate-400 focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
            />
          </div>

          {/* 중요 여부 및 관리자 패스워드 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-100">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="isPinned"
                checked={isPinned}
                onChange={(e) => setIsPinned(e.target.checked)}
                className="h-4.5 w-4.5 rounded border-slate-200 text-sky-500 focus:ring-sky-500"
              />
              <label htmlFor="isPinned" className="font-bold text-slate-700 select-none cursor-pointer">
                📌 상단에 중요 공지로 고정
              </label>
            </div>

            <div className="flex flex-col gap-1">
              <label className="font-bold text-slate-700">관리자 비밀번호</label>
              <input
                type="password"
                value={adminSecret}
                onChange={(e) => setAdminSecret(e.target.value)}
                placeholder="비밀번호 입력"
                className="w-full min-h-10 rounded-xl border border-slate-200 px-3 font-semibold text-slate-700 placeholder:text-slate-400 focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
              />
            </div>
          </div>

          {/* 액션 버튼 */}
          <div className="flex items-center justify-end gap-3 pt-3">
            <button
              type="button"
              onClick={onClose}
              disabled={submitting}
              className="min-h-11 rounded-xl border border-slate-200 bg-white px-5 font-bold text-slate-700 hover:bg-slate-50 transition"
            >
              취소
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="min-h-11 rounded-xl bg-sky-500 hover:bg-sky-400 px-6 font-bold text-white transition flex items-center justify-center gap-2"
            >
              {submitting ? "등록 중..." : "✍️ 등록하기"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
