-- ─────────────────────────────────────────────────────────────────────────────
-- MIGRATION — Victory Memorial (3745) GPL category cleanup
--
-- Issue 1: Estate Fraud Protection, Everlasting Memorial, and Traditional
--   Ritual Washing were placed in the FSO category (c4). The GPL lists them
--   under Miscellaneous, not Family Support Options. Because they sat in FSO
--   the universal-optional migration incorrectly set them to is_optional=true
--   even though they are mandatory bundled items.
--
-- Issue 2: Burial Flowers (3 tiers), Cremation Flowers (2 tiers), and Catered
--   Reception (3 tiers) do not appear in the GPL. The GPL states only
--   "a wide variety of floral/catering options are available" with no price.
--   These items should not exist as purchasable service_items.
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

-- ─── 3. Remove non-GPL Burial / Cremation Flower tier items ──────────────────
-- Clear FK references in quote_items before deleting service_items
delete from quote_items
where service_item_id in ('si000202','si000203','si000204','si000205','si000206');

delete from package_items
where service_item_id in ('si000202','si000203','si000204','si000205','si000206');

delete from service_items
where id in ('si000202','si000203','si000204','si000205','si000206');

-- ─── 4. Remove non-GPL Catered Reception tier items ──────────────────────────
delete from quote_items
where service_item_id in ('si000207','si000208','si000209');

delete from package_items
where service_item_id in ('si000207','si000208','si000209');

delete from service_items
where id in ('si000207','si000208','si000209');
