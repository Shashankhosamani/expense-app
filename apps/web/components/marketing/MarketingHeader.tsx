"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu } from "lucide-react";
import { Logo } from "@/components/layout/Logo";

const LINKS = [
  { href: "#how", label: "How it works" },
  { href: "#features", label: "Features" },
  { href: "#pricing", label: "Pricing" },
  { href: "#faq", label: "FAQ" },
];

export function MarketingHeader() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-10 flex flex-col bg-white/96 backdrop-blur-sm border-b border-border-3">
      <div className="flex items-center justify-between gap-4 px-5 sm:px-16 py-4">
        <Logo />
        <nav className="hidden md:flex items-center gap-6 lg:gap-9">
          {LINKS.map((l) => (
            <a key={l.href} href={l.href} className="text-sm font-semibold text-ink-2 hover:text-ink">
              {l.label}
            </a>
          ))}
        </nav>
        <div className="hidden md:flex items-center gap-4">
          <Link href="/sign-in" className="text-sm font-semibold text-ink-2 hover:text-ink">
            Log in
          </Link>
          <Link
            href="/sign-in"
            className="bg-brand hover:bg-brand-dark text-white rounded-lg px-5 py-2.5 text-sm font-bold"
          >
            Sign up free
          </Link>
        </div>
        <button className="md:hidden p-2 cursor-pointer text-ink" onClick={() => setOpen((o) => !o)}>
          <Menu size={22} />
        </button>
      </div>
      {open && (
        <div className="md:hidden flex flex-col gap-1 px-5 py-3 border-t border-border-3">
          {LINKS.map((l) => (
            <a key={l.href} href={l.href} className="py-3 text-[0.9375rem] font-semibold text-ink-2">
              {l.label}
            </a>
          ))}
          <Link href="/sign-in" className="py-3 text-[0.9375rem] font-semibold text-ink-2">
            Log in
          </Link>
          <Link
            href="/sign-in"
            className="mt-2 bg-brand text-white rounded-lg px-4 py-3.5 text-[0.9375rem] font-bold text-center"
          >
            Sign up free
          </Link>
        </div>
      )}
    </header>
  );
}
