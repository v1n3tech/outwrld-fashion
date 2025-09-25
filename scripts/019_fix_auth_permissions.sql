-- Fix the permission denied error for auth.users table
-- The issue is that is_admin_user() function tries to query auth.users
-- but regular users don't have permission to read from auth.users

-- Step 1: Create a simpler admin check that uses the profiles table instead
CREATE OR REPLACE FUNCTION public.is_admin_user()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  -- Check if current user has admin role in profiles table
  -- This avoids querying auth.users directly
  SELECT EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() 
    AND role IN ('admin', 'super_admin')
  );
$$;

-- Step 2: Update categories table policies to allow admin access
DROP POLICY IF EXISTS "categories_admin_access" ON public.categories;
DROP POLICY IF EXISTS "categories_public_read" ON public.categories;

-- Allow public read access to active categories
CREATE POLICY "categories_public_read"
  ON public.categories FOR SELECT
  USING (is_active = true);

-- Allow admin full access to all categories
CREATE POLICY "categories_admin_access"
  ON public.categories FOR ALL
  USING (public.is_admin_user())
  WITH CHECK (public.is_admin_user());

-- Step 3: Update products table policies to allow admin access
DROP POLICY IF EXISTS "products_admin_access" ON public.products;
DROP POLICY IF EXISTS "products_public_read" ON public.products;

-- Allow public read access to active products
CREATE POLICY "products_public_read"
  ON public.products FOR SELECT
  USING (is_active = true);

-- Allow admin full access to all products
CREATE POLICY "products_admin_access"
  ON public.products FOR ALL
  USING (public.is_admin_user())
  WITH CHECK (public.is_admin_user());

-- Step 4: Ensure RLS is enabled on all tables
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
