import { WaterHubHeader } from "@/components/WaterHubHeader";
import { WaterHubFooter } from "@/components/WaterHubFooter";
import { listNewsFromDb, getNewsDetailFromDb } from "@/lib/newsDb";
import { NewsBoard } from "@/components/NewsBoard";

export const revalidate = 0; // Disable caching to ensure admins/staff see changes instantly

type Props = {
  searchParams: Promise<{ center?: string; id?: string }>;
};

export default async function NewsPage({ searchParams }: Props) {
  const { center = "all", id } = await searchParams;

  // Fetch data
  const newsList = await listNewsFromDb(center);

  // If id is specified, fetch the news detail
  let selectedNews = null;
  if (id) {
    selectedNews = await getNewsDetailFromDb(id);
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col justify-between">
      <WaterHubHeader activeNav="news" />

      {/* 히어로 타이틀 */}
      <div className="relative overflow-hidden bg-gradient-to-r from-sky-50 to-indigo-50 border-b border-slate-200/80 shrink-0">
        <div className="pointer-events-none absolute inset-0" aria-hidden>
          <div className="absolute right-1/4 top-0 h-48 w-48 rounded-full bg-sky-500/5 blur-[80px]" />
        </div>
        <div className="relative mx-auto max-w-7xl px-6 py-12 sm:px-8 text-center sm:text-left">
          <span className="text-xs font-bold uppercase tracking-widest text-sky-600">
            NOTICE & NEWS
          </span>
          <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
            소식 및 공지사항
          </h1>
          <p className="mt-2 text-sm text-slate-500 leading-relaxed max-w-xl font-semibold">
            K-water 물문화관 및 각 지점 담당자가 전하는 새로운 소식과 주요 공지사항을 안내합니다.
          </p>
        </div>
      </div>

      <main className="mx-auto max-w-7xl w-full px-6 py-10 sm:px-8 flex-1">
        <NewsBoard newsList={newsList} selectedNews={selectedNews} center={center} />
      </main>

      <WaterHubFooter />
    </div>
  );
}
