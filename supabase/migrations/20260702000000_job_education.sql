-- Add education, role, industry, role category details, and unpaid option to jobs
ALTER TABLE public.jobs 
ADD COLUMN IF NOT EXISTS education_ug TEXT DEFAULT 'Any Graduate',
ADD COLUMN IF NOT EXISTS education_pg TEXT DEFAULT 'Any Postgraduate',
ADD COLUMN IF NOT EXISTS job_role TEXT,
ADD COLUMN IF NOT EXISTS industry_type TEXT DEFAULT 'IT Services & Consulting',
ADD COLUMN IF NOT EXISTS role_category TEXT DEFAULT 'Software Development',
ADD COLUMN IF NOT EXISTS is_unpaid BOOLEAN DEFAULT FALSE;
