import { redirect } from "next/navigation";

type Props = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

/**
 * /reserve/guest-check 접속 시 통합된 /reserve?tab=lookup 화면으로 리다이렉트
 * 전달된 phone, pin 쿼리 파라미터가 있을 경우 보존하여 포워딩
 */
export default async function GuestCheckRedirectPage({ searchParams }: Props) {
  const sp = await searchParams;
  const params = new URLSearchParams();
  params.set("tab", "lookup");

  if (typeof sp.phone === "string" && sp.phone) {
    params.set("phone", sp.phone);
  }
  if (typeof sp.pin === "string" && sp.pin) {
    params.set("pin", sp.pin);
  }

  redirect(`/reserve?${params.toString()}`);
}
