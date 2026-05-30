-- ─── Profiles table (run this once in Supabase SQL Editor) ──────────────────
CREATE TABLE IF NOT EXISTS profiles (
  id             uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name      text,
  phone          text,
  advisor_email  text,
  updated_at     timestamptz DEFAULT now()
);

-- Safe to re-run: add columns if table already existed without them
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS phone          text;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS advisor_email  text;

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Drop existing policies before recreating (safe to re-run)
DROP POLICY IF EXISTS "Users read own profile"   ON profiles;
DROP POLICY IF EXISTS "Users update own profile" ON profiles;
DROP POLICY IF EXISTS "Users insert own profile" ON profiles;

CREATE POLICY "Users read own profile"
  ON profiles FOR SELECT USING (id = auth.uid());

CREATE POLICY "Users update own profile"
  ON profiles FOR UPDATE USING (id = auth.uid());

CREATE POLICY "Users insert own profile"
  ON profiles FOR INSERT WITH CHECK (id = auth.uid());

-- ─── Auto-create profile row on new user signup ───────────────────────────────
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

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- ─── Backfill existing users ─────────────────────────────────────────────────
INSERT INTO profiles (id, full_name, phone)
SELECT
  id,
  COALESCE(raw_user_meta_data->>'full_name', raw_user_meta_data->>'name', ''),
  COALESCE(raw_user_meta_data->>'phone', '')
FROM auth.users
ON CONFLICT (id) DO UPDATE
  SET full_name = EXCLUDED.full_name,
      phone     = EXCLUDED.phone;
