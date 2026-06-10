-- Chinese name translations for service items, keyed by English item name.
-- One row covers every item across all funeral homes that share the same name.
-- Safe to re-run: CREATE TABLE IF NOT EXISTS + INSERT ... ON CONFLICT DO UPDATE.

CREATE TABLE IF NOT EXISTS item_name_translations (
  item_name  text PRIMARY KEY,
  name_zh    text NOT NULL,
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE item_name_translations ENABLE ROW LEVEL SECURITY;

-- Anyone can read (needed for share links / public quote views)
CREATE POLICY "public_read" ON item_name_translations
  FOR SELECT USING (true);

-- Only logged-in staff can insert / update
CREATE POLICY "auth_write" ON item_name_translations
  FOR ALL TO authenticated
  USING (true) WITH CHECK (true);

-- ─── Translations ─────────────────────────────────────────────────────────────
-- Fill in name_zh values before running, or add them later via:
--   INSERT INTO item_name_translations (item_name, name_zh) VALUES (...)
--   ON CONFLICT (item_name) DO UPDATE SET name_zh = EXCLUDED.name_zh;
