-- ─────────────────────────────────────────────────────────────────────────────
-- SCHEMA — Funeral Quote App
-- Run this first in Supabase SQL Editor (Dashboard → SQL Editor → New query)
-- ─────────────────────────────────────────────────────────────────────────────

create table if not exists funeral_homes (
  id          text    primary key,          -- company-assigned ID e.g. '3745'
  name        text    not null,
  address     text,
  phone       text,
  website     text,
  tax_rate    numeric(5,4) not null default 0.05,
  created_at  timestamptz  default now()
);

-- Shared master list — same category names across all funeral homes
create table if not exists service_categories (
  id          uuid    primary key default gen_random_uuid(),
  name        text    not null,
  sort_order  int     default 0
);

-- Service & merchandise items — one set per funeral home (prices differ per home)
create table if not exists service_items (
  id              text    primary key,   -- human-readable codes e.g. 'si000001'
  funeral_home_id text    references funeral_homes on delete cascade,
  category_id     uuid    references service_categories,
  item_code       text,
  name            text    not null,
  description     text,
  price           numeric(10,2),         -- null for cash-advance / range items
  price_min       numeric(10,2),
  price_max       numeric(10,2),
  is_cash_advance boolean default false,
  sort_order      int     default 0,
  created_at      timestamptz default now()
);

-- Global casket/container product catalog — images and descriptions shared across all funeral homes
create table if not exists casket_catalog (
  id           text    primary key,   -- e.g. 'csk001', 'cont001'
  name         text    not null,
  description  text,
  manufacturer text,
  item_code    text,                  -- manufacturer SKU
  category     text    default 'wood',  -- 'wood' | 'metal' | 'cremation' | 'rental' | 'container'
  image_url    text,
  sort_order   int     default 0,
  created_at   timestamptz default now()
);

-- Per-funeral-home casket availability and pricing (price can differ per home)
create table if not exists funeral_home_caskets (
  id              uuid    primary key default gen_random_uuid(),
  funeral_home_id text    references funeral_homes on delete cascade,
  catalog_id      text    references casket_catalog,
  price           numeric(10,2) not null,
  sort_order      int     default 0,
  unique (funeral_home_id, catalog_id)
);

-- Service packages (named bundles + à la carte options)
create table if not exists packages (
  id                text    primary key,   -- e.g. 'pk000001'
  funeral_home_id   text    references funeral_homes on delete cascade,
  name              text    not null,
  pkg_type          text    default 'alacarte',  -- 'package' | 'alacarte'
  total_price       numeric(10,2) default 0,
  package_discount  numeric(10,2) default 0,
  default_casket_id text    references casket_catalog,  -- null for à la carte
  sort_order        int     default 0,
  created_at        timestamptz default now()
);

-- Which service items belong to a package
create table if not exists package_items (
  id              uuid primary key default gen_random_uuid(),
  package_id      text references packages    on delete cascade,
  service_item_id text references service_items,
  quantity        int  default 1,
  is_optional     boolean default false
);

-- Quotes
create table if not exists quotes (
  id               uuid  primary key default gen_random_uuid(),
  funeral_home_id  text  references funeral_homes,
  package_id       text  references packages,
  quote_number     text,
  customer_name    text,
  customer_email   text,
  customer_phone   text,
  deceased_name    text,
  advisor_name     text,
  advisor_email    text,
  advisor_phone    text,
  package_discount numeric(10,2) default 0,
  subtotal         numeric(10,2) default 0,
  arrangement_type text          default 'burial',
  discount_type    text          default 'percentage',
  discount_value   numeric(10,4) default 0,
  discount_amount  numeric(10,2) default 0,
  tax_rate         numeric(5,4)  default 0.05,
  tax_amount       numeric(10,2) default 0,
  total            numeric(10,2) default 0,
  status              text          default 'draft',
  notes               text,
  beneficiary_phone   text,
  beneficiary_email   text,
  beneficiary_birthdate date,
  beneficiary_address text,
  purchaser_different boolean       default false,
  purchaser_name      text,
  purchaser_phone     text,
  purchaser_email     text,
  purchaser_birthdate date,
  purchaser_address   text,
  created_at          timestamptz   default now(),
  updated_at          timestamptz   default now(),
  contact_id          uuid
);

-- Quote line items — price/name are snapshots at time of quoting
create table if not exists quote_items (
  id              uuid primary key default gen_random_uuid(),
  quote_id        uuid references quotes       on delete cascade,
  service_item_id text references service_items,  -- null for casket rows & custom items
  casket_id       text references casket_catalog,   -- set only when is_casket_item = true
  name            text    not null,
  price           numeric(10,2) default 0,
  quantity        int           default 1,
  is_from_package boolean       default false,
  is_gst          boolean       default true,
  is_pst          boolean       default false,
  no_disc         boolean       default false,    -- excluded from discount calculations
  is_casket_item  boolean       default false,
  section_id      text,
  notes           text,
  created_at      timestamptz   default now()
);

-- ─── Auto-update updated_at ───────────────────────────────────────────────────

create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger quotes_updated_at
  before update on quotes
  for each row execute function update_updated_at();

-- ─── Row Level Security ───────────────────────────────────────────────────────
-- Open read/write for now (internal tool, no auth yet).
-- When auth is added: replace with per-user / per-funeral-home policies.

alter table funeral_homes      enable row level security;
alter table service_categories enable row level security;
alter table service_items      enable row level security;
alter table casket_catalog       enable row level security;
alter table funeral_home_caskets enable row level security;
alter table packages            enable row level security;
alter table package_items       enable row level security;
alter table quotes              enable row level security;
alter table quote_items         enable row level security;

create policy "allow_all" on funeral_homes      for all using (true) with check (true);
create policy "allow_all" on service_categories for all using (true) with check (true);
create policy "allow_all" on service_items      for all using (true) with check (true);
create policy "allow_all" on casket_catalog       for all using (true) with check (true);
create policy "allow_all" on funeral_home_caskets for all using (true) with check (true);
create policy "allow_all" on packages           for all using (true) with check (true);
create policy "allow_all" on package_items      for all using (true) with check (true);
create policy "allow_all" on quotes             for all using (true) with check (true);
create policy "allow_all" on quote_items        for all using (true) with check (true);
