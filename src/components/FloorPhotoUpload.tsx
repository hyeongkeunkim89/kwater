"use client";

import { useCallback, useEffect, useRef, useState } from "react";

interface Props {
  centerId: string;
  floorKey: string; // e.g. "floor-0", "floor-1"
  floorLabel: string;
}

export function FloorPhotoUpload({ centerId, floorKey, floorLabel }: Props) {
  const [images, setImages] = useState<string[]>([]);
  const [open, setOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
  const [lightbox, setLightbox] = useState<string | null>(null);
  const [lightboxIdx, setLightboxIdx] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchImages = useCallback(async () => {
    const res = await fetch(
      `/api/center-images?centerId=${centerId}&subDir=${floorKey}`
    );
    const list: string[] = await res.json();
    setImages(list);
  }, [centerId, floorKey]);

  useEffect(() => {
    const t = window.setTimeout(() => {
      void fetchImages();
    }, 0);
    return () => clearTimeout(t);
  }, [fetchImages]);

  const openByIdx = useCallback((idx: number) => {
    const clamped = Math.max(0, Math.min(images.length - 1, idx));
    setLightboxIdx(clamped);
    setLightbox(images[clamped] ?? null);
  }, [images]);

  /* 키보드 네비게이션 */
  useEffect(() => {
    if (!lightbox) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") openByIdx(lightboxIdx + 1);
      if (e.key === "ArrowLeft") openByIdx(lightboxIdx - 1);
      if (e.key === "Escape") setLightbox(null);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [lightbox, lightboxIdx, openByIdx]);

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setUploading(true);
    setUploadError(null);

    for (const file of Array.from(files)) {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("centerId", centerId);
      fd.append("subDir", floorKey);
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      if (!res.ok) {
        const { error } = await res.json();
        setUploadError(error ?? "업로드 실패");
        break;
      }
    }

    setUploading(false);
    fetchImages();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    handleFiles(e.dataTransfer.files);
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    const filename = deleteTarget.split("/").pop()!;
    await fetch("/api/upload", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ centerId, filename, subDir: floorKey }),
    });
    if (lightbox === deleteTarget) setLightbox(null);
    setDeleteTarget(null);
    fetchImages();
  };

  return (
    <div className="mt-3">
      {/* 토글 버튼 */}
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-bold text-slate-600 transition hover:border-sky-300 hover:bg-sky-50 hover:text-sky-700"
        aria-expanded={open}
      >
        <span className="text-sm">📷</span>
        {images.length > 0 ? (
          <>층 사진 <span className="rounded-full bg-sky-100 px-1.5 py-0.5 text-sky-700">{images.length}</span></>
        ) : (
          "층 사진 추가"
        )}
        <span className={`ml-0.5 transition-transform ${open ? "rotate-180" : ""}`}>▾</span>
      </button>

      {open && (
        <div className="mt-3 rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <p className="mb-3 text-xs font-bold text-slate-500">{floorLabel} — 사진</p>

          {/* 드래그&드롭 업로드 존 */}
          <div
            role="button"
            tabIndex={0}
            aria-label={`${floorLabel} 사진 업로드`}
            className="mb-3 flex cursor-pointer flex-col items-center justify-center gap-1.5 rounded-xl border-2 border-dashed border-slate-200 bg-white px-4 py-5 text-center transition hover:border-sky-400 hover:bg-sky-50 focus:outline-none focus:ring-2 focus:ring-sky-400"
            onClick={() => fileInputRef.current?.click()}
            onKeyDown={(e) => e.key === "Enter" && fileInputRef.current?.click()}
            onDrop={handleDrop}
            onDragOver={(e) => e.preventDefault()}
          >
            <p className="text-xs font-bold text-slate-600">
              {uploading ? "업로드 중…" : "클릭하거나 사진을 드래그하세요"}
            </p>
            <p className="text-[10px] text-slate-400">
              JPG · PNG · WebP · 최대 20 MB · 여러 장 가능
            </p>
            {uploadError && (
              <p className="mt-1 text-[11px] font-bold text-red-500">{uploadError}</p>
            )}
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            multiple
            className="hidden"
            onChange={(e) => handleFiles(e.target.files)}
          />

          {/* 썸네일 그리드 */}
          {images.length > 0 && (
            <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 lg:grid-cols-5">
              {images.map((src, i) => (
                <div
                  key={src}
                  className="group relative aspect-square overflow-hidden rounded-xl bg-slate-200"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={src}
                    alt=""
                    loading="lazy"
                    className="h-full w-full cursor-pointer object-cover transition duration-300 group-hover:scale-105"
                    onClick={() => { setLightboxIdx(i); setLightbox(src); }}
                  />
                  {/* 삭제 버튼 오버레이 */}
                  <button
                    onClick={(e) => { e.stopPropagation(); setDeleteTarget(src); }}
                    className="absolute right-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-red-500/80 text-[10px] font-bold text-white opacity-0 transition group-hover:opacity-100 hover:bg-red-600"
                    aria-label="사진 삭제"
                    title="삭제"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 라이트박스 */}
      {lightbox && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
          onClick={() => setLightbox(null)}
        >
          {lightboxIdx > 0 && (
            <button
              onClick={(e) => { e.stopPropagation(); openByIdx(lightboxIdx - 1); }}
              className="absolute left-4 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/15 text-xl text-white hover:bg-white/25"
              aria-label="이전 사진"
            >
              ‹
            </button>
          )}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={lightbox}
            alt=""
            className="max-h-[90vh] max-w-full rounded-xl object-contain shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          />
          {lightboxIdx < images.length - 1 && (
            <button
              onClick={(e) => { e.stopPropagation(); openByIdx(lightboxIdx + 1); }}
              className="absolute right-4 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/15 text-xl text-white hover:bg-white/25"
              aria-label="다음 사진"
            >
              ›
            </button>
          )}
          <button
            onClick={() => setLightbox(null)}
            className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-white/15 text-white hover:bg-white/25"
            aria-label="닫기"
          >
            ✕
          </button>
          <span className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-black/55 px-3 py-1 text-xs text-white/80">
            {lightboxIdx + 1} / {images.length}
          </span>
        </div>
      )}

      {/* 삭제 확인 모달 */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl">
            <p className="mb-4 text-sm font-bold text-slate-900">
              이 사진을 삭제하시겠습니까?
            </p>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={deleteTarget}
              alt=""
              className="mb-4 h-32 w-full rounded-xl object-cover"
            />
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteTarget(null)}
                className="flex-1 rounded-xl border border-slate-200 py-2 text-sm font-bold text-slate-700 hover:bg-slate-50"
              >
                취소
              </button>
              <button
                onClick={handleDelete}
                className="flex-1 rounded-xl bg-red-500 py-2 text-sm font-bold text-white hover:bg-red-600"
              >
                삭제
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
