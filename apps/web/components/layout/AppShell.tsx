"use client";

import { Plus, Search, LogOut } from "lucide-react";
import { Logo } from "./Logo";
import { AppNav } from "./AppNav";
import { AddExpenseProvider, useAddExpense } from "./AddExpenseContext";
import { AddExpenseModal } from "@/components/expenses/AddExpenseModal";
import { useReviewQueue } from "@/hooks/useReviewQueue";
import { useSignOut } from "@/hooks/useAuth";

function Header({ initials }: { initials: string }) {
  const { open } = useAddExpense();
  const { total: reviewCount } = useReviewQueue();
  const signOut = useSignOut();

  return (
    <header className="flex-none bg-surface-raised border-b border-border">
      <div className="flex items-center gap-4 sm:gap-7 px-4 sm:px-8 h-16">
        <Logo />
        <AppNav reviewCount={reviewCount} />
        <div className="flex-1" />
        <div className="hidden md:flex items-center gap-2 bg-surface border border-border rounded-lg px-3 py-2 w-[220px]">
          <Search size={16} className="text-ink-4" />
          <span className="text-sm text-ink-4">Search expenses</span>
        </div>
        <button
          onClick={open}
          className="flex items-center gap-2 bg-brand hover:bg-brand-dark text-white rounded-lg px-3.5 py-2.5 text-sm font-medium cursor-pointer whitespace-nowrap"
        >
          <Plus size={16} />
          <span className="hidden sm:inline">Add Expense</span>
        </button>
        <span className="w-8.5 h-8.5 rounded-full bg-border text-ink-2 flex items-center justify-center text-[13px] font-medium shrink-0">
          {initials}
        </span>
        <button onClick={signOut} className="text-ink-3 hover:text-ink cursor-pointer" title="Sign out">
          <LogOut size={17} />
        </button>
      </div>
    </header>
  );
}

export function AppShell({ children, initials = "?" }: { children: React.ReactNode; initials?: string }) {
  return (
    <AddExpenseProvider>
      <div className="min-h-screen flex flex-col bg-page">
        <Header initials={initials} />
        <main className="flex-1 px-4 sm:px-8 py-6 max-w-[1400px] w-full mx-auto">{children}</main>
        <AddExpenseModal />
      </div>
    </AddExpenseProvider>
  );
}
