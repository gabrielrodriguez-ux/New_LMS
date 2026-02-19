-- 🚨 IMMEDIATE FIX FOR PERMISSIONS 🚨
-- This script relaxes RLS policies so you can Create/Edit/View data immediately in the Demo.

-- 1. Enable ALL access for authenticated users (for Demo purposes)
-- In production, you would check for strict roles (e.g. auth.uid() IN (SELECT id FROM users WHERE role = 'admin'))

-- Clients
DROP POLICY IF EXISTS "Users can view own client" ON public.clients;
CREATE POLICY "Enable all access for auth users" ON public.clients FOR ALL USING (auth.role() = 'authenticated');

-- Users
DROP POLICY IF EXISTS "Users can view own profile" ON public.users;
CREATE POLICY "Enable all access for auth users" ON public.users FOR ALL USING (auth.role() = 'authenticated');

-- Courses
DROP POLICY IF EXISTS "Users can view own courses" ON public.courses;
CREATE POLICY "Enable all access for auth users" ON public.courses FOR ALL USING (auth.role() = 'authenticated');

-- Modules
ALTER TABLE public.modules ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Enable all access for auth users" ON public.modules FOR ALL USING (auth.role() = 'authenticated');

-- Subscriptions
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Enable all access for auth users" ON public.subscriptions FOR ALL USING (auth.role() = 'authenticated');

-- Enrollments
DROP POLICY IF EXISTS "Users can view own enrollments" ON public.enrollments;
CREATE POLICY "Enable all access for auth users" ON public.enrollments FOR ALL USING (auth.role() = 'authenticated');

-- Fundae
ALTER TABLE public.fundae_expedients ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Enable all access for auth users" ON public.fundae_expedients FOR ALL USING (auth.role() = 'authenticated');
