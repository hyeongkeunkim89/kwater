import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "K-water 물문화관 | 전국 거점 안내",
  description:
    "한국수자원공사 물문화관·조력문화관의 개요, 위치, 운영 현황을 한눈에 확인할 수 있는 홍보용 안내 페이지입니다.",
  icons: {
    icon: "/icon.png?v=4",
    shortcut: "/icon.png?v=4",
    apple: "/icon.png?v=4",
  },
};

/** 모바일 브라우저에서 레이아웃·핀치 줌 기본 동작을 명시 */
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

import { Providers } from "@/components/Providers";
import { KakaoScriptLoader } from "@/components/KakaoScriptLoader";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <head>
        <link rel="icon" href="/icon.png?v=4" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        {/* 국립중앙박물관 웹사이트 공식 서체 패밀리 (Noto Sans KR + NanumSquare 웹폰트) */}
        <link
          href="https://fonts.googleapis.com/css2?family=Nanum+Square:wght@300;400;700;800&family=Noto+Sans+KR:wght@300;400;500;600;700;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen min-w-0 overflow-x-hidden font-sans antialiased">
        <KakaoScriptLoader />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
