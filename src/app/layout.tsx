import type { Metadata } from "next";
import { Noto_Sans_KR } from "next/font/google";
import "./globals.css";

const notoSansKr = Noto_Sans_KR({
  variable: "--font-noto-sans-kr",
  subsets: ["latin"],
  /** 로딩 분량 축소 — 자주 쓰는 굵기만 유지 */
  weight: ["400", "500", "600", "700", "900"],
  display: "swap",
  preload: true,
});

export const metadata: Metadata = {
  title: "K-water 물문화관 | 전국 거점 안내",
  description:
    "한국수자원공사 물문화관·조력문화관의 개요, 위치, 운영 현황을 한눈에 확인할 수 있는 홍보용 안내 페이지입니다.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className={notoSansKr.variable}>
      <body className="min-h-screen font-sans antialiased">{children}</body>
    </html>
  );
}
