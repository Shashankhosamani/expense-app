import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

export function Field({
  label,
  tag,
  className,
  children,
}: {
  label: string;
  tag?: ReactNode;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <label className="text-[10px] font-semibold uppercase tracking-wider text-ink-3">
        {label} {tag}
      </label>
      {children}
    </div>
  );
}
