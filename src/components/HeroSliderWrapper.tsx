"use client";

import dynamic from "next/dynamic";

const HeroSlider = dynamic(
  () => import("@/components/HeroSlider").then((m) => m.HeroSlider),
  {
    ssr: false,
    loading: () => (
      <div className="h-full min-h-0 w-full bg-[#0b111e]" />
    ),
  },
);

export function HeroSliderWrapper() {
  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <HeroSlider />
    </div>
  );
}
