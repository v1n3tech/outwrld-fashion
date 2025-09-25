-- Add shipping method and zone tracking to orders
alter table public.orders 
add column if not exists shipping_zone_id uuid references public.shipping_zones(id),
add column if not exists shipping_method_id uuid references public.shipping_methods(id),
add column if not exists shipping_calculation_id uuid references public.shipping_calculations(id);

-- Create index for performance
create index if not exists idx_orders_shipping_zone on public.orders(shipping_zone_id);
create index if not exists idx_orders_shipping_method on public.orders(shipping_method_id);
