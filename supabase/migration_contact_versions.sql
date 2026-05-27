-- Add contact_id to quotes
ALTER TABLE quotes ADD COLUMN IF NOT EXISTS contact_id uuid;

-- Each existing quote gets its own unique contact_id (so they don't get grouped accidentally)
UPDATE quotes SET contact_id = gen_random_uuid() WHERE contact_id IS NULL;
