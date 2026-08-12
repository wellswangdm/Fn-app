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
  ('3813', 'cont005', 350.00, 51),  -- Particle Board Container
  -- Alternative Containers
  ('3813', 'cont006', 450.00, 52),  -- Trayview
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

-- NOTE: individual urn catalog rows (si005303+) are appended by the block in
-- seed_3813_urns.sql (generated from the 3813 Urn Price List).

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
