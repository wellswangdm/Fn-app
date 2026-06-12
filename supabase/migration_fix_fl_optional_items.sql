-- Corrects is_optional flags for Forest Lawn (3605) package items.
-- Run this if you already ran migration_optional_package_items.sql.

-- Remove incorrect optional flags (flowers and collections should be included automatically)
update package_items set is_optional = false
where service_item_id in (
  'si002078', 'si002079', 'si002080',   -- memorial collections
  'si002093', 'si002094', 'si002095',   -- burial flowers
  'si002096', 'si002097'                -- cremation flowers
);

-- Set correct optional flags
update package_items set is_optional = true
where service_item_id in (
  'si002021',                            -- Limousine
  'si002092',                            -- Reception Room
  'si002019',                            -- Flower Vehicle
  'si002098', 'si002099', 'si002100'     -- Catered Receptions I / II / III
);
