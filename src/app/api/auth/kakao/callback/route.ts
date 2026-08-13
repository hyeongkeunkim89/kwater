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
  const nextPath = searchParams.get("state") || "/yunyeong";
  const error = searchParams.get("error");

  if (error || !code) {
    console.error("Kakao OAuth login error or canceled by user:", error);
    return NextResponse.redirect(`${origin}/yunyeong/login?error=kakao_canceled`);
  }

  const kakaoClientId =
    process.env.NEXT_PUBLIC_KAKAO_CLIENT_ID ||
    process.env.KAKAO_CLIENT_ID ||
    "";
  const kakaoClientSecret = process.env.KAKAO_CLIENT_SECRET || "";
  const redirectUri = `${origin}/api/auth/kakao/callback`;

  try {
    // 1. 인가 코드로 카카오 토큰 발급 요청
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
    if (!tokenRes.ok || !tokenData.access_token) {
      console.error("Kakao Token Error:", tokenData);
      return NextResponse.redirect(`${origin}/yunyeong/login?error=kakao_token_failed`);
    }

    // 2. 카카오 사용자 프로필 정보 조회
    const userRes = await fetch("https://kapi.kakao.com/v2/user/me", {
      headers: {
        Authorization: `Bearer ${tokenData.access_token}`,
        "Content-Type": "application/x-www-form-urlencoded;charset=utf-8",
      },
    });

    const userData = await userRes.json();
    if (!userRes.ok) {
      console.error("Kakao User Info Error:", userData);
      return NextResponse.redirect(`${origin}/yunyeong/login?error=kakao_user_failed`);
    }

    // 3. 사용자 정보 추출 (닉네임, 프로필 사진, 이메일 등)
    const kakaoAccount = userData.kakao_account || {};
    const profile = kakaoAccount.profile || {};

    const userInfo = {
      id: userData.id,
      nickname: profile.nickname || "카카오 회원",
      profileImage: profile.profile_image_url || null,
      email: kakaoAccount.email || null,
      provider: "kakao",
      loggedInAt: new Date().toISOString(),
    };

    // 4. 로그인 세션 쿠키 세팅 (HttpOnly)
    const cookieStore = await cookies();
    cookieStore.set({
      name: "kakao_user_session",
      value: JSON.stringify(userInfo),
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7일 유지
      path: "/",
    });

    // 관리자 페이지 진입용 세션 플래그 쿠키도 함께 발행
    cookieStore.set({
      name: "staff_console_auth",
      value: "true",
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    });

    // 5. 로그인 완료 후 대상 페이지로 리다이렉트
    return NextResponse.redirect(`${origin}${nextPath}`);
  } catch (err) {
    console.error("Kakao Callback Exception:", err);
    return NextResponse.redirect(`${origin}/yunyeong/login?error=kakao_exception`);
  }
}
