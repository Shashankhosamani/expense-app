"use client";

import { useParams } from "next/navigation";
import { TransactionSidePanel } from "@/components/expenses/TransactionSidePanel";

export default function InterceptedTransactionPanel() {
  const { id } = useParams<{ id: string }>();
  return <TransactionSidePanel id={id} />;
}
