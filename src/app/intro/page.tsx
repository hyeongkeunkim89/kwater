"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { WaterHubHeader } from "@/components/WaterHubHeader";
import { WaterHubFooter } from "@/components/WaterHubFooter";

export default function IntroPage() {
  const [activeTheme, setActiveTheme] = useState<"tech" | "eco" | "history" | "culture">("tech");

  // 4대 핵심 관람 테마 데이터 (인터랙티브 갤러리용)
  const themes = {
    tech: {
      id: "tech",
      tabLabel: "기술 & 청정에너지",
      badge: "TECHNOLOGY",
      badgeColor: "bg-sky-500 text-white",
      gradient: "from-sky-600 via-blue-700 to-indigo-800",
      accentColor: "sky",
      title: "기후위기에 대응하는 K-water의 미래 수자원 기술",
      desc: "세계 최대 규모의 시화호 조력발전소와 스마트 댐 수자원 관리, 합천호 수상태양광 등 첨단 청정에너지와 수자원 관리 기술의 미래 비전을 선도합니다.",
      heroImage: "/images/cards/chungju_experience.png",
      heroCaption: "충주댐 물문화관 · 3D 디지털 수자원 모니터링 & 미디어파사드",
      highlights: [
        "세계 최대 시화호 조력발전 원리 체험 (시화나래)",
        "360도 유리전망대 서해 조망 (달전망대)",
        "3D 디지털 다목적댐 모니터링 (충주댐)",
        "수상태양광 & 기후대응 기술 체험관",
      ],
      centers: [
        {
          name: "시화나래 조력문화관 · 달전망대",
          location: "경기 안산시",
          desc: "조석(밀물·썰물) 에너지 발전에 대한 원리 체험 및 75m 높이 360도 유리전망대 조망",
          image: "/images/cards/kwater_official_facility.png",
          features: ["조력발전 전시관", "360도 유리전망대", "수변공원"],
        },
        {
          name: "충주댐 물문화관",
          location: "충북 충주시",
          desc: "국내 최대 다목적댐의 치수 역사 및 3D 디지털 수자원 모니터링, 첨단 미디어파사드 연출",
          image: "/images/cards/chungju_experience.png",
          features: ["디지털 모니터링", "미디어파사드", "충주호 전망대"],
        },
      ],
    },
    eco: {
      id: "eco",
      tabLabel: "생태 & 수생태계",
      badge: "ECOLOGY",
      badgeColor: "bg-emerald-600 text-white",
      gradient: "from-emerald-600 via-teal-700 to-cyan-800",
      accentColor: "emerald",
      title: "천혜의 수변 자연과 살아 숨 쉬는 생명력",
      desc: "금강 대청호, 소양호, 변산반도 등 맑은 호수와 산림 속에서 멸종위기 야생 동식물과 수생태계의 생명력을 보호하고 전파하는 친환경 수변 공간입니다.",
      heroImage: "/centers/buan.jpg",
      heroCaption: "부안댐 물문화관 · 변산반도 국립공원 산림 및 호수 생태 체험관",
      highlights: [
        "금강 수계 민물고기 생태 수족관 (대청댐)",
        "변산반도 국립공원 자생 생물 보존 (부안댐)",
        "대청호 수변 자연 생태 보전 교육",
        "호수 생태 학습 및 야생화 탐방로",
      ],
      centers: [
        {
          name: "대청댐 물문화관",
          location: "대전 대덕구",
          desc: "금강에 서식하는 다양한 민물고기 생태 수족관과 대청호 생태계 보전 체험실",
          image: "/images/cards/real_exhibit_gallery.png",
          features: ["민물고기 수족관", "금강 생태관", "대청호 수변산책로"],
        },
        {
          name: "부안댐 물문화관",
          location: "전북 부안군",
          desc: "변산반도 국립공원의 청정 산림·호수 생태 보호 및 자생 동식물 생태 학습 공간",
          image: "/centers/buan.jpg",
          features: ["자생생물 학습관", "변산반도 탐방로", "호수 쉼터"],
        },
      ],
    },
    history: {
      id: "history",
      tabLabel: "치수 & 역사사료",
      badge: "HISTORY",
      badgeColor: "bg-amber-600 text-white",
      gradient: "from-amber-600 via-orange-700 to-stone-800",
      accentColor: "amber",
      title: "대한민국 수자원 개발 60년과 수몰지 삶의 기록",
      desc: "근대 치수 사업의 발자취와 댐 건설로 정든 터전을 양보해야 했던 수몰지 주민들의 삶의 기록과 역사 사료를 정성스럽게 보존하고 전시합니다.",
      heroImage: "/images/cards/hoengseong_experience.png",
      heroCaption: "횡성댐 물문화관 · 수몰지 5개 리 주민들의 삶과 옛 추억 보존 전시",
      highlights: [
        "수몰지 5개 리 주민 유물 & 옛 사진 (횡성댐 망향의 동산)",
        "동양 최대 사급댐 축조 역사의 사료관 (소양강댐)",
        "대한민국 근대 수자원 개발 60년사 전시",
        "횡성호수길 망향 탐방로 연계",
      ],
      centers: [
        {
          name: "횡성댐 물문화관 (망향의 동산)",
          location: "강원 횡성군",
          desc: "횡성댐 건설로 수몰된 5개 리 주민들의 삶과 옛 사진·유물 보존 및 횡성호수길 망향 탐방",
          image: "/images/cards/hoengseong_experience.png",
          features: ["망향의 동산", "수몰지 유물관", "횡성호수길"],
        },
        {
          name: "소양강댐 물문화관",
          location: "강원 춘천시",
          desc: "동양 최대 규모의 사급 흙댐 축조 역사와 대한민국 근대 수자원 개발 사료 전시관",
          image: "/images/cards/soyang_gallery.png",
          features: ["수자원 60년 사료관", "소양호 전망대", "역사 미디어관"],
        },
      ],
    },
    culture: {
      id: "culture",
      tabLabel: "문화 & 수변레저",
      badge: "CULTURE & ARTS",
      badgeColor: "bg-indigo-600 text-white",
      gradient: "from-indigo-600 via-purple-700 to-pink-800",
      accentColor: "indigo",
      title: "자연과 사람이 어우러지는 다채로운 문화예술 쉼터",
      desc: "진주 남강 유등축제 연계 수변 갤러리, 강정고령보 디아크 레저 미디어아트, 김천부항댐 짚와이어 등 지역과 호흡하는 수변 문화예술 체험 공간입니다.",
      heroImage: "/centers/namgang.jpg",
      heroCaption: "남강댐 물문화관 · 진주 남강 유등 축제 연계 수변 미술 갤러리",
      highlights: [
        "진주 남강 유등 축제 연계 기획 미술 갤러리 (남강댐)",
        "국내 최고 93m 수변 짚와이어 & 출렁다리 (김천부항댐)",
        "강정고령보 디아크(The ARC) 건축 미디어아트",
        "호수를 조망하는 수변 북카페 & 문화 행사",
      ],
      centers: [
        {
          name: "남강댐 물문화관",
          location: "경남 진주시",
          desc: "진주 남강 유등 축제와 연계된 수변 기획 미술 갤러리 및 남강호를 바라보는 북카페",
          image: "/centers/namgang.jpg",
          features: ["기획 미술 갤러리", "수변 북카페", "남강호 전경"],
        },
        {
          name: "김천부항댐 물문화관",
          location: "경북 김천시",
          desc: "국내 최고 93m 높이의 짚와이어, 수변 출렁다리, 스카이워크 등 역동적인 레저 액티비티",
          image: "/centers/gimcheon.jpg",
          features: ["93m 짚와이어", "부항댐 출렁다리", "스카이워크"],
        },
      ],
    },
  };

  const currentTheme = themes[activeTheme];

  // 주요 지표
  const quickStats = [
    { value: "15개소", label: "전국 거점 물문화관", sub: "수도권·강원·충청·호남·영남" },
    { value: "100%", label: "무료 관람 & 해설", sub: "모든 방문객 대상 입장료 0원" },
    { value: "4대 테마", label: "체험형 전시 테마", sub: "기술 · 생태 · 역사 · 문화" },
    { value: "365일", label: "열린 쉼터 공간", sub: "전망대 · 북카페 · 수변 산책로" },
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      <WaterHubHeader activeNav="intro" />

      {/* 1. 상단 히어로 (갤러리 쇼케이스 헤더) */}
      <section className="relative min-h-[460px] sm:min-h-[500px] w-full flex items-center justify-center overflow-hidden bg-slate-950">
        <Image
          src="/centers/hoengseong.jpg"
          alt="횡성댐 물문화관 전경"
          fill
          priority
          className="object-cover object-center opacity-35 scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-slate-950/30" />

        <div className="relative z-10 max-w-4xl px-6 text-center text-white py-16">
          <div className="inline-flex items-center gap-2 rounded-full bg-sky-500/20 border border-sky-400/30 px-4 py-1.5 text-xs sm:text-sm font-bold text-sky-300 mb-6 backdrop-blur-md">
            <span className="h-2 w-2 rounded-full bg-sky-400 animate-pulse" />
            K-water 한국수자원공사 공식 문화 공간
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-white leading-tight">
            물과 사람, 자연이 함께하는<br className="hidden sm:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-teal-300 to-cyan-200">
              K-water 물문화관 갤러리
            </span>
          </h1>
          <p className="mt-5 text-sm sm:text-base md:text-lg text-slate-300 max-w-2xl mx-auto font-medium leading-relaxed">
            전국 주요 댐과 수변 청정 구역에 위치한 15개 물문화관을 소개합니다.<br className="hidden sm:block" />
            원하시는 테마를 선택하여 대표 문화관과 생생한 체험 공간을 탐색해 보세요.
          </p>
        </div>
      </section>

      {/* 2. 주요 지표 스탯 바 */}
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

      {/* 3. 인터랙티브 갤러리 쇼케이스 (메인 핵심 섹션) */}
      <section className="py-16 sm:py-20 bg-slate-50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-xs font-bold text-sky-700 tracking-wider uppercase bg-sky-100/80 px-3 py-1 rounded-md inline-block mb-3">
              Interactive Theme Showcase
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              4대 관람 테마 갤러리
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-slate-600 font-medium">
              아래 탭을 클릭하여 각 테마별 주요 특징과 대표 물문화관을 직관적으로 확인하세요.
            </p>
          </div>

          {/* 4대 테마 탭 셀렉터 */}
          <div className="flex flex-wrap justify-center gap-2 sm:gap-3 mb-10">
            {(Object.keys(themes) as Array<keyof typeof themes>).map((key) => {
              const t = themes[key];
              const isActive = activeTheme === key;
              return (
                <button
                  key={key}
                  onClick={() => setActiveTheme(key)}
                  className={`flex items-center gap-2 px-5 py-3 rounded-2xl text-xs sm:text-sm font-bold transition-all duration-200 border ${
                    isActive
                      ? "bg-slate-900 text-white border-slate-900 shadow-lg shadow-slate-900/20 scale-105"
                      : "bg-white text-slate-700 border-slate-200 hover:border-sky-300 hover:bg-slate-50"
                  }`}
                >
                  <span
                    className={`h-2.5 w-2.5 rounded-full ${
                      isActive ? "bg-sky-400" : "bg-slate-300"
                    }`}
                  />
                  <span>{t.tabLabel}</span>
                </button>
              );
            })}
          </div>

          {/* 선택된 테마 대형 쇼케이스 패널 */}
          <div className="rounded-3xl border border-slate-200/90 bg-white shadow-xl overflow-hidden transition-all duration-300">
            {/* 상단 대형 대표 이미지 & 비전 박스 */}
            <div className="grid grid-cols-1 lg:grid-cols-12">
              <div className="relative h-64 sm:h-80 lg:h-auto lg:col-span-7 bg-slate-900">
                <Image
                  src={currentTheme.heroImage}
                  alt={currentTheme.title}
                  fill
                  className="object-cover transition-transform duration-700 hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent lg:hidden" />
                <div className="absolute bottom-4 left-4 right-4 text-white lg:hidden">
                  <span className={`inline-block rounded-md px-2.5 py-0.5 text-xs font-bold mb-1 ${currentTheme.badgeColor}`}>
                    {currentTheme.badge}
                  </span>
                  <p className="text-xs text-slate-200 font-medium">
                    {currentTheme.heroCaption}
                  </p>
                </div>
              </div>

              <div className="relative p-6 sm:p-8 lg:p-10 lg:col-span-5 flex flex-col justify-between bg-slate-950 text-white overflow-hidden">
                <Image
                  src="/centers/hoengseong.jpg"
                  alt="횡성댐 실루엣"
                  fill
                  className="object-cover opacity-25 scale-105 pointer-events-none"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/75 to-slate-950/50 pointer-events-none" />

                <div className="relative z-10">
                  <span className={`inline-block rounded-md px-3 py-1 text-xs font-bold mb-3 ${currentTheme.badgeColor}`}>
                    {currentTheme.badge}
                  </span>
                  <h3 className="text-xl sm:text-2xl font-black text-white leading-snug">
                    {currentTheme.title}
                  </h3>
                  <p className="mt-3 text-xs sm:text-sm text-slate-300 leading-relaxed font-medium">
                    {currentTheme.desc}
                  </p>
                </div>

                <div className="relative z-10 mt-6 pt-6 border-t border-slate-800 space-y-2">
                  <span className="text-[11px] font-bold text-slate-400 block mb-2 uppercase tracking-wider">
                    주요 관람 하이라이트
                  </span>
                  {currentTheme.highlights.map((h, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs text-slate-200 font-medium">
                      <svg className="w-4 h-4 text-sky-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                      </svg>
                      <span>{h}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* 하단 대표 물문화관 상세 세부 카드 */}
            <div className="p-6 sm:p-8 bg-slate-50 border-t border-slate-200">
              <h4 className="text-xs sm:text-sm font-bold text-slate-500 uppercase tracking-wider mb-4">
                {currentTheme.tabLabel} 테마 대표 추천 물문화관
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {currentTheme.centers.map((c) => (
                  <div
                    key={c.name}
                    className="flex flex-col sm:flex-row gap-4 rounded-2xl bg-white p-4 border border-slate-200/80 shadow-sm hover:border-sky-300 hover:shadow-md transition"
                  >
                    <div className="relative h-32 sm:h-auto sm:w-36 rounded-xl overflow-hidden shrink-0 bg-slate-100">
                      <Image
                        src={c.image}
                        alt={c.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between gap-2 mb-1">
                          <h5 className="text-sm font-bold text-slate-900">{c.name}</h5>
                          <span className="text-[10px] font-bold text-sky-800 bg-sky-100 px-2 py-0.5 rounded">
                            {c.location}
                          </span>
                        </div>
                        <p className="text-xs text-slate-600 leading-snug font-medium mb-3">
                          {c.desc}
                        </p>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {c.features.map((f) => (
                          <span key={f} className="text-[10px] text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md font-medium">
                            #{f}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. 관람객을 위한 안내 카드 (Visit Info) */}
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
                전국 15개 모든 물문화관은 전 국민 대상 무료로 자율 관람하실 수 있습니다.
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

      {/* 5. CTA 하단 연결 배너 */}
      <section className="relative py-20 bg-slate-950 text-white overflow-hidden">
        <Image
          src="/centers/hoengseong.jpg"
          alt="횡성댐 물문화관 전경 실루엣"
          fill
          className="object-cover opacity-35 scale-105 pointer-events-none"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-slate-950/30 pointer-events-none" />

        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
          <span className="inline-block rounded-full bg-sky-500/20 text-sky-300 text-xs font-bold px-4 py-1 mb-4 border border-sky-500/30">
            K-water 전국 물문화관 통합 서비스
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-white tracking-tight leading-tight">
            가까운 K-water 물문화관을 탐색하고<br />
            무료 가이드 투어를 예약해 보세요.
          </h2>
          <p className="mt-4 text-xs sm:text-sm text-slate-300 max-w-xl mx-auto font-medium leading-relaxed">
            전국 15개 거점 물문화관의 운영 시간, 실시간 관람 상태, 층별 주요 공간을 한눈에 확인하실 수 있습니다.
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
