"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { STAFF_CONSOLE_HREF } from "@/lib/sitePaths";

export function LoginForm() {
  const router = useRouter();
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
        body: JSON.stringify({ password }),
      });
      const j = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok) {
        setError(j.error ?? "로그인에 실패했습니다.");
        return;
      }
      router.replace(nextPath);
      router.refresh();
    } catch {
      setError("네트워크 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0b111e] text-white">
      <div className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-6 py-12">
        <p className="text-center text-[10px] font-bold uppercase tracking-widest text-sky-400">Console</p>
        <h1 className="mt-2 text-center text-2xl font-black tracking-tight">문화관 운영 콘솔</h1>
        <p className="mt-3 text-center text-sm text-white/50">
          예약·물 이야기 <strong className="text-white/70">같은 관리자 비밀번호</strong>를 입력하세요. (
          <code className="text-white/40">WATER_STORIES_ADMIN_SECRET</code>와 동일·또는 전용{" "}
          <code className="text-white/40">STAFF_CONSOLE_PASSWORD</code>)
        </p>

        <form onSubmit={(e) => void onSubmit(e)} className="mt-10 space-y-4 rounded-2xl border border-white/10 bg-white/[0.04] p-6 shadow-xl">
          <div>
            <label htmlFor="staff-gate-pw" className="block text-xs font-semibold text-white/70">
              비밀번호
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
