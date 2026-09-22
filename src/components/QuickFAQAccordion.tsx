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
      "아닙니다! 전국 15대 물문화관은 전 관람객 대상 전액 **무료**로 입장 및 주차가 제공됩니다. 대형 버스 주차공간과 무장애 주차구역도 완비되어 있습니다.",
  },
  {
    id: "faq-2",
    tag: "관람/휴관",
    question: "일반 관람 시간과 정기 휴관일은 언제인가요?",
    answer:
      "기본 관람 시간은 **09:00 ~ 18:00** (입장 마감 17:00)입니다. 매주 월요일(일부 센터 월·화) 및 명절 당일은 정기 휴관일입니다.",
  },
  {
    id: "faq-3",
    tag: "해설/예약",
    question: "해설사와 함께하는 가이드 투어는 어떻게 신청하나요?",
    answer:
      "상단 퀵 메뉴의 [가이드 투어 예약] 버튼 또는 메뉴를 통해 원하시는 물문화관과 일시, 인원을 지정하여 사전 신청하실 수 있습니다. 개인 및 단체 해설이 모두 지원됩니다.",
  },
];

export function QuickFAQAccordion() {
  const [openId, setOpenId] = useState<string | null>("faq-1");

  const toggleAccordion = (id: string) => {
    setOpenId((prev) => (prev === id ? null : id));
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-7 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="shrink-0 rounded-md bg-sky-600 px-2.5 py-0.5 text-[11px] font-black uppercase tracking-wider text-white">
              FAQ
            </span>
            <h3 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
              자주 묻는 질문
            </h3>
          </div>
          <p className="text-xs text-slate-500 font-semibold mt-1">
            전국 물문화관 관람 및 해설 가이드 투어 사전 예약 관련 필수 체크사항입니다.
          </p>
        </div>
        <Link
          href="/feedback"
          className="self-start sm:self-auto inline-flex items-center gap-1.5 rounded-full bg-slate-900 hover:bg-sky-600 text-xs font-black text-white px-5 py-2 transition-all duration-200 shadow-sm hover:shadow-md group whitespace-nowrap"
        >
          <span>해설 투어 예약 문의</span>
          <span className="transform group-hover:translate-x-0.5 transition-transform duration-200">→</span>
        </Link>
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
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-sky-100 text-[11px] font-black text-sky-800">
                    Q
                  </span>
                  <span className="shrink-0 text-[11px] font-black text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md">
                    {faq.tag}
                  </span>
                  <span className="text-xs sm:text-sm font-extrabold text-slate-900 leading-snug">
                    {faq.question}
                  </span>
                </div>
                <div className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full transition-all duration-200 ${isOpen ? "bg-sky-100 text-sky-600 rotate-180" : "bg-slate-100 text-slate-400"}`}>
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
                    dangerouslySetInnerHTML={{ __html: faq.answer.replace(/\*\*(.*?)\*\*/g, '<strong class="font-extrabold text-sky-700">$1</strong>') }}
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
