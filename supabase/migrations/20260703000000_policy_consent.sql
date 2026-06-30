-- 1. Alter profiles table to support consent tracking
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS terms_accepted boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS terms_accepted_at timestamptz,
ADD COLUMN IF NOT EXISTS privacy_accepted boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS privacy_accepted_at timestamptz,
ADD COLUMN IF NOT EXISTS cookie_accepted boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS cookie_accepted_at timestamptz,
ADD COLUMN IF NOT EXISTS policy_version text DEFAULT '1.0';

-- 2. Create anonymous consents table for pre-login tracking
CREATE TABLE IF NOT EXISTS public.anonymous_consents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  device_id text NOT NULL,
  user_id uuid REFERENCES public.profiles(id) ON DELETE SET NULL,  -- nullable, linked upon signup/login
  policy_type text NOT NULL CHECK (policy_type IN ('cookie_policy')),
  policy_version text DEFAULT '1.0',
  accepted_at timestamptz DEFAULT now(),
  ip_address text,
  user_agent text
);

-- 3. Create index for faster device_id lookups
CREATE INDEX IF NOT EXISTS idx_anonymous_consents_device_id ON public.anonymous_consents(device_id);

-- 4. Enable Row Level Security (RLS)
ALTER TABLE public.anonymous_consents ENABLE ROW LEVEL SECURITY;

-- 5. Set up RLS policies on anonymous_consents
-- Policy A: Allow anonymous inserts (no auth required)
CREATE POLICY "Allow anonymous inserts into consents" 
ON public.anonymous_consents 
FOR INSERT 
TO anon, authenticated
WITH CHECK (true);

-- Policy B: Allow admins to select/read all consents
CREATE POLICY "Allow admins select consents" 
ON public.anonymous_consents 
FOR SELECT 
TO authenticated
USING (public.is_admin());

-- Policy C: Allow users to select their own consents
CREATE POLICY "Allow users select own consents" 
ON public.anonymous_consents 
FOR SELECT 
TO authenticated
USING (auth.uid() = user_id);

-- Policy D: Allow updating consents to link user_id
CREATE POLICY "Allow linking user_id to consents" 
ON public.anonymous_consents 
FOR UPDATE 
TO anon, authenticated
USING (user_id IS NULL)
WITH CHECK (user_id = auth.uid());

-- 6. Update trigger function to handle consent tracking on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
begin
  insert into public.profiles (
    id, 
    full_name, 
    role, 
    email,
    terms_accepted,
    terms_accepted_at,
    privacy_accepted,
    privacy_accepted_at,
    policy_version
  )
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name', 'New Candidate'),
    'job_seeker',
    new.email,
    coalesce((new.raw_user_meta_data->>'terms_accepted')::boolean, false),
    case when (new.raw_user_meta_data->>'terms_accepted')::boolean = true then now() else null end,
    coalesce((new.raw_user_meta_data->>'privacy_accepted')::boolean, false),
    case when (new.raw_user_meta_data->>'privacy_accepted')::boolean = true then now() else null end,
    coalesce(new.raw_user_meta_data->>'policy_version', '1.0')
  );
  return new;
end;
$$ language plpgsql security definer;
