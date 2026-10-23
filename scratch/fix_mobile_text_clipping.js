const fs = require('fs');

// 1. src/components/FloorGuideAccordion.tsx
let fga = fs.readFileSync('src/components/FloorGuideAccordion.tsx', 'utf8').replace(/\r\n/g, '\n');

// 1-A: Header button padding & gap
const oldHeaderBtn = `<button
              type="button"
              onClick={() => toggleFloor(f.id)}
              className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left outline-none hover:bg-slate-50 focus-visible:bg-slate-50 focus-visible:ring-2 focus-visible:ring-sky-500"
            >
              <div className="flex min-w-0 flex-1 items-center gap-4">
                <span className="flex h-11 min-w-[4.2rem] px-4 shrink-0 items-center justify-center rounded-xl bg-slate-900 text-sm font-black text-white sm:text-base">
                  {f.floor_key.toLowerCase().startsWith("floor-") 
                    ? \`\${f.sort_order + 1}F\` 
                    : f.floor_key}
                </span>
                <div className="min-w-0 flex-1">
                  {/* 주요 전시실/시설 목록 요약 */}
                  <p className="truncate text-base font-bold text-slate-900 sm:text-[17px]">`;

const newHeaderBtn = `<button
              type="button"
              onClick={() => toggleFloor(f.id)}
              className="flex w-full items-center justify-between gap-2.5 sm:gap-4 px-3.5 py-3 sm:px-5 sm:py-4 text-left outline-none hover:bg-slate-50 focus-visible:bg-slate-50 focus-visible:ring-2 focus-visible:ring-sky-500"
            >
              <div className="flex min-w-0 flex-1 items-center gap-2.5 sm:gap-4">
                <span className="flex h-9 sm:h-11 min-w-[3.2rem] sm:min-w-[4.2rem] px-2.5 sm:px-4 shrink-0 items-center justify-center rounded-xl bg-slate-900 text-xs sm:text-base font-black text-white">
                  {f.floor_key.toLowerCase().startsWith("floor-") 
                    ? \`\${f.sort_order + 1}F\` 
                    : f.floor_key}
                </span>
                <div className="min-w-0 flex-1">
                  {/* 주요 전시실/시설 목록 요약 (모바일 텍스트 잘림 방지: break-keep 적용) */}
                  <p className="text-sm sm:text-[17px] font-bold text-slate-900 leading-snug break-keep">`;

if (fga.includes(oldHeaderBtn)) {
  fga = fga.replace(oldHeaderBtn, newHeaderBtn);
  console.log('Fixed FloorGuideAccordion header button');
} else {
  console.warn('Could not find oldHeaderBtn in FloorGuideAccordion');
}

// 1-B: Accordion body padding
fga = fga.replace(
  '<div className="grid gap-6 p-6 md:grid-cols-[1.2fr_1fr]">',
  '<div className="grid gap-5 sm:gap-6 p-4 sm:p-6 md:grid-cols-[1.2fr_1fr]">'
);

// 1-C: Photo title truncate fix
const oldPhotoTitle = `{title && (
                                         <span className="text-sm sm:text-base font-extrabold text-slate-700 truncate max-w-full text-center mt-1">
                                           <{title}>
                                         </span>
                                       )}`;

const newPhotoTitle = `{title && (
                                         <span className="text-[11px] sm:text-sm font-extrabold text-slate-700 break-keep line-clamp-2 max-w-full text-center mt-1 leading-tight">
                                           <{title}>
                                         </span>
                                       )}`;

if (fga.includes(oldPhotoTitle)) {
  fga = fga.replace(oldPhotoTitle, newPhotoTitle);
  console.log('Fixed FloorGuideAccordion photo titles');
} else {
  console.warn('Could not find oldPhotoTitle in FloorGuideAccordion');
}

// 1-D: Badges responsive sizing
fga = fga.replace(
  'className="inline-block rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-base font-extrabold text-slate-800 shadow-sm"',
  'className="inline-block rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 sm:px-4 sm:py-2.5 text-xs sm:text-base font-extrabold text-slate-800 shadow-sm break-keep"'
);
fga = fga.replace(
  'className="inline-flex items-center gap-2 rounded-xl border border-sky-200 bg-sky-50 px-4 py-2.5 text-base font-extrabold text-sky-900 hover:bg-sky-100/70 transition shadow-sm"',
  'className="inline-flex items-center gap-1.5 sm:gap-2 rounded-xl border border-sky-200 bg-sky-50 px-3 py-1.5 sm:px-4 sm:py-2.5 text-xs sm:text-base font-extrabold text-sky-900 hover:bg-sky-100/70 transition shadow-sm break-keep"'
);
fga = fga.replace(
  'className="inline-flex items-center gap-2 rounded-xl bg-slate-100 px-4 py-2 text-base font-extrabold text-slate-800 shadow-sm"',
  'className="inline-flex items-center gap-1.5 sm:gap-2 rounded-xl bg-slate-100 px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-base font-extrabold text-slate-800 shadow-sm break-keep"'
);

fs.writeFileSync('src/components/FloorGuideAccordion.tsx', fga, 'utf8');

// 2. src/app/centers/[id]/page.tsx
let cdp = fs.readFileSync('src/app/centers/[id]/page.tsx', 'utf8').replace(/\r\n/g, '\n');

// 2-A: Hero padding
cdp = cdp.replace(
  '<div className="relative mx-auto max-w-5xl px-6 py-10 sm:px-10 sm:py-14">',
  '<div className="relative mx-auto max-w-5xl px-4 py-8 sm:px-10 sm:py-14">'
);

// 2-B: Main heading
cdp = cdp.replace(
  '<h1 className="mt-3 text-3xl font-black leading-tight tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">',
  '<h1 className="mt-3 text-2xl sm:text-4xl lg:text-5xl font-black leading-tight tracking-tight text-slate-900 break-keep">'
);

// 2-C: Top reservation button
cdp = cdp.replace(
  'className="shrink-0 inline-flex items-center gap-2 rounded-2xl bg-sky-600 px-6 py-3.5 text-sm font-black text-white shadow-md shadow-sky-600/20 transition hover:bg-sky-500 active:scale-95"',
  'className="shrink-0 inline-flex items-center justify-center gap-2 rounded-2xl bg-sky-600 px-6 py-3.5 text-sm font-black text-white shadow-md shadow-sky-600/20 transition hover:bg-sky-500 active:scale-95 w-full sm:w-auto"'
);

// 2-D: Main body padding
cdp = cdp.replace(
  '<main className="mx-auto max-w-5xl w-full px-6 py-12 sm:px-10 flex-1">',
  '<main className="mx-auto max-w-5xl w-full px-4 py-8 sm:px-10 sm:py-12 flex-1">'
);

// 2-E: Summary text
cdp = cdp.replace(
  '<p className="max-w-2xl text-lg leading-relaxed text-slate-600">',
  '<p className="max-w-2xl text-base sm:text-lg leading-relaxed text-slate-600 break-keep">'
);

// 2-F: Facility profile intro paragraphs
cdp = cdp.replace(
  '<div className="mb-8 space-y-3.5 text-base leading-relaxed text-slate-600 sm:text-[17px]">',
  '<div className="mb-8 space-y-3.5 text-sm sm:text-base leading-relaxed text-slate-600 break-keep">'
);

// 2-G: Location & visit info box labels & buttons
cdp = cdp.replace(
  '<div className="space-y-4 px-6 py-6 text-sm text-slate-700">',
  '<div className="space-y-4 px-4 py-5 sm:px-6 sm:py-6 text-sm text-slate-700">'
);
cdp = cdp.replace(
  '<span className="w-20 shrink-0 font-bold text-slate-900">위치</span>\n              <span className="text-slate-600">{center.address}</span>',
  '<span className="w-16 sm:w-20 shrink-0 font-bold text-slate-900">위치</span>\n              <span className="text-slate-600 break-keep min-w-0">{center.address}</span>'
);
cdp = cdp.replace(
  '<span className="w-20 shrink-0 font-bold text-slate-900">휴관일</span>\n              <span className="text-slate-600">\n                {formatWeeklyClosureSentence(center.weeklyClosedDays)}\n              </span>',
  '<span className="w-16 sm:w-20 shrink-0 font-bold text-slate-900">휴관일</span>\n              <span className="text-slate-600 break-keep min-w-0">\n                {formatWeeklyClosureSentence(center.weeklyClosedDays)}\n              </span>'
);
cdp = cdp.replace(
  '<span className="w-20 shrink-0 font-bold text-slate-900">명절·기타</span>\n              <span className="text-slate-600">{center.holidayClosureSummary}</span>',
  '<span className="w-16 sm:w-20 shrink-0 font-bold text-slate-900">명절·기타</span>\n              <span className="text-slate-600 break-keep min-w-0">{center.holidayClosureSummary}</span>'
);
cdp = cdp.replace(
  '<span className="w-20 shrink-0 font-bold text-slate-900">문의전화</span>',
  '<span className="w-16 sm:w-20 shrink-0 font-bold text-slate-900">문의전화</span>'
);

// 2-H: Bottom action buttons
const oldBottomBtns = `<div className="flex flex-wrap gap-3 border-t border-slate-100 px-6 py-5">
            <a
              href={\`tel:\${center.contactPhone}\`}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-sky-200 bg-sky-50 px-5 py-3 text-sm font-bold text-sky-800 transition hover:bg-sky-100 active:scale-95 min-h-[44px] w-full sm:w-auto"
            >
              <span>📞</span>
              <span>안내데스크 전화 문의 ({center.contactPhone})</span>
            </a>
            <a
              href={naverMapSearchHref(center)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-bold text-slate-700 transition hover:border-slate-400 hover:bg-slate-50 shadow-xs min-h-[44px] flex-1 sm:flex-none"
            >
              지도에서 위치 열기 ↗
            </a>
            <Link
              href={\`/reserve?center=\${center.id}\`}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-sky-600 px-6 py-3 text-sm font-black text-white transition hover:bg-sky-500 shadow-sm shadow-sky-600/20 active:scale-95 min-h-[44px] flex-1 sm:flex-none"
            >
              <span>🗓</span> 가이드 투어 예약하기
            </Link>
          </div>`;

const newBottomBtns = `<div className="flex flex-col sm:flex-row flex-wrap gap-3 border-t border-slate-100 px-4 py-4 sm:px-6 sm:py-5">
            <a
              href={\`tel:\${center.contactPhone}\`}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-sky-200 bg-sky-50 px-5 py-3 text-sm font-bold text-sky-800 transition hover:bg-sky-100 active:scale-95 min-h-[44px] w-full sm:w-auto"
            >
              <span>📞</span>
              <span>안내데스크 전화 문의 ({center.contactPhone})</span>
            </a>
            <a
              href={naverMapSearchHref(center)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-bold text-slate-700 transition hover:border-slate-400 hover:bg-slate-50 shadow-xs min-h-[44px] w-full sm:w-auto"
            >
              지도에서 위치 열기 ↗
            </a>
            <Link
              href={\`/reserve?center=\${center.id}\`}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-sky-600 px-6 py-3 text-sm font-black text-white transition hover:bg-sky-500 shadow-sm shadow-sky-600/20 active:scale-95 min-h-[44px] w-full sm:w-auto"
            >
              <span>🗓</span> 가이드 투어 예약하기
            </Link>
          </div>`;

if (cdp.includes(oldBottomBtns)) {
  cdp = cdp.replace(oldBottomBtns, newBottomBtns);
  console.log('Fixed CenterDetailPage bottom action buttons');
} else {
  console.warn('Could not find oldBottomBtns in CenterDetailPage');
}

fs.writeFileSync('src/app/centers/[id]/page.tsx', cdp, 'utf8');

// 3. src/components/CenterExplorer.tsx (on /status list view, floor highlights shouldn't be abruptly truncated)
let ce = fs.readFileSync('src/components/CenterExplorer.tsx', 'utf8').replace(/\r\n/g, '\n');
const oldHighlights = `<span className="text-slate-700 truncate min-w-0 flex-1 text-xs sm:text-sm font-medium">
                    {f.highlights.join(", ")}
                  </span>`;
const newHighlights = `<span className="text-slate-700 min-w-0 flex-1 text-xs sm:text-sm font-medium break-keep">
                    {f.highlights.join(", ")}
                  </span>`;
if (ce.includes(oldHighlights)) {
  ce = ce.replace(oldHighlights, newHighlights);
  fs.writeFileSync('src/components/CenterExplorer.tsx', ce, 'utf8');
  console.log('Fixed CenterExplorer floor highlights truncate');
} else {
  console.warn('Could not find oldHighlights in CenterExplorer');
}

// 4. src/components/FacilityTabs.tsx
let ft = fs.readFileSync('src/components/FacilityTabs.tsx', 'utf8').replace(/\r\n/g, '\n');
ft = ft.replace(
  'className="grid gap-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm md:grid-cols-[1fr_1.3fr] transition-opacity duration-200"',
  'className="grid gap-5 sm:gap-6 rounded-2xl border border-slate-200 bg-white p-4 sm:p-6 shadow-sm md:grid-cols-[1fr_1.3fr] transition-opacity duration-200"'
);
ft = ft.replace(
  '<dd className="text-slate-800 font-medium">{activeFac.location}</dd>',
  '<dd className="text-slate-800 font-medium break-keep min-w-0">{activeFac.location}</dd>'
);
ft = ft.replace(
  '<dd className="text-slate-800 font-medium">{activeFac.operating_hours}</dd>',
  '<dd className="text-slate-800 font-medium break-keep min-w-0">{activeFac.operating_hours}</dd>'
);
fs.writeFileSync('src/components/FacilityTabs.tsx', ft, 'utf8');

console.log('All text clipping fixes applied successfully.');
