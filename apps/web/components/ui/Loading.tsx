export function Loading({ label = "Loading…" }: { label?: string }) {
  return <div className="text-sm text-ink-3">{label}</div>;
}

export function EmptyState({ label }: { label: string }) {
  return <div className="text-sm text-ink-3 bg-surface-raised border border-border rounded-xl px-5 py-8">{label}</div>;
}
