import Link from "next/link";

export function WaterHubFooter({ compact = false }: { compact?: boolean }) {
  const familySites = [
    { name: "K-water 공식 홈페이지", url: "https://www.kwater.or.kr" },
    { name: "MyWater 물정보포털", url: "https://www.water.or.kr" },
    { name: "우리강이용도우미(4대강문화관)", url: "https://www.riverguide.go.kr/kor/index.do" },
    { name: "시화조력발전소(문화관)", url: "https://www.kwater.or.kr/website/tlight.do" },
  ];

  if (compact) {
    return (
      <footer className="shrink-0 border-t border-white/10 bg-[#152035] py-6">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-6 text-center sm:flex-row sm:text-left">
          <div className="flex items-center gap-3">
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-sky-500 text-xs font-black text-white">
              K
            </span>
            <p className="text-xs text-white/55">
              © {new Date().getFullYear()} K-water 물문화관 · 내부 활용 자료
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 text-xs text-white/50">
            <a
              href="https://www.kwater.or.kr"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition"
            >
              kwater.or.kr
            </a>
            <span className="text-white/10">|</span>
            <a
              href="https://www.water.or.kr"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition"
            >
              MyWater
            </a>
          </div>
        </div>
      </footer>
    );
  }

  return (
    <footer className="shrink-0 border-t border-white/10 bg-[#0e1726] text-white/70 py-12 sm:py-16">
      <div className="mx-auto max-w-7xl px-6 sm:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-5">
          {/* 회사 소개 */}
          <div className="md:col-span-3">
            <div className="flex items-center gap-3">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-sky-500 text-sm font-black text-white">
                K
              </span>
              <span className="text-base font-black text-white tracking-wide">
                K-water 한국수자원공사
              </span>
            </div>
            <p className="mt-4 text-sm text-white/50 leading-relaxed max-w-md">
              물, 자연, 그리고 사람이 하나되는 행복을 만듭니다. 전국 물문화관에서 깨끗한 환경과 미래의 물 문화를 체험해 보세요.
            </p>
            <p className="mt-6 text-xs text-white/35">
              본 홈페이지는 전국 K-water 물문화관의 홍보 및 가이드 투어 예약 관리를 위한 통합 플랫폼입니다.
            </p>
          </div>

          {/* 패밀리 사이트 */}
          <div className="md:col-span-2">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4">
              패밀리사이트
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2.5">
              {familySites.map((site) => (
                <a
                  key={site.name}
                  href={site.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-sm hover:text-sky-400 transition py-1"
                >
                  <svg
                    className="mr-1.5 h-3.5 w-3.5 text-white/30 shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                    />
                  </svg>
                  <span className="break-keep">{site.name}</span>
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* 저작권 표시 */}
        <div className="mt-12 pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-white/40">
          <p>© {new Date().getFullYear()} K-water 한국수자원공사. All rights reserved.</p>
          <div className="flex gap-x-4">
            <Link href="/yunyeong" className="hover:text-white transition">
              관리자 모드 로그인
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
