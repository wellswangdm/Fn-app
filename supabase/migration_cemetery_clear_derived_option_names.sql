-- ─────────────────────────────────────────────────────────────────────────────
-- CEMETERY — clear option names that were only copies of the property
--
-- Run once in the Supabase SQL Editor, only if you ran
-- migration_cemetery_backfill_option_labels.sql. Safe to re-run, and safe to
-- run if you did not.
--
-- An option is named after the property it is built around, worked out when
-- it is shown. An earlier migration copied that name into the quote, which
-- made it look like a name somebody had typed — so changing the property
-- would have left the old name behind.
--
-- This clears the copies. Names actually typed by an advisor are untouched,
-- and nothing on screen changes: an option with no stored name still shows
-- its property.
-- ─────────────────────────────────────────────────────────────────────────────

begin;

update cemetery.quotes q
   set version_label = null
 where not q.is_template
   and q.version_label is not null
   and (
     -- a copy of the property this option is built around
     q.version_label = (
       select qi.name from cemetery.quote_items qi
        where qi.quote_id = q.id and qi.section = 'Property'
          and qi.parent_item_id is null
        order by qi.sort_order limit 1)
     -- or the placeholder given to an option that had no property yet
     or q.version_label ~ '^Option [0-9]+$'
   );

commit;

-- ─── Check ───────────────────────────────────────────────────────────────────
-- `named_by_hand` should only count options an advisor actually renamed.
select count(*) filter (where version_label is not null) as named_by_hand,
       count(*) filter (where version_label is null)     as named_after_their_property,
       count(*)                                          as options
  from cemetery.quotes
 where not is_template;
