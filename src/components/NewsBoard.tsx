"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { News } from "@/types/news";
import { CenterFilterSelect } from "@/components/CenterFilterSelect";
import { NewsWriteModal } from "@/components/NewsWriteModal";

type Props = {
  newsList: News[];
  selectedNews: News | null;
  center: string;
};

export function NewsBoard({ newsList, selectedNews, center }: Props) {
  const [showWriteModal, setShowWriteModal] = useState(false);
  const router = useRouter();

  // Format date helper
  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, "0")}.${String(
      d.getDate()
    ).padStart(2, "0")}`;
  };

  const handleWriteSuccess = () => {
    router.refresh(); // refresh Server Component data
  };

  return (
    <>
      {selectedNews ? (
        /* ================= 상세 보기 화면 ================= */
        <div className="mx-auto max-w-3xl rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-10">
          <div className="border-b border-slate-100 pb-6">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-block rounded bg-sky-50 text-xs font-bold text-sky-700 px-2.5 py-1">
                {selectedNews.centerName}
              </span>
              {selectedNews.isPinned && (
                <span className="inline-block rounded bg-rose-50 text-xs font-bold text-rose-700 px-2 py-0.5 ring-1 ring-rose-200">
                  중요 공지
                </span>
              )}
            </div>
            <h2 className="mt-4 text-2xl font-black tracking-tight text-slate-900 sm:text-3xl leading-snug">
              {selectedNews.title}
            </h2>
            <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-400 font-medium">
              <span>등록일: {formatDate(selectedNews.createdAt)}</span>
              <span className="hidden sm:inline text-slate-200">•</span>
              <span>조회수: {selectedNews.views}</span>
            </div>
          </div>

          {/* 대표 이미지 */}
          {selectedNews.imageUrl && (
            <div className="my-8 overflow-hidden rounded-xl border border-slate-100 bg-slate-50">
              <img
                src={selectedNews.imageUrl}
                alt={selectedNews.title}
                className="max-h-[450px] w-full object-contain mx-auto"
              />
            </div>
          )}

          {/* 본문 */}
          <div className="prose prose-slate max-w-none text-sm sm:text-base leading-relaxed text-slate-700 whitespace-pre-wrap py-4 font-medium">
            {selectedNews.content}
          </div>

          <div className="mt-8 pt-8 border-t border-slate-100 text-center">
            <Link
              href={`/news${center !== "all" ? `?center=${center}` : ""}`}
              className="inline-flex min-h-11 items-center justify-center rounded-xl bg-slate-900 hover:bg-slate-800 text-sm font-bold text-white px-6 transition"
            >
              목록으로 돌아가기
            </Link>
          </div>
        </div>
      ) : (
        /* ================= 목록 화면 ================= */
        <div className="space-y-8">
          {/* 필터 및 작성 버튼 */}
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            <div className="flex flex-col gap-2 w-full max-w-xs">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                문화관 선택
              </label>
              <CenterFilterSelect includeHeadquarters={true} />
            </div>
            <button
              type="button"
              onClick={() => setShowWriteModal(true)}
              className="inline-flex min-h-11 items-center justify-center rounded-xl bg-sky-500 hover:bg-sky-400 text-sm font-bold text-white px-5 transition shadow-md shadow-sky-500/10 self-start sm:self-auto"
            >
              ✍️ 새 소식 등록하기
            </button>
          </div>

          {/* 소식 카드 리스트 */}
          {newsList.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-200 bg-white py-16 text-center text-slate-400">
              <span className="text-4xl block mb-3">📰</span>
              등록된 소식 또는 공지사항이 없습니다.
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {newsList.map((news) => (
                <Link
                  key={news.id}
                  href={`/news?id=${news.id}${center !== "all" ? `&center=${center}` : ""}`}
                  className="group flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-5 shadow-sm hover:border-sky-400 hover:shadow-md transition duration-200"
                >
                  <div>
                    {/* 태그 */}
                    <div className="flex items-center gap-2">
                      <span className="inline-block rounded bg-sky-50 text-[10px] font-bold text-sky-700 px-2 py-0.5">
                        {news.centerName}
                      </span>
                      {news.isPinned && (
                        <span className="inline-block rounded bg-rose-50 text-[10px] font-bold text-rose-700 px-2 py-0.5 ring-1 ring-rose-200">
                          공지
                        </span>
                      )}
                    </div>

                    {/* 제목 */}
                    <h3 className="mt-3 text-base font-bold text-slate-900 group-hover:text-sky-600 line-clamp-2 leading-snug">
                      {news.title}
                    </h3>

                    {/* 본문 프리뷰 */}
                    <p className="mt-2 text-xs text-slate-500 line-clamp-3 leading-relaxed font-semibold">
                      {news.content}
                    </p>
                  </div>

                  {/* 하단 메타 */}
                  <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400 font-medium">
                    <span>{formatDate(news.createdAt)}</span>
                    <span>조회 {news.views}</span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 새 글 작성 모달 */}
      <NewsWriteModal
        isOpen={showWriteModal}
        onClose={() => setShowWriteModal(false)}
        onSuccess={handleWriteSuccess}
      />
    </>
  );
}
