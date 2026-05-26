-- Supabase → SQL Editor에서 실행 (Dashboard → Storage에서 동일 이름 public 버킷을 만들어도 됨)
-- 버킷 ID는 src/lib/supabaseAdmin.ts 의 CENTER_FLOOR_STORAGE_BUCKET 과 일치해야 합니다.

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'center-floor-photos',
  'center-floor-photos',
  true,
  20971520,
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
