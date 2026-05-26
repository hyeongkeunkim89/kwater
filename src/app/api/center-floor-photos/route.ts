import { NextRequest, NextResponse } from "next/server";
import { waterCenters } from "@/data/centers";
import {
  deleteCenterFloorPhotoDbById,
  insertCenterFloorPhotoDb,
  listCenterFloorPhotosFromDb,
} from "@/lib/centerFloorPhotosDb";
import { isWaterStoriesLive } from "@/lib/storiesConfig";
import {
  removeCenterFloorPhotoFromStorage,
  uploadCenterFloorPhotoToStorage,
} from "@/lib/supabaseAdmin";

export const runtime = "nodejs";
export const maxDuration = 60;

const CANONICAL_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"] as const;
const MAX_SIZE = 20 * 1024 * 1024;
const FLOOR_KEY_RE = /^floor-[0-9]+$/;

function safeSegment(s: string) {
  return s.replace(/[^a-zA-Z0-9_-]/g, "");
}

function resolveImageContentType(file: File): string | null {
  const raw = (file.type ?? "").trim().toLowerCase();
  if (raw === "image/jpg" || raw === "image/pjpeg") return "image/jpeg";
  if (CANONICAL_IMAGE_TYPES.includes(raw as (typeof CANONICAL_IMAGE_TYPES)[number])) return raw;

  const ext = (file.name.split(".").pop() ?? "").toLowerCase();
  const byExt: Record<string, string> = {
    jpg: "image/jpeg",
    jpeg: "image/jpeg",
    png: "image/png",
    webp: "image/webp",
    gif: "image/gif",
  };
  if (ext && byExt[ext]) return byExt[ext];
  return null;
}

/** 목록: DATABASE_URL만 있으면 조회(공개 URL은 Storage이지만 DB에 저장된 URL로 충분) */
export async function GET(req: NextRequest) {
  const centerId = (req.nextUrl.searchParams.get("centerId") ?? "").trim();
  const floorKey = (req.nextUrl.searchParams.get("floorKey") ?? "").trim();
  if (!centerId || !floorKey) {
    return NextResponse.json([]);
  }
  const safeCenter = safeSegment(centerId);
  const safeFloor = safeSegment(floorKey);
  if (!safeCenter || !safeFloor || !FLOOR_KEY_RE.test(safeFloor)) {
    return NextResponse.json([]);
  }
  if (!waterCenters.some((c) => c.id === safeCenter)) {
    return NextResponse.json([]);
  }

  try {
    const list = await listCenterFloorPhotosFromDb(safeCenter, safeFloor);
    return NextResponse.json(list);
  } catch (e) {
    console.error("center-floor-photos GET", e);
    return NextResponse.json([]);
  }
}

export async function POST(req: NextRequest) {
  if (!isWaterStoriesLive()) {
    return NextResponse.json(
      { error: "Supabase(DB·Storage)가 구성되지 않았습니다. Vercel 환경 변수를 확인해 주세요." },
      { status: 503 },
    );
  }

  try {
    const data = await req.formData();
    const file = data.get("file") as File | null;
    const centerIdRaw = (data.get("centerId") as string | null)?.trim() ?? "";
    const floorKeyRaw = (data.get("floorKey") as string | null)?.trim() ?? "";

    if (!file || !centerIdRaw || !floorKeyRaw) {
      return NextResponse.json({ error: "파일·문화관·층 정보가 필요합니다." }, { status: 400 });
    }

    const safeCenter = safeSegment(centerIdRaw);
    const safeFloor = safeSegment(floorKeyRaw);
    if (!safeCenter || !safeFloor || !FLOOR_KEY_RE.test(safeFloor)) {
      return NextResponse.json({ error: "유효하지 않은 문화관 또는 층입니다." }, { status: 400 });
    }
    if (!waterCenters.some((c) => c.id === safeCenter)) {
      return NextResponse.json({ error: "알 수 없는 문화관입니다." }, { status: 400 });
    }

    const contentType = resolveImageContentType(file);
    if (!contentType) {
      return NextResponse.json({ error: "JPG/PNG/WebP/GIF만 허용됩니다." }, { status: 400 });
    }
    if (file.size > MAX_SIZE) {
      return NextResponse.json({ error: "파일은 20 MB 이하여야 합니다." }, { status: 400 });
    }

    const ext = (file.name.split(".").pop() ?? "jpg").toLowerCase();
    const safeExt = ["jpg", "jpeg", "png", "webp", "gif"].includes(ext) ? ext : "jpg";
    const objectPath = `${safeCenter}/${safeFloor}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${safeExt}`;

    const bytes = await file.arrayBuffer();
    const uploaded = await uploadCenterFloorPhotoToStorage(objectPath, bytes, contentType);
    if ("error" in uploaded) {
      return NextResponse.json({ error: uploaded.error }, { status: 500 });
    }

    try {
      const row = await insertCenterFloorPhotoDb({
        centerId: safeCenter,
        floorKey: safeFloor,
        storagePath: objectPath,
        imageUrl: uploaded.publicUrl,
      });
      return NextResponse.json(row, { status: 201 });
    } catch (dbErr) {
      console.error("insertCenterFloorPhotoDb:", dbErr);
      await removeCenterFloorPhotoFromStorage(uploaded.publicUrl);
      const msg = dbErr instanceof Error ? dbErr.message : String(dbErr);
      if (/42P01|does not exist/i.test(msg)) {
        return NextResponse.json(
          {
            error:
              "층별 사진 테이블이 없습니다. Supabase SQL Editor에서 `db/center-floor-photos.sql`을 실행했는지 확인해 주세요.",
          },
          { status: 500 },
        );
      }
      return NextResponse.json({ error: "DB 저장에 실패했습니다." }, { status: 500 });
    }
  } catch (e) {
    console.error("center-floor-photos POST", e);
    const clip =
      e instanceof Error ? e.message.replace(/\s+/g, " ").trim().slice(0, 120) : "";
    return NextResponse.json(
      {
        error: clip
          ? `등록 처리 중 오류: ${clip}`
          : "등록 처리 중 오류가 났습니다. 서버 로그를 확인하거나 DATABASE_URL·Storage 버킷(center-floor-photos)을 확인해 주세요.",
      },
      { status: 500 },
    );
  }
}

export async function DELETE(req: NextRequest) {
  if (!isWaterStoriesLive()) {
    return NextResponse.json(
      { error: "Supabase(DB·Storage)가 구성되지 않았습니다." },
      { status: 503 },
    );
  }

  const id = (req.nextUrl.searchParams.get("id") ?? "").trim();
  if (!/^[0-9a-f-]{36}$/i.test(id)) {
    return NextResponse.json({ error: "유효하지 않은 id입니다." }, { status: 400 });
  }

  try {
    const imageUrl = await deleteCenterFloorPhotoDbById(id);
    if (!imageUrl) {
      return NextResponse.json({ error: "해당 사진을 찾을 수 없습니다." }, { status: 404 });
    }
    await removeCenterFloorPhotoFromStorage(imageUrl);
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("center-floor-photos DELETE", e);
    return NextResponse.json({ error: "삭제 처리 중 오류가 났습니다." }, { status: 500 });
  }
}
