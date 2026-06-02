-- Stores generated comparison HTML for shareable links
CREATE TABLE IF NOT EXISTS comparison_shares (
  id         uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  html       text        NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE comparison_shares ENABLE ROW LEVEL SECURITY;

-- Anyone with the link can view (no auth required)
CREATE POLICY "public_read" ON comparison_shares
  FOR SELECT USING (true);

-- Only logged-in staff can create shares
CREATE POLICY "auth_insert" ON comparison_shares
  FOR INSERT TO authenticated
  WITH CHECK (true);
