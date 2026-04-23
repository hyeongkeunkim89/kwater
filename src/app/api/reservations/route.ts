import { NextRequest, NextResponse } from "next/server";
import { waterCenters } from "@/data/centers";
import { isReservationsLive } from "@/lib/reservationsConfig";
import {
  insertTourReservationDb,
  listTourReservationsFromDb,
  TourReservationSlotFullError,
} from "@/lib/reservationsDb";
import { verifyWaterStoriesAdmin, adminStoriesConfigured } from "@/lib/waterStoriesAdminAuth";
import type { VisitPurpose } from "@/types/reservation";
import { MAX_PER_SLOT, TOUR_SLOTS, VISIT_PURPOSES } from "@/types/reservation";

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
const PHONE_RE = /^[0-9-]{9,13}$/;
const NAME_MIN = 2;
const REQUESTS_MAX = 2000;

function postgresErrMeta(err: unknown): { msg: string; code: string } {
  const msg = err instanceof Error ? err.message : String(err);
  if (!err || typeof err !== "object") return { msg, code: "" };
  const o = err as Record<string, unknown>;
  const code = typeof o.code === "string" ? o.code : "";
  return { msg, code };
}

export async function GET(req: NextRequest) {
  if (!isReservationsLive()) {
    return NextResponse.json({ error: "예약 서버 저장소가 비활성입니다." }, { status: 503 });
  }
  if (!adminStoriesConfigured()) {
    return NextResponse.json({ error: "관리자 시크릿이 설정되지 않았습니다." }, { status: 503 });
  }
  if (!verifyWaterStoriesAdmin(req)) {
    return NextResponse.json({ error: "관리자 비밀번호가 올바르지 않습니다." }, { status: 401 });
  }

  try {
    const list = await listTourReservationsFromDb();
    return NextResponse.json(list);
  } catch (e) {
    console.error("reservations list", e);
    return NextResponse.json({ error: "목록을 불러오지 못했습니다." }, { status: 500 });
  }
}

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
  const centerId = typeof b.centerId === "string" ? b.centerId.trim() : "";
  const centerName = typeof b.centerName === "string" ? b.centerName.trim() : "";
  const date = typeof b.date === "string" ? b.date.trim() : "";
  const time = typeof b.time === "string" ? b.time.trim() : "";
  const name = typeof b.name === "string" ? b.name.trim() : "";
  const phoneRaw = typeof b.phone === "string" ? b.phone.replace(/\s/g, "") : "";
  const partySize = typeof b.partySize === "number" ? b.partySize : Number.NaN;
  const purpose = typeof b.purpose === "string" ? b.purpose.trim() : "";
  const requests = typeof b.requests === "string" ? b.requests.trim().slice(0, REQUESTS_MAX) : "";

  const center = waterCenters.find((c) => c.id === centerId);
  if (!center) {
    return NextResponse.json({ error: "유효하지 않은 문화관입니다." }, { status: 400 });
  }
  if (centerName !== center.name) {
    return NextResponse.json({ error: "문화관 정보가 일치하지 않습니다." }, { status: 400 });
  }
  if (!DATE_RE.test(date)) {
    return NextResponse.json({ error: "날짜 형식이 올바르지 않습니다." }, { status: 400 });
  }
  if (!TOUR_SLOTS.includes(time as (typeof TOUR_SLOTS)[number])) {
    return NextResponse.json({ error: "유효하지 않은 시간 슬롯입니다." }, { status: 400 });
  }
  if (name.length < NAME_MIN) {
    return NextResponse.json({ error: "예약자 성명을 입력해 주세요." }, { status: 400 });
  }
  if (!PHONE_RE.test(phoneRaw)) {
    return NextResponse.json({ error: "연락처 형식을 확인해 주세요." }, { status: 400 });
  }
  if (!Number.isFinite(partySize) || partySize < 1 || partySize > MAX_PER_SLOT) {
    return NextResponse.json({ error: "방문 인원이 올바르지 않습니다." }, { status: 400 });
  }
  if (!VISIT_PURPOSES.includes(purpose as VisitPurpose)) {
    return NextResponse.json({ error: "방문 목적이 올바르지 않습니다." }, { status: 400 });
  }

  try {
    const created = await insertTourReservationDb({
      centerId,
      centerName,
      date,
      time,
      name,
      phone: phoneRaw,
      partySize,
      purpose: purpose as VisitPurpose,
      requests,
    });
    return NextResponse.json(created, { status: 201 });
  } catch (err) {
    if (err instanceof TourReservationSlotFullError) {
      return NextResponse.json({ error: "해당 시간대는 정원이 찼습니다. 다른 시간을 선택해 주세요." }, { status: 409 });
    }
    const { msg, code } = postgresErrMeta(err);
    if (code === "42P01" || /relation .* does not exist/i.test(msg)) {
      return NextResponse.json(
        {
          error:
            "예약 테이블이 없습니다. Supabase SQL Editor에서 `db/tour-reservations.sql`을 실행한 뒤 다시 시도해 주세요.",
        },
        { status: 500 },
      );
    }
    console.error("reservation insert", err);
    return NextResponse.json({ error: "예약 접수에 실패했습니다. 잠시 후 다시 시도해 주세요." }, { status: 500 });
  }
}
