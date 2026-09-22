import Image from "next/image";
import Link from "next/link";
import { WaterHubHeader } from "@/components/WaterHubHeader";
import { WaterHubFooter } from "@/components/WaterHubFooter";

export const metadata = {
  title: "문화관 소개 | K-water 물문화관 에디토리얼",
  description: "물과 자연, 그리고 사람이 함께 호흡하는 복합 문화 체험 공간 K-water 물문화관을 소개합니다.",
};

export default function IntroPage() {
  // 지그재그 에디토리얼 테마 데이터
  const editorialThemes = [
    {
      num: "01",
      category: "TECHNOLOGY",
      categoryTitle: "첨단 기술 & 청정에너지",
      title: "세계 최대 조력발전과 스마트 댐 수자원 관리의 미래",
      desc: "세계 최대 규모의 시화호 조력발전소와 스마트 댐 수자원 관리, 합천호 수상태양광 등 기후위기에 대응하는 K-water의 대표적인 미래 청정에너지 비전을 소개합니다.",
      image: "/images/cards/chungju_experience.png",
      badgeColor: "bg-sky-600 text-white",
      tagColor: "bg-sky-50 text-sky-800 border-sky-200",
      centers: [
        {
          title: "시화나래 조력문화관 · 달전망대",
          tag: "경기 안산시",
          sub: "밀물과 썰물의 힘을 활용한 세계 최대 조력발전의 원리 체험 및 75m 높이 360도 유리전망대 조망",
        },
        {
          title: "충주댐 물문화관",
          tag: "충북 충주시",
          sub: "국내 최대 다목적댐의 수자원 모니터링 시스템과 첨단 미디어파사드 연출 공간",
        },
      ],
      keywords: ["#조력발전원리", "#360도유리전망대", "#3D디지털모니터링", "#수상태양광"],
      isReversed: false,
    },
    {
      num: "02",
      category: "ECOLOGY",
      categoryTitle: "청정 생태 & 수생태계 보존",
      title: "천혜의 아름다운 호수와 살아 숨 쉬는 자생 동식물",
      desc: "금강 수계 대청호, 소양호, 변산반도 국립공원 등 천혜의 자연 환경 속에서 멸종위기 야생 동식물과 수생태계의 귀중한 생명력을 지키고 보존합니다.",
      image: "/centers/buan.jpg",
      badgeColor: "bg-emerald-600 text-white",
      tagColor: "bg-emerald-50 text-emerald-800 border-emerald-200",
      centers: [
        {
          title: "대청댐 물문화관",
          tag: "대전 대덕구",
          sub: "금강 수계에 자생하는 민물고기 생태 수족관과 대청호 생태계 환경 교육관",
        },
        {
          title: "부안댐 물문화관",
          tag: "전북 부안군",
          sub: "변산반도 국립공원의 청정 산림·호수 생태 보호 및 동식물 생태 학습장",
        },
      ],
      keywords: ["#금강민물고기수족관", "#변산반도국립공원", "#수생태계보호", "#대청호수변길"],
      isReversed: true,
    },
    {
      num: "03",
      category: "HISTORY",
      categoryTitle: "치수 역사 & 수몰지 아련한 기억",
      title: "대한민국 치수 60년의 발자취와 고향을 기억하는 기록",
      desc: "대한민국 근대 치수 사업의 역사적 사료와 댐 건설로 정든 터전을 떠나야 했던 수몰지 주민들의 삶의 유물과 사진을 소중하게 보존하고 전승합니다.",
      image: "/images/cards/hoengseong_experience.png",
      badgeColor: "bg-amber-600 text-white",
      tagColor: "bg-amber-50 text-amber-800 border-amber-200",
      centers: [
        {
          title: "횡성댐 물문화관 (망향의 동산)",
          tag: "강원 횡성군",
          sub: "수몰지 5개 리 주민들의 삶의 옛 유물 전시 및 횡성호수길 망향 탐방로 연계",
        },
        {
          title: "소양강댐 물문화관",
          tag: "강원 춘천시",
          sub: "동양 최대 사급 흙댐 축조 역사와 근대 수자원 개발 60년 사료 전시관",
        },
      ],
      keywords: ["#망향의동산", "#횡성호수길", "#소양강댐60년사", "#수몰지옛유물"],
      isReversed: false,
    },
    {
      num: "04",
      category: "CULTURE & ARTS",
      categoryTitle: "수변 문화예술 & 힐링 쉼터",
      title: "자연과 지역사회가 함께 어우러지는 다채로운 문화 레저",
      desc: "진주 남강 유등축제 연계 수변 기획 갤러리, 디아크 미디어아트, 김천부항댐 짚와이어 등 지역 주민과 방문객이 함께 어우러지는 활력 있는 수변 문화 쉼터입니다.",
      image: "/centers/namgang.jpg",
      badgeColor: "bg-indigo-600 text-white",
      tagColor: "bg-indigo-50 text-indigo-800 border-indigo-200",
      centers: [
        {
          title: "남강댐 물문화관",
          tag: "경남 진주시",
          sub: "진주 남강 유등 축제 연계 기획 미술 갤러리 및 호수를 조망하는 수변 북카페",
        },
        {
          title: "김천부항댐 물문화관",
          tag: "경북 김천시",
          sub: "국내 최고 93m 높이 수변 짚와이어, 출렁다리, 스카이워크 액티비티",
        },
      ],
      keywords: ["#남강유등축제", "#수변미술갤러리", "#93m부항댐짚와이어", "#호수전망북카페"],
      isReversed: true,
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      <WaterHubHeader activeNav="intro" />

      {/* 1. 브랜드 매거진 히어로 (에디토리얼 헤더) */}
      <section className="relative bg-white pt-12 pb-20 border-b border-slate-200 overflow-hidden">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* 타이포그래피 메시지 */}
            <div className="lg:col-span-6">
              <span className="inline-flex items-center gap-2 rounded-full bg-sky-100 text-sky-800 text-xs font-bold px-3.5 py-1 mb-6">
                <span className="h-2 w-2 rounded-full bg-sky-600" />
                K-water 브랜드 스토리텔링
              </span>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 leading-[1.2] tracking-tight">
                물과 자연, 사람을 연결하는<br />
                <span className="text-sky-600">K-water 물문화관</span> 이야기
              </h1>
              <p className="mt-6 text-sm sm:text-base text-slate-600 leading-relaxed font-medium">
                전국 15개 거점 다목적댐과 조력발전소에 조성된 물문화관은<br className="hidden sm:block" />
                깨끗한 수자원의 가치와 풍요로운 수변 환경을 전 국민이 무료로 체험하는 복합 문화 휴식 공간입니다.
              </p>

              {/* 하이라이트 요약 태그 */}
              <div className="mt-8 flex flex-wrap gap-2 text-xs font-bold text-slate-600">
                <span className="bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200/80">
                  📍 전국 15개 거점
                </span>
                <span className="bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200/80">
                  🎟️ 100% 무료 관람
                </span>
                <span className="bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200/80">
                  🗣️ 전문 도슨트 해설
                </span>
                <span className="bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200/80">
                  🌿 365일 친환경 쉼터
                </span>
              </div>

              <div className="mt-8 flex items-center gap-4">
                <Link
                  href="/status"
                  className="inline-flex min-h-12 items-center justify-center rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm px-6 transition shadow-md"
                >
                  전국 15개 현황 탐색 →
                </Link>
                <Link
                  href="/reserve"
                  className="inline-flex min-h-12 items-center justify-center rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-800 font-bold text-sm px-6 transition"
                >
                  무료 해설 투어 예약
                </Link>
              </div>
            </div>

            {/* 히어로 브랜드 비주얼 커버 */}
            <div className="lg:col-span-6">
              <div className="relative h-[360px] sm:h-[420px] w-full rounded-3xl overflow-hidden shadow-2xl border border-slate-200/80">
                <Image
                  src="/centers/hoengseong.jpg"
                  alt="횡성댐 물문화관 브랜드 비주얼"
                  fill
                  priority
                  className="object-cover brightness-95"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />
                <div className="absolute bottom-6 left-6 right-6 text-white">
                  <span className="text-xs font-bold uppercase tracking-wider text-sky-300 block mb-1">
                    Featured Culture Hub
                  </span>
                  <h3 className="text-xl font-black text-white">
                    횡성댐 물문화관 & 횡성호수길
                  </h3>
                  <p className="text-xs text-slate-200 font-medium mt-1">
                    아름다운 호수 전경과 망향의 동산이 조화롭게 어우러진 K-water 대표 문화관
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 2. 브랜드 비전과 3대 핵심 미션 */}
      <section className="py-16 bg-slate-100/60 border-b border-slate-200/80">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold text-sky-700 uppercase tracking-wider bg-sky-100 px-3 py-1 rounded-md inline-block mb-3">
              Core Brand Vision
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              물문화관이 전하는 3가지 약속
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="rounded-2xl bg-white p-7 border border-slate-200/80 shadow-sm flex flex-col justify-between">
              <div>
                <span className="text-3xl mb-4 block">💧</span>
                <h3 className="text-lg font-bold text-slate-900 mb-2">물자원의 가치 조명</h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
                  댐 축조의 역사와 스마트 댐 수자원 관리 기술을 통해 맑고 깨끗한 수자원의 소중함을 전합니다.
                </p>
              </div>
            </div>

            <div className="rounded-2xl bg-white p-7 border border-slate-200/80 shadow-sm flex flex-col justify-between">
              <div>
                <span className="text-3xl mb-4 block">🌱</span>
                <h3 className="text-lg font-bold text-slate-900 mb-2">청정 수생태계 보존</h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
                  금강 민물고기와 변산반도 자생 생물 등 수생태계의 생명력을 다채로운 전시로 관람객에게 알립니다.
                </p>
              </div>
            </div>

            <div className="rounded-2xl bg-white p-7 border border-slate-200/80 shadow-sm flex flex-col justify-between">
              <div>
                <span className="text-3xl mb-4 block">🎨</span>
                <h3 className="text-lg font-bold text-slate-900 mb-2">수변 문화예술 쉼터</h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
                  기획 미술 갤러리, 짚와이어, 수변 북카페를 갖추어 자연과 사람이 소통하는 힐링 공간을 제공합니다.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. 4대 테마 지그재그 에디토리얼 스토리텔링 섹션 */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-bold text-sky-700 uppercase tracking-wider bg-sky-100 px-3 py-1 rounded-md inline-block mb-3">
              Editorial Feature Story
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              K-water 물문화관 4대 테마 스토리
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-slate-500 font-medium">
              각 테마가 담고 있는 고유한 가치와 대표 문화관의 매력을 감상해보세요.
            </p>
          </div>

          <div className="space-y-20">
            {editorialThemes.map((t) => (
              <div
                key={t.num}
                className={`grid grid-cols-1 lg:grid-cols-12 gap-10 items-center ${
                  t.isReversed ? "lg:flex-row-reverse" : ""
                }`}
              >
                {/* 비주얼 이미지 카드 */}
                <div className={`lg:col-span-6 ${t.isReversed ? "lg:order-2" : "lg:order-1"}`}>
                  <div className="relative h-72 sm:h-96 w-full rounded-3xl overflow-hidden shadow-xl border border-slate-200/80 group">
                    <Image
                      src={t.image}
                      alt={t.title}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />
                    <div className="absolute top-5 left-5">
                      <span className={`inline-block px-3 py-1 rounded-lg text-xs font-black shadow-md ${t.badgeColor}`}>
                        {t.num} · {t.category}
                      </span>
                    </div>
                  </div>
                </div>

                {/* 에디토리얼 글상자 */}
                <div className={`lg:col-span-6 ${t.isReversed ? "lg:order-1" : "lg:order-2"}`}>
                  <span className="text-xs font-bold text-sky-600 block mb-1">
                    {t.categoryTitle}
                  </span>
                  <h3 className="text-xl sm:text-2xl font-black text-slate-900 leading-snug">
                    {t.title}
                  </h3>
                  <p className="mt-4 text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
                    {t.desc}
                  </p>

                  {/* 대표 센터 카드 서브 그리드 */}
                  <div className="mt-6 space-y-3">
                    {t.centers.map((c) => (
                      <div key={c.title} className="rounded-xl bg-slate-50 p-4 border border-slate-200/80">
                        <div className="flex items-center justify-between gap-2 mb-1">
                          <h4 className="text-xs sm:text-sm font-bold text-slate-900">{c.title}</h4>
                          <span className="text-[10px] font-bold text-sky-800 bg-sky-100 px-2 py-0.5 rounded">
                            {c.tag}
                          </span>
                        </div>
                        <p className="text-[11px] sm:text-xs text-slate-500 font-medium leading-snug">
                          {c.sub}
                        </p>
                      </div>
                    ))}
                  </div>

                  {/* 키워드 태그 */}
                  <div className="mt-5 flex flex-wrap gap-1.5">
                    {t.keywords.map((k) => (
                      <span key={k} className="text-[11px] font-semibold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-md">
                        {k}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. 관람객을 위한 이용 가이드 (Editorial Guide Grid) */}
      <section className="py-16 bg-slate-100/70 border-t border-slate-200/80">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              물문화관 방문 이용 가이드
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-slate-500 font-medium">
              방문객 여러분의 편안한 관람을 위한 핵심 안내 사항입니다.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="rounded-2xl bg-white p-6 border border-slate-200/80 shadow-sm">
              <span className="text-xs font-bold text-sky-600 bg-sky-50 px-2.5 py-1 rounded-md inline-block mb-3">
                입장 혜택
              </span>
              <h3 className="text-base font-bold text-slate-900 mb-1.5">전관 무료 관람</h3>
              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                전국 15개 모든 K-water 물문화관은 전 국민 누구나 무료로 자율 관람하실 수 있습니다.
              </p>
            </div>

            <div className="rounded-2xl bg-white p-6 border border-slate-200/80 shadow-sm">
              <span className="text-xs font-bold text-sky-600 bg-sky-50 px-2.5 py-1 rounded-md inline-block mb-3">
                운영 시간
              </span>
              <h3 className="text-base font-bold text-slate-900 mb-1.5">09:00 ~ 18:00</h3>
              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                입장 마감은 17:30이며, 매주 월요일 및 명절 당일은 휴관일입니다.
              </p>
            </div>

            <div className="rounded-2xl bg-white p-6 border border-slate-200/80 shadow-sm">
              <span className="text-xs font-bold text-sky-600 bg-sky-50 px-2.5 py-1 rounded-md inline-block mb-3">
                도슨트 투어
              </span>
              <h3 className="text-base font-bold text-slate-900 mb-1.5">무료 해설 예약</h3>
              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                단체 및 가족 방문객 대상 전문 도슨트 해설 서비스를 사전 온라인 예약할 수 있습니다.
              </p>
            </div>

            <div className="rounded-2xl bg-white p-6 border border-slate-200/80 shadow-sm">
              <span className="text-xs font-bold text-sky-600 bg-sky-50 px-2.5 py-1 rounded-md inline-block mb-3">
                편의 시설
              </span>
              <h3 className="text-base font-bold text-slate-900 mb-1.5">무료 대형 주차장</h3>
              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                대형 무료 주차장과 수변 산책로, 호수 전망대, 수변 북카페를 완비하고 있습니다.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. CTA 하단 연결 배너 */}
      <section className="relative py-20 bg-slate-900 text-white overflow-hidden">
        <Image
          src="/centers/hoengseong.jpg"
          alt="횡성댐 물문화관 실루엣"
          fill
          className="object-cover opacity-60 brightness-95 scale-105 pointer-events-none"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/45 to-slate-900/10 pointer-events-none" />

        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
          <span className="inline-block rounded-full bg-sky-500/20 text-sky-300 text-xs font-bold px-4 py-1 mb-4 border border-sky-500/30">
            K-water 물문화관 통합 플랫폼
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-white tracking-tight leading-tight">
            지금, 가까운 K-water 물문화관을 탐색하고<br />
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
              전국 15개 물문화관 현황 탐색 →
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
