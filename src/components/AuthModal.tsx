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
            <div className="overflow-y-auto px-5 py-4 space-y-3.5 text-xs text-slate-700 leading-relaxed">
              {activeDetailModal === "terms" ? (
                <>
                  <div className="rounded-xl bg-sky-50/80 p-3 border border-sky-100 text-sky-950 font-medium">
                    본 약관은 한국수자원공사가 운영하는 K-water 온라인 물문화관의 제반 서비스 이용과 관련하여 공사와 이용자의 권리, 의무 및 책임사항을 규정합니다.
                  </div>

                  <div className="space-y-1">
                    <h4 className="font-bold text-slate-900">제1조 (목적)</h4>
                    <p className="text-slate-600">
                      본 약관은 K-water 온라인 물문화관(이하 "물문화관")이 제공하는 전국 20개 물문화관 전시 안내, 가이드 투어 예약, 문화행사 및 소통 공간 등 제반 온라인 서비스(이하 "서비스")의 이용조건 및 절차에 관한 기본 사항을 정함을 목적으로 합니다.
                    </p>
                  </div>

                  <div className="space-y-1">
                    <h4 className="font-bold text-slate-900">제2조 (회원의 정의 및 가입)</h4>
                    <p className="text-slate-600">
                      1. "회원"이란 본 약관에 동의하고 소정의 가입 절차를 거쳐 물문화관의 서비스를 지속적으로 이용할 수 있는 자를 말합니다.<br />
                      2. 회원은 소셜 간편가입(카카오, 네이버) 또는 직접 입력을 통해 가입할 수 있으며, 타인의 정보를 도용하여 가입할 수 없습니다.
                    </p>
                  </div>

                  <div className="space-y-1">
                    <h4 className="font-bold text-slate-900">제3조 (서비스의 제공 및 변경)</h4>
                    <p className="text-slate-600">
                      1. 물문화관은 연중무휴 1일 24시간 온라인 서비스를 제공함을 원칙으로 합니다.<br />
                      2. 시스템 정기점검, 설비 보수, 통신 장애 등 불가피한 사유가 발생할 경우 사전 또는 사후에 공지하고 서비스 제공을 일시 중단할 수 있습니다.
                    </p>
                  </div>

                  <div className="space-y-1">
                    <h4 className="font-bold text-slate-900">제4조 (회원의 의무)</h4>
                    <p className="text-slate-600">
                      1. 회원은 관계 법령, 본 약관의 규정, 공지사항을 준수하여야 하며, 기타 공사의 업무에 방해되는 행위를 하여서는 안 됩니다.<br />
                      2. 허위 정보 입력, 게시판 내 음란·욕설·비방물 게시, 시스템 비인가 접근 등 불법 행위 적발 시 이용이 제한될 수 있습니다.
                    </p>
                  </div>

                  <div className="space-y-1">
                    <h4 className="font-bold text-slate-900">제5조 (회원 탈퇴 및 자격 상실)</h4>
                    <p className="text-slate-600">
                      회원은 언제든지 마이페이지 등을 통해 회원 탈퇴를 요청할 수 있으며, 공사는 관련 법령에 따라 즉시 회원 정보를 파기 조치합니다.
                    </p>
                  </div>
                </>
              ) : (
                <>
                  <div className="rounded-xl bg-sky-50/80 p-3 border border-sky-100 text-sky-950 font-medium">
                    K-water 온라인 물문화관은 「개인정보 보호법」 제15조, 제21조, 제22조에 따라 회원가입 시 아래와 같이 최소한의 개인정보를 수집·이용합니다.
                  </div>

                  {/* 1. 수집 목적 */}
                  <div className="space-y-1">
                    <h4 className="font-bold text-slate-900 flex items-center gap-1.5">
                      <span className="text-sky-600 font-black">1.</span> 개인정보의 수집 및 이용 목적
                    </h4>
                    <ul className="list-disc list-inside space-y-0.5 pl-1 text-slate-600 bg-slate-50 p-2.5 rounded-lg border border-slate-200/70">
                      <li>회원 가입 의사 확인 및 회원제 서비스 이용에 따른 본인 식별·인증</li>
                      <li>가이드 투어 예약, 문화행사 참여 연계 및 내 예약 내역 관리</li>
                      <li>불량 회원의 부정이용 방지 및 서비스 관련 주요 고지사항 전달</li>
                    </ul>
                  </div>

                  {/* 2. 수집 항목 */}
                  <div className="space-y-1">
                    <h4 className="font-bold text-slate-900 flex items-center gap-1.5">
                      <span className="text-sky-600 font-black">2.</span> 수집하는 개인정보의 항목
                    </h4>
                    <div className="rounded-lg border border-slate-200 overflow-hidden">
                      <table className="min-w-full divide-y divide-slate-200 text-left text-xs">
                        <thead className="bg-slate-100 font-bold text-slate-800">
                          <tr>
                            <th className="px-3 py-1.5 w-24">구분</th>
                            <th className="px-3 py-1.5">수집 항목</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 bg-white">
                          <tr>
                            <td className="px-3 py-1.5 font-bold text-rose-600">필수 항목</td>
                            <td className="px-3 py-1.5 text-slate-800">
                              <strong>이름(성명), 이메일 주소(아이디), 비밀번호(암호화 저장)</strong>
                            </td>
                          </tr>
                          <tr>
                            <td className="px-3 py-1.5 font-bold text-slate-500">선택 항목</td>
                            <td className="px-3 py-1.5 text-slate-600">휴대전화번호 (투어 예약 및 알림용)</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* 3. 보유 기간 */}
                  <div className="space-y-1">
                    <h4 className="font-bold text-slate-900 flex items-center gap-1.5">
                      <span className="text-sky-600 font-black">3.</span> 개인정보의 보유 및 이용 기간
                    </h4>
                    <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200/70 text-slate-700">
                      <strong className="text-sky-950 font-bold">회원 탈퇴 시까지 (회원 탈퇴 요청 시 지체 없이 영구 파기)</strong>
                      <p className="text-[11px] text-slate-500 mt-0.5">※ 관계 법령에 따라 보존이 필요한 경우 해당 법정 기간 동안 안전하게 보관</p>
                    </div>
                  </div>

                  {/* 4. 파기 절차 */}
                  <div className="space-y-1">
                    <h4 className="font-bold text-slate-900 flex items-center gap-1.5">
                      <span className="text-sky-600 font-black">4.</span> 개인정보의 파기 절차 및 방법
                    </h4>
                    <p className="text-slate-600 bg-slate-50 p-2.5 rounded-lg border border-slate-200/70">
                      목적 달성 또는 회원 탈퇴 시 전자적 파일 형태로 저장된 개인정보는 재생할 수 없는 기술적 방법을 사용하여 지체 없이 영구 삭제합니다.
                    </p>
                  </div>

                  {/* 5. 동의 거부 권리 */}
                  <div className="space-y-1">
                    <h4 className="font-bold text-slate-900 flex items-center gap-1.5">
                      <span className="text-sky-600 font-black">5.</span> 동의 거부 권리 및 불이익 고지 (제15조제2항제4호)
                    </h4>
                    <p className="text-amber-950 bg-amber-50/90 p-2.5 rounded-lg border border-amber-200">
                      정보주체는 개인정보 수집 및 이용 동의를 거부할 권리가 있습니다. 단, 필수 항목 동의 거부 시 회원 식별 및 인증이 불가능하므로 <strong>회원가입이 제한</strong>됩니다. (선택 항목 미동의 시에도 회원가입은 정상 완료됩니다.)
                    </p>
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
