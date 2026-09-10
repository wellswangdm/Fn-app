-- ─────────────────────────────────────────────────────────────────────────────
-- SEED DATA — First Memorial Funeral Services Fraser Heights Chapel (3813)
-- Run AFTER schema.sql and seed.sql (the shared casket_catalog base + service
-- categories live in seed.sql). Prices effective August 12, 2026.
-- Casket photos are reused from the shared casket_catalog (照片通用): 3813
-- links to existing catalog entries via funeral_home_caskets; only 5 caskets
-- not already in the catalog get new (image-less) catalog rows.
-- Safe to re-run.
-- ─────────────────────────────────────────────────────────────────────────────

-- ─── Funeral Home ─────────────────────────────────────────────────────────────

insert into funeral_homes (id, name, address, phone, website, tax_rate) values
  ('3813',
   'First Memorial Funeral Services Fraser Heights Chapel',
   '14835 Fraser Highway, Surrey, BC V3R 3N6',
   '604-589-2559',
   'www.firstmemorialsurrey.com',
   0.05)
  on conflict (id) do nothing;

-- ─── Service Categories (shared — idempotent) ────────────────────────────────

insert into service_categories (id, name, sort_order) values
  ('c1000000-0000-0000-0000-000000000001', 'Professional Staff & Services',        1),
  ('c1000000-0000-0000-0000-000000000002', 'Facilities and Supervision',            2),
  ('c1000000-0000-0000-0000-000000000003', 'Transportation',                        3),
  ('c1000000-0000-0000-0000-000000000004', 'Family Support Options',                4),
  ('c1000000-0000-0000-0000-000000000005', 'Miscellaneous Services & Merchandise',  5),
  ('c1000000-0000-0000-0000-000000000006', 'Stationery',                            6),
  ('c1000000-0000-0000-0000-000000000007', 'Cash Advances',                         7),
  ('c1000000-0000-0000-0000-000000000008', 'Caskets & Containers',                  8),
  ('c1000000-0000-0000-0000-000000000009', 'Urns',                                  9),
  ('c1000000-0000-0000-0000-000000000010', 'Keepsakes',                            10),
  ('c1000000-0000-0000-0000-000000000011', 'Jewelry',                              11)
  on conflict (id) do nothing;

-- ─── New casket_catalog entries (only those NOT already in the shared catalog) ─
-- These 5 caskets are on the 3813 casket price list but not yet in the global
-- catalog. No image_url (no shared photo). All other 3813 caskets reuse
-- existing catalog entries (and their images) via funeral_home_caskets below.
insert into casket_catalog (id, name, description, manufacturer, item_code, category, sort_order) values
  ('csk082', 'Pearson Cherry',            'Cherry casket with a medium cherry stain, hand-rubbed, gloss finish exterior and champagne velvet interior.', 'Batesville',       'CWCHBAQUBQ', 'wood',      82),
  ('csk083', 'Brandon',                   'Select hardwood casket with a medium finished exterior and a rosetan crepe interior.',                        'Batesville',       'CWHWBBENFD', 'wood',      83),
  ('csk084', 'Homeward',                  'Solid hardwood casket veneer sided with Titian polished exterior and tan crepe interior.',                    'Victoriaville',    'CWHWLCKJGQ', 'wood',      84),
  ('csk085', 'Lambert',                   'Select hardwood casket with a medium finished exterior and rosetan crepe interior.',                          'Batesville',       'CWHWBCRDFD', 'wood',      85),
  ('csk086', 'Universal Basic Container', 'Cremation container with interior.',                                                                          'Vancouver Casket', 'CCVUBCC',    'container', 86)
  on conflict (id) do nothing;

-- ─── 3813 casket pricing ──────────────────────────────────────────────────────
-- Effective Aug 12, 2026. catalog_id reuses shared entries so photos are common.
insert into funeral_home_caskets (funeral_home_id, catalog_id, price, sort_order) values
  -- Wood Caskets
  ('3813', 'csk063', 7199.00,  1),  -- Pieta Maple
  ('3813', 'csk024', 6499.00,  2),  -- Classic Mahogany
  ('3813', 'csk025', 6499.00,  3),  -- Jamestown PC
  ('3813', 'csk015', 6499.00,  4),  -- Prominence
  ('3813', 'csk027', 5699.00,  5),  -- Woodbridge Pecan
  ('3813', 'csk028', 5199.00,  6),  -- St. Thomas Oak
  ('3813', 'csk029', 5099.00,  7),  -- Mansfield-27
  ('3813', 'csk082', 5099.00,  8),  -- Pearson Cherry (new)
  ('3813', 'csk030', 4699.00,  9),  -- Briar Hill
  ('3813', 'csk031', 4699.00, 10),  -- Camden Oak
  ('3813', 'csk032', 4699.00, 11),  -- Cameron Oak
  ('3813', 'csk034', 4699.00, 12),  -- Rosette
  ('3813', 'csk035', 4699.00, 13),  -- Victoria Cherry
  ('3813', 'csk075', 4499.00, 14),  -- Lotus
  ('3813', 'csk037', 4099.00, 15),  -- Brexton
  ('3813', 'csk014', 4099.00, 16),  -- Dominion HC Wood Maple Crepe
  ('3813', 'csk004', 4099.00, 17),  -- Eleanor Oak
  ('3813', 'csk003', 4099.00, 18),  -- Fireside
  ('3813', 'csk038', 4099.00, 19),  -- Hadyn
  ('3813', 'csk007', 3599.00, 20),  -- Bailey
  ('3813', 'csk008', 3599.00, 21),  -- Hartvic
  ('3813', 'csk039', 3599.00, 22),  -- Sherwood Oak
  ('3813', 'csk006', 3599.00, 23),  -- Watson
  ('3813', 'csk009', 2999.00, 24),  -- Coleridge
  ('3813', 'csk040', 2999.00, 25),  -- Constance
  ('3813', 'csk010', 2999.00, 26),  -- Montgomery
  ('3813', 'csk076', 2999.00, 27),  -- Westcott
  ('3813', 'csk041', 2999.00, 28),  -- White Rose
  ('3813', 'csk012', 2999.00, 29),  -- Winfield
  ('3813', 'csk083', 2899.00, 30),  -- Brandon (new)
  ('3813', 'csk042', 2899.00, 31),  -- Carnaby
  ('3813', 'csk084', 2899.00, 32),  -- Homeward (new)
  ('3813', 'csk085', 2899.00, 33),  -- Lambert (new)
  ('3813', 'csk043', 2799.00, 34),  -- Atlantic
  ('3813', 'csk044', 2799.00, 35),  -- Natura
  ('3813', 'csk045', 2799.00, 36),  -- Oxford
  ('3813', 'csk013', 2599.00, 37),  -- Freelton
  ('3813', 'csk046', 2599.00, 38),  -- Schafer
  ('3813', 'csk072', 2099.00, 39),  -- Butler
  -- Metal Caskets
  ('3813', 'csk049', 5199.00, 40),  -- Golden Granite
  ('3813', 'csk050', 5099.00, 41),  -- Primrose
  ('3813', 'csk051', 4299.00, 42),  -- Merlot-28
  ('3813', 'csk001', 4099.00, 43),  -- Merlot
  ('3813', 'csk052', 3599.00, 44),  -- Antique Blue-28
  ('3813', 'csk005', 3599.00, 45),  -- Misty Blue
  -- Other Caskets
  ('3813', 'csk079', 1099.00, 46),  -- Grey Malet
  -- Cremation Oriented Caskets
  ('3813', 'csk053', 1050.00, 47),  -- McConnell
  ('3813', 'csk071',  850.00, 48),  -- Burlington
  ('3813', 'cont003', 650.00, 49),  -- Cypress
  ('3813', 'csk086',  525.00, 50),  -- Universal Basic Container (new)
  -- Rental Caskets
  ('3813', 'cont001', 1599.00, 53), -- Brockton Oak Ceremonial
  ('3813', 'cont002',  850.00, 54)  -- Brockton Oak (1 Hour Rental)
  on conflict (funeral_home_id, catalog_id) do update set price = excluded.price, sort_order = excluded.sort_order;

-- ─── Service Items ────────────────────────────────────────────────────────────

insert into service_items (id, funeral_home_id, category_id, item_code, name, description, price, price_min, price_max, is_cash_advance, sort_order) values
  -- Professional Staff & Services
  ('si005001', '3813', 'c1000000-0000-0000-0000-000000000001', NULL, 'Professional Services Fees for Full Service',                              NULL, 2950.00, NULL, NULL, false,  1),
  ('si005002', '3813', 'c1000000-0000-0000-0000-000000000001', NULL, 'Professional Services Fees for Gathering Celebrations',                    NULL, 2295.00, NULL, NULL, false,  2),
  ('si005003', '3813', 'c1000000-0000-0000-0000-000000000001', NULL, 'Professional Services Fees for Memorial Service',                          NULL, 2550.00, NULL, NULL, false,  3),
  ('si005004', '3813', 'c1000000-0000-0000-0000-000000000001', NULL, 'Professional Services Fees for Graveside Service',                         NULL, 2900.00, NULL, NULL, false,  4),
  ('si005005', '3813', 'c1000000-0000-0000-0000-000000000001', NULL, 'Professional Service Fees of Funeral Director and Staff for Cremation Witness', NULL, 1550.00, NULL, NULL, false, 5),
  ('si005006', '3813', 'c1000000-0000-0000-0000-000000000001', NULL, 'Basic Professional Service Fee when Forwarding Remains',                   NULL, 1695.00, NULL, NULL, false,  6),
  ('si005007', '3813', 'c1000000-0000-0000-0000-000000000001', NULL, 'Basic Professional Service Fees when Receiving Remains',                   NULL, 1695.00, NULL, NULL, false,  7),
  ('si005009', '3813', 'c1000000-0000-0000-0000-000000000001', NULL, 'Basic Service Fees for No Service Option',                                 NULL,  325.00, NULL, NULL, false,  8),
  ('si005010', '3813', 'c1000000-0000-0000-0000-000000000001', NULL, 'Registration and Documentation',                                          NULL,  445.00, NULL, NULL, false,  9),
  ('si005011', '3813', 'c1000000-0000-0000-0000-000000000001', 'PRPEMBMG', 'Embalming',                                                          NULL,  625.00, NULL, NULL, false, 10),
  ('si005012', '3813', 'c1000000-0000-0000-0000-000000000001', 'FACSHLTR', 'Sheltering of Remains',                                              NULL,  445.00, NULL, NULL, false, 11),
  ('si005013', '3813', 'c1000000-0000-0000-0000-000000000001', 'PRPOTHER', 'Other Care and Preparation',                                         NULL,  445.00, NULL, NULL, false, 12),
  ('si005014', '3813', 'c1000000-0000-0000-0000-000000000001', 'PRPSPAUT', 'Special Care for Autopsied Cases',                                   NULL,  525.00, NULL, NULL, false, 13),
  -- Facilities and Supervision
  ('si005021', '3813', 'c1000000-0000-0000-0000-000000000002', 'FACFBVFS', 'Basic Venue',            'Basic Venue at our location for service or gathering.',                       395.00, NULL, NULL, false,  1),
  ('si005022', '3813', 'c1000000-0000-0000-0000-000000000002', 'FACFSVFS', 'Standard Venue',         'Flexible space in our location for service or gathering.',                    495.00, NULL, NULL, false,  2),
  ('si005023', '3813', 'c1000000-0000-0000-0000-000000000002', 'FACFPVFS', 'Premium Venue',          'Larger flexible space in our location for service or gathering.',             595.00, NULL, NULL, false,  3),
  ('si005024', '3813', 'c1000000-0000-0000-0000-000000000002', 'FACFSEVC', 'Exclusive Venue',        'Exclusive use of all ceremony and visitation venues in the location for the duration of the visitation and ceremony.', 2595.00, NULL, NULL, false, 4),
  ('si005026', '3813', 'c1000000-0000-0000-0000-000000000002', 'SRVMRVSS', 'Venue and Staff Services to coordinate a Simple Gathering', 'An intimate gathering of ten to twelve family and friends to celebrate a life.', 795.00, NULL, NULL, false, 5),
  ('si005027', '3813', 'c1000000-0000-0000-0000-000000000002', 'SRVFOSVSSS', 'Off-Site Venue & Staff Services', 'Off-Site Venue & Staff Services for location of celebration.',              595.00, NULL, NULL, false,  6),
  ('si005028', '3813', 'c1000000-0000-0000-0000-000000000002', 'SRVPRIVLT', 'Private Family Moment', 'Private Family Moment at our facility for a limited time with limited family members.', 345.00, NULL, NULL, false, 7),
  ('si005029', '3813', 'c1000000-0000-0000-0000-000000000002', 'SPVHRLYR', 'Supervision for Visitation Per Hour',                                 NULL,  395.00, NULL, NULL, false,  8),
  ('si005030', '3813', 'c1000000-0000-0000-0000-000000000002', 'SPVEVCHG', 'Supervision - Evening Charge',                                        NULL,  795.00, NULL, NULL, false,  9),
  ('si005031', '3813', 'c1000000-0000-0000-0000-000000000002', 'FACHOCHG', 'Additional Charge - Use of Facilities on Holidays',                   NULL, 2000.00, NULL, NULL, false, 10),
  ('si005032', '3813', 'c1000000-0000-0000-0000-000000000002', 'FDFDSNTR', 'Supervision of Disinterment',                                         NULL, 3595.00, NULL, NULL, false, 11),
  ('si005033', '3813', 'c1000000-0000-0000-0000-000000000002', 'SRVAUFSS', 'Additional Charge - Saturday Service',                                NULL, 1000.00, NULL, NULL, false, 12),
  ('si005034', '3813', 'c1000000-0000-0000-0000-000000000002', 'SRVAUFSO', 'Additional Charge - Sunday Service',                                  NULL, 1750.00, NULL, NULL, false, 13),
  ('si005035', '3813', 'c1000000-0000-0000-0000-000000000002', 'SRVURNCM', 'Staff Services for Urn Committal', 'Equipment and staff services for urn committal, including accompaniment of remains to cemetery, supervision of service, and staff to assist.', 445.00, NULL, NULL, false, 14),
  -- Transportation
  ('si005040', '3813', 'c1000000-0000-0000-0000-000000000003', NULL, 'Transfer of Remains from Place of Death to Funeral Home', 'Within a 50 kilometre radius. Additional distance will be charged at $2 per kilometre.', 495.00, NULL, NULL, false, 1),
  ('si005041', '3813', 'c1000000-0000-0000-0000-000000000003', NULL, 'Funeral Vehicle (e.g. Hearse)',                          'Within a 50 kilometre radius. Additional distance will be charged at $2 per kilometre.', 395.00, NULL, NULL, false, 2),
  ('si005042', '3813', 'c1000000-0000-0000-0000-000000000003', 'VHCLIMOS', 'Limousine',                                        'Within a 50 kilometre radius. Additional distance will be charged at $2 per kilometre.', 350.00, NULL, NULL, false, 3),
  ('si005043', '3813', 'c1000000-0000-0000-0000-000000000003', 'VHCFLRUV', 'Flower Vehicle',                                   'Within a 50 kilometre radius. Additional distance will be charged at $2 per kilometre.', 220.00, NULL, NULL, false, 4),
  ('si005044', '3813', 'c1000000-0000-0000-0000-000000000003', NULL, 'Transfer to or from Airport',                            'Within a 50 kilometre radius. Additional distance will be charged at $2 per kilometre.', 395.00, NULL, NULL, false, 5),
  ('si005045', '3813', 'c1000000-0000-0000-0000-000000000003', 'XSRSHIAD', 'Shipping Administration',                          'Administration duties required to coordinate shipping of remains.',                       495.00, NULL, NULL, false, 6),
  ('si005046', '3813', 'c1000000-0000-0000-0000-000000000003', 'XSRGATHR', 'Handling and Transfer of Ashes',                   NULL,  195.00, NULL, NULL, false, 7),
  ('si005047', '3813', 'c1000000-0000-0000-0000-000000000003', 'XSRDLOAH', 'Delivery of Ashes',                                'Delivery of ashes within 20 km.',                                                          50.00, NULL, NULL, false, 8),
  -- Family Support Options
  ('si005050', '3813', 'c1000000-0000-0000-0000-000000000004', 'XAIMNLS',  'Medallion Bundle',                    'Select 5 solid bronze 1.75" keepsake medallions with engraved name and dates, each in a felt presentation pouch.', 295.00, NULL, NULL, false, 1),
  ('si005051', '3813', 'c1000000-0000-0000-0000-000000000004', 'XFDKSTE',  'Timeless Touch Fingerprint Selection', 'Fingerprint keepsake featuring your loved one''s fingerprint with the option to engrave a special message. Choose from four unique pieces.', 295.00, NULL, NULL, false, 2),
  ('si005052', '3813', 'c1000000-0000-0000-0000-000000000004', 'DGSWEBCS', 'Funeral Webcasting',                  'Allow those who cannot attend in person to watch the service online, broadcast live with a video recording available afterward.', 295.00, NULL, NULL, false, 3),
  ('si005053', '3813', 'c1000000-0000-0000-0000-000000000004', 'XPARNRY1', 'Retractable Table Banner',            'Table banner showcasing up to 4 pictures with a personalized design and optional QR code. 11.75" x 17".', 295.00, NULL, NULL, false, 4),
  ('si005054', '3813', 'c1000000-0000-0000-0000-000000000004', 'XSRDMLSP', 'Legal Service Plan',                  'Unlimited 24/7 telephone consultations with experienced estate lawyers, plus a 12-month membership and legal support in other areas of practice.', 295.00, NULL, NULL, false, 5),
  ('si005055', '3813', 'c1000000-0000-0000-0000-000000000004', 'XPRPPFN',  'Memory Portrait',                     'A favourite photograph reproduced on canvas in the style of an oil painting, with three frame choices — Elegance, Contemporary or Classic.', 295.00, NULL, NULL, false, 6),
  ('si005057', '3813', 'c1000000-0000-0000-0000-000000000004', 'XOTXMBK',  'Family Estate Manager',               'A comprehensive, step-by-step tool that simplifies settling your loved one''s estate, with immediate access to legal professionals.', 295.00, NULL, NULL, false, 7),
  -- Miscellaneous Services & Merchandise
  ('si005058', '3813', 'c1000000-0000-0000-0000-000000000005', 'DOCESFRP', 'Estate Fraud Protection',             'Fraud specialists notify the credit reporting agencies to help protect your loved one''s estate from security breaches.', 145.00, NULL, NULL, false, 1),
  ('si005059', '3813', 'c1000000-0000-0000-0000-000000000005', 'MEMMCAEM', 'Everlasting Memorial',                'We turn your family''s memories into thoughtful keepsakes — choose a theme, share photos and videos, and our team creates polished mementos.', 490.00, NULL, NULL, false, 2),
  ('si005060', '3813', 'c1000000-0000-0000-0000-000000000005', 'SRVTRWG',  'Traditional Ritual Washing',          NULL,  395.00, NULL, NULL, false,  3),
  ('si005070', '3813', 'c1000000-0000-0000-0000-000000000005', 'XFDKSSV',  'Sterling Silver Oval Pendant',        '.925 sterling silver oval pendant with thumbprint on a sterling silver curb style chain with spring ring clasp.', 295.00, NULL, NULL, false, 4),
  ('si005071', '3813', 'c1000000-0000-0000-0000-000000000005', 'XPARBMZA', 'Star Gaze Frame Gold 11x14',          'A custom framed print of a star chart depicting the night sky from a specific date and location. 11x14 gold champagne frame matted to 8x10.', 295.00, NULL, NULL, false, 5),
  ('si005072', '3813', 'c1000000-0000-0000-0000-000000000005', 'XFDPFZA',  'Star Gaze Frame 16x20',               'A custom framed print of a star chart depicting the night sky from a specific date and location. 16x20 black shadowbox matted to 11x14.', 295.00, NULL, NULL, false, 6),
  ('si005073', '3813', 'c1000000-0000-0000-0000-000000000005', 'MEMMALRB', 'A Life Remembered Book',              NULL,   95.00, NULL, NULL, false,  7),
  ('si005074', '3813', 'c1000000-0000-0000-0000-000000000005', 'CRMEXPFE', 'Cremation Expediting Fee',            NULL,  495.00, NULL, NULL, false,  8),
  ('si005075', '3813', 'c1000000-0000-0000-0000-000000000005', 'CRMWTNFE', 'Cremation Witnessing Fee',            NULL,  595.00, NULL, NULL, false,  9),
  ('si005076', '3813', 'c1000000-0000-0000-0000-000000000005', 'CRM03PTY', 'Crematory Fee',                       NULL, 1095.00, NULL, NULL, false, 10),
  ('si005077', '3813', 'c1000000-0000-0000-0000-000000000005', 'XSREQPRT', 'Cemetery Equipment Rental Fee',       NULL,  375.00, NULL, NULL, false, 11),
  ('si005078', '3813', 'c1000000-0000-0000-0000-000000000005', 'XSMOT1S44','Our Collection Folders or Prayer Cards (per 100)', 'Choose from a selection of themes available on site.',                195.00, NULL, NULL, false, 12),
  ('si005079', '3813', 'c1000000-0000-0000-0000-000000000005', 'XAIMNAI',  'Casket Medallions',                   'Memorial keepsake that reflects the life of the individual and is displayed in specific caskets.', NULL, 50.00, 295.00, false, 13),
  ('si005080', '3813', 'c1000000-0000-0000-0000-000000000005', 'XSMAX1S5L','Our Collection Thank You Cards (per 50)',   NULL,  100.00, NULL, NULL, false, 14),
  ('si005081', '3813', 'c1000000-0000-0000-0000-000000000005', 'XSMEG993L','Personalized Thank You Cards (per 25)',     NULL,   75.00, NULL, NULL, false, 15),
  ('si005082', '3813', 'c1000000-0000-0000-0000-000000000005', 'SRVPLLBR', 'Professional Pallbearer (per person)',      NULL,  150.00, NULL, NULL, false, 16),
  ('si005083', '3813', 'c1000000-0000-0000-0000-000000000005', 'XSRRPAHS', 'Reception and Hostess',                    NULL,  695.00, NULL, NULL, false, 17),
  ('si005084', '3813', 'c1000000-0000-0000-0000-000000000005', 'XSMCCZ09Z','Retractable Floor Banner',                 NULL,  395.00, NULL, NULL, false, 18),
  ('si005085', '3813', 'c1000000-0000-0000-0000-000000000005', 'XFDDCBR',  'Single Small Medallion Case',              NULL,   65.00, NULL, NULL, false, 19),
  ('si005086', '3813', 'c1000000-0000-0000-0000-000000000005', 'XSMBMBM5F','Soft Touch Bookmarks (50)',                 NULL,  200.00, NULL, NULL, false, 20),
  ('si005087', '3813', 'c1000000-0000-0000-0000-000000000005', 'XSMAI8M8M','Memory Register Book',                     'The Ivory Register serves as a classic guest register for families and is printed on site.', 75.00, NULL, NULL, false, 21),
  ('si005088', '3813', 'c1000000-0000-0000-0000-000000000005', 'XSMKB1S3L','Keepsake Box',                             'Modern keepsake box with a magnetic closure to preserve precious memories. 11.5" x 10" x 3.75".', 25.00, NULL, NULL, false, 22),
  ('si005089', '3813', 'c1000000-0000-0000-0000-000000000005', 'XFDDCBT',  'Triple Small Medallion Case',              NULL,   95.00, NULL, NULL, false, 23),
  -- Package flowers (used by named packages)
  ('si005202', '3813', 'c1000000-0000-0000-0000-000000000005', NULL, 'Dignity Heritage Burial Flowers',    NULL, 695.00, NULL, NULL, false, 24),
  ('si005203', '3813', 'c1000000-0000-0000-0000-000000000005', NULL, 'Dignity Honour Burial Flowers',      NULL, 595.00, NULL, NULL, false, 25),
  ('si005204', '3813', 'c1000000-0000-0000-0000-000000000005', NULL, 'Dignity Tribute Burial Flowers',     NULL, 495.00, NULL, NULL, false, 26),
  ('si005205', '3813', 'c1000000-0000-0000-0000-000000000005', NULL, 'Dignity Heritage Cremation Flowers', NULL, 500.00, NULL, NULL, false, 27),
  ('si005206', '3813', 'c1000000-0000-0000-0000-000000000005', NULL, 'Dignity Honour Cremation Flowers',   NULL, 400.00, NULL, NULL, false, 28),
  -- Stationery
  ('si005100', '3813', 'c1000000-0000-0000-0000-000000000006', 'XDPAIRC', 'Remembrance Collection',   '1 Medium Memory Book, choice of 100 Small Memory Folders or Memory Cards, choice of 25 Small Tribute Thank You Cards and 1 Keepsake Box.', 395.00, NULL, NULL, false, 1),
  ('si005101', '3813', 'c1000000-0000-0000-0000-000000000006', 'XDPAIOC', 'Our Collection',           '1 Memory Register Book, choice of 100 Our Collection Folders or Prayer Cards, choice of 50 Our Collection Thank You Cards and 1 Keepsake Box.', 395.00, NULL, NULL, false, 2),
  ('si005102', '3813', 'c1000000-0000-0000-0000-000000000006', 'XDPAICV', 'Commemorative Collection', '1 Medium Memory Book, choice of 100 Medium Memory Folders or Memory Cards, choice of 25 Medium Tribute Thank You Cards or Signature Thank You Cards and 1 Keepsake Box.', 495.00, NULL, NULL, false, 3),
  ('si005103', '3813', 'c1000000-0000-0000-0000-000000000006', 'XDPAIEC', 'Esteemed Collection',      '1 Medium Memory Book, choice of 100 Large Memory Booklets or Memory Cards, choice of 25 Medium Tribute Thank You Cards or Signature Thank You Cards and 1 Keepsake Box.', 795.00, NULL, NULL, false, 4),
  -- Cash Advances
  ('si005110', '3813', 'c1000000-0000-0000-0000-000000000007', NULL, 'Consumer Protection BC Fee',              NULL, 48.00, NULL, NULL, false, 1),
  ('si005111', '3813', 'c1000000-0000-0000-0000-000000000007', NULL, 'Celebrant - Officiant for Service',       NULL, NULL, NULL, NULL, true,  2),
  ('si005112', '3813', 'c1000000-0000-0000-0000-000000000007', NULL, 'Cemetery Fees',                           NULL, NULL, NULL, NULL, true,  3),
  ('si005113', '3813', 'c1000000-0000-0000-0000-000000000007', NULL, 'Clergy Honorarium',                       NULL, NULL, NULL, NULL, true,  4),
  ('si005114', '3813', 'c1000000-0000-0000-0000-000000000007', NULL, 'Death Certificate',                       NULL, NULL, NULL, NULL, true,  5),
  ('si005115', '3813', 'c1000000-0000-0000-0000-000000000007', NULL, 'Hostess Fee',                             NULL, NULL, NULL, NULL, true,  6),
  ('si005116', '3813', 'c1000000-0000-0000-0000-000000000007', NULL, 'Music / Soloist / Piper',                 NULL, NULL, NULL, NULL, true,  7),
  ('si005117', '3813', 'c1000000-0000-0000-0000-000000000007', NULL, 'Newspaper Notice',                        NULL, NULL, NULL, NULL, true,  8),
  ('si005118', '3813', 'c1000000-0000-0000-0000-000000000007', NULL, 'Organist',                                NULL, NULL, NULL, NULL, true,  9),
  ('si005119', '3813', 'c1000000-0000-0000-0000-000000000007', NULL, 'Soloist',                                 NULL, NULL, NULL, NULL, true, 10),
  ('si005120', '3813', 'c1000000-0000-0000-0000-000000000007', NULL, 'Outside Funeral Director Expense',        NULL, NULL, NULL, NULL, true, 11),
  ('si005121', '3813', 'c1000000-0000-0000-0000-000000000007', NULL, 'Public Transportation',                   NULL, NULL, NULL, NULL, true, 12),
  ('si005122', '3813', 'c1000000-0000-0000-0000-000000000007', NULL, 'Certified Copies of the Death Certificate', NULL, NULL, NULL, NULL, true, 13),
  -- PPL package components — Catered Receptions
  ('si005207', '3813', 'c1000000-0000-0000-0000-000000000002', NULL, 'Catered Receptions III', NULL, 1795.00, NULL, NULL, false, 15),
  ('si005208', '3813', 'c1000000-0000-0000-0000-000000000002', NULL, 'Catered Receptions II',  NULL, 1295.00, NULL, NULL, false, 16),
  ('si005209', '3813', 'c1000000-0000-0000-0000-000000000002', NULL, 'Catered Receptions I',   NULL,  795.00, NULL, NULL, false, 17),
  -- Urns — Memorial Urn Selection tiers (individual urn catalog appended below)
  ('si005300', '3813', 'c1000000-0000-0000-0000-000000000009', NULL, 'Memorial Urn Selection — Heritage Tier', 'Choice of: LoveUrns Elegant Leaf, Urnes Bégin Serenity Tree, RK Productions In Flight, or Urnes Bégin Classic Stained Maple.', 995.00, NULL, NULL, false, 1),
  ('si005301', '3813', 'c1000000-0000-0000-0000-000000000009', NULL, 'Memorial Urn Selection — Honour Tier',   'Choice of: Urnes Bégin Versatile Urn Navy, LoveUrns Laurel Midnight, Terrybear Satori Ocean Pearl, or Batesville Memento Chest.', 795.00, NULL, NULL, false, 2),
  ('si005302', '3813', 'c1000000-0000-0000-0000-000000000009', NULL, 'Memorial Urn Selection — Tribute Tier',  'Choice of: LoveUrns Laurel Crimson, Urnes Bégin Sky Pewter, Mackenzie Classic Sky Blue, or Batesville Cherry Chest.', 595.00, NULL, NULL, false, 3);

-- NOTE: the full individual urn catalog (si005303+) is in the
-- "Individual Urn Catalog" section at the end of this file.

-- ─── Packages ─────────────────────────────────────────────────────────────────

insert into packages (id, funeral_home_id, name, pkg_type, total_price, package_discount, default_casket_id, sort_order) values
  -- Named packages (Package Price List)
  ('pk005010', '3813', 'Heritage Funeral Service',   'package', 15404.00, 460.00, 'csk001',  10),
  ('pk005011', '3813', 'Honour Funeral Service',     'package', 14004.00, 420.00, 'csk005',  11),
  ('pk005012', '3813', 'Tribute Funeral Service',    'package', 12704.00, 380.00, 'csk009',  12),
  ('pk005013', '3813', 'Heritage Cremation Service', 'package', 14799.00, 440.00, 'cont001', 13),
  ('pk005014', '3813', 'Honour Cremation Service',   'package', 11330.00, 340.00, 'cont003', 14),
  ('pk005015', '3813', 'Tribute Cremation Service',  'package',  5605.00,  50.00, 'csk086',  15),
  -- A la carte service offerings (General Price List)
  ('pk005001', '3813', 'Full Service',           'alacarte', 6540.00, 0.00, NULL, 1),
  ('pk005002', '3813', 'Witness Cremation',      'alacarte', 5015.00, 0.00, NULL, 2),
  ('pk005003', '3813', 'Service of Remembrance', 'alacarte', 6215.00, 0.00, NULL, 3),
  ('pk005004', '3813', 'Graveside Service',      'alacarte', 5270.00, 0.00, NULL, 4),
  ('pk005006', '3813', 'No Service Option',      'alacarte', 3395.00, 0.00, NULL, 6),
  ('pk005007', '3813', 'Forwarding of Remains',  'alacarte', 4100.00, 0.00, NULL, 7),
  ('pk005008', '3813', 'Receiving of Remains',   'alacarte', 2930.00, 0.00, NULL, 8);

-- ─── Package Items ────────────────────────────────────────────────────────────

insert into package_items (package_id, service_item_id, quantity, sort_order, is_optional) values
  -- Full Service (pk005001)
  ('pk005001','si005001',1,1,false),('pk005001','si005010',1,2,false),('pk005001','si005011',1,3,false),
  ('pk005001','si005013',1,4,false),('pk005001','si005012',1,5,false),('pk005001','si005040',1,6,false),
  ('pk005001','si005041',1,7,false),('pk005001','si005058',1,8,false),('pk005001','si005023',1,9,false),
  -- Witness Cremation (pk005002)
  ('pk005002','si005005',1,1,false),('pk005002','si005010',1,2,false),('pk005002','si005013',1,3,false),
  ('pk005002','si005012',1,4,false),('pk005002','si005040',1,5,false),('pk005002','si005041',1,6,false),
  ('pk005002','si005058',1,7,false),('pk005002','si005076',1,8,false),
  -- Service of Remembrance (pk005003)
  ('pk005003','si005003',1,1,false),('pk005003','si005010',1,2,false),('pk005003','si005013',1,3,false),
  ('pk005003','si005012',1,4,false),('pk005003','si005040',1,5,false),('pk005003','si005058',1,6,false),
  ('pk005003','si005076',1,7,false),('pk005003','si005023',1,8,false),
  -- Graveside Service (pk005004)
  ('pk005004','si005004',1,1,false),('pk005004','si005010',1,2,false),('pk005004','si005013',1,3,false),
  ('pk005004','si005012',1,4,false),('pk005004','si005040',1,5,false),('pk005004','si005041',1,6,false),
  ('pk005004','si005058',1,7,false),
  -- No Service Option (pk005006)
  ('pk005006','si005009',1,1,false),('pk005006','si005010',1,2,false),('pk005006','si005013',1,3,false),
  ('pk005006','si005012',1,4,false),('pk005006','si005040',1,5,false),('pk005006','si005058',1,6,false),
  ('pk005006','si005076',1,7,false),
  -- Forwarding of Remains (pk005007)
  ('pk005007','si005006',1,1,false),('pk005007','si005010',1,2,false),('pk005007','si005011',1,3,false),
  ('pk005007','si005012',1,4,false),('pk005007','si005044',1,5,false),('pk005007','si005040',1,6,false),
  -- Receiving of Remains (pk005008)
  ('pk005008','si005007',1,1,false),('pk005008','si005012',1,2,false),('pk005008','si005044',1,3,false),
  ('pk005008','si005041',1,4,false),
  -- Heritage Funeral Service (pk005010) — casket via default_casket_id (csk001)
  ('pk005010','si005001',1,1,false),('pk005010','si005010',1,2,false),('pk005010','si005011',1,3,false),
  ('pk005010','si005013',1,4,false),('pk005010','si005012',1,5,false),('pk005010','si005040',1,6,false),
  ('pk005010','si005041',1,7,false),('pk005010','si005059',1,8,false),('pk005010','si005058',1,9,false),
  ('pk005010','si005083',1,10,true),('pk005010','si005202',1,11,false),('pk005010','si005023',1,12,false),
  ('pk005010','si005050',1,13,true),('pk005010','si005207',1,14,true),('pk005010','si005103',1,15,false),
  -- Honour Funeral Service (pk005011) — casket csk005
  ('pk005011','si005001',1,1,false),('pk005011','si005010',1,2,false),('pk005011','si005011',1,3,false),
  ('pk005011','si005013',1,4,false),('pk005011','si005012',1,5,false),('pk005011','si005040',1,6,false),
  ('pk005011','si005041',1,7,false),('pk005011','si005059',1,8,false),('pk005011','si005058',1,9,false),
  ('pk005011','si005083',1,10,true),('pk005011','si005203',1,11,false),('pk005011','si005023',1,12,false),
  ('pk005011','si005050',1,13,true),('pk005011','si005208',1,14,true),('pk005011','si005102',1,15,false),
  -- Tribute Funeral Service (pk005012) — casket csk009
  ('pk005012','si005001',1,1,false),('pk005012','si005010',1,2,false),('pk005012','si005011',1,3,false),
  ('pk005012','si005013',1,4,false),('pk005012','si005012',1,5,false),('pk005012','si005040',1,6,false),
  ('pk005012','si005041',1,7,false),('pk005012','si005059',1,8,false),('pk005012','si005058',1,9,false),
  ('pk005012','si005083',1,10,true),('pk005012','si005204',1,11,false),('pk005012','si005023',1,12,false),
  ('pk005012','si005050',1,13,true),('pk005012','si005209',1,14,true),('pk005012','si005100',1,15,false),
  -- Heritage Cremation Service (pk005013) — container cont001
  ('pk005013','si005001',1,1,false),('pk005013','si005010',1,2,false),('pk005013','si005011',1,3,false),
  ('pk005013','si005013',1,4,false),('pk005013','si005012',1,5,false),('pk005013','si005040',1,6,false),
  ('pk005013','si005041',1,7,false),('pk005013','si005059',1,8,false),('pk005013','si005058',1,9,false),
  ('pk005013','si005083',1,10,true),('pk005013','si005205',1,11,false),('pk005013','si005076',1,12,false),
  ('pk005013','si005023',1,13,false),('pk005013','si005050',1,14,true),('pk005013','si005300',1,15,true),
  ('pk005013','si005207',1,16,true),('pk005013','si005103',1,17,false),
  -- Honour Cremation Service (pk005014) — container cont003
  ('pk005014','si005003',1,1,false),('pk005014','si005010',1,2,false),('pk005014','si005013',1,3,false),
  ('pk005014','si005012',1,4,false),('pk005014','si005040',1,5,false),('pk005014','si005059',1,6,false),
  ('pk005014','si005058',1,7,false),('pk005014','si005083',1,8,true),('pk005014','si005206',1,9,false),
  ('pk005014','si005076',1,10,false),('pk005014','si005023',1,11,false),('pk005014','si005050',1,12,true),
  ('pk005014','si005301',1,13,true),('pk005014','si005208',1,14,true),('pk005014','si005102',1,15,false),
  -- Tribute Cremation Service (pk005015) — container csk086
  ('pk005015','si005009',1,1,false),('pk005015','si005010',1,2,false),('pk005015','si005013',1,3,false),
  ('pk005015','si005026',1,4,false),('pk005015','si005012',1,5,false),('pk005015','si005040',1,6,false),
  ('pk005015','si005058',1,7,false),('pk005015','si005076',1,8,false),('pk005015','si005050',1,9,true),
  ('pk005015','si005302',1,10,true);

-- ─── Individual Urn Catalog (from the 3813 Urn Price List) ────────────────────
-- Full browsable urn list; the 3 Memorial Urn Selection tiers used by the
-- cremation packages are defined above with the other service items.
insert into service_items (id, funeral_home_id, category_id, item_code, name, description, price, price_min, price_max, is_cash_advance, sort_order) values
  ('si005303', '3813', 'c1000000-0000-0000-0000-000000000009', 'UMCBFSZA7', 'Roses Vase', 'Cast bronze urn adorned with hand sculpted roses. (Urnes Bégin)', 2895.00, NULL, NULL, false, 4),
  ('si005304', '3813', 'c1000000-0000-0000-0000-000000000009', 'UOCMFSAE5', 'Classic Carrera', 'Durable cultured marble urn made from polymer and stone. (Mackenzie)', 595.00, NULL, NULL, false, 5),
  ('si005305', '3813', 'c1000000-0000-0000-0000-000000000009', 'UOCMFSAE6', 'Classic Sky Blue', 'Durable cultured marble urn made from polymer and stone. (Mackenzie)', 595.00, NULL, NULL, false, 6),
  ('si005306', '3813', 'c1000000-0000-0000-0000-000000000009', 'UOCMFSAE7', 'Classic Verde Green', 'Durable cultured marble urn made from polymer and stone. (Mackenzie)', 595.00, NULL, NULL, false, 7),
  ('si005307', '3813', 'c1000000-0000-0000-0000-000000000009', 'UOSTFSAIF', 'In Flight', 'Handpainted and carved into textured stone with solid mahogany base. (Keepsakes and/or accessories sold separately) (RK Productions)', 995.00, NULL, NULL, false, 8),
  ('si005308', '3813', 'c1000000-0000-0000-0000-000000000009', 'UOOXFSAOV', 'Onyx Vase', 'Marble urn with variations of light green and dark earth tones. (Marble Products)', 595.00, NULL, NULL, false, 9),
  ('si005309', '3813', 'c1000000-0000-0000-0000-000000000009', 'UOMBFSAE4', 'Carrera Marble Vase', 'Natural stone marble vase made from Carrera-inspired marble, polished to a gleaming shine. (Marble Products)', 595.00, NULL, NULL, false, 10),
  ('si005310', '3813', 'c1000000-0000-0000-0000-000000000009', 'UOMBFSAFA', 'Sand Rectangle', 'Sand-colored marble urn with natural accents. Urn is suitable as single or companion. (Marble Products)', 510.00, NULL, NULL, false, 11),
  ('si005311', '3813', 'c1000000-0000-0000-0000-000000000009', 'UOMBFSAFB', 'Sand Vase', 'Sand-colored marble urn with natural accents. (Marble Products)', 495.00, NULL, NULL, false, 12),
  ('si005312', '3813', 'c1000000-0000-0000-0000-000000000009', 'UOUOFS5ZF', 'Love Dove Porcelain', 'Porcelain Full Size Dove Shaped Urn in white color (LoveUrns)', 695.00, NULL, NULL, false, 13),
  ('si005313', '3813', 'c1000000-0000-0000-0000-000000000009', 'UOPLFS5ZF', 'White Soulful Shell', 'Porcelain Full Size Shell Shaped Urn in white color (LoveUrns)', 595.00, NULL, NULL, false, 14),
  ('si005314', '3813', 'c1000000-0000-0000-0000-000000000009', 'UOPLSB5ZF', 'Yellow Soulful Shell', 'Porcelain Full Size Shell Shaped Urn in yellow color (LoveUrns)', 595.00, NULL, NULL, false, 15),
  ('si005315', '3813', 'c1000000-0000-0000-0000-000000000009', 'UOPLFSAE9', 'Lenox Porcelain', 'Classic and elegant porcelain vase made from Genuine Lenox Porcelain with 24 karat gold gilding. (Elegante Brass)', 495.00, NULL, NULL, false, 16),
  ('si005316', '3813', 'c1000000-0000-0000-0000-000000000009', 'UMZNFSOII', 'Fidelity Couple - Companion', 'Precision casting, 100% solid bronze urns showing a man and a woman waiting for each other at the paradise doors. (Urnes Bégin)', 3895.00, NULL, NULL, false, 17),
  ('si005317', '3813', 'c1000000-0000-0000-0000-000000000009', 'UMZNFSAGE', 'The Vine - Companion', 'Die-cast zinc urn, with a solid bronze face and vine embellishment. Purchased together. (Urnes Bégin)', 1535.00, NULL, NULL, false, 18),
  ('si005318', '3813', 'c1000000-0000-0000-0000-000000000009', 'UOSTAA4TF', 'Together Forever Companion', 'Finely handcrafted stone companion urn, hand painted with each one an original sculpture (RK Productions)', 1495.00, NULL, NULL, false, 19),
  ('si005319', '3813', 'c1000000-0000-0000-0000-000000000009', 'UMALAHPPD', 'Double Versatile Pink', 'Elegant pink aluminum urn with customizable front plate offering high quality, vibrant images that reflect the unique relationship between two individuals as a companion urn. (Urnes Bégin)', 1395.00, NULL, NULL, false, 20),
  ('si005320', '3813', 'c1000000-0000-0000-0000-000000000009', 'UMALAHPV5', 'Double Versatile Matte Black', 'Elegant matte black aluminum urn with customizable front plate offering high quality, vibrant images that reflect the unique relationship between two individuals as a companion urn. (Urnes Bégin)', 1395.00, NULL, NULL, false, 21),
  ('si005321', '3813', 'c1000000-0000-0000-0000-000000000009', 'UMALAHPVG', 'Double Versatile Champagne', 'Elegant champagne aluminum urn with customizable front plate offering high quality, vibrant images that reflect the unique relationship between two individuals as a companion urn. (Urnes Bégin)', 1395.00, NULL, NULL, false, 22),
  ('si005322', '3813', 'c1000000-0000-0000-0000-000000000009', 'UMALAHPVL', 'Double Versatile Charcoal', 'Elegant charcoal aluminum urn with customizable front plate offering high quality, vibrant images that reflect the unique relationship between two individuals as a companion urn. (Urnes Bégin)', 1395.00, NULL, NULL, false, 23),
  ('si005323', '3813', 'c1000000-0000-0000-0000-000000000009', 'UMALAHPVR', 'Double Versatile Bronze', 'Elegant bronze aluminum urn with customizable front plate offering high quality, vibrant images that reflect the unique relationship between two individuals as a companion urn. (Urnes Bégin)', 1395.00, NULL, NULL, false, 24),
  ('si005324', '3813', 'c1000000-0000-0000-0000-000000000009', 'UMALAHPVV', 'Double Versatile Navy', 'Elegant navy aluminum urn with customizable front plate offering high quality, vibrant images that reflect the unique relationship between two individuals as a companion urn. (Urnes Bégin)', 1395.00, NULL, NULL, false, 25),
  ('si005325', '3813', 'c1000000-0000-0000-0000-000000000009', 'UMALAHPVW', 'Double Versatile Sparkling White', 'Elegant sparkling white aluminum urn with customizable front plate offering high quality, vibrant images that reflect the unique relationship between two individuals as a companion urn. (Urnes Bégin)', 1395.00, NULL, NULL, false, 26),
  ('si005326', '3813', 'c1000000-0000-0000-0000-000000000009', 'UMZNFSOIH', 'Personalized Double Doves', 'Die cast zinc urn with a bronze face, with two dove bronze ornaments. (Urnes Bégin)', 1195.00, NULL, NULL, false, 27),
  ('si005327', '3813', 'c1000000-0000-0000-0000-000000000009', 'UMBZFSZLV', 'Lily of the Valley', 'Die cast zinc urn with a solid bronze face, with a molded lily embellishment. (Urnes Bégin)', 1095.00, NULL, NULL, false, 28),
  ('si005328', '3813', 'c1000000-0000-0000-0000-000000000009', 'UMZNFSOIE', 'Double Oak', 'Die cast zinc urn with bronze face, with an oak molded embellishment. (Urnes Bégin)', 1075.00, NULL, NULL, false, 29),
  ('si005329', '3813', 'c1000000-0000-0000-0000-000000000009', 'UMBZFSZMD', 'Memories', 'Die cast zinc urn with bronze plate and bronze embellishments. (Urnes Bégin)', 795.00, NULL, NULL, false, 30),
  ('si005330', '3813', 'c1000000-0000-0000-0000-000000000009', 'UOCRFSARB', 'Rose Bouquet', 'Ceramic urn with hand-painted rose bouquet detail. Features a floral motif on a pearlescent ivory background. (Terrybear)', 350.00, NULL, NULL, false, 31),
  ('si005331', '3813', 'c1000000-0000-0000-0000-000000000009', 'UMZNFSOIL', 'Guardian Angel', 'Precision casting, 100% solid bronze urn showing an angel crying over a tomb, and two doves taking their flight. (Urnes Bégin)', 4995.00, NULL, NULL, false, 32),
  ('si005332', '3813', 'c1000000-0000-0000-0000-000000000009', 'UMZNFSOIJ', 'Fidelity Couple - Woman', 'Precision casting, 100% solid bronze urns showing a man and a woman waiting for each other at the paradise doors. (Urnes Bégin)', 1995.00, NULL, NULL, false, 33),
  ('si005333', '3813', 'c1000000-0000-0000-0000-000000000009', 'UMZNFSOIK', 'Fidelity Couple - Man', 'Precision casting, 100% solid bronze urns showing a man and a woman waiting for each other at the paradise doors. (Urnes Bégin)', 1995.00, NULL, NULL, false, 34),
  ('si005334', '3813', 'c1000000-0000-0000-0000-000000000009', 'UMBZFSZER', 'Eternal', 'Die cast 100% bronze urn with bronze dove ornament. (Urnes Bégin)', 1895.00, NULL, NULL, false, 35),
  ('si005335', '3813', 'c1000000-0000-0000-0000-000000000009', 'UMBRFSDTF', 'Heartfelt™ Gold', 'Solid Brass Heart shaped Full Size Urn with Crystal. (Keepsakes and/or accessories sold separately) (LoveUrns)', 1295.00, NULL, NULL, false, 36),
  ('si005336', '3813', 'c1000000-0000-0000-0000-000000000009', 'UMCBFSABF', 'Cast Bronze Rectangle', 'Cast bronze construction with brushed and polished finish. (Batesville)', 1070.00, NULL, NULL, false, 37),
  ('si005337', '3813', 'c1000000-0000-0000-0000-000000000009', 'UMZNFSOIB', 'Serenity Rose', 'Die cast zinc urn with bronze rose ornament and grey brushed edge. (ZB-601B) (Urnes Bégin)', 995.00, NULL, NULL, false, 38),
  ('si005338', '3813', 'c1000000-0000-0000-0000-000000000009', 'UMZNFSOIC', 'Serenity Tree', 'Die cast zinc urn with bronze tree ornament and grey brushed edge. (ZB-600B) (Urnes Bégin)', 995.00, NULL, NULL, false, 39),
  ('si005339', '3813', 'c1000000-0000-0000-0000-000000000009', 'UMZNFSOID', 'Serenity Plain', 'Die cast zinc urn with grey brushed edge. (ZB-602B) (Urnes Bégin)', 995.00, NULL, NULL, false, 40),
  ('si005340', '3813', 'c1000000-0000-0000-0000-000000000009', 'UMBRFSLFP', 'Elegant Leaf', 'Brass urn with deep emerald finish complete with brass fern leaf detail. (LoveUrns)', 995.00, NULL, NULL, false, 41),
  ('si005341', '3813', 'c1000000-0000-0000-0000-000000000009', 'UMCBFSABE', 'Cast Bronze Cylinder', 'Cast bronze construction with brushed and polished finish (Batesville)', 910.00, NULL, NULL, false, 42),
  ('si005342', '3813', 'c1000000-0000-0000-0000-000000000009', 'UMBZFSZPB', 'Personalized Solid Bronze Urn', 'Die cast zinc urn with bronze face, with a bronze ornament from the personalized collection. Over a hundred ornaments available. (Urnes Bégin)', 895.00, NULL, NULL, false, 43),
  ('si005343', '3813', 'c1000000-0000-0000-0000-000000000009', 'UMZNFSAGF', 'The Vine - Left', 'Die-cast zinc urn, with a solid bronze face and vine embellishment. Design to the left of engraving plate. (Urnes Bégin)', 895.00, NULL, NULL, false, 44),
  ('si005344', '3813', 'c1000000-0000-0000-0000-000000000009', 'UMZNFSAGK', 'The Vine - Right', 'Die-cast zinc urn, solid bronze face, vine embellishment. Design to the right of engraving plate. (Urnes Bégin)', 895.00, NULL, NULL, false, 45),
  ('si005345', '3813', 'c1000000-0000-0000-0000-000000000009', 'UMBZFSZOL', 'Oak - Left', 'Die cast zinc urn with a solid bronze face, tree embellishment molded on the sides. (Urnes Bégin)', 795.00, NULL, NULL, false, 46),
  ('si005346', '3813', 'c1000000-0000-0000-0000-000000000009', 'UMBZFSZOR', 'Oak - Right', 'Die cast zinc urn with a solid bronze face, tree embellishment molded on the sides. (Urnes Bégin)', 795.00, NULL, NULL, false, 47),
  ('si005347', '3813', 'c1000000-0000-0000-0000-000000000009', 'UMBRFSLFR', 'Simplicity', 'Brass and metal alloy urn with a radiant midnight finish and silver accents. (LoveUrns)', 795.00, NULL, NULL, false, 48),
  ('si005348', '3813', 'c1000000-0000-0000-0000-000000000009', 'UMBRFSLSG', 'Teardrop Matte Sage Green', 'Unique sage green teardrop shaped brass urn with a soft touch finish and brushed gold top. (LoveUrns)', 795.00, NULL, NULL, false, 49),
  ('si005349', '3813', 'c1000000-0000-0000-0000-000000000009', 'UMASFSLMB', 'Teardrop Matte Black', 'Unique matte black teardrop shaped brass urn with a soft touch finish and brushed gun metal top. (LoveUrns)', 795.00, NULL, NULL, false, 50),
  ('si005350', '3813', 'c1000000-0000-0000-0000-000000000009', 'UMBRFSAAF', 'Laurel White Pearl', 'Alloy and brass vase with a pristine white hand-applied enamel design. (LoveUrns)', 795.00, NULL, NULL, false, 51),
  ('si005351', '3813', 'c1000000-0000-0000-0000-000000000009', 'UMBRFSAAU', 'Laurel Midnight', 'Alloy and brass vase with a rich charcoal hand-applied enamel design. (LoveUrns)', 795.00, NULL, NULL, false, 52),
  ('si005352', '3813', 'c1000000-0000-0000-0000-000000000009', 'UMBRFSASK', 'Satori Pink Pearl', 'Brass urn with beautiful pearl pink finish and metallic shimmer. Features an artistic, contemporary shape and polished bronze finish accents. (Terrybear)', 795.00, NULL, NULL, false, 53),
  ('si005353', '3813', 'c1000000-0000-0000-0000-000000000009', 'UMBRFSASO', 'Satori Ocean Pearl', 'Brass urn with beautiful pearl blue ocean finish and metallic shimmer. Features an artistic, contemporary shape and polished bronze finish accents. (Terrybear)', 795.00, NULL, NULL, false, 54),
  ('si005354', '3813', 'c1000000-0000-0000-0000-000000000009', 'UMBRFSASW', 'Satori White Pearl', 'Brass urn with beautiful pearl white finish and metallic shimmer. Features an artistic, contemporary shape and polished bronze finish accents. (Terrybear)', 795.00, NULL, NULL, false, 55),
  ('si005355', '3813', 'c1000000-0000-0000-0000-000000000009', 'UMALFSPG0', 'Versatile Urn Champagne', 'Sleek aluminum champagne urn with a customizable front plate offering high quality, vibrant images that reflect the unique personality and passions of your loved one. (Urnes Bégin)', 795.00, NULL, NULL, false, 56),
  ('si005356', '3813', 'c1000000-0000-0000-0000-000000000009', 'UMALFSPG1', 'Versatile Urn Charcoal', 'Sleek aluminum charcoal urn with a customizable front plate offering high quality, vibrant images that reflect the unique personality and passions of your loved one. (Urnes Bégin)', 795.00, NULL, NULL, false, 57),
  ('si005357', '3813', 'c1000000-0000-0000-0000-000000000009', 'UMALFSPG3', 'Versatile Urn Navy', 'Sleek aluminum navy urn with a customizable front plate offering high quality, vibrant images that reflect the unique personality and passions of your loved one. (Urnes Bégin)', 795.00, NULL, NULL, false, 58),
  ('si005358', '3813', 'c1000000-0000-0000-0000-000000000009', 'UMALFSPG4', 'Versatile Urn Pink', 'Sleek aluminum pink urn with a customizable front plate offering high quality, vibrant images that reflect the unique personality and passions of your loved one. (Urnes Bégin)', 795.00, NULL, NULL, false, 59),
  ('si005359', '3813', 'c1000000-0000-0000-0000-000000000009', 'UMALFSPG5', 'Versatile Urn Sparkling White', 'Sleek aluminum sparkling white urn with a customizable front plate offering high quality, vibrant images that reflect the unique personality and passions of your loved one. (Urnes Bégin)', 795.00, NULL, NULL, false, 60),
  ('si005360', '3813', 'c1000000-0000-0000-0000-000000000009', 'UMALFSPGZ', 'Versatile Urn Bronze', 'Sleek aluminum bronze urn with a customizable front plate offering high quality, vibrant images that reflect the unique personality and passions of your loved one. (Urnes Bégin)', 795.00, NULL, NULL, false, 61),
  ('si005361', '3813', 'c1000000-0000-0000-0000-000000000009', 'UMALFSPVY', 'Versatile Urn Matte Black', 'Sleek aluminum matte black urn with a customizable front plate offering high quality, vibrant images that reflect the unique personality and passions of your loved one. (Urnes Bégin)', 795.00, NULL, NULL, false, 62),
  ('si005362', '3813', 'c1000000-0000-0000-0000-000000000009', 'UMBRFSLFS', 'Soul Bird', 'Elegant and sleek brass urn bird urn. (Keepsakes and/or accessories sold separately) (LoveUrns)', 715.00, NULL, NULL, false, 63),
  ('si005363', '3813', 'c1000000-0000-0000-0000-000000000009', 'UMADFS5AU', 'Amore™ Red', 'Solid Brass Full Size Urn with Red and Polished Silver Finish. Compartment on top to keep memorable items. (LoveUrns)', 695.00, NULL, NULL, false, 64),
  ('si005364', '3813', 'c1000000-0000-0000-0000-000000000009', 'UMSBFSAFG', 'Sheet Bronze Cylinder', 'Constructed from 64 oz sheet bronze with brushed and polished finish. (Batesville)', 695.00, NULL, NULL, false, 65),
  ('si005365', '3813', 'c1000000-0000-0000-0000-000000000009', 'UMSBFSAFI', 'Sheet Bronze Rectangle', 'Constructed from 64 oz sheet bronze with brushed and polished finish. (Batesville)', 695.00, NULL, NULL, false, 66),
  ('si005366', '3813', 'c1000000-0000-0000-0000-000000000009', 'UMLBFSLOO', 'Crimson Hearts', 'Crafted from aluminum and brass, this urn features a deep crimson finish adorned with heart motifs. (LoveUrns)', 595.00, NULL, NULL, false, 67),
  ('si005367', '3813', 'c1000000-0000-0000-0000-000000000009', 'UMLBFSLPI', 'Pink Roses', 'Crafted from aluminum and brass, this urn features a delicate pink finish with a rose motif. (LoveUrns)', 595.00, NULL, NULL, false, 68),
  ('si005368', '3813', 'c1000000-0000-0000-0000-000000000009', 'UMLBFSLVE', 'Emerald Tree of Love', 'Designed in rich emerald tones, this aluminum and brass urn showcases a tree of love motif. (LoveUrns)', 595.00, NULL, NULL, false, 69),
  ('si005369', '3813', 'c1000000-0000-0000-0000-000000000009', 'UMZNFSOHX', 'Sky Pewter', 'Die cast zinc urn with a pewter marbling finish showing a sky with two bronze angel ornaments. (Urnes Bégin)', 595.00, NULL, NULL, false, 70),
  ('si005370', '3813', 'c1000000-0000-0000-0000-000000000009', 'UMZNFSOHY', 'Sky Pink', 'Die cast zinc urn with a pink marbling finish showing a sky with two bronze angel ornaments. (Urnes Bégin)', 595.00, NULL, NULL, false, 71),
  ('si005371', '3813', 'c1000000-0000-0000-0000-000000000009', 'UMZNFSOHZ', 'Sky Brown', 'Die cast zinc urn with a brown marbling finish showing a sky with two bronze angel ornaments. (Urnes Bégin)', 595.00, NULL, NULL, false, 72),
  ('si005372', '3813', 'c1000000-0000-0000-0000-000000000009', 'UMZNFSOIA', 'Sky Blue', 'Die cast zinc urn with a bleu marbling finish showing a sky with two bronze angel ornaments. (Urnes Bégin)', 595.00, NULL, NULL, false, 73),
  ('si005373', '3813', 'c1000000-0000-0000-0000-000000000009', 'UMZNFSZA4', 'Flight of Doves - Left', 'Die cast zinc urn in an "S" shape, metal grey finish and 3 silver dove ornaments. (Urnes Bégin)', 595.00, NULL, NULL, false, 74),
  ('si005374', '3813', 'c1000000-0000-0000-0000-000000000009', 'UMZNFSZA5', 'Flight of Doves - Right', 'Die cast zinc urn in an "S" shape, metal grey finish and 3 silver dove ornaments. (Urnes Bégin)', 595.00, NULL, NULL, false, 75),
  ('si005375', '3813', 'c1000000-0000-0000-0000-000000000009', 'UMBRFSLFX', 'Wings of Hope Blue', 'Elegant butterfly designed brass and enamel urn with blue inlays and pearlescent finish. (LoveUrns)', 595.00, NULL, NULL, false, 76),
  ('si005376', '3813', 'c1000000-0000-0000-0000-000000000009', 'UMBRFSLFY', 'Wings of Hope Lavender', 'Elegant butterfly designed brass and enamel urn with lavender inlays and pearlescent finish. (LoveUrns)', 595.00, NULL, NULL, false, 77),
  ('si005377', '3813', 'c1000000-0000-0000-0000-000000000009', 'UMBRFSLFZ', 'Wings of Hope Pearl', 'Elegant butterfly designed brass and enamel urn with white inlays and pearlescent finish. (LoveUrns)', 595.00, NULL, NULL, false, 78),
  ('si005378', '3813', 'c1000000-0000-0000-0000-000000000009', 'UMBRFSLV6', 'Lavender Butterflies', 'Crafted from aluminum and brass, this urn features a soothing lavender finish with butterfly motifs. (LoveUrns)', 595.00, NULL, NULL, false, 79),
  ('si005379', '3813', 'c1000000-0000-0000-0000-000000000009', 'UMBRFSLWY', 'Wings of Hope Yellow', 'Elegant butterfly designed brass and enamel urn with yellow inlays and pearlescent finish. (LoveUrns)', 595.00, NULL, NULL, false, 80),
  ('si005380', '3813', 'c1000000-0000-0000-0000-000000000009', 'UMBRFSDLY', 'Flying Doves', 'Blue Metal Full Size Urn with hand engraved Dove Design. (Keepsakes and/or accessories sold separately) (LoveUrns)', 595.00, NULL, NULL, false, 81),
  ('si005381', '3813', 'c1000000-0000-0000-0000-000000000009', 'UMBRFSAMP', 'Mother of Pearl Elite', 'Polished brass urn with iridescent Mother of Pearl mosaic tile. (Keepsakes and/or accessories sold separately) (LoveUrns)', 595.00, NULL, NULL, false, 82),
  ('si005382', '3813', 'c1000000-0000-0000-0000-000000000009', 'UMABFS5AU', 'Laurel Crimson', 'Crimson Color Metal Full Size Urn with Brushed Gold Lid (Keepsakes and/or accessories sold separately) (LoveUrns)', 595.00, NULL, NULL, false, 83),
  ('si005383', '3813', 'c1000000-0000-0000-0000-000000000009', 'UMLBFSL2D', 'Golden Doves', 'Crafted from aluminum and brass, this urn features a blue finish with radiant golden doves in flight. (LoveUrns)', 595.00, NULL, NULL, false, 84),
  ('si005384', '3813', 'c1000000-0000-0000-0000-000000000009', 'UMLBFSL61', 'Rose Lavender', 'Crafted from aluminum and brass, this urn captures the essence of a rose with soft lavender tones and offers personalization with image and engraving. A gentle, graceful way to honor a life. (LoveUrns)', 595.00, NULL, NULL, false, 85),
  ('si005385', '3813', 'c1000000-0000-0000-0000-000000000009', 'UMLBFSL62', 'Open Road', 'Crafted in aluminum and brass, this urn captures the spirit of adventure with its open road theme and offers complete personalization with image and engraving. A fitting memorial for those who embraced life''s journey. (LoveUrns)', 595.00, NULL, NULL, false, 86),
  ('si005386', '3813', 'c1000000-0000-0000-0000-000000000009', 'UMLBFSL63', 'Mountain', 'Crafted from aluminum and brass, this urn reflects the majesty of mountains and can be customized with image and engraving. A tribute to strength, freedom, and enduring memories. (LoveUrns)', 595.00, NULL, NULL, false, 87),
  ('si005387', '3813', 'c1000000-0000-0000-0000-000000000009', 'UMLBFSL64', 'Forest', 'Crafted from aluminum and brass, this urn showcases a tranquil forest design and offers complete personalization with image and engraving. A beautiful way to honor a life rooted in nature. (LoveUrns)', 595.00, NULL, NULL, false, 88),
  ('si005388', '3813', 'c1000000-0000-0000-0000-000000000009', 'UMLBFSL65', 'Beaches', 'Crafted from durable aluminum and brass, this urn features a serene beach design and offers complete personalization with image and engraving. A peaceful tribute for those who loved the shore. (LoveUrns)', 595.00, NULL, NULL, false, 89),
  ('si005389', '3813', 'c1000000-0000-0000-0000-000000000009', 'UMBZFSHDS', 'Omega Vase', 'Bronze vase with polished gold-tone accents. (Terrybear)', 545.00, NULL, NULL, false, 90),
  ('si005390', '3813', 'c1000000-0000-0000-0000-000000000009', 'UMBRFSAFM', 'Silver Vase', 'Polished antique silver-toned brass with gold-toned accents. (Terrybear)', 545.00, NULL, NULL, false, 91),
  ('si005391', '3813', 'c1000000-0000-0000-0000-000000000009', 'UMBRFSLFO', 'Divine', 'Beautifully designed blue brass and enamel urn with enameled finish. (LoveUrns)', 495.00, NULL, NULL, false, 92),
  ('si005392', '3813', 'c1000000-0000-0000-0000-000000000009', 'UMBRFSDFO', 'Art Deco', 'Brass urn with classic and sleek style with enameled bands. (Keepsakes and/or accessories sold separately) (LoveUrns)', 495.00, NULL, NULL, false, 93),
  ('si005393', '3813', 'c1000000-0000-0000-0000-000000000009', 'UMBRFSABQ', 'Dove Vase', 'Nickel-plated brass vase with blue accents and dove design. (Keepsakes and/or accessories sold separately) (LoveUrns)', 495.00, NULL, NULL, false, 94),
  ('si005394', '3813', 'c1000000-0000-0000-0000-000000000009', 'UMLBFSLMK', 'Midnight Sky', 'Crafted from durable aluminum with a speckled midnight black finish, this urn captures the beauty of a midnight sky. (LoveUrns)', 495.00, NULL, NULL, false, 95),
  ('si005395', '3813', 'c1000000-0000-0000-0000-000000000009', 'UMLBFSLMR', 'Stardust Ember', 'Crafted from durable brass with a speckled brown finish, this urn reflects earthy tones of stardust ember. (LoveUrns)', 495.00, NULL, NULL, false, 96),
  ('si005396', '3813', 'c1000000-0000-0000-0000-000000000009', 'UMLBFSLTW', 'Twilight Blue', 'Crafted from durable brass with a speckled twilight blue finish, this urn combines solitude and serenity. (LoveUrns)', 495.00, NULL, NULL, false, 97),
  ('si005397', '3813', 'c1000000-0000-0000-0000-000000000009', 'UMBRFSADP', 'Moonlight Blue Vase', 'Brass urn with a deep blue finish with metallic shimmer. Features a contemporary shape and pewter-finish accent bands. (Terrybear)', 460.00, NULL, NULL, false, 98),
  ('si005398', '3813', 'c1000000-0000-0000-0000-000000000009', 'UMBRFSAUP', 'Bright Stripes Purple', 'Brass urn with bright purple striped finish. (Terrybear)', 425.00, NULL, NULL, false, 99),
  ('si005399', '3813', 'c1000000-0000-0000-0000-000000000009', 'UMBRFSAPE', 'Bright Stripes Blue', 'Brass urn with bright blue striped finish. (Terrybear)', 425.00, NULL, NULL, false, 100),
  ('si005400', '3813', 'c1000000-0000-0000-0000-000000000009', 'UMBRFSARS', 'Bright Stripes Red', 'Brass urn with bright crimson striped finish. (Terrybear)', 425.00, NULL, NULL, false, 101),
  ('si005401', '3813', 'c1000000-0000-0000-0000-000000000009', 'UMBRACLTE', 'CuddleBear™ Blue', 'Teddy Bear shaped Child Urn in Blue finish with Crystal (LoveUrns)', 195.00, NULL, NULL, false, 102),
  ('si005402', '3813', 'c1000000-0000-0000-0000-000000000009', 'UMBRACLTP', 'CuddleBear™ Pink', 'Teddy Bear shaped Child Urn in Pink finish with Crystal (LoveUrns)', 195.00, NULL, NULL, false, 103),
  ('si005403', '3813', 'c1000000-0000-0000-0000-000000000009', 'UMZNACZ88', 'CuddleBear™ White', 'Teddy Bear shaped Child Urn in White finish with Crystal (LoveUrns)', 195.00, NULL, NULL, false, 104),
  ('si005404', '3813', 'c1000000-0000-0000-0000-000000000009', 'UW3QFSGMU', 'Classic Stained Maple', 'Urban grey stained maple Urn with customizable front plates. (Urnes Bégin)', 995.00, NULL, NULL, false, 105),
  ('si005405', '3813', 'c1000000-0000-0000-0000-000000000009', 'UWMPFSACR', 'Bois Silver Maple', 'Canadian maple wood urn with dark brown stain and contrasting dark walnut inlay stripe (Urnes Bégin)', 895.00, NULL, NULL, false, 106),
  ('si005406', '3813', 'c1000000-0000-0000-0000-000000000009', 'UWBHFSADF', 'Memento Chest', 'Mixed hardwoods and burl wood veneer top with wood inlay and high gloss lacquer finish. Features plastic insert and one key. TSA/CATSA-compliant (Batesville)', 795.00, NULL, NULL, false, 107),
  ('si005407', '3813', 'c1000000-0000-0000-0000-000000000009', 'UWWDFSAMA', 'Moments Azalea Urn and Frame', 'Mixed hardwood urn with removable Tiffany-inspired Azalea frame keepsake. (Frame keepsake is magnetically attached to urn and can be displayed separately. <1 cu in). (Terrybear)', 690.00, NULL, NULL, false, 108),
  ('si005408', '3813', 'c1000000-0000-0000-0000-000000000009', 'UWAKFSACV', 'Mozart Memory Chest', 'Medium Density Fiberboard with veneer memory chest in bombe shape reminiscent of European furniture. TSA/CATSA-compliant (Terrybear)', 595.00, NULL, NULL, false, 109),
  ('si005409', '3813', 'c1000000-0000-0000-0000-000000000009', 'UWBHFSABH', 'Cherry Chest', 'Composite wood veneer chest with cherry-stained finish. TSA/CATSA-compliant (Batesville)', 595.00, NULL, NULL, false, 110),
  ('si005410', '3813', 'c1000000-0000-0000-0000-000000000009', 'UWBHFSADQ', 'Natural Cube', 'Solid birchwood with burl wood veneer and high gloss lacquer finish. TSA/CATSA-compliant (Batesville)', 495.00, NULL, NULL, false, 111),
  ('si005411', '3813', 'c1000000-0000-0000-0000-000000000009', 'UWTAFSFMS', 'Modern Essential Sable', 'Acacia hardwood urn with a contemporary design in a sable finish. Each urn features a unique woodgrain. TSA/CATSA-compliant (Terrybear)', 495.00, NULL, NULL, false, 112),
  ('si005412', '3813', 'c1000000-0000-0000-0000-000000000009', 'UOFBFSANO', 'Natural Box', 'Composite wood with a paper wrap providing a natural wood grain look with matte polish. Features a sliding bottom with one point access for easy use. TSA/CATSA-compliant (Batesville)', 200.00, NULL, NULL, false, 113),
  ('si005413', '3813', 'c1000000-0000-0000-0000-000000000009', 'UWXCFSZLT', 'Living Tribute Urn', 'Handmade wooden urn with vibrant grain and a finely sanded surface; comes with your choice of succulent. TSA/CATSA-compliant (BioLife)', 895.00, NULL, NULL, false, 114),
  ('si005414', '3813', 'c1000000-0000-0000-0000-000000000009', 'UOUOSB65Z', 'Ecolegacy Spiral', 'Comforting full-size urn crafted from innovative renewable plant-based materials blended with wood residues, highlighted by graceful spiral designs symbolizing life''s cycle, built for reliable use and gentle return to the earth through natural processes. (Urnes Bégin)', 595.00, NULL, NULL, false, 115),
  ('si005415', '3813', 'c1000000-0000-0000-0000-000000000009', 'UOUOSB6L4', 'Ecolegacy Mosaic', 'Comforting full-size urn crafted from innovative renewable plant-based materials blended with wood residues, highlighted by intricate mosaic patterns for warm textured appeal, built for reliable use and gentle return to the earth through natural processes. (Urnes Bégin)', 595.00, NULL, NULL, false, 116),
  ('si005416', '3813', 'c1000000-0000-0000-0000-000000000009', 'UOBDFSAFE', 'The Living Urn', 'Natural fiber biodegradable urn and tree planting system, designed to grow a beautiful memory tree, plant, or flowers. Kit includes biodegradable urn, RootProtect® neutralizing agent, aged wood chips, and handmade bamboo case. Includes tree of choice. TSA/CATSA-compliant (BioLife)', 595.00, NULL, NULL, false, 117),
  ('si005417', '3813', 'c1000000-0000-0000-0000-000000000009', 'UOBDFSGIC', 'Biowood Mosaic', 'Timeless full-size urn crafted from renewable plant-based materials blended with wood residues, featuring sophisticated mosaic patterns for earthy warmth, offering durable beauty with gradual earth-friendly integration over an extended period. (Urnes Bégin)', 595.00, NULL, NULL, false, 118),
  ('si005418', '3813', 'c1000000-0000-0000-0000-000000000009', 'UOBDFSGOW', 'Biowood Spiral', 'Timeless full-size urn crafted from renewable plant-based materials blended with wood residues, featuring elegant spiral accents for natural harmony, offering durable beauty with gradual earth-friendly integration over an extended period. (Urnes Bégin)', 595.00, NULL, NULL, false, 119),
  ('si005419', '3813', 'c1000000-0000-0000-0000-000000000009', 'UORDFSARP', 'Carpel Rock Salt', 'The Carpel Rock Salt urn is a full-capacity urn that is a perfect vessel for a natural disposition. Designed for sea burials or water funerals; guaranteed to dissolve in four hours. TSA/CATSA-compliant (Marble Products)', 580.00, NULL, NULL, false, 120),
  ('si005420', '3813', 'c1000000-0000-0000-0000-000000000009', 'UOBGFS5V5', 'OceanBlue™ Eco Urn', 'Biodegradable Full Size Urn in Blue and White color. Conforme ACSTA (LoveUrns)', 495.00, NULL, NULL, false, 121),
  ('si005421', '3813', 'c1000000-0000-0000-0000-000000000009', 'UODFFS5V4', 'EarthBrown™ Eco Urn', 'Biodegradable Full Size Urn in Brown and White color. TSA/CATSA-compliant (LoveUrns)', 495.00, NULL, NULL, false, 122),
  ('si005422', '3813', 'c1000000-0000-0000-0000-000000000009', 'UOBDFS5SY', 'ShiftingSand™ Footprints', 'Urn with Footprints in sand finish. TSA/CATSA-compliant (LoveUrns)', 495.00, NULL, NULL, false, 123),
  ('si005423', '3813', 'c1000000-0000-0000-0000-000000000009', 'UOAQFS1G3', 'Beacon Water Urn', 'Biodegradable urn is designed to simplify the scattering process in a body of water. Durable, dignified, easy-to-use container created from recycled paper and cardboard with no metal components and can be personalized by writing on the surface. Includes bamboo case, convenient for travel and nice for ceremonies. TSA/CATSA-compliant (BioLife)', 395.00, NULL, NULL, false, 124),
  ('si005424', '3813', 'c1000000-0000-0000-0000-000000000009', 'UOALFS1G4', 'Earth Scattering Cylinder Large', 'The patented Eco Scattering Urn is a beautiful and dignified option for families that want to scatter the ashes of a loved one. Each hand-made Eco Scattering Urn is made only from bamboo, a sustainable resource, and rubbed with a natural oil to accentuate the natural grains and colors of the bamboo. The lid is secured with a strong, birch wood locking pin and can be locked in an open and closed position for graceful scattering. Comes with a hand-sewn premium cotton bag sleeve convenient for travel. TSA/CATSA-compliant (BioLife)', 295.00, NULL, NULL, false, 125),
  ('si005425', '3813', 'c1000000-0000-0000-0000-000000000009', 'UORPSB1SU', 'Field of Flowers Scattering Tube', 'Scattering tube is designed to simplify the scattering process. Durable, dignified, easy-to-use container created from recycled paper and cardboard with no metal components. TSA/CATSA-compliant (BioLife)', 195.00, NULL, NULL, false, 126),
  ('si005426', '3813', 'c1000000-0000-0000-0000-000000000009', 'UORPFS1SU', 'Simplicity Scattering Tube', 'Scattering tube is designed to simplify the scattering process. Durable, dignified, easy-to-use container created from recycled paper and cardboard with no metal components. TSA/CATSA-compliant (BioLife)', 195.00, NULL, NULL, false, 127),
  ('si005427', '3813', 'c1000000-0000-0000-0000-000000000009', 'UORPFSUF4', 'Ascending Dove Scattering Tube', 'Scattering tube is designed to simplify the scattering process. Durable, dignified, easy-to-use container created from recycled paper and cardboard with no metal components. TSA/CATSA-compliant (BioLife)', 195.00, NULL, NULL, false, 128),
  ('si005428', '3813', 'c1000000-0000-0000-0000-000000000009', 'UORPFSUF6', 'Mountain View Scattering Tube', 'Scattering tube is designed to simplify the scattering process. Durable, dignified, easy-to-use container created from recycled paper and cardboard with no metal components. TSA/CATSA-compliant (BioLife)', 195.00, NULL, NULL, false, 129),
  ('si005429', '3813', 'c1000000-0000-0000-0000-000000000009', 'UOBDFSADR', 'Ocean Sunset Scattering Tube', 'Scattering tube is designed to simplify the scattering process. Durable, dignified, easy-to-use container created from recycled paper and cardboard with no metal components. TSA/CATSA-compliant (BioLife)', 195.00, NULL, NULL, false, 130),
  ('si005430', '3813', 'c1000000-0000-0000-0000-000000000009', 'UOLRFSACW', 'Leather Cylinder', 'Slate brown bonded leather cylinder. TSA/CATSA-compliant. (Batesville)', 195.00, NULL, NULL, false, 131),
  ('si005431', '3813', 'c1000000-0000-0000-0000-000000000009', 'UMSTFSAGJ', 'Utility', '20 gauge carbon steel construction with black semi-gloss finish. (Batesville)', 295.00, NULL, NULL, false, 132),
  ('si005432', '3813', 'c1000000-0000-0000-0000-000000000009', 'UMALFSADA', 'Mailer', 'Composite wood with aluminum like texture, acceptable to ship through the mail courier service. (Batesville)', 190.00, NULL, NULL, false, 133);

