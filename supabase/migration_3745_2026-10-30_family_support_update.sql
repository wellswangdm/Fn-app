-- ─────────────────────────────────────────────────────────────────────────────
-- MIGRATION — Victory Memorial Park (3745) Family Support Options update
-- Source: 3745 General Price List, effective October 30, 2026.
--
--   • Family Support Options go from $295 to $345 across the board
--   • 9 new FSO products added; 12-item FSO line-up per the new GPL
--   • Named package FSO line follows to $345, so every named package total
--     rises by $50 (JADE plans are "Select 2", so +$100)
--   • Chinese Funeral Custom Items $590 -> $690 (2 x $345)
--   • Treasure Kits kept, repriced to $345
--   • Funeral Webcasting leaves FSO (stays $295 under Miscellaneous)
--   • Sterling Silver Oval Pendant $295 -> $345
--   • Retired (hidden from new quotes, kept for existing ones): Retractable
--     Table Banner, old Memory Portrait, Family Estate Manager, and the two
--     old Star Gaze Frame entries (now one "Star Gaze Frames" product)
--
-- Professional-service fees and all nine à la carte offering totals are
-- unchanged in this price list.
--
-- Runs in one transaction. Safe to re-run.
-- ─────────────────────────────────────────────────────────────────────────────

begin;

-- ─── 1. Retirement support ───────────────────────────────────────────────────
-- Discontinued items are hidden rather than deleted: quote_items references
-- service_items, so deleting would break historical quotes.
alter table service_items add column if not exists active boolean not null default true;

-- ─── 2. Family Support Options repriced to $345 ──────────────────────────────
update service_items set price = 345.00 where funeral_home_id = '3745' and id in (
  'si000050',  -- Medallion Bundle
  'si000051',  -- Timeless Touch Fingerprint Selection
  'si000054',  -- Legal Service Plan
  'si000056'   -- Treasure Kits (kept on request, repriced)
);

-- Name now matches the price list
update service_items set name = 'Timeless Touch Fingerprint Selection'
  where id = 'si000051' and funeral_home_id = '3745';

-- Two FSO units: 2 x 345
update service_items set price = 690.00
  where id = 'si000216' and funeral_home_id = '3745';   -- Chinese Funeral Custom Items (was 590)

-- ─── 3. Miscellaneous changes from the same price list ───────────────────────
update service_items set price = 345.00
  where id = 'si000072' and funeral_home_id = '3745';   -- Sterling Silver Oval Pendant (was 295)

-- Funeral Webcasting is no longer a Family Support Option; it stays at $295
-- under Miscellaneous Services & Merchandise.
update service_items set category_id = 'c1000000-0000-0000-0000-000000000005'
  where id = 'si000052' and funeral_home_id = '3745';

-- ─── 4. New Family Support Options (all $345) ────────────────────────────────
insert into service_items (id, funeral_home_id, category_id, item_code, name, description, price, price_min, price_max, is_cash_advance) values
  ('si000219', '3745', 'c1000000-0000-0000-0000-000000000004', 'XPRPF0A',  '8x10 or 10x15 Metal or Canvas Memory Portrait', 'Turn a favourite photo into a lasting tribute, beautifully reproduced on metal or canvas with multiple frames to choose from.', 345.00, NULL, NULL, false),
  ('si000220', '3745', 'c1000000-0000-0000-0000-000000000004', 'XFDABTR',  'Serenity Swirl Orbs',            'Select 1 of 5 colour options that incorporate a loved one''s ashes in a solid hand-blown glass keepsake.', 345.00, NULL, NULL, false),
  ('si000221', '3745', 'c1000000-0000-0000-0000-000000000004', 'XOTBRA1',  'Personalized Banner',            'Stand-up banner featuring personal photos and customized wording. Durable vinyl, 24"(w) x 64"(h).', 345.00, NULL, NULL, false),
  ('si000222', '3745', 'c1000000-0000-0000-0000-000000000004', 'XFDLSL3',  'Living Stones - 3 Stones',       'Smooth stones naturally handcrafted from a loved one''s ashes and natural minerals. Three-stone option.', 345.00, NULL, NULL, false),
  ('si000223', '3745', 'c1000000-0000-0000-0000-000000000004', 'XPARBMAC', 'Star Gaze Frames',               'Custom framed star chart of the night sky from a specific date and location. Presented in a 16x20 black shadowbox matted to 11x14, or an 11x14 gold champagne frame matted to 8x10.', 345.00, NULL, NULL, false),
  ('si000224', '3745', 'c1000000-0000-0000-0000-000000000004', 'XCIMARB',  'Marble Tealight Keepsake',       'Engravable natural marble tealight keepsake with a discreet compartment for mementos or a small portion of ashes. Available in Sand, Carerra, Ebony, Fossil Stone and King Gold.', 345.00, NULL, NULL, false),
  ('si000225', '3745', 'c1000000-0000-0000-0000-000000000004', 'MEMFSOBB', 'A Life Remembered Book Bundle',  'Four additional premium-quality 10x9-inch hardcover books including photos, obituary and messages gathered from family and friends.', 345.00, NULL, NULL, false),
  ('si000226', '3745', 'c1000000-0000-0000-0000-000000000004', 'XFDSGGK',  'Stained Glass Keepsake',         'Hand-laid stained glass keepsake with a concealed compartment for a small portion of cremated remains or a meaningful memento, and an engravable base.', 345.00, NULL, NULL, false),
  ('si000227', '3745', 'c1000000-0000-0000-0000-000000000004', 'XOTSJ1A',  'Signature Pendants',             'Bar or round pendant in gold vermeil or sterling silver that transforms a loved one''s handwritten signature into a keepsake. Includes a choice of 16", 18" or 20" chain.', 345.00, NULL, NULL, false)
  on conflict (id) do update set
    category_id = excluded.category_id, item_code = excluded.item_code, name = excluded.name,
    description = excluded.description, price = excluded.price, active = true;

-- ─── 5. Retire items no longer on the price list ─────────────────────────────
update service_items set active = false where funeral_home_id = '3745' and id in (
  'si000053',  -- Retractable Table Banner
  'si000055',  -- Memory Portrait - 10x15 Framed Canvas Portrait (replaced by si000219)
  'si000057',  -- Family Estate Manager
  'si000217',  -- Star Gaze Frame Gold 11x14  (replaced by si000223)
  'si000218'   -- Star Gaze Frame 16x20       (replaced by si000223)
);

-- ─── 6. Named package totals follow the FSO increase ─────────────────────────
-- Each named package carries one FSO line (+$50); the JADE plans are
-- "Select 2" (quantity 2), so they rise by $100.
update packages set total_price = 17729.00 where id = 'pk000010'; -- Heritage Funeral   (was 17679)
update packages set total_price = 16659.00 where id = 'pk000011'; -- Honour Funeral     (was 16609)
update packages set total_price = 14879.00 where id = 'pk000012'; -- Tribute Funeral    (was 14829)
update packages set total_price = 16729.00 where id = 'pk000013'; -- Heritage Cremation (was 16679)
update packages set total_price = 14085.00 where id = 'pk000014'; -- Honour Cremation   (was 14035)
update packages set total_price =  6225.00 where id = 'pk000015'; -- Tribute Cremation  (was 6175)
update packages set total_price = 16094.00 where id = 'pk000016'; -- JADE Burial        (was 15994, Select 2)
update packages set total_price = 15439.00 where id = 'pk000017'; -- JADE Cremation     (was 15339, Select 2)

commit;
