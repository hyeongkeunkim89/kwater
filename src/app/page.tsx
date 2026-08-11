import Link from "next/link";
import { HeroSliderWrapper } from "@/components/HeroSliderWrapper";
import { WaterHubFooter } from "@/components/WaterHubFooter";
import { WaterHubHeader } from "@/components/WaterHubHeader";
import { sidoList, waterCenters } from "@/data/centers";
import { listNewsFromDb } from "@/lib/newsDb";
import { listEventsFromDb } from "@/lib/eventsDb";
import { listFeedbacksFromDb } from "@/lib/feedbacksDb";
import { listWaterStoriesFromDb } from "@/lib/waterStoriesDb";
import { HomeTabbedBoard } from "@/components/HomeTabbedBoard";

export const revalidate = 0; // ensure fresh data on GNB-style landing page

export default async function Home() {
  let newsList: { id: string; title: string; date: string; centerName?: string }[] = [];
  let eventsList: { id: string; title: string; date: string; centerName?: string }[] = [];
  let feedbacksList: { id: string; title: string; date: string; centerName?: string }[] = [];
  let storiesList: { id: string; imageSrc: string; caption: string; nickname: string; centerName: string }[] = [];

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, "0")}.${String(
      d.getDate()
    ).padStart(2, "0")}`;
  };

  try {
    const rawNews = await listNewsFromDb();
    newsList = rawNews.map((n) => ({
      id: n.id,
      title: n.title,
      date: formatDate(n.createdAt),
      centerName: n.centerName,
    }));
  } catch (e) {
    console.error("Failed to load news", e);
  }

  try {
    const rawEvents = await listEventsFromDb();
    eventsList = rawEvents.map((ev) => ({
      id: ev.id,
      title: ev.title,
      date: `${formatDate(ev.startDate)} ~ ${formatDate(ev.endDate)}`,
      centerName: ev.centerName,
    }));
  } catch (e) {
    console.error("Failed to load events", e);
  }

  try {
    const rawFeedbacks = await listFeedbacksFromDb();
    feedbacksList = rawFeedbacks.map((f) => ({
      id: f.id,
      title: f.title + (f.isPrivate ? " 🔒" : ""),
      date: formatDate(f.createdAt),
      centerName: f.centerName,
    }));
  } catch (e) {
    console.error("Failed to load feedbacks", e);
  }

  try {
    const rawStories = await listWaterStoriesFromDb();
    storiesList = rawStories.map((s) => ({
      id: s.id,
      imageSrc: s.imageSrc,
      caption: s.caption,
      nickname: s.nickname,
      centerName: s.centerName,
    }));
  } catch (e) {
    console.error("Failed to load stories", e);
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col justify-between">
      <WaterHubHeader showStaffConsoleLink />

      {/* 1. 메인 히어로 슬라이더 (국립중앙과학관 스타일 - 화면 고정 높이형 메인 비주얼) */}
      <section
        aria-label="물문화관 소개 슬라이드쇼"
        className="h-[460px] md:h-[560px] lg:h-[620px] w-full shrink-0 relative overflow-hidden bg-slate-50"
      >
        <HeroSliderWrapper />
      </section>

      {/* 메인 내용 영역 */}
      <main className="mx-auto max-w-7xl w-full px-6 py-6 sm:py-8 space-y-8 sm:space-y-10 flex-1">
        
        {/* 2. 퀵 메뉴 예약 카드 (핵심 행동 유도 3단 둥근 카드 그리드) */}
        <section aria-label="빠른 메뉴 및 예약 서비스">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            {[
              {
                title: "가이드 투어 예약",
                desc: "전국 15대 물문화관에서 제공하는 다채로운 가이드 투어 및 해설 서비스를 신청해 보세요.",
                btnLabel: "투어 예약하러 가기",
                icon: "📅",
                path: "/reserve",
                bg: "from-sky-500/10 to-indigo-500/5 hover:from-sky-500/15 hover:to-indigo-500/10 border-sky-100",
                btnBg: "bg-sky-500 hover:bg-sky-400 text-white",
              },
              {
                title: "새로운 문화행사 & 이벤트",
                desc: "본사 주관 공통 이벤트 및 지점별로 열리는 다양한 생태 체험 프로그램에 참여해 보세요.",
                btnLabel: "진행중인 이벤트 보기",
                icon: "🎈",
                path: "/events",
                bg: "from-teal-500/10 to-sky-500/5 hover:from-teal-500/15 hover:to-sky-500/10 border-teal-100",
                btnBg: "bg-teal-600 hover:bg-teal-500 text-white",
              },
              {
                title: "이달의 사진전 (물 이야기)",
                desc: "아름다운 댐 산책로와 자연 경관을 걷고 찍은 소중한 사진들을 방문자 갤러리에 공유해 보세요.",
                btnLabel: "사진 올리고 참여하기",
                icon: "📷",
                path: "/mul-iyagi",
                bg: "from-amber-500/10 to-orange-500/5 hover:from-amber-500/15 hover:to-orange-500/10 border-amber-100",
                btnBg: "bg-amber-500 hover:bg-amber-400 text-white",
              },
            ].map((card) => (
              <div
                key={card.title}
                className={[
                  "flex flex-col justify-between p-6 sm:p-8 rounded-2xl border bg-gradient-to-br shadow-sm hover:shadow-md transition duration-300 transform hover:-translate-y-0.5",
                  card.bg,
                ].join(" ")}
              >
                <div>
                  <span className="text-3xl block mb-4" role="img" aria-label={card.title}>
                    {card.icon}
                  </span>
                  <h3 className="text-lg font-black text-slate-800 tracking-tight leading-snug">
                    {card.title}
                  </h3>
                  <p className="mt-2 text-xs sm:text-sm text-slate-500 leading-relaxed font-semibold">
                    {card.desc}
                  </p>
                </div>
                <div className="mt-6">
                  <Link
                    href={card.path}
                    className={[
                      "inline-flex min-h-11 items-center justify-center rounded-xl text-xs font-black px-5 transition w-full text-center shadow-sm",
                      card.btnBg,
                    ].join(" ")}
                  >
                    {card.btnLabel}
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 3. 통합 탭형 소식 게시판 (공지/소식/소통창구 통합 보드) */}
        <section aria-label="물문화관 주요 소식 및 소통창구">
          <HomeTabbedBoard
            news={newsList}
            events={eventsList}
            feedbacks={feedbacksList}
            stories={storiesList}
          />
        </section>

        {/* 4. 전국 거점 현황 요약 및 바로가기 바 */}
        <section
          aria-label="물문화관 전국 현황 현황판"
          className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6"
        >
          <div className="flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left">
            <span className="text-3xl" role="img" aria-label="지도">🗺️</span>
            <div>
              <h4 className="text-base font-black text-slate-800">
                전국 15대 댐 물문화관 현황지도
              </h4>
              <p className="text-xs text-slate-500 mt-1 font-semibold">
                전국 곳곳의 댐 수역에 아름답게 개설된 15개의 물문화관 운영 정보와 관람 상태를 바로 확인해 보세요.
              </p>
            </div>
          </div>
          <div className="shrink-0 flex items-center gap-6 divide-x divide-slate-100">
            <div className="px-4 text-center">
              <span className="text-lg font-black text-sky-500 tabular-nums">{waterCenters.length}개소</span>
              <span className="text-[10px] text-slate-400 font-semibold block mt-0.5">물문화관 수</span>
            </div>
            <div className="px-4 text-center">
              <span className="text-lg font-black text-sky-500 tabular-nums">{sidoList.length}개</span>
              <span className="text-[10px] text-slate-400 font-semibold block mt-0.5">광역 시·도 거점</span>
            </div>
            <div className="pl-6">
              <Link
                href="/status"
                className="inline-flex min-h-11 items-center justify-center rounded-xl bg-slate-900 hover:bg-slate-800 text-xs font-bold text-white px-5 transition"
              >
                현황지도 바로보기 →
              </Link>
            </div>
          </div>
        </section>

      </main>

      <WaterHubFooter />
    </div>
  );
}
