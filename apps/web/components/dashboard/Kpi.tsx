import { useMemo } from "react";
import { Card } from "@/components/ui/Card";
import { getIcon } from "@/lib/icon";

interface KpiProps {
  label: string;
  value: string;
  icon: string;
  color: string;
  sub: string;
}

export function Kpi({ label, value, icon, color, sub }: KpiProps) {
  // getIcon looks up a stable reference in a static map — safe despite the lint heuristic.
  const Icon = useMemo(() => getIcon(icon), [icon]);
  return (
    <Card className="p-4.5 flex flex-col justify-between gap-4">
      <div className="flex items-start justify-between gap-2">
        <span className="text-[0.625rem] font-semibold uppercase tracking-wider text-ink-3 max-w-[6.5rem] leading-[0.9375rem]">
          {label}
        </span>
        {/* eslint-disable-next-line react-hooks/static-components -- getIcon returns a stable reference from a static map */}
        <Icon size={17} style={{ color }} />
      </div>
      <div className="flex flex-col gap-1">
        <span className="text-[1.625rem] font-medium tracking-tight tabular-nums truncate">{value}</span>
        <span className="text-xs text-ink-3">{sub}</span>
      </div>
    </Card>
  );
}
