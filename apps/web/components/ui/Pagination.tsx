import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  page: number;
  limit: number;
  total: number;
  onPageChange: (page: number) => void;
}

export function Pagination({ page, limit, total, onPageChange }: PaginationProps) {
  const totalPages = Math.max(1, Math.ceil(total / limit));
  const shownFrom = total === 0 ? 0 : (page - 1) * limit + 1;
  const shownTo = Math.min(total, (page - 1) * limit + limit);

  return (
    <div className="flex items-center justify-between px-5 py-3.5 border-t border-border-2 bg-[#EEF6F8]">
      <span className="text-xs text-ink-3">
        Showing {shownFrom}–{shownTo} of {total}
      </span>
      <div className="flex items-center gap-1.5">
        <button
          onClick={() => onPageChange(Math.max(1, page - 1))}
          disabled={page <= 1}
          className="w-7.5 h-7.5 rounded-lg border border-border-2 flex items-center justify-center text-ink-2 disabled:text-border-2 cursor-pointer"
        >
          <ChevronLeft size={15} />
        </button>
        <span className="text-xs text-ink-2 px-2">
          {page} / {totalPages}
        </span>
        <button
          onClick={() => onPageChange(Math.min(totalPages, page + 1))}
          disabled={page >= totalPages}
          className="w-7.5 h-7.5 rounded-lg border border-border-2 flex items-center justify-center text-ink-2 disabled:text-border-2 cursor-pointer"
        >
          <ChevronRight size={15} />
        </button>
      </div>
    </div>
  );
}
