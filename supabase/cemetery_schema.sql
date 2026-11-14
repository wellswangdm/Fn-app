-- ─────────────────────────────────────────────────────────────────────────────
-- CEMETERY PORTAL — SCHEMA
--
-- Run this ONCE in the Supabase SQL Editor, before any cemetery seed file.
--
-- Everything lives in its own `cemetery` schema so the funeral portal's
-- `public` tables cannot be touched by any of this. The two portals share
-- exactly three things, all in `public`: auth.users, profiles, and (later)
-- customers.
--
-- Design notes (why it looks like this):
--
--   * One set of tables with a park dimension, NOT a set of tables per park.
--     Parks differ in their VALUES, not in their COLUMNS. Adding a 5th park
--     is an INSERT, not a migration.
--
--   * Three different sharing behaviours, because the data has three:
--       1. properties      → park-specific, never shared  (park_id on the row)
--       2. products        → shared catalogue + per-park price
--       3. services        → shared definitions + price per FEE SCHEDULE,
--                            and a fee schedule can be shared by two parks
--                            (Ocean View + Forest Lawn), so one edit covers both
--
--   * Fee lines (installation, ECF, granite base) are structure, not CSV
--     column mappings. A NULL or zero amount produces no line — the same
--     behaviour as the old app's `if (p > 0)`.
--
--   * hmis_code is on every priced entity. Advisor-facing views will show it;
--     customer-facing output will not. See docs/cemetery/03-blueprint.md.
-- ─────────────────────────────────────────────────────────────────────────────

create schema if not exists cemetery;

-- ─── 1. Fee schedules ────────────────────────────────────────────────────────
-- A named set of service prices. Parks point at one. Two parks may point at
-- the SAME schedule, which is how Ocean View and Forest Lawn stay in sync by
-- construction rather than by remembering to edit both.

create table if not exists cemetery.fee_schedules (
  id          text primary key,            -- 'fs_victory', 'fs_oceanview_forestlawn'
  name        text not null,
  notes       text,
  created_at  timestamptz default now()
);

-- ─── 2. Parks ────────────────────────────────────────────────────────────────
-- Letterhead comes from here (name + address) combined with the signed-in
-- advisor's own profile (full_name / phone / advisor_email in public.profiles).

create table if not exists cemetery.parks (
  id              text primary key,        -- company code: '6800', '0839', '0838', '0836'
  name            text not null,
  address         text,
  phone           text,
  website         text,
  fee_schedule_id text references cemetery.fee_schedules,
  gst_rate        numeric(5,4) not null default 0.05,
  pst_rate        numeric(5,4) not null default 0.07,
  sort_order      int     default 0,
  active          boolean not null default true,
  created_at      timestamptz default now()
);

-- ─── 3. Service categories ───────────────────────────────────────────────────
-- The six families that the old "Interments-Services" sheet held in one flat
-- list under a SERIES column the app never used as a filter. Interment and
-- memorial installation are different things and are kept apart here.

create table if not exists cemetery.service_categories (
  id          text primary key,
  name        text not null,
  name_zh     text,
  sort_order  int default 0
);

-- ─── 4. Service types (shared definitions, no price) ─────────────────────────

create table if not exists cemetery.service_types (
  id           text primary key,           -- 'svc_int_ground_signature'
  category_id  text references cemetery.service_categories,
  hmis_code    text,
  name         text not null,
  name_zh      text,
  description  text,
  -- quote-line defaults, overridable per line by the advisor
  default_gst          boolean not null default true,
  default_pst          boolean not null default false,
  default_discountable boolean not null default true,
  sort_order   int     default 0,
  active       boolean not null default true,
  created_at   timestamptz default now()
);

-- ─── 5. Service prices (per fee schedule) ────────────────────────────────────
-- No row = that schedule does not offer that service.

create table if not exists cemetery.service_prices (
  fee_schedule_id text not null references cemetery.fee_schedules on delete cascade,
  service_type_id text not null references cemetery.service_types on delete cascade,
  price           numeric(10,2) not null,
  active          boolean not null default true,
  primary key (fee_schedule_id, service_type_id)
);

-- ─── 6. Property types ───────────────────────────────────────────────────────

create table if not exists cemetery.property_types (
  id          text primary key,            -- 'lawn_crypt', 'niche', 'mausoleum_crypt', …
  name        text not null,
  name_zh     text,
  sort_order  int default 0
);

-- ─── 7. Properties (interment rights) — park-specific ────────────────────────
-- Both ECF modes from the old app are preserved, but per ROW instead of per
-- sheet, so a park can mix them:
--   ecf_included = false → ecf_price becomes its own non-discountable line
--   ecf_included = true  → ECF sits inside `price`; only 90% of the line is
--                          exposed to the percentage discount (the "90/10 rule")

create table if not exists cemetery.properties (
  id                  text primary key,    -- 'p6800_0001'
  park_id             text not null references cemetery.parks on delete cascade,
  property_type_id    text references cemetery.property_types,
  section             text not null,       -- garden: 'Royal Heights Phase 2', 'Birch Estates'
  section_zh          text,
  name                text not null,
  name_zh             text,
  hmis_code           text,

  price               numeric(10,2) not null,
  ecf_price           numeric(10,2),       -- used only when ecf_included = false
  ecf_included        boolean not null default false,

  -- reference / rule fields (see blueprint for which of these become enforced)
  marker_style        text,                -- lawn crypts: 'Upright' | 'Flat' | 'Estate'
  marker_type_allowed text,                -- 'Crypt Plate' | 'Niche Plate' | 'Flat' | 'Flat Only' | 'N/A'
  interment_category  text,                -- 'Full Burial or Cremation' | 'Cremation Only'
  interment_rights    int,                 -- capacity
  flat_marker_codes   text,                -- free text, e.g. 'S– L,M,N; D– N,O,P,Q'
  notes               text,

  default_gst          boolean not null default true,
  default_pst          boolean not null default false,
  default_discountable boolean not null default true,

  sort_order          int     default 0,
  active              boolean not null default true,
  created_at          timestamptz default now()
);

create index if not exists properties_park_idx on cemetery.properties (park_id, active);

-- ─── 8. Product categories ───────────────────────────────────────────────────
-- Also carries the LABELS for the automatic fee lines, which in the old app
-- were read out of per-row columns (INSTALL-NAME, ECF NAME, BASE-NAME).
-- Eight rows here instead of the same strings repeated across ~500 product
-- rows. The granite-base label is composed as:
--     "<base_size> <base_label_suffix>"   e.g. '60" x 20" Marker Granite Base'

create table if not exists cemetery.product_categories (
  id                   text primary key,   -- 'marker_flat', 'vase', 'urn', …
  name                 text not null,
  name_zh              text,
  install_label        text,               -- 'Marker Installation Fee'
  install_label_zh     text,               -- '墓碑安裝費'
  ecf_label            text,               -- 'Marker ECF'
  ecf_label_zh         text,               -- '墓碑保養費'
  base_label_suffix    text,               -- 'Marker Granite Base'
  base_label_suffix_zh text,               -- '墓碑石底座'
  sort_order           int default 0
);

-- ─── 9. Products (shared catalogue) ──────────────────────────────────────────
-- Specs are explicit nullable columns rather than a jsonb blob, on purpose:
-- this schema exists to get AWAY from opaque blobs, and these columns get read
-- in the Supabase table editor.

create table if not exists cemetery.products (
  id            text primary key,          -- 'mkf0001', 'urn0001'
  category_id   text references cemetery.product_categories,
  hmis_code     text,                      -- NOT unique: HMIS is a price-band code
  name          text not null,
  name_zh       text,
  description   text,

  -- specs (which apply depends on the category)
  series        text,                      -- 'Expressions' | 'Classic' | 'OBCO' | …
  model         text,                      -- upright marker model: '197A', 'AS8001'
  variant       text,                      -- 'Single' | 'Companion' | 'Burial' | 'Urn'
  size          text,                      -- marker size / tablet dimensions
  base_size     text,                      -- granite base size
  color         text,                      -- 'Mahogany/Dark Grey', …
  dimensions    text,                      -- vault outside dimensions
  vase_included boolean,
  vase_count    int,
  catalog_page  text,                      -- urns: funeral urn price list page ref
  image_url     text,                      -- shared across parks, like casket_catalog

  -- which memorial-installation service this product corresponds to.
  -- Recorded so install amounts can be reconciled against the fee schedule
  -- (see the mismatch view at the bottom). The amount actually charged lives
  -- on park_products.install_price, so nothing re-prices itself silently.
  install_service_type_id text references cemetery.service_types,

  notes         text,
  sort_order    int     default 0,
  active        boolean not null default true,
  created_at    timestamptz default now()
);

create index if not exists products_category_idx on cemetery.products (category_id, active);

-- ─── 10. Park products (availability + per-park pricing and fees) ────────────
-- No row = that park does not sell that product.
-- A NULL or 0 fee produces no quote line.

create table if not exists cemetery.park_products (
  park_id       text not null references cemetery.parks   on delete cascade,
  product_id    text not null references cemetery.products on delete cascade,
  price         numeric(10,2) not null,    -- bronze price / unit price / basic price
  base_price    numeric(10,2),             -- granite base (flat markers)
  ecf_price     numeric(10,2),             -- per-product endowment care (10 / 2 / null)
  install_price numeric(10,2),             -- memorial installation
  sort_order    int     default 0,
  active        boolean not null default true,
  primary key (park_id, product_id)
);

-- ─── 11. Quotes ──────────────────────────────────────────────────────────────
-- Real rows, not a jsonb blob: so quotes can be filtered by park and advisor,
-- linked to a customer, and reported on. Line items still snapshot name and
-- price, so changing a price never alters a saved quote.

create table if not exists cemetery.quotes (
  id            uuid primary key default gen_random_uuid(),
  park_id       text references cemetery.parks,
  user_id       uuid references auth.users on delete cascade,
  contact_id    uuid,                      -- shared customers, wired up later
  quote_number  text,

  client_name   text,
  client_email  text,
  client_phone  text,

  advisor_name  text,
  advisor_email text,
  advisor_phone text,

  -- discount / waive
  discount_percent       numeric(6,3)  not null default 0,
  manual_discount_amount numeric(10,2) not null default 0,
  manual_discount_name   text default 'Miscellaneous Waived',

  -- tax
  gst_rate      numeric(5,4)  not null default 0.05,
  pst_rate      numeric(5,4)  not null default 0.07,
  gst_total     numeric(10,2) not null default 0,
  pst_total     numeric(10,2) not null default 0,

  subtotal      numeric(10,2) not null default 0,
  grand_total   numeric(10,2) not null default 0,

  -- payment plan
  is_monthly_payment_enabled boolean       not null default false,
  deposit_amount             numeric(10,2) not null default 0,
  interest_rate              numeric(6,3)  not null default 0,
  payment_months             int           not null default 60,
  monthly_payment_amount     numeric(10,2),

  is_chinese_enabled boolean not null default false,
  terms         text,
  notes         text,
  image_url     text,
  image_height  int,

  status        text not null default 'draft',   -- 'draft' | 'final'
  is_template   boolean not null default false,
  template_name text,

  created_at    timestamptz default now(),
  updated_at    timestamptz default now()
);

create index if not exists quotes_user_idx on cemetery.quotes (user_id, updated_at desc);
create index if not exists quotes_park_idx on cemetery.quotes (park_id);

-- ─── 12. Quote line items ────────────────────────────────────────────────────
-- `parent_item_id` links an automatic fee line to the product line that
-- produced it, so removing a marker can remove its base / install / ECF lines.
-- In the old app those were independent lines with no relationship.

create table if not exists cemetery.quote_items (
  id              uuid primary key default gen_random_uuid(),
  quote_id        uuid not null references cemetery.quotes on delete cascade,
  parent_item_id  uuid references cemetery.quote_items on delete cascade,

  -- snapshot
  name            text not null,
  name_zh         text,
  hmis_code       text,
  unit_price      numeric(10,2) not null default 0,
  quantity        int           not null default 1,
  line_total      numeric(10,2) not null default 0,

  section         text not null default 'Merchandise and Services',
                  -- 'Property' | 'Merchandise and Services'

  -- per-line flags, all advisor-editable
  is_gst          boolean not null default true,
  is_pst          boolean not null default false,
  is_discountable boolean not null default true,
  is_waived       boolean not null default false,
  ecf_included    boolean not null default false,   -- drives the 90/10 split

  -- provenance (all nullable; a custom line has none)
  source_kind     text,      -- 'property'|'product'|'service'|'fee_install'|'fee_ecf'|'fee_base'|'custom'
  property_id     text references cemetery.properties,
  product_id      text references cemetery.products,
  service_type_id text references cemetery.service_types,

  sort_order      int default 0,
  created_at      timestamptz default now()
);

create index if not exists quote_items_quote_idx on cemetery.quote_items (quote_id, sort_order);

-- ─── 13. updated_at trigger ──────────────────────────────────────────────────

create or replace function cemetery.touch_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists cemetery_quotes_updated_at on cemetery.quotes;
create trigger cemetery_quotes_updated_at
  before update on cemetery.quotes
  for each row execute function cemetery.touch_updated_at();

-- ─── 14. Row Level Security ──────────────────────────────────────────────────
-- Catalogue: readable by any signed-in advisor, not writable from the client.
-- Price changes go through SQL you run here, same as the funeral portal.
-- Quotes: an advisor sees and edits only their own.

alter table cemetery.fee_schedules     enable row level security;
alter table cemetery.parks             enable row level security;
alter table cemetery.service_categories enable row level security;
alter table cemetery.service_types     enable row level security;
alter table cemetery.service_prices    enable row level security;
alter table cemetery.property_types    enable row level security;
alter table cemetery.properties        enable row level security;
alter table cemetery.product_categories enable row level security;
alter table cemetery.products          enable row level security;
alter table cemetery.park_products     enable row level security;
alter table cemetery.quotes            enable row level security;
alter table cemetery.quote_items       enable row level security;

do $$
declare t text;
begin
  foreach t in array array[
    'fee_schedules','parks','service_categories','service_types','service_prices',
    'property_types','properties','product_categories','products','park_products'
  ] loop
    execute format('drop policy if exists cem_read on cemetery.%I', t);
    execute format(
      'create policy cem_read on cemetery.%I for select to authenticated using (true)', t);
  end loop;
end $$;

drop policy if exists cem_quotes_own on cemetery.quotes;
create policy cem_quotes_own on cemetery.quotes
  for all to authenticated
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

drop policy if exists cem_quote_items_own on cemetery.quote_items;
create policy cem_quote_items_own on cemetery.quote_items
  for all to authenticated
  using (exists (
    select 1 from cemetery.quotes q
    where q.id = quote_items.quote_id and q.user_id = auth.uid()))
  with check (exists (
    select 1 from cemetery.quotes q
    where q.id = quote_items.quote_id and q.user_id = auth.uid()));

-- ─── 15. Expose the schema to the API ────────────────────────────────────────
-- Required for supabase.schema('cemetery') to work from the browser.
-- Supabase also needs 'cemetery' added under
--   Settings → API → Exposed schemas
-- (or Data API → Extra search path, depending on dashboard version).

grant usage on schema cemetery to anon, authenticated, service_role;
grant select on all tables in schema cemetery to anon, authenticated;
grant all    on all tables in schema cemetery to service_role;
alter default privileges in schema cemetery
  grant select on tables to anon, authenticated;
alter default privileges in schema cemetery
  grant all on tables to service_role;

-- ─── 16. Install-fee reconciliation view ─────────────────────────────────────
-- The amount charged lives on park_products.install_price so nothing
-- re-prices itself behind your back. This view shows where a product's stored
-- install price has drifted from the fee schedule of the park selling it, so a
-- schedule change can be applied deliberately.

create or replace view cemetery.install_price_mismatches as
select
  pp.park_id,
  pk.name              as park_name,
  p.id                 as product_id,
  p.name               as product_name,
  st.name              as install_service,
  pp.install_price     as charged_now,
  sp.price             as fee_schedule_price,
  sp.price - pp.install_price as difference
from cemetery.park_products pp
join cemetery.products      p  on p.id  = pp.product_id
join cemetery.parks         pk on pk.id = pp.park_id
join cemetery.service_types st on st.id = p.install_service_type_id
join cemetery.service_prices sp
  on sp.service_type_id = st.id
 and sp.fee_schedule_id = pk.fee_schedule_id
where coalesce(pp.install_price, 0) <> sp.price;
