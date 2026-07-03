-- Add internship program columns to jobs table
ALTER TABLE public.jobs
ADD COLUMN IF NOT EXISTS is_internship_program boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS program_mentorship_price numeric,
ADD COLUMN IF NOT EXISTS program_mentorship_features text[],
ADD COLUMN IF NOT EXISTS program_hybrid_price numeric,
ADD COLUMN IF NOT EXISTS program_hybrid_features text[],
ADD COLUMN IF NOT EXISTS program_show_mentorship boolean DEFAULT true,
ADD COLUMN IF NOT EXISTS program_show_hybrid boolean DEFAULT true;
