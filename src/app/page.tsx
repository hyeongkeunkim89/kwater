import Link from "next/link";
import Image from "next/image";

export default function GatewayLandingPage() {
  return (
    <div className="selection:bg-sky-500 selection:text-white">
      {/* ══════════════════════════════════════════════════════════════
          1. 모바일 전용 UI (md:hidden): K-water 시그니처 블루 풀스크린 인트로 (방안 A)
         ══════════════════════════════════════════════════════════════ */}
      <div className="flex md:hidden h-[100dvh] w-full relative overflow-hidden flex-col justify-between p-5 sm:p-6 text-white">
        {/* 배경: 대청호 수변 파노라마 + K-water 딥 오션블루 그라데이션 */}
        <div
          className="absolute inset-0 bg-cover bg-center brightness-[0.85] contrast-[1.05] scale-105"
          style={{
            backgroundImage: `url('https://upload.wikimedia.org/wikipedia/commons/thumb/8/8d/Daecheong_Dam_after_rain_-_%EB%8C%80%EC%B2%AD%EB%8C%90.jpg/1280px-Daecheong_Dam_after_rain_-_%EB%8C%80%EC%B2%AD%EB%8C%90.jpg')`,
          }}
        />
        {/* 깊이감 있는 시그니처 블루 비네팅 오버레이 */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#001833]/90 via-[#002e5c]/80 to-[#001226]/95 backdrop-blur-[1.5px]" />
        
        {/* 상단 은은한 빛 반사 앰비언트 글로우 */}
        <div className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 h-64 w-64 rounded-full bg-sky-400/20 blur-[80px]" />

        {/* ── 1. 상단: 브랜드 엠블럼 바 ── */}
        <header className="relative z-10 flex items-center justify-between shrink-0 pt-1">
          <div className="flex items-center gap-2.5">
            <div className="relative w-9 h-9 shrink-0 flex items-center justify-center">
              <Image
                src="/bangwoori.png"
                alt="방울이"
                width={36}
                height={36}
                className="object-contain drop-shadow-md"
                priority
              />
            </div>
            <div className="flex items-center gap-2">
              <Image
                src="/images/landing_color_symbol.png"
                alt="물문화관 로고"
                width={60}
                height={68}
                className="h-7 w-auto object-contain drop-shadow"
                priority
              />
              <div className="flex flex-col">
                <span className="text-sm font-black tracking-tight text-white leading-tight">
                  물문화관
                </span>
                <span className="text-[8.5px] font-extrabold text-sky-300 tracking-[0.16em] uppercase leading-tight">
                  WATER CULTURE
                </span>
              </div>
            </div>
          </div>

          <span className="text-[10px] font-bold text-sky-200 bg-white/10 border border-white/20 px-3 py-1 rounded-full backdrop-blur-md shadow-xs">
            K-water
          </span>
        </header>

        {/* ── 2. 중앙: 감성적 슬로건 & 4대 가치 글래스 카드 ── */}
        <main className="relative z-10 my-auto flex flex-col items-start py-2">
          {/* 아이브로우 뱃지 */}
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-400/15 border border-sky-300/30 text-sky-300 text-[11px] font-bold tracking-wide backdrop-blur-md">
            <span className="w-1.5 h-1.5 rounded-full bg-sky-400 animate-pulse" />
            대한민국 맑은 물과 문화의 만남
          </span>

          {/* 메인 헤드라인 */}
          <h1 className="mt-3 text-2xl sm:text-3xl font-black text-white tracking-tight leading-snug drop-shadow-md">
            자연과 사람, 물이 머무는 곳<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-200 via-sky-400 to-teal-300">
              K-water 온라인 물문화관
            </span>
          </h1>

          {/* 서브 설명글 */}
          <p className="mt-2 text-xs sm:text-sm text-slate-200/90 font-medium leading-relaxed max-w-sm drop-shadow-sm">
            전국 15대 댐과 4대 강 수변에 펼쳐진 물문화관에서 생태와 역사, 예술과 휴식이 공존하는 생생한 이야기를 만나보세요.
          </p>

          {/* 4대 가치 글래스모피즘(Glassmorphism) 미니멀 칩 그리드 */}
          <div className="mt-5 grid grid-cols-2 gap-2 w-full max-w-sm">
            <div className="flex items-center gap-2 p-2.5 rounded-xl bg-white/10 border border-white/15 backdrop-blur-md shadow-sm">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-sky-500/25 text-sky-300 text-sm">
                ⚙️
              </span>
              <div className="min-w-0">
                <div className="text-[11px] font-black text-white">01 기술</div>
                <div className="text-[9.5px] text-sky-200/80 truncate">스마트 수자원 관리</div>
              </div>
            </div>

            <div className="flex items-center gap-2 p-2.5 rounded-xl bg-white/10 border border-white/15 backdrop-blur-md shadow-sm">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-emerald-500/25 text-emerald-300 text-sm">
                🌿
              </span>
              <div className="min-w-0">
                <div className="text-[11px] font-black text-white">02 생태</div>
                <div className="text-[9.5px] text-emerald-200/80 truncate">수변 생태 &amp; 둘레길</div>
              </div>
            </div>

            <div className="flex items-center gap-2 p-2.5 rounded-xl bg-white/10 border border-white/15 backdrop-blur-md shadow-sm">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-amber-500/25 text-amber-300 text-sm">
                🏛️
              </span>
              <div className="min-w-0">
                <div className="text-[11px] font-black text-white">03 역사</div>
                <div className="text-[9.5px] text-amber-200/80 truncate">치수 발자취 &amp; 사료</div>
              </div>
            </div>

            <div className="flex items-center gap-2 p-2.5 rounded-xl bg-white/10 border border-white/15 backdrop-blur-md shadow-sm">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-rose-500/25 text-rose-300 text-sm">
                🎨
              </span>
              <div className="min-w-0">
                <div className="text-[11px] font-black text-white">04 문화</div>
                <div className="text-[9.5px] text-rose-200/80 truncate">미디어아트 &amp; 복합휴식</div>
              </div>
            </div>
          </div>
        </main>

        {/* ── 3. 하단: 메인 탐색 CTA 버튼 & 푸터 고지 ── */}
        <footer className="relative z-10 shrink-0 pt-2 flex flex-col gap-2">
          <Link
            href="/main"
            className="group w-full min-h-[52px] sm:min-h-[56px] px-6 py-3.5 inline-flex items-center justify-center rounded-2xl bg-gradient-to-r from-sky-400 via-sky-500 to-blue-600 hover:from-sky-300 hover:to-blue-500 text-slate-950 font-black text-sm sm:text-base transition shadow-xl shadow-sky-500/25 tracking-tight active:scale-[0.98]"
          >
            <span>전국 물문화관 둘러보기</span>
            <span className="ml-2 transform group-hover:translate-x-1 transition-transform font-black">→</span>
          </Link>
          <div className="flex items-center justify-center gap-3 text-[11px] text-white/50">
            <span>© K-water 한국수자원공사</span>
            <span>•</span>
            <Link
              href="/privacy"
              className="font-bold text-yellow-400/90 hover:text-yellow-300 underline underline-offset-2"
            >
              개인정보처리방침
            </Link>
          </div>
        </footer>
      </div>

      {/* ══════════════════════════════════════════════════════════════
          2. 데스크톱 전용 UI (hidden md:flex): 웅장한 5열 분할 인터랙티브 레이아웃
         ══════════════════════════════════════════════════════════════ */}
      <div className="hidden md:flex min-h-screen bg-slate-950 text-white flex-row overflow-x-hidden">
        {/* ── 컬럼 1 (맨 좌측): 브랜딩 사이드바 ── */}
        <div className="w-[19%] lg:w-[17%] xl:w-[16%] min-w-[210px] max-w-[270px] shrink-0 bg-slate-950 border-r border-white/10 text-white p-6 sm:p-7 flex flex-col justify-between items-center text-center relative z-20 shadow-2xl">
          
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

          {/* 2. 가운데: K-water 물문화관 컬러풀 브랜드 상징 로고 */}
          <div className="my-6 sm:my-8 flex flex-col items-center w-full px-1">
            <Image
              src="/images/landing_color_symbol.png"
              alt="K-water 물문화관 심볼"
              width={815}
              height={921}
              className="h-20 sm:h-24 lg:h-28 w-auto object-contain drop-shadow-xl hover:scale-105 transition duration-300"
              priority
            />
            <h1 className="mt-3 text-2xl sm:text-3xl font-black text-white tracking-tight whitespace-nowrap drop-shadow-md">
              물문화관
            </h1>
            <p className="mt-2 text-[10px] sm:text-[11px] font-black text-sky-400 tracking-[0.16em] uppercase whitespace-nowrap opacity-90">
              WATER CULTURE PORTAL
            </p>
          </div>

          {/* 3. 하단: 전국 물문화관 둘러보기 버튼 및 개인정보처리방침 */}
          <div className="w-full pt-5 border-t border-white/10 px-1">
            <Link
              href="/main"
              className="w-full min-h-12 px-3 py-3 inline-flex items-center justify-center rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 text-xs sm:text-sm font-black transition duration-200 shadow-lg shadow-sky-500/25 group whitespace-nowrap tracking-tight"
            >
              <span>전국 물문화관 둘러보기</span>
              <span className="ml-1.5 transform group-hover:translate-x-1 transition duration-200">→</span>
            </Link>
            <div className="mt-3 flex items-center justify-center gap-2.5 text-[11px] text-white/50">
              <Link
                href="/privacy"
                className="font-bold text-yellow-400 hover:text-yellow-300 underline underline-offset-2 transition"
              >
                개인정보처리방침
              </Link>
            </div>
          </div>
        </div>

        {/* ── 컬럼 2~5 (우측 4대 핵심 분야: 기술 / 생태 / 역사 / 문화) ── */}
        <div className="flex-1 flex flex-row min-h-screen">
          
          {/* ── 컬럼 2: 기술 (Technology) ── */}
          <Link
            href="/main"
            className="group relative flex-1 min-h-screen border-r border-white/10 overflow-hidden transition-all duration-500 ease-out hover:flex-[1.35] flex flex-col justify-end p-6 sm:p-8"
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
            href="/main"
            className="group relative flex-1 min-h-screen border-r border-white/10 overflow-hidden transition-all duration-500 ease-out hover:flex-[1.35] flex flex-col justify-end p-6 sm:p-8"
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
            href="/main"
            className="group relative flex-1 min-h-screen border-r border-white/10 overflow-hidden transition-all duration-500 ease-out hover:flex-[1.35] flex flex-col justify-end p-6 sm:p-8"
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
            href="/main"
            className="group relative flex-1 min-h-screen overflow-hidden transition-all duration-500 ease-out hover:flex-[1.35] flex flex-col justify-end p-6 sm:p-8"
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
                04 · CULTURE &amp; ARTS
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
    </div>
  );
}
