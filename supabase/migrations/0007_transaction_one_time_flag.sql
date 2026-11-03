-- A big purchase that is not part of a normal month (laptop, appliance, a
-- surprise repair) would otherwise make that month look overspent and skew
-- budgets, category breakdowns and the insights average. Flagged debits are
-- left out of monthly spend and reported separately as "big purchases".
alter table transactions add column is_one_time boolean not null default false;
