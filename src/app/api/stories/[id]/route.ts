import { NextRequest, NextResponse } from "next/server";
import { isWaterStoriesLive } from "@/lib/storiesConfig";
import { removeStoryImageFromStorage } from "@/lib/supabaseAdmin";
import { verifyWaterStoriesAdmin, adminStoriesConfigured } from "@/lib/waterStoriesAdminAuth";
import { deleteWaterStoryDb, getWaterStoryImageUrl, setPhotoOfMonthDb } from "@/lib/waterStoriesDb";

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

type Props = { params: Promise<{ id: string }> };

export async function PATCH(req: NextRequest, { params }: Props) {
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

  const { id } = await params;
  if (!UUID_RE.test(id)) {
    return NextResponse.json({ error: "잘못된 ID입니다." }, { status: 400 });
  }

  let body: { isPhotoOfMonth?: boolean };
  try {
    body = (await req.json()) as { isPhotoOfMonth?: boolean };
  } catch {
    return NextResponse.json({ error: "요청 형식이 올바르지 않습니다." }, { status: 400 });
  }

  if (body.isPhotoOfMonth !== true) {
    return NextResponse.json({ error: "요청 형식이 올바르지 않습니다." }, { status: 400 });
  }

  try {
    await setPhotoOfMonthDb(id);
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "갱신에 실패했습니다." }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: Props) {
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

  const { id } = await params;
  if (!UUID_RE.test(id)) {
    return NextResponse.json({ error: "잘못된 ID입니다." }, { status: 400 });
  }

  try {
    const imageUrl = await getWaterStoryImageUrl(id);
    if (imageUrl) {
      await removeStoryImageFromStorage(imageUrl);
    }
    await deleteWaterStoryDb(id);
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "삭제에 실패했습니다." }, { status: 500 });
  }
}
