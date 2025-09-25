-- Fix policy conflicts by properly dropping and recreating order policies

-- Drop all existing order-related policies to avoid conflicts
drop policy if exists "orders_insert_authenticated" on public.orders;
drop policy if exists "order_items_insert_authenticated" on public.order_items;
drop policy if exists "orders_insert_own" on public.orders;
drop policy if exists "order_items_insert_via_order" on public.order_items;
drop policy if exists "orders_select_own" on public.orders;
drop policy if exists "order_items_select_own" on public.order_items;

-- Create simplified policies that avoid the "permission denied for table users" error
create policy "orders_insert_simple"
  on public.orders for insert
  with check (auth.uid() = user_id);

create policy "order_items_insert_simple"
  on public.order_items for insert
  with check (
    exists (
      select 1 from public.orders 
      where id = order_id and user_id = auth.uid()
    )
  );

-- Recreate select policies
create policy "orders_select_own"
  on public.orders for select
  using (auth.uid() = user_id or is_admin_user());

create policy "order_items_select_own"
  on public.order_items for select
  using (
    exists (
      select 1 from public.orders 
      where id = order_id and (user_id = auth.uid() or is_admin_user())
    )
  );

-- Ensure proper grants
grant insert, select on public.orders to authenticated;
grant insert, select on public.order_items to authenticated;
