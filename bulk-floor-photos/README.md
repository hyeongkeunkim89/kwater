# 층별 사진 일괄 등록

엑셀(CSV) + 이미지 폴더로 Supabase Storage·`center_floor_photos` 테이블에 한 번에 반영합니다.

## 1. 폴더 구조

```text
bulk-floor-photos/
  manifest.csv          ← 작업용 (example 복사 후 작성)
  manifest.example.csv
  centers-reference.csv ← 문화관 id 목록
  images/
    {center_id}/
      {floor_key}/
        사진파일.jpg
```

**floor_key**는 문화관 상세 페이지와 같습니다.

- 목록 첫 번째 층 → `floor-0`
- 두 번째 층 → `floor-1`
- …

## 2. manifest.csv 작성

| 컬럼 | 필수 | 설명 |
|------|------|------|
| center_id | ✅ | `hangang-yeoju` 등 (centers-reference.csv 참고) |
| floor_key | ✅ | `floor-0`, `floor-1` … |
| filename | ✅ | images 아래 파일명과 **정확히 동일** |
| sort_order | | 같은 층 안 표시 순서 (비우면 자동) |
| note | | 메모용 (DB에 저장되지 않음) |

엑셀에서 편집 후 **CSV UTF-8**로 저장하세요.  
(`manifest.example.csv`를 복사해 `manifest.csv`로 이름 변경)

## 3. 이미지 넣기

예: 한강문화관 1층 사진 2장

```text
images/hangang-yeoju/floor-0/01-lobby.jpg
images/hangang-yeoju/floor-0/02-exhibit.jpg
```

manifest:

```csv
center_id,floor_key,filename,sort_order,note
hangang-yeoju,floor-0,01-lobby.jpg,1,로비
hangang-yeoju,floor-0,02-exhibit.jpg,2,전시
```

## 4. 환경 변수

프로젝트 루트 `.env.local` (물 이야기와 동일):

- `DATABASE_URL` (+ 필요 시 `DATABASE_PASSWORD`)
- `NEXT_PUBLIC_SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`

Supabase SQL은 이미 실행된 상태(`db/center-floor-photos.sql`, `db/supabase-center-floor-bucket.sql`)를 가정합니다.

## 5. 실행 (프로젝트 루트에서)

```bash
# 문화관 id 목록
npm run import:floor-photos:list

# 검증만 (업로드·DB 없음)
npm run import:floor-photos:dry

# 실제 반영
npm run import:floor-photos

# 이미 등록된 storage_path 덮어쓰기
npm run import:floor-photos:force
```

성공·실패·스킵 내역은 `bulk-floor-photos/import-result-YYYY-MM-DD.csv`에 저장됩니다.

## 6. 주의

- `images/` 안 실제 사진은 git에 올리지 않습니다 (용량).
- 같은 경로(`center_id/floor_key/파일명`)가 DB에 있으면 기본 **스킵** (`--force`로 덮어쓰기).
- 웹 UI(문화관 상세)로 올린 사진과 **같은 DB·Storage**를 씁니다.
