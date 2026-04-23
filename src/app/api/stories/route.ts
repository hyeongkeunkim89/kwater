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

function postgresErrMeta(err: unknown): { msg: string; code: string; detail: string } {
  const msg = err instanceof Error ? err.message : String(err);
  if (!err || typeof err !== "object") return { msg, code: "", detail: "" };
  const o = err as Record<string, unknown>;
  const code = typeof o.code === "string" ? o.code : "";
  const detail = typeof o.detail === "string" ? o.detail : "";
  return { msg, code, detail };
}

/** INSERT 단계 예외 → 사용자 안내 (이미지는 이미 Storage에 있을 수 있음) */
function insertStoryDbUserMessage(err: unknown): string {
  const { msg, code, detail } = postgresErrMeta(err);
  const m = msg.toLowerCase();
  const d = detail.toLowerCase();

  if (code === "42P01" || /relation .*does not exist/i.test(msg)) {
    return "글 저장에 실패했습니다. Supabase **SQL Editor**에서 저장소의 `db/water-stories.sql`을 실행해 `water_stories` 테이블을 만든 뒤 다시 시도해 주세요. (Transaction pooler 6543에서는 앱이 자동으로 테이블을 만들지 않습니다.)";
  }
  if (code === "42703" || /column .*does not exist/i.test(msg)) {
    return "글 저장에 실패했습니다. `water_stories` 테이블 컬럼이 `db/water-stories.sql`과 다른 것 같습니다. SQL 파일 전체를 다시 실행해 테이블을 맞춰 주세요.";
  }
  if (code === "42883" || /gen_random_uuid|function .* does not exist/i.test(m)) {
    return "글 저장에 실패했습니다. Supabase SQL Editor에서 `CREATE EXTENSION IF NOT EXISTS pgcrypto;` 를 실행한 뒤 다시 시도해 주세요.";
  }
  if (/password authentication failed|28p01|tenant or user not found|invalid.*password/i.test(m) || code === "28P01") {
    return "글 저장에 실패했습니다. DATABASE_URL의 **DB 비밀번호**와 **사용자 이름**(pooler는 `postgres.[프로젝트ref]` 형식)이 Supabase에 표시된 값과 같은지 확인해 주세요.";
  }
  if (/econnrefused|etimedout|getaddrinfo|connect|closed the connection|connection terminated|connect_timeout/i.test(m)) {
    return "글 저장에 실패했습니다. DATABASE_URL 호스트·포트·비밀번호를 확인해 주세요.";
  }
  if (/ssl|certificate|tls|self signed/i.test(m)) {
    return "글 저장에 실패했습니다. DB 연결 문자열에 sslmode=require 등 SSL 옵션이 맞는지 확인해 주세요.";
  }
  if (/prepared statement|26000|syntax error.*prepare|pgbouncer/.test(m)) {
    return "글 저장에 실패했습니다. Supabase **Transaction pooler** URI를 쓰는 경우, 문자열 끝에 `?pgbouncer=true`(없다면)를 붙여 주세요.";
  }
  if (/permission denied|42501/i.test(m) || code === "42501") {
    return "글 저장에 실패했습니다. DB 사용자에게 `water_stories` 테이블 쓰기 권한이 있는지 확인해 주세요.";
  }
  if (msg === "INSERT 실패" || /insert 실패/i.test(msg)) {
    return "글 저장에 실패했습니다. INSERT 결과가 비어 있습니다. 테이블·트리거·RLS를 Supabase에서 확인해 주세요.";
  }

  const tail = [code && `코드 ${code}`, detail && `상세: ${detail}`].filter(Boolean).join(" · ");
  const clip = msg.length > 220 ? `${msg.slice(0, 220)}…` : msg;
  return `사진은 Storage에 올라갔을 수 있으나, 글(DB) 저장에 실패했습니다.${tail ? ` ${tail}.` : ""} DB 메시지: ${clip}`;
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
