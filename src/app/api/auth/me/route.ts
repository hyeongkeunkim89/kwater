import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export const dynamic = "force-dynamic";

export async function GET() {
  const cookieStore = await cookies();
  const userSession = cookieStore.get("user_session")?.value;
  const naverSession = cookieStore.get("naver_user_session")?.value;
  const kakaoSession = cookieStore.get("kakao_user_session")?.value;

  if (userSession) {
    try {
      const raw = JSON.parse(userSession);
      if (raw && raw.id) {
        return NextResponse.json({ user: raw });
      }
    } catch (e) {
      console.error("Failed to parse user_session cookie", e);
    }
  }

  if (naverSession) {
    try {
      const raw = JSON.parse(naverSession);
      const user = {
        id: String(raw.id || "naver_user"),
        name: raw.name || raw.nickname || "네이버 회원",
        email: raw.email || `${raw.id}@naver.user`,
        phone: raw.phone || "",
        provider: raw.provider || "naver",
        role: raw.role || "user",
      };
      return NextResponse.json({ user });
    } catch (e) {
      console.error("Failed to parse Naver session cookie", e);
    }
  }

  if (kakaoSession) {
    try {
      const raw = JSON.parse(kakaoSession);
      const user = {
        id: String(raw.id || "kakao_user"),
        name: raw.name || raw.nickname || "카카오 회원",
        email: raw.email || `${raw.id}@kakao.user`,
        phone: raw.phone || "",
        provider: raw.provider || "kakao",
        role: raw.role || "user",
      };
      return NextResponse.json({ user });
    } catch (e) {
      console.error("Failed to parse Kakao session cookie", e);
    }
  }

  return NextResponse.json({ user: null });
}
