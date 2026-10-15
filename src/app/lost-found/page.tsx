"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { WaterHubHeader } from "@/components/WaterHubHeader";
import { WaterHubFooter } from "@/components/WaterHubFooter";
import { waterCenters } from "@/data/centers";
import type { LostFoundItem, LostFoundType } from "@/types/lostFound";

export default function LostFoundPage() {
  const [items, setItems] = useState<LostFoundItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [selectedCenter, setSelectedCenter] = useState("all");
  const [selectedType, setSelectedType] = useState("all");
  const [searchKeyword, setSearchKeyword] = useState("");

  // Write Modal State
  const [showWriteModal, setShowWriteModal] = useState(false);
  const [postType, setPostType] = useState<LostFoundType>("분실");
  const [centerId, setCenterId] = useState(waterCenters[0]?.id ?? "han-river");
  const [title, setTitle] = useState("");
  const [itemName, setItemName] = useState("");
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [place, setPlace] = useState("");
  const [content, setContent] = useState("");
  const [writerName, setWriterName] = useState("");
  const [contact, setContact] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState("");

  // Detail Modal State
  const [detailItem, setDetailItem] = useState<LostFoundItem | null>(null);
  const [deletePassword, setDeletePassword] = useState("");
  const [deleteError, setDeleteError] = useState("");
  const [deleting, setDeleting] = useState(false);

  // Load items
  const fetchItems = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (selectedCenter !== "all") params.set("center", selectedCenter);
      if (selectedType !== "all") params.set("type", selectedType);
      if (searchKeyword.trim()) params.set("search", searchKeyword.trim());

      const res = await fetch(`/api/lost-found?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setItems(data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void fetchItems();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCenter, selectedType]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    void fetchItems();
  };

  // Submit new item
  const handleWriteSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");

    if (!title.trim() || !itemName.trim() || !place.trim() || !content.trim() || !writerName.trim() || !password.trim()) {
      setFormError("모든 필수 입력 항목을 작성해 주세요.");
      return;
    }

    setSubmitting(true);
    const centerObj = waterCenters.find((w) => w.id === centerId);
    const centerName = centerObj ? centerObj.name : "K-water 물문화관";

    try {
      const res = await fetch("/api/lost-found", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: postType,
          centerId,
          centerName,
          title: title.trim(),
          itemName: itemName.trim(),
          date,
          place: place.trim(),
          content: content.trim(),
          writerName: writerName.trim(),
          contact: contact.trim() || undefined,
          password: password.trim(),
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error ?? "게시글 등록에 실패했습니다.");
      }

      // Success
      setShowWriteModal(false);
      setTitle("");
      setItemName("");
      setPlace("");
      setContent("");
      setWriterName("");
      setContact("");
      setPassword("");
      void fetchItems();
    } catch (err: unknown) {
      setFormError(err instanceof Error ? err.message : "등록에 실패했습니다.");
    } finally {
      setSubmitting(false);
    }
  };

  // Delete item
  const handleDeleteSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!detailItem) return;
    setDeleteError("");
    setDeleting(true);

    try {
      const res = await fetch("/api/lost-found", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: detailItem.id,
          password: deletePassword.trim(),
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error ?? "삭제할 수 없습니다.");
      }

      setDetailItem(null);
      setDeletePassword("");
      void fetchItems();
    } catch (err: unknown) {
      setDeleteError(err instanceof Error ? err.message : "삭제 중 오류가 발생했습니다.");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col selection:bg-sky-500 selection:text-white">
      <WaterHubHeader activeNav="intro" />

      {/* 상단 배너 헤더 */}
      <section className="relative overflow-hidden bg-gradient-to-r from-[#003876] via-[#004D95] to-[#1E6BBA] text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]" />
        <div className="relative mx-auto max-w-5xl">
          <div className="flex items-center gap-2 text-xs font-semibold text-sky-200 mb-3">
            <Link href="/" className="hover:text-white transition">홈</Link>
            <span>›</span>
            <span className="text-white">분실물찾기</span>
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-white">
            분실물찾기
          </h1>
          <p className="mt-2.5 text-sm sm:text-base text-sky-100 max-w-none leading-relaxed break-keep">
            전국 K-water 물문화관 내 분실물 및 습득물에 대한 안내와 문의를 확인하실 수 있습니다.
          </p>
        </div>
      </section>

      {/* 본문 콘텐츠 컨테이너 */}
      <main className="flex-1 py-10 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl bg-white rounded-2xl shadow-xs border border-slate-200/80 p-6 sm:p-10 lg:p-12">
          
          {/* 상단 주의사항 공지 박스 (리버가이드 원본 기준) */}
          <div className="rounded-xl border border-rose-200 bg-rose-50/60 p-4 sm:p-5 mb-8 text-xs sm:text-sm leading-relaxed text-slate-700">
            <div className="flex items-start gap-2.5 text-rose-700 font-bold mb-1.5">
              <span>⚠️</span>
              <span>게시판 이용 안내 및 주의사항</span>
            </div>
            <p className="text-slate-600 pl-6 break-keep">
              • 광고성, 선정적, 인신공격, 비방 등의 게시물은 작성자에게 사전 통보 없이 삭제될 수 있습니다.<br />
              • 물문화관 방문 중 물건을 분실하셨거나 습득하신 경우 해당 물문화관 안내데스크 또는 본 게시판을 통해 등록해 주시기 바랍니다.<br />
              • 습득물 수령 시 본인 확인을 위해 신분증 확인 절차가 진행될 수 있습니다.
            </p>
          </div>

          {/* 검색 및 필터 바 */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            
            {/* 구분 및 물문화관 선택 */}
            <div className="flex flex-wrap items-center gap-2">
              <div className="inline-flex rounded-lg border border-slate-200 p-1 bg-slate-50">
                <button
                  type="button"
                  onClick={() => setSelectedType("all")}
                  className={`px-3 py-1.5 rounded-md text-xs font-bold transition ${
                    selectedType === "all" ? "bg-white text-[#004D95] shadow-xs" : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  전체
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedType("분실")}
                  className={`px-3 py-1.5 rounded-md text-xs font-bold transition ${
                    selectedType === "분실" ? "bg-rose-50 text-rose-700 shadow-xs" : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  🔍 분실물
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedType("습득")}
                  className={`px-3 py-1.5 rounded-md text-xs font-bold transition ${
                    selectedType === "습득" ? "bg-emerald-50 text-emerald-700 shadow-xs" : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  📦 습득물
                </button>
              </div>

              <select
                value={selectedCenter}
                onChange={(e) => setSelectedCenter(e.target.value)}
                className="text-xs sm:text-sm font-semibold rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-700 focus:outline-none focus:border-[#004D95]"
              >
                <option value="all">전체 물문화관</option>
                {waterCenters.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>

            {/* 검색 및 글쓰기 버튼 */}
            <div className="flex items-center gap-2">
              <form onSubmit={handleSearchSubmit} className="flex items-center gap-1.5 flex-1 sm:flex-initial">
                <input
                  type="text"
                  placeholder="제목, 물품명, 작성자 검색"
                  value={searchKeyword}
                  onChange={(e) => setSearchKeyword(e.target.value)}
                  className="w-full sm:w-56 text-xs sm:text-sm rounded-lg border border-slate-300 px-3 py-2 focus:outline-none focus:border-[#004D95]"
                />
                <button
                  type="submit"
                  className="px-3.5 py-2 rounded-lg bg-slate-800 text-white text-xs font-bold hover:bg-slate-700 transition shrink-0"
                >
                  검색
                </button>
              </form>

              <button
                type="button"
                onClick={() => setShowWriteModal(true)}
                className="px-4 py-2 rounded-lg bg-[#004D95] text-white text-xs sm:text-sm font-bold hover:bg-[#003876] transition shadow-xs shrink-0 flex items-center gap-1"
              >
                <span>✏️ 글쓰기</span>
              </button>
            </div>
          </div>

          {/* 총 건수 표시 */}
          <div className="flex items-center justify-between text-xs text-slate-500 mb-3 px-1">
            <span>총 <strong className="text-slate-900 font-bold">{items.length}</strong>건의 게시물이 등록되어 있습니다.</span>
          </div>

          {/* 게시글 목록 - 데스크톱 테이블 */}
          <div className="hidden sm:block overflow-hidden rounded-xl border border-slate-200">
            <table className="w-full text-left text-xs sm:text-sm border-collapse">
              <thead className="bg-slate-100/80 text-slate-700 border-b border-slate-200 text-center font-bold">
                <tr>
                  <th className="py-3 px-3 w-14">번호</th>
                  <th className="py-3 px-3 w-20">구분</th>
                  <th className="py-3 px-4 w-32">문화관</th>
                  <th className="py-3 px-4 text-left">제목</th>
                  <th className="py-3 px-3 w-24">작성자</th>
                  <th className="py-3 px-3 w-28">작성일</th>
                  <th className="py-3 px-3 w-24">상태</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {loading ? (
                  <tr>
                    <td colSpan={7} className="text-center py-12 text-slate-400">
                      게시물을 불러오는 중입니다...
                    </td>
                  </tr>
                ) : items.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-16 text-slate-400">
                      등록된 분실·습득물 게시글이 없습니다.
                    </td>
                  </tr>
                ) : (
                  items.map((item, idx) => (
                    <tr
                      key={item.id}
                      onClick={() => setDetailItem(item)}
                      className="hover:bg-slate-50/80 cursor-pointer transition text-center"
                    >
                      <td className="py-3.5 px-3 text-slate-400 font-mono text-xs">
                        {items.length - idx}
                      </td>
                      <td className="py-3.5 px-3">
                        <span
                          className={`inline-block px-2 py-0.5 rounded-full text-[11px] font-bold ${
                            item.type === "분실"
                              ? "bg-rose-100 text-rose-700 border border-rose-200"
                              : "bg-emerald-100 text-emerald-700 border border-emerald-200"
                          }`}
                        >
                          {item.type}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 font-medium text-slate-600 truncate max-w-[130px]">
                        {item.centerName}
                      </td>
                      <td className="py-3.5 px-4 text-left font-semibold text-slate-900 truncate max-w-[280px]">
                        {item.title}
                      </td>
                      <td className="py-3.5 px-3 text-slate-600">
                        {item.writerName}
                      </td>
                      <td className="py-3.5 px-3 text-slate-400 text-xs">
                        {item.date}
                      </td>
                      <td className="py-3.5 px-3">
                        <span
                          className={`inline-block px-2 py-0.5 rounded-md text-[11px] font-semibold ${
                            item.status === "수령완료"
                              ? "bg-slate-100 text-slate-500"
                              : item.status === "보관중"
                              ? "bg-sky-100 text-sky-800 font-bold"
                              : "bg-amber-100 text-amber-800 font-bold"
                          }`}
                        >
                          {item.status}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* 게시글 목록 - 모바일 카드 뷰 (320px~430px 최적화) */}
          <div className="sm:hidden space-y-3">
            {loading ? (
              <div className="text-center py-10 text-xs text-slate-400">불러오는 중...</div>
            ) : items.length === 0 ? (
              <div className="text-center py-12 text-xs text-slate-400">등록된 게시글이 없습니다.</div>
            ) : (
              items.map((item) => (
                <div
                  key={item.id}
                  onClick={() => setDetailItem(item)}
                  className="p-4 rounded-xl border border-slate-200 bg-white hover:border-[#004D95] transition cursor-pointer shadow-xs active:bg-slate-50"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-1.5">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          item.type === "분실" ? "bg-rose-100 text-rose-700" : "bg-emerald-100 text-emerald-700"
                        }`}
                      >
                        {item.type}
                      </span>
                      <span className="text-xs font-semibold text-slate-600">{item.centerName}</span>
                    </div>
                    <span
                      className={`text-[10px] px-1.5 py-0.5 rounded font-semibold ${
                        item.status === "수령완료" ? "bg-slate-100 text-slate-500" : "bg-sky-100 text-sky-800"
                      }`}
                    >
                      {item.status}
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-slate-900 mb-1.5 line-clamp-2">
                    {item.title}
                  </h4>
                  <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-100">
                    <span>작성자: {item.writerName}</span>
                    <span>{item.date}</span>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* 하단 주요 물문화관 안내데스크 직통 연락처 박스 */}
          <div className="mt-12 rounded-xl border border-sky-100 bg-sky-50/50 p-5 sm:p-6">
            <h3 className="text-sm sm:text-base font-bold text-[#003876] mb-2 flex items-center gap-2">
              <span>🏛️ 전국 물문화관 안내데스크 유선 문의</span>
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-4 break-keep">
              당일 분실물 또는 긴급 습득물 확인이 필요하신 경우, 방문하신 해당 물문화관 안내데스크로 유선 문의하시면 신속히 확인해 드립니다.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 text-xs">
              <div className="p-2.5 rounded-lg bg-white border border-slate-200 flex items-center justify-between">
                <span className="font-semibold text-slate-800">한강물문화관</span>
                <a href="tel:031-880-6200" className="text-[#004D95] font-bold hover:underline">031-880-6200</a>
              </div>
              <div className="p-2.5 rounded-lg bg-white border border-slate-200 flex items-center justify-between">
                <span className="font-semibold text-slate-800">금강문화관</span>
                <a href="tel:041-830-0600" className="text-[#004D95] font-bold hover:underline">041-830-0600</a>
              </div>
              <div className="p-2.5 rounded-lg bg-white border border-slate-200 flex items-center justify-between">
                <span className="font-semibold text-slate-800">영산강문화관</span>
                <a href="tel:061-335-0866" className="text-[#004D95] font-bold hover:underline">061-335-0866</a>
              </div>
              <div className="p-2.5 rounded-lg bg-white border border-slate-200 flex items-center justify-between">
                <span className="font-semibold text-slate-800">디아크 문화관</span>
                <a href="tel:053-667-2700" className="text-[#004D95] font-bold hover:underline">053-667-2700</a>
              </div>
              <div className="p-2.5 rounded-lg bg-white border border-slate-200 flex items-center justify-between">
                <span className="font-semibold text-slate-800">낙동강문화관</span>
                <a href="tel:051-201-0884" className="text-[#004D95] font-bold hover:underline">051-201-0884</a>
              </div>
              <div className="p-2.5 rounded-lg bg-white border border-slate-200 flex items-center justify-between">
                <span className="font-semibold text-slate-800">K-water 고객센터</span>
                <a href="tel:1577-0600" className="text-[#004D95] font-bold hover:underline">1577-0600</a>
              </div>
            </div>
          </div>

        </div>
      </main>

      {/* 1. 글쓰기 모달 */}
      {showWriteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl w-full max-w-lg p-6 sm:p-8 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-5 pb-3 border-b border-slate-100">
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <span>✏️ 분실·습득물 등록</span>
              </h3>
              <button
                type="button"
                onClick={() => setShowWriteModal(false)}
                className="text-slate-400 hover:text-slate-600 text-lg p-1"
              >
                ✕
              </button>
            </div>

            {formError && (
              <div className="mb-4 p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold">
                {formError}
              </div>
            )}

            <form onSubmit={handleWriteSubmit} className="space-y-4 text-xs sm:text-sm">
              {/* 구분 선택 */}
              <div>
                <label className="block font-bold text-slate-700 mb-1.5">구분 <span className="text-rose-500">*</span></label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setPostType("분실")}
                    className={`py-2 rounded-lg font-bold border transition ${
                      postType === "분실"
                        ? "bg-rose-50 border-rose-400 text-rose-700 shadow-xs"
                        : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    🔍 분실물 등록 (찾습니다)
                  </button>
                  <button
                    type="button"
                    onClick={() => setPostType("습득")}
                    className={`py-2 rounded-lg font-bold border transition ${
                      postType === "습득"
                        ? "bg-emerald-50 border-emerald-400 text-emerald-700 shadow-xs"
                        : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    📦 습득물 신고 (보관중)
                  </button>
                </div>
              </div>

              {/* 물문화관 선택 */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">해당 물문화관 <span className="text-rose-500">*</span></label>
                <select
                  value={centerId}
                  onChange={(e) => setCenterId(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 p-2.5 text-slate-800 focus:outline-none focus:border-[#004D95]"
                >
                  {waterCenters.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>

              {/* 제목 */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">제목 <span className="text-rose-500">*</span></label>
                <input
                  type="text"
                  placeholder="예: 디아크 2층 카페테리아 지갑 분실"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 p-2.5 focus:outline-none focus:border-[#004D95]"
                  required
                />
              </div>

              {/* 물품명 및 분실일 */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">물품명 <span className="text-rose-500">*</span></label>
                  <input
                    type="text"
                    placeholder="예: 검정색 가죽 지갑"
                    value={itemName}
                    onChange={(e) => setItemName(e.target.value)}
                    className="w-full rounded-lg border border-slate-300 p-2.5 focus:outline-none focus:border-[#004D95]"
                    required
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">발생일자 <span className="text-rose-500">*</span></label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full rounded-lg border border-slate-300 p-2.5 focus:outline-none focus:border-[#004D95]"
                    required
                  />
                </div>
              </div>

              {/* 세부 장소 */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">발생 장소 <span className="text-rose-500">*</span></label>
                <input
                  type="text"
                  placeholder="예: 2층 전망대 벤치, 야외 자전거 거치대 등"
                  value={place}
                  onChange={(e) => setPlace(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 p-2.5 focus:outline-none focus:border-[#004D95]"
                  required
                />
              </div>

              {/* 상세 내용 */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">상세 내용 <span className="text-rose-500">*</span></label>
                <textarea
                  rows={4}
                  placeholder="물품의 특징, 색상, 분실 당시의 상황 등을 상세히 기재해 주세요."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 p-2.5 focus:outline-none focus:border-[#004D95]"
                  required
                />
              </div>

              {/* 작성자 정보 및 비밀번호 */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-slate-100">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">작성자명 <span className="text-rose-500">*</span></label>
                  <input
                    type="text"
                    placeholder="예: 홍길동"
                    value={writerName}
                    onChange={(e) => setWriterName(e.target.value)}
                    className="w-full rounded-lg border border-slate-300 p-2.5 focus:outline-none focus:border-[#004D95]"
                    required
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">연락처 (선택)</label>
                  <input
                    type="text"
                    placeholder="010-0000-0000"
                    value={contact}
                    onChange={(e) => setContact(e.target.value)}
                    className="w-full rounded-lg border border-slate-300 p-2.5 focus:outline-none focus:border-[#004D95]"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">비밀번호 <span className="text-rose-500">*</span></label>
                  <input
                    type="password"
                    placeholder="삭제용 숫자 4자리"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full rounded-lg border border-slate-300 p-2.5 focus:outline-none focus:border-[#004D95]"
                    required
                  />
                </div>
              </div>

              <div className="pt-4 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowWriteModal(false)}
                  className="px-4 py-2.5 rounded-lg border border-slate-300 text-slate-700 font-semibold hover:bg-slate-50 transition"
                >
                  취소
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2.5 rounded-lg bg-[#004D95] text-white font-bold hover:bg-[#003876] transition shadow-xs disabled:opacity-50"
                >
                  {submitting ? "등록 중..." : "게시글 등록"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 2. 상세 조회 모달 */}
      {detailItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl w-full max-w-lg p-6 sm:p-8 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            
            <div className="flex items-start justify-between gap-3 mb-4 pb-3 border-b border-slate-100">
              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <span
                    className={`px-2.5 py-0.5 rounded-md text-xs font-bold ${
                      detailItem.type === "분실" ? "bg-rose-100 text-rose-700" : "bg-emerald-100 text-emerald-700"
                    }`}
                  >
                    {detailItem.type}
                  </span>
                  <span className="text-xs font-semibold text-slate-500">{detailItem.centerName}</span>
                </div>
                <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
                  {detailItem.title}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => {
                  setDetailItem(null);
                  setDeletePassword("");
                  setDeleteError("");
                }}
                className="text-slate-400 hover:text-slate-600 text-lg p-1 shrink-0"
              >
                ✕
              </button>
            </div>

            {/* 상세 스펙 테이블 */}
            <div className="rounded-xl bg-slate-50 p-4 border border-slate-100 text-xs sm:text-sm space-y-2 mb-4">
              <div className="flex">
                <span className="w-24 text-slate-400 font-medium">물품명</span>
                <span className="font-semibold text-slate-800">{detailItem.itemName}</span>
              </div>
              <div className="flex">
                <span className="w-24 text-slate-400 font-medium">발생일자</span>
                <span className="text-slate-700">{detailItem.date}</span>
              </div>
              <div className="flex">
                <span className="w-24 text-slate-400 font-medium">발생장소</span>
                <span className="text-slate-700">{detailItem.place}</span>
              </div>
              <div className="flex">
                <span className="w-24 text-slate-400 font-medium">작성자</span>
                <span className="text-slate-700">{detailItem.writerName}</span>
              </div>
              {detailItem.contact && (
                <div className="flex">
                  <span className="w-24 text-slate-400 font-medium">연락처</span>
                  <span className="text-slate-700">{detailItem.contact}</span>
                </div>
              )}
            </div>

            {/* 본문 내용 */}
            <div className="p-4 rounded-xl border border-slate-200 bg-white min-h-[100px] text-xs sm:text-sm text-slate-800 leading-relaxed whitespace-pre-wrap mb-6">
              {detailItem.content}
            </div>

            {/* 삭제 및 닫기 바 */}
            <div className="pt-4 border-t border-slate-100">
              <form onSubmit={handleDeleteSubmit} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-1.5 flex-1">
                  <input
                    type="password"
                    placeholder="비밀번호 입력 시 삭제"
                    value={deletePassword}
                    onChange={(e) => setDeletePassword(e.target.value)}
                    className="w-full sm:w-40 text-xs rounded-lg border border-slate-300 p-2 focus:outline-none focus:border-rose-500"
                  />
                  <button
                    type="submit"
                    disabled={deleting || !deletePassword}
                    className="px-3 py-2 rounded-lg bg-rose-600 text-white text-xs font-bold hover:bg-rose-700 transition disabled:opacity-40 shrink-0"
                  >
                    {deleting ? "삭제 중" : "삭제"}
                  </button>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setDetailItem(null);
                    setDeletePassword("");
                    setDeleteError("");
                  }}
                  className="px-4 py-2 rounded-lg border border-slate-200 text-slate-600 text-xs font-semibold hover:bg-slate-50 transition"
                >
                  닫기
                </button>
              </form>
              {deleteError && (
                <p className="mt-2 text-xs font-semibold text-rose-600">{deleteError}</p>
              )}
            </div>

          </div>
        </div>
      )}

      <WaterHubFooter />
    </div>
  );
}
