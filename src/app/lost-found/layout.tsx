import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "분실·습득물 센터",
  description: "전국 K-water 물문화관 및 강문화관 분실물·습득물 조회 및 등록 서비스",
};

export default function LostFoundLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
