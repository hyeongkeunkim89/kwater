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
const USERS_DB_KEY = "kwater_registered_users_db";

type RegisteredAccount = {
  id: string;
  name: string;
  email: string;
  pass: string;
  phone?: string;
  provider: "email" | "staff";
  role: UserRole;
};

// 기본 샘플 회원 계정 (체험용 테스트 계정)
const SEED_USERS: RegisteredAccount[] = [
  {
    id: "user_kwater",
    name: "홍길동",
    email: "user@kwater.or.kr",
    pass: "123456",
    phone: "010-1234-5678",
    provider: "email",
    role: "user",
  },
  {
    id: "user_test",
    name: "테스트회원",
    email: "test@kwater.or.kr",
    pass: "123456",
    phone: "010-9876-5432",
    provider: "email",
    role: "user",
  },
];

function getRegisteredUsers(): RegisteredAccount[] {
  if (typeof window === "undefined") return SEED_USERS;
  try {
    const raw = localStorage.getItem(USERS_DB_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.error("Failed to parse registered users DB", e);
  }
  return SEED_USERS;
}

function saveRegisteredUsers(users: RegisteredAccount[]) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(USERS_DB_KEY, JSON.stringify(users));
  } catch (e) {
    console.error("Failed to save registered users DB", e);
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isAuthOpen, setIsAuthOpen] = useState<boolean>(false);
  const [authTab, setAuthTab] = useState<"login" | "signup" | "guest">("login");

  const saveUserSession = (u: UserProfile) => {
    setUser(u);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(u));
      document.cookie = `user_session=${encodeURIComponent(JSON.stringify(u))}; path=/; max-age=604800; SameSite=Lax`;
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
            if (c.startsWith("user_session=") || c.startsWith("naver_user_session=") || c.startsWith("kakao_user_session=")) {
              const rawVal = c.substring(c.indexOf("=") + 1);
              const jsonStr = decodeURIComponent(rawVal);
              const raw = JSON.parse(jsonStr);
              if (raw && raw.id) {
                resolvedUser = {
                  id: String(raw.id),
                  name: raw.name || raw.nickname || "회원",
                  email: raw.email || `${raw.id}@user`,
                  phone: raw.phone || "",
                  provider: raw.provider || (c.startsWith("naver") ? "naver" : c.startsWith("kakao") ? "kakao" : "email"),
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
    const lowerId = idOrEmail.toLowerCase().trim();
    const lowerPass = pass.trim();

    if (!lowerId) {
      alert("아이디 또는 이메일을 입력해주세요.");
      return false;
    }
    if (!lowerPass) {
      alert("비밀번호를 입력해주세요.");
      return false;
    }

    // 1. 관리자(admin) 로그인 검증 (ID: admin / PW: admin)
    if (lowerId === "admin") {
      if (lowerPass !== "admin") {
        alert("🔒 관리자 비밀번호가 올바르지 않습니다.\n관리자 아이디: admin / 비밀번호: admin");
        return false;
      }

      // 서버 API를 호출하여 제대로 된 서명(HMAC) 쿠키 발급
      try {
        const res = await fetch("/api/staff-console/session", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ password: "admin" }),
          credentials: "same-origin",
        });

        if (!res.ok) {
          alert("관리자 세션 발급에 실패했습니다.");
          return false;
        }
      } catch (e) {
        console.error("Staff console session error", e);
      }

      const adminUser: UserProfile = {
        id: `staff_admin`,
        name: "K-water 통합 관리자",
        email: "admin@kwater.or.kr",
        provider: "staff",
        role: "admin",
      };

      saveUserSession(adminUser);
      closeAuthModal();

      alert(`🔑 관리자(admin) 계정으로 로그인되었습니다.\n관리자 전용 콘솔페이지(/yunyeong)로 이동합니다.`);
      window.location.href = "/yunyeong";
      return true;
    }

    // 2. 일반 회원 로그인 검증 (등록된 회원 DB 확인)
    const users = getRegisteredUsers();
    const matched = users.find(
      (u) =>
        u.email.toLowerCase() === lowerId ||
        u.id.toLowerCase() === lowerId
    );

    if (!matched) {
      alert(
        `❌ [로그인 실패] 등록되지 않은 아이디/이메일입니다.\n\n가입된 계정이 없다면 상단 [📝 회원가입] 탭에서 가입 후 로그인해 주세요.\n(테스트용 계정: user@kwater.or.kr / 비밀번호: 123456)`
      );
      return false;
    }

    if (matched.pass !== lowerPass) {
      alert(`❌ 비밀번호가 올바르지 않습니다. 다시 확인해 주세요.`);
      return false;
    }

    const memberUser: UserProfile = {
      id: matched.id,
      name: matched.name,
      email: matched.email,
      phone: matched.phone || "010-1234-5678",
      provider: matched.provider || "email",
      role: matched.role || "user",
    };

    saveUserSession(memberUser);
    closeAuthModal();

    alert(`👋 ${memberUser.name} 님, 환영합니다.`);
    window.location.href = "/mypage";
    return true;
  };

  const signupWithEmail = async (
    name: string,
    email: string,
    pass: string,
    phone: string
  ): Promise<boolean> => {
    const lowerEmail = email.toLowerCase().trim();
    if (!name.trim() || !lowerEmail || !pass.trim()) {
      alert("모든 필수 항목을 입력해주세요.");
      return false;
    }

    const users = getRegisteredUsers();
    if (users.some((u) => u.email.toLowerCase() === lowerEmail)) {
      alert("❌ 이미 가입된 이메일 주소입니다. 로그인해 주세요.");
      return false;
    }

    const newUser: RegisteredAccount = {
      id: `user_${Date.now()}`,
      name: name.trim(),
      email: lowerEmail,
      pass: pass.trim(),
      phone: phone.trim() || "010-0000-0000",
      provider: "email",
      role: "user",
    };

    const updated = [...users, newUser];
    saveRegisteredUsers(updated);

    const userProfile: UserProfile = {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      phone: newUser.phone,
      provider: "email",
      role: "user",
    };

    saveUserSession(userProfile);
    closeAuthModal();

    alert(`🎉 ${newUser.name} 님의 회원가입이 완료되었습니다!\n마이페이지로 이동합니다.`);
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
    try {
      localStorage.removeItem(STORAGE_KEY);
      document.cookie = "user_session=; path=/; max-age=0; SameSite=Lax";
      document.cookie = "kakao_user_session=; path=/; max-age=0; SameSite=Lax";
      document.cookie = "naver_user_session=; path=/; max-age=0; SameSite=Lax";
      document.cookie = "kwm_staff_console_gate=; path=/; max-age=0; SameSite=Lax";
    } catch (e) {
      console.error("Logout cleanup error", e);
    }
    void fetch("/api/auth/logout", { method: "POST" });
    alert("로그아웃 되었습니다.");
    window.location.href = "/";
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
