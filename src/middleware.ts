import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import {
  isStaffConsoleGateEnabled,
  STAFF_CONSOLE_GATE_COOKIE,
  verifyStaffGateSessionToken,
} from "@/lib/staffConsoleGate";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  if (!pathname.startsWith("/yunyeong")) {
    return NextResponse.next();
  }
  if (pathname.startsWith("/yunyeong/login")) {
    return NextResponse.next();
  }
  if (!isStaffConsoleGateEnabled()) {
    return NextResponse.next();
  }

  const token = req.cookies.get(STAFF_CONSOLE_GATE_COOKIE)?.value ?? "";
  if (!token || !(await verifyStaffGateSessionToken(token))) {
    const url = req.nextUrl.clone();
    url.pathname = "/yunyeong/login";
    url.searchParams.set("next", `${pathname}${req.nextUrl.search}`);
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/yunyeong", "/yunyeong/:path*"],
};
