"use client";

import { useParams, useRouter } from "next/navigation";
import { TransactionEditForm } from "@/components/expenses/TransactionEditForm";

export default function TransactionDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  return (
    <div className="max-w-[40rem] mx-auto flex flex-col">
      <div className="bg-surface-raised border border-border-4 rounded-2xl overflow-hidden flex flex-col">
        <TransactionEditForm id={id} onClose={() => router.push("/expenses")} />
      </div>
    </div>
  );
}
