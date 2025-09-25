-- Fix the "permission denied for table users" error during order creation
-- The issue is that is_admin_user() function is being called during INSERT operations

-- Drop the problematic policies that call is_admin_user() during INSERT
drop policy if exists "orders_insert_simple" on public.orders;
drop policy if exists "order_items_insert_simple" on public.order_items;
drop policy if exists "orders_select_own" on public.orders;
drop policy if exists "order_items_select_own" on public.order_items;

-- Create INSERT policies without admin checks (only authenticated users can insert their own orders)
create policy "orders_insert_user_only"
  on public.orders for insert
  with check (auth.uid() = user_id);

create policy "order_items_insert_user_only"
  on public.order_items for insert
  with check (
    exists (
      select 1 from public.orders 
      where id = order_id and user_id = auth.uid()
    )
  );

-- Create SELECT policies that allow admin access but don't interfere with INSERT
create policy "orders_select_user_or_admin"
  on public.orders for select
  using (
    auth.uid() = user_id 
    or 
    exists (
      select 1 from public.profiles 
      where id = auth.uid() and role = 'admin'
    )
  );

create policy "order_items_select_user_or_admin"
  on public.order_items for select
  using (
    exists (
      select 1 from public.orders 
      where id = order_id 
      and (
        user_id = auth.uid() 
        or 
        exists (
          select 1 from public.profiles 
          where id = auth.uid() and role = 'admin'
        )
      )
    )
  );

-- Ensure proper grants
grant insert, select on public.orders to authenticated;
grant insert, select on public.order_items to authenticated;
