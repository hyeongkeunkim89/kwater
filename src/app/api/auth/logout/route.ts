import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST() {
  const cookieStore = await cookies();
  cookieStore.delete("naver_user_session");
  cookieStore.delete("kakao_user_session");
  cookieStore.delete("staff_console_auth");
  return NextResponse.json({ success: true });
}
