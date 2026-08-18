// Server-side pre-filter, ARCHITECTURE_2.md §5 layers 1-2. Distinct from the
// on-device Stage-0 classifier (§7, Android-only, financial/not-financial) —
// this looks for instruction-shaped content in messages that already passed
// that filter, and flags suspicious ones for PENDING_REVIEW (layer 5)
// regardless of what the downstream MCP parsing step decides.

const INSTRUCTION_PATTERNS = [
  /ignore (all |the |previous |prior )?(instructions?|prompts?)/i,
  /system prompt/i,
  /give me (all|access)/i,
  /access to (token|api key|credentials?)/i,
  /other users?/i,
  /you are (now|no longer)/i,
  /disregard (all |the |previous )?(instructions?|rules?)/i,
  /reveal (your|the) (prompt|instructions?|system)/i,
];

// §7 step 3's shortcode shape: DLT-registered senders are a plain 6-char
// alphanumeric code (e.g. "HDFCBK"), a legacy "XX-XXXXXX" prefixed form, or
// the current 3-segment form with a trailing category suffix — T/P/S/G for
// Transactional/Promotional/Service/Government — e.g. "AD-HDFCBK-S".
const SHORTCODE_SHAPE = /^([A-Z]{2}-)?[A-Z0-9]{2,6}(-[A-Z])?$/;

export interface SuspicionResult {
  suspicious: boolean;
  hold_reasons: string[];
}

export function assessSuspicion(sender: string, rawMessage: string): SuspicionResult {
  const reasons: string[] = [];

  if (INSTRUCTION_PATTERNS.some((p) => p.test(rawMessage))) {
    reasons.push("Message body contains instruction-shaped text.");
    reasons.push("Everything inside the message is treated as untrusted data, never as an instruction.");
    reasons.push("No tool exists that could act on a request like this even if it were obeyed.");
  }

  if (!SHORTCODE_SHAPE.test(sender.trim().toUpperCase())) {
    reasons.push(`Sender "${sender}" doesn't match a known bank shortcode format.`);
  }

  return { suspicious: reasons.length > 0, hold_reasons: reasons };
}
