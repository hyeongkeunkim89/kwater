import Image from "next/image";
import Link from "next/link";
import { WaterHubHeader } from "@/components/WaterHubHeader";
import { WaterHubFooter } from "@/components/WaterHubFooter";
import { waterCenters } from "@/data/centers";

export const metadata = {
  title: "문화관 소개 | K-water 물문화관 홍보 허브",
  description: "물과 자연, 그리고 사람이 함께 호흡하는 복합 문화 체험 공간 K-water 물문화관을 소개합니다.",
};

export default function IntroPage() {
  const themes = [
    {
      title: "역사 (History)",
      desc: "댐과 보의 연대기부터 치수와 이수의 발자취를 통해 대한민국의 생명력을 연결해 온 물의 역사와 만납니다.",
      icon: "📜",
      bg: "bg-sky-50 text-sky-700 border-sky-100",
    },
    {
      title: "생태 (Ecology)",
      desc: "강 유역을 감싸 안은 천혜의 자연 속에서 멸종위기 야생생물과 식물들이 자생하는 살아 숨 쉬는 녹색 지구를 목격합니다.",
      icon: "🌱",
      bg: "bg-emerald-50 text-emerald-700 border-emerald-100",
    },
    {
      title: "기술 (Technology)",
      desc: "세계 최대 규모의 시화호 조력발전소와 스마트 댐 수자원 관리 등 첨단 기후대응 청정기술의 비전을 공유합니다.",
      icon: "⚙️",
      bg: "bg-purple-50 text-purple-700 border-purple-100",
    },
    {
      title: "체험·교육 (Education)",
      desc: "인터랙티브 미디어 아트, 물 과학 실험실, 오감 체험 코너를 통해 아이들부터 어른들까지 온 몸으로 즐기는 에듀테인먼트를 제공합니다.",
      icon: "🎒",
      bg: "bg-amber-50 text-amber-700 border-amber-100",
    },
    {
      title: "건축·조망 (Architecture)",
      desc: "빼어난 수변 경관과 댐 전망대, 조형적 아름다움을 갖춘 랜드마크 건축물에서 자연이 그린 명화를 감상할 수 있습니다.",
      icon: "🏛️",
      bg: "bg-rose-50 text-rose-700 border-rose-100",
    },
  ];

  const showcaseCenters = [
    {
      name: "소양강댐 물문화관",
      location: "강원 춘천시",
      summary: "동양 최대 사력댐의 웅장한 자연 경관과 맑은 소양호의 생태계를 한눈에 감상하는 소통의 장입니다.",
      img: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ea/SoyangDam.JPG/640px-SoyangDam.JPG",
    },
    {
      name: "대청댐 물문화관",
      location: "대전 대덕구",
      summary: "금강 수계와 대청호의 자연 생태, 그리고 댐 주변의 조형 예술과 힐링 산책로를 감상하는 친환경 공간입니다.",
      img: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8d/Daecheong_Dam_after_rain_-_%EB%8C%80%EC%B2%AD%EB%8C%90.jpg/640px-Daecheong_Dam_after_rain_-_%EB%8C%80%EC%B2%AD%EB%8C%90.jpg",
    },
    {
      name: "충주댐 물문화관",
      location: "충북 충주시",
      summary: "국내 최대의 다목적댐인 충주호의 수려한 경관과 스마트 친환경 물관리 시스템을 체험하는 친환경 문화관입니다.",
      img: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/23/Chungju_Lake.jpg/640px-Chungju_Lake.jpg",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col">
      <WaterHubHeader activeNav="intro" />

      {/* 웅장하지만 밝은 히어로 섹션 */}
      <section className="relative h-[55vh] min-h-[400px] w-full flex items-center justify-center overflow-hidden bg-gradient-to-br from-sky-50 to-indigo-50 border-b border-slate-200">
        <Image
          src="/centers/hoengseong.jpg"
          alt="횡성댐 본체 및 횡성댐 물문화관 전경"
          fill
          priority
          className="object-cover brightness-95 scale-102 transition-transform duration-[20s] ease-out hover:scale-100 opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-50 via-slate-50/60 to-transparent" />
        <div className="relative z-10 max-w-4xl px-6 text-center">
          <span className="inline-block rounded-full bg-sky-100 text-sky-800 text-xs font-black px-4 py-1.5 uppercase tracking-widest mb-6">
            Introducing K-water Culture Hub
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-slate-900 leading-tight">
            생명과 미래를 품은<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-600 via-teal-600 to-indigo-600">
              K-water 물문화관
            </span>
          </h1>
          <p className="mt-6 text-sm sm:text-base md:text-lg text-slate-700 max-w-2xl mx-auto font-bold leading-relaxed">
            맑고 풍요로운 강과 호수를 품은 곳에 세워진 물문화관은,<br className="hidden sm:block" />
            물과 사람, 그리고 자연이 만나 조화롭게 어우러지는 복합 문화 예술 체험 공간입니다.
          </p>
        </div>
      </section>

      {/* 문화관 철학 및 정의 */}
      <section className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-xs font-bold tracking-widest text-sky-600 uppercase">
              Brand Philosophy
            </h2>
            <p className="mt-3 text-2xl sm:text-3xl font-black text-slate-900">
              물문화관이 전하는 세 가지 약속
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="rounded-2xl border border-slate-200 bg-slate-50/50 p-8 hover:bg-white hover:shadow-md transition duration-300">
              <span className="text-4xl block mb-4">🌍</span>
              <h3 className="text-lg font-bold text-slate-800 mb-2">지속 가능한 미래 보전</h3>
              <p className="text-xs sm:text-sm text-slate-500 leading-relaxed font-semibold">
                지기적 치수와 친환경 그린 에너지를 통해 기후 위기에 대응하고, 우리의 소중한 강과 생태계를 건강하게 보전하는 미래를 나눕니다.
              </p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50/50 p-8 hover:bg-white hover:shadow-md transition duration-300">
              <span className="text-4xl block mb-4">💡</span>
              <h3 className="text-lg font-bold text-slate-800 mb-2">체험과 배움의 에듀테인먼트</h3>
              <p className="text-xs sm:text-sm text-slate-500 leading-relaxed font-semibold">
                재미있는 과학 원리 실험, 최신 미디어 아트를 접목한 흥미로운 전시기획을 통해 아이들이 창의적인 사고와 미래 기술을 체험하도록 합니다.
              </p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50/50 p-8 hover:bg-white hover:shadow-md transition duration-300">
              <span className="text-4xl block mb-4">🏡</span>
              <h3 className="text-lg font-bold text-slate-800 mb-2">열린 시민 힐링 쉼터</h3>
              <p className="text-xs sm:text-sm text-slate-500 leading-relaxed font-semibold">
                주변 둘레길, 조망 좋은 노천 카페, 계절별 다채로운 시민 참여 문화 프로그램을 제공하여 일상의 따뜻한 휴식과 감동을 나눕니다.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5대 관람 테마 안내 */}
      <section className="py-20 bg-slate-100/60 border-y border-slate-200/80">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-xs font-bold tracking-widest text-sky-600 uppercase">
              Exhibition Themes
            </h2>
            <p className="mt-3 text-2xl sm:text-3xl font-black text-slate-900">
              오감을 사로잡는 5가지 전시 테마
            </p>
          </div>

          <div className="flex flex-col gap-5">
            {themes.map((theme) => (
              <div
                key={theme.title}
                className="flex flex-col sm:flex-row items-start gap-5 p-6 rounded-2xl border border-slate-200/80 bg-white hover:border-sky-300 hover:shadow-sm transition"
              >
                <span className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-xl font-bold ${theme.bg}`}>
                  {theme.icon}
                </span>
                <div>
                  <h3 className="text-base font-bold text-slate-800 mb-1.5">{theme.title}</h3>
                  <p className="text-xs sm:text-sm text-slate-500 leading-relaxed font-medium">{theme.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 문화관 현황 안내 연결 배너 */}
      <section className="py-16 bg-white border-t border-slate-200/80">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <span className="inline-block rounded-full bg-sky-100 px-3.5 py-1 text-xs font-black text-sky-800 uppercase tracking-widest mb-3">
            K-water All 15 Culture Hubs
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            전국 15개 K-water 물문화관 현황 보기
          </h2>
          <p className="mt-3 text-xs sm:text-sm text-slate-500 max-w-xl mx-auto font-semibold leading-relaxed">
            전국 거점 댐 수역에 위치한 15개 물문화관의 운영 시간, 실시간 관람 상태, 층별 주요 공간 및 지도를 현황 페이지에서 탐색해 보세요.
          </p>
          <div className="mt-8">
            <Link
              href="/status"
              className="inline-flex min-h-12 items-center justify-center rounded-xl bg-slate-900 hover:bg-slate-800 text-sm font-bold text-white px-8 transition shadow-lg gap-2"
            >
              <span>🗺️ 전국 15개 물문화관 현황 보러가기</span>
              <span>→</span>
            </Link>
          </div>
        </div>
      </section>

      {/* 가이드 투어 및 예약 연동 배너 */}
      <section className="relative py-20 bg-gradient-to-r from-sky-100 to-indigo-50 border-t border-slate-200/80 overflow-hidden">
        <div className="pointer-events-none absolute inset-0" aria-hidden>
          <div className="absolute top-1/2 left-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-sky-200/30 blur-[100px]" />
        </div>
        <div className="relative max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-2xl sm:text-3xl font-black text-slate-850 tracking-tight leading-tight">
            전문 해설사가 동행하는<br className="sm:hidden" /> 가이드 투어를 예약해 보세요.
          </h2>
          <p className="mt-4 text-xs sm:text-sm text-slate-500 max-w-xl mx-auto leading-relaxed font-semibold">
            단체 및 가족 관람객을 대상으로 한 전문 도슨트 해설 투어가 무료로 제공됩니다. 원하는 물문화관을 선택하고 온라인 예약을 진행해 보세요.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/reserve"
              className="w-full sm:w-auto inline-flex min-h-12 items-center justify-center rounded-xl bg-sky-500 text-white font-bold hover:bg-sky-400 text-sm px-8 transition shadow-md shadow-sky-500/10"
            >
              무료 가이드 투어 예약하기
            </Link>
            <Link
              href="/feedback"
              className="w-full sm:w-auto inline-flex min-h-12 items-center justify-center rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-bold text-sm px-8 transition"
            >
              의견 및 소통창구 바로가기
            </Link>
          </div>
        </div>
      </section>

      <WaterHubFooter />
    </div>
  );
}
