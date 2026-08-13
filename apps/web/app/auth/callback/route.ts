import { type NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get("code");
  const redirectTo = request.nextUrl.searchParams.get("redirect_to") ?? "/dashboard";

  if (!code) {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  return createClient().then((supabase) =>
    supabase.auth.exchangeCodeForSession(code).then(({ error }) =>
      NextResponse.redirect(new URL(error ? "/sign-in" : redirectTo, request.url))
    )
  );
}
