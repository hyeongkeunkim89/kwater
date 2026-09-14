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

  // Guest lookup form state
  const [guestPhone, setGuestPhone] = useState("");
  const [guestPin, setGuestPin] = useState("");

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

  // 비밀번호 강도 계산
  const getPasswordStrength = (pass: string) => {
    if (!pass) return { label: "", color: "", width: "0%" };
    if (pass.length < 8) return { label: "위험 (8자 이상 필요)", color: "bg-rose-500 text-rose-600", width: "33%" };
    const hasLetter = /[a-zA-Z]/.test(pass);
    const hasNum = /[0-9]/.test(pass);
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(pass);

    if (hasLetter && hasNum && hasSpecial) {
      return { label: "매우 안전 (영문+숫자+특수문자)", color: "bg-emerald-500 text-emerald-600", width: "100%" };
    }
    if (hasLetter && hasNum) {
      return { label: "보통 (특수문자 추가 권장)", color: "bg-amber-500 text-amber-600", width: "66%" };
    }
    return { label: "약함 (숫자/특수문자 필요)", color: "bg-rose-400 text-rose-500", width: "40%" };
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
      <div className="relative w-full max-w-md max-h-[90vh] overflow-y-auto rounded-3xl border border-white/20 bg-white p-6 shadow-2xl sm:p-8">
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
                  placeholder="아이디 또는 이메일 주소 입력"
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

              <button
                type="submit"
                className="w-full rounded-xl bg-slate-900 py-3 text-sm font-black text-white hover:bg-slate-800 transition shadow-md"
              >
                🔑 로그인
              </button>
            </form>
          </div>
        )}

        {/* 3. 회원가입 탭 (6대 보완 요소 반영) */}
        {tab === "signup" && (
          <div className="space-y-4">
            <div className="text-center">
              <span className="inline-block rounded-full bg-sky-100 px-3 py-0.5 text-[11px] font-black text-sky-800 mb-1">
                안전한 신규 회원가입
              </span>
              <h2 className="text-xl font-black text-slate-900">관람객 회원가입</h2>
              <p className="mt-1 text-xs text-slate-500 font-semibold">
                가입 후 투어 예약 및 커뮤니티 서비스를 이용해 보세요.
              </p>
            </div>

            <form onSubmit={handleSignUpSubmit} className="space-y-3.5 pt-1 text-left">
              {/* 1. 이름 */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">이름 *</label>
                <input
                  type="text"
                  value={signUpName}
                  onChange={(e) => setSignUpName(e.target.value)}
                  placeholder="홍길동"
                  className="w-full rounded-xl border border-slate-200 p-2.5 text-sm outline-none focus:border-sky-500"
                />
              </div>

              {/* 2. 이메일 (아이디) + 중복 확인 버튼 */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">이메일 (아이디) *</label>
                <div className="flex gap-2">
                  <input
                    type="email"
                    value={signUpEmail}
                    onChange={(e) => {
                      setSignUpEmail(e.target.value);
                      setIsEmailChecked(false);
                      setEmailCheckResult(null);
                    }}
                    placeholder="user@kwater.or.kr"
                    className="flex-1 rounded-xl border border-slate-200 p-2.5 text-sm outline-none focus:border-sky-500"
                  />
                  <button
                    type="button"
                    onClick={handleCheckEmailDuplicate}
                    className="shrink-0 rounded-xl bg-slate-800 px-3 py-2 text-xs font-bold text-white hover:bg-slate-700 transition"
                  >
                    중복 확인
                  </button>
                </div>
                {emailCheckResult && (
                  <p className={`mt-1.5 text-[11px] font-bold ${emailCheckResult.ok ? "text-emerald-600" : "text-rose-600"}`}>
                    {emailCheckResult.msg}
                  </p>
                )}
              </div>

              {/* 3. 비밀번호 + 표시/숨기기 토글 + 강도 측정 */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">비밀번호 * (최소 8자)</label>
                <div className="relative">
                  <input
                    type={showSignUpPass ? "text" : "password"}
                    value={signUpPass}
                    onChange={(e) => setSignUpPass(e.target.value)}
                    placeholder="8자 이상 (영문, 숫자, 특수문자)"
                    className="w-full rounded-xl border border-slate-200 p-2.5 pr-10 text-sm outline-none focus:border-sky-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowSignUpPass(!showSignUpPass)}
                    className="absolute right-3 top-2.5 text-xs text-slate-400 hover:text-slate-700"
                  >
                    {showSignUpPass ? "🙈" : "👁️"}
                  </button>
                </div>
                {/* 비밀번호 강도 게이지 */}
                {signUpPass && (
                  <div className="mt-1.5 space-y-1">
                    <div className="h-1.5 w-full rounded-full bg-slate-100 overflow-hidden">
                      <div
                        className={`h-full transition-all duration-300 ${getPasswordStrength(signUpPass).color}`}
                        style={{ width: getPasswordStrength(signUpPass).width }}
                      />
                    </div>
                    <p className={`text-[10px] font-bold ${getPasswordStrength(signUpPass).color}`}>
                      안전도: {getPasswordStrength(signUpPass).label}
                    </p>
                  </div>
                )}
              </div>

              {/* 4. 비밀번호 재확인 + 실시간 일치 검증 */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">비밀번호 확인 *</label>
                <div className="relative">
                  <input
                    type={showSignUpPassConfirm ? "text" : "password"}
                    value={signUpPassConfirm}
                    onChange={(e) => setSignUpPassConfirm(e.target.value)}
                    placeholder="비밀번호 재입력"
                    className="w-full rounded-xl border border-slate-200 p-2.5 pr-10 text-sm outline-none focus:border-sky-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowSignUpPassConfirm(!showSignUpPassConfirm)}
                    className="absolute right-3 top-2.5 text-xs text-slate-400 hover:text-slate-700"
                  >
                    {showSignUpPassConfirm ? "🙈" : "👁️"}
                  </button>
                </div>
                {signUpPassConfirm && (
                  <p
                    className={`mt-1.5 text-[11px] font-bold ${
                      signUpPass === signUpPassConfirm ? "text-emerald-600" : "text-rose-600"
                    }`}
                  >
                    {signUpPass === signUpPassConfirm ? "🟢 비밀번호가 일치합니다." : "🔴 비밀번호가 일치하지 않습니다."}
                  </p>
                )}
              </div>

              {/* 5. 휴대폰 번호 (자동 하이픈) */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">휴대폰 번호 (선택)</label>
                <input
                  type="tel"
                  value={signUpPhone}
                  onChange={(e) => setSignUpPhone(formatPhone(e.target.value))}
                  placeholder="010-1234-5678"
                  className="w-full rounded-xl border border-slate-200 p-2.5 text-sm outline-none focus:border-sky-500"
                />
              </div>

              {/* 6. 약관 동의 체크박스 그룹 */}
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 space-y-2 text-xs">
                <label className="flex items-center gap-2 font-black text-slate-900 border-b border-slate-200 pb-1.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isAgreeAll}
                    onChange={(e) => handleToggleAgreeAll(e.target.checked)}
                    className="h-4 w-4 rounded border-slate-300 text-sky-600 focus:ring-sky-500"
                  />
                  <span>전체 동의하기</span>
                </label>
                <label className="flex items-center gap-2 text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={agreeTerms}
                    onChange={(e) => setAgreeTerms(e.target.checked)}
                    className="h-3.5 w-3.5 rounded border-slate-300 text-sky-600 focus:ring-sky-500"
                  />
                  <span><strong className="text-sky-700">[필수]</strong> 이용약관 동의</span>
                </label>
                <label className="flex items-center gap-2 text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={agreePrivacy}
                    onChange={(e) => setAgreePrivacy(e.target.checked)}
                    className="h-3.5 w-3.5 rounded border-slate-300 text-sky-600 focus:ring-sky-500"
                  />
                  <span><strong className="text-sky-700">[필수]</strong> 개인정보 수집 및 이용 동의</span>
                </label>
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
