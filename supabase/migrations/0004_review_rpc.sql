-- Demo-only decrypt RPC for the review queue. Real per-user key derivation
-- (§6: HKDF(MASTER_KEY, user_id), decrypt only inside the Worker) is deferred
-- along with the rest of the SMS/MCP pipeline; this uses one placeholder key
-- passed in from the Worker's env so seeded review rows are readable.

create or replace function review_queue(p_user_id uuid, p_key text)
returns table (
  id uuid,
  sender text,
  raw_message text,
  suspicious boolean,
  status text,
  hold_reasons text[],
  extracted jsonb,
  received_at timestamptz
)
language sql
security definer
set search_path = public, extensions
as $$
  select
    id, sender,
    pgp_sym_decrypt(raw_message_encrypted, p_key) as raw_message,
    suspicious, status, hold_reasons, extracted, received_at
  from sms_messages
  where user_id = p_user_id
    and status = 'PENDING_REVIEW'
  order by received_at desc;
$$;
