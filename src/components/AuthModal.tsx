"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { useAuth, type AuthTab } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { waterCenters } from "@/data/centers";

export function AuthModal() {
  const { isAuthOpen, authTab, closeAuthModal, loginWithSocial, loginWithEmail, signupWithEmail, loginAsStaff } = useAuth();
  const [tab, setTab] = useState<AuthTab>(authTab || "login");
  const modalScrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isAuthOpen) {
      setTab(authTab || "login");
      setLoginEmail("");
    }
  }, [isAuthOpen, authTab]);

  // 탭 전환 시 모달 내부 스크롤을 항상 최상단으로 리셋
  useEffect(() => {
    if (modalScrollRef.current) {
      modalScrollRef.current.scrollTo({ top: 0, behavior: "instant" });
    }
  }, [tab]);
  const router = useRouter();

  // Login form state (아이디 또는 이메일)
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPass, setLoginPass] = useState("");
  const [showLoginPass, setShowLoginPass] = useState(false);

  // Admin form state
  const [adminId, setAdminId] = useState("admin");
  const [adminPass, setAdminPass] = useState("");
  const [showAdminPass, setShowAdminPass] = useState(false);
  const [adminCenter, setAdminCenter] = useState("all");

  // Signup form state (6대 보완 요소 지원)
  const [signUpName, setSignUpName] = useState("");
  const [signUpEmail, setSignUpEmail] = useState("");
  const [signUpPass, setSignUpPass] = useState("");
  const [signUpPassConfirm, setSignUpPassConfirm] = useState("");
  const [signUpPhone, setSignUpPhone] = useState("");

  // 비밀번호 표시/숨기기 토글 상태
  const [showSignUpPass, setShowSignUpPass] = useState(false);
  const [showSignUpPassConfirm, setShowSignUpPassConfirm] = useState(false);

  // 이메일 중복 확인 상태
  const [isEmailChecked, setIsEmailChecked] = useState(false);
  const [emailCheckResult, setEmailCheckResult] = useState<{ ok: boolean; msg: string } | null>(null);

  // 약관 동의 상태
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [agreePrivacy, setAgreePrivacy] = useState(false);
  const [agreeMarketing, setAgreeMarketing] = useState(false);

  // 약관 및 개인정보 상세 모달 레이어 상태 (회원가입 창 위에 모달 팝업으로 표시)
  const [activeDetailModal, setActiveDetailModal] = useState<"terms" | "privacy" | null>(null);

  // Guest lookup form state
  const [guestPhone, setGuestPhone] = useState("");
  const [guestPin, setGuestPin] = useState("");
  const [showGuestModalPin, setShowGuestModalPin] = useState(false);

  // 탭 전환 시 또는 모달 열림/닫힘 시 모든 탭의 폼 입력값 및 캐시 상태 전면 초기화
  useEffect(() => {
    // 1. 회원가입 폼 초기화 (휴대폰 번호, 이름, 이메일, 비밀번호, 약관 동의 등)
    setSignUpName("");
    setSignUpEmail("");
    setSignUpPass("");
    setSignUpPassConfirm("");
    setSignUpPhone("");
    setShowSignUpPass(false);
    setShowSignUpPassConfirm(false);
    setIsEmailChecked(false);
    setEmailCheckResult(null);
    setAgreeTerms(false);
    setAgreePrivacy(false);
    setAgreeMarketing(false);

    // 2. 로그인 폼 비밀번호 초기화
    setLoginPass("");
    setShowLoginPass(false);

    // 3. 관리자 폼 비밀번호 초기화
    setAdminPass("");
    setShowAdminPass(false);

    // 4. 비회원 조회 폼 초기화
    setGuestPhone("");
    setGuestPin("");
    setShowGuestModalPin(false);

    // 5. 약관 모달 닫기
    setActiveDetailModal(null);
  }, [tab, isAuthOpen]);

  if (!isAuthOpen) return null;

  // 전화번호 자동 하이픈 포맷팅
  const formatPhone = (val: string) => {
    const digits = val.replace(/\D/g, "").slice(0, 11);
    if (digits.length <= 3) return digits;
    if (digits.length <= 7) return `${digits.slice(0, 3)}-${digits.slice(3)}`;
    return `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7)}`;
  };

  // 이메일 중복 검사 핸들러
  const handleCheckEmailDuplicate = () => {
    const email = signUpEmail.trim().toLowerCase();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email) {
      setEmailCheckResult({ ok: false, msg: "⚠️ 이메일 주소를 입력해주세요." });
      setIsEmailChecked(false);
      return;
    }
    if (!emailRegex.test(email)) {
      setEmailCheckResult({ ok: false, msg: "⚠️ 올바른 이메일 형식(user@domain.com)이 아닙니다." });
      setIsEmailChecked(false);
      return;
    }

    let isDuplicate = false;
    try {
      const raw = localStorage.getItem("kwater_registered_users_db");
      const users = raw ? JSON.parse(raw) : [];
      if (Array.isArray(users)) {
        isDuplicate = users.some((u: any) => u.email?.toLowerCase() === email);
      }
    } catch {}

    if (email === "user@kwater.or.kr" || email === "test@kwater.or.kr" || email === "admin@kwater.or.kr") {
      isDuplicate = true;
    }

    if (isDuplicate) {
      setEmailCheckResult({ ok: false, msg: "❌ 이미 사용 중인 이메일입니다." });
      setIsEmailChecked(false);
    } else {
      setEmailCheckResult({ ok: true, msg: "🟢 사용 가능한 이메일입니다." });
      setIsEmailChecked(true);
    }
  };

  // 비밀번호 고대비 강도 계산
  const getPasswordStrength = (pass: string) => {
    if (!pass) return { score: 0, label: "", badgeBg: "", barColor: "" };

    const hasLetter = /[a-zA-Z]/.test(pass);
    const hasNum = /[0-9]/.test(pass);
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(pass);

    if (pass.length < 8) {
      return {
        score: 1,
        label: "⚠️ 약함 (최소 8자 이상 필요)",
        badgeBg: "bg-red-100 text-red-800 border-red-300 font-black",
        barColor: "bg-red-600 shadow-sm shadow-red-500/50",
      };
    }

    if (hasLetter && hasNum && hasSpecial) {
      return {
        score: 3,
        label: "🔒 매우 안전 (영문+숫자+특수문자)",
        badgeBg: "bg-emerald-100 text-emerald-800 border-emerald-300 font-black",
        barColor: "bg-emerald-600 shadow-sm shadow-emerald-500/50",
      };
    }

    if (hasLetter && hasNum) {
      return {
        score: 2,
        label: "⚡ 보통 (특수문자 추가 권장)",
        badgeBg: "bg-amber-100 text-amber-900 border-amber-300 font-black",
        barColor: "bg-amber-500 shadow-sm shadow-amber-500/50",
      };
    }

    return {
      score: 1,
      label: "⚠️ 약함 (숫자/특수문자 필요)",
      badgeBg: "bg-red-100 text-red-800 border-red-300 font-black",
      barColor: "bg-red-600 shadow-sm shadow-red-500/50",
    };
  };

  // 약관 전체 동의 토글
  const handleToggleAgreeAll = (checked: boolean) => {
    setAgreeTerms(checked);
    setAgreePrivacy(checked);
    setAgreeMarketing(checked);
  };
  const isAgreeAll = agreeTerms && agreePrivacy && agreeMarketing;

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
    if (!loginEmail.trim()) {
      alert("아이디 또는 이메일을 입력해주세요.");
      return;
    }
    if (!loginPass.trim()) {
      alert("비밀번호를 입력해주세요.");
      return;
    }
    await loginWithEmail(loginEmail, loginPass);
  };

  const handleSignUpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!signUpName.trim()) {
      alert("⚠️ 이름을 입력해주세요.");
      return;
    }
    if (!signUpEmail.trim()) {
      alert("⚠️ 이메일을 입력해주세요.");
      return;
    }
    if (!isEmailChecked) {
      alert("⚠️ 이메일 중복 확인을 진행해주세요.");
      return;
    }
    if (signUpPass.length < 8) {
      alert("⚠️ 비밀번호는 최소 8자 이상이어야 합니다.");
      return;
    }
    if (signUpPass !== signUpPassConfirm) {
      alert("⚠️ 비밀번호와 비밀번호 확인이 일치하지 않습니다.");
      return;
    }
    if (!agreeTerms || !agreePrivacy) {
      alert("⚠️ 필수 약관(이용약관 및 개인정보 수집·이용)에 동의해 주세요.");
      return;
    }

    const success = await signupWithEmail(signUpName, signUpEmail, signUpPass, signUpPhone);
    if (success) {
      router.push("/mypage");
    }
  };

  const handleAdminSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminId.trim()) {
      alert("⚠️ 관리자 아이디를 입력해 주세요.");
      return;
    }
    if (!adminPass.trim()) {
      alert("⚠️ 관리자 비밀번호를 입력해 주세요.");
      return;
    }

    const trimmedId = adminId.trim().toLowerCase();
    let success = false;

    if (trimmedId === "admin" || trimmedId === "admin@kwater.or.kr") {
      success = await loginWithEmail("admin", adminPass);
    } else {
      success = await loginAsStaff(adminPass, adminCenter);
    }

    if (success) {
      closeAuthModal();
      router.push("/mypage");
    }
  };

  const handleGuestLookup = (e: React.FormEvent) => {
    e.preventDefault();
    if (!guestPhone || !guestPin) {
      alert("휴대폰 번호와 비회원 비밀번호 4자리를 입력해주세요.");
      return;
    }
    const targetPhone = guestPhone;
    const targetPin = guestPin;
    closeAuthModal();
    router.push(`/reserve?tab=lookup&phone=${encodeURIComponent(targetPhone)}&pin=${encodeURIComponent(targetPin)}`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/75 p-3 sm:p-4 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        ref={modalScrollRef}
        className="relative w-full max-w-md max-h-[92dvh] sm:max-h-[88vh] overflow-y-auto rounded-2xl sm:rounded-3xl border border-white/20 bg-white p-4 sm:p-6 md:p-8 shadow-2xl overscroll-contain"
      >
        {/* 닫기 버튼 */}
        <button
          onClick={closeAuthModal}
          className="absolute right-3.5 top-3.5 sm:right-5 sm:top-5 flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-full bg-slate-100 text-slate-500 transition hover:bg-slate-200 hover:text-slate-900 z-10"
          aria-label="닫기"
        >
          ✕
        </button>

        {/* 메인 브랜드 로고 */}
        <div className="flex justify-center pt-0 pb-2 sm:pb-3">
          <Image
            src="/images/kwater_waterhub_logo.png"
            alt="K-water 한국수자원공사 물문화관"
            width={1024}
            height={341}
            className="h-10 sm:h-12 md:h-14 w-auto object-contain"
            priority
          />
        </div>

        {/* 상단 탭 구분 (로그인 / 회원가입 / 비회원 / 관리자) */}
        <div className="grid grid-cols-4 border-b border-slate-200 pb-2 sm:pb-3 mb-3.5 sm:mb-5 gap-1 text-center">
          <button
            onClick={() => setTab("login")}
            className={`py-1.5 sm:py-2 text-[11px] sm:text-xs font-bold sm:font-black transition border-b-2 ${
              tab === "login"
                ? "border-sky-600 text-sky-600 font-extrabold"
                : "border-transparent text-slate-400 hover:text-slate-700"
            }`}
          >
            🔑 로그인
          </button>
          <button
            onClick={() => setTab("signup")}
            className={`py-1.5 sm:py-2 text-[11px] sm:text-xs font-bold sm:font-black transition border-b-2 ${
              tab === "signup"
                ? "border-sky-600 text-sky-600 font-extrabold"
                : "border-transparent text-slate-400 hover:text-slate-700"
            }`}
          >
            📝 가입
          </button>
          <button
            onClick={() => setTab("guest")}
            className={`py-1.5 sm:py-2 text-[11px] sm:text-xs font-bold sm:font-black transition border-b-2 ${
              tab === "guest"
                ? "border-emerald-600 text-emerald-600 font-extrabold"
                : "border-transparent text-slate-400 hover:text-slate-700"
            }`}
          >
            🎟️ 비회원
          </button>
          <button
            onClick={() => setTab("admin")}
            className={`py-1.5 sm:py-2 text-[11px] sm:text-xs font-bold sm:font-black transition border-b-2 ${
              tab === "admin"
                ? "border-slate-900 text-slate-900 font-extrabold"
                : "border-transparent text-slate-400 hover:text-slate-700"
            }`}
          >
            🛡️ 관리자
          </button>
        </div>

        {/* 1. 통합 로그인 탭 */}
        {tab === "login" && (
          <div key="login-tab" className="space-y-3.5 sm:space-y-4">
            <div className="text-center">
              <h2 className="text-lg sm:text-xl font-black text-slate-900">물문화관 로그인</h2>
              <p className="mt-0.5 sm:mt-1 text-[11px] sm:text-xs text-slate-500 font-semibold">
                소셜 로그인 또는 아이디/이메일로 로그인하세요.
              </p>
            </div>

            {/* 소셜 로그인 버튼 그룹 (모바일 화면 최적화 2열 그리드) */}
            <div className="grid grid-cols-2 gap-2 pt-0.5">
              <button
                type="button"
                onClick={() => handleSocialClick("kakao")}
                className="w-full flex items-center justify-center gap-1.5 sm:gap-2 rounded-xl bg-[#FEE500] py-2.5 sm:py-3 text-xs sm:text-sm font-bold text-[#191919] transition hover:bg-[#FDD800] shadow-xs active:scale-[0.99]"
              >
                <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 3C6.477 3 2 6.477 2 10.767c0 2.766 1.843 5.19 4.636 6.564l-.946 3.473a.4.4 0 00.518.477l4.137-2.738c.535.053 1.084.084 1.655.084 5.523 0 10-3.477 10-7.767S17.523 3 12 3z" />
                </svg>
                <span className="truncate">카카오 로그인</span>
              </button>

              <button
                type="button"
                onClick={() => handleSocialClick("naver")}
                className="w-full flex items-center justify-center gap-1.5 sm:gap-2 rounded-xl bg-[#03C75A] py-2.5 sm:py-3 text-xs sm:text-sm font-bold text-white transition hover:bg-[#02B351] shadow-xs active:scale-[0.99]"
              >
                <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M16.273 12.845 7.376 0H0v24h7.727V11.155L16.624 24H24V0h-7.727z" />
                </svg>
                <span className="truncate">네이버 로그인</span>
              </button>
            </div>

            <div className="relative flex items-center justify-center my-2.5 sm:my-3">
              <div className="w-full border-t border-slate-200" />
              <span className="absolute bg-white px-2.5 text-[11px] sm:text-xs text-slate-400 font-bold">또는 아이디/이메일 로그인</span>
            </div>

            <form onSubmit={handleLoginSubmit} className="space-y-2.5 sm:space-y-3" autoComplete="off">
              <div>
                <label className="block text-[11px] sm:text-xs font-bold text-slate-700 mb-1">아이디 또는 이메일주소</label>
                <input
                  type="text"
                  autoComplete="off"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  placeholder="아이디 또는 이메일 주소 입력"
                  className="w-full rounded-xl border border-slate-200 py-2 sm:py-2.5 px-3 text-[16px] sm:text-sm outline-none focus:border-sky-500"
                />
              </div>

              <div>
                <label className="block text-[11px] sm:text-xs font-bold text-slate-700 mb-1">비밀번호</label>
                <div className="relative flex items-center">
                  <input
                    type={showLoginPass ? "text" : "password"}
                    autoComplete="current-password"
                    value={loginPass}
                    onChange={(e) => setLoginPass(e.target.value)}
                    placeholder="비밀번호 입력"
                    className="w-full rounded-xl border border-slate-200 py-2 sm:py-2.5 px-3 pr-10 text-[16px] sm:text-sm outline-none focus:border-sky-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowLoginPass(!showLoginPass)}
                    className="absolute right-3 p-1 text-slate-400 hover:text-slate-600 transition"
                    title={showLoginPass ? "비밀번호 숨기기" : "비밀번호 보기"}
                  >
                    {showLoginPass ? (
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
                className="w-full rounded-xl bg-slate-900 py-2.5 sm:py-3 text-sm font-black text-white hover:bg-slate-800 transition shadow-md"
              >
                🔑 로그인
              </button>

              <div className="pt-2 text-center border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setTab("admin")}
                  className="text-[11px] sm:text-xs font-bold text-slate-500 hover:text-slate-900 transition underline underline-offset-2 inline-flex items-center gap-1 mx-auto"
                >
                  <span>🛡️ K-water 관리자 계정으로 로그인</span>
                </button>
              </div>
            </form>
          </div>
        )}

        {/* 3. 회원가입 탭 (6대 보완 요소 반영 및 모바일 최적화) */}
        {tab === "signup" && (
          <div key="signup-tab" className="space-y-3 sm:space-y-4">
            <div className="text-center">
              <h2 className="text-lg sm:text-xl font-black text-slate-900">관람객 회원가입</h2>
              <p className="mt-0.5 sm:mt-1 text-[11px] sm:text-xs text-slate-500 font-semibold">
                가입 후 투어 예약 및 커뮤니티 서비스를 이용해 보세요.
              </p>
            </div>

            {/* 소셜 간편가입 버튼 그룹 (모바일 최적화 2열 그리드) */}
            <div className="grid grid-cols-2 gap-2 pt-0.5">
              <button
                type="button"
                onClick={() => handleSocialClick("kakao")}
                className="w-full flex items-center justify-center gap-1.5 sm:gap-2 rounded-xl bg-[#FEE500] py-2.5 sm:py-3 text-xs sm:text-sm font-bold text-[#191919] transition hover:bg-[#FDD800] shadow-xs active:scale-[0.99]"
              >
                <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 3C6.477 3 2 6.477 2 10.767c0 2.766 1.843 5.19 4.636 6.564l-.946 3.473a.4.4 0 00.518.477l4.137-2.738c.535.053 1.084.084 1.655.084 5.523 0 10-3.477 10-7.767S17.523 3 12 3z" />
                </svg>
                <span className="truncate">카카오로 시작</span>
              </button>

              <button
                type="button"
                onClick={() => handleSocialClick("naver")}
                className="w-full flex items-center justify-center gap-1.5 sm:gap-2 rounded-xl bg-[#03C75A] py-2.5 sm:py-3 text-xs sm:text-sm font-bold text-white transition hover:bg-[#02B351] shadow-xs active:scale-[0.99]"
              >
                <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M16.273 12.845 7.376 0H0v24h7.727V11.155L16.624 24H24V0h-7.727z" />
                </svg>
                <span className="truncate">네이버로 시작</span>
              </button>
            </div>

            <div className="relative flex items-center justify-center my-2 sm:my-3">
              <div className="w-full border-t border-slate-200" />
              <span className="absolute bg-white px-2.5 text-[11px] sm:text-xs text-slate-400 font-bold">또는 직접 정보 입력하여 가입</span>
            </div>

            <form onSubmit={handleSignUpSubmit} className="space-y-2.5 sm:space-y-3.5 pt-0.5 text-left" autoComplete="off">
              {/* 1. 이름 */}
              <div>
                <label className="block text-[11px] sm:text-xs font-bold text-slate-700 mb-1">이름 *</label>
                <input
                  type="text"
                  autoComplete="off"
                  value={signUpName}
                  onChange={(e) => setSignUpName(e.target.value)}
                  placeholder="홍길동"
                  className="w-full rounded-xl border border-slate-200 py-2 sm:py-2.5 px-3 text-[16px] sm:text-sm outline-none focus:border-sky-500"
                />
              </div>

              {/* 2. 이메일 (아이디) + 중복 확인 버튼 */}
              <div>
                <label className="block text-[11px] sm:text-xs font-bold text-slate-700 mb-1">이메일 (아이디) *</label>
                <div className="flex gap-2">
                  <input
                    type="email"
                    autoComplete="off"
                    value={signUpEmail}
                    onChange={(e) => {
                      setSignUpEmail(e.target.value);
                      setIsEmailChecked(false);
                      setEmailCheckResult(null);
                    }}
                    placeholder="user@kwater.or.kr"
                    className="flex-1 rounded-xl border border-slate-200 py-2 sm:py-2.5 px-3 text-[16px] sm:text-sm outline-none focus:border-sky-500"
                  />
                  <button
                    type="button"
                    onClick={handleCheckEmailDuplicate}
                    className="shrink-0 rounded-xl bg-slate-800 px-3 py-2 text-[11px] sm:text-xs font-bold text-white hover:bg-slate-700 transition"
                  >
                    중복 확인
                  </button>
                </div>
                {emailCheckResult && (
                  <p className={`mt-1 text-[11px] font-bold ${emailCheckResult.ok ? "text-emerald-600" : "text-rose-600"}`}>
                    {emailCheckResult.msg}
                  </p>
                )}
              </div>

              {/* 3. 비밀번호 + 표시/숨기기 토글 + 강도 측정 */}
              <div>
                <label className="block text-[11px] sm:text-xs font-bold text-slate-700 mb-1">비밀번호 * (최소 8자)</label>
                <div className="relative flex items-center">
                  <input
                    type={showSignUpPass ? "text" : "password"}
                    autoComplete="new-password"
                    value={signUpPass}
                    onChange={(e) => setSignUpPass(e.target.value)}
                    placeholder="8자 이상 (영문, 숫자, 특수문자)"
                    className="w-full rounded-xl border border-slate-200 py-2 sm:py-2.5 px-3 pr-10 text-[16px] sm:text-sm outline-none focus:border-sky-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowSignUpPass(!showSignUpPass)}
                    className="absolute right-3 p-1 text-slate-400 hover:text-slate-600 transition"
                    title={showSignUpPass ? "비밀번호 숨기기" : "비밀번호 보기"}
                  >
                    {showSignUpPass ? (
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
                {/* 비밀번호 강도 게이지 */}
                {signUpPass && (() => {
                  const strength = getPasswordStrength(signUpPass);
                  return (
                    <div className="mt-1.5 space-y-1 rounded-xl border border-slate-300 bg-slate-100/90 p-2 sm:p-2.5 shadow-inner">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="font-extrabold text-slate-700">비밀번호 보안 강도</span>
                        <span className={`inline-block rounded-md px-2 py-0.5 text-[10px] border ${strength.badgeBg}`}>
                          {strength.label}
                        </span>
                      </div>
                      <div className="grid grid-cols-3 gap-1.5 h-2 w-full">
                        <div className={`rounded-full transition-all duration-300 ${strength.score >= 1 ? strength.barColor : "bg-slate-300/80 border border-slate-400/40"}`} />
                        <div className={`rounded-full transition-all duration-300 ${strength.score >= 2 ? strength.barColor : "bg-slate-300/80 border border-slate-400/40"}`} />
                        <div className={`rounded-full transition-all duration-300 ${strength.score >= 3 ? strength.barColor : "bg-slate-300/80 border border-slate-400/40"}`} />
                      </div>
                    </div>
                  );
                })()}
              </div>

              {/* 4. 비밀번호 재확인 + 실시간 일치 검증 */}
              <div>
                <label className="block text-[11px] sm:text-xs font-bold text-slate-700 mb-1">비밀번호 확인 *</label>
                <div className="relative flex items-center">
                  <input
                    type={showSignUpPassConfirm ? "text" : "password"}
                    autoComplete="new-password"
                    value={signUpPassConfirm}
                    onChange={(e) => setSignUpPassConfirm(e.target.value)}
                    placeholder="비밀번호 재입력"
                    className="w-full rounded-xl border border-slate-200 py-2 sm:py-2.5 px-3 pr-10 text-[16px] sm:text-sm outline-none focus:border-sky-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowSignUpPassConfirm(!showSignUpPassConfirm)}
                    className="absolute right-3 p-1 text-slate-400 hover:text-slate-600 transition"
                    title={showSignUpPassConfirm ? "비밀번호 숨기기" : "비밀번호 보기"}
                  >
                    {showSignUpPassConfirm ? (
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
                {signUpPassConfirm && (
                  <p
                    className={`mt-1 text-[11px] font-bold ${
                      signUpPass === signUpPassConfirm ? "text-emerald-600" : "text-rose-600"
                    }`}
                  >
                    {signUpPass === signUpPassConfirm ? "🟢 비밀번호가 일치합니다." : "🔴 비밀번호가 일치하지 않습니다."}
                  </p>
                )}
              </div>

              {/* 5. 휴대폰 번호 (자동 하이픈) */}
              <div>
                <label className="block text-[11px] sm:text-xs font-bold text-slate-700 mb-1">휴대폰 번호 (선택)</label>
                <input
                  key={`signup-phone-${tab}`}
                  type="tel"
                  inputMode="numeric"
                  maxLength={13}
                  autoComplete="off"
                  value={signUpPhone}
                  onChange={(e) => setSignUpPhone(formatPhone(e.target.value))}
                  placeholder="010-1234-5678"
                  className="w-full rounded-xl border border-slate-200 py-2 sm:py-2.5 px-3 text-[16px] sm:text-sm outline-none focus:border-sky-500"
                />
              </div>

              {/* 6. 약관 동의 체크박스 그룹 */}
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-2.5 sm:p-3 space-y-1.5 sm:space-y-2 text-[11px] sm:text-xs">
                <label className="flex items-center gap-2 font-black text-slate-900 border-b border-slate-200 pb-1.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isAgreeAll}
                    onChange={(e) => handleToggleAgreeAll(e.target.checked)}
                    className="h-4 w-4 rounded border-slate-300 text-sky-600 focus:ring-sky-500"
                  />
                  <span>전체 동의하기</span>
                </label>
                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2 text-slate-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={agreeTerms}
                      onChange={(e) => setAgreeTerms(e.target.checked)}
                      className="h-3.5 w-3.5 rounded border-slate-300 text-sky-600 focus:ring-sky-500"
                    />
                    <span><strong className="text-sky-700">[필수]</strong> 이용약관 동의</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => setActiveDetailModal("terms")}
                    className="text-[11px] font-bold text-sky-600 hover:text-sky-800 underline underline-offset-2 hover:bg-sky-50 px-1.5 py-0.5 rounded transition cursor-pointer"
                  >
                    전문보기
                  </button>
                </div>
                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2 text-slate-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={agreePrivacy}
                      onChange={(e) => setAgreePrivacy(e.target.checked)}
                      className="h-3.5 w-3.5 rounded border-slate-300 text-sky-600 focus:ring-sky-500"
                    />
                    <span><strong className="text-sky-700">[필수]</strong> 개인정보 수집 및 이용 동의</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => setActiveDetailModal("privacy")}
                    className="text-[11px] font-bold text-sky-600 hover:text-sky-800 underline underline-offset-2 hover:bg-sky-50 px-1.5 py-0.5 rounded transition cursor-pointer"
                  >
                    전문보기
                  </button>
                </div>
                <label className="flex items-center gap-2 text-slate-500 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={agreeMarketing}
                    onChange={(e) => setAgreeMarketing(e.target.checked)}
                    className="h-3.5 w-3.5 rounded border-slate-300 text-sky-600 focus:ring-sky-500"
                  />
                  <span>[선택] 수변 문화행사 및 소식 수신 동의</span>
                </label>
              </div>

              <button
                type="submit"
                className="w-full rounded-xl bg-sky-600 py-2.5 sm:py-3 text-sm font-black text-white hover:bg-sky-500 transition shadow-md shadow-sky-600/20 cursor-pointer"
              >
                관람객 회원가입 완료
              </button>
            </form>
          </div>
        )}

        {/* 4. 비회원 예약조회 탭 */}
        {tab === "guest" && (
          <div key="guest-tab" className="space-y-3 sm:space-y-4">
            <div className="text-center">
              <h2 className="text-lg sm:text-xl font-black text-slate-900">비회원 투어 예약 조회</h2>
              <p className="mt-0.5 sm:mt-1 text-[11px] sm:text-xs text-slate-500 font-semibold">
                회원가입 없이 예약할 때 설정한 연락처와 비밀번호로 내역을 조회합니다.
              </p>
            </div>

            <form onSubmit={handleGuestLookup} className="space-y-2.5 sm:space-y-3 pt-1 text-left" autoComplete="off">
              <div>
                <label className="block text-[11px] sm:text-xs font-bold text-slate-700 mb-1">예약자 휴대폰 번호</label>
                <input
                  type="tel"
                  inputMode="numeric"
                  maxLength={13}
                  autoComplete="off"
                  value={guestPhone}
                  onChange={(e) => setGuestPhone(formatPhone(e.target.value))}
                  placeholder="010-1234-5678"
                  className="w-full rounded-xl border border-slate-200 py-2 sm:py-2.5 px-3 text-[16px] sm:text-sm outline-none focus:border-sky-500"
                />
              </div>

              <div>
                <label className="block text-[11px] sm:text-xs font-bold text-slate-700 mb-1">비회원 비밀번호 (숫자 4자리)</label>
                <div className="relative flex items-center">
                  <input
                    type={showGuestModalPin ? "text" : "password"}
                    maxLength={4}
                    autoComplete="new-password"
                    value={guestPin}
                    onChange={(e) => setGuestPin(e.target.value)}
                    placeholder="예약 시 설정한 비밀번호 4자리"
                    className="w-full rounded-xl border border-slate-200 py-2 sm:py-2.5 px-3 pr-10 text-[16px] sm:text-sm outline-none focus:border-sky-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowGuestModalPin(!showGuestModalPin)}
                    className="absolute right-3 p-1 text-slate-400 hover:text-slate-600 transition"
                    title={showGuestModalPin ? "비밀번호 숨기기" : "비밀번호 보기"}
                  >
                    {showGuestModalPin ? (
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
                className="w-full rounded-xl bg-emerald-600 py-2.5 sm:py-3 text-sm font-black text-white hover:bg-emerald-500 transition shadow-md shadow-emerald-600/20 cursor-pointer"
              >
                비회원 예약 조회하기 🔍
              </button>
            </form>
          </div>
        )}

        {/* 5. 관리자 전용 로그인 탭 */}
        {tab === "admin" && (
          <div key="admin-tab" className="space-y-3 sm:space-y-4">
            <div className="text-center">
              <h2 className="text-lg sm:text-xl font-black text-slate-900">관리자 전용 로그인</h2>
              <p className="mt-0.5 sm:mt-1 text-[11px] sm:text-xs text-slate-500 font-semibold">
                통합 관제 및 물문화관 담당자 전용 인증 공간입니다.
              </p>
            </div>

            <form onSubmit={handleAdminSubmit} className="space-y-2.5 sm:space-y-3 pt-1 text-left" autoComplete="off">
              <div>
                <label className="block text-[11px] sm:text-xs font-bold text-slate-700 mb-1">관리자 아이디 / 이메일 *</label>
                <input
                  type="text"
                  autoComplete="off"
                  value={adminId}
                  onChange={(e) => setAdminId(e.target.value)}
                  placeholder="admin 또는 admin@kwater.or.kr"
                  className="w-full rounded-xl border border-slate-200 py-2 sm:py-2.5 px-3 text-[16px] sm:text-sm font-semibold outline-none focus:border-slate-900 focus:ring-2 focus:ring-slate-900/20"
                />
              </div>

              <div>
                <label className="block text-[11px] sm:text-xs font-bold text-slate-700 mb-1">관리 비밀번호 *</label>
                <div className="relative flex items-center">
                  <input
                    type={showAdminPass ? "text" : "password"}
                    autoComplete="current-password"
                    value={adminPass}
                    onChange={(e) => setAdminPass(e.target.value)}
                    placeholder="관리자 비밀번호 입력"
                    className="w-full rounded-xl border border-slate-200 py-2 sm:py-2.5 px-3 pr-10 text-[16px] sm:text-sm font-semibold outline-none focus:border-slate-900 focus:ring-2 focus:ring-slate-900/20"
                  />
                  <button
                    type="button"
                    onClick={() => setShowAdminPass(!showAdminPass)}
                    className="absolute right-3 p-1 text-slate-400 hover:text-slate-600 transition"
                    title={showAdminPass ? "비밀번호 숨기기" : "비밀번호 보기"}
                  >
                    {showAdminPass ? (
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

              <div>
                <label className="block text-[11px] sm:text-xs font-bold text-slate-700 mb-1">담당 물문화관 지정</label>
                <select
                  value={adminCenter}
                  onChange={(e) => setAdminCenter(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2 sm:py-2.5 px-3 text-[14px] sm:text-xs font-bold text-slate-800 outline-none focus:ring-2 focus:ring-slate-900/20"
                >
                  <option value="all">🏛️ K-water 전 시설 (통합 관제)</option>
                  {waterCenters.map((c) => (
                    <option key={c.id} value={c.id}>
                      📍 {c.name} ({c.sido})
                    </option>
                  ))}
                </select>
              </div>

              <button
                type="submit"
                className="w-full rounded-xl bg-slate-900 py-2.5 sm:py-3 text-sm font-black text-white hover:bg-slate-800 transition shadow-lg shadow-slate-900/20 flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>🛡️</span> 관리자 콘솔 로그인
              </button>
            </form>
          </div>
        )}
      </div>

      {/* ── 회원가입 창 위에 바로 뜨는 이용약관 및 개인정보 상세 모달 레이어 ── */}
      {activeDetailModal && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-xs animate-in fade-in duration-150"
          onClick={() => setActiveDetailModal(null)}
        >
          <div
            className="relative w-full max-w-lg max-h-[82vh] flex flex-col rounded-2xl bg-white shadow-2xl border border-slate-200 overflow-hidden"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
          >
            {/* 모달 상단 헤더 */}
            <div className="flex items-center justify-between border-b border-slate-200 px-5 py-3.5 bg-slate-50 shrink-0">
              <h3 className="text-sm sm:text-base font-bold text-slate-900 flex items-center gap-2">
                {activeDetailModal === "terms" ? (
                  <>
                    <span>📜</span> K-water 온라인 물문화관 서비스 이용약관
                  </>
                ) : (
                  <>
                    <span>📋</span> 개인정보 수집 및 이용 동의 안내
                  </>
                )}
              </h3>
              <button
                type="button"
                onClick={() => setActiveDetailModal(null)}
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-200 hover:text-slate-700 transition"
                aria-label="닫기"
              >
                ✕
              </button>
            </div>

            {/* 모달 스크롤 본문 */}
            <div className="overflow-y-auto px-5 py-4 space-y-4 text-xs text-slate-700 leading-relaxed max-h-[62vh]">
              {activeDetailModal === "terms" ? (
                <>
                  <div className="rounded-xl bg-sky-50/80 p-3 border border-sky-100 text-sky-950 font-medium">
                    본 약관은 한국수자원공사(이하 &quot;공사&quot;)가 운영하는 K-water 온라인 물문화관의 제반 서비스 이용과 관련하여 공사와 이용자의 권리, 의무, 책임사항 및 공정거래위원회 표준약관 준수사항을 규정합니다.
                  </div>

                  {/* 사업자 기본 신원 정보 고지 (전자상거래법 제10조 및 약관법 제3조 준수) */}
                  <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200 text-[11px] text-slate-600 space-y-0.5">
                    <p>• <strong>서비스 제공자:</strong> 한국수자원공사 (대표자: 윤석대)</p>
                    <p>• <strong>사업자등록번호:</strong> 314-82-01600 · <strong>대표전화:</strong> 042-629-3114 (고객센터: 1577-0600)</p>
                    <p>• <strong>소재지:</strong> 대전광역시 대덕구 신탄진로 200 (한국수자원공사 본사)</p>
                  </div>

                  <div className="space-y-1">
                    <h4 className="font-bold text-slate-900">제1조 (목적)</h4>
                    <p className="text-slate-600">
                      본 약관은 공사가 운영하는 K-water 온라인 물문화관(이하 &quot;물문화관&quot;)이 제공하는 전국 20개 물문화관 전시 안내, 가이드 투어 예약, 문화·체험 행사, 분실물 센터, 소통과 의견 게시판 등 제반 온라인 서비스(이하 &quot;서비스&quot;)의 이용조건 및 절차, 이용자와 공사의 권리·의무 및 책임사항을 규정함을 목적으로 합니다.
                    </p>
                  </div>

                  <div className="space-y-1">
                    <h4 className="font-bold text-slate-900">제2조 (용어의 정의)</h4>
                    <ul className="list-disc list-inside space-y-0.5 pl-1 text-slate-600">
                      <li>&quot;서비스&quot;란 공사가 물문화관 웹사이트를 통해 관람객 및 국민에게 제공하는 정보 안내, 투어 예약, 행사 접수 등의 온라인 제반 기능을 말합니다.</li>
                      <li>&quot;이용자&quot;란 물문화관 웹사이트에 접속하여 본 약관에 따라 서비스를 이용하는 회원 및 비회원을 말합니다.</li>
                      <li>&quot;회원&quot;이란 본 약관에 동의하고 소정의 가입 절차를 거쳐 정상적으로 회원 등록을 완료한 자를 말합니다.</li>
                      <li>&quot;비회원&quot;이란 회원으로 가입하지 않고 가이드 투어 예약 조회, 시설 안내 열람 등 제한된 서비스를 이용하는 자를 말합니다.</li>
                    </ul>
                  </div>

                  <div className="space-y-1">
                    <h4 className="font-bold text-slate-900">제3조 (약관의 명시, 효력 및 개정)</h4>
                    <p className="text-slate-600">
                      1. 본 약관은 회원이 쉽게 알 수 있도록 서비스 초기 화면 또는 회원가입 창에 게시함으로써 효력이 발생합니다.<br />
                      2. 공사는 「약관의 규제에 관한 법률」, 「개인정보 보호법」 등 관련 법령을 위배하지 않는 범위에서 본 약관을 개정할 수 있습니다.<br />
                      3. 약관이 개정되는 경우 공사는 개정 약관의 적용일자 7일 전부터 웹사이트에 공지하며, 회원에게 불리한 변경의 경우에는 최소 30일 전에 사전 공지합니다.<br />
                      4. 공사가 전항에 따라 개정약관을 공지하면서 회원에게 &apos;공지 기간 내에 명시적 거부 의사를 표시하지 아니하면 개정약관에 동의한 것으로 본다&apos;는 뜻을 명확히 고지하였음에도 회원이 거부 의사를 표명하지 아니한 경우 개정에 동의한 것으로 봅니다. 회원이 개정약관에 동의하지 않는 경우 회원 탈퇴(이용계약 해지)를 할 수 있습니다.
                    </p>
                  </div>

                  <div className="space-y-1">
                    <h4 className="font-bold text-slate-900">제4조 (이용계약의 성립 및 회원가입)</h4>
                    <p className="text-slate-600">
                      1. 이용계약은 가입 희망자가 본 약관 및 개인정보 수집·이용 동의서에 동의한 후, 회원가입 신청을 하고 공사가 이를 승낙함으로써 성립합니다.<br />
                      2. 공사는 다음 각 호에 해당하는 경우 가입 신청에 대한 승낙을 유보하거나 거부할 수 있습니다:
                    </p>
                    <ul className="list-disc list-inside space-y-0.5 pl-2 text-slate-500 text-[11px]">
                      <li>타인의 명의나 이메일을 무단 도용하여 신청한 경우</li>
                      <li>허위의 정보를 기재하거나 필수 기재사항을 누락한 경우</li>
                      <li>법령 또는 공공질서 및 미풍양속을 저해할 목적으로 신청한 경우</li>
                      <li>만 14세 미만 아동이 법정대리인의 동의 없이 신청한 경우</li>
                      <li>서비스 설비 용량에 여유가 없거나 기술상·업무상 장애가 있는 경우</li>
                    </ul>
                  </div>

                  <div className="space-y-1">
                    <h4 className="font-bold text-slate-900">제5조 (서비스의 제공, 변경 및 중단)</h4>
                    <p className="text-slate-600">
                      1. 물문화관은 연중무휴, 1일 24시간 서비스를 제공함을 원칙으로 합니다.<br />
                      2. 공사는 시스템 정기 점검, 서버 교체, 통신망 장애 또는 시설 현장 상황 등에 따라 서비스의 전부 또는 일부를 일시적으로 제한하거나 중단할 수 있으며, 이 경우 사전에 공지합니다. 단, 긴급한 장애나 불가피한 사유가 있는 경우에는 사후에 공지할 수 있습니다.
                    </p>
                  </div>

                  <div className="space-y-1">
                    <h4 className="font-bold text-slate-900">제6조 (회원에 대한 통지)</h4>
                    <p className="text-slate-600">
                      1. 공사가 회원에게 통지를 하는 경우, 회원이 등록한 전자우편(이메일) 주소 또는 서비스 내 알림창으로 할 수 있습니다.<br />
                      2. 불특정 다수 회원에 대한 통지의 경우 7일 이상 서비스 게시판 또는 팝업 화면에 게시함으로써 개별 통지에 갈음할 수 있습니다. 단, 회원 본인의 거래 또는 예약과 관련하여 중대한 영향을 미치는 사항은 개별 통지합니다.
                    </p>
                  </div>

                  <div className="space-y-1">
                    <h4 className="font-bold text-slate-900">제7조 (회원의 아이디 및 비밀번호 관리의무)</h4>
                    <p className="text-slate-600">
                      1. 회원의 아이디(이메일)와 비밀번호에 관한 관리책임은 회원 본인에게 있습니다.<br />
                      2. 회원은 자신의 아이디 및 비밀번호를 제3자에게 양도하거나 대여할 수 없으며, 도용이나 유출 사실을 인지한 즉시 공사에 통보하고 공사의 안내에 따라야 합니다.
                    </p>
                  </div>

                  <div className="space-y-1">
                    <h4 className="font-bold text-slate-900">제8조 (회원의 의무 및 금지행위)</h4>
                    <p className="text-slate-600">
                      회원은 다음 각 호의 행위를 하여서는 안 되며, 위반 시 서비스 이용 제한 및 법적 조치가 따를 수 있습니다:
                    </p>
                    <ul className="list-disc list-inside space-y-0.5 pl-2 text-slate-500 text-[11px]">
                      <li>가입 신청 또는 정보 변경 시 허위 내용을 등록하는 행위</li>
                      <li>타인의 정보(이메일, 연락처, 비밀번호 등)를 무단 도용하는 행위</li>
                      <li>자동화된 프로그램(매크로, 스크립트 등)을 이용하여 가이드 투어 및 행사를 부정하게 예약·선점하거나 전매하는 행위</li>
                      <li>공사의 사전 승인 없이 서비스를 상업적·영리 목적으로 이용하는 행위</li>
                      <li>게시판에 음란, 폭력, 비방, 허위사실 유포 등 공공질서 및 미풍양속에 반하는 내용을 게시하는 행위</li>
                      <li>시스템에 비정상적인 반복 호출(DDoS 등)을 가하거나 보안 취약점을 악용하는 행위</li>
                    </ul>
                  </div>

                  <div className="space-y-1">
                    <h4 className="font-bold text-slate-900">제9조 (게시물의 저작권 및 관리)</h4>
                    <p className="text-slate-600">
                      1. 회원이 서비스 내에 게시한 글, 사진, 의견 등의 저작권은 해당 게시자에게 귀속됩니다. 공사는 사이트 운영 및 물문화관 홍보 목적으로 서비스 내에서 해당 게시물을 무상으로 게시·활용할 수 있습니다.<br />
                      2. 공사는 회원이 게시한 내용이 타인의 명예를 훼손하거나 저작권 등 제3자의 권리를 침해하는 경우 「정보통신망 이용촉진 및 정보보호 등에 관한 법률」 및 「저작권법」에 따라 사전 통보 없이 임시조치 또는 삭제할 수 있습니다.
                    </p>
                  </div>

                  <div className="space-y-1">
                    <h4 className="font-bold text-slate-900">제10조 (계약 해지 및 이용 제한)</h4>
                    <p className="text-slate-600">
                      1. 회원은 언제든지 서비스 내 마이페이지 등을 통해 회원 탈퇴(이용계약 해지)를 신청할 수 있으며, 공사는 관계 법령이 정하는 바에 따라 지체 없이 처리합니다.<br />
                      2. 회원이 본 약관의 의무를 위반하거나 서비스의 정상적인 운영을 방해한 경우, 공사는 경고, 일시정지, 영구이용정지 등으로 서비스 이용을 단계적으로 제한할 수 있습니다.
                    </p>
                  </div>

                  <div className="space-y-1">
                    <h4 className="font-bold text-slate-900">제11조 (손해배상 및 면책조항)</h4>
                    <p className="text-slate-600">
                      1. 공사 또는 회원이 본 약관의 규정을 위반하여 상대방에게 손해를 입힌 경우, 귀책사유 있는 당사자는 그 손해를 배상할 책임을 집니다. 단, 공사는 무료로 제공되는 서비스의 이용과 관련하여 관련 법령에 특별한 규정이 없는 한 책임을 지지 않습니다.<br />
                      2. 공사는 천재지변, 전시, 사변 또는 이에 준하는 국가 비상사태 등 불가항력으로 인하여 서비스를 제공할 수 없는 경우에는 서비스 제공에 관한 책임이 면제됩니다.<br />
                      3. 공사는 회원의 귀책사유로 인한 서비스 이용 장애에 대하여 책임을 지지 않습니다. 단, 공사에게 고의 또는 중대한 과실이 있는 경우에는 그러하지 아니합니다.<br />
                      4. 공사는 회원이 서비스를 통하여 게시하거나 전송한 정보, 자료, 사실의 신뢰도 및 정확성에 대하여 고의 또는 중과실이 없는 한 책임을 지지 않습니다.
                    </p>
                  </div>

                  <div className="space-y-1">
                    <h4 className="font-bold text-slate-900">제12조 (준거법 및 분쟁해결)</h4>
                    <p className="text-slate-600">
                      1. 본 약관의 해석 및 공사와 회원 간의 분쟁에 대하여는 대한민국 법률을 준거법으로 적용합니다.<br />
                      2. 서비스 이용과 관련하여 공사와 회원 간에 분쟁이 발생한 경우 상호 원만하게 해결하기 위하여 성실히 협의합니다.<br />
                      3. 본 분쟁에 관한 소송은 제소 당시 이용자의 주소에 의하고, 주소가 없는 경우에는 거소를 관할하는 지방법원의 전속관할로 합니다. 단, 제소 당시 이용자의 주소 또는 거소가 분명하지 아니한 경우에는 「민사소송법」상의 관할법원에 따릅니다.
                    </p>
                  </div>

                  <div className="pt-2 text-[11px] text-slate-500 border-t border-slate-200">
                    <strong>부칙</strong>: 본 약관은 2026년 10월 29일부터 시행됩니다.
                  </div>
                </>
              ) : (
                <>
                  <div className="rounded-xl bg-sky-50/80 p-3 border border-sky-100 text-sky-950 font-medium">
                    K-water 온라인 물문화관은 <strong>「개인정보 보호법」 제15조(수집·이용), 제21조(파기), 제22조(동의 방법), 제22조의2(아동 동의), 제30조(처리방침)</strong>에 따라 회원가입 시 아래와 같이 개인정보를 수집·이용하며, 정보주체의 권리를 안전하게 보호합니다.
                  </div>

                  {/* 1. 수집 목적 */}
                  <div className="space-y-1">
                    <h4 className="font-bold text-slate-900 flex items-center gap-1.5">
                      <span className="text-sky-600 font-black">1.</span> 개인정보의 수집 및 이용 목적 (개인정보보호법 제15조제2항제1호)
                    </h4>
                    <ul className="list-disc list-inside space-y-0.5 pl-1 text-slate-600 bg-slate-50 p-2.5 rounded-lg border border-slate-200/70">
                      <li><strong>회원 가입 및 관리:</strong> 회원 가입 의사 확인, 회원제 서비스 제공에 따른 본인 식별·인증, 회원자격 유지 및 관리, 제한적 본인확인제 시행에 따른 본인확인</li>
                      <li><strong>문화관 서비스 제공:</strong> 전국 20개 물문화관 가이드 투어 예약 접수 및 내역 관리, 문화·체험 행사 참여 신청 및 당첨자 안내, 물 이야기/분실물 게시판 작성자 본인 확인</li>
                      <li><strong>고충 처리 및 고지사항 전달:</strong> 서비스 이용 관련 중요 공지, 민원·불만 처리, 불량 회원의 부정 이용 방지 및 분쟁 조정을 위한 기록 보존</li>
                    </ul>
                  </div>

                  {/* 2. 수집 항목 */}
                  <div className="space-y-1">
                    <h4 className="font-bold text-slate-900 flex items-center gap-1.5">
                      <span className="text-sky-600 font-black">2.</span> 수집하는 개인정보의 항목 (개인정보보호법 제15조제2항제2호 & 제22조)
                    </h4>
                    <div className="rounded-lg border border-slate-200 overflow-hidden">
                      <table className="min-w-full divide-y divide-slate-200 text-left text-xs">
                        <thead className="bg-slate-100 font-bold text-slate-800">
                          <tr>
                            <th className="px-3 py-1.5 w-24">구분</th>
                            <th className="px-3 py-1.5">수집 항목</th>
                            <th className="px-3 py-1.5 w-32">수집 방법</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 bg-white">
                          <tr>
                            <td className="px-3 py-1.5 font-bold text-rose-600">필수 항목</td>
                            <td className="px-3 py-1.5 text-slate-800">
                              <strong>이름(성명), 이메일 주소(아이디), 비밀번호(단방향 암호화 저장)</strong><br />
                              <span className="text-[11px] text-slate-500">※ 소셜 간편가입 시: 소셜 계정 고유 식별자, 이름, 이메일</span>
                            </td>
                            <td className="px-3 py-1.5 text-slate-600">회원가입 폼 직접 입력 또는 소셜 로그인 연동</td>
                          </tr>
                          <tr>
                            <td className="px-3 py-1.5 font-bold text-slate-500">선택 항목</td>
                            <td className="px-3 py-1.5 text-slate-600">
                              휴대전화번호 (가이드 투어 예약 확정·취소 알림 및 주요 행사 안내 수신용)
                            </td>
                            <td className="px-3 py-1.5 text-slate-600">회원가입 시 선택 입력</td>
                          </tr>
                          <tr>
                            <td className="px-3 py-1.5 font-bold text-slate-400">자동 수집</td>
                            <td className="px-3 py-1.5 text-slate-500 text-[11px]" colSpan={2}>
                              IP 주소, 쿠키(Cookie), 서비스 이용 기록, 접속 로그, 불량 이용 기록
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* 3. 보유 기간 */}
                  <div className="space-y-1">
                    <h4 className="font-bold text-slate-900 flex items-center gap-1.5">
                      <span className="text-sky-600 font-black">3.</span> 개인정보의 보유 및 이용 기간 (개인정보보호법 제15조제2항제3호)
                    </h4>
                    <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200/70 text-slate-700 space-y-1">
                      <p>
                        • <strong>원칙: 회원 탈퇴 시까지 (회원 탈퇴 요청 시 지체 없이 영구 파기)</strong>
                      </p>
                      <p className="text-[11px] text-slate-500">
                        • 단, 관계 법령의 규정에 의하여 보존할 의무가 있는 경우 법정 기간 동안 별도 분리하여 안전하게 보관합니다:
                      </p>
                      <ul className="list-disc list-inside text-[11px] text-slate-500 pl-2">
                        <li>계약 또는 청약철회 등에 관한 기록: 5년 (전자상거래 등에서의 소비자보호에 관한 법률)</li>
                        <li>소비자의 불만 또는 분쟁처리에 관한 기록: 3년 (전자상거래 등에서의 소비자보호에 관한 법률)</li>
                        <li>웹사이트 방문에 관한 기록: 3개월 (통신비밀보호법)</li>
                      </ul>
                    </div>
                  </div>

                  {/* 4. 파기 절차 및 방법 */}
                  <div className="space-y-1">
                    <h4 className="font-bold text-slate-900 flex items-center gap-1.5">
                      <span className="text-sky-600 font-black">4.</span> 개인정보의 파기 절차 및 파기 방법 (개인정보보호법 제21조)
                    </h4>
                    <ul className="list-disc list-inside space-y-0.5 pl-1 text-slate-600 bg-slate-50 p-2.5 rounded-lg border border-slate-200/70 text-xs">
                      <li><strong>파기 절차:</strong> 이용자가 회원 탈퇴를 요청하거나 개인정보 보유기간이 경과한 경우 파기 사유를 확인하고 즉시 파기 대상으로 선정합니다.</li>
                      <li><strong>파기 방법:</strong> 전자적 파일 형태로 저장된 개인정보는 재생할 수 없는 기술적 방법(영구 삭제 및 덮어쓰기)을 사용하여 지체 없이 영구 삭제하며, 인쇄물 등의 서면은 파쇄 또는 소각합니다.</li>
                    </ul>
                  </div>

                  {/* 5. 만 14세 미만 아동의 개인정보 처리 */}
                  <div className="space-y-1">
                    <h4 className="font-bold text-slate-900 flex items-center gap-1.5">
                      <span className="text-sky-600 font-black">5.</span> 만 14세 미만 아동의 개인정보 처리 (개인정보보호법 제22조의2)
                    </h4>
                    <p className="text-slate-600 bg-slate-50 p-2.5 rounded-lg border border-slate-200/70 text-xs">
                      물문화관은 만 14세 미만 아동의 개인정보를 수집할 경우 「개인정보 보호법」 제22조의2에 따라 법정대리인(보호자)의 동의를 받거나 보호자가 대리하여 신청하도록 조치하고 있습니다.
                    </p>
                  </div>

                  {/* 6. 동의 거부 권리 및 불이익 */}
                  <div className="space-y-1">
                    <h4 className="font-bold text-slate-900 flex items-center gap-1.5">
                      <span className="text-sky-600 font-black">6.</span> 동의 거부 권리 및 거부에 따른 불이익 고지 (제15조제2항제4호)
                    </h4>
                    <div className="bg-amber-50/90 p-2.5 rounded-lg border border-amber-200 text-amber-950 text-xs leading-relaxed">
                      귀하는 개인정보 수집 및 이용 동의를 거부할 권리가 있습니다. 단, <strong>필수 항목에 대한 수집·이용 동의를 거부하실 경우 회원 식별 및 인증이 불가능하므로 회원가입이 제한</strong>됩니다. (선택 항목 미동의 시에도 기본 회원가입 및 서비스 이용은 가능합니다.)
                    </div>
                  </div>

                  {/* 7. 개인정보 보호책임자 및 권익구제 창구 */}
                  <div className="space-y-1">
                    <h4 className="font-bold text-slate-900 flex items-center gap-1.5">
                      <span className="text-sky-600 font-black">7.</span> 개인정보 보호책임자 및 고충처리 창구 (개인정보보호법 제30조)
                    </h4>
                    <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200/70 text-slate-600 text-xs space-y-0.5">
                      <p>• <strong>개인정보 보호책임자:</strong> 한국수자원공사 공간경관처 박석용 처장</p>
                      <p>• <strong>개인정보 고충처리 문의:</strong> 042-629-3097 (한국수자원공사 본사)</p>
                      <p>• <strong>권익침해 구제기관:</strong> 개인정보분쟁조정위원회(1833-6972), 대검찰청(1301), 경찰청(182)</p>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* 모달 하단 푸터 버튼 */}
            <div className="flex items-center justify-between border-t border-slate-200 px-5 py-3 bg-slate-50 shrink-0 gap-2">
              <span className="text-[11px] text-slate-400">K-water 온라인 물문화관</span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setActiveDetailModal(null)}
                  className="rounded-xl border border-slate-300 px-3.5 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-100 transition cursor-pointer"
                >
                  닫기
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (activeDetailModal === "terms") {
                      setAgreeTerms(true);
                    } else if (activeDetailModal === "privacy") {
                      setAgreePrivacy(true);
                    }
                    setActiveDetailModal(null);
                  }}
                  className="rounded-xl bg-sky-600 px-4 py-1.5 text-xs font-bold text-white shadow-sm hover:bg-sky-700 transition cursor-pointer"
                >
                  내용 확인 및 동의하기 ✓
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
