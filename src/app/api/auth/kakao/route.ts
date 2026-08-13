import { NextResponse } from "next/server";

export function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const next = searchParams.get("next") || "/yunyeong";

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

  // 카카오 OAuth 인증 주소 생성
  const kakaoAuthUrl = new URL("https://kauth.kakao.com/oauth/authorize");
  kakaoAuthUrl.searchParams.set("client_id", kakaoClientId);
  kakaoAuthUrl.searchParams.set("redirect_uri", redirectUri);
  kakaoAuthUrl.searchParams.set("response_type", "code");
  kakaoAuthUrl.searchParams.set("state", next);

  return NextResponse.redirect(kakaoAuthUrl.toString());
}
