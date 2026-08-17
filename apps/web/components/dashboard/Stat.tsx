export function Stat({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div className="flex flex-col gap-1.5 shrink-0">
      <span className="text-[0.625rem] font-semibold uppercase tracking-wider text-ink-4 whitespace-nowrap">{label}</span>
      <span className="text-xl font-medium tabular-nums whitespace-nowrap" style={{ color }}>
        {value}
      </span>
    </div>
  );
}
