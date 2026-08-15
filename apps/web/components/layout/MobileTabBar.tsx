"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Receipt, Plus, ShieldAlert, ChartColumn } from "lucide-react";
import { useAddExpense } from "./AddExpenseContext";
import { cn } from "@/lib/cn";

const TABS = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/expenses", label: "Expenses", icon: Receipt },
  { href: "/review", label: "Review", icon: ShieldAlert },
  { href: "/insights", label: "Insights", icon: ChartColumn },
];

export function MobileTabBar({ reviewCount = 0 }: { reviewCount?: number }) {
  const pathname = usePathname();
  const { open } = useAddExpense();

  return (
    <nav className="md:hidden fixed inset-x-0 bottom-0 z-40 bg-surface-raised border-t border-border flex items-center px-1 pt-2 pb-[env(safe-area-inset-bottom)]">
      <TabLink item={TABS[0]} active={!!pathname?.startsWith(TABS[0].href)} badge={0} />
      <TabLink item={TABS[1]} active={!!pathname?.startsWith(TABS[1].href)} badge={0} />

      <button
        onClick={open}
        aria-label="Add expense"
        className="flex-1 min-h-[3.375rem] flex flex-col items-center justify-center gap-1 cursor-pointer"
      >
        <span className="w-[3.25rem] h-[2.125rem] rounded-xl bg-brand text-white flex items-center justify-center">
          <Plus size={20} />
        </span>
        <span className="text-[0.6875rem] text-ink-3">Add</span>
      </button>

      <TabLink item={TABS[2]} active={!!pathname?.startsWith(TABS[2].href)} badge={reviewCount} />
      <TabLink item={TABS[3]} active={!!pathname?.startsWith(TABS[3].href)} badge={0} />
    </nav>
  );
}

function TabLink({
  item,
  active,
  badge,
}: {
  item: (typeof TABS)[number];
  active: boolean;
  badge: number;
}) {
  const Icon = item.icon;
  return (
    <Link
      href={item.href}
      className="flex-1 min-h-[3.375rem] flex flex-col items-center justify-center gap-1"
    >
      <span
        className={cn(
          "relative w-[2.875rem] h-[1.75rem] rounded-full flex items-center justify-center",
          active ? "bg-[#EEF6F8] text-ink" : "text-ink-3"
        )}
      >
        <Icon size={20} />
        {badge > 0 && (
          <span className="absolute top-0.5 right-1.5 w-1.5 h-1.5 rounded-full bg-brand-dark" />
        )}
      </span>
      <span className={cn("text-[0.6875rem]", active ? "text-ink font-medium" : "text-ink-3")}>{item.label}</span>
    </Link>
  );
}
