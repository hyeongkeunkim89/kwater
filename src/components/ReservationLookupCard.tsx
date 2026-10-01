"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { getAllReservations, updateStatus } from "@/lib/reservations";

type ReservationItem = {
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

export function ReservationLookupCard() {
  const { user, openAuthModal } = useAuth();
  const [phone, setPhone] = useState("");
  const [pin, setPin] = useState("");
  const [showPin, setShowPin] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [results, setResults] = useState<ReservationItem[]>([]);

  // 회원 로그인 상태인 경우 유저 전화번호 자동 세팅 및 회원 예약 자동 조회
  useEffect(() => {
    if (user?.phone) {
      const formatted = formatPhone(user.phone);
      setPhone(formatted);
      void handleSearch(formatted, "");
    }
  }, [user]);

  const handleSearch = async (targetPhone: string, targetPin: string) => {
    const digits = targetPhone.replace(/\D/g, "");
    if (!digits) {
      alert("휴대폰 번호를 입력해 주세요.");
      return;
    }

    setIsSearching(true);
    setHasSearched(true);

    let serverList: any[] = [];
    try {
      const res = await fetch("/api/reservations/guest-lookup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: targetPhone, pin: targetPin }),
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
        const rPhoneDigits = (r.phone || "").replace(/\D/g, "");
        const phoneMatch = rPhoneDigits === digits;
        if (!phoneMatch) return false;
        if (r.guestPin && targetPin.trim()) {
          if (r.guestPin !== targetPin.trim()) return false;
        }
        seenIds.add(r.id);
        return true;
      })
      .map((r) => ({
        id: r.id,
        guestName: r.name || "예약자",
        phone: r.phone,
        centerName: r.centerName,
        date: r.date,
        time: r.time,
        visitorCount: r.partySize || r.visitorCount || 1,
        createdAt: r.createdAt || r.created_at,
        status: (r.status === "확정"
          ? "승인완료"
          : r.status === "대기"
          ? "대기중"
          : r.status === "취소"
          ? "취소됨"
          : r.status) as ReservationItem["status"],
      }));

    setResults(matched);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    void handleSearch(phone, pin);
  };

  const handleCancel = async (id: string) => {
    if (confirm("예약을 정말 취소하시겠습니까?")) {
      updateStatus(id, "취소");
      try {
        await fetch("/api/reservations/guest-cancel", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id, phone, pin }),
        });
      } catch (e) {
        console.error("Cancel fetch error", e);
      }
      setResults((prev) =>
        prev.map((r) => (r.id === id ? { ...r, status: "취소됨" } : r))
      );
      alert("예약이 취소되었습니다.");
    }
  };

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-7 shadow-xl space-y-6">
      {/* 헤더 안내 */}
      <div className="border-b border-slate-100 pb-4">
        <h3 className="text-lg font-black text-slate-900">투어 예약 내역 확인</h3>
        <p className="mt-1 text-xs text-slate-500 font-semibold leading-relaxed">
          접수 시 등록한 연락처와 비밀번호로 예약 상태를 바로 조회하고 관리하실 수 있습니다.
        </p>
      </div>

      {/* 회원 전용 안내 상태 */}
      {!user && (
        <div className="flex items-center justify-between gap-2 rounded-2xl bg-sky-50/80 border border-sky-200/70 p-3 text-xs">
          <span className="text-sky-900 font-bold">
            👤 회원으로 로그인하면 내 예약을 더 빠르게 조회하실 수 있습니다.
          </span>
          <button
            type="button"
            onClick={() => openAuthModal("login")}
            className="shrink-0 rounded-xl bg-sky-600 px-3 py-1.5 text-xs font-black text-white hover:bg-sky-500 transition shadow-sm"
          >
            로그인
          </button>
        </div>
      )}

      {/* 조회 폼 */}
      <form onSubmit={handleFormSubmit} className="space-y-3">
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">
            예약자 휴대폰 번호 *
          </label>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(formatPhone(e.target.value))}
            placeholder="010-0000-0000"
            className="w-full rounded-xl border border-slate-200 p-3 text-sm font-medium outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">
            비회원 비밀번호 4자리 <span className="text-slate-400 font-normal">(회원은 생략 가능)</span>
          </label>
          <div className="relative flex items-center">
            <input
              type={showPin ? "text" : "password"}
              maxLength={4}
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              placeholder="비회원 비밀번호 4자리"
              className="w-full rounded-xl border border-slate-200 p-3 pr-10 text-sm font-medium outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
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

        <button
          type="submit"
          disabled={isSearching}
          className="w-full rounded-xl bg-emerald-600 py-3.5 text-sm font-black text-white hover:bg-emerald-500 transition shadow-md shadow-emerald-600/20 disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {isSearching ? (
            <>
              <span className="animate-spin">🌀</span>
              <span>조회 중입니다...</span>
            </>
          ) : (
            <span>🔍 내역 조회하기</span>
          )}
        </button>
      </form>

      {/* 2. 예약 '변경' 정책 안내 배너 */}
      <div className="rounded-2xl border border-sky-200/90 bg-sky-50/80 p-4 text-xs font-medium text-sky-950 leading-relaxed shadow-sm">
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

      {/* 3. 조회 결과 영역 */}
      {hasSearched && (
        <div className="space-y-4 pt-4 border-t border-slate-100">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold text-slate-800">
              조회 결과 ({results.length}건)
            </span>
          </div>

          {!isSearching && results.length === 0 && (
            <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-6 text-center space-y-2">
              <p className="text-2xl" aria-hidden>🔍</p>
              <p className="text-xs font-bold text-slate-700">
                조회된 예약 내역이 없습니다.
              </p>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                입력하신 휴대폰 번호와 비밀번호를 확인해 주세요.
              </p>
            </div>
          )}

          {results.map((r) => {
            const isConfirmed = r.status === "승인완료" || (r as any).status === "확정";
            const isPending = r.status === "대기중" || (r as any).status === "대기";
            const isCancelled = r.status === "취소됨" || (r as any).status === "취소";

            const cardBgClass = isCancelled
              ? "bg-slate-50/90 border-slate-200 opacity-80 filter grayscale-[20%]"
              : isConfirmed
              ? "bg-white border-emerald-200 shadow-sm"
              : "bg-white border-amber-200/90 shadow-sm";

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
                className={`rounded-2xl border p-4 sm:p-5 space-y-3.5 transition-all ${cardBgClass}`}
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-mono font-bold text-slate-400">
                      #{r.id.slice(-6)}
                    </span>
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
                  <h4 className={`text-base sm:text-lg font-black leading-tight ${isCancelled ? "text-slate-500" : "text-slate-900"}`}>
                    {r.centerName}
                  </h4>
                  <div className={`mt-2 grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1.5 text-xs ${isCancelled ? "text-slate-400" : "text-slate-600 font-semibold"}`}>
                    <span>🗓️ 관람일: {formattedDate || r.date}</span>
                    <span>⏰ 시간: {r.time}</span>
                    <span>👥 인원: {r.visitorCount}명</span>
                    <span>👤 신청자: {r.guestName}</span>
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
