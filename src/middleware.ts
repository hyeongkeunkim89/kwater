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
  const token = req.cookies.get(STAFF_CONSOLE_GATE_COOKIE)?.value ?? "";
  const kakaoAuth = req.cookies.get("staff_console_auth")?.value ?? "";
  const kakaoSession = req.cookies.get("kakao_user_session")?.value ?? "";

  const isGateTokenValid = token && (await verifyStaffGateSessionToken(token));
  const isKakaoAuthValid = kakaoAuth === "true" || Boolean(kakaoSession);

  // 게이트 암호 환경변수가 없더라도 미로그인 사용자는 /yunyeong/login으로 리다이렉트
  if (!isGateTokenValid && !isKakaoAuthValid) {
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
