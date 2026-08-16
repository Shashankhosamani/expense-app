export function Loading({ label = "Loading…", fullPage = false }: { label?: string; fullPage?: boolean }) {
  return (
    <div
      className={`flex flex-col items-center justify-center gap-5 w-full py-16 ${
        fullPage ? "min-h-[calc(100vh-7rem)]" : ""
      }`}
    >
      <span className="relative w-20 h-20 shrink-0">
        <svg viewBox="0 0 100 100" className="w-full h-full animate-spin [animation-duration:1s]">
          <circle cx="50" cy="50" r="32" fill="none" stroke="var(--color-success-tint)" strokeWidth="14" />
          <circle
            cx="50"
            cy="50"
            r="32"
            fill="none"
            stroke="var(--color-brand)"
            strokeWidth="14"
            strokeDasharray="70 201"
            strokeLinecap="round"
          />
        </svg>
        <span className="absolute inset-0 m-auto w-4 h-4 rounded-full bg-success" />
      </span>
      <span className="text-base text-ink-3 animate-pulse">{label}</span>
    </div>
  );
}

export function EmptyState({ label }: { label: string }) {
  return <div className="text-sm text-ink-3 bg-surface-raised border border-border rounded-xl px-5 py-8">{label}</div>;
}
