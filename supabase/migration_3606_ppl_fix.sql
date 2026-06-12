-- ─────────────────────────────────────────────────────────────────────────────
-- MIGRATION — Mount Pleasant Universal Funeral Home (ID: 3606)
-- PPL Package Fix — casket picker + optional items
-- Fixes:
--   • default_casket_id was NULL → casket picker never opened
--   • si001117–si001122 ("Recommended Casket" service items) were in
--     package_items as mandatory lines → should be selected via casket picker
--   • si001029 (Funeral Webcasting) and si001030 (Legal Service Plan) were
--     hardcoded as mandatory "Family Support Option" lines
-- ─────────────────────────────────────────────────────────────────────────────

-- ─── 1. Set default_casket_id (triggers casket picker on package selection) ──
-- Run migration_3606_caskets.sql first to ensure funeral_home_caskets is seeded.

update packages set default_casket_id = 'csk015'  where id = 'pk001010';  -- Heritage Funeral   → Prominence         $6,499
update packages set default_casket_id = 'csk035'  where id = 'pk001011';  -- Honour Funeral     → Victoria Cherry    $4,699
update packages set default_casket_id = 'csk001'  where id = 'pk001012';  -- Tribute Funeral    → Merlot             $4,099
update packages set default_casket_id = 'csk015'  where id = 'pk001013';  -- Jade Burial        → Prominence         $6,499
update packages set default_casket_id = 'cont001' where id = 'pk001014';  -- Heritage Cremation → Brockton Oak Cerm. $1,599
update packages set default_casket_id = 'csk071'  where id = 'pk001015';  -- Honour Cremation   → Burlington           $850
update packages set default_casket_id = 'csk071'  where id = 'pk001016';  -- Tribute Cremation  → Burlington           $850
update packages set default_casket_id = 'csk053'  where id = 'pk001017';  -- Jade Cremation     → McConnell           $1,050

-- ─── 2. Rebuild PPL package_items ────────────────────────────────────────────
-- Casket: removed si001117–si001122 — replaced by default_casket_id above
-- Family Support Options: all 7 options added as optional (director selects 1 or 2)
-- Urn Selections: optional (director confirms tier choice)
-- Limousine: optional (consistent with other funeral homes)
-- All other items: mandatory

delete from package_items where package_id in (
  'pk001010','pk001011','pk001012','pk001013',
  'pk001014','pk001015','pk001016','pk001017'
);

-- ── Heritage Funeral Service (pk001010) ──────────────────────────────────────
-- $19,229 total | mandatory $11,645 + limousine $395 + 1 family support $295
-- + casket (csk015 Prominence $6,499) – discount $540 = $18,689 net
insert into package_items (package_id, service_item_id, quantity, is_optional) values
  ('pk001010', 'si001001', 1, false),  -- Professional Services Fees for Full Service  3590
  ('pk001010', 'si001010', 1, false),  -- Registration and Documentation                495
  ('pk001010', 'si001011', 1, false),  -- Embalming                                     625
  ('pk001010', 'si001012', 1, false),  -- Other Care and Preparation                    445
  ('pk001010', 'si001013', 1, false),  -- Sheltering of Remains                         445
  ('pk001010', 'si001022', 1, false),  -- Transfer of Remains from Place of Death       545
  ('pk001010', 'si001024', 1, false),  -- Flower Vehicle                                295
  ('pk001010', 'si001023', 1, false),  -- Funeral Vehicle (Hearse)                      395
  ('pk001010', 'si001025', 1, true),   -- Limousine (optional)                          395
  ('pk001010', 'si001055', 1, false),  -- Everlasting Memorial®                         490
  ('pk001010', 'si001045', 1, false),  -- Estate Fraud Protection                       135
  ('pk001010', 'si001091', 1, false),  -- Dignity Heritage Burial Flowers               695
  ('pk001010', 'si001050', 1, false),  -- Premium Venue Service                         595
  ('pk001010', 'si001029', 1, true),   -- Family Support: Funeral Webcasting (opt, sel 1)  295
  ('pk001010', 'si001030', 1, true),   -- Family Support: Legal Service Plan (opt)         295
  ('pk001010', 'si001031', 1, true),   -- Family Support: Sterling Silver Pendant (opt)    295
  ('pk001010', 'si001032', 1, true),   -- Family Support: Memory Portrait (opt)            295
  ('pk001010', 'si001085', 1, true),   -- Family Support: Retractable Table Banner (opt)   295
  ('pk001010', 'si001086', 1, true),   -- Family Support: Timeless Touch Fingerprint (opt) 295
  ('pk001010', 'si001087', 1, true),   -- Family Support: Medallion Bundle (opt)           295
  ('pk001010', 'si001098', 1, false),  -- Catered Receptions III                       2495
  ('pk001010', 'si001100', 1, false);  -- Esteemed Collection                           795

-- ── Honour Funeral Service (pk001011) ────────────────────────────────────────
-- $16,329 total | mandatory $10,545 + limousine $395 + 1 family support $295
-- + casket (csk035 Victoria Cherry $4,699) – discount $460 = $15,869 net
insert into package_items (package_id, service_item_id, quantity, is_optional) values
  ('pk001011', 'si001001', 1, false),  -- Professional Services Fees for Full Service  3590
  ('pk001011', 'si001010', 1, false),  -- Registration and Documentation                495
  ('pk001011', 'si001011', 1, false),  -- Embalming                                     625
  ('pk001011', 'si001012', 1, false),  -- Other Care and Preparation                    445
  ('pk001011', 'si001013', 1, false),  -- Sheltering of Remains                         445
  ('pk001011', 'si001022', 1, false),  -- Transfer of Remains from Place of Death       545
  ('pk001011', 'si001024', 1, false),  -- Flower Vehicle                                295
  ('pk001011', 'si001023', 1, false),  -- Funeral Vehicle (Hearse)                      395
  ('pk001011', 'si001025', 1, true),   -- Limousine (optional)                          395
  ('pk001011', 'si001055', 1, false),  -- Everlasting Memorial®                         490
  ('pk001011', 'si001045', 1, false),  -- Estate Fraud Protection                       135
  ('pk001011', 'si001092', 1, false),  -- Dignity Honour Burial Flowers                 595
  ('pk001011', 'si001050', 1, false),  -- Premium Venue Service                         595
  ('pk001011', 'si001029', 1, true),   -- Family Support: Funeral Webcasting (opt)      295
  ('pk001011', 'si001030', 1, true),   -- Family Support: Legal Service Plan (opt)      295
  ('pk001011', 'si001031', 1, true),   -- Family Support: Sterling Silver Pendant (opt) 295
  ('pk001011', 'si001032', 1, true),   -- Family Support: Memory Portrait (opt)         295
  ('pk001011', 'si001085', 1, true),   -- Family Support: Retractable Table Banner (opt)295
  ('pk001011', 'si001086', 1, true),   -- Family Support: Timeless Touch Fingerprint(opt)295
  ('pk001011', 'si001087', 1, true),   -- Family Support: Medallion Bundle (opt)        295
  ('pk001011', 'si001097', 1, false),  -- Catered Receptions II                        1795
  ('pk001011', 'si001099', 1, false);  -- Commemorative Collection                      495

-- ── Tribute Funeral Service (pk001012) ───────────────────────────────────────
-- $14,729 total | mandatory $9,545 + limousine $395 + 1 family support $295
-- + casket (csk001 Merlot $4,099) – discount $435 = $14,294 net
insert into package_items (package_id, service_item_id, quantity, is_optional) values
  ('pk001012', 'si001001', 1, false),  -- Professional Services Fees for Full Service  3590
  ('pk001012', 'si001010', 1, false),  -- Registration and Documentation                495
  ('pk001012', 'si001011', 1, false),  -- Embalming                                     625
  ('pk001012', 'si001012', 1, false),  -- Other Care and Preparation                    445
  ('pk001012', 'si001013', 1, false),  -- Sheltering of Remains                         445
  ('pk001012', 'si001022', 1, false),  -- Transfer of Remains from Place of Death       545
  ('pk001012', 'si001024', 1, false),  -- Flower Vehicle                                295
  ('pk001012', 'si001023', 1, false),  -- Funeral Vehicle (Hearse)                      395
  ('pk001012', 'si001025', 1, true),   -- Limousine (optional)                          395
  ('pk001012', 'si001055', 1, false),  -- Everlasting Memorial®                         490
  ('pk001012', 'si001045', 1, false),  -- Estate Fraud Protection                       135
  ('pk001012', 'si001093', 1, false),  -- Dignity Tribute Burial Flowers                495
  ('pk001012', 'si001050', 1, false),  -- Premium Venue Service                         595
  ('pk001012', 'si001029', 1, true),   -- Family Support: Funeral Webcasting (opt)      295
  ('pk001012', 'si001030', 1, true),   -- Family Support: Legal Service Plan (opt)      295
  ('pk001012', 'si001031', 1, true),   -- Family Support: Sterling Silver Pendant (opt) 295
  ('pk001012', 'si001032', 1, true),   -- Family Support: Memory Portrait (opt)         295
  ('pk001012', 'si001085', 1, true),   -- Family Support: Retractable Table Banner (opt)295
  ('pk001012', 'si001086', 1, true),   -- Family Support: Timeless Touch Fingerprint(opt)295
  ('pk001012', 'si001087', 1, true),   -- Family Support: Medallion Bundle (opt)        295
  ('pk001012', 'si001096', 1, false),  -- Catered Receptions I                          995
  ('pk001012', 'si001101', 1, false);  -- Remembrance Collection                        395

-- ── Jade Burial Plan (pk001013) ──────────────────────────────────────────────
-- $18,239 total | mandatory $10,160 + limousine $395 + 2 family support $590
-- + casket (csk015 Prominence $6,499) – discount $505 = $17,734 net
-- NOTE: select 2 Family Support Options from the list below
insert into package_items (package_id, service_item_id, quantity, is_optional) values
  ('pk001013', 'si001001', 1, false),  -- Professional Services Fees for Full Service  3590
  ('pk001013', 'si001010', 1, false),  -- Registration and Documentation                495
  ('pk001013', 'si001011', 1, false),  -- Embalming                                     625
  ('pk001013', 'si001012', 1, false),  -- Other Care and Preparation                    445
  ('pk001013', 'si001013', 1, false),  -- Sheltering of Remains                         445
  ('pk001013', 'si001022', 1, false),  -- Transfer of Remains from Place of Death       545
  ('pk001013', 'si001024', 1, false),  -- Flower Vehicle                                295
  ('pk001013', 'si001023', 1, false),  -- Funeral Vehicle (Hearse)                      395
  ('pk001013', 'si001025', 1, true),   -- Limousine (optional)                          395
  ('pk001013', 'si001045', 1, false),  -- Estate Fraud Protection                       135
  ('pk001013', 'si001091', 1, false),  -- Dignity Heritage Burial Flowers               695
  ('pk001013', 'si001050', 1, false),  -- Premium Venue Service                         595
  ('pk001013', 'si001029', 1, true),   -- Family Support: Funeral Webcasting (opt, sel 2) 295
  ('pk001013', 'si001030', 1, true),   -- Family Support: Legal Service Plan (opt)        295
  ('pk001013', 'si001031', 1, true),   -- Family Support: Sterling Silver Pendant (opt)   295
  ('pk001013', 'si001032', 1, true),   -- Family Support: Memory Portrait (opt)           295
  ('pk001013', 'si001085', 1, true),   -- Family Support: Retractable Table Banner (opt)  295
  ('pk001013', 'si001086', 1, true),   -- Family Support: Timeless Touch Fingerprint(opt) 295
  ('pk001013', 'si001087', 1, true),   -- Family Support: Medallion Bundle (opt)          295
  ('pk001013', 'si001098', 1, false);  -- Catered Receptions III                        2495

-- ── Heritage Cremation Service (pk001014) ────────────────────────────────────
-- $16,424 total | mandatory $12,840 + limousine $395 + 1 family support $295
-- + urn (si001113 Heritage Tier $1,295) + casket (cont001 Brockton Oak $1,599)
-- – discount $465 = $15,959 net
insert into package_items (package_id, service_item_id, quantity, is_optional) values
  ('pk001014', 'si001001', 1, false),  -- Professional Services Fees for Full Service  3590
  ('pk001014', 'si001010', 1, false),  -- Registration and Documentation                495
  ('pk001014', 'si001011', 1, false),  -- Embalming                                     625
  ('pk001014', 'si001012', 1, false),  -- Other Care and Preparation                    445
  ('pk001014', 'si001013', 1, false),  -- Sheltering of Remains                         445
  ('pk001014', 'si001022', 1, false),  -- Transfer of Remains from Place of Death       545
  ('pk001014', 'si001024', 1, false),  -- Flower Vehicle                                295
  ('pk001014', 'si001023', 1, false),  -- Funeral Vehicle (Hearse)                      395
  ('pk001014', 'si001025', 1, true),   -- Limousine (optional)                          395
  ('pk001014', 'si001055', 1, false),  -- Everlasting Memorial®                         490
  ('pk001014', 'si001045', 1, false),  -- Estate Fraud Protection                       135
  ('pk001014', 'si001094', 1, false),  -- Dignity Heritage Cremation Flowers            500
  ('pk001014', 'si001036', 1, false),  -- Crematory Fee                                 995
  ('pk001014', 'si001050', 1, false),  -- Premium Venue Service                         595
  ('pk001014', 'si001029', 1, true),   -- Family Support: Funeral Webcasting (opt)      295
  ('pk001014', 'si001030', 1, true),   -- Family Support: Legal Service Plan (opt)      295
  ('pk001014', 'si001031', 1, true),   -- Family Support: Sterling Silver Pendant (opt) 295
  ('pk001014', 'si001032', 1, true),   -- Family Support: Memory Portrait (opt)         295
  ('pk001014', 'si001085', 1, true),   -- Family Support: Retractable Table Banner (opt)295
  ('pk001014', 'si001086', 1, true),   -- Family Support: Timeless Touch Fingerprint(opt)295
  ('pk001014', 'si001087', 1, true),   -- Family Support: Medallion Bundle (opt)        295
  ('pk001014', 'si001113', 1, true),   -- Memorial Urn Selection — Heritage Tier (opt) 1295
  ('pk001014', 'si001098', 1, false),  -- Catered Receptions III                       2495
  ('pk001014', 'si001100', 1, false);  -- Esteemed Collection                           795

-- ── Honour Cremation Service (pk001015) ──────────────────────────────────────
-- $12,510 total | mandatory $10,570 + 1 family support $295
-- + urn (si001114 Honour Tier $795) + casket (csk071 Burlington $850)
-- – discount $360 = $12,150 net
insert into package_items (package_id, service_item_id, quantity, is_optional) values
  ('pk001015', 'si001002', 1, false),  -- Professional Services Fees for Memorial Service 3440
  ('pk001015', 'si001010', 1, false),  -- Registration and Documentation                   495
  ('pk001015', 'si001012', 1, false),  -- Other Care and Preparation                       445
  ('pk001015', 'si001013', 1, false),  -- Sheltering of Remains                            445
  ('pk001015', 'si001022', 1, false),  -- Transfer of Remains from Place of Death          545
  ('pk001015', 'si001024', 1, false),  -- Flower Vehicle                                   295
  ('pk001015', 'si001055', 1, false),  -- Everlasting Memorial®                            490
  ('pk001015', 'si001045', 1, false),  -- Estate Fraud Protection                          135
  ('pk001015', 'si001095', 1, false),  -- Dignity Honour Cremation Flowers                 400
  ('pk001015', 'si001036', 1, false),  -- Crematory Fee                                    995
  ('pk001015', 'si001050', 1, false),  -- Premium Venue Service                            595
  ('pk001015', 'si001029', 1, true),   -- Family Support: Funeral Webcasting (opt)         295
  ('pk001015', 'si001030', 1, true),   -- Family Support: Legal Service Plan (opt)         295
  ('pk001015', 'si001031', 1, true),   -- Family Support: Sterling Silver Pendant (opt)    295
  ('pk001015', 'si001032', 1, true),   -- Family Support: Memory Portrait (opt)            295
  ('pk001015', 'si001085', 1, true),   -- Family Support: Retractable Table Banner (opt)   295
  ('pk001015', 'si001086', 1, true),   -- Family Support: Timeless Touch Fingerprint (opt) 295
  ('pk001015', 'si001087', 1, true),   -- Family Support: Medallion Bundle (opt)           295
  ('pk001015', 'si001114', 1, true),   -- Memorial Urn Selection — Honour Tier (opt)       795
  ('pk001015', 'si001097', 1, false),  -- Catered Receptions II                           1795
  ('pk001015', 'si001099', 1, false);  -- Commemorative Collection                         495

-- ── Tribute Cremation Service (pk001016) ─────────────────────────────────────
-- $7,640 total | mandatory $5,900 + 1 family support $295
-- + urn (si001115 Tribute Tier $595) + casket (csk071 Burlington $850)
-- – discount $50 = $7,590 net
insert into package_items (package_id, service_item_id, quantity, is_optional) values
  ('pk001016', 'si001005', 1, false),  -- Professional Services Fees for Urn Committal  2840
  ('pk001016', 'si001010', 1, false),  -- Registration and Documentation                  495
  ('pk001016', 'si001012', 1, false),  -- Other Care and Preparation                      445
  ('pk001016', 'si001013', 1, false),  -- Sheltering of Remains                           445
  ('pk001016', 'si001022', 1, false),  -- Transfer of Remains from Place of Death         545
  ('pk001016', 'si001045', 1, false),  -- Estate Fraud Protection                         135
  ('pk001016', 'si001036', 1, false),  -- Crematory Fee                                   995
  ('pk001016', 'si001029', 1, true),   -- Family Support: Funeral Webcasting (opt)        295
  ('pk001016', 'si001030', 1, true),   -- Family Support: Legal Service Plan (opt)        295
  ('pk001016', 'si001031', 1, true),   -- Family Support: Sterling Silver Pendant (opt)   295
  ('pk001016', 'si001032', 1, true),   -- Family Support: Memory Portrait (opt)           295
  ('pk001016', 'si001085', 1, true),   -- Family Support: Retractable Table Banner (opt)  295
  ('pk001016', 'si001086', 1, true),   -- Family Support: Timeless Touch Fingerprint(opt) 295
  ('pk001016', 'si001087', 1, true),   -- Family Support: Medallion Bundle (opt)          295
  ('pk001016', 'si001115', 1, true);   -- Memorial Urn Selection — Tribute Tier (opt)     595

-- ── Jade Cremation Plan (pk001017) ───────────────────────────────────────────
-- $14,680 total | mandatory $11,750 + limousine $395 + 2 family support $590
-- + urn (si001116 Jade Tier $895) + casket (csk053 McConnell $1,050)
-- – discount $405 = $14,275 net
-- NOTE: select 2 Family Support Options from the list below
insert into package_items (package_id, service_item_id, quantity, is_optional) values
  ('pk001017', 'si001001', 1, false),  -- Professional Services Fees for Full Service  3590
  ('pk001017', 'si001010', 1, false),  -- Registration and Documentation                495
  ('pk001017', 'si001011', 1, false),  -- Embalming                                     625
  ('pk001017', 'si001012', 1, false),  -- Other Care and Preparation                    445
  ('pk001017', 'si001013', 1, false),  -- Sheltering of Remains                         445
  ('pk001017', 'si001022', 1, false),  -- Transfer of Remains from Place of Death       545
  ('pk001017', 'si001024', 1, false),  -- Flower Vehicle                                295
  ('pk001017', 'si001023', 1, false),  -- Funeral Vehicle (Hearse)                      395
  ('pk001017', 'si001025', 1, true),   -- Limousine (optional)                          395
  ('pk001017', 'si001045', 1, false),  -- Estate Fraud Protection                       135
  ('pk001017', 'si001091', 1, false),  -- Dignity Heritage Burial Flowers               695
  ('pk001017', 'si001036', 1, false),  -- Crematory Fee                                 995
  ('pk001017', 'si001050', 1, false),  -- Premium Venue Service                         595
  ('pk001017', 'si001029', 1, true),   -- Family Support: Funeral Webcasting (opt, sel 2) 295
  ('pk001017', 'si001030', 1, true),   -- Family Support: Legal Service Plan (opt)        295
  ('pk001017', 'si001031', 1, true),   -- Family Support: Sterling Silver Pendant (opt)   295
  ('pk001017', 'si001032', 1, true),   -- Family Support: Memory Portrait (opt)           295
  ('pk001017', 'si001085', 1, true),   -- Family Support: Retractable Table Banner (opt)  295
  ('pk001017', 'si001086', 1, true),   -- Family Support: Timeless Touch Fingerprint(opt) 295
  ('pk001017', 'si001087', 1, true),   -- Family Support: Medallion Bundle (opt)          295
  ('pk001017', 'si001116', 1, true),   -- Memorial Urn Selection — Jade Tier (opt)        895
  ('pk001017', 'si001098', 1, false);  -- Catered Receptions III                        2495
