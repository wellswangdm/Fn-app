-- ─────────────────────────────────────────────────────────────────────────────
-- MIGRATION — Mount Pleasant (3606) FSO cleanup
-- Reduces Family Support Option entries in PPL package_items from 7 to 1.
-- Only one FSO item is needed as a trigger; the UI now queries the full
-- FSO catalog for the funeral home at selection time.
-- Run AFTER migration_3606_ppl_fix.sql
-- ─────────────────────────────────────────────────────────────────────────────

-- Remove all FSO optional items from PPL packages
delete from package_items
where package_id in (
  'pk001010','pk001011','pk001012','pk001013',
  'pk001014','pk001015','pk001016','pk001017'
)
and service_item_id in (
  select id from service_items
  where category_id = 'c1000000-0000-0000-0000-000000000004'
);

-- Re-insert a single FSO trigger item per package (is_optional = true)
-- The item used here is arbitrary — the UI will load the full FSO catalog.
-- Jade plans (pk001013, pk001017) include 2 FSO selections per the PPL;
-- the director should manually add the second FSO after using the picker.
insert into package_items (package_id, service_item_id, quantity, is_optional) values
  ('pk001010', 'si001029', 1, true),  -- Heritage Funeral         (select 1 FSO)
  ('pk001011', 'si001029', 1, true),  -- Honour Funeral           (select 1 FSO)
  ('pk001012', 'si001029', 1, true),  -- Tribute Funeral          (select 1 FSO)
  ('pk001013', 'si001029', 1, true),  -- Jade Burial              (select 2 FSO — add 2nd manually)
  ('pk001014', 'si001029', 1, true),  -- Heritage Cremation       (select 1 FSO)
  ('pk001015', 'si001029', 1, true),  -- Honour Cremation         (select 1 FSO)
  ('pk001016', 'si001029', 1, true),  -- Tribute Cremation        (select 1 FSO)
  ('pk001017', 'si001029', 1, true);  -- Jade Cremation           (select 2 FSO — add 2nd manually)
