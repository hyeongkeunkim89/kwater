export type ReservationStatus = "대기" | "확정" | "취소";

export type VisitPurpose =
  | "개인·가족 관람"
  | "단체·기관 방문"
  | "교육 프로그램"
  | "기타";

export interface Reservation {
  id: string;
  centerId: string;
  centerName: string;
  date: string;       // YYYY-MM-DD
  time: string;       // HH:MM
  name: string;
  phone: string;
  partySize: number;
  purpose: VisitPurpose;
  requests: string;
  status: ReservationStatus;
  createdAt: string;  // ISO string
}

export const TOUR_SLOTS = [
  "10:00",
  "11:00",
  "13:00",
  "14:00",
  "15:00",
  "16:00",
] as const;

export const MAX_PER_SLOT = 20;

export const VISIT_PURPOSES: VisitPurpose[] = [
  "개인·가족 관람",
  "단체·기관 방문",
  "교육 프로그램",
  "기타",
];
