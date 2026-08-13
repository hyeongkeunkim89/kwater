import { NextResponse } from "next/server";

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

export function GET(request: Request) {
  const origin = getOrigin(request);
  const { searchParams } = new URL(request.url);
  // 일반 사용자 기본 리다이렉트 목적지는 /mypage (마이페이지)
  const next = searchParams.get("next") || "/mypage";

  // 카카오 REST API 키 (환경변수가 없을 경우 안내 메시지와 함께 작동)
  const kakaoClientId =
    process.env.NEXT_PUBLIC_KAKAO_CLIENT_ID ||
    process.env.KAKAO_CLIENT_ID ||
    "";

  // 백엔드 콜백 리다이렉트 URI
  const redirectUri = `${origin}/api/auth/kakao/callback`;

  if (!kakaoClientId) {
    // 키가 설정되지 않았을 경우 로그인 화면으로 돌아가 에러 안내 렌더링
    return NextResponse.redirect(`${origin}/yunyeong/login?error=kakao_key_missing`);
  }

  // 카카오 OAuth 인증 주소 생성 (prompt=login 추가로 기존 로그인 세션 무시하고 항상 비번/아이디 입력창 강제)
  const kakaoAuthUrl = new URL("https://kauth.kakao.com/oauth/authorize");
  kakaoAuthUrl.searchParams.set("client_id", kakaoClientId);
  kakaoAuthUrl.searchParams.set("redirect_uri", redirectUri);
  kakaoAuthUrl.searchParams.set("response_type", "code");
  kakaoAuthUrl.searchParams.set("prompt", "login");
  kakaoAuthUrl.searchParams.set("state", next);

  return NextResponse.redirect(kakaoAuthUrl.toString());
}
