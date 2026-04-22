/**
 * 배포 시 월별로 교체할 수 있는 「이달의 사진」고정 스포트라이트입니다.
 * null이면 방문자 화면에서는 브라우저에 저장된 선정 작(관리 화면) 또는 안내 문구만 표시합니다.
 */
export type EditorialPhotoOfMonth = {
  monthLabel: string;
  title: string;
  imageSrc: string;
  caption: string;
  facilityName: string;
  photographerCredit?: string;
};

export const editorialPhotoOfMonth: EditorialPhotoOfMonth | null = null;
