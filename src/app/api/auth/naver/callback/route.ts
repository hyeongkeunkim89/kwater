import { NextResponse } from "next/server";
import { cookies } from "next/headers";

function getOrigin(request: Request): string {
  if (process.env.NEXT_PUBLIC_SITE_URL?.trim()) {
    return process.env.NEXT_PUBLIC_SITE_URL.trim().replace(/\/+$/, "");
  }
  const url = new URL(request.url);
  const host = request.headers.get("x-forwarded-host") || request.headers.get("host") || url.host;
  const proto = request.headers.get("x-forwarded-proto") || (url.protocol ? url.protocol.replace(":", "") : "https");
  const finalProto = host.includes("localhost") || host.includes("127.0.0.1") ? proto : "https";
  return `${finalProto}://${host}`;
}

export async function GET(request: Request) {
  const origin = getOrigin(request);
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const state = searchParams.get("state") || "/mypage";
  const error = searchParams.get("error");

  const nextPath = decodeURIComponent(state).startsWith("/") ? decodeURIComponent(state) : "/mypage";

  if (error || !code) {
    console.error("Naver OAuth error or canceled:", error);
    return NextResponse.redirect(`${origin}/mypage?notice=naver_canceled`);
  }

  const naverClientId =
    process.env.NEXT_PUBLIC_NAVER_CLIENT_ID ||
    process.env.NAVER_CLIENT_ID ||
    "";
  const naverClientSecret = process.env.NAVER_CLIENT_SECRET || "";
  const redirectUri = `${origin}/api/auth/naver/callback`;

  try {
    // 1. 인가 코드로 네이버 토큰 발급 요청
    const tokenUrl = new URL("https://nid.naver.com/oauth2.0/token");
    tokenUrl.searchParams.set("grant_type", "authorization_code");
    tokenUrl.searchParams.set("client_id", naverClientId);
    tokenUrl.searchParams.set("client_secret", naverClientSecret);
    tokenUrl.searchParams.set("code", code);
    tokenUrl.searchParams.set("state", state);

    const tokenRes = await fetch(tokenUrl.toString(), { method: "GET" });
    const tokenData = await tokenRes.json();

    if (!tokenRes.ok || !tokenData.access_token) {
      console.error("Naver Token Error:", tokenData);
      return NextResponse.redirect(`${origin}/mypage?notice=naver_token_failed`);
    }

    // 2. 네이버 사용자 프로필 정보 조회
    const userRes = await fetch("https://openapi.naver.com/v1/nid/me", {
      headers: {
        Authorization: `Bearer ${tokenData.access_token}`,
      },
    });

    const userData = await userRes.json();
    if (!userRes.ok || userData.resultcode !== "00") {
      console.error("Naver User Info Error:", userData);
      return NextResponse.redirect(`${origin}/mypage?notice=naver_user_failed`);
    }

    const response = userData.response || {};

    const userInfo = {
      id: response.id,
      name: response.name || response.nickname || "네이버 회원",
      email: response.email || null,
      phone: response.mobile || null,
      provider: "naver",
      loggedInAt: new Date().toISOString(),
    };

    // 3. 로그인 세션 쿠키 세팅 (HttpOnly)
    const cookieStore = await cookies();
    cookieStore.set({
      name: "naver_user_session",
      value: JSON.stringify(userInfo),
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    });

    // 4. 관람객 마이페이지로 리다이렉트
    const targetUrl = new URL(`${origin}${nextPath}`);
    targetUrl.searchParams.set("login", "success");
    return NextResponse.redirect(targetUrl.toString());
  } catch (err) {
    console.error("Naver Callback Exception:", err);
    return NextResponse.redirect(`${origin}/mypage?notice=naver_exception`);
  }
}
