"use client";

import { useState } from "react";
import Link from "next/link";

type BoardItem = {
  id: string;
  title: string;
  date: string;
  centerName?: string;
};

type StoryItem = {
  id: string;
  imageSrc: string;
  caption: string;
  nickname: string;
  centerName: string;
};

type Props = {
  news: BoardItem[];
  events: BoardItem[];
  feedbacks: BoardItem[];
  stories: StoryItem[];
};

type TabType = "news" | "events" | "feedback" | "stories";

export function HomeTabbedBoard({ news, events, feedbacks, stories }: Props) {
  const [activeTab, setActiveTab] = useState<TabType>("news");

  const tabs = [
    { key: "news", label: "물문화관 소식", path: "/news" },
    { key: "events", label: "참여형 이벤트", path: "/events" },
    { key: "feedback", label: "소통창구 질의", path: "/feedback" },
    { key: "stories", label: "물 이야기 갤러리", path: "/mul-iyagi" },
  ] as const;

  const getActiveList = () => {
    switch (activeTab) {
      case "news":
        return news;
      case "events":
        return events;
      case "feedback":
        return feedbacks;
      default:
        return [];
    }
  };

  const activeList = getActiveList();
  const currentTab = tabs.find((t) => t.key === activeTab)!;

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 shadow-sm shadow-slate-100">
      {/* 탭 헤더 및 더보기 링크 */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-slate-100 pb-3 gap-3">
        <div className="flex flex-wrap gap-1.5">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={[
                "min-h-10 px-4 py-2 text-sm font-bold rounded-xl transition duration-150",
                activeTab === tab.key
                  ? "bg-sky-500 text-white shadow-sm shadow-sky-500/10"
                  : "text-slate-500 hover:bg-slate-50 hover:text-slate-800",
              ].join(" ")}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <Link
          href={currentTab.path}
          className="text-xs font-bold text-sky-600 hover:text-sky-700 transition hover:underline self-end sm:self-auto"
        >
          더보기 +
        </Link>
      </div>

      {/* 탭 본문 영역 */}
      <div className="mt-4 min-h-[220px]">
        {activeTab === "stories" ? (
          /* 갤러리 그리드 */
          stories.length === 0 ? (
            <div className="flex h-[200px] flex-col items-center justify-center text-slate-400 text-sm">
              등록된 사진이 없습니다.
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-5">
              {stories.slice(0, 5).map((story) => (
                <Link
                  key={story.id}
                  href="/mul-iyagi"
                  className="group flex flex-col overflow-hidden rounded-xl border border-slate-200/60 bg-white shadow-sm hover:shadow-md transition duration-200"
                >
                  <div className="relative aspect-square w-full overflow-hidden bg-slate-50">
                    <img
                      src={story.imageSrc}
                      alt={story.caption}
                      className="h-full w-full object-cover group-hover:scale-105 transition duration-300"
                    />
                  </div>
                  <div className="p-2.5 flex-1 flex flex-col justify-between">
                    <span className="text-[9px] font-bold text-sky-600 truncate block">
                      {story.centerName}
                    </span>
                    <p className="text-xs font-semibold text-slate-700 line-clamp-1 mt-0.5">
                      {story.caption}
                    </p>
                    <span className="text-[9px] text-slate-400 font-medium block mt-1.5">
                      by {story.nickname}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )
        ) : (
          /* 텍스트 게시판 리스트 */
          activeList.length === 0 ? (
            <div className="flex h-[200px] flex-col items-center justify-center text-slate-400 text-sm">
              등록된 게시물이 없습니다.
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {activeList.map((item) => (
                <Link
                  key={item.id}
                  href={`${currentTab.path}?id=${item.id}`}
                  className="flex items-center justify-between py-3.5 hover:bg-slate-50/50 px-2 rounded-lg transition group"
                >
                  <div className="flex items-center gap-3 min-w-0 pr-4">
                    {item.centerName && (
                      <span className="shrink-0 text-[10px] font-extrabold text-sky-700 bg-sky-50 px-2 py-0.5 rounded">
                        {item.centerName}
                      </span>
                    )}
                    <span className="text-sm font-bold text-slate-700 group-hover:text-sky-600 truncate">
                      {item.title}
                    </span>
                  </div>
                  <span className="shrink-0 text-xs font-medium text-slate-400 group-hover:text-slate-500 font-semibold">
                    {item.date}
                  </span>
                </Link>
              ))}
            </div>
          )
        )}
      </div>
    </div>
  );
}
