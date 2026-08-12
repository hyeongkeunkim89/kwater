-- =============================================================================
-- Supabase Storage: 문화관 층별 시설 사진 버킷 `center-floor-photos`
-- =============================================================================
-- 실행: Supabase → SQL Editor (Dashboard → Storage에서 동일 이름 public 버킷 생성 가능)
-- 버킷 ID는 src/lib/supabaseAdmin.ts 의 CENTER_FLOOR_STORAGE_BUCKET 과 일치해야 함
-- 메타데이터 테이블: db/center-floor-photos.sql
-- =============================================================================

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'center-floor-photos',
  'center-floor-photos',
  true,
  20971520,  -- 20 MiB (20 * 1024 * 1024)
  array['image/jpeg', 'image/jpg', 'image/pjpeg', 'image/png', 'image/webp', 'image/gif']::text[]
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "center_floor_photos_select_public" on storage.objects;
create policy "center_floor_photos_select_public"
  on storage.objects for select
  to anon, authenticated
  using (bucket_id = 'center-floor-photos');
