import { permanentRedirect } from "next/navigation";

/** 구 주소 호환: `/admin` → 마이페이지(/mypage) */
export default function AdminLegacyRedirect() {
  permanentRedirect("/mypage");
}
