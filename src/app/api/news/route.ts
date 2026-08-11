import { NextRequest, NextResponse } from "next/server";
import { listNewsFromDb, insertNewsDb } from "@/lib/newsDb";
import { verifyAdminRequest } from "@/lib/waterStoriesAdminAuth";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const centerId = searchParams.get("center") ?? undefined;

  try {
    const newsList = await listNewsFromDb(centerId);
    return NextResponse.json(newsList);
  } catch (e) {
    console.error("news GET error:", e);
    return NextResponse.json({ error: "소식을 불러오지 못했습니다." }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  if (!(await verifyAdminRequest(req))) {
    return NextResponse.json({ error: "관리자 권한이 없습니다." }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { centerId, centerName, title, content, isPinned, imageUrl } = body;

    if (!centerId || !centerName || !title || !content) {
      return NextResponse.json({ error: "필수 입력 항목이 누락되었습니다." }, { status: 400 });
    }

    const newNews = await insertNewsDb({
      centerId,
      centerName,
      title,
      content,
      isPinned: Boolean(isPinned),
      imageUrl: imageUrl ?? undefined,
    });

    return NextResponse.json(newNews);
  } catch (e) {
    console.error("news POST error:", e);
    return NextResponse.json({ error: "소식을 등록하지 못했습니다." }, { status: 500 });
  }
}
