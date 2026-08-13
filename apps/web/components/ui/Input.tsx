import type { InputHTMLAttributes, LabelHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/cn";

export function Label({ className, ...props }: LabelHTMLAttributes<HTMLLabelElement>) {
  return (
    <label
      className={cn(
        "text-[10px] font-semibold uppercase tracking-wider text-ink-3",
        className
      )}
      {...props}
    />
  );
}

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  icon?: ReactNode;
}

export function Input({ icon, className, ...props }: InputProps) {
  return (
    <div className="flex items-center gap-2.5 bg-surface border border-border rounded-lg px-3.5 py-3 focus-within:border-brand focus-within:ring-3 focus-within:ring-brand/15">
      {icon && <span className="flex text-ink-4">{icon}</span>}
      <input
        className={cn(
          "flex-1 bg-transparent text-sm text-ink outline-none placeholder:text-ink-4",
          className
        )}
        {...props}
      />
    </div>
  );
}
