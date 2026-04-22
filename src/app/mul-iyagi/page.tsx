import type { Metadata } from "next";
import Link from "next/link";
import { WaterHubFooter } from "@/components/WaterHubFooter";
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
    <div className="min-h-screen bg-white text-slate-900">
      <WaterHubHeader activeNav="stories" />

      <div className="border-b border-slate-200 bg-slate-50/80">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-3 px-6 py-3 text-sm text-slate-600 sm:px-10">
          <Link href="/" className="font-medium text-sky-700 transition hover:text-sky-900">
            ← 홈으로
          </Link>
          <span className="text-slate-300" aria-hidden>
            /
          </span>
          <span className="text-slate-500">물 이야기</span>
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

        <header className="mb-10 max-w-3xl sm:mb-12">
          <p className="text-xs font-bold uppercase tracking-widest text-sky-600">User stories</p>
          <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
            물 이야기 갤러리
          </h1>
          <p className="mt-4 text-base leading-relaxed text-slate-600 sm:text-lg">
            둘레길·전망대·호반 산책로에서 마주친 풍경을 사진과 짧은 글로 남겨 주세요. 다른 방문객의 동선과
            계절감을 참고할 수 있고, 진솔한 후기는 어떤 홍보보다 설득력 있습니다.
          </p>
          <p className="mt-3 text-sm leading-relaxed text-slate-500">
            방문객이 남긴 사진과 짧은 이야기가 이곳에 모입니다. 타인을 식별할 수 있는 정보가 담기지 않게 올려 주시고,
            저작권·초상권을 존중해 주세요. 운영 정책에 맞지 않는 게시물은 안내 없이 삭제될 수 있습니다.
          </p>
        </header>

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
