# Supabase — Costiq

Schema matches `ARCHITECTURE_2.md` §10, plus two additions called out in the
implementation plan (`0003_ui_additions.sql`): `transactions.note` and
`budgets.notify_channels`.

## Local dev

```bash
brew install supabase/tap/supabase   # if not already installed
supabase init                        # only if supabase/config.toml is missing
supabase start
supabase db push                     # applies migrations/*.sql in order
```

Create a user via Supabase Studio (or `supabase auth`), then seed demo data:

```bash
psql "$(supabase status -o env | grep DB_URL | cut -d= -f2)" \
  -v user_id="'<the-user-uuid>'" \
  -f supabase/seed.sql
```

## Production

Create a project at supabase.com, then:

```bash
supabase link --project-ref <ref>
supabase db push
```

Set `SUPABASE_SERVICE_ROLE_KEY` as a Worker secret (`wrangler secret put`,
never in `wrangler.toml`; `SUPABASE_URL` is non-secret and lives in
`wrangler.toml`), and `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY`
in the web app's environment. No JWT secret is needed — the Worker verifies
tokens via `supabase.auth.getUser()`, which works with this project's
asymmetric (JWKS-based) signing keys.

## Deferred (not built in this pass)

- Real per-user SMS encryption (§6: `HKDF(MASTER_KEY, user_id)`, decrypt only
  inside the Worker at `get_pending_sms()` time). The seed script uses a single
  placeholder `pgp_sym_encrypt` key for demo rows only.
- Any row written by the SMS ingestion pipeline or MCP tools — those land once
  Android/MCP phases are built.
