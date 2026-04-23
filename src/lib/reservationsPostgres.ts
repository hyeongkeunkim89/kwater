import postgres from "postgres";

const globalForSql = globalThis as unknown as {
  reservationsSql: ReturnType<typeof postgres> | undefined;
};

/** Vercel에 따옴표·BOM·앞뒤 공백이 섞이면 `Invalid URL`이 날 수 있음 */
function normalizeDatabaseUrlEnv(raw: string | undefined): string {
  if (!raw) return "";
  let u = raw.trim();
  if (u.charCodeAt(0) === 0xfeff) u = u.slice(1).trim();
  if (u.length >= 2) {
    const q = u[0];
    if ((q === '"' || q === "'") && u[u.length - 1] === q) {
      u = u.slice(1, -1).trim();
    }
  }
  return u.replace(/\r\n/g, "").replace(/\n/g, "");
}

/**
 * 물 이야기(`DATABASE_URL`)와 별도. 예약만 `RESERVATIONS_DATABASE_URL`(+선택 `RESERVATIONS_DATABASE_PASSWORD`) 사용.
 */
function getResolvedReservationsDatabaseUrl(): string | null {
  const base = normalizeDatabaseUrlEnv(process.env.RESERVATIONS_DATABASE_URL);
  if (!base) return null;
  const plain = process.env.RESERVATIONS_DATABASE_PASSWORD?.trim();
  if (!plain) return base;
  try {
    const u = new URL(base);
    u.password = plain;
    return u.href;
  } catch {
    console.error("RESERVATIONS_DATABASE_URL + RESERVATIONS_DATABASE_PASSWORD 병합 실패(Invalid URL)");
    return base;
  }
}

function ensureSupabaseSslQuery(raw: string): string {
  const u = raw.trim();
  if (!/supabase\.co|pooler\.supabase\.com/i.test(u)) return u;
  if (/[?&]sslmode=/i.test(u)) return u;
  return u.includes("?") ? `${u}&sslmode=require` : `${u}?sslmode=require`;
}

function supabasePoolerDatabaseUrl(raw: string): string {
  const u = raw.trim();
  if (!/pooler\.supabase\.com/i.test(u)) return u;
  if (/[?&]pgbouncer=true/i.test(u)) return u;
  return u.includes("?") ? `${u}&pgbouncer=true` : `${u}?pgbouncer=true`;
}

/** Transaction pooler(6543)에서는 DDL이 막히는 경우가 많음 */
export function reservationsSkipRuntimeSchemaDdl(): boolean {
  const u = getResolvedReservationsDatabaseUrl() ?? "";
  return /pooler\.supabase\.com:6543/i.test(u);
}

export function getReservationsSql(): ReturnType<typeof postgres> | null {
  const url = getResolvedReservationsDatabaseUrl();
  if (!url) return null;
  if (!globalForSql.reservationsSql) {
    const resolved = supabasePoolerDatabaseUrl(ensureSupabaseSslQuery(url));
    globalForSql.reservationsSql = postgres(resolved, {
      max: 1,
      prepare: false,
      connect_timeout: 90,
      idle_timeout: 60,
      keep_alive: 30,
    });
  }
  return globalForSql.reservationsSql;
}

/** 연결 재시도 전에 풀을 비울 때 사용 */
export async function disposeReservationsSqlClient(): Promise<void> {
  const c = globalForSql.reservationsSql;
  globalForSql.reservationsSql = undefined;
  if (c) {
    try {
      await c.end({ timeout: 5 });
    } catch {
      /* 연결 끊김 시 무시 */
    }
  }
}
