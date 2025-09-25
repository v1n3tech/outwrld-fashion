-- FINAL FIX: Remove all references to auth.users table in RLS policies
-- Use only the profiles table for admin checks to avoid permission errors

-- Step 1: Create the correct is_admin_user function that only uses profiles table
CREATE OR REPLACE FUNCTION public.is_admin_user()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  -- Check admin status using only the profiles table
  -- This avoids the "permission denied for table users" error
  SELECT EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() 
    AND role IN ('admin', 'super_admin')
  );
$$;

-- Step 2: Drop and recreate all categories policies to ensure they're clean
DROP POLICY IF EXISTS "categories_admin_all" ON public.categories;
DROP POLICY IF EXISTS "categories_admin_access" ON public.categories;
DROP POLICY IF EXISTS "categories_public_read" ON public.categories;

-- Allow public read access to active categories
CREATE POLICY "categories_public_read"
  ON public.categories FOR SELECT
  USING (is_active = true);

-- Allow admin full access using the corrected function
CREATE POLICY "categories_admin_access"
  ON public.categories FOR ALL
  USING (public.is_admin_user())
  WITH CHECK (public.is_admin_user());

-- Step 3: Fix products policies as well
DROP POLICY IF EXISTS "products_admin_all" ON public.products;
DROP POLICY IF EXISTS "products_admin_access" ON public.products;
DROP POLICY IF EXISTS "products_public_read" ON public.products;
DROP POLICY IF EXISTS "products_update_admin" ON public.products;
DROP POLICY IF EXISTS "products_insert_admin" ON public.products;
DROP POLICY IF EXISTS "products_delete_admin" ON public.products;

-- Allow public read access to active products
CREATE POLICY "products_public_read"
  ON public.products FOR SELECT
  USING (is_active = true);

-- Allow admin full access to all products
CREATE POLICY "products_admin_access"
  ON public.products FOR ALL
  USING (public.is_admin_user())
  WITH CHECK (public.is_admin_user());

-- Step 4: Ensure profiles policies are simple and non-recursive
DROP POLICY IF EXISTS "profiles_select_own" ON public.profiles;
DROP POLICY IF EXISTS "profiles_update_own" ON public.profiles;
DROP POLICY IF EXISTS "profiles_insert_own" ON public.profiles;
DROP POLICY IF EXISTS "profiles_admin_access" ON public.profiles;

-- Users can access their own profile
CREATE POLICY "profiles_select_own"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "profiles_update_own"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "profiles_insert_own"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Step 5: Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT SELECT ON public.profiles TO authenticated;
GRANT SELECT ON public.categories TO anon, authenticated;
GRANT SELECT ON public.products TO anon, authenticated;
GRANT ALL ON public.categories TO authenticated;
GRANT ALL ON public.products TO authenticated;
