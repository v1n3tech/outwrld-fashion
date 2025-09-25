-- Fix infinite recursion in RLS policies
-- The issue is that policies on profiles table are checking profiles table, creating recursion

-- First, drop all existing policies to start fresh
DROP POLICY IF EXISTS "profiles_select_own" ON public.profiles;
DROP POLICY IF EXISTS "profiles_update_own" ON public.profiles;
DROP POLICY IF EXISTS "profiles_insert_own" ON public.profiles;
DROP POLICY IF EXISTS "profiles_admin_all" ON public.profiles;

-- Create simple, non-recursive policies for profiles table
-- Users can only see and update their own profile
CREATE POLICY "profiles_select_own"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "profiles_update_own"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Allow profile creation for any authenticated user (this happens via trigger)
CREATE POLICY "profiles_insert_authenticated"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- For other tables, use a simpler admin check that doesn't reference profiles
-- Create a function to check if user is admin without recursion
CREATE OR REPLACE FUNCTION public.is_admin_user()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT (SELECT email FROM auth.users WHERE id = auth.uid()) = 'mantimdanzaki@gmail.com';
$$;

-- Update products policies to use the function instead of profiles table
DROP POLICY IF EXISTS "products_update_admin" ON public.products;
CREATE POLICY "products_update_admin"
  ON public.products FOR UPDATE
  USING (public.is_admin_user());

DROP POLICY IF EXISTS "products_insert_admin" ON public.products;
CREATE POLICY "products_insert_admin"
  ON public.products FOR INSERT
  WITH CHECK (public.is_admin_user());

DROP POLICY IF EXISTS "products_delete_admin" ON public.products;
CREATE POLICY "products_delete_admin"
  ON public.products FOR DELETE
  USING (public.is_admin_user());

-- Fix categories policies
DROP POLICY IF EXISTS "categories_admin_all" ON public.categories;
CREATE POLICY "categories_admin_all"
  ON public.categories FOR ALL
  USING (public.is_admin_user())
  WITH CHECK (public.is_admin_user());

-- Fix orders policies
DROP POLICY IF EXISTS "orders_admin_all" ON public.orders;
CREATE POLICY "orders_admin_all"
  ON public.orders FOR ALL
  USING (public.is_admin_user());

-- Users can see their own orders
CREATE POLICY "orders_select_own"
  ON public.orders FOR SELECT
  USING (auth.uid() = user_id);

-- Users can create their own orders
CREATE POLICY "orders_insert_own"
  ON public.orders FOR INSERT
  WITH CHECK (auth.uid() = user_id);
