import Image from "next/image";
import Link from "next/link";
import { WaterHubHeader } from "@/components/WaterHubHeader";
import { WaterHubFooter } from "@/components/WaterHubFooter";

export const metadata = {
  title: "문화관 소개 | K-water 물문화관",
  description: "대한민국 수자원의 역사와 가치를 체계적으로 보존하고 국민과 함께하는 복합 문화·체험 공간 K-water 물문화관을 소개합니다.",
};

export default function IntroPage() {
  // 3대 핵심 가치 상세 카드
  const coreValues = [
    {
      title: "역사 보존",
      desc: "대한민국 50년 수자원 개발 및 관리의 역사적 기록 보존",
      icon: (
        <svg className="w-6 h-6 text-[#004D95]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      ),
      badge: "보존 및 사료",
    },
    {
      title: "생태·환경 교육",
      desc: "물 순환의 원리와 미래 생태 환경을 배우는 체험형 교육 프로그램 운영",
      icon: (
        <svg className="w-6 h-6 text-[#004D95]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3.05 11a9 9 0 0117.9 0M4.1 15a9 9 0 0015.8 0" />
        </svg>
      ),
      badge: "체험 및 교육",
    },
    {
      title: "지역사회 상생",
      desc: "지역 주민과 함께 호흡하는 열린 문화 예술 및 복합 휴식 공간 제공",
      icon: (
        <svg className="w-6 h-6 text-[#004D95]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5 5 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
      badge: "소통 및 휴식",
    },
  ];

  // 전국 거점 물문화관 현황 요약 통계
  const statsSummary = [
    {
      value: "15개소",
      label: "전국 거점 문화관",
      desc: "수도권 · 강원 · 충청 · 호남 · 영남",
    },
    {
      value: "무료",
      label: "관람료",
      desc: "국민 누구나 자유롭게 이용",
    },
    {
      value: "전시 · 전망대 · 북카페",
      label: "대표 시설",
      desc: "전시실, 전망대, 북카페, 야외 수변공원 등",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans break-keep">
      <WaterHubHeader activeNav="intro" />

      {/* 1. 첨부 시안(media_1790051557550.png) 완벽 복원 히어로 배너 */}
      <section className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 mt-4 sm:mt-6">
        <div className="relative min-h-[500px] sm:min-h-[560px] lg:min-h-[580px] w-full overflow-hidden rounded-tl-[48px] rounded-bl-[48px] rounded-tr-[24px] rounded-br-[24px] bg-slate-900 shadow-2xl flex items-center justify-center p-6 sm:p-10 lg:p-12">
          
          {/* 고해상도 댐/호수 배경 이미지 */}
          <Image
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/e/ea/SoyangDam.JPG/1280px-SoyangDam.JPG"
            alt="소양강댐 전경 배경"
            fill
            priority
            className="object-cover object-[center_25%] opacity-60 brightness-95 scale-105"
          />

          {/* 시네마틱 오버레이 그라디언트 */}
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/85 via-slate-950/55 to-slate-950/85" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-transparent to-slate-950/40" />

          {/* 히어로 본문 레이아웃 (중앙 텍스트 + 우측 블록) */}
          <div className="relative z-10 w-full flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-12">
            
            {/* [중앙 메인 영역] */}
            <div className="flex-1 text-center flex flex-col items-center max-w-2xl mx-auto">
              
              {/* 공식 슬로건 이미지 (시안대로 배경 위 바로 선명 배치) */}
              <div className="mb-4 sm:mb-6">
                <Image
                  src="/images/slogan.png"
                  alt="세상에 행복을 水 놓다"
                  width={480}
                  height={120}
                  priority
                  className="h-auto w-auto max-w-[260px] sm:max-w-[340px] md:max-w-[390px] object-contain drop-shadow-[0_4px_16px_rgba(0,0,0,0.8)] filter brightness-110"
                />
              </div>

              {/* 중간 카피 (화이트 볼드 타이포) */}
              <h1 className="text-xl sm:text-2xl md:text-3xl font-black text-white tracking-tight leading-snug drop-shadow-md mb-3">
                WCEH: 수자원 관리의 유산
              </h1>
              <p className="text-xs sm:text-sm text-slate-100 font-medium leading-relaxed max-w-xl mx-auto drop-shadow-sm break-keep mb-8 opacity-95">
                한국수자원공사 물문화관은 지난 반세기<br className="hidden sm:inline" />
                대한민국의 수자원 관리 역사를 체계적으로 기록하고 보존해왔습니다.<br />
                물의 소중한 가치를 전파하고, 지역과 함께 호흡하는<br className="hidden sm:inline" />
                지속 가능한 상생의 공간을 지향합니다.
              </p>

              {/* 하단 3대 가치 아이콘 바 (원형 아이콘 + 라벨) */}
              <div className="grid grid-cols-3 gap-6 sm:gap-10 pt-4 border-t border-white/20 w-full max-w-md mx-auto">
                <div className="flex flex-col items-center">
                  <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-full border border-white/25 bg-white/10 backdrop-blur-md flex items-center justify-center text-white mb-2 shadow-inner">
                    <svg className="w-5 h-5 sm:w-6 sm:h-6 text-sky-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <span className="text-xs sm:text-sm font-bold text-white tracking-tight">역사 보존</span>
                </div>

                <div className="flex flex-col items-center">
                  <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-full border border-white/25 bg-white/10 backdrop-blur-md flex items-center justify-center text-white mb-2 shadow-inner">
                    <svg className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                  </div>
                  <span className="text-xs sm:text-sm font-bold text-white tracking-tight">생태 교육</span>
                </div>

                <div className="flex flex-col items-center">
                  <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-full border border-white/25 bg-white/10 backdrop-blur-md flex items-center justify-center text-white mb-2 shadow-inner">
                    <svg className="w-5 h-5 sm:w-6 sm:h-6 text-amber-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5 5 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <span className="text-xs sm:text-sm font-bold text-white tracking-tight">지역 상생</span>
                </div>
              </div>

            </div>

            {/* [우측 사이드 정보 블록] (시안 이미지 스타일 복원) */}
            <div className="w-full lg:w-[310px] shrink-0 text-left text-white drop-shadow-md lg:border-l lg:border-white/15 lg:pl-8 py-2">
              <p className="text-[10px] sm:text-[11px] font-extrabold uppercase tracking-[0.2em] text-sky-300 mb-1">
                WATER CULTURE CENTER
              </p>
              <h2 className="text-lg sm:text-xl font-black text-white mb-2 tracking-tight">
                전국 15개 <span className="text-sky-300">물문화관 거점</span>
              </h2>
              <p className="text-xs text-slate-100 font-medium leading-relaxed opacity-90 break-keep mb-4">
                한강, 낙동강, 금강, 영산강 등 전국 주요 수계에 위치한 15개 물문화관은 지역별 특색을 살린 전시실, 전망대, 야외 수변공간을 무료로 개방하고 있습니다.
              </p>

              <div className="border-t border-white/15 pt-3.5 mb-4">
                <p className="text-[11px] text-sky-200/90 leading-snug font-normal break-keep">
                  전국 물문화관의 통합 정보 및 실시간 위치와 현황은 전국현황 지도 페이지에서 확인하실 수 있습니다.
                </p>
              </div>

              <Link
                href="/centers"
                className="inline-flex w-full items-center justify-between rounded-xl bg-sky-600 hover:bg-sky-500 text-xs font-bold text-white px-4 py-2.5 transition shadow-md group"
              >
                <span>전국 물문화관 둘러보기</span>
                <span className="font-black group-hover:translate-x-1 transition-transform">→</span>
              </Link>
            </div>

          </div>
        </div>
      </section>

      {/* 2. K-water 물문화관 3대 핵심 가치 (그리드 카드) */}
      <section className="py-16 sm:py-20 bg-white border-b border-slate-200 mt-6">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
            <span className="text-xs sm:text-sm font-bold text-[#004D95] tracking-wider bg-blue-50 px-3.5 py-1.5 rounded-md inline-block mb-3 border border-blue-100">
              K-water 브랜드 미션
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight break-keep">
              물문화관 3대 핵심 가치
            </h2>
            <p className="mt-3 text-sm text-slate-600 font-medium break-keep">
              국민과 함께 수자원의 가치를 공유하고 지속 가능한 생태 환경을 가꾸어 나갑니다.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            {coreValues.map((item) => (
              <div
                key={item.title}
                className="rounded-2xl bg-slate-50/80 border border-slate-200 p-8 flex flex-col justify-between hover:bg-white hover:border-[#004D95]/40 hover:shadow-xl transition-all duration-300 group"
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-14 h-14 rounded-2xl bg-white border border-slate-200/80 flex items-center justify-center shadow-sm group-hover:border-[#004D95]/30 group-hover:bg-blue-50/50 transition-colors">
                      {item.icon}
                    </div>
                    <span className="text-xs font-semibold text-[#004D95] bg-blue-50 px-2.5 py-1 rounded-full border border-blue-100">
                      {item.badge}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-[#004D95] transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-sm text-slate-600 leading-relaxed font-medium break-keep">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. 전국 거점 물문화관 현황 요약 섹션 */}
      <section className="py-16 sm:py-20 bg-slate-50/70 border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
            <span className="text-xs sm:text-sm font-bold text-[#004D95] tracking-wider bg-blue-50 px-3.5 py-1.5 rounded-md inline-block mb-3 border border-blue-100">
              전국 네트워크
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight break-keep">
              전국 거점 물문화관 현황 요약
            </h2>
            <p className="mt-3 text-sm text-slate-600 font-medium break-keep">
              대한민국 방방곡곡 수자원 요충지에 위치한 15개 물문화관을 국민 누구나 무료로 자유롭게 이용하실 수 있습니다.
            </p>
          </div>

          {/* 팩트 중심 통계 카드 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            {statsSummary.map((stat) => (
              <div
                key={stat.label}
                className="rounded-2xl bg-white border border-slate-200 p-8 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow"
              >
                <div>
                  <span className="text-xs font-bold text-slate-500 block mb-2">
                    {stat.label}
                  </span>
                  <div className="text-2xl sm:text-3xl font-black text-[#004D95] tracking-tight mb-3">
                    {stat.value}
                  </div>
                  <p className="text-sm text-slate-600 font-medium break-keep">
                    {stat.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* 하단 둘러보기 버튼 CTA */}
          <div className="mt-12 text-center">
            <Link
              href="/centers"
              className="inline-flex min-h-13 items-center justify-center rounded-xl bg-[#004D95] hover:bg-[#003870] text-white font-bold text-base px-9 py-3.5 transition shadow-md hover:shadow-lg gap-2"
            >
              <span>전국 물문화관 둘러보기</span>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* 4. 관람 안내 및 편의 서비스 */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight break-keep">
              관람 안내 및 시큐리티 서비스
            </h2>
            <p className="mt-3 text-sm text-slate-600 font-medium break-keep">
              쾌적하고 안전한 관람 환경을 위해 K-water가 제공하는 편의 서비스를 안내합니다.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="rounded-2xl border border-slate-200 bg-slate-50/60 p-6 hover:bg-white hover:shadow-md transition">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#004D95] flex items-center justify-center mb-4">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 002 2h14a2 2 0 002-2V7a2 2 0 00-2-2H5z" />
                </svg>
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-1">입장료 무료</h3>
              <p className="text-xs text-slate-600 leading-relaxed font-medium break-keep">
                전국 15개 모든 K-water 물문화관은 전 국민 대상 무료로 자율 관람하실 수 있습니다.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50/60 p-6 hover:bg-white hover:shadow-md transition">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#004D95] flex items-center justify-center mb-4">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-1">관람 시간</h3>
              <p className="text-xs text-slate-600 leading-relaxed font-medium break-keep">
                09:00 ~ 18:00 (입장 마감 17:30 / 매주 월요일 및 명절 당일 휴관)
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50/60 p-6 hover:bg-white hover:shadow-md transition">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#004D95] flex items-center justify-center mb-4">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-1">무료 가이드 해설</h3>
              <p className="text-xs text-slate-600 leading-relaxed font-medium break-keep">
                단체 및 가족 방문객을 위한 전문 도슨트 해설 투어를 사전 온라인 예약하세요.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50/60 p-6 hover:bg-white hover:shadow-md transition">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#004D95] flex items-center justify-center mb-4">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-1">편의시설 & 주차</h3>
              <p className="text-xs text-slate-600 leading-relaxed font-medium break-keep">
                대형 무료 주차장, 수변 산책로, 호수 전망대, 수변 북카페가 완비되어 있습니다.
              </p>
            </div>
          </div>
        </div>
      </section>

      <WaterHubFooter />
    </div>
  );
}
