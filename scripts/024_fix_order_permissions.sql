-- Fix order permissions by simplifying RLS policies to avoid nested profile queries during insert

-- Drop existing problematic policies
drop policy if exists "order_items_insert_via_order" on public.order_items;
drop policy if exists "orders_insert_own" on public.orders;

-- Create simpler insert policies that don't cause permission issues
create policy "orders_insert_authenticated"
  on public.orders for insert
  with check (auth.uid() is not null);

create policy "order_items_insert_authenticated"
  on public.order_items for insert
  with check (
    auth.uid() is not null and
    exists (
      select 1 from public.orders 
      where id = order_id and user_id = auth.uid()
    )
  );

-- Grant necessary permissions to authenticated users
grant insert on public.orders to authenticated;
grant insert on public.order_items to authenticated;
grant select on public.orders to authenticated;
grant select on public.order_items to authenticated;
