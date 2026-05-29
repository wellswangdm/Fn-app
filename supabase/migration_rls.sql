-- ─── Step 1: Add user_id to quotes ──────────────────────────────────────────
ALTER TABLE quotes ADD COLUMN IF NOT EXISTS user_id uuid REFERENCES auth.users(id);

-- ─── Step 2: Assign existing quotes to a user (run once, replace with real ID)
-- Find your user ID in Supabase → Authentication → Users, then run:
-- UPDATE quotes SET user_id = '<your-user-uuid>' WHERE user_id IS NULL;

-- ─── Step 3: Enable RLS on quotes ────────────────────────────────────────────
ALTER TABLE quotes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users see own quotes"
  ON quotes FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Users insert own quotes"
  ON quotes FOR INSERT
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users update own quotes"
  ON quotes FOR UPDATE
  USING (user_id = auth.uid());

CREATE POLICY "Users delete own quotes"
  ON quotes FOR DELETE
  USING (user_id = auth.uid());

-- ─── Step 4: Enable RLS on quote_items (tied to parent quote ownership) ──────
ALTER TABLE quote_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users see own quote items"
  ON quote_items FOR SELECT
  USING (quote_id IN (SELECT id FROM quotes WHERE user_id = auth.uid()));

CREATE POLICY "Users insert own quote items"
  ON quote_items FOR INSERT
  WITH CHECK (quote_id IN (SELECT id FROM quotes WHERE user_id = auth.uid()));

CREATE POLICY "Users update own quote items"
  ON quote_items FOR UPDATE
  USING (quote_id IN (SELECT id FROM quotes WHERE user_id = auth.uid()));

CREATE POLICY "Users delete own quote items"
  ON quote_items FOR DELETE
  USING (quote_id IN (SELECT id FROM quotes WHERE user_id = auth.uid()));

-- ─── Step 5: Catalog tables — readable by all authenticated users ─────────────
ALTER TABLE funeral_homes      ENABLE ROW LEVEL SECURITY;
ALTER TABLE packages           ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_items      ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE caskets            ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Auth users read funeral_homes"
  ON funeral_homes FOR SELECT TO authenticated USING (true);

CREATE POLICY "Auth users read packages"
  ON packages FOR SELECT TO authenticated USING (true);

CREATE POLICY "Auth users read service_items"
  ON service_items FOR SELECT TO authenticated USING (true);

CREATE POLICY "Auth users read service_categories"
  ON service_categories FOR SELECT TO authenticated USING (true);

CREATE POLICY "Auth users read caskets"
  ON caskets FOR SELECT TO authenticated USING (true);
