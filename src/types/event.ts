export interface Event {
  id: string;
  centerId: string;
  centerName: string;
  title: string;
  content: string;
  startDate: string;
  endDate: string;
  isHeadquarters: boolean;
  imageUrl?: string;
  createdAt: string;
}
