"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import type { EditorialPhotoOfMonth } from "@/data/water-stories-spotlight";
import { waterCenters } from "@/data/centers";
import {
  addWaterStory,
  deleteWaterStory,
  getAllWaterStories,
  getPhotoOfMonthStoryId,
} from "@/lib/waterStories";
import type { WaterStory } from "@/types/waterStory";

const NICK_MAX = 24;
const CAPTION_MAX = 280;

function formatDateKo(iso: string) {
  try {
    const d = new Date(iso);
    return d.toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch {
    return iso;
  }
}

export function WaterStoriesClient({
  editorialSpotlight,
  initialCenterId = "",
  storiesLive,
  uploadBlocked = false,
  initialStories,
}: {
  editorialSpotlight: EditorialPhotoOfMonth | null;
  initialCenterId?: string;
  storiesLive: boolean;
  /** Vercel 배포인데 DB·Blob 미설정 — 업로드 불가 */
  uploadBlocked?: boolean;
  initialStories: WaterStory[];
}) {
  const [stories, setStories] = useState<WaterStory[]>(initialStories);
  const [filterCenter, setFilterCenter] = useState("전체");
  const [centerId, setCenterId] = useState("");
  const [nickname, setNickname] = useState("");
  const [caption, setCaption] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [formOk, setFormOk] = useState<string | null>(null);
  const [localPomId, setLocalPomId] = useState<string | null>(null);

  const reload = useCallback(async () => {
    if (storiesLive) {
      try {
        const res = await fetch("/api/stories");
        if (res.ok) {
          const data = (await res.json()) as WaterStory[];
          setStories(Array.isArray(data) ? data : []);
        }
      } catch {
        /* ignore */
      }
    } else {
      setStories(getAllWaterStories());
      setLocalPomId(getPhotoOfMonthStoryId());
    }
  }, [storiesLive]);

  useEffect(() => {
    setStories(initialStories);
  }, [initialStories]);

  useEffect(() => {
    void reload();
  }, [reload]);

  useEffect(() => {
    if (!storiesLive) {
      setLocalPomId(getPhotoOfMonthStoryId());
    }
  }, [stories, storiesLive]);

  useEffect(() => {
    if (!initialCenterId) return;
    const exists = waterCenters.some((c) => c.id === initialCenterId);
    if (exists) {
      setCenterId(initialCenterId);
      setFilterCenter(initialCenterId);
    }
  }, [initialCenterId]);

  const pomStory = useMemo(() => {
    if (editorialSpotlight) return null;
    if (storiesLive) {
      return stories.find((s) => s.isPhotoOfMonth) ?? null;
    }
    if (!localPomId) return null;
    return stories.find((s) => s.id === localPomId) ?? null;
  }, [editorialSpotlight, stories, storiesLive, localPomId]);

  const filtered = useMemo(() => {
    if (filterCenter === "전체") return stories;
    return stories.filter((s) => s.centerId === filterCenter);
  }, [stories, filterCenter]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (uploadBlocked) return;
    setFormError(null);
    setFormOk(null);

    const nick = nickname.trim();
    const cap = caption.trim();
    if (!centerId) {
      setFormError("문화관을 선택해 주세요.");
      return;
    }
    if (!nick) {
      setFormError("닉네임을 입력해 주세요.");
      return;
    }
    if (nick.length > NICK_MAX) {
      setFormError(`닉네임은 ${NICK_MAX}자 이하로 해 주세요.`);
      return;
    }
    if (cap.length < 8) {
      setFormError("짧은 소감도 좋습니다. 장소나 날씨를 포함해 8자 이상 적어 주세요.");
      return;
    }
    if (cap.length > CAPTION_MAX) {
      setFormError(`설명은 ${CAPTION_MAX}자 이하로 해 주세요.`);
      return;
    }
    if (!file) {
      setFormError("사진 파일을 선택해 주세요.");
      return;
    }

    const heic =
      file.type === "image/heic" ||
      file.type === "image/heif" ||
      /\.(heic|heif)$/i.test(file.name);
    if (heic) {
      setFormError(
        "HEIC/HEIF 형식은 지원하지 않습니다. iPhone은 설정 → 카메라 → 포맷에서 ‘호환성 우선’으로 바꾸거나, 사진을 JPEG로보낸 뒤 올려 주세요.",
      );
      return;
    }

    const center = waterCenters.find((c) => c.id === centerId);
    if (!center) {
      setFormError("선택한 문화관을 찾을 수 없습니다.");
      return;
    }

    setUploading(true);
    try {
      if (storiesLive) {
        const fd = new FormData();
        fd.append("file", file);
        fd.append("centerId", centerId);
        fd.append("nickname", nick);
        fd.append("caption", cap);
        const res = await fetch("/api/stories", { method: "POST", body: fd });
        const data = (await res.json()) as WaterStory & { error?: string };
        if (!res.ok) {
          setFormError(data.error ?? "등록에 실패했습니다.");
          return;
        }
        setFormOk("등록되었습니다. 갤러리에 반영되었어요!");
        setCaption("");
        setFile(null);
        await reload();
        return;
      }

      const fd = new FormData();
      fd.append("file", file);
      fd.append("centerId", centerId);
      const res = await fetch("/api/stories/upload", { method: "POST", body: fd });
      const data = (await res.json()) as { src?: string; error?: string };
      if (!res.ok) {
        setFormError(data.error ?? "업로드에 실패했습니다.");
        return;
      }
      if (!data.src) {
        setFormError("업로드 응답이 올바르지 않습니다.");
        return;
      }

      addWaterStory({
        centerId,
        centerName: center.name,
        imageSrc: data.src,
        nickname: nick,
        caption: cap,
      });
      setFormOk("등록되었습니다. 갤러리에 반영되었어요!");
      setCaption("");
      setFile(null);
      await reload();
    } catch {
      setFormError("네트워크 오류가 났습니다. 잠시 후 다시 시도해 주세요.");
    } finally {
      setUploading(false);
    }
  };

  const uploadHint =
    "직접 찍은 사진을 올려 주시고, 타인의 얼굴·차량 번호판 등은 가리거나 피해 주세요. 게시물에 대한 책임은 작성자에게 있습니다.";

  return (
    <div className="space-y-12 sm:space-y-16">
      {/* 이달의 사진 */}
      <section
        className="overflow-hidden rounded-2xl border border-amber-200/80 bg-gradient-to-br from-amber-50 via-white to-sky-50/60 shadow-sm"
        aria-labelledby="pom-heading"
      >
        <div className="border-b border-amber-100/90 bg-white/80 px-5 py-4 sm:px-8 sm:py-5">
          <p className="text-[10px] font-bold uppercase tracking-widest text-amber-700/90 sm:text-xs">
            Event
          </p>
          <h2 id="pom-heading" className="mt-1 text-xl font-black tracking-tight text-slate-900 sm:text-2xl">
            이달의 사진
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-600">
            매월 말 운영진이 갤러리 후보 중 한 작품을 선정합니다. 선정되신 분께는 작은 기념품을 드리는 이벤트와
            연동할 수 있어요.
          </p>
        </div>

        <div className="grid gap-0 lg:grid-cols-2 lg:items-stretch">
          <div className="relative aspect-[4/3] min-h-[200px] w-full max-w-full bg-slate-900 lg:aspect-auto lg:min-h-[280px]">
            {editorialSpotlight ? (
              <Image
                src={editorialSpotlight.imageSrc}
                alt=""
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
                priority
              />
            ) : pomStory ? (
              // eslint-disable-next-line @next/next/no-img-element -- 업로드 이미지 동적 URL
              <img
                src={pomStory.imageSrc}
                alt=""
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full min-h-[200px] flex-col items-center justify-center gap-2 px-6 text-center text-white/80 lg:min-h-[280px]">
                <span className="text-3xl" aria-hidden>
                  📷
                </span>
                <p className="text-sm font-medium text-white/90">
                  아직 공개된 이달의 사진이 없습니다.
                </p>
                <p className="max-w-xs text-xs text-white/60">
                  아래 갤러리에 올려 주신 사진이 후보가 됩니다.
                </p>
              </div>
            )}
          </div>
          <div className="flex flex-col justify-center gap-3 px-5 py-6 sm:px-8 sm:py-8">
            {editorialSpotlight ? (
              <>
                <p className="text-xs font-bold text-amber-800">{editorialSpotlight.monthLabel}</p>
                <p className="text-lg font-bold text-slate-900">{editorialSpotlight.title}</p>
                <p className="text-sm leading-relaxed text-slate-600">{editorialSpotlight.caption}</p>
                <p className="text-xs text-slate-500">
                  촬영 거점 · {editorialSpotlight.facilityName}
                  {editorialSpotlight.photographerCredit
                    ? ` · ${editorialSpotlight.photographerCredit}`
                    : null}
                </p>
              </>
            ) : pomStory ? (
              <>
                <p className="text-xs font-bold text-amber-800">이달의 사진</p>
                <p className="text-lg font-bold text-slate-900">{pomStory.centerName}</p>
                <p className="text-sm leading-relaxed text-slate-600">{pomStory.caption}</p>
                <p className="text-xs text-slate-500">
                  {pomStory.nickname} · {formatDateKo(pomStory.createdAt)}
                </p>
              </>
            ) : (
              <ul className="list-inside list-disc space-y-2 text-sm text-slate-600">
                <li>문화관 주변 산책로, 전망, 계절 풍경 등 방문의 기록을 남겨 주세요.</li>
                <li>타인의 초상·차량 번호판 등 식별 정보가 보이지 않게 올려 주세요.</li>
                <li>운영진이 선정한 이달의 사진은 상단에 소개될 수 있습니다.</li>
              </ul>
            )}
            <p className="mt-2 text-xs text-slate-500">
              이달의 사진은 운영 정책에 따라 선정·교체됩니다.
            </p>
          </div>
        </div>
      </section>

      {/* 업로드 */}
      <section aria-labelledby="upload-heading">
        <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-sky-600">Community</p>
            <h2 id="upload-heading" className="mt-1 text-2xl font-black text-slate-900 sm:text-3xl">
              나의 한 컷 올리기
            </h2>
          </div>
          <p className="max-w-md text-sm leading-relaxed text-slate-500">{uploadHint}</p>
        </div>

        {uploadBlocked && (
          <div
            className="mb-6 rounded-2xl border border-amber-200 bg-amber-50 px-5 py-4 text-sm leading-relaxed text-amber-950 sm:px-6"
            role="status"
          >
            <p className="font-bold">지금 이 사이트에서는 사진 등록을 받을 수 없습니다.</p>
            <p className="mt-2 text-amber-900/90">
              운영 측에서 갤러리 저장소를 연결한 뒤 다시 열어 드릴 때까지 등록이 비활성입니다. 아래 갤러리는
              그대로 둘러보실 수 있습니다.
            </p>
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className={[
            "rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-8",
            uploadBlocked ? "pointer-events-none opacity-60" : "",
          ].join(" ")}
        >
          <div className="grid gap-5 sm:grid-cols-2">
            <label className="block min-w-0 sm:col-span-2">
              <span className="text-xs font-bold text-slate-700">어느 문화관 근처인가요?</span>
              <select
                value={centerId}
                onChange={(e) => setCenterId(e.target.value)}
                className="mt-1.5 w-full min-w-0 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-900 outline-none ring-sky-400/40 focus:border-sky-400 focus:ring-2"
              >
                <option value="">선택…</option>
                {waterCenters.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.sido} · {c.name}
                  </option>
                ))}
              </select>
            </label>
            <label className="block min-w-0">
              <span className="text-xs font-bold text-slate-700">닉네임</span>
              <input
                type="text"
                value={nickname}
                maxLength={NICK_MAX}
                onChange={(e) => setNickname(e.target.value)}
                placeholder="예: 호수산책러"
                className="mt-1.5 w-full min-w-0 rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none ring-sky-400/40 focus:border-sky-400 focus:ring-2"
              />
            </label>
            <label className="block min-w-0">
              <span className="text-xs font-bold text-slate-700">사진 파일</span>
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif"
                onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                className="mt-1.5 w-full min-w-0 text-sm file:mr-3 file:rounded-lg file:border-0 file:bg-sky-50 file:px-3 file:py-2 file:text-xs file:font-bold file:text-sky-800"
              />
            </label>
            <label className="block min-w-0 sm:col-span-2">
              <span className="text-xs font-bold text-slate-700">짧은 이야기 (날씨·동선·인상)</span>
              <textarea
                value={caption}
                maxLength={CAPTION_MAX}
                onChange={(e) => setCaption(e.target.value)}
                rows={4}
                placeholder="예: 둘레길 벚꽃이 막 피기 시작했고, 저수지 쪽 바람이 시원했어요."
                className="mt-1.5 w-full min-w-0 resize-y rounded-xl border border-slate-200 px-4 py-3 text-sm leading-relaxed outline-none ring-sky-400/40 focus:border-sky-400 focus:ring-2"
              />
              <span className="mt-1 block text-right text-[11px] text-slate-400">
                {caption.length} / {CAPTION_MAX}
              </span>
            </label>
          </div>

          {formError && (
            <p className="mt-4 rounded-xl bg-rose-50 px-4 py-3 text-sm text-rose-800" role="alert">
              {formError}
            </p>
          )}
          {formOk && (
            <p className="mt-4 rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-800" role="status">
              {formOk}
            </p>
          )}

          <div className="mt-6 flex flex-wrap gap-3">
            <button
              type="submit"
              disabled={uploading || uploadBlocked}
              className="min-h-11 min-w-[44px] rounded-full bg-sky-500 px-8 py-3 text-sm font-bold text-white shadow-lg shadow-sky-500/25 transition hover:bg-sky-400 disabled:opacity-60"
            >
              {uploadBlocked ? "등록 비활성" : uploading ? "올리는 중…" : "갤러리에 등록"}
            </button>
          </div>
        </form>
      </section>

      {/* 갤러리 */}
      <section aria-labelledby="gallery-heading">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <h2 id="gallery-heading" className="text-2xl font-black text-slate-900 sm:text-3xl">
            모두의 물 이야기
          </h2>
          <label className="flex min-w-0 flex-col gap-1 text-xs font-bold text-slate-600 sm:min-w-[200px]">
            거점 필터
            <select
              value={filterCenter}
              onChange={(e) => setFilterCenter(e.target.value)}
              className="min-h-11 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-medium outline-none ring-sky-400/40 focus:border-sky-400 focus:ring-2"
            >
              <option value="전체">전체</option>
              {waterCenters.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </label>
        </div>

        {filtered.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-6 py-16 text-center text-sm text-slate-500">
            아직 등록된 사진이 없습니다. 첫 주인공이 되어 보세요!
          </p>
        ) : (
          <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((s) => (
              <li
                key={s.id}
                className="group flex min-w-0 flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:border-sky-200 hover:shadow-md"
              >
                <div className="relative aspect-[4/3] w-full max-w-full bg-slate-100">
                  {/* eslint-disable-next-line @next/next/no-img-element -- 업로드 이미지 동적 URL */}
                  <img
                    src={s.imageSrc}
                    alt=""
                    className="h-full w-full object-cover"
                    loading="lazy"
                  />
                  {(storiesLive ? s.isPhotoOfMonth : s.id === localPomId) && (
                    <span className="absolute left-3 top-3 rounded-full bg-amber-500 px-2.5 py-1 text-[10px] font-black uppercase tracking-wide text-white shadow">
                      이달의 사진
                    </span>
                  )}
                </div>
                <div className="flex min-w-0 flex-1 flex-col gap-2 p-4">
                  <p className="truncate text-xs font-bold text-sky-700">{s.centerName}</p>
                  <p className="text-sm font-bold text-slate-900">{s.nickname}</p>
                  <p className="line-clamp-3 text-sm leading-relaxed text-slate-600">{s.caption}</p>
                  <p className="mt-auto text-[11px] text-slate-400">{formatDateKo(s.createdAt)}</p>
                  <div className="flex flex-wrap gap-2 pt-1">
                    <Link
                      href={`/centers/${s.centerId}`}
                      className="text-xs font-bold text-sky-600 hover:underline"
                    >
                      시설 안내 →
                    </Link>
                    {!storiesLive && (
                      <button
                        type="button"
                        onClick={() => {
                          if (!window.confirm("이 글을 삭제할까요?")) return;
                          deleteWaterStory(s.id);
                          void reload();
                        }}
                        className="text-xs font-bold text-rose-600 hover:underline"
                      >
                        삭제
                      </button>
                    )}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
