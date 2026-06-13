-- ─────────────────────────────────────────────────────────────────────────────
-- MIGRATION — Remove FSO placeholder service items (all funeral homes)
-- "Plan Support Option", "Cremation Plan Support Option" and variants were
-- incorrectly stored as purchasable service_items.  They are only needed as
-- trigger rows in package_items (using any real FSO item as the marker).
-- ─────────────────────────────────────────────────────────────────────────────

-- ─── Forest Lawn (3605) ───────────────────────────────────────────────────────
-- Placeholder IDs: si002101 (burial select-1), si002102 (burial select-2),
--                  si002103 (cremation select-1), si002104 (cremation select-2)
-- Real FSO trigger used: si002024 (Retractable Table Banner, $295)

-- Remove all placeholder package_items rows
delete from package_items
where service_item_id in ('si002101','si002102','si002103','si002104');

-- Re-insert triggers using a real FSO item; row count = number of FSO selections
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

-- Delete placeholder service_items
delete from service_items where id in ('si002101','si002102','si002103','si002104');

-- ─── Victory Memorial (3745) ─────────────────────────────────────────────────
-- Placeholder IDs: si000200 (Plan Support Option), si000201 (Cremation Plan Support Option)
-- Real FSO trigger used: si000050 (Medallion Bundle, $295)

-- Remove all placeholder package_items rows
delete from package_items
where service_item_id in ('si000200','si000201');

-- Re-insert triggers (all Victory Memorial plans select 1 FSO)
insert into package_items (package_id, service_item_id, quantity, is_optional) values
  ('pk000010', 'si000050', 1, true),  -- Heritage Funeral
  ('pk000011', 'si000050', 1, true),  -- Honour Funeral
  ('pk000012', 'si000050', 1, true),  -- Tribute Funeral
  ('pk000013', 'si000050', 1, true),  -- Heritage Cremation
  ('pk000014', 'si000050', 1, true),  -- Honour Cremation
  ('pk000015', 'si000050', 1, true);  -- Tribute Cremation

-- Delete placeholder service_items
delete from service_items where id in ('si000200','si000201');
