-- ─────────────────────────────────────────────────────────────────────────────
-- MIGRATION — Fix GPL pkg_type + add Forest Lawn (3605) PPL packages
-- Run in Supabase SQL Editor
-- ─────────────────────────────────────────────────────────────────────────────

-- ─── 1. Fix GPL service offerings → 'alacarte' ────────────────────────────────
-- Everything from a General Price List (GPL) should be A La Carte.
-- Proper named packages come from the Package Price List (PPL).

UPDATE packages SET pkg_type = 'alacarte'
WHERE id IN (
  -- Mount Pleasant (3606) GPL service offerings
  'pk001001','pk001002','pk001003','pk001004',
  'pk001005','pk001006','pk001007','pk001008',
  -- Forest Lawn (3605) GPL service offerings
  'pk002001','pk002002','pk002003','pk002004','pk002005',
  'pk002006','pk002007','pk002008','pk002009','pk002010'
);

-- ─── 2. New service items needed for PPL packages (3605 only) ─────────────────

insert into service_items (id, funeral_home_id, category_id, name, description, price, price_min, price_max, is_cash_advance, sort_order) values

  -- Facilities (cat 2)
  ('si002092', '3605', 'c1000000-0000-0000-0000-000000000002', 'Reception Room',                           NULL, 495.00, NULL, NULL, false, 3),

  -- Miscellaneous — Package-specific flowers & catering (cat 5)
  ('si002093', '3605', 'c1000000-0000-0000-0000-000000000005', 'Dignity Heritage Burial Flowers',          NULL, 695.00, NULL, NULL, false, 46),
  ('si002094', '3605', 'c1000000-0000-0000-0000-000000000005', 'Dignity Honour Burial Flowers',            NULL, 595.00, NULL, NULL, false, 47),
  ('si002095', '3605', 'c1000000-0000-0000-0000-000000000005', 'Dignity Tribute Burial Flowers',           NULL, 495.00, NULL, NULL, false, 48),
  ('si002096', '3605', 'c1000000-0000-0000-0000-000000000005', 'Dignity Heritage Cremation Flowers',       NULL, 500.00, NULL, NULL, false, 49),
  ('si002097', '3605', 'c1000000-0000-0000-0000-000000000005', 'Dignity Honour Cremation Flowers',         NULL, 400.00, NULL, NULL, false, 50),
  ('si002098', '3605', 'c1000000-0000-0000-0000-000000000005', 'Catered Receptions I',                    NULL, 995.00, NULL, NULL, false, 51),
  ('si002099', '3605', 'c1000000-0000-0000-0000-000000000005', 'Catered Receptions II',                   NULL, 1395.00, NULL, NULL, false, 52),
  ('si002100', '3605', 'c1000000-0000-0000-0000-000000000005', 'Catered Receptions III',                  NULL, 1695.00, NULL, NULL, false, 53),

  -- Family Support Options — package plan placeholders (cat 4)
  ('si002101', '3605', 'c1000000-0000-0000-0000-000000000004', 'Plan Support Option (Select 1)',           'Choose 1 item from the Family Support Options.', 295.00, NULL, NULL, false, 10),
  ('si002102', '3605', 'c1000000-0000-0000-0000-000000000004', 'Plan Support Options (Select 2)',          'Choose 2 items from the Family Support Options.', 590.00, NULL, NULL, false, 11),
  ('si002103', '3605', 'c1000000-0000-0000-0000-000000000004', 'Cremation Plan Support Option (Select 1)', 'Choose 1 item from the Cremation Family Support Options.', 295.00, NULL, NULL, false, 12),
  ('si002104', '3605', 'c1000000-0000-0000-0000-000000000004', 'Cremation Plan Support Options (Select 2)','Choose 2 items from the Cremation Family Support Options.', 590.00, NULL, NULL, false, 13)

on conflict (id) do nothing;

-- ─── 3. PPL Packages (Forest Lawn 3605) ──────────────────────────────────────
-- total_price = sum of service items in package_items (caskets/urns/containers added separately)
-- package_discount = "Package Savings" from the PPL

insert into packages (id, funeral_home_id, name, pkg_type, total_price, package_discount, default_casket_id, sort_order) values
  -- Burial packages
  ('pk002011', '3605', 'Dignity Memorial Heritage Funeral Service', 'package', 13530.00,  585.00, NULL, 11),
  ('pk002012', '3605', 'Dignity Memorial Honour Funeral Service',   'package', 12830.00,  515.00, NULL, 12),
  ('pk002013', '3605', 'Dignity Memorial Tribute Funeral Service',  'package', 12230.00,  475.00, NULL, 13),
  ('pk002014', '3605', 'Dignity Jade Burial Plan',                  'package', 12540.00,  555.00, NULL, 14),
  -- Cremation packages
  ('pk002015', '3605', 'Dignity Memorial Heritage Cremation Service','package', 14330.00,  515.00, NULL, 15),
  ('pk002016', '3605', 'Dignity Memorial Honour Cremation Service',  'package', 12065.00,  415.00, NULL, 16),
  ('pk002017', '3605', 'Dignity Memorial Tribute Cremation Service', 'package',  7195.00,   50.00, NULL, 17),
  ('pk002018', '3605', 'Dignity Jade Cremation Plan',                'package', 13830.00,  460.00, NULL, 18)

on conflict (id) do nothing;

-- ─── 4. Package Items ──────────────────────────────────────────────────────────
-- Caskets, urns, and containers from the PPL are added to quotes separately.
-- Service items totals verified against PPL totals page by page.

insert into package_items (package_id, service_item_id, quantity) values

  -- ── Dignity Memorial Heritage Funeral Service (pk002011) ──────────────────
  -- Service items total: $13,530  |  + Casket $6,499 = $20,029  |  Savings $585  |  With savings $19,444
  ('pk002011', 'si002003', 1), -- Professional Services Fees for Full Service      4,695
  ('pk002011', 'si002012', 1), -- Registration and Documentation                     495
  ('pk002011', 'si002013', 1), -- Embalming                                           625
  ('pk002011', 'si002014', 1), -- Other Care and Preparation                          445
  ('pk002011', 'si002092', 1), -- Reception Room                                      495
  ('pk002011', 'si002016', 1), -- Sheltering of Remains                               445
  ('pk002011', 'si002018', 1), -- Transfer of Remains from Place of Death             545
  ('pk002011', 'si002019', 1), -- Flower Vehicle                                      295
  ('pk002011', 'si002020', 1), -- Funeral Vehicle (Hearse)                            395
  ('pk002011', 'si002021', 1), -- Limousine                                           395
  ('pk002011', 'si002048', 1), -- Everlasting Memorial                                490
  ('pk002011', 'si002033', 1), -- Estate Fraud Protection                             135
  ('pk002011', 'si002093', 1), -- Dignity Heritage Burial Flowers                     695
  ('pk002011', 'si002046', 1), -- Premium Venue                                       595
  ('pk002011', 'si002101', 1), -- Plan Support Option (Select 1)                      295
  ('pk002011', 'si002100', 1), -- Catered Receptions III                            1,695
  ('pk002011', 'si002079', 1), -- Esteemed Collection                                 795

  -- ── Dignity Memorial Honour Funeral Service (pk002012) ────────────────────
  -- Service items total: $12,830  |  + Casket $4,699 = $17,529  |  Savings $515  |  With savings $17,014
  ('pk002012', 'si002003', 1), -- Professional Services Fees for Full Service      4,695
  ('pk002012', 'si002012', 1), -- Registration and Documentation                     495
  ('pk002012', 'si002013', 1), -- Embalming                                           625
  ('pk002012', 'si002014', 1), -- Other Care and Preparation                          445
  ('pk002012', 'si002092', 1), -- Reception Room                                      495
  ('pk002012', 'si002016', 1), -- Sheltering of Remains                               445
  ('pk002012', 'si002018', 1), -- Transfer of Remains from Place of Death             545
  ('pk002012', 'si002019', 1), -- Flower Vehicle                                      295
  ('pk002012', 'si002020', 1), -- Funeral Vehicle (Hearse)                            395
  ('pk002012', 'si002021', 1), -- Limousine                                           395
  ('pk002012', 'si002048', 1), -- Everlasting Memorial                                490
  ('pk002012', 'si002033', 1), -- Estate Fraud Protection                             135
  ('pk002012', 'si002094', 1), -- Dignity Honour Burial Flowers                       595
  ('pk002012', 'si002046', 1), -- Premium Venue                                       595
  ('pk002012', 'si002101', 1), -- Plan Support Option (Select 1)                      295
  ('pk002012', 'si002099', 1), -- Catered Receptions II                             1,395
  ('pk002012', 'si002078', 1), -- Commemorative Collection                            495

  -- ── Dignity Memorial Tribute Funeral Service (pk002013) ───────────────────
  -- Service items total: $12,230  |  + Casket $4,099 = $16,329  |  Savings $475  |  With savings $15,854
  ('pk002013', 'si002003', 1), -- Professional Services Fees for Full Service      4,695
  ('pk002013', 'si002012', 1), -- Registration and Documentation                     495
  ('pk002013', 'si002013', 1), -- Embalming                                           625
  ('pk002013', 'si002014', 1), -- Other Care and Preparation                          445
  ('pk002013', 'si002092', 1), -- Reception Room                                      495
  ('pk002013', 'si002016', 1), -- Sheltering of Remains                               445
  ('pk002013', 'si002018', 1), -- Transfer of Remains from Place of Death             545
  ('pk002013', 'si002019', 1), -- Flower Vehicle                                      295
  ('pk002013', 'si002020', 1), -- Funeral Vehicle (Hearse)                            395
  ('pk002013', 'si002021', 1), -- Limousine                                           395
  ('pk002013', 'si002048', 1), -- Everlasting Memorial                                490
  ('pk002013', 'si002033', 1), -- Estate Fraud Protection                             135
  ('pk002013', 'si002095', 1), -- Dignity Tribute Burial Flowers                      495
  ('pk002013', 'si002046', 1), -- Premium Venue                                       595
  ('pk002013', 'si002101', 1), -- Plan Support Option (Select 1)                      295
  ('pk002013', 'si002098', 1), -- Catered Receptions I                                995
  ('pk002013', 'si002080', 1), -- Remembrance Collection                              395

  -- ── Dignity Jade Burial Plan (pk002014) ───────────────────────────────────
  -- Service items total: $12,540  |  + Casket $6,499 = $19,039  |  Savings $555  |  With savings $18,484
  ('pk002014', 'si002003', 1), -- Professional Services Fees for Full Service      4,695
  ('pk002014', 'si002012', 1), -- Registration and Documentation                     495
  ('pk002014', 'si002013', 1), -- Embalming                                           625
  ('pk002014', 'si002014', 1), -- Other Care and Preparation                          445
  ('pk002014', 'si002092', 1), -- Reception Room                                      495
  ('pk002014', 'si002016', 1), -- Sheltering of Remains                               445
  ('pk002014', 'si002018', 1), -- Transfer of Remains from Place of Death             545
  ('pk002014', 'si002019', 1), -- Flower Vehicle                                      295
  ('pk002014', 'si002020', 1), -- Funeral Vehicle (Hearse)                            395
  ('pk002014', 'si002021', 1), -- Limousine                                           395
  ('pk002014', 'si002033', 1), -- Estate Fraud Protection                             135
  ('pk002014', 'si002093', 1), -- Dignity Heritage Burial Flowers                     695
  ('pk002014', 'si002046', 1), -- Premium Venue                                       595
  ('pk002014', 'si002102', 1), -- Plan Support Options (Select 2)                     590
  ('pk002014', 'si002100', 1), -- Catered Receptions III                            1,695

  -- ── Dignity Memorial Heritage Cremation Service (pk002015) ────────────────
  -- Service items total: $14,330  |  + Urn $1,295 + Container $1,599 = $17,224  |  Savings $515  |  With savings $16,709
  ('pk002015', 'si002003', 1), -- Professional Services Fees for Full Service      4,695
  ('pk002015', 'si002012', 1), -- Registration and Documentation                     495
  ('pk002015', 'si002013', 1), -- Embalming                                           625
  ('pk002015', 'si002014', 1), -- Other Care and Preparation                          445
  ('pk002015', 'si002092', 1), -- Reception Room                                      495
  ('pk002015', 'si002016', 1), -- Sheltering of Remains                               445
  ('pk002015', 'si002018', 1), -- Transfer of Remains from Place of Death             545
  ('pk002015', 'si002019', 1), -- Flower Vehicle                                      295
  ('pk002015', 'si002020', 1), -- Funeral Vehicle (Hearse)                            395
  ('pk002015', 'si002021', 1), -- Limousine                                           395
  ('pk002015', 'si002048', 1), -- Everlasting Memorial                                490
  ('pk002015', 'si002033', 1), -- Estate Fraud Protection                             135
  ('pk002015', 'si002096', 1), -- Dignity Heritage Cremation Flowers                  500
  ('pk002015', 'si002034', 1), -- Crematory Fee                                       995
  ('pk002015', 'si002046', 1), -- Premium Venue                                       595
  ('pk002015', 'si002103', 1), -- Cremation Plan Support Option (Select 1)            295
  ('pk002015', 'si002100', 1), -- Catered Receptions III                            1,695
  ('pk002015', 'si002079', 1), -- Esteemed Collection                                 795

  -- ── Dignity Memorial Honour Cremation Service (pk002016) ──────────────────
  -- Service items total: $12,065  |  + Urn $795 + Container $850 = $13,710  |  Savings $415  |  With savings $13,295
  ('pk002016', 'si002006', 1), -- Professional Services Fees for Memorial Service  4,545
  ('pk002016', 'si002012', 1), -- Registration and Documentation                     495
  ('pk002016', 'si002014', 1), -- Other Care and Preparation                          445
  ('pk002016', 'si002092', 1), -- Reception Room                                      495
  ('pk002016', 'si002016', 1), -- Sheltering of Remains                               445
  ('pk002016', 'si002018', 1), -- Transfer of Remains from Place of Death             545
  ('pk002016', 'si002019', 1), -- Flower Vehicle                                      295
  ('pk002016', 'si002048', 1), -- Everlasting Memorial                                490
  ('pk002016', 'si002033', 1), -- Estate Fraud Protection                             135
  ('pk002016', 'si002097', 1), -- Dignity Honour Cremation Flowers                    400
  ('pk002016', 'si002034', 1), -- Crematory Fee                                       995
  ('pk002016', 'si002046', 1), -- Premium Venue                                       595
  ('pk002016', 'si002103', 1), -- Cremation Plan Support Option (Select 1)            295
  ('pk002016', 'si002099', 1), -- Catered Receptions II                             1,395
  ('pk002016', 'si002078', 1), -- Commemorative Collection                            495

  -- ── Dignity Memorial Tribute Cremation Service (pk002017) ─────────────────
  -- Service items total: $7,195  |  + Urn $595 + Container $850 = $8,640  |  Savings $50  |  With savings $8,590
  ('pk002017', 'si002008', 1), -- Professional Services Fees for Urn Committal     3,840
  ('pk002017', 'si002012', 1), -- Registration and Documentation                     495
  ('pk002017', 'si002014', 1), -- Other Care and Preparation                          445
  ('pk002017', 'si002016', 1), -- Sheltering of Remains                               445
  ('pk002017', 'si002018', 1), -- Transfer of Remains from Place of Death             545
  ('pk002017', 'si002033', 1), -- Estate Fraud Protection                             135
  ('pk002017', 'si002034', 1), -- Crematory Fee                                       995
  ('pk002017', 'si002103', 1), -- Cremation Plan Support Option (Select 1)            295

  -- ── Dignity Jade Cremation Plan (pk002018) ────────────────────────────────
  -- Service items total: $13,830  |  + Urn $895 + Container $1,050 = $15,775  |  Savings $460  |  With savings $15,315
  ('pk002018', 'si002003', 1), -- Professional Services Fees for Full Service      4,695
  ('pk002018', 'si002012', 1), -- Registration and Documentation                     495
  ('pk002018', 'si002013', 1), -- Embalming                                           625
  ('pk002018', 'si002014', 1), -- Other Care and Preparation                          445
  ('pk002018', 'si002092', 1), -- Reception Room                                      495
  ('pk002018', 'si002016', 1), -- Sheltering of Remains                               445
  ('pk002018', 'si002018', 1), -- Transfer of Remains from Place of Death             545
  ('pk002018', 'si002019', 1), -- Flower Vehicle                                      295
  ('pk002018', 'si002020', 1), -- Funeral Vehicle (Hearse)                            395
  ('pk002018', 'si002021', 1), -- Limousine                                           395
  ('pk002018', 'si002033', 1), -- Estate Fraud Protection                             135
  ('pk002018', 'si002093', 1), -- Dignity Heritage Burial Flowers                     695
  ('pk002018', 'si002034', 1), -- Crematory Fee                                       995
  ('pk002018', 'si002046', 1), -- Premium Venue                                       595
  ('pk002018', 'si002104', 1), -- Cremation Plan Support Options (Select 2)           590
  ('pk002018', 'si002100', 1), -- Catered Receptions III                            1,695
  ('pk002018', 'si002029', 1); -- Memory Portrait                                     295

-- ─── 5. Mark optional add-on items within Forest Lawn PPL packages ───────────
-- These are shown as opt-in checkboxes in the casket picker.

update package_items set is_optional = true
where service_item_id in (
  -- Stationery / memorial collections (customer picks style)
  'si002078', 'si002079', 'si002080',
  -- Flowers — burial and cremation (customer picks tier)
  'si002093', 'si002094', 'si002095',
  'si002096', 'si002097',
  -- Catered Receptions (customer picks tier)
  'si002098', 'si002099', 'si002100'
);
