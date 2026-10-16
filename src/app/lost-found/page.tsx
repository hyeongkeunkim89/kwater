"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { WaterHubHeader } from "@/components/WaterHubHeader";
import { WaterHubFooter } from "@/components/WaterHubFooter";
import { waterCenters } from "@/data/centers";
import type { LostFoundItem, LostFoundType } from "@/types/lostFound";

// 강문화관 5개소 + 댐 물문화관 15개소 통합 목록
export const LOST_FOUND_CENTERS = [
  { id: "the-arc", name: "디아크 문화관" },
  { id: "han-river", name: "한강물문화관" },
  { id: "geum-river", name: "금강문화관" },
  { id: "yeongsan-river", name: "영산강문화관" },
  { id: "nakdong-river", name: "낙동강문화관" },
  ...waterCenters.map((c) => ({ id: c.id, name: c.name })),
];

const CENTER_TEL_MAP: Record<string, string> = {
  // 4대강 문화관 (공식 안내데스크 직통)
  "the-arc": "053-585-0916",
  "han-river": "031-880-6242",
  "geum-river": "041-835-1529",
  "yeongsan-river": "061-335-0866",
  "nakdong-river": "051-292-1042",

  // 전국 15대 댐 물문화관 (K-water 공식 홈페이지 기준 물문화관 안내데스크 직통)
  soyang: "033-259-7309",
  chungju: "043-846-6482",
  daecheong: "042-930-7332",
  andong: "054-850-4229",
  "peace-dam": "033-480-1511",
  hoengseong: "033-340-0255",
  hapcheon: "055-930-5240",
  yongdam: "063-430-4263",
  juam: "061-749-7190",
  jangheung: "061-860-3302",
  buan: "063-580-3273",
  hantan: "031-830-4243",
  namgang: "055-760-1266",
  miryang: "055-359-3271",
  gimcheon: "054-420-2635",
};

function getCenterPhone(centerId?: string, centerName?: string) {
  if (centerId && CENTER_TEL_MAP[centerId]) return CENTER_TEL_MAP[centerId];
  if (centerName?.includes("한강")) return "031-880-6242";
  if (centerName?.includes("금강")) return "041-835-1529";
  if (centerName?.includes("영산강")) return "061-335-0866";
  if (centerName?.includes("디아크")) return "053-585-0916";
  if (centerName?.includes("낙동강")) return "051-292-1042";
  if (centerName?.includes("소양강")) return "033-259-7309";
  if (centerName?.includes("충주")) return "043-846-6482";
  if (centerName?.includes("대청")) return "042-930-7332";
  if (centerName?.includes("안동")) return "054-850-4229";
  if (centerName?.includes("평화")) return "033-480-1511";
  if (centerName?.includes("횡성")) return "033-340-0255";
  if (centerName?.includes("합천")) return "055-930-5240";
  if (centerName?.includes("용담")) return "063-430-4263";
  if (centerName?.includes("주암")) return "061-749-7190";
  if (centerName?.includes("장흥")) return "061-860-3302";
  if (centerName?.includes("부안")) return "063-580-3273";
  if (centerName?.includes("한탄강")) return "031-830-4243";
  if (centerName?.includes("남강")) return "055-760-1266";
  if (centerName?.includes("밀양")) return "055-359-3271";
  if (centerName?.includes("김천") || centerName?.includes("부항")) return "054-420-2635";
  return "1577-0600";
}

function formatPhoneNumber(val: string): string {
  const digits = val.replace(/\D/g, "").slice(0, 11);
  if (digits.length <= 3) return digits;
  if (digits.length <= 7) return `${digits.slice(0, 3)}-${digits.slice(3)}`;
  return `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7)}`;
}

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
  const [centerId, setCenterId] = useState(LOST_FOUND_CENTERS[0]?.id ?? "the-arc");
  const [title, setTitle] = useState("");
  const [itemName, setItemName] = useState("");
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [place, setPlace] = useState("");
  const [content, setContent] = useState("");
  const [writerName, setWriterName] = useState("");
  const [contact, setContact] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState("");

  // Detail Modal State
  const [detailItem, setDetailItem] = useState<LostFoundItem | null>(null);
  const [deletePassword, setDeletePassword] = useState("");
  const [showDeletePassword, setShowDeletePassword] = useState(false);
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
    document.title = "분실물찾기 | K-water 온라인 물문화관";
  }, []);

  useEffect(() => {
    void fetchItems();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCenter, selectedType]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    void fetchItems();
  };

  // Open write modal with clean reset
  const handleOpenWriteModal = () => {
    setPostType("분실");
    setCenterId(LOST_FOUND_CENTERS[0]?.id ?? "the-arc");
    setTitle("");
    setItemName("");
    setDate(new Date().toISOString().slice(0, 10));
    setPlace("");
    setContent("");
    setWriterName("");
    setContact("");
    setPassword("");
    setShowPassword(false);
    setFormError("");
    setShowWriteModal(true);
  };

  // Close write modal and purge all form state
  const handleCloseWriteModal = () => {
    setShowWriteModal(false);
    setTitle("");
    setItemName("");
    setPlace("");
    setContent("");
    setWriterName("");
    setContact("");
    setPassword("");
    setShowPassword(false);
    setFormError("");
  };

  // Submit new item
  const handleWriteSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");

    if (!title.trim() || !itemName.trim() || !place.trim() || !content.trim() || !writerName.trim() || !password.trim()) {
      setFormError("모든 필수 입력 항목을 작성해 주세요.");
      return;
    }

    if (password.trim().length < 4) {
      setFormError("비밀번호는 숫자 4자리 이상 입력해 주세요.");
      return;
    }

    setSubmitting(true);
    const centerObj = LOST_FOUND_CENTERS.find((w) => w.id === centerId);
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
      handleCloseWriteModal();
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
      setShowDeletePassword(false);
      setDeleteError("");
      void fetchItems();
    } catch (err: unknown) {
      setDeleteError(err instanceof Error ? err.message : "삭제 중 오류가 발생했습니다.");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col selection:bg-sky-500 selection:text-white">
      <WaterHubHeader activeNav="feedback" />

      {/* 상단 배너 헤더 */}
      <section className="relative overflow-hidden bg-gradient-to-r from-[#003876] via-[#004D95] to-[#1E6BBA] text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]" />
        <div className="relative mx-auto max-w-5xl">
          <div className="flex items-center gap-2 text-xs font-semibold text-sky-200 mb-3">
            <Link href="/" className="hover:text-white transition">홈</Link>
            <span>›</span>
            <Link href="/feedback" className="hover:text-white transition">소통창구</Link>
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
                {LOST_FOUND_CENTERS.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>

            {/* 검색 및 글쓰기 버튼 */}
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <form onSubmit={handleSearchSubmit} className="flex items-center gap-1.5 flex-1 min-w-0 sm:flex-initial">
                <input
                  type="text"
                  placeholder="제목, 물품명 검색"
                  value={searchKeyword}
                  onChange={(e) => setSearchKeyword(e.target.value)}
                  className="w-full min-w-0 sm:w-56 text-xs sm:text-sm rounded-lg border border-slate-300 px-3 py-2 focus:outline-none focus:border-[#004D95]"
                />
                <button
                  type="submit"
                  className="px-3.5 py-2 rounded-lg bg-slate-800 text-white text-xs font-bold hover:bg-slate-700 transition shrink-0 min-h-[38px]"
                >
                  검색
                </button>
              </form>

              <button
                type="button"
                onClick={handleOpenWriteModal}
                className="px-3.5 sm:px-4 py-2 rounded-lg bg-[#004D95] text-white text-xs sm:text-sm font-bold hover:bg-[#003876] transition shadow-xs shrink-0 flex items-center gap-1 min-h-[38px]"
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
                <a href="tel:031-880-6242" className="text-[#004D95] font-bold hover:underline">031-880-6242</a>
              </div>
              <div className="p-2.5 rounded-lg bg-white border border-slate-200 flex items-center justify-between">
                <span className="font-semibold text-slate-800">금강문화관</span>
                <a href="tel:041-835-1529" className="text-[#004D95] font-bold hover:underline">041-835-1529</a>
              </div>
              <div className="p-2.5 rounded-lg bg-white border border-slate-200 flex items-center justify-between">
                <span className="font-semibold text-slate-800">영산강문화관</span>
                <a href="tel:061-335-0866" className="text-[#004D95] font-bold hover:underline">061-335-0866</a>
              </div>
              <div className="p-2.5 rounded-lg bg-white border border-slate-200 flex items-center justify-between">
                <span className="font-semibold text-slate-800">디아크 문화관</span>
                <a href="tel:053-585-0916" className="text-[#004D95] font-bold hover:underline">053-585-0916</a>
              </div>
              <div className="p-2.5 rounded-lg bg-white border border-slate-200 flex items-center justify-between">
                <span className="font-semibold text-slate-800">낙동강문화관</span>
                <a href="tel:051-292-1042" className="text-[#004D95] font-bold hover:underline">051-292-1042</a>
              </div>
              <div className="p-2.5 rounded-lg bg-white border border-slate-200 flex items-center justify-between">
                <span className="font-semibold text-slate-800">소양강댐 물문화관</span>
                <a href="tel:033-259-7309" className="text-[#004D95] font-bold hover:underline">033-259-7309</a>
              </div>
              <div className="p-2.5 rounded-lg bg-white border border-slate-200 flex items-center justify-between">
                <span className="font-semibold text-slate-800">충주댐 물문화관</span>
                <a href="tel:043-846-6482" className="text-[#004D95] font-bold hover:underline">043-846-6482</a>
              </div>
              <div className="p-2.5 rounded-lg bg-white border border-slate-200 flex items-center justify-between">
                <span className="font-semibold text-slate-800">대청댐 물문화관</span>
                <a href="tel:042-930-7332" className="text-[#004D95] font-bold hover:underline">042-930-7332</a>
              </div>
              <div className="p-2.5 rounded-lg bg-white border border-slate-200 flex items-center justify-between">
                <span className="font-semibold text-slate-800">안동댐 물문화관</span>
                <a href="tel:054-850-4229" className="text-[#004D95] font-bold hover:underline">054-850-4229</a>
              </div>
              <div className="p-2.5 rounded-lg bg-white border border-slate-200 flex items-center justify-between sm:col-span-2 md:col-span-3">
                <span className="font-semibold text-slate-800">K-water 고객센터 (통합 민원)</span>
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
                onClick={handleCloseWriteModal}
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

            <form onSubmit={handleWriteSubmit} autoComplete="off" className="space-y-4 text-xs sm:text-sm">
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
                  {LOST_FOUND_CENTERS.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>

              {/* 제목 */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">제목 <span className="text-rose-500">*</span></label>
                <input
                  type="text"
                  autoComplete="off"
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
                    autoComplete="off"
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
                  autoComplete="off"
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
              <div className="pt-3 border-t border-slate-100 space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      작성자명 <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      autoComplete="off"
                      placeholder="예: 홍길동"
                      value={writerName}
                      onChange={(e) => setWriterName(e.target.value)}
                      className="w-full rounded-lg border border-slate-300 p-2.5 focus:outline-none focus:border-[#004D95]"
                      required
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      비밀번호 <span className="text-rose-500">*</span>
                      <span className="text-[11px] font-normal text-slate-400 ml-1.5">(삭제 시 필요)</span>
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        maxLength={8}
                        placeholder="삭제용 숫자 4자리"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full rounded-lg border border-slate-300 p-2.5 pr-10 focus:outline-none focus:border-[#004D95]"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 focus:outline-none transition"
                        title={showPassword ? "비밀번호 숨기기" : "비밀번호 보기"}
                        aria-label={showPassword ? "비밀번호 숨기기" : "비밀번호 보기"}
                      >
                        {showPassword ? (
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        ) : (
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" />
                          </svg>
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    연락처 (선택)
                    <span className="text-[11px] font-normal text-slate-400 ml-1.5">
                      ※ 안심 마스킹 처리
                    </span>
                  </label>
                  <input
                    type="tel"
                    inputMode="numeric"
                    autoComplete="off"
                    maxLength={13}
                    placeholder="010-0000-0000"
                    value={contact}
                    onChange={(e) => setContact(formatPhoneNumber(e.target.value))}
                    className="w-full rounded-lg border border-slate-300 p-2.5 focus:outline-none focus:border-[#004D95]"
                  />
                  <p className="text-[11px] text-slate-400 mt-1 leading-tight">
                    * 게시판 등록 시 전화번호는 마스킹되며, 습득 시 안내데스크 확인용으로 안전하게 보호됩니다.
                  </p>
                </div>
              </div>

              <div className="pt-4 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={handleCloseWriteModal}
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
                  setShowDeletePassword(false);
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
                <div className="flex items-center">
                  <span className="w-24 text-slate-400 font-medium shrink-0">연락처</span>
                  <span className="text-slate-700">{detailItem.contact}</span>
                  <span className="ml-2 px-1.5 py-0.5 rounded text-[10px] bg-slate-200 text-slate-600 font-medium">
                    개인정보 안심 마스킹
                  </span>
                </div>
              )}
            </div>

            {/* 본문 내용 */}
            <div className="p-4 rounded-xl border border-slate-200 bg-white min-h-[90px] text-xs sm:text-sm text-slate-800 leading-relaxed whitespace-pre-wrap mb-4">
              {detailItem.content}
            </div>

            {/* 안전 인계 및 안내데스크 직통 연결 안내 박스 (1번 방향) */}
            <div
              className={`p-4 rounded-xl border mb-5 text-xs sm:text-sm leading-relaxed ${
                detailItem.type === "분실"
                  ? "bg-amber-50/80 border-amber-200 text-amber-950"
                  : "bg-sky-50/80 border-sky-200 text-sky-950"
              }`}
            >
              <div className="font-bold flex items-center gap-1.5 mb-1.5 text-xs sm:text-sm">
                <span>
                  {detailItem.type === "분실"
                    ? "💡 이 물건을 습득하셨거나 보관 중이신가요?"
                    : "💡 본인의 분실물이 맞으신가요?"}
                </span>
              </div>
              <p className="text-xs text-slate-600 mb-3 break-keep leading-relaxed">
                {detailItem.type === "분실" ? (
                  <>
                    개인정보 보호 및 사적 직거래 사기 피해 예방을 위해, 물품을 습득하신 경우{" "}
                    <strong>{detailItem.centerName} 안내데스크</strong>로 인계해 주시거나 전화로 알려주시면, 분실자 본인 확인 후 안전하게 전달해 드립니다.
                  </>
                ) : (
                  <>
                    습득된 물품은 <strong>{detailItem.centerName} 안내데스크</strong>에서 안전하게 보관 중입니다. 방문 전 전화로 본인 확인 및 수령 일정을 확인하신 후, 신분증을 지참하여 방문해 주시기 바랍니다.
                  </>
                )}
              </p>
              <div className="pt-2.5 border-t border-slate-200/70 flex flex-wrap items-center justify-between gap-2">
                <span className="text-[11px] text-slate-500 font-medium">
                  {detailItem.centerName} 안내데스크 직통 유선 문의
                </span>
                <a
                  href={`tel:${getCenterPhone(detailItem.centerId, detailItem.centerName)}`}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold text-xs text-white shadow-xs transition ${
                    detailItem.type === "분실"
                      ? "bg-amber-700 hover:bg-amber-800"
                      : "bg-[#004D95] hover:bg-[#003876]"
                  }`}
                >
                  <span>📞 전화 걸기 ({getCenterPhone(detailItem.centerId, detailItem.centerName)})</span>
                </a>
              </div>
            </div>

            {/* 삭제 및 닫기 바 */}
            <div className="pt-4 border-t border-slate-100">
              <form onSubmit={handleDeleteSubmit} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-1.5 flex-1">
                  <div className="relative w-full sm:w-44">
                    <input
                      type={showDeletePassword ? "text" : "password"}
                      placeholder="비밀번호 입력 시 삭제"
                      value={deletePassword}
                      onChange={(e) => setDeletePassword(e.target.value)}
                      className="w-full text-xs rounded-lg border border-slate-300 p-2 pr-7 focus:outline-none focus:border-rose-500"
                    />
                    <button
                      type="button"
                      onClick={() => setShowDeletePassword(!showDeletePassword)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 p-0.5 text-slate-400 hover:text-slate-600 focus:outline-none transition"
                      title={showDeletePassword ? "비밀번호 숨기기" : "비밀번호 보기"}
                      aria-label={showDeletePassword ? "비밀번호 숨기기" : "비밀번호 보기"}
                    >
                      {showDeletePassword ? (
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      ) : (
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" />
                        </svg>
                      )}
                    </button>
                  </div>
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
                    setShowDeletePassword(false);
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
