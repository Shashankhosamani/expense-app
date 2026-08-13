import { cn } from "@/lib/cn";

interface ProgressBarProps {
  percent: number; // 0-100
  markerPercent?: number;
  color?: string;
  trackClassName?: string;
  height?: number;
}

export function ProgressBar({
  percent,
  markerPercent,
  color = "var(--color-brand)",
  trackClassName,
  height = 12,
}: ProgressBarProps) {
  const clamped = Math.max(0, Math.min(100, percent));
  return (
    <div
      className={cn("relative rounded-full bg-border-3 overflow-hidden", trackClassName)}
      style={{ height }}
    >
      <div
        className="absolute inset-y-0 left-0 rounded-full"
        style={{ width: `${clamped}%`, background: color }}
      />
      {markerPercent !== undefined && (
        <div
          className="absolute top-0 bottom-0 w-0.5 bg-ink"
          style={{ left: `${markerPercent}%` }}
        />
      )}
    </div>
  );
}
