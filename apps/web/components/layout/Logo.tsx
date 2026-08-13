export function LogoMark({ size = 28 }: { size?: number }) {
  return (
    <span
      className="rounded-lg bg-surface-raised flex items-center justify-center shrink-0 shadow-[inset_0_0_0_1px_var(--color-border-3)]"
      style={{ width: size, height: size }}
    >
      <svg width={size * 0.7} height={size * 0.7} viewBox="0 0 100 100">
        <circle cx="50" cy="50" r="32" fill="none" stroke="#C2EDDA" strokeWidth="16" />
        <circle
          cx="50"
          cy="50"
          r="32"
          fill="none"
          stroke="#F43A09"
          strokeWidth="16"
          strokeDasharray="128.68 201.06"
          strokeLinecap="round"
          transform="rotate(65 50 50)"
        />
        <circle cx="50" cy="50" r="8" fill="#23935C" />
      </svg>
    </span>
  );
}

export function Logo({ size = 28, textClassName = "text-[19px]" }: { size?: number; textClassName?: string }) {
  return (
    <div className="flex items-center gap-2.5">
      <LogoMark size={size} />
      <span className={`font-medium text-ink ${textClassName}`}>Costiq</span>
    </div>
  );
}
