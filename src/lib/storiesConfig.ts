/** 서버 전용: 물 이야기가 Supabase(DB + Storage)로 동작하는지 */
export function isWaterStoriesLive(): boolean {
  return Boolean(
    process.env.DATABASE_URL?.trim() &&
      process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() &&
      process.env.SUPABASE_SERVICE_ROLE_KEY?.trim(),
  );
}

/** Vercel 배포인데 Supabase 미설정 → 디스크 업로드 불가 */
export function isGalleryUploadBlockedOnVercel(): boolean {
  return Boolean(process.env.VERCEL) && !isWaterStoriesLive();
}
