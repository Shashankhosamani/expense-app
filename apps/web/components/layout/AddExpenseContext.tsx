"use client";

import { createContext, useContext, useState, type ReactNode } from "react";

interface AddExpenseContextValue {
  isOpen: boolean;
  open: () => void;
  close: () => void;
}

const AddExpenseContext = createContext<AddExpenseContextValue | null>(null);

export function AddExpenseProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <AddExpenseContext.Provider value={{ isOpen, open: () => setIsOpen(true), close: () => setIsOpen(false) }}>
      {children}
    </AddExpenseContext.Provider>
  );
}

export function useAddExpense() {
  const ctx = useContext(AddExpenseContext);
  if (!ctx) throw new Error("useAddExpense must be used within AddExpenseProvider");
  return ctx;
}
