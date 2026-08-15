"use client";

import { useState } from "react";
import { Mail, Lock, Smartphone } from "lucide-react";
import { Logo } from "@/components/layout/Logo";
import { Field } from "@/components/ui/Field";
import { GoogleIcon } from "@/components/icons/GoogleIcon";
import { useSignIn, useSignInWithGoogle } from "@/hooks/useAuth";

const PIPELINE = [
  "Bank / UPI transaction",
  "SMS arrives on your phone",
  "Costiq captures it, encrypted",
  "Claude reads it, only on request",
  "Backend validates the result",
  "Your dashboard updates",
];

export default function SignInPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { signIn, loading, error } = useSignIn();
  const { signInWithGoogle, loading: googleLoading, error: googleError } = useSignInWithGoogle();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    signIn(email, password);
  }

  return (
    <div className="min-h-screen flex bg-surface">
      <div className="hidden lg:flex w-[37.5rem] shrink-0 bg-navy p-14 flex-col justify-between">
        <Logo textClassName="text-[1.375rem] text-surface" />
        <div className="flex flex-col gap-9">
          <h1 className="text-[2.625rem] leading-[1.24] text-surface font-normal tracking-tight max-w-[26.875rem] text-wrap-pretty">
            You already get a message for every rupee you spend. Costiq does the rest.
          </h1>
          <div className="flex flex-col">
            {PIPELINE.map((step, i) => (
              <div key={step} className="flex items-baseline gap-3.5 py-2.5 border-b border-dashed border-[#1E3742]">
                <span className="w-5 text-[0.6875rem] text-brand">{i + 1}</span>
                <span className="flex-1 text-[0.8125rem] text-[#7E9CA7]">{step}</span>
              </div>
            ))}
          </div>
        </div>
        <p className="text-xs leading-5 text-[#7B96A1] max-w-[26.25rem]">
          Message text is encrypted the moment it leaves your phone. It is decrypted only for the few seconds it
          takes to read the amount and the merchant.
        </p>
      </div>

      <div className="flex-1 flex items-center justify-center p-8 sm:p-14">
        <form onSubmit={handleSubmit} className="w-full max-w-[24.5rem] flex flex-col gap-7">
          <div className="lg:hidden mb-2">
            <Logo />
          </div>
          <div className="flex flex-col gap-1.5">
            <h2 className="text-[2rem] tracking-tight font-medium text-ink">Welcome back</h2>
            <p className="text-sm text-ink-3">Use the account paired with your Android phone.</p>
          </div>

          <div className="flex flex-col gap-4">
            <Field label="Email">
              <div className="flex items-center gap-2.5 bg-surface-raised border border-border rounded-lg px-3.5 py-3">
                <Mail size={17} className="text-ink-4" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="flex-1 bg-transparent outline-none text-sm text-ink"
                />
              </div>
            </Field>
            <Field label="Password">
              <div className="flex items-center gap-2.5 bg-white border border-border rounded-lg px-3.5 py-3 focus-within:border-brand focus-within:ring-3 focus-within:ring-brand/15">
                <Lock size={17} className="text-ink-3" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••"
                  className="flex-1 bg-transparent outline-none text-sm text-ink"
                />
              </div>
            </Field>
          </div>

          {error && <div className="text-sm text-brand-dark">{error}</div>}

          <button
            type="submit"
            disabled={loading}
            className="bg-brand hover:bg-brand-dark text-white rounded-lg px-4 py-3.5 text-[0.9375rem] font-medium cursor-pointer disabled:opacity-60"
          >
            {loading ? "Signing in…" : "Sign In"}
          </button>

          <div className="flex items-center gap-3 text-xs text-ink-4">
            <div className="flex-1 h-px bg-border" />
            or
            <div className="flex-1 h-px bg-border" />
          </div>

          {googleError && <div className="text-sm text-brand-dark">{googleError}</div>}

          <button
            type="button"
            onClick={signInWithGoogle}
            disabled={googleLoading}
            className="flex items-center justify-center gap-2.5 bg-white hover:bg-surface-raised border border-border rounded-lg px-4 py-3.5 text-[0.9375rem] font-medium text-ink cursor-pointer disabled:opacity-60"
          >
            <GoogleIcon size={17} />
            {googleLoading ? "Redirecting…" : "Continue with Google"}
          </button>

          <div className="flex items-start gap-2.5 bg-warn-tint border border-[#FFD9AC] rounded-lg p-3.5">
            <Smartphone size={16} className="text-[#A9670A] mt-0.5 shrink-0" />
            <span className="text-xs leading-5 text-[#7A5A14]">
              Install the Android app after signing in. It pairs with a device key — never with the token Claude
              uses.
            </span>
          </div>
        </form>
      </div>
    </div>
  );
}
