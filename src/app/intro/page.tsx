import Image from "next/image";
import Link from "next/link";
import { WaterHubHeader } from "@/components/WaterHubHeader";
import { WaterHubFooter } from "@/components/WaterHubFooter";

export const metadata = {
  title: "문화관 소개 | K-water 물문화관",
  description: "물과 자연, 그리고 사람이 함께 호흡하는 복합 문화 체험 공간 K-water 물문화관을 소개합니다.",
};

export default function IntroPage() {
  // 4대 관람 테마 데이터
  const coreThemes = [
    {
      num: "01",
      badge: "기술 (Technology)",
      title: "첨단 수자원 기술 & 미래 청정에너지",
      desc: "세계 최대 규모의 시화호 조력발전소와 스마트 댐 수자원 관리, 합천호 수상태양광 등 기후위기에 대응하는 K-water의 미래 수자원 청정기술을 직접 체험합니다.",
      image: "/images/cards/chungju_experience.png",
      tagColor: "bg-sky-600 text-white",
      centers: [
        {
          name: "시화나래 조력문화관 · 달전망대",
          tag: "경기 안산시",
          desc: "조석(밀물·썰물) 에너지 발전에 대한 원리 체험 및 75m 높이 360도 유리전망대 서해 조망",
        },
        {
          name: "충주댐 물문화관",
          tag: "충북 충주시",
          desc: "국내 최대 다목적댐의 3D 디지털 수자원 모니터링 시스템 및 첨단 미디어파사드 연출",
        },
      ],
      features: ["#조력발전원리", "#360도유리전망대", "#3D디지털모니터링"],
    },
    {
      num: "02",
      badge: "생태 (Ecology)",
      title: "청정 수변 자연 & 수생태계 보존",
      desc: "금강 수계 대청호, 소양호, 변산반도 국립공원 등 천혜의 자연 속에서 멸종위기 야생 동식물과 수생태계의 귀중한 생명력을 보호하고 전파합니다.",
      image: "/centers/buan.jpg",
      tagColor: "bg-emerald-600 text-white",
      centers: [
        {
          name: "대청댐 물문화관",
          tag: "대전 대덕구",
          desc: "금강 수계에 자생하는 민물고기 생태 수족관과 대청호 청정 자연 환경 교육관",
        },
        {
          name: "부안댐 물문화관",
          tag: "전북 부안군",
          desc: "변산반도 국립공원의 청정 산림·호수 생태 보호 및 자생 동식물 생태 학습장",
        },
      ],
      features: ["#금강민물고기수족관", "#변산반도국립공원", "#수생태계보호"],
    },
    {
      num: "03",
      badge: "역사 (History)",
      title: "치수 60년 발자취 & 수몰지 삶의 사료",
      desc: "대한민국 근대 치수 사업의 역사적 발자취와 댐 건설로 터전을 양보해야 했던 수몰지 주민들의 고향 유물과 아련한 추억의 사진을 소중하게 보존합니다.",
      image: "/images/cards/hoengseong_experience.png",
      tagColor: "bg-amber-600 text-white",
      centers: [
        {
          name: "횡성댐 물문화관 (망향의 동산)",
          tag: "강원 횡성군",
          desc: "수몰지 5개 리 주민들의 삶의 옛 사진·유물 보존 및 횡성호수길 망향 탐방로 연계",
        },
        {
          name: "소양강댐 물문화관",
          tag: "강원 춘천시",
          desc: "동양 최대 사급 흙댐 축조 역사와 대한민국 근대 수자원 개발 60년 사료관",
        },
      ],
      features: ["#망향의동산", "#횡성호수길", "#치수60년사료관"],
    },
    {
      num: "04",
      badge: "문화 (Culture & Arts)",
      title: "수변 문화예술 갤러리 & 레저 쉼터",
      desc: "진주 남강 유등축제 연계 수변 기획 미술 갤러리, 강정고령보 디아크 미디어아트, 김천부항댐 짚와이어 등 자연과 어우러지는 다채로운 힐링 공간입니다.",
      image: "/centers/namgang.jpg",
      tagColor: "bg-indigo-600 text-white",
      centers: [
        {
          name: "남강댐 물문화관",
          tag: "경남 진주시",
          desc: "진주 남강 유등 축제 연계 기획 미술 갤러리 및 호수를 바라보는 수변 북카페",
        },
        {
          name: "김천부항댐 물문화관",
          tag: "경북 김천시",
          desc: "국내 최고 93m 높이의 짚와이어, 수변 출렁다리, 스카이워크 레저 액티비티",
        },
      ],
      features: ["#수변미술갤러리", "#남강유등축제", "#93m부항댐짚와이어"],
    },
  ];

  // 핵심 지표 스탯
  const quickStats = [
    { value: "15개소", label: "전국 거점 물문화관", sub: "수도권 · 강원 · 충청 · 호남 · 영남" },
    { value: "100%", label: "무료 관람 & 해설", sub: "전 국민 대상 입장료 0원" },
    { value: "4대 테마", label: "체험형 전문 전시", sub: "기술 · 생태 · 역사 · 문화" },
    { value: "365일", label: "열린 친환경 쉼터", sub: "전망대 · 북카페 · 수변 산책로" },
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      <WaterHubHeader activeNav="intro" />

      {/* 1. 기관 정체성을 담은 상단 히어로 섹션 */}
      <section className="relative min-h-[460px] sm:min-h-[500px] w-full flex items-center justify-center overflow-hidden bg-slate-900">
        <Image
          src="/centers/hoengseong.jpg"
          alt="횡성댐 물문화관 전경"
          fill
          priority
          className="object-cover object-center opacity-65 brightness-95 scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/45 to-slate-900/10" />

        <div className="relative z-10 max-w-4xl px-6 text-center text-white py-16">
          <span className="inline-flex items-center gap-2 rounded-full bg-sky-500/20 border border-sky-400/30 px-4 py-1.5 text-xs sm:text-sm font-bold text-sky-300 mb-6 backdrop-blur-md">
            <span className="h-2 w-2 rounded-full bg-sky-400 animate-pulse" />
            K-water 한국수자원공사 공식 문화 공간
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-white leading-tight">
            물과 자연, 사람이 함께하는<br className="hidden sm:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-teal-300 to-cyan-200">
              K-water 물문화관
            </span>
          </h1>
          <p className="mt-5 text-sm sm:text-base md:text-lg text-slate-200 max-w-2xl mx-auto font-medium leading-relaxed">
            전국 주요 다목적댐과 수변 청정 구역에 위치한 K-water 물문화관은<br className="hidden sm:block" />
            깨끗한 수자원의 가치와 풍요로운 자연 환경을 전 국민이 직접 체험하는 소통의 장입니다.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/status"
              className="w-full sm:w-auto inline-flex min-h-12 items-center justify-center rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-sm px-7 transition shadow-lg shadow-sky-600/30"
            >
              전국 15개 거점 현황 보기 →
            </Link>
            <Link
              href="/reserve"
              className="w-full sm:w-auto inline-flex min-h-12 items-center justify-center rounded-xl border border-white/25 bg-white/10 hover:bg-white/20 text-white backdrop-blur-md font-bold text-sm px-7 transition"
            >
              무료 가이드 투어 예약
            </Link>
          </div>
        </div>
      </section>

      {/* 2. 핵심 지표 인포그래픽 스탯 바 */}
      <section className="relative z-20 -mt-10 max-w-6xl mx-auto px-6 w-full">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {quickStats.map((s) => (
            <div
              key={s.label}
              className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xl shadow-slate-200/50 flex flex-col justify-between"
            >
              <div>
                <span className="text-2xl sm:text-3xl font-black text-sky-600 tracking-tight">
                  {s.value}
                </span>
                <h3 className="mt-1 text-xs sm:text-sm font-bold text-slate-900">{s.label}</h3>
                <p className="mt-0.5 text-[11px] text-slate-500 font-medium">
                  {s.sub}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. K-water 물문화관 3대 핵심 가치 */}
      <section className="py-16 bg-white border-b border-slate-200/80 mt-6">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold text-sky-700 uppercase tracking-wider bg-sky-100 px-3 py-1 rounded-md inline-block mb-3">
              Core Institutional Values
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              물문화관이 추구하는 3대 가치
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-slate-600 font-medium">
              국민과 함께 수자원의 가치를 나누고 청정 자연을 보존하는 K-water의 브랜드 미션입니다.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="rounded-2xl bg-slate-50/70 p-7 border border-slate-200/80 flex flex-col justify-between hover:bg-white hover:shadow-md transition">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-sky-100 text-sky-600 flex items-center justify-center text-xl font-bold mb-4">
                  🌊
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">수자원 가치 조명</h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
                  스마트 댐 기술과 세계 최대 조력발전소 등 기후대응 미래 청정기술과 수자원 관리의 소중함을 전합니다.
                </p>
              </div>
            </div>

            <div className="rounded-2xl bg-slate-50/70 p-7 border border-slate-200/80 flex flex-col justify-between hover:bg-white hover:shadow-md transition">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center text-xl font-bold mb-4">
                  🌱
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">청정 수생태계 보존</h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
                  금강 민물고기 생태수족관 및 변산반도 자생 생물 등 아름다운 수생태계의 생명력을 보호하고 관람객에게 교육합니다.
                </p>
              </div>
            </div>

            <div className="rounded-2xl bg-slate-50/70 p-7 border border-slate-200/80 flex flex-col justify-between hover:bg-white hover:shadow-md transition">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center text-xl font-bold mb-4">
                  🏛️
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">치수 역사 & 소통 쉼터</h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
                  대한민국 치수 60년사 사료와 수몰지 주민들의 고향 유물을 보존하며 수변 갤러리와 북카페로 지역과 호흡합니다.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. 4대 관람 테마 & 실사 비주얼 카드 섹션 */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-bold text-sky-700 tracking-wider uppercase bg-sky-100/80 px-3 py-1 rounded-md inline-block mb-3">
              4 Core Exhibition Themes
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              물문화관 4대 핵심 관람 테마
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-slate-600 font-medium">
              기술, 생태, 역사, 문화 4가지 테마를 중심으로 대표적인 K-water 물문화 공간을 소개합니다.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {coreThemes.map((t) => (
              <div
                key={t.num}
                className="flex flex-col justify-between overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-sm hover:border-sky-300 hover:shadow-lg transition-all duration-300"
              >
                {/* 비주얼 썸네일 커버 */}
                <div className="relative h-52 sm:h-56 w-full overflow-hidden bg-slate-100">
                  <Image
                    src={t.image}
                    alt={t.title}
                    fill
                    className="object-cover transition-transform duration-500 hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/30 to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4 text-white">
                    <span className={`inline-block rounded-md px-2.5 py-0.5 text-xs font-bold mb-1.5 ${t.tagColor}`}>
                      {t.badge}
                    </span>
                    <h3 className="text-base sm:text-lg font-bold text-white">
                      {t.title}
                    </h3>
                  </div>
                </div>

                {/* 카드 본문 및 세부 리스트 */}
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium mb-6">
                    {t.desc}
                  </p>

                  <div className="space-y-2.5 pt-4 border-t border-slate-100">
                    <span className="text-[11px] font-bold text-slate-400 block mb-2 uppercase">
                      주요 대표 물문화관
                    </span>
                    {t.centers.map((c) => (
                      <div key={c.name} className="rounded-xl bg-slate-50 p-3.5 border border-slate-200/70">
                        <div className="flex items-center justify-between gap-2 mb-1">
                          <h4 className="text-xs sm:text-sm font-bold text-slate-900">{c.name}</h4>
                          <span className="text-[10px] font-bold text-sky-800 bg-sky-100 px-2 py-0.5 rounded">
                            {c.tag}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 leading-snug font-medium">
                          {c.desc}
                        </p>
                      </div>
                    ))}
                  </div>

                  {/* 태그 모음 */}
                  <div className="mt-4 flex flex-wrap gap-1 pt-2">
                    {t.features.map((f) => (
                      <span key={f} className="text-[10px] text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md font-medium">
                        {f}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. 방문 이용 안내 (Visit Info) */}
      <section className="py-16 bg-white border-t border-slate-200/80">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              물문화관 관람 안내
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-slate-500 font-medium">
              모든 국토의 물자원을 체험할 수 있도록 쾌적한 관람 환경을 무료로 제공합니다.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="rounded-2xl border border-slate-200 bg-slate-50/60 p-6 hover:bg-white hover:shadow-md transition">
              <div className="w-10 h-10 rounded-xl bg-sky-100 text-sky-600 flex items-center justify-center mb-4">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 002 2h14a2 2 0 002-2V7a2 2 0 00-2-2H5z" />
                </svg>
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-1">입장료 무료</h3>
              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                전국 15개 모든 K-water 물문화관은 전 국민 대상 무료로 자율 관람하실 수 있습니다.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50/60 p-6 hover:bg-white hover:shadow-md transition">
              <div className="w-10 h-10 rounded-xl bg-sky-100 text-sky-600 flex items-center justify-center mb-4">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-1">관람 시간</h3>
              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                09:00 ~ 18:00 (입장 마감 17:30 / 매주 월요일 및 명절 당일 휴관)
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50/60 p-6 hover:bg-white hover:shadow-md transition">
              <div className="w-10 h-10 rounded-xl bg-sky-100 text-sky-600 flex items-center justify-center mb-4">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-1">무료 가이드 해설</h3>
              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                단체 및 가족 방문객을 위한 전문 도슨트 해설 투어를 사전 온라인 예약하세요.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50/60 p-6 hover:bg-white hover:shadow-md transition">
              <div className="w-10 h-10 rounded-xl bg-sky-100 text-sky-600 flex items-center justify-center mb-4">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-1">편의시설 & 주차</h3>
              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                대형 무료 주차장, 수변 산책로, 호수 전망대, 수변 북카페가 완비되어 있습니다.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. CTA 하단 연결 배너 */}
      <section className="relative py-20 bg-slate-900 text-white overflow-hidden">
        <Image
          src="/centers/hoengseong.jpg"
          alt="횡성댐 물문화관 전경 실루엣"
          fill
          className="object-cover opacity-65 brightness-95 scale-105 pointer-events-none"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/45 to-slate-900/10 pointer-events-none" />

        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
          <span className="inline-block rounded-full bg-sky-500/20 text-sky-300 text-xs font-bold px-4 py-1 mb-4 border border-sky-500/30">
            K-water 전국 물문화관 통합 서비스
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-white tracking-tight leading-tight">
            가까운 K-water 물문화관을 탐색하고<br />
            무료 가이드 투어를 예약해 보세요.
          </h2>
          <p className="mt-4 text-xs sm:text-sm text-slate-200 max-w-xl mx-auto font-medium leading-relaxed">
            전국 15개 거점 물문화관의 위치, 전시 구성, 실시간 관람 상태를 현황 페이지에서 탐색하실 수 있습니다.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/status"
              className="w-full sm:w-auto inline-flex min-h-12 items-center justify-center rounded-xl bg-sky-500 hover:bg-sky-400 text-white font-bold text-sm px-8 transition shadow-lg shadow-sky-500/20"
            >
              전국 15개 물문화관 현황 보기 →
            </Link>
            <Link
              href="/reserve"
              className="w-full sm:w-auto inline-flex min-h-12 items-center justify-center rounded-xl border border-white/20 bg-white/10 hover:bg-white/20 text-white backdrop-blur-md font-bold text-sm px-8 transition"
            >
              무료 가이드 투어 예약하기
            </Link>
          </div>
        </div>
      </section>

      <WaterHubFooter />
    </div>
  );
}
