-- ─── Fix: Replace Memory Portrait (si000055) with Plan Support Option (si000200/si000201) ───

-- Remove incorrect si000055 entries from burial funeral packages
DELETE FROM package_items
WHERE package_id IN ('pk000010','pk000011','pk000012')
  AND service_item_id = 'si000055';

-- Add si000200 (Plan Support Option) to burial packages if not already there
INSERT INTO package_items (package_id, service_item_id)
SELECT pkg, 'si000200' FROM (VALUES
  ('pk000010'), ('pk000011'), ('pk000012')
) AS t(pkg)
WHERE NOT EXISTS (
  SELECT 1 FROM package_items pi
  WHERE pi.package_id = t.pkg
    AND pi.service_item_id = 'si000200'
);

-- Remove incorrect si000055 entries from cremation packages
DELETE FROM package_items
WHERE package_id IN ('pk000013','pk000014','pk000015')
  AND service_item_id = 'si000055';

-- Add si000201 (Cremation Plan Support Option) to cremation packages if not already there
INSERT INTO package_items (package_id, service_item_id)
SELECT pkg, 'si000201' FROM (VALUES
  ('pk000013'), ('pk000014'), ('pk000015')
) AS t(pkg)
WHERE NOT EXISTS (
  SELECT 1 FROM package_items pi
  WHERE pi.package_id = t.pkg
    AND pi.service_item_id = 'si000201'
);

-- ─── Add Memorial Urn Selection items to cremation packages if not already there ───

-- pk000013 (Heritage Cremation) → si000213 (top urn tier)
INSERT INTO package_items (package_id, service_item_id)
SELECT 'pk000013', 'si000213'
WHERE NOT EXISTS (
  SELECT 1 FROM package_items WHERE package_id = 'pk000013' AND service_item_id = 'si000213'
);

-- pk000014 (Honour Cremation) → si000214 (mid urn tier)
INSERT INTO package_items (package_id, service_item_id)
SELECT 'pk000014', 'si000214'
WHERE NOT EXISTS (
  SELECT 1 FROM package_items WHERE package_id = 'pk000014' AND service_item_id = 'si000214'
);

-- pk000015 (Tribute Cremation) → si000215 (entry urn tier)
INSERT INTO package_items (package_id, service_item_id)
SELECT 'pk000015', 'si000215'
WHERE NOT EXISTS (
  SELECT 1 FROM package_items WHERE package_id = 'pk000015' AND service_item_id = 'si000215'
);
