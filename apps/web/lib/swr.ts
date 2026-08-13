import { mutate } from "swr";

// Revalidate every cached SWR key whose URL starts with one of the given
// prefixes. Used after a mutation so every hook reading that resource
// (e.g. the dashboard, the expenses list, and the nav badge all reading
// /api/transactions or /api/review) picks up the change from one call site,
// instead of each page tracking its own "refresh" flag.
export function revalidate(prefixes: string[]) {
  return mutate((key) => typeof key === "string" && prefixes.some((p) => key.startsWith(p)), undefined, {
    revalidate: true,
  });
}
