-- ─────────────────────────────────────────────────────────────────────────────
-- SEED DATA — Victory Memorial Park Funeral Centre
-- Run AFTER schema.sql
-- ─────────────────────────────────────────────────────────────────────────────

-- ─── Funeral Home ─────────────────────────────────────────────────────────────

insert into funeral_homes (id, name, address, phone, website, tax_rate) values
  ('3745',
   'Victory Memorial Park Funeral Centre',
   '14831 28th Ave, Surrey, BC V4P 1P3',
   '604-536-6522',
   'www.victoryfuneralcentre.ca',
   0.05);

-- ─── Service Categories ───────────────────────────────────────────────────────

insert into service_categories (id, name, sort_order) values
  ('c1000000-0000-0000-0000-000000000001', 'Professional Staff & Services',        1),
  ('c1000000-0000-0000-0000-000000000002', 'Facilities and Supervision',            2),
  ('c1000000-0000-0000-0000-000000000003', 'Transportation',                        3),
  ('c1000000-0000-0000-0000-000000000004', 'Family Support Options',                4),
  ('c1000000-0000-0000-0000-000000000005', 'Miscellaneous Services & Merchandise',  5),
  ('c1000000-0000-0000-0000-000000000006', 'Stationery',                            6),
  ('c1000000-0000-0000-0000-000000000007', 'Cash Advances',                         7),
  ('c1000000-0000-0000-0000-000000000008', 'Caskets & Containers',                  8),
  ('c1000000-0000-0000-0000-000000000009', 'Urns',                                  9);

-- ─── Caskets & Containers ─────────────────────────────────────────────────────
-- Full casket price list for Victory Memorial (3745) — effective Feb 20, 2026

insert into caskets (id, funeral_home_id, name, price, description, image_url, sort_order) values
  -- Wood Caskets
  ('csk017', '3745', '710 President',               16599.00, 'Mahogany casket with a dark brown, Georgetown stained exterior and a silverbeige velvet interior.',                                               NULL,  1),
  ('csk018', '3745', 'Eloquence Mahogany',           10899.00, 'Solid mahogany casket with a dark mahogany, hand-rubbed, high gloss exterior, and a champagne, Whitehall velvet interior.',                     NULL,  2),
  ('csk019', '3745', 'Bexley Oak',                    8299.00, 'Solid oak casket with a medium, hand-rubbed, high gloss exterior and a champagne, Whitehall velvet interior.',                                  NULL,  3),
  ('csk020', '3745', 'Cantonese Red (Full Couch)',    8299.00, 'Solid mahogany casket with a polished cherry exterior, folksau lugs, and pearl velvet interior.',                                               NULL,  4),
  ('csk016', '3745', 'Regent',                        8299.00, 'Solid mahogany casket with a dark finished exterior and champagne velvet interior.',                                        '/caskets/regent.jpg',  5),
  ('csk021', '3745', 'Langdon Cherry',                7499.00, 'Solid cherry casket with a dark, satin finished exterior, and a champagne velvet interior.',                                                    NULL,  6),
  ('csk022', '3745', 'Provincial Maple',              7199.00, 'Solid maple casket with a medium, satin finished exterior and champagne, velvet interior.',                                                     NULL,  7),
  ('csk023', '3745', 'Chandler',                      6499.00, 'Solid mahogany casket with a dark finished exterior and a champagne velvet interior.',                                                          NULL,  8),
  ('csk024', '3745', 'Classic Mahogany',              6499.00, 'Solid Mahogany casket with Titian stain and Prestige hand-rubbed satin exterior with Pearl Premium velvet interior.',                          NULL,  9),
  ('csk025', '3745', 'Jamestown PC',                  6499.00, 'Timeless old world satin finish urn shape casket made of solid American black cherry hardwood with pearl velvet interior - perfection cut.',    NULL, 10),
  ('csk015', '3745', 'Prominence',                    6499.00, 'Solid maple casket with a dark hand-rubbed, high gloss, cherry stain exterior with a champagne velvet interior.',      '/caskets/prominence.jpg', 11),
  ('csk026', '3745', 'Warren Oak',                    6499.00, 'Solid oak casket with a dark stain, satin finish exterior and champagne velvet interior.',                                                      NULL, 12),
  ('csk027', '3745', 'Woodbridge Pecan',              5699.00, 'Solid pecan casket with a medium stained, satin finished exterior and champagne velvet interior.',                                              NULL, 13),
  ('csk028', '3745', 'St. Thomas Oak',                5199.00, 'Solid Oak casket with Persian Fawn stain and polished exterior with ivory velvet interior.',                                                    NULL, 14),
  ('csk029', '3745', 'Mansfield-27',                  5099.00, 'Select hardwood oversized casket with a medium pecan gloss finished exterior with rosetan crepe interior.',                                     NULL, 15),
  ('csk030', '3745', 'Briar Hill',                    4699.00, 'Hardwood casket with beige basket weave interior - perfection cut.',                                                                            NULL, 16),
  ('csk031', '3745', 'Camden Oak',                    4699.00, 'Solid traditional oak casket with dark finished exterior, and a champagne velvet interior.',                                                    NULL, 17),
  ('csk032', '3745', 'Cameron Oak',                   4699.00, 'Oak casket with a medium, autumn oak stained finished exterior and champagne velvet interior.',                                                 NULL, 18),
  ('csk033', '3745', 'Promise',                       4699.00, 'Sustainable select hardwood casket with a mocha brown wash stain exterior and meadowlark natural cotton interior.',                             NULL, 19),
  ('csk034', '3745', 'Rosette',                       4699.00, 'Select hardwood veneer casket with a dark cherry, hand-rubbed, high gloss exterior and natural batiste interior.',                              NULL, 20),
  ('csk035', '3745', 'Victoria Cherry',               4699.00, 'Solid Cherry octagon casket with Empire stain and polished exterior with blush pink velvet interior.',                                         NULL, 21),
  ('csk036', '3745', 'Sincerity',                     4295.00, 'Sustainable select hardwood casket with a driftwood grey wash stain exterior and meadowlark natural cotton interior.',                         NULL, 22),
  ('csk037', '3745', 'Brexton',                       4099.00, 'Premium oak veneer casket with a chestnut stain and satin finished exterior and a champagne velvet interior.',                                  NULL, 23),
  ('csk014', '3745', 'Dominion HC Wood Maple Crepe',  4099.00, 'Solid Maple casket with Titian stain and polished exterior with tan crepe interior.',                     '/caskets/dominion-hc-maple.jpg', 24),
  ('csk004', '3745', 'Eleanor Oak',                   4099.00, 'Oak casket with a chestnut stained, satin finished exterior and pink crepe interior.',                                                         NULL, 25),
  ('csk003', '3745', 'Fireside',                      4099.00, 'Oak wood casket with medium rustic stain with satin finish exterior and oatmeal duck / camo cloth interior.',                                  NULL, 26),
  ('csk038', '3745', 'Hadyn',                         4099.00, 'Select hardwood casket with a medium pecan, hand-rubbed high gloss finish exterior and a rosetan crepe interior.',                             NULL, 27),
  ('csk007', '3745', 'Bailey',                        3599.00, 'Select hardwood veneer casket with medium finish exterior and khaki linwood interior.',                                                         NULL, 28),
  ('csk008', '3745', 'Hartvic',                       3599.00, 'Solid Hardwood casket veneer sided with Dark Almond Shaded stain and satin exterior with tan crepe interior.',                                 NULL, 29),
  ('csk039', '3745', 'Sherwood Oak',                  3599.00, 'Solid Oak casket veneer sided with Shaded Persian Fawn stain and polished exterior with tan crepe interior.',                                  NULL, 30),
  ('csk006', '3745', 'Watson',                        3599.00, 'Hardwood casket with a medium finished exterior with a lugwood corner design and beige linwood interior.',                                     NULL, 31),
  ('csk009', '3745', 'Coleridge',                     2999.00, 'Hardwood casket with a medium finished exterior and rosetan crepe interior.',                                                                   NULL, 32),
  ('csk040', '3745', 'Constance',                     2999.00, 'Select hardwood casket with a medium cherry stain, hand-rubbed, gloss finish exterior and moss pink crepe interior.',                         NULL, 33),
  ('csk011', '3745', 'Heavenly White',                2999.00, 'Solid hardwood casket veneer sided with alpine white stain, polish finished exterior and white crepe interior.',                               NULL, 34),
  ('csk010', '3745', 'Montgomery',                    2999.00, 'Select hardwood casket with a medium walnut stain, hand-rubbed high gloss finish exterior and rosetan crepe interior.', '/caskets/montgomery.jpg', 35),
  ('csk041', '3745', 'White Rose',                    2999.00, 'Solid Hardwood casket with veneer sides with Alpine White stain and polished exterior with blush pink velvet interior.',                      NULL, 36),
  ('csk012', '3745', 'Winfield',                      2999.00, 'Solid Hardwood casket veneer sided with American Cherry stain and satin exterior with tan crepe interior.',                                   NULL, 37),
  ('csk042', '3745', 'Carnaby',                       2899.00, 'Hardwood casket with Vantablack satin finish exterior and beige basket weave interior.',                                                       NULL, 38),
  ('csk043', '3745', 'Atlantic',                      2799.00, 'Solid Hardwood casket veneer sided with Garnet stain and gloss exterior with beige crepe interior.',                                          NULL, 39),
  ('csk044', '3745', 'Natura',                        2799.00, 'New leaf solid poplar casket with natural finish exterior with 100% natural cotton interior.',                                                 NULL, 40),
  ('csk045', '3745', 'Oxford',                        2799.00, 'Solid hardwood casket with a light, finished exterior and rosetan crepe interior.',                                                            NULL, 41),
  ('csk013', '3745', 'Freelton',                      2599.00, 'Select hardwood casket with a medium finished exterior and ivory crepe interior.',                                          '/caskets/freelton.jpg', 42),
  ('csk046', '3745', 'Schafer',                       2599.00, 'Select hardwood casket with a medium finished exterior and ivory crepe interior.',                                                             NULL, 43),
  -- Metal Caskets
  ('csk047', '3745', 'Mediterranean Copper',         12499.00, '32-ounce copper casket with a copper brushed exterior and champagne velvet interior.',                                                         NULL, 44),
  ('csk048', '3745', 'Aegean Copper',                10899.00, '32 oz. copper casket with a copper brushed exterior and gold accents and a champagne, Sovereign velvet interior.',                              NULL, 45),
  ('csk049', '3745', 'Golden Granite',                5199.00, '18 gauge steel casket with a dual-tone grey, brushed exterior and a champagne velvet interior.',                                               NULL, 46),
  ('csk050', '3745', 'Primrose',                      5099.00, '18 gauge steel casket with a white shaded exterior and gold accents and a moss pink crepe interior.',                                          NULL, 47),
  ('csk051', '3745', 'Merlot-28',                     4299.00, '18-gauge steel oversized casket with a burgundy painted exterior and champagne velvet interior.',                                              NULL, 48),
  ('csk001', '3745', 'Merlot',                        4099.00, '18-gauge steel casket with a burgundy painted exterior and rosetan, crepe interior.',                                                          NULL, 49),
  ('csk052', '3745', 'Antique Blue-28',               3599.00, '20-gauge steel oversized casket with a blue shaded exterior and silver accents and a light blue, crepe interior.',                            NULL, 50),
  ('csk005', '3745', 'Misty Blue',                    3599.00, '20 gauge steel casket with a blue shaded exterior and blue accents, and a light blue crepe interior.',                                        NULL, 51),
  -- Cremation Oriented Caskets
  ('csk053', '3745', 'McConnell',                      999.00, 'Hollow cored poplar and poplar faced plywood with medium flat stain and tan crepe lining with pillow.',                                        NULL, 52),
  ('csk054', '3745', 'Plywood Container',              699.00, 'Plywood cremation container cut top.',                                                                                                         NULL, 53),
  ('cont003', '3745', 'Cypress',                       650.00, 'Hollow cored poplar container with natural finish and white satin mattress and pillow only.',                                                  NULL, 54),
  ('csk055', '3745', 'Particle Board Container',       350.00, 'Particle board cremation container with two strap handles, and no interior.',                                                                  NULL, 55),
  -- Alternative Containers
  ('csk056', '3745', 'Trayview',                       450.00, 'Cardboard container - cremation oriented with a cardboard exterior and crepe paper mattress and pillow.',                                      NULL, 56),
  -- Rental Caskets
  ('cont001', '3745', 'Brockton Oak Ceremonial',      1599.00, 'Hardwood ceremonial casket with medium, oak stained exterior and rosetan crepe interior.',                                                     NULL, 57),
  ('cont002', '3745', 'Brockton Oak (1 Hour Rental)',   850.00, 'Hardwood ceremonial casket with medium oak stain finish.',                                                                                    NULL, 58);

-- ─── Service Items ────────────────────────────────────────────────────────────

insert into service_items (id, funeral_home_id, category_id, item_code, name, description, price, price_min, price_max, is_cash_advance) values
  -- Professional Staff & Services
  ('si000001', '3745', 'c1000000-0000-0000-0000-000000000001', NULL, 'Professional Services Fees for Full Service',                NULL, 4070.00, NULL, NULL, false),
  ('si000002', '3745', 'c1000000-0000-0000-0000-000000000001', NULL, 'Professional Services Fees for Gathering Celebrations',      NULL, 3920.00, NULL, NULL, false),
  ('si000003', '3745', 'c1000000-0000-0000-0000-000000000001', NULL, 'Professional Services Fees for Memorial Service',            NULL, 3920.00, NULL, NULL, false),
  ('si000004', '3745', 'c1000000-0000-0000-0000-000000000001', NULL, 'Professional Services Fees for Graveside Service',           NULL, 3795.00, NULL, NULL, false),
  ('si000005', '3745', 'c1000000-0000-0000-0000-000000000001', NULL, 'Professional Service Fees for Cremation Witness',            NULL, 3645.00, NULL, NULL, false),
  ('si000006', '3745', 'c1000000-0000-0000-0000-000000000001', NULL, 'Basic Professional Service Fee when Forwarding Remains',     NULL, 2715.00, NULL, NULL, false),
  ('si000007', '3745', 'c1000000-0000-0000-0000-000000000001', NULL, 'Basic Professional Service Fees when Receiving Remains',     NULL, 2715.00, NULL, NULL, false),
  ('si000008', '3745', 'c1000000-0000-0000-0000-000000000001', NULL, 'Professional Services Fees for Urn Committal',               NULL, 1190.00, NULL, NULL, false),
  ('si000009', '3745', 'c1000000-0000-0000-0000-000000000001', NULL, 'Basic Service Fees for No Service Option',                   NULL,  670.00, NULL, NULL, false),
  ('si000010', '3745', 'c1000000-0000-0000-0000-000000000001', NULL, 'Registration and Documentation',                             NULL,  445.00, NULL, NULL, false),
  ('si000011', '3745', 'c1000000-0000-0000-0000-000000000001', NULL, 'Embalming',                                                  NULL,  625.00, NULL, NULL, false),
  ('si000012', '3745', 'c1000000-0000-0000-0000-000000000001', NULL, 'Sheltering of Remains',                                      NULL,  445.00, NULL, NULL, false),
  ('si000013', '3745', 'c1000000-0000-0000-0000-000000000001', NULL, 'Other Care and Preparation',                                 NULL,  445.00, NULL, NULL, false),
  ('si000014', '3745', 'c1000000-0000-0000-0000-000000000001', NULL, 'Special Care for Autopsied Cases',                           NULL,  525.00, NULL, NULL, false),
  -- Facilities and Supervision
  ('si000020', '3745', 'c1000000-0000-0000-0000-000000000002', NULL, 'Use of Facilities for Embalming and Preparation',            NULL,  445.00, NULL, NULL, false),
  ('si000021', '3745', 'c1000000-0000-0000-0000-000000000002', NULL, 'Basic Venue',                                                NULL,  395.00, NULL, NULL, false),
  ('si000022', '3745', 'c1000000-0000-0000-0000-000000000002', NULL, 'Standard Venue',                                             NULL,  495.00, NULL, NULL, false),
  ('si000023', '3745', 'c1000000-0000-0000-0000-000000000002', NULL, 'Premium Venue',                                              NULL,  595.00, NULL, NULL, false),
  ('si000024', '3745', 'c1000000-0000-0000-0000-000000000002', NULL, 'Exclusive Venue',                                            NULL, 2595.00, NULL, NULL, false),
  ('si000025', '3745', 'c1000000-0000-0000-0000-000000000002', NULL, 'Celebration Gathering',                                      NULL, 1595.00, NULL, NULL, false),
  ('si000026', '3745', 'c1000000-0000-0000-0000-000000000002', NULL, 'Venue and Staff Services to Coordinate a Simple Gathering',  NULL,  895.00, NULL, NULL, false),
  ('si000027', '3745', 'c1000000-0000-0000-0000-000000000002', NULL, 'Off-Site Venue & Staff Services',                            NULL,  595.00, NULL, NULL, false),
  ('si000028', '3745', 'c1000000-0000-0000-0000-000000000002', NULL, 'Private Family Moment at our Facility',                      NULL,  295.00, NULL, NULL, false),
  ('si000029', '3745', 'c1000000-0000-0000-0000-000000000002', NULL, 'Supervision for Visitation Per Hour',                        NULL,  395.00, NULL, NULL, false),
  ('si000030', '3745', 'c1000000-0000-0000-0000-000000000002', NULL, 'Supervision - Evening Charge',                               NULL,  400.00, NULL, NULL, false),
  ('si000031', '3745', 'c1000000-0000-0000-0000-000000000002', NULL, 'Supervision - Holiday Charge',                               NULL,  999.00, NULL, NULL, false),
  ('si000032', '3745', 'c1000000-0000-0000-0000-000000000002', NULL, 'Supervision of Disinterment',                                NULL, 3595.00, NULL, NULL, false),
  ('si000033', '3745', 'c1000000-0000-0000-0000-000000000002', NULL, 'Additional Charge - Weekend',                                NULL,  999.00, NULL, NULL, false),
  -- Transportation
  ('si000040', '3745', 'c1000000-0000-0000-0000-000000000003', NULL, 'Transfer of Remains from Place of Death to Funeral Home', 'Within a 50 kilometre radius. Additional distance will be charged at $2.00 per kilometre.', 495.00, NULL, NULL, false),
  ('si000041', '3745', 'c1000000-0000-0000-0000-000000000003', NULL, 'Funeral Vehicle (e.g. Hearse)',                            'Within a 50 kilometre radius. Additional distance will be charged at $2.00 per kilometre.', 395.00, NULL, NULL, false),
  ('si000042', '3745', 'c1000000-0000-0000-0000-000000000003', NULL, 'Limousine',                                                'Within a 50 kilometre radius. Additional distance will be charged at $2.00 per kilometre.', 350.00, NULL, NULL, false),
  ('si000043', '3745', 'c1000000-0000-0000-0000-000000000003', NULL, 'Flower Vehicle',                                           'Within a 50 kilometre radius. Additional distance will be charged at $2.00 per kilometre.', 220.00, NULL, NULL, false),
  ('si000044', '3745', 'c1000000-0000-0000-0000-000000000003', NULL, 'Transfer to or from Airport',                             'Within a 50 kilometre radius. Additional distance will be charged at $2.00 per kilometre.', 395.00, NULL, NULL, false),
  ('si000045', '3745', 'c1000000-0000-0000-0000-000000000003', NULL, 'Shipping Administration',                                 'Administration duties required to coordinate shipping of remains.',                         495.00, NULL, NULL, false),
  ('si000046', '3745', 'c1000000-0000-0000-0000-000000000003', NULL, 'Handling and Transfer of Ashes',                           NULL, 195.00, NULL, NULL, false),
  -- Family Support Options
  ('si000050', '3745', 'c1000000-0000-0000-0000-000000000004', NULL, 'Medallion Bundle',                                           NULL,  295.00, NULL, NULL, false),
  ('si000051', '3745', 'c1000000-0000-0000-0000-000000000004', NULL, 'Timeless Touch Fingerprint',                                 NULL,  295.00, NULL, NULL, false),
  ('si000052', '3745', 'c1000000-0000-0000-0000-000000000004', NULL, 'Funeral Webcasting',                                         NULL,  295.00, NULL, NULL, false),
  ('si000053', '3745', 'c1000000-0000-0000-0000-000000000004', NULL, 'Retractable Table Banner',                                   NULL,  295.00, NULL, NULL, false),
  ('si000054', '3745', 'c1000000-0000-0000-0000-000000000004', NULL, 'Legal Service Plan',                                         NULL,  295.00, NULL, NULL, false),
  ('si000055', '3745', 'c1000000-0000-0000-0000-000000000004', NULL, 'Memory Portrait - 10x15 Framed Canvas Portrait',             NULL,  295.00, NULL, NULL, false),
  ('si000056', '3745', 'c1000000-0000-0000-0000-000000000004', NULL, 'Treasure Kits',                                              NULL,  295.00, NULL, NULL, false),
  ('si000057', '3745', 'c1000000-0000-0000-0000-000000000004', NULL, 'Family Estate Manager',                                      NULL,  295.00, NULL, NULL, false),
  ('si000058', '3745', 'c1000000-0000-0000-0000-000000000004', NULL, 'Estate Fraud Protection',                                    NULL,  135.00, NULL, NULL, false),
  ('si000059', '3745', 'c1000000-0000-0000-0000-000000000004', NULL, 'Everlasting Memorial',                                       NULL,  490.00, NULL, NULL, false),
  ('si000060', '3745', 'c1000000-0000-0000-0000-000000000004', NULL, 'Traditional Ritual Washing',                                 NULL,  395.00, NULL, NULL, false),
  ('si000200', '3745', 'c1000000-0000-0000-0000-000000000004', NULL, 'Plan Support Option',                                        NULL,  295.00, NULL, NULL, false),
  ('si000201', '3745', 'c1000000-0000-0000-0000-000000000004', NULL, 'Cremation Plan Support Option',                              NULL,  295.00, NULL, NULL, false),
  -- Miscellaneous Services & Merchandise
  ('si000070', '3745', 'c1000000-0000-0000-0000-000000000005', NULL, 'Standard Text Personalization',                              NULL,   50.00, NULL, NULL, false),
  ('si000071', '3745', 'c1000000-0000-0000-0000-000000000005', NULL, 'Custom Service Folders (100)',                               NULL,  250.00, NULL, NULL, false),
  ('si000072', '3745', 'c1000000-0000-0000-0000-000000000005', NULL, 'Sterling Silver Oval Pendant',                               NULL,  295.00, NULL, NULL, false),
  ('si000073', '3745', 'c1000000-0000-0000-0000-000000000005', NULL, 'A Life Remembered Book',                                     NULL,   95.00, NULL, NULL, false),
  ('si000074', '3745', 'c1000000-0000-0000-0000-000000000005', NULL, 'Cremation Expediting Fee',                                   NULL,  499.00, NULL, NULL, false),
  ('si000075', '3745', 'c1000000-0000-0000-0000-000000000005', NULL, 'Cremation Witnessing Fee',                                   NULL,  499.00, NULL, NULL, false),
  ('si000076', '3745', 'c1000000-0000-0000-0000-000000000005', NULL, 'Crematory Fee',                                              NULL,  995.00, NULL, NULL, false),
  ('si000077', '3745', 'c1000000-0000-0000-0000-000000000005', NULL, 'Our Collection Folders or Prayer Cards (per 100)',           NULL,  195.00, NULL, NULL, false),
  ('si000078', '3745', 'c1000000-0000-0000-0000-000000000005', NULL, 'Small Memory Folders or Memory Cards (per 100)',             NULL,  220.00, NULL, NULL, false),
  ('si000079', '3745', 'c1000000-0000-0000-0000-000000000005', NULL, 'Medium Memory Cards or Memory Folders (per 100)',            NULL,  320.00, NULL, NULL, false),
  ('si000080', '3745', 'c1000000-0000-0000-0000-000000000005', NULL, 'Large Memory Booklets or Memory Cards (per 100)',            NULL,  620.00, NULL, NULL, false),
  ('si000081', '3745', 'c1000000-0000-0000-0000-000000000005', NULL, 'Medium Memory Book',                                         NULL,   75.00, NULL, NULL, false),
  ('si000082', '3745', 'c1000000-0000-0000-0000-000000000005', NULL, 'Memory Register Book',                                       NULL,   75.00, NULL, NULL, false),
  ('si000083', '3745', 'c1000000-0000-0000-0000-000000000005', NULL, 'Keepsake Box',                                               NULL,   25.00, NULL, NULL, false),
  ('si000084', '3745', 'c1000000-0000-0000-0000-000000000005', NULL, 'Soft Touch Bookmarks (50)',                                  NULL,  200.00, NULL, NULL, false),
  ('si000085', '3745', 'c1000000-0000-0000-0000-000000000005', NULL, 'Our Collection Thank You Cards (per 50)',                    NULL,  100.00, NULL, NULL, false),
  ('si000086', '3745', 'c1000000-0000-0000-0000-000000000005', NULL, 'Personalized Thank You Cards (per 25)',                      NULL,   75.00, NULL, NULL, false),
  ('si000087', '3745', 'c1000000-0000-0000-0000-000000000005', NULL, 'Professional Pallbearer (per person)',                       NULL,  150.00, NULL, NULL, false),
  ('si000088', '3745', 'c1000000-0000-0000-0000-000000000005', NULL, 'Reception and Hostess',                                      NULL,  995.00, NULL, NULL, false),
  ('si000089', '3745', 'c1000000-0000-0000-0000-000000000005', NULL, 'Retractable Floor Banner',                                   NULL,  395.00, NULL, NULL, false),
  ('si000090', '3745', 'c1000000-0000-0000-0000-000000000005', NULL, 'Single Small Medallion Case',                                NULL,   65.00, NULL, NULL, false),
  ('si000091', '3745', 'c1000000-0000-0000-0000-000000000005', NULL, 'Triple Small Medallion Case',                                NULL,   95.00, NULL, NULL, false),
  ('si000092', '3745', 'c1000000-0000-0000-0000-000000000005', NULL, 'Dignity Stationery Package',                                 NULL,  NULL, 395.00, 795.00, false),
  ('si000093', '3745', 'c1000000-0000-0000-0000-000000000005', NULL, 'Cremation Jewellery Bundle',                                 NULL,  295.00, NULL, NULL, false),
  ('si000094', '3745', 'c1000000-0000-0000-0000-000000000005', NULL, 'Casket Medallions',                                          NULL,  NULL,  50.00, 295.00, false),
  ('si000202', '3745', 'c1000000-0000-0000-0000-000000000005', NULL, 'Burial Flowers',                                             NULL,  695.00, NULL, NULL, false),
  ('si000203', '3745', 'c1000000-0000-0000-0000-000000000005', NULL, 'Burial Flowers',                                             NULL,  595.00, NULL, NULL, false),
  ('si000204', '3745', 'c1000000-0000-0000-0000-000000000005', NULL, 'Burial Flowers',                                             NULL,  495.00, NULL, NULL, false),
  ('si000205', '3745', 'c1000000-0000-0000-0000-000000000005', NULL, 'Cremation Flowers',                                          NULL,  500.00, NULL, NULL, false),
  ('si000206', '3745', 'c1000000-0000-0000-0000-000000000005', NULL, 'Cremation Flowers',                                          NULL,  400.00, NULL, NULL, false),
  -- Stationery
  ('si000100', '3745', 'c1000000-0000-0000-0000-000000000006', NULL, 'Remembrance Collection',    '1 Medium Memory Book, 100 Small Memory Folders or Memory Cards, 25 Small Tribute Thank You Cards, 1 Keepsake Box.',                         395.00, NULL, NULL, false),
  ('si000101', '3745', 'c1000000-0000-0000-0000-000000000006', NULL, 'Our Collection',            '1 Memory Register Book, 100 Our Collection Folders or Prayer Cards, 50 Our Collection Thank You Cards, 1 Keepsake Box.',                    395.00, NULL, NULL, false),
  ('si000102', '3745', 'c1000000-0000-0000-0000-000000000006', NULL, 'Commemorative Collection',  '1 Medium Memory Book, 100 Medium Memory Folders or Memory Cards, 25 Medium Tribute Thank You Cards, 1 Keepsake Box.',                       495.00, NULL, NULL, false),
  ('si000103', '3745', 'c1000000-0000-0000-0000-000000000006', NULL, 'Esteemed Collection',       '1 Medium Memory Book, 100 Large Memory Booklets or Memory Cards, 25 Medium Tribute Thank You Cards, 1 Keepsake Box.',                       795.00, NULL, NULL, false),
  -- Cash Advances
  ('si000110', '3745', 'c1000000-0000-0000-0000-000000000007', NULL, 'Consumer Protection BC Fee',        NULL, 48.00, NULL, NULL, false),
  ('si000111', '3745', 'c1000000-0000-0000-0000-000000000007', NULL, 'Clergy Honorarium',                  NULL,  NULL, NULL, NULL, true),
  ('si000112', '3745', 'c1000000-0000-0000-0000-000000000007', NULL, 'Death Certificate (each)',           NULL, 27.00, NULL, NULL, false),
  ('si000113', '3745', 'c1000000-0000-0000-0000-000000000007', NULL, 'Music / Soloist / Piper',            NULL,  NULL, NULL, NULL, true),
  ('si000114', '3745', 'c1000000-0000-0000-0000-000000000007', NULL, 'Newspaper Notice',                   NULL,  NULL, NULL, NULL, true),
  ('si000115', '3745', 'c1000000-0000-0000-0000-000000000007', NULL, 'Organist',                           NULL,  NULL, NULL, NULL, true),
  ('si000116', '3745', 'c1000000-0000-0000-0000-000000000007', NULL, 'Soloist',                            NULL,  NULL, NULL, NULL, true),
  ('si000117', '3745', 'c1000000-0000-0000-0000-000000000007', NULL, 'Outside Funeral Director Expense',   NULL,  NULL, NULL, NULL, true),
  ('si000118', '3745', 'c1000000-0000-0000-0000-000000000007', NULL, 'Cemetery Fees',                      NULL,  NULL, NULL, NULL, true),
  ('si000119', '3745', 'c1000000-0000-0000-0000-000000000007', NULL, 'Public Transportation',              NULL,  NULL, NULL, NULL, true),
  -- Facilities (events)
  ('si000207', '3745', 'c1000000-0000-0000-0000-000000000002', NULL, 'Catered Reception III',              NULL, 2150.00, NULL, NULL, false),
  ('si000208', '3745', 'c1000000-0000-0000-0000-000000000002', NULL, 'Catered Reception II',               NULL, 1980.00, NULL, NULL, false),
  ('si000209', '3745', 'c1000000-0000-0000-0000-000000000002', NULL, 'Catered Reception I',                NULL, 1350.00, NULL, NULL, false),
  -- Urns
  ('si000213', '3745', 'c1000000-0000-0000-0000-000000000009', NULL, 'Memorial Urn Selection', 'LoveUrns HeartFelt Gold, Terrybear Eminence White Marble Urn, Granville Lucinda Blue Horizontal Urn, Granville Charlotte Horizontal Urn', 1295.00, NULL, NULL, false),
  ('si000214', '3745', 'c1000000-0000-0000-0000-000000000009', NULL, 'Memorial Urn Selection', 'Urnes Bégin Versatile Urn Navy, LoveUrns Laurel Midnight, Terrybear Satori Ocean Pearl, Batesville Memento Chest',                         795.00, NULL, NULL, false),
  ('si000215', '3745', 'c1000000-0000-0000-0000-000000000009', NULL, 'Memorial Urn Selection', 'LoveUrns Laurel Crimson, Urnes Bégin Sky Pewter, Mackenzie Classic Sky Blue, Batesville Cherry Chest',                                    595.00, NULL, NULL, false);

-- ─── Packages ─────────────────────────────────────────────────────────────────

insert into packages (id, funeral_home_id, name, pkg_type, total_price, package_discount, default_casket_id, sort_order) values
  -- Named packages
  ('pk000010', '3745', 'Heritage Funeral Service',   'package',  17519.00, 515.00, 'csk001',  10),
  ('pk000011', '3745', 'Honour Funeral Service',     'package',  16449.00, 485.00, 'csk005',  11),
  ('pk000012', '3745', 'Tribute Funeral Service',    'package',  14669.00, 435.00, 'csk009',  12),
  ('pk000013', '3745', 'Heritage Cremation Service', 'package',  16719.00, 510.00, 'cont001', 13),
  ('pk000014', '3745', 'Honour Cremation Service',   'package',  13775.00, 410.00, 'cont002', 14),
  ('pk000015', '3745', 'Tribute Cremation Service',  'package',   6065.00,  50.00, 'cont003', 15),
  -- A la carte
  ('pk000001', '3745', 'Full Service',           'alacarte',  7650.00, 0.00, NULL, 1),
  ('pk000002', '3745', 'Witness Cremation',      'alacarte',  7000.00, 0.00, NULL, 2),
  ('pk000003', '3745', 'Service of Remembrance', 'alacarte',  7475.00, 0.00, NULL, 3),
  ('pk000004', '3745', 'Graveside Service',      'alacarte',  6155.00, 0.00, NULL, 4),
  ('pk000005', '3745', 'Urn Committal Option',   'alacarte',  4150.00, 0.00, NULL, 5),
  ('pk000006', '3745', 'No Service Option',      'alacarte',  3630.00, 0.00, NULL, 6),
  ('pk000007', '3745', 'Forwarding of Remains',  'alacarte',  5120.00, 0.00, NULL, 7),
  ('pk000008', '3745', 'Receiving of Remains',   'alacarte',  3950.00, 0.00, NULL, 8),
  ('pk000009', '3745', 'Tea Room Gathering',     'alacarte',  7240.00, 0.00, NULL, 9);

-- ─── Package Items ────────────────────────────────────────────────────────────

insert into package_items (package_id, service_item_id) values
  -- Full Service (pk000001)
  ('pk000001','si000001'),('pk000001','si000010'),('pk000001','si000011'),
  ('pk000001','si000013'),('pk000001','si000012'),('pk000001','si000040'),
  ('pk000001','si000041'),('pk000001','si000058'),('pk000001','si000023'),
  -- Witness Cremation (pk000002)
  ('pk000002','si000005'),('pk000002','si000010'),('pk000002','si000013'),
  ('pk000002','si000012'),('pk000002','si000040'),('pk000002','si000041'),
  ('pk000002','si000058'),('pk000002','si000076'),
  -- Service of Remembrance (pk000003)
  ('pk000003','si000003'),('pk000003','si000010'),('pk000003','si000013'),
  ('pk000003','si000012'),('pk000003','si000040'),('pk000003','si000058'),
  ('pk000003','si000076'),('pk000003','si000023'),
  -- Graveside Service (pk000004)
  ('pk000004','si000004'),('pk000004','si000010'),('pk000004','si000013'),
  ('pk000004','si000012'),('pk000004','si000040'),('pk000004','si000041'),
  ('pk000004','si000058'),
  -- Urn Committal (pk000005)
  ('pk000005','si000008'),('pk000005','si000010'),('pk000005','si000013'),
  ('pk000005','si000012'),('pk000005','si000040'),('pk000005','si000058'),
  ('pk000005','si000076'),
  -- No Service (pk000006)
  ('pk000006','si000009'),('pk000006','si000010'),('pk000006','si000013'),
  ('pk000006','si000012'),('pk000006','si000040'),('pk000006','si000058'),
  ('pk000006','si000076'),
  -- Forwarding of Remains (pk000007)
  ('pk000007','si000006'),('pk000007','si000010'),('pk000007','si000011'),
  ('pk000007','si000012'),('pk000007','si000044'),('pk000007','si000040'),
  -- Receiving of Remains (pk000008)
  ('pk000008','si000007'),('pk000008','si000012'),('pk000008','si000044'),
  ('pk000008','si000041'),
  -- Tea Room Gathering (pk000009)
  ('pk000009','si000022'),('pk000009','si000002'),('pk000009','si000088'),
  ('pk000009','si000012'),('pk000009','si000013'),('pk000009','si000010'),
  ('pk000009','si000040'),
  -- Heritage Funeral Service (pk000010) — casket via default_casket_id
  ('pk000010','si000001'),('pk000010','si000010'),('pk000010','si000011'),
  ('pk000010','si000013'),('pk000010','si000012'),('pk000010','si000040'),
  ('pk000010','si000041'),('pk000010','si000042'),('pk000010','si000059'),
  ('pk000010','si000058'),('pk000010','si000088'),('pk000010','si000202'),
  ('pk000010','si000023'),('pk000010','si000200'),
  ('pk000010','si000207'),('pk000010','si000103'),
  -- Honour Funeral Service (pk000011)
  ('pk000011','si000001'),('pk000011','si000010'),('pk000011','si000011'),
  ('pk000011','si000013'),('pk000011','si000012'),('pk000011','si000040'),
  ('pk000011','si000041'),('pk000011','si000042'),('pk000011','si000059'),
  ('pk000011','si000058'),('pk000011','si000088'),('pk000011','si000203'),
  ('pk000011','si000023'),('pk000011','si000200'),
  ('pk000011','si000208'),('pk000011','si000102'),
  -- Tribute Funeral Service (pk000012)
  ('pk000012','si000001'),('pk000012','si000010'),('pk000012','si000011'),
  ('pk000012','si000013'),('pk000012','si000012'),('pk000012','si000040'),
  ('pk000012','si000041'),('pk000012','si000059'),
  ('pk000012','si000058'),('pk000012','si000088'),('pk000012','si000204'),
  ('pk000012','si000023'),('pk000012','si000200'),
  ('pk000012','si000209'),('pk000012','si000100'),
  -- Heritage Cremation Service (pk000013)
  ('pk000013','si000001'),('pk000013','si000010'),('pk000013','si000011'),
  ('pk000013','si000013'),('pk000013','si000012'),('pk000013','si000040'),
  ('pk000013','si000042'),('pk000013','si000059'),
  ('pk000013','si000058'),('pk000013','si000088'),('pk000013','si000205'),
  ('pk000013','si000076'),('pk000013','si000023'),('pk000013','si000201'),
  ('pk000013','si000213'),('pk000013','si000207'),('pk000013','si000103'),
  -- Honour Cremation Service (pk000014)
  ('pk000014','si000002'),('pk000014','si000010'),
  ('pk000014','si000013'),('pk000014','si000012'),('pk000014','si000040'),
  ('pk000014','si000059'),('pk000014','si000058'),('pk000014','si000088'),
  ('pk000014','si000206'),('pk000014','si000076'),('pk000014','si000023'),
  ('pk000014','si000201'),('pk000014','si000214'),
  ('pk000014','si000208'),('pk000014','si000102'),
  -- Tribute Cremation Service (pk000015)
  ('pk000015','si000009'),('pk000015','si000010'),('pk000015','si000013'),
  ('pk000015','si000026'),('pk000015','si000012'),('pk000015','si000040'),
  ('pk000015','si000058'),('pk000015','si000076'),('pk000015','si000201'),
  ('pk000015','si000215');
