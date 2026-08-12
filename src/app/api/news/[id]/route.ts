import { NextRequest, NextResponse } from "next/server";
import { getNewsDetailFromDb, updateNewsDb, deleteNewsDb } from "@/lib/newsDb";
import { verifyAdminRequest } from "@/lib/waterStoriesAdminAuth";

export const runtime = "nodejs";

type Props = { params: Promise<{ id: string }> };

export async function GET(req: NextRequest, { params }: Props) {
  const { id } = await params;
  try {
    const news = await getNewsDetailFromDb(id);
    if (!news) {
      return NextResponse.json({ error: "소식을 찾을 수 없습니다." }, { status: 404 });
    }
    return NextResponse.json(news);
  } catch (e) {
    console.error("news detail GET error:", e);
    return NextResponse.json({ error: "소식을 불러오지 못했습니다." }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest, { params }: Props) {
  const { id } = await params;
  if (!(await verifyAdminRequest(req))) {
    return NextResponse.json({ error: "관리자 권한이 없습니다." }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { centerId, centerName, title, content, isPinned, imageUrl } = body;

    if (!centerId || !centerName || !title || !content) {
      return NextResponse.json({ error: "필수 입력 항목이 누락되었습니다." }, { status: 400 });
    }

    const updated = await updateNewsDb(id, {
      centerId,
      centerName,
      title,
      content,
      isPinned: Boolean(isPinned),
      imageUrl: imageUrl ?? undefined,
    });

    return NextResponse.json(updated);
  } catch (e) {
    console.error("news detail PATCH error:", e);
    return NextResponse.json({ error: "소식을 수정하지 못했습니다." }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: Props) {
  const { id } = await params;
  if (!(await verifyAdminRequest(req))) {
    return NextResponse.json({ error: "관리자 권한이 없습니다." }, { status: 401 });
  }

  try {
    await deleteNewsDb(id);
    return NextResponse.json({ success: true });
  } catch (e) {
    console.error("news detail DELETE error:", e);
    return NextResponse.json({ error: "소식을 삭제하지 못했습니다." }, { status: 500 });
  }
}
