import { NextRequest, NextResponse } from "next/server";
import { isReservationsLive } from "@/lib/reservationsConfig";
import { deleteTourReservationDb, updateTourReservationStatusDb } from "@/lib/reservationsDb";
import { verifyWaterStoriesAdmin, adminStoriesConfigured } from "@/lib/waterStoriesAdminAuth";
import type { ReservationStatus } from "@/types/reservation";

export const runtime = "nodejs";

const STATUSES: ReservationStatus[] = ["대기", "확정", "취소"];

type Ctx = { params: Promise<{ id: string }> };

function adminDenied() {
  return NextResponse.json({ error: "관리자 비밀번호가 올바르지 않습니다." }, { status: 401 });
}

export async function PATCH(req: NextRequest, ctx: Ctx) {
  if (!isReservationsLive()) {
    return NextResponse.json({ error: "예약 서버 저장소가 비활성입니다." }, { status: 503 });
  }
  if (!adminStoriesConfigured()) {
    return NextResponse.json({ error: "관리자 시크릿이 설정되지 않았습니다." }, { status: 503 });
  }
  if (!verifyWaterStoriesAdmin(req)) return adminDenied();

  const { id } = await ctx.params;
  const rid = decodeURIComponent(id).trim();
  if (!rid) {
    return NextResponse.json({ error: "예약 번호가 필요합니다." }, { status: 400 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "JSON 본문이 필요합니다." }, { status: 400 });
  }
  const status =
    body && typeof body === "object" && typeof (body as { status?: unknown }).status === "string"
      ? (body as { status: string }).status.trim()
      : "";

  if (!STATUSES.includes(status as ReservationStatus)) {
    return NextResponse.json({ error: "유효하지 않은 상태입니다." }, { status: 400 });
  }

  const ok = await updateTourReservationStatusDb(rid, status as ReservationStatus);
  if (!ok) {
    return NextResponse.json({ error: "해당 예약을 찾을 수 없습니다." }, { status: 404 });
  }
  return NextResponse.json({ ok: true });
}

export async function DELETE(req: NextRequest, ctx: Ctx) {
  if (!isReservationsLive()) {
    return NextResponse.json({ error: "예약 서버 저장소가 비활성입니다." }, { status: 503 });
  }
  if (!adminStoriesConfigured()) {
    return NextResponse.json({ error: "관리자 시크릿이 설정되지 않았습니다." }, { status: 503 });
  }
  if (!verifyWaterStoriesAdmin(req)) return adminDenied();

  const { id } = await ctx.params;
  const rid = decodeURIComponent(id).trim();
  if (!rid) {
    return NextResponse.json({ error: "예약 번호가 필요합니다." }, { status: 400 });
  }

  const ok = await deleteTourReservationDb(rid);
  if (!ok) {
    return NextResponse.json({ error: "해당 예약을 찾을 수 없습니다." }, { status: 404 });
  }
  return NextResponse.json({ ok: true });
}
