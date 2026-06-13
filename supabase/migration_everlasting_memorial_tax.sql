-- ─────────────────────────────────────────────────────────────────────────────
-- MIGRATION — Everlasting Memorial: GST only, no PST (all funeral homes)
-- ─────────────────────────────────────────────────────────────────────────────

-- 1. Set the item default so future quote_items inherit the correct flags
update service_items
set default_gst = true,
    default_pst = false
where name ilike '%everlasting memorial%';

-- 2. Fix any existing quote_items already added with PST incorrectly applied
update quote_items
set is_gst = true,
    is_pst = false
where service_item_id in (
  select id from service_items where name ilike '%everlasting memorial%'
);
