import { NextRequest, NextResponse } from "next/server";
import { isReservationsLive } from "@/lib/reservationsConfig";
import { getSlotBookedCounts } from "@/lib/reservationsDb";
import { MAX_PER_SLOT, TOUR_SLOTS } from "@/types/reservation";
import { waterCenters } from "@/data/centers";

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

export async function GET(req: NextRequest) {
  if (!isReservationsLive()) {
    return NextResponse.json({ error: "예약 서버 저장소가 비활성입니다." }, { status: 503 });
  }

  const { searchParams } = new URL(req.url);
  const centerId = (searchParams.get("centerId") ?? "").trim();
  const date = (searchParams.get("date") ?? "").trim();

  if (!centerId || !DATE_RE.test(date)) {
    return NextResponse.json({ error: "centerId와 date(YYYY-MM-DD)가 필요합니다." }, { status: 400 });
  }
  if (!waterCenters.some((c) => c.id === centerId)) {
    return NextResponse.json({ error: "유효하지 않은 문화관입니다." }, { status: 400 });
  }

  try {
    const booked = await getSlotBookedCounts(centerId, date);
    const availability: Record<string, number> = {};
    for (const t of TOUR_SLOTS) {
      availability[t] = Math.max(0, MAX_PER_SLOT - (booked[t] ?? 0));
    }
    return NextResponse.json({ availability });
  } catch (e) {
    console.error("reservations availability", e);
    return NextResponse.json({ error: "잔여 인원 조회에 실패했습니다." }, { status: 500 });
  }
}
