import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/cn";

type Variant = "primary" | "outline" | "ghost" | "danger" | "dark";

const variantClasses: Record<Variant, string> = {
  primary:
    "bg-brand text-white hover:bg-brand-dark border border-transparent",
  outline:
    "bg-surface-raised text-ink-2 border border-border hover:bg-white",
  ghost: "bg-transparent text-ink-2 border border-transparent hover:bg-white",
  danger:
    "bg-surface-raised text-brand-dark border border-brand-tint-border hover:bg-brand-tint",
  dark: "bg-navy text-surface hover:bg-navy/90 border border-transparent",
};

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
}

export function Button({
  variant = "primary",
  className,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed",
        variantClasses[variant],
        className
      )}
      {...props}
    />
  );
}
