import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "마이페이지",
  description: "내 예약 내역 및 활동 관리",
};

export default function MyPageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
