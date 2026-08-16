"use client";

import { useRouter } from "next/navigation";
import { TransactionEditForm } from "./TransactionEditForm";

export function TransactionSidePanel({ id }: { id: string }) {
  const router = useRouter();
  const close = () => router.back();

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-navy/40" onClick={close} />
      <div className="relative w-full sm:w-[32.5rem] sm:max-w-[90vw] h-full bg-surface-raised sm:border-l sm:border-border-4 flex flex-col">
        <TransactionEditForm id={id} onClose={close} />
      </div>
    </div>
  );
}
