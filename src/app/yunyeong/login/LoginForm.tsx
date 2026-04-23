"use client";

import { useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { STAFF_CONSOLE_HREF } from "@/lib/sitePaths";

export function LoginForm() {
  const searchParams = useSearchParams();
  const nextRaw = searchParams.get("next");
  const nextPath =
    nextRaw && nextRaw.startsWith("/yunyeong") && !nextRaw.startsWith("/yunyeong/login")
      ? nextRaw
      : STAFF_CONSOLE_HREF;

  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/staff-console/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: password.trim() }),
        credentials: "same-origin",
      });
      const j = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok) {
        setError(j.error ?? "로그인에 실패했습니다.");
        return;
      }
      // 전체 이동: HttpOnly 쿠키가 클라이언트 라우팅보다 먼저 반영되도록 함
      window.location.assign(nextPath);
    } catch {
      setError("네트워크 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0b111e] text-white">
      <div className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-6 py-12">
        <h1 className="text-center text-2xl font-black tracking-tight">문화관 관리자 페이지</h1>
        <p className="mt-3 text-center text-sm text-white/55">관리자 비밀번호를 입력하세요.</p>

        <form onSubmit={(e) => void onSubmit(e)} className="mt-10 space-y-4 rounded-2xl border border-white/10 bg-white/[0.04] p-6 shadow-xl">
          <div>
            <label htmlFor="staff-gate-pw" className="sr-only">
              관리자 비밀번호
            </label>
            <input
              id="staff-gate-pw"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-2 min-h-[48px] w-full rounded-xl border border-white/15 bg-black/30 px-4 py-3 text-sm text-white outline-none ring-sky-500/40 focus:ring-2"
              placeholder="관리자 비밀번호"
            />
          </div>
          {error && <p className="text-sm text-rose-300">{error}</p>}
          <button
            type="submit"
            disabled={loading || !password.trim()}
            className="min-h-[48px] w-full rounded-xl bg-sky-600 py-3 text-sm font-bold text-white hover:bg-sky-500 disabled:opacity-40"
          >
            {loading ? "확인 중…" : "들어가기"}
          </button>
        </form>

        <p className="mt-8 text-center text-xs text-white/35">
          <Link href="/" className="text-white/50 underline-offset-2 hover:text-white">
            홈으로
          </Link>
        </p>
      </div>
    </div>
  );
}
