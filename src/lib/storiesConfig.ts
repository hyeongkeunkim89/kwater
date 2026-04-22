/** 서버 전용: 물 이야기가 DB + Blob으로 동작하는지 */
export function isWaterStoriesLive(): boolean {
  return Boolean(
    process.env.DATABASE_URL?.trim() && process.env.BLOB_READ_WRITE_TOKEN?.trim(),
  );
}

/** Vercel 배포인데 DB·Blob 미설정 → 디스크 업로드 불가 */
export function isGalleryUploadBlockedOnVercel(): boolean {
  return Boolean(process.env.VERCEL) && !isWaterStoriesLive();
}
