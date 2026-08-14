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
  isLoading: boolean;
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
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isAuthOpen, setIsAuthOpen] = useState<boolean>(false);
  const [authTab, setAuthTab] = useState<"login" | "signup" | "guest" | "staff">("login");

  const saveUserSession = (u: UserProfile) => {
    setUser(u);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(u));
    } catch (e) {
      console.error("Failed to save to localStorage", e);
    }
  };

  useEffect(() => {
    // 1. localStorage 우선 로드
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        setUser(JSON.parse(saved));
      }
    } catch (e) {
      console.error("Failed to load user session", e);
    }

    // 2. 브라우저 document.cookie 직접 파싱 (네이버/카카오 쿠키 백업 복구)
    try {
      if (typeof document !== "undefined" && document.cookie) {
        const cookies = document.cookie.split("; ");
        for (const c of cookies) {
          if (c.startsWith("naver_user_session=") || c.startsWith("kakao_user_session=")) {
            const rawVal = c.substring(c.indexOf("=") + 1);
            const jsonStr = decodeURIComponent(rawVal);
            const raw = JSON.parse(jsonStr);
            if (raw && raw.id) {
              const u: UserProfile = {
                id: String(raw.id),
                name: raw.name || raw.nickname || "소셜 회원",
                email: raw.email || `${raw.id}@social.user`,
                phone: raw.phone || "",
                provider: raw.provider || (c.startsWith("naver") ? "naver" : "kakao"),
                role: raw.role || "user",
              };
              saveUserSession(u);
            }
          }
        }
      }
    } catch (e) {
      console.error("Failed to parse document.cookie", e);
    }

    // 3. 서버 쿠키 API (/api/auth/me)와 최종 동기화
    fetch("/api/auth/me", { cache: "no-store", credentials: "same-origin" })
      .then((res) => res.json())
      .then((data) => {
        if (data && data.user) {
          saveUserSession(data.user);
        }
      })
      .catch((e) => {
        console.error("Failed to fetch /api/auth/me", e);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  const openAuthModal = (tab: "login" | "signup" | "guest" | "staff" = "login") => {
    setAuthTab(tab);
    setIsAuthOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthOpen(false);
  };

  const loginWithSocial = (provider: "kakao" | "naver") => {
    if (provider === "naver") {
      window.location.href = "/api/auth/naver";
      return;
    }
    if (provider === "kakao") {
      window.location.href = "/api/auth/kakao";
      return;
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
    void fetch("/api/auth/logout", { method: "POST" });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
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
