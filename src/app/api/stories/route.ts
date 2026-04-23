import { NextRequest, NextResponse } from "next/server";
import { waterCenters } from "@/data/centers";
import { isWaterStoriesLive } from "@/lib/storiesConfig";
import { uploadStoryImageToStorage } from "@/lib/supabaseAdmin";
import {
  insertWaterStoryDb,
  listWaterStoriesFromDb,
} from "@/lib/waterStoriesDb";

const CANONICAL_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"] as const;

/** 브라우저/OS별로 image/jpg, 빈 type 등이 올 수 있어 Storage에 넣기 전에 표준 MIME으로 맞춤 */
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
const MAX_SIZE = 12 * 1024 * 1024;
const NICK_MAX = 24;
const CAPTION_MAX = 280;
const CAPTION_MIN = 8;

function safeSegment(s: string) {
  return s.replace(/[^a-zA-Z0-9_-]/g, "");
}

/** INSERT 단계 예외 → 사용자 안내 (이미지는 이미 Storage에 있을 수 있음) */
function insertStoryDbUserMessage(err: unknown): string {
  const msg = err instanceof Error ? err.message : String(err);
  const m = msg.toLowerCase();
  if (/econnrefused|etimedout|getaddrinfo|connect/.test(m)) {
    return "글 저장에 실패했습니다. DATABASE_URL 호스트·포트·비밀번호를 확인해 주세요.";
  }
  if (/ssl|certificate|tls/.test(m)) {
    return "글 저장에 실패했습니다. DB 연결 문자열에 sslmode=require 등 SSL 옵션이 맞는지 확인해 주세요.";
  }
  if (/prepared statement|26000|42p01|syntax error.*prepare|pgbouncer/.test(m)) {
    return "글 저장에 실패했습니다. Supabase **Transaction pooler** URI를 쓰는 경우, 문자열 끝에 `?pgbouncer=true`(없다면)를 붙여 주세요.";
  }
  if (/permission denied|42501/.test(m)) {
    return "글 저장에 실패했습니다. DB 사용자에게 `water_stories` 테이블 쓰기 권한이 있는지 확인해 주세요.";
  }
  return "사진은 Storage에 올라갔을 수 있으나, 글(DB) 저장에 실패했습니다. DATABASE_URL·Supabase Database를 확인해 주세요.";
}

export async function GET(req: NextRequest) {
  if (!isWaterStoriesLive()) {
    return NextResponse.json([]);
  }
  const raw = req.nextUrl.searchParams.get("centerId");
  const centerId =
    raw && /^[a-zA-Z0-9_-]+$/.test(raw) ? raw : undefined;
  try {
    const list = await listWaterStoriesFromDb(centerId);
    return NextResponse.json(list);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "목록을 불러오지 못했습니다." }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  if (!isWaterStoriesLive()) {
    return NextResponse.json(
      { error: "지금은 사진을 등록할 수 없습니다. 잠시 후 다시 시도하거나 관리자에게 문의해 주세요." },
      { status: 503 },
    );
  }

  try {
    const data = await req.formData();
    const file = data.get("file") as File | null;
    const centerIdRaw = (data.get("centerId") as string | null)?.trim() ?? "";
    const nickname = (data.get("nickname") as string | null)?.trim() ?? "";
    const caption = (data.get("caption") as string | null)?.trim() ?? "";

    if (!file || !centerIdRaw) {
      return NextResponse.json({ error: "파일과 문화관 선택이 필요합니다." }, { status: 400 });
    }
    const contentType = resolveImageContentType(file);
    if (!contentType) {
      return NextResponse.json({ error: "JPG/PNG/WebP/GIF만 허용됩니다." }, { status: 400 });
    }
    if (file.size > MAX_SIZE) {
      return NextResponse.json({ error: "파일은 12 MB 이하여야 합니다." }, { status: 400 });
    }

    const safeId = safeSegment(centerIdRaw);
    if (!safeId) {
      return NextResponse.json({ error: "유효하지 않은 문화관입니다." }, { status: 400 });
    }

    const center = waterCenters.find((c) => c.id === safeId);
    if (!center) {
      return NextResponse.json({ error: "알 수 없는 문화관입니다." }, { status: 400 });
    }

    if (!nickname || nickname.length > NICK_MAX) {
      return NextResponse.json({ error: `닉네임은 1~${NICK_MAX}자로 입력해 주세요.` }, { status: 400 });
    }
    if (caption.length < CAPTION_MIN || caption.length > CAPTION_MAX) {
      return NextResponse.json(
        { error: `설명은 ${CAPTION_MIN}~${CAPTION_MAX}자로 입력해 주세요.` },
        { status: 400 },
      );
    }

    const ext = (file.name.split(".").pop() ?? "jpg").toLowerCase();
    const safeExt = ["jpg", "jpeg", "png", "webp", "gif"].includes(ext) ? ext : "jpg";
    const objectPath = `${safeId}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${safeExt}`;

    const bytes = await file.arrayBuffer();
    const uploaded = await uploadStoryImageToStorage(objectPath, bytes, contentType);
    if ("error" in uploaded) {
      return NextResponse.json({ error: uploaded.error }, { status: 500 });
    }

    try {
      const story = await insertWaterStoryDb({
        centerId: safeId,
        centerName: center.name,
        imageUrl: uploaded.publicUrl,
        nickname,
        caption,
      });
      return NextResponse.json(story);
    } catch (dbErr) {
      console.error("insertWaterStoryDb:", dbErr);
      return NextResponse.json({ error: insertStoryDbUserMessage(dbErr) }, { status: 500 });
    }
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "등록 처리 중 오류가 났습니다." }, { status: 500 });
  }
}
