import Link from "next/link";
import Image from "next/image";
import { STAFF_CONSOLE_HREF } from "@/lib/sitePaths";

type ActiveNav = "status" | "stories" | "none";

const navInactive =
  "link-underline text-slate-700 font-medium transition hover:text-[#0066B3]";
const navActive = "text-[#0066B3] font-bold border-b-2 border-[#0066B3] pb-0.5";

export function WaterHubHeader({
  activeNav = "none",
  dense = false,
  /** 홈(/)에서만 true — 관리자 페이지 링크를 헤더 오른쪽 끝에 표시 */
  showStaffConsoleLink = false,
}: {
  activeNav?: ActiveNav;
  /** 홈 한 화면 레이아웃용 — 세로·가로 여백 축소 */
  dense?: boolean;
  showStaffConsoleLink?: boolean;
}) {
  return (
    <header className="sticky top-0 z-40 shrink-0 border-b border-slate-200 bg-white/95 backdrop-blur-md shadow-xs supports-[backdrop-filter]:bg-white/90">
      <div
        className={[
          "mx-auto flex max-w-7xl flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4 md:gap-6",
          dense ? "px-4 py-2.5 sm:px-8" : "px-4 py-3 sm:px-10 sm:py-4",
        ].join(" ")}
      >
        <Link
          href="/"
          className="group flex min-w-0 max-w-full shrink-0 items-center gap-2.5 sm:gap-3.5"
        >
          <Image
            src="/kwater-logo.svg"
            alt="K-water 한국수자원공사"
            width={130}
            height={24}
            className="h-5 w-auto shrink-0 transition-opacity group-hover:opacity-90 sm:h-6"
            priority
          />
          <div className="hidden h-4 w-px bg-slate-300 sm:block sm:h-5" aria-hidden />
          <span className="min-w-0 truncate text-xs font-bold tracking-tight text-slate-800 transition-colors group-hover:text-[#0066B3] sm:text-sm">
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
          <Link
            href="/mul-iyagi"
            className={activeNav === "stories" ? navActive : navInactive}
            aria-current={activeNav === "stories" ? "page" : undefined}
          >
            물 이야기
          </Link>
          <Link href="/reserve" className={navInactive}>
            투어 예약
          </Link>
          <a
            href="https://www.kwater.or.kr"
            target="_blank"
            rel="noopener noreferrer"
            className="whitespace-nowrap rounded-full border border-[#0066B3] bg-white px-3.5 py-1 text-xs font-semibold text-[#0066B3] transition hover:bg-[#0066B3] hover:text-white sm:px-4 sm:py-1.5 sm:text-sm"
            aria-label="K-water 공식 홈페이지"
          >
            <span className="sm:hidden">홈페이지</span>
            <span className="hidden sm:inline">공식 홈페이지</span>
          </a>
          {showStaffConsoleLink ? (
            <Link
              href={STAFF_CONSOLE_HREF}
              className="inline-flex min-h-10 min-w-0 items-center whitespace-nowrap text-xs text-slate-500 transition hover:text-[#0066B3] sm:text-sm"
            >
              관리자 페이지
            </Link>
          ) : null}
        </nav>
      </div>
    </header>
  );
}
