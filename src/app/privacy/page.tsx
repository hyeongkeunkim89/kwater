"use client";

import Link from "next/link";
import { WaterHubHeader } from "@/components/WaterHubHeader";
import { WaterHubFooter } from "@/components/WaterHubFooter";
import { privacyHtml } from "./privacyHtml";

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col selection:bg-sky-500 selection:text-white">
      <WaterHubHeader activeNav="intro" />

      {/* 상단 배너 헤더 */}
      <section className="relative overflow-hidden bg-gradient-to-r from-[#003876] via-[#004D95] to-[#1E6BBA] text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]" />
        <div className="relative mx-auto max-w-5xl">
          <div className="flex items-center gap-2 text-xs font-semibold text-sky-200 mb-3">
            <Link href="/" className="hover:text-white transition">홈</Link>
            <span>›</span>
            <span className="text-white">개인정보처리방침</span>
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-white">
            개인정보처리방침
          </h1>
          <p className="mt-2.5 text-sm sm:text-base text-sky-100 max-w-none leading-relaxed break-keep">
            K-water 물문화관 통합 포털은 이용자의 소중한 개인정보를 안전하게 보호하며 관련 법령을 철저히 준수합니다.
          </p>
        </div>
      </section>

      {/* 본문 콘텐츠 컨테이너 */}
      <main className="flex-1 py-10 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl bg-white rounded-2xl shadow-xs border border-slate-200/80 p-6 sm:p-10 lg:p-12">
          
          {/* 개인정보처리방침 상세 렌더링 영역 */}
          <div
            className="privacy-policy-body text-slate-800 leading-relaxed"
            dangerouslySetInnerHTML={{ __html: privacyHtml }}
          />

        </div>
      </main>

      <WaterHubFooter />

      {/* 개인정보처리방침 전용 커스텀 스타일 */}
      <style jsx global>{`
        .privacy-policy-body {
          font-size: 14.5px;
          line-height: 1.8;
          color: #334155;
          word-break: keep-all;
        }
        .privacy-policy-body a {
          color: #0284c7;
          text-decoration: underline;
          text-underline-offset: 2px;
          transition: color 0.15s;
        }
        .privacy-policy-body a:hover {
          color: #0369a1;
        }
        .privacy-policy-body strong {
          color: #0f172a;
          font-weight: 700;
        }

        /* 1. 상단 안내 박스 (messageBox) */
        .privacy-policy-body .messageBox {
          background-color: #f8fafc;
          border-left: 4px solid #004D95;
          border-radius: 0.75rem;
          padding: 1.25rem 1.5rem;
          margin-bottom: 1.25rem;
          font-weight: 500;
          color: #1e293b;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
        }

        /* 2. 다운로드 및 바로가기 버튼 (상단 및 본문) */
        .privacy-policy-body .down_01 {
          clear: both;
          float: none !important;
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          gap: 0.75rem;
          margin: 1rem 0 1.5rem 0;
          font-size: 13px;
        }
        .privacy-policy-body .down_01.top-action-buttons {
          justify-content: flex-end;
          margin-top: 0.5rem;
          margin-bottom: 2rem;
        }
        .privacy-policy-body .down_01 a {
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          padding: 0.6rem 1.1rem;
          background-color: #ffffff;
          border: 1px solid #cbd5e1;
          border-radius: 0.65rem;
          color: #1e293b;
          text-decoration: none;
          font-weight: 600;
          font-size: 13px;
          box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
          transition: all 0.2s ease-in-out;
        }
        .privacy-policy-body .down_01 a:hover {
          background-color: #f0f9ff;
          border-color: #0284c7;
          color: #004D95;
          transform: translateY(-1px);
          box-shadow: 0 4px 6px -1px rgba(2, 132, 199, 0.15);
        }
        .privacy-policy-body .hidden {
          display: none !important;
        }

        /* 3. 주요 개인정보 처리 표시 (라벨링 카드) */
        .privacy-policy-body .guid_infoLabel {
          clear: both;
          margin: 1.5rem 0 2.5rem 0;
          border: 1px solid #e2e8f0;
          border-radius: 1rem;
          overflow: hidden;
          background-color: #f1f5f9;
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
          gap: 1px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
        }
        .privacy-policy-body .guid_infoLabel .lb_title {
          grid-column: 1 / -1;
          display: block;
          text-align: center;
          padding: 1rem;
          background-color: #004D95;
          color: #ffffff;
          font-size: 16px;
          font-weight: 800;
          letter-spacing: -0.01em;
        }
        .privacy-policy-body .guid_infoLabel .label_info {
          background: #ffffff;
          padding: 1.5rem 1.25rem;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          transition: background-color 0.2s;
        }
        .privacy-policy-body .guid_infoLabel .label_info:hover {
          background-color: #fafbfc;
        }
        .privacy-policy-body .guid_infoLabel .label_info dt {
          font-weight: 800;
          color: #0f172a;
          margin-bottom: 0.6rem;
          font-size: 14.5px;
        }
        .privacy-policy-body .guid_infoLabel .label_info dd {
          font-size: 12.5px;
          color: #64748b;
          margin: 0.2rem 0;
          line-height: 1.5;
        }
        /* 라벨링 카드 시각적 아이콘 배지 */
        .privacy-policy-body .label_info .label01:before { content: "📋"; font-size: 28px; display: block; margin-bottom: 8px; }
        .privacy-policy-body .label_info .label02:before { content: "🎯"; font-size: 28px; display: block; margin-bottom: 8px; }
        .privacy-policy-body .label_info .label03:before { content: "⏱️"; font-size: 28px; display: block; margin-bottom: 8px; }
        .privacy-policy-body .label_info .label04:before { content: "🤝"; font-size: 28px; display: block; margin-bottom: 8px; }
        .privacy-policy-body .label_info .label06:before { content: "📞"; font-size: 28px; display: block; margin-bottom: 8px; }
        .privacy-policy-body .label_info .label07:before { content: "🏅"; font-size: 28px; display: block; margin-bottom: 8px; }

        /* 4. 목차 영역 */
        .privacy-policy-body #textCenter {
          margin: 2rem 0 1rem 0;
          padding: 0.85rem 1.25rem;
          background-color: #f8fafc;
          border-left: 3px solid #0284c7;
          border-radius: 0.5rem;
          font-size: 13.5px;
          color: #475569;
          font-weight: 500;
        }
        .privacy-policy-body #textCenter ol {
          list-style: none;
          padding: 0;
          margin: 0;
        }
        .privacy-policy-body .guid_infoList ul {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 0.6rem;
          padding: 0;
          margin: 1.25rem 0 3rem 0;
          list-style: none;
        }
        .privacy-policy-body .guid_infoList li a {
          display: block;
          padding: 0.75rem 1rem;
          background-color: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 0.65rem;
          font-size: 13px;
          font-weight: 600;
          color: #1e293b;
          text-decoration: none;
          transition: all 0.15s ease-in-out;
        }
        .privacy-policy-body .guid_infoList li a:hover {
          background-color: #004D95;
          border-color: #004D95;
          color: #ffffff;
          transform: translateY(-2px);
          box-shadow: 0 4px 6px -1px rgba(0, 77, 149, 0.2);
        }

        /* 5. 각 조항 헤더 및 본문 */
        .privacy-policy-body > div[id^="step"] {
          scroll-margin-top: 100px;
        }
        .privacy-policy-body li > strong {
          display: block;
          font-size: 17px;
          font-weight: 800;
          color: #003876;
          margin: 3rem 0 1rem 0;
          padding-bottom: 0.6rem;
          border-bottom: 2px solid #004D95;
        }
        .privacy-policy-body ol {
          padding-left: 1.25rem;
          margin: 0.6rem 0;
        }
        .privacy-policy-body ol li {
          margin-bottom: 0.6rem;
        }
        .privacy-policy-body ul {
          padding-left: 1rem;
          margin: 0.4rem 0;
        }

        /* 6. 표 (Table) 반응형 및 디자인 */
        .privacy-policy-body .scrollTable {
          overflow-x: auto;
          margin: 1.25rem 0 2rem 0;
          border-radius: 0.75rem;
          border: 1px solid #cbd5e1;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
        }
        .privacy-policy-body table.basic_board_table {
          width: 100%;
          border-collapse: collapse;
          margin: 0;
          font-size: 13px;
        }
        .privacy-policy-body table.basic_board_table caption {
          text-align: left;
          font-size: 11.5px;
          color: #64748b;
          padding: 0.5rem 0.75rem;
          background-color: #f8fafc;
          border-bottom: 1px solid #e2e8f0;
        }
        .privacy-policy-body table.basic_board_table th,
        .privacy-policy-body table.basic_board_table td {
          border: 1px solid #e2e8f0;
          padding: 0.75rem 0.9rem;
          line-height: 1.6;
        }
        .privacy-policy-body table.basic_board_table thead th {
          background-color: #f1f5f9;
          color: #0f172a;
          font-weight: 700;
          text-align: center;
        }
        .privacy-policy-body table.basic_board_table tbody th {
          background-color: #f8fafc;
          color: #334155;
          text-align: center;
        }
        .privacy-policy-body table.basic_board_table tbody tr:hover {
          background-color: #f8fafc;
        }

        /* 7. 이미지 반응형 및 중앙 정렬 */
        .privacy-policy-body img {
          max-width: 100%;
          height: auto;
          margin: 1.5rem auto;
          display: block;
          border-radius: 0.65rem;
          box-shadow: 0 1px 4px rgba(0, 0, 0, 0.08);
        }
        .privacy-policy-body .river_road {
          text-align: center;
          margin: 1.5rem 0;
        }
      `}</style>
    </div>
  );
}
