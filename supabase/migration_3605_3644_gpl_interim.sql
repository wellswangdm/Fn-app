-- ─────────────────────────────────────────────────────────────────────────────
-- 3605 FOREST LAWN + 3644 OCEAN VIEW — interim GPL prices
--
-- Run in the Supabase SQL Editor. Safe to re-run.
--
-- A temporary price list for both homes until the real GPL arrives. The two
-- share a price list, so every change here is applied to both.
--
-- Items are matched BY NAME, not by id, so this file reads as the price list
-- itself and stays correct whichever home it lands in. A name that matches
-- nothing is reported at the bottom rather than failing silently.
--
-- Prices already correct are listed anyway, so this file is the full
-- statement of the interim GPL rather than just a diff. Re-running it puts
-- both homes back to these numbers.
-- ─────────────────────────────────────────────────────────────────────────────

begin;

-- ─── 1. Guaranteed and third-party items ─────────────────────────────────────
with gpl(name, price) as (values
  -- Guaranteed items
  ('Professional Services Fees for Full Service',              4695.00),
  ('Registration and Documentation',                            495.00),
  ('Embalming',                                                 625.00),
  ('Other Care and Preparation',                                445.00),
  ('Sheltering of Remains',                                     495.00),  -- was 445
  ('Transfer of Remains from Place of Death to Funeral Home',   645.00),  -- was 545
  ('Funeral Vehicle (Hearse)',                                  450.00),  -- was 395
  ('Everlasting Memorial',                                      490.00),
  ('Estate Fraud Protection',                                   145.00),  -- was 135
  ('Premium Venue',                                             655.00),  -- was 595
  ('Dignity Heritage Burial Flowers',                           695.00),
  ('Remembrance Collection',                                    395.00),
  ('Flower Vehicle',                                            295.00),
  ('Memory Portrait',                                           295.00),
  -- Third party items
  ('Consumer Protection BC Fee',                                 48.00),
  ('Death Certificate',                                          27.00)   -- see note below
)
update service_items si
   set price = gpl.price
  from gpl
 where si.funeral_home_id in ('3605', '3644')
   and lower(si.name) = lower(gpl.name);

-- Death Certificate was a cash-advance item: it carried no price and the
-- advisor typed the amount on every quote, so a stored $27 would never have
-- appeared. It is now a normal priced line at $27 each, with quantity
-- covering extra copies.
--
-- To put it back the way it was:
--   update service_items set is_cash_advance = true, price = null
--    where funeral_home_id in ('3605','3644') and name = 'Death Certificate';
update service_items
   set is_cash_advance = false
 where funeral_home_id in ('3605', '3644')
   and lower(name) = 'death certificate';

-- ─── 2. Stationery in packages → the cheapest collection ─────────────────────
-- Every package that carries a stationery line now carries Remembrance
-- Collection ($395) instead of Commemorative ($495) or Esteemed ($795).
--
-- Found by category rather than by a list of ids, so it catches any package
-- carrying any item from the stationery group, in either home.
--
-- total_price is NOT adjusted. What a package sells for is a business
-- decision, not arithmetic — see the report at the bottom for the amounts.
with target as (
  select funeral_home_id, id, category_id
    from service_items
   where funeral_home_id in ('3605','3644')
     and lower(name) = 'remembrance collection'
)
update package_items pi
   set service_item_id = t.id
  from packages p, service_items cur, target t
 where p.id  = pi.package_id
   and cur.id = pi.service_item_id
   and p.funeral_home_id in ('3605','3644')
   and cur.funeral_home_id = p.funeral_home_id
   and t.funeral_home_id   = p.funeral_home_id
   and cur.category_id     = t.category_id      -- it is a stationery line
   and pi.service_item_id <> t.id;              -- and not already the cheapest

-- ─── 3. Package savings ──────────────────────────────────────────────────────
-- The "you save" figure on a package. total_price is untouched.
--
-- Burial packages only. Each has a cremation counterpart that is NOT listed
-- here and keeps its own figure:
--   Heritage Cremation $515, Tribute Cremation $50, Jade Cremation $460.
with savings(name, discount) as (values
  ('Dignity Memorial Heritage Funeral Service', 605.00),   -- was 585
  ('Dignity Memorial Tribute Funeral Service',  495.00),   -- was 475
  ('Dignity Jade Burial Plan',                  575.00)    -- was 555
)
update packages p
   set package_discount = s.discount
  from savings s
 where p.funeral_home_id in ('3605', '3644')
   and lower(p.name) = lower(s.name);

commit;

-- ─── Check 1: every name in the list found an item in both homes ─────────────
-- Expect two rows per name (3605 and 3644) and no "NOT FOUND".
with gpl(name, price) as (values
  ('Professional Services Fees for Full Service',              4695.00),
  ('Registration and Documentation',                            495.00),
  ('Embalming',                                                 625.00),
  ('Other Care and Preparation',                                445.00),
  ('Sheltering of Remains',                                     495.00),
  ('Transfer of Remains from Place of Death to Funeral Home',   645.00),
  ('Funeral Vehicle (Hearse)',                                  450.00),
  ('Everlasting Memorial',                                      490.00),
  ('Estate Fraud Protection',                                   145.00),
  ('Premium Venue',                                             655.00),
  ('Dignity Heritage Burial Flowers',                           695.00),
  ('Remembrance Collection',                                    395.00),
  ('Flower Vehicle',                                            295.00),
  ('Memory Portrait',                                           295.00),
  ('Consumer Protection BC Fee',                                 48.00),
  ('Death Certificate',                                          27.00)
)
select g.name,
       count(si.id)                                            as homes_updated,
       coalesce(min(si.price)::text, 'NOT FOUND')               as price_now,
       case when count(si.id) = 2 and min(si.price) = g.price
                 and min(si.price) = max(si.price)
            then 'ok' else 'CHECK' end                          as result
  from gpl g
  left join service_items si
         on si.funeral_home_id in ('3605','3644')
        and lower(si.name) = lower(g.name)
 group by g.name, g.price
 order by result desc, g.name;

-- ─── Check 2: package savings ────────────────────────────────────────────────
-- The three burial packages should read their new figure; everything else is
-- shown for context and should be unchanged.
with savings(name, discount) as (values
  ('Dignity Memorial Heritage Funeral Service', 605.00),
  ('Dignity Memorial Tribute Funeral Service',  495.00),
  ('Dignity Jade Burial Plan',                  575.00)
)
select p.funeral_home_id, p.name, p.total_price, p.package_discount,
       case when s.name is null then 'not in this update'
            when p.package_discount = s.discount then 'ok'
            else 'CHECK' end as result
  from packages p
  left join savings s on lower(s.name) = lower(p.name)
 where p.funeral_home_id in ('3605','3644')
   and p.pkg_type = 'package'
 order by p.funeral_home_id, (s.name is null), p.sort_order;

-- ─── Check 3: the two homes still agree on every price ───────────────────────
-- Expect 0. Ocean View mirrors Forest Lawn until it gets its own GPL.
select count(*) as prices_that_differ_between_the_two_homes
  from service_items s
  join service_items t on t.id = 'ov' || substr(s.id, 3)
 where s.funeral_home_id = '3605'
   and s.price is distinct from t.price;

-- ─── Check 4: stationery is now the cheapest in every package ────────────────
-- Expect every row to read 'Remembrance Collection'.
select p.funeral_home_id, p.name as package, si.name as stationery, si.price,
       case when lower(si.name) = 'remembrance collection' then 'ok' else 'CHECK' end as result
  from package_items pi
  join packages p      on p.id  = pi.package_id
  join service_items si on si.id = pi.service_item_id
 where p.funeral_home_id in ('3605','3644')
   and si.category_id = (select category_id from service_items
                          where funeral_home_id = p.funeral_home_id
                            and lower(name) = 'remembrance collection')
 order by p.funeral_home_id, p.sort_order;

-- ─── Check 5: what the swap did to each package's contents ───────────────────
-- total_price was left alone. These are the amounts by which the contents of
-- each package got cheaper, so you can decide whether the price should follow.
select p.funeral_home_id,
       p.name                                   as package,
       p.total_price                            as price_unchanged,
       sum(si.price * pi.quantity) filter (where not pi.is_optional) as contents_now,
       p.package_discount                       as savings_shown
  from packages p
  join package_items pi on pi.package_id = p.id
  join service_items si on si.id = pi.service_item_id
 where p.funeral_home_id in ('3605','3644')
   and p.pkg_type = 'package'
 group by p.id, p.funeral_home_id, p.name, p.total_price, p.package_discount, p.sort_order
 order by p.funeral_home_id, p.sort_order;
