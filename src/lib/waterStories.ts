/** 물 이야기 백엔드 미구성 시 브라우저 전용 임시 저장입니다. 배포 환경에서는 서버 API를 사용합니다. */
import type { WaterStory } from "@/types/waterStory";

const STORAGE_STORIES = "kwm_water_stories";
const STORAGE_PHOTO_OF_MONTH = "kwm_photo_of_month_story_id";

function loadStories(): WaterStory[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(window.localStorage.getItem(STORAGE_STORIES) ?? "[]");
  } catch {
    return [];
  }
}

function saveStories(list: WaterStory[]) {
  window.localStorage.setItem(STORAGE_STORIES, JSON.stringify(list));
}

export function getAllWaterStories(): WaterStory[] {
  return loadStories();
}

export function addWaterStory(
  input: Omit<WaterStory, "id" | "createdAt">,
): WaterStory {
  const list = loadStories();
  const story: WaterStory = {
    ...input,
    id: `ws-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    createdAt: new Date().toISOString(),
  };
  saveStories([story, ...list]);
  return story;
}

export function deleteWaterStory(id: string) {
  const list = loadStories().filter((s) => s.id !== id);
  saveStories(list);
  const pom = getPhotoOfMonthStoryId();
  if (pom === id) {
    window.localStorage.removeItem(STORAGE_PHOTO_OF_MONTH);
  }
}

export function getPhotoOfMonthStoryId(): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(STORAGE_PHOTO_OF_MONTH);
}

export function setPhotoOfMonthStoryId(id: string | null) {
  if (typeof window === "undefined") return;
  if (id) window.localStorage.setItem(STORAGE_PHOTO_OF_MONTH, id);
  else window.localStorage.removeItem(STORAGE_PHOTO_OF_MONTH);
}
