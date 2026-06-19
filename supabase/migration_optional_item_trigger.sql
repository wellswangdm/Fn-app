-- ─────────────────────────────────────────────────────────────────────────────
-- MIGRATION — Auto-flag optional package items (all funeral homes, current
-- and future). Run this once in Supabase SQL Editor.
--
-- Replaces manual per-seed is_optional edits with a trigger: any
-- package_items row linked to a service_item whose name contains "cater",
-- "reception", or "limousine" is automatically marked is_optional = true
-- on insert/update — so any funeral home added in the future gets this
-- rule for free, with no follow-up migration needed.
-- Safe to re-run.
-- ─────────────────────────────────────────────────────────────────────────────

create or replace function set_package_item_optional_flag()
returns trigger as $$
declare
  item_name text;
begin
  select name into item_name from service_items where id = new.service_item_id;
  if item_name ilike '%cater%' or item_name ilike '%reception%' or item_name ilike '%limousine%' then
    new.is_optional := true;
  end if;
  return new;
end;
$$ language plpgsql;

drop trigger if exists trg_package_item_optional_flag on package_items;
create trigger trg_package_item_optional_flag
  before insert or update on package_items
  for each row execute function set_package_item_optional_flag();

-- Backfill existing rows for every funeral home (current homes' data
-- predates the trigger, so it never ran for them).
update package_items pi set is_optional = true
from service_items si
where pi.service_item_id = si.id
  and (si.name ilike '%cater%' or si.name ilike '%reception%' or si.name ilike '%limousine%');
