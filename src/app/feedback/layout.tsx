import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "소통창구 (문의 & FAQ)",
  description: "전국 K-water 물문화관 이용에 관한 질문과 건의사항을 남기고 자주 묻는 질문(FAQ)을 확인하세요.",
};

export default function FeedbackLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
