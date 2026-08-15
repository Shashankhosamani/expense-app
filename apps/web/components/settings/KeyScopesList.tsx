import { useMemo } from "react";
import { getIcon } from "@/lib/icon";

const SCOPES = [
  { icon: "MessageSquare", color: "var(--color-success)", text: "Read messages waiting to be processed on your account" },
  { icon: "PlusCircle", color: "var(--color-success)", text: "Save a new expense after reading a message" },
  { icon: "ShieldAlert", color: "var(--color-warn)", text: "Flag a message as suspicious for manual review" },
  { icon: "XCircle", color: "var(--color-ink-3)", text: "Cannot read, edit, or delete anyone else's data" },
  { icon: "Ban", color: "var(--color-ink-3)", text: "Cannot run arbitrary SQL or database commands" },
  { icon: "Lock", color: "var(--color-ink-3)", text: "Cannot change your budget, category, or account settings" },
];

function ScopeRow({ icon, color, text }: { icon: string; color: string; text: string }) {
  // getIcon returns a stable reference from a static map — safe despite the lint heuristic.
  const Icon = useMemo(() => getIcon(icon), [icon]);
  return (
    <div className="flex items-start gap-3">
      {/* eslint-disable-next-line react-hooks/static-components -- see comment above */}
      <Icon size={16} style={{ color }} className="mt-0.5 shrink-0" />
      <span className="text-[0.8125rem] leading-5 text-ink-2">{text}</span>
    </div>
  );
}

export function KeyScopesList() {
  return (
    <div className="bg-surface-raised border border-border rounded-xl p-6.5 flex flex-col gap-4.5">
      <span className="text-xl font-medium">What this key allows</span>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-4">
        {SCOPES.map((s) => (
          <ScopeRow key={s.text} icon={s.icon} color={s.color} text={s.text} />
        ))}
      </div>
    </div>
  );
}
