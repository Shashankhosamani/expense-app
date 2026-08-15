"use client";

import { useState } from "react";
import Link from "next/link";
import { Target, Settings, LogOut } from "lucide-react";

export function AccountMenu({ initials, onSignOut }: { initials: string; onSignOut: () => void }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label="Account menu"
        aria-expanded={open}
        className="w-8.5 h-8.5 rounded-full bg-border text-ink-2 flex items-center justify-center text-[0.8125rem] font-medium shrink-0 cursor-pointer"
      >
        {initials}
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-[calc(100%+0.5rem)] z-40 w-48 bg-surface-raised border border-border rounded-lg shadow-lg overflow-hidden flex flex-col">
            <Link
              href="/budget"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2.5 px-4 py-3 text-sm text-ink-2 hover:bg-surface"
            >
              <Target size={16} />
              Budget
            </Link>
            <Link
              href="/settings"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2.5 px-4 py-3 text-sm text-ink-2 hover:bg-surface border-t border-border-3"
            >
              <Settings size={16} />
              Settings
            </Link>
            <button
              onClick={() => {
                setOpen(false);
                onSignOut();
              }}
              className="flex items-center gap-2.5 px-4 py-3 text-sm text-ink-2 hover:bg-surface border-t border-border-3 text-left cursor-pointer"
            >
              <LogOut size={16} />
              Sign out
            </button>
          </div>
        </>
      )}
    </div>
  );
}
