"use client";

import { useState, useEffect } from "react";
import type { Feedback } from "@/types/feedback";

export function AdminFeedbacksPanel({ adminSecret }: { adminSecret: string }) {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Reply Form & Details State
  const [selectedPost, setSelectedPost] = useState<Feedback | null>(null);
  const [replyText, setReplyText] = useState("");
  const [submittingReply, setSubmittingReply] = useState(false);

  const fetchFeedbacks = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/feedbacks");
      if (res.ok) {
        const data = await res.json();
        setFeedbacks(data);
      } else {
        setError("문의 목록을 불러오지 못했습니다.");
      }
    } catch {
      setError("서버와의 통신에 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void fetchFeedbacks();
  }, []);

  const openReplyForm = async (post: Feedback) => {
    setError("");
    try {
      // Load details (including private contents if any, since we have adminSecret)
      const res = await fetch(`/api/feedbacks/${post.id}`, {
        headers: { "x-admin-secret": adminSecret },
      });
      if (!res.ok) {
        throw new Error("문의 글 상세 내역을 불러오지 못했습니다.");
      }
      const data = (await res.json()) as Feedback;
      setSelectedPost(data);
      setReplyText(data.adminReply ?? "");
    } catch (err) {
      setError(err instanceof Error ? err.message : "상세 로드 오류");
    }
  };

  const handleSaveReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPost) return;

    setError("");
    setSubmittingReply(true);

    try {
      const res = await fetch(`/api/feedbacks/${selectedPost.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "x-admin-secret": adminSecret,
        },
        body: JSON.stringify({
          adminReply: replyText.trim() || null,
        }),
      });

      if (!res.ok) {
        const j = await res.json();
        throw new Error(j.error ?? "답변 등록에 실패했습니다.");
      }

      setSelectedPost(null);
      setReplyText("");
      void fetchFeedbacks();
    } catch (err) {
      setError(err instanceof Error ? err.message : "답변 저장 오류");
    } finally {
      setSubmittingReply(false);
    }
  };

  const handleDeletePost = async (id: string) => {
    if (!confirm("이 문의 게시글을 완전히 삭제하시겠습니까? (이 동작은 되돌릴 수 없습니다)")) return;

    setError("");
    try {
      const res = await fetch(`/api/feedbacks/${id}`, {
        method: "DELETE",
        headers: {
          "x-admin-secret": adminSecret,
        },
      });

      if (!res.ok) {
        const j = await res.json();
        throw new Error(j.error ?? "삭제에 실패했습니다.");
      }

      setSelectedPost(null);
      void fetchFeedbacks();
    } catch (err) {
      setError(err instanceof Error ? err.message : "삭제 오류");
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-black text-slate-900">소통창구 및 문의 관리</h2>

      {error && <p className="text-xs font-semibold text-rose-600">{error}</p>}

      {selectedPost ? (
        /* ================= 상세 조회 및 답변 등록 폼 ================= */
        <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 space-y-4">
          <div className="flex justify-between items-start border-b border-slate-100 pb-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="rounded bg-sky-50 text-[10px] font-bold text-sky-700 px-2 py-0.5">
                  {selectedPost.centerName}
                </span>
                {selectedPost.isPrivate && <span className="text-[10px] text-slate-400">🔒 비밀글</span>}
              </div>
              <h3 className="mt-2 text-base font-bold text-slate-800">{selectedPost.title}</h3>
              <p className="mt-1 text-xs text-slate-400">
                작성자: {selectedPost.writerName} | 등록일: {new Date(selectedPost.createdAt).toLocaleString()}
              </p>
            </div>
            <button
              onClick={() => {
                setSelectedPost(null);
                setReplyText("");
              }}
              className="text-xs font-bold text-slate-400 hover:text-slate-600"
            >
              닫기 ✕
            </button>
          </div>

          <div className="py-4 text-sm text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-xl whitespace-pre-wrap">
            {selectedPost.content}
          </div>

          {/* 답변 작성 영역 */}
          <form onSubmit={handleSaveReply} className="space-y-3 pt-3 border-t border-slate-100">
            <label className="text-xs font-bold text-slate-600 block">🛡️ 관리자 답변 작성</label>
            <textarea
              rows={5}
              placeholder="답변 내용을 작성해 주세요. 비워둘 시 답변이 대기중으로 표시됩니다."
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm text-slate-900 outline-none focus:ring-2 focus:ring-sky-500/40"
            />
            <div className="flex justify-between items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => void handleDeletePost(selectedPost.id)}
                className="min-h-11 rounded-xl border border-rose-200 hover:border-rose-300 text-sm font-bold text-rose-600 hover:bg-rose-50 px-4 transition"
              >
                🗑️ 문의글 완전 삭제
              </button>
              <div className="flex gap-2 flex-1 justify-end max-w-sm">
                <button
                  type="button"
                  onClick={() => {
                    setSelectedPost(null);
                    setReplyText("");
                  }}
                  className="min-h-11 rounded-xl bg-slate-100 text-sm font-semibold text-slate-600 hover:bg-slate-200 px-4 transition"
                >
                  취소
                </button>
                <button
                  type="submit"
                  disabled={submittingReply}
                  className="min-h-11 rounded-xl bg-sky-500 text-sm font-bold text-white hover:bg-sky-400 px-5 transition"
                >
                  {submittingReply ? "답변 저장 중..." : "답변 저장 완료"}
                </button>
              </div>
            </div>
          </form>
        </div>
      ) : (
        /* ================= 문의 목록 테이블 ================= */
        <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
          {loading ? (
            <div className="p-10 text-center text-slate-400 text-sm">불러오는 중...</div>
          ) : feedbacks.length === 0 ? (
            <div className="p-10 text-center text-slate-400 text-sm">등록된 문의 건이 없습니다.</div>
          ) : (
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold">
                <tr>
                  <th className="p-3 text-center">비밀</th>
                  <th className="p-3">소속</th>
                  <th className="p-3">제목</th>
                  <th className="p-3">작성자</th>
                  <th className="p-3 text-center">상태</th>
                  <th className="p-3 text-center">등록일</th>
                  <th className="p-3 text-center">답변하기</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {feedbacks.map((post) => (
                  <tr key={post.id} className="hover:bg-slate-50/50">
                    <td className="p-3 text-center text-slate-400 font-bold">{post.isPrivate ? "🔒" : ""}</td>
                    <td className="p-3 font-semibold text-slate-500">{post.centerName}</td>
                    <td className="p-3 font-bold text-slate-800 max-w-[200px] truncate">{post.title}</td>
                    <td className="p-3 font-semibold text-slate-600">{post.writerName}</td>
                    <td className="p-3 text-center">
                      {post.adminReply ? (
                        <span className="rounded bg-emerald-50 border border-emerald-200 text-[10px] text-emerald-700 px-2 py-0.5">
                          답변완료
                        </span>
                      ) : (
                        <span className="rounded bg-slate-100 border border-slate-200 text-[10px] text-slate-500 px-2 py-0.5">
                          대기중
                        </span>
                      )}
                    </td>
                    <td className="p-3 text-center text-slate-400 font-medium">
                      {new Date(post.createdAt).toLocaleDateString()}
                    </td>
                    <td className="p-3 text-center">
                      <button
                        type="button"
                        onClick={() => void openReplyForm(post)}
                        className="rounded border border-slate-200 bg-white hover:bg-slate-100 px-3 py-1.5 text-xs font-semibold"
                      >
                        답변/조회
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
