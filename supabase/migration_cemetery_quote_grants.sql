-- ─────────────────────────────────────────────────────────────────────────────
-- CEMETERY — let signed-in advisors write their own quotes
--
-- Run once in the Supabase SQL editor. Safe to re-run.
--
-- Fixes: "permission denied for table quotes" when saving.
--
-- cemetery_schema.sql granted only SELECT to `authenticated`, which is right
-- for the catalogue but wrong for quotes. Row Level Security was already
-- correct — the policy allows an advisor to work with rows where
-- user_id = auth.uid() — but RLS only decides WHICH ROWS a statement may
-- touch. Postgres still checks the table privilege first, so INSERT was
-- refused before any policy was consulted.
--
-- After this runs:
--   catalogue (parks, properties, products, services, prices)
--       authenticated → SELECT only. Price changes stay in SQL, as on the
--       funeral side, so nothing in the browser can rewrite a price list.
--   quotes, quote_items
--       authenticated → SELECT, INSERT, UPDATE, DELETE, still filtered by
--       RLS to that advisor's own rows.
--   anon → unchanged (no access to anything in this schema).
-- ─────────────────────────────────────────────────────────────────────────────

begin;

grant select, insert, update, delete on cemetery.quotes      to authenticated;
grant select, insert, update, delete on cemetery.quote_items to authenticated;

-- While we're here: the original schema also granted SELECT to `anon`, the
-- role used for requests with no signed-in user. RLS already returned them
-- zero rows — every cemetery read policy is written `to authenticated` — so
-- this was never an open door, but the grant did no work and left the data
-- resting on a single control. Removing it means an unauthenticated request
-- is refused at the privilege layer as well.
revoke all on all tables    in schema cemetery from anon;
revoke all on all sequences in schema cemetery from anon;
revoke all on all functions in schema cemetery from anon;
alter default privileges in schema cemetery revoke select on tables from anon;

-- `usage` on the schema itself stays: without it the API cannot resolve the
-- schema at all, including for signed-in users. It grants no table access.
grant usage on schema cemetery to anon;

-- Both tables key on gen_random_uuid(), so there are no sequences to grant.
-- This loop is here so the grant still holds if an identity column is ever
-- added to either table.
do $$
declare s record;
begin
  for s in
    select sequence_schema, sequence_name
      from information_schema.sequences
     where sequence_schema = 'cemetery'
  loop
    execute format('grant usage, select on sequence %I.%I to authenticated',
                   s.sequence_schema, s.sequence_name);
  end loop;
end $$;

commit;

-- ─── Check ───────────────────────────────────────────────────────────────────
-- Expect: quotes and quote_items each list DELETE, INSERT, SELECT, UPDATE;
-- every other cemetery table lists SELECT only; and anon appears nowhere.
select grantee,
       table_name,
       string_agg(privilege_type, ', ' order by privilege_type) as can
  from information_schema.role_table_grants
 where table_schema = 'cemetery'
   and grantee in ('authenticated', 'anon')
 group by grantee, table_name
 order by grantee,
          (table_name in ('quotes', 'quote_items')) desc,
          table_name;
