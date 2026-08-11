import { NextRequest, NextResponse } from "next/server";
import { listEventsFromDb, insertEventDb } from "@/lib/eventsDb";
import { verifyAdminRequest } from "@/lib/waterStoriesAdminAuth";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const centerId = searchParams.get("center") ?? undefined;

  try {
    const eventList = await listEventsFromDb(centerId);
    return NextResponse.json(eventList);
  } catch (e) {
    console.error("events GET error:", e);
    return NextResponse.json({ error: "이벤트를 불러오지 못했습니다." }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  if (!(await verifyAdminRequest(req))) {
    return NextResponse.json({ error: "관리자 권한이 없습니다." }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { centerId, centerName, title, content, startDate, endDate, isHeadquarters, imageUrl } = body;

    if (!centerId || !centerName || !title || !content || !startDate || !endDate) {
      return NextResponse.json({ error: "필수 입력 항목이 누락되었습니다." }, { status: 400 });
    }

    const newEvent = await insertEventDb({
      centerId,
      centerName,
      title,
      content,
      startDate,
      endDate,
      isHeadquarters: Boolean(isHeadquarters),
      imageUrl: imageUrl ?? undefined,
    });

    return NextResponse.json(newEvent);
  } catch (e) {
    console.error("events POST error:", e);
    return NextResponse.json({ error: "이벤트를 등록하지 못했습니다." }, { status: 500 });
  }
}
