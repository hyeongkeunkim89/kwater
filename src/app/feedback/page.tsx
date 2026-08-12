"use client";

import { useState, useEffect } from "react";
import { WaterHubHeader } from "@/components/WaterHubHeader";
import { WaterHubFooter } from "@/components/WaterHubFooter";
import { waterCenters } from "@/data/centers";
import type { Feedback } from "@/types/feedback";

export default function FeedbackPage() {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [filterCenter, setFilterCenter] = useState("all");
  const [loading, setLoading] = useState(true);

  // Form State
  const [showWriteModal, setShowWriteModal] = useState(false);
  const [targetCenterId, setTargetCenterId] = useState("all");
  const [title, setTitle] = useState("");
  const [writerType, setWriterType] = useState<"실명" | "익명">("익명");
  const [writerName, setWriterName] = useState("");
  const [password, setPassword] = useState("");
  const [content, setContent] = useState("");
  const [isPrivate, setIsPrivate] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState("");

  // Password Verification State for Private Post detail
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);
  const [privatePostPassword, setPrivatePostPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [verifyingPassword, setVerifyingPassword] = useState(false);
  const [openPasswordModal, setOpenPasswordModal] = useState(false);

  // Detail Modal State
  const [viewPost, setViewPost] = useState<Feedback | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [deletingPostId, setDeletingPostId] = useState<string | null>(null);
  const [deletePassword, setDeletePassword] = useState("");
  const [deleteError, setDeleteError] = useState("");

  // Load Feedbacks
  const fetchFeedbacks = async (center: string) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/feedbacks?center=${center}`);
      if (res.ok) {
        const data = await res.json();
        setFeedbacks(data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void fetchFeedbacks(filterCenter);
  }, [filterCenter]);

  // Submit Feedback
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");

    if (!title.trim() || !content.trim() || !writerName.trim() || !password.trim()) {
      setFormError("모든 필수 입력 정보를 기재해 주세요.");
      return;
    }

    setSubmitting(true);
    const centerObj = waterCenters.find((w) => w.id === targetCenterId);
    const centerName = centerObj ? centerObj.name : "본사";

    try {
      const res = await fetch("/api/feedbacks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          centerId: targetCenterId,
          centerName,
          title,
          content,
          writerType,
          writerName,
          password,
          isPrivate,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error ?? "글을 등록하지 못했습니다.");
      }

      // Success
      setShowWriteModal(false);
      // Reset form
      setTitle("");
      setWriterName("");
      setPassword("");
      setContent("");
      setIsPrivate(false);
      setTargetCenterId("all");
      void fetchFeedbacks(filterCenter);
    } catch (e: unknown) {
      setFormError(e instanceof Error ? e.message : "오류가 발생했습니다.");
    } finally {
      setSubmitting(false);
    }
  };

  // Open feedback detail
  const handleOpenDetail = async (post: Feedback) => {
    if (post.isPrivate) {
      // Prompt password
      setSelectedPostId(post.id);
      setPrivatePostPassword("");
      setPasswordError("");
      setOpenPasswordModal(true);
    } else {
      // Public post, load directly
      try {
        const res = await fetch(`/api/feedbacks/${post.id}`);
        if (res.ok) {
          const detail = await res.json();
          setViewPost(detail);
          setShowDetailModal(true);
        }
      } catch (e) {
        console.error(e);
      }
    }
  };

  // Verify private post password
  const handleVerifyPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError("");
    if (!selectedPostId || !privatePostPassword.trim()) return;

    setVerifyingPassword(true);
    try {
      const res = await fetch(`/api/feedbacks/${selectedPostId}?password=${encodeURIComponent(privatePostPassword)}`);
      const data = await res.json();

      if (!res.ok) {
        setPasswordError(data.error ?? "비밀번호가 올바르지 않습니다.");
        return;
      }

      setViewPost(data);
      // Attach verified password for potential deletion later
      setViewPost((prev) => prev ? { ...prev, password: privatePostPassword } : null);

      setOpenPasswordModal(false);
      setShowDetailModal(true);
    } catch {
      setPasswordError("비밀번호 검증에 실패했습니다.");
    } finally {
      setVerifyingPassword(false);
    }
  };

  // Delete Feedback
  const handleDeletePost = async (e: React.FormEvent) => {
    e.preventDefault();
    setDeleteError("");
    if (!deletingPostId || !deletePassword.trim()) return;

    try {
      const res = await fetch(`/api/feedbacks/${deletingPostId}?password=${encodeURIComponent(deletePassword)}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const data = await res.json();
        setDeleteError(data.error ?? "삭제에 실패했습니다.");
        return;
      }

      setDeletingPostId(null);
      setDeletePassword("");
      setShowDetailModal(false);
      setViewPost(null);
      void fetchFeedbacks(filterCenter);
    } catch {
      setDeleteError("서버와의 통신에 실패했습니다.");
    }
  };

  // Format date helper
  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, "0")}.${String(
      d.getDate()
    ).padStart(2, "0")}`;
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col justify-between">
      <WaterHubHeader activeNav="feedback" />

      {/* 히어로 타이틀 */}
      <div className="relative overflow-hidden bg-gradient-to-r from-sky-50 to-indigo-50 border-b border-slate-200/80 shrink-0">
        <div className="pointer-events-none absolute inset-0" aria-hidden>
          <div className="absolute right-1/4 top-0 h-48 w-48 rounded-full bg-sky-500/5 blur-[80px]" />
        </div>
        <div className="relative mx-auto max-w-7xl px-6 py-12 sm:px-8 text-center sm:text-left flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-sky-600">
              VISITOR CENTER TALK
            </span>
            <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
              소통창구 (문의 및 건의)
            </h1>
            <p className="mt-2 text-sm text-slate-500 leading-relaxed max-w-xl font-semibold">
              물문화관 방문 전 건의사항이나 투어 관련 질의를 자유롭게 남겨주세요. 실명 또는 익명으로 등록할 수 있습니다.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setShowWriteModal(true)}
            className="self-center sm:self-auto inline-flex min-h-12 items-center justify-center rounded-xl bg-sky-500 hover:bg-sky-400 text-sm font-bold text-white px-6 transition shadow-lg shadow-sky-500/10"
          >
            ✍️ 문의글 작성하기
          </button>
        </div>
      </div>

      <main className="mx-auto max-w-7xl w-full px-6 py-10 sm:px-8 flex-1">
        {/* 필터 바 (콤보박스 선택) */}
        <div className="flex flex-col gap-1.5 w-full max-w-xs mb-8">
          <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            문화관 선택
          </label>
          <select
            value={filterCenter}
            onChange={(e) => setFilterCenter(e.target.value)}
            className="min-h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-800 font-semibold outline-none focus:ring-2 focus:ring-sky-500/40"
          >
            <option value="all">전체 문의글</option>
            <option value="headquarters">본사 / 공통</option>
            {waterCenters.map((wc) => (
              <option key={wc.id} value={wc.id}>
                {wc.name}
              </option>
            ))}
          </select>
        </div>

        {/* 게시글 표 리스트 */}
        {loading ? (
          <div className="text-center py-20 text-slate-400">불러오는 중...</div>
        ) : feedbacks.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-200 bg-white py-16 text-center text-slate-400">
            <span className="text-4xl block mb-3">💬</span>
            등록된 의견 및 문의글이 없습니다.
          </div>
        ) : (
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="min-w-full divide-y divide-slate-100">
              <div className="bg-slate-50/70 p-4 font-bold text-xs text-slate-500 grid grid-cols-12 gap-2 text-center uppercase tracking-wider">
                <div className="col-span-2 hidden sm:block">대상 기관</div>
                <div className="col-span-8 sm:col-span-6 text-left px-2">제목</div>
                <div className="col-span-2">작성자</div>
                <div className="col-span-2">답변 여부</div>
                <div className="col-span-2 sm:col-span-2">등록일</div>
              </div>
              <div className="divide-y divide-slate-100 bg-white">
                {feedbacks.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => void handleOpenDetail(item)}
                    className="w-full text-left p-4 grid grid-cols-12 gap-2 items-center text-xs sm:text-sm text-slate-700 hover:bg-slate-50 transition border-none bg-transparent"
                  >
                    <div className="col-span-2 hidden sm:block font-semibold text-slate-500 text-center truncate">
                      {item.centerName}
                    </div>
                    <div className="col-span-8 sm:col-span-6 px-2 flex items-center gap-1.5 min-w-0">
                      {item.isPrivate && (
                        <span className="text-slate-400 shrink-0" aria-label="비밀글">
                          🔒
                        </span>
                      )}
                      <span className="truncate font-bold text-slate-800 hover:text-sky-600">
                        {item.title}
                      </span>
                    </div>
                    <div className="col-span-2 text-center truncate font-medium text-slate-500">
                      {item.writerName}
                    </div>
                    <div className="col-span-2 text-center">
                      {item.adminReply ? (
                        <span className="inline-block rounded bg-emerald-50 text-[10px] font-bold text-emerald-700 px-2 py-0.5 border border-emerald-200">
                          답변완료
                        </span>
                      ) : (
                        <span className="inline-block rounded bg-slate-100 text-[10px] font-bold text-slate-500 px-2 py-0.5 border border-slate-200">
                          대기중
                        </span>
                      )}
                    </div>
                    <div className="col-span-2 sm:col-span-2 text-center text-slate-400 font-medium">
                      {formatDate(item.createdAt)}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ================= 비밀글 패스워드 확인 모달 ================= */}
        {openPasswordModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
            <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl border border-slate-100">
              <h3 className="text-lg font-black text-slate-900">비밀글 조회</h3>
              <p className="mt-1 text-xs text-slate-500">
                작성 시 설정했던 비밀번호를 입력해 주세요.
              </p>
              <form onSubmit={handleVerifyPassword} className="mt-4 space-y-4">
                <input
                  type="password"
                  placeholder="비밀번호"
                  value={privatePostPassword}
                  onChange={(e) => setPrivatePostPassword(e.target.value)}
                  className="min-h-11 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-900 outline-none focus:ring-2 focus:ring-sky-500/40"
                  required
                />
                {passwordError && <p className="text-xs font-semibold text-rose-600">{passwordError}</p>}
                <div className="flex gap-2.5">
                  <button
                    type="button"
                    onClick={() => {
                      setOpenPasswordModal(false);
                      setSelectedPostId(null);
                    }}
                    className="min-h-11 flex-1 rounded-xl bg-slate-100 text-sm font-semibold text-slate-600 hover:bg-slate-200 transition"
                  >
                    취소
                  </button>
                  <button
                    type="submit"
                    disabled={verifyingPassword}
                    className="min-h-11 flex-1 rounded-xl bg-sky-500 text-sm font-bold text-white hover:bg-sky-400 transition"
                  >
                    {verifyingPassword ? "검증중..." : "확인"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ================= 문의글 상세 보기 모달 ================= */}
        {showDetailModal && viewPost && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 overflow-y-auto">
            <div className="w-full max-w-2xl rounded-2xl bg-white p-6 sm:p-8 shadow-xl border border-slate-100 max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-start border-b border-slate-100 pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="rounded bg-sky-50 text-[10px] font-bold text-sky-700 px-2 py-0.5">
                      {viewPost.centerName}
                    </span>
                    {viewPost.isPrivate && <span className="text-[10px]">🔒 비밀글</span>}
                  </div>
                  <h3 className="mt-2 text-xl font-black text-slate-900">{viewPost.title}</h3>
                  <p className="mt-1 text-xs text-slate-400">
                    작성자: {viewPost.writerName} ({viewPost.writerType}) | 등록일: {formatDate(viewPost.createdAt)}
                  </p>
                </div>
                <button
                  onClick={() => {
                    setShowDetailModal(false);
                    setViewPost(null);
                    setDeletingPostId(null);
                  }}
                  className="p-1 text-slate-400 hover:text-slate-600 transition"
                >
                  ✕
                </button>
              </div>

              {/* 본문 */}
              <div className="py-6 text-sm sm:text-base text-slate-700 leading-relaxed whitespace-pre-wrap">
                {viewPost.content}
              </div>

              {/* 관리자 답변 */}
              <div className="mt-4 p-5 rounded-xl bg-slate-50 border border-slate-100">
                <h4 className="text-xs font-black text-slate-500 uppercase tracking-wider mb-2">
                  🛡️ 관리자 답변
                </h4>
                {viewPost.adminReply ? (
                  <div className="text-sm text-slate-800 leading-relaxed whitespace-pre-wrap">
                    {viewPost.adminReply}
                    <span className="block mt-3 text-[10px] text-slate-400 font-medium">
                      답변일: {formatDate(viewPost.adminRepliedAt ?? "")}
                    </span>
                  </div>
                ) : (
                  <p className="text-sm text-slate-400 italic">
                    아직 관리자 답변이 등록되지 않았습니다. 잠시만 기다려 주세요.
                  </p>
                )}
              </div>

              {/* 글 삭제 전용 */}
              <div className="mt-6 pt-5 border-t border-slate-100 flex flex-col gap-3">
                {deletingPostId === viewPost.id ? (
                  <form onSubmit={handleDeletePost} className="bg-rose-50 p-4 rounded-xl border border-rose-100">
                    <p className="text-xs font-bold text-rose-950 mb-2">
                      게시글 비밀번호를 입력해 주시면 즉시 삭제됩니다.
                    </p>
                    <div className="flex gap-2">
                      <input
                        type="password"
                        placeholder="게시글 비밀번호"
                        value={deletePassword}
                        onChange={(e) => setDeletePassword(e.target.value)}
                        className="min-h-10 flex-1 rounded-lg border border-slate-200 px-3 text-xs outline-none bg-white text-slate-900"
                        required
                      />
                      <button
                        type="submit"
                        className="min-h-10 rounded-lg bg-rose-600 px-4 text-xs font-bold text-white hover:bg-rose-500 transition"
                      >
                        삭제 승인
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setDeletingPostId(null);
                          setDeletePassword("");
                        }}
                        className="min-h-10 rounded-lg bg-slate-200 px-3 text-xs font-bold text-slate-700 hover:bg-slate-300 transition"
                      >
                        취소
                      </button>
                    </div>
                    {deleteError && <p className="mt-2 text-xs font-semibold text-rose-600">{deleteError}</p>}
                  </form>
                ) : (
                  <div className="flex justify-between items-center">
                    <button
                      onClick={() => setDeletingPostId(viewPost.id)}
                      className="min-h-10 text-xs font-bold text-rose-600 hover:text-rose-500 transition"
                    >
                      🗑️ 게시글 삭제 요청
                    </button>
                    <button
                      onClick={() => {
                        setShowDetailModal(false);
                        setViewPost(null);
                      }}
                      className="min-h-10 rounded-lg bg-slate-900 hover:bg-slate-800 text-xs font-bold text-white px-4 transition"
                    >
                      닫기
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ================= 문의글 작성 모달 ================= */}
        {showWriteModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 overflow-y-auto">
            <div className="w-full max-w-xl rounded-2xl bg-white p-6 sm:p-8 shadow-xl border border-slate-100 max-h-[95vh] overflow-y-auto">
              <div className="flex justify-between items-start border-b border-slate-100 pb-4 mb-6">
                <div>
                  <h3 className="text-lg font-black text-slate-900">✍️ 소통창구 의견 남기기</h3>
                  <p className="mt-1 text-xs text-slate-500">
                    물문화관 운영 개선 건의나 투어 관련 의견을 기재해 주세요.
                  </p>
                </div>
                <button
                  onClick={() => {
                    setShowWriteModal(false);
                    setFormError("");
                  }}
                  className="p-1 text-slate-400 hover:text-slate-600 transition"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* 대상 문화관 */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-600">대상 물문화관</label>
                  <select
                    value={targetCenterId}
                    onChange={(e) => setTargetCenterId(e.target.value)}
                    className="min-h-11 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:ring-2 focus:ring-sky-500/40"
                  >
                    <option value="all">본사 / 전체 공통 문의</option>
                    {waterCenters.map((wc) => (
                      <option key={wc.id} value={wc.id}>
                        {wc.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* 작성자 구분 및 이름 */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-slate-600">작성 방식</label>
                    <div className="flex gap-4 p-2 bg-slate-50 rounded-xl border border-slate-200/60 min-h-11 items-center">
                      <label className="flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-slate-700 cursor-pointer">
                        <input
                          type="radio"
                          name="writerType"
                          value="익명"
                          checked={writerType === "익명"}
                          onChange={() => setWriterType("익명")}
                          className="text-sky-500 focus:ring-sky-400"
                        />
                        익명 게시
                      </label>
                      <label className="flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-slate-700 cursor-pointer">
                        <input
                          type="radio"
                          name="writerType"
                          value="실명"
                          checked={writerType === "실명"}
                          onChange={() => setWriterType("실명")}
                          className="text-sky-500 focus:ring-sky-400"
                        />
                        실명 게시
                      </label>
                    </div>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-slate-600">
                      {writerType === "익명" ? "익명 작성명 (필명)" : "실명 작성자 이름"}
                    </label>
                    <input
                      type="text"
                      placeholder={writerType === "익명" ? "예: 물사랑이" : "예: 홍길동"}
                      value={writerName}
                      onChange={(e) => setWriterName(e.target.value)}
                      maxLength={12}
                      className="min-h-11 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-900 outline-none focus:ring-2 focus:ring-sky-500/40"
                      required
                    />
                  </div>
                </div>

                {/* 비밀번호 */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-600">게시글 관리용 비밀번호</label>
                  <input
                    type="password"
                    placeholder="비밀글 조회 및 본인 삭제 시 검증에 사용됩니다."
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="min-h-11 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-900 outline-none focus:ring-2 focus:ring-sky-500/40"
                    required
                  />
                </div>

                {/* 제목 */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-600">제목</label>
                  <input
                    type="text"
                    placeholder="의견 요약 제목"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    maxLength={100}
                    className="min-h-11 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-900 outline-none focus:ring-2 focus:ring-sky-500/40"
                    required
                  />
                </div>

                {/* 본문 */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-600">의견 및 문의 내용</label>
                  <textarea
                    rows={6}
                    placeholder="방문 일시, 문의 내용, 제안 사항 등을 자세히 작성해 주세요."
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm text-slate-900 outline-none focus:ring-2 focus:ring-sky-500/40"
                    required
                  />
                </div>

                {/* 비밀글 체크 */}
                <div className="p-2 border border-slate-100 rounded-xl bg-slate-50/50">
                  <label className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isPrivate}
                      onChange={(e) => setIsPrivate(e.target.checked)}
                      className="rounded border-slate-300 text-sky-500 focus:ring-sky-400"
                    />
                    🔒 비밀글로 등록하기 (작성자와 관리자만 조회 가능)
                  </label>
                </div>

                {formError && <p className="text-xs font-semibold text-rose-600">{formError}</p>}

                {/* 제출/취소 */}
                <div className="flex gap-3 pt-4 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => {
                      setShowWriteModal(false);
                      setFormError("");
                    }}
                    className="min-h-11 flex-1 rounded-xl bg-slate-100 text-sm font-semibold text-slate-600 hover:bg-slate-200 transition"
                  >
                    작성 취소
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="min-h-11 flex-1 rounded-xl bg-sky-500 text-sm font-bold text-white hover:bg-sky-400 transition"
                  >
                    {submitting ? "등록 중..." : "제출하기"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>

      <WaterHubFooter />
    </div>
  );
}
