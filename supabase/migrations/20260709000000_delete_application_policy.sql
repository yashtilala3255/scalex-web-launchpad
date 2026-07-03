-- Add RLS policy to allow admins to delete job applications
DROP POLICY IF EXISTS "Allow admin delete applications" ON public.applications;
CREATE POLICY "Allow admin delete applications" ON public.applications
  FOR DELETE USING (public.is_admin());

-- Add RLS policy to allow admins to delete candidate profiles
DROP POLICY IF EXISTS "Allow admin delete profiles" ON public.profiles;
CREATE POLICY "Allow admin delete profiles" ON public.profiles
  FOR DELETE USING (public.is_admin());
