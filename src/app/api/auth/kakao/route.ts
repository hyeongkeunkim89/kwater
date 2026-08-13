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
    // 키가 설정되지 않은 개발 단계에서의 친절한 가이드 화면 서빙
    return new NextResponse(
      `
      <!DOCTYPE html>
      <html lang="ko">
      <head>
        <meta charset="utf-8">
        <title>카카오 로그인 연동 안내</title>
        <style>
          body { font-family: -apple-system, sans-serif; background: #0b111e; color: #fff; display: flex; align-items: center; justify-content: center; min-height: 100vh; margin: 0; }
          .card { background: #172133; padding: 2rem; border-radius: 1.5rem; max-width: 500px; border: 1px solid rgba(255,255,255,0.1); }
          h2 { color: #FEE500; margin-top: 0; }
          code { background: rgba(255,255,255,0.1); padding: 0.2rem 0.4rem; border-radius: 0.3rem; font-size: 0.9em; }
          .btn { display: inline-block; background: #38bdf8; color: #000; font-weight: bold; padding: 0.75rem 1.5rem; border-radius: 0.75rem; text-decoration: none; margin-top: 1.5rem; }
        </style>
      </head>
      <body>
        <div class="card">
          <h2>카카오 로그인 연동 설정 필요</h2>
          <p>카카오 로그인 기능 구현이 완료되었습니다! 🚀</p>
          <p>실제 카카오톡 인증창을 연결하려면 <strong>Kakao Developers</strong>에서 발급받은 REST API 키를 <code>.env.local</code> 또는 Vercel 환경변수에 추가해 주세요.</p>
          <p><code>NEXT_PUBLIC_KAKAO_CLIENT_ID = 발급받은_REST_API_키</code></p>
          <p style="font-size: 0.85em; color: #94a3b8;">* Redirect URI 등록값: <code>${redirectUri}</code></p>
          <a href="${next}" class="btn">이전 페이지로 돌아가기</a>
        </div>
      </body>
      </html>
      `,
      { headers: { "Content-Type": "text/html; charset=utf-8" } }
    );
  }

  // 카카오 OAuth 인증 주소 생성
  const kakaoAuthUrl = new URL("https://kauth.kakao.com/oauth/authorize");
  kakaoAuthUrl.searchParams.set("client_id", kakaoClientId);
  kakaoAuthUrl.searchParams.set("redirect_uri", redirectUri);
  kakaoAuthUrl.searchParams.set("response_type", "code");
  kakaoAuthUrl.searchParams.set("state", next);

  return NextResponse.redirect(kakaoAuthUrl.toString());
}
