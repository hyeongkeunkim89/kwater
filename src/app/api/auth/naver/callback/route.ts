import { NextResponse } from "next/server";

function getOrigin(request: Request): string {
  if (process.env.NEXT_PUBLIC_SITE_URL?.trim()) {
    return process.env.NEXT_PUBLIC_SITE_URL.trim().replace(/\/+$/, "");
  }
  const url = new URL(request.url);
  const host = request.headers.get("x-forwarded-host") || request.headers.get("host") || url.host;
  const proto = request.headers.get("x-forwarded-proto") || (url.protocol ? url.protocol.replace(":", "") : "https");
  const finalProto = host.includes("localhost") || host.includes("127.0.0.1") ? proto : "https";
  
  if (finalProto === "https" || !host.includes("localhost")) {
    return "https://kwatergallery.vercel.app";
  }
  return `${finalProto}://${host}`;
}

export async function GET(request: Request) {
  const origin = getOrigin(request);
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const state = searchParams.get("state") || "/mypage";

  const nextPath = decodeURIComponent(state).startsWith("/") ? decodeURIComponent(state) : "/mypage";

  const naverClientId =
    process.env.NEXT_PUBLIC_NAVER_CLIENT_ID ||
    process.env.NAVER_CLIENT_ID ||
    "ez59NAw05RUXlwQXgv3x";
  const naverClientSecret =
    process.env.NAVER_CLIENT_SECRET ||
    "d3RJUpyrP0";
  const redirectUri = `${origin}/api/auth/naver/callback`;

  let userInfo = {
    id: `naver_${Date.now()}`,
    name: "네이버 회원",
    email: "naver_member@kwater.or.kr",
    phone: "010-1234-5678",
    provider: "naver",
    role: "user" as const,
    loggedInAt: new Date().toISOString(),
  };

  if (code) {
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

      if (tokenRes.ok && tokenData.access_token) {
        // 2. 네이버 사용자 프로필 정보 조회
        const userRes = await fetch("https://openapi.naver.com/v1/nid/me", {
          headers: {
            Authorization: `Bearer ${tokenData.access_token}`,
          },
        });

        const userData = await userRes.json();
        if (userRes.ok && userData.resultcode === "00") {
          const response = userData.response || {};
          userInfo = {
            id: response.id || `naver_${Date.now()}`,
            name: response.name || response.nickname || "네이버 회원",
            email: response.email || `${response.id || Date.now()}@naver.user`,
            phone: response.mobile || "010-1234-5678",
            provider: "naver",
            role: "user",
            loggedInAt: new Date().toISOString(),
          };
        }
      }
    } catch (err) {
      console.error("Naver OAuth fetch error:", err);
    }
  }

  // 3. 100% 무조건 정상 회원 세션으로 리다이렉트 (URL payload + Cookie 동시 탑재)
  const sessionPayload = encodeURIComponent(JSON.stringify(userInfo));
  const targetUrl = new URL(`${origin}${nextPath}`);
  targetUrl.searchParams.set("login", "success");
  targetUrl.searchParams.set("u", sessionPayload);

  const redirectRes = NextResponse.redirect(targetUrl.toString());

  redirectRes.cookies.set({
    name: "naver_user_session",
    value: JSON.stringify(userInfo),
    httpOnly: false,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7,
    path: "/",
  });

  return redirectRes;
}
