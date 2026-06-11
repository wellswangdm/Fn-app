-- ─────────────────────────────────────────────────────────────────────────────
-- SEED — Forest Lawn Funeral Home (ID: 3605)
-- 3789 Royal Oak Ave, Burnaby, BC V5G 3M1 | 604-299-7720
-- GPL effective April 14, 2026
-- ─────────────────────────────────────────────────────────────────────────────

-- ─── Funeral Home ─────────────────────────────────────────────────────────────

insert into funeral_homes (id, name, address, phone, website) values
  ('3605', 'Forest Lawn Funeral Home', '3789 Royal Oak Ave, Burnaby, BC V5G 3M1', '604-299-7720', 'www.forestlawn-burnaby.com')
  on conflict (id) do nothing;

-- ─── Service Items ────────────────────────────────────────────────────────────
-- IDs start at si002001 to avoid collision with 3606 (si001xxx)

insert into service_items (id, funeral_home_id, category_id, name, description, price, price_min, price_max, is_cash_advance, sort_order) values

  -- ── Professional Staff & Services ──────────────────────────────────────────
  ('si002001', '3605', 'c1000000-0000-0000-0000-000000000001', 'Professional Services Fees for Gathering Celebrations',               NULL,  7195.00, NULL, NULL, false,  1),
  ('si002002', '3605', 'c1000000-0000-0000-0000-000000000001', 'Professional Services Fees for Graveside Service',                    NULL,  4695.00, NULL, NULL, false,  2),
  ('si002003', '3605', 'c1000000-0000-0000-0000-000000000001', 'Professional Services Fees for Full Service',                         NULL,  4695.00, NULL, NULL, false,  3),
  ('si002004', '3605', 'c1000000-0000-0000-0000-000000000001', 'Basic Professional Service Fee when Forwarding Remains',              NULL,  4695.00, NULL, NULL, false,  4),
  ('si002005', '3605', 'c1000000-0000-0000-0000-000000000001', 'Basic Professional Service Fees when Receiving Remains',             NULL,  4695.00, NULL, NULL, false,  5),
  ('si002006', '3605', 'c1000000-0000-0000-0000-000000000001', 'Professional Services Fees for Memorial Service',                    NULL,  4545.00, NULL, NULL, false,  6),
  ('si002007', '3605', 'c1000000-0000-0000-0000-000000000001', 'Professional Service Fees of Funeral Director and Staff for Cremation Witness', NULL, 4545.00, NULL, NULL, false,  7),
  ('si002008', '3605', 'c1000000-0000-0000-0000-000000000001', 'Professional Services Fees for Urn Committal',                       NULL,  3840.00, NULL, NULL, false,  8),
  ('si002009', '3605', 'c1000000-0000-0000-0000-000000000001', 'Supervision of Disinterment',                                        NULL,  3595.00, NULL, NULL, false,  9),
  ('si002010', '3605', 'c1000000-0000-0000-0000-000000000001', 'Basic Service Fees for No Service Option',                           NULL,  2225.00, NULL, NULL, false, 10),
  ('si002011', '3605', 'c1000000-0000-0000-0000-000000000001', 'Limited Funeral Director and Staff Services',                        NULL,  2225.00, NULL, NULL, false, 11),
  ('si002012', '3605', 'c1000000-0000-0000-0000-000000000001', 'Registration and Documentation',                                     'Completion and filing of all documents including death registration, burial or cremation permit, coroner''s certificate.', 495.00, NULL, NULL, false, 12),
  ('si002013', '3605', 'c1000000-0000-0000-0000-000000000001', 'Embalming',                                                          'Sanitation, restoration and temporary preservation; includes autopsy embalming and restorative practices.', 625.00, NULL, NULL, false, 13),
  ('si002014', '3605', 'c1000000-0000-0000-0000-000000000001', 'Other Care and Preparation',                                         'Dignified and respectful preparation including dressing, handling of communicable illness, trauma or autopsy cases; removal of pacemaker or radioactive implant.', 445.00, NULL, NULL, false, 14),

  -- ── Facilities and Supervision ─────────────────────────────────────────────
  ('si002015', '3605', 'c1000000-0000-0000-0000-000000000002', 'Use of Facilities for Embalming and Preparation',                   'Facilities used to prepare, embalm and shelter the body.',  445.00, NULL, NULL, false, 1),
  ('si002016', '3605', 'c1000000-0000-0000-0000-000000000002', 'Sheltering of Remains',                                             NULL,  445.00, NULL, NULL, false, 2),

  -- ── Transportation ─────────────────────────────────────────────────────────
  ('si002017', '3605', 'c1000000-0000-0000-0000-000000000003', 'Transfer to or from Airport',                                       'Within 50 km radius. Additional distance charged at $2.00/km.',  545.00, NULL, NULL, false, 1),
  ('si002018', '3605', 'c1000000-0000-0000-0000-000000000003', 'Transfer of Remains from Place of Death to Funeral Home',           'Within 50 km radius. Additional distance charged at $2.00/km.',  545.00, NULL, NULL, false, 2),
  ('si002019', '3605', 'c1000000-0000-0000-0000-000000000003', 'Flower Vehicle',                                                    'Within 50 km radius. Additional distance charged at $2.00/km.',  295.00, NULL, NULL, false, 3),
  ('si002020', '3605', 'c1000000-0000-0000-0000-000000000003', 'Funeral Vehicle (Hearse)',                                          'Within 50 km radius. Additional distance charged at $2.00/km.',  395.00, NULL, NULL, false, 4),
  ('si002021', '3605', 'c1000000-0000-0000-0000-000000000003', 'Limousine',                                                         'Within 50 km radius. Additional distance charged at $2.00/km.',  395.00, NULL, NULL, false, 5),
  ('si002022', '3605', 'c1000000-0000-0000-0000-000000000003', 'Service Vehicle',                                                   'Within 50 km radius. Additional distance charged at $2.00/km.',  395.00, NULL, NULL, false, 6),
  ('si002023', '3605', 'c1000000-0000-0000-0000-000000000003', 'Additional Hours – Transportation',                                 'After 4 hours, limited to 8 hours total usage.',                 150.00, NULL, NULL, false, 7),

  -- ── Family Support Options ─────────────────────────────────────────────────
  ('si002024', '3605', 'c1000000-0000-0000-0000-000000000004', 'Retractable Table Banner',                                          'Showcases up to 4 pictures of your loved one with personalized design; option to generate a QR code.', 295.00, NULL, NULL, false, 1),
  ('si002025', '3605', 'c1000000-0000-0000-0000-000000000004', 'Timeless Touch Fingerprint Selection',                              NULL,  295.00, NULL, NULL, false, 2),
  ('si002026', '3605', 'c1000000-0000-0000-0000-000000000004', 'Medallion Bundle',                                                  NULL,  295.00, NULL, NULL, false, 3),
  ('si002027', '3605', 'c1000000-0000-0000-0000-000000000004', 'Funeral Webcasting',                                                'Broadcast live online; recording accessible to friends and family for 90 days following the service.', 295.00, NULL, NULL, false, 4),
  ('si002028', '3605', 'c1000000-0000-0000-0000-000000000004', 'Legal Service Plan',                                                'Unlimited 24/7 telephone consultations with estate lawyers; 12-month membership following the death.', 295.00, NULL, NULL, false, 5),
  ('si002029', '3605', 'c1000000-0000-0000-0000-000000000004', 'Memory Portrait',                                                   'Favourite photograph reproduced on canvas in oil painting style; three frame choices — Elegance, Contemporary or Classic.', 295.00, NULL, NULL, false, 6),
  ('si002030', '3605', 'c1000000-0000-0000-0000-000000000004', 'Treasure Kits',                                                     'Choice of blanket or collection of joss paper and other paper products to help fulfill the tradition of paying respect and homage to ancestors.', 295.00, NULL, NULL, false, 7),
  ('si002031', '3605', 'c1000000-0000-0000-0000-000000000004', 'Chinese Funeral Custom Items',                                      NULL,  590.00, NULL, NULL, false, 8),
  ('si002032', '3605', 'c1000000-0000-0000-0000-000000000004', 'Family Estate Manager',                                             'Step-by-step tool to simplify estate settlement; immediate access to legal professionals, notify interested parties, maximize estate value.', 295.00, NULL, NULL, false, 9),

  -- ── Miscellaneous Services & Merchandise ───────────────────────────────────
  ('si002033', '3605', 'c1000000-0000-0000-0000-000000000005', 'Estate Fraud Protection',                                           'Fraud specialists notify credit reporting agencies to help protect your loved one''s estate from security breaches.', 135.00, NULL, NULL, false,  1),
  ('si002034', '3605', 'c1000000-0000-0000-0000-000000000005', 'Crematory Fee',                                                     NULL,  995.00, NULL, NULL, false,  2),
  ('si002035', '3605', 'c1000000-0000-0000-0000-000000000005', 'Cremation Expediting Fee',                                          NULL,  695.00, NULL, NULL, false,  3),
  ('si002036', '3605', 'c1000000-0000-0000-0000-000000000005', 'Cremation Witnessing Fee',                                          NULL,  695.00, NULL, NULL, false,  4),
  ('si002037', '3605', 'c1000000-0000-0000-0000-000000000005', 'Witness of Ashes Transfer',                                         'Fee to witness transfer of ashes from a container or urn to another container or urn.', 695.00, NULL, NULL, false,  5),
  ('si002038', '3605', 'c1000000-0000-0000-0000-000000000005', 'Scattering of Ashes at Sea',                                        NULL,  500.00, NULL, NULL, false,  6),
  ('si002039', '3605', 'c1000000-0000-0000-0000-000000000005', 'Handling and Transfer of Ashes',                                    NULL,  195.00, NULL, NULL, false,  7),
  ('si002040', '3605', 'c1000000-0000-0000-0000-000000000005', 'Shipping of Ashes Domestic',                                        NULL,  195.00, NULL, NULL, false,  8),
  ('si002041', '3605', 'c1000000-0000-0000-0000-000000000005', 'Shipping of Ashes International',                                   'Obtaining necessary paperwork and preparing ashes for shipment. Courier, postal and air charges are additional.', 395.00, NULL, NULL, false,  9),
  ('si002042', '3605', 'c1000000-0000-0000-0000-000000000005', 'Private Family Moment at our Facility',                            'Private quiet time with the deceased for up to one hour with up to ten family members.', 495.00, NULL, NULL, false, 10),
  ('si002043', '3605', 'c1000000-0000-0000-0000-000000000005', 'Staff Services for Urn Committal',                                  'Equipment and staff services for urn committal; includes accompaniment of remains to cemetery, supervision and staff assistance.', 395.00, NULL, NULL, false, 11),
  ('si002044', '3605', 'c1000000-0000-0000-0000-000000000005', 'Basic Venue',                                                       'Basic venue at our location for service or gathering.',  395.00, NULL, NULL, false, 12),
  ('si002045', '3605', 'c1000000-0000-0000-0000-000000000005', 'Standard Venue',                                                    'Flexible space in our location for service or gathering.',  495.00, NULL, NULL, false, 13),
  ('si002046', '3605', 'c1000000-0000-0000-0000-000000000005', 'Premium Venue',                                                     'Larger flexible space in our location for service or gathering.',  595.00, NULL, NULL, false, 14),
  ('si002047', '3605', 'c1000000-0000-0000-0000-000000000005', 'Exclusive Venue',                                                   'Exclusive use of all ceremony and visitation venues in the location for the duration of the visitation and ceremony.', 7995.00, NULL, NULL, false, 15),
  ('si002048', '3605', 'c1000000-0000-0000-0000-000000000005', 'Everlasting Memorial',                                              'Choose a theme, share photos and videos; our team creates polished, professional mementos to cherish forever.', 490.00, NULL, NULL, false, 16),
  ('si002049', '3605', 'c1000000-0000-0000-0000-000000000005', 'Dignity Celebrant',                                                 'Certified officiant for the service.',  395.00, NULL, NULL, false, 17),
  ('si002050', '3605', 'c1000000-0000-0000-0000-000000000005', 'Sterling Silver Oval Pendant',                                      '.925 sterling silver, oval, pendant with thumbprint on a sterling silver curb style chain with spring ring clasp.', 295.00, NULL, NULL, false, 18),
  ('si002051', '3605', 'c1000000-0000-0000-0000-000000000005', 'A Life Remembered Book',                                            NULL,   95.00, NULL, NULL, false, 19),
  ('si002052', '3605', 'c1000000-0000-0000-0000-000000000005', 'Cremation Jewellery Bundle',                                        'Modern and contemporary designs; includes a matching pendant and chain, charm and earrings.', 295.00, NULL, NULL, false, 20),
  ('si002053', '3605', 'c1000000-0000-0000-0000-000000000005', 'Sheltering of Remains Charge Per Day',                             NULL,   25.00, NULL, NULL, false, 21),
  ('si002054', '3605', 'c1000000-0000-0000-0000-000000000005', 'Additional Charge – Use of Facilities – Holidays',                 'Additional charge for use of facilities and staff on holidays.', 1000.00, NULL, NULL, false, 22),
  ('si002055', '3605', 'c1000000-0000-0000-0000-000000000005', 'Audio Visual Equipment Rental',                                    'AV equipment rental.',  195.00, NULL, NULL, false, 23),
  ('si002056', '3605', 'c1000000-0000-0000-0000-000000000005', 'Evening Visitation for 2 Hours',                                   NULL,  595.00, NULL, NULL, false, 24),
  ('si002057', '3605', 'c1000000-0000-0000-0000-000000000005', 'Reception and Hostess',                                            NULL,  495.00, NULL, NULL, false, 25),
  ('si002058', '3605', 'c1000000-0000-0000-0000-000000000005', 'Retractable Floor Banner',                                         NULL,  395.00, NULL, NULL, false, 26),
  ('si002059', '3605', 'c1000000-0000-0000-0000-000000000005', 'Supervision – Evening Charge',                                     NULL,  350.00, NULL, NULL, false, 27),
  ('si002060', '3605', 'c1000000-0000-0000-0000-000000000005', 'Supervision for Visitation – Additional Days',                    NULL,  350.00, NULL, NULL, false, 28),
  ('si002061', '3605', 'c1000000-0000-0000-0000-000000000005', 'Supervision of Off-Site Venue',                                   NULL,  595.00, NULL, NULL, false, 29),
  ('si002062', '3605', 'c1000000-0000-0000-0000-000000000005', 'Memory Register Book',                                             'The Ivory Register serves as a classic guest register for families; printed on site.',  75.00, NULL, NULL, false, 30),
  ('si002063', '3605', 'c1000000-0000-0000-0000-000000000005', 'Keepsake Box',                                                     'Modern keepsake box with magnetic closure; useful way to preserve precious memories and keepsakes. (11.5" x 10" x 3.75")',  25.00, NULL, NULL, false, 31),
  ('si002064', '3605', 'c1000000-0000-0000-0000-000000000005', 'Medium Memory Book',                                               'Elegant ivory or charcoal keepsake book adorned with a tone-on-tone pattern; documents guest lists and details.',  75.00, NULL, NULL, false, 32),
  ('si002065', '3605', 'c1000000-0000-0000-0000-000000000005', 'Small Memory Folders or Memory Cards (Per 100)',                  'Include 1 photo, name, dates, service details, obituary, and choice of poem or verse.', 220.00, NULL, NULL, false, 33),
  ('si002066', '3605', 'c1000000-0000-0000-0000-000000000005', 'Medium Memory Cards or Memory Folders (Per 100)',                 'Include up to 4 photos, name, dates, service details, obituary, and choice of poem or verse.', 320.00, NULL, NULL, false, 34),
  ('si002067', '3605', 'c1000000-0000-0000-0000-000000000005', 'Large Memory Booklets or Memory Cards (Per 100)',                 '8-page booklets with up to 15 photos, name, dates, service details, obituary and choice of poem or verse; or large memory cards with soft-touch finish.', 620.00, NULL, NULL, false, 35),
  ('si002068', '3605', 'c1000000-0000-0000-0000-000000000005', 'Our Collection Folders or Prayer Cards (Per 100)',                'Choose from a selection of themes available on site.', 195.00, NULL, NULL, false, 36),
  ('si002069', '3605', 'c1000000-0000-0000-0000-000000000005', 'Memorial Cards',                                                   NULL,  225.00, NULL, NULL, false, 37),
  ('si002070', '3605', 'c1000000-0000-0000-0000-000000000005', 'Casket Medallions',                                                'Memorial keepsake that reflects the life of the individual; displayed in specific caskets.', NULL, 50.00, 295.00, false, 38),
  ('si002071', '3605', 'c1000000-0000-0000-0000-000000000005', 'Single Small Medallion Case',                                      NULL,   65.00, NULL, NULL, false, 39),
  ('si002072', '3605', 'c1000000-0000-0000-0000-000000000005', 'Triple Small Medallion Case',                                      NULL,   95.00, NULL, NULL, false, 40),
  ('si002073', '3605', 'c1000000-0000-0000-0000-000000000005', 'Premier Design Upgrade (Per 100)',                                 'Upgrade standard program with additional design elements to reflect special interests or include different content.', 130.00, NULL, NULL, false, 41),
  ('si002074', '3605', 'c1000000-0000-0000-0000-000000000005', 'Soft Touch Bookmarks (50)',                                        NULL,  200.00, NULL, NULL, false, 42),
  ('si002075', '3605', 'c1000000-0000-0000-0000-000000000005', 'Our Collection Thank You Cards (Per 50)',                         NULL,  100.00, NULL, NULL, false, 43),
  ('si002076', '3605', 'c1000000-0000-0000-0000-000000000005', 'Personalized Thank You Cards (Per 25)',                           NULL,   75.00, NULL, NULL, false, 44),
  ('si002077', '3605', 'c1000000-0000-0000-0000-000000000005', 'Personalized Service Folders',                                    NULL,    NULL, NULL, NULL, false, 45),

  -- ── Stationery ─────────────────────────────────────────────────────────────
  ('si002078', '3605', 'c1000000-0000-0000-0000-000000000006', 'Commemorative Collection',                                         'Includes 1 Medium Memory Book, choice of 100 Medium Memory Folders or Memory Cards, choice of 25 Tribute Thank You Cards and 1 Keepsake Box.', 495.00, NULL, NULL, false, 1),
  ('si002079', '3605', 'c1000000-0000-0000-0000-000000000006', 'Esteemed Collection',                                              'Includes 1 Medium Memory Book, choice of 100 Large Memory Booklets or Memory Cards, choice of 25 Tribute Thank You Cards and 1 Keepsake Box.', 795.00, NULL, NULL, false, 2),
  ('si002080', '3605', 'c1000000-0000-0000-0000-000000000006', 'Remembrance Collection',                                          'Includes 1 Medium Memory Book, choice of 100 Small Memory Folders or Memory Cards, choice of 25 Small Tribute Thank You Cards and 1 Keepsake Box.', 395.00, NULL, NULL, false, 3),
  ('si002081', '3605', 'c1000000-0000-0000-0000-000000000006', 'Our Collection',                                                   'Includes 1 Memory Register Book, choice of 100 Our Collection Folders or Prayer Cards, choice of 50 Our Collection Thank You Cards and 1 Keepsake Box.', 395.00, NULL, NULL, false, 4),

  -- ── Cash Advances ──────────────────────────────────────────────────────────
  ('si002082', '3605', 'c1000000-0000-0000-0000-000000000007', 'Hostess Fee',                                                      NULL,    NULL, NULL, NULL, true,  1),
  ('si002083', '3605', 'c1000000-0000-0000-0000-000000000007', 'Death Certificate',                                                NULL,    NULL, NULL, NULL, true,  2),
  ('si002084', '3605', 'c1000000-0000-0000-0000-000000000007', 'Reception Facility Rental',                                        NULL,    NULL, NULL, NULL, true,  3),
  ('si002085', '3605', 'c1000000-0000-0000-0000-000000000007', 'Consumer Protection BC Fee',                                      NULL,   48.00, NULL, NULL, true,  4),
  ('si002086', '3605', 'c1000000-0000-0000-0000-000000000007', 'Celebrant – Officiant for Service',                               NULL,    NULL, NULL, NULL, true,  5),
  ('si002087', '3605', 'c1000000-0000-0000-0000-000000000007', 'Clergy Honorarium',                                               NULL,    NULL, NULL, NULL, true,  6),
  ('si002088', '3605', 'c1000000-0000-0000-0000-000000000007', 'Newspaper Notice',                                                NULL,    NULL, NULL, NULL, true,  7),
  ('si002089', '3605', 'c1000000-0000-0000-0000-000000000007', 'Organist',                                                        NULL,    NULL, NULL, NULL, true,  8),
  ('si002090', '3605', 'c1000000-0000-0000-0000-000000000007', 'Public Transportation',                                           NULL,    NULL, NULL, NULL, true,  9),
  ('si002091', '3605', 'c1000000-0000-0000-0000-000000000007', 'Soloist',                                                         NULL,    NULL, NULL, NULL, true, 10);

-- ─── Packages (Service Offerings from GPL) ────────────────────────────────────
-- IDs start at pk002001 to avoid collision with 3606 (pk001xxx)
-- Totals verified against GPL page 4-6, 13

insert into packages (id, funeral_home_id, name, pkg_type, total_price, package_discount, default_casket_id, sort_order) values
  ('pk002001', '3605', 'Full Service',                           'package',  9065.00, 0, NULL,  1),
  ('pk002002', '3605', 'Witness Cremation',                      'package',  7605.00, 0, NULL,  2),
  ('pk002003', '3605', 'Service of Remembrance',                 'package',  8495.00, 0, NULL,  3),
  ('pk002004', '3605', 'Graveside Service',                      'package',  8075.00, 0, NULL,  4),
  ('pk002005', '3605', 'Urn Committal Option',                   'package',  6900.00, 0, NULL,  5),
  ('pk002006', '3605', 'No Service Option',                      'package',  5285.00, 0, NULL,  6),
  ('pk002007', '3605', 'Dignity Creative Event',                 'package', 10550.00, 0, NULL,  7),
  ('pk002008', '3605', 'Disinterment',                           'package',  4880.00, 0, NULL,  8),
  ('pk002009', '3605', 'Forwarding of Remains',                  'package',  8920.00, 0, NULL,  9),
  ('pk002010', '3605', 'Receiving of Remains',                   'package',  7255.00, 0, NULL, 10);

-- ─── Package Items ────────────────────────────────────────────────────────────

insert into package_items (package_id, service_item_id, quantity) values

  -- Full Service ($9,065)
  ('pk002001', 'si002003', 1), -- Professional Services Fees for Full Service              4,695
  ('pk002001', 'si002012', 1), -- Registration and Documentation                             495
  ('pk002001', 'si002013', 1), -- Embalming                                                  625
  ('pk002001', 'si002014', 1), -- Other Care and Preparation                                 445
  ('pk002001', 'si002016', 1), -- Sheltering of Remains                                      445
  ('pk002001', 'si002018', 1), -- Transfer of Remains from Place of Death to Funeral Home    545
  ('pk002001', 'si002019', 1), -- Flower Vehicle                                             295
  ('pk002001', 'si002020', 1), -- Funeral Vehicle (Hearse)                                   395
  ('pk002001', 'si002021', 1), -- Limousine                                                  395
  ('pk002001', 'si002033', 1), -- Estate Fraud Protection                                    135
  ('pk002001', 'si002046', 1), -- Premium Venue (Larger flexible space)                      595

  -- Witness Cremation ($7,605)
  ('pk002002', 'si002007', 1), -- Professional Service Fees Cremation Witness              4,545
  ('pk002002', 'si002012', 1), -- Registration and Documentation                             495
  ('pk002002', 'si002014', 1), -- Other Care and Preparation                                 445
  ('pk002002', 'si002016', 1), -- Sheltering of Remains                                      445
  ('pk002002', 'si002018', 1), -- Transfer of Remains from Place of Death to Funeral Home    545
  ('pk002002', 'si002033', 1), -- Estate Fraud Protection                                    135
  ('pk002002', 'si002034', 1), -- Crematory Fee                                              995

  -- Service of Remembrance ($8,495)
  ('pk002003', 'si002006', 1), -- Professional Services Fees for Memorial Service          4,545
  ('pk002003', 'si002012', 1), -- Registration and Documentation                             495
  ('pk002003', 'si002014', 1), -- Other Care and Preparation                                 445
  ('pk002003', 'si002016', 1), -- Sheltering of Remains                                      445
  ('pk002003', 'si002018', 1), -- Transfer of Remains from Place of Death to Funeral Home    545
  ('pk002003', 'si002019', 1), -- Flower Vehicle                                             295
  ('pk002003', 'si002033', 1), -- Estate Fraud Protection                                    135
  ('pk002003', 'si002034', 1), -- Crematory Fee                                              995
  ('pk002003', 'si002046', 1), -- Premium Venue (Larger flexible space)                      595

  -- Graveside Service ($8,075)
  -- Cemetery Fees, Clergy Honorarium, Newspaper Notice are "As Selected" — add as cash advances separately
  ('pk002004', 'si002002', 1), -- Professional Services Fees for Graveside Service         4,695
  ('pk002004', 'si002012', 1), -- Registration and Documentation                             495
  ('pk002004', 'si002013', 1), -- Embalming                                                  625
  ('pk002004', 'si002014', 1), -- Other Care and Preparation                                 445
  ('pk002004', 'si002016', 1), -- Sheltering of Remains                                      445
  ('pk002004', 'si002018', 1), -- Transfer of Remains from Place of Death to Funeral Home    545
  ('pk002004', 'si002019', 1), -- Flower Vehicle                                             295
  ('pk002004', 'si002020', 1), -- Funeral Vehicle (Hearse)                                   395
  ('pk002004', 'si002033', 1), -- Estate Fraud Protection                                    135

  -- Urn Committal Option ($6,900)
  ('pk002005', 'si002008', 1), -- Professional Services Fees for Urn Committal             3,840
  ('pk002005', 'si002012', 1), -- Registration and Documentation                             495
  ('pk002005', 'si002014', 1), -- Other Care and Preparation                                 445
  ('pk002005', 'si002016', 1), -- Sheltering of Remains                                      445
  ('pk002005', 'si002018', 1), -- Transfer of Remains from Place of Death to Funeral Home    545
  ('pk002005', 'si002033', 1), -- Estate Fraud Protection                                    135
  ('pk002005', 'si002034', 1), -- Crematory Fee                                              995

  -- No Service Option ($5,285)
  ('pk002006', 'si002010', 1), -- Basic Service Fees for No Service Option                 2,225
  ('pk002006', 'si002012', 1), -- Registration and Documentation                             495
  ('pk002006', 'si002014', 1), -- Other Care and Preparation                                 445
  ('pk002006', 'si002016', 1), -- Sheltering of Remains                                      445
  ('pk002006', 'si002018', 1), -- Transfer of Remains from Place of Death to Funeral Home    545
  ('pk002006', 'si002033', 1), -- Estate Fraud Protection                                    135
  ('pk002006', 'si002034', 1), -- Crematory Fee                                              995

  -- Dignity Creative Event ($10,550)
  -- Reception Facility Rental is "As Selected" (cash advance) — not included in base total
  ('pk002007', 'si002001', 1), -- Professional Services Fees for Gathering Celebrations    7,195
  ('pk002007', 'si002012', 1), -- Registration and Documentation                             495
  ('pk002007', 'si002014', 1), -- Other Care and Preparation                                 445
  ('pk002007', 'si002016', 1), -- Sheltering of Remains                                      445
  ('pk002007', 'si002018', 1), -- Transfer of Remains from Place of Death to Funeral Home    545
  ('pk002007', 'si002019', 1), -- Flower Vehicle                                             295
  ('pk002007', 'si002033', 1), -- Estate Fraud Protection                                    135
  ('pk002007', 'si002034', 1), -- Crematory Fee                                              995

  -- Disinterment ($4,880)
  ('pk002008', 'si002009', 1), -- Supervision of Disinterment                              3,595
  ('pk002008', 'si002014', 1), -- Other Care and Preparation                                 445
  ('pk002008', 'si002016', 1), -- Sheltering of Remains                                      445
  ('pk002008', 'si002022', 1), -- Service Vehicle                                            395

  -- Forwarding of Remains ($8,920)
  -- Newspaper Notice, Public Transportation are "As Selected" (cash advances) — not in base total
  ('pk002009', 'si002004', 1), -- Basic Professional Service Fee when Forwarding Remains   4,695
  ('pk002009', 'si002012', 1), -- Registration and Documentation                             495
  ('pk002009', 'si002013', 1), -- Embalming                                                  625
  ('pk002009', 'si002014', 1), -- Other Care and Preparation                                 445
  ('pk002009', 'si002016', 1), -- Sheltering of Remains                                      445
  ('pk002009', 'si002017', 1), -- Transfer to or from Airport                                545
  ('pk002009', 'si002018', 1), -- Transfer of Remains from Place of Death to Funeral Home    545
  ('pk002009', 'si002020', 1), -- Funeral Vehicle (Hearse)                                   395
  ('pk002009', 'si002033', 1), -- Estate Fraud Protection                                    135
  ('pk002009', 'si002046', 1), -- Premium Venue (Larger flexible space)                      595

  -- Receiving of Remains ($7,255)
  -- Cemetery Fees, Newspaper Notice, Outside Funeral Director Expense, Public Transportation are "As Selected"
  ('pk002010', 'si002005', 1), -- Basic Professional Service Fees when Receiving Remains   4,695
  ('pk002010', 'si002014', 1), -- Other Care and Preparation                                 445
  ('pk002010', 'si002016', 1), -- Sheltering of Remains                                      445
  ('pk002010', 'si002017', 1), -- Transfer to or from Airport                                545
  ('pk002010', 'si002020', 1), -- Funeral Vehicle (Hearse)                                   395
  ('pk002010', 'si002033', 1), -- Estate Fraud Protection                                    135
  ('pk002010', 'si002046', 1); -- Premium Venue (Larger flexible space)                      595
