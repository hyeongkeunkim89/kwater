"use client";

import { useEffect, useState } from "react";
import type { WaterStory } from "@/types/waterStory";
import { getAllWaterStories } from "@/lib/waterStories";

export function RecentWaterStories({ storiesLive }: { storiesLive: boolean }) {
  const [recentStories, setRecentStories] = useState<WaterStory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      if (storiesLive) {
        try {
          const res = await fetch("/api/stories");
          if (res.ok) {
            const data = await res.json();
            setRecentStories(Array.isArray(data) ? data.slice(0, 4) : []);
          }
        } catch (e) {
          console.error("Failed to load stories from server", e);
        } finally {
          setLoading(false);
        }
      } else {
        // Fallback to client-side localStorage
        setRecentStories(getAllWaterStories().slice(0, 4));
        setLoading(false);
      }
    };
    void load();
  }, [storiesLive]);

  if (loading) {
    return <div className="text-center py-6 text-slate-400 text-xs">불러오는 중...</div>;
  }

  return (
    <div className="mt-6 pt-6 border-t border-slate-100">
      <div className="flex items-center justify-between mb-4">
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
          실시간 참여 작품
        </span>
        <span className="text-[10px] text-slate-400 font-medium">
          최근 {recentStories.length}개 업로드 건
        </span>
      </div>
      {recentStories.length === 0 ? (
        <p className="text-xs text-slate-400 italic">아직 등록된 사진이 없습니다. 첫 번째 사진을 올려주세요!</p>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {recentStories.map((story) => (
            <div
              key={story.id}
              className="group relative aspect-square rounded-xl overflow-hidden bg-slate-100 border border-slate-200/60"
            >
              <img
                src={story.imageSrc}
                alt={story.caption}
                className="h-full w-full object-cover group-hover:scale-105 transition duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-transparent opacity-0 group-hover:opacity-100 transition duration-200 flex flex-col justify-end p-2.5 text-white">
                <span className="text-[9px] font-black text-sky-400">{story.centerName}</span>
                <p className="text-[10px] font-bold truncate mt-0.5">&quot;{story.caption}&quot;</p>
                <span className="text-[8px] text-white/50 mt-1">by {story.nickname}</span>
              </div>
              {story.isPhotoOfMonth && (
                <span className="absolute top-2 left-2 rounded bg-amber-500 text-[8px] font-black text-white px-1.5 py-0.5 shadow-sm">
                  이달의 사진
                </span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
