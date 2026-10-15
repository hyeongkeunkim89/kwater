import { NextRequest, NextResponse } from "next/server";
import { listLostFoundItems, insertLostFoundItem, deleteLostFoundItem } from "@/lib/lostFoundDb";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const centerId = searchParams.get("center") ?? undefined;
  const type = searchParams.get("type") ?? undefined;
  const search = searchParams.get("search") ?? undefined;

  try {
    const list = await listLostFoundItems(centerId, type, search);
    return NextResponse.json(list);
  } catch (e) {
    console.error("lost-found GET error:", e);
    return NextResponse.json({ error: "분실물 목록을 불러오지 못했습니다." }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { type, centerId, centerName, title, itemName, date, place, content, writerName, contact, password } = body;

    if (!type || !centerId || !centerName || !title || !itemName || !date || !place || !content || !writerName || !password) {
      return NextResponse.json({ error: "필수 입력 항목이 누락되었습니다." }, { status: 400 });
    }

    const newItem = await insertLostFoundItem({
      type,
      centerId,
      centerName,
      title,
      itemName,
      date,
      place,
      content,
      writerName,
      contact: contact ? String(contact).trim() : undefined,
      password: String(password).trim(),
    });

    return NextResponse.json(newItem);
  } catch (e) {
    console.error("lost-found POST error:", e);
    return NextResponse.json({ error: "분실물 게시글을 등록하지 못했습니다." }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, password } = body;

    if (!id || !password) {
      return NextResponse.json({ error: "게시글 ID와 비밀번호가 필요합니다." }, { status: 400 });
    }

    await deleteLostFoundItem(id, password);
    return NextResponse.json({ success: true });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "게시글 삭제에 실패했습니다.";
    return NextResponse.json({ error: msg }, { status: 400 });
  }
}
