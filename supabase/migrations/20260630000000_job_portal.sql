-- Create custom types / check constraints
DO $$ BEGIN
    CREATE TYPE public.user_role AS ENUM ('job_seeker', 'admin', 'super_admin');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE public.job_type AS ENUM ('full_time', 'part_time', 'contract', 'internship', 'remote');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE public.experience_level AS ENUM ('entry', 'mid', 'senior', 'lead');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE public.job_status AS ENUM ('draft', 'published', 'closed', 'expired');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE public.application_status AS ENUM ('applied', 'under_review', 'shortlisted', 'interview_scheduled', 'rejected', 'hired');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE public.interview_mode AS ENUM ('online', 'in_person');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 1. Profiles Table (extends auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    phone TEXT,
    avatar_url TEXT,
    role public.user_role NOT NULL DEFAULT 'job_seeker',
    resume_url TEXT,
    headline TEXT,
    skills TEXT[] DEFAULT '{}',
    experience_years NUMERIC DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Companies Table
CREATE TABLE IF NOT EXISTS public.companies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    logo_url TEXT,
    description TEXT,
    website TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Job Categories Table
CREATE TABLE IF NOT EXISTS public.job_categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Jobs Table
CREATE TABLE IF NOT EXISTS public.jobs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    description TEXT NOT NULL,
    requirements TEXT NOT NULL,
    responsibilities TEXT,
    category_id UUID REFERENCES public.job_categories(id) ON DELETE SET NULL,
    company_id UUID REFERENCES public.companies(id) ON DELETE SET NULL,
    location TEXT NOT NULL,
    job_type public.job_type NOT NULL,
    experience_level public.experience_level NOT NULL,
    salary_min NUMERIC,
    salary_max NUMERIC,
    currency TEXT DEFAULT 'INR',
    status public.job_status NOT NULL DEFAULT 'draft',
    application_deadline DATE,
    posted_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. Applications Table
CREATE TABLE IF NOT EXISTS public.applications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    job_id UUID NOT NULL REFERENCES public.jobs(id) ON DELETE CASCADE,
    applicant_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    resume_url TEXT NOT NULL,
    cover_letter TEXT,
    expected_salary NUMERIC,
    notice_period INT, -- in days
    status public.application_status NOT NULL DEFAULT 'applied',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE (job_id, applicant_id)
);

-- 6. Application Status History Table
CREATE TABLE IF NOT EXISTS public.application_status_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    application_id UUID NOT NULL REFERENCES public.applications(id) ON DELETE CASCADE,
    old_status public.application_status,
    new_status public.application_status NOT NULL,
    changed_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    note TEXT,
    changed_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 7. Saved Jobs Table
CREATE TABLE IF NOT EXISTS public.saved_jobs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    job_id UUID NOT NULL REFERENCES public.jobs(id) ON DELETE CASCADE,
    saved_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE (user_id, job_id)
);

-- 8. Job Alerts Table
CREATE TABLE IF NOT EXISTS public.job_alerts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    keywords TEXT,
    category_id UUID REFERENCES public.job_categories(id) ON DELETE SET NULL,
    location TEXT,
    frequency TEXT NOT NULL DEFAULT 'daily' CHECK (frequency IN ('daily', 'weekly')),
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 9. Interview Schedules Table
CREATE TABLE IF NOT EXISTS public.interview_schedules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    application_id UUID NOT NULL REFERENCES public.applications(id) ON DELETE CASCADE,
    scheduled_at TIMESTAMP WITH TIME ZONE NOT NULL,
    mode public.interview_mode NOT NULL,
    location_or_link TEXT,
    notes TEXT,
    created_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- =========================================================================
-- INDEXING
-- =========================================================================
CREATE INDEX IF NOT EXISTS idx_jobs_status ON public.jobs(status);
CREATE INDEX IF NOT EXISTS idx_jobs_category ON public.jobs(category_id);
CREATE INDEX IF NOT EXISTS idx_jobs_company ON public.jobs(company_id);
CREATE INDEX IF NOT EXISTS idx_applications_job ON public.applications(job_id);
CREATE INDEX IF NOT EXISTS idx_applications_applicant ON public.applications(applicant_id);
CREATE INDEX IF NOT EXISTS idx_saved_jobs_user ON public.saved_jobs(user_id);
CREATE INDEX IF NOT EXISTS idx_job_alerts_user ON public.job_alerts(user_id);

-- =========================================================================
-- HELPER FUNCTIONS FOR SECURITY
-- =========================================================================
CREATE OR REPLACE FUNCTION public.get_my_role()
RETURNS public.user_role AS $$
  SELECT role FROM public.profiles WHERE id = auth.uid();
$$ LANGUAGE sql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role IN ('admin', 'super_admin')
  );
$$ LANGUAGE sql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.is_super_admin()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'super_admin'
  );
$$ LANGUAGE sql SECURITY DEFINER;

-- =========================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =========================================================================

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.job_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.application_status_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.saved_jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.job_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.interview_schedules ENABLE ROW LEVEL SECURITY;

-- --- Profiles Policies ---
DO $$ BEGIN
  CREATE POLICY "Allow public select profiles" ON public.profiles FOR SELECT USING (true);
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE POLICY "Allow users update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE POLICY "Allow admins update profiles" ON public.profiles FOR UPDATE USING (public.is_admin());
EXCEPTION WHEN duplicate_object THEN null; END $$;

-- --- Companies Policies ---
DO $$ BEGIN
  CREATE POLICY "Allow public read companies" ON public.companies FOR SELECT USING (true);
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE POLICY "Allow admin full CRUD companies" ON public.companies FOR ALL USING (public.is_admin());
EXCEPTION WHEN duplicate_object THEN null; END $$;

-- --- Categories Policies ---
DO $$ BEGIN
  CREATE POLICY "Allow public read categories" ON public.job_categories FOR SELECT USING (true);
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE POLICY "Allow admin full CRUD categories" ON public.job_categories FOR ALL USING (public.is_admin());
EXCEPTION WHEN duplicate_object THEN null; END $$;

-- --- Jobs Policies ---
DO $$ BEGIN
  CREATE POLICY "Allow public read published jobs" ON public.jobs FOR SELECT USING (status = 'published');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE POLICY "Allow admin read draft/closed jobs" ON public.jobs FOR SELECT USING (public.is_admin());
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE POLICY "Allow admin full CRUD jobs" ON public.jobs FOR ALL USING (public.is_admin());
EXCEPTION WHEN duplicate_object THEN null; END $$;

-- --- Applications Policies ---
DO $$ BEGIN
  CREATE POLICY "Allow user read own applications" ON public.applications FOR SELECT USING (auth.uid() = applicant_id);
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE POLICY "Allow admin read all applications" ON public.applications FOR SELECT USING (public.is_admin());
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE POLICY "Allow job seeker insert application" ON public.applications FOR INSERT WITH CHECK (
    auth.uid() = applicant_id AND 
    EXISTS (SELECT 1 FROM public.jobs WHERE id = job_id AND status = 'published')
  );
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE POLICY "Allow user update own application" ON public.applications FOR UPDATE USING (auth.uid() = applicant_id);
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE POLICY "Allow admin update status applications" ON public.applications FOR UPDATE USING (public.is_admin());
EXCEPTION WHEN duplicate_object THEN null; END $$;

-- --- Status History Policies ---
DO $$ BEGIN
  CREATE POLICY "Allow user read own status history" ON public.application_status_history FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.applications 
      WHERE id = application_id AND applicant_id = auth.uid()
    )
  );
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE POLICY "Allow admin read status history" ON public.application_status_history FOR SELECT USING (public.is_admin());
EXCEPTION WHEN duplicate_object THEN null; END $$;

-- --- Saved Jobs Policies ---
DO $$ BEGIN
  CREATE POLICY "Allow user manage saved jobs" ON public.saved_jobs FOR ALL USING (auth.uid() = user_id);
EXCEPTION WHEN duplicate_object THEN null; END $$;

-- --- Job Alerts Policies ---
DO $$ BEGIN
  CREATE POLICY "Allow user manage alerts" ON public.job_alerts FOR ALL USING (auth.uid() = user_id);
EXCEPTION WHEN duplicate_object THEN null; END $$;

-- --- Interview Schedules Policies ---
DO $$ BEGIN
  CREATE POLICY "Allow user read own interviews" ON public.interview_schedules FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.applications 
      WHERE id = application_id AND applicant_id = auth.uid()
    )
  );
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE POLICY "Allow admin CRUD interviews" ON public.interview_schedules FOR ALL USING (public.is_admin());
EXCEPTION WHEN duplicate_object THEN null; END $$;

-- =========================================================================
-- DATABASE TRIGGERS
-- =========================================================================

-- Trigger to sync auth.users with profiles on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, role)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name', 'New Candidate'),
    'job_seeker'
  ) ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Trigger to log application status changes into history
CREATE OR REPLACE FUNCTION public.log_application_status_change()
RETURNS TRIGGER AS $$
BEGIN
  IF (TG_OP = 'INSERT') THEN
    INSERT INTO public.application_status_history (application_id, old_status, new_status, changed_by, note)
    VALUES (new.id, NULL, new.status, auth.uid(), 'Application submitted');
  ELSIF (TG_OP = 'UPDATE' AND old.status <> new.status) THEN
    INSERT INTO public.application_status_history (application_id, old_status, new_status, changed_by, note)
    VALUES (new.id, old.status, new.status, auth.uid(), 'Status updated');
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_application_status_changed ON public.applications;
CREATE TRIGGER on_application_status_changed
  AFTER INSERT OR UPDATE ON public.applications
  FOR EACH ROW EXECUTE FUNCTION public.log_application_status_change();

-- =========================================================================
-- STORAGE BUCKETS SETUP & POLICIES
-- =========================================================================

-- Ensure storage buckets exist
INSERT INTO storage.buckets (id, name, public) VALUES ('resumes', 'resumes', false) ON CONFLICT DO NOTHING;
INSERT INTO storage.buckets (id, name, public) VALUES ('company-logos', 'company-logos', true) ON CONFLICT DO NOTHING;

-- RLS Policies on Storage Objects

-- Resumes Private Bucket Policies
DO $$ BEGIN
  CREATE POLICY "Allow user upload resume" ON storage.objects
    FOR INSERT WITH CHECK (
      bucket_id = 'resumes' AND 
      (storage.foldername(name))[1] = auth.uid()::text
    );
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE POLICY "Allow user read own resume" ON storage.objects
    FOR SELECT USING (
      bucket_id = 'resumes' AND 
      (storage.foldername(name))[1] = auth.uid()::text
    );
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE POLICY "Allow admins read all resumes" ON storage.objects
    FOR SELECT USING (
      bucket_id = 'resumes' AND 
      public.is_admin()
    );
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE POLICY "Allow user delete own resume" ON storage.objects
    FOR DELETE USING (
      bucket_id = 'resumes' AND 
      (storage.foldername(name))[1] = auth.uid()::text
    );
EXCEPTION WHEN duplicate_object THEN null; END $$;

-- Company Logos Public Bucket Policies
DO $$ BEGIN
  CREATE POLICY "Allow public read logos" ON storage.objects
    FOR SELECT USING (bucket_id = 'company-logos');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE POLICY "Allow admin CRUD logos" ON storage.objects
    FOR ALL USING (
      bucket_id = 'company-logos' AND 
      public.is_admin()
    );
EXCEPTION WHEN duplicate_object THEN null; END $$;
