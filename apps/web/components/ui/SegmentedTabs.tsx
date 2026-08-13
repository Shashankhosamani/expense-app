import { cn } from "@/lib/cn";

interface SegmentedTabsProps<T extends string> {
  options: { label: string; value: T }[];
  value: T;
  onChange: (value: T) => void;
}

export function SegmentedTabs<T extends string>({ options, value, onChange }: SegmentedTabsProps<T>) {
  return (
    <div className="flex border border-border rounded-lg overflow-hidden bg-surface-raised">
      {options.map((opt) => (
        <button
          key={opt.value}
          onClick={() => onChange(opt.value)}
          className={cn(
            "text-xs px-3.5 py-2.5 border-l border-border first:border-l-0 cursor-pointer",
            value === opt.value ? "bg-navy text-white font-medium" : "text-ink-3"
          )}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}
