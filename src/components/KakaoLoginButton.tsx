"use client";

import { useState } from "react";

interface KakaoLoginButtonProps {
  redirectPath?: string;
  className?: string;
  buttonText?: string;
}

export function KakaoLoginButton({
  redirectPath = "/yunyeong",
  className = "",
  buttonText = "카카오로 시작하기",
}: KakaoLoginButtonProps) {
  const [loading, setLoading] = useState(false);

  const handleKakaoLogin = () => {
    setLoading(true);

    if (typeof window !== "undefined" && window.Kakao) {
      if (!window.Kakao.isInitialized()) {
        const key = process.env.NEXT_PUBLIC_KAKAO_JS_KEY || "72d7c263c7937e92cc7b2dd2861b3cab";
        window.Kakao.init(key);
      }

      if (window.Kakao.isInitialized()) {
        window.Kakao.Auth.login({
          throughTalk: false,
          prompts: "login",
          success: function (authObj: any) {
            window.Kakao.API.request({
              url: "/v2/user/me",
              success: function (res: any) {
                const kakaoAccount = res.kakao_account || {};
                const profile = kakaoAccount.profile || {};
                const user = {
                  id: String(res.id),
                  name: profile.nickname || "카카오 회원",
                  email: kakaoAccount.email || `${res.id}@kakao.user`,
                  phone: "010-1234-5678",
                  provider: "kakao",
                  role: redirectPath.startsWith("/yunyeong") ? "admin" : "user",
                };

                // Save session in localStorage
                localStorage.setItem("kwater_portal_user", JSON.stringify(user));

                // Save cookie for backend API routes
                document.cookie = `kakao_user_session=${encodeURIComponent(JSON.stringify(user))}; path=/; max-age=604800; SameSite=Lax`;
                if (redirectPath.startsWith("/yunyeong")) {
                  document.cookie = "staff_console_auth=true; path=/; max-age=604800; SameSite=Lax";
                }

                alert("로그인 되었습니다.");
                window.location.href = redirectPath;
              },
              fail: function (err: any) {
                console.error("Kakao User Info Error:", err);
                setLoading(false);
                window.location.href = `/api/auth/kakao?next=${encodeURIComponent(redirectPath)}`;
              },
            });
          },
          fail: function (err: any) {
            console.error("Kakao Auth Login Error:", err);
            setLoading(false);
            window.location.href = `/api/auth/kakao?next=${encodeURIComponent(redirectPath)}`;
          },
        });
        return;
      }
    }

    // Fallback to REST API route
    const targetUrl = `/api/auth/kakao?next=${encodeURIComponent(redirectPath)}`;
    window.location.href = targetUrl;
  };

  return (
    <button
      type="button"
      onClick={handleKakaoLogin}
      disabled={loading}
      className={[
        "group relative flex min-h-[48px] w-full items-center justify-center gap-3 rounded-xl bg-[#FEE500] px-5 py-3 text-sm font-black text-[#191919] shadow-md transition duration-200 hover:bg-[#FADA0A] active:scale-[0.98] disabled:opacity-60",
        className,
      ].join(" ")}
      aria-label="카카오 계정으로 로그인"
    >
      {/* 카카오 공식 말풍선 SVG 심볼 */}
      <svg
        className="h-5 w-5 shrink-0 fill-[#191919]"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M12 3C6.477 3 2 6.477 2 10.767c0 2.766 1.83 5.19 4.605 6.574-.183.67-.665 2.428-.762 2.798-.12.457.168.452.353.33.146-.097 2.316-1.572 3.252-2.209.84.124 1.706.19 2.552.19 5.523 0 10-3.477 10-7.767S17.523 3 12 3z" />
      </svg>
      <span>{loading ? "카카오 이동 중…" : buttonText}</span>
    </button>
  );
}
