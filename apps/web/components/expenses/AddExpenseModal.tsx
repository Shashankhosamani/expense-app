"use client";

import { useState } from "react";
import { X, Store, CalendarClock } from "lucide-react";
import { useAddExpense } from "@/components/layout/AddExpenseContext";
import { useCategories } from "@/hooks/useCategories";
import { useCreateManualTransaction } from "@/hooks/useTransactions";
import { Button } from "@/components/ui/Button";
import { Field } from "@/components/ui/Field";
import { CurrencyInput } from "@/components/ui/CurrencyInput";
import { CategoryChipPicker } from "./CategoryChipPicker";

const PAYMENT_METHODS = ["UPI", "card", "cash", "netbanking"];

function nowLocalInputValue() {
  const d = new Date();
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
  return d.toISOString().slice(0, 16);
}

export function AddExpenseModal() {
  const { isOpen, close } = useAddExpense();
  const { categories } = useCategories();
  const createManualTransaction = useCreateManualTransaction();

  const [amount, setAmount] = useState("");
  const [direction, setDirection] = useState<"debit" | "credit">("debit");
  const [merchant, setMerchant] = useState("");
  const [categoryId, setCategoryId] = useState<string | undefined>();
  const [transactionAt, setTransactionAt] = useState(nowLocalInputValue());
  const [paymentMethod, setPaymentMethod] = useState("UPI");
  const [note, setNote] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  async function submit() {
    setError(null);
    const parsedAmount = Number(amount);
    if (!parsedAmount || parsedAmount <= 0) {
      setError("Enter an amount greater than zero.");
      return;
    }
    setSubmitting(true);
    try {
      await createManualTransaction({
        amount: parsedAmount,
        currency: "INR",
        type: direction,
        merchant: merchant || undefined,
        category_id: categoryId,
        transaction_at: new Date(transactionAt).toISOString(),
        payment_method: paymentMethod || undefined,
        note: note || undefined,
      });
      close();
      setAmount("");
      setMerchant("");
      setCategoryId(undefined);
      setNote("");
    } catch {
      setError("Could not save this expense. Try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center sm:pt-20 sm:px-4">
      <div className="hidden sm:block absolute inset-0 bg-navy/40" onClick={close} />
      <div className="relative w-full h-full sm:h-auto sm:max-w-[35rem] bg-surface-raised sm:rounded-2xl sm:border sm:border-border-4 overflow-hidden sm:max-h-[85vh] flex flex-col">
        <div className="px-6 py-5 border-b border-border-3 flex items-start justify-between">
          <div>
            <div className="text-[1.125rem] md:text-[1.375rem] font-medium text-ink">Add an expense</div>
            <div className="text-xs text-ink-3 mt-1">For cash and anything your bank did not text you about.</div>
          </div>
          <button onClick={close} className="text-ink-3 hover:text-ink cursor-pointer">
            <X size={19} />
          </button>
        </div>

        <div className="p-6 flex flex-col gap-5 overflow-y-auto">
          <div className="flex gap-4">
            <Field label="Amount" className="flex-[1.2] min-w-0">
              <CurrencyInput value={amount} onChange={setAmount} autoFocus emphasized />
            </Field>
            <Field label="Direction" className="flex-1 min-w-0">
              <div className="flex border border-border rounded-lg overflow-hidden min-h-[3.25rem] bg-surface">
                {(["debit", "credit"] as const).map((d) => (
                  <button
                    key={d}
                    onClick={() => setDirection(d)}
                    className={`flex-1 flex items-center justify-center text-center leading-tight px-1 py-2 text-[0.75rem] sm:text-[0.8125rem] font-medium cursor-pointer ${
                      direction === d ? "bg-navy text-white" : "text-ink-3"
                    }`}
                  >
                    {d === "debit" ? "Money out" : "Money in"}
                  </button>
                ))}
              </div>
            </Field>
          </div>

          <Field label="Merchant">
            <div className="flex items-center gap-2.5 bg-surface border border-border rounded-lg px-3.5 py-3">
              <Store size={17} className="text-ink-4" />
              <input
                value={merchant}
                onChange={(e) => setMerchant(e.target.value)}
                placeholder="Who did you pay?"
                className="flex-1 bg-transparent outline-none text-sm text-ink"
              />
            </div>
          </Field>

          <Field label="Category">
            <CategoryChipPicker categories={categories} value={categoryId} onChange={setCategoryId} />
          </Field>

          <div className="flex gap-4">
            <Field label="When" className="flex-1 min-w-0">
              <div className="flex items-center gap-2.5 min-w-0 bg-surface border border-border rounded-lg px-3.5 py-3">
                <CalendarClock size={17} className="text-ink-4 shrink-0" />
                <input
                  type="datetime-local"
                  value={transactionAt}
                  onChange={(e) => setTransactionAt(e.target.value)}
                  className="flex-1 min-w-0 bg-transparent outline-none text-sm text-ink"
                />
              </div>
            </Field>
            <Field label="Paid with" className="flex-1 min-w-0">
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="w-full bg-surface border border-border rounded-lg px-3.5 py-3 text-sm text-ink outline-none"
              >
                {PAYMENT_METHODS.map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
            </Field>
          </div>

          <Field label="Note" tag={<span className="normal-case tracking-normal text-ink-4">optional</span>}>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Anything you want to remember about this one"
              className="bg-surface border border-border rounded-lg px-3.5 py-3 text-sm text-ink outline-none min-h-[3.75rem] resize-none"
            />
          </Field>

          {error && <div className="text-sm text-brand-dark">{error}</div>}
        </div>

        <div className="px-6 py-4 border-t border-border-3 bg-[#F2FAFC] flex items-center gap-3">
          <span className="flex-1 text-[0.6875rem] text-ink-3 leading-snug">
            Checked the same way as an expense read from a message.
          </span>
          <Button variant="outline" onClick={close}>
            Cancel
          </Button>
          <Button variant="primary" onClick={submit} disabled={submitting}>
            {submitting ? "Saving…" : "Save Expense"}
          </Button>
        </div>
      </div>
    </div>
  );
}
