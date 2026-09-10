-- ─────────────────────────────────────────────────────────────────────────────
-- MIGRATION — Mount Pleasant Universal Funeral Home (ID: 3606)
-- Casket Catalog & Pricing — effective February 18, 2026
-- ─────────────────────────────────────────────────────────────────────────────

-- ─── 1. New casket_catalog entries (not yet in global catalog) ────────────────

insert into casket_catalog (id, name, description, manufacturer, item_code, category, image_url, sort_order) values
  ('csk073', 'Folksau (Full Couch)',           'Solid oak full couch casket with honey oak high gloss finish and off-white velvet interior and brushed copper hardware.',    'Vancouver Casket', 'CWOKVFAVGU', 'wood',      NULL,  1),
  ('csk074', 'Sacrament Maple',                'Solid hardwood casket with a dark cherry, hand-rubbed, high gloss exterior and champagne velvet interior.',                   'Batesville',       'CWMLBAGIBQ', 'wood',      NULL,  2),
  ('csk075', 'Lotus',                          'Solid ailanthus casket with a dark, polished, cherry stained exterior and pearl velvet interior.',                             'Vancouver Casket', 'CWPRVFBNEJ', 'wood',      NULL,  3),
  ('csk076', 'Westcott',                       'Hardwood casket with a medium finished exterior and rosetan crepe interior.',                                                  'Batesville',       'CWAFBEA7KL', 'wood',      NULL,  4),
  ('csk077', 'Graytone',                       '20-gauge steel casket with a dark gray painted exterior and silver crepe interior.',                                           'Batesville',       'CMS0BDTCFW', 'metal',     NULL,  5),
  ('csk078', 'Dignity Peach',                  'Fiberboard casket with a cloth-covered exterior and white barry interior.',                                                    'Batesville',       'CCCLBBZRGX', 'container', NULL,  6),
  ('csk079', 'Grey Malet',                     'Fiberboard casket with handles and a grey cloth-covered exterior and white barry interior.',                                   'Batesville',       'CCCLBCKOGX', 'container', NULL,  7),
  ('csk080', 'Hadley Cremation Container',     'Wood composite with a dark finish and an ivory crepe interior.',                                                               'Batesville',       'CCBHCRC',    'cremation', NULL,  8),
  ('csk081', 'Novato Cremation Container',     'Wood composite container with a printed woodgrain finish exterior and an ivory crepe interior.',                               'Batesville',       'CCBNVTO',    'container', NULL,  9)
on conflict (id) do nothing;

-- ─── 2. Mount Pleasant (3606) casket pricing ─────────────────────────────────
-- All 69 products from the Casket Price List, effective February 18, 2026

insert into funeral_home_caskets (funeral_home_id, catalog_id, price, sort_order) values
  -- Wood Caskets
  ('3606', 'csk017',  16599.00,  1),  -- 710 President
  ('3606', 'csk061',  12488.00,  2),  -- Emperor
  ('3606', 'csk062',  12488.00,  3),  -- Executive Mahogany
  ('3606', 'csk018',  10899.00,  4),  -- Eloquence Mahogany
  ('3606', 'csk019',   8299.00,  5),  -- Bexley Oak
  ('3606', 'csk020',   8299.00,  6),  -- Cantonese Red (Full Couch)
  ('3606', 'csk016',   8299.00,  7),  -- Regent
  ('3606', 'csk073',   7799.00,  8),  -- Folksau (Full Couch)
  ('3606', 'csk021',   7499.00,  9),  -- Langdon Cherry
  ('3606', 'csk023',   6499.00, 10),  -- Chandler
  ('3606', 'csk024',   6499.00, 11),  -- Classic Mahogany
  ('3606', 'csk025',   6499.00, 12),  -- Jamestown PC
  ('3606', 'csk015',   6499.00, 13),  -- Prominence
  ('3606', 'csk026',   6499.00, 14),  -- Warren Oak
  ('3606', 'csk064',   5999.00, 15),  -- Ho Wan
  ('3606', 'csk065',   5999.00, 16),  -- Shanghai
  ('3606', 'csk027',   5699.00, 17),  -- Woodbridge Pecan
  ('3606', 'csk028',   5199.00, 18),  -- St. Thomas Oak
  ('3606', 'csk029',   5099.00, 19),  -- Mansfield-27
  ('3606', 'csk074',   5099.00, 20),  -- Sacrament Maple
  ('3606', 'csk030',   4699.00, 21),  -- Briar Hill
  ('3606', 'csk031',   4699.00, 22),  -- Camden Oak
  ('3606', 'csk032',   4699.00, 23),  -- Cameron Oak
  ('3606', 'csk033',   4699.00, 24),  -- Promise
  ('3606', 'csk034',   4699.00, 25),  -- Rosette
  ('3606', 'csk035',   4699.00, 26),  -- Victoria Cherry
  ('3606', 'csk075',   4499.00, 27),  -- Lotus
  ('3606', 'csk036',   4295.00, 28),  -- Sincerity
  ('3606', 'csk037',   4099.00, 29),  -- Brexton
  ('3606', 'csk014',   4099.00, 30),  -- Dominion HC Wood Maple Crepe
  ('3606', 'csk004',   4099.00, 31),  -- Eleanor Oak
  ('3606', 'csk003',   4099.00, 32),  -- Fireside
  ('3606', 'csk038',   4099.00, 33),  -- Hadyn
  ('3606', 'csk007',   3599.00, 34),  -- Bailey
  ('3606', 'csk008',   3599.00, 35),  -- Hartvic
  ('3606', 'csk039',   3599.00, 36),  -- Sherwood Oak
  ('3606', 'csk006',   3599.00, 37),  -- Watson
  ('3606', 'csk011',   2999.00, 38),  -- Heavenly White
  ('3606', 'csk010',   2999.00, 39),  -- Montgomery
  ('3606', 'csk076',   2999.00, 40),  -- Westcott
  ('3606', 'csk012',   2999.00, 41),  -- Winfield
  ('3606', 'csk043',   2799.00, 42),  -- Atlantic
  ('3606', 'csk044',   2799.00, 43),  -- Natura
  ('3606', 'csk045',   2799.00, 44),  -- Oxford
  ('3606', 'csk013',   2599.00, 45),  -- Freelton
  ('3606', 'csk046',   2599.00, 46),  -- Schafer
  -- Metal Caskets
  ('3606', 'csk067',  55399.00, 47),  -- Promethean (Full Couch)
  ('3606', 'csk069',  18299.00, 48),  -- Classic Mahogany Bronze (Full Couch)
  ('3606', 'csk047',  12499.00, 49),  -- Mediterranean Copper
  ('3606', 'csk048',  10899.00, 50),  -- Aegean Copper
  ('3606', 'csk049',   5199.00, 51),  -- Golden Granite
  ('3606', 'csk050',   5099.00, 52),  -- Primrose
  ('3606', 'csk051',   4299.00, 53),  -- Merlot-28
  ('3606', 'csk001',   4099.00, 54),  -- Merlot
  ('3606', 'csk052',   3599.00, 55),  -- Antique Blue-28
  ('3606', 'csk005',   3599.00, 56),  -- Misty Blue
  ('3606', 'csk077',   2699.00, 57),  -- Graytone
  -- Other Caskets
  ('3606', 'csk078',   1099.00, 58),  -- Dignity Peach
  ('3606', 'csk079',   1099.00, 59),  -- Grey Malet
  -- Cremation Oriented Caskets
  ('3606', 'csk080',   1999.00, 60),  -- Hadley Cremation Container
  ('3606', 'csk053',   1050.00, 61),  -- McConnell
  ('3606', 'csk081',    999.00, 62),  -- Novato Cremation Container
  ('3606', 'csk071',    850.00, 63),  -- Burlington
  ('3606', 'cont004',   699.00, 64),  -- Plywood Container
  ('3606', 'cont003',   650.00, 65),  -- Cypress
  -- Rental Caskets
  ('3606', 'cont001',  1599.00, 68),  -- Brockton Oak Ceremonial
  ('3606', 'cont002',   850.00, 69)   -- Brockton Oak (1 Hour Rental)
on conflict (funeral_home_id, catalog_id) do update set
  price      = excluded.price,
  sort_order = excluded.sort_order;
