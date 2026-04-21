import Link from "next/link";
import Image from "next/image";

type ActiveNav = "status" | "none";

const navInactive =
  "link-underline text-white/70 transition hover:text-white";
const navActive = "text-white font-semibold border-b border-sky-400 pb-0.5";

export function WaterHubHeader({
  activeNav = "none",
  dense = false,
}: {
  activeNav?: ActiveNav;
  /** 홈 한 화면 레이아웃용 — 세로·가로 여백 축소 */
  dense?: boolean;
}) {
  return (
    <header className="sticky top-0 z-40 shrink-0 border-b border-white/10 bg-[#152035]/98">
      <div
        className={[
          "mx-auto flex max-w-7xl items-center justify-between gap-4 sm:gap-6",
          dense ? "px-5 py-2.5 sm:px-8" : "px-6 py-4 sm:px-10",
        ].join(" ")}
      >
        <Link href="/" className="flex items-center gap-3 group">
          <Image
            src="/kwater-logo.svg"
            alt="K-water 한국수자원공사"
            width={110}
            height={20}
            className="brightness-0 invert opacity-90 group-hover:opacity-100 transition-opacity"
            priority
          />
          <div className="h-5 w-px bg-white/20" />
          <span className="text-sm font-bold text-white/85 group-hover:text-white transition-colors tracking-tight">
            물문화관 홍보 허브
          </span>
        </Link>

        <nav className="flex items-center gap-6 text-sm font-medium">
          <Link
            href="/status"
            className={activeNav === "status" ? navActive : navInactive}
            aria-current={activeNav === "status" ? "page" : undefined}
          >
            문화관 현황
          </Link>
          <Link href="/reserve" className={navInactive}>
            투어 예약
          </Link>
          <a
            href="https://www.kwater.or.kr"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full border border-white/30 px-4 py-1.5 text-white/80 transition hover:border-white hover:text-white"
          >
            공식 홈페이지
          </a>
        </nav>
      </div>
    </header>
  );
}
