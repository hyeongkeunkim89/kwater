import { NextRequest, NextResponse } from "next/server";
import { getFeedbackDetailFromDb, updateFeedbackReplyDb, deleteFeedbackDb } from "@/lib/feedbacksDb";
import { verifyAdminRequest } from "@/lib/waterStoriesAdminAuth";

export const runtime = "nodejs";

type Props = { params: Promise<{ id: string }> };

export async function GET(req: NextRequest, { params }: Props) {
  const { id } = await params;
  try {
    const feedback = await getFeedbackDetailFromDb(id, true); // Get password for verification
    if (!feedback) {
      return NextResponse.json({ error: "문의글을 찾을 수 없습니다." }, { status: 404 });
    }

    const isAdmin = await verifyAdminRequest(req);

    if (feedback.isPrivate && !isAdmin) {
      const givenPassword = req.headers.get("x-feedback-password") || new URL(req.url).searchParams.get("password");
      if (!givenPassword || givenPassword.trim() !== (feedback.password ?? "").trim()) {
        return NextResponse.json(
          { error: "비밀글입니다. 올바른 비밀번호를 입력해 주세요." },
          { status: 401 }
        );
      }
    }

    // Strip password before returning
    feedback.password = undefined;
    return NextResponse.json(feedback);
  } catch (e) {
    console.error("feedback detail GET error:", e);
    return NextResponse.json({ error: "문의글을 불러오지 못했습니다." }, { status: 500 });
  }
}

// PATCH for admin reply
export async function PATCH(req: NextRequest, { params }: Props) {
  const { id } = await params;

  if (!(await verifyAdminRequest(req))) {
    return NextResponse.json({ error: "관리자 권한이 없습니다." }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { adminReply } = body;

    const updated = await updateFeedbackReplyDb(id, adminReply ?? null);
    return NextResponse.json(updated);
  } catch (e) {
    console.error("feedback detail PATCH error:", e);
    return NextResponse.json({ error: "답변 등록에 실패했습니다." }, { status: 500 });
  }
}

// DELETE for admin or author (with correct password)
export async function DELETE(req: NextRequest, { params }: Props) {
  const { id } = await params;

  try {
    const feedback = await getFeedbackDetailFromDb(id, true);
    if (!feedback) {
      return NextResponse.json({ error: "문의글을 찾을 수 없습니다." }, { status: 404 });
    }

    const isAdmin = await verifyAdminRequest(req);
    let authorized = isAdmin;

    if (!authorized) {
      const givenPassword = req.headers.get("x-feedback-password") || new URL(req.url).searchParams.get("password");
      if (givenPassword && givenPassword.trim() === (feedback.password ?? "").trim()) {
        authorized = true;
      }
    }

    if (!authorized) {
      return NextResponse.json({ error: "삭제 권한이 없습니다." }, { status: 401 });
    }

    await deleteFeedbackDb(id);
    return NextResponse.json({ success: true });
  } catch (e) {
    console.error("feedback detail DELETE error:", e);
    return NextResponse.json({ error: "문의글 삭제에 실패했습니다." }, { status: 500 });
  }
}
