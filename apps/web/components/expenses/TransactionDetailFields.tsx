import type { Transaction } from "@costiq/shared";

export function TransactionDetailFields({ transaction: t }: { transaction: Transaction }) {
  const rows: [string, string][] = [
    ["Bank", t.bank ?? "—"],
    ["Account", t.account_last4 ? `••${t.account_last4}` : "—"],
    ["Payment method", t.payment_method ?? "—"],
    ["Reference", t.reference_id ?? "—"],
    ["Source", t.source],
  ];

  return (
    <div className="flex flex-col gap-2.5">
      <span className="text-[0.625rem] font-semibold uppercase tracking-wider text-ink-4">Straight from the message</span>
      <div className="flex flex-col">
        {rows.map(([k, v]) => (
          <div key={k} className="flex items-center gap-3.5 py-2.5 border-b border-border-3">
            <span className="w-30 text-[0.6875rem] text-ink-4">{k}</span>
            <span className="flex-1 text-xs text-ink">{v}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
