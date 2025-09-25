-- Fix checkout permission error without breaking existing functionality
-- The issue is likely in how we're querying user data during checkout

-- Ensure cart_items and orders have proper permissions for checkout
GRANT SELECT, INSERT, UPDATE, DELETE ON public.cart_items TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.orders TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.order_items TO authenticated;

-- Fix any potential issues with profiles access during checkout
GRANT SELECT ON public.profiles TO authenticated;

-- Ensure the checkout process can access necessary product data
GRANT SELECT ON public.products TO authenticated;
GRANT SELECT ON public.product_variants TO authenticated;
