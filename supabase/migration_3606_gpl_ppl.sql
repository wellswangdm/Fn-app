-- ─────────────────────────────────────────────────────────────────────────────
-- MIGRATION — Mount Pleasant Universal Funeral Home (ID: 3606)
-- GPL/PPL Update — effective February 18, 2026
-- ─────────────────────────────────────────────────────────────────────────────

-- ─── 1. Fix price discrepancies in existing service items ─────────────────────

update service_items set price =  3440.00 where id = 'si001002'; -- Memorial Service (was 3590)
update service_items set price =  2840.00 where id = 'si001005'; -- Urn Committal (was 2695)
update service_items set price =  1345.00 where id = 'si001006'; -- No Service Option (was 1495)
update service_items set price =   495.00 where id = 'si001010'; -- Registration and Documentation (was 445)
update service_items set price =   445.00 where id = 'si001012'; -- Other Care and Preparation (was 395)
update service_items set price =   445.00 where id = 'si001013'; -- Sheltering of Remains (was 395)
update service_items set price =   995.00 where id = 'si001036'; -- Crematory Fee (was 795)
update service_items set price =   490.00 where id = 'si001055'; -- Everlasting Memorial® (was 449)
update service_items set price_min = 50.00, price_max = 295.00
                                            where id = 'si001066'; -- Casket Medallions (was 30–75)
update service_items set price =    65.00 where id = 'si001067'; -- Single Small Medallion Case (was 45)
update service_items set price =    95.00 where id = 'si001068'; -- Triple Small Medallion Case (was 75)
update service_items set price =    48.00 where id = 'si001080'; -- Consumer Protection BC Fee (was 40)

-- ─── 2. New service items ─────────────────────────────────────────────────────

-- Professional Staff & Services
insert into service_items (id, funeral_home_id, category_id, item_code, name, description, price, price_min, price_max, is_cash_advance, sort_order) values
  ('si001084', '3606', 'c1000000-0000-0000-0000-000000000001', NULL,
    'Professional Service Fees for Cremation Witness', NULL,
    3440.00, NULL, NULL, false, 14);

-- Family Support Options
insert into service_items (id, funeral_home_id, category_id, item_code, name, description, price, price_min, price_max, is_cash_advance, sort_order) values
  ('si001085', '3606', 'c1000000-0000-0000-0000-000000000004', 'XPARNRY1',
    'Retractable Table Banner',
    'Showcases up to 4 pictures with personalized design and optional QR code. 11.75" x 17".',
    295.00, NULL, NULL, false, 9),
  ('si001086', '3606', 'c1000000-0000-0000-0000-000000000004', NULL,
    'Timeless Touch Fingerprint', NULL,
    295.00, NULL, NULL, false, 10),
  ('si001087', '3606', 'c1000000-0000-0000-0000-000000000004', NULL,
    'Medallion Bundle', NULL,
    295.00, NULL, NULL, false, 11);

-- Miscellaneous Services & Merchandise
insert into service_items (id, funeral_home_id, category_id, item_code, name, description, price, price_min, price_max, is_cash_advance, sort_order) values
  ('si001088', '3606', 'c1000000-0000-0000-0000-000000000005', 'XSRAVERT',
    'Audio Visual Equipment Rental', 'AV equipment rental.',
    195.00, NULL, NULL, false, 35),
  ('si001089', '3606', 'c1000000-0000-0000-0000-000000000005', 'XSMCCZ09Z',
    'Retractable Floor Banner', NULL,
    395.00, NULL, NULL, false, 36),
  ('si001090', '3606', 'c1000000-0000-0000-0000-000000000005', 'MEMMALRB',
    'A Life Remembered Book', 'A Life Remembered Book.',
    95.00, NULL, NULL, false, 37),
  -- Flowers (PPL-specific)
  ('si001091', '3606', 'c1000000-0000-0000-0000-000000000005', NULL,
    'Dignity Heritage Burial Flowers', NULL,
    695.00, NULL, NULL, false, 38),
  ('si001092', '3606', 'c1000000-0000-0000-0000-000000000005', NULL,
    'Dignity Honour Burial Flowers', NULL,
    595.00, NULL, NULL, false, 39),
  ('si001093', '3606', 'c1000000-0000-0000-0000-000000000005', NULL,
    'Dignity Tribute Burial Flowers', NULL,
    495.00, NULL, NULL, false, 40),
  ('si001094', '3606', 'c1000000-0000-0000-0000-000000000005', NULL,
    'Dignity Heritage Cremation Flowers', NULL,
    500.00, NULL, NULL, false, 41),
  ('si001095', '3606', 'c1000000-0000-0000-0000-000000000005', NULL,
    'Dignity Honour Cremation Flowers', NULL,
    400.00, NULL, NULL, false, 42),
  -- Catered Receptions (PPL-specific)
  ('si001096', '3606', 'c1000000-0000-0000-0000-000000000005', NULL,
    'Catered Receptions I', NULL,
    995.00, NULL, NULL, false, 43),
  ('si001097', '3606', 'c1000000-0000-0000-0000-000000000005', NULL,
    'Catered Receptions II', NULL,
    1795.00, NULL, NULL, false, 44),
  ('si001098', '3606', 'c1000000-0000-0000-0000-000000000005', NULL,
    'Catered Receptions III', NULL,
    2495.00, NULL, NULL, false, 45);

-- Stationery (new GPL stationery items)
insert into service_items (id, funeral_home_id, category_id, item_code, name, description, price, price_min, price_max, is_cash_advance, sort_order) values
  ('si001099', '3606', 'c1000000-0000-0000-0000-000000000006', 'XDPAICV',
    'Commemorative Collection',
    'Includes 1 Medium Memory Book, choice of 100 Medium Memory Folders or Cards, choice of 25 Medium Tribute Thank You Cards or Signature Thank You Cards, and 1 Keepsake Box.',
    495.00, NULL, NULL, false, 9),
  ('si001100', '3606', 'c1000000-0000-0000-0000-000000000006', 'XDPAIEC',
    'Esteemed Collection',
    'Includes 1 Medium Memory Book, choice of 100 Large Memory Booklets or Cards, choice of 25 Medium Tribute Thank You Cards or Signature Thank You Cards, and 1 Keepsake Box.',
    795.00, NULL, NULL, false, 10),
  ('si001101', '3606', 'c1000000-0000-0000-0000-000000000006', 'XDPAIRC',
    'Remembrance Collection',
    'Includes 1 Medium Memory Book, choice of 100 Small Memory Folders or Cards, choice of 25 Small Tribute Thank You Cards, and 1 Keepsake Box.',
    395.00, NULL, NULL, false, 11),
  ('si001102', '3606', 'c1000000-0000-0000-0000-000000000006', 'XDPAIOC',
    'Our Collection',
    'Includes 1 Memory Register Book, choice of 100 Our Collection Folders or Prayer Cards, choice of 50 Our Collection Thank You Cards, and 1 Keepsake Box.',
    395.00, NULL, NULL, false, 12),
  ('si001103', '3606', 'c1000000-0000-0000-0000-000000000006', 'XSMOT1S44',
    'Our Collection Folders or Prayer Cards (per 100)',
    'Choose from a selection of themes available on site.',
    195.00, NULL, NULL, false, 13),
  ('si001104', '3606', 'c1000000-0000-0000-0000-000000000006', 'XSMLG1S3L',
    'Large Memory Booklets or Memory Cards (per 100)',
    'Large Memory Booklets feature 8 pages; Large Memory Cards feature soft-touch finish and up to 5 photos.',
    620.00, NULL, NULL, false, 14),
  ('si001105', '3606', 'c1000000-0000-0000-0000-000000000006', 'XSMMD1S3L',
    'Medium Memory Cards or Memory Folders (per 100)',
    'Include up to 4 photos, name, dates, service details, obituary, and choice of poem or verse.',
    320.00, NULL, NULL, false, 15),
  ('si001106', '3606', 'c1000000-0000-0000-0000-000000000006', 'XSMDF1S3L',
    'Small Memory Folders or Memory Cards (per 100)',
    'Include 1 photo, name, dates, service details, obituary, and choice of poem or verse.',
    220.00, NULL, NULL, false, 16),
  ('si001107', '3606', 'c1000000-0000-0000-0000-000000000006', 'XSMBMBM5F',
    'Soft Touch Bookmarks (50)', NULL,
    200.00, NULL, NULL, false, 17),
  ('si001108', '3606', 'c1000000-0000-0000-0000-000000000006', 'XSMAI8M8M',
    'Memory Register Book',
    'Classic ivory guest register printed on site.',
    75.00, NULL, NULL, false, 18),
  ('si001109', '3606', 'c1000000-0000-0000-0000-000000000006', 'XSMMB1S3L',
    'Medium Memory Book',
    'Elegant ivory or charcoal keepsake book with tone-on-tone pattern.',
    75.00, NULL, NULL, false, 19),
  ('si001110', '3606', 'c1000000-0000-0000-0000-000000000006', 'XSMKB1S3L',
    'Keepsake Box',
    'Modern keepsake box with magnetic closure. 11.5" x 10" x 3.75".',
    25.00, NULL, NULL, false, 20),
  ('si001111', '3606', 'c1000000-0000-0000-0000-000000000006', 'XSMEG993L',
    'Personalized Thank You Cards (per 25)', NULL,
    75.00, NULL, NULL, false, 21),
  ('si001112', '3606', 'c1000000-0000-0000-0000-000000000006', 'XSMAX1S5L',
    'Our Collection Thank You Cards (per 50)', NULL,
    100.00, NULL, NULL, false, 22);

-- Urns — PPL memorial urn selection tiers
insert into service_items (id, funeral_home_id, category_id, item_code, name, description, price, price_min, price_max, is_cash_advance, sort_order) values
  ('si001113', '3606', 'c1000000-0000-0000-0000-000000000009', NULL,
    'Memorial Urn Selection — Heritage Tier',
    'Choice of: LoveUrns HeartFelt™ Gold, Terrybear Eminence White Marble Urn, Granville Lucinda Blue Horizontal Urn, or Granville Charlotte Horizontal Urn.',
    1295.00, NULL, NULL, false, 1),
  ('si001114', '3606', 'c1000000-0000-0000-0000-000000000009', NULL,
    'Memorial Urn Selection — Honour Tier',
    'Choice of: Urnes Bégin Versatile Urn Navy, LoveUrns Laurel Midnight, Terrybear Satori Ocean Pearl, or Batesville Memento Chest.',
    795.00, NULL, NULL, false, 2),
  ('si001115', '3606', 'c1000000-0000-0000-0000-000000000009', NULL,
    'Memorial Urn Selection — Tribute Tier',
    'Choice of: LoveUrns Laurel Crimson, Urnes Bégin Sky Pewter, Mackenzie Classic Sky Blue, or Batesville Cherry Chest.',
    595.00, NULL, NULL, false, 3),
  ('si001116', '3606', 'c1000000-0000-0000-0000-000000000009', NULL,
    'Memorial Urn Selection — Jade Tier',
    'Choice of: LoveUrns Elegant Leaf, Urnes Bégin Serenity Tree, Urnes Bégin Bois Silver Maple, or BioLife Living Tribute Urn.',
    895.00, NULL, NULL, false, 4);

-- Caskets & Containers — PPL recommended selections
insert into service_items (id, funeral_home_id, category_id, item_code, name, description, price, price_min, price_max, is_cash_advance, sort_order) values
  ('si001117', '3606', 'c1000000-0000-0000-0000-000000000008', NULL,
    'Recommended Casket — Heritage/Jade Tier',
    'Heritage: choice of Batesville Prominence, Batesville Chandler, Victoriaville Classic Mahogany, or Batesville Warren Oak. Jade: Victoriaville Jamestown PC, Batesville Prominence, Batesville Chandler, or Victoriaville Classic Mahogany.',
    6499.00, NULL, NULL, false, 1),
  ('si001118', '3606', 'c1000000-0000-0000-0000-000000000008', NULL,
    'Recommended Casket — Honour Tier',
    'Choice of: Victoriaville Victoria Cherry, Batesville Rosette, Victoriaville Briar Hill, or Batesville Camden Oak.',
    4699.00, NULL, NULL, false, 2),
  ('si001119', '3606', 'c1000000-0000-0000-0000-000000000008', NULL,
    'Recommended Casket — Tribute Tier',
    'Choice of: Batesville Merlot, Victoriaville Dominion HC Wood Maple Crepe, Batesville Fireside, or Batesville Eleanor Oak.',
    4099.00, NULL, NULL, false, 3),
  ('si001120', '3606', 'c1000000-0000-0000-0000-000000000008', NULL,
    'Batesville Brockton Oak Ceremonial', 'Ceremonial container for cremation services.',
    1599.00, NULL, NULL, false, 4),
  ('si001121', '3606', 'c1000000-0000-0000-0000-000000000008', NULL,
    'Vancouver Casket Burlington', 'Cremation container.',
    850.00, NULL, NULL, false, 5),
  ('si001122', '3606', 'c1000000-0000-0000-0000-000000000008', NULL,
    'Vancouver Casket McConnell', 'Cremation container.',
    1050.00, NULL, NULL, false, 6);

-- ─── 3. Update alacarte package totals ───────────────────────────────────────

update packages set total_price =  7960.00 where id = 'pk001001'; -- Full Service
update packages set total_price =  7390.00 where id = 'pk001002'; -- Service of Remembrance
update packages set total_price =  6345.00 where id = 'pk001003'; -- Graveside Service
update packages set total_price =  5900.00 where id = 'pk001004'; -- Urn Committal
update packages set total_price =  4405.00 where id = 'pk001005'; -- No Service Option
update packages set total_price =  4880.00 where id = 'pk001006'; -- Disinterment
update packages set total_price =  7815.00 where id = 'pk001007'; -- Forwarding of Remains
update packages set total_price =  6150.00 where id = 'pk001008'; -- Receiving of Remains

-- ─── 4. Fix Urn Committal package items ──────────────────────────────────────
-- GPL does not include Flower Vehicle in the Urn Committal service offering

delete from package_items where package_id = 'pk001004' and service_item_id = 'si001024';

-- ─── 5. Witness Cremation — new alacarte package ─────────────────────────────
-- $3,440 + $495 + $445 + $445 + $545 + $135 + $995 = $6,500

insert into packages (id, funeral_home_id, name, pkg_type, total_price, package_discount, default_casket_id, sort_order) values
  ('pk001009', '3606', 'Witness Cremation', 'alacarte', 6500.00, 0, NULL, 9);

insert into package_items (package_id, service_item_id, quantity) values
  ('pk001009', 'si001084', 1),  -- Professional Service Fees for Cremation Witness   3440
  ('pk001009', 'si001010', 1),  -- Registration and Documentation                     495
  ('pk001009', 'si001012', 1),  -- Other Care and Preparation                         445
  ('pk001009', 'si001013', 1),  -- Sheltering of Remains                              445
  ('pk001009', 'si001022', 1),  -- Transfer of Remains from Place of Death            545
  ('pk001009', 'si001045', 1),  -- Estate Fraud Protection                            135
  ('pk001009', 'si001036', 1);  -- Crematory Fee                                      995

-- ─── 6. PPL packages (pkg_type = 'package') ──────────────────────────────────
-- total_price = sum of all components; package_discount = savings amount
-- Final customer price = total_price - package_discount

insert into packages (id, funeral_home_id, name, pkg_type, total_price, package_discount, default_casket_id, sort_order) values
  ('pk001010', '3606', 'Dignity Memorial Heritage Funeral Service',  'package', 19229.00,  540, NULL, 1),
  ('pk001011', '3606', 'Dignity Memorial Honour Funeral Service',    'package', 16329.00,  460, NULL, 2),
  ('pk001012', '3606', 'Dignity Memorial Tribute Funeral Service',   'package', 14729.00,  435, NULL, 3),
  ('pk001013', '3606', 'Dignity Jade Burial Plan',                   'package', 18239.00,  505, NULL, 4),
  ('pk001014', '3606', 'Dignity Memorial Heritage Cremation Service','package', 16424.00,  465, NULL, 5),
  ('pk001015', '3606', 'Dignity Memorial Honour Cremation Service',  'package', 12510.00,  360, NULL, 6),
  ('pk001016', '3606', 'Dignity Memorial Tribute Cremation Service', 'package',  7640.00,   50, NULL, 7),
  ('pk001017', '3606', 'Dignity Jade Cremation Plan',                'package', 14680.00,  405, NULL, 8);

-- Heritage Funeral Service — $19,229 → $18,689 with savings
insert into package_items (package_id, service_item_id, quantity) values
  ('pk001010', 'si001001', 1),  -- Professional Services Fees for Full Service        3590
  ('pk001010', 'si001010', 1),  -- Registration and Documentation                      495
  ('pk001010', 'si001011', 1),  -- Embalming                                           625
  ('pk001010', 'si001012', 1),  -- Other Care and Preparation                          445
  ('pk001010', 'si001013', 1),  -- Sheltering of Remains                               445
  ('pk001010', 'si001022', 1),  -- Transfer of Remains from Place of Death             545
  ('pk001010', 'si001024', 1),  -- Flower Vehicle                                      295
  ('pk001010', 'si001023', 1),  -- Funeral Vehicle (Hearse)                            395
  ('pk001010', 'si001025', 1),  -- Limousine                                           395
  ('pk001010', 'si001055', 1),  -- Everlasting Memorial®                               490
  ('pk001010', 'si001045', 1),  -- Estate Fraud Protection                             135
  ('pk001010', 'si001091', 1),  -- Dignity Heritage Burial Flowers                     695
  ('pk001010', 'si001050', 1),  -- Premium Venue Service                               595
  ('pk001010', 'si001029', 1),  -- Family Support Option (Select 1)                    295
  ('pk001010', 'si001117', 1),  -- Recommended Casket — Heritage/Jade Tier            6499
  ('pk001010', 'si001098', 1),  -- Catered Receptions III                             2495
  ('pk001010', 'si001100', 1);  -- Esteemed Collection                                 795

-- Honour Funeral Service — $16,329 → $15,869 with savings
insert into package_items (package_id, service_item_id, quantity) values
  ('pk001011', 'si001001', 1),  -- Professional Services Fees for Full Service        3590
  ('pk001011', 'si001010', 1),  -- Registration and Documentation                      495
  ('pk001011', 'si001011', 1),  -- Embalming                                           625
  ('pk001011', 'si001012', 1),  -- Other Care and Preparation                          445
  ('pk001011', 'si001013', 1),  -- Sheltering of Remains                               445
  ('pk001011', 'si001022', 1),  -- Transfer of Remains from Place of Death             545
  ('pk001011', 'si001024', 1),  -- Flower Vehicle                                      295
  ('pk001011', 'si001023', 1),  -- Funeral Vehicle (Hearse)                            395
  ('pk001011', 'si001025', 1),  -- Limousine                                           395
  ('pk001011', 'si001055', 1),  -- Everlasting Memorial®                               490
  ('pk001011', 'si001045', 1),  -- Estate Fraud Protection                             135
  ('pk001011', 'si001092', 1),  -- Dignity Honour Burial Flowers                       595
  ('pk001011', 'si001050', 1),  -- Premium Venue Service                               595
  ('pk001011', 'si001029', 1),  -- Family Support Option (Select 1)                    295
  ('pk001011', 'si001118', 1),  -- Recommended Casket — Honour Tier                   4699
  ('pk001011', 'si001097', 1),  -- Catered Receptions II                              1795
  ('pk001011', 'si001099', 1);  -- Commemorative Collection                            495

-- Tribute Funeral Service — $14,729 → $14,294 with savings
insert into package_items (package_id, service_item_id, quantity) values
  ('pk001012', 'si001001', 1),  -- Professional Services Fees for Full Service        3590
  ('pk001012', 'si001010', 1),  -- Registration and Documentation                      495
  ('pk001012', 'si001011', 1),  -- Embalming                                           625
  ('pk001012', 'si001012', 1),  -- Other Care and Preparation                          445
  ('pk001012', 'si001013', 1),  -- Sheltering of Remains                               445
  ('pk001012', 'si001022', 1),  -- Transfer of Remains from Place of Death             545
  ('pk001012', 'si001024', 1),  -- Flower Vehicle                                      295
  ('pk001012', 'si001023', 1),  -- Funeral Vehicle (Hearse)                            395
  ('pk001012', 'si001025', 1),  -- Limousine                                           395
  ('pk001012', 'si001055', 1),  -- Everlasting Memorial®                               490
  ('pk001012', 'si001045', 1),  -- Estate Fraud Protection                             135
  ('pk001012', 'si001093', 1),  -- Dignity Tribute Burial Flowers                      495
  ('pk001012', 'si001050', 1),  -- Premium Venue Service                               595
  ('pk001012', 'si001029', 1),  -- Family Support Option (Select 1)                    295
  ('pk001012', 'si001119', 1),  -- Recommended Casket — Tribute Tier                  4099
  ('pk001012', 'si001096', 1),  -- Catered Receptions I                                995
  ('pk001012', 'si001101', 1);  -- Remembrance Collection                              395

-- Jade Burial Plan — $18,239 → $17,734 with savings (2 family support options, no Everlasting Memorial)
insert into package_items (package_id, service_item_id, quantity) values
  ('pk001013', 'si001001', 1),  -- Professional Services Fees for Full Service        3590
  ('pk001013', 'si001010', 1),  -- Registration and Documentation                      495
  ('pk001013', 'si001011', 1),  -- Embalming                                           625
  ('pk001013', 'si001012', 1),  -- Other Care and Preparation                          445
  ('pk001013', 'si001013', 1),  -- Sheltering of Remains                               445
  ('pk001013', 'si001022', 1),  -- Transfer of Remains from Place of Death             545
  ('pk001013', 'si001024', 1),  -- Flower Vehicle                                      295
  ('pk001013', 'si001023', 1),  -- Funeral Vehicle (Hearse)                            395
  ('pk001013', 'si001025', 1),  -- Limousine                                           395
  ('pk001013', 'si001045', 1),  -- Estate Fraud Protection                             135
  ('pk001013', 'si001091', 1),  -- Dignity Heritage Burial Flowers                     695
  ('pk001013', 'si001050', 1),  -- Premium Venue Service                               595
  ('pk001013', 'si001029', 1),  -- Family Support Option 1 (Select 2 total = $590)     295
  ('pk001013', 'si001030', 1),  -- Family Support Option 2                             295
  ('pk001013', 'si001117', 1),  -- Recommended Casket — Heritage/Jade Tier            6499
  ('pk001013', 'si001098', 1);  -- Catered Receptions III                             2495

-- Heritage Cremation Service — $16,424 → $15,959 with savings
insert into package_items (package_id, service_item_id, quantity) values
  ('pk001014', 'si001001', 1),  -- Professional Services Fees for Full Service        3590
  ('pk001014', 'si001010', 1),  -- Registration and Documentation                      495
  ('pk001014', 'si001011', 1),  -- Embalming                                           625
  ('pk001014', 'si001012', 1),  -- Other Care and Preparation                          445
  ('pk001014', 'si001013', 1),  -- Sheltering of Remains                               445
  ('pk001014', 'si001022', 1),  -- Transfer of Remains from Place of Death             545
  ('pk001014', 'si001024', 1),  -- Flower Vehicle                                      295
  ('pk001014', 'si001023', 1),  -- Funeral Vehicle (Hearse)                            395
  ('pk001014', 'si001025', 1),  -- Limousine                                           395
  ('pk001014', 'si001055', 1),  -- Everlasting Memorial®                               490
  ('pk001014', 'si001045', 1),  -- Estate Fraud Protection                             135
  ('pk001014', 'si001094', 1),  -- Dignity Heritage Cremation Flowers                  500
  ('pk001014', 'si001036', 1),  -- Crematory Fee                                       995
  ('pk001014', 'si001050', 1),  -- Premium Venue Service                               595
  ('pk001014', 'si001029', 1),  -- Family Support Option (Select 1)                    295
  ('pk001014', 'si001113', 1),  -- Memorial Urn Selection — Heritage Tier             1295
  ('pk001014', 'si001120', 1),  -- Batesville Brockton Oak Ceremonial                 1599
  ('pk001014', 'si001098', 1),  -- Catered Receptions III                             2495
  ('pk001014', 'si001100', 1);  -- Esteemed Collection                                 795

-- Honour Cremation Service — $12,510 → $12,150 with savings
insert into package_items (package_id, service_item_id, quantity) values
  ('pk001015', 'si001002', 1),  -- Professional Services Fees for Memorial Service    3440
  ('pk001015', 'si001010', 1),  -- Registration and Documentation                      495
  ('pk001015', 'si001012', 1),  -- Other Care and Preparation                          445
  ('pk001015', 'si001013', 1),  -- Sheltering of Remains                               445
  ('pk001015', 'si001022', 1),  -- Transfer of Remains from Place of Death             545
  ('pk001015', 'si001024', 1),  -- Flower Vehicle                                      295
  ('pk001015', 'si001055', 1),  -- Everlasting Memorial®                               490
  ('pk001015', 'si001045', 1),  -- Estate Fraud Protection                             135
  ('pk001015', 'si001095', 1),  -- Dignity Honour Cremation Flowers                    400
  ('pk001015', 'si001036', 1),  -- Crematory Fee                                       995
  ('pk001015', 'si001050', 1),  -- Premium Venue Service                               595
  ('pk001015', 'si001029', 1),  -- Family Support Option (Select 1)                    295
  ('pk001015', 'si001114', 1),  -- Memorial Urn Selection — Honour Tier                795
  ('pk001015', 'si001121', 1),  -- Vancouver Casket Burlington                         850
  ('pk001015', 'si001097', 1),  -- Catered Receptions II                              1795
  ('pk001015', 'si001099', 1);  -- Commemorative Collection                            495

-- Tribute Cremation Service — $7,640 → $7,590 with savings
insert into package_items (package_id, service_item_id, quantity) values
  ('pk001016', 'si001005', 1),  -- Professional Services Fees for Urn Committal       2840
  ('pk001016', 'si001010', 1),  -- Registration and Documentation                      495
  ('pk001016', 'si001012', 1),  -- Other Care and Preparation                          445
  ('pk001016', 'si001013', 1),  -- Sheltering of Remains                               445
  ('pk001016', 'si001022', 1),  -- Transfer of Remains from Place of Death             545
  ('pk001016', 'si001045', 1),  -- Estate Fraud Protection                             135
  ('pk001016', 'si001036', 1),  -- Crematory Fee                                       995
  ('pk001016', 'si001029', 1),  -- Family Support Option (Select 1)                    295
  ('pk001016', 'si001115', 1),  -- Memorial Urn Selection — Tribute Tier               595
  ('pk001016', 'si001121', 1);  -- Vancouver Casket Burlington                         850

-- Jade Cremation Plan — $14,680 → $14,275 with savings (2 family support options)
insert into package_items (package_id, service_item_id, quantity) values
  ('pk001017', 'si001001', 1),  -- Professional Services Fees for Full Service        3590
  ('pk001017', 'si001010', 1),  -- Registration and Documentation                      495
  ('pk001017', 'si001011', 1),  -- Embalming                                           625
  ('pk001017', 'si001012', 1),  -- Other Care and Preparation                          445
  ('pk001017', 'si001013', 1),  -- Sheltering of Remains                               445
  ('pk001017', 'si001022', 1),  -- Transfer of Remains from Place of Death             545
  ('pk001017', 'si001024', 1),  -- Flower Vehicle                                      295
  ('pk001017', 'si001023', 1),  -- Funeral Vehicle (Hearse)                            395
  ('pk001017', 'si001025', 1),  -- Limousine                                           395
  ('pk001017', 'si001045', 1),  -- Estate Fraud Protection                             135
  ('pk001017', 'si001091', 1),  -- Dignity Heritage Burial Flowers                     695
  ('pk001017', 'si001036', 1),  -- Crematory Fee                                       995
  ('pk001017', 'si001050', 1),  -- Premium Venue Service                               595
  ('pk001017', 'si001029', 1),  -- Family Support Option 1 (Select 2 total = $590)     295
  ('pk001017', 'si001030', 1),  -- Family Support Option 2                             295
  ('pk001017', 'si001116', 1),  -- Memorial Urn Selection — Jade Tier                  895
  ('pk001017', 'si001122', 1),  -- Vancouver Casket McConnell                         1050
  ('pk001017', 'si001098', 1);  -- Catered Receptions III                             2495
