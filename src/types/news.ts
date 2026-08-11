export interface News {
  id: string;
  centerId: string;
  centerName: string;
  title: string;
  content: string;
  views: number;
  isPinned: boolean;
  imageUrl?: string;
  createdAt: string;
}
