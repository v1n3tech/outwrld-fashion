-- Add shipping method tracking to orders table
alter table public.orders 
add column if not exists shipping_zone_id uuid references public.shipping_zones(id),
add column if not exists shipping_method_id uuid references public.shipping_methods(id),
add column if not exists shipping_rate_id uuid references public.shipping_rates(id),
add column if not exists shipping_calculation_id uuid references public.shipping_calculations(id);

-- Create indexes for the new foreign keys
create index if not exists idx_orders_shipping_zone on public.orders(shipping_zone_id);
create index if not exists idx_orders_shipping_method on public.orders(shipping_method_id);
create index if not exists idx_orders_shipping_rate on public.orders(shipping_rate_id);
create index if not exists idx_orders_shipping_calculation on public.orders(shipping_calculation_id);
