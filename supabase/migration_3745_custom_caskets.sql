-- ─────────────────────────────────────────────────────────────────────────────
-- MIGRATION — Victory Memorial (3745) custom caskets
--
-- Three caskets that are NOT part of any casket price list and must be kept in
-- the casket database permanently. They use a distinct 'cskx' id namespace so
-- the sequential 'csk0NN' ids generated when a price list is uploaded never
-- collide with them.
--
-- IMPORTANT: if 3745's casket price list is ever re-uploaded/regenerated (which
-- rewrites that home's funeral_home_caskets rows), RE-RUN this migration
-- afterwards to restore these three caskets' availability for 3745.
--
-- Safe to re-run (idempotent).
-- ─────────────────────────────────────────────────────────────────────────────

-- Global catalog entries. Grey Malet already exists as csk079, so only the two
-- genuinely-new caskets are inserted here.
insert into casket_catalog (id, name, description, manufacturer, item_code, category, sort_order) values
  ('cskx01', 'Blue Lowton', NULL, NULL, 'CCCLLBLCH',  'container', 100),
  ('cskx02', 'Navy Tabor',  NULL, NULL, 'CCCLIDFHHB', 'container', 101)
on conflict (id) do update
  set name = excluded.name, item_code = excluded.item_code, category = excluded.category;

-- Make all three available to Victory Memorial (3745).
insert into funeral_home_caskets (funeral_home_id, catalog_id, price, sort_order) values
  ('3745', 'csk079', 1099.00, 59),  -- Grey Malet (existing global catalog entry)
  ('3745', 'cskx01', 1599.00, 60),  -- Blue Lowton
  ('3745', 'cskx02', 2299.00, 61)   -- Navy Tabor
on conflict (funeral_home_id, catalog_id) do update
  set price = excluded.price, sort_order = excluded.sort_order;
