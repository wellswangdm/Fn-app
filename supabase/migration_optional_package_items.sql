-- ─── Migration: is_optional flag on package_items ────────────────────────────
-- Replaces the hardcoded OPTIONAL_ITEM_IDS set in QuoteEditor.jsx.
-- Items marked is_optional = true are shown as opt-in checkboxes in the
-- casket picker when a named package (pkg_type = 'package') is selected.

alter table package_items add column if not exists is_optional boolean default false;

-- ─── Victory Memorial (3745) optional add-ons ────────────────────────────────

update package_items set is_optional = true
where service_item_id in (
  'si000042',                          -- Limousine
  'si000088',                          -- Reception and Hostess
  'si000207', 'si000208', 'si000209',  -- Catered Reception III / II / I
  'si000213', 'si000214', 'si000215'   -- Memorial Urn Selection (tiers 1–3)
);

-- ─── Forest Lawn (3605) optional add-ons ─────────────────────────────────────

update package_items set is_optional = true
where service_item_id in (
  -- Stationery / memorial collections (customer picks style)
  'si002078', 'si002079', 'si002080',
  -- Flowers — burial and cremation (customer picks tier)
  'si002093', 'si002094', 'si002095',
  'si002096', 'si002097',
  -- Catered Receptions (customer picks tier)
  'si002098', 'si002099', 'si002100'
);
