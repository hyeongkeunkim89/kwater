import { timingSafeEqual } from "crypto";
import type { NextRequest } from "next/server";
import { getStaffConsoleGatePassword, STAFF_CONSOLE_GATE_COOKIE, verifyStaffGateSessionToken } from "./staffConsoleGate";

export function verifyWaterStoriesAdmin(req: NextRequest): boolean {
  const configured = getStaffConsoleGatePassword();
  const given = (req.headers.get("x-admin-secret") ?? "").trim();
  if (!given) return false;
  // 개발 모드(NODE_ENV !== "production")에서 비밀번호 미지정 시 편의를 위한 임시 통과 허용(단, 프로덕션에서는 철저히 환경변수 일치 검증)
  if (process.env.NODE_ENV !== "production" && !configured && given === "admin") {
    return true;
  }
  if (!configured || given.length !== configured.length) return false;
  try {
    return timingSafeEqual(Buffer.from(given, "utf8"), Buffer.from(configured, "utf8"));
  } catch {
    return false;
  }
}

export function adminStoriesConfigured(): boolean {
  return Boolean(getStaffConsoleGatePassword());
}

export async function verifyAdminRequest(req: NextRequest): Promise<boolean> {
  if (verifyWaterStoriesAdmin(req)) return true;
  const token = req.cookies.get(STAFF_CONSOLE_GATE_COOKIE)?.value ?? "";
  if (token && (await verifyStaffGateSessionToken(token))) return true;
  return false;
}
