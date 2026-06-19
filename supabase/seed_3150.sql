-- ─────────────────────────────────────────────────────────────────────────────
-- SEED — Woodlawn Mt. Cheam Funeral Home (ID: 3150)
-- ─────────────────────────────────────────────────────────────────────────────

-- ─── Funeral Home ─────────────────────────────────────────────────────────────

insert into funeral_homes (id, name, address, phone, website, tax_rate) values
  ('3150', 'Woodlawn Mt. Cheam Funeral Home', '45865 Hocking Ave, Chilliwack, BC V2P 1B5', '604-793-4555', 'www.woodlawn-mtcheam.ca', 0.05)
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
-- IDs si003001–si003321

insert into service_items (id, funeral_home_id, category_id, item_code, name, description, price, price_min, price_max, is_cash_advance, sort_order) values
  -- Professional Staff & Services
  ('si003001', '3150', 'c1000000-0000-0000-0000-000000000001', NULL, 'Professional Services Fees for Gathering Celebrations', NULL, 2495.00, NULL, NULL, false, 1),
  ('si003002', '3150', 'c1000000-0000-0000-0000-000000000001', NULL, 'Professional Services Fees for Full Service', NULL, 2255.00, NULL, NULL, false, 2),
  ('si003003', '3150', 'c1000000-0000-0000-0000-000000000001', NULL, 'Professional Services Fees for Memorial Service', NULL, 2105.00, NULL, NULL, false, 3),
  ('si003004', '3150', 'c1000000-0000-0000-0000-000000000001', NULL, 'Professional Services Fees for Graveside Service', NULL, 2025.00, NULL, NULL, false, 4),
  ('si003005', '3150', 'c1000000-0000-0000-0000-000000000001', NULL, 'Professional Service Fees of Funeral Director and Staff for Cremation Witness', NULL, 1875.00, NULL, NULL, false, 5),
  ('si003006', '3150', 'c1000000-0000-0000-0000-000000000001', NULL, 'Basic Professional Service Fee when Forwarding Remains', NULL, 1495.00, NULL, NULL, false, 6),
  ('si003007', '3150', 'c1000000-0000-0000-0000-000000000001', NULL, 'Basic Professional Service Fees when Receiving Remains', NULL, 1495.00, NULL, NULL, false, 7),
  ('si003008', '3150', 'c1000000-0000-0000-0000-000000000001', NULL, 'Professional Services Fees for Urn Committal', NULL, 600.00, NULL, NULL, false, 8),
  ('si003009', '3150', 'c1000000-0000-0000-0000-000000000001', NULL, 'Staff Services for Urn Committal', 'Our services include accompaniment of remains to cemetery, supervision of service, and staff to assist with the service.', 350.00, NULL, NULL, false, 9),
  ('si003010', '3150', 'c1000000-0000-0000-0000-000000000001', NULL, 'Basic Service Fees for No Service Option', NULL, 255.00, NULL, NULL, false, 10),
  ('si003011', '3150', 'c1000000-0000-0000-0000-000000000001', NULL, 'Registration and Documentation', 'Completion and filing of all documents necessary to carry out the services and supplies requested, including death registration, burial or cremation permit, coroner’s certificate and documentation necessary to ship the body out of the country.', 445.00, NULL, NULL, false, 11),
  ('si003012', '3150', 'c1000000-0000-0000-0000-000000000001', NULL, 'Embalming', 'This fee is in addition to basic preparation. Embalming is the process of replacing blood and bodily fluids with chemical preservatives. Autopsy embalming and restorative practices are included.', 625.00, NULL, NULL, false, 12),
  ('si003013', '3150', 'c1000000-0000-0000-0000-000000000001', NULL, 'Sheltering of Remains', NULL, 445.00, NULL, NULL, false, 13),
  ('si003014', '3150', 'c1000000-0000-0000-0000-000000000001', NULL, 'Other Care and Preparation', NULL, 445.00, NULL, NULL, false, 14),
  -- Facilities and Supervision
  ('si003015', '3150', 'c1000000-0000-0000-0000-000000000002', NULL, 'Use of Facilities for Embalming and Preparation', NULL, 195.00, NULL, NULL, false, 1),
  ('si003016', '3150', 'c1000000-0000-0000-0000-000000000002', NULL, 'Supervision of Funeral Service', NULL, 595.00, NULL, NULL, false, 2),
  ('si003017', '3150', 'c1000000-0000-0000-0000-000000000002', NULL, 'Supervision of Memorial Service', NULL, 595.00, NULL, NULL, false, 3),
  ('si003018', '3150', 'c1000000-0000-0000-0000-000000000002', NULL, 'Simple Gathering', 'An intimate gathering of ten to twelve family and friends to celebrate a life.', 595.00, NULL, NULL, false, 4),
  -- Transportation
  ('si003019', '3150', 'c1000000-0000-0000-0000-000000000003', NULL, 'Transfer of Remains from Place of Death to Funeral Home', 'Within a 50 kilometre radius. Additional distance will be charged at $2 per kilometre.', 495.00, NULL, NULL, false, 1),
  ('si003020', '3150', 'c1000000-0000-0000-0000-000000000003', NULL, 'Funeral Vehicle (e.g. Hearse)', 'Within a 50 kilometre radius. Additional distance will be charged at $2 per kilometre.', 395.00, NULL, NULL, false, 2),
  ('si003021', '3150', 'c1000000-0000-0000-0000-000000000003', NULL, 'Limousine', 'Within a 50 kilometre radius. Additional distance will be charged at $2 per kilometre.', 395.00, NULL, NULL, false, 3),
  ('si003022', '3150', 'c1000000-0000-0000-0000-000000000003', NULL, 'Transfer to or from Airport', 'Within a 50 kilometre radius. Additional distance will be charged at $2 per kilometre.', 395.00, NULL, NULL, false, 4),
  -- Family Support Options
  ('si003023', '3150', 'c1000000-0000-0000-0000-000000000004', NULL, 'Legal Service Plan', NULL, 295.00, NULL, NULL, false, 1),
  ('si003024', '3150', 'c1000000-0000-0000-0000-000000000004', 'DGSWEBCS', 'Funeral Webcasting', 'Allow those who cannot attend in person to watch the memorial service online. The service will be broadcast live on the web, and a video recording will remain accessible to friends and family for 90 days following the service.', 295.00, NULL, NULL, false, 2),
  ('si003025', '3150', 'c1000000-0000-0000-0000-000000000004', 'XPARNRY1', 'Retractable Table Banner', 'This Table Banner brings a beautiful touch to services by showcasing up to 4 pictures of your loved one with a personalized design from the selection album and has the option of generating a QR code leading to the online version of the memory cards or folders that is selected. (QR code available day of first funeral event plus three weeks. Online program is viewable but cannot be forwarded, transferred or printed. 11.75" x 17")', 295.00, NULL, NULL, false, 3),
  ('si003026', '3150', 'c1000000-0000-0000-0000-000000000004', NULL, 'Timeless Touch Fingerprint', NULL, 295.00, NULL, NULL, false, 4),
  ('si003027', '3150', 'c1000000-0000-0000-0000-000000000004', NULL, 'Medallion Bundle', NULL, 295.00, NULL, NULL, false, 5),
  ('si003028', '3150', 'c1000000-0000-0000-0000-000000000004', 'XPRPPFN', 'Memory Portrait - 10x15 Framed Canvas Portrait', 'Create a lasting tribute to your loved one with a favourite photograph reproduced on canvas in the style of an oil painting. Includes three frame selection choices - Elegance, Contemporary or Classic.', 295.00, NULL, NULL, false, 6),
  ('si003029', '3150', 'c1000000-0000-0000-0000-000000000004', 'XOTXMBK', 'Family Estate Manager', 'Family Estate Manager is a comprehensive, step-by-step tool that simplifies the decisions you’ll make as you settle your loved one’s estate. Provides immediate access to legal professionals.', 295.00, NULL, NULL, false, 7),
  -- Miscellaneous Services & Merchandise
  ('si003030', '3150', 'c1000000-0000-0000-0000-000000000005', 'UAAAGB', 'Standard Text Personalization', NULL, 50.00, NULL, NULL, false, 1),
  ('si003031', '3150', 'c1000000-0000-0000-0000-000000000005', 'MEMMALRB', 'A Life Remembered Book', NULL, 95.00, NULL, NULL, false, 2),
  ('si003032', '3150', 'c1000000-0000-0000-0000-000000000005', 'SRVEVCHG', 'Supervision of Evening Service', 'Additional Charge for Use of Facilities and Staff for Evening Service.', 395.00, NULL, NULL, false, 3),
  ('si003033', '3150', 'c1000000-0000-0000-0000-000000000005', 'FACHOCHG', 'Additional Charge - Use of Facilities on Holidays', 'Additional Charge for Use of Facilities and Staff on Holidays.', 1000.00, NULL, NULL, false, 4),
  ('si003034', '3150', 'c1000000-0000-0000-0000-000000000005', 'SRVWECHG', 'Additional Charge - Use of Facilities on Weekends', 'Additional charge for Use of Facilities and Staff on Weekends.', 800.00, NULL, NULL, false, 5),
  ('si003035', '3150', 'c1000000-0000-0000-0000-000000000005', 'FACEVCHG', 'Additional Charge - Use of Facilities for Evening', 'Additional charge for Use of Facilities for Evening Service.', 400.00, NULL, NULL, false, 6),
  ('si003036', '3150', 'c1000000-0000-0000-0000-000000000005', 'XSRAVERT', 'Audio Visual Equipment Rental', NULL, 195.00, NULL, NULL, false, 7),
  ('si003037', '3150', 'c1000000-0000-0000-0000-000000000005', 'XSREQPRT', 'Cemetery Equipment Rental Fee', NULL, 175.00, NULL, NULL, false, 8),
  ('si003038', '3150', 'c1000000-0000-0000-0000-000000000005', 'DGSDIGCT', 'Dignity® Celebrant', 'Certified officiant for the service.', 395.00, NULL, NULL, false, 9),
  ('si003039', '3150', 'c1000000-0000-0000-0000-000000000005', 'CRMEXPFE', 'Cremation Expediting Fee', NULL, 495.00, NULL, NULL, false, 10),
  ('si003040', '3150', 'c1000000-0000-0000-0000-000000000005', 'CRMWTNFE', 'Cremation Witnessing Fee', NULL, 495.00, NULL, NULL, false, 11),
  ('si003041', '3150', 'c1000000-0000-0000-0000-000000000005', 'CRM03PTY', 'Crematory Fee', NULL, 995.00, NULL, NULL, false, 12),
  ('si003042', '3150', 'c1000000-0000-0000-0000-000000000005', 'FACFSEVC', 'Exclusive Venue', 'Exclusive use of all ceremony and visitation venues in the location for the duration of the visitation and ceremony.', 2595.00, NULL, NULL, false, 13),
  ('si003043', '3150', 'c1000000-0000-0000-0000-000000000005', 'FACFSVFS', 'Standard Venue', 'Flexible space in our location for service or gathering.', 495.00, NULL, NULL, false, 14),
  ('si003044', '3150', 'c1000000-0000-0000-0000-000000000005', 'FACFPVFS', 'Premium Venue', 'Larger flexible space in our location for service or gathering.', 595.00, NULL, NULL, false, 15),
  ('si003045', '3150', 'c1000000-0000-0000-0000-000000000005', 'XAIMNAI', 'Casket Medallions', 'Memorial keepsake that reflects the life of the individual and is displayed in specific caskets.', NULL, 50.00, 295.00, false, 16),
  ('si003046', '3150', 'c1000000-0000-0000-0000-000000000005', 'UCBSWSF8DR', 'Cremation Jewellery Bundle', 'Modern and contemporary designs inspired by stylish jewellery and fashion. Includes a matching pendant and chain, charm and earrings.', 295.00, NULL, NULL, false, 17),
  ('si003047', '3150', 'c1000000-0000-0000-0000-000000000005', 'SRVEXTCT', 'External Celebrant', 'Officiant for the service.', NULL, NULL, NULL, false, 18),
  ('si003048', '3150', 'c1000000-0000-0000-0000-000000000005', 'SRVPRIVC', 'Private Family Moment at our Facility', 'Allows for a private quiet time with the deceased for up to one hour with up to ten family members.', 295.00, NULL, NULL, false, 19),
  ('si003049', '3150', 'c1000000-0000-0000-0000-000000000005', 'SRVPLLBR', 'Professional Pallbearer', 'Per person.', 150.00, NULL, NULL, false, 20),
  ('si003050', '3150', 'c1000000-0000-0000-0000-000000000005', 'XSMAIMG1W', 'Other Register Book - Personal Collection', 'Providing family with a register book outside of the 2019 Stationery Program.', 140.00, NULL, NULL, false, 21),
  ('si003051', '3150', 'c1000000-0000-0000-0000-000000000005', 'FACRECPT', 'Reception Room', NULL, 599.00, NULL, NULL, false, 22),
  ('si003052', '3150', 'c1000000-0000-0000-0000-000000000005', 'XSMCCZ09Z', 'Retractable Floor Banner', NULL, 395.00, NULL, NULL, false, 23),
  ('si003053', '3150', 'c1000000-0000-0000-0000-000000000005', 'XFDDCBR', 'Single Small Medallion Case', NULL, 65.00, NULL, NULL, false, 24),
  ('si003054', '3150', 'c1000000-0000-0000-0000-000000000005', 'PRPSPAUT', 'Special Care for Autopsied Cases', NULL, 525.00, NULL, NULL, false, 25),
  ('si003055', '3150', 'c1000000-0000-0000-0000-000000000005', 'SPVHRLYR', 'Supervision for Visitation Per Hour', NULL, 395.00, NULL, NULL, false, 26),
  ('si003056', '3150', 'c1000000-0000-0000-0000-000000000005', 'SPVOFFSV', 'Supervision of Off-Site Venue', NULL, 595.00, NULL, NULL, false, 27),
  ('si003057', '3150', 'c1000000-0000-0000-0000-000000000005', 'SRVTRWG', 'Traditional Ritual Washing', NULL, 395.00, NULL, NULL, false, 28),
  ('si003058', '3150', 'c1000000-0000-0000-0000-000000000005', 'XFDDCBT', 'Triple Small Medallion Case', NULL, 95.00, NULL, NULL, false, 29),
  ('si003059', '3150', 'c1000000-0000-0000-0000-000000000005', 'SRVMRVSS', 'Venue and Staff Services to coordinate a Simple Gathering', NULL, 595.00, NULL, NULL, false, 30),
  ('si003060', '3150', 'c1000000-0000-0000-0000-000000000005', 'MEMMCAEM', 'Everlasting Memorial®', 'We turn your family’s memories into thoughtful keepsakes. Simply choose a theme, share your photos and videos, and our team will create polished, professional mementos to cherish forever.', 490.00, NULL, NULL, false, 31),
  ('si003061', '3150', 'c1000000-0000-0000-0000-000000000005', 'DOCESFRP', 'Estate Fraud Protection', 'With Estate Fraud Protection, fraud specialists will notify the credit reporting agencies to help protect your loved one’s estate from security breaches.', 135.00, NULL, NULL, false, 32),
  ('si003062', '3150', 'c1000000-0000-0000-0000-000000000005', NULL, 'Dignity Heritage Burial Flowers', NULL, 695.00, NULL, NULL, false, 33),
  ('si003063', '3150', 'c1000000-0000-0000-0000-000000000005', NULL, 'Dignity Honour Burial Flowers', NULL, 495.00, NULL, NULL, false, 34),
  ('si003064', '3150', 'c1000000-0000-0000-0000-000000000005', NULL, 'Dignity Heritage Cremation Flowers', NULL, 500.00, NULL, NULL, false, 35),
  ('si003065', '3150', 'c1000000-0000-0000-0000-000000000005', NULL, 'Dignity Honour Cremation Flowers', NULL, 400.00, NULL, NULL, false, 36),
  ('si003066', '3150', 'c1000000-0000-0000-0000-000000000005', NULL, 'Catered Receptions I', NULL, 795.00, NULL, NULL, false, 37),
  ('si003067', '3150', 'c1000000-0000-0000-0000-000000000005', NULL, 'Catered Receptions II', NULL, 995.00, NULL, NULL, false, 38),
  ('si003068', '3150', 'c1000000-0000-0000-0000-000000000005', NULL, 'Catered Receptions III', NULL, 1195.00, NULL, NULL, false, 39),
  -- Stationery
  ('si003069', '3150', 'c1000000-0000-0000-0000-000000000006', 'XDPAIEC', 'Esteemed Collection', 'Includes 1 Medium Memory Book, choice of 100 Large Memory Booklets or Memory Cards, choice of 25 Medium Tribute Thank You Cards or Signature Thank You Cards and 1 Keepsake Box.', 795.00, NULL, NULL, false, 1),
  ('si003070', '3150', 'c1000000-0000-0000-0000-000000000006', 'XDPAICV', 'Commemorative Collection', 'Includes 1 Medium Memory Book, choice of 100 Medium Memory Folders or Memory Cards, choice of 25 Medium Tribute Thank You Cards or Signature Thank You Cards and 1 Keepsake Box.', 495.00, NULL, NULL, false, 2),
  ('si003071', '3150', 'c1000000-0000-0000-0000-000000000006', 'XDPAIRC', 'Remembrance Collection', 'Includes 1 Medium Memory Book, choice of 100 Small Memory Folders or Memory Cards, choice of 25 Small Tribute Thank You Cards and 1 Keepsake Box.', 395.00, NULL, NULL, false, 3),
  ('si003072', '3150', 'c1000000-0000-0000-0000-000000000006', 'XDPAIOC', 'Our Collection', 'Includes 1 Memory Register Book, choice of 100 Our Collection Folders or Prayer Cards, choice of 50 Our Collection Thank You Cards and 1 Keepsake Box.', 395.00, NULL, NULL, false, 4),
  ('si003073', '3150', 'c1000000-0000-0000-0000-000000000006', 'XSMOT1S44', 'Our Collection Folders or Prayer Cards (Per 100)', 'Choose from a selection of themes available on site.', 195.00, NULL, NULL, false, 5),
  ('si003074', '3150', 'c1000000-0000-0000-0000-000000000006', 'XSMLG1S3L', 'Large Memory Booklets or Memory Cards (Per 100)', 'Large Memory Booklets feature 8 pages to represent a life well lived or include up to 15 photos, name, dates, service details, obituary and choice of poem or verse, or Large Memory Cards feature a soft-touch finish with rounded corners personalized with up to 5 photos, name, dates and choice of poem or verse.', 620.00, NULL, NULL, false, 6),
  ('si003075', '3150', 'c1000000-0000-0000-0000-000000000006', 'XSMMD1S3L', 'Medium Memory Cards or Memory Folders (Per 100)', 'Medium memory folders or memory cards include up to 4 photos, name, dates, service details, obituary, and choice of poem or verse.', 320.00, NULL, NULL, false, 7),
  ('si003076', '3150', 'c1000000-0000-0000-0000-000000000006', 'XSMDF1S3L', 'Small Memory Folders or Memory Cards (Per 100)', 'Small memory folders or small memory cards include 1 photo, name, dates, service details, obituary, and choice of poem or verse.', 220.00, NULL, NULL, false, 8),
  ('si003077', '3150', 'c1000000-0000-0000-0000-000000000006', 'XSMAX1S5L', 'Our Collection Thank You Cards (Per 50)', NULL, 100.00, NULL, NULL, false, 9),
  ('si003078', '3150', 'c1000000-0000-0000-0000-000000000006', 'XSMEG993L', 'Personalized Thank You Cards (Per 25)', NULL, 75.00, NULL, NULL, false, 10),
  ('si003079', '3150', 'c1000000-0000-0000-0000-000000000006', 'XSMBMBM5F', 'Soft Touch Bookmarks (50)', NULL, 200.00, NULL, NULL, false, 11),
  ('si003080', '3150', 'c1000000-0000-0000-0000-000000000006', 'XSMAI8M8M', 'Memory Register Book', 'The Ivory Register serves as a classic guest register for families and is printed on site.', 75.00, NULL, NULL, false, 12),
  ('si003081', '3150', 'c1000000-0000-0000-0000-000000000006', 'XSMMB1S3L', 'Medium Memory Book', 'This elegant ivory or charcoal keepsake book, adorned with a tone-on-tone pattern, documents guest lists and details of each guest’s life. Created from the template chosen from the stationery selection book.', 75.00, NULL, NULL, false, 13),
  ('si003082', '3150', 'c1000000-0000-0000-0000-000000000006', 'XSMKB1S3L', 'Keepsake Box', 'The modern keepsake box features a magnetic closure and is a useful way to preserve precious memories and keepsakes. (11.5" x 10" x 3.75")', 25.00, NULL, NULL, false, 14),
  -- Cash Advances
  ('si003083', '3150', 'c1000000-0000-0000-0000-000000000007', NULL, 'Consumer Protection BC Fee', NULL, 48.00, NULL, NULL, true, 1),
  ('si003084', '3150', 'c1000000-0000-0000-0000-000000000007', NULL, 'Clergy Honorarium', NULL, NULL, NULL, NULL, true, 2),
  ('si003085', '3150', 'c1000000-0000-0000-0000-000000000007', NULL, 'Hostess Fee', NULL, NULL, NULL, NULL, true, 3),
  ('si003086', '3150', 'c1000000-0000-0000-0000-000000000007', NULL, 'Music/Soloist/Piper', NULL, NULL, NULL, NULL, true, 4),
  ('si003087', '3150', 'c1000000-0000-0000-0000-000000000007', NULL, 'Newspaper Notice', NULL, NULL, NULL, NULL, true, 5),
  ('si003088', '3150', 'c1000000-0000-0000-0000-000000000007', NULL, 'Organist', NULL, NULL, NULL, NULL, true, 6),
  ('si003089', '3150', 'c1000000-0000-0000-0000-000000000007', NULL, 'Certified Copies of the Death Certificate', NULL, NULL, NULL, NULL, true, 7),
  ('si003090', '3150', 'c1000000-0000-0000-0000-000000000007', NULL, 'Public Transportation', NULL, NULL, NULL, NULL, true, 8),
  ('si003091', '3150', 'c1000000-0000-0000-0000-000000000007', NULL, 'Cemetery Fees', NULL, NULL, NULL, NULL, true, 9),
  ('si003092', '3150', 'c1000000-0000-0000-0000-000000000007', NULL, 'Outside Funeral Director Expense', NULL, NULL, NULL, NULL, true, 10),
  -- Caskets & Containers (PPL package representative items)
  ('si003093', '3150', 'c1000000-0000-0000-0000-000000000008', NULL, 'Recommended Casket — Heritage Tier', 'Choice of: Batesville Hadyn, Victoriaville Dominion HC Wood Maple Crepe, Batesville Fireside, or Batesville Eleanor Oak.', 4099.00, NULL, NULL, false, 1),
  ('si003094', '3150', 'c1000000-0000-0000-0000-000000000008', NULL, 'Recommended Casket — Honour Tier', 'Choice of: Batesville Watson, Victoriaville Sherwood Oak, Batesville Bailey, or Victoriaville Hartvic.', 3599.00, NULL, NULL, false, 2),
  ('si003095', '3150', 'c1000000-0000-0000-0000-000000000008', NULL, 'Recommended Casket — Tribute Tier', 'Choice of: Batesville Coleridge, Batesville Montgomery, Victoriaville Heavenly White, or Victoriaville Winfield.', 2999.00, NULL, NULL, false, 3),
  ('si003096', '3150', 'c1000000-0000-0000-0000-000000000008', NULL, 'Batesville Brockton Oak Ceremonial', 'Hardwood ceremonial casket used as a cremation container for the service.', 1599.00, NULL, NULL, false, 4),
  ('si003097', '3150', 'c1000000-0000-0000-0000-000000000008', NULL, 'Batesville Brockton Oak (1 Hour Rental)', 'Hardwood ceremonial casket rental used as a cremation container for the service.', 850.00, NULL, NULL, false, 5),
  ('si003098', '3150', 'c1000000-0000-0000-0000-000000000008', NULL, 'Vancouver Casket Cypress', 'Hollow cored poplar cremation container with natural finish.', 595.00, NULL, NULL, false, 6),
  -- Urns
  ('si003099', '3150', 'c1000000-0000-0000-0000-000000000009', NULL, 'Memorial Urn Selection — Heritage Tier', 'Choice of: LoveUrns HeartFelt™ Gold, Terrybear Eminence White Marble Urn, Granville Lucinda Blue Horizontal Urn, or Granville Charlotte Horizontal Urn.', 1295.00, NULL, NULL, false, 1),
  ('si003100', '3150', 'c1000000-0000-0000-0000-000000000009', NULL, 'Memorial Urn Selection — Honour Tier', 'Choice of: Urnes Bégin Versatile Urn Navy, LoveUrns Laurel Midnight, Terrybear Satori Ocean Pearl, or Batesville Memento Chest.', 795.00, NULL, NULL, false, 2),
  ('si003101', '3150', 'c1000000-0000-0000-0000-000000000009', NULL, 'Memorial Urn Selection — Tribute Tier', 'Choice of: LoveUrns Laurel Crimson, Urnes Bégin Sky Pewter, Mackenzie Classic Sky Blue, or Batesville Cherry Chest.', 595.00, NULL, NULL, false, 3),
  ('si003102', '3150', 'c1000000-0000-0000-0000-000000000009', 'UMCBFSZA7', 'Roses Vase', 'Cast bronze urn adorned with hand sculpted roses. (Urnes Bégin)', 2895.00, NULL, NULL, false, 4),
  ('si003103', '3150', 'c1000000-0000-0000-0000-000000000009', 'UWACFSJDT', 'Lucinda Blue Horizontal Urn', 'Handcrafted blue-green wood inlaid urn with a high-gloss lacquer finish. Features a peaceful dove with a gently flowing ribbon and delicate flowers. TSA-compliant. (Granville)', 1295.00, NULL, NULL, false, 5),
  ('si003104', '3150', 'c1000000-0000-0000-0000-000000000009', 'UWMGFSJDJ', 'Charlotte Horizontal Urn', 'Handcrafted dark and light green wood inlaid urn with a high-gloss lacquer finish. Features a geometric pattern with interlocking diagonals. TSA-compliant. (Granville)', 1295.00, NULL, NULL, false, 6),
  ('si003105', '3150', 'c1000000-0000-0000-0000-000000000009', 'UWMGFSJDP', 'Holden Horizontal Urn', 'Handcrafted black and jewel tone wood inlaid urn with a high-gloss lacquer finish. Features beautiful yellow and orange flowers with weaving soft green vines. TSA-compliant. (Granville)', 1295.00, NULL, NULL, false, 7),
  ('si003106', '3150', 'c1000000-0000-0000-0000-000000000009', 'UWMPFSJDX', 'Stephen Horizontal Urn', 'Handcrafted natural wood inlaid urn with a high-gloss lacquer finish. Features a refined, symmetrical design with overlapping lines. (Granville)', 1295.00, NULL, NULL, false, 8),
  ('si003107', '3150', 'c1000000-0000-0000-0000-000000000009', 'UOCMFSAE5', 'Classic Carrera Cultured Stone Urn', 'Durable cultured marble urn made from polymer and stone. (Mackenzie)', 595.00, NULL, NULL, false, 9),
  ('si003108', '3150', 'c1000000-0000-0000-0000-000000000009', 'UOCMFSAE6', 'Classic Sky Blue Cultured Stone Urn', 'Durable cultured marble urn made from polymer and stone. (Mackenzie)', 595.00, NULL, NULL, false, 10),
  ('si003109', '3150', 'c1000000-0000-0000-0000-000000000009', 'UOCMFSAE7', 'Classic Verde Green Cultured Stone Urn', 'Durable cultured marble urn made from polymer and stone. (Mackenzie)', 595.00, NULL, NULL, false, 11),
  ('si003110', '3150', 'c1000000-0000-0000-0000-000000000009', 'UOMBFSRMB', 'Eminence Black Marble Urn', 'Natural black marble urn that is fully customizable. Design elements include text, different corner designs, custom line art, glass photo inlay, gemstone embellishments, abalone shell inlay, and different engraving fill colors. (Terrybear)', 1295.00, NULL, NULL, false, 12),
  ('si003111', '3150', 'c1000000-0000-0000-0000-000000000009', 'UOMBFSRME', 'Eminence White Marble Urn', 'Natural white marble urn that is fully customizable. Design elements include text, different corner designs, custom line art, glass photo inlay, gemstone embellishments, abalone shell inlay, and different engraving fill colors. (Terrybear)', 1295.00, NULL, NULL, false, 13),
  ('si003112', '3150', 'c1000000-0000-0000-0000-000000000009', 'UOMBFSAE4', 'Carrera Marble Vase', 'Natural stone marble vase made from Carrera-inspired marble, polished to a gleaming shine. (Marble Products)', 595.00, NULL, NULL, false, 14),
  ('si003113', '3150', 'c1000000-0000-0000-0000-000000000009', 'UOOXFSAOV', 'Onyx Vase', 'Marble urn with variations of light green and dark earth tones. (Marble Products)', 595.00, NULL, NULL, false, 15),
  ('si003114', '3150', 'c1000000-0000-0000-0000-000000000009', 'UOMBFSAFA', 'Sand Rectangle Marble Urn', 'Sand-colored marble urn with natural accents. Suitable as single or companion. (Marble Products)', 510.00, NULL, NULL, false, 16),
  ('si003115', '3150', 'c1000000-0000-0000-0000-000000000009', 'UOMBFSAFB', 'Sand Vase Marble Urn', 'Sand-colored marble urn with natural accents. (Marble Products)', 495.00, NULL, NULL, false, 17),
  ('si003116', '3150', 'c1000000-0000-0000-0000-000000000009', 'UOUOFS5ZF', 'Love Dove Porcelain Urn', 'Porcelain full size dove shaped urn in white color. (LoveUrns)', 695.00, NULL, NULL, false, 18),
  ('si003117', '3150', 'c1000000-0000-0000-0000-000000000009', 'UOPLFS5ZF', 'White Soulful Shell Porcelain Urn', 'Porcelain full size shell shaped urn in white color. (LoveUrns)', 595.00, NULL, NULL, false, 19),
  ('si003118', '3150', 'c1000000-0000-0000-0000-000000000009', 'UOPLSB5ZF', 'Yellow Soulful Shell Porcelain Urn', 'Porcelain full size shell shaped urn in yellow color. (LoveUrns)', 595.00, NULL, NULL, false, 20),
  ('si003119', '3150', 'c1000000-0000-0000-0000-000000000009', 'UOPLFSAE9', 'Lenox Porcelain Urn', 'Classic and elegant porcelain vase made from Genuine Lenox Porcelain with 24 karat gold gilding. (Elegante Brass)', 495.00, NULL, NULL, false, 21),
  ('si003120', '3150', 'c1000000-0000-0000-0000-000000000009', 'UOCRFSARB', 'Rose Bouquet Ceramic Urn', 'Ceramic urn with hand-painted rose bouquet detail. Features a floral motif on a pearlescent ivory background. (Terrybear)', 350.00, NULL, NULL, false, 22),
  ('si003121', '3150', 'c1000000-0000-0000-0000-000000000009', 'UMZNFSOIL', 'Guardian Angel Bronze Urn', 'Precision casting, 100% solid bronze urn showing an angel crying over a tomb, and two doves taking their flight. (Urnes Bégin)', 4995.00, NULL, NULL, false, 23),
  ('si003122', '3150', 'c1000000-0000-0000-0000-000000000009', 'UMZNFSOII', 'Fidelity Couple Companion Bronze Urn', 'Precision casting, 100% solid bronze urns showing a man and a woman waiting for each other at the paradise doors. (Urnes Bégin)', 3895.00, NULL, NULL, false, 24),
  ('si003123', '3150', 'c1000000-0000-0000-0000-000000000009', 'UMZNFSOIJ', 'Fidelity Couple Woman Bronze Urn', 'Precision casting, 100% solid bronze urn showing a woman waiting at the paradise doors. (Urnes Bégin)', 1995.00, NULL, NULL, false, 25),
  ('si003124', '3150', 'c1000000-0000-0000-0000-000000000009', 'UMZNFSOIK', 'Fidelity Couple Man Bronze Urn', 'Precision casting, 100% solid bronze urn showing a man waiting at the paradise doors. (Urnes Bégin)', 1995.00, NULL, NULL, false, 26),
  ('si003125', '3150', 'c1000000-0000-0000-0000-000000000009', 'UMBZFSZER', 'Eternal Bronze Urn', 'Die cast 100% bronze urn with bronze dove ornament. (Urnes Bégin)', 1895.00, NULL, NULL, false, 27),
  ('si003126', '3150', 'c1000000-0000-0000-0000-000000000009', 'UMZNFSAGE', 'The Vine Companion Urn', 'Die-cast zinc urn, with a solid bronze face and vine embellishment. Purchased together. (Urnes Bégin)', 1535.00, NULL, NULL, false, 28),
  ('si003127', '3150', 'c1000000-0000-0000-0000-000000000009', 'UMALAHPPD', 'Double Versatile Pink Aluminum Urn', 'Elegant pink aluminum urn with customizable front plate offering high quality, vibrant images that reflect the unique relationship between two individuals as a companion urn. (Urnes Bégin)', 1395.00, NULL, NULL, false, 29),
  ('si003128', '3150', 'c1000000-0000-0000-0000-000000000009', 'UMALAHPV5', 'Double Versatile Matte Black Aluminum Urn', 'Elegant matte black aluminum urn with customizable front plate offering high quality, vibrant images that reflect the unique relationship between two individuals as a companion urn. (Urnes Bégin)', 1395.00, NULL, NULL, false, 30),
  ('si003129', '3150', 'c1000000-0000-0000-0000-000000000009', 'UMALAHPVG', 'Double Versatile Champagne Aluminum Urn', 'Elegant champagne aluminum urn with customizable front plate offering high quality, vibrant images that reflect the unique relationship between two individuals as a companion urn. (Urnes Bégin)', 1395.00, NULL, NULL, false, 31),
  ('si003130', '3150', 'c1000000-0000-0000-0000-000000000009', 'UMALAHPVL', 'Double Versatile Charcoal Aluminum Urn', 'Elegant charcoal aluminum urn with customizable front plate offering high quality, vibrant images that reflect the unique relationship between two individuals as a companion urn. (Urnes Bégin)', 1395.00, NULL, NULL, false, 32),
  ('si003131', '3150', 'c1000000-0000-0000-0000-000000000009', 'UMALAHPVR', 'Double Versatile Bronze Aluminum Urn', 'Elegant bronze aluminum urn with customizable front plate offering high quality, vibrant images that reflect the unique relationship between two individuals as a companion urn. (Urnes Bégin)', 1395.00, NULL, NULL, false, 33),
  ('si003132', '3150', 'c1000000-0000-0000-0000-000000000009', 'UMALAHPVV', 'Double Versatile Navy Aluminum Urn', 'Elegant navy aluminum urn with customizable front plate offering high quality, vibrant images that reflect the unique relationship between two individuals as a companion urn. (Urnes Bégin)', 1395.00, NULL, NULL, false, 34),
  ('si003133', '3150', 'c1000000-0000-0000-0000-000000000009', 'UMALAHPVW', 'Double Versatile Sparkling White Aluminum Urn', 'Elegant sparkling white aluminum urn with customizable front plate offering high quality, vibrant images that reflect the unique relationship between two individuals as a companion urn. (Urnes Bégin)', 1395.00, NULL, NULL, false, 35),
  ('si003134', '3150', 'c1000000-0000-0000-0000-000000000009', 'UMBRFSDTF', 'HeartFelt™ Gold Brass Urn', 'Solid Brass Heart shaped Full Size Urn with Crystal. (Keepsakes and/or accessories sold separately) (LoveUrns)', 1295.00, NULL, NULL, false, 36),
  ('si003135', '3150', 'c1000000-0000-0000-0000-000000000009', 'UMZNFSOIH', 'Personalized Double Doves Urn', 'Die cast zinc urn with a bronze face, with two dove bronze ornaments. (Urnes Bégin)', 1195.00, NULL, NULL, false, 37),
  ('si003136', '3150', 'c1000000-0000-0000-0000-000000000009', 'UMBZFSZLV', 'Lily of the Valley Urn', 'Die cast zinc urn with a solid bronze face, with a molded lily embellishment. (Urnes Bégin)', 1095.00, NULL, NULL, false, 38),
  ('si003137', '3150', 'c1000000-0000-0000-0000-000000000009', 'UMZNFSOIE', 'Double Oak Urn', 'Die cast zinc urn with bronze face, with an oak molded embellishment. (Urnes Bégin)', 1075.00, NULL, NULL, false, 39),
  ('si003138', '3150', 'c1000000-0000-0000-0000-000000000009', 'UMCBFSABF', 'Cast Bronze Rectangle Urn', 'Cast bronze construction with brushed and polished finish. (Batesville)', 1070.00, NULL, NULL, false, 40),
  ('si003139', '3150', 'c1000000-0000-0000-0000-000000000009', 'UMCBFSABE', 'Cast Bronze Cylinder Urn', 'Cast bronze construction with brushed and polished finish. (Batesville)', 910.00, NULL, NULL, false, 41),
  ('si003140', '3150', 'c1000000-0000-0000-0000-000000000009', 'UMBZFSZPB', 'Personalized Solid Bronze Urn', 'Die cast zinc urn with bronze face, with a bronze ornament from the personalized collection. Over a hundred ornaments available. (Urnes Bégin)', 895.00, NULL, NULL, false, 42),
  ('si003141', '3150', 'c1000000-0000-0000-0000-000000000009', 'UMZNFSAGF', 'The Vine Left Bronze Urn', 'Die-cast zinc urn, with a solid bronze face and vine embellishment. Design to the left of engraving plate. (Urnes Bégin)', 895.00, NULL, NULL, false, 43),
  ('si003142', '3150', 'c1000000-0000-0000-0000-000000000009', 'UMZNFSAGK', 'The Vine Right Bronze Urn', 'Die-cast zinc urn, solid bronze face, vine embellishment. Design to the right of engraving plate. (Urnes Bégin)', 895.00, NULL, NULL, false, 44),
  ('si003143', '3150', 'c1000000-0000-0000-0000-000000000009', 'UMZNFSOIB', 'Serenity Rose Urn', 'Die cast zinc urn with bronze rose ornament and grey brushed edge. (Urnes Bégin)', 895.00, NULL, NULL, false, 45),
  ('si003144', '3150', 'c1000000-0000-0000-0000-000000000009', 'UMZNFSOIC', 'Serenity Tree Urn', 'Die cast zinc urn with bronze tree ornament and grey brushed edge. (Urnes Bégin)', 895.00, NULL, NULL, false, 46),
  ('si003145', '3150', 'c1000000-0000-0000-0000-000000000009', 'UMZNFSOID', 'Serenity Plain Urn', 'Die cast zinc urn with grey brushed edge. (Urnes Bégin)', 895.00, NULL, NULL, false, 47),
  ('si003146', '3150', 'c1000000-0000-0000-0000-000000000009', 'UMBRFSLFP', 'Elegant Leaf Brass Urn', 'Brass urn with deep emerald finish complete with brass fern leaf detail. (LoveUrns)', 895.00, NULL, NULL, false, 48),
  ('si003147', '3150', 'c1000000-0000-0000-0000-000000000009', 'UMBRFSLFR', 'Simplicity Brass Urn', 'Brass and metal alloy urn with a radiant midnight finish and silver accents. (LoveUrns)', 795.00, NULL, NULL, false, 49),
  ('si003148', '3150', 'c1000000-0000-0000-0000-000000000009', 'UMBRFSASK', 'Satori Pink Pearl Brass Urn', 'Brass urn with beautiful pearl pink finish and metallic shimmer. Features an artistic, contemporary shape and polished bronze finish accents. (Terrybear)', 795.00, NULL, NULL, false, 50),
  ('si003149', '3150', 'c1000000-0000-0000-0000-000000000009', 'UMBRFSASO', 'Satori Ocean Pearl Brass Urn', 'Brass urn with beautiful pearl blue ocean finish and metallic shimmer. Features an artistic, contemporary shape and polished bronze finish accents. (Terrybear)', 795.00, NULL, NULL, false, 51),
  ('si003150', '3150', 'c1000000-0000-0000-0000-000000000009', 'UMBRFSASW', 'Satori White Pearl Brass Urn', 'Brass urn with beautiful pearl white finish and metallic shimmer. Features an artistic, contemporary shape and polished bronze finish accents. (Terrybear)', 795.00, NULL, NULL, false, 52),
  ('si003151', '3150', 'c1000000-0000-0000-0000-000000000009', 'UMBRFSLSG', 'Teardrop Matte Sage Green Brass Urn', 'Unique sage green teardrop shaped brass urn with a soft touch finish and brushed gold top. (LoveUrns)', 795.00, NULL, NULL, false, 53),
  ('si003152', '3150', 'c1000000-0000-0000-0000-000000000009', 'UMBZFSZMD', 'Memories Bronze Urn', 'Die cast zinc urn with bronze plate and bronze embellishments. (Urnes Bégin)', 795.00, NULL, NULL, false, 54),
  ('si003153', '3150', 'c1000000-0000-0000-0000-000000000009', 'UMBZFSZOL', 'Oak Left Bronze Urn', 'Die cast zinc urn with a solid bronze face, tree embellishment molded on the sides. Design on left. (Urnes Bégin)', 795.00, NULL, NULL, false, 55),
  ('si003154', '3150', 'c1000000-0000-0000-0000-000000000009', 'UMBZFSZOR', 'Oak Right Bronze Urn', 'Die cast zinc urn with a solid bronze face, tree embellishment molded on the sides. Design on right. (Urnes Bégin)', 795.00, NULL, NULL, false, 56),
  ('si003155', '3150', 'c1000000-0000-0000-0000-000000000009', 'UMALFSPG0', 'Versatile Urn Champagne', 'Sleek aluminum champagne urn with a customizable front plate offering high quality, vibrant images that reflect the unique personality and passions of your loved one. (Urnes Bégin)', 795.00, NULL, NULL, false, 57),
  ('si003156', '3150', 'c1000000-0000-0000-0000-000000000009', 'UMALFSPG1', 'Versatile Urn Charcoal', 'Sleek aluminum charcoal urn with a customizable front plate offering high quality, vibrant images that reflect the unique personality and passions of your loved one. (Urnes Bégin)', 795.00, NULL, NULL, false, 58),
  ('si003157', '3150', 'c1000000-0000-0000-0000-000000000009', 'UMALFSPG3', 'Versatile Urn Navy', 'Sleek aluminum navy urn with a customizable front plate offering high quality, vibrant images that reflect the unique personality and passions of your loved one. (Urnes Bégin)', 795.00, NULL, NULL, false, 59),
  ('si003158', '3150', 'c1000000-0000-0000-0000-000000000009', 'UMALFSPG4', 'Versatile Urn Pink', 'Sleek aluminum pink urn with a customizable front plate offering high quality, vibrant images that reflect the unique personality and passions of your loved one. (Urnes Bégin)', 795.00, NULL, NULL, false, 60),
  ('si003159', '3150', 'c1000000-0000-0000-0000-000000000009', 'UMALFSPG5', 'Versatile Urn Sparkling White', 'Sleek aluminum sparkling white urn with a customizable front plate offering high quality, vibrant images that reflect the unique personality and passions of your loved one. (Urnes Bégin)', 795.00, NULL, NULL, false, 61),
  ('si003160', '3150', 'c1000000-0000-0000-0000-000000000009', 'UMALFSPGZ', 'Versatile Urn Bronze', 'Sleek aluminum bronze urn with a customizable front plate offering high quality, vibrant images that reflect the unique personality and passions of your loved one. (Urnes Bégin)', 795.00, NULL, NULL, false, 62),
  ('si003161', '3150', 'c1000000-0000-0000-0000-000000000009', 'UMALFSPVY', 'Versatile Urn Matte Black', 'Sleek aluminum matte black urn with a customizable front plate offering high quality, vibrant images that reflect the unique personality and passions of your loved one. (Urnes Bégin)', 795.00, NULL, NULL, false, 63),
  ('si003162', '3150', 'c1000000-0000-0000-0000-000000000009', 'UMASFSLMB', 'Teardrop Matte Black Brass Urn', 'Unique matte black teardrop shaped brass urn with a soft touch finish and brushed gun metal top. (LoveUrns)', 795.00, NULL, NULL, false, 64),
  ('si003163', '3150', 'c1000000-0000-0000-0000-000000000009', 'UMBRFSAAF', 'Laurel White Pearl Vase', 'Alloy and brass vase with a pristine white hand-applied enamel design. (LoveUrns)', 795.00, NULL, NULL, false, 65),
  ('si003164', '3150', 'c1000000-0000-0000-0000-000000000009', 'UMBRFSAAU', 'Laurel Midnight Vase', 'Alloy and brass vase with a rich charcoal hand-applied enamel design. (LoveUrns)', 795.00, NULL, NULL, false, 66),
  ('si003165', '3150', 'c1000000-0000-0000-0000-000000000009', 'UMBRFSLFS', 'Soul Bird Urn', 'Elegant and sleek brass bird shaped urn. (Keepsakes and/or accessories sold separately) (LoveUrns)', 715.00, NULL, NULL, false, 67),
  ('si003166', '3150', 'c1000000-0000-0000-0000-000000000009', 'UMADFS5AU', 'Amore™ Red Urn', 'Solid Brass Full Size Urn with Red and Polished Silver Finish. Compartment on top to keep memorable items. (LoveUrns)', 695.00, NULL, NULL, false, 68),
  ('si003167', '3150', 'c1000000-0000-0000-0000-000000000009', 'UMABFS5AU', 'Laurel Crimson Urn', 'Crimson Color Metal Full Size Urn with Brushed Gold Lid. (Keepsakes and/or accessories sold separately) (LoveUrns)', 595.00, NULL, NULL, false, 69),
  ('si003168', '3150', 'c1000000-0000-0000-0000-000000000009', 'UMBRFSLFX', 'Wings of Hope Blue Urn', 'Elegant butterfly designed brass and enamel urn with blue inlays and pearlescent finish. (LoveUrns)', 595.00, NULL, NULL, false, 70),
  ('si003169', '3150', 'c1000000-0000-0000-0000-000000000009', 'UMBRFSLFY', 'Wings of Hope Lavender Urn', 'Elegant butterfly designed brass and enamel urn with lavender inlays and pearlescent finish. (LoveUrns)', 595.00, NULL, NULL, false, 71),
  ('si003170', '3150', 'c1000000-0000-0000-0000-000000000009', 'UMBRFSLFZ', 'Wings of Hope Pearl Urn', 'Elegant butterfly designed brass and enamel urn with white inlays and pearlescent finish. (LoveUrns)', 595.00, NULL, NULL, false, 72),
  ('si003171', '3150', 'c1000000-0000-0000-0000-000000000009', 'UMBRFSDLY', 'Flying Doves Urn', 'Blue Metal Full Size Urn with hand engraved Dove Design. (Keepsakes and/or accessories sold separately) (LoveUrns)', 595.00, NULL, NULL, false, 73),
  ('si003172', '3150', 'c1000000-0000-0000-0000-000000000009', 'UMBRFSAMP', 'Mother of Pearl Elite Urn', 'Polished brass urn with iridescent Mother of Pearl mosaic tile. (Keepsakes and/or accessories sold separately) (LoveUrns)', 595.00, NULL, NULL, false, 74),
  ('si003173', '3150', 'c1000000-0000-0000-0000-000000000009', 'UMBRFSLWY', 'Wings of Hope Yellow Urn', 'Elegant butterfly designed brass and enamel urn with yellow inlays and pearlescent finish. (LoveUrns)', 595.00, NULL, NULL, false, 75),
  ('si003174', '3150', 'c1000000-0000-0000-0000-000000000009', 'UMZNFSOHX', 'Sky Pewter Urn', 'Die cast zinc urn with a pewter marbling finish showing a sky with two bronze angel ornaments. (Urnes Bégin)', 595.00, NULL, NULL, false, 76),
  ('si003175', '3150', 'c1000000-0000-0000-0000-000000000009', 'UMZNFSOHY', 'Sky Pink Urn', 'Die cast zinc urn with a pink marbling finish showing a sky with two bronze angel ornaments. (Urnes Bégin)', 595.00, NULL, NULL, false, 77),
  ('si003176', '3150', 'c1000000-0000-0000-0000-000000000009', 'UMZNFSOHZ', 'Sky Brown Urn', 'Die cast zinc urn with a brown marbling finish showing a sky with two bronze angel ornaments. (Urnes Bégin)', 595.00, NULL, NULL, false, 78),
  ('si003177', '3150', 'c1000000-0000-0000-0000-000000000009', 'UMZNFSOIA', 'Sky Blue Urn', 'Die cast zinc urn with a blue marbling finish showing a sky with two bronze angel ornaments. (Urnes Bégin)', 595.00, NULL, NULL, false, 79),
  ('si003178', '3150', 'c1000000-0000-0000-0000-000000000009', 'UMSBFSAFG', 'Sheet Bronze Cylinder Urn', 'Constructed from 64 oz sheet bronze with brushed and polished finish. (Batesville)', 595.00, NULL, NULL, false, 80),
  ('si003179', '3150', 'c1000000-0000-0000-0000-000000000009', 'UMSBFSAFI', 'Sheet Bronze Rectangle Urn', 'Constructed from 64 oz sheet bronze with brushed and polished finish. (Batesville)', 595.00, NULL, NULL, false, 81),
  ('si003180', '3150', 'c1000000-0000-0000-0000-000000000009', 'UMZNFSZA4', 'Flight of Doves Left Urn', 'Die cast zinc urn in an "S" shape, metal grey finish and 3 silver dove ornaments. (Urnes Bégin)', 595.00, NULL, NULL, false, 82),
  ('si003181', '3150', 'c1000000-0000-0000-0000-000000000009', 'UMZNFSZA5', 'Flight of Doves Right Urn', 'Die cast zinc urn in an "S" shape, metal grey finish and 3 silver dove ornaments. (Urnes Bégin)', 595.00, NULL, NULL, false, 83),
  ('si003182', '3150', 'c1000000-0000-0000-0000-000000000009', 'UMCBFSADS', 'Omega Vase', 'Cast bronze vase with polished gold-tone accents. (Terrybear)', 545.00, NULL, NULL, false, 84),
  ('si003183', '3150', 'c1000000-0000-0000-0000-000000000009', 'UMBRFSAFM', 'Silver Vase', 'Polished antique silver-toned brass with gold-toned accents. (Terrybear)', 545.00, NULL, NULL, false, 85),
  ('si003184', '3150', 'c1000000-0000-0000-0000-000000000009', 'UMBRFSDFO', 'Art Deco Urn', 'Brass urn with classic and sleek style with enameled bands. (Keepsakes and/or accessories sold separately) (LoveUrns)', 495.00, NULL, NULL, false, 86),
  ('si003185', '3150', 'c1000000-0000-0000-0000-000000000009', 'UMBRFSLFO', 'Divine Urn', 'Beautifully designed blue brass and enamel urn with enameled finish. (LoveUrns)', 495.00, NULL, NULL, false, 87),
  ('si003186', '3150', 'c1000000-0000-0000-0000-000000000009', 'UMBRFSABQ', 'Dove Vase', 'Nickel-plated brass vase with blue accents and dove design. (Keepsakes and/or accessories sold separately) (LoveUrns)', 495.00, NULL, NULL, false, 88),
  ('si003187', '3150', 'c1000000-0000-0000-0000-000000000009', 'UMBRFSADP', 'Moonlight Blue Vase', 'Brass urn with a deep blue finish with metallic shimmer. Features a contemporary shape and pewter-finish accent bands. (Terrybear)', 460.00, NULL, NULL, false, 89),
  ('si003188', '3150', 'c1000000-0000-0000-0000-000000000009', 'UMBRFSAPE', 'Bright Stripes Blue Urn', 'Brass urn with bright blue striped finish. (Terrybear)', 425.00, NULL, NULL, false, 90),
  ('si003189', '3150', 'c1000000-0000-0000-0000-000000000009', 'UMBRFSARS', 'Bright Stripes Red Urn', 'Brass urn with bright crimson striped finish. (Terrybear)', 425.00, NULL, NULL, false, 91),
  ('si003190', '3150', 'c1000000-0000-0000-0000-000000000009', 'UMBRFSAUP', 'Bright Stripes Purple Urn', 'Brass urn with bright purple striped finish. (Terrybear)', 425.00, NULL, NULL, false, 92),
  ('si003191', '3150', 'c1000000-0000-0000-0000-000000000009', 'UMBRACLTE', 'CuddleBear™ Blue Child Urn', 'Teddy Bear shaped Child Urn in Blue finish with Crystal. (Keepsakes and/or accessories sold separately) (LoveUrns)', 195.00, NULL, NULL, false, 93),
  ('si003192', '3150', 'c1000000-0000-0000-0000-000000000009', 'UMBRACLTP', 'CuddleBear™ Pink Child Urn', 'Teddy Bear shaped Child Urn in Pink finish with Crystal. (Keepsakes and/or accessories sold separately) (LoveUrns)', 195.00, NULL, NULL, false, 94),
  ('si003193', '3150', 'c1000000-0000-0000-0000-000000000009', 'UMZNACZ88', 'CuddleBear™ White Child Urn', 'Teddy Bear shaped Child Urn in White finish with Crystal. (LoveUrns)', 195.00, NULL, NULL, false, 95),
  ('si003194', '3150', 'c1000000-0000-0000-0000-000000000009', 'UW3QFSGMU', 'Classic Stained Maple Urn', 'Urban grey stained maple urn with customizable front plates. (Urnes Bégin)', 895.00, NULL, NULL, false, 96),
  ('si003195', '3150', 'c1000000-0000-0000-0000-000000000009', 'UWMPFSACR', 'Bois Silver Maple Urn', 'Canadian maple wood urn with dark brown stain and contrasting dark walnut inlay stripe. (Urnes Bégin)', 895.00, NULL, NULL, false, 97),
  ('si003196', '3150', 'c1000000-0000-0000-0000-000000000009', 'UWBHFSADF', 'Memento Chest Urn', 'Mixed hardwoods and burl wood veneer top with wood inlay and high gloss lacquer finish. Features plastic insert and one key. TSA-compliant. (Batesville)', 795.00, NULL, NULL, false, 98),
  ('si003197', '3150', 'c1000000-0000-0000-0000-000000000009', 'UWWDFSAMA', 'Moments Azalea Urn and Frame', 'Mixed hardwood urn with removable Tiffany-inspired Azalea frame keepsake. Frame keepsake is magnetically attached to urn and can be displayed separately. (Terrybear)', 690.00, NULL, NULL, false, 99),
  ('si003198', '3150', 'c1000000-0000-0000-0000-000000000009', 'UWAKFSACV', 'Mozart Memory Chest Urn', 'Medium Density Fiberboard with veneer memory chest in bombe shape reminiscent of European furniture. TSA-compliant. (Terrybear)', 595.00, NULL, NULL, false, 100),
  ('si003199', '3150', 'c1000000-0000-0000-0000-000000000009', 'UWBHFSABH', 'Cherry Chest Urn', 'Composite wood veneer chest with cherry-stained finish. TSA-compliant. (Batesville)', 595.00, NULL, NULL, false, 101),
  ('si003200', '3150', 'c1000000-0000-0000-0000-000000000009', 'UWBHFSADQ', 'Natural Cube Urn', 'Solid birchwood with burl wood veneer and high gloss lacquer finish. TSA-compliant. (Batesville)', 495.00, NULL, NULL, false, 102),
  ('si003201', '3150', 'c1000000-0000-0000-0000-000000000009', 'UWTAFSFME', 'Modern Essential Vintage Urn', 'Acacia hardwood urn with a contemporary design in a vintage finish. Each urn features a unique woodgrain. TSA-compliant. (Terrybear)', 495.00, NULL, NULL, false, 103),
  ('si003202', '3150', 'c1000000-0000-0000-0000-000000000009', 'UWTAFSFMS', 'Modern Essential Sable Urn', 'Acacia hardwood urn with a contemporary design in a sable finish. Each urn features a unique woodgrain. TSA-compliant. (Terrybear)', 495.00, NULL, NULL, false, 104),
  ('si003203', '3150', 'c1000000-0000-0000-0000-000000000009', 'UOFBFSANO', 'Natural Box Urn', 'Composite wood with a paper wrap providing a natural wood grain look with matte polish. Features a sliding bottom with one point access for easy use. TSA-compliant. (Batesville)', 200.00, NULL, NULL, false, 105),
  ('si003204', '3150', 'c1000000-0000-0000-0000-000000000009', 'UWXCFSZLT', 'Living Tribute Urn', 'Handmade wooden urn with vibrant grain and a finely sanded surface; comes with your choice of succulent. TSA-compliant. (BioLife)', 895.00, NULL, NULL, false, 106),
  ('si003205', '3150', 'c1000000-0000-0000-0000-000000000009', 'UOBDFSAFE', 'The Living Urn', 'Natural fiber biodegradable urn and tree planting system, designed to grow a beautiful memory tree, plant, or flowers. Kit includes biodegradable urn, RootProtect® neutralizing agent, aged wood chips, and handmade bamboo case. Includes tree of choice. TSA-compliant. (BioLife)', 595.00, NULL, NULL, false, 107),
  ('si003206', '3150', 'c1000000-0000-0000-0000-000000000009', 'UORDFSARP', 'Carpel Rock Salt Urn', 'Full-capacity urn that is a perfect vessel for a natural disposition. Designed for sea burials or water funerals; guaranteed to dissolve in four hours. TSA-compliant. (Marble Products)', 580.00, NULL, NULL, false, 108),
  ('si003207', '3150', 'c1000000-0000-0000-0000-000000000009', 'UOBGFS5V5', 'OceanBlue™ Eco Urn', 'Biodegradable Full Size Urn in Blue and White color. TSA-compliant. (LoveUrns)', 495.00, NULL, NULL, false, 109),
  ('si003208', '3150', 'c1000000-0000-0000-0000-000000000009', 'UODFFS5V4', 'EarthBrown™ Eco Urn', 'Biodegradable Full Size Urn in Brown and White color. TSA-compliant. (LoveUrns)', 495.00, NULL, NULL, false, 110),
  ('si003209', '3150', 'c1000000-0000-0000-0000-000000000009', 'UOBDFS5SY', 'ShiftingSand™ Footprints Urn', 'Urn with Footprints in sand finish. TSA-compliant. (LoveUrns)', 495.00, NULL, NULL, false, 111),
  ('si003210', '3150', 'c1000000-0000-0000-0000-000000000009', 'UOAQFS1G3', 'Beacon Water Urn', 'Biodegradable urn designed to simplify the scattering process in a body of water. Durable, dignified, easy-to-use container created from recycled paper and cardboard with no metal components and can be personalized by writing on the surface. Includes bamboo case. TSA-compliant. (BioLife)', 395.00, NULL, NULL, false, 112),
  ('si003211', '3150', 'c1000000-0000-0000-0000-000000000009', 'UOALFS1G4', 'Earth Scattering Cylinder Large', 'The patented Eco Scattering Urn is a beautiful and dignified option for families that want to scatter the ashes of a loved one. Hand-made from bamboo, rubbed with natural oil. Lid secured with a birch wood locking pin. Comes with a hand-sewn premium cotton bag sleeve. TSA-compliant. (BioLife)', 295.00, NULL, NULL, false, 113),
  ('si003212', '3150', 'c1000000-0000-0000-0000-000000000009', 'UOBDFSADR', 'Ocean Sunset Scattering Tube', 'Scattering tube designed to simplify the scattering process. Durable, dignified, easy-to-use container created from recycled paper and cardboard with no metal components. TSA-compliant. (BioLife)', 195.00, NULL, NULL, false, 114),
  ('si003213', '3150', 'c1000000-0000-0000-0000-000000000009', 'UORPFS1SU', 'Simplicity Scattering Tube', 'Scattering tube designed to simplify the scattering process. Durable, dignified, easy-to-use container created from recycled paper and cardboard with no metal components. TSA-compliant. (BioLife)', 195.00, NULL, NULL, false, 115),
  ('si003214', '3150', 'c1000000-0000-0000-0000-000000000009', 'UORPFSUF4', 'Ascending Dove Scattering Tube', 'Scattering tube designed to simplify the scattering process. Durable, dignified, easy-to-use container created from recycled paper and cardboard with no metal components. TSA-compliant. (BioLife)', 195.00, NULL, NULL, false, 116),
  ('si003215', '3150', 'c1000000-0000-0000-0000-000000000009', 'UORPFSUF6', 'Mountain View Scattering Tube', 'Scattering tube designed to simplify the scattering process. Durable, dignified, easy-to-use container created from recycled paper and cardboard with no metal components. TSA-compliant. (BioLife)', 195.00, NULL, NULL, false, 117),
  ('si003216', '3150', 'c1000000-0000-0000-0000-000000000009', 'UORPSB1SU', 'Field of Flowers Scattering Tube', 'Scattering tube designed to simplify the scattering process. Durable, dignified, easy-to-use container created from recycled paper and cardboard with no metal components. TSA-compliant. (BioLife)', 195.00, NULL, NULL, false, 118),
  ('si003217', '3150', 'c1000000-0000-0000-0000-000000000009', 'UOLRFSACW', 'Leather Cylinder Urn', 'Slate brown bonded leather cylinder. TSA-compliant. (Batesville)', 195.00, NULL, NULL, false, 119),
  ('si003218', '3150', 'c1000000-0000-0000-0000-000000000009', 'UMSTFSAGJ', 'Utility Minimum Container', '20 gauge carbon steel construction with black semi-gloss finish. (Batesville)', 195.00, NULL, NULL, false, 120),
  ('si003219', '3150', 'c1000000-0000-0000-0000-000000000009', 'UMALFSADA', 'Mailer Container', 'Composite wood with aluminum like texture, acceptable to ship through the mail courier service. (Batesville)', 125.00, NULL, NULL, false, 121),
  -- Keepsakes
  ('si003220', '3150', 'c1000000-0000-0000-0000-000000000010', 'UWABKSJDK', 'Charlotte Keepsake Box', 'Handcrafted dark and light green wood inlaid keepsake with a high-gloss lacquer finish. Features a geometric pattern with interlocking diagonals. TSA-compliant. (Granville)', 495.00, NULL, NULL, false, 1),
  ('si003221', '3150', 'c1000000-0000-0000-0000-000000000010', 'UWABKSJDR', 'Holden Keepsake Box', 'Handcrafted black and jewel tone wood inlaid keepsake with a high-gloss lacquer finish. Features beautiful yellow and orange flowers with weaving soft green vines. TSA-compliant. (Granville)', 495.00, NULL, NULL, false, 2),
  ('si003222', '3150', 'c1000000-0000-0000-0000-000000000010', 'UWABKSJDU', 'Lucinda Blue Keepsake Box', 'Handcrafted blue-green wood inlaid keepsake with a high-gloss lacquer finish. Features a peaceful dove with a gently flowing ribbon and delicate flowers. TSA-compliant. (Granville)', 495.00, NULL, NULL, false, 3),
  ('si003223', '3150', 'c1000000-0000-0000-0000-000000000010', 'UWABKSJDY', 'Stephen Keepsake Box', 'Handcrafted natural wood inlaid keepsake with a high-gloss lacquer finish. Features a refined, symmetrical design with overlapping lines. TSA-compliant. (Granville)', 495.00, NULL, NULL, false, 4),
  ('si003224', '3150', 'c1000000-0000-0000-0000-000000000010', 'UCE3UETMEX', 'Water Swirl Tumbler Votive', 'The Serenity Glass Swirl Collection is a series of unique soft glass items. (Eternity’s Touch)', 365.00, NULL, NULL, false, 5),
  ('si003225', '3150', 'c1000000-0000-0000-0000-000000000010', 'UCE3UETOEX', 'Fire Swirl Tumbler Votive', 'The Serenity Glass Swirl Collection is a series of unique soft glass items. (Eternity’s Touch)', 365.00, NULL, NULL, false, 6),
  ('si003226', '3150', 'c1000000-0000-0000-0000-000000000010', 'UCE3UET5EX', 'Earth Swirl Egg', 'The Serenity Glass Swirl Collection is a series of unique soft glass items. (Eternity’s Touch)', 345.00, NULL, NULL, false, 7),
  ('si003227', '3150', 'c1000000-0000-0000-0000-000000000010', 'UCE3UET7EX', 'Wind Swirl Egg', 'The Serenity Glass Swirl Collection is a series of unique soft glass items. (Eternity’s Touch)', 345.00, NULL, NULL, false, 8),
  ('si003228', '3150', 'c1000000-0000-0000-0000-000000000010', 'UOGLKSABL', 'Blue Butterfly Light of Remembrance™', 'Tiffany-inspired lamp with butterfly design. (Terrybear)', 255.00, NULL, NULL, false, 9),
  ('si003229', '3150', 'c1000000-0000-0000-0000-000000000010', 'UOALKS1G5', 'Earth Scattering Cylinder Small', 'The patented Eco Scattering Urn is a beautiful and dignified option for families that want to scatter the ashes of a loved one. Hand-made from bamboo, rubbed with natural oil. Lid secured with a birch wood locking pin. Comes with a hand-sewn premium cotton bag sleeve. TSA-compliant. (BioLife)', 195.00, NULL, NULL, false, 10),
  ('si003230', '3150', 'c1000000-0000-0000-0000-000000000010', 'UMBRKHAFK', 'Silver Heart Keepsake', 'Polished antique silver brass heart with gold-tone accents. (Terrybear)', 155.00, NULL, NULL, false, 11),
  ('si003231', '3150', 'c1000000-0000-0000-0000-000000000010', 'UMBRKHAME', 'Midnight Pewter Heart Keepsake', 'Concave heart with brushed pewter finish and midnight accents. (LoveUrns)', 155.00, NULL, NULL, false, 12),
  ('si003232', '3150', 'c1000000-0000-0000-0000-000000000010', 'UMBRKHDKG', 'Heart Brushed Gold Keepsake', 'Solid Brass Heart shaped Keepsake in brushed gold finish. (LoveUrns)', 155.00, NULL, NULL, false, 13),
  ('si003233', '3150', 'c1000000-0000-0000-0000-000000000010', 'UMBRKHDPG', 'Heart Polished Gold Keepsake', 'Solid Brass Heart shaped Keepsake in polished gold finish. (LoveUrns)', 155.00, NULL, NULL, false, 14),
  ('si003234', '3150', 'c1000000-0000-0000-0000-000000000010', 'UMBRKHDPS', 'Heart Polished Silver Keepsake', 'Solid Brass Heart shaped Keepsake in polished silver finish. (LoveUrns)', 155.00, NULL, NULL, false, 15),
  ('si003235', '3150', 'c1000000-0000-0000-0000-000000000010', 'UMBRKS5Y6', 'ComfortCross™ Gold Keepsake', 'Solid Brass Cross shaped Keepsake in Polished Gold finish. (LoveUrns)', 155.00, NULL, NULL, false, 16),
  ('si003236', '3150', 'c1000000-0000-0000-0000-000000000010', 'UMBRKSDTK', 'HeartFelt™ Gold Keepsake', 'Solid Brass Heart shaped Keepsake Urn with Crystal. (LoveUrns)', 155.00, NULL, NULL, false, 17),
  ('si003237', '3150', 'c1000000-0000-0000-0000-000000000010', 'UMBRKSLF4', 'SoulBird Keepsake', 'Unique bird shaped keepsake in a brilliant polished finish. (LoveUrns)', 155.00, NULL, NULL, false, 18),
  ('si003238', '3150', 'c1000000-0000-0000-0000-000000000010', 'UMBRKSLFO', 'Comfort Cross Silver Keepsake', 'Beautifully crafted cross with smooth design. (LoveUrns)', 155.00, NULL, NULL, false, 19),
  ('si003239', '3150', 'c1000000-0000-0000-0000-000000000010', 'UMABKSLMT', 'Matte Black Teardrop Keepsake', 'Unique matte black teardrop shaped keepsake with a soft touch finish and brushed gun metal top. (LoveUrns)', 155.00, NULL, NULL, false, 20),
  ('si003240', '3150', 'c1000000-0000-0000-0000-000000000010', 'UMAFKH5AS', 'Heart Laurel Crimson Keepsake', 'Crimson Color Heart Shaped Keepsake. (LoveUrns)', 155.00, NULL, NULL, false, 21),
  ('si003241', '3150', 'c1000000-0000-0000-0000-000000000010', 'UMASKSLKD', 'Sage Green Teardrop Keepsake', 'Unique sage green teardrop shaped keepsake with a soft touch finish and brushed gold top. (LoveUrns)', 155.00, NULL, NULL, false, 22),
  ('si003242', '3150', 'c1000000-0000-0000-0000-000000000010', 'UMAFKS5AT', 'Laurel Crimson Keepsake', 'Crimson Color Metal Keepsake Size Urn with Brushed Gold Lid. (LoveUrns)', 145.00, NULL, NULL, false, 23),
  ('si003243', '3150', 'c1000000-0000-0000-0000-000000000010', 'UMAGKSNFT', 'Lenox Keepsake', 'Classic and elegant porcelain keepsake made from Genuine Lenox Porcelain with 24 karat gold gilding. (Elegante Brass)', 145.00, NULL, NULL, false, 24),
  ('si003244', '3150', 'c1000000-0000-0000-0000-000000000010', 'UMADKSDRM', 'Amore™ Red Keepsake', 'Solid Brass Keepsake with Red and Polished Silver Finish. (LoveUrns)', 145.00, NULL, NULL, false, 25),
  ('si003245', '3150', 'c1000000-0000-0000-0000-000000000010', 'UMAEKSLFR', 'Laurel Midnight Keepsake', 'Keepsake featuring silver accents with enamel inlay. (LoveUrns)', 145.00, NULL, NULL, false, 26),
  ('si003246', '3150', 'c1000000-0000-0000-0000-000000000010', 'UMAEKSLFS', 'Laurel Pearl Keepsake', 'Keepsake featuring silver accents with enamel inlay. (LoveUrns)', 145.00, NULL, NULL, false, 27),
  ('si003247', '3150', 'c1000000-0000-0000-0000-000000000010', 'UMBRKSLFP', 'Flying Doves Keepsake', 'Timeless brass keepsake in a blue tone with brushed pewter accents. (LoveUrns)', 145.00, NULL, NULL, false, 28),
  ('si003248', '3150', 'c1000000-0000-0000-0000-000000000010', 'UMBRKSLGM', 'Wings of Hope Blue Keepsake', 'Elegant butterfly design keepsake with blue inlays and pearlescent finish. (LoveUrns)', 145.00, NULL, NULL, false, 29),
  ('si003249', '3150', 'c1000000-0000-0000-0000-000000000010', 'UMBRKSLGN', 'Wings of Hope Lavender Keepsake', 'Elegant butterfly design keepsake with lavender inlays and pearlescent finish. (LoveUrns)', 145.00, NULL, NULL, false, 30),
  ('si003250', '3150', 'c1000000-0000-0000-0000-000000000010', 'UMBRKSLGS', 'Wings of Hope Pearl Keepsake', 'Elegant butterfly design keepsake with lavender inlays and pearlescent finish. (LoveUrns)', 145.00, NULL, NULL, false, 31),
  ('si003251', '3150', 'c1000000-0000-0000-0000-000000000010', 'UMBRKSLW1', 'Wings of Hope Yellow Keepsake', 'Elegant butterfly design keepsake with yellow inlays and pearlescent finish. (LoveUrns)', 145.00, NULL, NULL, false, 32),
  ('si003252', '3150', 'c1000000-0000-0000-0000-000000000010', 'UMBRMKABP', 'Dove Mini Keepsake', 'Nickel-plated brass vase mini keepsake with blue accents and dove design. (LoveUrns)', 145.00, NULL, NULL, false, 33),
  ('si003253', '3150', 'c1000000-0000-0000-0000-000000000010', 'UMBRMKMHO', 'Mother of Pearl™ Keepsake', 'Solid Brass Keepsake urn with Mother of Pearl decoration. (LoveUrns)', 145.00, NULL, NULL, false, 34),
  ('si003254', '3150', 'c1000000-0000-0000-0000-000000000010', 'UMBRKSDLK', 'Elegant Leaf™ Keepsake', 'Green Color Metal Keepsake with Leaf Motif. (LoveUrns)', 145.00, NULL, NULL, false, 35),
  ('si003255', '3150', 'c1000000-0000-0000-0000-000000000010', 'UMBRKHADO', 'Moonlight Heart Keepsake', 'Brass heart keepsake showcases a deep blue finish with a metallic shimmer. (Terrybear)', 145.00, NULL, NULL, false, 36),
  ('si003256', '3150', 'c1000000-0000-0000-0000-000000000010', 'UMBRFSDFP', 'Art Deco Keepsake', 'Brass keepsake with classic and sleek style with enameled bands. (LoveUrns)', 145.00, NULL, NULL, false, 37),
  ('si003257', '3150', 'c1000000-0000-0000-0000-000000000010', 'UMZNKSZSY', 'Simplicity™ Keepsake', 'Midnight Metal Keepsake with silver lid and base. (LoveUrns)', 145.00, NULL, NULL, false, 38),
  ('si003258', '3150', 'c1000000-0000-0000-0000-000000000010', 'UOMBMKAEZ', 'Sand Mini Keepsake', 'Sand-colored marble mini keepsake urn with natural accents. (Marble Products)', 145.00, NULL, NULL, false, 39),
  ('si003259', '3150', 'c1000000-0000-0000-0000-000000000010', 'UORPMK1DR', 'Mini Scattering Tube - Sunset', 'The Mini Sunset scattering tube is designed to simplify the scattering process. Durable, dignified, easy-to-use container created from recycled paper and cardboard with no metal components. TSA-compliant. (BioLife)', 125.00, NULL, NULL, false, 40),
  ('si003260', '3150', 'c1000000-0000-0000-0000-000000000010', 'UORPMK1F4', 'Mini Scattering Tube - Ascending', 'The Mini Ascending scattering tube is designed to simplify the scattering process. Durable, dignified, easy-to-use container created from recycled paper and cardboard with no metal components. TSA-compliant. (BioLife)', 125.00, NULL, NULL, false, 41),
  ('si003261', '3150', 'c1000000-0000-0000-0000-000000000010', 'UORPMK1FN', 'Mini Scattering Tube - Simplicity', 'The Mini Simplicity scattering tube is designed to simplify the scattering process. Durable, dignified, easy-to-use container created from recycled paper and cardboard with no metal components. TSA-compliant. (BioLife)', 125.00, NULL, NULL, false, 42),
  -- Jewelry
  ('si003262', '3150', 'c1000000-0000-0000-0000-000000000011', 'PCGUCEXUY41EX', '10K Yellow Gold Claddagh Pendant', 'This hand crafted pendant, modeled after the traditional Claddagh Ring popular in Irish heritage, holds the traditional design symbolizing love, friendship, and loyalty while having the ability to be personalized in remembrance of your loved one. (Eternity’s Touch)', 1795.00, NULL, NULL, false, 1),
  ('si003263', '3150', 'c1000000-0000-0000-0000-000000000011', 'UCEVNYAGEX', 'Yellow Gold Oval Keepsake', '10K yellow gold rimmed oval keepsake with thumbprint, holding your loved one’s remains on a 10k gold curb chain with spring ring clasp. (Eternity’s Touch)', 950.00, NULL, NULL, false, 2),
  ('si003264', '3150', 'c1000000-0000-0000-0000-000000000011', 'XFDKSD6', 'Yellow Gold Oval Pendant', '10K yellow gold oval pendant with thumbprint on a 10k gold curb chain with spring ring clasp. (Eternity’s Touch)', 950.00, NULL, NULL, false, 3),
  ('si003265', '3150', 'c1000000-0000-0000-0000-000000000011', 'UCNPUDCOBX', 'Cross Pendant, 14kt Gold', '14kt gold cross pendant without chain. (Batesville)', 595.00, NULL, NULL, false, 4),
  ('si003266', '3150', 'c1000000-0000-0000-0000-000000000011', 'KHSXFDKSA9', 'Sterling Silver Classic Heart Bracelet', '.925 sterling silver flat classic heart on 7.5” sterling silver toggle style bracelet with thumbprint. (Eternity’s Touch)', 515.00, NULL, NULL, false, 5),
  ('si003267', '3150', 'c1000000-0000-0000-0000-000000000011', 'UCNCWDWNBX', 'Women''s Chain, 14kt Gold', 'Rope chain in 14kt gold. (Batesville)', 395.00, NULL, NULL, false, 6),
  ('si003268', '3150', 'c1000000-0000-0000-0000-000000000011', 'UCNBMO9FX', 'Black Braided Leather Memento Bracelet (L)', 'Black braided leather memento bracelet with stainless steel bead. (LoveUrns)', 375.00, NULL, NULL, false, 7),
  ('si003269', '3150', 'c1000000-0000-0000-0000-000000000011', 'UCNBMOZ9FX', 'Cognac Smooth Leather Memento Bracelet (L)', 'Cognac smooth leather memento bracelet with stainless steel bead. (LoveUrns)', 375.00, NULL, NULL, false, 8),
  ('si003270', '3150', 'c1000000-0000-0000-0000-000000000011', 'UCNBUO7YDX', 'Red-Black Cord Memento Bracelet (L)', 'Red-Black Cord Memento Bracelet with stainless steel bead. (LoveUrns)', 375.00, NULL, NULL, false, 9),
  ('si003271', '3150', 'c1000000-0000-0000-0000-000000000011', 'UCNBUO8YDX', 'Blue-White Cord Memento Bracelet (L)', 'Blue-White Cord Memento Bracelet with stainless steel bead. (LoveUrns)', 375.00, NULL, NULL, false, 10),
  ('si003272', '3150', 'c1000000-0000-0000-0000-000000000011', 'UCNBUO9YDX', 'Dark Green Cord Memento Bracelet (L)', 'Dark Green Cord Memento Bracelet with stainless steel bead. (LoveUrns)', 375.00, NULL, NULL, false, 11),
  ('si003273', '3150', 'c1000000-0000-0000-0000-000000000011', 'UCIBMO9LFX', 'Brown Smooth Leather Memento Bracelet (L)', 'Brown smooth leather memento bracelet with stainless steel bead. (LoveUrns)', 375.00, NULL, NULL, false, 12),
  ('si003274', '3150', 'c1000000-0000-0000-0000-000000000011', 'UCEVNSAKEX', 'Sterling Silver Oval Keepsake (Urn)', '.925 sterling silver oval keepsake with thumbprint, holding your loved one’s remains on a sterling silver curb style chain with spring ring clasp. (Eternity’s Touch)', 350.00, NULL, NULL, false, 13),
  ('si003275', '3150', 'c1000000-0000-0000-0000-000000000011', 'UCEVNSALEX', 'Sterling Silver Signature Heart Keepsake (Urn)', '.925 sterling silver heart keepsake with thumbprint, holding your loved one’s remains on a sterling silver curb style chain with spring ring clasp. (Eternity’s Touch)', 350.00, NULL, NULL, false, 14),
  ('si003276', '3150', 'c1000000-0000-0000-0000-000000000011', 'UCEVNSAMEX', 'Sterling Silver Teardrop Keepsake Urn', '.925 sterling silver teardrop keepsake with thumbprint holding your loved one’s remains on a sterling silver curb style chain with spring ring clasp. (Eternity’s Touch)', 350.00, NULL, NULL, false, 15),
  ('si003277', '3150', 'c1000000-0000-0000-0000-000000000011', '19OXUEIHUS19OX', 'Circle of Life Pendant with Birthstone', 'Crafted from exquisite 925 sterling silver, this pendant exudes timeless elegance. Includes a beautiful birthstone charm that dangles inside, with an 18" rope chain. (BioLife)', 325.00, NULL, NULL, false, 16),
  ('si003278', '3150', 'c1000000-0000-0000-0000-000000000011', 'XFDKSBB', 'Titanium Memory Tag', 'Titanium memory tag with thumbprint on a keyring 22” stainless steel ball chain, or 22” sterling silver thick chain. (Eternity’s Touch)', 295.00, NULL, NULL, false, 17),
  ('si003279', '3150', 'c1000000-0000-0000-0000-000000000011', 'XFDKSBF', 'Buck Knife', 'Stainless Steel buck knife with thumbprint. (Eternity’s Touch)', 295.00, NULL, NULL, false, 18),
  ('si003280', '3150', 'c1000000-0000-0000-0000-000000000011', 'XFDKSBG', 'Zippo Lighter', 'Chrome zippo lighter with thumbprint. (Eternity’s Touch)', 295.00, NULL, NULL, false, 19),
  ('si003281', '3150', 'c1000000-0000-0000-0000-000000000011', 'XFDKSQZ', 'Sterling Silver Cross Pendant', '.925 Sterling silver cross pendant with thumbprint on a sterling silver curb style chain with spring ring clasp. (Eternity’s Touch)', 295.00, NULL, NULL, false, 20),
  ('si003282', '3150', 'c1000000-0000-0000-0000-000000000011', 'XFDKSSV', 'Sterling Silver Oval Pendant', '.925 Sterling silver, oval, pendant with thumbprint on a sterling silver, curb style chain with spring ring clasp. (Additional Personalization Available) (Eternity’s Touch)', 295.00, NULL, NULL, false, 21),
  ('si003283', '3150', 'c1000000-0000-0000-0000-000000000011', 'XFDKSWA', 'Sterling Silver Flat Heart Pendant', '.925 sterling silver flat heart pendant with thumbprint on a sterling silver curb style chain with spring ring clasp. (Eternity’s Touch)', 295.00, NULL, NULL, false, 22),
  ('si003284', '3150', 'c1000000-0000-0000-0000-000000000011', 'XFDKSA8', 'Stainless Steel Oval Pendant', 'Stainless steel oval pendant with thumbprint on a stainless steel curb style chain with spring ring clasp. (Eternity’s Touch)', 295.00, NULL, NULL, false, 23),
  ('si003285', '3150', 'c1000000-0000-0000-0000-000000000011', 'UCNNUSDWDR', 'Cross Pendant', 'Cross Pendant on a 18" sterling silver chain with a 2.25" chain extension. (LoveUrns)', 255.00, NULL, NULL, false, 24),
  ('si003286', '3150', 'c1000000-0000-0000-0000-000000000011', 'UCNNWSD6DR', 'Feather Pendant', 'Feather Pendant on a 18" sterling silver chain with a 2.25" chain extension. (LoveUrns)', 255.00, NULL, NULL, false, 25),
  ('si003287', '3150', 'c1000000-0000-0000-0000-000000000011', 'UCNNWSDRDR', 'Infinite Love Pendant', 'Infinite Love Pendant on a 18" sterling silver chain with a 2.25" chain extension. (LoveUrns)', 255.00, NULL, NULL, false, 26),
  ('si003288', '3150', 'c1000000-0000-0000-0000-000000000011', 'UCNNWSEADR', 'FlyingDove™ Ashes Pendant', 'Dove shaped Ashes Necklace in Brushed and Shiny Silver. (LoveUrns)', 255.00, NULL, NULL, false, 27),
  ('si003289', '3150', 'c1000000-0000-0000-0000-000000000011', 'UCNNWSEHDG', 'Heartfelt Pendant', 'Heartfelt Pendant on a 18" sterling silver chain with a 2.25" chain extension. (LoveUrns)', 255.00, NULL, NULL, false, 28),
  ('si003290', '3150', 'c1000000-0000-0000-0000-000000000011', 'UCNNWSENDR', 'Leaning Heart Pendant', 'Leaning Heart Pendant on a 18" sterling silver chain with a 2.25" chain extension. (LoveUrns)', 255.00, NULL, NULL, false, 29),
  ('si003291', '3150', 'c1000000-0000-0000-0000-000000000011', 'UCNNWSENDV', 'Leaning Heart with Crystal Pendant', 'Leaning Heart with Crystal Pendant on a 18" sterling silver chain with a 2.25" chain extension. (LoveUrns)', 255.00, NULL, NULL, false, 30),
  ('si003292', '3150', 'c1000000-0000-0000-0000-000000000011', 'UCNNWSERDG', 'Love Heart Gold Vermeil Necklace and Pendant', 'Heart Shaped Ashes Necklace in Shiny Vermeil Gold. (LoveUrns)', 255.00, NULL, NULL, false, 31),
  ('si003293', '3150', 'c1000000-0000-0000-0000-000000000011', 'UCNNWSEUDV', 'Love Rose Pendant', 'Love Rose Pendant on a 18" sterling silver chain with a 2.25" chain extension. (LoveUrns)', 255.00, NULL, NULL, false, 32),
  ('si003294', '3150', 'c1000000-0000-0000-0000-000000000011', 'UCNNWSEYDG', 'Mother of Pearl Pendant', 'Mother of Pearl Pendant on a 18" sterling silver chain with a 2.25" chain extension. (LoveUrns)', 255.00, NULL, NULL, false, 33),
  ('si003295', '3150', 'c1000000-0000-0000-0000-000000000011', 'UCNNWSFYDR', 'Soul Bird Necklace and Pendant', 'Soul bird shaped Ashes Necklace in Shiny Silver. (LoveUrns)', 255.00, NULL, NULL, false, 34),
  ('si003296', '3150', 'c1000000-0000-0000-0000-000000000011', 'UCIBUGVAOX', 'Cuff Cremation Bracelet - Gold', 'A timeless and sophisticated piece, this gold plated stainless steel cuff bracelet allows you to carry a part of your loved one’s ashes discreetly. (BioLife)', 245.00, NULL, NULL, false, 35),
  ('si003297', '3150', 'c1000000-0000-0000-0000-000000000011', 'UCIBULCUOX', 'Cuff Cremation Bracelet - Black', 'Crafted with precision from high-quality black stainless steel, this bracelet discreetly holds a small amount of your loved one’s ashes. (BioLife)', 245.00, NULL, NULL, false, 36),
  ('si003298', '3150', 'c1000000-0000-0000-0000-000000000011', 'UCIBUSBROX', 'Cuff Cremation Bracelet - Silver', 'Designed for understated elegance, this stainless steel cuff bracelet discreetly holds a small amount of your loved one’s ashes. (BioLife)', 245.00, NULL, NULL, false, 37),
  ('si003299', '3150', 'c1000000-0000-0000-0000-000000000011', 'XFDKSBL', 'Stainless Steel Money Clip', 'Stainless steel money clip with thumbprint. (Eternity’s Touch)', 225.00, NULL, NULL, false, 38),
  ('si003300', '3150', 'c1000000-0000-0000-0000-000000000011', 'XFDKSA5', 'Memory Bear', 'Memory teddy bear with rubber silencer covered stainless steel memory tag with thumbprint. (Eternity’s Touch)', 195.00, NULL, NULL, false, 39),
  ('si003301', '3150', 'c1000000-0000-0000-0000-000000000011', 'UCNNULDTBX', 'Dog Tag', 'Stainless steel dog tag on a 24" stainless steel beaded chain. (Batesville)', 195.00, NULL, NULL, false, 40),
  ('si003302', '3150', 'c1000000-0000-0000-0000-000000000011', 'UCNIWSDYDR', 'CuddleBear with Pink Crystal Charm', 'Sterling silver CuddleBear with Pink Crystal Charm. Bracelet sold separately. (LoveUrns)', 175.00, NULL, NULL, false, 41),
  ('si003303', '3150', 'c1000000-0000-0000-0000-000000000011', 'UCNIWSDYFR', 'CuddleBear with Blue Crystal Charm', 'Sterling silver CuddleBear with Blue Crystal Charm. Bracelet sold separately. (LoveUrns)', 175.00, NULL, NULL, false, 42),
  ('si003304', '3150', 'c1000000-0000-0000-0000-000000000011', 'UCNIWSEDDG', 'Glowing Heart Charm', 'Sterling silver Glowing Heart Charm. Bracelet sold separately. (LoveUrns)', 155.00, NULL, NULL, false, 43),
  ('si003305', '3150', 'c1000000-0000-0000-0000-000000000011', 'UCNIWSEFDR', 'Heart to Heart with Crystal Charm', 'Sterling silver Heart to Heart with Crystal Charm. Bracelet sold separately. (LoveUrns)', 155.00, NULL, NULL, false, 44),
  ('si003306', '3150', 'c1000000-0000-0000-0000-000000000011', 'UCNIWSEYDG', 'Mother of Pearl Charm', 'Sterling silver Mother of Pearl Charm. Bracelet sold separately. (LoveUrns)', 155.00, NULL, NULL, false, 45),
  ('si003307', '3150', 'c1000000-0000-0000-0000-000000000011', 'UCNIWSCODR', 'Cross Charm', 'Sterling silver Cross Charm. Bracelet sold separately. (LoveUrns)', 155.00, NULL, NULL, false, 46),
  ('si003308', '3150', 'c1000000-0000-0000-0000-000000000011', 'XFDKSA6', 'Simply Remembered Heart', 'Stainless steel simply remembered heart with thumbprint or text, holding your loved one’s remains on a stainless steel curb style chain with spring ring clasp. (Eternity’s Touch)', 150.00, NULL, NULL, false, 47),
  ('si003309', '3150', 'c1000000-0000-0000-0000-000000000011', 'XFDKSBC', 'Simply Remembered Tree of Life', 'Stainless steel simply remembered tree of life with thumbprint or text, holding your loved one’s remains on a stainless steel curb style chain with spring ring clasp. (Eternity’s Touch)', 150.00, NULL, NULL, false, 48),
  ('si003310', '3150', 'c1000000-0000-0000-0000-000000000011', 'XFDKSBJ', 'Simply Remembered Bullet', 'Stainless steel simply remembered bullet with thumbprint or text, on a stainless steel curb style chain with spring ring clasp. (Eternity’s Touch)', 150.00, NULL, NULL, false, 49),
  ('si003311', '3150', 'c1000000-0000-0000-0000-000000000011', 'XFDKSBK', 'Simply Remembered Cylinder', 'Stainless steel simply remembered cylinder with thumbprint or text, on a stainless steel curb style chain with spring ring clasp. (Eternity’s Touch)', 150.00, NULL, NULL, false, 50),
  ('si003312', '3150', 'c1000000-0000-0000-0000-000000000011', 'XFDKSA1', 'Simply Remembered Bar', 'Stainless Steel simply remembered bar holding your loved one’s remains, with option for text, on a stainless steel curb style chain with spring ring clasp. (Eternity’s Touch)', 150.00, NULL, NULL, false, 51),
  ('si003313', '3150', 'c1000000-0000-0000-0000-000000000011', 'XFDKSA4', 'High Res Fingerprint', 'High res cropped fingerprint. (Eternity’s Touch)', 125.00, NULL, NULL, false, 52),
  ('si003314', '3150', 'c1000000-0000-0000-0000-000000000011', 'UCNBWSBRDR', 'Bracelet Sterling Silver', 'Sterling silver bracelet. (LoveUrns)', 115.00, NULL, NULL, false, 53),
  ('si003315', '3150', 'c1000000-0000-0000-0000-000000000011', 'UCNIWSFDDR', 'Wings of Hope Blue Charm', 'Sterling silver Wings of Hope Charm. Bracelet sold separately. (LoveUrns)', 85.00, NULL, NULL, false, 54),
  ('si003316', '3150', 'c1000000-0000-0000-0000-000000000011', 'UCNIWSFGDR', 'Wings of Hope Lavender Charm', 'Sterling silver Wings of Hope Charm. Bracelet sold separately. (LoveUrns)', 85.00, NULL, NULL, false, 55),
  ('si003317', '3150', 'c1000000-0000-0000-0000-000000000011', 'UCNIWSFIDR', 'Wings of Hope Pearl Charm', 'Sterling silver Wings of Hope Charm. Bracelet sold separately. (LoveUrns)', 85.00, NULL, NULL, false, 56),
  ('si003318', '3150', 'c1000000-0000-0000-0000-000000000011', 'UCNIWYYEDR', 'Wings of Hope Yellow Charm', 'Butterfly shaped Yellow Ashes Bead in Shiny Silver. (LoveUrns)', 85.00, NULL, NULL, false, 57),
  ('si003319', '3150', 'c1000000-0000-0000-0000-000000000011', 'UCNKWSEHDG', 'HeartFelt Earrings', 'Sterling silver HeartFelt Earrings. (LoveUrns)', 55.00, NULL, NULL, false, 58),
  ('si003320', '3150', 'c1000000-0000-0000-0000-000000000011', 'UCNKWSENDR', 'Leaning Heart Earrings', 'Sterling silver Leaning Heart Earrings. (LoveUrns)', 55.00, NULL, NULL, false, 59),
  ('si003321', '3150', 'c1000000-0000-0000-0000-000000000011', 'UCNKWSEYDG', 'Mother of Pearl Earrings', 'Sterling silver Mother of Pearl Earrings. (LoveUrns)', 55.00, NULL, NULL, false, 60);

-- ─── Packages ─────────────────────────────────────────────────────────────────

insert into packages (id, funeral_home_id, name, pkg_type, total_price, package_discount, default_casket_id, sort_order) values
  ('pk003001', '3150', 'Full Service', 'alacarte', 5835.00, 0, NULL, 1),
  ('pk003002', '3150', 'Witness Cremation', 'alacarte', 4835.00, 0, NULL, 2),
  ('pk003003', '3150', 'Service of Remembrance', 'alacarte', 5660.00, 0, NULL, 3),
  ('pk003004', '3150', 'Graveside Service', 'alacarte', 5010.00, 0, NULL, 4),
  ('pk003005', '3150', 'Urn Committal Option', 'alacarte', 3910.00, 0, NULL, 5),
  ('pk003006', '3150', 'No Service Option', 'alacarte', 3215.00, 0, NULL, 6),
  ('pk003007', '3150', 'Forwarding of Remains to Another Funeral Home', 'alacarte', 3455.00, 0, NULL, 7),
  ('pk003008', '3150', 'Receiving of Remains from Another Funeral Home', 'alacarte', 2285.00, 0, NULL, 8),
  ('pk003009', '3150', 'Dignity Memorial Heritage Funeral Service', 'package', 14398.00, 420, NULL, 9),
  ('pk003010', '3150', 'Dignity Memorial Honour Funeral Service', 'package', 13198.00, 385, NULL, 10),
  ('pk003011', '3150', 'Dignity Memorial Tribute Funeral Service', 'package', 11308.00, 330, NULL, 11),
  ('pk003012', '3150', 'Dignity Memorial Heritage Cremation Service', 'package', 13793.00, 410, NULL, 12),
  ('pk003013', '3150', 'Dignity Memorial Honour Cremation Service', 'package', 10379.00, 305, NULL, 13),
  ('pk003014', '3150', 'Dignity Memorial Tribute Cremation Service', 'package', 5295.00, 50, NULL, 14);

-- ─── Package Items ────────────────────────────────────────────────────────────

insert into package_items (package_id, service_item_id, quantity, sort_order, is_optional) values
  -- Full Service ($5,835)
  ('pk003001', 'si003002', 1, 1, false), -- Professional Services Fees for Full Service  2255
  ('pk003001', 'si003011', 1, 2, false), -- Registration and Documentation  445
  ('pk003001', 'si003012', 1, 3, false), -- Embalming  625
  ('pk003001', 'si003014', 1, 4, false), -- Other Care and Preparation  445
  ('pk003001', 'si003013', 1, 5, false), -- Sheltering of Remains  445
  ('pk003001', 'si003019', 1, 6, false), -- Transfer of Remains from Place of Death to Funeral Home  495
  ('pk003001', 'si003020', 1, 7, false), -- Funeral Vehicle (e.g. Hearse)  395
  ('pk003001', 'si003061', 1, 8, false), -- Estate Fraud Protection  135
  ('pk003001', 'si003044', 1, 9, false), -- Premium Venue  595
  -- Witness Cremation ($4,835)
  ('pk003002', 'si003005', 1, 1, false), -- Professional Service Fees of Funeral Director and Staff for Cremation Witness  1875
  ('pk003002', 'si003011', 1, 2, false), -- Registration and Documentation  445
  ('pk003002', 'si003014', 1, 3, false), -- Other Care and Preparation  445
  ('pk003002', 'si003013', 1, 4, false), -- Sheltering of Remains  445
  ('pk003002', 'si003019', 1, 5, false), -- Transfer of Remains from Place of Death to Funeral Home  495
  ('pk003002', 'si003061', 1, 6, false), -- Estate Fraud Protection  135
  ('pk003002', 'si003041', 1, 7, false), -- Crematory Fee  995
  -- Service of Remembrance ($5,660)
  ('pk003003', 'si003003', 1, 1, false), -- Professional Services Fees for Memorial Service  2105
  ('pk003003', 'si003011', 1, 2, false), -- Registration and Documentation  445
  ('pk003003', 'si003014', 1, 3, false), -- Other Care and Preparation  445
  ('pk003003', 'si003013', 1, 4, false), -- Sheltering of Remains  445
  ('pk003003', 'si003019', 1, 5, false), -- Transfer of Remains from Place of Death to Funeral Home  495
  ('pk003003', 'si003061', 1, 6, false), -- Estate Fraud Protection  135
  ('pk003003', 'si003041', 1, 7, false), -- Crematory Fee  995
  ('pk003003', 'si003044', 1, 8, false), -- Premium Venue  595
  -- Graveside Service ($5,010)
  ('pk003004', 'si003004', 1, 1, false), -- Professional Services Fees for Graveside Service  2025
  ('pk003004', 'si003011', 1, 2, false), -- Registration and Documentation  445
  ('pk003004', 'si003012', 1, 3, false), -- Embalming  625
  ('pk003004', 'si003014', 1, 4, false), -- Other Care and Preparation  445
  ('pk003004', 'si003013', 1, 5, false), -- Sheltering of Remains  445
  ('pk003004', 'si003019', 1, 6, false), -- Transfer of Remains from Place of Death to Funeral Home  495
  ('pk003004', 'si003020', 1, 7, false), -- Funeral Vehicle (e.g. Hearse)  395
  ('pk003004', 'si003061', 1, 8, false), -- Estate Fraud Protection  135
  -- Urn Committal Option ($3,910)
  ('pk003005', 'si003008', 1, 1, false), -- Professional Services Fees for Urn Committal  600
  ('pk003005', 'si003011', 1, 2, false), -- Registration and Documentation  445
  ('pk003005', 'si003014', 1, 3, false), -- Other Care and Preparation  445
  ('pk003005', 'si003013', 1, 4, false), -- Sheltering of Remains  445
  ('pk003005', 'si003009', 1, 5, false), -- Staff Services for Urn Committal  350
  ('pk003005', 'si003019', 1, 6, false), -- Transfer of Remains from Place of Death to Funeral Home  495
  ('pk003005', 'si003061', 1, 7, false), -- Estate Fraud Protection  135
  ('pk003005', 'si003041', 1, 8, false), -- Crematory Fee  995
  -- No Service Option ($3,215)
  ('pk003006', 'si003010', 1, 1, false), -- Basic Service Fees for No Service Option  255
  ('pk003006', 'si003011', 1, 2, false), -- Registration and Documentation  445
  ('pk003006', 'si003014', 1, 3, false), -- Other Care and Preparation  445
  ('pk003006', 'si003013', 1, 4, false), -- Sheltering of Remains  445
  ('pk003006', 'si003019', 1, 5, false), -- Transfer of Remains from Place of Death to Funeral Home  495
  ('pk003006', 'si003061', 1, 6, false), -- Estate Fraud Protection  135
  ('pk003006', 'si003041', 1, 7, false), -- Crematory Fee  995
  -- Forwarding of Remains to Another Funeral Home ($3,455)
  ('pk003007', 'si003006', 1, 1, false), -- Basic Professional Service Fee when Forwarding Remains  1495
  ('pk003007', 'si003011', 1, 2, false), -- Registration and Documentation  445
  ('pk003007', 'si003012', 1, 3, false), -- Embalming  625
  ('pk003007', 'si003022', 1, 4, false), -- Transfer to or from Airport  395
  ('pk003007', 'si003019', 1, 5, false), -- Transfer of Remains from Place of Death to Funeral Home  495
  -- Receiving of Remains from Another Funeral Home ($2,285)
  ('pk003008', 'si003007', 1, 1, false), -- Basic Professional Service Fees when Receiving Remains  1495
  ('pk003008', 'si003022', 1, 2, false), -- Transfer to or from Airport  395
  ('pk003008', 'si003020', 1, 3, false), -- Funeral Vehicle (e.g. Hearse)  395
  -- Dignity Memorial Heritage Funeral Service ($14,398)
  ('pk003009', 'si003002', 1, 1, false), -- Professional Services Fees for Full Service  2255
  ('pk003009', 'si003011', 1, 2, false), -- Registration and Documentation  445
  ('pk003009', 'si003012', 1, 3, false), -- Embalming  625
  ('pk003009', 'si003014', 1, 4, false), -- Other Care and Preparation  445
  ('pk003009', 'si003051', 1, 5, true), -- Reception Room  599
  ('pk003009', 'si003013', 1, 6, false), -- Sheltering of Remains  445
  ('pk003009', 'si003019', 1, 7, false), -- Transfer of Remains from Place of Death to Funeral Home  495
  ('pk003009', 'si003020', 1, 8, false), -- Funeral Vehicle (e.g. Hearse)  395
  ('pk003009', 'si003021', 1, 9, false), -- Limousine  395
  ('pk003009', 'si003060', 1, 10, false), -- Everlasting Memorial®  490
  ('pk003009', 'si003061', 1, 11, false), -- Estate Fraud Protection  135
  ('pk003009', 'si003062', 1, 12, false), -- Dignity Heritage Burial Flowers  695
  ('pk003009', 'si003044', 1, 13, false), -- Premium Venue  595
  ('pk003009', 'si003023', 1, 14, false), -- Legal Service Plan  295
  ('pk003009', 'si003093', 1, 15, false), -- Recommended Casket — Heritage Tier  4099
  ('pk003009', 'si003068', 1, 16, true), -- Catered Receptions III  1195
  ('pk003009', 'si003069', 1, 17, false), -- Esteemed Collection  795
  -- Dignity Memorial Honour Funeral Service ($13,198)
  ('pk003010', 'si003002', 1, 1, false), -- Professional Services Fees for Full Service  2255
  ('pk003010', 'si003011', 1, 2, false), -- Registration and Documentation  445
  ('pk003010', 'si003012', 1, 3, false), -- Embalming  625
  ('pk003010', 'si003014', 1, 4, false), -- Other Care and Preparation  445
  ('pk003010', 'si003051', 1, 5, true), -- Reception Room  599
  ('pk003010', 'si003013', 1, 6, false), -- Sheltering of Remains  445
  ('pk003010', 'si003019', 1, 7, false), -- Transfer of Remains from Place of Death to Funeral Home  495
  ('pk003010', 'si003020', 1, 8, false), -- Funeral Vehicle (e.g. Hearse)  395
  ('pk003010', 'si003021', 1, 9, false), -- Limousine  395
  ('pk003010', 'si003060', 1, 10, false), -- Everlasting Memorial®  490
  ('pk003010', 'si003061', 1, 11, false), -- Estate Fraud Protection  135
  ('pk003010', 'si003063', 1, 12, false), -- Dignity Honour Burial Flowers  495
  ('pk003010', 'si003044', 1, 13, false), -- Premium Venue  595
  ('pk003010', 'si003023', 1, 14, false), -- Legal Service Plan  295
  ('pk003010', 'si003094', 1, 15, false), -- Recommended Casket — Honour Tier  3599
  ('pk003010', 'si003067', 1, 16, true), -- Catered Receptions II  995
  ('pk003010', 'si003070', 1, 17, false), -- Commemorative Collection  495
  -- Dignity Memorial Tribute Funeral Service ($11,308)
  ('pk003011', 'si003002', 1, 1, false), -- Professional Services Fees for Full Service  2255
  ('pk003011', 'si003011', 1, 2, false), -- Registration and Documentation  445
  ('pk003011', 'si003012', 1, 3, false), -- Embalming  625
  ('pk003011', 'si003014', 1, 4, false), -- Other Care and Preparation  445
  ('pk003011', 'si003051', 1, 5, true), -- Reception Room  599
  ('pk003011', 'si003013', 1, 6, false), -- Sheltering of Remains  445
  ('pk003011', 'si003019', 1, 7, false), -- Transfer of Remains from Place of Death to Funeral Home  495
  ('pk003011', 'si003020', 1, 8, false), -- Funeral Vehicle (e.g. Hearse)  395
  ('pk003011', 'si003060', 1, 9, false), -- Everlasting Memorial®  490
  ('pk003011', 'si003061', 1, 10, false), -- Estate Fraud Protection  135
  ('pk003011', 'si003043', 1, 11, false), -- Standard Venue  495
  ('pk003011', 'si003023', 1, 12, false), -- Legal Service Plan  295
  ('pk003011', 'si003095', 1, 13, false), -- Recommended Casket — Tribute Tier  2999
  ('pk003011', 'si003066', 1, 14, true), -- Catered Receptions I  795
  ('pk003011', 'si003071', 1, 15, false), -- Remembrance Collection  395
  -- Dignity Memorial Heritage Cremation Service ($13,793)
  ('pk003012', 'si003002', 1, 1, false), -- Professional Services Fees for Full Service  2255
  ('pk003012', 'si003011', 1, 2, false), -- Registration and Documentation  445
  ('pk003012', 'si003012', 1, 3, false), -- Embalming  625
  ('pk003012', 'si003014', 1, 4, false), -- Other Care and Preparation  445
  ('pk003012', 'si003051', 1, 5, true), -- Reception Room  599
  ('pk003012', 'si003013', 1, 6, false), -- Sheltering of Remains  445
  ('pk003012', 'si003019', 1, 7, false), -- Transfer of Remains from Place of Death to Funeral Home  495
  ('pk003012', 'si003020', 1, 8, false), -- Funeral Vehicle (e.g. Hearse)  395
  ('pk003012', 'si003021', 1, 9, false), -- Limousine  395
  ('pk003012', 'si003060', 1, 10, false), -- Everlasting Memorial®  490
  ('pk003012', 'si003061', 1, 11, false), -- Estate Fraud Protection  135
  ('pk003012', 'si003064', 1, 12, false), -- Dignity Heritage Cremation Flowers  500
  ('pk003012', 'si003041', 1, 13, false), -- Crematory Fee  995
  ('pk003012', 'si003044', 1, 14, false), -- Premium Venue  595
  ('pk003012', 'si003023', 1, 15, false), -- Legal Service Plan  295
  ('pk003012', 'si003099', 1, 16, false), -- Memorial Urn Selection — Heritage Tier  1295
  ('pk003012', 'si003096', 1, 17, false), -- Batesville Brockton Oak Ceremonial  1599
  ('pk003012', 'si003067', 1, 18, true), -- Catered Receptions II  995
  ('pk003012', 'si003069', 1, 19, false), -- Esteemed Collection  795
  -- Dignity Memorial Honour Cremation Service ($10,379)
  ('pk003013', 'si003003', 1, 1, false), -- Professional Services Fees for Memorial Service  2105
  ('pk003013', 'si003011', 1, 2, false), -- Registration and Documentation  445
  ('pk003013', 'si003014', 1, 3, false), -- Other Care and Preparation  445
  ('pk003013', 'si003051', 1, 4, true), -- Reception Room  599
  ('pk003013', 'si003013', 1, 5, false), -- Sheltering of Remains  445
  ('pk003013', 'si003019', 1, 6, false), -- Transfer of Remains from Place of Death to Funeral Home  495
  ('pk003013', 'si003060', 1, 7, false), -- Everlasting Memorial®  490
  ('pk003013', 'si003061', 1, 8, false), -- Estate Fraud Protection  135
  ('pk003013', 'si003065', 1, 9, false), -- Dignity Honour Cremation Flowers  400
  ('pk003013', 'si003041', 1, 10, false), -- Crematory Fee  995
  ('pk003013', 'si003044', 1, 11, false), -- Premium Venue  595
  ('pk003013', 'si003023', 1, 12, false), -- Legal Service Plan  295
  ('pk003013', 'si003100', 1, 13, false), -- Memorial Urn Selection — Honour Tier  795
  ('pk003013', 'si003097', 1, 14, false), -- Batesville Brockton Oak (1 Hour Rental)  850
  ('pk003013', 'si003066', 1, 15, true), -- Catered Receptions I  795
  ('pk003013', 'si003070', 1, 16, false), -- Commemorative Collection  495
  -- Dignity Memorial Tribute Cremation Service ($5,295)
  ('pk003014', 'si003010', 1, 1, false), -- Basic Service Fees for No Service Option  255
  ('pk003014', 'si003011', 1, 2, false), -- Registration and Documentation  445
  ('pk003014', 'si003014', 1, 3, false), -- Other Care and Preparation  445
  ('pk003014', 'si003059', 1, 4, false), -- Venue and Staff Services to coordinate a Simple Gathering  595
  ('pk003014', 'si003013', 1, 5, false), -- Sheltering of Remains  445
  ('pk003014', 'si003019', 1, 6, false), -- Transfer of Remains from Place of Death to Funeral Home  495
  ('pk003014', 'si003061', 1, 7, false), -- Estate Fraud Protection  135
  ('pk003014', 'si003041', 1, 8, false), -- Crematory Fee  995
  ('pk003014', 'si003023', 1, 9, false), -- Legal Service Plan  295
  ('pk003014', 'si003101', 1, 10, false), -- Memorial Urn Selection — Tribute Tier  595
  ('pk003014', 'si003098', 1, 11, false); -- Vancouver Casket Cypress  595

-- ─── New Casket / Container / Vault Catalog Entries ───────────────────────────
-- Adds category: 'vault' (Outer Burial Containers)

insert into casket_catalog (id, name, description, manufacturer, item_code, category, sort_order) values
  ('csk082', 'Brandon', 'Select hardwood casket with a medium finished exterior and a rosetan crepe interior.', 'Batesville', 'CWHWBBENFD', 'wood', 30),
  ('csk083', 'Lambert', 'Select hardwood casket with a medium finished exterior and rosetan crepe interior.', 'Batesville', 'CWHWBCRDFD', 'wood', 32),
  ('csk084', 'West Coast Cedar - First Nations HC', 'Cedar Ancestral Casket.', 'Vancouver Casket', 'CWCRVDABA9', 'wood', 38),
  ('csk085', 'PN Pine Casket', 'First Nations pine casket with light finish exterior and Pendleton blanket interior.', 'Brownsville', 'CWPIYPNFEL', 'wood', 39),
  ('csk086', 'BPF Basic Pine (Full Couch)', 'Basic Pine casket with light pine exterior and Pendleton blanket interior.', 'Brownsville', 'CWPIYBPNEL', 'wood', 40),
  ('csk087', 'BP1 Basic Pine (Full Couch)', 'Basic pine casket with unfinished exterior with curved side handles and no interior.', 'Brownsville', 'CWPIYFCFHN', 'wood', 42),
  ('csk088', 'Triton Grey', '20 gauge steel casket with a grey exterior and ivory crepe interior.', 'Batesville', 'CMS0BEQLCV', 'metal', 49),
  ('csk089', 'Grey Doeskin Oval Cut Top', 'Embossed doeskin cloth-covered cardboard with a grey, oval top exterior and ivory crepe interior.', 'Batesville', 'CCCLBBYMCV', 'other', 50),
  ('cont007', 'Universal Basic Container', 'Cremation container with Interior.', 'Vancouver Casket', 'CCVUBCC', 'container', 56),
  ('cont008', 'OSB Cremation Container', 'OSB cremation-oriented container (Oversize) with handles and basic interior.', 'Vancouver Casket', 'CCVOSCC', 'container', 57),
  ('vlt001', 'Bronze Triune Vault', 'Finest double-reinforced Wilbert burial vault; lustrous bronze carapace; high-strength concrete with bronze and high-impact plastic, customized nameplate. High-impact plastic with bronze inner-liner.', 'Wilbert', 'OSCWBCEST', 'vault', 1),
  ('vlt002', 'Copper Triune Vault', 'Double-reinforced burial vault; rich copper beauty; high-strength concrete with copper and high-impact plastic; customized nameplate. High-impact plastic with copper inner lining.', 'Wilbert', 'OSCWBD0ST', 'vault', 2),
  ('vlt003', 'Cameo Rose Triune Vault', 'Extra heavy concrete; brushed stainless steel carapace; cover and base double-reinforced with strong, corrosion-resistant stainless steel and high-impact plastic; sculpted pink rose and customized nameplate. High-impact plastic.', 'Wilbert', 'OSCWBCKST', 'vault', 3),
  ('vlt004', 'Stainless Steel Triune Vault', 'Reinforced concrete; brilliant stainless steel carapace; cover and base double-reinforced with strong, corrosion-resistant stainless steel and high-impact plastic; special emblems and customized nameplate. High-impact plastic with stainless steel inner lining.', 'Wilbert', 'OSCWBLJST', 'vault', 4),
  ('vlt005', 'Venetian Vault', 'Finest single-reinforced burial vault; high-strength concrete with high-impact plastic and a reinforced cover and base; rich look of polished marble; personalization choices available. Strentex inner lining.', 'Wilbert', 'OSCWBQ4ST', 'vault', 5),
  ('vlt006', 'Continental Vault', 'Mid-line single-reinforced burial vault; durable concrete exterior with a plastic-reinforced cover and base; extra-strong cover. Strentex inner lining.', 'Wilbert', 'OSCWBCWST', 'vault', 6),
  ('vlt007', 'Monticello Vault', 'Entry-level single-reinforced burial vault; concrete exterior with a plastic-reinforced cover and base. Strentex inner lining.', 'Wilbert', 'OSCWBGMST', 'vault', 7),
  ('vlt008', 'Monarch Vault', 'Reinforced concrete vault. Reinforced dome-shaped concrete vault with no inner liner.', 'Wilbert', 'OSCWBGKST', 'vault', 8),
  ('vlt009', 'Venetian Urn Vault', 'Finest single-reinforced burial vault; high-strength concrete with high-impact plastic and a reinforced cover and base; rich look of polished marble; personalization choices available. Strentex interior liner.', 'Wilbert', 'OUCWBQ3ST', 'vault', 9),
  ('vlt010', 'Monticello Urn Vault', 'Entry-level single-reinforced burial vault; concrete exterior with a plastic-reinforced cover and base. Strentex inner liner.', 'Wilbert', 'OUCWBGLST', 'vault', 10);

-- ─── Casket / Container / Vault Pricing ────────────────────────────────────────

insert into funeral_home_caskets (funeral_home_id, catalog_id, price, sort_order) values
  -- Wood Caskets
  ('3150', 'csk016', 8299.00, 1), -- Regent
  ('3150', 'csk024', 6499.00, 2), -- Classic Mahogany
  ('3150', 'csk015', 6499.00, 3), -- Prominence
  ('3150', 'csk027', 5699.00, 4), -- Woodbridge Pecan
  ('3150', 'csk028', 5199.00, 5), -- St. Thomas Oak
  ('3150', 'csk029', 5099.00, 6), -- Mansfield-27
  ('3150', 'csk030', 4699.00, 7), -- Briar Hill
  ('3150', 'csk031', 4699.00, 8), -- Camden Oak
  ('3150', 'csk032', 4699.00, 9), -- Cameron Oak
  ('3150', 'csk033', 4699.00, 10), -- Promise
  ('3150', 'csk034', 4699.00, 11), -- Rosette
  ('3150', 'csk035', 4699.00, 12), -- Victoria Cherry
  ('3150', 'csk036', 4295.00, 13), -- Sincerity
  ('3150', 'csk037', 4099.00, 14), -- Brexton
  ('3150', 'csk014', 4099.00, 15), -- Dominion HC Wood Maple Crepe
  ('3150', 'csk004', 4099.00, 16), -- Eleanor Oak
  ('3150', 'csk003', 4099.00, 17), -- Fireside
  ('3150', 'csk038', 4099.00, 18), -- Hadyn
  ('3150', 'csk007', 3599.00, 19), -- Bailey
  ('3150', 'csk008', 3599.00, 20), -- Hartvic
  ('3150', 'csk039', 3599.00, 21), -- Sherwood Oak
  ('3150', 'csk006', 3599.00, 22), -- Watson
  ('3150', 'csk009', 2999.00, 23), -- Coleridge
  ('3150', 'csk040', 2999.00, 24), -- Constance
  ('3150', 'csk011', 2999.00, 25), -- Heavenly White
  ('3150', 'csk010', 2999.00, 26), -- Montgomery
  ('3150', 'csk076', 2999.00, 27), -- Westcott
  ('3150', 'csk041', 2999.00, 28), -- White Rose
  ('3150', 'csk012', 2999.00, 29), -- Winfield
  ('3150', 'csk082', 2899.00, 30), -- Brandon
  ('3150', 'csk042', 2899.00, 31), -- Carnaby
  ('3150', 'csk083', 2899.00, 32), -- Lambert
  ('3150', 'csk043', 2799.00, 33), -- Atlantic
  ('3150', 'csk044', 2799.00, 34), -- Natura
  ('3150', 'csk045', 2799.00, 35), -- Oxford
  ('3150', 'csk013', 2599.00, 36), -- Freelton
  ('3150', 'csk046', 2599.00, 37), -- Schafer
  ('3150', 'csk084', 2599.00, 38), -- West Coast Cedar - First Nations HC
  ('3150', 'csk085', 2299.00, 39), -- PN Pine Casket
  ('3150', 'csk086', 2199.00, 40), -- BPF Basic Pine (Full Couch)
  ('3150', 'csk072', 2099.00, 41), -- Butler
  ('3150', 'csk087', 1199.00, 42), -- BP1 Basic Pine (Full Couch)
  -- Metal Caskets
  ('3150', 'csk049', 5199.00, 43), -- Golden Granite
  ('3150', 'csk050', 5099.00, 44), -- Primrose
  ('3150', 'csk051', 4299.00, 45), -- Merlot-28
  ('3150', 'csk001', 4099.00, 46), -- Merlot
  ('3150', 'csk052', 3599.00, 47), -- Antique Blue-28
  ('3150', 'csk005', 3599.00, 48), -- Misty Blue
  ('3150', 'csk088', 2099.00, 49), -- Triton Grey
  -- Other Caskets
  ('3150', 'csk089', 1499.00, 50), -- Grey Doeskin Oval Cut Top
  ('3150', 'csk079', 1099.00, 51), -- Grey Malet
  -- Cremation Oriented Caskets
  ('3150', 'csk053', 1050.00, 52), -- McConnell
  ('3150', 'csk071', 850.00, 53), -- Burlington
  -- Containers
  ('3150', 'cont004', 699.00, 54), -- Plywood Container
  ('3150', 'cont003', 595.00, 55), -- Cypress
  ('3150', 'cont007', 525.00, 56), -- Universal Basic Container
  ('3150', 'cont008', 450.00, 57), -- OSB Cremation Container
  -- Rental Caskets
  ('3150', 'cont001', 1599.00, 58), -- Brockton Oak Ceremonial
  ('3150', 'cont002', 850.00, 59), -- Brockton Oak (1 Hour Rental)
  -- Concrete Outer Burial Containers
  ('3150', 'vlt001', 6599.00, 60), -- Bronze Triune Vault
  ('3150', 'vlt002', 5599.00, 61), -- Copper Triune Vault
  ('3150', 'vlt003', 4799.00, 62), -- Cameo Rose Triune Vault
  ('3150', 'vlt004', 4799.00, 63), -- Stainless Steel Triune Vault
  ('3150', 'vlt005', 2799.00, 64), -- Venetian Vault
  ('3150', 'vlt006', 2399.00, 65), -- Continental Vault
  ('3150', 'vlt007', 2199.00, 66), -- Monticello Vault
  ('3150', 'vlt008', 1699.00, 67), -- Monarch Vault
  -- Cremation Outer Burial Containers
  ('3150', 'vlt009', 1499.00, 68), -- Venetian Urn Vault
  ('3150', 'vlt010', 1199.00, 69); -- Monticello Urn Vault

