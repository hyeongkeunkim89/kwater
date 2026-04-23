import { STAFF_CONSOLE_HREF } from "@/lib/sitePaths";
import { permanentRedirect } from "next/navigation";

/** 구 주소 호환: `/admin` → 운영 콘솔 */
export default function AdminLegacyRedirect() {
  permanentRedirect(STAFF_CONSOLE_HREF);
}
