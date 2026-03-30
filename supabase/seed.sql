-- ============================================================
-- Seed Data: Victory Memorial Park Funeral Centre
-- GPL effective February 20, 2026
-- ============================================================

-- 1. Service categories
INSERT INTO service_categories (id, name, sort_order) VALUES
  ('c1000000-0000-0000-0000-000000000001', 'Professional Staff & Services',     1),
  ('c1000000-0000-0000-0000-000000000002', 'Facilities and Supervision',         2),
  ('c1000000-0000-0000-0000-000000000003', 'Transportation',                     3),
  ('c1000000-0000-0000-0000-000000000004', 'Family Support Options',             4),
  ('c1000000-0000-0000-0000-000000000005', 'Miscellaneous Services & Merchandise',5),
  ('c1000000-0000-0000-0000-000000000006', 'Stationery',                         6),
  ('c1000000-0000-0000-0000-000000000007', 'Cash Advances',                      7);

-- 2. Funeral home
INSERT INTO funeral_homes (id, name, address, phone, website, managing_director, tax_rate) VALUES
  (
    'fh000000-0000-0000-0000-000000000001',
    'Victory Memorial Park Funeral Centre',
    '14831 28th Ave, Surrey, British Columbia V4P1P3',
    '604-536-6522',
    'www.victoryfuneralcentre.ca',
    'Caroline Povey',
    0.05  -- BC GST 5%
  );

-- ============================================================
-- 3. Service Items
-- ============================================================
-- Shorthand
DO $$
DECLARE
  fh UUID := 'fh000000-0000-0000-0000-000000000001';
  c1 UUID := 'c1000000-0000-0000-0000-000000000001';
  c2 UUID := 'c1000000-0000-0000-0000-000000000002';
  c3 UUID := 'c1000000-0000-0000-0000-000000000003';
  c4 UUID := 'c1000000-0000-0000-0000-000000000004';
  c5 UUID := 'c1000000-0000-0000-0000-000000000005';
  c6 UUID := 'c1000000-0000-0000-0000-000000000006';
  c7 UUID := 'c1000000-0000-0000-0000-000000000007';
BEGIN

-- ---- Professional Staff & Services ----
INSERT INTO service_items (id, funeral_home_id, category_id, item_code, name, price) VALUES
  ('si000001', fh, c1, NULL,           'Professional Services Fees for Full Service',                 4070.00),
  ('si000002', fh, c1, NULL,           'Professional Services Fees for Gathering Celebrations',       3920.00),
  ('si000003', fh, c1, NULL,           'Professional Services Fees for Memorial Service',             3920.00),
  ('si000004', fh, c1, NULL,           'Professional Services Fees for Graveside Service',            3795.00),
  ('si000005', fh, c1, NULL,           'Professional Service Fees for Cremation Witness',             3645.00),
  ('si000006', fh, c1, NULL,           'Basic Professional Service Fee when Forwarding Remains',      2715.00),
  ('si000007', fh, c1, NULL,           'Basic Professional Service Fees when Receiving Remains',      2715.00),
  ('si000008', fh, c1, NULL,           'Professional Services Fees for Urn Committal',                1190.00),
  ('si000009', fh, c1, NULL,           'Basic Service Fees for No Service Option',                     670.00),
  ('si000010', fh, c1, NULL,           'Registration and Documentation',                               445.00),
  ('si000011', fh, c1, 'PRPEMBMG',    'Embalming',                                                    625.00),
  ('si000012', fh, c1, 'FACSHLTR',    'Sheltering of Remains',                                        445.00),
  ('si000013', fh, c1, 'PRPOTHER',    'Other Care and Preparation',                                   445.00),
  ('si000014', fh, c1, 'PRPSPAUT',    'Special Care for Autopsied Cases',                             525.00);

-- ---- Facilities and Supervision ----
INSERT INTO service_items (id, funeral_home_id, category_id, item_code, name, price) VALUES
  ('si000020', fh, c2, NULL,           'Use of Facilities for Embalming and Preparation',             445.00),
  ('si000021', fh, c2, 'FACFBVFS',    'Basic Venue',                                                  395.00),
  ('si000022', fh, c2, 'FACFSVFS',    'Standard Venue',                                               495.00),
  ('si000023', fh, c2, 'FACFPVFS',    'Premium Venue',                                                595.00),
  ('si000024', fh, c2, 'FACFSEVC',    'Exclusive Venue',                                             2595.00),
  ('si000025', fh, c2, 'XSREVEN2',    'Celebration Gathering',                                       1595.00),
  ('si000026', fh, c2, 'SRVMRVSS',    'Venue and Staff Services to Coordinate a Simple Gathering',    895.00),
  ('si000027', fh, c2, 'SRVFOSVSSS', 'Off-Site Venue & Staff Services',                              595.00),
  ('si000028', fh, c2, 'SRVPRIVC',   'Private Family Moment at our Facility',                        295.00),
  ('si000029', fh, c2, 'SPVHRLYR',   'Supervision for Visitation Per Hour',                          395.00),
  ('si000030', fh, c2, 'SPVEVCHG',   'Supervision - Evening Charge',                                 400.00),
  ('si000031', fh, c2, 'SPVHOCHG',   'Supervision - Holiday Charge',                                 999.00),
  ('si000032', fh, c2, 'SPVFDSNT',   'Supervision of Disinterment',                                 3595.00),
  ('si000033', fh, c2, 'SRVWEECH',   'Additional Charge - Weekend',                                   999.00);

-- ---- Transportation ----
INSERT INTO service_items (id, funeral_home_id, category_id, item_code, name, description, price) VALUES
  ('si000040', fh, c3, NULL,          'Transfer of Remains from Place of Death to Funeral Home',
    'Within a 50 kilometre radius. Additional distance will be charged at $2.00 per kilometre.', 495.00),
  ('si000041', fh, c3, NULL,          'Funeral Vehicle (e.g. Hearse)',
    'Within a 50 kilometre radius. Additional distance will be charged at $2.00 per kilometre.', 395.00),
  ('si000042', fh, c3, 'VHCLIMOS',   'Limousine',
    'Within a 50 kilometre radius. Additional distance will be charged at $2.00 per kilometre.', 350.00),
  ('si000043', fh, c3, 'VHCFLRUV',   'Flower Vehicle',
    'Within a 50 kilometre radius. Additional distance will be charged at $2.00 per kilometre.', 220.00),
  ('si000044', fh, c3, NULL,          'Transfer to or from Airport',
    'Within a 50 kilometre radius. Additional distance will be charged at $2.00 per kilometre.', 395.00),
  ('si000045', fh, c3, 'XSRSHIAD',   'Shipping Administration',
    'Administration duties required to coordinate shipping of remains.', 495.00),
  ('si000046', fh, c3, 'XSRGATHR',   'Handling and Transfer of Ashes',                              NULL, 195.00);

-- ---- Family Support Options ----
INSERT INTO service_items (id, funeral_home_id, category_id, item_code, name, price) VALUES
  ('si000050', fh, c4, NULL,          'Medallion Bundle',             295.00),
  ('si000051', fh, c4, NULL,          'Timeless Touch Fingerprint',   295.00),
  ('si000052', fh, c4, 'DGSWEBCS',   'Funeral Webcasting',           295.00),
  ('si000053', fh, c4, 'XPARNRY1',   'Retractable Table Banner',     295.00),
  ('si000054', fh, c4, 'XSRDMLSP',   'Legal Service Plan',           295.00),
  ('si000055', fh, c4, 'XPRPPFN',    'Memory Portrait - 10x15 Framed Canvas Portrait', 295.00),
  ('si000056', fh, c4, 'XOTAMAZ',    'Treasure Kits',                295.00),
  ('si000057', fh, c4, 'XOTXMBK',    'Family Estate Manager',        295.00),
  ('si000058', fh, c4, 'DOCESFRP',   'Estate Fraud Protection',      135.00),
  ('si000059', fh, c4, 'MEMMCAEM',   'Everlasting Memorial',         490.00),
  ('si000060', fh, c4, 'SRVTRWG',    'Traditional Ritual Washing',   395.00);

-- ---- Miscellaneous Services & Merchandise ----
INSERT INTO service_items (id, funeral_home_id, category_id, item_code, name, price) VALUES
  ('si000070', fh, c5, 'UAAAGB',     'Standard Text Personalization',            50.00),
  ('si000071', fh, c5, 'XSMAWFE0D',  'Custom Service Folders (100)',            250.00),
  ('si000072', fh, c5, 'XFDKSSV',    'Sterling Silver Oval Pendant',            295.00),
  ('si000073', fh, c5, 'MEMMALRB',   'A Life Remembered Book',                   95.00),
  ('si000074', fh, c5, 'CRMEXPFE',   'Cremation Expediting Fee',                499.00),
  ('si000075', fh, c5, 'CRMWTNFE',   'Cremation Witnessing Fee',                499.00),
  ('si000076', fh, c5, 'CRM03PTY',   'Crematory Fee',                           995.00),
  ('si000077', fh, c5, 'XSMOT1S44',  'Our Collection Folders or Prayer Cards (per 100)', 195.00),
  ('si000078', fh, c5, 'XSMDF1S3L',  'Small Memory Folders or Memory Cards (per 100)',   220.00),
  ('si000079', fh, c5, 'XSMMD1S3L',  'Medium Memory Cards or Memory Folders (per 100)',  320.00),
  ('si000080', fh, c5, 'XSMLG1S3L',  'Large Memory Booklets or Memory Cards (per 100)',  620.00),
  ('si000081', fh, c5, 'XSMMB1S3L',  'Medium Memory Book',                       75.00),
  ('si000082', fh, c5, 'XSMAI8M8M',  'Memory Register Book',                     75.00),
  ('si000083', fh, c5, 'XSMKB1S3L',  'Keepsake Box',                             25.00),
  ('si000084', fh, c5, 'XSMBMBM5F',  'Soft Touch Bookmarks (50)',               200.00),
  ('si000085', fh, c5, 'XSMAX1S5L',  'Our Collection Thank You Cards (per 50)', 100.00),
  ('si000086', fh, c5, 'XSMEG993L',  'Personalized Thank You Cards (per 25)',    75.00),
  ('si000087', fh, c5, 'SRVPLLBR',   'Professional Pallbearer (per person)',     150.00),
  ('si000088', fh, c5, 'XSRRPAHS',   'Reception and Hostess',                   995.00),
  ('si000089', fh, c5, 'XSMCCZ09Z',  'Retractable Floor Banner',                395.00),
  ('si000090', fh, c5, 'XFDDCBR',    'Single Small Medallion Case',              65.00),
  ('si000091', fh, c5, 'XFDDCBT',    'Triple Small Medallion Case',              95.00),
  ('si000092', fh, c5, 'PKGDGNTY',   'Dignity Stationery Package',              NULL),  -- $395–$795 range
  ('si000093', fh, c5, 'UCBSWSF8DR', 'Cremation Jewellery Bundle',              295.00);

-- Range price items
UPDATE service_items SET price_min = 395.00, price_max = 795.00, is_cash_advance = FALSE
  WHERE id = 'si000092';
UPDATE service_items SET price_min = 50.00, price_max = 295.00, is_cash_advance = FALSE
  WHERE item_code = 'XAIMNAI';

INSERT INTO service_items (id, funeral_home_id, category_id, item_code, name, price_min, price_max)
  VALUES ('si000094', fh, c5, 'XAIMNAI', 'Casket Medallions', 50.00, 295.00);

-- ---- Stationery Collections ----
INSERT INTO service_items (id, funeral_home_id, category_id, item_code, name, description, price) VALUES
  ('si000100', fh, c6, 'XDPAIRC',  'Remembrance Collection',
    '1 Medium Memory Book, 100 Small Memory Folders or Memory Cards, 25 Small Tribute Thank You Cards, 1 Keepsake Box.',
    395.00),
  ('si000101', fh, c6, 'XDPAIOC',  'Our Collection',
    '1 Memory Register Book, 100 Our Collection Folders or Prayer Cards, 50 Our Collection Thank You Cards, 1 Keepsake Box.',
    395.00),
  ('si000102', fh, c6, 'XDPAICV',  'Commemorative Collection',
    '1 Medium Memory Book, 100 Medium Memory Folders or Memory Cards, 25 Medium Tribute Thank You Cards, 1 Keepsake Box.',
    495.00),
  ('si000103', fh, c6, 'XDPAIEC',  'Esteemed Collection',
    '1 Medium Memory Book, 100 Large Memory Booklets or Memory Cards, 25 Medium Tribute Thank You Cards, 1 Keepsake Box.',
    795.00);

-- ---- Cash Advances (variable / "as selected") ----
INSERT INTO service_items (id, funeral_home_id, category_id, name, is_cash_advance, price) VALUES
  ('si000110', fh, c7, 'Consumer Protection BC Fee',  FALSE, 48.00),
  ('si000111', fh, c7, 'Clergy Honorarium',            TRUE,  NULL),
  ('si000112', fh, c7, 'Death Certificate (each)',     FALSE, 27.00),
  ('si000113', fh, c7, 'Music / Soloist / Piper',      TRUE,  NULL),
  ('si000114', fh, c7, 'Newspaper Notice',              TRUE,  NULL),
  ('si000115', fh, c7, 'Organist',                      TRUE,  NULL),
  ('si000116', fh, c7, 'Soloist',                       TRUE,  NULL),
  ('si000117', fh, c7, 'Outside Funeral Director Expense', TRUE, NULL),
  ('si000118', fh, c7, 'Cemetery Fees',                 TRUE,  NULL),
  ('si000119', fh, c7, 'Public Transportation',         TRUE,  NULL);

END $$;

-- ============================================================
-- 4. Packages
-- ============================================================
DO $$
DECLARE
  fh UUID := 'fh000000-0000-0000-0000-000000000001';
BEGIN

INSERT INTO packages (id, funeral_home_id, name, total_price, sort_order) VALUES
  ('pk000001', fh, 'Full Service',            7650.00, 1),
  ('pk000002', fh, 'Witness Cremation',       7000.00, 2),
  ('pk000003', fh, 'Service of Remembrance',  7475.00, 3),
  ('pk000004', fh, 'Graveside Service',       6155.00, 4),
  ('pk000005', fh, 'Urn Committal Option',    4150.00, 5),
  ('pk000006', fh, 'No Service Option',       3630.00, 6),
  ('pk000007', fh, 'Forwarding of Remains',   5120.00, 7),
  ('pk000008', fh, 'Receiving of Remains',    3950.00, 8),
  ('pk000009', fh, 'Tea Room Gathering',      7240.00, 9);

-- Full Service: Professional (Full) + Reg/Doc + Embalming + Other Care + Sheltering + Transfer + Hearse + Estate Fraud + Premium Venue
INSERT INTO package_items (package_id, service_item_id) VALUES
  ('pk000001', 'si000001'),  -- Prof. Services Full
  ('pk000001', 'si000010'),  -- Registration & Documentation
  ('pk000001', 'si000011'),  -- Embalming
  ('pk000001', 'si000013'),  -- Other Care and Preparation
  ('pk000001', 'si000012'),  -- Sheltering of Remains
  ('pk000001', 'si000040'),  -- Transfer from place of death
  ('pk000001', 'si000041'),  -- Hearse
  ('pk000001', 'si000058'),  -- Estate Fraud Protection
  ('pk000001', 'si000023');  -- Premium Venue

-- Witness Cremation
INSERT INTO package_items (package_id, service_item_id) VALUES
  ('pk000002', 'si000005'),  -- Prof. Services Cremation Witness
  ('pk000002', 'si000010'),  -- Registration & Documentation
  ('pk000002', 'si000013'),  -- Other Care and Preparation
  ('pk000002', 'si000012'),  -- Sheltering of Remains
  ('pk000002', 'si000040'),  -- Transfer from place of death
  ('pk000002', 'si000041'),  -- Hearse
  ('pk000002', 'si000058'),  -- Estate Fraud Protection
  ('pk000002', 'si000076');  -- Crematory Fee

-- Service of Remembrance
INSERT INTO package_items (package_id, service_item_id) VALUES
  ('pk000003', 'si000003'),  -- Prof. Services Memorial
  ('pk000003', 'si000010'),  -- Registration & Documentation
  ('pk000003', 'si000013'),  -- Other Care and Preparation
  ('pk000003', 'si000012'),  -- Sheltering of Remains
  ('pk000003', 'si000040'),  -- Transfer from place of death
  ('pk000003', 'si000058'),  -- Estate Fraud Protection
  ('pk000003', 'si000076'),  -- Crematory Fee
  ('pk000003', 'si000023');  -- Premium Venue

-- Graveside Service
INSERT INTO package_items (package_id, service_item_id) VALUES
  ('pk000004', 'si000004'),  -- Prof. Services Graveside
  ('pk000004', 'si000010'),  -- Registration & Documentation
  ('pk000004', 'si000013'),  -- Other Care and Preparation
  ('pk000004', 'si000012'),  -- Sheltering of Remains
  ('pk000004', 'si000040'),  -- Transfer from place of death
  ('pk000004', 'si000041'),  -- Hearse
  ('pk000004', 'si000058');  -- Estate Fraud Protection

-- Urn Committal Option
INSERT INTO package_items (package_id, service_item_id) VALUES
  ('pk000005', 'si000008'),  -- Prof. Services Urn Committal
  ('pk000005', 'si000010'),  -- Registration & Documentation
  ('pk000005', 'si000013'),  -- Other Care and Preparation
  ('pk000005', 'si000012'),  -- Sheltering of Remains
  ('pk000005', 'si000040'),  -- Transfer from place of death
  ('pk000005', 'si000058'),  -- Estate Fraud Protection
  ('pk000005', 'si000076');  -- Crematory Fee

-- No Service Option
INSERT INTO package_items (package_id, service_item_id) VALUES
  ('pk000006', 'si000009'),  -- Basic Service Fees No Service
  ('pk000006', 'si000010'),  -- Registration & Documentation
  ('pk000006', 'si000013'),  -- Other Care and Preparation
  ('pk000006', 'si000012'),  -- Sheltering of Remains
  ('pk000006', 'si000040'),  -- Transfer from place of death
  ('pk000006', 'si000058'),  -- Estate Fraud Protection
  ('pk000006', 'si000076');  -- Crematory Fee

-- Forwarding of Remains
INSERT INTO package_items (package_id, service_item_id) VALUES
  ('pk000007', 'si000006'),  -- Basic Prof. Forwarding
  ('pk000007', 'si000010'),  -- Registration & Documentation
  ('pk000007', 'si000011'),  -- Embalming
  ('pk000007', 'si000012'),  -- Sheltering of Remains
  ('pk000007', 'si000044'),  -- Transfer to/from airport
  ('pk000007', 'si000040');  -- Transfer from place of death

-- Receiving of Remains
INSERT INTO package_items (package_id, service_item_id) VALUES
  ('pk000008', 'si000007'),  -- Basic Prof. Receiving
  ('pk000008', 'si000012'),  -- Sheltering of Remains
  ('pk000008', 'si000044'),  -- Transfer to/from airport
  ('pk000008', 'si000041');  -- Hearse

-- Tea Room Gathering
INSERT INTO package_items (package_id, service_item_id) VALUES
  ('pk000009', 'si000022'),  -- Standard Venue
  ('pk000009', 'si000002'),  -- Prof. Services Gathering Celebrations
  ('pk000009', 'si000088'),  -- Reception and Hostess
  ('pk000009', 'si000012'),  -- Sheltering of Remains
  ('pk000009', 'si000013'),  -- Other Care and Preparation
  ('pk000009', 'si000010'),  -- Registration & Documentation
  ('pk000009', 'si000040');  -- Transfer from place of death

END $$;
