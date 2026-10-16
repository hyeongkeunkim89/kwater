import { getStoriesSql } from "./waterStoriesDb";

export type UserDbRow = {
  id?: string;
  email: string;
  name: string;
  phone?: string;
  provider: string;
  role?: string;
};

/**
 * 카카오/네이버/이메일 로그인 및 회원가입 시 Supabase users 테이블에 안전하게 UPSERT
 */
export async function upsertUserToDb(user: UserDbRow): Promise<void> {
  const sql = getStoriesSql();
  if (!sql) {
    return;
  }

  const email = user.email.toLowerCase().trim();
  const name = user.name.trim();
  const phone = user.phone ? user.phone.trim() : "";
  const provider = user.provider || "email";
  const role = user.role || "user";

  if (!email || !name) {
    return;
  }

  try {
    await sql`
      INSERT INTO public.users (email, name, phone, provider, role, updated_at)
      VALUES (${email}, ${name}, ${phone}, ${provider}, ${role}, now())
      ON CONFLICT (email) DO UPDATE SET
        name = EXCLUDED.name,
        phone = CASE WHEN EXCLUDED.phone <> '' THEN EXCLUDED.phone ELSE users.phone END,
        provider = EXCLUDED.provider,
        updated_at = now()
    `;
  } catch (err) {
    console.error("Failed to upsert user to Supabase users table:", err);
  }
}
