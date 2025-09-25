-- FINAL FIX for "permission denied for table users" error
-- This script ensures all RLS policies use only the profiles table

-- Step 1: Drop the problematic is_admin_user function that queries auth.users
DROP FUNCTION IF EXISTS public.is_admin_user();

-- Step 2: Create a new admin check function that only uses profiles table
CREATE OR REPLACE FUNCTION public.is_admin_user()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  -- Check admin status using only the profiles table
  -- This completely avoids the "permission denied for table users" error
  SELECT EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() 
    AND role IN ('admin', 'super_admin')
  );
$$;

-- Step 3: Grant necessary permissions to avoid any permission issues
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT SELECT ON public.profiles TO authenticated;
GRANT SELECT ON public.categories TO anon, authenticated;
GRANT SELECT ON public.products TO anon, authenticated;
GRANT SELECT ON public.product_variants TO anon, authenticated;
GRANT SELECT ON public.product_images TO anon, authenticated;
GRANT SELECT ON public.cart_items TO authenticated;
GRANT SELECT ON public.orders TO authenticated;
GRANT SELECT ON public.order_items TO authenticated;

-- Step 4: Ensure all tables have proper RLS policies without auth.users references
-- Categories policies
DROP POLICY IF EXISTS "categories_public_read" ON public.categories;
DROP POLICY IF EXISTS "categories_admin_access" ON public.categories;

CREATE POLICY "categories_public_read"
  ON public.categories FOR SELECT
  USING (is_active = true);

CREATE POLICY "categories_admin_access"
  ON public.categories FOR ALL
  USING (public.is_admin_user())
  WITH CHECK (public.is_admin_user());

-- Products policies  
DROP POLICY IF EXISTS "products_public_read" ON public.products;
DROP POLICY IF EXISTS "products_admin_access" ON public.products;

CREATE POLICY "products_public_read"
  ON public.products FOR SELECT
  USING (is_active = true);

CREATE POLICY "products_admin_access"
  ON public.products FOR ALL
  USING (public.is_admin_user())
  WITH CHECK (public.is_admin_user());

-- Orders policies
DROP POLICY IF EXISTS "orders_user_access" ON public.orders;
DROP POLICY IF EXISTS "orders_admin_access" ON public.orders;

CREATE POLICY "orders_user_access"
  ON public.orders FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "orders_admin_access"
  ON public.orders FOR ALL
  USING (public.is_admin_user())
  WITH CHECK (public.is_admin_user());

-- Cart items policies
DROP POLICY IF EXISTS "cart_items_user_access" ON public.cart_items;

CREATE POLICY "cart_items_user_access"
  ON public.cart_items FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Step 5: Enable RLS on all tables
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cart_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
