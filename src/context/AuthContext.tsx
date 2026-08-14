"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

export type UserRole = "user" | "admin" | "guide";

export type UserProfile = {
  id: string;
  name: string;
  email: string;
  phone?: string;
  provider: "email" | "kakao" | "naver" | "staff";
  role: UserRole;
  favoriteCenter?: string;
};

type AuthContextType = {
  user: UserProfile | null;
  isAuthOpen: boolean;
  authTab: "login" | "signup" | "guest" | "staff";
  openAuthModal: (tab?: "login" | "signup" | "guest" | "staff") => void;
  closeAuthModal: () => void;
  loginWithSocial: (provider: "kakao" | "naver") => void;
  loginWithEmail: (email: string, pass: string) => Promise<boolean>;
  signupWithEmail: (name: string, email: string, pass: string, phone: string) => Promise<boolean>;
  loginAsStaff: (pass: string, centerId: string) => Promise<boolean>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const STORAGE_KEY = "kwater_portal_user";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isAuthOpen, setIsAuthOpen] = useState<boolean>(false);
  const [authTab, setAuthTab] = useState<"login" | "signup" | "guest" | "staff">("login");

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        setUser(JSON.parse(saved));
      }
    } catch (e) {
      console.error("Failed to load user session", e);
    }

    // 서버 쿠키 세션 (/api/auth/me)과 자동 동기화 (네이버/카카오 OAuth 로그인)
    void fetch("/api/auth/me")
      .then((res) => res.json())
      .then((data) => {
        if (data && data.user) {
          saveUserSession(data.user);
        }
      })
      .catch((e) => {
        console.error("Failed to fetch /api/auth/me", e);
      });
  }, []);

  const openAuthModal = (tab: "login" | "signup" | "guest" | "staff" = "login") => {
    setAuthTab(tab);
    setIsAuthOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthOpen(false);
  };

  const saveUserSession = (u: UserProfile) => {
    setUser(u);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(u));
  };

  const loginWithSocial = (provider: "kakao" | "naver") => {
    if (provider === "kakao" && typeof window !== "undefined" && window.Kakao) {
      if (!window.Kakao.isInitialized()) {
        const key = process.env.NEXT_PUBLIC_KAKAO_JS_KEY || "72d7c263c7937e92cc7b2dd2861b3cab";
        window.Kakao.init(key);
      }
      if (window.Kakao.isInitialized()) {
        window.Kakao.Auth.login({
          throughTalk: false,
          prompts: "login",
          success: function (_authObj: any) {
            window.Kakao.API.request({
              url: "/v2/user/me",
              success: function (res: any) {
                const kakaoAccount = res.kakao_account || {};
                const profile = kakaoAccount.profile || {};
                const user: UserProfile = {
                  id: String(res.id),
                  name: profile.nickname || "카카오 회원",
                  email: kakaoAccount.email || `${res.id}@kakao.user`,
                  phone: "010-1234-5678",
                  provider: "kakao",
                  role: "user",
                  favoriteCenter: "daecheong",
                };
                saveUserSession(user);
                closeAuthModal();
                alert("로그인 되었습니다.");
                window.location.href = "/mypage";
              },
              fail: function (err: any) {
                console.error("Kakao me error:", err);
                window.location.href = "/api/auth/kakao?next=/mypage";
              },
            });
          },
          fail: function (err: any) {
            console.error("Kakao auth login error:", err);
            window.location.href = "/api/auth/kakao?next=/mypage";
          },
        });
        return;
      }
    }

    const mockUser: UserProfile = {
      id: `user_${Date.now()}`,
      name: provider === "kakao" ? "카카오 회원" : "네이버 회원",
      email: `${provider}_user@kwater.or.kr`,
      phone: "010-1234-5678",
      provider,
      role: "user",
      favoriteCenter: "daecheong",
    };
    saveUserSession(mockUser);
    closeAuthModal();
    alert("로그인 되었습니다.");
    window.location.href = "/mypage";
  };

  const loginWithEmail = async (email: string): Promise<boolean> => {
    const mockUser: UserProfile = {
      id: `user_${Date.now()}`,
      name: email.split("@")[0] || "관람객 회원",
      email,
      phone: "010-9876-5432",
      provider: "email",
      role: "user",
    };
    saveUserSession(mockUser);
    closeAuthModal();
    alert("로그인 되었습니다.");
    window.location.href = "/mypage";
    return true;
  };

  const signupWithEmail = async (
    name: string,
    email: string,
    _pass: string,
    phone: string
  ): Promise<boolean> => {
    const mockUser: UserProfile = {
      id: `user_${Date.now()}`,
      name,
      email,
      phone,
      provider: "email",
      role: "user",
    };
    saveUserSession(mockUser);
    closeAuthModal();
    alert("회원가입 및 로그인이 완료되었습니다.");
    window.location.href = "/mypage";
    return true;
  };

  const loginAsStaff = async (_pass: string, centerId: string): Promise<boolean> => {
    const staffUser: UserProfile = {
      id: `staff_${Date.now()}`,
      name: centerId === "all" ? "K-water 통합 관리자" : "문화관 운영 담당자",
      email: "staff@kwater.or.kr",
      provider: "staff",
      role: "admin",
      favoriteCenter: centerId,
    };
    saveUserSession(staffUser);
    closeAuthModal();
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(STORAGE_KEY);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthOpen,
        authTab,
        openAuthModal,
        closeAuthModal,
        loginWithSocial,
        loginWithEmail,
        signupWithEmail,
        loginAsStaff,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
