"use client";

import { useCallback, useEffect, useRef, useState } from "react";

interface Props {
  centerId: string;
}

export function CenterPhotoGallery({ centerId }: Props) {
  const [images, setImages] = useState<string[]>([]);
  const [lightbox, setLightbox] = useState<string | null>(null);
  const [lightboxIdx, setLightboxIdx] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchImages = useCallback(async () => {
    const res = await fetch(`/api/center-images?centerId=${centerId}`);
    const list: string[] = await res.json();
    setImages(list);
  }, [centerId]);

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

  const openLightbox = (src: string) => {
    const idx = images.indexOf(src);
    setLightboxIdx(idx);
    setLightbox(src);
  };

  /* 파일 업로드 */
  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setUploading(true);
    setUploadError(null);

    for (const file of Array.from(files)) {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("centerId", centerId);
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

  /* 삭제 */
  const handleDelete = async () => {
    if (!deleteTarget) return;
    const filename = deleteTarget.split("/").pop()!;
    await fetch("/api/upload", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ centerId, filename }),
    });
    setDeleteTarget(null);
    if (lightbox === deleteTarget) setLightbox(null);
    fetchImages();
  };

  return (
    <section className="mt-16" aria-labelledby="photo-gallery">
      {/* 섹션 헤더 */}
      <div className="mb-6 flex items-center gap-4">
        <div className="h-px flex-1 bg-slate-100" />
        <h2
          id="photo-gallery"
          className="text-xs font-bold uppercase tracking-widest text-slate-400"
        >
          Photo Gallery
        </h2>
        <div className="h-px flex-1 bg-slate-100" />
      </div>
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-black tracking-tight text-slate-900">
          시설 사진
        </h2>
        <span className="text-xs text-slate-400">{images.length}장</span>
      </div>

      {/* 드래그&드롭 업로드 존 */}
      <div
        role="button"
        tabIndex={0}
        aria-label="사진 업로드 영역"
        className="mb-6 flex cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 px-6 py-8 text-center transition hover:border-sky-400 hover:bg-sky-50 focus:outline-none focus:ring-2 focus:ring-sky-400"
        onClick={() => fileInputRef.current?.click()}
        onKeyDown={(e) => e.key === "Enter" && fileInputRef.current?.click()}
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
      >
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-sky-100 text-2xl">
          📷
        </div>
        <p className="text-sm font-bold text-slate-700">
          {uploading ? "업로드 중…" : "클릭하거나 사진을 여기에 드래그하세요"}
        </p>
        <p className="text-xs text-slate-400">
          JPG · PNG · WebP · GIF · 최대 20 MB · 여러 장 동시 선택 가능
        </p>
        {uploadError && (
          <p className="mt-1 text-xs font-bold text-red-500">{uploadError}</p>
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

      {/* 갤러리 그리드 (masonry-like columns) */}
      {images.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 py-16 text-center text-sm text-slate-400">
          아직 등록된 사진이 없습니다. 위 영역에서 사진을 업로드해 보세요.
        </div>
      ) : (
        <div className="columns-2 gap-3 sm:columns-3 lg:columns-4">
          {images.map((src) => (
            <div
              key={src}
              className="group relative mb-3 break-inside-avoid overflow-hidden rounded-2xl bg-slate-100"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={src}
                alt=""
                loading="lazy"
                className="w-full cursor-pointer object-cover transition duration-300 group-hover:scale-105"
                onClick={() => openLightbox(src)}
              />
              {/* 호버 오버레이 */}
              <div
                className="absolute inset-0 flex cursor-pointer items-end justify-between bg-gradient-to-t from-black/50 to-transparent p-3 opacity-0 transition group-hover:opacity-100"
                onClick={() => openLightbox(src)}
              >
                <span className="text-xs text-white/80">
                  {src.split("/").pop()}
                </span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setDeleteTarget(src);
                  }}
                  className="flex h-7 w-7 items-center justify-center rounded-lg bg-red-500/80 text-xs text-white hover:bg-red-500"
                  aria-label="삭제"
                  title="사진 삭제"
                >
                  ✕
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 라이트박스 */}
      {lightbox && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
          onClick={() => setLightbox(null)}
        >
          {/* 이전 */}
          {lightboxIdx > 0 && (
            <button
              onClick={(e) => { e.stopPropagation(); openByIdx(lightboxIdx - 1); }}
              className="absolute left-4 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/15 text-white hover:bg-white/25"
              aria-label="이전 사진"
            >
              ‹
            </button>
          )}

          {/* 이미지 */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={lightbox}
            alt=""
            className="max-h-[90vh] max-w-full rounded-xl object-contain shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          />

          {/* 다음 */}
          {lightboxIdx < images.length - 1 && (
            <button
              onClick={(e) => { e.stopPropagation(); openByIdx(lightboxIdx + 1); }}
              className="absolute right-4 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/15 text-white hover:bg-white/25"
              aria-label="다음 사진"
            >
              ›
            </button>
          )}

          {/* 닫기 + 카운터 */}
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
    </section>
  );
}
