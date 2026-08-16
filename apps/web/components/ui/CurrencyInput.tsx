import { cn } from "@/lib/cn";

interface CurrencyInputProps {
  value: string;
  onChange: (value: string) => void;
  autoFocus?: boolean;
  emphasized?: boolean;
  className?: string;
}

export function CurrencyInput({ value, onChange, autoFocus, emphasized, className }: CurrencyInputProps) {
  return (
    <div
      className={cn(
        "flex items-center gap-2 border rounded-lg px-3.5 py-3",
        emphasized ? "bg-white border-brand ring-3 ring-brand/15" : "bg-surface border-border",
        className
      )}
    >
      <span className={cn("text-ink-4", emphasized ? "text-xl" : "text-lg")}>₹</span>
      <input
        autoFocus={autoFocus}
        inputMode="decimal"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="0.00"
        className={cn(
          "flex-1 bg-transparent outline-none font-medium tabular-nums text-ink",
          emphasized ? "text-xl" : "text-lg"
        )}
      />
    </div>
  );
}
