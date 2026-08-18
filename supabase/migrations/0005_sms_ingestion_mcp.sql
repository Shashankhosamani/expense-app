-- Phase 1/2 (ARCHITECTURE_2.md §15/§17): SMS ingestion + MCP tool group.
--
-- Encryption: per-user derived keys per §6 (userKey = HKDF(SMS_MASTER_KEY,
-- user_id), computed in apps/worker/src/smsCrypto.ts — the master key never
-- touches Supabase, only the derived hex string is passed as p_key here).
-- The one pre-existing seeded review row was encrypted with the old flat
-- SMS_DEMO_DECRYPT_KEY passphrase before this migration; run
-- `pnpm --filter @costiq/worker reencrypt-demo-sms` once after applying
-- this migration to move it onto the real per-user key (see
-- reencrypt_sms_message below and scripts/reencrypt-demo-sms.ts).

-- profiles.mcp_token_last_used_at — services/mcpToken.ts already reads this
-- column but no migration ever added it; MCP tool calls will now set it.
alter table profiles add column if not exists mcp_token_last_used_at timestamptz;

-- Ingestion write path. ON CONFLICT on the existing UNIQUE(user_id,
-- message_hash) makes retried uploads (Android's WorkManager retry) safe:
-- a duplicate submit is a no-op, and the function still returns the
-- original row's id/status either way.
create or replace function insert_sms_message(
  p_user_id uuid,
  p_sender text,
  p_message_hash text,
  p_raw_message text,
  p_key text,
  p_received_at timestamptz,
  p_suspicious boolean,
  p_hold_reasons text[]
)
returns table (id uuid, status text)
language plpgsql
security definer
set search_path = public, extensions
as $$
begin
  insert into sms_messages
    (user_id, sender, message_hash, raw_message_encrypted, suspicious, hold_reasons, received_at)
  values (
    p_user_id, p_sender, p_message_hash,
    pgp_sym_encrypt(p_raw_message, p_key),
    p_suspicious, p_hold_reasons, p_received_at
  )
  on conflict (user_id, message_hash) do nothing;

  return query
    select sms_messages.id, sms_messages.status
    from sms_messages
    where sms_messages.user_id = p_user_id
      and sms_messages.message_hash = p_message_hash;
end;
$$;

-- MCP get_pending_sms() read path — oldest first (FIFO), decrypted only
-- inside this call, same pattern as review_queue().
create or replace function pending_sms(p_user_id uuid, p_key text, p_limit int default 20)
returns table (
  id uuid,
  sender text,
  raw_message text,
  received_at timestamptz
)
language sql
security definer
set search_path = public, extensions
as $$
  select
    id, sender,
    pgp_sym_decrypt(raw_message_encrypted, p_key) as raw_message,
    received_at
  from sms_messages
  where user_id = p_user_id
    and status = 'PENDING'
  order by received_at asc
  limit p_limit;
$$;

-- One-off migration helper: moves a row encrypted under an old passphrase
-- onto a new one, without ever exposing the plaintext outside this
-- transaction. Used by scripts/reencrypt-demo-sms.ts for the seeded demo
-- row; not called anywhere in the live request path.
create or replace function reencrypt_sms_message(p_id uuid, p_user_id uuid, p_old_key text, p_new_key text)
returns void
language plpgsql
security definer
set search_path = public, extensions
as $$
begin
  update sms_messages
  set raw_message_encrypted = pgp_sym_encrypt(pgp_sym_decrypt(raw_message_encrypted, p_old_key), p_new_key)
  where id = p_id and user_id = p_user_id;
end;
$$;
