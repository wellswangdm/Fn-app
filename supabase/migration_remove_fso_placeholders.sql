-- ─────────────────────────────────────────────────────────────────────────────
-- MIGRATION — Remove FSO placeholder service items (all funeral homes)
-- "Plan Support Option", "Cremation Plan Support Option" and variants were
-- incorrectly stored as purchasable service_items.  They are only needed as
-- trigger rows in package_items (using any real FSO item as the marker).
-- ─────────────────────────────────────────────────────────────────────────────

-- ─── Remove quote_items references first (FK prevents service_item deletion) ─
-- These line items reference placeholder IDs that are not real purchasable
-- items; replace them with the corresponding real FSO item for each home.

-- Forest Lawn (3605): si002101 → si002024 | si002103 → si002024
update quote_items set service_item_id = 'si002024'
where service_item_id in ('si002101','si002103');

-- Forest Lawn (3605): si002102/si002104 were priced at $590 (2 × $295).
-- Replace with si002024 — the quote line keeps its stored price/name.
update quote_items set service_item_id = 'si002024'
where service_item_id in ('si002102','si002104');

-- Victory Memorial (3745): si000200/si000201 → si000050
update quote_items set service_item_id = 'si000050'
where service_item_id in ('si000200','si000201');

-- ─── Forest Lawn (3605) ───────────────────────────────────────────────────────

delete from package_items
where service_item_id in ('si002101','si002102','si002103','si002104');

insert into package_items (package_id, service_item_id, quantity, is_optional) values
  ('pk002011', 'si002024', 1, true),  -- Heritage Funeral         (select 1)
  ('pk002012', 'si002024', 1, true),  -- Honour Funeral           (select 1)
  ('pk002013', 'si002024', 1, true),  -- Tribute Funeral          (select 1)
  ('pk002014', 'si002024', 1, true),  -- Jade Burial              (select 2 — row 1)
  ('pk002014', 'si002024', 1, true),  -- Jade Burial              (select 2 — row 2)
  ('pk002015', 'si002024', 1, true),  -- Heritage Cremation       (select 1)
  ('pk002016', 'si002024', 1, true),  -- Honour Cremation         (select 1)
  ('pk002017', 'si002024', 1, true),  -- Tribute Cremation        (select 1)
  ('pk002018', 'si002024', 1, true),  -- Jade Cremation           (select 2 — row 1)
  ('pk002018', 'si002024', 1, true);  -- Jade Cremation           (select 2 — row 2)

delete from service_items where id in ('si002101','si002102','si002103','si002104');

-- ─── Victory Memorial (3745) ─────────────────────────────────────────────────

delete from package_items
where service_item_id in ('si000200','si000201');

insert into package_items (package_id, service_item_id, quantity, is_optional) values
  ('pk000010', 'si000050', 1, true),  -- Heritage Funeral
  ('pk000011', 'si000050', 1, true),  -- Honour Funeral
  ('pk000012', 'si000050', 1, true),  -- Tribute Funeral
  ('pk000013', 'si000050', 1, true),  -- Heritage Cremation
  ('pk000014', 'si000050', 1, true),  -- Honour Cremation
  ('pk000015', 'si000050', 1, true);  -- Tribute Cremation

delete from service_items where id in ('si000200','si000201');
