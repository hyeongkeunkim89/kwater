import { STAFF_CONSOLE_HREF } from "@/lib/sitePaths";
import { permanentRedirect } from "next/navigation";

/** 구 주소 호환: `/admin` → 관리자 페이지(/yunyeong) */
export default function AdminLegacyRedirect() {
  permanentRedirect(STAFF_CONSOLE_HREF);
}
