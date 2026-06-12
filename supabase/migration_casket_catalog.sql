-- ─── Migration: casket_catalog + funeral_home_caskets ────────────────────────
-- Splits the per-home `caskets` table into:
--   casket_catalog        — global product master (name, description, image, manufacturer)
--   funeral_home_caskets  — per-home availability + pricing (with optional override)
-- Run AFTER all previous migrations.

-- 1. Create global product catalog
create table casket_catalog (
  id           text    primary key,   -- same IDs as old caskets (csk001, cont001, …)
  name         text    not null,
  description  text,
  manufacturer text,
  item_code    text,                  -- manufacturer SKU
  category     text    default 'wood',  -- 'wood' | 'metal' | 'cremation' | 'rental' | 'container'
  image_url    text,
  sort_order   int     default 0,
  created_at   timestamptz default now()
);

-- 2. Create per-home availability + pricing table
create table funeral_home_caskets (
  id              uuid    primary key default gen_random_uuid(),
  funeral_home_id text    references funeral_homes on delete cascade,
  catalog_id      text    references casket_catalog,
  price           numeric(10,2) not null,
  sort_order      int     default 0,
  unique (funeral_home_id, catalog_id)
);

-- 3. Migrate existing caskets (all Victory Memorial 3745) → casket_catalog
insert into casket_catalog (id, name, description, image_url, category, sort_order)
select
  id,
  name,
  description,
  image_url,
  case
    when id in ('csk001','csk005','csk047','csk048','csk049','csk050','csk051','csk052') then 'metal'
    when id in ('csk053') then 'cremation'
    when id in ('cont001','cont002') then 'rental'
    when id in ('cont003','cont004','cont005','cont006') then 'container'
    else 'wood'
  end,
  sort_order
from caskets;

-- 4. Backfill manufacturer/item_code for products also in Forest Lawn (from FL price list)
update casket_catalog set manufacturer = 'Batesville',      item_code = 'CWMYBAPXEJ' where id = 'csk017';
update casket_catalog set manufacturer = 'Batesville',      item_code = 'CWMYBARWBQ' where id = 'csk018';
update casket_catalog set manufacturer = 'Batesville',      item_code = 'CWOKBANPBQ' where id = 'csk019';
update casket_catalog set manufacturer = 'Vancouver Casket', item_code = 'CWBRVBIPEC' where id = 'csk020';
update casket_catalog set manufacturer = 'Batesville',      item_code = 'CWMYBAROBQ' where id = 'csk016';
update casket_catalog set manufacturer = 'Batesville',      item_code = 'CWCHBAQYBQ' where id = 'csk021';
update casket_catalog set manufacturer = 'Batesville',      item_code = 'CWMYBARHBQ' where id = 'csk023';
update casket_catalog set manufacturer = 'Victoriaville',   item_code = 'CWMYLBABEJ' where id = 'csk024';
update casket_catalog set manufacturer = 'Victoriaville',   item_code = 'CWCHLBAFEJ' where id = 'csk025';
update casket_catalog set manufacturer = 'Batesville',      item_code = 'CWMLBDA6BQ' where id = 'csk015';
update casket_catalog set manufacturer = 'Batesville',      item_code = 'CWOKBAMIBQ' where id = 'csk026';
update casket_catalog set manufacturer = 'Batesville',      item_code = 'CWPNBACMBQ' where id = 'csk027';
update casket_catalog set manufacturer = 'Victoriaville',   item_code = 'CWWLBAJDA'  where id = 'csk028';
update casket_catalog set manufacturer = 'Batesville',      item_code = 'CWHWBMHHFD' where id = 'csk029';
update casket_catalog set manufacturer = 'Victoriaville',   item_code = 'CWMLLBEPBN' where id = 'csk030';
update casket_catalog set manufacturer = 'Batesville',      item_code = 'CWOKBFBKBP' where id = 'csk031';
update casket_catalog set manufacturer = 'Batesville',      item_code = 'CWOKBANVBQ' where id = 'csk032';
update casket_catalog set manufacturer = 'Batesville',      item_code = 'CWSHBPHCML' where id = 'csk033';
update casket_catalog set manufacturer = 'Batesville',      item_code = 'CWHWBRHCDC' where id = 'csk034';
update casket_catalog set manufacturer = 'Victoriaville',   item_code = 'CWCHLBAKBH' where id = 'csk035';
update casket_catalog set manufacturer = 'Batesville',      item_code = 'CWSHBSINML' where id = 'csk036';
update casket_catalog set manufacturer = 'Batesville',      item_code = 'CWOKBCHDBQ' where id = 'csk037';
update casket_catalog set manufacturer = 'Victoriaville',   item_code = 'CWMLLBWEGQ' where id = 'csk014';
update casket_catalog set manufacturer = 'Batesville',      item_code = 'CWOKBBYAEO' where id = 'csk004';
update casket_catalog set manufacturer = 'Batesville',      item_code = 'CWOKBBAVA1' where id = 'csk003';
update casket_catalog set manufacturer = 'Victoriaville',   item_code = 'CWPRLBAEGQ' where id = 'csk008';
update casket_catalog set manufacturer = 'Victoriaville',   item_code = 'CWOKLEGZGQ' where id = 'csk039';
update casket_catalog set manufacturer = 'Victoriaville',   item_code = 'CWHWLBA1HB' where id = 'csk011';
update casket_catalog set manufacturer = 'Victoriaville',   item_code = 'CWHWLBA1EY' where id = 'csk041';
update casket_catalog set manufacturer = 'Victoriaville',   item_code = 'CWHWLEYGGQ' where id = 'csk012';
update casket_catalog set manufacturer = 'Victoriaville',   item_code = 'CWPRLAA3AJ' where id = 'csk043';
update casket_catalog set manufacturer = 'Victoriaville',   item_code = 'CWPRLDFEAB' where id = 'csk044';
update casket_catalog set manufacturer = 'Batesville',      item_code = 'CMC3BEZYBQ' where id = 'csk047';
update casket_catalog set manufacturer = 'Batesville',      item_code = 'CMC3BFALBQ' where id = 'csk048';
update casket_catalog set manufacturer = 'Batesville',      item_code = 'CMS8BDJGBQ' where id = 'csk049';
update casket_catalog set manufacturer = 'Batesville',      item_code = 'CMS8BATBEO' where id = 'csk050';
update casket_catalog set manufacturer = 'Batesville',      item_code = 'CMS8BDCOBP' where id = 'csk051';
update casket_catalog set manufacturer = 'Batesville',      item_code = 'CMS0BDLPDE' where id = 'csk052';
update casket_catalog set manufacturer = 'Vancouver Casket', item_code = 'CCVMCCC'   where id = 'csk053';
update casket_catalog set manufacturer = 'Batesville',      item_code = 'CRBALTF'    where id = 'cont001';
update casket_catalog set manufacturer = 'Batesville',      item_code = 'CRBBRHC'    where id = 'cont002';

-- 5. Migrate pricing → funeral_home_caskets
insert into funeral_home_caskets (funeral_home_id, catalog_id, price, sort_order)
select funeral_home_id, id, price, sort_order from caskets;

-- 6. Drop old FK constraints and re-point to casket_catalog
alter table packages    drop constraint if exists packages_default_casket_id_fkey;
alter table quote_items drop constraint if exists quote_items_casket_id_fkey;

alter table packages    add constraint packages_default_casket_id_fkey
  foreign key (default_casket_id) references casket_catalog;
alter table quote_items add constraint quote_items_casket_id_fkey
  foreign key (casket_id) references casket_catalog;

-- 7. Drop old caskets table
drop table caskets;

-- 8. Enable RLS on new tables
alter table casket_catalog       enable row level security;
alter table funeral_home_caskets enable row level security;
create policy "allow_all" on casket_catalog       for all using (true) with check (true);
create policy "allow_all" on funeral_home_caskets for all using (true) with check (true);

-- ─── 9. New catalog entries (Forest Lawn products not in Victory Memorial) ───

insert into casket_catalog (id, name, description, manufacturer, item_code, category, sort_order) values
  ('csk060', 'Dynasty (Full Couch)',                 'Solid mahogany casket with medium mahogany stain exterior and velvet interior.',                                             'Vancouver Casket', 'CWMYVFDLGU',  'wood',     1),
  ('csk061', 'Emperor',                              'Solid Mahogany casket with hand-carved details and a dark, polished exterior and beige velvet interior.',                    'Vancouver Casket', 'CWMYVBYIAP',  'wood',     3),
  ('csk062', 'Executive Mahogany',                   'Solid mahogany casket high gloss, polished exterior and coffee velvet interior.',                                            'Vancouver Casket', 'CWMYVBZKBS',  'wood',     4),
  ('csk063', 'Pieta Maple',                          'Solid maple casket with a dark cherry, hand-rubbed, high gloss exterior and a champagne velvet interior.',                  'Batesville',       'CWMLBAGPBQ',  'wood',    10),
  ('csk064', 'Ho Wan',                               'Hardwood casket with a dark stained, hand-carved detailed exterior and white crepe interior.',                               'Vancouver Casket', 'CWHWVCKDBW',  'wood',    16),
  ('csk065', 'Shanghai',                             'Hardwood casket with a dark stained, polished exterior and white crepe interior.',                                           'Vancouver Casket', 'CWELVEFYHB',  'wood',    17),
  ('csk066', 'Woodhaven Pecan',                      'Pecan veneer casket with a medium pecan, satin finish exterior and champagne velvet interior.',                              'Batesville',       'CWPNBADRBQ',  'wood',    20),
  ('csk072', 'Butler',                               'Select hardwood casket with a medium finished exterior and white barry interior.',                                            'Batesville',       'CWHWBBGWGX',  'wood',    40),
  ('csk067', 'Promethean (Full Couch)',               '48 oz. semi-precious bronze casket with a hand polished, gold mirrored exterior and Shasta Lily white velvet interior.',    'Batesville',       'CMB4BFBGFQ',  'metal',   41),
  ('csk068', 'Venetian Bronze',                      '48-ounce bronze casket with a bronze brushed exterior with gold accents and a champagne velvet interior.',                   'Batesville',       'CMB4BFAPBQ',  'metal',   42),
  ('csk069', 'Classic Mahogany Bronze (Full Couch)', '48 ounce bronze casket with accents and champagne velvet interior.',                                                         'Batesville',       'CMB4BFATBQ',  'metal',   43),
  ('csk070', 'Sierra',                               '18 gauge steel casket with shaded exterior and black accents; champagne sovereign velvet interior.',                         'Batesville',       'CMS8BASZBQ',  'metal',   47),
  ('csk071', 'Burlington',                           'Hollow cored poplar container with natural stain finish and white satin lining with pillow.',                                'Vancouver Casket', 'CCVBUCC',     'cremation', 52);

-- ─── 10. Forest Lawn (3605) casket pricing ────────────────────────────────────
-- Effective April 14, 2026 — prices per Forest Lawn Casket Price List

insert into funeral_home_caskets (funeral_home_id, catalog_id, price, sort_order) values
  -- Wood Caskets
  ('3605', 'csk060', 18588.00,  1),   -- Dynasty (Full Couch)
  ('3605', 'csk017', 16599.00,  2),   -- 710 President
  ('3605', 'csk061', 12488.00,  3),   -- Emperor
  ('3605', 'csk062', 12488.00,  4),   -- Executive Mahogany
  ('3605', 'csk018', 10899.00,  5),   -- Eloquence Mahogany
  ('3605', 'csk019',  8299.00,  6),   -- Bexley Oak
  ('3605', 'csk020',  8299.00,  7),   -- Cantonese Red (Full Couch)
  ('3605', 'csk016',  8299.00,  8),   -- Regent
  ('3605', 'csk021',  7499.00,  9),   -- Langdon Cherry
  ('3605', 'csk063',  7199.00, 10),   -- Pieta Maple
  ('3605', 'csk023',  6499.00, 11),   -- Chandler
  ('3605', 'csk024',  6499.00, 12),   -- Classic Mahogany
  ('3605', 'csk025',  6499.00, 13),   -- Jamestown PC
  ('3605', 'csk015',  6499.00, 14),   -- Prominence
  ('3605', 'csk026',  6499.00, 15),   -- Warren Oak
  ('3605', 'csk064',  5999.00, 16),   -- Ho Wan
  ('3605', 'csk065',  5999.00, 17),   -- Shanghai
  ('3605', 'csk027',  5699.00, 18),   -- Woodbridge Pecan
  ('3605', 'csk028',  5199.00, 19),   -- St. Thomas Oak
  ('3605', 'csk066',  5199.00, 20),   -- Woodhaven Pecan
  ('3605', 'csk029',  5099.00, 21),   -- Mansfield-27
  ('3605', 'csk033',  4799.00, 22),   -- Promise  (FL $4,799 ≠ Victory $4,699)
  ('3605', 'csk030',  4699.00, 23),   -- Briar Hill
  ('3605', 'csk031',  4699.00, 24),   -- Camden Oak
  ('3605', 'csk032',  4699.00, 25),   -- Cameron Oak
  ('3605', 'csk034',  4699.00, 26),   -- Rosette
  ('3605', 'csk035',  4699.00, 27),   -- Victoria Cherry
  ('3605', 'csk003',  4299.00, 28),   -- Fireside   (FL $4,299 ≠ Victory $4,099)
  ('3605', 'csk036',  4295.00, 29),   -- Sincerity
  ('3605', 'csk037',  4099.00, 30),   -- Brexton
  ('3605', 'csk014',  4099.00, 31),   -- Dominion HC Wood Maple Crepe
  ('3605', 'csk004',  4099.00, 32),   -- Eleanor Oak
  ('3605', 'csk008',  3599.00, 33),   -- Hartvic
  ('3605', 'csk039',  3599.00, 34),   -- Sherwood Oak
  ('3605', 'csk011',  2999.00, 35),   -- Heavenly White
  ('3605', 'csk041',  2999.00, 36),   -- White Rose
  ('3605', 'csk012',  2999.00, 37),   -- Winfield
  ('3605', 'csk043',  2799.00, 38),   -- Atlantic
  ('3605', 'csk044',  2799.00, 39),   -- Natura
  ('3605', 'csk072',  2099.00, 40),   -- Butler
  -- Metal Caskets
  ('3605', 'csk067', 55399.00, 41),   -- Promethean (Full Couch)
  ('3605', 'csk068', 18399.00, 42),   -- Venetian Bronze
  ('3605', 'csk069', 18299.00, 43),   -- Classic Mahogany Bronze (Full Couch)
  ('3605', 'csk047', 12499.00, 44),   -- Mediterranean Copper
  ('3605', 'csk048', 10899.00, 45),   -- Aegean Copper
  ('3605', 'csk049',  5199.00, 46),   -- Golden Granite
  ('3605', 'csk070',  5199.00, 47),   -- Sierra
  ('3605', 'csk050',  5099.00, 48),   -- Primrose
  ('3605', 'csk051',  4299.00, 49),   -- Merlot-28
  ('3605', 'csk052',  3599.00, 50),   -- Antique Blue-28
  -- Cremation Oriented
  ('3605', 'csk053',  1050.00, 51),   -- McConnell  (FL $1,050 ≠ Victory $999)
  ('3605', 'csk071',   850.00, 52),   -- Burlington
  -- Rental
  ('3605', 'cont001', 1599.00, 53),   -- Brockton Oak Ceremonial
  ('3605', 'cont002',  850.00, 54);   -- Brockton Oak (1 Hour Rental)
