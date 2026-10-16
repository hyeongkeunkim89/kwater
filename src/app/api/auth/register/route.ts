import { NextRequest, NextResponse } from "next/server";
import { upsertUserToDb } from "@/lib/usersDb";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, name, phone, provider = "email", role = "user" } = body;

    if (!email || !name) {
      return NextResponse.json({ error: "이메일과 이름은 필수입니다." }, { status: 400 });
    }

    await upsertUserToDb({
      email,
      name,
      phone,
      provider,
      role,
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Register API error:", err);
    return NextResponse.json({ error: "회원 등록에 실패했습니다." }, { status: 500 });
  }
}
