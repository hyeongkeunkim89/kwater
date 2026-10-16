"use client";

import Link from "next/link";
import { WaterHubHeader } from "@/components/WaterHubHeader";
import { WaterHubFooter } from "@/components/WaterHubFooter";

export default function EmailRejectionPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col selection:bg-sky-500 selection:text-white">
      <WaterHubHeader activeNav="feedback" />

      {/* 상단 배너 헤더 */}
      <section className="relative overflow-hidden bg-gradient-to-r from-[#003876] via-[#004D95] to-[#1E6BBA] text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]" />
        <div className="relative mx-auto max-w-5xl">
          <div className="flex items-center gap-2 text-xs font-semibold text-sky-200 mb-3">
            <Link href="/" className="hover:text-white transition">홈</Link>
            <span>›</span>
            <Link href="/feedback" className="hover:text-white transition">소통창구</Link>
            <span>›</span>
            <span className="text-white">이메일무단수집거부</span>
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-white">
            이메일무단수집거부
          </h1>
          <p className="mt-2.5 text-sm sm:text-base text-sky-100 max-w-none leading-relaxed break-keep">
            K-water 온라인 물문화관은 이용자의 소중한 개인정보와 전자우편주소를 안전하게 보호합니다.
          </p>
        </div>
      </section>

      {/* 본문 콘텐츠 컨테이너 */}
      <main className="flex-1 py-10 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl bg-white rounded-2xl shadow-xs border border-slate-200/80 p-6 sm:p-10 lg:p-12">
          
          {/* 메인 안내 박스 */}
          <div className="rounded-2xl border border-sky-100 bg-gradient-to-br from-sky-50/80 via-white to-slate-50 p-6 sm:p-8 mb-8">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-[#004D95] text-white flex items-center justify-center shrink-0 shadow-sm text-2xl">
                ✉️
              </div>
              <div>
                <h2 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight mb-2">
                  K-water의 전자우편주소 무단수집 대응방침
                </h2>
                <p className="text-sm sm:text-base text-slate-700 leading-relaxed break-keep">
                  본 K-water 온라인 물문화관에 게시된 이메일 주소가 전자우편 수집 프로그램이나 그 밖의 기술적 장치를 이용하여 무단으로 수집되는 것을 거부하며, 이를 위반 시 「정보통신망 이용촉진 및 정보보호 등에 관한 법률」에 의해 형사 처벌됨을 유념하시기 바랍니다.
                </p>
                <div className="mt-4 pt-4 border-t border-slate-200/60 flex items-center gap-2 text-xs text-slate-500 font-medium">
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-sky-500" />
                  <span>게시일: 2011년 10월 20일</span>
                </div>
              </div>
            </div>
          </div>

          {/* 관련 법령 상세 안내 */}
          <div className="mt-8">
            <h3 className="text-base sm:text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
              <span className="w-2 h-4 bg-[#004D95] rounded-full inline-block" />
              관련 법률 조항 안내
            </h3>

            <div className="space-y-4">
              {/* 조항 1: 제50조의2 */}
              <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-5 sm:p-6 transition hover:border-slate-300">
                <h4 className="text-sm sm:text-base font-bold text-[#003876] mb-3">
                  「정보통신망 이용촉진 및 정보보호 등에 관한 법률」 제50조의2 (전자우편주소의 무단 수집행위 등 금지)
                </h4>
                <ul className="space-y-2 text-xs sm:text-sm text-slate-700 leading-relaxed">
                  <li className="flex items-start gap-2">
                    <span className="font-semibold text-slate-900 shrink-0">①</span>
                    <span>누구든지 인터넷 홈페이지 운영자 또는 관리자의 사전 동의 없이 인터넷 홈페이지에서 자동으로 전자우편주소를 수집하는 프로그램이나 그 밖의 기술적 장치를 이용하여 전자우편주소를 수집하여서는 아니 된다.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="font-semibold text-slate-900 shrink-0">②</span>
                    <span>누구든지 제1항의 규정을 위반하여 수집된 전자우편주소를 판매·유통하여서는 아니 된다.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="font-semibold text-slate-900 shrink-0">③</span>
                    <span>누구든지 제1항 및 제2항의 규정에 따라 수집·판매 및 유통이 금지된 전자우편주소임을 알고 이를 정보 전송에 이용하여서는 아니 된다.</span>
                  </li>
                </ul>
              </div>

              {/* 조항 2: 제74조 (벌칙) */}
              <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-5 sm:p-6 transition hover:border-slate-300">
                <h4 className="text-sm sm:text-base font-bold text-[#003876] mb-3">
                  「정보통신망 이용촉진 및 정보보호 등에 관한 법률」 제74조 (벌칙 규정)
                </h4>
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed break-keep">
                  제50조의2의 규정을 위반하여 전자우편주소를 수집·판매·유통 또는 정보 전송에 이용한 자는 <strong>1년 이하의 징역 또는 1천만원 이하의 벌금</strong>에 처해집니다.
                </p>
              </div>
            </div>
          </div>

          {/* 하단 신고 및 상담 안내 */}
          <div className="mt-10 pt-6 border-t border-slate-200">
            <h3 className="text-base font-bold text-slate-900 mb-3">
              불법 스팸 및 이메일 무단수집 침해 신고
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 mb-4 break-keep leading-relaxed">
              전자우편주소 무단수집으로 인한 피해가 발생하거나 불법 스팸 메일을 수신하신 경우, 한국인터넷진흥원 불법스팸대응센터를 통해 상담 및 신고하실 수 있습니다.
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <a
                href="https://spam.kisa.or.kr"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-lg bg-white border border-slate-300 text-slate-700 text-xs sm:text-sm font-semibold hover:bg-slate-50 hover:border-slate-400 transition"
              >
                <span>🌐 KISA 불법스팸대응센터 바로가기</span>
                <span className="text-slate-400 text-xs">↗</span>
              </a>
              <a
                href="tel:118"
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-lg bg-[#004D95] text-white text-xs sm:text-sm font-semibold hover:bg-[#003876] transition shadow-xs"
              >
                <span>📞 전화 상담 (국번없이 118)</span>
              </a>
            </div>
          </div>

        </div>
      </main>

      <WaterHubFooter />
    </div>
  );
}
