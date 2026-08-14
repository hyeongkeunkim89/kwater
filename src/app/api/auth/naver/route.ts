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

export function GET(request: Request) {
  const origin = getOrigin(request);
  const { searchParams } = new URL(request.url);
  const next = searchParams.get("next") || "/mypage";

  const naverClientId =
    process.env.NEXT_PUBLIC_NAVER_CLIENT_ID ||
    process.env.NAVER_CLIENT_ID ||
    "ez59NAw05RUXlwQXgv3x";

  const redirectUri = `${origin}/api/auth/naver/callback`;

  const state = encodeURIComponent(next);
  const naverAuthUrl = new URL("https://nid.naver.com/oauth2.0/authorize");
  naverAuthUrl.searchParams.set("response_type", "code");
  naverAuthUrl.searchParams.set("client_id", naverClientId);
  naverAuthUrl.searchParams.set("redirect_uri", redirectUri);
  naverAuthUrl.searchParams.set("state", state);

  return NextResponse.redirect(naverAuthUrl.toString());
}
