-- Add description column to certificates table
ALTER TABLE public.certificates ADD COLUMN IF NOT EXISTS description text;
