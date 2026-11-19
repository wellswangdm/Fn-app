-- ─────────────────────────────────────────────────────────────────────────────
-- CEMETERY — name the options saved before names were resolved
--
-- Run once in the Supabase SQL Editor. Safe to re-run.
--
-- An option's name is now resolved when it is saved, so every screen shows
-- the same thing. Options saved before that have version_label null, and each
-- screen was left to guess — the same option read as the client's name in the
-- list, "Option 1" in the builder and the property name in a comparison.
--
-- This fills in the name those screens should have agreed on: the property
-- the option is built around, or "Option N" if it has no property yet.
-- Options that already have a name are left alone.
-- ─────────────────────────────────────────────────────────────────────────────

begin;

with numbered as (
  select q.id,
         row_number() over (partition by coalesce(q.contact_id::text, q.id::text)
                            order by q.sort_order, q.created_at) as n
    from cemetery.quotes q
   where not q.is_template
     and coalesce(trim(q.version_label), '') = ''
),
resolved as (
  select nu.id,
         coalesce(
           nullif(trim((
             select qi.name
               from cemetery.quote_items qi
              where qi.quote_id = nu.id
                and qi.section = 'Property'
                and qi.parent_item_id is null
              order by qi.sort_order
              limit 1)), ''),
           'Option ' || nu.n) as label
    from numbered nu
)
update cemetery.quotes q
   set version_label = r.label
  from resolved r
 where q.id = r.id;

commit;

-- ─── Check ───────────────────────────────────────────────────────────────────
-- Expect 0 unnamed options.
select count(*) filter (where coalesce(trim(version_label), '') = '') as still_unnamed,
       count(*)                                                        as options
  from cemetery.quotes
 where not is_template;
