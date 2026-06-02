-- Add per-item default tax/discount overrides to service_items
-- Safe to re-run: IF NOT EXISTS guards each column
ALTER TABLE service_items
  ADD COLUMN IF NOT EXISTS default_gst     boolean NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS default_pst     boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS default_no_disc boolean NOT NULL DEFAULT false;

-- Insert "Journey Home Travel Protection" in Transportation category
-- ID is built as 'si-jhtps-<funeral_home_id>' so it is unique per funeral home
-- ON CONFLICT DO NOTHING makes this safe to re-run
INSERT INTO service_items (id, name, price, category_id, funeral_home_id, default_gst, default_pst, default_no_disc)
SELECT
  'si-jhtps-' || fh.id::text,
  'Journey Home Travel Protection',
  595.00,
  sc.id,
  fh.id,
  false,   -- Exempt GST
  false,   -- Exempt PST
  true     -- No Discount
FROM service_categories sc
CROSS JOIN funeral_homes fh
WHERE sc.name ILIKE '%transport%'
ON CONFLICT (id) DO NOTHING;
