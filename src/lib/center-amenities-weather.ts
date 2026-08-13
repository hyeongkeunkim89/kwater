export type CenterAmenity = "☕ 전망카페" | "🔭 전망대" | "🍼 수유실" | "♿ 엘리베이터(배리어프리)";

export type CenterWeather = {
  temp: string;
  condition: string;
  icon: string;
  trailStatus: string;
};

export const CENTER_AMENITIES_BY_ID: Record<string, CenterAmenity[]> = {
  chungju: ["☕ 전망카페", "🔭 전망대", "🍼 수유실", "♿ 엘리베이터(배리어프리)"],
  soyang: ["☕ 전망카페", "🔭 전망대", "♿ 엘리베이터(배리어프리)"],
  daecheong: ["☕ 전망카페", "🔭 전망대", "🍼 수유실", "♿ 엘리베이터(배리어프리)"],
  buan: ["🔭 전망대", "♿ 엘리베이터(배리어프리)"],
  hantan: ["🔭 전망대", "♿ 엘리베이터(배리어프리)"],
  "peace-dam": ["☕ 전망카페", "🔭 전망대", "🍼 수유실", "♿ 엘리베이터(배리어프리)"],
  hoengseong: ["☕ 전망카페", "🔭 전망대", "🍼 수유실", "♿ 엘리베이터(배리어프리)"],
  yeongju: ["🔭 전망대", "♿ 엘리베이터(배리어프리)"],
  juam: ["☕ 전망카페", "🔭 전망대", "♿ 엘리베이터(배리어프리)"],
  jangheung: ["🔭 전망대", "🍼 수유실", "♿ 엘리베이터(배리어프리)"],
  seomjin: ["🔭 전망대", "♿ 엘리베이터(배리어프리)"],
  gimcheon: ["☕ 전망카페", "🔭 전망대", "♿ 엘리베이터(배리어프리)"],
  yongdam: ["🔭 전망대", "♿ 엘리베이터(배리어프리)"],
  namgang: ["☕ 전망카페", "🔭 전망대", "♿ 엘리베이터(배리어프리)"],
  miryang: ["🔭 전망대", "♿ 엘리베이터(배리어프리)"],
};

export const CENTER_WEATHER_BY_ID: Record<string, CenterWeather> = {
  chungju: { temp: "24°C", condition: "맑음", icon: "☀️", trailStatus: "충주호 둘레길 산책 최고 🌿" },
  soyang: { temp: "22°C", condition: "구름조금", icon: "⛅", trailStatus: "소양댐 마루 산책 쾌적 🚶‍♂️" },
  daecheong: { temp: "23°C", condition: "맑음", icon: "☀️", trailStatus: "대청호 수변 데크길 산책 굿 💧" },
  buan: { temp: "22°C", condition: "맑음", icon: "☀️", trailStatus: "국립공원 수변 산책로 추천 🌲" },
  hantan: { temp: "21°C", condition: "구름조금", icon: "⛅", trailStatus: "협곡 수변 둘레길 산책 굿 🍃" },
  "peace-dam": { temp: "20°C", condition: "맑음", icon: "☀️", trailStatus: "세계종공원 안보 산책로 추천 🔔" },
  hoengseong: { temp: "23°C", condition: "맑음", icon: "☀️", trailStatus: "횡성호수길 둘레길 나들이 최고 🌸" },
  yeongju: { temp: "24°C", condition: "맑음", icon: "☀️", trailStatus: "출렁다리 & 생태숲 산책 추천 🌉" },
  juam: { temp: "25°C", condition: "구름조금", icon: "⛅", trailStatus: "주암호 수변 산책로 쾌적 🌿" },
  jangheung: { temp: "25°C", condition: "맑음", icon: "☀️", trailStatus: "담수호 산책로 힐링 타임 🍃" },
  seomjin: { temp: "24°C", condition: "맑음", icon: "☀️", trailStatus: "섬진강 수변 산책로 추천 💧" },
  gimcheon: { temp: "25°C", condition: "구름조금", icon: "⛅", trailStatus: "부항댐 둘레길 산책 굿 🚶‍♀️" },
  yongdam: { temp: "22°C", condition: "맑음", icon: "☀️", trailStatus: "용담호 수변 데크길 산책 🌿" },
  namgang: { temp: "26°C", condition: "맑음", icon: "☀️", trailStatus: "진양호 호반 산책길 추천 🌊" },
  miryang: { temp: "26°C", condition: "구름조금", icon: "⛅", trailStatus: "밀양강 수변 둘레길 쾌적 🍃" },
};
