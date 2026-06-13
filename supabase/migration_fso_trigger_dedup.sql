-- ─────────────────────────────────────────────────────────────────────────────
-- MIGRATION — Fix doubled FSO trigger rows (3605 and 3745)
--
-- migration_remove_fso_placeholders.sql inserted si000050 (3745) and si002024
-- (3605) without first removing the rows already present in package_items,
-- leaving each package with 2× the intended FSO trigger count.
-- Result: non-Jade showed "select 2" (should be 1), Jade showed "select 4"
-- (should be 2).
-- ─────────────────────────────────────────────────────────────────────────────

-- ─── Victory Memorial (3745) — reset to 1 trigger per package ────────────────
delete from package_items
where package_id in ('pk000010','pk000011','pk000012','pk000013','pk000014','pk000015')
  and service_item_id = 'si000050';

insert into package_items (package_id, service_item_id, quantity, is_optional) values
  ('pk000010', 'si000050', 1, true),  -- Heritage Funeral         (select 1)
  ('pk000011', 'si000050', 1, true),  -- Honour Funeral           (select 1)
  ('pk000012', 'si000050', 1, true),  -- Tribute Funeral          (select 1)
  ('pk000013', 'si000050', 1, true),  -- Heritage Cremation       (select 1)
  ('pk000014', 'si000050', 1, true),  -- Honour Cremation         (select 1)
  ('pk000015', 'si000050', 1, true);  -- Tribute Cremation        (select 1)

-- ─── Forest Lawn (3605) — reset to 1 (non-Jade) or 2 (Jade) triggers ────────
delete from package_items
where package_id in ('pk002011','pk002012','pk002013','pk002014','pk002015','pk002016','pk002017','pk002018')
  and service_item_id = 'si002024';

insert into package_items (package_id, service_item_id, quantity, is_optional) values
  ('pk002011', 'si002024', 1, true),  -- Heritage Funeral         (select 1)
  ('pk002012', 'si002024', 1, true),  -- Honour Funeral           (select 1)
  ('pk002013', 'si002024', 1, true),  -- Tribute Funeral          (select 1)
  ('pk002014', 'si002024', 1, true),  -- Jade Burial  (select 2 — row 1)
  ('pk002014', 'si002024', 1, true),  -- Jade Burial  (select 2 — row 2)
  ('pk002015', 'si002024', 1, true),  -- Heritage Cremation       (select 1)
  ('pk002016', 'si002024', 1, true),  -- Honour Cremation         (select 1)
  ('pk002017', 'si002024', 1, true),  -- Tribute Cremation        (select 1)
  ('pk002018', 'si002024', 1, true),  -- Jade Cremation (select 2 — row 1)
  ('pk002018', 'si002024', 1, true);  -- Jade Cremation (select 2 — row 2)
