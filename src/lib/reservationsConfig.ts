/**
 * 예약 Postgres 연결 활성 여부.
 * `RESERVATIONS_DATABASE_URL`이 없으면 물 이야기와 동일한 `DATABASE_URL`을 사용한다.
 */
export function isReservationsLive(): boolean {
  return Boolean(
    process.env.RESERVATIONS_DATABASE_URL?.trim() || process.env.DATABASE_URL?.trim(),
  );
}
