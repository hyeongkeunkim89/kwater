import { WaterHubHeader } from "@/components/WaterHubHeader";
import { WaterHubFooter } from "@/components/WaterHubFooter";
import { listEventsFromDb, getEventDetailFromDb } from "@/lib/eventsDb";
import { isWaterStoriesLive } from "@/lib/storiesConfig";
import { EventBoard } from "@/components/EventBoard";

export const revalidate = 0; // Disable caching to ensure admins see changes instantly

type Props = {
  searchParams: Promise<{ center?: string; type?: string; id?: string }>;
};

export default async function EventsPage({ searchParams }: Props) {
  const { center = "all", type = "all", id } = await searchParams;

  // Fetch data
  const rawEvents = await listEventsFromDb(center === "all" ? undefined : center);
  const storiesLive = isWaterStoriesLive();

  // Filter events based on type: "all" | "hq" | "centers"
  let filteredEvents = rawEvents;
  if (type === "hq") {
    filteredEvents = rawEvents.filter((ev) => ev.isHeadquarters);
  } else if (type === "centers") {
    filteredEvents = rawEvents.filter((ev) => !ev.isHeadquarters);
  }

  // Fetch detail if id is provided
  let selectedEvent = null;
  if (id) {
    selectedEvent = await getEventDetailFromDb(id);
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col justify-between">
      <WaterHubHeader activeNav="events" />

      {/* 히어로 타이틀 */}
      <div className="relative overflow-hidden bg-gradient-to-r from-sky-50 to-indigo-50 border-b border-slate-200/80 shrink-0">
        <div className="pointer-events-none absolute inset-0" aria-hidden>
          <div className="absolute right-1/4 top-0 h-48 w-48 rounded-full bg-teal-50/5 blur-[80px]" />
        </div>
        <div className="relative mx-auto max-w-7xl px-6 py-12 sm:px-8 text-center sm:text-left">
          <span className="text-xs font-bold uppercase tracking-widest text-sky-655 font-extrabold text-sky-600">
            EXPERIENCE & EVENTS
          </span>
          <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
            체험 및 이벤트
          </h1>
          <p className="mt-2 text-sm text-slate-500 leading-relaxed max-w-xl font-semibold">
            K-water 본사 및 전국 물문화관에서 운영하는 다양한 시민 체험형 생태·환경·과학 이벤트 및 프로그램을 소개합니다.
          </p>
        </div>
      </div>

      <main className="mx-auto max-w-7xl w-full px-6 py-10 sm:px-8 flex-1">
        <EventBoard
          filteredEvents={filteredEvents}
          selectedEvent={selectedEvent}
          center={center}
          type={type}
          storiesLive={storiesLive}
        />
      </main>

      <WaterHubFooter />
    </div>
  );
}
