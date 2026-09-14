import { NextRequest, NextResponse } from "next/server";
import { isReservationsLive } from "@/lib/reservationsConfig";
import { getGuestReservationsFromDb } from "@/lib/reservationsDb";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  if (!isReservationsLive()) {
    return NextResponse.json({ reservations: [] });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "JSON 본문이 필요합니다." }, { status: 400 });
  }

  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "잘못된 요청입니다." }, { status: 400 });
  }

  const b = body as Record<string, unknown>;
  const phone = typeof b.phone === "string" ? b.phone.trim() : "";
  const pin = typeof b.pin === "string" ? b.pin.trim() : "";

  if (!phone) {
    return NextResponse.json({ reservations: [] });
  }

  try {
    const list = await getGuestReservationsFromDb(phone, pin);
    return NextResponse.json({ reservations: list });
  } catch (e) {
    console.error("guest-lookup error", e);
    return NextResponse.json({ error: "예약 조회를 처리할 수 없습니다." }, { status: 500 });
  }
}
