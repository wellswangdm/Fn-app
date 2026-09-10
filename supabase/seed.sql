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
  ('c1000000-0000-0000-0000-000000000009', 'Urns',                                  9),
  ('c1000000-0000-0000-0000-000000000010', 'Keepsakes',                             10),
  ('c1000000-0000-0000-0000-000000000011', 'Jewelry',                               11);

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

-- ─── Mount Pleasant (3606) only catalog entries ──────────────────────────────

insert into casket_catalog (id, name, description, manufacturer, item_code, category, sort_order) values
  ('csk073', 'Folksau (Full Couch)',       'Solid oak full couch casket with honey oak high gloss finish and off-white velvet interior and brushed copper hardware.',    'Vancouver Casket', 'CWOKVFAVGU', 'wood',       1),
  ('csk074', 'Sacrament Maple',            'Solid hardwood casket with a dark cherry, hand-rubbed, high gloss exterior and champagne velvet interior.',                   'Batesville',       'CWMLBAGIBQ', 'wood',       2),
  ('csk075', 'Lotus',                      'Solid ailanthus casket with a dark, polished, cherry stained exterior and pearl velvet interior.',                             'Vancouver Casket', 'CWPRVFBNEJ', 'wood',       3),
  ('csk076', 'Westcott',                   'Hardwood casket with a medium finished exterior and rosetan crepe interior.',                                                  'Batesville',       'CWAFBEA7KL', 'wood',       4),
  ('csk077', 'Graytone',                   '20-gauge steel casket with a dark gray painted exterior and silver crepe interior.',                                           'Batesville',       'CMS0BDTCFW', 'metal',      5),
  ('csk078', 'Dignity Peach',              'Fiberboard casket with a cloth-covered exterior and white barry interior.',                                                    'Batesville',       'CCCLBBZRGX', 'container',  6),
  ('csk079', 'Grey Malet',                 'Fiberboard casket with handles and a grey cloth-covered exterior and white barry interior.',                                   'Batesville',       'CCCLBCKOGX', 'container',  7),
  ('csk080', 'Hadley Cremation Container', 'Wood composite with a dark finish and an ivory crepe interior.',                                                               'Batesville',       'CCBHCRC',    'cremation',  8),
  ('csk081', 'Novato Cremation Container', 'Wood composite container with a printed woodgrain finish exterior and an ivory crepe interior.',                               'Batesville',       'CCBNVTO',    'container',  9);

-- ─── Custom caskets (NOT on any casket price list — preserve across updates) ──
-- These are added manually and must NOT be removed/overwritten when a funeral
-- home's casket price list is re-uploaded. They use a distinct 'cskx' id
-- namespace so the sequential 'csk0NN' ids generated from price lists never
-- collide with them. (Grey Malet already exists as csk079 in the global
-- catalog, so it is reused rather than duplicated.)
insert into casket_catalog (id, name, description, manufacturer, item_code, category, sort_order) values
  ('cskx01', 'Blue Lowton', NULL, NULL, 'CCCLLBLCH',  'container', 100),
  ('cskx02', 'Navy Tabor',  NULL, NULL, 'CCCLIDFHHB', 'container', 101);

-- Containers added Sept 10, 2026 (shared catalog, image-less)
insert into casket_catalog (id, name, description, manufacturer, item_code, category, sort_order) values
  ('csk086', 'Universal Basic Container', 'Cremation container with interior.',                              'Vancouver Casket', 'CCVUBCC', 'container', 86),
  ('csk087', 'OSB Cremation Container',   'OSB cremation-oriented container with handles and basic interior.','Vancouver Casket', 'CCVOSCC', 'container', 87)
  on conflict (id) do nothing;

-- ─── Victory Memorial (3745) casket pricing ───────────────────────────────────
-- Effective Sept 10, 2026 (Casket Price List refresh)

insert into funeral_home_caskets (funeral_home_id, catalog_id, price, sort_order) values
  -- Wood
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
  ('3745', 'csk034',  4699.00, 19),  -- Rosette
  ('3745', 'csk035',  4699.00, 20),  -- Victoria Cherry
  ('3745', 'csk037',  4099.00, 21),  -- Brexton
  ('3745', 'csk014',  4099.00, 22),  -- Dominion HC Wood Maple Crepe
  ('3745', 'csk004',  4099.00, 23),  -- Eleanor Oak
  ('3745', 'csk003',  4099.00, 24),  -- Fireside
  ('3745', 'csk038',  4099.00, 25),  -- Hadyn
  ('3745', 'csk007',  3599.00, 26),  -- Bailey
  ('3745', 'csk008',  3599.00, 27),  -- Hartvic
  ('3745', 'csk039',  3599.00, 28),  -- Sherwood Oak
  ('3745', 'csk006',  3599.00, 29),  -- Watson
  ('3745', 'csk009',  2999.00, 30),  -- Coleridge
  ('3745', 'csk040',  2999.00, 31),  -- Constance
  ('3745', 'csk011',  2999.00, 32),  -- Heavenly White
  ('3745', 'csk010',  2999.00, 33),  -- Montgomery
  ('3745', 'csk041',  2999.00, 34),  -- White Rose
  ('3745', 'csk012',  2999.00, 35),  -- Winfield
  ('3745', 'csk042',  2899.00, 36),  -- Carnaby
  ('3745', 'csk043',  2799.00, 37),  -- Atlantic
  ('3745', 'csk044',  2799.00, 38),  -- Natura
  ('3745', 'csk045',  2799.00, 39),  -- Oxford
  ('3745', 'csk013',  2599.00, 40),  -- Freelton
  ('3745', 'csk046',  2599.00, 41),  -- Schafer
  -- Metal
  ('3745', 'csk048', 10899.00, 42),  -- Aegean Copper
  ('3745', 'csk049',  5199.00, 43),  -- Golden Granite
  ('3745', 'csk050',  5099.00, 44),  -- Primrose
  ('3745', 'csk051',  4299.00, 45),  -- Merlot-28
  ('3745', 'csk001',  4099.00, 46),  -- Merlot
  ('3745', 'csk052',  3599.00, 47),  -- Antique Blue-28
  ('3745', 'csk005',  3599.00, 48),  -- Misty Blue
  -- Cremation Oriented
  ('3745', 'csk053',  1050.00, 49),  -- McConnell (was 999)
  ('3745', 'cont003',  650.00, 50),  -- Cypress
  ('3745', 'csk086',   525.00, 51),  -- Universal Basic Container
  ('3745', 'csk087',   395.00, 52),  -- OSB Cremation Container
  -- Rental
  ('3745', 'cont001', 1599.00, 53),  -- Brockton Oak Ceremonial
  ('3745', 'cont002',  850.00, 54),  -- Brockton Oak (1 Hour Rental)
  -- Custom caskets (not on the price list — preserve across price-list updates)
  ('3745', 'csk079',  1099.00, 55),  -- Grey Malet  (reuses existing global catalog entry)
  ('3745', 'cskx01',  1599.00, 56),  -- Blue Lowton
  ('3745', 'cskx02',  2299.00, 57);  -- Navy Tabor

-- ─── Service Items ────────────────────────────────────────────────────────────

insert into service_items (id, funeral_home_id, category_id, item_code, name, description, price, price_min, price_max, is_cash_advance) values
  -- Professional Staff & Services
  ('si000001', '3745', 'c1000000-0000-0000-0000-000000000001', NULL, 'Professional Services Fees for Full Service',                NULL, 4220.00, NULL, NULL, false),
  ('si000002', '3745', 'c1000000-0000-0000-0000-000000000001', NULL, 'Professional Services Fees for Gathering Celebrations',      NULL, 4070.00, NULL, NULL, false),
  ('si000003', '3745', 'c1000000-0000-0000-0000-000000000001', NULL, 'Professional Services Fees for Memorial Service',            NULL, 4070.00, NULL, NULL, false),
  ('si000004', '3745', 'c1000000-0000-0000-0000-000000000001', NULL, 'Professional Services Fees for Graveside Service',           NULL, 3895.00, NULL, NULL, false),
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
  ('si000028', '3745', 'c1000000-0000-0000-0000-000000000002', NULL, 'Private Family Moment at our Facility',                      NULL,  345.00, NULL, NULL, false),
  ('si000029', '3745', 'c1000000-0000-0000-0000-000000000002', NULL, 'Supervision for Visitation Per Hour',                        NULL,  395.00, NULL, NULL, false),
  ('si000030', '3745', 'c1000000-0000-0000-0000-000000000002', NULL, 'Supervision - Evening Charge',                               NULL,  750.00, NULL, NULL, false),
  ('si000031', '3745', 'c1000000-0000-0000-0000-000000000002', NULL, 'Additional Charge - Use of Facilities on Holidays',          NULL, 2000.00, NULL, NULL, false),
  ('si000032', '3745', 'c1000000-0000-0000-0000-000000000002', NULL, 'Supervision of Disinterment',                                NULL, 3595.00, NULL, NULL, false),
  ('si000033', '3745', 'c1000000-0000-0000-0000-000000000002', NULL, 'Additional Charge - Saturday Service',                       NULL, 1000.00, NULL, NULL, false),
  ('si000034', '3745', 'c1000000-0000-0000-0000-000000000002', NULL, 'Additional Charge - Sunday Service',                         NULL, 1750.00, NULL, NULL, false),
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
  ('si000058', '3745', 'c1000000-0000-0000-0000-000000000005', NULL, 'Estate Fraud Protection',                                    NULL,  145.00, NULL, NULL, false),
  ('si000059', '3745', 'c1000000-0000-0000-0000-000000000005', NULL, 'Everlasting Memorial',                                       NULL,  490.00, NULL, NULL, false),
  ('si000060', '3745', 'c1000000-0000-0000-0000-000000000005', NULL, 'Traditional Ritual Washing',                                 NULL,  395.00, NULL, NULL, false),
  -- Miscellaneous Services & Merchandise
  ('si000070', '3745', 'c1000000-0000-0000-0000-000000000005', NULL, 'Standard Text Personalization',                              NULL,   50.00, NULL, NULL, false),
  ('si000071', '3745', 'c1000000-0000-0000-0000-000000000005', NULL, 'Custom Service Folders (100)',                               NULL,  250.00, NULL, NULL, false),
  ('si000072', '3745', 'c1000000-0000-0000-0000-000000000005', NULL, 'Sterling Silver Oval Pendant',                               NULL,  295.00, NULL, NULL, false),
  ('si000073', '3745', 'c1000000-0000-0000-0000-000000000005', NULL, 'A Life Remembered Book',                                     NULL,   95.00, NULL, NULL, false),
  ('si000074', '3745', 'c1000000-0000-0000-0000-000000000005', NULL, 'Cremation Expediting Fee',                                   NULL,  495.00, NULL, NULL, false),
  ('si000075', '3745', 'c1000000-0000-0000-0000-000000000005', NULL, 'Cremation Witnessing Fee',                                   NULL,  595.00, NULL, NULL, false),
  ('si000076', '3745', 'c1000000-0000-0000-0000-000000000005', NULL, 'Crematory Fee',                                              NULL, 1095.00, NULL, NULL, false),
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
  -- PPL package components (catered reception tiers)
  ('si000207', '3745', 'c1000000-0000-0000-0000-000000000002', NULL, 'Catered Reception III',              NULL, 2150.00, NULL, NULL, false),
  ('si000208', '3745', 'c1000000-0000-0000-0000-000000000002', NULL, 'Catered Reception II',               NULL, 1980.00, NULL, NULL, false),
  ('si000209', '3745', 'c1000000-0000-0000-0000-000000000002', NULL, 'Catered Reception I',                NULL, 1350.00, NULL, NULL, false),
  -- Urns
  ('si000213', '3745', 'c1000000-0000-0000-0000-000000000009', NULL, 'Memorial Urn Selection', 'LoveUrns Elegant Leaf, Urnes Bégin Serenity Tree, RK Productions In Flight, Urnes Bégin Classic Stained Maple', 995.00, NULL, NULL, false),
  ('si000214', '3745', 'c1000000-0000-0000-0000-000000000009', NULL, 'Memorial Urn Selection', 'Urnes Bégin Versatile Urn Navy, LoveUrns Laurel Midnight, Terrybear Satori Ocean Pearl, Batesville Memento Chest',                         795.00, NULL, NULL, false),
  ('si000215', '3745', 'c1000000-0000-0000-0000-000000000009', NULL, 'Memorial Urn Selection', 'LoveUrns Laurel Crimson, Urnes Bégin Sky Pewter, Mackenzie Classic Sky Blue, Batesville Cherry Chest',                                    595.00, NULL, NULL, false);

-- New GPL items (effective Sept 10, 2026)
insert into service_items (id, funeral_home_id, category_id, item_code, name, description, price, price_min, price_max, is_cash_advance) values
  ('si000216', '3745', 'c1000000-0000-0000-0000-000000000004', 'XOTAMBE',  'Chinese Funeral Custom Items', NULL, 590.00, NULL, NULL, false),
  ('si000217', '3745', 'c1000000-0000-0000-0000-000000000005', 'XPARBMZA', 'Star Gaze Frame Gold 11x14',  'A custom framed print of a star chart depicting the night sky from a specific date and location. 11x14 gold champagne frame matted to 8x10.', 295.00, NULL, NULL, false),
  ('si000218', '3745', 'c1000000-0000-0000-0000-000000000005', 'XFDPFZA',  'Star Gaze Frame 16x20',      'A custom framed print of a star chart depicting the night sky from a specific date and location. 16x20 black shadowbox matted to 11x14.', 295.00, NULL, NULL, false);

-- ─── Packages ─────────────────────────────────────────────────────────────────

insert into packages (id, funeral_home_id, name, pkg_type, total_price, package_discount, default_casket_id, sort_order) values
  -- Named packages (effective Sept 10, 2026)
  ('pk000010', '3745', 'Heritage Funeral Service',   'package',  17679.00, 515.00, 'csk001',  10),
  ('pk000011', '3745', 'Honour Funeral Service',     'package',  16609.00, 485.00, 'csk005',  11),
  ('pk000012', '3745', 'Tribute Funeral Service',    'package',  14829.00, 435.00, 'csk009',  12),
  ('pk000013', '3745', 'Heritage Cremation Service', 'package',  16679.00, 510.00, 'cont001', 13),
  ('pk000014', '3745', 'Honour Cremation Service',   'package',  14035.00, 410.00, 'cont002', 14),
  ('pk000015', '3745', 'Tribute Cremation Service',  'package',   6175.00,  50.00, 'cont003', 15),
  ('pk000016', '3745', 'JADE Burial Plan',           'package',  15994.00, 500.00, 'csk001',  16),
  ('pk000017', '3745', 'JADE Cremation Plan',        'package',  15339.00, 460.00, 'cont001', 17),
  -- A la carte
  ('pk000001', '3745', 'Full Service',           'alacarte',  7810.00, 0.00, NULL, 1),
  ('pk000002', '3745', 'Witness Cremation',      'alacarte',  7110.00, 0.00, NULL, 2),
  ('pk000003', '3745', 'Service of Remembrance', 'alacarte',  7735.00, 0.00, NULL, 3),
  ('pk000004', '3745', 'Graveside Service',      'alacarte',  6265.00, 0.00, NULL, 4),
  ('pk000005', '3745', 'Urn Committal Option',   'alacarte',  4260.00, 0.00, NULL, 5),
  ('pk000006', '3745', 'No Service Option',      'alacarte',  3740.00, 0.00, NULL, 6),
  ('pk000007', '3745', 'Forwarding of Remains',  'alacarte',  5120.00, 0.00, NULL, 7),
  ('pk000008', '3745', 'Receiving of Remains',   'alacarte',  3950.00, 0.00, NULL, 8),
  ('pk000009', '3745', 'Tea Room Gathering',     'alacarte',  7390.00, 0.00, NULL, 9);

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
  ('pk000009','si000040');

-- Named packages (Heritage/Honour/Tribute Funeral & Cremation + JADE plans).
-- Effective Sept 10, 2026 — explicit quantity/is_optional/sort_order.
insert into package_items (package_id, service_item_id, quantity, is_optional, sort_order) values
  -- Heritage Funeral (pk000010) — casket csk001 via default_casket_id
  ('pk000010','si000001',1,false,1),('pk000010','si000010',1,false,2),('pk000010','si000011',1,false,3),
  ('pk000010','si000013',1,false,4),('pk000010','si000012',1,false,5),('pk000010','si000040',1,false,6),
  ('pk000010','si000041',1,false,7),('pk000010','si000042',1,true,8),('pk000010','si000059',1,false,9),
  ('pk000010','si000058',1,false,10),('pk000010','si000088',1,true,11),('pk000010','si000202',1,false,12),
  ('pk000010','si000023',1,false,13),('pk000010','si000050',1,true,14),('pk000010','si000207',1,true,15),
  ('pk000010','si000103',1,false,16),
  -- Honour Funeral (pk000011) — casket csk005
  ('pk000011','si000001',1,false,1),('pk000011','si000010',1,false,2),('pk000011','si000011',1,false,3),
  ('pk000011','si000013',1,false,4),('pk000011','si000012',1,false,5),('pk000011','si000040',1,false,6),
  ('pk000011','si000041',1,false,7),('pk000011','si000042',1,true,8),('pk000011','si000059',1,false,9),
  ('pk000011','si000058',1,false,10),('pk000011','si000088',1,true,11),('pk000011','si000203',1,false,12),
  ('pk000011','si000023',1,false,13),('pk000011','si000050',1,true,14),('pk000011','si000208',1,true,15),
  ('pk000011','si000102',1,false,16),
  -- Tribute Funeral (pk000012) — casket csk009 (no Limousine)
  ('pk000012','si000001',1,false,1),('pk000012','si000010',1,false,2),('pk000012','si000011',1,false,3),
  ('pk000012','si000013',1,false,4),('pk000012','si000012',1,false,5),('pk000012','si000040',1,false,6),
  ('pk000012','si000041',1,false,7),('pk000012','si000059',1,false,8),('pk000012','si000058',1,false,9),
  ('pk000012','si000088',1,true,10),('pk000012','si000204',1,false,11),('pk000012','si000023',1,false,12),
  ('pk000012','si000050',1,true,13),('pk000012','si000209',1,true,14),('pk000012','si000100',1,false,15),
  -- Heritage Cremation (pk000013) — container cont001 (Limousine, no Hearse)
  ('pk000013','si000001',1,false,1),('pk000013','si000010',1,false,2),('pk000013','si000011',1,false,3),
  ('pk000013','si000013',1,false,4),('pk000013','si000012',1,false,5),('pk000013','si000040',1,false,6),
  ('pk000013','si000042',1,true,7),('pk000013','si000059',1,false,8),('pk000013','si000058',1,false,9),
  ('pk000013','si000088',1,true,10),('pk000013','si000205',1,false,11),('pk000013','si000076',1,false,12),
  ('pk000013','si000023',1,false,13),('pk000013','si000050',1,true,14),('pk000013','si000213',1,true,15),
  ('pk000013','si000207',1,true,16),('pk000013','si000103',1,false,17),
  -- Honour Cremation (pk000014) — container cont002
  ('pk000014','si000003',1,false,1),('pk000014','si000010',1,false,2),('pk000014','si000013',1,false,3),
  ('pk000014','si000012',1,false,4),('pk000014','si000040',1,false,5),('pk000014','si000059',1,false,6),
  ('pk000014','si000058',1,false,7),('pk000014','si000088',1,true,8),('pk000014','si000206',1,false,9),
  ('pk000014','si000076',1,false,10),('pk000014','si000023',1,false,11),('pk000014','si000050',1,true,12),
  ('pk000014','si000214',1,true,13),('pk000014','si000208',1,true,14),('pk000014','si000102',1,false,15),
  -- Tribute Cremation (pk000015) — container cont003
  ('pk000015','si000009',1,false,1),('pk000015','si000010',1,false,2),('pk000015','si000013',1,false,3),
  ('pk000015','si000026',1,false,4),('pk000015','si000012',1,false,5),('pk000015','si000040',1,false,6),
  ('pk000015','si000058',1,false,7),('pk000015','si000076',1,false,8),('pk000015','si000050',1,true,9),
  ('pk000015','si000215',1,true,10),
  -- JADE Burial Plan (pk000016) — casket csk001; FSO Select 2 (qty 2)
  ('pk000016','si000001',1,false,1),('pk000016','si000010',1,false,2),('pk000016','si000011',1,false,3),
  ('pk000016','si000013',1,false,4),('pk000016','si000012',1,false,5),('pk000016','si000040',1,false,6),
  ('pk000016','si000041',1,false,7),('pk000016','si000042',1,true,8),('pk000016','si000058',1,false,9),
  ('pk000016','si000088',1,true,10),('pk000016','si000023',1,false,11),('pk000016','si000050',2,true,12),
  ('pk000016','si000207',1,true,13),
  -- JADE Cremation Plan (pk000017) — container cont001; FSO Select 2 (qty 2)
  ('pk000017','si000001',1,false,1),('pk000017','si000010',1,false,2),('pk000017','si000011',1,false,3),
  ('pk000017','si000013',1,false,4),('pk000017','si000012',1,false,5),('pk000017','si000040',1,false,6),
  ('pk000017','si000058',1,false,7),('pk000017','si000088',1,true,8),('pk000017','si000205',1,false,9),
  ('pk000017','si000076',1,false,10),('pk000017','si000023',1,false,11),('pk000017','si000050',2,true,12),
  ('pk000017','si000213',1,true,13),('pk000017','si000207',1,true,14);

-- ─── Individual Urn Catalog — 3745 (from the Urn Price List) ──────────────────
-- Full browsable urn list; the 3 Memorial Urn Selection tiers used by the
-- cremation packages are defined above in the main service_items insert.
insert into service_items (id, funeral_home_id, category_id, item_code, name, description, price, price_min, price_max, is_cash_advance, sort_order) values
  ('si000300', '3745', 'c1000000-0000-0000-0000-000000000009', 'UMCBFSZA7', 'Roses Vase', 'Cast bronze urn adorned with hand sculpted roses. (Urnes Bégin)', 2895.00, NULL, NULL, false, 10),
  ('si000301', '3745', 'c1000000-0000-0000-0000-000000000009', 'UOCMFSAE5', 'Classic Carrera', 'Durable cultured marble urn made from polymer and stone. (Mackenzie)', 595.00, NULL, NULL, false, 11),
  ('si000302', '3745', 'c1000000-0000-0000-0000-000000000009', 'UOCMFSAE6', 'Classic Sky Blue', 'Durable cultured marble urn made from polymer and stone. (Mackenzie)', 595.00, NULL, NULL, false, 12),
  ('si000303', '3745', 'c1000000-0000-0000-0000-000000000009', 'UOCMFSAE7', 'Classic Verde Green', 'Durable cultured marble urn made from polymer and stone. (Mackenzie)', 595.00, NULL, NULL, false, 13),
  ('si000304', '3745', 'c1000000-0000-0000-0000-000000000009', 'UOSTFSAIF', 'In Flight', 'Handpainted and carved into textured stone with solid mahogany base. (Keepsakes and/or accessories sold separately) (RK Productions)', 995.00, NULL, NULL, false, 14),
  ('si000305', '3745', 'c1000000-0000-0000-0000-000000000009', 'UOOXFSAOV', 'Onyx Vase', 'Marble urn with variations of light green and dark earth tones. (Marble Products)', 595.00, NULL, NULL, false, 15),
  ('si000306', '3745', 'c1000000-0000-0000-0000-000000000009', 'UOMBFSAE4', 'Carrera Marble Vase', 'Natural stone marble vase made from Carrera-inspired marble, polished to a gleaming shine. (Marble Products)', 595.00, NULL, NULL, false, 16),
  ('si000307', '3745', 'c1000000-0000-0000-0000-000000000009', 'UOMBFSAFA', 'Sand Rectangle', 'Sand-colored marble urn with natural accents. Urn is suitable as single or companion. (Marble Products)', 510.00, NULL, NULL, false, 17),
  ('si000308', '3745', 'c1000000-0000-0000-0000-000000000009', 'UOMBFSAFB', 'Sand Vase', 'Sand-colored marble urn with natural accents. (Marble Products)', 495.00, NULL, NULL, false, 18),
  ('si000309', '3745', 'c1000000-0000-0000-0000-000000000009', 'UOUOFS5ZF', 'Love Dove Porcelain', 'Porcelain Full Size Dove Shaped Urn in white color. (LoveUrns)', 695.00, NULL, NULL, false, 19),
  ('si000310', '3745', 'c1000000-0000-0000-0000-000000000009', 'UOPLFS5ZF', 'White Soulful Shell', 'Porcelain Full Size Shell Shaped Urn in white color. (LoveUrns)', 595.00, NULL, NULL, false, 20),
  ('si000311', '3745', 'c1000000-0000-0000-0000-000000000009', 'UOPLSB5ZF', 'Yellow Soulful Shell', 'Porcelain Full Size Shell Shaped Urn in yellow color. (LoveUrns)', 595.00, NULL, NULL, false, 21),
  ('si000312', '3745', 'c1000000-0000-0000-0000-000000000009', 'UOPLFSAE9', 'Lenox Porcelain', 'Classic and elegant porcelain vase made from Genuine Lenox Porcelain with 24 karat gold gilding. (Elegante Brass)', 495.00, NULL, NULL, false, 22),
  ('si000313', '3745', 'c1000000-0000-0000-0000-000000000009', 'UMZNFSOII', 'Fidelity Couple - Companion', 'Precision casting, 100% solid bronze urns showing a man and a woman waiting for each other at the paradise doors. (Urnes Bégin)', 3895.00, NULL, NULL, false, 23),
  ('si000314', '3745', 'c1000000-0000-0000-0000-000000000009', 'UMZNFSAGE', 'The Vine - Companion', 'Die-cast zinc urn, with a solid bronze face and vine embellishment. Purchased together. (Urnes Bégin)', 1535.00, NULL, NULL, false, 24),
  ('si000315', '3745', 'c1000000-0000-0000-0000-000000000009', 'UOSTAA4TF', 'Together Forever Companion', 'Finely handcrafted stone companion urn, hand painted with each one an original sculpture. (RK Productions)', 1495.00, NULL, NULL, false, 25),
  ('si000316', '3745', 'c1000000-0000-0000-0000-000000000009', 'UMALAHPPD', 'Double Versatile Pink', 'Elegant pink aluminum urn with customizable front plate offering high quality, vibrant images that reflect the unique relationship between two individuals as a companion urn. (Urnes Bégin)', 1395.00, NULL, NULL, false, 26),
  ('si000317', '3745', 'c1000000-0000-0000-0000-000000000009', 'UMALAHPV5', 'Double Versatile Matte Black', 'Elegant matte black aluminum urn with customizable front plate offering high quality, vibrant images that reflect the unique relationship between two individuals as a companion urn. (Urnes Bégin)', 1395.00, NULL, NULL, false, 27),
  ('si000318', '3745', 'c1000000-0000-0000-0000-000000000009', 'UMALAHPVG', 'Double Versatile Champagne', 'Elegant champagne aluminum urn with customizable front plate offering high quality, vibrant images that reflect the unique relationship between two individuals as a companion urn. (Urnes Bégin)', 1395.00, NULL, NULL, false, 28),
  ('si000319', '3745', 'c1000000-0000-0000-0000-000000000009', 'UMALAHPVL', 'Double Versatile Charcoal', 'Elegant charcoal aluminum urn with customizable front plate offering high quality, vibrant images that reflect the unique relationship between two individuals as a companion urn. (Urnes Bégin)', 1395.00, NULL, NULL, false, 29),
  ('si000320', '3745', 'c1000000-0000-0000-0000-000000000009', 'UMALAHPVR', 'Double Versatile Bronze', 'Elegant bronze aluminum urn with customizable front plate offering high quality, vibrant images that reflect the unique relationship between two individuals as a companion urn. (Urnes Bégin)', 1395.00, NULL, NULL, false, 30),
  ('si000321', '3745', 'c1000000-0000-0000-0000-000000000009', 'UMALAHPVV', 'Double Versatile Navy', 'Elegant navy aluminum urn with customizable front plate offering high quality, vibrant images that reflect the unique relationship between two individuals as a companion urn. (Urnes Bégin)', 1395.00, NULL, NULL, false, 31),
  ('si000322', '3745', 'c1000000-0000-0000-0000-000000000009', 'UMALAHPVW', 'Double Versatile Sparkling White', 'Elegant sparkling white aluminum urn with customizable front plate offering high quality, vibrant images that reflect the unique relationship between two individuals as a companion urn. (Urnes Bégin)', 1395.00, NULL, NULL, false, 32),
  ('si000323', '3745', 'c1000000-0000-0000-0000-000000000009', 'UMZNFSOIH', 'Personalized Double Doves', 'Die cast zinc urn with a bronze face, with two dove bronze ornaments. (Urnes Bégin)', 1195.00, NULL, NULL, false, 33),
  ('si000324', '3745', 'c1000000-0000-0000-0000-000000000009', 'UMBZFSZLV', 'Lily of the Valley', 'Die cast zinc urn with a solid bronze face, with a molded lily embellishment. (Urnes Bégin)', 1095.00, NULL, NULL, false, 34),
  ('si000325', '3745', 'c1000000-0000-0000-0000-000000000009', 'UMZNFSOIE', 'Double Oak', 'Die cast zinc urn with bronze face, with an oak molded embellishment. (Urnes Bégin)', 1075.00, NULL, NULL, false, 35),
  ('si000326', '3745', 'c1000000-0000-0000-0000-000000000009', 'UMBZFSZMD', 'Memories', 'Die cast zinc urn with bronze plate and bronze embellishments. (Urnes Bégin)', 795.00, NULL, NULL, false, 36),
  ('si000327', '3745', 'c1000000-0000-0000-0000-000000000009', 'UOCRFSARB', 'Rose Bouquet', 'Ceramic urn with hand-painted rose bouquet detail. Features a floral motif on a pearlescent ivory background. (Terrybear)', 350.00, NULL, NULL, false, 37),
  ('si000328', '3745', 'c1000000-0000-0000-0000-000000000009', 'UMZNFSOIL', 'Guardian Angel', 'Precision casting, 100% solid bronze urn showing an angel crying over a tomb, and two doves taking their flight. (Urnes Bégin)', 4995.00, NULL, NULL, false, 38),
  ('si000329', '3745', 'c1000000-0000-0000-0000-000000000009', 'UMZNFSOIJ', 'Fidelity Couple - Woman', 'Precision casting, 100% solid bronze urns showing a man and a woman waiting for each other at the paradise doors. (Urnes Bégin)', 1995.00, NULL, NULL, false, 39),
  ('si000330', '3745', 'c1000000-0000-0000-0000-000000000009', 'UMZNFSOIK', 'Fidelity Couple - Man', 'Precision casting, 100% solid bronze urns showing a man and a woman waiting for each other at the paradise doors. (Urnes Bégin)', 1995.00, NULL, NULL, false, 40),
  ('si000331', '3745', 'c1000000-0000-0000-0000-000000000009', 'UMBZFSZER', 'Eternal', 'Die cast 100% bronze urn with bronze dove ornament. (Urnes Bégin)', 1895.00, NULL, NULL, false, 41),
  ('si000332', '3745', 'c1000000-0000-0000-0000-000000000009', 'UMBRFSDTF', 'Heartfelt™ Gold', 'Solid Brass Heart shaped Full Size Urn with Crystal. (Keepsakes and/or accessories sold separately) (LoveUrns)', 1295.00, NULL, NULL, false, 42),
  ('si000333', '3745', 'c1000000-0000-0000-0000-000000000009', 'UMCBFSABF', 'Cast Bronze Rectangle', 'Cast bronze construction with brushed and polished finish. (Batesville)', 1070.00, NULL, NULL, false, 43),
  ('si000334', '3745', 'c1000000-0000-0000-0000-000000000009', 'UMZNFSOIB', 'Serenity Rose', 'Die cast zinc urn with bronze rose ornament and grey brushed edge. (ZB-601B) (Urnes Bégin)', 995.00, NULL, NULL, false, 44),
  ('si000335', '3745', 'c1000000-0000-0000-0000-000000000009', 'UMZNFSOIC', 'Serenity Tree', 'Die cast zinc urn with bronze tree ornament and grey brushed edge. (ZB-600B) (Urnes Bégin)', 995.00, NULL, NULL, false, 45),
  ('si000336', '3745', 'c1000000-0000-0000-0000-000000000009', 'UMZNFSOID', 'Serenity Plain', 'Die cast zinc urn with grey brushed edge. (ZB-602B) (Urnes Bégin)', 995.00, NULL, NULL, false, 46),
  ('si000337', '3745', 'c1000000-0000-0000-0000-000000000009', 'UMBRFSLFP', 'Elegant Leaf', 'Brass urn with deep emerald finish complete with brass fern leaf detail. (LoveUrns)', 995.00, NULL, NULL, false, 47),
  ('si000338', '3745', 'c1000000-0000-0000-0000-000000000009', 'UMCBFSABE', 'Cast Bronze Cylinder', 'Cast bronze construction with brushed and polished finish. (Batesville)', 910.00, NULL, NULL, false, 48),
  ('si000339', '3745', 'c1000000-0000-0000-0000-000000000009', 'UMBZFSZPB', 'Personalized Solid Bronze Urn', 'Die cast zinc urn with bronze face, with a bronze ornament from the personalized collection. Over a hundred ornaments available. (Urnes Bégin)', 895.00, NULL, NULL, false, 49),
  ('si000340', '3745', 'c1000000-0000-0000-0000-000000000009', 'UMZNFSAGF', 'The Vine - Left', 'Die-cast zinc urn, with a solid bronze face and vine embellishment. Design to the left of engraving plate. (Urnes Bégin)', 895.00, NULL, NULL, false, 50),
  ('si000341', '3745', 'c1000000-0000-0000-0000-000000000009', 'UMZNFSAGK', 'The Vine - Right', 'Die-cast zinc urn, solid bronze face, vine embellishment. Design to the right of engraving plate. (Urnes Bégin)', 895.00, NULL, NULL, false, 51),
  ('si000342', '3745', 'c1000000-0000-0000-0000-000000000009', 'UMBZFSZOL', 'Oak - Left', 'Die cast zinc urn with a solid bronze face, tree embellishment molded on the sides. (Urnes Bégin)', 795.00, NULL, NULL, false, 52),
  ('si000343', '3745', 'c1000000-0000-0000-0000-000000000009', 'UMBZFSZOR', 'Oak - Right', 'Die cast zinc urn with a solid bronze face, tree embellishment molded on the sides. (Urnes Bégin)', 795.00, NULL, NULL, false, 53),
  ('si000344', '3745', 'c1000000-0000-0000-0000-000000000009', 'UMBRFSLFR', 'Simplicity', 'Brass and metal alloy urn with a radiant midnight finish and silver accents. (LoveUrns)', 795.00, NULL, NULL, false, 54),
  ('si000345', '3745', 'c1000000-0000-0000-0000-000000000009', 'UMBRFSLSG', 'Teardrop Matte Sage Green', 'Unique sage green teardrop shaped brass urn with a soft touch finish and brushed gold top. (LoveUrns)', 795.00, NULL, NULL, false, 55),
  ('si000346', '3745', 'c1000000-0000-0000-0000-000000000009', 'UMASFSLMB', 'Teardrop Matte Black', 'Unique matte black teardrop shaped brass urn with a soft touch finish and brushed gun metal top. (LoveUrns)', 795.00, NULL, NULL, false, 56),
  ('si000347', '3745', 'c1000000-0000-0000-0000-000000000009', 'UMBRFSAAF', 'Laurel White Pearl', 'Alloy and brass vase with a pristine white hand-applied enamel design. (LoveUrns)', 795.00, NULL, NULL, false, 57),
  ('si000348', '3745', 'c1000000-0000-0000-0000-000000000009', 'UMBRFSAAU', 'Laurel Midnight', 'Alloy and brass vase with a rich charcoal hand-applied enamel design. (LoveUrns)', 795.00, NULL, NULL, false, 58),
  ('si000349', '3745', 'c1000000-0000-0000-0000-000000000009', 'UMBRFSASK', 'Satori Pink Pearl', 'Brass urn with beautiful pearl pink finish and metallic shimmer. Features an artistic, contemporary shape and polished bronze finish accents. (Terrybear)', 795.00, NULL, NULL, false, 59),
  ('si000350', '3745', 'c1000000-0000-0000-0000-000000000009', 'UMBRFSASO', 'Satori Ocean Pearl', 'Brass urn with beautiful pearl blue ocean finish and metallic shimmer. Features an artistic, contemporary shape and polished bronze finish accents. (Terrybear)', 795.00, NULL, NULL, false, 60),
  ('si000351', '3745', 'c1000000-0000-0000-0000-000000000009', 'UMBRFSASW', 'Satori White Pearl', 'Brass urn with beautiful pearl white finish and metallic shimmer. Features an artistic, contemporary shape and polished bronze finish accents. (Terrybear)', 795.00, NULL, NULL, false, 61),
  ('si000352', '3745', 'c1000000-0000-0000-0000-000000000009', 'UMALFSPG0', 'Versatile Urn Champagne', 'Sleek aluminum champagne urn with a customizable front plate offering high quality, vibrant images that reflect the unique personality and passions of your loved one. (Urnes Bégin)', 795.00, NULL, NULL, false, 62),
  ('si000353', '3745', 'c1000000-0000-0000-0000-000000000009', 'UMALFSPG1', 'Versatile Urn Charcoal', 'Sleek aluminum charcoal urn with a customizable front plate offering high quality, vibrant images that reflect the unique personality and passions of your loved one. (Urnes Bégin)', 795.00, NULL, NULL, false, 63),
  ('si000354', '3745', 'c1000000-0000-0000-0000-000000000009', 'UMALFSPG3', 'Versatile Urn Navy', 'Sleek aluminum navy urn with a customizable front plate offering high quality, vibrant images that reflect the unique personality and passions of your loved one. (Urnes Bégin)', 795.00, NULL, NULL, false, 64),
  ('si000355', '3745', 'c1000000-0000-0000-0000-000000000009', 'UMALFSPG4', 'Versatile Urn Pink', 'Sleek aluminum pink urn with a customizable front plate offering high quality, vibrant images that reflect the unique personality and passions of your loved one. (Urnes Bégin)', 795.00, NULL, NULL, false, 65),
  ('si000356', '3745', 'c1000000-0000-0000-0000-000000000009', 'UMALFSPG5', 'Versatile Urn Sparkling White', 'Sleek aluminum sparkling white urn with a customizable front plate offering high quality, vibrant images that reflect the unique personality and passions of your loved one. (Urnes Bégin)', 795.00, NULL, NULL, false, 66),
  ('si000357', '3745', 'c1000000-0000-0000-0000-000000000009', 'UMALFSPGZ', 'Versatile Urn Bronze', 'Sleek aluminum bronze urn with a customizable front plate offering high quality, vibrant images that reflect the unique personality and passions of your loved one. (Urnes Bégin)', 795.00, NULL, NULL, false, 67),
  ('si000358', '3745', 'c1000000-0000-0000-0000-000000000009', 'UMALFSPVY', 'Versatile Urn Matte Black', 'Sleek aluminum matte black urn with a customizable front plate offering high quality, vibrant images that reflect the unique personality and passions of your loved one. (Urnes Bégin)', 795.00, NULL, NULL, false, 68),
  ('si000359', '3745', 'c1000000-0000-0000-0000-000000000009', 'UMBRFSLFS', 'Soul Bird', 'Elegant and sleek brass urn bird urn. (Keepsakes and/or accessories sold separately) (LoveUrns)', 715.00, NULL, NULL, false, 69),
  ('si000360', '3745', 'c1000000-0000-0000-0000-000000000009', 'UMADFS5AU', 'Amore™ Red', 'Solid Brass Full Size Urn with Red and Polished Silver Finish. Compartment on top to keep memorable items. (LoveUrns)', 695.00, NULL, NULL, false, 70),
  ('si000361', '3745', 'c1000000-0000-0000-0000-000000000009', 'UMSBFSAFG', 'Sheet Bronze Cylinder', 'Constructed from 64 oz sheet bronze with brushed and polished finish. (Batesville)', 695.00, NULL, NULL, false, 71),
  ('si000362', '3745', 'c1000000-0000-0000-0000-000000000009', 'UMSBFSAFI', 'Sheet Bronze Rectangle', 'Constructed from 64 oz sheet bronze with brushed and polished finish. (Batesville)', 695.00, NULL, NULL, false, 72),
  ('si000363', '3745', 'c1000000-0000-0000-0000-000000000009', 'UMLBFSLOO', 'Crimson Hearts', 'Crafted from aluminum and brass, this urn features a deep crimson finish adorned with heart motifs. (LoveUrns)', 595.00, NULL, NULL, false, 73),
  ('si000364', '3745', 'c1000000-0000-0000-0000-000000000009', 'UMLBFSLPI', 'Pink Roses', 'Crafted from aluminum and brass, this urn features a delicate pink finish with a rose motif. (LoveUrns)', 595.00, NULL, NULL, false, 74),
  ('si000365', '3745', 'c1000000-0000-0000-0000-000000000009', 'UMLBFSLVE', 'Emerald Tree of Love', 'Designed in rich emerald tones, this aluminum and brass urn showcases a tree of love motif. (LoveUrns)', 595.00, NULL, NULL, false, 75),
  ('si000366', '3745', 'c1000000-0000-0000-0000-000000000009', 'UMZNFSOHX', 'Sky Pewter', 'Die cast zinc urn with a pewter marbling finish showing a sky with two bronze angel ornaments. (Urnes Bégin)', 595.00, NULL, NULL, false, 76),
  ('si000367', '3745', 'c1000000-0000-0000-0000-000000000009', 'UMZNFSOHY', 'Sky Pink', 'Die cast zinc urn with a pink marbling finish showing a sky with two bronze angel ornaments. (Urnes Bégin)', 595.00, NULL, NULL, false, 77),
  ('si000368', '3745', 'c1000000-0000-0000-0000-000000000009', 'UMZNFSOHZ', 'Sky Brown', 'Die cast zinc urn with a brown marbling finish showing a sky with two bronze angel ornaments. (Urnes Bégin)', 595.00, NULL, NULL, false, 78),
  ('si000369', '3745', 'c1000000-0000-0000-0000-000000000009', 'UMZNFSOIA', 'Sky Blue', 'Die cast zinc urn with a bleu marbling finish showing a sky with two bronze angel ornaments. (Urnes Bégin)', 595.00, NULL, NULL, false, 79),
  ('si000370', '3745', 'c1000000-0000-0000-0000-000000000009', 'UMZNFSZA4', 'Flight of Doves - Left', 'Die cast zinc urn in an "S" shape, metal grey finish and 3 silver dove ornaments. (Urnes Bégin)', 595.00, NULL, NULL, false, 80),
  ('si000371', '3745', 'c1000000-0000-0000-0000-000000000009', 'UMZNFSZA5', 'Flight of Doves - Right', 'Die cast zinc urn in an "S" shape, metal grey finish and 3 silver dove ornaments. (Urnes Bégin)', 595.00, NULL, NULL, false, 81),
  ('si000372', '3745', 'c1000000-0000-0000-0000-000000000009', 'UMBRFSLFX', 'Wings of Hope Blue', 'Elegant butterfly designed brass and enamel urn with blue inlays and pearlescent finish. (LoveUrns)', 595.00, NULL, NULL, false, 82),
  ('si000373', '3745', 'c1000000-0000-0000-0000-000000000009', 'UMBRFSLFY', 'Wings of Hope Lavender', 'Elegant butterfly designed brass and enamel urn with lavender inlays and pearlescent finish. (LoveUrns)', 595.00, NULL, NULL, false, 83),
  ('si000374', '3745', 'c1000000-0000-0000-0000-000000000009', 'UMBRFSLFZ', 'Wings of Hope Pearl', 'Elegant butterfly designed brass and enamel urn with white inlays and pearlescent finish. (LoveUrns)', 595.00, NULL, NULL, false, 84),
  ('si000375', '3745', 'c1000000-0000-0000-0000-000000000009', 'UMBRFSLV6', 'Lavender Butterflies', 'Crafted from aluminum and brass, this urn features a soothing lavender finish with butterfly motifs. (LoveUrns)', 595.00, NULL, NULL, false, 85),
  ('si000376', '3745', 'c1000000-0000-0000-0000-000000000009', 'UMBRFSLWY', 'Wings of Hope Yellow', 'Elegant butterfly designed brass and enamel urn with yellow inlays and pearlescent finish. (LoveUrns)', 595.00, NULL, NULL, false, 86),
  ('si000377', '3745', 'c1000000-0000-0000-0000-000000000009', 'UMBRFSDLY', 'Flying Doves', 'Blue Metal Full Size Urn with hand engraved Dove Design. (Keepsakes and/or accessories sold separately) (LoveUrns)', 595.00, NULL, NULL, false, 87),
  ('si000378', '3745', 'c1000000-0000-0000-0000-000000000009', 'UMBRFSAMP', 'Mother of Pearl Elite', 'Polished aluminum urn with iridescent Mother of Pearl mosaic tile. (Keepsakes and/or accessories sold separately) (LoveUrns)', 595.00, NULL, NULL, false, 88),
  ('si000379', '3745', 'c1000000-0000-0000-0000-000000000009', 'UMABFS5AU', 'Laurel Crimson', 'Crimson Color Metal Full Size Urn with Brushed Gold Lid (Keepsakes and/or accessories sold separately) (LoveUrns)', 595.00, NULL, NULL, false, 89),
  ('si000380', '3745', 'c1000000-0000-0000-0000-000000000009', 'UMLBFSL2D', 'Golden Doves', 'Crafted from aluminum and brass, this urn features a blue finish with radiant golden doves in flight. (LoveUrns)', 595.00, NULL, NULL, false, 90),
  ('si000381', '3745', 'c1000000-0000-0000-0000-000000000009', 'UMLBFSL61', 'Rose Lavender', 'Crafted from aluminum and brass, this urn captures the essence of a rose with soft lavender tones and offers personalization with image and engraving. A gentle, graceful way to honor a life. (LoveUrns)', 595.00, NULL, NULL, false, 91),
  ('si000382', '3745', 'c1000000-0000-0000-0000-000000000009', 'UMLBFSL62', 'Open Road', 'Crafted in aluminum and brass, this urn captures the spirit of adventure with its open road theme and offers complete personalization with image and engraving. A fitting memorial for those who embraced life''s journey. (LoveUrns)', 595.00, NULL, NULL, false, 92),
  ('si000383', '3745', 'c1000000-0000-0000-0000-000000000009', 'UMLBFSL63', 'Mountain', 'Crafted from aluminum and brass, this urn reflects the majesty of mountains and can be customized with image and engraving. A tribute to strength, freedom, and enduring memories. (LoveUrns)', 595.00, NULL, NULL, false, 93),
  ('si000384', '3745', 'c1000000-0000-0000-0000-000000000009', 'UMLBFSL64', 'Forest', 'Crafted from aluminum and brass, this urn showcases a tranquil forest design and offers complete personalization with image and engraving. A beautiful way to honor a life rooted in nature. (LoveUrns)', 595.00, NULL, NULL, false, 94),
  ('si000385', '3745', 'c1000000-0000-0000-0000-000000000009', 'UMLBFSL65', 'Beaches', 'Crafted from durable aluminum and brass, this urn features a serene beach design and offers complete personalization with image and engraving. A peaceful tribute for those who loved the shore. (LoveUrns)', 595.00, NULL, NULL, false, 95),
  ('si000386', '3745', 'c1000000-0000-0000-0000-000000000009', 'UMBZFSHDS', 'Omega Vase', 'Bronze vase with polished gold-tone accents. (Terrybear)', 545.00, NULL, NULL, false, 96),
  ('si000387', '3745', 'c1000000-0000-0000-0000-000000000009', 'UMBRFSAFM', 'Silver Vase', 'Polished antique silver-toned brass with gold-toned accents. (Terrybear)', 545.00, NULL, NULL, false, 97),
  ('si000388', '3745', 'c1000000-0000-0000-0000-000000000009', 'UMBRFSLFO', 'Divine', 'Beautifully designed blue brass and enamel urn with enameled finish. (LoveUrns)', 495.00, NULL, NULL, false, 98),
  ('si000389', '3745', 'c1000000-0000-0000-0000-000000000009', 'UMBRFSDFO', 'Art Deco', 'Aluminum urn with classic and sleek style with enameled bands. (Keepsakes and/or accessories sold separately) (LoveUrns)', 495.00, NULL, NULL, false, 99),
  ('si000390', '3745', 'c1000000-0000-0000-0000-000000000009', 'UMBRFSABQ', 'Dove Vase', 'Aluminum vase with blue accents and dove design. (Keepsakes and/or accessories sold separately) (LoveUrns)', 495.00, NULL, NULL, false, 100),
  ('si000391', '3745', 'c1000000-0000-0000-0000-000000000009', 'UMLBFSLMK', 'Midnight Sky', 'Crafted from durable aluminum with a speckled midnight black finish, this urn captures the beauty of a midnight sky. (LoveUrns)', 495.00, NULL, NULL, false, 101),
  ('si000392', '3745', 'c1000000-0000-0000-0000-000000000009', 'UMLBFSLMR', 'Stardust Ember', 'Crafted from durable brass with a speckled brown finish, this urn reflects earthy tones of stardust ember. (LoveUrns)', 495.00, NULL, NULL, false, 102),
  ('si000393', '3745', 'c1000000-0000-0000-0000-000000000009', 'UMLBFSLTW', 'Twilight Blue', 'Crafted from durable brass with a speckled twilight blue finish, this urn combines solitude and serenity. (LoveUrns)', 495.00, NULL, NULL, false, 103),
  ('si000394', '3745', 'c1000000-0000-0000-0000-000000000009', 'UMBRFSADP', 'Moonlight Blue Vase', 'Brass urn with a deep blue finish with metallic shimmer. Features a contemporary shape and pewter-finish accent bands. (Terrybear)', 460.00, NULL, NULL, false, 104),
  ('si000395', '3745', 'c1000000-0000-0000-0000-000000000009', 'UMBRFSAUP', 'Bright Stripes Purple', 'Brass urn with bright purple striped finish. (Terrybear)', 425.00, NULL, NULL, false, 105),
  ('si000396', '3745', 'c1000000-0000-0000-0000-000000000009', 'UMBRFSAPE', 'Bright Stripes Blue', 'Brass urn with bright blue striped finish. (Terrybear)', 425.00, NULL, NULL, false, 106),
  ('si000397', '3745', 'c1000000-0000-0000-0000-000000000009', 'UMBRFSARS', 'Bright Stripes Red', 'Brass urn with bright crimson striped finish. (Terrybear)', 425.00, NULL, NULL, false, 107),
  ('si000398', '3745', 'c1000000-0000-0000-0000-000000000009', 'UMBRACLTE', 'Cuddlebear™ Blue', 'Teddy Bear shaped Child Urn in Blue finish with Crystal. (LoveUrns)', 195.00, NULL, NULL, false, 108),
  ('si000399', '3745', 'c1000000-0000-0000-0000-000000000009', 'UMBRACLTP', 'Cuddlebear™ Pink', 'Teddy Bear shaped Child Urn in Pink finish with Crystal. (LoveUrns)', 195.00, NULL, NULL, false, 109),
  ('si000400', '3745', 'c1000000-0000-0000-0000-000000000009', 'UMZNACZ88', 'Cuddlebear™ White', 'Teddy Bear shaped Child Urn in White finish with Crystal. (LoveUrns)', 195.00, NULL, NULL, false, 110),
  ('si000401', '3745', 'c1000000-0000-0000-0000-000000000009', 'UW3QFSGMU', 'Classic Stained Maple', 'Urban grey stained maple Urn with customizable front plates. (Urnes Bégin)', 995.00, NULL, NULL, false, 111),
  ('si000402', '3745', 'c1000000-0000-0000-0000-000000000009', 'UWMPFSACR', 'Bois Silver Maple', 'Canadian maple wood urn with dark brown stain and contrasting dark walnut inlay stripe. (Urnes Bégin)', 895.00, NULL, NULL, false, 112),
  ('si000403', '3745', 'c1000000-0000-0000-0000-000000000009', 'UWBHFSADF', 'Memento Chest', 'Mixed hardwoods and burl wood veneer top with wood inlay and high gloss lacquer finish. Features plastic insert and one key. TSA/CATSA-compliant. (Batesville)', 795.00, NULL, NULL, false, 113),
  ('si000404', '3745', 'c1000000-0000-0000-0000-000000000009', 'UWWDFSAMA', 'Moments Azalea Urn and Frame', 'Mixed hardwood urn with removable Tiffany-inspired Azalea frame keepsake. (Frame keepsake is magnetically attached to urn and can be displayed separately. <1 cu in). (Terrybear)', 690.00, NULL, NULL, false, 114),
  ('si000405', '3745', 'c1000000-0000-0000-0000-000000000009', 'UWAKFSACV', 'Mozart Memory Chest', 'Medium Density Fiberboard with veneer memory chest in bombe shape reminiscent of European furniture. TSA/CATSA-compliant. (Terrybear)', 595.00, NULL, NULL, false, 115),
  ('si000406', '3745', 'c1000000-0000-0000-0000-000000000009', 'UWBHFSABH', 'Cherry Chest', 'Composite wood veneer chest with cherry-stained finish. TSA/CATSA-compliant. (Batesville)', 595.00, NULL, NULL, false, 116),
  ('si000407', '3745', 'c1000000-0000-0000-0000-000000000009', 'UWBHFSADQ', 'Natural Cube', 'Solid birchwood with burl wood veneer and high gloss lacquer finish. TSA/CATSA-compliant. (Batesville)', 495.00, NULL, NULL, false, 117),
  ('si000408', '3745', 'c1000000-0000-0000-0000-000000000009', 'UWTAFSFMS', 'Modern Essential Sable', 'Acacia hardwood urn with a contemporary design in a sable finish. Each urn features a unique woodgrain. TSA/CATSA-compliant. (Terrybear)', 495.00, NULL, NULL, false, 118),
  ('si000409', '3745', 'c1000000-0000-0000-0000-000000000009', 'UOFBFSANO', 'Natural Box', 'Composite wood with a paper wrap providing a natural wood grain look with matte polish. Features a sliding bottom with one point access for easy use. TSA/CATSA-compliant. (Batesville)', 200.00, NULL, NULL, false, 119),
  ('si000410', '3745', 'c1000000-0000-0000-0000-000000000009', 'UWXCFSZLT', 'Living Tribute Urn', 'Handmade wooden urn with vibrant grain and a finely sanded surface; comes with your choice of succulent. TSA/CATSA-compliant. (BioLife)', 895.00, NULL, NULL, false, 120),
  ('si000411', '3745', 'c1000000-0000-0000-0000-000000000009', 'UOUOSB65Z', 'Ecolegacy Spiral', 'Comforting full-size urn crafted from innovative renewable plant-based materials blended with wood residues, highlighted by graceful spiral designs symbolizing life''s cycle, built for reliable use and gentle return to the earth through natural processes. (Urnes Bégin)', 595.00, NULL, NULL, false, 121),
  ('si000412', '3745', 'c1000000-0000-0000-0000-000000000009', 'UOUOSB6L4', 'Ecolegacy Mosaic', 'Comforting full-size urn crafted from innovative renewable plant-based materials blended with wood residues, highlighted by intricate mosaic patterns for warm textured appeal, built for reliable use and gentle return to the earth through natural processes. (Urnes Bégin)', 595.00, NULL, NULL, false, 122),
  ('si000413', '3745', 'c1000000-0000-0000-0000-000000000009', 'UOBDFSAFE', 'The Living Urn', 'Natural fiber biodegradable urn and tree planting system, designed to grow a beautiful memory tree, plant, or flowers. Kit includes biodegradable urn, RootProtect® neutralizing agent, aged wood chips, and handmade bamboo case. Includes tree of choice. TSA/CATSA-compliant. (BioLife)', 595.00, NULL, NULL, false, 123),
  ('si000414', '3745', 'c1000000-0000-0000-0000-000000000009', 'UOBDFSGIC', 'Biowood Mosaic', 'Timeless full-size urn crafted from renewable plant-based materials blended with wood residues, featuring sophisticated mosaic patterns for earthy warmth, offering durable beauty with gradual earth-friendly integration over an extended period. (Urnes Bégin)', 595.00, NULL, NULL, false, 124),
  ('si000415', '3745', 'c1000000-0000-0000-0000-000000000009', 'UOBDFSGOW', 'Biowood Spiral', 'Timeless full-size urn crafted from renewable plant-based materials blended with wood residues, featuring elegant spiral accents for natural harmony, offering durable beauty with gradual earth-friendly integration over an extended period. (Urnes Bégin)', 595.00, NULL, NULL, false, 125),
  ('si000416', '3745', 'c1000000-0000-0000-0000-000000000009', 'UORDFSARP', 'Carpel Rock Salt', 'The Carpel Rock Salt urn is a full-capacity urn that is a perfect vessel for a natural disposition. Designed for sea burials or water funerals; guaranteed to dissolve in four hours. TSA/CATSA-compliant. (Marble Products)', 580.00, NULL, NULL, false, 126),
  ('si000417', '3745', 'c1000000-0000-0000-0000-000000000009', 'UOBGFS5V5', 'Oceanblue™ Eco Urn', 'Biodegradable Full Size Urn in Blue and White color. Conforme ACSTA. (LoveUrns)', 495.00, NULL, NULL, false, 127),
  ('si000418', '3745', 'c1000000-0000-0000-0000-000000000009', 'UODFFS5V4', 'Earthbrown™ Eco Urn', 'Biodegradable Full Size Urn in Brown and White color. TSA/CATSA-compliant. (LoveUrns)', 495.00, NULL, NULL, false, 128),
  ('si000419', '3745', 'c1000000-0000-0000-0000-000000000009', 'UOBDFS5SY', 'Shiftingsand™ Footprints', 'Urn with Footprints in sand finish. TSA/CATSA-compliant. (LoveUrns)', 495.00, NULL, NULL, false, 129),
  ('si000420', '3745', 'c1000000-0000-0000-0000-000000000009', 'UOAQFS1G3', 'Beacon Water Urn', 'Biodegradable urn is designed to simplify the scattering process in a body of water. Durable, dignified, easy-to-use container created from recycled paper and cardboard with no metal components and can be personalized by writing on the surface. Includes bamboo case, convenient for travel and nice for ceremonies. TSA/CATSA-compliant. (BioLife)', 395.00, NULL, NULL, false, 130),
  ('si000421', '3745', 'c1000000-0000-0000-0000-000000000009', 'UOALFS1G4', 'Earth Scattering Cylinder Large', 'The patented Eco Scattering Urn is a beautiful and dignified option for families that want to scatter the ashes of a loved one. Each hand-made Eco Scattering Urn is made only from bamboo, a sustainable resource, and rubbed with a natural oil to accentuate the natural grains and colors of the bamboo. The lid is secured with a strong, birch wood locking pin and can be locked in an open and closed position for graceful scattering. Comes with a hand-sewn premium cotton bag sleeve convenient for travel. TSA/CATSA-compliant. (BioLife)', 295.00, NULL, NULL, false, 131),
  ('si000422', '3745', 'c1000000-0000-0000-0000-000000000009', 'UORPSB1SU', 'Field of Flowers Scattering Tube', 'Scattering tube is designed to simplify the scattering process. Durable, dignified, easy-to-use container created from recycled paper and cardboard with no metal components. TSA/CATSA-compliant. (BioLife)', 195.00, NULL, NULL, false, 132),
  ('si000423', '3745', 'c1000000-0000-0000-0000-000000000009', 'UORPFS1SU', 'Simplicity Scattering Tube', 'Scattering tube is designed to simplify the scattering process. Durable, dignified, easy-to-use container created from recycled paper and cardboard with no metal components. TSA/CATSA-compliant. (BioLife)', 195.00, NULL, NULL, false, 133),
  ('si000424', '3745', 'c1000000-0000-0000-0000-000000000009', 'UORPFSUF4', 'Ascending Dove Scattering Tube', 'Scattering tube is designed to simplify the scattering process. Durable, dignified, easy-to-use container created from recycled paper and cardboard with no metal components. TSA/CATSA-compliant. (BioLife)', 195.00, NULL, NULL, false, 134),
  ('si000425', '3745', 'c1000000-0000-0000-0000-000000000009', 'UORPFSUF6', 'Mountain View Scattering Tube', 'Scattering tube is designed to simplify the scattering process. Durable, dignified, easy-to-use container created from recycled paper and cardboard with no metal components. TSA/CATSA-compliant. (BioLife)', 195.00, NULL, NULL, false, 135),
  ('si000426', '3745', 'c1000000-0000-0000-0000-000000000009', 'UOBDFSADR', 'Ocean Sunset Scattering Tube', 'Scattering tube is designed to simplify the scattering process. Durable, dignified, easy-to-use container created from recycled paper and cardboard with no metal components. TSA/CATSA-compliant. (BioLife)', 195.00, NULL, NULL, false, 136),
  ('si000427', '3745', 'c1000000-0000-0000-0000-000000000009', 'UOLRFSACW', 'Leather Cylinder', 'Slate brown bonded leather cylinder. TSA/CATSA-compliant. (Batesville)', 195.00, NULL, NULL, false, 137),
  ('si000428', '3745', 'c1000000-0000-0000-0000-000000000009', 'UMSTFSAGJ', 'Utility', '20 gauge carbon steel construction with black semi-gloss finish. (Batesville)', 295.00, NULL, NULL, false, 138),
  ('si000429', '3745', 'c1000000-0000-0000-0000-000000000009', 'UMALFSADA', 'Mailer', 'Composite wood with aluminum like texture, acceptable to ship through the mail courier service. (Batesville)', 190.00, NULL, NULL, false, 139)
  on conflict (id) do nothing;

