"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { WaterHubHeader } from "@/components/WaterHubHeader";
import { WaterHubFooter } from "@/components/WaterHubFooter";
import Link from "next/link";

import { getAllReservations, updateStatus } from "@/lib/reservations";

type GuestReservation = {
  id: string;
  guestName: string;
  phone: string;
  centerName: string;
  date: string;
  time: string;
  visitorCount: number;
  status: "승인완료" | "대기중" | "관람완료" | "취소됨";
  createdAt?: string;
};

function formatPhone(val: string) {
  const digits = val.replace(/\D/g, "").slice(0, 11);
  if (digits.length > 7) {
    return `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7)}`;
  } else if (digits.length > 3) {
    return `${digits.slice(0, 3)}-${digits.slice(3)}`;
  }
  return digits;
}

function formatDateKo(dateStr: string) {
  if (!dateStr) return "";
  const parts = dateStr.split("-");
  if (parts.length !== 3) return dateStr;
  const [y, m, d] = parts.map(Number);
  if (isNaN(y) || isNaN(m) || isNaN(d)) return dateStr;
  const dt = new Date(y, m - 1, d);
  const dow = ["일", "월", "화", "수", "목", "금", "토"][dt.getDay()];
  return `${y}년 ${m}월 ${d}일 (${dow})`;
}

function formatCreatedAtKst(isoStr?: string) {
  if (!isoStr) return "";
  try {
    const d = new Date(isoStr);
    if (isNaN(d.getTime())) return isoStr;
    return d.toLocaleString("ko-KR", {
      timeZone: "Asia/Seoul",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  } catch {
    return isoStr;
  }
}

function GuestCheckContent() {
  const searchParams = useSearchParams();
  const initialPhone = searchParams.get("phone") || "";
  const initialPin = searchParams.get("pin") || "";

  const [phone, setPhone] = useState(() => formatPhone(initialPhone));
  const [pin, setPin] = useState(initialPin);
  const [showPin, setShowPin] = useState(false);
  const [isSearched, setIsSearched] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [guestReservations, setGuestReservations] = useState<GuestReservation[]>([]);

  useEffect(() => {
    if (initialPhone && initialPin) {
      const formatted = formatPhone(initialPhone);
      setPhone(formatted);
      void handleSearch(formatted, initialPin);
    }
  }, [initialPhone, initialPin]);

  const handleSearch = async (p: string, _pin: string) => {
    setIsSearched(true);
    setIsSearching(true);
    const targetDigits = p.replace(/\D/g, "");
    const pinDigits = _pin.trim();
    if (!targetDigits) {
      setGuestReservations([]);
      setIsSearching(false);
      return;
    }

    let serverList: any[] = [];
    try {
      const res = await fetch("/api/reservations/guest-lookup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: p, pin: _pin }),
      });
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data.reservations)) {
          serverList = data.reservations;
        }
      }
    } catch (e) {
      console.error("Guest lookup fetch error", e);
    } finally {
      setIsSearching(false);
    }

    const localList = getAllReservations();
    const combined = [...serverList, ...localList];
    const seenIds = new Set<string>();

    const matched = combined
      .filter((r) => {
        if (!r.id || seenIds.has(r.id)) return false;
        const phoneMatch = (r.phone || "").replace(/\D/g, "") === targetDigits;
        if (!phoneMatch) return false;
        if (r.guestPin && pinDigits) {
          if (r.guestPin !== pinDigits) return false;
        }
        seenIds.add(r.id);
        return true;
      })
      .map((r) => ({
        id: r.id,
        guestName: `${r.name} (비회원)`,
        phone: r.phone,
        centerName: r.centerName,
        date: r.date,
        time: r.time,
        visitorCount: r.partySize,
        status: (r.status === "확정" ? "승인완료" : r.status === "대기" ? "대기중" : "취소됨") as GuestReservation["status"],
      }));

    setGuestReservations(matched);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone || !pin) {
      alert("휴대폰 번호와 비밀번호 4자리를 입력해주세요.");
      return;
    }
    void handleSearch(phone, pin);
  };

  const handleCancel = async (id: string) => {
    if (confirm("비회원 예약을 정말 취소하시겠습니까?")) {
      updateStatus(id, "취소");
      try {
        await fetch("/api/reservations/guest-cancel", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id, phone, pin }),
        });
      } catch (e) {
        console.error("Guest cancel fetch error", e);
      }
      setGuestReservations((prev) =>
        prev.map((r) => (r.id === id ? { ...r, status: "취소됨" } : r))
      );
    }
  };

  return (
    <div className="mx-auto max-w-3xl w-full px-6 py-12 flex-1">
      <div className="text-center mb-10">
        <span className="text-xs font-bold uppercase tracking-widest text-emerald-600">GUEST CHECK</span>
        <h1 className="mt-1 text-3xl font-black text-slate-900">비회원 가이드 투어 예약 조회</h1>
        <p className="mt-2 text-sm text-slate-500 font-semibold">
          투어 신청 시 등록하신 연락처와 비밀번호 4자리로 예약을 빠르게 조회합니다.
        </p>
      </div>

      {/* 조회 폼 */}
      <form onSubmit={handleFormSubmit} className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xl space-y-4 mb-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">예약자 휴대폰 번호</label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(formatPhone(e.target.value))}
              placeholder="010-0000-0000"
              className="w-full rounded-xl border border-slate-200 p-3 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">비회원 비밀번호 (숫자 4자리)</label>
            <div className="relative flex items-center">
              <input
                type={showPin ? "text" : "password"}
                maxLength={4}
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                placeholder="숫자 4자리"
                className="w-full rounded-xl border border-slate-200 p-3 pr-10 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
              />
              <button
                type="button"
                onClick={() => setShowPin(!showPin)}
                className="absolute right-3 p-1 text-slate-400 hover:text-slate-600 transition"
                title={showPin ? "비밀번호 숨기기" : "비밀번호 보기"}
              >
                {showPin ? (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3l18 18" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={isSearching}
          className="w-full rounded-xl bg-emerald-600 py-3.5 text-sm font-black text-white hover:bg-emerald-500 transition shadow-lg shadow-emerald-600/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isSearching ? (
            <>
              <span className="animate-spin">🌀</span>
              <span>예약 내역 조회 중입니다...</span>
            </>
          ) : (
            <span>예약 내역 조회하기 🔍</span>
          )}
        </button>
      </form>

      {/* 2. 예약 '변경' 정책 안내 배너 */}
      <div className="rounded-2xl border border-sky-200/90 bg-sky-50/80 p-4 text-xs font-medium text-sky-950 leading-relaxed shadow-sm mb-8">
        <div className="flex items-start gap-2.5">
          <span className="text-base shrink-0 leading-none">ℹ️</span>
          <div>
            <p className="font-extrabold text-sky-900 mb-0.5">예약 변경 관련 안내</p>
            <p>
              ※ 관람 일시 및 방문 인원 변경이 필요하신 경우, 기존 예약을 취소하신 후 새로 신청해 주시거나 방문 예정인 해당 물문화관으로 문의해 주시기 바랍니다.
            </p>
          </div>
        </div>
      </div>

      {/* 조회 결과 */}
      {isSearched && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-black text-slate-900">
              조회된 비회원 예약 내역 ({guestReservations.length}건)
            </h2>
            {isSearching && (
              <span className="text-xs text-emerald-600 font-bold animate-pulse">조회 진행 중...</span>
            )}
          </div>

          {!isSearching && guestReservations.length === 0 && (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center space-y-3 shadow-sm">
              <div className="text-4xl">🔍</div>
              <h3 className="text-base font-bold text-slate-800">일치하는 비회원 예약 내역이 없습니다</h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
                입력하신 <strong>휴대폰 번호</strong>와 <strong>비밀번호 4자리</strong>가 예약 접수 시 등록한 정보와 정확히 일치하는지 확인해 주세요.<br />
                (비회원 예약이 아니거나 회원이신 경우 상단 로그인을 통해 마이페이지에서 확인하실 수 있습니다.)
              </p>
              <div className="pt-2 flex justify-center gap-3">
                <Link
                  href="/reserve"
                  className="rounded-xl bg-emerald-600 px-4 py-2 text-xs font-black text-white hover:bg-emerald-500 transition shadow-sm shadow-emerald-600/20"
                >
                  새 투어 예약하기 📅
                </Link>
              </div>
            </div>
          )}

          {guestReservations.map((r) => {
            const isConfirmed = r.status === "승인완료";
            const isPending = r.status === "대기중";
            const isCancelled = r.status === "취소됨";

            const cardBgClass = isCancelled
              ? "bg-slate-50/90 border-slate-200 opacity-80 filter grayscale-[20%]"
              : isConfirmed
              ? "bg-white border-emerald-200 shadow-md"
              : "bg-white border-amber-200/90 shadow-md";

            const badgeBgClass = isCancelled
              ? "bg-slate-200 text-slate-600 border border-slate-300 font-extrabold"
              : isConfirmed
              ? "bg-emerald-100 text-emerald-900 border border-emerald-300 font-extrabold"
              : "bg-amber-100 text-amber-900 border border-amber-300 font-extrabold";

            const badgeText = isCancelled
              ? "[취소됨]"
              : isConfirmed
              ? "[예약 확정]"
              : "[검토 대기중]";

            const formattedDate = formatDateKo(r.date);
            const createdKst = formatCreatedAtKst(r.createdAt);

            return (
              <div
                key={r.id}
                className={`rounded-2xl border p-6 space-y-3.5 transition-all ${cardBgClass}`}
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-slate-400">#{r.id.slice(-6)}</span>
                    {createdKst && (
                      <span className="text-[10px] text-slate-400 font-medium">
                        (신청일시: {createdKst} KST)
                      </span>
                    )}
                  </div>
                  <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs ${badgeBgClass}`}>
                    {badgeText}
                  </span>
                </div>

                <div>
                  <h3 className={`text-lg font-black ${isCancelled ? "text-slate-500" : "text-slate-900"}`}>{r.centerName}</h3>
                  <div className={`mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs ${isCancelled ? "text-slate-400" : "text-slate-600 font-semibold"}`}>
                    <span>👤 예약자: {r.guestName}</span>
                    <span>🗓️ 관람일: {formattedDate || r.date}</span>
                    <span>⏰ 시간: {r.time}</span>
                    <span>👥 인원: {r.visitorCount}명</span>
                  </div>
                </div>

                {isConfirmed && (
                  <p className="text-[11px] font-bold text-emerald-800 bg-emerald-50/90 border border-emerald-200/80 rounded-xl p-2.5 flex items-center gap-1.5">
                    <span>✅</span>
                    <span>확정 완료된 예약입니다. 안내된 일시에 맞춰 방문해 주세요.</span>
                  </p>
                )}

                <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
                  {!isCancelled ? (
                    <button
                      type="button"
                      onClick={() => handleCancel(r.id)}
                      className={`rounded-xl px-3.5 py-2 text-xs font-bold transition ${
                        isConfirmed
                          ? "border border-slate-200 bg-slate-50 text-slate-600 hover:bg-rose-50 hover:text-rose-700 hover:border-rose-200"
                          : "border border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100"
                      }`}
                    >
                      예약 취소
                    </button>
                  ) : (
                    <span className="text-xs font-extrabold text-slate-400 bg-slate-200/70 px-3 py-1.5 rounded-lg cursor-not-allowed">
                      취소 처리 완료
                    </span>
                  )}

                  <Link
                    href="/status"
                    className={`rounded-xl px-4 py-2 text-xs font-bold transition shadow-sm ${
                      isConfirmed
                        ? "bg-emerald-600 text-white hover:bg-emerald-500 shadow-emerald-600/20 font-black"
                        : isCancelled
                        ? "border border-slate-300 bg-white text-slate-500 hover:bg-slate-100 opacity-80"
                        : "border border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100"
                    }`}
                  >
                    오시는 길 🗺️
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default function GuestCheckPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between text-slate-900">
      <WaterHubHeader activeNav="reserve" />
      <Suspense fallback={<div className="p-12 text-center text-sm text-slate-500">로딩 중...</div>}>
        <GuestCheckContent />
      </Suspense>
      <WaterHubFooter />
    </div>
  );
}
