import { NextRequest, NextResponse } from "next/server";
import { waterCenters } from "@/data/centers";
import { isReservationsLive } from "@/lib/reservationsConfig";
import { getSlotBookedCounts } from "@/lib/reservationsDb";
import { MAX_PER_SLOT, TOUR_SLOTS } from "@/types/reservation";

export const runtime = "nodejs";

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

/** `YYYY-MM-DD`가 실제 달력 날짜인지(잘못된 `::date` 캐스트 방지) */
function isValidCalendarDate(iso: string): boolean {
  if (!DATE_RE.test(iso)) return false;
  const [y, m, d] = iso.split("-").map(Number);
  const dt = new Date(Date.UTC(y, m - 1, d));
  return dt.getUTCFullYear() === y && dt.getUTCMonth() === m - 1 && dt.getUTCDate() === d;
}

function postgresErrMeta(err: unknown): { msg: string; code: string } {
  const msg = err instanceof Error ? err.message : String(err);
  if (!err || typeof err !== "object") return { msg, code: "" };
  const o = err as Record<string, unknown>;
  const code =
    typeof o.code === "string"
      ? o.code
      : typeof o.errno === "string"
        ? o.errno
        : typeof o.errno === "number"
          ? String(o.errno)
          : "";
  return { msg, code };
}

function toFiniteSlotCount(v: unknown): number {
  if (typeof v === "bigint") return Number(v);
  if (typeof v === "number" && Number.isFinite(v)) return v;
  if (typeof v === "string") {
    const n = Number(v);
    return Number.isFinite(n) ? n : 0;
  }
  return 0;
}

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
  if (!isValidCalendarDate(date)) {
    return NextResponse.json({ error: "유효하지 않은 날짜입니다." }, { status: 400 });
  }
  if (!waterCenters.some((c) => c.id === centerId)) {
    return NextResponse.json({ error: "유효하지 않은 문화관입니다." }, { status: 400 });
  }

  try {
    const booked = await getSlotBookedCounts(centerId, date);
    const availability: Record<string, number> = {};
    for (const t of TOUR_SLOTS) {
      const cap = toFiniteSlotCount(booked[t]);
      availability[t] = Math.max(0, MAX_PER_SLOT - cap);
    }
    return NextResponse.json({ availability });
  } catch (e) {
    console.error("reservations availability", e);
    const { msg, code } = postgresErrMeta(e);
    const c = code.toUpperCase();
    const m = msg.toLowerCase();
    if (c === "42P01" || /relation .* does not exist/i.test(msg)) {
      return NextResponse.json(
        {
          error:
            "예약 테이블이 없습니다. 예약 DB에 `db/tour-reservations.sql`을 실행했는지 확인해 주세요.",
          code,
        },
        { status: 500 },
      );
    }
    if (c === "42501" || /permission denied|RLS/i.test(msg)) {
      return NextResponse.json(
        {
          error:
            "DB 권한이 없어 조회할 수 없습니다. RLS를 켠 경우 연결 역할에 SELECT 권한·정책을 확인하거나, Supabase SQL Editor에서 postgres 역할로 접속해 주세요.",
          code,
        },
        { status: 500 },
      );
    }
    if (c === "28P01" || /password authentication failed/i.test(m)) {
      return NextResponse.json(
        {
          error:
            "예약 DB 로그인에 실패했습니다(28P01). URI에 비밀번호를 넣지 말고 `DATABASE_PASSWORD` 또는 `RESERVATIONS_DATABASE_PASSWORD`에 평문만 넣거나, Supabase 복사 문자열에 `[YOUR-PASSWORD]`가 남아 있지 않은지 확인해 주세요. 물 이야기와 같은 Supabase 프로젝트면 `DATABASE_PASSWORD`가 자동으로 쓰입니다.",
          code: c || code,
        },
        { status: 500 },
      );
    }
    if (
      c === "ENOTFOUND" ||
      c === "EAI_AGAIN" ||
      /getaddrinfo|ENOTFOUND|EAI_AGAIN/i.test(msg + code)
    ) {
      return NextResponse.json(
        {
          error:
            "예약 DB 호스트를 찾을 수 없습니다. `RESERVATIONS_DATABASE_URL` 또는 `DATABASE_URL`의 호스트명을 확인해 주세요.",
          code: c || code,
        },
        { status: 500 },
      );
    }
    if (/certificate|ssl|TLS|self-signed|UNABLE_TO_VERIFY/i.test(msg)) {
      return NextResponse.json(
        {
          error:
            "예약 DB 연결(SSL)에 실패했습니다. Supabase URI에 `sslmode=require`가 포함돼 있는지, 회사망에서 DB 접속이 막히지 않았는지 확인해 주세요.",
          code: c || code,
        },
        { status: 500 },
      );
    }
    if (/connect_timeout|ETIMEDOUT|ECONNRESET|socket hang up/i.test(m)) {
      return NextResponse.json(
        {
          error:
            "예약 DB에 연결하지 못했습니다. 잠시 후 다시 시도하거나, Vercel·Supabase 리전과 방화벽(6543/5432)을 확인해 주세요.",
          code: c || code,
        },
        { status: 500 },
      );
    }
    return NextResponse.json(
      {
        error: "잔여 인원 조회에 실패했습니다.",
        code: code || undefined,
        hint:
          process.env.NODE_ENV === "development"
            ? msg.slice(0, 300)
            : "Vercel 로그(Function → reservations/availability)에 원인이 기록됩니다.",
      },
      { status: 500 },
    );
  }
}
