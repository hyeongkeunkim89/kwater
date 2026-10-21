"use client";

import Link from "next/link";
import { WaterHubHeader } from "@/components/WaterHubHeader";
import { WaterHubFooter } from "@/components/WaterHubFooter";
import { privacyHtml } from "./privacyHtml";

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col selection:bg-sky-500 selection:text-white">
      <WaterHubHeader activeNav="feedback" />

      {/* 히어로 타이틀 */}
      <div className="relative overflow-hidden bg-gradient-to-r from-sky-50 to-indigo-50 border-b border-slate-200/80 shrink-0">
        <div className="pointer-events-none absolute inset-0" aria-hidden>
          <div className="absolute right-1/4 top-0 h-48 w-48 rounded-full bg-sky-500/5 blur-[80px]" />
        </div>
        <div className="relative mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-10 sm:py-12 text-center sm:text-left">
          <span className="text-xs font-bold uppercase tracking-widest text-sky-600">
            PRIVACY POLICY
          </span>
          <h1 className="mt-2 text-2xl sm:text-3xl font-black tracking-tight text-slate-900">
            개인정보처리방침
          </h1>
          <p className="mt-2 text-xs sm:text-sm text-slate-500 leading-relaxed max-w-xl font-semibold">
            K-water 온라인 물문화관은 이용자의 소중한 개인정보를 안전하게 보호하며 관련 법령을 철저히 준수합니다.
          </p>
        </div>
      </div>

      {/* 본문 콘텐츠 컨테이너 */}
      <main className="flex-1 py-6 sm:py-10 px-3 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl bg-white rounded-2xl shadow-xs border border-slate-200/80 p-4 sm:p-8 lg:p-12">
          
          {/* 간편로그인(소셜 로그인) 연계 개인정보 수집·이용 고지 (카카오·네이버 검수 및 공사 보안지침 준수) */}
          <div className="mb-8 rounded-2xl border border-sky-100 bg-gradient-to-br from-sky-50/70 via-white to-blue-50/50 p-5 sm:p-6 shadow-xs">
            <div className="flex items-center gap-2 mb-3">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#004D95] text-white text-xs font-black shadow-xs">
                K
              </span>
              <h2 className="text-base sm:text-lg font-black text-slate-900">
                간편로그인(소셜 계정) 연계 개인정보 처리 고지
              </h2>
              <span className="ml-auto inline-flex items-center rounded-full bg-sky-100 px-2.5 py-0.5 text-[11px] font-bold text-sky-800">
                카카오 · 네이버 연동
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed break-keep mb-4">
              K-water 온라인 물문화관은 관람객의 편리한 서비스 이용을 위해 <strong>카카오(Kakao)</strong> 및 <strong>네이버(Naver)</strong> 간편인증 로그인을 지원하며, 「개인정보 보호법」 제15조 및 제16조에 따라 최소한의 정보만을 적법하게 처리합니다.
            </p>

            <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-xs">
              <table className="w-full min-w-[560px] text-left text-xs sm:text-sm">
                <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200">
                  <tr>
                    <th className="py-2.5 px-3.5 w-1/4">연계 서비스</th>
                    <th className="py-2.5 px-3.5 w-1/4">처리 목적</th>
                    <th className="py-2.5 px-3.5 w-1/4">수집 항목</th>
                    <th className="py-2.5 px-3.5 w-1/4">보유 및 이용기간</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-600">
                  <tr>
                    <td className="py-3 px-3.5 font-semibold text-slate-800">
                      <div className="flex items-center gap-1.5">
                        <span className="inline-block w-2.5 h-2.5 rounded-full bg-[#FEE500] border border-amber-300" />
                        <span>카카오 로그인</span>
                      </div>
                      <div className="flex items-center gap-1.5 mt-1">
                        <span className="inline-block w-2.5 h-2.5 rounded-full bg-[#03C75A]" />
                        <span>네이버 로그인</span>
                      </div>
                    </td>
                    <td className="py-3 px-3.5 leading-relaxed">
                      • 회원 식별 및 로그인 인증<br />
                      • 물문화관 가이드 투어 예약 확인 및 알림<br />
                      • 소통과 의견 게시글 등록 및 본인 확인
                    </td>
                    <td className="py-3 px-3.5 leading-relaxed">
                      • <strong className="text-slate-800">[필수]</strong> 이름(닉네임), 이메일, 계정 식별자<br />
                      • <strong className="text-slate-500">[선택]</strong> 휴대전화번호
                    </td>
                    <td className="py-3 px-3.5 leading-relaxed font-medium text-slate-700">
                      <strong>회원 탈퇴 시</strong> 또는 <strong>소셜 계정 연동 해제 시</strong>까지<br />
                      <span className="text-[11px] text-slate-400 font-normal">※ 목적 달성 시 복구 불가능한 방법으로 영구 파기</span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="mt-3.5 text-[11px] sm:text-xs text-slate-500 flex items-start gap-1.5 leading-relaxed">
              <span className="text-sky-600 font-bold shrink-0">ℹ️</span>
              <span>
                정보주체는 소셜 연동을 통한 개인정보 제공을 거부할 권리가 있습니다. 동의를 거부하시더라도 전시관 소개, 관람 안내, 비회원 예약 조회 등 물문화관의 기본 서비스는 제한 없이 이용하실 수 있습니다.
              </span>
            </div>
          </div>

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
          overflow-wrap: break-word;
          max-width: 100%;
        }
        .privacy-policy-body a {
          color: #0284c7;
          text-decoration: underline;
          text-underline-offset: 2px;
          transition: color 0.15s;
          word-break: break-all;
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
          grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
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
        .privacy-policy-body [id^="step"] {
          scroll-margin-top: 100px;
        }
        .privacy-policy-body .policy_list > li {
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
          position: relative;
          width: 100%;
          max-width: 100%;
          overflow-x: auto;
          -webkit-overflow-scrolling: touch;
          margin: 1.25rem 0 2rem 0;
          border-radius: 0.75rem;
          border: 1px solid #cbd5e1;
          background-color: #ffffff;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
        }
        @media (max-width: 640px) {
          .privacy-policy-body .scrollTable:before {
            content: "👉 좌우로 밀어서(스크롤) 표 전체 내용을 확인하세요 👈";
            display: block;
            background: #f0f9ff;
            color: #0284c7;
            font-size: 11px;
            font-weight: 700;
            text-align: center;
            padding: 7px 10px;
            border-bottom: 1px dashed #bae6fd;
            letter-spacing: -0.02em;
          }
        }
        .privacy-policy-body table.basic_board_table {
          width: 100%;
          min-width: 680px;
          border-collapse: collapse;
          margin: 0;
          font-size: 13.5px;
          background-color: #ffffff;
        }
        .privacy-policy-body table.basic_board_table caption {
          text-align: left;
          font-size: 12px;
          font-weight: 500;
          color: #475569;
          padding: 0.65rem 1rem;
          background-color: #f8fafc;
          border-bottom: 1px solid #e2e8f0;
        }
        .privacy-policy-body table.basic_board_table th,
        .privacy-policy-body table.basic_board_table td {
          border: 1px solid #e2e8f0;
          padding: 0.75rem 0.8rem;
          line-height: 1.6;
          vertical-align: middle;
          word-break: keep-all;
          overflow-wrap: break-word;
        }
        .privacy-policy-body table.basic_board_table thead th {
          background-color: #f1f5f9;
          color: #0f172a;
          font-weight: 700;
          text-align: center;
          white-space: nowrap;
          padding: 0.75rem 0.5rem;
        }
        .privacy-policy-body table.basic_board_table tbody th {
          background-color: #f8fafc;
          color: #1e293b;
          font-weight: 600;
          text-align: center;
          white-space: normal !important;
          word-break: keep-all !important;
          overflow-wrap: break-word !important;
          line-height: 1.45;
          padding: 0.75rem 0.6rem;
        }
        .privacy-policy-body table.basic_board_table tbody td {
          color: #334155;
        }
        .privacy-policy-body table.basic_board_table tbody tr:hover {
          background-color: #f8fafc;
        }
        /* 표 내부 목록 여백 초기화 */
        .privacy-policy-body table.basic_board_table ul,
        .privacy-policy-body table.basic_board_table ol {
          padding-left: 0 !important;
          margin: 0 !important;
          list-style: none !important;
        }
        .privacy-policy-body table.basic_board_table li {
          margin-bottom: 0.2rem !important;
          font-size: 13px;
        }
        .privacy-policy-body table.basic_board_table li:last-child {
          margin-bottom: 0 !important;
        }

        /* 제3조 추가 설명 박스 */
        .privacy-policy-body .item_desc_box {
          margin: 1.5rem 0 2rem 0;
          padding: 1.25rem 1.5rem;
          background-color: #f8fafc;
          border: 1px solid #e2e8f0;
          border-left: 4px solid #004D95;
          border-radius: 0.75rem;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
        }
        .privacy-policy-body .item_desc_box h2 {
          font-size: 15px;
          font-weight: 700;
          color: #0f172a;
          margin-bottom: 0.75rem;
          padding: 0 !important;
        }

        /* 7. 이미지 반응형 및 중앙 정렬 */
        .privacy-policy-body img {
          max-width: 100% !important;
          height: auto !important;
          margin: 1.5rem auto;
          display: block;
          border-radius: 0.65rem;
          box-shadow: 0 1px 4px rgba(0, 0, 0, 0.08);
        }
        .privacy-policy-body .river_road {
          text-align: center;
          margin: 1.5rem 0;
        }

        /* 8. QR 코드 안내 박스 반응형 (모바일 넘침 완벽 방지) */
        .privacy-policy-body .imgDis2Li02 {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          justify-content: space-between;
          gap: 1.25rem;
          padding: 1.1rem 1.25rem;
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 0.75rem;
          margin: 1rem 0 1.5rem 0 !important;
          max-width: 100% !important;
          box-sizing: border-box;
          list-style: none;
        }
        .privacy-policy-body .imgDis2Li02 li.txt {
          width: auto !important;
          min-width: 0 !important;
          max-width: 100% !important;
          flex: 1 1 240px;
          border-right: none !important;
          padding: 0 !important;
          font-size: 13px;
          color: #475569;
          line-height: 1.65;
          word-break: break-all !important;
          overflow-wrap: anywhere !important;
        }
        .privacy-policy-body .imgDis2Li02 li.photo {
          width: auto !important;
          flex: 0 0 auto;
          padding: 0 !important;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .privacy-policy-body .imgDis2Li02 li.photo img {
          width: 80px !important;
          height: 80px !important;
          margin: 0 auto !important;
          border-radius: 0.5rem;
          border: 1px solid #cbd5e1;
          background: #ffffff;
          padding: 3px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
        }

        /* 9. 모바일(스마트폰) 전용 추가 최적화 미디어 쿼리 */
        @media (max-width: 640px) {
          .privacy-policy-body {
            font-size: 13.5px;
            line-height: 1.75;
          }
          .privacy-policy-body li > strong {
            font-size: 15.5px;
            margin: 2rem 0 0.8rem 0;
          }
          .privacy-policy-body ol {
            padding-left: 1rem;
          }
          .privacy-policy-body ol ol {
            padding-left: 0.85rem;
          }
          .privacy-policy-body ol ol ol {
            padding-left: 0.75rem;
          }
          .privacy-policy-body .messageBox {
            padding: 1rem;
            font-size: 13px;
          }
          .privacy-policy-body .item_desc_box {
            padding: 1rem;
          }
          .privacy-policy-body .guid_infoList ul {
            grid-template-columns: 1fr;
            gap: 0.5rem;
            margin-bottom: 2rem;
          }
          .privacy-policy-body .down_01 {
            justify-content: stretch;
            gap: 0.5rem;
          }
          .privacy-policy-body .down_01 a {
            width: 100%;
            justify-content: center;
            text-align: center;
            padding: 0.75rem 1rem;
          }
          .privacy-policy-body .imgDis2Li02 {
            flex-direction: column !important;
            align-items: stretch !important;
            padding: 1rem 0.9rem !important;
            gap: 0.85rem !important;
            margin-left: 0 !important;
            margin-right: 0 !important;
          }
          .privacy-policy-body .imgDis2Li02 li.txt {
            flex: 1 1 100% !important;
            width: 100% !important;
            font-size: 12.5px !important;
            line-height: 1.6;
            text-align: left;
          }
          .privacy-policy-body .imgDis2Li02 li.photo {
            width: 100% !important;
            padding-top: 0.6rem !important;
            border-top: 1px dashed #e2e8f0;
          }
          .privacy-policy-body .imgDis2Li02 li.photo img {
            width: 88px !important;
            height: 88px !important;
          }
        }
      `}</style>
    </div>
  );
}
