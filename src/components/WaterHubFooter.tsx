import Link from "next/link";

export function WaterHubFooter({ compact = false }: { compact?: boolean }) {
  return (
    <footer
      className={[
        "shrink-0 border-t border-slate-100 bg-[#152035]",
        compact ? "py-5" : "py-12",
      ].join(" ")}
    >
      <div
        className={[
          "mx-auto flex max-w-7xl flex-col gap-4 sm:flex-row sm:items-center sm:justify-between",
          compact ? "gap-3 px-5 sm:px-8" : "gap-6 px-6 sm:px-10",
        ].join(" ")}
      >
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-6">
          <div className="flex items-center gap-3">
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-sky-500 text-xs font-black text-white">
              K
            </span>
            <p className="text-sm font-medium text-white/60" suppressHydrationWarning>
              © {new Date().getFullYear()} K-water 물문화관 · 내부 활용 자료
            </p>
          </div>
          <nav className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs font-semibold text-white/55 sm:text-sm">
            <Link href="/status" className="min-h-9 py-2 transition hover:text-white">
              문화관 현황
            </Link>
            <Link href="/mul-iyagi" className="min-h-9 py-2 transition hover:text-white">
              물 이야기
            </Link>
            <Link href="/reserve" className="min-h-9 py-2 transition hover:text-white">
              투어 예약
            </Link>
          </nav>
        </div>
        <a
          href="https://www.kwater.or.kr"
          className="min-h-9 text-sm font-medium text-sky-400 transition hover:text-sky-300 link-underline"
          target="_blank"
          rel="noopener noreferrer"
        >
          kwater.or.kr →
        </a>
      </div>
    </footer>
  );
}
