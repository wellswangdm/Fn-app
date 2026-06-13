-- ─────────────────────────────────────────────────────────────────────────────
-- MIGRATION — Victory Memorial (3745) GPL category cleanup
--
-- Estate Fraud Protection, Everlasting Memorial, and Traditional Ritual
-- Washing were placed in the FSO category (c4). The GPL lists them under
-- Miscellaneous, not Family Support Options. Because they sat in FSO the
-- universal-optional migration incorrectly set them to is_optional=true even
-- though they are mandatory bundled items.
-- ─────────────────────────────────────────────────────────────────────────────

-- ─── 1. Move to correct category (Misc = c5) ─────────────────────────────────
update service_items
set category_id = 'c1000000-0000-0000-0000-000000000005'
where id in ('si000058', 'si000059', 'si000060')
  and funeral_home_id = '3745';

-- ─── 2. Restore mandatory flag (FSO migration had set them to optional) ───────
update package_items
set is_optional = false
where service_item_id in ('si000058', 'si000059', 'si000060');
