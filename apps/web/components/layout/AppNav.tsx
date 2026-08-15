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

function NavBadge({ count }: { count: number }) {
  if (count <= 0) return null;
  return (
    <span className="text-[0.625rem] font-semibold text-white bg-brand-dark rounded-full px-1.5 py-0.5">
      {count}
    </span>
  );
}

export function AppNav({ reviewCount = 0 }: { reviewCount?: number }) {
  const pathname = usePathname();

  return (
    <nav className="hidden md:flex items-center gap-1 h-full">
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
            <NavBadge count={item.href === "/review" ? reviewCount : 0} />
          </Link>
        );
      })}
    </nav>
  );
}
