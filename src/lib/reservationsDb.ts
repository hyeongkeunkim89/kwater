import {
  disposeReservationsSqlClient,
  getReservationsSql,
  reservationsSkipRuntimeSchemaDdl,
} from "@/lib/reservationsPostgres";
import type { Reservation, ReservationStatus, VisitPurpose } from "@/types/reservation";
import { MAX_PER_SLOT, TOUR_SLOTS, VISIT_PURPOSES } from "@/types/reservation";

type ReservationsSql = NonNullable<ReturnType<typeof getReservationsSql>>;

const globalForSchema = globalThis as unknown as {
  tourReservationsSchemaPromise: Promise<void> | null | undefined;
};

export async function disposeReservationsSqlForRetry(): Promise<void> {
  globalForSchema.tourReservationsSchemaPromise = undefined;
  await disposeReservationsSqlClient();
}

function isTransientConnectionFailure(err: unknown): boolean {
  const code =
    err && typeof err === "object" && "code" in err
      ? String((err as { code?: string }).code ?? "").toUpperCase()
      : "";
  const msg = (err instanceof Error ? err.message : String(err)).toUpperCase();
  return (
    code === "ETIMEDOUT" ||
    code === "ECONNRESET" ||
    code === "EPIPE" ||
    code === "ENOTFOUND" ||
    /ETIMEDOUT|ECONNRESET|EPIPE|ENOTFOUND|SOCKET HANG UP|CONNECT_TIMEOUT|UND_ERR_CONNECT_TIMEOUT/i.test(
      msg + code,
    )
  );
}

/** DB·드라이버가 bigint 등으로 줄 때도 안전하게 합산용 숫자로 */
function toFiniteCount(v: unknown): number {
  if (typeof v === "bigint") return Number(v);
  if (typeof v === "number" && Number.isFinite(v)) return v;
  if (typeof v === "string") {
    const n = Number(v);
    return Number.isFinite(n) ? n : 0;
  }
  return 0;
}

type TourReservationRow = {
  id: string;
  center_id: string;
  center_name: string;
  visit_date: Date | string;
  visit_time: string;
  name: string;
  phone: string;
  party_size: number;
  purpose: string;
  requests: string;
  status: string;
  created_at: Date | string;
};

function formatVisitDate(d: TourReservationRow["visit_date"]): string {
  if (typeof d === "string" && /^\d{4}-\d{2}-\d{2}/.test(d)) return d.slice(0, 10);
  if (d instanceof Date) return d.toISOString().slice(0, 10);
  return String(d).slice(0, 10);
}

function rowToReservation(r: TourReservationRow): Reservation {
  const created =
    r.created_at instanceof Date ? r.created_at.toISOString() : String(r.created_at);
  return {
    id: r.id,
    centerId: r.center_id,
    centerName: r.center_name,
    date: formatVisitDate(r.visit_date),
    time: slotKeyFromDbVisitTime(r.visit_time),
    name: r.name,
    phone: r.phone,
    partySize: Number(r.party_size),
    purpose: r.purpose as VisitPurpose,
    requests: r.requests ?? "",
    status: r.status as ReservationStatus,
    createdAt: created,
  };
}

function advisoryPair(slotKey: string): [number, number] {
  let h1 = 5381;
  let h2 = 52711;
  for (let i = 0; i < slotKey.length; i++) {
    const c = slotKey.charCodeAt(i);
    h1 = (h1 * 33 + c) | 0;
    h2 = (h2 * 31 + c) >>> 0;
  }
  return [h1 | 0, h2 | 0];
}

function ensureTourReservationsSchema(sql: ReservationsSql) {
  if (!globalForSchema.tourReservationsSchemaPromise) {
    if (reservationsSkipRuntimeSchemaDdl()) {
      globalForSchema.tourReservationsSchemaPromise = Promise.resolve();
    } else {
      globalForSchema.tourReservationsSchemaPromise = (async () => {
        await sql`
          CREATE TABLE IF NOT EXISTS tour_reservations (
            id text PRIMARY KEY,
            center_id text NOT NULL,
            center_name text NOT NULL,
            visit_date date NOT NULL,
            visit_time text NOT NULL,
            name text NOT NULL,
            phone text NOT NULL,
            party_size integer NOT NULL CHECK (party_size >= 1 AND party_size <= 100),
            purpose text NOT NULL,
            requests text NOT NULL DEFAULT '',
            status text NOT NULL DEFAULT '대기' CHECK (status IN ('대기', '확정', '취소')),
            created_at timestamptz NOT NULL DEFAULT now(),
            CONSTRAINT tour_reservations_purpose_chk CHECK (
              purpose IN ('개인·가족 관람', '단체·기관 방문', '교육 프로그램', '기타')
            )
          )
        `;
        await sql`
          CREATE INDEX IF NOT EXISTS tour_reservations_slot_idx
          ON tour_reservations (center_id, visit_date, visit_time)
        `;
        await sql`
          CREATE INDEX IF NOT EXISTS tour_reservations_created_idx
          ON tour_reservations (created_at DESC)
        `;
      })();
    }
  }
  return globalForSchema.tourReservationsSchemaPromise;
}

export async function listTourReservationsFromDb(): Promise<Reservation[]> {
  const sql = getReservationsSql();
  if (!sql) return [];
  await ensureTourReservationsSchema(sql);
  const rows = await sql<TourReservationRow[]>`
    SELECT id, center_id, center_name, visit_date, visit_time, name, phone, party_size, purpose, requests, status, created_at
    FROM tour_reservations
    ORDER BY created_at DESC
  `;
  return rows.map(rowToReservation);
}

/** 슬롯 키를 `10:00` 형태로 맞춤 — DB에 `10:00:00` 등으로 들어간 행도 같은 슬롯으로 집계 */
function slotKeyFromDbVisitTime(raw: string): string {
  return String(raw ?? "").trim().slice(0, 5);
}

async function getSlotBookedCountsOnce(
  centerId: string,
  visitDate: string,
): Promise<Record<string, number>> {
  const sql = getReservationsSql();
  const empty: Record<string, number> = Object.fromEntries(TOUR_SLOTS.map((t) => [t, 0]));
  if (!sql) return empty;
  await ensureTourReservationsSchema(sql);
  const rows = await sql<{ visit_time: string; total: string | number | bigint }[]>`
    SELECT
      left(btrim(visit_time::text), 5) AS visit_time,
      COALESCE(SUM(party_size), 0)::text AS total
    FROM tour_reservations
    WHERE center_id = ${centerId}
      AND visit_date = ${visitDate}::date
      AND status <> '취소'
    GROUP BY 1
  `;
  const out = { ...empty };
  for (const r of rows) {
    const key = slotKeyFromDbVisitTime(r.visit_time);
    if (key in out) out[key] = toFiniteCount(r.total);
  }
  return out;
}

export async function getSlotBookedCounts(
  centerId: string,
  visitDate: string,
): Promise<Record<string, number>> {
  let lastErr: unknown;
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      return await getSlotBookedCountsOnce(centerId, visitDate);
    } catch (e) {
      lastErr = e;
      if (attempt < 2 && isTransientConnectionFailure(e)) {
        console.warn("getSlotBookedCounts: 연결 실패, 재시도", attempt + 1, e);
        await disposeReservationsSqlForRetry();
        await new Promise((r) => setTimeout(r, 500 * (attempt + 1)));
        continue;
      }
      throw e;
    }
  }
  throw lastErr;
}

export class TourReservationSlotFullError extends Error {
  constructor() {
    super("SLOT_FULL");
    this.name = "TourReservationSlotFullError";
  }
}

export async function insertTourReservationDb(
  input: Omit<Reservation, "id" | "createdAt" | "status">,
): Promise<Reservation> {
  const sql = getReservationsSql();
  if (!sql) throw new Error("DB_NOT_CONFIGURED");
  if (!VISIT_PURPOSES.includes(input.purpose)) throw new Error("INVALID_PURPOSE");
  await ensureTourReservationsSchema(sql);

  const id = `KWM-${Date.now()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;
  const [k1, k2] = advisoryPair(`${input.centerId}|${input.date}|${input.time}`);

  return await sql.begin(async (tx) => {
    await tx`SELECT pg_advisory_xact_lock(${k1}::int, ${k2}::int)`;
    const sumRows = await tx<{ s: string }[]>`
      SELECT COALESCE(SUM(party_size), 0)::text AS s
      FROM tour_reservations
      WHERE center_id = ${input.centerId}
        AND visit_date = ${input.date}::date
        AND left(btrim(visit_time::text), 5) = left(btrim(${input.time}), 5)
        AND status <> '취소'
    `;
    const booked = Number(sumRows[0]?.s ?? 0);
    if (booked + input.partySize > MAX_PER_SLOT) {
      throw new TourReservationSlotFullError();
    }

    const inserted = await tx<TourReservationRow[]>`
      INSERT INTO tour_reservations (
        id, center_id, center_name, visit_date, visit_time, name, phone, party_size, purpose, requests, status
      ) VALUES (
        ${id},
        ${input.centerId},
        ${input.centerName},
        ${input.date}::date,
        ${input.time},
        ${input.name},
        ${input.phone},
        ${input.partySize},
        ${input.purpose},
        ${input.requests},
        '대기'
      )
      RETURNING id, center_id, center_name, visit_date, visit_time, name, phone, party_size, purpose, requests, status, created_at
    `;
    const row = inserted[0];
    if (!row) throw new Error("INSERT_FAILED");
    return rowToReservation(row);
  });
}

export async function updateTourReservationStatusDb(
  id: string,
  status: ReservationStatus,
): Promise<boolean> {
  const sql = getReservationsSql();
  if (!sql) return false;
  await ensureTourReservationsSchema(sql);
  const rows = await sql<{ id: string }[]>`
    UPDATE tour_reservations SET status = ${status} WHERE id = ${id}
    RETURNING id
  `;
  return rows.length > 0;
}

export async function deleteTourReservationDb(id: string): Promise<boolean> {
  const sql = getReservationsSql();
  if (!sql) return false;
  await ensureTourReservationsSchema(sql);
  const rows = await sql<{ id: string }[]>`
    DELETE FROM tour_reservations WHERE id = ${id}
    RETURNING id
  `;
  return rows.length > 0;
}
