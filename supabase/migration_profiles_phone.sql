-- Add phone to profiles table
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS phone text;

-- Update trigger to also capture phone from metadata
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, phone)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', ''),
    COALESCE(NEW.raw_user_meta_data->>'phone', '')
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

-- Backfill phone for existing profiles from user metadata
UPDATE profiles p
SET phone = COALESCE(u.raw_user_meta_data->>'phone', '')
FROM auth.users u
WHERE p.id = u.id AND (p.phone IS NULL OR p.phone = '');
