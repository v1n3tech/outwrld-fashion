-- Create shipping calculations table to store calculated rates for orders
create table if not exists public.shipping_calculations (
  id uuid primary key default gen_random_uuid(),
  order_id uuid references public.orders(id) on delete cascade,
  session_id text, -- For guest calculations
  
  zone_id uuid not null references public.shipping_zones(id),
  method_id uuid not null references public.shipping_methods(id),
  rate_id uuid not null references public.shipping_rates(id),
  
  -- Calculation details
  subtotal decimal(10,2) not null,
  total_weight decimal(8,2) not null,
  dimensional_weight decimal(8,2),
  billable_weight decimal(8,2) not null, -- max(actual_weight, dimensional_weight)
  
  -- Rate breakdown
  base_rate decimal(10,2) not null,
  weight_charge decimal(10,2) default 0,
  surge_multiplier decimal(4,2) default 1.0,
  distance_multiplier decimal(4,2) default 1.0,
  
  -- Final calculation
  calculated_rate decimal(10,2) not null,
  is_free_shipping boolean default false,
  
  -- Metadata
  calculation_data jsonb, -- Store full calculation details
  created_at timestamptz default now(),
  
  constraint calculation_check check (
    (order_id is not null and session_id is null) or 
    (order_id is null and session_id is not null)
  )
);

-- Enable RLS
alter table public.shipping_calculations enable row level security;

-- RLS Policies for shipping calculations
create policy "shipping_calculations_select_own"
  on public.shipping_calculations for select
  using (
    exists (
      select 1 from public.orders 
      where id = order_id and (
        user_id = auth.uid() or 
        exists (
          select 1 from public.profiles 
          where id = auth.uid() and role in ('admin', 'super_admin')
        )
      )
    ) or
    exists (
      select 1 from public.profiles 
      where id = auth.uid() and role in ('admin', 'super_admin')
    )
  );

create policy "shipping_calculations_insert_own"
  on public.shipping_calculations for insert
  with check (
    exists (
      select 1 from public.orders 
      where id = order_id and (
        user_id = auth.uid() or user_id is null or
        exists (
          select 1 from public.profiles 
          where id = auth.uid() and role in ('admin', 'super_admin')
        )
      )
    ) or
    order_id is null -- Allow session-based calculations
  );

-- Create indexes
create index if not exists idx_shipping_calculations_order on public.shipping_calculations(order_id);
create index if not exists idx_shipping_calculations_session on public.shipping_calculations(session_id);
create index if not exists idx_shipping_calculations_rate on public.shipping_calculations(rate_id);
