import { Suspense } from "react";
import { redirect } from "next/navigation";
import { STAFF_CONSOLE_HREF } from "@/lib/sitePaths";
import { isStaffConsoleGateEnabled } from "@/lib/staffConsoleGate";
import { LoginForm } from "./LoginForm";

export const metadata = {
  title: "운영 콘솔 로그인 | 물문화관",
  robots: { index: false, follow: false },
};

export default function StaffConsoleLoginPage() {
  if (!isStaffConsoleGateEnabled()) {
    redirect(STAFF_CONSOLE_HREF);
  }

  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-[#0b111e] text-sm text-white/50">
          불러오는 중…
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
