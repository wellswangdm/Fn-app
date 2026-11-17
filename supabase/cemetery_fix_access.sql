-- ─────────────────────────────────────────────────────────────────────────────
-- CEMETERY — make the schema reachable, and lock it down
--
-- Run this ONCE in the Supabase SQL editor, after cemetery_schema.sql and
-- cemetery_seed_6800.sql. Safe to re-run. No dashboard clicking needed.
--
-- Does two things:
--
--   1. Tells the API to serve the `cemetery` schema. Creating a schema and
--      serving it over the API are separate settings in Postgres; this sets
--      the second one. ("public" below is the NAME of the schema your funeral
--      tables already live in — it is not a visibility setting, and nothing
--      here makes any data public.)
--
--   2. Removes the unauthenticated role's leftover table grants, so cemetery
--      data is protected by two independent controls instead of one.
-- ─────────────────────────────────────────────────────────────────────────────

-- ─── 1. Serve the schema over the API ────────────────────────────────────────
-- Appends `cemetery` to whatever is already served, rather than assuming the
-- list, so nothing already working gets dropped.
do $$
declare current_list text;
begin
  select coalesce(
           (select setting from pg_catalog.pg_db_role_setting s
              join pg_roles r on r.oid = s.setrole
              cross join lateral unnest(s.setconfig) as setting
            where r.rolname = 'authenticator' and setting like 'pgrst.db_schemas=%'
            limit 1),
           'pgrst.db_schemas=public, graphql_public')
    into current_list;

  current_list := split_part(current_list, '=', 2);

  if current_list not like '%cemetery%' then
    execute format('alter role authenticator set pgrst.db_schemas = %L',
                   current_list || ', cemetery');
  end if;
end $$;

-- ─── 2. Unauthenticated requests get nothing ─────────────────────────────────
-- Row Level Security already blocked them (every cemetery read policy is
-- written `to authenticated`), but the table grant was doing no work and left
-- the data resting on a single control. Now a request with no signed-in user
-- is refused at the SQL permission layer as well.
revoke all on all tables    in schema cemetery from anon;
revoke all on all sequences in schema cemetery from anon;
revoke all on all functions in schema cemetery from anon;
alter default privileges in schema cemetery revoke select on tables from anon;

-- `usage` on the schema itself stays: without it the API cannot resolve the
-- schema at all, including for signed-in users. It grants no table access.
grant usage on schema cemetery to anon;

-- ─── 3. Reload the API ───────────────────────────────────────────────────────
notify pgrst, 'reload config';
notify pgrst, 'reload schema';

-- ─── Check it worked ─────────────────────────────────────────────────────────
-- Expect: served = true, and anon_grants = 0.
select
  (select setting like '%cemetery%'
     from pg_catalog.pg_db_role_setting s
     join pg_roles r on r.oid = s.setrole
     cross join lateral unnest(s.setconfig) as setting
    where r.rolname = 'authenticator' and setting like 'pgrst.db_schemas=%'
    limit 1)                                                    as served,
  (select count(*) from information_schema.role_table_grants
    where table_schema = 'cemetery' and grantee = 'anon')       as anon_grants;
