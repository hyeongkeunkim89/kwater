"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { WaterHubHeader } from "@/components/WaterHubHeader";
import { WaterHubFooter } from "@/components/WaterHubFooter";
import Link from "next/link";

type GuestReservation = {
  id: string;
  guestName: string;
  phone: string;
  centerName: string;
  date: string;
  time: string;
  visitorCount: number;
  status: "승인완료" | "대기중" | "관람완료" | "취소됨";
};

function GuestCheckContent() {
  const searchParams = useSearchParams();
  const initialPhone = searchParams.get("phone") || "";
  const initialPin = searchParams.get("pin") || "";

  const [phone, setPhone] = useState(initialPhone);
  const [pin, setPin] = useState(initialPin);
  const [isSearched, setIsSearched] = useState(false);
  const [guestReservations, setGuestReservations] = useState<GuestReservation[]>([]);

  useEffect(() => {
    if (initialPhone && initialPin) {
      handleSearch(initialPhone, initialPin);
    }
  }, [initialPhone, initialPin]);

  const handleSearch = (p: string, _pin: string) => {
    // Mock guest reservation search
    setIsSearched(true);
    setGuestReservations([
      {
        id: "GUEST-20260818-04",
        guestName: "김철수 (비회원)",
        phone: p || "010-1234-5678",
        centerName: "평화의댐 물문화관",
        date: "2026-08-25 (화)",
        time: "10:30",
        visitorCount: 4,
        status: "승인완료",
      },
    ]);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone || !pin) {
      alert("휴대폰 번호와 비밀번호 4자리를 입력해주세요.");
      return;
    }
    handleSearch(phone, pin);
  };

  const handleCancel = (id: string) => {
    if (confirm("비회원 예약을 정말 취소하시겠습니까?")) {
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
              onChange={(e) => setPhone(e.target.value)}
              placeholder="01012345678 (- 없이)"
              className="w-full rounded-xl border border-slate-200 p-3 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">비회원 비밀번호 (숫자 4자리)</label>
            <input
              type="password"
              maxLength={4}
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              placeholder="숫자 4자리"
              className="w-full rounded-xl border border-slate-200 p-3 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
            />
          </div>
        </div>

        <button
          type="submit"
          className="w-full rounded-xl bg-emerald-600 py-3.5 text-sm font-black text-white hover:bg-emerald-500 transition shadow-lg shadow-emerald-600/20"
        >
          예약 내역 조회하기 🔍
        </button>
      </form>

      {/* 조회 결과 */}
      {isSearched && (
        <div className="space-y-4">
          <h2 className="text-lg font-black text-slate-900 mb-3">조회된 비회원 예약 내역 ({guestReservations.length}건)</h2>

          {guestReservations.map((r) => (
            <div
              key={r.id}
              className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-md"
            >
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold text-slate-400">{r.id}</span>
                  <span
                    className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-bold ${
                      r.status === "승인완료"
                        ? "bg-emerald-100 text-emerald-800"
                        : r.status === "관람완료"
                        ? "bg-slate-100 text-slate-700"
                        : "bg-rose-100 text-rose-800"
                    }`}
                  >
                    {r.status}
                  </span>
                </div>
                <h3 className="text-lg font-black text-slate-900">{r.centerName}</h3>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-600 font-semibold">
                  <span>👤 예약자: {r.guestName}</span>
                  <span>🗓️ 관람일: {r.date}</span>
                  <span>⏰ 시간: {r.time}</span>
                  <span>👥 인원: {r.visitorCount}명</span>
                </div>
              </div>

              <div className="flex items-center gap-2 self-end sm:self-center">
                {r.status === "승인완료" && (
                  <button
                    onClick={() => handleCancel(r.id)}
                    className="rounded-xl border border-rose-200 bg-rose-50 px-3.5 py-2 text-xs font-bold text-rose-700 hover:bg-rose-100 transition"
                  >
                    예약 취소
                  </button>
                )}
                <Link
                  href="/status"
                  className="rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs font-bold text-slate-700 hover:bg-slate-100 transition"
                >
                  오시는 길 보기 🗺️
                </Link>
              </div>
            </div>
          ))}
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
