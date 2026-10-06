import type { Metadata } from "next";
import Link from "next/link";
import { WaterHubHeader } from "@/components/WaterHubHeader";
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
    <div className="min-h-screen bg-slate-50/50 text-slate-900">
      <WaterHubHeader activeNav="news" />

      {/* 서브페이지 대표 헤더 배너 (라이트 모드 톤 앤 매너 통일) */}
      <div className="bg-gradient-to-r from-sky-50/90 via-white to-blue-50/50 border-b border-sky-100/90 py-10 sm:py-14 px-6 sm:px-10 shadow-2xs">
        <div className="mx-auto max-w-7xl">
          {/* 브레드크럼 */}
          <div className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-500 mb-4">
            <Link href="/main" className="text-[#3054b0] hover:text-sky-900 transition">
              ← 홈으로
            </Link>
            <span>/</span>
            <span className="text-slate-500">새소식</span>
            <span>/</span>
            <span className="text-slate-900 font-bold">물 이야기 갤러리</span>
          </div>

          <div className="max-w-3xl">
            <span className="inline-block rounded-full bg-sky-100/90 px-3 py-1 text-xs font-black text-[#3054b0] mb-3 border border-sky-200/80">
              COMMUNITY & GALLERY
            </span>
            <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              물 이야기 갤러리
            </h1>
            <p className="mt-3.5 text-base sm:text-lg leading-relaxed text-slate-600 font-medium">
              둘레길·전망대·호반 산책로에서 마주친 풍경을 사진과 짧은 글로 남겨 주세요.
              방문객들의 진솔한 추억과 생생한 후기가 모이는 수변 문화 소통 공간입니다.
            </p>
          </div>
        </div>
      </div>

      <main className="mx-auto max-w-7xl px-6 py-10 sm:px-10 sm:py-14">
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
    </div>
  );
}
