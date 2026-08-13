import { useMemo } from "react";
import type { NotifyChannels } from "@costiq/shared";
import { getIcon } from "@/lib/icon";
import { ToggleSwitch } from "@/components/ui/ToggleSwitch";

const ALERT_ROWS: { key: keyof NotifyChannels; icon: string; label: string; sub: string }[] = [
  { key: "push", icon: "Smartphone", label: "Push notification", sub: "Android, the moment you cross the threshold" },
  { key: "in_app", icon: "Bell", label: "In-app banner", sub: "Shown on the dashboard until dismissed" },
  { key: "email", icon: "Mail", label: "Email", sub: "Sent once per month, at threshold" },
];

function AlertChannelRow({
  icon,
  label,
  sub,
  on,
  onToggle,
}: {
  icon: string;
  label: string;
  sub: string;
  on: boolean;
  onToggle: () => void;
}) {
  // getIcon returns a stable reference from a static map — safe despite the lint heuristic.
  const Icon = useMemo(() => getIcon(icon), [icon]);
  return (
    <div className="flex items-center gap-3.5 pb-4 border-b border-border-3">
      {/* eslint-disable-next-line react-hooks/static-components -- see comment above */}
      <Icon size={18} className="text-ink-3" />
      <span className="flex-1 flex flex-col gap-0.5">
        <span className="text-sm text-ink">{label}</span>
        <span className="text-[11px] text-ink-4">{sub}</span>
      </span>
      <ToggleSwitch on={on} onChange={onToggle} />
    </div>
  );
}

export function AlertChannels({
  channels,
  onChange,
}: {
  channels: NotifyChannels;
  onChange: (channels: NotifyChannels) => void;
}) {
  return (
    <>
      {ALERT_ROWS.map((row) => (
        <AlertChannelRow
          key={row.key}
          icon={row.icon}
          label={row.label}
          sub={row.sub}
          on={channels[row.key]}
          onToggle={() => onChange({ ...channels, [row.key]: !channels[row.key] })}
        />
      ))}
    </>
  );
}
