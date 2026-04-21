import { readdir } from "fs/promises";
import path from "path";
import { NextRequest, NextResponse } from "next/server";

const IMAGE_EXT = /\.(jpe?g|png|webp|gif)$/i;

function safeSegment(s: string) {
  return s.replace(/[^a-zA-Z0-9_-]/g, "");
}

export async function GET(req: NextRequest) {
  const centerId = req.nextUrl.searchParams.get("centerId");
  const subDir = req.nextUrl.searchParams.get("subDir");
  if (!centerId) return NextResponse.json([]);

  const safeId = safeSegment(centerId);
  const safeSub = subDir ? safeSegment(subDir) : null;
  const dir = safeSub
    ? path.join(process.cwd(), "public", "centers", safeId, safeSub)
    : path.join(process.cwd(), "public", "centers", safeId);

  try {
    const files = await readdir(dir);
    const images = files
      .filter((f) => IMAGE_EXT.test(f))
      .sort()
      .map((f) =>
        safeSub
          ? `/centers/${safeId}/${safeSub}/${f}`
          : `/centers/${safeId}/${f}`
      );
    return NextResponse.json(images);
  } catch {
    return NextResponse.json([]);
  }
}
