-- ─────────────────────────────────────────────────────────────────────────────
-- SEED — Henderson's Funeral Home (Chilliwack) (ID: 3730)
-- ─────────────────────────────────────────────────────────────────────────────

-- ─── Funeral Home ─────────────────────────────────────────────────────────────

insert into funeral_homes (id, name, address, phone, website, tax_rate) values
  ('3730', 'Henderson''s Funeral Home (Chilliwack)', '45901 Victoria Ave, Chilliwack, BC V2P 2S9', '604-792-1344', 'www.hendersonsfunerals.com', 0.05)
  on conflict (id) do nothing;

-- ─── Service Categories (defensive — already created by prior migrations) ────

insert into service_categories (id, name, sort_order) values
  ('c1000000-0000-0000-0000-000000000001', 'Professional Staff & Services', 1),
  ('c1000000-0000-0000-0000-000000000002', 'Facilities and Supervision', 2),
  ('c1000000-0000-0000-0000-000000000003', 'Transportation', 3),
  ('c1000000-0000-0000-0000-000000000004', 'Family Support Options', 4),
  ('c1000000-0000-0000-0000-000000000005', 'Misc Services & Merchandise', 5),
  ('c1000000-0000-0000-0000-000000000006', 'Stationery', 6),
  ('c1000000-0000-0000-0000-000000000007', 'Cash Advances', 7),
  ('c1000000-0000-0000-0000-000000000008', 'Caskets & Containers', 8),
  ('c1000000-0000-0000-0000-000000000009', 'Urns', 9),
  ('c1000000-0000-0000-0000-000000000010', 'Keepsakes', 10),
  ('c1000000-0000-0000-0000-000000000011', 'Jewelry', 11)
  on conflict (id) do nothing;

-- ─── Service Items ────────────────────────────────────────────────────────────
-- IDs si004001–si004322

insert into service_items (id, funeral_home_id, category_id, item_code, name, description, price, price_min, price_max, is_cash_advance, sort_order) values
  -- Professional Staff & Services
  ('si004001', '3730', 'c1000000-0000-0000-0000-000000000001', NULL, 'Professional Services Fees for Gathering Celebrations', NULL, 2495.00, NULL, NULL, false, 1),
  ('si004002', '3730', 'c1000000-0000-0000-0000-000000000001', NULL, 'Professional Services Fees for Full Service', NULL, 2255.00, NULL, NULL, false, 2),
  ('si004003', '3730', 'c1000000-0000-0000-0000-000000000001', NULL, 'Professional Services Fees for Memorial Service', NULL, 2105.00, NULL, NULL, false, 3),
  ('si004004', '3730', 'c1000000-0000-0000-0000-000000000001', NULL, 'Professional Services Fees for Graveside Service', NULL, 2025.00, NULL, NULL, false, 4),
  ('si004005', '3730', 'c1000000-0000-0000-0000-000000000001', NULL, 'Professional Service Fees of Funeral Director and Staff for Cremation Witness', NULL, 1875.00, NULL, NULL, false, 5),
  ('si004006', '3730', 'c1000000-0000-0000-0000-000000000001', NULL, 'Basic Professional Service Fee when Forwarding Remains', NULL, 1495.00, NULL, NULL, false, 6),
  ('si004007', '3730', 'c1000000-0000-0000-0000-000000000001', NULL, 'Basic Professional Service Fees when Receiving Remains', NULL, 1495.00, NULL, NULL, false, 7),
  ('si004008', '3730', 'c1000000-0000-0000-0000-000000000001', NULL, 'Professional Services Fees for Urn Committal', NULL, 600.00, NULL, NULL, false, 8),
  ('si004009', '3730', 'c1000000-0000-0000-0000-000000000001', NULL, 'Staff Services for Urn Committal', 'Our services include accompaniment of remains to cemetery, supervision of service, and staff to assist with the service.', 350.00, NULL, NULL, false, 9),
  ('si004010', '3730', 'c1000000-0000-0000-0000-000000000001', NULL, 'Basic Service Fees for No Service Option', NULL, 255.00, NULL, NULL, false, 10),
  ('si004011', '3730', 'c1000000-0000-0000-0000-000000000001', NULL, 'Registration and Documentation', 'Completion and filing of all documents necessary to carry out the services and supplies requested, including death registration, burial or cremation permit, coroner’s certificate and documentation necessary to ship the body out of the country.', 445.00, NULL, NULL, false, 11),
  ('si004012', '3730', 'c1000000-0000-0000-0000-000000000001', NULL, 'Embalming', 'This fee is in addition to basic preparation. Embalming is the process of replacing blood and bodily fluids with chemical preservatives. Autopsy embalming and restorative practices are included.', 625.00, NULL, NULL, false, 12),
  ('si004013', '3730', 'c1000000-0000-0000-0000-000000000001', NULL, 'Sheltering of Remains', NULL, 445.00, NULL, NULL, false, 13),
  ('si004014', '3730', 'c1000000-0000-0000-0000-000000000001', NULL, 'Other Care and Preparation', NULL, 445.00, NULL, NULL, false, 14),
  -- Facilities and Supervision
  ('si004015', '3730', 'c1000000-0000-0000-0000-000000000002', NULL, 'Use of Facilities for Embalming and Preparation', NULL, 195.00, NULL, NULL, false, 1),
  ('si004016', '3730', 'c1000000-0000-0000-0000-000000000002', NULL, 'Supervision of Funeral Service', NULL, 595.00, NULL, NULL, false, 2),
  ('si004017', '3730', 'c1000000-0000-0000-0000-000000000002', NULL, 'Supervision of Memorial Service', NULL, 595.00, NULL, NULL, false, 3),
  ('si004018', '3730', 'c1000000-0000-0000-0000-000000000002', NULL, 'Simple Gathering', 'An intimate gathering of ten to twelve family and friends to celebrate a life.', 595.00, NULL, NULL, false, 4),
  -- Transportation
  ('si004019', '3730', 'c1000000-0000-0000-0000-000000000003', NULL, 'Transfer of Remains from Place of Death to Funeral Home', 'Within a 50 kilometre radius. Additional distance will be charged at $2 per kilometre.', 495.00, NULL, NULL, false, 1),
  ('si004020', '3730', 'c1000000-0000-0000-0000-000000000003', NULL, 'Funeral Vehicle (e.g. Hearse)', 'Within a 50 kilometre radius. Additional distance will be charged at $2 per kilometre.', 395.00, NULL, NULL, false, 2),
  ('si004021', '3730', 'c1000000-0000-0000-0000-000000000003', NULL, 'Limousine', 'Within a 50 kilometre radius. Additional distance will be charged at $2 per kilometre.', 395.00, NULL, NULL, false, 3),
  ('si004022', '3730', 'c1000000-0000-0000-0000-000000000003', NULL, 'Transfer to or from Airport', 'Within a 50 kilometre radius. Additional distance will be charged at $2 per kilometre.', 395.00, NULL, NULL, false, 4),
  -- Family Support Options
  ('si004023', '3730', 'c1000000-0000-0000-0000-000000000004', NULL, 'Legal Service Plan', NULL, 295.00, NULL, NULL, false, 1),
  ('si004024', '3730', 'c1000000-0000-0000-0000-000000000004', 'DGSWEBCS', 'Funeral Webcasting', 'Allow those who cannot attend in person to watch the memorial service online. The service will be broadcast live on the web, and a video recording will remain accessible to friends and family for 90 days following the service.', 295.00, NULL, NULL, false, 2),
  ('si004025', '3730', 'c1000000-0000-0000-0000-000000000004', 'XPARNRY1', 'Retractable Table Banner', 'This Table Banner brings a beautiful touch to services by showcasing up to 4 pictures of your loved one with a personalized design from the selection album and has the option of generating a QR code leading to the online version of the memory cards or folders that is selected. (QR code available day of first funeral event plus three weeks. Online program is viewable but cannot be forwarded, transferred or printed. 11.75" x 17")', 295.00, NULL, NULL, false, 3),
  ('si004026', '3730', 'c1000000-0000-0000-0000-000000000004', NULL, 'Timeless Touch Fingerprint', NULL, 295.00, NULL, NULL, false, 4),
  ('si004027', '3730', 'c1000000-0000-0000-0000-000000000004', NULL, 'Medallion Bundle', NULL, 295.00, NULL, NULL, false, 5),
  ('si004028', '3730', 'c1000000-0000-0000-0000-000000000004', 'XPRPPFN', 'Memory Portrait - 10x15 Framed Canvas Portrait', 'Create a lasting tribute to your loved one with a favourite photograph reproduced on canvas in the style of an oil painting. Includes three frame selection choices - Elegance, Contemporary or Classic.', 295.00, NULL, NULL, false, 6),
  ('si004029', '3730', 'c1000000-0000-0000-0000-000000000004', 'XOTXMBK', 'Family Estate Manager', 'Family Estate Manager is a comprehensive, step-by-step tool that simplifies the decisions you’ll make as you settle your loved one’s estate. Provides immediate access to legal professionals.', 295.00, NULL, NULL, false, 7),
  -- Miscellaneous Services & Merchandise
  ('si004030', '3730', 'c1000000-0000-0000-0000-000000000005', 'UAAAGB', 'Standard Text Personalization', NULL, 50.00, NULL, NULL, false, 1),
  ('si004031', '3730', 'c1000000-0000-0000-0000-000000000005', 'MEMMALRB', 'A Life Remembered Book', NULL, 95.00, NULL, NULL, false, 2),
  ('si004032', '3730', 'c1000000-0000-0000-0000-000000000005', 'SRVEVCHG', 'Supervision of Evening Service', 'Additional Charge for Use of Facilities and Staff for Evening Service.', 395.00, NULL, NULL, false, 3),
  ('si004033', '3730', 'c1000000-0000-0000-0000-000000000005', 'FACHOCHG', 'Additional Charge - Use of Facilities on Holidays', 'Additional Charge for Use of Facilities and Staff on Holidays.', 1000.00, NULL, NULL, false, 4),
  ('si004034', '3730', 'c1000000-0000-0000-0000-000000000005', 'SRVWECHG', 'Additional Charge - Use of Facilities on Weekends', 'Additional charge for Use of Facilities and Staff on Weekends.', 800.00, NULL, NULL, false, 5),
  ('si004035', '3730', 'c1000000-0000-0000-0000-000000000005', 'FACEVCHG', 'Additional Charge - Use of Facilities for Evening', 'Additional charge for Use of Facilities for Evening Service.', 400.00, NULL, NULL, false, 6),
  ('si004036', '3730', 'c1000000-0000-0000-0000-000000000005', 'XSRAVERT', 'Audio Visual Equipment Rental', NULL, 195.00, NULL, NULL, false, 7),
  ('si004037', '3730', 'c1000000-0000-0000-0000-000000000005', 'XSREQPRT', 'Cemetery Equipment Rental Fee', NULL, 175.00, NULL, NULL, false, 8),
  ('si004038', '3730', 'c1000000-0000-0000-0000-000000000005', 'DGSDIGCT', 'Dignity® Celebrant', 'Certified officiant for the service.', 395.00, NULL, NULL, false, 9),
  ('si004039', '3730', 'c1000000-0000-0000-0000-000000000005', 'CRMEXPFE', 'Cremation Expediting Fee', NULL, 495.00, NULL, NULL, false, 10),
  ('si004040', '3730', 'c1000000-0000-0000-0000-000000000005', 'CRMWTNFE', 'Cremation Witnessing Fee', NULL, 495.00, NULL, NULL, false, 11),
  ('si004041', '3730', 'c1000000-0000-0000-0000-000000000005', 'CRM03PTY', 'Crematory Fee', NULL, 995.00, NULL, NULL, false, 12),
  ('si004042', '3730', 'c1000000-0000-0000-0000-000000000005', 'FACFSEVC', 'Exclusive Venue', 'Exclusive use of all ceremony and visitation venues in the location for the duration of the visitation and ceremony.', 2595.00, NULL, NULL, false, 13),
  ('si004043', '3730', 'c1000000-0000-0000-0000-000000000005', 'FACFSVFS', 'Standard Venue', 'Flexible space in our location for service or gathering.', 495.00, NULL, NULL, false, 14),
  ('si004044', '3730', 'c1000000-0000-0000-0000-000000000005', 'FACFPVFS', 'Premium Venue', 'Larger flexible space in our location for service or gathering.', 595.00, NULL, NULL, false, 15),
  ('si004045', '3730', 'c1000000-0000-0000-0000-000000000005', 'XAIMNAI', 'Casket Medallions', 'Memorial keepsake that reflects the life of the individual and is displayed in specific caskets.', NULL, 50.00, 295.00, false, 16),
  ('si004046', '3730', 'c1000000-0000-0000-0000-000000000005', 'UCBSWSF8DR', 'Cremation Jewellery Bundle', 'Modern and contemporary designs inspired by stylish jewellery and fashion. Includes a matching pendant and chain, charm and earrings.', 295.00, NULL, NULL, false, 17),
  ('si004047', '3730', 'c1000000-0000-0000-0000-000000000005', 'SRVEXTCT', 'External Celebrant', 'Officiant for the service.', NULL, NULL, NULL, false, 18),
  ('si004048', '3730', 'c1000000-0000-0000-0000-000000000005', 'SRVPRIVC', 'Private Family Moment at our Facility', 'Allows for a private quiet time with the deceased for up to one hour with up to ten family members.', 295.00, NULL, NULL, false, 19),
  ('si004049', '3730', 'c1000000-0000-0000-0000-000000000005', 'SRVPLLBR', 'Professional Pallbearer', 'Per person.', 150.00, NULL, NULL, false, 20),
  ('si004050', '3730', 'c1000000-0000-0000-0000-000000000005', 'XSMAIMG1W', 'Other Register Book - Personal Collection', 'Providing family with a register book outside of the 2019 Stationery Program.', 140.00, NULL, NULL, false, 21),
  ('si004051', '3730', 'c1000000-0000-0000-0000-000000000005', 'XSRRPAHS', 'Reception and Hostess', NULL, 599.00, NULL, NULL, false, 22),
  ('si004052', '3730', 'c1000000-0000-0000-0000-000000000005', 'XSMCCZ09Z', 'Retractable Floor Banner', NULL, 395.00, NULL, NULL, false, 23),
  ('si004053', '3730', 'c1000000-0000-0000-0000-000000000005', 'XFDDCBR', 'Single Small Medallion Case', NULL, 65.00, NULL, NULL, false, 24),
  ('si004054', '3730', 'c1000000-0000-0000-0000-000000000005', 'PRPSPAUT', 'Special Care for Autopsied Cases', NULL, 525.00, NULL, NULL, false, 25),
  ('si004055', '3730', 'c1000000-0000-0000-0000-000000000005', 'SPVHRLYR', 'Supervision for Visitation Per Hour', NULL, 395.00, NULL, NULL, false, 26),
  ('si004056', '3730', 'c1000000-0000-0000-0000-000000000005', 'SPVOFFSV', 'Supervision of Off-Site Venue', NULL, 595.00, NULL, NULL, false, 27),
  ('si004057', '3730', 'c1000000-0000-0000-0000-000000000005', 'SRVTRWG', 'Traditional Ritual Washing', NULL, 395.00, NULL, NULL, false, 28),
  ('si004058', '3730', 'c1000000-0000-0000-0000-000000000005', 'XFDDCBT', 'Triple Small Medallion Case', NULL, 95.00, NULL, NULL, false, 29),
  ('si004059', '3730', 'c1000000-0000-0000-0000-000000000005', 'SRVMRVSS', 'Venue and Staff Services to coordinate a Simple Gathering', NULL, 595.00, NULL, NULL, false, 30),
  ('si004060', '3730', 'c1000000-0000-0000-0000-000000000005', 'MEMMCAEM', 'Everlasting Memorial®', 'We turn your family’s memories into thoughtful keepsakes. Simply choose a theme, share your photos and videos, and our team will create polished, professional mementos to cherish forever.', 490.00, NULL, NULL, false, 31),
  ('si004061', '3730', 'c1000000-0000-0000-0000-000000000005', 'DOCESFRP', 'Estate Fraud Protection', 'With Estate Fraud Protection, fraud specialists will notify the credit reporting agencies to help protect your loved one’s estate from security breaches.', 135.00, NULL, NULL, false, 32),
  ('si004062', '3730', 'c1000000-0000-0000-0000-000000000005', NULL, 'Dignity Heritage Burial Flowers', NULL, 695.00, NULL, NULL, false, 33),
  ('si004063', '3730', 'c1000000-0000-0000-0000-000000000005', NULL, 'Dignity Honour Burial Flowers', NULL, 495.00, NULL, NULL, false, 34),
  ('si004064', '3730', 'c1000000-0000-0000-0000-000000000005', NULL, 'Dignity Heritage Cremation Flowers', NULL, 500.00, NULL, NULL, false, 35),
  ('si004065', '3730', 'c1000000-0000-0000-0000-000000000005', NULL, 'Dignity Honour Cremation Flowers', NULL, 400.00, NULL, NULL, false, 36),
  ('si004066', '3730', 'c1000000-0000-0000-0000-000000000005', NULL, 'Catered Receptions I', NULL, 795.00, NULL, NULL, false, 37),
  ('si004067', '3730', 'c1000000-0000-0000-0000-000000000005', NULL, 'Catered Receptions II', NULL, 995.00, NULL, NULL, false, 38),
  ('si004068', '3730', 'c1000000-0000-0000-0000-000000000005', NULL, 'Catered Receptions III', NULL, 1195.00, NULL, NULL, false, 39),
  ('si004069', '3730', 'c1000000-0000-0000-0000-000000000005', NULL, 'Reception Room', NULL, 499.00, NULL, NULL, false, 40),
  -- Stationery
  ('si004070', '3730', 'c1000000-0000-0000-0000-000000000006', 'XDPAIEC', 'Esteemed Collection', 'Includes 1 Medium Memory Book, choice of 100 Large Memory Booklets or Memory Cards, choice of 25 Medium Tribute Thank You Cards or Signature Thank You Cards and 1 Keepsake Box.', 795.00, NULL, NULL, false, 1),
  ('si004071', '3730', 'c1000000-0000-0000-0000-000000000006', 'XDPAICV', 'Commemorative Collection', 'Includes 1 Medium Memory Book, choice of 100 Medium Memory Folders or Memory Cards, choice of 25 Medium Tribute Thank You Cards or Signature Thank You Cards and 1 Keepsake Box.', 495.00, NULL, NULL, false, 2),
  ('si004072', '3730', 'c1000000-0000-0000-0000-000000000006', 'XDPAIRC', 'Remembrance Collection', 'Includes 1 Medium Memory Book, choice of 100 Small Memory Folders or Memory Cards, choice of 25 Small Tribute Thank You Cards and 1 Keepsake Box.', 395.00, NULL, NULL, false, 3),
  ('si004073', '3730', 'c1000000-0000-0000-0000-000000000006', 'XDPAIOC', 'Our Collection', 'Includes 1 Memory Register Book, choice of 100 Our Collection Folders or Prayer Cards, choice of 50 Our Collection Thank You Cards and 1 Keepsake Box.', 395.00, NULL, NULL, false, 4),
  ('si004074', '3730', 'c1000000-0000-0000-0000-000000000006', 'XSMOT1S44', 'Our Collection Folders or Prayer Cards (Per 100)', 'Choose from a selection of themes available on site.', 195.00, NULL, NULL, false, 5),
  ('si004075', '3730', 'c1000000-0000-0000-0000-000000000006', 'XSMLG1S3L', 'Large Memory Booklets or Memory Cards (Per 100)', 'Large Memory Booklets feature 8 pages to represent a life well lived or include up to 15 photos, name, dates, service details, obituary and choice of poem or verse, or Large Memory Cards feature a soft-touch finish with rounded corners personalized with up to 5 photos, name, dates and choice of poem or verse.', 620.00, NULL, NULL, false, 6),
  ('si004076', '3730', 'c1000000-0000-0000-0000-000000000006', 'XSMMD1S3L', 'Medium Memory Cards or Memory Folders (Per 100)', 'Medium memory folders or memory cards include up to 4 photos, name, dates, service details, obituary, and choice of poem or verse.', 320.00, NULL, NULL, false, 7),
  ('si004077', '3730', 'c1000000-0000-0000-0000-000000000006', 'XSMDF1S3L', 'Small Memory Folders or Memory Cards (Per 100)', 'Small memory folders or small memory cards include 1 photo, name, dates, service details, obituary, and choice of poem or verse.', 220.00, NULL, NULL, false, 8),
  ('si004078', '3730', 'c1000000-0000-0000-0000-000000000006', 'XSMAX1S5L', 'Our Collection Thank You Cards (Per 50)', NULL, 100.00, NULL, NULL, false, 9),
  ('si004079', '3730', 'c1000000-0000-0000-0000-000000000006', 'XSMEG993L', 'Personalized Thank You Cards (Per 25)', NULL, 75.00, NULL, NULL, false, 10),
  ('si004080', '3730', 'c1000000-0000-0000-0000-000000000006', 'XSMBMBM5F', 'Soft Touch Bookmarks (50)', NULL, 200.00, NULL, NULL, false, 11),
  ('si004081', '3730', 'c1000000-0000-0000-0000-000000000006', 'XSMAI8M8M', 'Memory Register Book', 'The Ivory Register serves as a classic guest register for families and is printed on site.', 75.00, NULL, NULL, false, 12),
  ('si004082', '3730', 'c1000000-0000-0000-0000-000000000006', 'XSMMB1S3L', 'Medium Memory Book', 'This elegant ivory or charcoal keepsake book, adorned with a tone-on-tone pattern, documents guest lists and details of each guest’s life. Created from the template chosen from the stationery selection book.', 75.00, NULL, NULL, false, 13),
  ('si004083', '3730', 'c1000000-0000-0000-0000-000000000006', 'XSMKB1S3L', 'Keepsake Box', 'The modern keepsake box features a magnetic closure and is a useful way to preserve precious memories and keepsakes. (11.5" x 10" x 3.75")', 25.00, NULL, NULL, false, 14),
  -- Cash Advances
  ('si004084', '3730', 'c1000000-0000-0000-0000-000000000007', NULL, 'Consumer Protection BC Fee', NULL, 48.00, NULL, NULL, true, 1),
  ('si004085', '3730', 'c1000000-0000-0000-0000-000000000007', NULL, 'Clergy Honorarium', NULL, NULL, NULL, NULL, true, 2),
  ('si004086', '3730', 'c1000000-0000-0000-0000-000000000007', NULL, 'Hostess Fee', NULL, NULL, NULL, NULL, true, 3),
  ('si004087', '3730', 'c1000000-0000-0000-0000-000000000007', NULL, 'Music/Soloist/Piper', NULL, NULL, NULL, NULL, true, 4),
  ('si004088', '3730', 'c1000000-0000-0000-0000-000000000007', NULL, 'Newspaper Notice', NULL, NULL, NULL, NULL, true, 5),
  ('si004089', '3730', 'c1000000-0000-0000-0000-000000000007', NULL, 'Organist', NULL, NULL, NULL, NULL, true, 6),
  ('si004090', '3730', 'c1000000-0000-0000-0000-000000000007', NULL, 'Certified Copies of the Death Certificate', NULL, NULL, NULL, NULL, true, 7),
  ('si004091', '3730', 'c1000000-0000-0000-0000-000000000007', NULL, 'Public Transportation', NULL, NULL, NULL, NULL, true, 8),
  ('si004092', '3730', 'c1000000-0000-0000-0000-000000000007', NULL, 'Cemetery Fees', NULL, NULL, NULL, NULL, true, 9),
  ('si004093', '3730', 'c1000000-0000-0000-0000-000000000007', NULL, 'Outside Funeral Director Expense', NULL, NULL, NULL, NULL, true, 10),
  -- Caskets & Containers (PPL package representative items)
  ('si004094', '3730', 'c1000000-0000-0000-0000-000000000008', NULL, 'Recommended Casket — Heritage Tier', 'Choice of: Batesville Hadyn, Victoriaville Dominion HC Wood Maple Crepe, Batesville Fireside, or Batesville Eleanor Oak.', 4099.00, NULL, NULL, false, 1),
  ('si004095', '3730', 'c1000000-0000-0000-0000-000000000008', NULL, 'Recommended Casket — Honour Tier', 'Choice of: Batesville Watson, Victoriaville Sherwood Oak, Batesville Bailey, or Victoriaville Hartvic.', 3599.00, NULL, NULL, false, 2),
  ('si004096', '3730', 'c1000000-0000-0000-0000-000000000008', NULL, 'Recommended Casket — Tribute Tier', 'Choice of: Batesville Coleridge, Batesville Montgomery, Victoriaville Heavenly White, or Victoriaville Winfield.', 2999.00, NULL, NULL, false, 3),
  ('si004097', '3730', 'c1000000-0000-0000-0000-000000000008', NULL, 'Batesville Brockton Oak Ceremonial', 'Hardwood ceremonial casket used as a cremation container for the service.', 1599.00, NULL, NULL, false, 4),
  ('si004098', '3730', 'c1000000-0000-0000-0000-000000000008', NULL, 'Batesville Brockton Oak (1 Hour Rental)', 'Hardwood ceremonial casket rental used as a cremation container for the service.', 850.00, NULL, NULL, false, 5),
  ('si004099', '3730', 'c1000000-0000-0000-0000-000000000008', NULL, 'Vancouver Casket Cypress', 'Hollow cored poplar cremation container with natural finish.', 595.00, NULL, NULL, false, 6),
  -- Urns
  ('si004100', '3730', 'c1000000-0000-0000-0000-000000000009', NULL, 'Memorial Urn Selection — Heritage Tier', 'Choice of: LoveUrns HeartFelt™ Gold, Terrybear Eminence White Marble Urn, Granville Lucinda Blue Horizontal Urn, or Granville Charlotte Horizontal Urn.', 1295.00, NULL, NULL, false, 1),
  ('si004101', '3730', 'c1000000-0000-0000-0000-000000000009', NULL, 'Memorial Urn Selection — Honour Tier', 'Choice of: Urnes Bégin Versatile Urn Navy, LoveUrns Laurel Midnight, Terrybear Satori Ocean Pearl, or Batesville Memento Chest.', 795.00, NULL, NULL, false, 2),
  ('si004102', '3730', 'c1000000-0000-0000-0000-000000000009', NULL, 'Memorial Urn Selection — Tribute Tier', 'Choice of: LoveUrns Laurel Crimson, Urnes Bégin Sky Pewter, Mackenzie Classic Sky Blue, or Batesville Cherry Chest.', 595.00, NULL, NULL, false, 3),
  ('si004103', '3730', 'c1000000-0000-0000-0000-000000000009', 'UMCBFSZA7', 'Roses Vase', 'Cast bronze urn adorned with hand sculpted roses. (Urnes Bégin)', 2895.00, NULL, NULL, false, 4),
  ('si004104', '3730', 'c1000000-0000-0000-0000-000000000009', 'UWACFSJDT', 'Lucinda Blue Horizontal Urn', 'Handcrafted blue-green wood inlaid urn with a high-gloss lacquer finish. Features a peaceful dove with a gently flowing ribbon and delicate flowers. TSA-compliant. (Granville)', 1295.00, NULL, NULL, false, 5),
  ('si004105', '3730', 'c1000000-0000-0000-0000-000000000009', 'UWMGFSJDJ', 'Charlotte Horizontal Urn', 'Handcrafted dark and light green wood inlaid urn with a high-gloss lacquer finish. Features a geometric pattern with interlocking diagonals. TSA-compliant. (Granville)', 1295.00, NULL, NULL, false, 6),
  ('si004106', '3730', 'c1000000-0000-0000-0000-000000000009', 'UWMGFSJDP', 'Holden Horizontal Urn', 'Handcrafted black and jewel tone wood inlaid urn with a high-gloss lacquer finish. Features beautiful yellow and orange flowers with weaving soft green vines. TSA-compliant. (Granville)', 1295.00, NULL, NULL, false, 7),
  ('si004107', '3730', 'c1000000-0000-0000-0000-000000000009', 'UWMPFSJDX', 'Stephen Horizontal Urn', 'Handcrafted natural wood inlaid urn with a high-gloss lacquer finish. Features a refined, symmetrical design with overlapping lines. (Granville)', 1295.00, NULL, NULL, false, 8),
  ('si004108', '3730', 'c1000000-0000-0000-0000-000000000009', 'UOCMFSAE5', 'Classic Carrera Cultured Stone Urn', 'Durable cultured marble urn made from polymer and stone. (Mackenzie)', 595.00, NULL, NULL, false, 9),
  ('si004109', '3730', 'c1000000-0000-0000-0000-000000000009', 'UOCMFSAE6', 'Classic Sky Blue Cultured Stone Urn', 'Durable cultured marble urn made from polymer and stone. (Mackenzie)', 595.00, NULL, NULL, false, 10),
  ('si004110', '3730', 'c1000000-0000-0000-0000-000000000009', 'UOCMFSAE7', 'Classic Verde Green Cultured Stone Urn', 'Durable cultured marble urn made from polymer and stone. (Mackenzie)', 595.00, NULL, NULL, false, 11),
  ('si004111', '3730', 'c1000000-0000-0000-0000-000000000009', 'UOMBFSRMB', 'Eminence Black Marble Urn', 'Natural black marble urn that is fully customizable. Design elements include text, different corner designs, custom line art, glass photo inlay, gemstone embellishments, abalone shell inlay, and different engraving fill colors. (Terrybear)', 1295.00, NULL, NULL, false, 12),
  ('si004112', '3730', 'c1000000-0000-0000-0000-000000000009', 'UOMBFSRME', 'Eminence White Marble Urn', 'Natural white marble urn that is fully customizable. Design elements include text, different corner designs, custom line art, glass photo inlay, gemstone embellishments, abalone shell inlay, and different engraving fill colors. (Terrybear)', 1295.00, NULL, NULL, false, 13),
  ('si004113', '3730', 'c1000000-0000-0000-0000-000000000009', 'UOMBFSAE4', 'Carrera Marble Vase', 'Natural stone marble vase made from Carrera-inspired marble, polished to a gleaming shine. (Marble Products)', 595.00, NULL, NULL, false, 14),
  ('si004114', '3730', 'c1000000-0000-0000-0000-000000000009', 'UOOXFSAOV', 'Onyx Vase', 'Marble urn with variations of light green and dark earth tones. (Marble Products)', 595.00, NULL, NULL, false, 15),
  ('si004115', '3730', 'c1000000-0000-0000-0000-000000000009', 'UOMBFSAFA', 'Sand Rectangle Marble Urn', 'Sand-colored marble urn with natural accents. Suitable as single or companion. (Marble Products)', 510.00, NULL, NULL, false, 16),
  ('si004116', '3730', 'c1000000-0000-0000-0000-000000000009', 'UOMBFSAFB', 'Sand Vase Marble Urn', 'Sand-colored marble urn with natural accents. (Marble Products)', 495.00, NULL, NULL, false, 17),
  ('si004117', '3730', 'c1000000-0000-0000-0000-000000000009', 'UOUOFS5ZF', 'Love Dove Porcelain Urn', 'Porcelain full size dove shaped urn in white color. (LoveUrns)', 695.00, NULL, NULL, false, 18),
  ('si004118', '3730', 'c1000000-0000-0000-0000-000000000009', 'UOPLFS5ZF', 'White Soulful Shell Porcelain Urn', 'Porcelain full size shell shaped urn in white color. (LoveUrns)', 595.00, NULL, NULL, false, 19),
  ('si004119', '3730', 'c1000000-0000-0000-0000-000000000009', 'UOPLSB5ZF', 'Yellow Soulful Shell Porcelain Urn', 'Porcelain full size shell shaped urn in yellow color. (LoveUrns)', 595.00, NULL, NULL, false, 20),
  ('si004120', '3730', 'c1000000-0000-0000-0000-000000000009', 'UOPLFSAE9', 'Lenox Porcelain Urn', 'Classic and elegant porcelain vase made from Genuine Lenox Porcelain with 24 karat gold gilding. (Elegante Brass)', 495.00, NULL, NULL, false, 21),
  ('si004121', '3730', 'c1000000-0000-0000-0000-000000000009', 'UOCRFSARB', 'Rose Bouquet Ceramic Urn', 'Ceramic urn with hand-painted rose bouquet detail. Features a floral motif on a pearlescent ivory background. (Terrybear)', 350.00, NULL, NULL, false, 22),
  ('si004122', '3730', 'c1000000-0000-0000-0000-000000000009', 'UMZNFSOIL', 'Guardian Angel Bronze Urn', 'Precision casting, 100% solid bronze urn showing an angel crying over a tomb, and two doves taking their flight. (Urnes Bégin)', 4995.00, NULL, NULL, false, 23),
  ('si004123', '3730', 'c1000000-0000-0000-0000-000000000009', 'UMZNFSOII', 'Fidelity Couple Companion Bronze Urn', 'Precision casting, 100% solid bronze urns showing a man and a woman waiting for each other at the paradise doors. (Urnes Bégin)', 3895.00, NULL, NULL, false, 24),
  ('si004124', '3730', 'c1000000-0000-0000-0000-000000000009', 'UMZNFSOIJ', 'Fidelity Couple Woman Bronze Urn', 'Precision casting, 100% solid bronze urn showing a woman waiting at the paradise doors. (Urnes Bégin)', 1995.00, NULL, NULL, false, 25),
  ('si004125', '3730', 'c1000000-0000-0000-0000-000000000009', 'UMZNFSOIK', 'Fidelity Couple Man Bronze Urn', 'Precision casting, 100% solid bronze urn showing a man waiting at the paradise doors. (Urnes Bégin)', 1995.00, NULL, NULL, false, 26),
  ('si004126', '3730', 'c1000000-0000-0000-0000-000000000009', 'UMBZFSZER', 'Eternal Bronze Urn', 'Die cast 100% bronze urn with bronze dove ornament. (Urnes Bégin)', 1895.00, NULL, NULL, false, 27),
  ('si004127', '3730', 'c1000000-0000-0000-0000-000000000009', 'UMZNFSAGE', 'The Vine Companion Urn', 'Die-cast zinc urn, with a solid bronze face and vine embellishment. Purchased together. (Urnes Bégin)', 1535.00, NULL, NULL, false, 28),
  ('si004128', '3730', 'c1000000-0000-0000-0000-000000000009', 'UMALAHPPD', 'Double Versatile Pink Aluminum Urn', 'Elegant pink aluminum urn with customizable front plate offering high quality, vibrant images that reflect the unique relationship between two individuals as a companion urn. (Urnes Bégin)', 1395.00, NULL, NULL, false, 29),
  ('si004129', '3730', 'c1000000-0000-0000-0000-000000000009', 'UMALAHPV5', 'Double Versatile Matte Black Aluminum Urn', 'Elegant matte black aluminum urn with customizable front plate offering high quality, vibrant images that reflect the unique relationship between two individuals as a companion urn. (Urnes Bégin)', 1395.00, NULL, NULL, false, 30),
  ('si004130', '3730', 'c1000000-0000-0000-0000-000000000009', 'UMALAHPVG', 'Double Versatile Champagne Aluminum Urn', 'Elegant champagne aluminum urn with customizable front plate offering high quality, vibrant images that reflect the unique relationship between two individuals as a companion urn. (Urnes Bégin)', 1395.00, NULL, NULL, false, 31),
  ('si004131', '3730', 'c1000000-0000-0000-0000-000000000009', 'UMALAHPVL', 'Double Versatile Charcoal Aluminum Urn', 'Elegant charcoal aluminum urn with customizable front plate offering high quality, vibrant images that reflect the unique relationship between two individuals as a companion urn. (Urnes Bégin)', 1395.00, NULL, NULL, false, 32),
  ('si004132', '3730', 'c1000000-0000-0000-0000-000000000009', 'UMALAHPVR', 'Double Versatile Bronze Aluminum Urn', 'Elegant bronze aluminum urn with customizable front plate offering high quality, vibrant images that reflect the unique relationship between two individuals as a companion urn. (Urnes Bégin)', 1395.00, NULL, NULL, false, 33),
  ('si004133', '3730', 'c1000000-0000-0000-0000-000000000009', 'UMALAHPVV', 'Double Versatile Navy Aluminum Urn', 'Elegant navy aluminum urn with customizable front plate offering high quality, vibrant images that reflect the unique relationship between two individuals as a companion urn. (Urnes Bégin)', 1395.00, NULL, NULL, false, 34),
  ('si004134', '3730', 'c1000000-0000-0000-0000-000000000009', 'UMALAHPVW', 'Double Versatile Sparkling White Aluminum Urn', 'Elegant sparkling white aluminum urn with customizable front plate offering high quality, vibrant images that reflect the unique relationship between two individuals as a companion urn. (Urnes Bégin)', 1395.00, NULL, NULL, false, 35),
  ('si004135', '3730', 'c1000000-0000-0000-0000-000000000009', 'UMBRFSDTF', 'HeartFelt™ Gold Brass Urn', 'Solid Brass Heart shaped Full Size Urn with Crystal. (Keepsakes and/or accessories sold separately) (LoveUrns)', 1295.00, NULL, NULL, false, 36),
  ('si004136', '3730', 'c1000000-0000-0000-0000-000000000009', 'UMZNFSOIH', 'Personalized Double Doves Urn', 'Die cast zinc urn with a bronze face, with two dove bronze ornaments. (Urnes Bégin)', 1195.00, NULL, NULL, false, 37),
  ('si004137', '3730', 'c1000000-0000-0000-0000-000000000009', 'UMBZFSZLV', 'Lily of the Valley Urn', 'Die cast zinc urn with a solid bronze face, with a molded lily embellishment. (Urnes Bégin)', 1095.00, NULL, NULL, false, 38),
  ('si004138', '3730', 'c1000000-0000-0000-0000-000000000009', 'UMZNFSOIE', 'Double Oak Urn', 'Die cast zinc urn with bronze face, with an oak molded embellishment. (Urnes Bégin)', 1075.00, NULL, NULL, false, 39),
  ('si004139', '3730', 'c1000000-0000-0000-0000-000000000009', 'UMCBFSABF', 'Cast Bronze Rectangle Urn', 'Cast bronze construction with brushed and polished finish. (Batesville)', 1070.00, NULL, NULL, false, 40),
  ('si004140', '3730', 'c1000000-0000-0000-0000-000000000009', 'UMCBFSABE', 'Cast Bronze Cylinder Urn', 'Cast bronze construction with brushed and polished finish. (Batesville)', 910.00, NULL, NULL, false, 41),
  ('si004141', '3730', 'c1000000-0000-0000-0000-000000000009', 'UMBZFSZPB', 'Personalized Solid Bronze Urn', 'Die cast zinc urn with bronze face, with a bronze ornament from the personalized collection. Over a hundred ornaments available. (Urnes Bégin)', 895.00, NULL, NULL, false, 42),
  ('si004142', '3730', 'c1000000-0000-0000-0000-000000000009', 'UMZNFSAGF', 'The Vine Left Bronze Urn', 'Die-cast zinc urn, with a solid bronze face and vine embellishment. Design to the left of engraving plate. (Urnes Bégin)', 895.00, NULL, NULL, false, 43),
  ('si004143', '3730', 'c1000000-0000-0000-0000-000000000009', 'UMZNFSAGK', 'The Vine Right Bronze Urn', 'Die-cast zinc urn, solid bronze face, vine embellishment. Design to the right of engraving plate. (Urnes Bégin)', 895.00, NULL, NULL, false, 44),
  ('si004144', '3730', 'c1000000-0000-0000-0000-000000000009', 'UMZNFSOIB', 'Serenity Rose Urn', 'Die cast zinc urn with bronze rose ornament and grey brushed edge. (Urnes Bégin)', 895.00, NULL, NULL, false, 45),
  ('si004145', '3730', 'c1000000-0000-0000-0000-000000000009', 'UMZNFSOIC', 'Serenity Tree Urn', 'Die cast zinc urn with bronze tree ornament and grey brushed edge. (Urnes Bégin)', 895.00, NULL, NULL, false, 46),
  ('si004146', '3730', 'c1000000-0000-0000-0000-000000000009', 'UMZNFSOID', 'Serenity Plain Urn', 'Die cast zinc urn with grey brushed edge. (Urnes Bégin)', 895.00, NULL, NULL, false, 47),
  ('si004147', '3730', 'c1000000-0000-0000-0000-000000000009', 'UMBRFSLFP', 'Elegant Leaf Brass Urn', 'Brass urn with deep emerald finish complete with brass fern leaf detail. (LoveUrns)', 895.00, NULL, NULL, false, 48),
  ('si004148', '3730', 'c1000000-0000-0000-0000-000000000009', 'UMBRFSLFR', 'Simplicity Brass Urn', 'Brass and metal alloy urn with a radiant midnight finish and silver accents. (LoveUrns)', 795.00, NULL, NULL, false, 49),
  ('si004149', '3730', 'c1000000-0000-0000-0000-000000000009', 'UMBRFSASK', 'Satori Pink Pearl Brass Urn', 'Brass urn with beautiful pearl pink finish and metallic shimmer. Features an artistic, contemporary shape and polished bronze finish accents. (Terrybear)', 795.00, NULL, NULL, false, 50),
  ('si004150', '3730', 'c1000000-0000-0000-0000-000000000009', 'UMBRFSASO', 'Satori Ocean Pearl Brass Urn', 'Brass urn with beautiful pearl blue ocean finish and metallic shimmer. Features an artistic, contemporary shape and polished bronze finish accents. (Terrybear)', 795.00, NULL, NULL, false, 51),
  ('si004151', '3730', 'c1000000-0000-0000-0000-000000000009', 'UMBRFSASW', 'Satori White Pearl Brass Urn', 'Brass urn with beautiful pearl white finish and metallic shimmer. Features an artistic, contemporary shape and polished bronze finish accents. (Terrybear)', 795.00, NULL, NULL, false, 52),
  ('si004152', '3730', 'c1000000-0000-0000-0000-000000000009', 'UMBRFSLSG', 'Teardrop Matte Sage Green Brass Urn', 'Unique sage green teardrop shaped brass urn with a soft touch finish and brushed gold top. (LoveUrns)', 795.00, NULL, NULL, false, 53),
  ('si004153', '3730', 'c1000000-0000-0000-0000-000000000009', 'UMBZFSZMD', 'Memories Bronze Urn', 'Die cast zinc urn with bronze plate and bronze embellishments. (Urnes Bégin)', 795.00, NULL, NULL, false, 54),
  ('si004154', '3730', 'c1000000-0000-0000-0000-000000000009', 'UMBZFSZOL', 'Oak Left Bronze Urn', 'Die cast zinc urn with a solid bronze face, tree embellishment molded on the sides. Design on left. (Urnes Bégin)', 795.00, NULL, NULL, false, 55),
  ('si004155', '3730', 'c1000000-0000-0000-0000-000000000009', 'UMBZFSZOR', 'Oak Right Bronze Urn', 'Die cast zinc urn with a solid bronze face, tree embellishment molded on the sides. Design on right. (Urnes Bégin)', 795.00, NULL, NULL, false, 56),
  ('si004156', '3730', 'c1000000-0000-0000-0000-000000000009', 'UMALFSPG0', 'Versatile Urn Champagne', 'Sleek aluminum champagne urn with a customizable front plate offering high quality, vibrant images that reflect the unique personality and passions of your loved one. (Urnes Bégin)', 795.00, NULL, NULL, false, 57),
  ('si004157', '3730', 'c1000000-0000-0000-0000-000000000009', 'UMALFSPG1', 'Versatile Urn Charcoal', 'Sleek aluminum charcoal urn with a customizable front plate offering high quality, vibrant images that reflect the unique personality and passions of your loved one. (Urnes Bégin)', 795.00, NULL, NULL, false, 58),
  ('si004158', '3730', 'c1000000-0000-0000-0000-000000000009', 'UMALFSPG3', 'Versatile Urn Navy', 'Sleek aluminum navy urn with a customizable front plate offering high quality, vibrant images that reflect the unique personality and passions of your loved one. (Urnes Bégin)', 795.00, NULL, NULL, false, 59),
  ('si004159', '3730', 'c1000000-0000-0000-0000-000000000009', 'UMALFSPG4', 'Versatile Urn Pink', 'Sleek aluminum pink urn with a customizable front plate offering high quality, vibrant images that reflect the unique personality and passions of your loved one. (Urnes Bégin)', 795.00, NULL, NULL, false, 60),
  ('si004160', '3730', 'c1000000-0000-0000-0000-000000000009', 'UMALFSPG5', 'Versatile Urn Sparkling White', 'Sleek aluminum sparkling white urn with a customizable front plate offering high quality, vibrant images that reflect the unique personality and passions of your loved one. (Urnes Bégin)', 795.00, NULL, NULL, false, 61),
  ('si004161', '3730', 'c1000000-0000-0000-0000-000000000009', 'UMALFSPGZ', 'Versatile Urn Bronze', 'Sleek aluminum bronze urn with a customizable front plate offering high quality, vibrant images that reflect the unique personality and passions of your loved one. (Urnes Bégin)', 795.00, NULL, NULL, false, 62),
  ('si004162', '3730', 'c1000000-0000-0000-0000-000000000009', 'UMALFSPVY', 'Versatile Urn Matte Black', 'Sleek aluminum matte black urn with a customizable front plate offering high quality, vibrant images that reflect the unique personality and passions of your loved one. (Urnes Bégin)', 795.00, NULL, NULL, false, 63),
  ('si004163', '3730', 'c1000000-0000-0000-0000-000000000009', 'UMASFSLMB', 'Teardrop Matte Black Brass Urn', 'Unique matte black teardrop shaped brass urn with a soft touch finish and brushed gun metal top. (LoveUrns)', 795.00, NULL, NULL, false, 64),
  ('si004164', '3730', 'c1000000-0000-0000-0000-000000000009', 'UMBRFSAAF', 'Laurel White Pearl Vase', 'Alloy and brass vase with a pristine white hand-applied enamel design. (LoveUrns)', 795.00, NULL, NULL, false, 65),
  ('si004165', '3730', 'c1000000-0000-0000-0000-000000000009', 'UMBRFSAAU', 'Laurel Midnight Vase', 'Alloy and brass vase with a rich charcoal hand-applied enamel design. (LoveUrns)', 795.00, NULL, NULL, false, 66),
  ('si004166', '3730', 'c1000000-0000-0000-0000-000000000009', 'UMBRFSLFS', 'Soul Bird Urn', 'Elegant and sleek brass bird shaped urn. (Keepsakes and/or accessories sold separately) (LoveUrns)', 715.00, NULL, NULL, false, 67),
  ('si004167', '3730', 'c1000000-0000-0000-0000-000000000009', 'UMADFS5AU', 'Amore™ Red Urn', 'Solid Brass Full Size Urn with Red and Polished Silver Finish. Compartment on top to keep memorable items. (LoveUrns)', 695.00, NULL, NULL, false, 68),
  ('si004168', '3730', 'c1000000-0000-0000-0000-000000000009', 'UMABFS5AU', 'Laurel Crimson Urn', 'Crimson Color Metal Full Size Urn with Brushed Gold Lid. (Keepsakes and/or accessories sold separately) (LoveUrns)', 595.00, NULL, NULL, false, 69),
  ('si004169', '3730', 'c1000000-0000-0000-0000-000000000009', 'UMBRFSLFX', 'Wings of Hope Blue Urn', 'Elegant butterfly designed brass and enamel urn with blue inlays and pearlescent finish. (LoveUrns)', 595.00, NULL, NULL, false, 70),
  ('si004170', '3730', 'c1000000-0000-0000-0000-000000000009', 'UMBRFSLFY', 'Wings of Hope Lavender Urn', 'Elegant butterfly designed brass and enamel urn with lavender inlays and pearlescent finish. (LoveUrns)', 595.00, NULL, NULL, false, 71),
  ('si004171', '3730', 'c1000000-0000-0000-0000-000000000009', 'UMBRFSLFZ', 'Wings of Hope Pearl Urn', 'Elegant butterfly designed brass and enamel urn with white inlays and pearlescent finish. (LoveUrns)', 595.00, NULL, NULL, false, 72),
  ('si004172', '3730', 'c1000000-0000-0000-0000-000000000009', 'UMBRFSDLY', 'Flying Doves Urn', 'Blue Metal Full Size Urn with hand engraved Dove Design. (Keepsakes and/or accessories sold separately) (LoveUrns)', 595.00, NULL, NULL, false, 73),
  ('si004173', '3730', 'c1000000-0000-0000-0000-000000000009', 'UMBRFSAMP', 'Mother of Pearl Elite Urn', 'Polished brass urn with iridescent Mother of Pearl mosaic tile. (Keepsakes and/or accessories sold separately) (LoveUrns)', 595.00, NULL, NULL, false, 74),
  ('si004174', '3730', 'c1000000-0000-0000-0000-000000000009', 'UMBRFSLWY', 'Wings of Hope Yellow Urn', 'Elegant butterfly designed brass and enamel urn with yellow inlays and pearlescent finish. (LoveUrns)', 595.00, NULL, NULL, false, 75),
  ('si004175', '3730', 'c1000000-0000-0000-0000-000000000009', 'UMZNFSOHX', 'Sky Pewter Urn', 'Die cast zinc urn with a pewter marbling finish showing a sky with two bronze angel ornaments. (Urnes Bégin)', 595.00, NULL, NULL, false, 76),
  ('si004176', '3730', 'c1000000-0000-0000-0000-000000000009', 'UMZNFSOHY', 'Sky Pink Urn', 'Die cast zinc urn with a pink marbling finish showing a sky with two bronze angel ornaments. (Urnes Bégin)', 595.00, NULL, NULL, false, 77),
  ('si004177', '3730', 'c1000000-0000-0000-0000-000000000009', 'UMZNFSOHZ', 'Sky Brown Urn', 'Die cast zinc urn with a brown marbling finish showing a sky with two bronze angel ornaments. (Urnes Bégin)', 595.00, NULL, NULL, false, 78),
  ('si004178', '3730', 'c1000000-0000-0000-0000-000000000009', 'UMZNFSOIA', 'Sky Blue Urn', 'Die cast zinc urn with a blue marbling finish showing a sky with two bronze angel ornaments. (Urnes Bégin)', 595.00, NULL, NULL, false, 79),
  ('si004179', '3730', 'c1000000-0000-0000-0000-000000000009', 'UMSBFSAFG', 'Sheet Bronze Cylinder Urn', 'Constructed from 64 oz sheet bronze with brushed and polished finish. (Batesville)', 595.00, NULL, NULL, false, 80),
  ('si004180', '3730', 'c1000000-0000-0000-0000-000000000009', 'UMSBFSAFI', 'Sheet Bronze Rectangle Urn', 'Constructed from 64 oz sheet bronze with brushed and polished finish. (Batesville)', 595.00, NULL, NULL, false, 81),
  ('si004181', '3730', 'c1000000-0000-0000-0000-000000000009', 'UMZNFSZA4', 'Flight of Doves Left Urn', 'Die cast zinc urn in an "S" shape, metal grey finish and 3 silver dove ornaments. (Urnes Bégin)', 595.00, NULL, NULL, false, 82),
  ('si004182', '3730', 'c1000000-0000-0000-0000-000000000009', 'UMZNFSZA5', 'Flight of Doves Right Urn', 'Die cast zinc urn in an "S" shape, metal grey finish and 3 silver dove ornaments. (Urnes Bégin)', 595.00, NULL, NULL, false, 83),
  ('si004183', '3730', 'c1000000-0000-0000-0000-000000000009', 'UMCBFSADS', 'Omega Vase', 'Cast bronze vase with polished gold-tone accents. (Terrybear)', 545.00, NULL, NULL, false, 84),
  ('si004184', '3730', 'c1000000-0000-0000-0000-000000000009', 'UMBRFSAFM', 'Silver Vase', 'Polished antique silver-toned brass with gold-toned accents. (Terrybear)', 545.00, NULL, NULL, false, 85),
  ('si004185', '3730', 'c1000000-0000-0000-0000-000000000009', 'UMBRFSDFO', 'Art Deco Urn', 'Brass urn with classic and sleek style with enameled bands. (Keepsakes and/or accessories sold separately) (LoveUrns)', 495.00, NULL, NULL, false, 86),
  ('si004186', '3730', 'c1000000-0000-0000-0000-000000000009', 'UMBRFSLFO', 'Divine Urn', 'Beautifully designed blue brass and enamel urn with enameled finish. (LoveUrns)', 495.00, NULL, NULL, false, 87),
  ('si004187', '3730', 'c1000000-0000-0000-0000-000000000009', 'UMBRFSABQ', 'Dove Vase', 'Nickel-plated brass vase with blue accents and dove design. (Keepsakes and/or accessories sold separately) (LoveUrns)', 495.00, NULL, NULL, false, 88),
  ('si004188', '3730', 'c1000000-0000-0000-0000-000000000009', 'UMBRFSADP', 'Moonlight Blue Vase', 'Brass urn with a deep blue finish with metallic shimmer. Features a contemporary shape and pewter-finish accent bands. (Terrybear)', 460.00, NULL, NULL, false, 89),
  ('si004189', '3730', 'c1000000-0000-0000-0000-000000000009', 'UMBRFSAPE', 'Bright Stripes Blue Urn', 'Brass urn with bright blue striped finish. (Terrybear)', 425.00, NULL, NULL, false, 90),
  ('si004190', '3730', 'c1000000-0000-0000-0000-000000000009', 'UMBRFSARS', 'Bright Stripes Red Urn', 'Brass urn with bright crimson striped finish. (Terrybear)', 425.00, NULL, NULL, false, 91),
  ('si004191', '3730', 'c1000000-0000-0000-0000-000000000009', 'UMBRFSAUP', 'Bright Stripes Purple Urn', 'Brass urn with bright purple striped finish. (Terrybear)', 425.00, NULL, NULL, false, 92),
  ('si004192', '3730', 'c1000000-0000-0000-0000-000000000009', 'UMBRACLTE', 'CuddleBear™ Blue Child Urn', 'Teddy Bear shaped Child Urn in Blue finish with Crystal. (Keepsakes and/or accessories sold separately) (LoveUrns)', 195.00, NULL, NULL, false, 93),
  ('si004193', '3730', 'c1000000-0000-0000-0000-000000000009', 'UMBRACLTP', 'CuddleBear™ Pink Child Urn', 'Teddy Bear shaped Child Urn in Pink finish with Crystal. (Keepsakes and/or accessories sold separately) (LoveUrns)', 195.00, NULL, NULL, false, 94),
  ('si004194', '3730', 'c1000000-0000-0000-0000-000000000009', 'UMZNACZ88', 'CuddleBear™ White Child Urn', 'Teddy Bear shaped Child Urn in White finish with Crystal. (LoveUrns)', 195.00, NULL, NULL, false, 95),
  ('si004195', '3730', 'c1000000-0000-0000-0000-000000000009', 'UW3QFSGMU', 'Classic Stained Maple Urn', 'Urban grey stained maple urn with customizable front plates. (Urnes Bégin)', 895.00, NULL, NULL, false, 96),
  ('si004196', '3730', 'c1000000-0000-0000-0000-000000000009', 'UWMPFSACR', 'Bois Silver Maple Urn', 'Canadian maple wood urn with dark brown stain and contrasting dark walnut inlay stripe. (Urnes Bégin)', 895.00, NULL, NULL, false, 97),
  ('si004197', '3730', 'c1000000-0000-0000-0000-000000000009', 'UWBHFSADF', 'Memento Chest Urn', 'Mixed hardwoods and burl wood veneer top with wood inlay and high gloss lacquer finish. Features plastic insert and one key. TSA-compliant. (Batesville)', 795.00, NULL, NULL, false, 98),
  ('si004198', '3730', 'c1000000-0000-0000-0000-000000000009', 'UWWDFSAMA', 'Moments Azalea Urn and Frame', 'Mixed hardwood urn with removable Tiffany-inspired Azalea frame keepsake. Frame keepsake is magnetically attached to urn and can be displayed separately. (Terrybear)', 690.00, NULL, NULL, false, 99),
  ('si004199', '3730', 'c1000000-0000-0000-0000-000000000009', 'UWAKFSACV', 'Mozart Memory Chest Urn', 'Medium Density Fiberboard with veneer memory chest in bombe shape reminiscent of European furniture. TSA-compliant. (Terrybear)', 595.00, NULL, NULL, false, 100),
  ('si004200', '3730', 'c1000000-0000-0000-0000-000000000009', 'UWBHFSABH', 'Cherry Chest Urn', 'Composite wood veneer chest with cherry-stained finish. TSA-compliant. (Batesville)', 595.00, NULL, NULL, false, 101),
  ('si004201', '3730', 'c1000000-0000-0000-0000-000000000009', 'UWBHFSADQ', 'Natural Cube Urn', 'Solid birchwood with burl wood veneer and high gloss lacquer finish. TSA-compliant. (Batesville)', 495.00, NULL, NULL, false, 102),
  ('si004202', '3730', 'c1000000-0000-0000-0000-000000000009', 'UWTAFSFME', 'Modern Essential Vintage Urn', 'Acacia hardwood urn with a contemporary design in a vintage finish. Each urn features a unique woodgrain. TSA-compliant. (Terrybear)', 495.00, NULL, NULL, false, 103),
  ('si004203', '3730', 'c1000000-0000-0000-0000-000000000009', 'UWTAFSFMS', 'Modern Essential Sable Urn', 'Acacia hardwood urn with a contemporary design in a sable finish. Each urn features a unique woodgrain. TSA-compliant. (Terrybear)', 495.00, NULL, NULL, false, 104),
  ('si004204', '3730', 'c1000000-0000-0000-0000-000000000009', 'UOFBFSANO', 'Natural Box Urn', 'Composite wood with a paper wrap providing a natural wood grain look with matte polish. Features a sliding bottom with one point access for easy use. TSA-compliant. (Batesville)', 200.00, NULL, NULL, false, 105),
  ('si004205', '3730', 'c1000000-0000-0000-0000-000000000009', 'UWXCFSZLT', 'Living Tribute Urn', 'Handmade wooden urn with vibrant grain and a finely sanded surface; comes with your choice of succulent. TSA-compliant. (BioLife)', 895.00, NULL, NULL, false, 106),
  ('si004206', '3730', 'c1000000-0000-0000-0000-000000000009', 'UOBDFSAFE', 'The Living Urn', 'Natural fiber biodegradable urn and tree planting system, designed to grow a beautiful memory tree, plant, or flowers. Kit includes biodegradable urn, RootProtect® neutralizing agent, aged wood chips, and handmade bamboo case. Includes tree of choice. TSA-compliant. (BioLife)', 595.00, NULL, NULL, false, 107),
  ('si004207', '3730', 'c1000000-0000-0000-0000-000000000009', 'UORDFSARP', 'Carpel Rock Salt Urn', 'Full-capacity urn that is a perfect vessel for a natural disposition. Designed for sea burials or water funerals; guaranteed to dissolve in four hours. TSA-compliant. (Marble Products)', 580.00, NULL, NULL, false, 108),
  ('si004208', '3730', 'c1000000-0000-0000-0000-000000000009', 'UOBGFS5V5', 'OceanBlue™ Eco Urn', 'Biodegradable Full Size Urn in Blue and White color. TSA-compliant. (LoveUrns)', 495.00, NULL, NULL, false, 109),
  ('si004209', '3730', 'c1000000-0000-0000-0000-000000000009', 'UODFFS5V4', 'EarthBrown™ Eco Urn', 'Biodegradable Full Size Urn in Brown and White color. TSA-compliant. (LoveUrns)', 495.00, NULL, NULL, false, 110),
  ('si004210', '3730', 'c1000000-0000-0000-0000-000000000009', 'UOBDFS5SY', 'ShiftingSand™ Footprints Urn', 'Urn with Footprints in sand finish. TSA-compliant. (LoveUrns)', 495.00, NULL, NULL, false, 111),
  ('si004211', '3730', 'c1000000-0000-0000-0000-000000000009', 'UOAQFS1G3', 'Beacon Water Urn', 'Biodegradable urn designed to simplify the scattering process in a body of water. Durable, dignified, easy-to-use container created from recycled paper and cardboard with no metal components and can be personalized by writing on the surface. Includes bamboo case. TSA-compliant. (BioLife)', 395.00, NULL, NULL, false, 112),
  ('si004212', '3730', 'c1000000-0000-0000-0000-000000000009', 'UOALFS1G4', 'Earth Scattering Cylinder Large', 'The patented Eco Scattering Urn is a beautiful and dignified option for families that want to scatter the ashes of a loved one. Hand-made from bamboo, rubbed with natural oil. Lid secured with a birch wood locking pin. Comes with a hand-sewn premium cotton bag sleeve. TSA-compliant. (BioLife)', 295.00, NULL, NULL, false, 113),
  ('si004213', '3730', 'c1000000-0000-0000-0000-000000000009', 'UOBDFSADR', 'Ocean Sunset Scattering Tube', 'Scattering tube designed to simplify the scattering process. Durable, dignified, easy-to-use container created from recycled paper and cardboard with no metal components. TSA-compliant. (BioLife)', 195.00, NULL, NULL, false, 114),
  ('si004214', '3730', 'c1000000-0000-0000-0000-000000000009', 'UORPFS1SU', 'Simplicity Scattering Tube', 'Scattering tube designed to simplify the scattering process. Durable, dignified, easy-to-use container created from recycled paper and cardboard with no metal components. TSA-compliant. (BioLife)', 195.00, NULL, NULL, false, 115),
  ('si004215', '3730', 'c1000000-0000-0000-0000-000000000009', 'UORPFSUF4', 'Ascending Dove Scattering Tube', 'Scattering tube designed to simplify the scattering process. Durable, dignified, easy-to-use container created from recycled paper and cardboard with no metal components. TSA-compliant. (BioLife)', 195.00, NULL, NULL, false, 116),
  ('si004216', '3730', 'c1000000-0000-0000-0000-000000000009', 'UORPFSUF6', 'Mountain View Scattering Tube', 'Scattering tube designed to simplify the scattering process. Durable, dignified, easy-to-use container created from recycled paper and cardboard with no metal components. TSA-compliant. (BioLife)', 195.00, NULL, NULL, false, 117),
  ('si004217', '3730', 'c1000000-0000-0000-0000-000000000009', 'UORPSB1SU', 'Field of Flowers Scattering Tube', 'Scattering tube designed to simplify the scattering process. Durable, dignified, easy-to-use container created from recycled paper and cardboard with no metal components. TSA-compliant. (BioLife)', 195.00, NULL, NULL, false, 118),
  ('si004218', '3730', 'c1000000-0000-0000-0000-000000000009', 'UOLRFSACW', 'Leather Cylinder Urn', 'Slate brown bonded leather cylinder. TSA-compliant. (Batesville)', 195.00, NULL, NULL, false, 119),
  ('si004219', '3730', 'c1000000-0000-0000-0000-000000000009', 'UMSTFSAGJ', 'Utility Minimum Container', '20 gauge carbon steel construction with black semi-gloss finish. (Batesville)', 195.00, NULL, NULL, false, 120),
  ('si004220', '3730', 'c1000000-0000-0000-0000-000000000009', 'UMALFSADA', 'Mailer Container', 'Composite wood with aluminum like texture, acceptable to ship through the mail courier service. (Batesville)', 125.00, NULL, NULL, false, 121),
  -- Keepsakes
  ('si004221', '3730', 'c1000000-0000-0000-0000-000000000010', 'UWABKSJDK', 'Charlotte Keepsake Box', 'Handcrafted dark and light green wood inlaid keepsake with a high-gloss lacquer finish. Features a geometric pattern with interlocking diagonals. TSA-compliant. (Granville)', 495.00, NULL, NULL, false, 1),
  ('si004222', '3730', 'c1000000-0000-0000-0000-000000000010', 'UWABKSJDR', 'Holden Keepsake Box', 'Handcrafted black and jewel tone wood inlaid keepsake with a high-gloss lacquer finish. Features beautiful yellow and orange flowers with weaving soft green vines. TSA-compliant. (Granville)', 495.00, NULL, NULL, false, 2),
  ('si004223', '3730', 'c1000000-0000-0000-0000-000000000010', 'UWABKSJDU', 'Lucinda Blue Keepsake Box', 'Handcrafted blue-green wood inlaid keepsake with a high-gloss lacquer finish. Features a peaceful dove with a gently flowing ribbon and delicate flowers. TSA-compliant. (Granville)', 495.00, NULL, NULL, false, 3),
  ('si004224', '3730', 'c1000000-0000-0000-0000-000000000010', 'UWABKSJDY', 'Stephen Keepsake Box', 'Handcrafted natural wood inlaid keepsake with a high-gloss lacquer finish. Features a refined, symmetrical design with overlapping lines. TSA-compliant. (Granville)', 495.00, NULL, NULL, false, 4),
  ('si004225', '3730', 'c1000000-0000-0000-0000-000000000010', 'UCE3UETMEX', 'Water Swirl Tumbler Votive', 'The Serenity Glass Swirl Collection is a series of unique soft glass items. (Eternity’s Touch)', 365.00, NULL, NULL, false, 5),
  ('si004226', '3730', 'c1000000-0000-0000-0000-000000000010', 'UCE3UETOEX', 'Fire Swirl Tumbler Votive', 'The Serenity Glass Swirl Collection is a series of unique soft glass items. (Eternity’s Touch)', 365.00, NULL, NULL, false, 6),
  ('si004227', '3730', 'c1000000-0000-0000-0000-000000000010', 'UCE3UET5EX', 'Earth Swirl Egg', 'The Serenity Glass Swirl Collection is a series of unique soft glass items. (Eternity’s Touch)', 345.00, NULL, NULL, false, 7),
  ('si004228', '3730', 'c1000000-0000-0000-0000-000000000010', 'UCE3UET7EX', 'Wind Swirl Egg', 'The Serenity Glass Swirl Collection is a series of unique soft glass items. (Eternity’s Touch)', 345.00, NULL, NULL, false, 8),
  ('si004229', '3730', 'c1000000-0000-0000-0000-000000000010', 'UOGLKSABL', 'Blue Butterfly Light of Remembrance™', 'Tiffany-inspired lamp with butterfly design. (Terrybear)', 255.00, NULL, NULL, false, 9),
  ('si004230', '3730', 'c1000000-0000-0000-0000-000000000010', 'UOALKS1G5', 'Earth Scattering Cylinder Small', 'The patented Eco Scattering Urn is a beautiful and dignified option for families that want to scatter the ashes of a loved one. Hand-made from bamboo, rubbed with natural oil. Lid secured with a birch wood locking pin. Comes with a hand-sewn premium cotton bag sleeve. TSA-compliant. (BioLife)', 195.00, NULL, NULL, false, 10),
  ('si004231', '3730', 'c1000000-0000-0000-0000-000000000010', 'UMBRKHAFK', 'Silver Heart Keepsake', 'Polished antique silver brass heart with gold-tone accents. (Terrybear)', 155.00, NULL, NULL, false, 11),
  ('si004232', '3730', 'c1000000-0000-0000-0000-000000000010', 'UMBRKHAME', 'Midnight Pewter Heart Keepsake', 'Concave heart with brushed pewter finish and midnight accents. (LoveUrns)', 155.00, NULL, NULL, false, 12),
  ('si004233', '3730', 'c1000000-0000-0000-0000-000000000010', 'UMBRKHDKG', 'Heart Brushed Gold Keepsake', 'Solid Brass Heart shaped Keepsake in brushed gold finish. (LoveUrns)', 155.00, NULL, NULL, false, 13),
  ('si004234', '3730', 'c1000000-0000-0000-0000-000000000010', 'UMBRKHDPG', 'Heart Polished Gold Keepsake', 'Solid Brass Heart shaped Keepsake in polished gold finish. (LoveUrns)', 155.00, NULL, NULL, false, 14),
  ('si004235', '3730', 'c1000000-0000-0000-0000-000000000010', 'UMBRKHDPS', 'Heart Polished Silver Keepsake', 'Solid Brass Heart shaped Keepsake in polished silver finish. (LoveUrns)', 155.00, NULL, NULL, false, 15),
  ('si004236', '3730', 'c1000000-0000-0000-0000-000000000010', 'UMBRKS5Y6', 'ComfortCross™ Gold Keepsake', 'Solid Brass Cross shaped Keepsake in Polished Gold finish. (LoveUrns)', 155.00, NULL, NULL, false, 16),
  ('si004237', '3730', 'c1000000-0000-0000-0000-000000000010', 'UMBRKSDTK', 'HeartFelt™ Gold Keepsake', 'Solid Brass Heart shaped Keepsake Urn with Crystal. (LoveUrns)', 155.00, NULL, NULL, false, 17),
  ('si004238', '3730', 'c1000000-0000-0000-0000-000000000010', 'UMBRKSLF4', 'SoulBird Keepsake', 'Unique bird shaped keepsake in a brilliant polished finish. (LoveUrns)', 155.00, NULL, NULL, false, 18),
  ('si004239', '3730', 'c1000000-0000-0000-0000-000000000010', 'UMBRKSLFO', 'Comfort Cross Silver Keepsake', 'Beautifully crafted cross with smooth design. (LoveUrns)', 155.00, NULL, NULL, false, 19),
  ('si004240', '3730', 'c1000000-0000-0000-0000-000000000010', 'UMABKSLMT', 'Matte Black Teardrop Keepsake', 'Unique matte black teardrop shaped keepsake with a soft touch finish and brushed gun metal top. (LoveUrns)', 155.00, NULL, NULL, false, 20),
  ('si004241', '3730', 'c1000000-0000-0000-0000-000000000010', 'UMAFKH5AS', 'Heart Laurel Crimson Keepsake', 'Crimson Color Heart Shaped Keepsake. (LoveUrns)', 155.00, NULL, NULL, false, 21),
  ('si004242', '3730', 'c1000000-0000-0000-0000-000000000010', 'UMASKSLKD', 'Sage Green Teardrop Keepsake', 'Unique sage green teardrop shaped keepsake with a soft touch finish and brushed gold top. (LoveUrns)', 155.00, NULL, NULL, false, 22),
  ('si004243', '3730', 'c1000000-0000-0000-0000-000000000010', 'UMAFKS5AT', 'Laurel Crimson Keepsake', 'Crimson Color Metal Keepsake Size Urn with Brushed Gold Lid. (LoveUrns)', 145.00, NULL, NULL, false, 23),
  ('si004244', '3730', 'c1000000-0000-0000-0000-000000000010', 'UMAGKSNFT', 'Lenox Keepsake', 'Classic and elegant porcelain keepsake made from Genuine Lenox Porcelain with 24 karat gold gilding. (Elegante Brass)', 145.00, NULL, NULL, false, 24),
  ('si004245', '3730', 'c1000000-0000-0000-0000-000000000010', 'UMADKSDRM', 'Amore™ Red Keepsake', 'Solid Brass Keepsake with Red and Polished Silver Finish. (LoveUrns)', 145.00, NULL, NULL, false, 25),
  ('si004246', '3730', 'c1000000-0000-0000-0000-000000000010', 'UMAEKSLFR', 'Laurel Midnight Keepsake', 'Keepsake featuring silver accents with enamel inlay. (LoveUrns)', 145.00, NULL, NULL, false, 26),
  ('si004247', '3730', 'c1000000-0000-0000-0000-000000000010', 'UMAEKSLFS', 'Laurel Pearl Keepsake', 'Keepsake featuring silver accents with enamel inlay. (LoveUrns)', 145.00, NULL, NULL, false, 27),
  ('si004248', '3730', 'c1000000-0000-0000-0000-000000000010', 'UMBRKSLFP', 'Flying Doves Keepsake', 'Timeless brass keepsake in a blue tone with brushed pewter accents. (LoveUrns)', 145.00, NULL, NULL, false, 28),
  ('si004249', '3730', 'c1000000-0000-0000-0000-000000000010', 'UMBRKSLGM', 'Wings of Hope Blue Keepsake', 'Elegant butterfly design keepsake with blue inlays and pearlescent finish. (LoveUrns)', 145.00, NULL, NULL, false, 29),
  ('si004250', '3730', 'c1000000-0000-0000-0000-000000000010', 'UMBRKSLGN', 'Wings of Hope Lavender Keepsake', 'Elegant butterfly design keepsake with lavender inlays and pearlescent finish. (LoveUrns)', 145.00, NULL, NULL, false, 30),
  ('si004251', '3730', 'c1000000-0000-0000-0000-000000000010', 'UMBRKSLGS', 'Wings of Hope Pearl Keepsake', 'Elegant butterfly design keepsake with lavender inlays and pearlescent finish. (LoveUrns)', 145.00, NULL, NULL, false, 31),
  ('si004252', '3730', 'c1000000-0000-0000-0000-000000000010', 'UMBRKSLW1', 'Wings of Hope Yellow Keepsake', 'Elegant butterfly design keepsake with yellow inlays and pearlescent finish. (LoveUrns)', 145.00, NULL, NULL, false, 32),
  ('si004253', '3730', 'c1000000-0000-0000-0000-000000000010', 'UMBRMKABP', 'Dove Mini Keepsake', 'Nickel-plated brass vase mini keepsake with blue accents and dove design. (LoveUrns)', 145.00, NULL, NULL, false, 33),
  ('si004254', '3730', 'c1000000-0000-0000-0000-000000000010', 'UMBRMKMHO', 'Mother of Pearl™ Keepsake', 'Solid Brass Keepsake urn with Mother of Pearl decoration. (LoveUrns)', 145.00, NULL, NULL, false, 34),
  ('si004255', '3730', 'c1000000-0000-0000-0000-000000000010', 'UMBRKSDLK', 'Elegant Leaf™ Keepsake', 'Green Color Metal Keepsake with Leaf Motif. (LoveUrns)', 145.00, NULL, NULL, false, 35),
  ('si004256', '3730', 'c1000000-0000-0000-0000-000000000010', 'UMBRKHADO', 'Moonlight Heart Keepsake', 'Brass heart keepsake showcases a deep blue finish with a metallic shimmer. (Terrybear)', 145.00, NULL, NULL, false, 36),
  ('si004257', '3730', 'c1000000-0000-0000-0000-000000000010', 'UMBRFSDFP', 'Art Deco Keepsake', 'Brass keepsake with classic and sleek style with enameled bands. (LoveUrns)', 145.00, NULL, NULL, false, 37),
  ('si004258', '3730', 'c1000000-0000-0000-0000-000000000010', 'UMZNKSZSY', 'Simplicity™ Keepsake', 'Midnight Metal Keepsake with silver lid and base. (LoveUrns)', 145.00, NULL, NULL, false, 38),
  ('si004259', '3730', 'c1000000-0000-0000-0000-000000000010', 'UOMBMKAEZ', 'Sand Mini Keepsake', 'Sand-colored marble mini keepsake urn with natural accents. (Marble Products)', 145.00, NULL, NULL, false, 39),
  ('si004260', '3730', 'c1000000-0000-0000-0000-000000000010', 'UORPMK1DR', 'Mini Scattering Tube - Sunset', 'The Mini Sunset scattering tube is designed to simplify the scattering process. Durable, dignified, easy-to-use container created from recycled paper and cardboard with no metal components. TSA-compliant. (BioLife)', 125.00, NULL, NULL, false, 40),
  ('si004261', '3730', 'c1000000-0000-0000-0000-000000000010', 'UORPMK1F4', 'Mini Scattering Tube - Ascending', 'The Mini Ascending scattering tube is designed to simplify the scattering process. Durable, dignified, easy-to-use container created from recycled paper and cardboard with no metal components. TSA-compliant. (BioLife)', 125.00, NULL, NULL, false, 41),
  ('si004262', '3730', 'c1000000-0000-0000-0000-000000000010', 'UORPMK1FN', 'Mini Scattering Tube - Simplicity', 'The Mini Simplicity scattering tube is designed to simplify the scattering process. Durable, dignified, easy-to-use container created from recycled paper and cardboard with no metal components. TSA-compliant. (BioLife)', 125.00, NULL, NULL, false, 42),
  -- Jewelry
  ('si004263', '3730', 'c1000000-0000-0000-0000-000000000011', 'PCGUCEXUY41EX', '10K Yellow Gold Claddagh Pendant', 'This hand crafted pendant, modeled after the traditional Claddagh Ring popular in Irish heritage, holds the traditional design symbolizing love, friendship, and loyalty while having the ability to be personalized in remembrance of your loved one. (Eternity’s Touch)', 1795.00, NULL, NULL, false, 1),
  ('si004264', '3730', 'c1000000-0000-0000-0000-000000000011', 'UCEVNYAGEX', 'Yellow Gold Oval Keepsake', '10K yellow gold rimmed oval keepsake with thumbprint, holding your loved one’s remains on a 10k gold curb chain with spring ring clasp. (Eternity’s Touch)', 950.00, NULL, NULL, false, 2),
  ('si004265', '3730', 'c1000000-0000-0000-0000-000000000011', 'XFDKSD6', 'Yellow Gold Oval Pendant', '10K yellow gold oval pendant with thumbprint on a 10k gold curb chain with spring ring clasp. (Eternity’s Touch)', 950.00, NULL, NULL, false, 3),
  ('si004266', '3730', 'c1000000-0000-0000-0000-000000000011', 'UCNPUDCOBX', 'Cross Pendant, 14kt Gold', '14kt gold cross pendant without chain. (Batesville)', 595.00, NULL, NULL, false, 4),
  ('si004267', '3730', 'c1000000-0000-0000-0000-000000000011', 'KHSXFDKSA9', 'Sterling Silver Classic Heart Bracelet', '.925 sterling silver flat classic heart on 7.5” sterling silver toggle style bracelet with thumbprint. (Eternity’s Touch)', 515.00, NULL, NULL, false, 5),
  ('si004268', '3730', 'c1000000-0000-0000-0000-000000000011', 'UCNCWDWNBX', 'Women''s Chain, 14kt Gold', 'Rope chain in 14kt gold. (Batesville)', 395.00, NULL, NULL, false, 6),
  ('si004269', '3730', 'c1000000-0000-0000-0000-000000000011', 'UCNBMO9FX', 'Black Braided Leather Memento Bracelet (L)', 'Black braided leather memento bracelet with stainless steel bead. (LoveUrns)', 375.00, NULL, NULL, false, 7),
  ('si004270', '3730', 'c1000000-0000-0000-0000-000000000011', 'UCNBMOZ9FX', 'Cognac Smooth Leather Memento Bracelet (L)', 'Cognac smooth leather memento bracelet with stainless steel bead. (LoveUrns)', 375.00, NULL, NULL, false, 8),
  ('si004271', '3730', 'c1000000-0000-0000-0000-000000000011', 'UCNBUO7YDX', 'Red-Black Cord Memento Bracelet (L)', 'Red-Black Cord Memento Bracelet with stainless steel bead. (LoveUrns)', 375.00, NULL, NULL, false, 9),
  ('si004272', '3730', 'c1000000-0000-0000-0000-000000000011', 'UCNBUO8YDX', 'Blue-White Cord Memento Bracelet (L)', 'Blue-White Cord Memento Bracelet with stainless steel bead. (LoveUrns)', 375.00, NULL, NULL, false, 10),
  ('si004273', '3730', 'c1000000-0000-0000-0000-000000000011', 'UCNBUO9YDX', 'Dark Green Cord Memento Bracelet (L)', 'Dark Green Cord Memento Bracelet with stainless steel bead. (LoveUrns)', 375.00, NULL, NULL, false, 11),
  ('si004274', '3730', 'c1000000-0000-0000-0000-000000000011', 'UCIBMO9LFX', 'Brown Smooth Leather Memento Bracelet (L)', 'Brown smooth leather memento bracelet with stainless steel bead. (LoveUrns)', 375.00, NULL, NULL, false, 12),
  ('si004275', '3730', 'c1000000-0000-0000-0000-000000000011', 'UCEVNSAKEX', 'Sterling Silver Oval Keepsake (Urn)', '.925 sterling silver oval keepsake with thumbprint, holding your loved one’s remains on a sterling silver curb style chain with spring ring clasp. (Eternity’s Touch)', 350.00, NULL, NULL, false, 13),
  ('si004276', '3730', 'c1000000-0000-0000-0000-000000000011', 'UCEVNSALEX', 'Sterling Silver Signature Heart Keepsake (Urn)', '.925 sterling silver heart keepsake with thumbprint, holding your loved one’s remains on a sterling silver curb style chain with spring ring clasp. (Eternity’s Touch)', 350.00, NULL, NULL, false, 14),
  ('si004277', '3730', 'c1000000-0000-0000-0000-000000000011', 'UCEVNSAMEX', 'Sterling Silver Teardrop Keepsake Urn', '.925 sterling silver teardrop keepsake with thumbprint holding your loved one’s remains on a sterling silver curb style chain with spring ring clasp. (Eternity’s Touch)', 350.00, NULL, NULL, false, 15),
  ('si004278', '3730', 'c1000000-0000-0000-0000-000000000011', '19OXUEIHUS19OX', 'Circle of Life Pendant with Birthstone', 'Crafted from exquisite 925 sterling silver, this pendant exudes timeless elegance. Includes a beautiful birthstone charm that dangles inside, with an 18" rope chain. (BioLife)', 325.00, NULL, NULL, false, 16),
  ('si004279', '3730', 'c1000000-0000-0000-0000-000000000011', 'XFDKSBB', 'Titanium Memory Tag', 'Titanium memory tag with thumbprint on a keyring 22” stainless steel ball chain, or 22” sterling silver thick chain. (Eternity’s Touch)', 295.00, NULL, NULL, false, 17),
  ('si004280', '3730', 'c1000000-0000-0000-0000-000000000011', 'XFDKSBF', 'Buck Knife', 'Stainless Steel buck knife with thumbprint. (Eternity’s Touch)', 295.00, NULL, NULL, false, 18),
  ('si004281', '3730', 'c1000000-0000-0000-0000-000000000011', 'XFDKSBG', 'Zippo Lighter', 'Chrome zippo lighter with thumbprint. (Eternity’s Touch)', 295.00, NULL, NULL, false, 19),
  ('si004282', '3730', 'c1000000-0000-0000-0000-000000000011', 'XFDKSQZ', 'Sterling Silver Cross Pendant', '.925 Sterling silver cross pendant with thumbprint on a sterling silver curb style chain with spring ring clasp. (Eternity’s Touch)', 295.00, NULL, NULL, false, 20),
  ('si004283', '3730', 'c1000000-0000-0000-0000-000000000011', 'XFDKSSV', 'Sterling Silver Oval Pendant', '.925 Sterling silver, oval, pendant with thumbprint on a sterling silver, curb style chain with spring ring clasp. (Additional Personalization Available) (Eternity’s Touch)', 295.00, NULL, NULL, false, 21),
  ('si004284', '3730', 'c1000000-0000-0000-0000-000000000011', 'XFDKSWA', 'Sterling Silver Flat Heart Pendant', '.925 sterling silver flat heart pendant with thumbprint on a sterling silver curb style chain with spring ring clasp. (Eternity’s Touch)', 295.00, NULL, NULL, false, 22),
  ('si004285', '3730', 'c1000000-0000-0000-0000-000000000011', 'XFDKSA8', 'Stainless Steel Oval Pendant', 'Stainless steel oval pendant with thumbprint on a stainless steel curb style chain with spring ring clasp. (Eternity’s Touch)', 295.00, NULL, NULL, false, 23),
  ('si004286', '3730', 'c1000000-0000-0000-0000-000000000011', 'UCNNUSDWDR', 'Cross Pendant', 'Cross Pendant on a 18" sterling silver chain with a 2.25" chain extension. (LoveUrns)', 255.00, NULL, NULL, false, 24),
  ('si004287', '3730', 'c1000000-0000-0000-0000-000000000011', 'UCNNWSD6DR', 'Feather Pendant', 'Feather Pendant on a 18" sterling silver chain with a 2.25" chain extension. (LoveUrns)', 255.00, NULL, NULL, false, 25),
  ('si004288', '3730', 'c1000000-0000-0000-0000-000000000011', 'UCNNWSDRDR', 'Infinite Love Pendant', 'Infinite Love Pendant on a 18" sterling silver chain with a 2.25" chain extension. (LoveUrns)', 255.00, NULL, NULL, false, 26),
  ('si004289', '3730', 'c1000000-0000-0000-0000-000000000011', 'UCNNWSEADR', 'FlyingDove™ Ashes Pendant', 'Dove shaped Ashes Necklace in Brushed and Shiny Silver. (LoveUrns)', 255.00, NULL, NULL, false, 27),
  ('si004290', '3730', 'c1000000-0000-0000-0000-000000000011', 'UCNNWSEHDG', 'Heartfelt Pendant', 'Heartfelt Pendant on a 18" sterling silver chain with a 2.25" chain extension. (LoveUrns)', 255.00, NULL, NULL, false, 28),
  ('si004291', '3730', 'c1000000-0000-0000-0000-000000000011', 'UCNNWSENDR', 'Leaning Heart Pendant', 'Leaning Heart Pendant on a 18" sterling silver chain with a 2.25" chain extension. (LoveUrns)', 255.00, NULL, NULL, false, 29),
  ('si004292', '3730', 'c1000000-0000-0000-0000-000000000011', 'UCNNWSENDV', 'Leaning Heart with Crystal Pendant', 'Leaning Heart with Crystal Pendant on a 18" sterling silver chain with a 2.25" chain extension. (LoveUrns)', 255.00, NULL, NULL, false, 30),
  ('si004293', '3730', 'c1000000-0000-0000-0000-000000000011', 'UCNNWSERDG', 'Love Heart Gold Vermeil Necklace and Pendant', 'Heart Shaped Ashes Necklace in Shiny Vermeil Gold. (LoveUrns)', 255.00, NULL, NULL, false, 31),
  ('si004294', '3730', 'c1000000-0000-0000-0000-000000000011', 'UCNNWSEUDV', 'Love Rose Pendant', 'Love Rose Pendant on a 18" sterling silver chain with a 2.25" chain extension. (LoveUrns)', 255.00, NULL, NULL, false, 32),
  ('si004295', '3730', 'c1000000-0000-0000-0000-000000000011', 'UCNNWSEYDG', 'Mother of Pearl Pendant', 'Mother of Pearl Pendant on a 18" sterling silver chain with a 2.25" chain extension. (LoveUrns)', 255.00, NULL, NULL, false, 33),
  ('si004296', '3730', 'c1000000-0000-0000-0000-000000000011', 'UCNNWSFYDR', 'Soul Bird Necklace and Pendant', 'Soul bird shaped Ashes Necklace in Shiny Silver. (LoveUrns)', 255.00, NULL, NULL, false, 34),
  ('si004297', '3730', 'c1000000-0000-0000-0000-000000000011', 'UCIBUGVAOX', 'Cuff Cremation Bracelet - Gold', 'A timeless and sophisticated piece, this gold plated stainless steel cuff bracelet allows you to carry a part of your loved one’s ashes discreetly. (BioLife)', 245.00, NULL, NULL, false, 35),
  ('si004298', '3730', 'c1000000-0000-0000-0000-000000000011', 'UCIBULCUOX', 'Cuff Cremation Bracelet - Black', 'Crafted with precision from high-quality black stainless steel, this bracelet discreetly holds a small amount of your loved one’s ashes. (BioLife)', 245.00, NULL, NULL, false, 36),
  ('si004299', '3730', 'c1000000-0000-0000-0000-000000000011', 'UCIBUSBROX', 'Cuff Cremation Bracelet - Silver', 'Designed for understated elegance, this stainless steel cuff bracelet discreetly holds a small amount of your loved one’s ashes. (BioLife)', 245.00, NULL, NULL, false, 37),
  ('si004300', '3730', 'c1000000-0000-0000-0000-000000000011', 'XFDKSBL', 'Stainless Steel Money Clip', 'Stainless steel money clip with thumbprint. (Eternity’s Touch)', 225.00, NULL, NULL, false, 38),
  ('si004301', '3730', 'c1000000-0000-0000-0000-000000000011', 'XFDKSA5', 'Memory Bear', 'Memory teddy bear with rubber silencer covered stainless steel memory tag with thumbprint. (Eternity’s Touch)', 195.00, NULL, NULL, false, 39),
  ('si004302', '3730', 'c1000000-0000-0000-0000-000000000011', 'UCNNULDTBX', 'Dog Tag', 'Stainless steel dog tag on a 24" stainless steel beaded chain. (Batesville)', 195.00, NULL, NULL, false, 40),
  ('si004303', '3730', 'c1000000-0000-0000-0000-000000000011', 'UCNIWSDYDR', 'CuddleBear with Pink Crystal Charm', 'Sterling silver CuddleBear with Pink Crystal Charm. Bracelet sold separately. (LoveUrns)', 175.00, NULL, NULL, false, 41),
  ('si004304', '3730', 'c1000000-0000-0000-0000-000000000011', 'UCNIWSDYFR', 'CuddleBear with Blue Crystal Charm', 'Sterling silver CuddleBear with Blue Crystal Charm. Bracelet sold separately. (LoveUrns)', 175.00, NULL, NULL, false, 42),
  ('si004305', '3730', 'c1000000-0000-0000-0000-000000000011', 'UCNIWSEDDG', 'Glowing Heart Charm', 'Sterling silver Glowing Heart Charm. Bracelet sold separately. (LoveUrns)', 155.00, NULL, NULL, false, 43),
  ('si004306', '3730', 'c1000000-0000-0000-0000-000000000011', 'UCNIWSEFDR', 'Heart to Heart with Crystal Charm', 'Sterling silver Heart to Heart with Crystal Charm. Bracelet sold separately. (LoveUrns)', 155.00, NULL, NULL, false, 44),
  ('si004307', '3730', 'c1000000-0000-0000-0000-000000000011', 'UCNIWSEYDG', 'Mother of Pearl Charm', 'Sterling silver Mother of Pearl Charm. Bracelet sold separately. (LoveUrns)', 155.00, NULL, NULL, false, 45),
  ('si004308', '3730', 'c1000000-0000-0000-0000-000000000011', 'UCNIWSCODR', 'Cross Charm', 'Sterling silver Cross Charm. Bracelet sold separately. (LoveUrns)', 155.00, NULL, NULL, false, 46),
  ('si004309', '3730', 'c1000000-0000-0000-0000-000000000011', 'XFDKSA6', 'Simply Remembered Heart', 'Stainless steel simply remembered heart with thumbprint or text, holding your loved one’s remains on a stainless steel curb style chain with spring ring clasp. (Eternity’s Touch)', 150.00, NULL, NULL, false, 47),
  ('si004310', '3730', 'c1000000-0000-0000-0000-000000000011', 'XFDKSBC', 'Simply Remembered Tree of Life', 'Stainless steel simply remembered tree of life with thumbprint or text, holding your loved one’s remains on a stainless steel curb style chain with spring ring clasp. (Eternity’s Touch)', 150.00, NULL, NULL, false, 48),
  ('si004311', '3730', 'c1000000-0000-0000-0000-000000000011', 'XFDKSBJ', 'Simply Remembered Bullet', 'Stainless steel simply remembered bullet with thumbprint or text, on a stainless steel curb style chain with spring ring clasp. (Eternity’s Touch)', 150.00, NULL, NULL, false, 49),
  ('si004312', '3730', 'c1000000-0000-0000-0000-000000000011', 'XFDKSBK', 'Simply Remembered Cylinder', 'Stainless steel simply remembered cylinder with thumbprint or text, on a stainless steel curb style chain with spring ring clasp. (Eternity’s Touch)', 150.00, NULL, NULL, false, 50),
  ('si004313', '3730', 'c1000000-0000-0000-0000-000000000011', 'XFDKSA1', 'Simply Remembered Bar', 'Stainless Steel simply remembered bar holding your loved one’s remains, with option for text, on a stainless steel curb style chain with spring ring clasp. (Eternity’s Touch)', 150.00, NULL, NULL, false, 51),
  ('si004314', '3730', 'c1000000-0000-0000-0000-000000000011', 'XFDKSA4', 'High Res Fingerprint', 'High res cropped fingerprint. (Eternity’s Touch)', 125.00, NULL, NULL, false, 52),
  ('si004315', '3730', 'c1000000-0000-0000-0000-000000000011', 'UCNBWSBRDR', 'Bracelet Sterling Silver', 'Sterling silver bracelet. (LoveUrns)', 115.00, NULL, NULL, false, 53),
  ('si004316', '3730', 'c1000000-0000-0000-0000-000000000011', 'UCNIWSFDDR', 'Wings of Hope Blue Charm', 'Sterling silver Wings of Hope Charm. Bracelet sold separately. (LoveUrns)', 85.00, NULL, NULL, false, 54),
  ('si004317', '3730', 'c1000000-0000-0000-0000-000000000011', 'UCNIWSFGDR', 'Wings of Hope Lavender Charm', 'Sterling silver Wings of Hope Charm. Bracelet sold separately. (LoveUrns)', 85.00, NULL, NULL, false, 55),
  ('si004318', '3730', 'c1000000-0000-0000-0000-000000000011', 'UCNIWSFIDR', 'Wings of Hope Pearl Charm', 'Sterling silver Wings of Hope Charm. Bracelet sold separately. (LoveUrns)', 85.00, NULL, NULL, false, 56),
  ('si004319', '3730', 'c1000000-0000-0000-0000-000000000011', 'UCNIWYYEDR', 'Wings of Hope Yellow Charm', 'Butterfly shaped Yellow Ashes Bead in Shiny Silver. (LoveUrns)', 85.00, NULL, NULL, false, 57),
  ('si004320', '3730', 'c1000000-0000-0000-0000-000000000011', 'UCNKWSEHDG', 'HeartFelt Earrings', 'Sterling silver HeartFelt Earrings. (LoveUrns)', 55.00, NULL, NULL, false, 58),
  ('si004321', '3730', 'c1000000-0000-0000-0000-000000000011', 'UCNKWSENDR', 'Leaning Heart Earrings', 'Sterling silver Leaning Heart Earrings. (LoveUrns)', 55.00, NULL, NULL, false, 59),
  ('si004322', '3730', 'c1000000-0000-0000-0000-000000000011', 'UCNKWSEYDG', 'Mother of Pearl Earrings', 'Sterling silver Mother of Pearl Earrings. (LoveUrns)', 55.00, NULL, NULL, false, 60);

-- ─── Packages ─────────────────────────────────────────────────────────────────

insert into packages (id, funeral_home_id, name, pkg_type, total_price, package_discount, default_casket_id, sort_order) values
  ('pk004001', '3730', 'Full Service', 'alacarte', 5835.00, 0, NULL, 1),
  ('pk004002', '3730', 'Witness Cremation', 'alacarte', 4835.00, 0, NULL, 2),
  ('pk004003', '3730', 'Service of Remembrance', 'alacarte', 5660.00, 0, NULL, 3),
  ('pk004004', '3730', 'Graveside Service', 'alacarte', 5010.00, 0, NULL, 4),
  ('pk004005', '3730', 'Urn Committal Option', 'alacarte', 3910.00, 0, NULL, 5),
  ('pk004006', '3730', 'No Service Option', 'alacarte', 3215.00, 0, NULL, 6),
  ('pk004007', '3730', 'Forwarding of Remains to Another Funeral Home', 'alacarte', 3455.00, 0, NULL, 7),
  ('pk004008', '3730', 'Receiving of Remains from Another Funeral Home', 'alacarte', 2285.00, 0, NULL, 8),
  ('pk004009', '3730', 'Dignity Memorial Heritage Funeral Service', 'package', 14298.00, 420, NULL, 9),
  ('pk004010', '3730', 'Dignity Memorial Honour Funeral Service', 'package', 13098.00, 385, NULL, 10),
  ('pk004011', '3730', 'Dignity Memorial Tribute Funeral Service', 'package', 11208.00, 330, NULL, 11),
  ('pk004012', '3730', 'Dignity Memorial Heritage Cremation Service', 'package', 13693.00, 410, NULL, 12),
  ('pk004013', '3730', 'Dignity Memorial Honour Cremation Service', 'package', 10279.00, 305, NULL, 13),
  ('pk004014', '3730', 'Dignity Memorial Tribute Cremation Service', 'package', 5295.00, 50, NULL, 14);

-- ─── Package Items ────────────────────────────────────────────────────────────

insert into package_items (package_id, service_item_id, quantity, sort_order, is_optional) values
  -- Full Service ($5,835)
  ('pk004001', 'si004002', 1, 1, false), -- Professional Services Fees for Full Service  2255
  ('pk004001', 'si004011', 1, 2, false), -- Registration and Documentation  445
  ('pk004001', 'si004012', 1, 3, false), -- Embalming  625
  ('pk004001', 'si004014', 1, 4, false), -- Other Care and Preparation  445
  ('pk004001', 'si004013', 1, 5, false), -- Sheltering of Remains  445
  ('pk004001', 'si004019', 1, 6, false), -- Transfer of Remains from Place of Death to Funeral Home  495
  ('pk004001', 'si004020', 1, 7, false), -- Funeral Vehicle (e.g. Hearse)  395
  ('pk004001', 'si004061', 1, 8, false), -- Estate Fraud Protection  135
  ('pk004001', 'si004044', 1, 9, false), -- Premium Venue  595
  -- Witness Cremation ($4,835)
  ('pk004002', 'si004005', 1, 1, false), -- Professional Service Fees of Funeral Director and Staff for Cremation Witness  1875
  ('pk004002', 'si004011', 1, 2, false), -- Registration and Documentation  445
  ('pk004002', 'si004014', 1, 3, false), -- Other Care and Preparation  445
  ('pk004002', 'si004013', 1, 4, false), -- Sheltering of Remains  445
  ('pk004002', 'si004019', 1, 5, false), -- Transfer of Remains from Place of Death to Funeral Home  495
  ('pk004002', 'si004061', 1, 6, false), -- Estate Fraud Protection  135
  ('pk004002', 'si004041', 1, 7, false), -- Crematory Fee  995
  -- Service of Remembrance ($5,660)
  ('pk004003', 'si004003', 1, 1, false), -- Professional Services Fees for Memorial Service  2105
  ('pk004003', 'si004011', 1, 2, false), -- Registration and Documentation  445
  ('pk004003', 'si004014', 1, 3, false), -- Other Care and Preparation  445
  ('pk004003', 'si004013', 1, 4, false), -- Sheltering of Remains  445
  ('pk004003', 'si004019', 1, 5, false), -- Transfer of Remains from Place of Death to Funeral Home  495
  ('pk004003', 'si004061', 1, 6, false), -- Estate Fraud Protection  135
  ('pk004003', 'si004041', 1, 7, false), -- Crematory Fee  995
  ('pk004003', 'si004044', 1, 8, false), -- Premium Venue  595
  -- Graveside Service ($5,010)
  ('pk004004', 'si004004', 1, 1, false), -- Professional Services Fees for Graveside Service  2025
  ('pk004004', 'si004011', 1, 2, false), -- Registration and Documentation  445
  ('pk004004', 'si004012', 1, 3, false), -- Embalming  625
  ('pk004004', 'si004014', 1, 4, false), -- Other Care and Preparation  445
  ('pk004004', 'si004013', 1, 5, false), -- Sheltering of Remains  445
  ('pk004004', 'si004019', 1, 6, false), -- Transfer of Remains from Place of Death to Funeral Home  495
  ('pk004004', 'si004020', 1, 7, false), -- Funeral Vehicle (e.g. Hearse)  395
  ('pk004004', 'si004061', 1, 8, false), -- Estate Fraud Protection  135
  -- Urn Committal Option ($3,910)
  ('pk004005', 'si004008', 1, 1, false), -- Professional Services Fees for Urn Committal  600
  ('pk004005', 'si004011', 1, 2, false), -- Registration and Documentation  445
  ('pk004005', 'si004014', 1, 3, false), -- Other Care and Preparation  445
  ('pk004005', 'si004013', 1, 4, false), -- Sheltering of Remains  445
  ('pk004005', 'si004009', 1, 5, false), -- Staff Services for Urn Committal  350
  ('pk004005', 'si004019', 1, 6, false), -- Transfer of Remains from Place of Death to Funeral Home  495
  ('pk004005', 'si004061', 1, 7, false), -- Estate Fraud Protection  135
  ('pk004005', 'si004041', 1, 8, false), -- Crematory Fee  995
  -- No Service Option ($3,215)
  ('pk004006', 'si004010', 1, 1, false), -- Basic Service Fees for No Service Option  255
  ('pk004006', 'si004011', 1, 2, false), -- Registration and Documentation  445
  ('pk004006', 'si004014', 1, 3, false), -- Other Care and Preparation  445
  ('pk004006', 'si004013', 1, 4, false), -- Sheltering of Remains  445
  ('pk004006', 'si004019', 1, 5, false), -- Transfer of Remains from Place of Death to Funeral Home  495
  ('pk004006', 'si004061', 1, 6, false), -- Estate Fraud Protection  135
  ('pk004006', 'si004041', 1, 7, false), -- Crematory Fee  995
  -- Forwarding of Remains to Another Funeral Home ($3,455)
  ('pk004007', 'si004006', 1, 1, false), -- Basic Professional Service Fee when Forwarding Remains  1495
  ('pk004007', 'si004011', 1, 2, false), -- Registration and Documentation  445
  ('pk004007', 'si004012', 1, 3, false), -- Embalming  625
  ('pk004007', 'si004022', 1, 4, false), -- Transfer to or from Airport  395
  ('pk004007', 'si004019', 1, 5, false), -- Transfer of Remains from Place of Death to Funeral Home  495
  -- Receiving of Remains from Another Funeral Home ($2,285)
  ('pk004008', 'si004007', 1, 1, false), -- Basic Professional Service Fees when Receiving Remains  1495
  ('pk004008', 'si004022', 1, 2, false), -- Transfer to or from Airport  395
  ('pk004008', 'si004020', 1, 3, false), -- Funeral Vehicle (e.g. Hearse)  395
  -- Dignity Memorial Heritage Funeral Service ($14,298)
  ('pk004009', 'si004002', 1, 1, false), -- Professional Services Fees for Full Service  2255
  ('pk004009', 'si004011', 1, 2, false), -- Registration and Documentation  445
  ('pk004009', 'si004012', 1, 3, false), -- Embalming  625
  ('pk004009', 'si004014', 1, 4, false), -- Other Care and Preparation  445
  ('pk004009', 'si004069', 1, 5, true), -- Reception Room  499
  ('pk004009', 'si004013', 1, 6, false), -- Sheltering of Remains  445
  ('pk004009', 'si004019', 1, 7, false), -- Transfer of Remains from Place of Death to Funeral Home  495
  ('pk004009', 'si004020', 1, 8, false), -- Funeral Vehicle (e.g. Hearse)  395
  ('pk004009', 'si004021', 1, 9, false), -- Limousine  395
  ('pk004009', 'si004060', 1, 10, false), -- Everlasting Memorial®  490
  ('pk004009', 'si004061', 1, 11, false), -- Estate Fraud Protection  135
  ('pk004009', 'si004062', 1, 12, false), -- Dignity Heritage Burial Flowers  695
  ('pk004009', 'si004044', 1, 13, false), -- Premium Venue  595
  ('pk004009', 'si004023', 1, 14, false), -- Legal Service Plan  295
  ('pk004009', 'si004094', 1, 15, false), -- Recommended Casket — Heritage Tier  4099
  ('pk004009', 'si004068', 1, 16, true), -- Catered Receptions III  1195
  ('pk004009', 'si004070', 1, 17, false), -- Esteemed Collection  795
  -- Dignity Memorial Honour Funeral Service ($13,098)
  ('pk004010', 'si004002', 1, 1, false), -- Professional Services Fees for Full Service  2255
  ('pk004010', 'si004011', 1, 2, false), -- Registration and Documentation  445
  ('pk004010', 'si004012', 1, 3, false), -- Embalming  625
  ('pk004010', 'si004014', 1, 4, false), -- Other Care and Preparation  445
  ('pk004010', 'si004069', 1, 5, true), -- Reception Room  499
  ('pk004010', 'si004013', 1, 6, false), -- Sheltering of Remains  445
  ('pk004010', 'si004019', 1, 7, false), -- Transfer of Remains from Place of Death to Funeral Home  495
  ('pk004010', 'si004020', 1, 8, false), -- Funeral Vehicle (e.g. Hearse)  395
  ('pk004010', 'si004021', 1, 9, false), -- Limousine  395
  ('pk004010', 'si004060', 1, 10, false), -- Everlasting Memorial®  490
  ('pk004010', 'si004061', 1, 11, false), -- Estate Fraud Protection  135
  ('pk004010', 'si004063', 1, 12, false), -- Dignity Honour Burial Flowers  495
  ('pk004010', 'si004044', 1, 13, false), -- Premium Venue  595
  ('pk004010', 'si004023', 1, 14, false), -- Legal Service Plan  295
  ('pk004010', 'si004095', 1, 15, false), -- Recommended Casket — Honour Tier  3599
  ('pk004010', 'si004067', 1, 16, true), -- Catered Receptions II  995
  ('pk004010', 'si004071', 1, 17, false), -- Commemorative Collection  495
  -- Dignity Memorial Tribute Funeral Service ($11,208)
  ('pk004011', 'si004002', 1, 1, false), -- Professional Services Fees for Full Service  2255
  ('pk004011', 'si004011', 1, 2, false), -- Registration and Documentation  445
  ('pk004011', 'si004012', 1, 3, false), -- Embalming  625
  ('pk004011', 'si004014', 1, 4, false), -- Other Care and Preparation  445
  ('pk004011', 'si004069', 1, 5, true), -- Reception Room  499
  ('pk004011', 'si004013', 1, 6, false), -- Sheltering of Remains  445
  ('pk004011', 'si004019', 1, 7, false), -- Transfer of Remains from Place of Death to Funeral Home  495
  ('pk004011', 'si004020', 1, 8, false), -- Funeral Vehicle (e.g. Hearse)  395
  ('pk004011', 'si004060', 1, 9, false), -- Everlasting Memorial®  490
  ('pk004011', 'si004061', 1, 10, false), -- Estate Fraud Protection  135
  ('pk004011', 'si004043', 1, 11, false), -- Standard Venue  495
  ('pk004011', 'si004023', 1, 12, false), -- Legal Service Plan  295
  ('pk004011', 'si004096', 1, 13, false), -- Recommended Casket — Tribute Tier  2999
  ('pk004011', 'si004066', 1, 14, true), -- Catered Receptions I  795
  ('pk004011', 'si004072', 1, 15, false), -- Remembrance Collection  395
  -- Dignity Memorial Heritage Cremation Service ($13,693)
  ('pk004012', 'si004002', 1, 1, false), -- Professional Services Fees for Full Service  2255
  ('pk004012', 'si004011', 1, 2, false), -- Registration and Documentation  445
  ('pk004012', 'si004012', 1, 3, false), -- Embalming  625
  ('pk004012', 'si004014', 1, 4, false), -- Other Care and Preparation  445
  ('pk004012', 'si004069', 1, 5, true), -- Reception Room  499
  ('pk004012', 'si004013', 1, 6, false), -- Sheltering of Remains  445
  ('pk004012', 'si004019', 1, 7, false), -- Transfer of Remains from Place of Death to Funeral Home  495
  ('pk004012', 'si004020', 1, 8, false), -- Funeral Vehicle (e.g. Hearse)  395
  ('pk004012', 'si004021', 1, 9, false), -- Limousine  395
  ('pk004012', 'si004060', 1, 10, false), -- Everlasting Memorial®  490
  ('pk004012', 'si004061', 1, 11, false), -- Estate Fraud Protection  135
  ('pk004012', 'si004064', 1, 12, false), -- Dignity Heritage Cremation Flowers  500
  ('pk004012', 'si004041', 1, 13, false), -- Crematory Fee  995
  ('pk004012', 'si004044', 1, 14, false), -- Premium Venue  595
  ('pk004012', 'si004023', 1, 15, false), -- Legal Service Plan  295
  ('pk004012', 'si004100', 1, 16, false), -- Memorial Urn Selection — Heritage Tier  1295
  ('pk004012', 'si004097', 1, 17, false), -- Batesville Brockton Oak Ceremonial  1599
  ('pk004012', 'si004067', 1, 18, true), -- Catered Receptions II  995
  ('pk004012', 'si004070', 1, 19, false), -- Esteemed Collection  795
  -- Dignity Memorial Honour Cremation Service ($10,279)
  ('pk004013', 'si004003', 1, 1, false), -- Professional Services Fees for Memorial Service  2105
  ('pk004013', 'si004011', 1, 2, false), -- Registration and Documentation  445
  ('pk004013', 'si004014', 1, 3, false), -- Other Care and Preparation  445
  ('pk004013', 'si004069', 1, 4, true), -- Reception Room  499
  ('pk004013', 'si004013', 1, 5, false), -- Sheltering of Remains  445
  ('pk004013', 'si004019', 1, 6, false), -- Transfer of Remains from Place of Death to Funeral Home  495
  ('pk004013', 'si004060', 1, 7, false), -- Everlasting Memorial®  490
  ('pk004013', 'si004061', 1, 8, false), -- Estate Fraud Protection  135
  ('pk004013', 'si004065', 1, 9, false), -- Dignity Honour Cremation Flowers  400
  ('pk004013', 'si004041', 1, 10, false), -- Crematory Fee  995
  ('pk004013', 'si004044', 1, 11, false), -- Premium Venue  595
  ('pk004013', 'si004023', 1, 12, false), -- Legal Service Plan  295
  ('pk004013', 'si004101', 1, 13, false), -- Memorial Urn Selection — Honour Tier  795
  ('pk004013', 'si004098', 1, 14, false), -- Batesville Brockton Oak (1 Hour Rental)  850
  ('pk004013', 'si004066', 1, 15, true), -- Catered Receptions I  795
  ('pk004013', 'si004071', 1, 16, false), -- Commemorative Collection  495
  -- Dignity Memorial Tribute Cremation Service ($5,295)
  ('pk004014', 'si004010', 1, 1, false), -- Basic Service Fees for No Service Option  255
  ('pk004014', 'si004011', 1, 2, false), -- Registration and Documentation  445
  ('pk004014', 'si004014', 1, 3, false), -- Other Care and Preparation  445
  ('pk004014', 'si004059', 1, 4, false), -- Venue and Staff Services to coordinate a Simple Gathering  595
  ('pk004014', 'si004013', 1, 5, false), -- Sheltering of Remains  445
  ('pk004014', 'si004019', 1, 6, false), -- Transfer of Remains from Place of Death to Funeral Home  495
  ('pk004014', 'si004061', 1, 7, false), -- Estate Fraud Protection  135
  ('pk004014', 'si004041', 1, 8, false), -- Crematory Fee  995
  ('pk004014', 'si004023', 1, 9, false), -- Legal Service Plan  295
  ('pk004014', 'si004102', 1, 10, false), -- Memorial Urn Selection — Tribute Tier  595
  ('pk004014', 'si004099', 1, 11, false); -- Vancouver Casket Cypress  595

-- ─── Casket / Container / Vault Catalog ───────────────────────────────────────
-- All 59 caskets/containers and 10 vaults already exist in casket_catalog
-- (added by the Woodlawn Mt. Cheam (3150) seed) — no new catalog rows needed.
-- ─── Casket / Container / Vault Pricing ────────────────────────────────────────

insert into funeral_home_caskets (funeral_home_id, catalog_id, price, sort_order) values
  -- Wood Caskets
  ('3730', 'csk016', 8299.00, 1), -- Regent
  ('3730', 'csk024', 6499.00, 2), -- Classic Mahogany
  ('3730', 'csk015', 6499.00, 3), -- Prominence
  ('3730', 'csk027', 5699.00, 4), -- Woodbridge Pecan
  ('3730', 'csk028', 5199.00, 5), -- St. Thomas Oak
  ('3730', 'csk029', 5099.00, 6), -- Mansfield-27
  ('3730', 'csk030', 4699.00, 7), -- Briar Hill
  ('3730', 'csk031', 4699.00, 8), -- Camden Oak
  ('3730', 'csk032', 4699.00, 9), -- Cameron Oak
  ('3730', 'csk033', 4699.00, 10), -- Promise
  ('3730', 'csk034', 4699.00, 11), -- Rosette
  ('3730', 'csk035', 4699.00, 12), -- Victoria Cherry
  ('3730', 'csk036', 4295.00, 13), -- Sincerity
  ('3730', 'csk037', 4099.00, 14), -- Brexton
  ('3730', 'csk014', 4099.00, 15), -- Dominion HC Wood Maple Crepe
  ('3730', 'csk004', 4099.00, 16), -- Eleanor Oak
  ('3730', 'csk003', 4099.00, 17), -- Fireside
  ('3730', 'csk038', 4099.00, 18), -- Hadyn
  ('3730', 'csk007', 3599.00, 19), -- Bailey
  ('3730', 'csk008', 3599.00, 20), -- Hartvic
  ('3730', 'csk039', 3599.00, 21), -- Sherwood Oak
  ('3730', 'csk006', 3599.00, 22), -- Watson
  ('3730', 'csk009', 2999.00, 23), -- Coleridge
  ('3730', 'csk040', 2999.00, 24), -- Constance
  ('3730', 'csk011', 2999.00, 25), -- Heavenly White
  ('3730', 'csk010', 2999.00, 26), -- Montgomery
  ('3730', 'csk076', 2999.00, 27), -- Westcott
  ('3730', 'csk041', 2999.00, 28), -- White Rose
  ('3730', 'csk012', 2999.00, 29), -- Winfield
  ('3730', 'csk082', 2899.00, 30), -- Brandon
  ('3730', 'csk042', 2899.00, 31), -- Carnaby
  ('3730', 'csk083', 2899.00, 32), -- Lambert
  ('3730', 'csk043', 2799.00, 33), -- Atlantic
  ('3730', 'csk044', 2799.00, 34), -- Natura
  ('3730', 'csk045', 2799.00, 35), -- Oxford
  ('3730', 'csk013', 2599.00, 36), -- Freelton
  ('3730', 'csk046', 2599.00, 37), -- Schafer
  ('3730', 'csk084', 2599.00, 38), -- West Coast Cedar - First Nations HC
  ('3730', 'csk085', 2299.00, 39), -- PN Pine Casket
  ('3730', 'csk086', 2199.00, 40), -- BPF Basic Pine (Full Couch)
  ('3730', 'csk072', 2099.00, 41), -- Butler
  ('3730', 'csk087', 1199.00, 42), -- BP1 Basic Pine (Full Couch)
  -- Metal Caskets
  ('3730', 'csk049', 5199.00, 43), -- Golden Granite
  ('3730', 'csk050', 5099.00, 44), -- Primrose
  ('3730', 'csk051', 4299.00, 45), -- Merlot-28
  ('3730', 'csk001', 4099.00, 46), -- Merlot
  ('3730', 'csk052', 3599.00, 47), -- Antique Blue-28
  ('3730', 'csk005', 3599.00, 48), -- Misty Blue
  ('3730', 'csk088', 2099.00, 49), -- Triton Grey
  -- Other Caskets
  ('3730', 'csk089', 1499.00, 50), -- Grey Doeskin Oval Cut Top
  ('3730', 'csk079', 1099.00, 51), -- Grey Malet
  -- Cremation Oriented Caskets
  ('3730', 'csk053', 1050.00, 52), -- McConnell
  ('3730', 'csk071', 850.00, 53), -- Burlington
  -- Containers
  ('3730', 'cont004', 699.00, 54), -- Plywood Container
  ('3730', 'cont003', 595.00, 55), -- Cypress
  ('3730', 'cont007', 525.00, 56), -- Universal Basic Container
  ('3730', 'cont008', 450.00, 57), -- OSB Cremation Container
  -- Rental Caskets
  ('3730', 'cont001', 1599.00, 58), -- Brockton Oak Ceremonial
  ('3730', 'cont002', 850.00, 59), -- Brockton Oak (1 Hour Rental)
  -- Concrete Outer Burial Containers
  ('3730', 'vlt001', 6599.00, 60), -- Bronze Triune Vault
  ('3730', 'vlt002', 5599.00, 61), -- Copper Triune Vault
  ('3730', 'vlt003', 4799.00, 62), -- Cameo Rose Triune Vault
  ('3730', 'vlt004', 4799.00, 63), -- Stainless Steel Triune Vault
  ('3730', 'vlt005', 2799.00, 64), -- Venetian Vault
  ('3730', 'vlt006', 2399.00, 65), -- Continental Vault
  ('3730', 'vlt007', 2199.00, 66), -- Monticello Vault
  ('3730', 'vlt008', 1699.00, 67), -- Monarch Vault
  -- Cremation Outer Burial Containers
  ('3730', 'vlt009', 1499.00, 68), -- Venetian Urn Vault
  ('3730', 'vlt010', 1199.00, 69); -- Monticello Urn Vault

