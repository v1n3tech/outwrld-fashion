-- Added fallback RLS policies to handle edge cases where profile might not exist yet

-- Improved RLS policies with fallbacks for admin operations
DROP POLICY IF EXISTS "products_update_admin" ON public.products;
CREATE POLICY "products_update_admin"
  ON public.products FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role IN ('admin', 'super_admin')
    ) OR 
    -- Fallback: check if user email is admin email directly
    (SELECT email FROM auth.users WHERE id = auth.uid()) = 'mantimdanzaki@gmail.com'
  );

DROP POLICY IF EXISTS "products_insert_admin" ON public.products;
CREATE POLICY "products_insert_admin"
  ON public.products FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role IN ('admin', 'super_admin')
    ) OR 
    (SELECT email FROM auth.users WHERE id = auth.uid()) = 'mantimdanzaki@gmail.com'
  );

DROP POLICY IF EXISTS "products_delete_admin" ON public.products;
CREATE POLICY "products_delete_admin"
  ON public.products FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role IN ('admin', 'super_admin')
    ) OR 
    (SELECT email FROM auth.users WHERE id = auth.uid()) = 'mantimdanzaki@gmail.com'
  );

-- Apply similar fixes to other admin-only tables
DROP POLICY IF EXISTS "categories_admin_all" ON public.categories;
CREATE POLICY "categories_admin_all"
  ON public.categories FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role IN ('admin', 'super_admin')
    ) OR 
    (SELECT email FROM auth.users WHERE id = auth.uid()) = 'mantimdanzaki@gmail.com'
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role IN ('admin', 'super_admin')
    ) OR 
    (SELECT email FROM auth.users WHERE id = auth.uid()) = 'mantimdanzaki@gmail.com'
  );

DROP POLICY IF EXISTS "orders_admin_all" ON public.orders;
CREATE POLICY "orders_admin_all"
  ON public.orders FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role IN ('admin', 'super_admin')
    ) OR 
    (SELECT email FROM auth.users WHERE id = auth.uid()) = 'mantimdanzaki@gmail.com'
  );
