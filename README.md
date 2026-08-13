# Costiq

Bank SMS in, categorized expenses out. See `ARCHITECTURE_2.md` for the full
system design and `.claude` plan history for what's been built so far.

This pass implements **web dashboard + backend only** (Android and the
MCP/SMS-parsing pipeline are deferred — see the plan for details).

## Layout

```
apps/web     Next.js 16 dashboard + landing page
apps/worker  Cloudflare Worker (Hono) — REST API
packages/shared  Zod schemas / types shared by both
supabase/    SQL migrations + seed data
```

## Getting it running

1. **Supabase** — create a project, then follow `supabase/README.md` to push
   migrations and seed demo data.
2. **Worker** — copy real values into `apps/worker` env (`SUPABASE_URL`,
   `SUPABASE_SERVICE_ROLE_KEY`, `SUPABASE_JWT_SECRET`, `SMS_DEMO_DECRYPT_KEY`)
   via `wrangler secret put <NAME>` for deploys, or a local `.dev.vars` file
   for `wrangler dev`. Then:
   ```bash
   pnpm dev:worker   # http://localhost:8787
   ```
3. **Web** — copy `apps/web/.env.local.example` to `apps/web/.env.local` and
   fill in `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY` (same
   project as step 1). Then:
   ```bash
   pnpm dev:web      # http://localhost:3000
   ```

Without step 1–2 configured, the landing page and sign-in screen still render
(verified), but every authenticated route needs a real Supabase session and a
reachable Worker to show data.

## Commands

```bash
pnpm build       # build all packages
pnpm typecheck   # typecheck all packages
pnpm lint        # lint apps/web
pnpm seed        # seed demo transactions (apps/worker/scripts/seed.ts)
```
