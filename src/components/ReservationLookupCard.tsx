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
};

export function ReservationLookupCard() {
  const { user, openAuthModal } = useAuth();
  const [phone, setPhone] = useState("");
  const [pin, setPin] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [results, setResults] = useState<ReservationItem[]>([]);

  // 회원 로그인 상태인 경우 유저 전화번호 자동 세팅 및 회원 예약 자동 조회
  useEffect(() => {
    if (user?.phone) {
      setPhone(user.phone);
      void handleSearch(user.phone, "");
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
        <span className="inline-block rounded-full bg-emerald-100 px-3 py-0.5 text-[11px] font-black text-emerald-800 mb-1">
          실시간 원스톱 조회
        </span>
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
            onChange={(e) => setPhone(e.target.value)}
            placeholder="010-1234-5678 (숫자만 입력)"
            className="w-full rounded-xl border border-slate-200 p-3 text-sm font-medium outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">
            비회원 비밀번호 4자리 <span className="text-slate-400 font-normal">(회원은 생략 가능)</span>
          </label>
          <input
            type="password"
            maxLength={4}
            value={pin}
            onChange={(e) => setPin(e.target.value)}
            placeholder="비회원 비밀번호 4자리"
            className="w-full rounded-xl border border-slate-200 p-3 text-sm font-medium outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
          />
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

      {/* 조회 결과 영역 */}
      {hasSearched && (
        <div className="space-y-3 pt-2 border-t border-slate-100">
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

          {results.map((r) => (
            <div
              key={r.id}
              className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm space-y-3 hover:border-emerald-300 transition"
            >
              <div className="flex items-center justify-between gap-2">
                <span className="text-[11px] font-mono font-bold text-slate-400">
                  #{r.id.slice(-6)}
                </span>
                <span
                  className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-bold ${
                    r.status === "승인완료"
                      ? "bg-emerald-100 text-emerald-800"
                      : r.status === "대기중"
                      ? "bg-amber-100 text-amber-900"
                      : "bg-rose-100 text-rose-800"
                  }`}
                >
                  {r.status}
                </span>
              </div>

              <div>
                <h4 className="text-base font-black text-slate-900 leading-tight">
                  {r.centerName}
                </h4>
                <div className="mt-1.5 grid grid-cols-2 gap-x-2 gap-y-1 text-xs text-slate-600 font-medium">
                  <span>🗓️ 관람일: {r.date}</span>
                  <span>⏰ 시간: {r.time}</span>
                  <span>👥 인원: {r.visitorCount}명</span>
                  <span>👤 신청자: {r.guestName}</span>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
                {r.status === "승인완료" || r.status === "대기중" ? (
                  <button
                    type="button"
                    onClick={() => handleCancel(r.id)}
                    className="rounded-xl border border-rose-200 bg-rose-50 px-3 py-1.5 text-xs font-bold text-rose-700 hover:bg-rose-100 transition"
                  >
                    예약 취소
                  </button>
                ) : (
                  <span className="text-xs text-slate-400 font-medium">취소 완료됨</span>
                )}
                <Link
                  href="/status"
                  className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-100 transition"
                >
                  오시는 길 🗺️
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
