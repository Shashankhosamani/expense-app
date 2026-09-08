import { createBrowserClient } from "@supabase/ssr";
import { SESSION_COOKIE_MAX_AGE } from "./sessionCookie";

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookieOptions: { maxAge: SESSION_COOKIE_MAX_AGE } }
  );
}
