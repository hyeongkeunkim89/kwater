"use client";

import Script from "next/script";

declare global {
  interface Window {
    Kakao: any;
  }
}

export function KakaoScriptLoader() {
  const kakaoJsKey = process.env.NEXT_PUBLIC_KAKAO_JS_KEY || "72d7c263c7937e92cc7b2dd2861b3cab";

  return (
    <Script
      src="https://t1.kakaocdn.net/kakao_js_sdk/2.7.2/kakao.min.js"
      strategy="afterInteractive"
      onLoad={() => {
        if (window.Kakao && !window.Kakao.isInitialized()) {
          try {
            window.Kakao.init(kakaoJsKey);
            console.log("Kakao SDK Initialized successfully with key:", kakaoJsKey);
          } catch (e) {
            console.error("Kakao SDK Init Error:", e);
          }
        }
      }}
    />
  );
}
