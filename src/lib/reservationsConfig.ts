/** 가이드 투어 예약 전용 Postgres(`RESERVATIONS_DATABASE_URL`) 활성 여부 — 물 이야기 DB와 분리 */
export function isReservationsLive(): boolean {
  return Boolean(process.env.RESERVATIONS_DATABASE_URL?.trim());
}
