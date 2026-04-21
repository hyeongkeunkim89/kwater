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
    <header className="sticky top-0 z-40 shrink-0 border-b border-white/10 bg-[#152035]/98 backdrop-blur-md supports-[backdrop-filter]:bg-[#152035]/92">
      <div
        className={[
          "mx-auto flex max-w-7xl flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4 md:gap-6",
          dense ? "px-4 py-2.5 sm:px-8" : "px-4 py-3 sm:px-10 sm:py-4",
        ].join(" ")}
      >
        <Link
          href="/"
          className="group flex min-w-0 max-w-full shrink-0 items-center gap-2 sm:gap-3"
        >
          <Image
            src="/kwater-logo.svg"
            alt="K-water 한국수자원공사"
            width={110}
            height={20}
            className="h-4 w-auto shrink-0 brightness-0 invert opacity-90 transition-opacity group-hover:opacity-100 sm:h-5"
            priority
          />
          <div className="hidden h-4 w-px bg-white/20 sm:block sm:h-5" aria-hidden />
          <span className="min-w-0 truncate text-xs font-bold tracking-tight text-white/85 transition-colors group-hover:text-white sm:text-sm">
            물문화관 홍보 허브
          </span>
        </Link>

        <nav className="flex flex-wrap items-center gap-x-3 gap-y-2 text-xs font-medium sm:gap-x-5 sm:text-sm md:justify-end">
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
            className="whitespace-nowrap rounded-full border border-white/30 px-3 py-1.5 text-white/80 transition hover:border-white hover:text-white sm:px-4"
            aria-label="K-water 공식 홈페이지"
          >
            <span className="sm:hidden">홈페이지</span>
            <span className="hidden sm:inline">공식 홈페이지</span>
          </a>
        </nav>
      </div>
    </header>
  );
}
