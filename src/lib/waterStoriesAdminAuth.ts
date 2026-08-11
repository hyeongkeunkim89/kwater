import { timingSafeEqual } from "crypto";
import type { NextRequest } from "next/server";
import { getStaffConsoleGatePassword, STAFF_CONSOLE_GATE_COOKIE, verifyStaffGateSessionToken } from "./staffConsoleGate";

export function verifyWaterStoriesAdmin(req: NextRequest): boolean {
  const configured = getStaffConsoleGatePassword();
  if (!configured) return false;
  const given = (req.headers.get("x-admin-secret") ?? "").trim();
  if (!given || given.length !== configured.length) return false;
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
