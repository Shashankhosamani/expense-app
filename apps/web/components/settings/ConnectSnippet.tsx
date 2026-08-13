export function ConnectSnippet({ rawToken }: { rawToken: string | null }) {
  return (
    <div className="bg-surface-raised border border-border rounded-xl p-6.5 flex flex-col gap-4.5">
      <div className="flex flex-col gap-1">
        <span className="text-xl font-medium">Connect Claude</span>
        <span className="text-xs text-ink-3">
          Paste this into your Claude configuration, then ask it to sort your pending expenses.
        </span>
      </div>
      <pre className="bg-navy-2 rounded-[10px] p-5 text-xs leading-[22px] text-[#C6DDE6] overflow-x-auto whitespace-pre">
        {`{
  "mcpServers": {
    "costiq": {
      "url": "${process.env.NEXT_PUBLIC_API_URL ?? "https://api.costiq.app"}/mcp",
      "headers": {
        "Authorization": "Bearer ${rawToken ?? "kh_live_…"}"
      }
    }
  }
}`}
      </pre>
      <span className="text-xs text-ink-3">
        The MCP endpoint itself isn&apos;t live yet — this key is ready for it once the parsing pipeline ships.
      </span>
    </div>
  );
}
