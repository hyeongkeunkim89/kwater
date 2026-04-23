"use client";

export function StaffConsoleLogoutButton({ show }: { show: boolean }) {
  if (!show) return null;

  async function logout() {
    await fetch("/api/staff-console/session", { method: "DELETE" });
    window.location.href = "/yunyeong/login";
  }

  return (
    <button
      type="button"
      onClick={() => void logout()}
      className="min-h-[44px] rounded-full border border-white/25 px-4 py-1.5 text-sm text-white/70 transition hover:border-white/50 hover:text-white"
    >
      관리자 페이지 나가기
    </button>
  );
}
