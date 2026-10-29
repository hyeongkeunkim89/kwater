import { NextRequest, NextResponse } from "next/server";
import { isReservationsLive } from "@/lib/reservationsConfig";
import { purgeExpiredTourReservationsDb } from "@/lib/reservationsDb";
import { verifyAdminRequest } from "@/lib/waterStoriesAdminAuth";

export const runtime = "nodejs";

/**
 * 가이드 투어 예약 개인식별정보 파기 (익명화 조치)
 * 개인정보보호법 제21조(개인정보의 파기) 준수:
 * 관람 완료일(또는 예약 취소일)로부터 30일 경과 시 성명, 연락처, 이메일, PIN, 요청사항을 영구 익명화 처리합니다.
 * (통계용 방문 데이터는 영구 보존)
 *
 * 인증:
 * 1) 관리자 로그인 세션 / x-admin-secret 헤더
 * 2) Vercel Cron 및 자동 배치용 Authorization: Bearer <CRON_SECRET>
 */
export async function handlePurge(req: NextRequest) {
  if (!isReservationsLive()) {
    return NextResponse.json({ error: "예약 서버 저장소가 비활성 상태입니다." }, { status: 503 });
  }

  // 1. 인증 확인
  const authHeader = req.headers.get("authorization") || "";
  const cronSecret = process.env.CRON_SECRET;
  const isCronAuthorized =
    Boolean(cronSecret) && authHeader === `Bearer ${cronSecret}`;

  const isAdmin = await verifyAdminRequest(req);

  if (!isCronAuthorized && !isAdmin) {
    return NextResponse.json(
      { error: "개인정보 파기 권한이 없습니다. 관리자 로그인이 필요합니다." },
      { status: 401 }
    );
  }

  // 2. 파기 보관 기준 일수 (기본값: 30일)
  let days = 30;
  try {
    const url = new URL(req.url);
    const qDays = url.searchParams.get("days");
    if (qDays && !isNaN(Number(qDays))) {
      days = Number(qDays);
    } else if (req.method === "POST") {
      const body = await req.json().catch(() => null);
      if (body && typeof body.days === "number") {
        days = body.days;
      }
    }
  } catch {
    // 기본값 유지
  }

  try {
    const purgedCount = await purgeExpiredTourReservationsDb(days);
    return NextResponse.json({
      success: true,
      retentionDays: days,
      purgedCount,
      message: `${days}일이 경과한 예약 ${purgedCount}건의 개인식별정보가 안전하게 익명화(파기)되었습니다.`,
      executedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Failed to purge expired reservations:", error);
    return NextResponse.json(
      { error: "개인정보 파기 배치 실행 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}

/** Vercel Cron 스케줄러는 GET 요청으로 엔드포인트를 호출합니다. */
export async function GET(req: NextRequest) {
  return handlePurge(req);
}

/** 관리자 콘솔 및 외부 스크립트 수동 호출용 POST 핸들러 */
export async function POST(req: NextRequest) {
  return handlePurge(req);
}
