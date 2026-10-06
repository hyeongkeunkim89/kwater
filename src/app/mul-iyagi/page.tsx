import type { Metadata } from "next";
import { WaterHubHeader } from "@/components/WaterHubHeader";
import { WaterHubFooter } from "@/components/WaterHubFooter";
import { WaterStoriesClient } from "@/components/WaterStoriesClient";
import { editorialPhotoOfMonth } from "@/data/water-stories-spotlight";
import { isGalleryUploadBlockedOnVercel, isWaterStoriesLive } from "@/lib/storiesConfig";
import { listWaterStoriesFromDb } from "@/lib/waterStoriesDb";
import type { WaterStory } from "@/types/waterStory";

export const metadata: Metadata = {
  title: "물 이야기 갤러리 | K-water 물문화관 홍보 허브",
  description:
    "물문화관 주변 산책로와 풍경 사진을 방문객이 나누는 참여형 갤러리입니다. 이달의 사진 이벤트·생생한 후기로 검색과 홍보에 도움이 됩니다.",
  openGraph: {
    title: "물 이야기 갤러리 | 물문화관 홍보 허브",
    description:
      "전국 물문화관 주변의 걸음과 풍경을 사진과 짧은 글로 남겨 보세요. 이달의 사진 이벤트와 연동할 수 있습니다.",
  },
};

type Props = { searchParams: Promise<{ center?: string }> };

export default async function MulIyagiPage({ searchParams }: Props) {
  const { center } = await searchParams;
  const initialCenter = center && /^[a-zA-Z0-9_-]+$/.test(center) ? center : "";

  const storiesLive = isWaterStoriesLive();
  const uploadBlocked = isGalleryUploadBlockedOnVercel();
  let initialStories: WaterStory[] = [];
  if (storiesLive) {
    try {
      initialStories = await listWaterStoriesFromDb();
    } catch {
      initialStories = [];
    }
  }

  const jsonLdPage = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "물 이야기 갤러리",
    description:
      "K-water 물문화관 방문객 참여형 사진 갤러리. 산책로·전망·계절 풍경을 공유하고 이달의 사진 이벤트와 연동할 수 있습니다.",
    isPartOf: { "@type": "WebSite", name: "K-water 물문화관 홍보 허브" },
  };

  const itemListJsonLd =
    storiesLive && initialStories.length > 0
      ? {
          "@context": "https://schema.org",
          "@type": "ItemList",
          name: "물 이야기 최근 사진",
          numberOfItems: Math.min(initialStories.length, 24),
          itemListElement: initialStories.slice(0, 24).map((s, i) => ({
            "@type": "ListItem",
            position: i + 1,
            item: {
              "@type": "ImageObject",
              contentUrl: s.imageSrc,
              name: s.centerName,
              description: s.caption.slice(0, 200),
            },
          })),
        }
      : null;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col justify-between">
      <WaterHubHeader activeNav="news" />

      {/* 히어로 타이틀 (소식/공지사항 페이지와 100% 동일한 헤더 디자인 적용) */}
      <div className="relative overflow-hidden bg-gradient-to-r from-sky-50 to-indigo-50 border-b border-slate-200/80 shrink-0">
        <div className="pointer-events-none absolute inset-0" aria-hidden>
          <div className="absolute right-1/4 top-0 h-48 w-48 rounded-full bg-sky-500/5 blur-[80px]" />
        </div>
        <div className="relative mx-auto max-w-7xl px-6 py-12 sm:px-8 text-center sm:text-left">
          <span className="text-xs font-bold uppercase tracking-widest text-sky-600">
            COMMUNITY &amp; GALLERY
          </span>
          <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
            물 이야기 갤러리
          </h1>
          <p className="mt-2 text-sm text-slate-500 leading-relaxed max-w-xl font-semibold">
            K-water 물문화관 및 각 지점 담당자가 전하는 생생한 방문 이야기와 풍경을 공유합니다.
          </p>
        </div>
      </div>

      <main className="mx-auto max-w-7xl w-full px-6 py-10 sm:px-8 flex-1">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdPage) }}
        />
        {itemListJsonLd && (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }}
          />
        )}

        <WaterStoriesClient
          editorialSpotlight={editorialPhotoOfMonth}
          initialCenterId={initialCenter}
          storiesLive={storiesLive}
          uploadBlocked={uploadBlocked}
          initialStories={initialStories}
        />
      </main>

      <WaterHubFooter />
    </div>
  );
}
