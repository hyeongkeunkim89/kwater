import Link from "next/link";
import Image from "next/image";

export default function GatewayLandingPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col md:flex-row overflow-x-hidden selection:bg-sky-500 selection:text-white">
      {/* ── 컬럼 1 (맨 좌측): 우측 4개 섹션과 조화를 이루는 슬레이트-워터 그라데이션 ── */}
      <div className="w-full md:w-[21%] lg:w-[20%] shrink-0 bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900 border-b md:border-b-0 md:border-r border-white/10 text-white p-6 sm:p-7 flex flex-col justify-between items-center text-center relative z-20 shadow-2xl">
        
        {/* 1. 좌측 상단: 방울이 캐릭터 아이콘 */}
        <div className="w-full flex justify-start items-center">
          <div className="relative w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-start group">
            <Image
              src="/bangwoori.png"
              alt="K-water 방울이 마스코트"
              width={72}
              height={72}
              className="object-contain drop-shadow-md group-hover:scale-105 transition duration-300"
              priority
            />
          </div>
        </div>

        {/* 2. 가운데: K-water 로고 & 물문화관 타이틀 */}
        <div className="my-6 flex flex-col items-center">
          <Image
            src="/kwater-logo.svg"
            alt="K-water 한국수자원공사"
            width={130}
            height={26}
            className="h-5 sm:h-6 w-auto brightness-0 invert opacity-95"
            priority
          />
          <h1 className="mt-3.5 text-2xl sm:text-3xl font-black text-white tracking-tight">
            물문화관
          </h1>
          <p className="mt-3.5 text-[10px] sm:text-[11px] font-bold text-sky-400 tracking-widest uppercase">
            WATER CULTURE CENTER PORTAL
          </p>
        </div>

        {/* 3. 하단: 메인 홈페이지 바로가기 버튼 */}
        <div className="w-full pt-4 border-t border-white/10">
          <Link
            href="/main"
            className="w-full min-h-11 px-4 inline-flex items-center justify-center rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 text-xs sm:text-sm font-black transition duration-200 shadow-lg shadow-sky-500/20 group"
          >
            <span>메인 홈페이지 바로가기</span>
            <span className="ml-1.5 transform group-hover:translate-x-1 transition duration-200">→</span>
          </Link>
        </div>
      </div>

      {/* ── 컬럼 2~5 (우측 4대 세로 섹션: 기술 / 생태 / 역사 / 교육) ── */}
      <div className="flex-1 flex flex-col md:flex-row min-h-[500px] md:min-h-screen">
        
        {/* ── 컬럼 2: 기술 (Technology) ── */}
        <Link
          href="/main"
          className="group relative flex-1 min-h-[220px] md:min-h-screen border-b md:border-b-0 md:border-r border-white/15 overflow-hidden transition-all duration-500 ease-out md:hover:flex-[1.35] flex flex-col justify-end p-6 sm:p-8"
        >
          {/* 배경 대표 배경 이미지 & 시네마틱 내추럴 오버레이 */}
          <div
            className="absolute inset-0 bg-cover bg-center transition-transform duration-700 ease-out group-hover:scale-105 brightness-[0.98] contrast-[1.05]"
            style={{
              backgroundImage: `url('https://upload.wikimedia.org/wikipedia/commons/thumb/8/8d/Daecheong_Dam_after_rain_-_%EB%8C%80%EC%B2%AD%EB%8C%90.jpg/1280px-Daecheong_Dam_after_rain_-_%EB%8C%80%EC%B2%AD%EB%8C%90.jpg')`,
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-transparent group-hover:from-slate-950/95 transition duration-300" />
          <div className="absolute inset-0 bg-indigo-950/20 opacity-40 group-hover:opacity-10 transition duration-300" />

          {/* 콘텐츠 */}
          <div className="relative z-10">
            <span className="text-[10px] font-black tracking-widest text-cyan-300 uppercase bg-cyan-950/80 px-2.5 py-1 rounded-full border border-cyan-500/30 backdrop-blur-sm">
              01 · TECHNOLOGY
            </span>
            <h2 className="mt-3 text-xl sm:text-2xl lg:text-3xl font-black text-white group-hover:text-cyan-300 transition drop-shadow-md">
              ⚙️ 기술
            </h2>
            <p className="mt-1.5 text-xs text-slate-200 font-semibold leading-relaxed line-clamp-2 sm:line-clamp-3 drop-shadow">
              스마트 수자원 관리, 댐 엔지니어링, 친환경 수력발전 기술 안내
            </p>
          </div>
        </Link>

        {/* ── 컬럼 3: 생태 (Ecology) ── */}
        <Link
          href="/main"
          className="group relative flex-1 min-h-[220px] md:min-h-screen border-b md:border-b-0 md:border-r border-white/15 overflow-hidden transition-all duration-500 ease-out md:hover:flex-[1.35] flex flex-col justify-end p-6 sm:p-8"
        >
          {/* 배경 대표 배경 이미지 & 시네마틱 내추럴 오버레이 */}
          <div
            className="absolute inset-0 bg-cover bg-center transition-transform duration-700 ease-out group-hover:scale-105 brightness-[0.98] contrast-[1.05]"
            style={{
              backgroundImage: `url('https://upload.wikimedia.org/wikipedia/commons/thumb/e/ea/SoyangDam.JPG/1280px-SoyangDam.JPG')`,
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-transparent group-hover:from-slate-950/95 transition duration-300" />
          <div className="absolute inset-0 bg-emerald-950/20 opacity-40 group-hover:opacity-10 transition duration-300" />

          {/* 콘텐츠 */}
          <div className="relative z-10">
            <span className="text-[10px] font-black tracking-widest text-emerald-300 uppercase bg-emerald-950/80 px-2.5 py-1 rounded-full border border-emerald-500/30 backdrop-blur-sm">
              02 · ECOLOGY
            </span>
            <h2 className="mt-3 text-xl sm:text-2xl lg:text-3xl font-black text-white group-hover:text-emerald-300 transition drop-shadow-md">
              🌿 생태
            </h2>
            <p className="mt-1.5 text-xs text-slate-200 font-semibold leading-relaxed line-clamp-2 sm:line-clamp-3 drop-shadow">
              강과 호수, 수변 동식물 생태계, 아름다운 수변 둘레길 산책 안내
            </p>
          </div>
        </Link>

        {/* ── 컬럼 4: 역사 (History) ── */}
        <Link
          href="/main"
          className="group relative flex-1 min-h-[220px] md:min-h-screen border-b md:border-b-0 md:border-r border-white/15 overflow-hidden transition-all duration-500 ease-out md:hover:flex-[1.35] flex flex-col justify-end p-6 sm:p-8"
        >
          {/* 배경 대표 배경 이미지 & 시네마틱 내추럴 오버레이 */}
          <div
            className="absolute inset-0 bg-cover bg-center transition-transform duration-700 ease-out group-hover:scale-105 brightness-[0.98] contrast-[1.05]"
            style={{
              backgroundImage: `url('https://upload.wikimedia.org/wikipedia/commons/thumb/2/23/Chungju_Lake.jpg/1280px-Chungju_Lake.jpg')`,
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-transparent group-hover:from-slate-950/95 transition duration-300" />
          <div className="absolute inset-0 bg-amber-950/20 opacity-40 group-hover:opacity-10 transition duration-300" />

          {/* 콘텐츠 */}
          <div className="relative z-10">
            <span className="text-[10px] font-black tracking-widest text-amber-300 uppercase bg-amber-950/80 px-2.5 py-1 rounded-full border border-amber-500/30 backdrop-blur-sm">
              03 · HISTORY
            </span>
            <h2 className="mt-3 text-xl sm:text-2xl lg:text-3xl font-black text-white group-hover:text-amber-300 transition drop-shadow-md">
              🏛️ 역사
            </h2>
            <p className="mt-1.5 text-xs text-slate-200 font-semibold leading-relaxed line-clamp-2 sm:line-clamp-3 drop-shadow">
              대한민국 치수 발자취, 수몰 마을 사람들의 생활 사료와 추억 기록
            </p>
          </div>
        </Link>

        {/* ── 컬럼 5: 교육 (Education) ── */}
        <Link
          href="/main"
          className="group relative flex-1 min-h-[220px] md:min-h-screen overflow-hidden transition-all duration-500 ease-out md:hover:flex-[1.35] flex flex-col justify-end p-6 sm:p-8"
        >
          {/* 배경 대표 배경 이미지 & 시네마틱 내추럴 오버레이 */}
          <div
            className="absolute inset-0 bg-cover bg-center transition-transform duration-700 ease-out group-hover:scale-105 brightness-[0.98] contrast-[1.05]"
            style={{
              backgroundImage: `url('/peace-dam-trench.jpg')`,
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-transparent group-hover:from-slate-950/95 transition duration-300" />
          <div className="absolute inset-0 bg-sky-950/20 opacity-40 group-hover:opacity-10 transition duration-300" />

          {/* 콘텐츠 */}
          <div className="relative z-10">
            <span className="text-[10px] font-black tracking-widest text-sky-300 uppercase bg-sky-950/80 px-2.5 py-1 rounded-full border border-sky-500/30 backdrop-blur-sm">
              04 · EDUCATION & EXPERIENCE
            </span>
            <h2 className="mt-3 text-xl sm:text-2xl lg:text-3xl font-black text-white group-hover:text-sky-300 transition drop-shadow-md">
              🎓 교육
            </h2>
            <p className="mt-1.5 text-xs text-slate-200 font-semibold leading-relaxed line-clamp-2 sm:line-clamp-3 drop-shadow">
              어린이 친환경 물 체험관, 안보체험 및 전문 해설사 가이드 투어 예약 서비스
            </p>
          </div>
        </Link>

      </div>
    </div>
  );
}
