import { NextRequest, NextResponse } from "next/server";
import { isReservationsLive } from "@/lib/reservationsConfig";
import { getUserReservationsFromDb } from "@/lib/reservationsDb";

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
  const email = typeof b.email === "string" ? b.email.trim() : "";
  const phone = typeof b.phone === "string" ? b.phone.trim() : "";

  if (!email && !phone) {
    return NextResponse.json({ reservations: [] });
  }

  try {
    const list = await getUserReservationsFromDb(email, phone);
    return NextResponse.json({ reservations: list });
  } catch (e) {
    console.error("my-reservations error", e);
    return NextResponse.json({ error: "예약 목록을 불러오지 못했습니다." }, { status: 500 });
  }
}
