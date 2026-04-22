export interface WaterStory {
  id: string;
  centerId: string;
  centerName: string;
  imageSrc: string;
  nickname: string;
  caption: string;
  createdAt: string;
  /** DB 연동 시: 이달의 사진으로 지정됨 */
  isPhotoOfMonth?: boolean;
}
