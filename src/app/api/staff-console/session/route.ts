import { NextRequest, NextResponse } from "next/server";
import { timingSafeEqual } from "crypto";
import {
  buildStaffGateClearCookieHeader,
  buildStaffGateSetCookieHeader,
  getStaffConsoleGatePassword,
  isStaffConsoleGateEnabled,
  mintStaffGateSessionToken,
} from "@/lib/staffConsoleGate";

export const runtime = "nodejs";

function timingSafeEqualUtf8(a: string, b: string): boolean {
  const ea = Buffer.from(a, "utf8");
  const eb = Buffer.from(b, "utf8");
  if (ea.length !== eb.length) return false;
  return timingSafeEqual(ea, eb);
}

export async function POST(req: NextRequest) {
  if (!isStaffConsoleGateEnabled()) {
    return NextResponse.json(
      { error: "운영 콘솔 게이트가 비활성입니다. 배포에 STAFF_CONSOLE_PASSWORD를 설정하세요." },
      { status: 503 },
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "JSON 본문이 필요합니다." }, { status: 400 });
  }
  const pwd =
    body && typeof body === "object" && typeof (body as { password?: unknown }).password === "string"
      ? (body as { password: string }).password
      : "";
  const expected = getStaffConsoleGatePassword();
  if (!pwd || !timingSafeEqualUtf8(pwd, expected)) {
    return NextResponse.json({ error: "비밀번호가 올바르지 않습니다." }, { status: 401 });
  }

  try {
    const token = await mintStaffGateSessionToken();
    const res = NextResponse.json({ ok: true });
    res.headers.append("Set-Cookie", buildStaffGateSetCookieHeader(token));
    return res;
  } catch (e) {
    console.error("staff-console session mint", e);
    return NextResponse.json({ error: "세션을 만들지 못했습니다." }, { status: 500 });
  }
}

export async function DELETE() {
  const res = NextResponse.json({ ok: true });
  res.headers.append("Set-Cookie", buildStaffGateClearCookieHeader());
  return res;
}
