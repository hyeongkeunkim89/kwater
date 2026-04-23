/**
 * 관리자 페이지(/yunyeong) 접근 게이트 — 예약·물 이야기와 동일한 관리 비밀번호로 통합.
 * `STAFF_CONSOLE_PASSWORD`가 있으면 그 값을, 없으면 `WATER_STORIES_ADMIN_SECRET`을 페이지 진입 비밀번호로 사용.
 * 미들웨어(Edge)와 API(Node)에서 공통 사용. Web Crypto만 사용.
 */

export const STAFF_CONSOLE_GATE_COOKIE = "kwm_staff_console_gate";

const TTL_MS = 7 * 24 * 60 * 60 * 1000;
const GATE_PAYLOAD_VERSION = 1;

function utf8Bytes(s: string): Uint8Array {
  return new TextEncoder().encode(s);
}

function bytesToBase64Url(bytes: Uint8Array): string {
  let bin = "";
  for (let i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i]!);
  return btoa(bin).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function base64UrlToBytes(s: string): Uint8Array | null {
  try {
    const pad = s.length % 4 === 0 ? "" : "=".repeat(4 - (s.length % 4));
    const b64 = s.replace(/-/g, "+").replace(/_/g, "/") + pad;
    const bin = atob(b64);
    const out = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
    return out;
  } catch {
    return null;
  }
}

function hexToBytes(hex: string): Uint8Array | null {
  if (hex.length % 2 !== 0 || !/^[0-9a-fA-F]+$/.test(hex)) return null;
  const out = new Uint8Array(hex.length / 2);
  for (let i = 0; i < out.length; i++) {
    out[i] = parseInt(hex.slice(i * 2, i * 2 + 2), 16);
  }
  return out;
}

function bytesToHex(bytes: ArrayBuffer): string {
  return Array.from(new Uint8Array(bytes))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

/** HMAC 서명용 비밀(페이지 게이트 비밀번호와 별도로 두면 로테이션에 유리) */
export function getStaffGateSigningSecret(): string {
  return (
    process.env.STAFF_CONSOLE_SESSION_SECRET?.trim() ||
    process.env.WATER_STORIES_ADMIN_SECRET?.trim() ||
    process.env.STAFF_CONSOLE_PASSWORD?.trim() ||
    ""
  );
}

export function isStaffConsoleGateEnabled(): boolean {
  return Boolean(
    process.env.STAFF_CONSOLE_PASSWORD?.trim() || process.env.WATER_STORIES_ADMIN_SECRET?.trim(),
  );
}

/** 로그인 폼·미들웨어가 비교하는 비밀번호(전용 값 우선, 없으면 물 이야기 관리자 시크릿과 동일) */
export function getStaffConsoleGatePassword(): string {
  return (
    process.env.STAFF_CONSOLE_PASSWORD?.trim() ||
    process.env.WATER_STORIES_ADMIN_SECRET?.trim() ||
    ""
  );
}

async function importHmacKey(secret: string): Promise<CryptoKey> {
  const raw = utf8Bytes(secret) as BufferSource;
  return crypto.subtle.importKey("raw", raw, { name: "HMAC", hash: "SHA-256" }, false, ["sign", "verify"]);
}

/** 로그인 성공 후 Set-Cookie 값 */
export async function mintStaffGateSessionToken(): Promise<string> {
  const secret = getStaffGateSigningSecret();
  if (!secret) {
    throw new Error(
      "세션 서명용 비밀이 없습니다. WATER_STORIES_ADMIN_SECRET 또는 STAFF_CONSOLE_SESSION_SECRET을 설정하세요.",
    );
  }
  const exp = Date.now() + TTL_MS;
  const payload = JSON.stringify({ exp, v: GATE_PAYLOAD_VERSION });
  const payloadBytes = utf8Bytes(payload);
  const key = await importHmacKey(secret);
  const sigBuf = await crypto.subtle.sign("HMAC", key, payloadBytes as BufferSource);
  return `${bytesToBase64Url(payloadBytes)}.${bytesToHex(sigBuf)}`;
}

export async function verifyStaffGateSessionToken(token: string): Promise<boolean> {
  const secret = getStaffGateSigningSecret();
  if (!secret || !token) return false;
  const parts = token.split(".");
  if (parts.length !== 2) return false;
  const [payloadB64, sigHex] = parts;
  if (!payloadB64 || !sigHex) return false;
  const payloadBytes = base64UrlToBytes(payloadB64);
  const sigBytes = hexToBytes(sigHex);
  if (!payloadBytes || !sigBytes) return false;
  try {
    const key = await importHmacKey(secret);
    const ok = await crypto.subtle.verify(
      "HMAC",
      key,
      sigBytes as BufferSource,
      payloadBytes as BufferSource,
    );
    if (!ok) return false;
    const payload = JSON.parse(new TextDecoder().decode(payloadBytes)) as { exp?: number; v?: number };
    if (payload.v !== GATE_PAYLOAD_VERSION || typeof payload.exp !== "number") return false;
    return Date.now() < payload.exp;
  } catch {
    return false;
  }
}

/** API에서 Set-Cookie 헤더 조립 */
export function staffGateCookieOptions(): {
  name: string;
  maxAgeSec: number;
  path: string;
  httpOnly: boolean;
  sameSite: "lax";
  secure: boolean;
} {
  return {
    name: STAFF_CONSOLE_GATE_COOKIE,
    maxAgeSec: Math.floor(TTL_MS / 1000),
    path: "/yunyeong",
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  };
}

export function buildStaffGateSetCookieHeader(token: string): string {
  const o = staffGateCookieOptions();
  const parts = [
    `${o.name}=${encodeURIComponent(token)}`,
    `Path=${o.path}`,
    `Max-Age=${o.maxAgeSec}`,
    "HttpOnly",
    `SameSite=${o.sameSite}`,
  ];
  if (o.secure) parts.push("Secure");
  return parts.join("; ");
}

export function buildStaffGateClearCookieHeader(): string {
  const o = staffGateCookieOptions();
  return `${o.name}=; Path=${o.path}; Max-Age=0; HttpOnly; SameSite=${o.sameSite}${o.secure ? "; Secure" : ""}`;
}
