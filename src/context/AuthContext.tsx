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
  authTab: "login" | "signup" | "guest";
  openAuthModal: (tab?: "login" | "signup" | "guest") => void;
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
  const [authTab, setAuthTab] = useState<"login" | "signup" | "guest">("login");

  const saveUserSession = (u: UserProfile) => {
    setUser(u);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(u));
      document.cookie = `kakao_user_session=${encodeURIComponent(JSON.stringify(u))}; path=/; max-age=604800; SameSite=Lax`;
    } catch (e) {
      console.error("Failed to save to localStorage", e);
    }
  };

  useEffect(() => {
    let resolvedUser: UserProfile | null = null;

    // 1. URL 쿼리 파라미터 ?u=... 우선 수신 (소셜 로그인 콜백 페이로드)
    if (typeof window !== "undefined") {
      try {
        const urlParams = new URLSearchParams(window.location.search);
        const userParam = urlParams.get("u");
        if (userParam) {
          const raw = JSON.parse(decodeURIComponent(userParam));
          if (raw && raw.id) {
            resolvedUser = {
              id: String(raw.id),
              name: raw.name || raw.nickname || "소셜 회원",
              email: raw.email || `${raw.id}@social.user`,
              phone: raw.phone || "",
              provider: raw.provider || "social",
              role: raw.role || "user",
            };
            saveUserSession(resolvedUser);
            setIsLoading(false);
          }
        }
      } catch (e) {
        console.error("Failed to parse URL session payload", e);
      }
    }

    // 2. localStorage 세션 확인
    if (!resolvedUser) {
      try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
          resolvedUser = JSON.parse(saved);
          setUser(resolvedUser);
        }
      } catch (e) {
        console.error("Failed to load user session from localStorage", e);
      }
    }

    // 3. 브라우저 document.cookie 파싱
    if (!resolvedUser) {
      try {
        if (typeof document !== "undefined" && document.cookie) {
          const cookies = document.cookie.split("; ");
          for (const c of cookies) {
            if (c.startsWith("naver_user_session=") || c.startsWith("kakao_user_session=")) {
              const rawVal = c.substring(c.indexOf("=") + 1);
              const jsonStr = decodeURIComponent(rawVal);
              const raw = JSON.parse(jsonStr);
              if (raw && raw.id) {
                resolvedUser = {
                  id: String(raw.id),
                  name: raw.name || raw.nickname || "소셜 회원",
                  email: raw.email || `${raw.id}@social.user`,
                  phone: raw.phone || "",
                  provider: raw.provider || (c.startsWith("naver") ? "naver" : "kakao"),
                  role: raw.role || "user",
                };
                saveUserSession(resolvedUser);
                break;
              }
            }
          }
        }
      } catch (e) {
        console.error("Failed to parse document.cookie", e);
      }
    }

    // 4. 서버 쿠키 API (/api/auth/me)와 최종 교차 검증
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

  const openAuthModal = (tab: "login" | "signup" | "guest" = "login") => {
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

  const loginWithEmail = async (idOrEmail: string, pass: string): Promise<boolean> => {
    const lower = idOrEmail.toLowerCase().trim();
    const lowerPass = pass.trim();

    // 관리자 계정 판단: ID가 admin이거나 비밀번호가 admin일 때 (또는 기존 관리자 패턴)
    const isAdmin =
      lower === "admin" ||
      lowerPass === "admin" ||
      lower.includes("admin") ||
      lower.includes("staff") ||
      lower.includes("manager") ||
      lower === "kwater" ||
      lower.endsWith("@kwater.or.kr") ||
      lowerPass === "kwater2026!";

    const userRole: UserRole = isAdmin ? "admin" : "user";

    let userName = idOrEmail.includes("@") ? idOrEmail.split("@")[0] : idOrEmail;
    if (isAdmin) {
      if (lower.includes("soyang")) userName = "소양강댐 담당자";
      else if (lower.includes("chungju")) userName = "충주댐 담당자";
      else if (lower.includes("daecheong")) userName = "대청댐 담당자";
      else if (lower.includes("andong")) userName = "안동댐 담당자";
      else if (lower.includes("buan")) userName = "부안댐 담당자";
      else userName = "K-water 통합 관리자";
    }

    const mockUser: UserProfile = {
      id: isAdmin ? `staff_${Date.now()}` : `user_${Date.now()}`,
      name: userName,
      email: idOrEmail.includes("@") ? idOrEmail : `${idOrEmail}@kwater.or.kr`,
      phone: "010-1234-5678",
      provider: isAdmin ? "staff" : "email",
      role: userRole,
    };

    if (isAdmin) {
      document.cookie = `kwm_staff_console_gate=1; path=/; max-age=604800; SameSite=Lax`;
    }

    saveUserSession(mockUser);
    closeAuthModal();

    if (isAdmin) {
      alert(`🔑 관리자 계정(${userName})으로 로그인되었습니다.\n관리자 전용 페이지(/yunyeong)로 자동 이동합니다.`);
      window.location.href = "/yunyeong";
    } else {
      alert(`👋 ${userName} 님, 환영합니다.`);
      window.location.href = "/mypage";
    }
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
