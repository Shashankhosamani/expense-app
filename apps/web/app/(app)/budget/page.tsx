"use client";

import { useEffect, useState } from "react";
import type { NotifyChannels } from "@costiq/shared";
import { useBudget } from "@/hooks/useBudget";
import { Button } from "@/components/ui/Button";
import { Field } from "@/components/ui/Field";
import { CurrencyInput } from "@/components/ui/CurrencyInput";
import { Loading } from "@/components/ui/Loading";
import { AlertChannels } from "@/components/budget/AlertChannels";
import { BudgetProgressPanel } from "@/components/budget/BudgetProgressPanel";
import { formatINR, currentMonth } from "@/lib/format";

const PRESETS = [10000, 15000, 18000, 25000];
const DEFAULT_CHANNELS: NotifyChannels = { push: true, email: false, in_app: true };

export default function BudgetPage() {
  const month = currentMonth();
  const { budget, isLoading, save } = useBudget(month);

  const [limit, setLimit] = useState("18000");
  const [warningPct, setWarningPct] = useState(90);
  const [channels, setChannels] = useState<NotifyChannels>(DEFAULT_CHANNELS);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!budget) return;
    // Seeding editable form fields from freshly-loaded data, not syncing external state.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLimit(String(budget.limit_amount));
    setWarningPct(budget.warning_percentage);
    setChannels(budget.notify_channels);
  }, [budget?.id]); // eslint-disable-line react-hooks/exhaustive-deps -- reset only when the saved budget changes

  if (isLoading) return <Loading fullPage />;

  async function handleSave() {
    setSaving(true);
    try {
      await save({
        limit_amount: Number(limit),
        currency: "INR",
        warning_percentage: warningPct,
        notify_channels: channels,
      });
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="flex flex-col gap-5.5">
      <div className="flex flex-col gap-1.5">
        <h1 className="text-[1.875rem] font-medium tracking-tight">Budget</h1>
        <span className="text-[0.8125rem] text-ink-3">Plain arithmetic. Nothing here is guessed.</span>
      </div>

      <div className="flex flex-col lg:flex-row gap-5.5 items-start">
        <div className="flex-[1.25] flex flex-col gap-5.5 w-full">
          <div className="bg-surface-raised border border-border rounded-xl p-6.5 flex flex-col gap-6">
            <div className="flex flex-col sm:flex-row gap-4.5 sm:items-end">
              <Field label="How much per month" className="flex-1">
                <CurrencyInput value={limit} onChange={setLimit} emphasized className="py-3.5" />
              </Field>
              <div className="flex flex-wrap gap-2 sm:pb-1">
                {PRESETS.map((p) => (
                  <button
                    key={p}
                    onClick={() => setLimit(String(p))}
                    className="text-xs rounded-full px-3 py-2.5 border border-border bg-surface text-ink-2 cursor-pointer whitespace-nowrap"
                  >
                    {formatINR(p)}
                  </button>
                ))}
              </div>
            </div>

            <div className="border-t border-dashed border-border-2 pt-5.5 flex flex-col gap-4">
              <div className="flex items-baseline justify-between">
                <span className="text-[0.8125rem] text-ink-2">Warn me when I reach</span>
                <span className="text-[1.0625rem] font-medium">
                  {warningPct}% · {formatINR((Number(limit || 0) * warningPct) / 100)}
                </span>
              </div>
              <input
                type="range"
                min={50}
                max={100}
                value={warningPct}
                onChange={(e) => setWarningPct(Number(e.target.value))}
                className="w-full accent-brand"
              />
              <div className="flex justify-between text-[0.6875rem] text-ink-4">
                <span>50%</span>
                <span>75%</span>
                <span>90%</span>
                <span>100%</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex-1 w-full flex flex-col gap-5.5">
          <BudgetProgressPanel status={budget} />
        </div>
      </div>

      <div className="bg-surface-raised border border-border rounded-xl p-6.5 flex flex-col gap-4.5">
        <div className="flex flex-col gap-1">
          <span className="text-xl font-medium">Budget alerts</span>
          <span className="text-xs text-ink-3">
            Pick how you want to be warned when your spending gets close to the {warningPct}% threshold above.
          </span>
        </div>
        <AlertChannels channels={channels} onChange={setChannels} />
        <div className="flex items-center gap-3">
          <span className="flex-1" />
          <Button variant="primary" onClick={handleSave} disabled={saving}>
            {saving ? "Saving…" : "Save Budget"}
          </Button>
        </div>
      </div>
    </div>
  );
}
