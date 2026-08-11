"use client";

import dynamic from "next/dynamic";

const HeroSlider = dynamic(
  () => import("@/components/HeroSlider").then((m) => m.HeroSlider),
  {
    ssr: false,
    loading: () => (
      <div className="h-full min-h-0 w-full bg-slate-50" />
    ),
  },
);

export function HeroSliderWrapper() {
  return (
    <div className="h-full w-full flex flex-col">
      <HeroSlider />
    </div>
  );
}
