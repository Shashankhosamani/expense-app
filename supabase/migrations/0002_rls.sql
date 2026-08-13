-- RLS on every user-scoped table, per ARCHITECTURE_2.md §10/§14.
-- The Worker uses the Supabase service-role key (bypasses RLS) after
-- resolving user_id from a verified JWT server-side; RLS is the last-resort
-- guarantee if a client ever queries Postgres directly (e.g. future direct
-- Supabase client usage from the dashboard).

alter table profiles enable row level security;
alter table sms_messages enable row level security;
alter table transactions enable row level security;
alter table transaction_corrections enable row level security;
alter table budgets enable row level security;

create policy profiles_self on profiles
  for all using (auth.uid() = id) with check (auth.uid() = id);

create policy sms_messages_self on sms_messages
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy transactions_self on transactions
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy transaction_corrections_self on transaction_corrections
  for all using (
    exists (
      select 1 from transactions t
      where t.id = transaction_corrections.transaction_id
        and t.user_id = auth.uid()
    )
  );

create policy budgets_self on budgets
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- categories is a shared reference table, readable by any authenticated user.
alter table categories enable row level security;
create policy categories_read on categories
  for select using (auth.role() = 'authenticated');
