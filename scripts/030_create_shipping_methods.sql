-- Create shipping methods table (Standard, Express, etc.)
create table if not exists public.shipping_methods (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  code text not null unique, -- e.g., 'standard', 'express', 'overnight'
  delivery_time_min integer, -- minimum delivery days
  delivery_time_max integer, -- maximum delivery days
  is_active boolean default true,
  sort_order integer default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  
  constraint delivery_time_check check (
    delivery_time_max >= delivery_time_min and 
    delivery_time_min >= 0
  )
);

-- Enable RLS
alter table public.shipping_methods enable row level security;

-- RLS Policies for shipping methods
create policy "shipping_methods_select_all"
  on public.shipping_methods for select
  using (is_active = true or exists (
    select 1 from public.profiles 
    where id = auth.uid() and role in ('admin', 'super_admin')
  ));

create policy "shipping_methods_insert_admin"
  on public.shipping_methods for insert
  with check (exists (
    select 1 from public.profiles 
    where id = auth.uid() and role in ('admin', 'super_admin')
  ));

create policy "shipping_methods_update_admin"
  on public.shipping_methods for update
  using (exists (
    select 1 from public.profiles 
    where id = auth.uid() and role in ('admin', 'super_admin')
  ));

create policy "shipping_methods_delete_admin"
  on public.shipping_methods for delete
  using (exists (
    select 1 from public.profiles 
    where id = auth.uid() and role in ('admin', 'super_admin')
  ));

-- Create indexes
create index if not exists idx_shipping_methods_active on public.shipping_methods(is_active);
create index if not exists idx_shipping_methods_code on public.shipping_methods(code);
create index if not exists idx_shipping_methods_sort on public.shipping_methods(sort_order);
