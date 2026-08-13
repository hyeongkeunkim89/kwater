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
          <div className="flex items-center gap-2">
            <span className="text-xl" role="img" aria-label="질문">❓</span>
            <h3 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
              방문 전 필수 체크! 자주 묻는 질문 (FAQ)
            </h3>
          </div>
          <p className="text-xs text-slate-500 font-semibold mt-1">
            물문화관 방문에 관한 핵심 궁금증을 빠르게 확인해 보세요.
          </p>
        </div>
        <Link
          href="/reserve"
          className="self-start sm:self-auto text-xs font-extrabold text-sky-600 hover:text-sky-700 hover:underline"
        >
          해설 투어 예약 문의 →
        </Link>
      </div>

      <div className="mt-4 space-y-3">
        {FAQ_DATA.map((faq) => {
          const isOpen = openId === faq.id;
          return (
            <div
              key={faq.id}
              className="rounded-xl border border-slate-200/80 bg-slate-50/40 overflow-hidden transition"
            >
              <button
                onClick={() => toggleAccordion(faq.id)}
                className="w-full min-h-12 p-4 text-left flex items-center justify-between gap-3 hover:bg-slate-100/60 transition"
              >
                <div className="flex items-center gap-3 min-w-0 pr-2">
                  <span className="shrink-0 text-[10px] font-extrabold text-sky-700 bg-sky-100/70 px-2 py-0.5 rounded">
                    {faq.tag}
                  </span>
                  <span className="text-xs sm:text-sm font-extrabold text-slate-800 leading-snug">
                    {faq.question}
                  </span>
                </div>
                <span className="shrink-0 text-slate-400 font-black text-sm">
                  {isOpen ? "▲" : "▼"}
                </span>
              </button>

              {isOpen && (
                <div className="px-4 pb-4 pt-1 text-xs sm:text-sm text-slate-600 font-medium leading-relaxed border-t border-slate-200/50 bg-white">
                  <p dangerouslySetInnerHTML={{ __html: faq.answer.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
