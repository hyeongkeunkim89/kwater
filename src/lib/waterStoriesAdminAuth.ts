import { timingSafeEqual } from "crypto";
import type { NextRequest } from "next/server";

export function verifyWaterStoriesAdmin(req: NextRequest): boolean {
  const configured = process.env.WATER_STORIES_ADMIN_SECRET?.trim();
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
  return Boolean(process.env.WATER_STORIES_ADMIN_SECRET?.trim());
}
