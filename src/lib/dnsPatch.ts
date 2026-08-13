import dns from "dns";

// ── 사내망 DNS Suffix 자동 추가로 인한 조회 오류 우회 ──
const originalLookup = dns.lookup;
(dns as any).lookup = function (hostname: any, options: any, callback: any) {
  let target = hostname;
  if (typeof hostname === "string" && (hostname.endsWith("supabase.co") || hostname.endsWith("supabase.com"))) {
    if (!hostname.endsWith(".")) {
      target = hostname + ".";
    }
  }
  if (typeof options === "function") {
    return (originalLookup as any).call(dns, target, options);
  }
  return (originalLookup as any).call(dns, target, options, callback);
};

console.log("✈️ DNS patch applied for Supabase hostnames");
