import Image from "next/image";
import Link from "next/link";
import { WaterHubHeader } from "@/components/WaterHubHeader";
import { WaterHubFooter } from "@/components/WaterHubFooter";

export const metadata = {
  title: "문화관 소개 | K-water 물문화관",
  description: "물과 자연, 그리고 사람이 함께 호흡하는 복합 문화 체험 공간 K-water 물문화관을 소개합니다.",
};

export default function IntroPage() {
  // 핵심 관람 지표
  const stats = [
    {
      value: "15개소",
      label: "전국 거점 물문화관",
      desc: "전국 주요 댐 및 수역에 위치한 통합 복합문화 공간",
      color: "from-sky-500 to-blue-600",
    },
    {
      value: "100%",
      label: "무료 관람 & 해설",
      desc: "모든 방문객 대상 입장료 무료 및 전문 도슨트 가이드",
      color: "from-cyan-500 to-teal-600",
    },
    {
      value: "4대 테마",
      label: "체험형 전문 전시",
      desc: "첨단 기술, 청정 생태, 치수 역사, 수변 문화예술",
      color: "from-indigo-500 to-sky-600",
    },
    {
      value: "365일",
      label: "열린 쉼터 공간",
      desc: "전망대, 수변 산책로, 북카페 등 쾌적한 휴식 제공",
      color: "from-blue-600 to-indigo-700",
    },
  ];

  // 4대 핵심 관람 테마
  const coreThemes = [
    {
      title: "첨단 기술 (Technology)",
      subTitle: "스마트 수자원 관리 & 청정에너지의 미래",
      bgBadge: "bg-sky-500 text-white",
      borderColor: "border-sky-200 hover:border-sky-400",
      image: "/images/cards/chungju_experience.png",
      desc: "세계 최대 규모의 시화호 조력발전소와 스마트 댐 수자원 관리, 합천호 수상태양광 등 기후위기에 대응하는 K-water의 미래 청정기술을 체험합니다.",
      centers: [
        {
          name: "시화나래 조력문화관 · 달전망대",
          tag: "경기 안산시",
          desc: "세계 최대 조력발전 원리 체험 및 360도 서해바다 유리전망대 조망",
        },
        {
          name: "충주댐 물문화관",
          tag: "충북 충주시",
          desc: "국내 최대 다목적댐 3D 디지털 수자원 모니터링 및 미디어 파사드",
        },
      ],
    },
    {
      title: "청정 생태 (Ecology)",
      subTitle: "아름다운 수변 자연 & 수생태계 보호",
      bgBadge: "bg-emerald-600 text-white",
      borderColor: "border-emerald-200 hover:border-emerald-400",
      image: "/centers/buan.jpg",
      desc: "금강 대청호, 소양호, 변산반도 등 천혜의 자연 속에서 멸종위기 야생 동식물과 수생태계의 소중한 생명력을 보존하고 관람객에게 교육합니다.",
      centers: [
        {
          name: "대청댐 물문화관",
          tag: "대전 대덕구",
          desc: "금강 민물고기 생태 수족관 및 대청호 청정 자연 환경 교육관",
        },
        {
          name: "부안댐 물문화관",
          tag: "전북 부안군",
          desc: "변산반도 국립공원 산림·호수 생태 보호 및 자생 생물 체험관",
        },
      ],
    },
    {
      title: "치수 역사 (History)",
      subTitle: "대한민국 수자원 개발과 삶의 기억",
      bgBadge: "bg-amber-600 text-white",
      borderColor: "border-amber-200 hover:border-amber-400",
      image: "/images/cards/hoengseong_experience.png",
      desc: "대한민국 근대 치수 사업의 발자취와 댐 건설로 터전을 양보해야 했던 수몰지 주민들의 고향 사진과 삶의 사료를 소중히 기록·보존합니다.",
      centers: [
        {
          name: "횡성댐 물문화관 (망향의 동산)",
          tag: "강원 횡성군",
          desc: "수몰지 5개 리 주민들의 옛 생활 유물과 횡성호수길 망향 탑방로",
        },
        {
          name: "소양강댐 물문화관",
          tag: "강원 춘천시",
          desc: "동양 최대 사급댐 축조 역사와 근대 대한민국 치수 60년 사료관",
        },
      ],
    },
    {
      title: "수변 문화 (Culture & Arts)",
      subTitle: "자연과 사람이 어우러지는 문화예술 쉼터",
      bgBadge: "bg-indigo-600 text-white",
      borderColor: "border-indigo-200 hover:border-indigo-400",
      image: "/centers/namgang.jpg",
      desc: "진주 남강 유등축제 연계 수변 갤러리, 디아크 레저 미디어아트, 김천부항댐 짚와이어 등 지역 사회와 함께 호흡하는 다채로운 힐링 공간입니다.",
      centers: [
        {
          name: "남강댐 물문화관",
          tag: "경남 진주시",
          desc: "남강 수변 기획 미술 갤러리 및 호수를 바라보는 수변 북카페",
        },
        {
          name: "김천부항댐 물문화관",
          tag: "경북 김천시",
          desc: "국내 최고 93m 짚와이어, 출렁다리, 스카이워크 수변 액티비티",
        },
      ],
    },
  ];

  // 이용 가이드 안내 카드
  const visitInfo = [
    {
      title: "입장료 안내",
      content: "전국 모든 K-water 물문화관은 무료로 자유롭게 입장하실 수 있습니다.",
      highlight: "전관 무료 입장",
      icon: (
        <svg className="w-6 h-6 text-sky-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 002 2h14a2 2 0 002-2V7a2 2 0 00-2-2H5z" />
        </svg>
      ),
    },
    {
      title: "관람 시간",
      content: "09:00 ~ 18:00 (입장 마감 17:30 / 매주 월요일 및 명절 휴관)",
      highlight: "상시 운영",
      icon: (
        <svg className="w-6 h-6 text-sky-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    {
      title: "전문 가이드 해설",
      content: "전문 도슨트 해설사의 무료 가이드 투어 서비스를 사전 온라인 예약할 수 있습니다.",
      highlight: "사전 온라인 예약 가능",
      icon: (
        <svg className="w-6 h-6 text-sky-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
    },
    {
      title: "편의시설 & 주차",
      content: "무료 대형 주차장, 수변 산책로, 전망대, 북카페, 휴게 쉼터 완비.",
      highlight: "주차장 무료 이용",
      icon: (
        <svg className="w-6 h-6 text-sky-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      <WaterHubHeader activeNav="intro" />

      {/* 1. 히어로 섹션 (신뢰감 있는 기관 비주얼) */}
      <section className="relative min-h-[480px] sm:min-h-[520px] w-full flex items-center justify-center overflow-hidden bg-slate-900">
        <Image
          src="/centers/hoengseong.jpg"
          alt="횡성댐 물문화관 전경"
          fill
          priority
          className="object-cover object-center opacity-40 scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/60 to-slate-900/30" />
        
        <div className="relative z-10 max-w-4xl px-6 text-center text-white py-16">
          <span className="inline-flex items-center gap-2 rounded-full bg-sky-500/20 border border-sky-400/30 px-4 py-1.5 text-xs sm:text-sm font-bold text-sky-300 mb-6 backdrop-blur-md">
            <span className="h-2 w-2 rounded-full bg-sky-400 animate-pulse" />
            K-water 한국수자원공사 공식 문화 공간
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-white leading-tight">
            물과 자연, 사람이 함께하는<br className="hidden sm:block" />
            <span className="text-sky-400"> K-water 물문화관</span>을 소개합니다
          </h1>
          <p className="mt-6 text-sm sm:text-base md:text-lg text-slate-200 max-w-2xl mx-auto font-medium leading-relaxed">
            전국 거점 댐과 수변 청정 구역에 위치한 K-water 물문화관은<br className="hidden sm:block" />
            물자원의 가치와 생태 환경의 소중함을 직접 체험하고 소통하는 복합 문화 쉼터입니다.
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
              className="w-full sm:w-auto inline-flex min-h-12 items-center justify-center rounded-xl border border-white/20 bg-white/10 hover:bg-white/20 text-white backdrop-blur-md font-bold text-sm px-7 transition"
            >
              무료 가이드 투어 예약
            </Link>
          </div>
        </div>
      </section>

      {/* 2. 핵심 지표 인포그래픽 섹션 */}
      <section className="relative z-20 -mt-10 max-w-6xl mx-auto px-6 w-full">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((s) => (
            <div
              key={s.label}
              className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xl shadow-slate-200/50 flex flex-col justify-between"
            >
              <div>
                <span className={`text-3xl font-black bg-clip-text text-transparent bg-gradient-to-r ${s.color}`}>
                  {s.value}
                </span>
                <h3 className="mt-2 text-base font-bold text-slate-900">{s.label}</h3>
                <p className="mt-1 text-xs text-slate-500 leading-relaxed font-medium">
                  {s.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. 4대 핵심 관람 테마 (실사 비주얼 카드) */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-bold text-sky-700 tracking-wider uppercase bg-sky-100/80 px-3 py-1 rounded-md inline-block mb-3">
              Core Exhibition Themes
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              물문화관 4대 핵심 관람 테마
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-slate-600 font-medium">
              기술, 생태, 역사, 문화 4가지 테마를 바탕으로 전국 각지에서 펼쳐지는 특별한 경험을 제시합니다.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {coreThemes.map((theme) => (
              <div
                key={theme.title}
                className={`flex flex-col justify-between overflow-hidden rounded-2xl border bg-white shadow-sm transition-all duration-300 ${theme.borderColor}`}
              >
                {/* 비주얼 썸네일 이미지 */}
                <div className="relative h-48 sm:h-52 w-full overflow-hidden bg-slate-100">
                  <Image
                    src={theme.image}
                    alt={theme.title}
                    fill
                    className="object-cover transition-transform duration-500 hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/20 to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4 text-white">
                    <span className={`inline-block rounded-md px-2.5 py-0.5 text-xs font-bold mb-1.5 ${theme.bgBadge}`}>
                      {theme.title}
                    </span>
                    <p className="text-xs text-slate-200 font-medium">
                      {theme.subTitle}
                    </p>
                  </div>
                </div>

                {/* 테마 본문 및 주요 대표 관람지 */}
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium mb-6">
                    {theme.desc}
                  </p>

                  <div className="space-y-2.5 pt-4 border-t border-slate-100">
                    <span className="text-[11px] font-bold text-slate-400 block mb-2">
                      주요 대표 물문화관
                    </span>
                    {theme.centers.map((c) => (
                      <div key={c.name} className="rounded-xl bg-slate-50 p-3 border border-slate-200/60">
                        <div className="flex items-center justify-between gap-2 mb-1">
                          <h4 className="text-xs font-bold text-slate-900">{c.name}</h4>
                          <span className="text-[10px] font-bold text-sky-800 bg-sky-100/70 px-2 py-0.5 rounded">
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

      {/* 4. 실질적 관람 가이드 및 이용 안내 (Visit Info) */}
      <section className="py-16 bg-white border-t border-slate-200/80">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              물문화관 관람 안내
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-slate-500 font-medium">
              누구나 편안하게 방문할 수 있는 쾌적한 관람 환경을 제공합니다.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {visitInfo.map((info) => (
              <div
                key={info.title}
                className="rounded-2xl border border-slate-200 bg-slate-50/50 p-6 flex flex-col justify-between hover:bg-white hover:shadow-md transition"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-2.5 rounded-xl bg-sky-50 border border-sky-100">
                      {info.icon}
                    </div>
                    <span className="text-[11px] font-bold text-sky-700 bg-sky-50 px-2 py-0.5 rounded-full">
                      {info.highlight}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-slate-900 mb-2">{info.title}</h3>
                  <p className="text-xs text-slate-600 leading-relaxed font-medium">
                    {info.content}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. 현황 및 예약 연동 CTA 하단 배너 */}
      <section className="relative py-20 bg-slate-900 text-white overflow-hidden">
        <div className="pointer-events-none absolute inset-0 opacity-20">
          <Image
            src="/images/cards/kwater_official_facility.png"
            alt="수자원공사 수변 공간"
            fill
            className="object-cover"
          />
        </div>
        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
          <span className="inline-block rounded-full bg-sky-500/20 text-sky-300 text-xs font-bold px-3.5 py-1 mb-4 border border-sky-500/30">
            K-water 전국 물문화관 통합안내
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-white tracking-tight leading-tight">
            지금, 가까운 물문화관을 탐색하고<br />
            전문 해설 투어를 예약해 보세요.
          </h2>
          <p className="mt-4 text-xs sm:text-sm text-slate-300 max-w-xl mx-auto font-medium leading-relaxed">
            전국 15개 거점 물문화관의 위치, 전시 구성, 관람 운영 상태를 현황 페이지에서 한눈에 확인하실 수 있습니다.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/status"
              className="w-full sm:w-auto inline-flex min-h-12 items-center justify-center rounded-xl bg-sky-500 hover:bg-sky-400 text-white font-bold text-sm px-8 transition shadow-lg shadow-sky-500/20"
            >
              전국 15개 물문화관 현황 탐색
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
