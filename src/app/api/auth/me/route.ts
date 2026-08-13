import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET() {
  const cookieStore = await cookies();
  const kakaoSession = cookieStore.get("kakao_user_session")?.value;

  if (!kakaoSession) {
    return NextResponse.json({ user: null });
  }

  try {
    const raw = JSON.parse(kakaoSession);
    const user = {
      id: String(raw.id || "kakao_user"),
      name: raw.nickname || "카카오 사용자",
      email: raw.email || `${raw.id}@kakao.user`,
      provider: "kakao",
      role: "user",
    };
    return NextResponse.json({ user });
  } catch {
    return NextResponse.json({ user: null });
  }
}
