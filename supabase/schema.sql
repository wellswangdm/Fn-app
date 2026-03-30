-- ============================================================
-- Funeral Quote Calculator - Supabase Schema
-- Run this in your Supabase SQL Editor
-- ============================================================

-- Funeral homes
CREATE TABLE funeral_homes (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name        TEXT NOT NULL,
  address     TEXT,
  phone       TEXT,
  website     TEXT,
  managing_director TEXT,
  tax_rate    NUMERIC(5,4) NOT NULL DEFAULT 0.05, -- BC GST 5%
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- Service categories (e.g. Transportation, Facilities, etc.)
CREATE TABLE service_categories (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name        TEXT NOT NULL,
  sort_order  INTEGER DEFAULT 0
);

-- Individual service/merchandise items per funeral home
CREATE TABLE service_items (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  funeral_home_id UUID REFERENCES funeral_homes(id) ON DELETE CASCADE,
  category_id     UUID REFERENCES service_categories(id),
  item_code       TEXT,
  name            TEXT NOT NULL,
  description     TEXT,
  price           NUMERIC(10,2),          -- null if cash advance / as-selected
  price_min       NUMERIC(10,2),          -- for range prices
  price_max       NUMERIC(10,2),          -- for range prices
  is_cash_advance BOOLEAN DEFAULT FALSE,  -- "As Selected" / variable pricing
  is_taxable      BOOLEAN DEFAULT TRUE,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- Predefined packages (Full Service, No Service, etc.)
CREATE TABLE packages (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  funeral_home_id UUID REFERENCES funeral_homes(id) ON DELETE CASCADE,
  name            TEXT NOT NULL,
  description     TEXT,
  total_price     NUMERIC(10,2),
  sort_order      INTEGER DEFAULT 0,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- Line items belonging to a package
CREATE TABLE package_items (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  package_id      UUID REFERENCES packages(id) ON DELETE CASCADE,
  service_item_id UUID REFERENCES service_items(id) ON DELETE CASCADE,
  quantity        INTEGER DEFAULT 1
);

-- Quotes
CREATE TABLE quotes (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  funeral_home_id UUID REFERENCES funeral_homes(id),
  package_id      UUID REFERENCES packages(id),
  -- People
  customer_name   TEXT,
  customer_email  TEXT,
  customer_phone  TEXT,
  deceased_name   TEXT,
  -- Financial
  subtotal        NUMERIC(10,2) DEFAULT 0,
  discount_type   TEXT CHECK (discount_type IN ('percentage','flat') OR discount_type IS NULL),
  discount_value  NUMERIC(10,2) DEFAULT 0,
  discount_amount NUMERIC(10,2) DEFAULT 0,
  tax_rate        NUMERIC(5,4) DEFAULT 0.05,
  tax_amount      NUMERIC(10,2) DEFAULT 0,
  total           NUMERIC(10,2) DEFAULT 0,
  -- Meta
  status          TEXT DEFAULT 'draft' CHECK (status IN ('draft','finalized','accepted')),
  notes           TEXT,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

-- Quote line items (price snapshot at time of quoting)
CREATE TABLE quote_items (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  quote_id        UUID REFERENCES quotes(id) ON DELETE CASCADE,
  service_item_id UUID REFERENCES service_items(id),
  name            TEXT NOT NULL,     -- snapshot
  price           NUMERIC(10,2) NOT NULL DEFAULT 0,  -- snapshot
  quantity        INTEGER DEFAULT 1,
  is_from_package BOOLEAN DEFAULT FALSE,
  notes           TEXT,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- Auto-update updated_at on quotes
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER quotes_updated_at
  BEFORE UPDATE ON quotes
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================================
-- Row Level Security (optional — enable if using auth)
-- For now, allow all access (single-user / internal tool)
-- ============================================================
ALTER TABLE funeral_homes     ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_items     ENABLE ROW LEVEL SECURITY;
ALTER TABLE packages          ENABLE ROW LEVEL SECURITY;
ALTER TABLE package_items     ENABLE ROW LEVEL SECURITY;
ALTER TABLE quotes            ENABLE ROW LEVEL SECURITY;
ALTER TABLE quote_items       ENABLE ROW LEVEL SECURITY;

-- Allow anon full access (internal tool — tighten later with auth)
CREATE POLICY "allow_all" ON funeral_homes     FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "allow_all" ON service_categories FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "allow_all" ON service_items     FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "allow_all" ON packages          FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "allow_all" ON package_items     FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "allow_all" ON quotes            FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "allow_all" ON quote_items       FOR ALL USING (true) WITH CHECK (true);
