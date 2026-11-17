-- ─────────────────────────────────────────────────────────────────────────────
-- CEMETERY — options within a family, and usable templates
--
-- Run once in the Supabase SQL editor. Safe to re-run.
--
-- Brings the cemetery portal in line with how the funeral portal already
-- works: a family (contact) owns several OPTIONS of the same quote, and you
-- compare the options against each other — not against other families'
-- quotes.
--
--   contact_id     groups the options belonging to one family. Already on the
--                  table; now indexed and actually used. When shared
--                  customers arrive this becomes the customer reference with
--                  no structural change.
--   version_label  what an option is called — the heading above its column in
--                  a comparison. Defaults to the property on the quote and
--                  can be edited.
--   sort_order     the order options appear in.
-- ─────────────────────────────────────────────────────────────────────────────

begin;

alter table cemetery.quotes
  add column if not exists version_label text,
  add column if not exists sort_order    int not null default 0;

create index if not exists quotes_contact_idx
  on cemetery.quotes (contact_id, sort_order);

-- Existing quotes each become a family of one, so nothing is orphaned and
-- every quote can gain options from here on.
update cemetery.quotes
   set contact_id = gen_random_uuid()
 where contact_id is null
   and is_template = false;

commit;

-- ─── Check ───────────────────────────────────────────────────────────────────
-- Expect: no quote without a family, and templates left alone.
select
  count(*) filter (where not is_template and contact_id is null) as quotes_without_family,
  count(*) filter (where not is_template)                        as quotes,
  count(distinct contact_id) filter (where not is_template)      as families,
  count(*) filter (where is_template)                            as templates
from cemetery.quotes;
