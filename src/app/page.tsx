import Link from "next/link";
import Image from "next/image";

export default function GatewayLandingPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col md:flex-row overflow-x-hidden selection:bg-sky-500 selection:text-white">
      {/* ── 컬럼 1 (맨 좌측): 브랜딩 사이드바 ── */}
      <div className="w-full md:w-[19%] lg:w-[17%] xl:w-[16%] md:min-w-[210px] md:max-w-[270px] shrink-0 bg-slate-950 border-b md:border-b-0 md:border-r border-white/10 text-white p-6 sm:p-7 flex flex-col justify-between items-center text-center relative z-20 shadow-2xl">
        
        {/* 1. 좌측 상단: 방울이 캐릭터 아이콘 */}
        <div className="w-full flex justify-start items-center">
          <div className="relative w-16 h-16 sm:w-18 sm:h-18 flex items-center justify-start group">
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

        {/* 2. 가운데: K-water 물문화관 브랜드 로고 */}
        <div className="my-6 sm:my-8 flex flex-col items-center w-full px-1">
          <Image
            src="/images/kwater_waterhub_logo.png"
            alt="K-water 한국수자원공사 물문화관"
            width={828}
            height={276}
            className="h-14 sm:h-16 lg:h-20 w-auto object-contain brightness-0 invert opacity-95 hover:opacity-100 transition duration-300 drop-shadow-md"
            priority
          />
          <p className="mt-3 text-[10px] sm:text-[11px] font-black text-sky-400 tracking-[0.16em] uppercase whitespace-nowrap opacity-90">
            WATER CULTURE PORTAL
          </p>
        </div>

        {/* 3. 하단: 전국 물문화관 둘러보기 버튼 */}
        <div className="w-full pt-5 border-t border-white/10 px-1">
          <Link
            href="/main"
            className="w-full min-h-12 px-3 py-3 inline-flex items-center justify-center rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 text-xs sm:text-sm font-black transition duration-200 shadow-lg shadow-sky-500/25 group whitespace-nowrap tracking-tight"
          >
            <span>전국 물문화관 둘러보기</span>
            <span className="ml-1.5 transform group-hover:translate-x-1 transition duration-200">→</span>
          </Link>
        </div>
      </div>

      {/* ── 컬럼 2~5 (우측 4대 핵심 분야: 기술 / 생태 / 역사 / 문화) ── */}
      <div className="flex-1 flex flex-col md:flex-row min-h-[500px] md:min-h-screen">
        
        {/* ── 컬럼 2: 기술 (Technology) ── */}
        <Link
          href="/intro"
          className="group relative flex-1 min-h-[220px] md:min-h-screen border-b md:border-b-0 md:border-r border-white/10 overflow-hidden transition-all duration-500 ease-out md:hover:flex-[1.35] flex flex-col justify-end p-6 sm:p-8"
        >
          <div
            className="absolute inset-0 bg-cover bg-center transition-transform duration-700 ease-out group-hover:scale-105 brightness-[0.9] contrast-[1.05]"
            style={{
              backgroundImage: `url('https://upload.wikimedia.org/wikipedia/commons/thumb/8/8d/Daecheong_Dam_after_rain_-_%EB%8C%80%EC%B2%AD%EB%8C%90.jpg/1280px-Daecheong_Dam_after_rain_-_%EB%8C%80%EC%B2%AD%EB%8C%90.jpg')`,
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/95 via-slate-950/40 to-slate-950/10 group-hover:from-slate-950/90 transition duration-300" />

          <div className="relative z-10">
            <span className="inline-flex items-center gap-1.5 text-[10px] font-black tracking-widest text-sky-300 uppercase bg-slate-900/80 px-3 py-1 rounded-full border border-sky-400/30 backdrop-blur-md">
              <span className="w-1.5 h-1.5 rounded-full bg-sky-400 animate-pulse" />
              01 · TECHNOLOGY
            </span>
            <h2 className="mt-3 text-xl sm:text-2xl lg:text-3xl font-black text-white group-hover:text-sky-300 transition drop-shadow-md flex items-center gap-2.5">
              <svg className="w-6 h-6 text-sky-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span>기술</span>
            </h2>
            <p className="mt-1.5 text-xs text-slate-300 font-medium leading-relaxed tracking-[-0.03em] break-keep line-clamp-2">
              스마트 수자원 관리, 댐 엔지니어링, 친환경 수력발전 기술 안내
            </p>
          </div>
        </Link>

        {/* ── 컬럼 3: 생태 (Ecology) ── */}
        <Link
          href="/status"
          className="group relative flex-1 min-h-[220px] md:min-h-screen border-b md:border-b-0 md:border-r border-white/10 overflow-hidden transition-all duration-500 ease-out md:hover:flex-[1.35] flex flex-col justify-end p-6 sm:p-8"
        >
          <div
            className="absolute inset-0 bg-cover bg-center transition-transform duration-700 ease-out group-hover:scale-105 brightness-[0.9] contrast-[1.05]"
            style={{
              backgroundImage: `url('https://upload.wikimedia.org/wikipedia/commons/thumb/e/ea/SoyangDam.JPG/1280px-SoyangDam.JPG')`,
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/95 via-slate-950/40 to-slate-950/10 group-hover:from-slate-950/90 transition duration-300" />

          <div className="relative z-10">
            <span className="inline-flex items-center gap-1.5 text-[10px] font-black tracking-widest text-sky-300 uppercase bg-slate-900/80 px-3 py-1 rounded-full border border-sky-400/30 backdrop-blur-md">
              <span className="w-1.5 h-1.5 rounded-full bg-sky-400 animate-pulse" />
              02 · ECOLOGY
            </span>
            <h2 className="mt-3 text-xl sm:text-2xl lg:text-3xl font-black text-white group-hover:text-sky-300 transition drop-shadow-md flex items-center gap-2.5">
              <svg className="w-6 h-6 text-sky-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
              </svg>
              <span>생태</span>
            </h2>
            <p className="mt-1.5 text-xs text-slate-300 font-medium leading-relaxed tracking-[-0.03em] break-keep line-clamp-2">
              강과 호수, 수변 동식물 생태계, 아름다운 수변 둘레길 산책 안내
            </p>
          </div>
        </Link>

        {/* ── 컬럼 4: 역사 (History) ── */}
        <Link
          href="/intro"
          className="group relative flex-1 min-h-[220px] md:min-h-screen border-b md:border-b-0 md:border-r border-white/10 overflow-hidden transition-all duration-500 ease-out md:hover:flex-[1.35] flex flex-col justify-end p-6 sm:p-8"
        >
          <div
            className="absolute inset-0 bg-cover bg-center transition-transform duration-700 ease-out group-hover:scale-105 brightness-[0.9] contrast-[1.05]"
            style={{
              backgroundImage: `url('https://upload.wikimedia.org/wikipedia/commons/thumb/2/23/Chungju_Lake.jpg/1280px-Chungju_Lake.jpg')`,
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/95 via-slate-950/40 to-slate-950/10 group-hover:from-slate-950/90 transition duration-300" />

          <div className="relative z-10">
            <span className="inline-flex items-center gap-1.5 text-[10px] font-black tracking-widest text-sky-300 uppercase bg-slate-900/80 px-3 py-1 rounded-full border border-sky-400/30 backdrop-blur-md">
              <span className="w-1.5 h-1.5 rounded-full bg-sky-400 animate-pulse" />
              03 · HISTORY
            </span>
            <h2 className="mt-3 text-xl sm:text-2xl lg:text-3xl font-black text-white group-hover:text-sky-300 transition drop-shadow-md flex items-center gap-2.5">
              <svg className="w-6 h-6 text-sky-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5m0 0h4m-4 0V11m0 0V7m0 4h4m-4 0H7" />
              </svg>
              <span>역사</span>
            </h2>
            <p className="mt-1.5 text-xs text-slate-300 font-medium leading-relaxed tracking-[-0.03em] break-keep line-clamp-2">
              대한민국 치수 발자취, 수몰 마을 사람들의 생활 사료와 추억 기록
            </p>
          </div>
        </Link>

        {/* ── 컬럼 5: 문화 (Culture) ── */}
        <Link
          href="/events"
          className="group relative flex-1 min-h-[220px] md:min-h-screen overflow-hidden transition-all duration-500 ease-out md:hover:flex-[1.35] flex flex-col justify-end p-6 sm:p-8"
        >
          <div
            className="absolute inset-0 bg-cover bg-center transition-transform duration-700 ease-out group-hover:scale-105 brightness-[0.9] contrast-[1.05]"
            style={{
              backgroundImage: `url('/peace-dam-trench.jpg')`,
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/95 via-slate-950/40 to-slate-950/10 group-hover:from-slate-950/90 transition duration-300" />

          <div className="relative z-10">
            <span className="inline-flex items-center gap-1.5 text-[10px] font-black tracking-widest text-sky-300 uppercase bg-slate-900/80 px-3 py-1 rounded-full border border-sky-400/30 backdrop-blur-md">
              <span className="w-1.5 h-1.5 rounded-full bg-sky-400 animate-pulse" />
              04 · CULTURE & ARTS
            </span>
            <h2 className="mt-3 text-xl sm:text-2xl lg:text-3xl font-black text-white group-hover:text-sky-300 transition drop-shadow-md flex items-center gap-2.5">
              <svg className="w-6 h-6 text-sky-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
              </svg>
              <span>문화</span>
            </h2>
            <p className="mt-1.5 text-xs text-slate-300 font-medium leading-relaxed tracking-[-0.03em] break-keep line-clamp-2">
              수변 미디어아트, 레저 및 지역 문화행사, 대중 복합 휴식 공간 안내
            </p>
          </div>
        </Link>

      </div>
    </div>
  );
}
