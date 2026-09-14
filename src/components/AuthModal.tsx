"use client";

import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { waterCenters } from "@/data/centers";

export function AuthModal() {
  const { isAuthOpen, authTab, closeAuthModal, loginWithSocial, loginWithEmail, signupWithEmail } = useAuth();
  const [tab, setTab] = useState<"login" | "signup" | "guest">(authTab === "guest" ? "guest" : "login");
  const router = useRouter();

  // Login form state (아이디 또는 이메일)
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPass, setLoginPass] = useState("");

  // Signup form state
  const [signUpName, setSignUpName] = useState("");
  const [signUpEmail, setSignUpEmail] = useState("");
  const [signUpPass, setSignUpPass] = useState("");
  const [signUpPhone, setSignUpPhone] = useState("");

  // Guest lookup form state
  const [guestPhone, setGuestPhone] = useState("");
  const [guestPin, setGuestPin] = useState("");

  if (!isAuthOpen) return null;

  const handleSocialClick = (provider: "kakao" | "naver") => {
    if (provider === "naver") {
      window.location.href = "/api/auth/naver";
      return;
    }
    if (provider === "kakao") {
      window.location.href = "/api/auth/kakao";
      return;
    }
    loginWithSocial(provider);
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginEmail) {
      alert("아이디 또는 이메일을 입력해주세요.");
      return;
    }
    await loginWithEmail(loginEmail, loginPass);
  };

  const handleSignUpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!signUpName || !signUpEmail || !signUpPass) {
      alert("모든 필수 항목을 입력해주세요.");
      return;
    }
    await signupWithEmail(signUpName, signUpEmail, signUpPass, signUpPhone);
    router.push("/mypage");
  };

  const handleGuestLookup = (e: React.FormEvent) => {
    e.preventDefault();
    if (!guestPhone || !guestPin) {
      alert("휴대폰 번호와 비회원 비밀번호 4자리를 입력해주세요.");
      return;
    }
    closeAuthModal();
    router.push(`/reserve/guest-check?phone=${encodeURIComponent(guestPhone)}&pin=${encodeURIComponent(guestPin)}`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/75 p-4 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-md overflow-hidden rounded-3xl border border-white/20 bg-white p-6 shadow-2xl sm:p-8">
        {/* 닫기 버튼 */}
        <button
          onClick={closeAuthModal}
          className="absolute right-5 top-5 flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-slate-500 transition hover:bg-slate-200 hover:text-slate-900"
          aria-label="닫기"
        >
          ✕
        </button>

        {/* 상단 탭 구분 (통합로그인 / 회원가입 / 비회원) */}
        <div className="grid grid-cols-3 border-b border-slate-200 pb-3 mb-6 gap-1 text-center">
          <button
            onClick={() => setTab("login")}
            className={`py-2 text-xs font-black transition border-b-2 ${
              tab === "login"
                ? "border-sky-600 text-sky-600 font-extrabold"
                : "border-transparent text-slate-400 hover:text-slate-700"
            }`}
          >
            🔑 로그인
          </button>
          <button
            onClick={() => setTab("signup")}
            className={`py-2 text-xs font-black transition border-b-2 ${
              tab === "signup"
                ? "border-sky-600 text-sky-600 font-extrabold"
                : "border-transparent text-slate-400 hover:text-slate-700"
            }`}
          >
            📝 회원가입
          </button>
          <button
            onClick={() => setTab("guest")}
            className={`py-2 text-xs font-black transition border-b-2 ${
              tab === "guest"
                ? "border-emerald-600 text-emerald-600 font-extrabold"
                : "border-transparent text-slate-400 hover:text-slate-700"
            }`}
          >
            🎟️ 비회원
          </button>
        </div>

        {/* 1. 통합 로그인 탭 */}
        {tab === "login" && (
          <div className="space-y-5">
            <div className="text-center">
              <span className="inline-block rounded-full bg-sky-100 px-3 py-0.5 text-[11px] font-black text-sky-800 mb-1">
                통합 인증 원스톱 로그인
              </span>
              <h2 className="text-xl font-black text-slate-900">물문화관 로그인</h2>
              <p className="mt-1 text-xs text-slate-500 font-semibold">
                소셜 로그인 또는 아이디/이메일로 로그인하세요.
              </p>
            </div>

            {/* 소셜 로그인 버튼 그룹 */}
            <div className="space-y-2 pt-1">
              <button
                onClick={() => handleSocialClick("kakao")}
                className="w-full flex items-center justify-center gap-2.5 rounded-xl bg-[#FEE500] py-3 text-sm font-black text-[#191919] transition hover:bg-[#FDD800] shadow-sm"
              >
                <span>💬 카카오 1초 로그인</span>
              </button>

              <button
                onClick={() => handleSocialClick("naver")}
                className="w-full flex items-center justify-center gap-2.5 rounded-xl bg-[#03C75A] py-3 text-sm font-black text-white transition hover:bg-[#02B351] shadow-sm"
              >
                <span>N 네이버 1초 로그인</span>
              </button>
            </div>

            <div className="relative flex items-center justify-center my-3">
              <div className="w-full border-t border-slate-200" />
              <span className="absolute bg-white px-3 text-xs text-slate-400 font-bold">또는 아이디/이메일 로그인</span>
            </div>

            <form onSubmit={handleLoginSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">아이디 또는 이메일주소</label>
                <input
                  type="text"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  placeholder="예: user@kwater.or.kr 또는 admin / staff_soyang"
                  className="w-full rounded-xl border border-slate-200 p-2.5 text-sm outline-none focus:border-sky-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">비밀번호</label>
                <input
                  type="password"
                  value={loginPass}
                  onChange={(e) => setLoginPass(e.target.value)}
                  placeholder="비밀번호 입력"
                  className="w-full rounded-xl border border-slate-200 p-2.5 text-sm outline-none focus:border-sky-500"
                />
              </div>

              <div className="rounded-xl bg-sky-50 p-2.5 text-[11px] text-sky-900 border border-sky-100 flex items-center gap-1.5 font-semibold">
                <span className="shrink-0">💡</span>
                <span>관리자/담당자 ID로 로그인 시 관리자 전용 콘솔페이지(/yunyeong)로 자동 이동합니다.</span>
              </div>

              <button
                type="submit"
                className="w-full rounded-xl bg-slate-900 py-3 text-sm font-black text-white hover:bg-slate-800 transition shadow-md"
              >
                🔑 로그인
              </button>
            </form>
          </div>
        )}

        {/* 3. 회원가입 탭 */}
        {tab === "signup" && (
          <div className="space-y-4">
            <div className="text-center">
              <h2 className="text-xl font-black text-slate-900">신규 관람객 회원가입</h2>
              <p className="mt-1 text-xs text-slate-500 font-semibold">
                가입 후 투어 예약과 마이페이지를 이용해보세요.
              </p>
            </div>

            <form onSubmit={handleSignUpSubmit} className="space-y-3 pt-1">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">이름</label>
                <input
                  type="text"
                  value={signUpName}
                  onChange={(e) => setSignUpName(e.target.value)}
                  placeholder="홍길동"
                  className="w-full rounded-xl border border-slate-200 p-2.5 text-sm outline-none focus:border-sky-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">이메일 (아이디)</label>
                <input
                  type="email"
                  value={signUpEmail}
                  onChange={(e) => setSignUpEmail(e.target.value)}
                  placeholder="user@kwater.or.kr"
                  className="w-full rounded-xl border border-slate-200 p-2.5 text-sm outline-none focus:border-sky-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">비밀번호</label>
                <input
                  type="password"
                  value={signUpPass}
                  onChange={(e) => setSignUpPass(e.target.value)}
                  placeholder="비밀번호 6자리 이상"
                  className="w-full rounded-xl border border-slate-200 p-2.5 text-sm outline-none focus:border-sky-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">휴대폰 번호 (선택)</label>
                <input
                  type="tel"
                  value={signUpPhone}
                  onChange={(e) => setSignUpPhone(e.target.value)}
                  placeholder="010-1234-5678"
                  className="w-full rounded-xl border border-slate-200 p-2.5 text-sm outline-none focus:border-sky-500"
                />
              </div>

              <button
                type="submit"
                className="w-full rounded-xl bg-sky-600 py-3 text-sm font-black text-white hover:bg-sky-500 transition shadow-md shadow-sky-600/20"
              >
                관람객 회원가입 완료
              </button>
            </form>
          </div>
        )}

        {/* 4. 비회원 예약조회 탭 */}
        {tab === "guest" && (
          <div className="space-y-4">
            <div className="text-center">
              <h2 className="text-xl font-black text-slate-900">비회원 투어 예약 조회</h2>
              <p className="mt-1 text-xs text-slate-500 font-semibold">
                회원가입 없이 예약할 때 설정한 연락처와 비밀번호로 내역을 조회합니다.
              </p>
            </div>

            <form onSubmit={handleGuestLookup} className="space-y-3 pt-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">예약자 휴대폰 번호</label>
                <input
                  type="tel"
                  value={guestPhone}
                  onChange={(e) => setGuestPhone(e.target.value)}
                  placeholder="01012345678 (- 없이 숫자만)"
                  className="w-full rounded-xl border border-slate-200 p-3 text-sm outline-none focus:border-sky-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">비회원 비밀번호 (숫자 4자리)</label>
                <input
                  type="password"
                  maxLength={4}
                  value={guestPin}
                  onChange={(e) => setGuestPin(e.target.value)}
                  placeholder="예약 시 설정한 비밀번호 4자리"
                  className="w-full rounded-xl border border-slate-200 p-3 text-sm outline-none focus:border-sky-500"
                />
              </div>

              <button
                type="submit"
                className="w-full rounded-xl bg-emerald-600 py-3 text-sm font-black text-white hover:bg-emerald-500 transition shadow-md shadow-emerald-600/20"
              >
                비회원 예약 조회하기 🔍
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
