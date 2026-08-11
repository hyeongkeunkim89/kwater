-- =============================================================================
-- Supabase Storage: 물 이야기 이미지 버킷 `water-stories`
-- =============================================================================
-- 실행: Supabase → SQL Editor (또는 Dashboard → Storage에서 동일 이름 public 버킷 생성)
-- 버킷 ID/이름은 src/lib/supabaseAdmin.ts 의 STORIES_STORAGE_BUCKET 과 일치해야 함
-- 문화관 층별 사진 버킷은 db/supabase-center-floor-bucket.sql 별도 실행
-- =============================================================================

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'water-stories',
  'water-stories',
  true,
  12582912,  -- 12 MiB (12 * 1024 * 1024)
  array['image/jpeg', 'image/jpg', 'image/pjpeg', 'image/png', 'image/webp', 'image/gif']::text[]
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

-- public 버킷이어도 SELECT 정책이 없으면 anon 갤러리 조회가 막힐 수 있음
drop policy if exists "water_stories_select_public" on storage.objects;
create policy "water_stories_select_public"
  on storage.objects for select
  to anon, authenticated
  using (bucket_id = 'water-stories');
-- 업로드·삭제는 service_role 키(서버)로만 수행 — 별도 INSERT/DELETE 정책 불필요
