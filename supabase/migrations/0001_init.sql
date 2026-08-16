-- Costiq initial schema. Mirrors ARCHITECTURE_2.md §10 exactly.

create extension if not exists "pgcrypto";

create table profiles (
  id                    uuid primary key references auth.users(id) on delete cascade,
  mcp_token_hash        text,
  mcp_token_issued_at   timestamptz,
  mcp_token_revoked_at  timestamptz,
  mcp_token_last_used_at timestamptz,
  created_at            timestamptz not null default now()
);

create table sms_messages (
  id                      uuid primary key default gen_random_uuid(),
  user_id                 uuid not null references auth.users(id),
  sender                  text not null,
  message_hash            text not null,
  raw_message_encrypted   bytea not null,
  encryption_key_version  int not null default 1,
  status                  text not null default 'PENDING'
    check (status in ('PENDING','PROCESSING','PROCESSED','FAILED','PENDING_REVIEW','NOT_A_TRANSACTION')),
  suspicious              boolean not null default false,
  -- hold_reasons/extracted: additions beyond the literal §10 schema, needed to
  -- render the "why it's here" / "what was read from it" panels on S4 (Review).
  -- Populated by the future MCP/parsing pipeline; seeded manually for now.
  hold_reasons            text[] not null default '{}',
  extracted               jsonb,
  received_at             timestamptz not null,
  processed_at            timestamptz,
  created_at              timestamptz not null default now(),
  unique (user_id, message_hash)
);
create index sms_messages_user_status_idx on sms_messages (user_id, status);

create table categories (
  id    uuid primary key default gen_random_uuid(),
  name  text not null unique
);
insert into categories (name) values
  ('Food'), ('Shopping'), ('Travel'), ('Bills'),
  ('Subscriptions'), ('Entertainment'), ('Health'), ('Other');

create table transactions (
  id             uuid primary key default gen_random_uuid(),
  user_id        uuid not null references auth.users(id),
  sms_id         uuid references sms_messages(id),
  amount         numeric(12,2) not null check (amount > 0),
  currency       text not null default 'INR',
  type           text not null check (type in ('debit','credit')),
  merchant       text,
  category_id    uuid references categories(id),
  bank           text,
  account_last4  text,
  payment_method text,
  transaction_at timestamptz not null,
  reference_id   text,
  source         text not null default 'sms' check (source in ('sms','manual')),
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now(),
  deleted_at     timestamptz,
  unique (user_id, sms_id)
);
create index transactions_user_txat_idx on transactions (user_id, transaction_at);
create index transactions_user_category_idx on transactions (user_id, category_id);

create table transaction_corrections (
  id              uuid primary key default gen_random_uuid(),
  transaction_id  uuid not null references transactions(id),
  field_name      text not null,
  old_value       text,
  new_value       text,
  corrected_at    timestamptz not null default now()
);
create index transaction_corrections_txn_idx on transaction_corrections (transaction_id);

create table budgets (
  id                  uuid primary key default gen_random_uuid(),
  user_id             uuid not null references auth.users(id),
  month               date not null,
  limit_amount        numeric(12,2) not null,
  currency            text not null default 'INR',
  warning_percentage  int not null default 90,
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now(),
  deleted_at          timestamptz,
  unique (user_id, month)
);
