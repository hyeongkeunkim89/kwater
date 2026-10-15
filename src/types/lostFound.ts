export type LostFoundType = "분실" | "습득";
export type LostFoundStatus = "접수" | "보관중" | "수령완료";

export interface LostFoundItem {
  id: string;
  type: LostFoundType;
  centerId: string;
  centerName: string;
  title: string;
  itemName: string;
  date: string; // 분실/습득일
  place: string; // 세부 장소
  content: string;
  writerName: string;
  contact?: string;
  password?: string;
  status: LostFoundStatus;
  createdAt: string;
}
