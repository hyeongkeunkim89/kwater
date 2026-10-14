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
          <p className="mt-2.5 text-sm sm:text-base text-sky-100 max-w-2xl leading-relaxed">
            K-water 물문화관 및 우리강이용도우미는 이용자의 소중한 개인정보를 안전하게 보호하며 관련 법령을 철저히 준수합니다.
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
          font-size: 14px;
          line-height: 1.75;
          color: #334155;
        }
        .privacy-policy-body a {
          color: #0284c7;
          text-decoration: underline;
          text-underline-offset: 2px;
        }
        .privacy-policy-body a:hover {
          color: #0369a1;
        }
        .privacy-policy-body strong {
          color: #0f172a;
          font-weight: 700;
        }
        .privacy-policy-body .messageBox {
          background-color: #f1f5f9;
          border-left: 4px solid #0284c7;
          border-radius: 0.75rem;
          padding: 1.25rem 1.5rem;
          margin-bottom: 1.5rem;
          font-weight: 500;
          color: #1e293b;
        }
        .privacy-policy-body .down_01 {
          display: flex;
          justify-content: flex-end;
          gap: 0.75rem;
          margin: 1rem 0 2rem 0;
          font-size: 13px;
        }
        .privacy-policy-body .down_01 a {
          display: inline-flex;
          align-items: center;
          gap: 0.25rem;
          padding: 0.45rem 0.9rem;
          background-color: #f8fafc;
          border: 1px solid #cbd5e1;
          border-radius: 0.5rem;
          color: #0f172a;
          text-decoration: none;
          font-weight: 600;
          transition: all 0.2s;
        }
        .privacy-policy-body .down_01 a:hover {
          background-color: #e0f2fe;
          border-color: #38bdf8;
          color: #0369a1;
        }
        .privacy-policy-body .hidden {
          display: none;
        }

        /* 라벨링 카드 영역 */
        .privacy-policy-body .guid_infoLabel {
          margin: 2rem 0 2.5rem 0;
          border: 1px solid #e2e8f0;
          border-radius: 1rem;
          overflow: hidden;
          background-color: #e2e8f0;
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
          gap: 1px;
        }
        .privacy-policy-body .guid_infoLabel .lb_title {
          grid-column: 1 / -1;
          display: block;
          text-align: center;
          padding: 0.85rem;
          background-color: #004D95;
          color: #ffffff;
          font-size: 15px;
          font-weight: 800;
          letter-spacing: -0.01em;
        }
        .privacy-policy-body .guid_infoLabel .label_info {
          background: #ffffff;
          padding: 1.25rem 1rem;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
        }
        .privacy-policy-body .guid_infoLabel .label_info dt {
          font-weight: 700;
          color: #0f172a;
          margin-bottom: 0.5rem;
          font-size: 14px;
        }
        .privacy-policy-body .guid_infoLabel .label_info dd {
          font-size: 12px;
          color: #64748b;
          margin: 0.15rem 0;
          line-height: 1.4;
        }

        /* 목차 영역 */
        .privacy-policy-body #textCenter {
          margin: 1.5rem 0 1rem 0;
          padding: 0.75rem 1rem;
          background-color: #f8fafc;
          border-radius: 0.5rem;
          font-size: 13px;
          color: #475569;
        }
        .privacy-policy-body #textCenter ol {
          list-style: none;
          padding: 0;
          margin: 0;
        }
        .privacy-policy-body .guid_infoList ul {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 0.5rem;
          padding: 0;
          margin: 1rem 0 2.5rem 0;
          list-style: none;
        }
        .privacy-policy-body .guid_infoList li a {
          display: block;
          padding: 0.65rem 0.85rem;
          background-color: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 0.5rem;
          font-size: 12.5px;
          font-weight: 600;
          color: #1e293b;
          text-decoration: none;
          transition: all 0.15s ease-in-out;
        }
        .privacy-policy-body .guid_infoList li a:hover {
          background-color: #004D95;
          border-color: #004D95;
          color: #ffffff;
          transform: translateY(-1px);
        }

        /* 각 조항 헤더 및 본문 */
        .privacy-policy-body > div[id^="step"] {
          scroll-margin-top: 100px;
        }
        .privacy-policy-body li > strong {
          display: block;
          font-size: 16px;
          font-weight: 800;
          color: #0f172a;
          margin: 2.5rem 0 0.85rem 0;
          padding-bottom: 0.5rem;
          border-bottom: 2px solid #e2e8f0;
        }
        .privacy-policy-body ol {
          padding-left: 1.25rem;
          margin: 0.5rem 0;
        }
        .privacy-policy-body ol li {
          margin-bottom: 0.5rem;
        }
        .privacy-policy-body ul {
          padding-left: 1rem;
          margin: 0.25rem 0;
        }

        /* 표 (Table) 반응형 및 보더 */
        .privacy-policy-body .scrollTable {
          overflow-x: auto;
          margin: 1rem 0 1.5rem 0;
        }
        .privacy-policy-body table.basic_board_table {
          width: 100%;
          border-collapse: collapse;
          margin: 1rem 0;
          font-size: 13px;
          border: 1px solid #cbd5e1;
          border-radius: 0.5rem;
          overflow: hidden;
        }
        .privacy-policy-body table.basic_board_table caption {
          text-align: left;
          font-size: 11px;
          color: #94a3b8;
          padding-bottom: 0.25rem;
        }
        .privacy-policy-body table.basic_board_table th,
        .privacy-policy-body table.basic_board_table td {
          border: 1px solid #e2e8f0;
          padding: 0.65rem 0.85rem;
          line-height: 1.5;
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

        /* 이미지 반응형 및 중앙 정렬 */
        .privacy-policy-body img {
          max-width: 100%;
          height: auto;
          margin: 1.25rem auto;
          display: block;
          border-radius: 0.5rem;
          box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.05);
        }
      `}</style>
    </div>
  );
}
