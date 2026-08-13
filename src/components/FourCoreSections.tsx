"use client";

import Link from "next/link";

export function FourCoreSections() {
  return (
    <div className="space-y-10 sm:space-y-14">
      {/* ── SECTION 1: ⚙️ 기술 (Technology) ── */}
      <section aria-label="기술 테마 메인 안내" className="rounded-3xl border border-indigo-100/20 bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 p-6 sm:p-8 text-white shadow-xl">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-indigo-500/20 pb-6">
          <div>
            <span className="inline-flex items-center gap-1.5 text-xs font-black text-cyan-300 bg-cyan-950/80 px-3.5 py-1.5 rounded-full border border-cyan-500/30 tracking-wider uppercase">
              ⚙️ SECTION 01 · TECHNOLOGY
            </span>
            <h2 className="mt-3 text-2xl sm:text-3xl font-black tracking-tight text-white">
              기술 <span className="text-cyan-400 font-normal">| 댐 엔지니어링 & 스마트 수자원</span>
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-slate-300 font-medium leading-relaxed max-w-2xl">
              국내 최대 다목적댐과 홍수 조절 기술, 친환경 수력발전, 스마트 수계 관리 시스템을 한눈에 볼 수 있는 수자원 기술 메인 안내입니다.
            </p>
          </div>
          <Link
            href="/intro"
            className="shrink-0 inline-flex min-h-11 items-center justify-center rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-black px-5 transition shadow-lg shadow-cyan-500/20 whitespace-nowrap"
          >
            문화관 소개 메인 바로가기 →
          </Link>
        </div>

        <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            {
              title: "첨단 수자원 기술 소개",
              desc: "K-water 물 관리 공학, 댐 안전 및 첨단 수자원 관리 메인 안내",
              path: "/intro",
              tag: "기술 개요 메인",
            },
            {
              title: "전국 댐 거점 통합지도",
              desc: "전국 15개 거점 물문화관의 위치, 운영 정보 및 위치 대화형 지도",
              path: "/status",
              tag: "전국 현황 메인",
            },
            {
              title: "시설 및 층별 전시 안내",
              desc: "기술 전시관 실내 도면, 층별 시설 안내 및 대표 전경 확인",
              path: "/yunyeong",
              tag: "시설 안내 메인",
            },
          ].map((item) => (
            <Link
              key={item.title}
              href={item.path}
              className="group flex flex-col justify-between p-5 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-cyan-400/40 transition duration-200"
            >
              <div>
                <span className="text-[10px] font-extrabold text-cyan-300 bg-cyan-950/90 px-2 py-0.5 rounded border border-cyan-500/20">
                  {item.tag}
                </span>
                <h3 className="mt-2 text-base font-black text-white group-hover:text-cyan-300 transition">
                  {item.title}
                </h3>
                <p className="mt-1 text-xs text-slate-300 line-clamp-2 leading-relaxed font-medium">
                  {item.desc}
                </p>
              </div>
              <span className="mt-4 text-[11px] font-extrabold text-cyan-400 group-hover:underline">
                메인 페이지 바로가기 ↗
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* ── SECTION 2: 🌿 생태 (Ecology) ── */}
      <section aria-label="생태 테마 메인 안내" className="rounded-3xl border border-emerald-100/20 bg-gradient-to-br from-slate-900 via-emerald-950 to-slate-900 p-6 sm:p-8 text-white shadow-xl">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-emerald-500/20 pb-6">
          <div>
            <span className="inline-flex items-center gap-1.5 text-xs font-black text-emerald-300 bg-emerald-950/80 px-3.5 py-1.5 rounded-full border border-emerald-500/30 tracking-wider uppercase">
              🌿 SECTION 02 · ECOLOGY
            </span>
            <h2 className="mt-3 text-2xl sm:text-3xl font-black tracking-tight text-white">
              생태 <span className="text-emerald-400 font-normal">| 강과 호수, 수변 생태계</span>
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-slate-300 font-medium leading-relaxed max-w-2xl">
              소양호, 부안댐 등 깨끗한 상류 수계와 맑은 물, 동식물 생태계, 아름다운 수변 산책로를 품은 친환경 생태 메인 안내입니다.
            </p>
          </div>
          <Link
            href="/status"
            className="shrink-0 inline-flex min-h-11 items-center justify-center rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-black px-5 transition shadow-lg shadow-emerald-500/20 whitespace-nowrap"
          >
            전국 현황 지도 메인 바로가기 →
          </Link>
        </div>

        <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            {
              title: "수변 생태계 & 산책로 안내",
              desc: "댐 주변 생태 공원, 습지 보전 및 힐링 산책 코스 메인 소개",
              path: "/intro",
              tag: "생태 소개 메인",
            },
            {
              title: "수계별 거점 현황지도",
              desc: "한강, 금강, 영산강, 섬진강, 낙동강 수계별 물문화관 위치 확인",
              path: "/status",
              tag: "수계 지도 메인",
            },
            {
              title: "문화행사 & 생태 이벤트",
              desc: "계절별 수변 생태 체험 및 주관 문화행사 소식 보기",
              path: "/events",
              tag: "이벤트 메인",
            },
          ].map((item) => (
            <Link
              key={item.title}
              href={item.path}
              className="group flex flex-col justify-between p-5 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-emerald-400/40 transition duration-200"
            >
              <div>
                <span className="text-[10px] font-extrabold text-emerald-300 bg-emerald-950/90 px-2 py-0.5 rounded border border-emerald-500/20">
                  {item.tag}
                </span>
                <h3 className="mt-2 text-base font-black text-white group-hover:text-emerald-300 transition">
                  {item.title}
                </h3>
                <p className="mt-1 text-xs text-slate-300 line-clamp-2 leading-relaxed font-medium">
                  {item.desc}
                </p>
              </div>
              <span className="mt-4 text-[11px] font-extrabold text-emerald-400 group-hover:underline">
                메인 페이지 바로가기 ↗
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* ── SECTION 3: 🏛️ 역사 (History) ── */}
      <section aria-label="역사 테마 메인 안내" className="rounded-3xl border border-amber-100/20 bg-gradient-to-br from-slate-900 via-amber-950 to-slate-900 p-6 sm:p-8 text-white shadow-xl">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-amber-500/20 pb-6">
          <div>
            <span className="inline-flex items-center gap-1.5 text-xs font-black text-amber-300 bg-amber-950/80 px-3.5 py-1.5 rounded-full border border-amber-500/30 tracking-wider uppercase">
              🏛️ SECTION 03 · HISTORY
            </span>
            <h2 className="mt-3 text-2xl sm:text-3xl font-black tracking-tight text-white">
              역사 <span className="text-amber-400 font-normal">| 댐의 발자취 & 수몰 마을의 기억</span>
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-slate-300 font-medium leading-relaxed max-w-2xl">
              대한민국 치수·용수 공급의 역사와 함께, 댐 건설로 수몰된 옛 마을 주민들의 생활 사료와 추억을 기리는 공간 메인 안내입니다.
            </p>
          </div>
          <Link
            href="/yunyeong"
            className="shrink-0 inline-flex min-h-11 items-center justify-center rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black px-5 transition shadow-lg shadow-amber-500/20 whitespace-nowrap"
          >
            시설 & 전시 안내 메인 바로가기 →
          </Link>
        </div>

        <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            {
              title: "댐 역사관 & 수몰 사료관",
              desc: "대한민국 수자원 발전 역사 및 수몰 마을 기록관 메인 소개",
              path: "/intro",
              tag: "역사관 메인",
            },
            {
              title: "전국 15대 물문화관 현황",
              desc: "전국 거점 물문화관의 역사 전시 및 운영 정보 확인",
              path: "/status",
              tag: "종합 현황 메인",
            },
            {
              title: "층별 전시 & 실내 도면",
              desc: "수몰 역사관 실내 도면, 전시 구성 및 편의시설 사전 보기",
              path: "/yunyeong",
              tag: "도면 안내 메인",
            },
          ].map((item) => (
            <Link
              key={item.title}
              href={item.path}
              className="group flex flex-col justify-between p-5 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-amber-400/40 transition duration-200"
            >
              <div>
                <span className="text-[10px] font-extrabold text-amber-300 bg-amber-950/90 px-2 py-0.5 rounded border border-amber-500/20">
                  {item.tag}
                </span>
                <h3 className="mt-2 text-base font-black text-white group-hover:text-amber-300 transition">
                  {item.title}
                </h3>
                <p className="mt-1 text-xs text-slate-300 line-clamp-2 leading-relaxed font-medium">
                  {item.desc}
                </p>
              </div>
              <span className="mt-4 text-[11px] font-extrabold text-amber-400 group-hover:underline">
                메인 페이지 바로가기 ↗
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* ── SECTION 4: 🎓 교육 (Education & Experience) ── */}
      <section aria-label="교육 및 체험 메인 안내" className="rounded-3xl border border-sky-100/20 bg-gradient-to-br from-slate-900 via-sky-950 to-slate-900 p-6 sm:p-8 text-white shadow-xl">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-sky-500/20 pb-6">
          <div>
            <span className="inline-flex items-center gap-1.5 text-xs font-black text-sky-300 bg-sky-950/80 px-3.5 py-1.5 rounded-full border border-sky-500/30 tracking-wider uppercase">
              🎓 SECTION 04 · EDUCATION & EXPERIENCE
            </span>
            <h2 className="mt-3 text-2xl sm:text-3xl font-black tracking-tight text-white">
              교육 <span className="text-sky-400 font-normal">| 가이드 투어 & 물 체험 학습</span>
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-slate-300 font-medium leading-relaxed max-w-2xl">
              어린이·청소년을 위한 친환경 물 체험실과 영상관, 전문 해설사와 함께하는 15대 물문화관 해설 투어를 사전 신청하세요.
            </p>
          </div>
          <Link
            href="/reserve"
            className="shrink-0 inline-flex min-h-11 items-center justify-center rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 text-xs font-black px-6 transition shadow-lg shadow-sky-500/20 whitespace-nowrap"
          >
            투어 예약 메인 바로가기 📅
          </Link>
        </div>

        <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            {
              title: "가이드 해설 투어 예약 메인",
              desc: "전문 해설사와 함께하는 전시관 및 수변 탐방 투어 사전 신청",
              path: "/reserve",
              tag: "투어 예약 메인",
            },
            {
              title: "방문 소통 & 질의응답 창구",
              desc: "물문화관 관람 문의 및 소통 게시판 메인",
              path: "/feedback",
              tag: "소통 창구 메인",
            },
            {
              title: "물문화관 주요 소식 메인",
              desc: "K-water 공지사항 및 물문화관 최신 운용 소식 메인",
              path: "/news",
              tag: "주요 소식 메인",
            },
          ].map((item) => (
            <Link
              key={item.title}
              href={item.path}
              className="group flex flex-col justify-between p-5 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-sky-400/40 transition duration-200"
            >
              <div>
                <span className="text-[10px] font-extrabold text-sky-300 bg-sky-950/90 px-2 py-0.5 rounded border border-sky-500/20">
                  {item.tag}
                </span>
                <h3 className="mt-2 text-base font-black text-white group-hover:text-sky-300 transition">
                  {item.title}
                </h3>
                <p className="mt-1 text-xs text-slate-300 line-clamp-2 leading-relaxed font-medium">
                  {item.desc}
                </p>
              </div>
              <span className="mt-4 text-[11px] font-extrabold text-sky-400 group-hover:underline">
                메인 페이지 바로가기 ↗
              </span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
