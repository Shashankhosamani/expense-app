export function ToggleSwitch({ on, onChange }: { on: boolean; onChange: () => void }) {
  return (
    <button
      onClick={onChange}
      className="w-10 h-5.5 rounded-full flex items-center px-0.5 cursor-pointer transition-colors"
      style={{
        background: on ? "var(--color-brand)" : "var(--color-border-2)",
        justifyContent: on ? "flex-end" : "flex-start",
      }}
    >
      <span className="w-4.5 h-4.5 rounded-full bg-white" />
    </button>
  );
}
