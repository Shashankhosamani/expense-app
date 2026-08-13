import Link from "next/link";
import { ShieldAlert } from "lucide-react";

export function ReviewBanner({ count }: { count: number }) {
  if (count === 0) return null;

  return (
    <div className="flex items-center gap-3 bg-brand-tint border border-brand-tint-border rounded-[10px] px-4 py-3.5">
      <ShieldAlert size={19} className="text-brand-dark" />
      <span className="flex-1 text-[13px] leading-5 text-ink-2">
        <strong className="font-semibold">
          {count} message{count === 1 ? "" : "s"} waiting for you.
        </strong>{" "}
        Nothing has been added to your expenses from them yet.
      </span>
      <Link
        href="/review"
        className="text-xs font-semibold text-brand-dark border border-[#F3BCA9] rounded-lg px-3 py-2 bg-[#FEF4F0]"
      >
        Open Review
      </Link>
    </div>
  );
}
