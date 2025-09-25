-- Create shipping zones table for regional shipping management
create table if not exists public.shipping_zones (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  countries text[] not null default '{"Nigeria"}',
  states text[], -- Nigerian states or regions
  cities text[], -- Specific cities if needed
  is_active boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Enable RLS
alter table public.shipping_zones enable row level security;

-- RLS Policies for shipping zones
create policy "shipping_zones_select_all"
  on public.shipping_zones for select
  using (is_active = true or exists (
    select 1 from public.profiles 
    where id = auth.uid() and role in ('admin', 'super_admin')
  ));

create policy "shipping_zones_insert_admin"
  on public.shipping_zones for insert
  with check (exists (
    select 1 from public.profiles 
    where id = auth.uid() and role in ('admin', 'super_admin')
  ));

create policy "shipping_zones_update_admin"
  on public.shipping_zones for update
  using (exists (
    select 1 from public.profiles 
    where id = auth.uid() and role in ('admin', 'super_admin')
  ));

create policy "shipping_zones_delete_admin"
  on public.shipping_zones for delete
  using (exists (
    select 1 from public.profiles 
    where id = auth.uid() and role in ('admin', 'super_admin')
  ));

-- Create indexes for performance
create index if not exists idx_shipping_zones_active on public.shipping_zones(is_active);
create index if not exists idx_shipping_zones_countries on public.shipping_zones using gin(countries);
create index if not exists idx_shipping_zones_states on public.shipping_zones using gin(states);
