-- Create products table
create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  description text,
  short_description text,
  category_id uuid references public.categories(id) on delete set null,
  base_price decimal(10,2) not null check (base_price >= 0),
  compare_price decimal(10,2) check (compare_price >= base_price),
  cost_price decimal(10,2) check (cost_price >= 0),
  sku text unique,
  barcode text,
  track_inventory boolean default true,
  inventory_quantity integer default 0 check (inventory_quantity >= 0),
  low_stock_threshold integer default 5,
  weight decimal(8,2),
  dimensions jsonb, -- {length, width, height}
  material text,
  care_instructions text,
  tags text[],
  seo_title text,
  seo_description text,
  is_featured boolean default false,
  is_active boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Enable RLS
alter table public.products enable row level security;

-- RLS Policies for products
create policy "products_select_active"
  on public.products for select
  using (is_active = true or exists (
    select 1 from public.profiles 
    where id = auth.uid() and role in ('admin', 'super_admin')
  ));

create policy "products_insert_admin"
  on public.products for insert
  with check (exists (
    select 1 from public.profiles 
    where id = auth.uid() and role in ('admin', 'super_admin')
  ));

create policy "products_update_admin"
  on public.products for update
  using (exists (
    select 1 from public.profiles 
    where id = auth.uid() and role in ('admin', 'super_admin')
  ));

create policy "products_delete_admin"
  on public.products for delete
  using (exists (
    select 1 from public.profiles 
    where id = auth.uid() and role in ('admin', 'super_admin')
  ));
