import type { Reservation, ReservationStatus } from "@/types/reservation";
import { MAX_PER_SLOT } from "@/types/reservation";

const STORAGE_KEY = "kwm_reservations";

function loadAll(): Reservation[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]");
  } catch {
    return [];
  }
}

function saveAll(list: Reservation[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
}

export function getAllReservations(): Reservation[] {
  return loadAll();
}

export function addReservation(r: Omit<Reservation, "id" | "createdAt" | "status">): Reservation {
  const list = loadAll();
  const newR: Reservation = {
    ...r,
    id: `KWM-${Date.now()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`,
    status: "대기",
    createdAt: new Date().toISOString(),
  };
  saveAll([newR, ...list]);
  return newR;
}

export function updateStatus(id: string, status: ReservationStatus) {
  const list = loadAll();
  const updated = list.map((r) => (r.id === id ? { ...r, status } : r));
  saveAll(updated);
}

export function deleteReservation(id: string) {
  saveAll(loadAll().filter((r) => r.id !== id));
}

/** 특정 날짜·시간·센터의 현재 예약 인원 합계 */
export function getBookedCount(centerId: string, date: string, time: string): number {
  return loadAll()
    .filter(
      (r) =>
        r.centerId === centerId &&
        r.date === date &&
        r.time === time &&
        r.status !== "취소",
    )
    .reduce((sum, r) => sum + r.partySize, 0);
}

/** 슬롯 잔여 인원 */
export function getAvailableCount(centerId: string, date: string, time: string): number {
  return MAX_PER_SLOT - getBookedCount(centerId, date, time);
}
