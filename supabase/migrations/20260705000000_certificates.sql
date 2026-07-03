-- Create certificates table
CREATE TABLE IF NOT EXISTS public.certificates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  candidate_name text NOT NULL,
  program_name text NOT NULL,
  certificate_type text NOT NULL, -- 'project_completion', 'internship_completion', 'internship_participation'
  issue_date date NOT NULL DEFAULT CURRENT_DATE,
  certificate_id text NOT NULL UNIQUE, -- e.g., SCX-2026-0001
  recipient_email text,
  logo_url text,
  description text,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.certificates ENABLE ROW LEVEL SECURITY;

-- Allow anonymous read access (so anyone scanning the QR can verify)
CREATE POLICY "Allow anonymous read access on certificates"
ON public.certificates
FOR SELECT
TO anon, authenticated
USING (true);

-- Allow full access to authenticated admin users
CREATE POLICY "Allow full admin access on certificates"
ON public.certificates
FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);
