import { NextRequest, NextResponse } from "next/server";
import { isWaterStoriesLive } from "@/lib/storiesConfig";
import { verifyWaterStoriesAdmin, adminStoriesConfigured } from "@/lib/waterStoriesAdminAuth";
import { clearPhotoOfMonthDb } from "@/lib/waterStoriesDb";

/** 이달의 사진 지정 전체 해제 */
export async function DELETE(req: NextRequest) {
  if (!isWaterStoriesLive()) {
    return NextResponse.json(
      { error: "갤러리 서비스를 사용할 수 없습니다." },
      { status: 503 },
    );
  }
  if (!adminStoriesConfigured()) {
    return NextResponse.json(
      { error: "관리 기능이 아직 준비되지 않았습니다." },
      { status: 503 },
    );
  }
  if (!verifyWaterStoriesAdmin(req)) {
    return NextResponse.json({ error: "권한이 없습니다." }, { status: 401 });
  }
  try {
    await clearPhotoOfMonthDb();
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "해제에 실패했습니다." }, { status: 500 });
  }
}
