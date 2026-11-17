-- ─────────────────────────────────────────────────────────────────────────────
-- CEMETERY — tax and discount defaults
--
-- Run once in the Supabase SQL editor. Safe to re-run.
--
-- Two corrections carried over from the old app:
--
--   1. Installation fees were non-discountable. They should discount like any
--      other merchandise. The old app attached every automatic fee to the
--      marker as one undifferentiated "extra" and marked the lot
--      non-discountable, which swept installation and the granite base in
--      with endowment care.
--
--      The only non-discountable lines are ENDOWMENT CARE:
--        * "ECF - <property>"  (the separate ECF line on a lawn crypt)
--        * "Marker ECF"        (the per-product endowment fee)
--
--   2. Urns should default to GST *and* PST. Everything else stays GST only.
--
-- Prices are not touched. This only changes which boxes are ticked when a line
-- is first added; the advisor can still override any line on any quote.
-- ─────────────────────────────────────────────────────────────────────────────

begin;

-- ─── Per-product quote-line defaults ─────────────────────────────────────────
alter table cemetery.products
  add column if not exists default_gst          boolean not null default true,
  add column if not exists default_pst          boolean not null default false,
  add column if not exists default_discountable boolean not null default true;

-- Urns: GST + PST.
update cemetery.products
   set default_pst = true
 where category_id = 'urn'
   and default_pst is distinct from true;

-- Everything else: GST only.
update cemetery.products
   set default_pst = false
 where category_id <> 'urn'
   and default_pst is distinct from false;

commit;

-- ─── Check ───────────────────────────────────────────────────────────────────
-- Expect PST true only on the urn row.
select c.name                             as category,
       count(*)                           as products,
       count(*) filter (where p.default_pst)  as pst_by_default,
       count(*) filter (where p.default_gst)  as gst_by_default
  from cemetery.products p
  join cemetery.product_categories c on c.id = p.category_id
 group by c.name, c.sort_order
 order by c.sort_order;

-- ─────────────────────────────────────────────────────────────────────────────
-- EXISTING SAVED QUOTES
--
-- Quote lines snapshot their flags at the time they were added, so quotes
-- saved before this migration keep the old ones. That is deliberate — a saved
-- quote should not change underneath you.
--
-- To bring already-saved quotes in line with the corrected rules, run the
-- block below. Read it first: it rewrites saved quotes.
-- ─────────────────────────────────────────────────────────────────────────────
--
-- begin;
--   -- installation and granite base become discountable
--   update cemetery.quote_items
--      set is_discountable = true
--    where source_kind in ('fee_install', 'fee_base');
--
--   -- endowment care stays non-discountable
--   update cemetery.quote_items
--      set is_discountable = false
--    where source_kind = 'fee_ecf';
--
--   -- urn lines pick up PST
--   update cemetery.quote_items qi
--      set is_pst = true
--     from cemetery.products p
--    where p.id = qi.product_id
--      and p.category_id = 'urn';
--
--   -- then recalculate each affected quote's stored totals by opening and
--   -- re-saving it in the app, which recomputes from the lines
-- commit;
