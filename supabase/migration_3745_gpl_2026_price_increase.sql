-- ─────────────────────────────────────────────────────────────────────────────
-- MIGRATION — Victory Memorial Park (3745) GPL price increase
-- Effective June 30, 2026. Updates the à la carte (General Price List)
-- service-item prices and the à la carte service-offering package totals
-- to match GENERAL_PRICE_LIST_2026.pdf. Run once in Supabase SQL Editor.
-- Safe to re-run.
--
-- NOT touched: the named PPL packages (Heritage/Honour/Tribute Funeral &
-- Cremation, pk000010–pk000015). Those are priced by a separate Package
-- Price List that was not part of this update, even though some share the
-- repriced GPL items — update them when a new PPL is provided.
-- ─────────────────────────────────────────────────────────────────────────────

-- ─── À la carte service-item price changes ──────────────────────────────────
update service_items set price = 4220.00 where id = 'si000001' and funeral_home_id = '3745'; -- Full Service prof. fees (was 4070)
update service_items set price = 4070.00 where id = 'si000003' and funeral_home_id = '3745'; -- Memorial Service prof. fees (was 3920)
update service_items set price = 3895.00 where id = 'si000004' and funeral_home_id = '3745'; -- Graveside Service prof. fees (was 3795)
update service_items set price =  345.00 where id = 'si000028' and funeral_home_id = '3745'; -- Private Family Moment (was 295)
update service_items set price =  445.00 where id = 'si000030' and funeral_home_id = '3745'; -- Supervision - Evening Charge (was 400)
update service_items set price =  145.00 where id = 'si000058' and funeral_home_id = '3745'; -- Estate Fraud Protection (was 135)
update service_items set price =  595.00 where id = 'si000075' and funeral_home_id = '3745'; -- Cremation Witnessing Fee (was 499)
update service_items set price = 1095.00 where id = 'si000076' and funeral_home_id = '3745'; -- Crematory Fee (was 995)

-- ─── Weekend / holiday charges restructured to match the new GPL ─────────────
-- The new GPL drops the single "Weekend" charge in favour of separate
-- Saturday ($1,000) and Sunday ($1,750) charges, and reprices the holiday
-- charge to $2,000.
update service_items
  set name = 'Additional Charge - Use of Facilities on Holidays', price = 2000.00
  where id = 'si000031' and funeral_home_id = '3745';                     -- was 'Supervision - Holiday Charge' 999
update service_items
  set name = 'Additional Charge - Saturday Service', price = 1000.00
  where id = 'si000033' and funeral_home_id = '3745';                     -- was 'Additional Charge - Weekend' 999
insert into service_items (id, funeral_home_id, category_id, item_code, name, description, price, price_min, price_max, is_cash_advance)
  values ('si000034', '3745', 'c1000000-0000-0000-0000-000000000002', NULL, 'Additional Charge - Sunday Service', NULL, 1750.00, NULL, NULL, false)
  on conflict (id) do update set name = excluded.name, price = excluded.price;

-- ─── À la carte service-offering package totals ─────────────────────────────
-- (Sum of components per the GPL SERVICE OFFERINGS section — verified to the
-- penny. Forwarding/Receiving/Tea Room totals are unchanged.)
update packages set total_price = 7810.00 where id = 'pk000001'; -- Full Service (was 7650)
update packages set total_price = 7110.00 where id = 'pk000002'; -- Witness Cremation (was 7000)
update packages set total_price = 7735.00 where id = 'pk000003'; -- Service of Remembrance (was 7475)
update packages set total_price = 6265.00 where id = 'pk000004'; -- Graveside Service (was 6155)
update packages set total_price = 4260.00 where id = 'pk000005'; -- Urn Committal Option (was 4150)
update packages set total_price = 3740.00 where id = 'pk000006'; -- No Service Option (was 3630)
