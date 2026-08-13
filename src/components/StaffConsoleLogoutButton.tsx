"use client";

export function StaffConsoleLogoutButton({ show = true }: { show?: boolean }) {
  if (!show) return null;

  async function logout() {
    try {
      await fetch("/api/staff-console/session", { method: "DELETE" });
    } catch (e) {
      console.error("Logout error:", e);
    }
    // 브라우저 쿠키 강제 초기화 후 로그인 화면으로 이동
    document.cookie = "staff_console_auth=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    document.cookie = "kakao_user_session=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    document.cookie = "kwm_staff_console_gate=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/yunyeong;";
    window.location.href = "/yunyeong/login";
  }

  return (
    <button
      type="button"
      onClick={() => void logout()}
      className="min-h-[44px] rounded-full border border-rose-500/40 bg-rose-500/10 px-4 py-1.5 text-sm font-bold text-rose-200 transition hover:bg-rose-500/20 hover:text-white"
    >
      🔒 로그아웃
    </button>
  );
}
