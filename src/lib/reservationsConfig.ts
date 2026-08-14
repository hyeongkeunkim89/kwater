/**
 * 예약 Postgres DB 연결 활성 여부.
 * `RESERVATIONS_DATABASE_URL`, `DATABASE_URL`, `POSTGRES_URL`, `SUPABASE_URL` 중 하나라도 존재하면 활성화.
 */
export function isReservationsLive(): boolean {
  return Boolean(
    process.env.RESERVATIONS_DATABASE_URL?.trim() ||
      process.env.DATABASE_URL?.trim() ||
      process.env.POSTGRES_URL?.trim() ||
      process.env.SUPABASE_URL?.trim() ||
      process.env.NEXT_PUBLIC_SUPABASE_URL?.trim()
  );
}
