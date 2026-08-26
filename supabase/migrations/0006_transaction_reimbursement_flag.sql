-- Not every credit transaction offsets expenditure — salary is a credit but
-- must not reduce total_spent. Money paid back to you (a merchant refund, a
-- friend settling a group bill you fronted) is marked explicitly.
alter table transactions add column is_reimbursement boolean not null default false;
