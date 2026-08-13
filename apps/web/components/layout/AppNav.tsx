"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/cn";

const NAV_ITEMS = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/expenses", label: "Expenses" },
  { href: "/review", label: "Review" },
  { href: "/budget", label: "Budget" },
  { href: "/insights", label: "Insights" },
  { href: "/settings", label: "Settings" },
];

export function AppNav({ reviewCount = 0 }: { reviewCount?: number }) {
  const pathname = usePathname();

  return (
    <nav className="flex items-center gap-1 h-full overflow-x-auto">
      {NAV_ITEMS.map((item) => {
        const active = pathname?.startsWith(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-2 h-full px-3.5 text-sm whitespace-nowrap border-b-2",
              active ? "border-brand text-ink font-semibold" : "border-transparent text-ink-3 font-medium"
            )}
          >
            {item.label}
            {item.href === "/review" && reviewCount > 0 && (
              <span className="text-[10px] font-semibold text-white bg-brand-dark rounded-full px-1.5 py-0.5">
                {reviewCount}
              </span>
            )}
          </Link>
        );
      })}
    </nav>
  );
}
