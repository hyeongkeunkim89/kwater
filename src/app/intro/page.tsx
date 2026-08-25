import Image from "next/image";
import Link from "next/link";
import { WaterHubHeader } from "@/components/WaterHubHeader";
import { WaterHubFooter } from "@/components/WaterHubFooter";

export const metadata = {
  title: "문화관 소개 | K-water 물문화관 홍보 허브",
  description: "물과 자연, 그리고 사람이 함께 호흡하는 복합 문화 체험 공간 K-water 물문화관을 소개합니다.",
};

export default function IntroPage() {
  const coreThemes = [
    {
      code: "01 · TECHNOLOGY",
      title: "기술 (Technology)",
      icon: "⚙️",
      bg: "bg-cyan-50 text-cyan-800 border-cyan-200",
      desc: "세계 최대 규모의 시화호 조력발전소(시화나래 달전망대)와 첨단 스마트 댐 수자원 관리, 합천호 수상태양광 등 기후대응 청정기술의 미래 비전을 제시합니다.",
      centers: [
        {
          name: "시화나래 조력문화관 · 달전망대",
          tag: "경기 안산시",
          desc: "조석(밀물·썰물)을 이용한 세계 최대 시화호 조력발전의 원리와 바다 에너지 체험 및 360도 유리전망대 조망",
        },
        {
          name: "충주댐 물문화관",
          tag: "충북 충주시",
          desc: "국내 최대 다목적댐과 첨단 미디어파사드 연출, 3D 디지털 수자원 모니터링 시스템 체험",
        },
      ],
    },
    {
      code: "02 · ECOLOGY",
      title: "생태 (Ecology)",
      icon: "🌿",
      bg: "bg-emerald-50 text-emerald-800 border-emerald-200",
      desc: "금강 수계 대청호, 소양호, 변산반도 국립공원 등 천혜의 자연 속에서 멸종위기 야생 동식물과 수생태계의 생명력을 보호하고 전파합니다.",
      centers: [
        {
          name: "대청댐 물문화관",
          tag: "대전 대덕구",
          desc: "금강 민물고기 생태 수족관과 대청호 청정 자연 생태계 보전 교육",
        },
        {
          name: "부안댐 물문화관",
          tag: "전북 부안군",
          desc: "변산반도 국립공원 산림·호수 생태 보호 및 자생 동식물 생태 학습",
        },
      ],
    },
    {
      code: "03 · HISTORY",
      title: "역사 (History)",
      icon: "🏛️",
      bg: "bg-amber-50 text-amber-800 border-amber-200",
      desc: "대한민국 근대 치수 사업의 발자취와 댐 건설로 정든 고향을 떠나야 했던 수몰지 주민들의 삶의 기록과 사료를 보존합니다.",
      centers: [
        {
          name: "횡성댐 물문화관 (망향의 동산)",
          tag: "강원 횡성군",
          desc: "수몰지 5개 리 주민들의 옛 사진·유물 보존 및 횡성호수길 망향 탐방",
        },
        {
          name: "소양강댐 물문화관",
          tag: "강원 춘천시",
          desc: "동양 최대 사급댐 축조 역사와 근대 수자원 개발 60년 사료관",
        },
      ],
    },
    {
      code: "04 · CULTURE & ARTS",
      title: "문화 (Culture & Arts)",
      icon: "🎭",
      bg: "bg-purple-50 text-purple-800 border-purple-200",
      desc: "진주 남강 유등축제 연계 수변 갤러리, 디아크 레저 미디어아트, 김천부항댐 짚와이어 등 자연과 어우러지는 다채로운 문화예술 쉼터입니다.",
      centers: [
        {
          name: "남강댐 물문화관",
          tag: "경남 진주시",
          desc: "진주 남강 유등 축제 연계 수변 기획 미술 갤러리 및 북카페",
        },
        {
          name: "김천부항댐 물문화관",
          tag: "경북 김천시",
          desc: "국내 최고 93m 짚와이어, 출렁다리, 스카이워크 수변 액티비티",
        },
      ],
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

      {/* 랜딩페이지 연계: 4대 핵심 관람 테마 상세 소개 */}
      <section className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-16">
            <span className="inline-block rounded-full bg-sky-100 px-3.5 py-1 text-xs font-black text-sky-800 uppercase tracking-widest mb-3">
              4 Core Exhibition Themes
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              물문화관 4대 핵심 테마 & 대표 관람지
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-slate-500 font-semibold max-w-xl mx-auto">
              기술, 생태, 역사, 문화 4가지 핵심 주제를 중심으로 대표적인 K-water 물문화 공간을 소개합니다.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {coreThemes.map((theme) => (
              <div
                key={theme.code}
                className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-slate-50/60 p-6 hover:bg-white hover:border-sky-300 hover:shadow-lg transition-all duration-300"
              >
                <div>
                  <div className="flex items-center justify-between gap-3 mb-4">
                    <span className={`inline-flex items-center gap-2 rounded-xl px-3 py-1.5 text-xs font-bold border ${theme.bg}`}>
                      <span>{theme.icon}</span>
                      <span>{theme.title}</span>
                    </span>
                    <span className="text-[10px] font-black tracking-widest text-slate-400">
                      {theme.code}
                    </span>
                  </div>

                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-semibold mb-6">
                    {theme.desc}
                  </p>

                  <div className="space-y-3 pt-4 border-t border-slate-200/60">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                      주요 대표 문화관 예시
                    </span>
                    {theme.centers.map((c) => (
                      <div key={c.name} className="rounded-xl bg-white p-3 border border-slate-200/80 shadow-sm">
                        <div className="flex items-center justify-between gap-2 mb-1">
                          <h4 className="text-xs font-bold text-slate-900">{c.name}</h4>
                          <span className="text-[10px] font-bold text-sky-700 bg-sky-50 px-2 py-0.5 rounded-md">
                            {c.tag}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 leading-snug font-medium">
                          {c.desc}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 현황 탐색 연결 배너 */}
      <section className="py-16 bg-slate-100/70 border-t border-slate-200/80">
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
