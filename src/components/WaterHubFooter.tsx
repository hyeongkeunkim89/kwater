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
          "mx-auto flex max-w-7xl flex-col sm:flex-row sm:items-center sm:justify-between",
          compact ? "gap-3 px-5 sm:px-8" : "gap-6 px-6 sm:px-10",
        ].join(" ")}
      >
        <div className="flex items-center gap-3">
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-sky-500 text-xs font-black text-white">
            K
          </span>
          <p className="text-sm font-medium text-white/60" suppressHydrationWarning>
            © {new Date().getFullYear()} K-water 물문화관 · 내부 활용 자료
          </p>
        </div>
        <a
          href="https://www.kwater.or.kr"
          className="text-sm font-medium text-sky-400 transition hover:text-sky-300 link-underline"
          target="_blank"
          rel="noopener noreferrer"
        >
          kwater.or.kr →
        </a>
      </div>
    </footer>
  );
}
