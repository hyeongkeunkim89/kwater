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

/** Supabase 직접 연결·풀러 등 동일 프로젝트면 `DATABASE_PASSWORD`로 예약 DB 비밀번호를 보완 */
function supabaseProjectRefFromUrl(urlStr: string): string | null {
  try {
    const u = new URL(urlStr);
    const host = u.hostname.toLowerCase();
    const dbHost = host.match(/^db\.([a-z0-9]+)\.supabase\.co$/);
    if (dbHost) return dbHost[1];
    const user = decodeURIComponent(u.username || "");
    const poolUser = user.match(/^postgres\.([a-z0-9]+)$/i);
    if (poolUser) return poolUser[1];
    return null;
  } catch {
    return null;
  }
}

function sameSupabaseProjectAsMain(resUrl: string, mainUrl: string): boolean {
  const rr = supabaseProjectRefFromUrl(resUrl);
  const mr = supabaseProjectRefFromUrl(mainUrl);
  if (rr && mr) return rr === mr;
  try {
    const a = new URL(resUrl);
    const b = new URL(mainUrl);
    const portA = a.port || (a.protocol === "postgresql:" || a.protocol === "postgres:" ? "5432" : "");
    const portB = b.port || (b.protocol === "postgresql:" || b.protocol === "postgres:" ? "5432" : "");
    return (
      a.hostname.toLowerCase() === b.hostname.toLowerCase() &&
      portA === portB &&
      a.pathname.replace(/\/+$/, "") === b.pathname.replace(/\/+$/, "")
    );
  } catch {
    return false;
  }
}

/** URI 문자열에 남은 Supabase 플레이스홀더 제거(평문 비밀번호 병합 전) */
function stripBrokenPasswordInUri(raw: string): string {
  if (!/YOUR-?PASSWORD|YOUR_PASSWORD|\[YOUR/i.test(raw)) return raw;
  try {
    const u = new URL(raw);
    u.password = "";
    return u.href;
  } catch {
    return raw;
  }
}

/**
 * 우선 `RESERVATIONS_DATABASE_URL`, 없으면 `DATABASE_URL`(물 이야기와 동일 DB·`tour_reservations` 공유).
 * 같은 Supabase 프로젝트이면 `RESERVATIONS_DATABASE_PASSWORD`가 비어 있을 때 `DATABASE_PASSWORD`를 자동 사용(28P01 완화).
 */
function getResolvedReservationsDatabaseUrl(): string | null {
  const rawRes = normalizeDatabaseUrlEnv(process.env.RESERVATIONS_DATABASE_URL);
  const rawMain = normalizeDatabaseUrlEnv(process.env.DATABASE_URL);
  const rawChosen = rawRes || rawMain;
  if (!rawChosen) return null;

  let base = stripBrokenPasswordInUri(rawChosen);
  const mainStripped = rawMain ? stripBrokenPasswordInUri(rawMain) : "";

  const resPwd = process.env.RESERVATIONS_DATABASE_PASSWORD?.trim() ?? "";
  const mainPwd = process.env.DATABASE_PASSWORD?.trim() ?? "";
  const useMainPwdFallback =
    !resPwd &&
    Boolean(mainPwd) &&
    Boolean(rawMain) &&
    (!rawRes || rawRes === rawMain || sameSupabaseProjectAsMain(base, mainStripped));

  const plain = resPwd || (useMainPwdFallback ? mainPwd : "");
  if (!plain) return base;

  try {
    const u = new URL(base);
    if (/YOUR|PLACEHOLDER|\[.*\]/i.test(u.password)) u.password = "";
    u.password = plain;
    return u.href;
  } catch {
    console.error("RESERVATIONS_DATABASE_URL + 비밀번호 병합 실패(Invalid URL)");
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
