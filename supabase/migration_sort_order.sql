-- Add sort_order to quotes for user-defined version ordering
ALTER TABLE quotes ADD COLUMN IF NOT EXISTS sort_order integer;
