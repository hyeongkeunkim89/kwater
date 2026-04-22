import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { NextRequest, NextResponse } from "next/server";

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];
const MAX_SIZE = 12 * 1024 * 1024;

function safeSegment(s: string) {
  return s.replace(/[^a-zA-Z0-9_-]/g, "");
}

export async function POST(req: NextRequest) {
  try {
    const data = await req.formData();
    const file = data.get("file") as File | null;
    const centerId = data.get("centerId") as string | null;

    if (!file || !centerId) {
      return NextResponse.json({ error: "파일 또는 문화관 선택이 필요합니다" }, { status: 400 });
    }
    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json({ error: "JPG/PNG/WebP/GIF만 허용됩니다" }, { status: 400 });
    }
    if (file.size > MAX_SIZE) {
      return NextResponse.json({ error: "파일은 12 MB 이하여야 합니다" }, { status: 400 });
    }

    const safeId = safeSegment(centerId);
    if (!safeId) {
      return NextResponse.json({ error: "유효하지 않은 문화관입니다" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const dir = path.join(process.cwd(), "public", "stories", safeId);
    await mkdir(dir, { recursive: true });

    const ext = (file.name.split(".").pop() ?? "jpg").toLowerCase();
    const safeExt = ["jpg", "jpeg", "png", "webp", "gif"].includes(ext) ? ext : "jpg";
    const filename = `${Date.now()}-${Math.random().toString(36).slice(2, 7)}.${safeExt}`;
    await writeFile(path.join(dir, filename), buffer);

    const src = `/stories/${safeId}/${filename}`;
    return NextResponse.json({ src });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "서버 오류" }, { status: 500 });
  }
}
