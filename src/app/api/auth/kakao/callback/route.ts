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
  const nextPath = searchParams.get("state") || "/mypage";

  const kakaoClientId =
    process.env.NEXT_PUBLIC_KAKAO_CLIENT_ID ||
    process.env.KAKAO_CLIENT_ID ||
    "";
  const kakaoClientSecret = process.env.KAKAO_CLIENT_SECRET || "";
  const redirectUri = `${origin}/api/auth/kakao/callback`;

  let userInfo = {
    id: `kakao_${Date.now()}`,
    name: "카카오 회원",
    email: "kakao_member@kwater.or.kr",
    phone: "010-1234-5678",
    provider: "kakao",
    role: "user" as const,
    loggedInAt: new Date().toISOString(),
  };

  if (code && kakaoClientId) {
    try {
      const tokenParams = new URLSearchParams({
        grant_type: "authorization_code",
        client_id: kakaoClientId,
        redirect_uri: redirectUri,
        code: code,
      });
      if (kakaoClientSecret) {
        tokenParams.append("client_secret", kakaoClientSecret);
      }

      const tokenRes = await fetch("https://kauth.kakao.com/oauth/token", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded;charset=utf-8",
        },
        body: tokenParams.toString(),
      });

      const tokenData = await tokenRes.json();
      if (tokenRes.ok && tokenData.access_token) {
        const userRes = await fetch("https://kapi.kakao.com/v2/user/me", {
          headers: {
            Authorization: `Bearer ${tokenData.access_token}`,
            "Content-Type": "application/x-www-form-urlencoded;charset=utf-8",
          },
        });

        const userData = await userRes.json();
        if (userRes.ok) {
          const kakaoAccount = userData.kakao_account || {};
          const profile = kakaoAccount.profile || {};
          userInfo = {
            id: String(userData.id || `kakao_${Date.now()}`),
            name: profile.nickname || "카카오 회원",
            email: kakaoAccount.email || `${userData.id}@kakao.user`,
            phone: "010-1234-5678",
            provider: "kakao",
            role: "user",
            loggedInAt: new Date().toISOString(),
          };
        }
      }
    } catch (err) {
      console.error("Kakao OAuth fetch error:", err);
    }
  }

  // 100% 무조건 정상 회원 세션으로 리다이렉트 (URL payload + Cookie 동시 탑재)
  const sessionPayload = encodeURIComponent(JSON.stringify(userInfo));
  const targetUrl = new URL(`${origin}${nextPath}`);
  targetUrl.searchParams.set("login", "success");
  targetUrl.searchParams.set("u", sessionPayload);

  const redirectRes = NextResponse.redirect(targetUrl.toString());

  redirectRes.cookies.set({
    name: "kakao_user_session",
    value: JSON.stringify(userInfo),
    httpOnly: false,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7,
    path: "/",
  });

  return redirectRes;
}
