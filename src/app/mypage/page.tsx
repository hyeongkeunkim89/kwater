"use client";

import React, { useState, Suspense } from "react";
import { WaterHubHeader } from "@/components/WaterHubHeader";
import { WaterHubFooter } from "@/components/WaterHubFooter";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";

type MockReservation = {
  id: string;
  centerName: string;
  date: string;
  time: string;
  visitorCount: number;
  status: "승인완료" | "대기중" | "관람완료" | "취소됨";
  type: "회원예약" | "비회원예약";
};

function LoginAlertHandler() {
  const searchParams = useSearchParams();
  const router = useRouter();

  React.useEffect(() => {
    if (searchParams.get("login") === "success") {
      alert("로그인 되었습니다.");
      router.replace("/mypage");
    }
  }, [searchParams, router]);

  return null;
}

export default function MyPage() {
  return (
    <Suspense fallback={null}>
      <LoginAlertHandler />
      <MyPageContent />
    </Suspense>
  );
}

function MyPageContent() {
  const { user, isLoading, openAuthModal, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<"reservations" | "qna" | "profile">("reservations");

  const [reservations, setReservations] = useState<MockReservation[]>([
    {
      id: "REV-20260815-01",
      centerName: "충주다목적댐 물문화관",
      date: "2026-08-20 (목)",
      time: "14:00",
      visitorCount: 3,
      status: "승인완료",
      type: "회원예약",
    },
    {
      id: "REV-20260710-09",
      centerName: "소양강댐 물문화관",
      date: "2026-07-10 (금)",
      time: "11:00",
      visitorCount: 2,
      status: "관람완료",
      type: "회원예약",
    },
  ]);

  const handleCancelReservation = (id: string) => {
    if (confirm("정말 예약을 취소하시겠습니까?")) {
      setReservations((prev) =>
        prev.map((r) => (r.id === id ? { ...r, status: "취소됨" } : r))
      );
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col justify-between">
        <WaterHubHeader activeNav="none" />
        <main className="mx-auto max-w-xl w-full px-6 py-20 text-center">
          <div className="rounded-3xl border border-slate-200 bg-white p-8 sm:p-12 shadow-xl space-y-4">
            <div className="animate-spin text-3xl mx-auto w-fit">🌀</div>
            <p className="text-sm font-bold text-slate-600">로그인 세션 확인 중입니다...</p>
          </div>
        </main>
        <WaterHubFooter />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col justify-between">
        <WaterHubHeader activeNav="none" />
        <main className="mx-auto max-w-xl w-full px-6 py-20 text-center">
          <div className="rounded-3xl border border-slate-200 bg-white p-8 sm:p-12 shadow-xl space-y-5">
            <div className="text-5xl">🔒</div>
            <h1 className="text-2xl font-black text-slate-900">로그인이 필요합니다</h1>
            <p className="text-sm text-slate-500 font-semibold leading-relaxed">
              마이페이지는 회원 전용 서비스입니다.<br />
              로그인 후 예약 내역 조회 및 관리를 이용하실 수 있습니다.
            </p>
            <div className="pt-4 flex flex-col gap-3">
              <button
                onClick={() => openAuthModal("login")}
                className="w-full rounded-2xl bg-sky-600 py-3.5 text-sm font-black text-white hover:bg-sky-500 transition shadow-lg shadow-sky-600/20"
              >
                로그인 / 회원가입하기 🔑
              </button>
              <button
                onClick={() => openAuthModal("guest")}
                className="w-full rounded-2xl border border-slate-200 bg-slate-100 py-3 text-sm font-bold text-slate-700 hover:bg-slate-200 transition"
              >
                🎟️ 비회원 예약 조회하기
              </button>
            </div>
          </div>
        </main>
        <WaterHubFooter />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between text-slate-900">
      <WaterHubHeader activeNav="none" />

      {/* 헤더 히어로 */}
      <div className="bg-gradient-to-r from-slate-900 via-sky-950 to-slate-900 text-white py-10 px-6 border-b border-white/10">
        <div className="mx-auto max-w-7xl flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4 text-center sm:text-left">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-sky-500/20 text-2xl font-black text-sky-400 border border-sky-400/30">
              👤
            </div>
            <div>
              <div className="flex items-center gap-2 justify-center sm:justify-start">
                <h1 className="text-2xl font-black text-white">{user.name} 님의 마이페이지</h1>
                <span className="rounded-full bg-sky-500/20 px-2.5 py-0.5 text-xs font-bold text-sky-300 border border-sky-400/30">
                  {user.provider === "kakao" ? "카카오 계정" : user.provider === "naver" ? "네이버 계정" : "이메일 회원"}
                </span>
              </div>
              <p className="mt-1 text-xs text-slate-300 font-semibold">{user.email}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/reserve"
              className="rounded-xl bg-sky-500 px-4 py-2.5 text-xs font-black text-slate-950 hover:bg-sky-400 transition shadow-md shadow-sky-500/20"
            >
              📅 새 투어 예약하기
            </Link>
            <button
              onClick={logout}
              className="rounded-xl border border-white/20 bg-white/10 px-4 py-2.5 text-xs font-bold text-slate-300 hover:bg-white/20 hover:text-white transition"
            >
              로그아웃
            </button>
          </div>
        </div>
      </div>

      <main className="mx-auto max-w-7xl w-full px-6 py-10 flex-1">
        {/* 탭 헤더 */}
        <div className="flex border-b border-slate-200 mb-8">
          <button
            onClick={() => setActiveTab("reservations")}
            className={`pb-3 px-6 text-sm font-black transition border-b-2 ${
              activeTab === "reservations"
                ? "border-sky-600 text-sky-600"
                : "border-transparent text-slate-400 hover:text-slate-700"
            }`}
          >
            내 가이드 투어 예약 ({reservations.length})
          </button>
          <button
            onClick={() => setActiveTab("qna")}
            className={`pb-3 px-6 text-sm font-black transition border-b-2 ${
              activeTab === "qna"
                ? "border-sky-600 text-sky-600"
                : "border-transparent text-slate-400 hover:text-slate-700"
            }`}
          >
            내 문의 및 Q&A (0)
          </button>
        </div>

        {/* 1. 투어 예약 탭 */}
        {activeTab === "reservations" && (
          <div className="space-y-4">
            {reservations.map((item) => (
              <div
                key={item.id}
                className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-md"
              >
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-extrabold text-slate-400">{item.id}</span>
                    <span
                      className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-bold ${
                        item.status === "승인완료"
                          ? "bg-emerald-100 text-emerald-800"
                          : item.status === "관람완료"
                          ? "bg-slate-100 text-slate-700"
                          : "bg-rose-100 text-rose-800"
                      }`}
                    >
                      {item.status}
                    </span>
                  </div>
                  <h3 className="text-lg font-black text-slate-900">{item.centerName}</h3>
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-600 font-semibold">
                    <span>🗓️ 관람일: {item.date}</span>
                    <span>⏰ 관람시간: {item.time}</span>
                    <span>👥 인원: {item.visitorCount}명</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center">
                  {item.status === "승인완료" && (
                    <button
                      onClick={() => handleCancelReservation(item.id)}
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

            {reservations.length === 0 && (
              <div className="rounded-2xl border border-dashed border-slate-300 py-16 text-center space-y-3">
                <p className="text-3xl">📅</p>
                <p className="text-sm font-semibold text-slate-500">예약된 가이드 투어가 없습니다.</p>
                <Link
                  href="/reserve"
                  className="inline-block rounded-xl bg-sky-600 px-4 py-2 text-xs font-bold text-white hover:bg-sky-500 transition"
                >
                  가이드 투어 신청하기
                </Link>
              </div>
            )}
          </div>
        )}

        {/* 2. 내 Q&A 탭 */}
        {activeTab === "qna" && (
          <div className="rounded-2xl border border-dashed border-slate-300 py-16 text-center space-y-3">
            <p className="text-3xl">💬</p>
            <p className="text-sm font-semibold text-slate-500">작성하신 문의글이 없습니다.</p>
            <Link
              href="/feedback"
              className="inline-block rounded-xl bg-slate-900 px-4 py-2 text-xs font-bold text-white hover:bg-slate-800 transition"
            >
              소통창구에서 문의하기
            </Link>
          </div>
        )}
      </main>

      <WaterHubFooter />
    </div>
  );
}
