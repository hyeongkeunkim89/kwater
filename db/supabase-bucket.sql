-- Supabase → SQL Editor에서 실행 (또는 Dashboard → Storage에서 water-stories public 버킷 생성)
-- 버킷 ID/이름은 src/lib/supabaseAdmin.ts 의 STORIES_STORAGE_BUCKET 과 일치해야 합니다.

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'water-stories',
  'water-stories',
  true,
  12582912,
  array['image/jpeg', 'image/jpg', 'image/pjpeg', 'image/png', 'image/webp', 'image/gif']::text[]
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

-- 익명 사용자도 갤러리 이미지를 볼 수 있도록 (버킷이 public이어도 정책이 필요할 수 있음)
drop policy if exists "water_stories_select_public" on storage.objects;
create policy "water_stories_select_public"
  on storage.objects for select
  to anon, authenticated
  using (bucket_id = 'water-stories');
