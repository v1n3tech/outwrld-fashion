-- Create shipping rates table with dynamic pricing similar to Bolt's approach
create table if not exists public.shipping_rates (
  id uuid primary key default gen_random_uuid(),
  zone_id uuid not null references public.shipping_zones(id) on delete cascade,
  method_id uuid not null references public.shipping_methods(id) on delete cascade,
  
  -- Base pricing
  base_rate decimal(10,2) not null check (base_rate >= 0),
  free_shipping_threshold decimal(10,2), -- Free shipping over this amount
  
  -- Weight-based pricing (similar to Bolt's dimensional weight)
  weight_rate decimal(10,2) default 0 check (weight_rate >= 0), -- per kg
  weight_threshold decimal(8,2) default 0, -- free weight allowance in kg
  
  -- Dimensional weight pricing
  dimensional_factor decimal(8,4) default 5000, -- kg per cubic meter (industry standard)
  use_dimensional_weight boolean default true,
  
  -- Distance-based multipliers (for future expansion)
  distance_multiplier decimal(4,2) default 1.0 check (distance_multiplier > 0),
  
  -- Surge pricing (similar to Bolt's dynamic pricing)
  surge_multiplier decimal(4,2) default 1.0 check (surge_multiplier > 0),
  surge_active boolean default false,
  surge_start_time timestamptz,
  surge_end_time timestamptz,
  
  -- Conditions
  min_order_value decimal(10,2) default 0,
  max_order_value decimal(10,2),
  max_weight decimal(8,2), -- maximum weight for this rate
  
  is_active boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  
  constraint order_value_check check (
    max_order_value is null or max_order_value >= min_order_value
  ),
  constraint surge_time_check check (
    (surge_start_time is null and surge_end_time is null) or
    (surge_start_time is not null and surge_end_time is not null and surge_end_time > surge_start_time)
  ),
  
  -- Unique constraint to prevent duplicate rates
  unique(zone_id, method_id)
);

-- Enable RLS
alter table public.shipping_rates enable row level security;

-- RLS Policies for shipping rates
create policy "shipping_rates_select_all"
  on public.shipping_rates for select
  using (is_active = true or exists (
    select 1 from public.profiles 
    where id = auth.uid() and role in ('admin', 'super_admin')
  ));

create policy "shipping_rates_insert_admin"
  on public.shipping_rates for insert
  with check (exists (
    select 1 from public.profiles 
    where id = auth.uid() and role in ('admin', 'super_admin')
  ));

create policy "shipping_rates_update_admin"
  on public.shipping_rates for update
  using (exists (
    select 1 from public.profiles 
    where id = auth.uid() and role in ('admin', 'super_admin')
  ));

create policy "shipping_rates_delete_admin"
  on public.shipping_rates for delete
  using (exists (
    select 1 from public.profiles 
    where id = auth.uid() and role in ('admin', 'super_admin')
  ));

-- Create indexes for performance
create index if not exists idx_shipping_rates_zone_method on public.shipping_rates(zone_id, method_id);
create index if not exists idx_shipping_rates_active on public.shipping_rates(is_active);
create index if not exists idx_shipping_rates_threshold on public.shipping_rates(free_shipping_threshold);
create index if not exists idx_shipping_rates_surge on public.shipping_rates(surge_active, surge_start_time, surge_end_time);
