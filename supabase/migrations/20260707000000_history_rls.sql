-- Allow admin to select, insert, and update application status history
DROP POLICY IF EXISTS "Allow admin read status history" ON public.application_status_history;
CREATE POLICY "Allow admin read status history" ON public.application_status_history
FOR SELECT USING (
  public.is_admin() OR 
  (auth.jwt() ->> 'email' = 'scalexwebsolution@gmail.com')
);

DROP POLICY IF EXISTS "Allow admin insert status history" ON public.application_status_history;
CREATE POLICY "Allow admin insert status history" ON public.application_status_history
FOR INSERT WITH CHECK (
  public.is_admin() OR 
  (auth.jwt() ->> 'email' = 'scalexwebsolution@gmail.com')
);

DROP POLICY IF EXISTS "Allow admin update status history" ON public.application_status_history;
CREATE POLICY "Allow admin update status history" ON public.application_status_history
FOR UPDATE USING (
  public.is_admin() OR 
  (auth.jwt() ->> 'email' = 'scalexwebsolution@gmail.com')
);
