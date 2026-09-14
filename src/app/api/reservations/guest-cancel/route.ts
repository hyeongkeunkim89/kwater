import { NextRequest, NextResponse } from "next/server";
import { isReservationsLive } from "@/lib/reservationsConfig";
import { cancelGuestReservationInDb } from "@/lib/reservationsDb";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  if (!isReservationsLive()) {
    return NextResponse.json({ error: "예약 서버 저장소가 비활성입니다." }, { status: 503 });
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
  const id = typeof b.id === "string" ? b.id.trim() : "";
  const phone = typeof b.phone === "string" ? b.phone.trim() : "";
  const pin = typeof b.pin === "string" ? b.pin.trim() : "";

  if (!id) {
    return NextResponse.json({ error: "예약 번호가 필요합니다." }, { status: 400 });
  }

  try {
    const ok = await cancelGuestReservationInDb(id, phone, pin);
    if (!ok) {
      return NextResponse.json({ error: "예약 취소에 실패했거나 예약을 찾을 수 없습니다." }, { status: 404 });
    }
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("guest-cancel error", e);
    return NextResponse.json({ error: "예약 취소를 처리할 수 없습니다." }, { status: 500 });
  }
}
