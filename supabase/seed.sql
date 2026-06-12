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

-- ─── Casket Catalog (global — shared across all funeral homes) ───────────────
-- Images and descriptions are stored once; pricing is per-home in funeral_home_caskets

insert into casket_catalog (id, name, description, manufacturer, item_code, category, image_url, sort_order) values
  -- Wood Caskets
  ('csk017', '710 President',               'Mahogany casket with a dark brown, Georgetown stained exterior and a silverbeige velvet interior.',                                             'Batesville',       'CWMYBAPXEJ', 'wood', NULL,  1),
  ('csk018', 'Eloquence Mahogany',           'Solid mahogany casket with a dark mahogany, hand-rubbed, high gloss exterior, and a champagne, Whitehall velvet interior.',                   'Batesville',       'CWMYBARWBQ', 'wood', NULL,  2),
  ('csk019', 'Bexley Oak',                   'Solid oak casket with a medium, hand-rubbed, high gloss exterior and a champagne, Whitehall velvet interior.',                                'Batesville',       'CWOKBANPBQ', 'wood', NULL,  3),
  ('csk020', 'Cantonese Red (Full Couch)',   'Solid mahogany casket with a polished cherry exterior, folksau lugs, and pearl velvet interior.',                                             'Vancouver Casket', 'CWBRVBIPEC', 'wood', '/caskets/cantonese-red.jpg',  4),
  ('csk016', 'Regent',                       'Solid mahogany casket with a dark finished exterior and champagne velvet interior.',                                                           'Batesville',       'CWMYBAROBQ', 'wood', '/caskets/regent.jpg',  5),
  ('csk021', 'Langdon Cherry',               'Solid cherry casket with a dark, satin finished exterior, and a champagne velvet interior.',                                                  'Batesville',       'CWCHBAQYBQ', 'wood', NULL,  6),
  ('csk022', 'Provincial Maple',             'Solid maple casket with a medium, satin finished exterior and champagne, velvet interior.',                                                   NULL,               NULL,         'wood', NULL,  7),
  ('csk023', 'Chandler',                     'Solid mahogany casket with a dark finished exterior and a champagne velvet interior.',                                                        'Batesville',       'CWMYBARHBQ', 'wood', NULL,  8),
  ('csk024', 'Classic Mahogany',             'Solid Mahogany casket with Titian stain and Prestige hand-rubbed satin exterior with Pearl Premium velvet interior.',                        'Victoriaville',    'CWMYLBABEJ', 'wood', '/caskets/classic-mahogany.jpg',  9),
  ('csk025', 'Jamestown PC',                 'Timeless old world satin finish urn shape casket made of solid American black cherry hardwood with pearl velvet interior - perfection cut.', 'Victoriaville',    'CWCHLBAFEJ', 'wood', NULL, 10),
  ('csk015', 'Prominence',                   'Solid maple casket with a dark hand-rubbed, high gloss, cherry stain exterior with a champagne velvet interior.',                            'Batesville',       'CWMLBDA6BQ', 'wood', '/caskets/prominence.jpg', 11),
  ('csk026', 'Warren Oak',                   'Solid oak casket with a dark stain, satin finish exterior and champagne velvet interior.',                                                    'Batesville',       'CWOKBAMIBQ', 'wood', NULL, 12),
  ('csk027', 'Woodbridge Pecan',             'Solid pecan casket with a medium stained, satin finished exterior and champagne velvet interior.',                                            'Batesville',       'CWPNBACMBQ', 'wood', NULL, 13),
  ('csk028', 'St. Thomas Oak',               'Solid Oak casket with Persian Fawn stain and polished exterior with ivory velvet interior.',                                                  'Victoriaville',    'CWWLBAJDA',  'wood', NULL, 14),
  ('csk029', 'Mansfield-27',                 'Select hardwood oversized casket with a medium pecan gloss finished exterior with rosetan crepe interior.',                                   'Batesville',       'CWHWBMHHFD', 'wood', NULL, 15),
  ('csk030', 'Briar Hill',                   'Hardwood casket with beige basket weave interior - perfection cut.',                                                                          'Victoriaville',    'CWMLLBEPBN', 'wood', NULL, 16),
  ('csk031', 'Camden Oak',                   'Solid traditional oak casket with dark finished exterior, and a champagne velvet interior.',                                                  'Batesville',       'CWOKBFBKBP', 'wood', NULL, 17),
  ('csk032', 'Cameron Oak',                  'Oak casket with a medium, autumn oak stained finished exterior and champagne velvet interior.',                                               'Batesville',       'CWOKBANVBQ', 'wood', NULL, 18),
  ('csk033', 'Promise',                      'Sustainable select hardwood casket with a mocha brown wash stain exterior and meadowlark natural cotton interior.',                           'Batesville',       'CWSHBPHCML', 'wood', NULL, 19),
  ('csk034', 'Rosette',                      'Select hardwood veneer casket with a dark cherry, hand-rubbed, high gloss exterior and natural batiste interior.',                            'Batesville',       'CWHWBRHCDC', 'wood', NULL, 20),
  ('csk035', 'Victoria Cherry',              'Solid Cherry octagon casket with Empire stain and polished exterior with blush pink velvet interior.',                                        'Victoriaville',    'CWCHLBAKBH', 'wood', NULL, 21),
  ('csk036', 'Sincerity',                    'Sustainable select hardwood casket with a driftwood grey wash stain exterior and meadowlark natural cotton interior.',                        'Batesville',       'CWSHBSINML', 'wood', NULL, 22),
  ('csk037', 'Brexton',                      'Premium oak veneer casket with a chestnut stain and satin finished exterior and a champagne velvet interior.',                               'Batesville',       'CWOKBCHDBQ', 'wood', NULL, 23),
  ('csk014', 'Dominion HC Wood Maple Crepe', 'Solid Maple casket with Titian stain and polished exterior with tan crepe interior.',                                                        'Victoriaville',    'CWMLLBWEGQ', 'wood', '/caskets/dominion-hc-maple.jpg', 24),
  ('csk004', 'Eleanor Oak',                  'Oak casket with a chestnut stained, satin finished exterior and pink crepe interior.',                                                       'Batesville',       'CWOKBBYAEO', 'wood', NULL, 25),
  ('csk003', 'Fireside',                     'Oak wood casket with medium rustic stain with satin finish exterior and oatmeal duck / camo cloth interior.',                                'Batesville',       'CWOKBBAVA1', 'wood', NULL, 26),
  ('csk038', 'Hadyn',                        'Select hardwood casket with a medium pecan, hand-rubbed high gloss finish exterior and a rosetan crepe interior.',                           NULL,               NULL,         'wood', NULL, 27),
  ('csk007', 'Bailey',                       'Select hardwood veneer casket with medium finish exterior and khaki linwood interior.',                                                       NULL,               NULL,         'wood', NULL, 28),
  ('csk008', 'Hartvic',                      'Solid Hardwood casket veneer sided with Dark Almond Shaded stain and satin exterior with tan crepe interior.',                               'Victoriaville',    'CWPRLBAEGQ', 'wood', NULL, 29),
  ('csk039', 'Sherwood Oak',                 'Solid Oak casket veneer sided with Shaded Persian Fawn stain and polished exterior with tan crepe interior.',                                'Victoriaville',    'CWOKLEGZGQ', 'wood', NULL, 30),
  ('csk006', 'Watson',                       'Hardwood casket with a medium finished exterior with a lugwood corner design and beige linwood interior.',                                   NULL,               NULL,         'wood', NULL, 31),
  ('csk009', 'Coleridge',                    'Hardwood casket with a medium finished exterior and rosetan crepe interior.',                                                                NULL,               NULL,         'wood', NULL, 32),
  ('csk040', 'Constance',                    'Select hardwood casket with a medium cherry stain, hand-rubbed, gloss finish exterior and moss pink crepe interior.',                        NULL,               NULL,         'wood', NULL, 33),
  ('csk011', 'Heavenly White',               'Solid hardwood casket veneer sided with alpine white stain, polish finished exterior and white crepe interior.',                             'Victoriaville',    'CWHWLBA1HB', 'wood', '/caskets/heavenly-white.jpg', 34),
  ('csk010', 'Montgomery',                   'Select hardwood casket with a medium walnut stain, hand-rubbed high gloss finish exterior and rosetan crepe interior.',                      NULL,               NULL,         'wood', '/caskets/montgomery.jpg', 35),
  ('csk041', 'White Rose',                   'Solid Hardwood casket with veneer sides with Alpine White stain and polished exterior with blush pink velvet interior.',                     'Victoriaville',    'CWHWLBA1EY', 'wood', NULL, 36),
  ('csk012', 'Winfield',                     'Solid Hardwood casket veneer sided with American Cherry stain and satin exterior with tan crepe interior.',                                  'Victoriaville',    'CWHWLEYGGQ', 'wood', '/caskets/winfield.jpg', 37),
  ('csk042', 'Carnaby',                      'Hardwood casket with Vantablack satin finish exterior and beige basket weave interior.',                                                     NULL,               NULL,         'wood', NULL, 38),
  ('csk043', 'Atlantic',                     'Solid Hardwood casket veneer sided with Garnet stain and gloss exterior with beige crepe interior.',                                         'Victoriaville',    'CWPRLAA3AJ', 'wood', '/caskets/atlantic.jpg', 39),
  ('csk044', 'Natura',                       'New leaf solid poplar casket with natural finish exterior with 100% natural cotton interior.',                                                'Victoriaville',    'CWPRLDFEAB', 'wood', NULL, 40),
  ('csk045', 'Oxford',                       'Solid hardwood casket with a light, finished exterior and rosetan crepe interior.',                                                           NULL,               NULL,         'wood', '/caskets/oxford.jpg', 41),
  ('csk013', 'Freelton',                     'Select hardwood casket with a medium finished exterior and ivory crepe interior.',                                                            NULL,               NULL,         'wood', '/caskets/freelton.jpg', 42),
  ('csk046', 'Schafer',                      'Select hardwood casket with a medium finished exterior and ivory crepe interior.',                                                            NULL,               NULL,         'wood', '/caskets/schafer.jpg', 43),
  -- Metal Caskets
  ('csk047', 'Mediterranean Copper',         '32-ounce copper casket with a copper brushed exterior and champagne velvet interior.',                                                       'Batesville',       'CMC3BEZYBQ', 'metal', NULL, 44),
  ('csk048', 'Aegean Copper',                '32 oz. copper casket with a copper brushed exterior and gold accents and a champagne, Sovereign velvet interior.',                           'Batesville',       'CMC3BFALBQ', 'metal', NULL, 45),
  ('csk049', 'Golden Granite',               '18 gauge steel casket with a dual-tone grey, brushed exterior and a champagne velvet interior.',                                             'Batesville',       'CMS8BDJGBQ', 'metal', NULL, 46),
  ('csk050', 'Primrose',                     '18 gauge steel casket with a white shaded exterior and gold accents and a moss pink crepe interior.',                                        'Batesville',       'CMS8BATBEO', 'metal', NULL, 47),
  ('csk051', 'Merlot-28',                    '18-gauge steel oversized casket with a burgundy painted exterior and champagne velvet interior.',                                             'Batesville',       'CMS8BDCOBP', 'metal', NULL, 48),
  ('csk001', 'Merlot',                       '18-gauge steel casket with a burgundy painted exterior and rosetan, crepe interior.',                                                        NULL,               NULL,         'metal', NULL, 49),
  ('csk052', 'Antique Blue-28',              '20-gauge steel oversized casket with a blue shaded exterior and silver accents and a light blue, crepe interior.',                           'Batesville',       'CMS0BDLPDE', 'metal', NULL, 50),
  ('csk005', 'Misty Blue',                   '20 gauge steel casket with a blue shaded exterior and blue accents, and a light blue crepe interior.',                                       NULL,               NULL,         'metal', NULL, 51),
  -- Cremation Oriented Caskets
  ('csk053', 'McConnell',                    'Hollow cored poplar and poplar faced plywood with medium flat stain and tan crepe lining with pillow.',                                      'Vancouver Casket', 'CCVMCCC',    'cremation', '/caskets/mcconnell.jpg', 52),
  -- Containers
  ('cont004', 'Plywood Container',           'Plywood cremation container cut top.',                                                                                                       NULL,               NULL,         'container', '/caskets/plywood-container.jpg', 53),
  ('cont003', 'Cypress',                     'Hollow cored poplar container with natural finish and white satin mattress and pillow only.',                                                NULL,               NULL,         'container', '/caskets/cypress.jpg', 54),
  ('cont005', 'Particle Board Container',    'Particle board cremation container with two strap handles, and no interior.',                                                                NULL,               NULL,         'container', '/caskets/particle-board-container.jpg', 55),
  ('cont006', 'Trayview',                    'Cardboard container - cremation oriented with a cardboard exterior and crepe paper mattress and pillow.',                                    NULL,               NULL,         'container', '/caskets/trayview.jpg', 56),
  -- Rental Caskets
  ('cont001', 'Brockton Oak Ceremonial',     'Hardwood ceremonial casket with medium, oak stained exterior and rosetan crepe interior.',                                                   'Batesville',       'CRBALTF',    'rental', '/caskets/brockton-oak-ceremonial.jpg', 57),
  ('cont002', 'Brockton Oak (1 Hour Rental)','Hardwood ceremonial casket with medium oak stain finish.',                                                                                   'Batesville',       'CRBBRHC',    'rental', NULL, 58);

-- ─── Forest Lawn (3605) + Victory Memorial (3745) only catalog entries ────────

insert into casket_catalog (id, name, description, manufacturer, item_code, category, sort_order) values
  ('csk060', 'Dynasty (Full Couch)',                 'Solid mahogany casket with medium mahogany stain exterior and velvet interior.',                                          'Vancouver Casket', 'CWMYVFDLGU',  'wood',      1),
  ('csk061', 'Emperor',                              'Solid Mahogany casket with hand-carved details and a dark, polished exterior and beige velvet interior.',                 'Vancouver Casket', 'CWMYVBYIAP',  'wood',      3),
  ('csk062', 'Executive Mahogany',                   'Solid mahogany casket high gloss, polished exterior and coffee velvet interior.',                                         'Vancouver Casket', 'CWMYVBZKBS',  'wood',      4),
  ('csk063', 'Pieta Maple',                          'Solid maple casket with a dark cherry, hand-rubbed, high gloss exterior and a champagne velvet interior.',               'Batesville',       'CWMLBAGPBQ',  'wood',     10),
  ('csk064', 'Ho Wan',                               'Hardwood casket with a dark stained, hand-carved detailed exterior and white crepe interior.',                            'Vancouver Casket', 'CWHWVCKDBW',  'wood',     16),
  ('csk065', 'Shanghai',                             'Hardwood casket with a dark stained, polished exterior and white crepe interior.',                                        'Vancouver Casket', 'CWELVEFYHB',  'wood',     17),
  ('csk066', 'Woodhaven Pecan',                      'Pecan veneer casket with a medium pecan, satin finish exterior and champagne velvet interior.',                           'Batesville',       'CWPNBADRBQ',  'wood',     20),
  ('csk072', 'Butler',                               'Select hardwood casket with a medium finished exterior and white barry interior.',                                         'Batesville',       'CWHWBBGWGX',  'wood',     40),
  ('csk067', 'Promethean (Full Couch)',               '48 oz. semi-precious bronze casket with a hand polished, gold mirrored exterior and Shasta Lily white velvet interior.','Batesville',       'CMB4BFBGFQ',  'metal',    41),
  ('csk068', 'Venetian Bronze',                      '48-ounce bronze casket with a bronze brushed exterior with gold accents and a champagne velvet interior.',                'Batesville',       'CMB4BFAPBQ',  'metal',    42),
  ('csk069', 'Classic Mahogany Bronze (Full Couch)', '48 ounce bronze casket with accents and champagne velvet interior.',                                                      'Batesville',       'CMB4BFATBQ',  'metal',    43),
  ('csk070', 'Sierra',                               '18 gauge steel casket with shaded exterior and black accents; champagne sovereign velvet interior.',                      'Batesville',       'CMS8BASZBQ',  'metal',    47),
  ('csk071', 'Burlington',                           'Hollow cored poplar container with natural stain finish and white satin lining with pillow.',                             'Vancouver Casket', 'CCVBUCC',     'cremation', 52);

-- ─── Victory Memorial (3745) casket pricing ───────────────────────────────────
-- Effective Feb 20, 2026

insert into funeral_home_caskets (funeral_home_id, catalog_id, price, sort_order) values
  -- Wood Caskets
  ('3745', 'csk017', 16599.00,  1),  -- 710 President
  ('3745', 'csk018', 10899.00,  2),  -- Eloquence Mahogany
  ('3745', 'csk019',  8299.00,  3),  -- Bexley Oak
  ('3745', 'csk020',  8299.00,  4),  -- Cantonese Red (Full Couch)
  ('3745', 'csk016',  8299.00,  5),  -- Regent
  ('3745', 'csk021',  7499.00,  6),  -- Langdon Cherry
  ('3745', 'csk022',  7199.00,  7),  -- Provincial Maple
  ('3745', 'csk023',  6499.00,  8),  -- Chandler
  ('3745', 'csk024',  6499.00,  9),  -- Classic Mahogany
  ('3745', 'csk025',  6499.00, 10),  -- Jamestown PC
  ('3745', 'csk015',  6499.00, 11),  -- Prominence
  ('3745', 'csk026',  6499.00, 12),  -- Warren Oak
  ('3745', 'csk027',  5699.00, 13),  -- Woodbridge Pecan
  ('3745', 'csk028',  5199.00, 14),  -- St. Thomas Oak
  ('3745', 'csk029',  5099.00, 15),  -- Mansfield-27
  ('3745', 'csk030',  4699.00, 16),  -- Briar Hill
  ('3745', 'csk031',  4699.00, 17),  -- Camden Oak
  ('3745', 'csk032',  4699.00, 18),  -- Cameron Oak
  ('3745', 'csk033',  4699.00, 19),  -- Promise
  ('3745', 'csk034',  4699.00, 20),  -- Rosette
  ('3745', 'csk035',  4699.00, 21),  -- Victoria Cherry
  ('3745', 'csk036',  4295.00, 22),  -- Sincerity
  ('3745', 'csk037',  4099.00, 23),  -- Brexton
  ('3745', 'csk014',  4099.00, 24),  -- Dominion HC Wood Maple Crepe
  ('3745', 'csk004',  4099.00, 25),  -- Eleanor Oak
  ('3745', 'csk003',  4099.00, 26),  -- Fireside
  ('3745', 'csk038',  4099.00, 27),  -- Hadyn
  ('3745', 'csk007',  3599.00, 28),  -- Bailey
  ('3745', 'csk008',  3599.00, 29),  -- Hartvic
  ('3745', 'csk039',  3599.00, 30),  -- Sherwood Oak
  ('3745', 'csk006',  3599.00, 31),  -- Watson
  ('3745', 'csk009',  2999.00, 32),  -- Coleridge
  ('3745', 'csk040',  2999.00, 33),  -- Constance
  ('3745', 'csk011',  2999.00, 34),  -- Heavenly White
  ('3745', 'csk010',  2999.00, 35),  -- Montgomery
  ('3745', 'csk041',  2999.00, 36),  -- White Rose
  ('3745', 'csk012',  2999.00, 37),  -- Winfield
  ('3745', 'csk042',  2899.00, 38),  -- Carnaby
  ('3745', 'csk043',  2799.00, 39),  -- Atlantic
  ('3745', 'csk044',  2799.00, 40),  -- Natura
  ('3745', 'csk045',  2799.00, 41),  -- Oxford
  ('3745', 'csk013',  2599.00, 42),  -- Freelton
  ('3745', 'csk046',  2599.00, 43),  -- Schafer
  -- Metal Caskets
  ('3745', 'csk047', 12499.00, 44),  -- Mediterranean Copper
  ('3745', 'csk048', 10899.00, 45),  -- Aegean Copper
  ('3745', 'csk049',  5199.00, 46),  -- Golden Granite
  ('3745', 'csk050',  5099.00, 47),  -- Primrose
  ('3745', 'csk051',  4299.00, 48),  -- Merlot-28
  ('3745', 'csk001',  4099.00, 49),  -- Merlot
  ('3745', 'csk052',  3599.00, 50),  -- Antique Blue-28
  ('3745', 'csk005',  3599.00, 51),  -- Misty Blue
  -- Cremation Oriented
  ('3745', 'csk053',   999.00, 52),  -- McConnell
  -- Containers
  ('3745', 'cont004',  699.00, 53),  -- Plywood Container
  ('3745', 'cont003',  650.00, 54),  -- Cypress
  ('3745', 'cont005',  350.00, 55),  -- Particle Board Container
  ('3745', 'cont006',  450.00, 56),  -- Trayview
  -- Rental
  ('3745', 'cont001', 1599.00, 57),  -- Brockton Oak Ceremonial
  ('3745', 'cont002',  850.00, 58);  -- Brockton Oak (1 Hour Rental)

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

-- Mark optional add-on items within Victory Memorial packages
update package_items set is_optional = true
where service_item_id in (
  'si000042',                          -- Limousine
  'si000088',                          -- Reception and Hostess
  'si000207', 'si000208', 'si000209',  -- Catered Reception III / II / I
  'si000213', 'si000214', 'si000215'   -- Memorial Urn Selection (tiers 1–3)
);
