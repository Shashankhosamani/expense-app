-- Additions beyond the literal §10 schema, needed by the imported screens.
-- Called out explicitly per the implementation plan rather than silently
-- extending the architecture doc's schema.

-- S5 "Add an expense" has an optional free-text note field.
alter table transactions add column note text;

-- S6 Budget has per-channel alert toggles (push/email/in-app).
alter table budgets add column notify_channels jsonb not null default '{"push": true, "email": false, "in_app": true}'::jsonb;
