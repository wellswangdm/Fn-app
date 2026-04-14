// MOCK MODE – full in-memory data, no Supabase needed.
// Replace this file with the real one (supabase.real.js) once you have credentials.

const FH = 'fh000000-0000-0000-0000-000000000001'
const C = {
  c1: 'c1000000-0000-0000-0000-000000000001',
  c2: 'c1000000-0000-0000-0000-000000000002',
  c3: 'c1000000-0000-0000-0000-000000000003',
  c4: 'c1000000-0000-0000-0000-000000000004',
  c5: 'c1000000-0000-0000-0000-000000000005',
  c6: 'c1000000-0000-0000-0000-000000000006',
  c7: 'c1000000-0000-0000-0000-000000000007',
  c8: 'c1000000-0000-0000-0000-000000000008',
  c9: 'c1000000-0000-0000-0000-000000000009',
}

const serviceCategories = [
  { id: C.c1, name: 'Professional Staff & Services',        sort_order: 1 },
  { id: C.c2, name: 'Facilities and Supervision',           sort_order: 2 },
  { id: C.c3, name: 'Transportation',                       sort_order: 3 },
  { id: C.c4, name: 'Family Support Options',               sort_order: 4 },
  { id: C.c5, name: 'Miscellaneous Services & Merchandise', sort_order: 5 },
  { id: C.c6, name: 'Stationery',                           sort_order: 6 },
  { id: C.c7, name: 'Cash Advances',                        sort_order: 7 },
  { id: C.c8, name: 'Caskets & Containers',                 sort_order: 8 },
  { id: C.c9, name: 'Urns',                                 sort_order: 9 },
]

const serviceItemsRaw = [
  // Professional Staff & Services
  { id: 'si000001', category_id: C.c1, name: 'Professional Services Fees for Full Service',                price: 4070.00 },
  { id: 'si000002', category_id: C.c1, name: 'Professional Services Fees for Gathering Celebrations',     price: 3920.00 },
  { id: 'si000003', category_id: C.c1, name: 'Professional Services Fees for Memorial Service',           price: 3920.00 },
  { id: 'si000004', category_id: C.c1, name: 'Professional Services Fees for Graveside Service',          price: 3795.00 },
  { id: 'si000005', category_id: C.c1, name: 'Professional Service Fees for Cremation Witness',           price: 3645.00 },
  { id: 'si000006', category_id: C.c1, name: 'Basic Professional Service Fee when Forwarding Remains',    price: 2715.00 },
  { id: 'si000007', category_id: C.c1, name: 'Basic Professional Service Fees when Receiving Remains',    price: 2715.00 },
  { id: 'si000008', category_id: C.c1, name: 'Professional Services Fees for Urn Committal',              price: 1190.00 },
  { id: 'si000009', category_id: C.c1, name: 'Basic Service Fees for No Service Option',                  price:  670.00 },
  { id: 'si000010', category_id: C.c1, name: 'Registration and Documentation',                            price:  445.00 },
  { id: 'si000011', category_id: C.c1, name: 'Embalming',                                                 price:  625.00 },
  { id: 'si000012', category_id: C.c1, name: 'Sheltering of Remains',                                     price:  445.00 },
  { id: 'si000013', category_id: C.c1, name: 'Other Care and Preparation',                                price:  445.00 },
  { id: 'si000014', category_id: C.c1, name: 'Special Care for Autopsied Cases',                          price:  525.00 },
  // Facilities and Supervision
  { id: 'si000020', category_id: C.c2, name: 'Use of Facilities for Embalming and Preparation',          price:  445.00 },
  { id: 'si000021', category_id: C.c2, name: 'Basic Venue',                                               price:  395.00 },
  { id: 'si000022', category_id: C.c2, name: 'Standard Venue',                                            price:  495.00 },
  { id: 'si000023', category_id: C.c2, name: 'Premium Venue',                                             price:  595.00 },
  { id: 'si000024', category_id: C.c2, name: 'Exclusive Venue',                                           price: 2595.00 },
  { id: 'si000025', category_id: C.c2, name: 'Celebration Gathering',                                     price: 1595.00 },
  { id: 'si000026', category_id: C.c2, name: 'Venue and Staff Services to Coordinate a Simple Gathering', price:  895.00 },
  { id: 'si000027', category_id: C.c2, name: 'Off-Site Venue & Staff Services',                           price:  595.00 },
  { id: 'si000028', category_id: C.c2, name: 'Private Family Moment at our Facility',                    price:  295.00 },
  { id: 'si000029', category_id: C.c2, name: 'Supervision for Visitation Per Hour',                      price:  395.00 },
  { id: 'si000030', category_id: C.c2, name: 'Supervision - Evening Charge',                              price:  400.00 },
  { id: 'si000031', category_id: C.c2, name: 'Supervision - Holiday Charge',                              price:  999.00 },
  { id: 'si000032', category_id: C.c2, name: 'Supervision of Disinterment',                               price: 3595.00 },
  { id: 'si000033', category_id: C.c2, name: 'Additional Charge - Weekend',                               price:  999.00 },
  // Transportation
  { id: 'si000040', category_id: C.c3, name: 'Transfer of Remains from Place of Death to Funeral Home',
    description: 'Within a 50 kilometre radius. Additional distance will be charged at $2.00 per kilometre.', price: 495.00 },
  { id: 'si000041', category_id: C.c3, name: 'Funeral Vehicle (e.g. Hearse)',
    description: 'Within a 50 kilometre radius. Additional distance will be charged at $2.00 per kilometre.', price: 395.00 },
  { id: 'si000042', category_id: C.c3, name: 'Limousine',
    description: 'Within a 50 kilometre radius. Additional distance will be charged at $2.00 per kilometre.', price: 350.00 },
  { id: 'si000043', category_id: C.c3, name: 'Flower Vehicle',
    description: 'Within a 50 kilometre radius. Additional distance will be charged at $2.00 per kilometre.', price: 220.00 },
  { id: 'si000044', category_id: C.c3, name: 'Transfer to or from Airport',
    description: 'Within a 50 kilometre radius. Additional distance will be charged at $2.00 per kilometre.', price: 395.00 },
  { id: 'si000045', category_id: C.c3, name: 'Shipping Administration',
    description: 'Administration duties required to coordinate shipping of remains.', price: 495.00 },
  { id: 'si000046', category_id: C.c3, name: 'Handling and Transfer of Ashes', price: 195.00 },
  // Family Support Options
  { id: 'si000050', category_id: C.c4, name: 'Medallion Bundle',                                price: 295.00 },
  { id: 'si000051', category_id: C.c4, name: 'Timeless Touch Fingerprint',                      price: 295.00 },
  { id: 'si000052', category_id: C.c4, name: 'Funeral Webcasting',                              price: 295.00 },
  { id: 'si000053', category_id: C.c4, name: 'Retractable Table Banner',                        price: 295.00 },
  { id: 'si000054', category_id: C.c4, name: 'Legal Service Plan',                              price: 295.00 },
  { id: 'si000055', category_id: C.c4, name: 'Memory Portrait - 10x15 Framed Canvas Portrait', price: 295.00 },
  { id: 'si000056', category_id: C.c4, name: 'Treasure Kits',                                   price: 295.00 },
  { id: 'si000057', category_id: C.c4, name: 'Family Estate Manager',                           price: 295.00 },
  { id: 'si000058', category_id: C.c4, name: 'Estate Fraud Protection',                         price: 135.00 },
  { id: 'si000059', category_id: C.c4, name: 'Everlasting Memorial',                            price: 490.00 },
  { id: 'si000060', category_id: C.c4, name: 'Traditional Ritual Washing',                      price: 395.00 },
  // Miscellaneous Services & Merchandise
  { id: 'si000070', category_id: C.c5, name: 'Standard Text Personalization',                    price:  50.00 },
  { id: 'si000071', category_id: C.c5, name: 'Custom Service Folders (100)',                     price: 250.00 },
  { id: 'si000072', category_id: C.c5, name: 'Sterling Silver Oval Pendant',                     price: 295.00 },
  { id: 'si000073', category_id: C.c5, name: 'A Life Remembered Book',                           price:  95.00 },
  { id: 'si000074', category_id: C.c5, name: 'Cremation Expediting Fee',                         price: 499.00 },
  { id: 'si000075', category_id: C.c5, name: 'Cremation Witnessing Fee',                         price: 499.00 },
  { id: 'si000076', category_id: C.c5, name: 'Crematory Fee',                                    price: 995.00 },
  { id: 'si000077', category_id: C.c5, name: 'Our Collection Folders or Prayer Cards (per 100)', price: 195.00 },
  { id: 'si000078', category_id: C.c5, name: 'Small Memory Folders or Memory Cards (per 100)',   price: 220.00 },
  { id: 'si000079', category_id: C.c5, name: 'Medium Memory Cards or Memory Folders (per 100)',  price: 320.00 },
  { id: 'si000080', category_id: C.c5, name: 'Large Memory Booklets or Memory Cards (per 100)',  price: 620.00 },
  { id: 'si000081', category_id: C.c5, name: 'Medium Memory Book',                               price:  75.00 },
  { id: 'si000082', category_id: C.c5, name: 'Memory Register Book',                             price:  75.00 },
  { id: 'si000083', category_id: C.c5, name: 'Keepsake Box',                                     price:  25.00 },
  { id: 'si000084', category_id: C.c5, name: 'Soft Touch Bookmarks (50)',                        price: 200.00 },
  { id: 'si000085', category_id: C.c5, name: 'Our Collection Thank You Cards (per 50)',           price: 100.00 },
  { id: 'si000086', category_id: C.c5, name: 'Personalized Thank You Cards (per 25)',             price:  75.00 },
  { id: 'si000087', category_id: C.c5, name: 'Professional Pallbearer (per person)',              price: 150.00 },
  { id: 'si000088', category_id: C.c5, name: 'Reception and Hostess',                            price: 995.00 },
  { id: 'si000089', category_id: C.c5, name: 'Retractable Floor Banner',                         price: 395.00 },
  { id: 'si000090', category_id: C.c5, name: 'Single Small Medallion Case',                      price:  65.00 },
  { id: 'si000091', category_id: C.c5, name: 'Triple Small Medallion Case',                      price:  95.00 },
  { id: 'si000092', category_id: C.c5, name: 'Dignity Stationery Package',    price_min: 395.00, price_max: 795.00 },
  { id: 'si000093', category_id: C.c5, name: 'Cremation Jewellery Bundle',    price: 295.00 },
  { id: 'si000094', category_id: C.c5, name: 'Casket Medallions',             price_min:  50.00, price_max: 295.00 },
  // Stationery
  { id: 'si000100', category_id: C.c6, name: 'Remembrance Collection',
    description: '1 Medium Memory Book, 100 Small Memory Folders or Memory Cards, 25 Small Tribute Thank You Cards, 1 Keepsake Box.', price: 395.00 },
  { id: 'si000101', category_id: C.c6, name: 'Our Collection',
    description: '1 Memory Register Book, 100 Our Collection Folders or Prayer Cards, 50 Our Collection Thank You Cards, 1 Keepsake Box.', price: 395.00 },
  { id: 'si000102', category_id: C.c6, name: 'Commemorative Collection',
    description: '1 Medium Memory Book, 100 Medium Memory Folders or Memory Cards, 25 Medium Tribute Thank You Cards, 1 Keepsake Box.', price: 495.00 },
  { id: 'si000103', category_id: C.c6, name: 'Esteemed Collection',
    description: '1 Medium Memory Book, 100 Large Memory Booklets or Memory Cards, 25 Medium Tribute Thank You Cards, 1 Keepsake Box.', price: 795.00 },
  // Cash Advances
  { id: 'si000110', category_id: C.c7, name: 'Consumer Protection BC Fee',       is_cash_advance: false, price: 48.00 },
  { id: 'si000111', category_id: C.c7, name: 'Clergy Honorarium',                is_cash_advance: true  },
  { id: 'si000112', category_id: C.c7, name: 'Death Certificate (each)',         is_cash_advance: false, price: 27.00 },
  { id: 'si000113', category_id: C.c7, name: 'Music / Soloist / Piper',          is_cash_advance: true  },
  { id: 'si000114', category_id: C.c7, name: 'Newspaper Notice',                 is_cash_advance: true  },
  { id: 'si000115', category_id: C.c7, name: 'Organist',                         is_cash_advance: true  },
  { id: 'si000116', category_id: C.c7, name: 'Soloist',                          is_cash_advance: true  },
  { id: 'si000117', category_id: C.c7, name: 'Outside Funeral Director Expense', is_cash_advance: true  },
  { id: 'si000118', category_id: C.c7, name: 'Cemetery Fees',                    is_cash_advance: true  },
  { id: 'si000119', category_id: C.c7, name: 'Public Transportation',            is_cash_advance: true  },
  // Family Support (package-specific)
  { id: 'si000200', category_id: C.c4, name: 'Plan Support Option',             price: 295.00 },
  { id: 'si000201', category_id: C.c4, name: 'Cremation Plan Support Option',   price: 295.00 },
  // Flowers
  { id: 'si000202', category_id: C.c5, name: 'Burial Flowers',                  price: 695.00 },
  { id: 'si000203', category_id: C.c5, name: 'Burial Flowers',                  price: 595.00 },
  { id: 'si000204', category_id: C.c5, name: 'Burial Flowers',                  price: 495.00 },
  { id: 'si000205', category_id: C.c5, name: 'Cremation Flowers',               price: 500.00 },
  { id: 'si000206', category_id: C.c5, name: 'Cremation Flowers',               price: 400.00 },
  // Events
  { id: 'si000207', category_id: C.c2, name: 'Catered Reception III',           price: 2150.00 },
  { id: 'si000208', category_id: C.c2, name: 'Catered Reception II',            price: 1980.00 },
  { id: 'si000209', category_id: C.c2, name: 'Catered Reception I',             price: 1350.00 },
  // Caskets
  { id: 'si000210', category_id: C.c8, name: 'Casket',
    description: 'Batesville Merlot, Victoriaville Dominion HC Wood Maple Crepe, Batesville Fireside, Batesville Eleanor Oak', price: 4099.00 },
  { id: 'si000211', category_id: C.c8, name: 'Casket',
    description: 'Batesville Misty Blue, Batesville Watson, Batesville Bailey, Victoriaville Hartvic', price: 3599.00 },
  { id: 'si000212', category_id: C.c8, name: 'Casket',
    description: 'Batesville Coleridge, Batesville Montgomery, Victoriaville Heavenly White, Victoriaville Winfield', price: 2999.00 },
  // Containers
  { id: 'si000216', category_id: C.c8, name: 'Ceremonial Container',
    description: 'Batesville Brockton Oak Ceremonial', price: 1599.00 },
  { id: 'si000217', category_id: C.c8, name: 'Rental Container',
    description: 'Batesville Brockton Oak (1 Hour Rental)', price: 850.00 },
  { id: 'si000218', category_id: C.c8, name: 'Container',
    description: 'Vancouver Casket Cypress', price: 650.00 },
  // Urns
  { id: 'si000213', category_id: C.c9, name: 'Memorial Urn Selection',
    description: 'LoveUrns HeartFelt Gold, Terrybear Eminence White Marble Urn, Granville Lucinda Blue Horizontal Urn, Granville Charlotte Horizontal Urn', price: 1295.00 },
  { id: 'si000214', category_id: C.c9, name: 'Memorial Urn Selection',
    description: 'Urnes Bégin Versatile Urn Navy, LoveUrns Laurel Midnight, Terrybear Satori Ocean Pearl, Batesville Memento Chest', price: 795.00 },
  { id: 'si000215', category_id: C.c9, name: 'Memorial Urn Selection',
    description: 'LoveUrns Laurel Crimson, Urnes Bégin Sky Pewter, Mackenzie Classic Sky Blue, Batesville Cherry Chest', price: 595.00 },
]

// Attach funeral_home_id and pre-join service_categories onto every item
const serviceItems = serviceItemsRaw.map(item => ({
  funeral_home_id: FH,
  is_cash_advance: false,
  price:     null,
  price_min: null,
  price_max: null,
  description: null,
  item_code:   null,
  ...item,
  service_categories: { name: serviceCategories.find(c => c.id === item.category_id)?.name || '' },
}))

const packages = [
  // ── Named Packages ────────────────────────────────────────────────────────
  { id: 'pk000010', funeral_home_id: FH, name: 'Heritage Funeral Service',   total_price: 17519.00, sort_order: 10, pkg_type: 'package' },
  { id: 'pk000011', funeral_home_id: FH, name: 'Honour Funeral Service',     total_price: 16449.00, sort_order: 11, pkg_type: 'package' },
  { id: 'pk000012', funeral_home_id: FH, name: 'Tribute Funeral Service',    total_price: 14669.00, sort_order: 12, pkg_type: 'package' },
  { id: 'pk000013', funeral_home_id: FH, name: 'Heritage Cremation Service', total_price: 16719.00, sort_order: 13, pkg_type: 'package' },
  { id: 'pk000014', funeral_home_id: FH, name: 'Honour Cremation Service',   total_price: 13775.00, sort_order: 14, pkg_type: 'package' },
  { id: 'pk000015', funeral_home_id: FH, name: 'Tribute Cremation Service',  total_price:  6065.00, sort_order: 15, pkg_type: 'package' },
  // ── A La Carte ────────────────────────────────────────────────────────────
  { id: 'pk000001', funeral_home_id: FH, name: 'Full Service',           total_price: 7650.00, sort_order: 1, pkg_type: 'alacarte' },
  { id: 'pk000002', funeral_home_id: FH, name: 'Witness Cremation',      total_price: 7000.00, sort_order: 2, pkg_type: 'alacarte' },
  { id: 'pk000003', funeral_home_id: FH, name: 'Service of Remembrance', total_price: 7475.00, sort_order: 3, pkg_type: 'alacarte' },
  { id: 'pk000004', funeral_home_id: FH, name: 'Graveside Service',      total_price: 6155.00, sort_order: 4, pkg_type: 'alacarte' },
  { id: 'pk000005', funeral_home_id: FH, name: 'Urn Committal Option',   total_price: 4150.00, sort_order: 5, pkg_type: 'alacarte' },
  { id: 'pk000006', funeral_home_id: FH, name: 'No Service Option',      total_price: 3630.00, sort_order: 6, pkg_type: 'alacarte' },
  { id: 'pk000007', funeral_home_id: FH, name: 'Forwarding of Remains',  total_price: 5120.00, sort_order: 7, pkg_type: 'alacarte' },
  { id: 'pk000008', funeral_home_id: FH, name: 'Receiving of Remains',   total_price: 3950.00, sort_order: 8, pkg_type: 'alacarte' },
  { id: 'pk000009', funeral_home_id: FH, name: 'Tea Room Gathering',     total_price: 7240.00, sort_order: 9, pkg_type: 'alacarte' },
]

// [package_id, service_item_id] pairs
const pkgLinks = [
  // Full Service
  ['pk000001','si000001'],['pk000001','si000010'],['pk000001','si000011'],
  ['pk000001','si000013'],['pk000001','si000012'],['pk000001','si000040'],
  ['pk000001','si000041'],['pk000001','si000058'],['pk000001','si000023'],
  // Witness Cremation
  ['pk000002','si000005'],['pk000002','si000010'],['pk000002','si000013'],
  ['pk000002','si000012'],['pk000002','si000040'],['pk000002','si000041'],
  ['pk000002','si000058'],['pk000002','si000076'],
  // Service of Remembrance
  ['pk000003','si000003'],['pk000003','si000010'],['pk000003','si000013'],
  ['pk000003','si000012'],['pk000003','si000040'],['pk000003','si000058'],
  ['pk000003','si000076'],['pk000003','si000023'],
  // Graveside Service
  ['pk000004','si000004'],['pk000004','si000010'],['pk000004','si000013'],
  ['pk000004','si000012'],['pk000004','si000040'],['pk000004','si000041'],
  ['pk000004','si000058'],
  // Urn Committal
  ['pk000005','si000008'],['pk000005','si000010'],['pk000005','si000013'],
  ['pk000005','si000012'],['pk000005','si000040'],['pk000005','si000058'],
  ['pk000005','si000076'],
  // No Service
  ['pk000006','si000009'],['pk000006','si000010'],['pk000006','si000013'],
  ['pk000006','si000012'],['pk000006','si000040'],['pk000006','si000058'],
  ['pk000006','si000076'],
  // Forwarding of Remains
  ['pk000007','si000006'],['pk000007','si000010'],['pk000007','si000011'],
  ['pk000007','si000012'],['pk000007','si000044'],['pk000007','si000040'],
  // Receiving of Remains
  ['pk000008','si000007'],['pk000008','si000012'],['pk000008','si000044'],
  ['pk000008','si000041'],
  // Tea Room Gathering
  ['pk000009','si000022'],['pk000009','si000002'],['pk000009','si000088'],
  ['pk000009','si000012'],['pk000009','si000013'],['pk000009','si000010'],
  ['pk000009','si000040'],
  // Heritage Funeral Service
  ['pk000010','si000001'],['pk000010','si000010'],['pk000010','si000011'],
  ['pk000010','si000013'],['pk000010','si000012'],['pk000010','si000040'],
  ['pk000010','si000041'],['pk000010','si000042'],['pk000010','si000059'],
  ['pk000010','si000058'],['pk000010','si000088'],['pk000010','si000202'],
  ['pk000010','si000023'],['pk000010','si000200'],['pk000010','si000210'],
  ['pk000010','si000207'],['pk000010','si000103'],
  // Honour Funeral Service
  ['pk000011','si000001'],['pk000011','si000010'],['pk000011','si000011'],
  ['pk000011','si000013'],['pk000011','si000012'],['pk000011','si000040'],
  ['pk000011','si000041'],['pk000011','si000042'],['pk000011','si000059'],
  ['pk000011','si000058'],['pk000011','si000088'],['pk000011','si000203'],
  ['pk000011','si000023'],['pk000011','si000200'],['pk000011','si000211'],
  ['pk000011','si000208'],['pk000011','si000102'],
  // Tribute Funeral Service
  ['pk000012','si000001'],['pk000012','si000010'],['pk000012','si000011'],
  ['pk000012','si000013'],['pk000012','si000012'],['pk000012','si000040'],
  ['pk000012','si000041'],['pk000012','si000059'],
  ['pk000012','si000058'],['pk000012','si000088'],['pk000012','si000204'],
  ['pk000012','si000023'],['pk000012','si000200'],['pk000012','si000212'],
  ['pk000012','si000209'],['pk000012','si000100'],
  // Heritage Cremation Service
  ['pk000013','si000001'],['pk000013','si000010'],['pk000013','si000011'],
  ['pk000013','si000013'],['pk000013','si000012'],['pk000013','si000040'],
  ['pk000013','si000042'],['pk000013','si000059'],
  ['pk000013','si000058'],['pk000013','si000088'],['pk000013','si000205'],
  ['pk000013','si000076'],['pk000013','si000023'],['pk000013','si000201'],
  ['pk000013','si000213'],['pk000013','si000216'],['pk000013','si000207'],
  ['pk000013','si000103'],
  // Honour Cremation Service
  ['pk000014','si000002'],['pk000014','si000010'],
  ['pk000014','si000013'],['pk000014','si000012'],['pk000014','si000040'],
  ['pk000014','si000059'],['pk000014','si000058'],['pk000014','si000088'],
  ['pk000014','si000206'],['pk000014','si000076'],['pk000014','si000023'],
  ['pk000014','si000201'],['pk000014','si000214'],['pk000014','si000217'],
  ['pk000014','si000208'],['pk000014','si000102'],
  // Tribute Cremation Service
  ['pk000015','si000009'],['pk000015','si000010'],['pk000015','si000013'],
  ['pk000015','si000026'],['pk000015','si000012'],['pk000015','si000040'],
  ['pk000015','si000058'],['pk000015','si000076'],['pk000015','si000201'],
  ['pk000015','si000215'],['pk000015','si000218'],
]

const packageItems = pkgLinks.map(([pkg_id, si_id]) => {
  const si = serviceItemsRaw.find(s => s.id === si_id)
  return {
    package_id:      pkg_id,
    service_item_id: si_id,
    quantity:        1,
    service_items:   si ? { id: si.id, name: si.name, price: si.price || 0 } : null,
  }
})

// ─── In-memory mutable store ──────────────────────────────────────────────────
const DB = {
  funeral_homes:      [{ id: FH, name: 'Victory Memorial Park Funeral Centre', address: '14831 28th Ave, Surrey, BC V4P 1P3', phone: '604-536-6522', website: 'www.victoryfuneralcentre.ca', tax_rate: 0.05 }],
  service_categories: serviceCategories,
  service_items:      serviceItems,
  packages,
  package_items:      packageItems,
  quotes:             [],
  quote_items:        [],
}

// ─── Chainable query builder ──────────────────────────────────────────────────
class Builder {
  constructor(table) {
    this._table   = table
    this._op      = 'select'
    this._payload = null
    this._filters = []
    this._order   = null
    this._single  = false
  }

  select()               { return this }
  single()               { this._single = true; return this }
  eq(field, val)         { this._filters.push([field, val]); return this }
  order(field, opts = {}) { this._order = { field, asc: opts.ascending !== false }; return this }
  insert(payload)        { this._op = 'insert'; this._payload = payload; return this }
  update(payload)        { this._op = 'update'; this._payload = payload; return this }
  delete()               { this._op = 'delete'; return this }

  then(resolve, reject) {
    return Promise.resolve(this._run()).then(resolve, reject)
  }

  _run() {
    if (this._op === 'select') {
      let rows = [...DB[this._table]]
      for (const [f, v] of this._filters) rows = rows.filter(r => r[f] === v)
      if (this._order) {
        const { field, asc } = this._order
        rows.sort((a, b) => {
          const av = a[field] ?? 0, bv = b[field] ?? 0
          return asc ? (av > bv ? 1 : av < bv ? -1 : 0)
                     : (av < bv ? 1 : av > bv ? -1 : 0)
        })
      }
      if (this._table === 'quotes') {
        rows = rows.map(q => ({
          ...q,
          funeral_homes: DB.funeral_homes.find(h => h.id === q.funeral_home_id) ?? null,
        }))
      }
      return { data: this._single ? (rows[0] ?? null) : rows, error: null }
    }

    if (this._op === 'insert') {
      const arr      = Array.isArray(this._payload) ? this._payload : [this._payload]
      const inserted = arr.map(r => ({ id: crypto.randomUUID(), created_at: new Date().toISOString(), ...r }))
      DB[this._table].push(...inserted)
      return { data: this._single ? inserted[0] : inserted, error: null }
    }

    if (this._op === 'update') {
      for (const [f, v] of this._filters) {
        const idx = DB[this._table].findIndex(r => r[f] === v)
        if (idx >= 0) Object.assign(DB[this._table][idx], this._payload, { updated_at: new Date().toISOString() })
      }
      return { data: null, error: null }
    }

    if (this._op === 'delete') {
      for (const [f, v] of this._filters) {
        DB[this._table] = DB[this._table].filter(r => r[f] !== v)
      }
      return { data: null, error: null }
    }

    return { data: null, error: null }
  }
}

export const supabase = { from: (table) => new Builder(table) }
