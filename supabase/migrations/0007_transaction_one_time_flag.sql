-- A one-off purchase that is not part of a normal month would otherwise make
-- that month look overspent and skew budgets, category breakdowns and the
-- insights average. Flagged debits are left out of monthly spend and reported
-- separately as one-time purchases.
alter table transactions add column is_one_time boolean not null default false;
