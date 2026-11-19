-- ─────────────────────────────────────────────────────────────────────────────
-- 3644 OCEAN VIEW FUNERAL HOME — mirror of 3605 Forest Lawn's pricing
--
-- Run in the Supabase SQL Editor. Safe to re-run — see "Re-syncing" below.
--
-- Ocean View uses Forest Lawn's price list verbatim for now. Rather than
-- paste a copy of every row, this COPIES 3605's catalogue at run time, so
-- what 3644 gets is exactly what 3605 has on the day you run it, with no
-- chance of a transcription slip.
--
-- IDs are derived from the source, not newly invented:
--
--     service item   si003001  ->  ov003001
--     package        pk000210  ->  op000210
--
-- so every Ocean View row can be traced back to the Forest Lawn row it came
-- from, the copy is repeatable (the same source always produces the same
-- target id), and `ov`/`op` are prefixes nothing else in the database uses,
-- so a collision is impossible rather than merely unlikely.
--
-- NOT copied: address, phone and website. Those are Forest Lawn's and would
-- otherwise print on an Ocean View quote. Fill them in — see step 1.
--
-- ── Re-syncing ───────────────────────────────────────────────────────────────
-- Re-running this re-copies Forest Lawn's current prices over Ocean View's.
-- That is what you want WHILE the two share a price list. Once Ocean View
-- gets its own pricing, stop running this file, or it will overwrite the
-- difference.
--
-- Items that have disappeared from 3605 are deactivated on 3644 rather than
-- deleted, because quote_items references service_items and deleting would
-- break historical quotes.
-- ─────────────────────────────────────────────────────────────────────────────

begin;

-- ─── 0. Refuse to run if the source is missing ───────────────────────────────
do $$
begin
  if not exists (select 1 from funeral_homes where id = '3605') then
    raise exception 'Forest Lawn (3605) is not in this database — nothing to copy from';
  end if;
  if not exists (select 1 from service_items where funeral_home_id = '3605') then
    raise exception 'Forest Lawn (3605) has no service items — run its seed first';
  end if;
end $$;

-- ─── 1. The funeral home ─────────────────────────────────────────────────────
-- Address and phone are deliberately left null. Set them with:
--   update funeral_homes
--      set address = '…', phone = '…', website = '…'
--    where id = '3644';
insert into funeral_homes (id, name, address, phone, website, tax_rate)
select '3644', 'Ocean View Funeral Home', null, null, null, tax_rate
  from funeral_homes where id = '3605'
on conflict (id) do update set
  name     = excluded.name,
  tax_rate = excluded.tax_rate;

-- ─── 2. Service items ────────────────────────────────────────────────────────
insert into service_items (
  id, funeral_home_id, category_id, item_code, name, description,
  price, price_min, price_max, is_cash_advance, active,
  default_gst, default_pst, default_no_disc, sort_order)
select
  'ov' || substr(id, 3), '3644', category_id, item_code, name, description,
  price, price_min, price_max, is_cash_advance, active,
  default_gst, default_pst, default_no_disc, sort_order
from service_items
where funeral_home_id = '3605'
on conflict (id) do update set
  category_id     = excluded.category_id,
  item_code       = excluded.item_code,
  name            = excluded.name,
  description     = excluded.description,
  price           = excluded.price,
  price_min       = excluded.price_min,
  price_max       = excluded.price_max,
  is_cash_advance = excluded.is_cash_advance,
  active          = excluded.active,
  default_gst     = excluded.default_gst,
  default_pst     = excluded.default_pst,
  default_no_disc = excluded.default_no_disc,
  sort_order      = excluded.sort_order;

-- Retire anything Ocean View still has that Forest Lawn no longer does.
-- Hidden rather than deleted: quote_items references service_items.
update service_items t
   set active = false
 where t.funeral_home_id = '3644'
   and not exists (
     select 1 from service_items s
      where s.funeral_home_id = '3605'
        and 'ov' || substr(s.id, 3) = t.id);

-- ─── 3. Caskets ──────────────────────────────────────────────────────────────
-- casket_catalog is shared across all homes, so only the per-home price and
-- availability rows are copied. Photos and descriptions come along for free.
insert into funeral_home_caskets (funeral_home_id, catalog_id, price, sort_order)
select '3644', catalog_id, price, sort_order
  from funeral_home_caskets where funeral_home_id = '3605'
on conflict (funeral_home_id, catalog_id) do update set
  price      = excluded.price,
  sort_order = excluded.sort_order;

delete from funeral_home_caskets t
 where t.funeral_home_id = '3644'
   and not exists (
     select 1 from funeral_home_caskets s
      where s.funeral_home_id = '3605' and s.catalog_id = t.catalog_id);

-- ─── 4. Packages ─────────────────────────────────────────────────────────────
insert into packages (
  id, funeral_home_id, name, pkg_type, total_price,
  package_discount, default_casket_id, sort_order)
select
  'op' || substr(id, 3), '3644', name, pkg_type, total_price,
  package_discount, default_casket_id, sort_order
from packages
where funeral_home_id = '3605'
on conflict (id) do update set
  name              = excluded.name,
  pkg_type          = excluded.pkg_type,
  total_price       = excluded.total_price,
  package_discount  = excluded.package_discount,
  default_casket_id = excluded.default_casket_id,
  sort_order        = excluded.sort_order;

-- ─── 5. Package contents ─────────────────────────────────────────────────────
-- Rebuilt rather than upserted: package_items has a surrogate key, so there
-- is nothing stable to conflict on. Each line is re-pointed at 3644's OWN
-- service items — if it still pointed at 3605's, editing one home's package
-- would change the other's.
delete from package_items
 where package_id in (select id from packages where funeral_home_id = '3644');

insert into package_items (package_id, service_item_id, quantity, is_optional, sort_order)
select
  'op' || substr(pi.package_id, 3),
  'ov' || substr(pi.service_item_id, 3),
  pi.quantity, pi.is_optional, pi.sort_order
from package_items pi
join packages p on p.id = pi.package_id
where p.funeral_home_id = '3605';

commit;

-- ─── Check ───────────────────────────────────────────────────────────────────
-- Every row should read "match".
with counts as (
  select
    (select count(*) from service_items where funeral_home_id='3605' ) as si_src,
    (select count(*) from service_items where funeral_home_id='3644' ) as si_dst,
    (select count(*) from packages      where funeral_home_id='3605' ) as pk_src,
    (select count(*) from packages      where funeral_home_id='3644' ) as pk_dst,
    (select count(*) from funeral_home_caskets where funeral_home_id='3605') as ck_src,
    (select count(*) from funeral_home_caskets where funeral_home_id='3644') as ck_dst,
    (select count(*) from package_items pi join packages p on p.id=pi.package_id
      where p.funeral_home_id='3605') as pi_src,
    (select count(*) from package_items pi join packages p on p.id=pi.package_id
      where p.funeral_home_id='3644') as pi_dst
)
select 'service items' as what, si_src as forest_lawn, si_dst as ocean_view,
       case when si_src=si_dst then 'match' else 'MISMATCH' end as result from counts
union all select 'packages',      pk_src, pk_dst, case when pk_src=pk_dst then 'match' else 'MISMATCH' end from counts
union all select 'package lines', pi_src, pi_dst, case when pi_src=pi_dst then 'match' else 'MISMATCH' end from counts
union all select 'caskets',       ck_src, ck_dst, case when ck_src=ck_dst then 'match' else 'MISMATCH' end from counts
union all
select 'prices differing', count(*)::int, 0,
       case when count(*)=0 then 'match' else 'MISMATCH' end
  from service_items s
  join service_items t on t.id = 'ov' || substr(s.id, 3)
 where s.funeral_home_id='3605'
   and (s.price is distinct from t.price or s.name is distinct from t.name)
union all
select 'package lines pointing at the wrong home', count(*)::int, 0,
       case when count(*)=0 then 'match' else 'MISMATCH' end
  from package_items pi
  join packages p  on p.id = pi.package_id
  join service_items si on si.id = pi.service_item_id
 where p.funeral_home_id = '3644' and si.funeral_home_id <> '3644';
