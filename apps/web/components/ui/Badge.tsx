import type { HTMLAttributes } from "react";
import { cn } from "@/lib/cn";

type Tone = "brand" | "success" | "warn" | "neutral";

const toneClasses: Record<Tone, string> = {
  brand: "text-brand-dark bg-brand-tint border-brand-tint-border",
  success: "text-success bg-success-tint-2 border-success-tint",
  warn: "text-[#A9670A] bg-warn-tint border-[#FFD9AC]",
  neutral: "text-ink-3 bg-border/40 border-border",
};

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  tone?: Tone;
}

export function Badge({ tone = "neutral", className, ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[0.6875rem] font-semibold uppercase tracking-wide",
        toneClasses[tone],
        className
      )}
      {...props}
    />
  );
}
