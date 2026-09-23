"use client";

import { useState } from "react";
import Link from "next/link";

type FAQItem = {
  id: string;
  question: string;
  answer: string;
  tag: string;
};

const FAQ_DATA: FAQItem[] = [
  {
    id: "faq-1",
    tag: "입장/주차",
    question: "입장료 및 주차장 이용 요금이 있나요?",
    answer:
      "아닙니다! 전국 15개 K-water 물문화관은 전 관람객 대상 전액 **무료**로 입장 및 대형 주차장이 제공됩니다. 무장애 전용 주차구역과 대형 버스 주차장도 완비되어 있습니다.",
  },
  {
    id: "faq-2",
    tag: "관람/휴관",
    question: "일반 관람 시간과 정기 휴관일은 언제인가요?",
    answer:
      "기본 관람 시간은 **09:00 ~ 18:00** (입장 마감 17:30)입니다. 매주 월요일과 설·추석 명절 당일은 정기 휴관일입니다.",
  },
  {
    id: "faq-3",
    tag: "해설/예약",
    question: "해설사와 함께하는 가이드 투어는 어떻게 신청하나요?",
    answer:
      "상단 내비게이션의 [예약] 메뉴 또는 안내 버튼을 통해 원하시는 물문화관과 일시, 인원을 지정하여 사전 신청하실 수 있습니다. 전문 도슨트 해설이 **무료**로 제공됩니다.",
  },
  {
    id: "faq-4",
    tag: "단체/편의",
    question: "단체 관람(10인 이상) 및 교육 견학도 가능한가요?",
    answer:
      "네, 10인 이상 단체 관람 시 사전 예약을 주시면 전담 해설사 배정 및 이동 동선 안내를 지원해 드리며, 맞춤형 체험 공간 이용이 가능합니다.",
  },
  {
    id: "faq-5",
    tag: "무장애/대여",
    question: "휠체어, 유모차 대여 및 무장애 편의시설이 마련되어 있나요?",
    answer:
      "모든 물문화관 데스크에서 휠체어와 유모차를 **무료**로 대여해 드립니다. 또한 진입로 경사로, 무장애 엘리베이터, 장애인 화장실이 고르게 설치되어 있습니다.",
  },
];

export function QuickFAQAccordion() {
  const [openId, setOpenId] = useState<string | null>("faq-1");

  const toggleAccordion = (id: string) => {
    setOpenId((prev) => (prev === id ? null : id));
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 shadow-sm transition-all duration-300">
      <div className="flex flex-col gap-3 border-b border-slate-100 pb-5">
        <div className="flex items-center justify-between gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-sky-100 px-3 py-1 text-xs font-black tracking-wider uppercase text-[#004D95]">
            K-WATER FAQ
          </span>
          <Link
            href="/reserve"
            className="inline-flex items-center gap-1 text-xs font-bold text-[#004D95] hover:text-[#003870] transition"
          >
            <span>투어 예약</span>
            <span>→</span>
          </Link>
        </div>
        <div>
          <h3 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight">
            자주 묻는 질문 (FAQ)
          </h3>
          <p className="mt-1 text-xs text-slate-500 font-medium">
            물문화관 관람, 주차, 휴관일 및 가이드 투어 필수 확인사항입니다.
          </p>
        </div>
      </div>

      <div className="mt-4 space-y-3">
        {FAQ_DATA.map((faq) => {
          const isOpen = openId === faq.id;
          return (
            <div
              key={faq.id}
              className={`rounded-xl border transition-all duration-200 ${
                isOpen
                  ? "border-sky-200 bg-sky-50/30 shadow-xs"
                  : "border-slate-200/80 bg-white hover:border-slate-300"
              }`}
            >
              <button
                onClick={() => toggleAccordion(faq.id)}
                className="w-full min-h-13 p-4 text-left flex items-center justify-between gap-3 transition"
              >
                <div className="flex items-center gap-3 min-w-0 pr-2">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-sky-100 text-[11px] font-black text-[#004D95]">
                    Q
                  </span>
                  <span className="shrink-0 text-[11px] font-black text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md">
                    {faq.tag}
                  </span>
                  <span className="text-xs sm:text-sm font-extrabold text-slate-900 leading-snug">
                    {faq.question}
                  </span>
                </div>
                <div className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full transition-all duration-200 ${isOpen ? "bg-sky-100 text-[#004D95] rotate-180" : "bg-slate-100 text-slate-400"}`}>
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </button>

              {isOpen && (
                <div className="px-4 pb-4 pt-2 text-xs sm:text-sm text-slate-600 font-medium leading-relaxed border-t border-slate-100 bg-white/80 rounded-b-xl flex gap-3">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-slate-200 text-[11px] font-black text-slate-700 mt-0.5">
                    A
                  </span>
                  <div
                    className="flex-1 text-slate-700 font-semibold leading-relaxed pt-0.5"
                    dangerouslySetInnerHTML={{ __html: faq.answer.replace(/\*\*(.*?)\*\*/g, '<strong class="font-extrabold text-[#004D95]">$1</strong>') }}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
