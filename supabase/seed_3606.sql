-- ─────────────────────────────────────────────────────────────────────────────
-- SEED — Mount Pleasant Universal Funeral Home (ID: 3606)
-- ─────────────────────────────────────────────────────────────────────────────

-- ─── Funeral Home ─────────────────────────────────────────────────────────────

insert into funeral_homes (id, name, address, phone, website, tax_rate) values
  ('3606', 'Mount Pleasant Universal Funeral Home', '306 East 11th Ave, Vancouver, BC V5T 2C6', '604-876-2161', 'www.mountpleasantfuneral.com', 0.05)
  on conflict (id) do nothing;

-- ─── Service Items ────────────────────────────────────────────────────────────
-- IDs start at si001001 to avoid collision with Victory Memorial (si000xxx)

insert into service_items (id, funeral_home_id, category_id, name, description, price, price_min, price_max, is_cash_advance, sort_order) values

  -- Professional Staff & Services
  ('si001001', '3606', 'c1000000-0000-0000-0000-000000000001', 'Professional Services Fees for Full Service',               NULL, 3590.00, NULL, NULL, false, 1),
  ('si001002', '3606', 'c1000000-0000-0000-0000-000000000001', 'Professional Services Fees for Memorial Service',           NULL, 3590.00, NULL, NULL, false, 2),
  ('si001003', '3606', 'c1000000-0000-0000-0000-000000000001', 'Professional Services Fees for Graveside Service',          NULL, 3590.00, NULL, NULL, false, 3),
  ('si001004', '3606', 'c1000000-0000-0000-0000-000000000001', 'Professional Services Fees for Gathering Celebrations',     NULL, 3590.00, NULL, NULL, false, 4),
  ('si001005', '3606', 'c1000000-0000-0000-0000-000000000001', 'Professional Services Fees for Urn Committal',              NULL, 2695.00, NULL, NULL, false, 5),
  ('si001006', '3606', 'c1000000-0000-0000-0000-000000000001', 'Basic Service Fees for No Service Option',                  NULL, 1495.00, NULL, NULL, false, 6),
  ('si001007', '3606', 'c1000000-0000-0000-0000-000000000001', 'Basic Professional Service Fee when Forwarding Remains',    NULL, 3590.00, NULL, NULL, false, 7),
  ('si001008', '3606', 'c1000000-0000-0000-0000-000000000001', 'Basic Professional Service Fees when Receiving Remains',    NULL, 3590.00, NULL, NULL, false, 8),
  ('si001009', '3606', 'c1000000-0000-0000-0000-000000000001', 'Supervision of Disinterment',                               NULL, 3595.00, NULL, NULL, false, 9),
  ('si001010', '3606', 'c1000000-0000-0000-0000-000000000001', 'Registration and Documentation',                            'Completion and filing of all documents necessary to carry out services.',  445.00, NULL, NULL, false, 10),
  ('si001011', '3606', 'c1000000-0000-0000-0000-000000000001', 'Embalming',                                                 'Sanitation, restoration and temporary preservation of remains.',            625.00, NULL, NULL, false, 11),
  ('si001012', '3606', 'c1000000-0000-0000-0000-000000000001', 'Other Care and Preparation',                                NULL, 395.00, NULL, NULL, false, 12),
  ('si001013', '3606', 'c1000000-0000-0000-0000-000000000001', 'Sheltering of Remains',                                     NULL, 395.00, NULL, NULL, false, 13),

  -- Facilities and Supervision
  ('si001014', '3606', 'c1000000-0000-0000-0000-000000000002', 'Use of Facilities for Embalming and Preparation',           NULL, 395.00, NULL, NULL, false, 1),
  ('si001015', '3606', 'c1000000-0000-0000-0000-000000000002', 'Facilities for Visitation',                                 NULL, 595.00, NULL, NULL, false, 2),
  ('si001016', '3606', 'c1000000-0000-0000-0000-000000000002', 'Use of Facilities for Visitation – Second Day',             NULL, 595.00, NULL, NULL, false, 3),
  ('si001017', '3606', 'c1000000-0000-0000-0000-000000000002', 'Supervision of Funeral Service',                            NULL, 795.00, NULL, NULL, false, 4),
  ('si001018', '3606', 'c1000000-0000-0000-0000-000000000002', 'Supervision of Memorial Service',                           NULL, 795.00, NULL, NULL, false, 5),
  ('si001019', '3606', 'c1000000-0000-0000-0000-000000000002', 'Facilities for Funeral Ceremony',                           NULL, 795.00, NULL, NULL, false, 6),
  ('si001020', '3606', 'c1000000-0000-0000-0000-000000000002', 'Facilities for Memorial Service',                           NULL, 795.00, NULL, NULL, false, 7),
  ('si001021', '3606', 'c1000000-0000-0000-0000-000000000002', 'Supervision of Off-Site Venue',                             NULL, 595.00, NULL, NULL, false, 8),

  -- Transportation
  ('si001022', '3606', 'c1000000-0000-0000-0000-000000000003', 'Transfer of Remains from Place of Death',                   'Within 50 km radius. Additional distance charged at $2.00/km.',             545.00, NULL, NULL, false, 1),
  ('si001023', '3606', 'c1000000-0000-0000-0000-000000000003', 'Funeral Vehicle (Hearse)',                                  'Within 50 km radius. Additional distance charged at $2.00/km.',             395.00, NULL, NULL, false, 2),
  ('si001024', '3606', 'c1000000-0000-0000-0000-000000000003', 'Flower Vehicle',                                            'Within 50 km radius. Additional distance charged at $2.00/km.',             295.00, NULL, NULL, false, 3),
  ('si001025', '3606', 'c1000000-0000-0000-0000-000000000003', 'Limousine',                                                 'Within 50 km radius. Additional distance charged at $2.00/km.',             395.00, NULL, NULL, false, 4),
  ('si001026', '3606', 'c1000000-0000-0000-0000-000000000003', 'Service Vehicle',                                           'Within 50 km radius. Additional distance charged at $2.00/km.',             395.00, NULL, NULL, false, 5),
  ('si001027', '3606', 'c1000000-0000-0000-0000-000000000003', 'Transfer to or from Airport',                               'Within 50 km radius. Additional distance charged at $2.00/km.',             545.00, NULL, NULL, false, 6),
  ('si001028', '3606', 'c1000000-0000-0000-0000-000000000003', 'Additional Hours – Transportation',                         'After 4 hours, limited to 8 hours total usage.',                            150.00, NULL, NULL, false, 7),

  -- Family Support Options
  ('si001029', '3606', 'c1000000-0000-0000-0000-000000000004', 'Funeral Webcasting',                                        'Broadcast live online; recording accessible for 90 days.',                  295.00, NULL, NULL, false, 1),
  ('si001030', '3606', 'c1000000-0000-0000-0000-000000000004', 'Legal Service Plan',                                        'Unlimited 24/7 telephone consultations with estate lawyers for 12 months.', 295.00, NULL, NULL, false, 2),
  ('si001031', '3606', 'c1000000-0000-0000-0000-000000000004', 'Sterling Silver Oval Pendant',                              '.925 sterling silver oval pendant with thumbprint on curb style chain.',     295.00, NULL, NULL, false, 3),
  ('si001032', '3606', 'c1000000-0000-0000-0000-000000000004', 'Memory Portrait',                                           'Favourite photograph reproduced on canvas in oil painting style.',           295.00, NULL, NULL, false, 4),
  ('si001033', '3606', 'c1000000-0000-0000-0000-000000000004', 'Treasure Kits',                                             NULL, 295.00, NULL, NULL, false, 5),
  ('si001034', '3606', 'c1000000-0000-0000-0000-000000000004', 'Family Estate Manager',                                     'Step-by-step tool to simplify estate settlement decisions.',                 295.00, NULL, NULL, false, 6),
  ('si001035', '3606', 'c1000000-0000-0000-0000-000000000004', 'Cremation Jewellery Bundle',                                'Matching pendant and chain, charm and earrings.',                            295.00, NULL, NULL, false, 7),

  -- Miscellaneous Services & Merchandise
  ('si001036', '3606', 'c1000000-0000-0000-0000-000000000005', 'Crematory Fee',                                             NULL, 795.00, NULL, NULL, false, 1),
  ('si001037', '3606', 'c1000000-0000-0000-0000-000000000005', 'Cremation Expediting Fee',                                  NULL, 695.00, NULL, NULL, false, 2),
  ('si001038', '3606', 'c1000000-0000-0000-0000-000000000005', 'Cremation Witnessing Fee',                                  NULL, 695.00, NULL, NULL, false, 3),
  ('si001039', '3606', 'c1000000-0000-0000-0000-000000000005', 'Witness of Ashes Transfer',                                 'Fee to witness transfer of ashes from one container to another.',            695.00, NULL, NULL, false, 4),
  ('si001040', '3606', 'c1000000-0000-0000-0000-000000000005', 'Scattering of Ashes at Sea',                                NULL, 500.00, NULL, NULL, false, 5),
  ('si001041', '3606', 'c1000000-0000-0000-0000-000000000005', 'Handling and Transfer of Ashes',                            NULL, 195.00, NULL, NULL, false, 6),
  ('si001042', '3606', 'c1000000-0000-0000-0000-000000000005', 'Shipping of Ashes Domestic',                                NULL, 195.00, NULL, NULL, false, 7),
  ('si001043', '3606', 'c1000000-0000-0000-0000-000000000005', 'Shipping of Ashes International',                           NULL, 395.00, NULL, NULL, false, 8),
  ('si001044', '3606', 'c1000000-0000-0000-0000-000000000005', 'Special Care for Autopsied Cases',                          NULL, 220.00, NULL, NULL, false, 9),
  ('si001045', '3606', 'c1000000-0000-0000-0000-000000000005', 'Estate Fraud Protection',                                   'Fraud specialists notify credit agencies to protect the estate.',            135.00, NULL, NULL, false, 10),
  ('si001046', '3606', 'c1000000-0000-0000-0000-000000000005', 'Private Family Moment',                                     'Private time at our facility for a limited time with limited family.',       495.00, NULL, NULL, false, 11),
  ('si001047', '3606', 'c1000000-0000-0000-0000-000000000005', 'Reception Room',                                            NULL, 400.00, NULL, NULL, false, 12),
  ('si001048', '3606', 'c1000000-0000-0000-0000-000000000005', 'Basic Venue Service',                                       NULL, 395.00, NULL, NULL, false, 13),
  ('si001049', '3606', 'c1000000-0000-0000-0000-000000000005', 'Standard Venue Service',                                    NULL, 495.00, NULL, NULL, false, 14),
  ('si001050', '3606', 'c1000000-0000-0000-0000-000000000005', 'Premium Venue Service',                                     NULL, 595.00, NULL, NULL, false, 15),
  ('si001051', '3606', 'c1000000-0000-0000-0000-000000000005', 'Signature Exclusive Venue',                                 NULL, 4550.00, NULL, NULL, false, 16),
  ('si001052', '3606', 'c1000000-0000-0000-0000-000000000005', 'Dignity Celebrant',                                         'Certified officiant for the service.',                                       395.00, NULL, NULL, false, 17),
  ('si001053', '3606', 'c1000000-0000-0000-0000-000000000005', 'External Celebrant',                                        'Officiant for the service.',                                                  NULL, NULL, NULL, false, 18),
  ('si001054', '3606', 'c1000000-0000-0000-0000-000000000005', 'Tribute Movie',                                             'Treasured photos set to music, viewable at DignityMemorial.com.',            30.00, NULL, NULL, false, 19),
  ('si001055', '3606', 'c1000000-0000-0000-0000-000000000005', 'Everlasting Memorial',                                      'Life story published to DignityMemorial.com with keepsakes.',               449.00, NULL, NULL, false, 20),
  ('si001056', '3606', 'c1000000-0000-0000-0000-000000000005', 'A Life Remembered Book (Soft Cover)',                        'Biography, photos and guestbook messages.',                                   35.00, NULL, NULL, false, 21),
  ('si001057', '3606', 'c1000000-0000-0000-0000-000000000005', 'A Life Remembered Book (Hardcover)',                         'Biography, photos and guestbook messages in hardcover.',                      50.00, NULL, NULL, false, 22),
  ('si001058', '3606', 'c1000000-0000-0000-0000-000000000005', 'Sheltering of Remains – Per Day',                           NULL, 25.00, NULL, NULL, false, 23),
  ('si001059', '3606', 'c1000000-0000-0000-0000-000000000005', 'Additional Charge – Saturday Service',                      NULL, 500.00, NULL, NULL, false, 24),
  ('si001060', '3606', 'c1000000-0000-0000-0000-000000000005', 'Additional Charge – Sunday Service',                        NULL, 1000.00, NULL, NULL, false, 25),
  ('si001061', '3606', 'c1000000-0000-0000-0000-000000000005', 'Additional Charge – Holiday Service',                       NULL, 1000.00, NULL, NULL, false, 26),
  ('si001062', '3606', 'c1000000-0000-0000-0000-000000000005', 'Air Tray',                                                  'Outer shell for shipping of casket.',                                        399.00, NULL, NULL, false, 27),
  ('si001063', '3606', 'c1000000-0000-0000-0000-000000000005', 'Shipping Container',                                        NULL, 399.00, NULL, NULL, false, 28),
  ('si001064', '3606', 'c1000000-0000-0000-0000-000000000005', 'Shipping Crate for Calgary Liner',                          'Plywood crate with 6 metal handles.',                                        299.00, NULL, NULL, false, 29),
  ('si001065', '3606', 'c1000000-0000-0000-0000-000000000005', 'Calgary Liner',                                             'Steel liner with lid and seal.',                                             1599.00, NULL, NULL, false, 30),
  ('si001066', '3606', 'c1000000-0000-0000-0000-000000000005', 'Casket Medallions',                                         'Memorial keepsake displayed in specific caskets.',                            NULL, 30.00, 75.00, false, 31),
  ('si001067', '3606', 'c1000000-0000-0000-0000-000000000005', 'Single Small Medallion Case',                               NULL, 45.00, NULL, NULL, false, 32),
  ('si001068', '3606', 'c1000000-0000-0000-0000-000000000005', 'Triple Small Medallion Case',                               NULL, 75.00, NULL, NULL, false, 33),
  ('si001069', '3606', 'c1000000-0000-0000-0000-000000000005', 'Dignity Leather Presentation Box',                          'Protects and stores keepsakes from the service.',                             50.00, NULL, NULL, false, 34),

  -- Stationery
  ('si001070', '3606', 'c1000000-0000-0000-0000-000000000006', 'Elegant Thank You Cards (per 50)',                          NULL, 60.00, NULL, NULL, false, 1),
  ('si001071', '3606', 'c1000000-0000-0000-0000-000000000006', 'Embossed Service Folders (per 100)',                        NULL, 145.00, NULL, NULL, false, 2),
  ('si001072', '3606', 'c1000000-0000-0000-0000-000000000006', 'Themed Prayer Cards (per 100)',                             NULL, 145.00, NULL, NULL, false, 3),
  ('si001073', '3606', 'c1000000-0000-0000-0000-000000000006', 'Themed Service Folders (per 100)',                          NULL, 145.00, NULL, NULL, false, 4),
  ('si001074', '3606', 'c1000000-0000-0000-0000-000000000006', 'Mid-Size Register Book',                                    NULL, 40.00, NULL, NULL, false, 5),
  ('si001075', '3606', 'c1000000-0000-0000-0000-000000000006', 'Oversized Register Book',                                   NULL, 140.00, NULL, NULL, false, 6),
  ('si001076', '3606', 'c1000000-0000-0000-0000-000000000006', 'Personal Collection',                                       'Oversized register book, 50 thank-you cards, 100 service folders, keepsake box.', 395.00, NULL, NULL, false, 7),
  ('si001077', '3606', 'c1000000-0000-0000-0000-000000000006', 'Signature Series',                                          'Mid-size register book, 50 thank-you cards, 100 embossed folders, keepsake box.',  295.00, NULL, NULL, false, 8),

  -- Cash Advances
  ('si001078', '3606', 'c1000000-0000-0000-0000-000000000007', 'Death Certificate (each)',                                  NULL, 27.00, NULL, NULL, true, 1),
  ('si001079', '3606', 'c1000000-0000-0000-0000-000000000007', 'Hostess Fee',                                               NULL, 175.00, NULL, NULL, true, 2),
  ('si001080', '3606', 'c1000000-0000-0000-0000-000000000007', 'CPBC Fee',                                                  NULL, 40.00, NULL, NULL, true, 3),
  ('si001081', '3606', 'c1000000-0000-0000-0000-000000000007', 'Clergy Honorarium',                                         NULL, NULL, NULL, NULL, true, 4),
  ('si001082', '3606', 'c1000000-0000-0000-0000-000000000007', 'Organist',                                                  NULL, NULL, NULL, NULL, true, 5),
  ('si001083', '3606', 'c1000000-0000-0000-0000-000000000007', 'Soloist',                                                   NULL, NULL, NULL, NULL, true, 6);

-- ─── Packages (a la carte / service offerings from GPL) ───────────────────────

insert into packages (id, funeral_home_id, name, pkg_type, total_price, package_discount, default_casket_id, sort_order) values
  ('pk001001', '3606', 'Full Service',              'package',  7810.00, 0, NULL, 1),
  ('pk001002', '3606', 'Service of Remembrance',    'package',  7190.00, 0, NULL, 2),
  ('pk001003', '3606', 'Graveside Service',          'package',  6195.00, 0, NULL, 3),
  ('pk001004', '3606', 'Urn Committal',              'package',  5700.00, 0, NULL, 4),
  ('pk001005', '3606', 'No Service Option',          'package',  4205.00, 0, NULL, 5),
  ('pk001006', '3606', 'Disinterment',               'package',  4780.00, 0, NULL, 6),
  ('pk001007', '3606', 'Forwarding of Remains',      'package',  7665.00, 0, NULL, 7),
  ('pk001008', '3606', 'Receiving of Remains',       'package',  6050.00, 0, NULL, 8);

-- ─── Package Items ────────────────────────────────────────────────────────────

insert into package_items (package_id, service_item_id, quantity) values
  -- Full Service ($7,810)
  ('pk001001', 'si001001', 1), -- Professional Services Fees for Full Service   3590
  ('pk001001', 'si001010', 1), -- Registration and Documentation                 445
  ('pk001001', 'si001011', 1), -- Embalming                                       625
  ('pk001001', 'si001012', 1), -- Other Care and Preparation                      395
  ('pk001001', 'si001013', 1), -- Sheltering of Remains                           395
  ('pk001001', 'si001022', 1), -- Transfer of Remains from Place of Death         545
  ('pk001001', 'si001024', 1), -- Flower Vehicle                                  295
  ('pk001001', 'si001023', 1), -- Funeral Vehicle (Hearse)                        395
  ('pk001001', 'si001025', 1), -- Limousine                                       395
  ('pk001001', 'si001045', 1), -- Estate Fraud Protection                         135
  ('pk001001', 'si001050', 1), -- Premium Venue Service                           595

  -- Service of Remembrance ($7,190)
  ('pk001002', 'si001002', 1), -- Professional Services Fees for Memorial Service 3590
  ('pk001002', 'si001010', 1), -- Registration and Documentation                   445
  ('pk001002', 'si001012', 1), -- Other Care and Preparation                        395
  ('pk001002', 'si001013', 1), -- Sheltering of Remains                             395
  ('pk001002', 'si001022', 1), -- Transfer of Remains                               545
  ('pk001002', 'si001024', 1), -- Flower Vehicle                                    295
  ('pk001002', 'si001045', 1), -- Estate Fraud Protection                           135
  ('pk001002', 'si001036', 1), -- Crematory Fee                                     795
  ('pk001002', 'si001050', 1), -- Premium Venue Service                             595

  -- Graveside Service ($6,195)
  ('pk001003', 'si001003', 1), -- Professional Services Fees for Graveside Service  3590
  ('pk001003', 'si001010', 1), -- Registration and Documentation                     445
  ('pk001003', 'si001012', 1), -- Other Care and Preparation                         395
  ('pk001003', 'si001013', 1), -- Sheltering of Remains                              395
  ('pk001003', 'si001022', 1), -- Transfer of Remains                                545
  ('pk001003', 'si001024', 1), -- Flower Vehicle                                     295
  ('pk001003', 'si001023', 1), -- Funeral Vehicle (Hearse)                           395
  ('pk001003', 'si001045', 1), -- Estate Fraud Protection                            135

  -- Urn Committal ($5,700)
  ('pk001004', 'si001005', 1), -- Professional Services Fees for Urn Committal       2695
  ('pk001004', 'si001010', 1), -- Registration and Documentation                      445
  ('pk001004', 'si001012', 1), -- Other Care and Preparation                          395
  ('pk001004', 'si001013', 1), -- Sheltering of Remains                               395
  ('pk001004', 'si001022', 1), -- Transfer of Remains                                 545
  ('pk001004', 'si001024', 1), -- Flower Vehicle                                      295
  ('pk001004', 'si001045', 1), -- Estate Fraud Protection                             135
  ('pk001004', 'si001036', 1), -- Crematory Fee                                       795

  -- No Service Option ($4,205)
  ('pk001005', 'si001006', 1), -- Basic Service Fees for No Service Option            1495
  ('pk001005', 'si001010', 1), -- Registration and Documentation                       445
  ('pk001005', 'si001012', 1), -- Other Care and Preparation                           395
  ('pk001005', 'si001013', 1), -- Sheltering of Remains                                395
  ('pk001005', 'si001022', 1), -- Transfer of Remains                                  545
  ('pk001005', 'si001045', 1), -- Estate Fraud Protection                              135
  ('pk001005', 'si001036', 1), -- Crematory Fee                                        795

  -- Disinterment ($4,780)
  ('pk001006', 'si001009', 1), -- Supervision of Disinterment                         3595
  ('pk001006', 'si001012', 1), -- Other Care and Preparation                           395
  ('pk001006', 'si001013', 1), -- Sheltering of Remains                                395
  ('pk001006', 'si001026', 1), -- Service Vehicle                                      395

  -- Forwarding of Remains ($7,665)
  ('pk001007', 'si001007', 1), -- Basic Professional Service Fee - Forwarding          3590
  ('pk001007', 'si001010', 1), -- Registration and Documentation                        445
  ('pk001007', 'si001011', 1), -- Embalming                                             625
  ('pk001007', 'si001012', 1), -- Other Care and Preparation                            395
  ('pk001007', 'si001013', 1), -- Sheltering of Remains                                 395
  ('pk001007', 'si001027', 1), -- Transfer to or from Airport                           545
  ('pk001007', 'si001022', 1), -- Transfer of Remains from Place of Death               545
  ('pk001007', 'si001023', 1), -- Funeral Vehicle (Hearse)                              395
  ('pk001007', 'si001045', 1), -- Estate Fraud Protection                               135
  ('pk001007', 'si001050', 1), -- Premium Venue Service                                 595

  -- Receiving of Remains ($6,050)
  ('pk001008', 'si001008', 1), -- Basic Professional Service Fees - Receiving           3590
  ('pk001008', 'si001012', 1), -- Other Care and Preparation                            395
  ('pk001008', 'si001013', 1), -- Sheltering of Remains                                 395
  ('pk001008', 'si001027', 1), -- Transfer to or from Airport                           545
  ('pk001008', 'si001023', 1), -- Funeral Vehicle (Hearse)                              395
  ('pk001008', 'si001045', 1), -- Estate Fraud Protection                               135
  ('pk001008', 'si001050', 1); -- Premium Venue Service                                 595
