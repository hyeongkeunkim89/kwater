import { redirect } from "next/navigation";

export default function EmailPolicyRedirect() {
  redirect("/email-rejection");
}
