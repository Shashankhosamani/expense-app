"use client";

import { useEffect, useState } from "react";
import { X, Trash2 } from "lucide-react";
import {
  useCorrectTransaction,
  useDeleteTransaction,
  useTransaction,
  useTransactionCorrections,
} from "@/hooks/useTransactions";
import { useCategories } from "@/hooks/useCategories";
import { Button } from "@/components/ui/Button";
import { Field } from "@/components/ui/Field";
import { CurrencyInput } from "@/components/ui/CurrencyInput";
import { Loading } from "@/components/ui/Loading";
import { TransactionDetailFields } from "@/components/expenses/TransactionDetailFields";
import { CorrectionHistory } from "@/components/expenses/CorrectionHistory";
import { formatDateTime } from "@/lib/format";

export function TransactionEditForm({ id, onClose }: { id: string; onClose: () => void }) {
  const { transaction } = useTransaction(id);
  const { corrections } = useTransactionCorrections(id);
  const { categories } = useCategories();
  const correctTransaction = useCorrectTransaction(id);
  const deleteTransaction = useDeleteTransaction();

  const [amount, setAmount] = useState("");
  const [categoryId, setCategoryId] = useState<string | undefined>();
  const [merchant, setMerchant] = useState("");
  const [isReimbursement, setIsReimbursement] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!transaction) return;
    // Seeding editable form fields from freshly-loaded data, not syncing external state.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setAmount(String(transaction.amount));
    setCategoryId(transaction.category_id ?? undefined);
    setMerchant(transaction.merchant ?? "");
    setIsReimbursement(transaction.is_reimbursement);
  }, [transaction?.id]); // eslint-disable-line react-hooks/exhaustive-deps -- reset only when switching transactions

  if (!transaction) return <Loading fullPage />;

  async function save() {
    setSaving(true);
    try {
      await correctTransaction({
        amount: Number(amount) !== transaction!.amount ? Number(amount) : undefined,
        category_id: categoryId !== transaction!.category_id ? categoryId ?? null : undefined,
        merchant: merchant !== (transaction!.merchant ?? "") ? merchant : undefined,
        is_reimbursement: isReimbursement !== transaction!.is_reimbursement ? isReimbursement : undefined,
      });
      onClose();
    } finally {
      setSaving(false);
    }
  }

  async function remove() {
    if (!confirm("Remove this expense?")) return;
    await deleteTransaction(id);
    onClose();
  }

  return (
    <>
      <div className="px-6.5 py-5.5 border-b border-border-3 flex items-start gap-3.5">
        <span className="w-1 h-9.5 rounded-sm bg-brand shrink-0" />
        <div className="flex-1 flex flex-col gap-1">
          <span className="text-[1.125rem] md:text-[1.375rem] font-medium">{transaction.merchant ?? "Unknown"}</span>
          <span className="text-[0.6875rem] text-ink-4">
            {formatDateTime(transaction.transaction_at)} ·{" "}
            {transaction.source === "sms" ? "read from a message" : "added by hand"}
          </span>
        </div>
        <button onClick={onClose} className="text-ink-3 hover:text-ink cursor-pointer">
          <X size={19} />
        </button>
      </div>

      <div className="p-6.5 flex flex-col gap-6 overflow-y-auto">
        <div className="flex gap-4">
          <Field label="Amount" className="flex-1 min-w-0">
            <CurrencyInput value={amount} onChange={setAmount} />
          </Field>
          <Field
            label="Category"
            className="flex-1 min-w-0"
            tag={
              categoryId !== (transaction.category_id ?? undefined) && (
                <span className="text-brand-dark normal-case">changed</span>
              )
            }
          >
            <select
              value={categoryId ?? ""}
              onChange={(e) => setCategoryId(e.target.value || undefined)}
              className="w-full bg-white border border-brand rounded-lg px-3.5 py-3.5 text-sm text-ink outline-none ring-3 ring-brand/15"
            >
              <option value="">Uncategorized</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </Field>
        </div>

        <Field label="Merchant">
          <input
            value={merchant}
            onChange={(e) => setMerchant(e.target.value)}
            className="bg-surface border border-border rounded-lg px-3.5 py-3 text-sm text-ink outline-none"
          />
        </Field>

        {transaction.type === "credit" && (
          <Field
            label="Reimbursement"
            tag={<span className="normal-case text-ink-4">money paid back to you — not salary or other income</span>}
          >
            <label className="flex items-center gap-2.5 text-sm text-ink">
              <input type="checkbox" checked={isReimbursement} onChange={(e) => setIsReimbursement(e.target.checked)} />
              Pays me back for something I already spent — subtract it from my expenses
            </label>
          </Field>
        )}

        <TransactionDetailFields transaction={transaction} />
        <CorrectionHistory corrections={corrections} />
      </div>

      <div className="px-6.5 py-4.5 border-t border-border-3 bg-[#F2FAFC] flex items-center gap-2.5">
        <Button variant="danger" onClick={remove}>
          <Trash2 size={15} />
          Remove
        </Button>
        <span className="flex-1" />
        <Button variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button variant="primary" onClick={save} disabled={saving}>
          {saving ? "Saving…" : "Save changes"}
        </Button>
      </div>
    </>
  );
}
