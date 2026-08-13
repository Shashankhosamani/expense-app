"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export function useSignInWithGoogle() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function signInWithGoogle() {
    setError(null);
    setLoading(true);
    const supabase = createClient();
    return supabase.auth
      .signInWithOAuth({
        provider: "google",
        options: { redirectTo: `${window.location.origin}/auth/callback` },
      })
      .then(({ error }) => {
        if (error) {
          setLoading(false);
          setError(error.message);
        }
        // On success the browser is redirected to Google, so no further
        // state update happens here.
      });
  }

  return { signInWithGoogle, loading, error };
}

export function useSignOut() {
  const router = useRouter();
  return () => {
    const supabase = createClient();
    return supabase.auth.signOut().then(() => {
      router.push("/sign-in");
      router.refresh();
    });
  };
}

export function useSignIn() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function signIn(email: string, password: string) {
    setError(null);
    setLoading(true);
    const supabase = createClient();
    return supabase.auth.signInWithPassword({ email, password }).then(({ error }) => {
      setLoading(false);
      if (error) {
        setError(error.message);
        return false;
      }
      router.push("/dashboard");
      router.refresh();
      return true;
    });
  }

  return { signIn, loading, error };
}
