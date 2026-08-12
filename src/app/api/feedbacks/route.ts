import { NextRequest, NextResponse } from "next/server";
import { listFeedbacksFromDb, insertFeedbackDb } from "@/lib/feedbacksDb";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const centerId = searchParams.get("center") ?? undefined;

  try {
    const feedbackList = await listFeedbacksFromDb(centerId);
    return NextResponse.json(feedbackList);
  } catch (e) {
    console.error("feedbacks GET error:", e);
    return NextResponse.json({ error: "문의 목록을 불러오지 못했습니다." }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { centerId, centerName, title, content, writerType, writerName, password, isPrivate } = body;

    if (!centerId || !centerName || !title || !content || !writerType || !writerName || !password) {
      return NextResponse.json({ error: "필수 입력 항목이 누락되었습니다." }, { status: 400 });
    }

    if (writerType !== "실명" && writerType !== "익명") {
      return NextResponse.json({ error: "올바르지 않은 작성 유형입니다." }, { status: 400 });
    }

    const newFeedback = await insertFeedbackDb({
      centerId,
      centerName,
      title,
      content,
      writerType,
      writerName,
      passwordHash: String(password).trim(), // Simple check password
      isPrivate: Boolean(isPrivate),
    });

    return NextResponse.json(newFeedback);
  } catch (e) {
    console.error("feedbacks POST error:", e);
    return NextResponse.json({ error: "문의를 등록하지 못했습니다." }, { status: 500 });
  }
}
