"use client";

import Link from "next/link";
import { waterCenters } from "@/data/centers";

export function FourCoreSections() {
  // 기술 테마 센터
  const techCenters = waterCenters.filter((c) => c.themes.includes("기술")).slice(0, 3);
  // 생태 테마 센터
  const ecoCenters = waterCenters.filter((c) => c.themes.includes("생태")).slice(0, 3);
  // 역사 테마 센터
  const historyCenters = waterCenters.filter((c) => c.themes.includes("역사")).slice(0, 3);

  return (
    <div className="space-y-10 sm:space-y-14">
      {/* ── SECTION 1: ⚙️ 기술 (Technology) ── */}
      <section aria-label="기술 테마 물문화관" className="rounded-3xl border border-indigo-100/20 bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 p-6 sm:p-8 text-white shadow-xl">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-indigo-500/20 pb-6">
          <div>
            <span className="inline-flex items-center gap-1.5 text-xs font-black text-cyan-300 bg-cyan-950/80 px-3.5 py-1.5 rounded-full border border-cyan-500/30 tracking-wider uppercase">
              ⚙️ SECTION 01 · TECHNOLOGY
            </span>
            <h2 className="mt-3 text-2xl sm:text-3xl font-black tracking-tight text-white">
              기술 <span className="text-cyan-400 font-normal">| 댐 엔지니어링 & 스마트 수자원</span>
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-slate-300 font-medium leading-relaxed max-w-2xl">
              국내 최대 다목적댐과 홍수 조절 기술, 친환경 수력발전, 스마트 수계 관리 시스템을 한눈에 볼 수 있는 첨단 수자원 기술 전시 거점입니다.
            </p>
          </div>
          <Link
            href="/status"
            className="shrink-0 inline-flex min-h-11 items-center justify-center rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-black px-5 transition shadow-lg shadow-cyan-500/20 whitespace-nowrap"
          >
            기술 거점관 바로보기 →
          </Link>
        </div>

        <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
          {techCenters.map((center) => (
            <Link
              key={center.id}
              href={`/centers/${center.id}`}
              className="group flex flex-col justify-between p-5 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-cyan-400/40 transition duration-200"
            >
              <div>
                <span className="text-[10px] font-extrabold text-cyan-300 bg-cyan-950/90 px-2 py-0.5 rounded border border-cyan-500/20">
                  {center.sido} {center.sigungu}
                </span>
                <h3 className="mt-2 text-base font-black text-white group-hover:text-cyan-300 transition">
                  {center.name}
                </h3>
                <p className="mt-1 text-xs text-slate-300 line-clamp-2 leading-relaxed font-medium">
                  {center.summary}
                </p>
              </div>
              <span className="mt-4 text-[11px] font-extrabold text-cyan-400 group-hover:underline">
                기술 전시관 보기 ↗
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* ── SECTION 2: 🌿 생태 (Ecology) ── */}
      <section aria-label="생태 테마 물문화관" className="rounded-3xl border border-emerald-100/20 bg-gradient-to-br from-slate-900 via-emerald-950 to-slate-900 p-6 sm:p-8 text-white shadow-xl">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-emerald-500/20 pb-6">
          <div>
            <span className="inline-flex items-center gap-1.5 text-xs font-black text-emerald-300 bg-emerald-950/80 px-3.5 py-1.5 rounded-full border border-emerald-500/30 tracking-wider uppercase">
              🌿 SECTION 02 · ECOLOGY
            </span>
            <h2 className="mt-3 text-2xl sm:text-3xl font-black tracking-tight text-white">
              생태 <span className="text-emerald-400 font-normal">| 강과 호수, 수변 생태계</span>
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-slate-300 font-medium leading-relaxed max-w-2xl">
              소양호, 부안댐 등 국립공원 및 깨끗한 상류 수계에 위치하여 맑은 물과 동식물 생태계, 아름다운 수변 산책로를 품은 친환경 힐링 거점입니다.
            </p>
          </div>
          <Link
            href="/status"
            className="shrink-0 inline-flex min-h-11 items-center justify-center rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-black px-5 transition shadow-lg shadow-emerald-500/20 whitespace-nowrap"
          >
            생태 관람관 둘러보기 →
          </Link>
        </div>

        <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
          {ecoCenters.map((center) => (
            <Link
              key={center.id}
              href={`/centers/${center.id}`}
              className="group flex flex-col justify-between p-5 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-emerald-400/40 transition duration-200"
            >
              <div>
                <span className="text-[10px] font-extrabold text-emerald-300 bg-emerald-950/90 px-2 py-0.5 rounded border border-emerald-500/20">
                  {center.sido} {center.sigungu}
                </span>
                <h3 className="mt-2 text-base font-black text-white group-hover:text-emerald-300 transition">
                  {center.name}
                </h3>
                <p className="mt-1 text-xs text-slate-300 line-clamp-2 leading-relaxed font-medium">
                  {center.summary}
                </p>
              </div>
              <span className="mt-4 text-[11px] font-extrabold text-emerald-400 group-hover:underline">
                생태 탐방 보기 ↗
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* ── SECTION 3: 🏛️ 역사 (History) ── */}
      <section aria-label="역사 테마 물문화관" className="rounded-3xl border border-amber-100/20 bg-gradient-to-br from-slate-900 via-amber-950 to-slate-900 p-6 sm:p-8 text-white shadow-xl">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-amber-500/20 pb-6">
          <div>
            <span className="inline-flex items-center gap-1.5 text-xs font-black text-amber-300 bg-amber-950/80 px-3.5 py-1.5 rounded-full border border-amber-500/30 tracking-wider uppercase">
              🏛️ SECTION 03 · HISTORY
            </span>
            <h2 className="mt-3 text-2xl sm:text-3xl font-black tracking-tight text-white">
              역사 <span className="text-amber-400 font-normal">| 댐의 발자취 & 수몰 마을의 기억</span>
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-slate-300 font-medium leading-relaxed max-w-2xl">
              대한민국 치수·용수 공급의 역사와 함께, 댐 건설로 호수 아래 수몰된 옛 마을 주민들의 생활 사료와 잊지 못할 추억을 기리는 기록 공간입니다.
            </p>
          </div>
          <Link
            href="/status"
            className="shrink-0 inline-flex min-h-11 items-center justify-center rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black px-5 transition shadow-lg shadow-amber-500/20 whitespace-nowrap"
          >
            역사관 바로보기 →
          </Link>
        </div>

        <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
          {historyCenters.map((center) => (
            <Link
              key={center.id}
              href={`/centers/${center.id}`}
              className="group flex flex-col justify-between p-5 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-amber-400/40 transition duration-200"
            >
              <div>
                <span className="text-[10px] font-extrabold text-amber-300 bg-amber-950/90 px-2 py-0.5 rounded border border-amber-500/20">
                  {center.sido} {center.sigungu}
                </span>
                <h3 className="mt-2 text-base font-black text-white group-hover:text-amber-300 transition">
                  {center.name}
                </h3>
                <p className="mt-1 text-xs text-slate-300 line-clamp-2 leading-relaxed font-medium">
                  {center.summary}
                </p>
              </div>
              <span className="mt-4 text-[11px] font-extrabold text-amber-400 group-hover:underline">
                역사 사료관 보기 ↗
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* ── SECTION 4: 🎓 교육 (Education & Experience) ── */}
      <section aria-label="교육 및 체험 프로그램" className="rounded-3xl border border-sky-100/20 bg-gradient-to-br from-slate-900 via-sky-950 to-slate-900 p-6 sm:p-8 text-white shadow-xl">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-sky-500/20 pb-6">
          <div>
            <span className="inline-flex items-center gap-1.5 text-xs font-black text-sky-300 bg-sky-950/80 px-3.5 py-1.5 rounded-full border border-sky-500/30 tracking-wider uppercase">
              🎓 SECTION 04 · EDUCATION & EXPERIENCE
            </span>
            <h2 className="mt-3 text-2xl sm:text-3xl font-black tracking-tight text-white">
              교육 <span className="text-sky-400 font-normal">| 가이드 투어 & 물 체험 학습</span>
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-slate-300 font-medium leading-relaxed max-w-2xl">
              어린이·청소년을 위한 재미있는 친환경 물 체험실과 영상관, 전문 해설사와 함께하는 전국 15대 물문화관 맞춤형 해설 투어를 사전 신청하세요.
            </p>
          </div>
          <Link
            href="/reserve"
            className="shrink-0 inline-flex min-h-11 items-center justify-center rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 text-xs font-black px-6 transition shadow-lg shadow-sky-500/20 whitespace-nowrap"
          >
            투어 예약하러 가기 📅
          </Link>
        </div>

        <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            {
              title: "가이드 해설 투어 예약",
              desc: "전문 해설사와 함께 댐 전시관과 수변 공간을 깊이 있게 둘러보는 맞춤형 투어 서비스",
              path: "/reserve",
              badge: "사전 신청 필수",
            },
            {
              title: "시설 및 층별 전시 안내",
              desc: "15대 물문화관의 층별 실내 도면, 대표 전경 및 편의시설 사전 둘러보기",
              path: "/yunyeong",
              badge: "실내 도면 수록",
            },
            {
              title: "전국 거점 15개소 현황지도",
              desc: "전국 수계별 물문화관의 주소, 전화번호 및 관람 상태 통합 확인",
              path: "/status",
              badge: "15개소 통합",
            },
          ].map((item) => (
            <Link
              key={item.title}
              href={item.path}
              className="group flex flex-col justify-between p-5 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-sky-400/40 transition duration-200"
            >
              <div>
                <span className="text-[10px] font-extrabold text-sky-300 bg-sky-950/90 px-2 py-0.5 rounded border border-sky-500/20">
                  {item.badge}
                </span>
                <h3 className="mt-2 text-base font-black text-white group-hover:text-sky-300 transition">
                  {item.title}
                </h3>
                <p className="mt-1 text-xs text-slate-300 line-clamp-2 leading-relaxed font-medium">
                  {item.desc}
                </p>
              </div>
              <span className="mt-4 text-[11px] font-extrabold text-sky-400 group-hover:underline">
                바로가기 ↗
              </span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
