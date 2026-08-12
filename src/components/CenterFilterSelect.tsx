"use client";

import { Suspense } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { waterCenters } from "@/data/centers";

function CenterFilterSelectInner({
  includeHeadquarters = false,
}: {
  includeHeadquarters?: boolean;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentCenter = searchParams.get("center") ?? "all";

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    const params = new URLSearchParams(searchParams.toString());
    if (val === "all") {
      params.delete("center");
    } else {
      params.set("center", val);
    }
    params.delete("id");

    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <select
      value={currentCenter}
      onChange={handleChange}
      className="min-h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-800 font-semibold outline-none focus:ring-2 focus:ring-sky-500/40"
    >
      <option value="all">전체 물문화관</option>
      {includeHeadquarters && <option value="headquarters">본사 공지</option>}
      {waterCenters.map((wc) => (
        <option key={wc.id} value={wc.id}>
          {wc.name}
        </option>
      ))}
    </select>
  );
}

export function CenterFilterSelect({
  includeHeadquarters = false,
}: {
  includeHeadquarters?: boolean;
}) {
  return (
    <div className="flex flex-col gap-1.5 w-full max-w-xs">
      <Suspense
        fallback={
          <select
            className="min-h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-400 font-semibold outline-none"
            disabled
          >
            <option>불러오는 중...</option>
          </select>
        }
      >
        <CenterFilterSelectInner includeHeadquarters={includeHeadquarters} />
      </Suspense>
    </div>
  );
}
