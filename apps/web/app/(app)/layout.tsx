import { AppShell } from "@/components/layout/AppShell";
import { createClient } from "@/lib/supabase/server";

function initialsFromEmail(email: string | undefined): string {
  if (!email) return "?";
  return email
    .split("@")[0]
    .split(/[._-]/)
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return <AppShell initials={initialsFromEmail(user?.email)}>{children}</AppShell>;
}
