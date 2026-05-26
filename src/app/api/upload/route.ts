import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { NextRequest, NextResponse } from "next/server";

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];
const MAX_SIZE = 20 * 1024 * 1024; // 20 MB

function safeSegment(s: string) {
  return s.replace(/[^a-zA-Z0-9_-]/g, "");
}

export async function POST(req: NextRequest) {
  /** Vercel 서버리스 파일 시스템은 보통 쓰기 불가 → public/ 저장은 실패하고 "서버 오류"만 보이기 쉬움 */
  if (process.env.VERCEL) {
    return NextResponse.json(
      {
        error:
          "Vercel에서는 이 방식으로 파일을 저장할 수 없습니다. Supabase를 쓰려면 Vercel에 DATABASE_URL·NEXT_PUBLIC_SUPABASE_URL·SUPABASE_SERVICE_ROLE_KEY를 넣고 다시 배포하세요. 그러면 층별 사진은 Storage·DB 경로로 올라갑니다.",
      },
      { status: 503 },
    );
  }

  try {
    const data = await req.formData();
    const file = data.get("file") as File | null;
    const centerId = data.get("centerId") as string | null;
    const subDir = data.get("subDir") as string | null;

    if (!file || !centerId) {
      return NextResponse.json({ error: "파일 또는 centerId 누락" }, { status: 400 });
    }
    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json({ error: "JPG/PNG/WebP/GIF만 허용됩니다" }, { status: 400 });
    }
    if (file.size > MAX_SIZE) {
      return NextResponse.json({ error: "파일 크기는 20 MB 이하여야 합니다" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const safeId = safeSegment(centerId);
    const safeSub = subDir ? safeSegment(subDir) : null;
    const dir = safeSub
      ? path.join(process.cwd(), "public", "centers", safeId, safeSub)
      : path.join(process.cwd(), "public", "centers", safeId);
    await mkdir(dir, { recursive: true });

    const ext = file.name.split(".").pop() ?? "jpg";
    const filename = `${Date.now()}-${Math.random().toString(36).slice(2, 7)}.${ext}`;
    await writeFile(path.join(dir, filename), buffer);

    const src = safeSub
      ? `/centers/${safeId}/${safeSub}/${filename}`
      : `/centers/${safeId}/${filename}`;
    return NextResponse.json({ src });
  } catch (e) {
    console.error(e);
    const msg = e instanceof Error ? e.message : String(e);
    if (/EROFS|read-only file system|EPERM/i.test(msg)) {
      return NextResponse.json(
        {
          error:
            "서버 디스크에 파일을 쓸 수 없습니다. 로컬 개발 서버(pnpm dev)에서 시도하거나, 배포 환경에서는 Supabase 연동을 사용해 주세요.",
        },
        { status: 503 },
      );
    }
    return NextResponse.json({ error: "서버 오류" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { centerId, filename, subDir } = await req.json();
    if (!centerId || !filename) {
      return NextResponse.json({ error: "누락된 파라미터" }, { status: 400 });
    }

    const safeId = safeSegment(centerId);
    const safeSub = subDir ? safeSegment(subDir) : null;
    const safeName = path.basename(filename);
    const filepath = safeSub
      ? path.join(process.cwd(), "public", "centers", safeId, safeSub, safeName)
      : path.join(process.cwd(), "public", "centers", safeId, safeName);

    const { unlink } = await import("fs/promises");
    await unlink(filepath);

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "삭제 실패" }, { status: 500 });
  }
}
