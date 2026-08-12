export interface Feedback {
  id: string;
  centerId: string;
  centerName: string;
  title: string;
  content: string;
  writerType: "실명" | "익명";
  writerName: string;
  password?: string; // 클라이언트에는 전달하지 않거나 검증용으로만 사용
  isPrivate: boolean;
  adminReply?: string;
  adminRepliedAt?: string;
  createdAt: string;
}
