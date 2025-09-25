-- Create product variants (sizes, colors, etc.)
create table if not exists public.product_variants (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  name text not null, -- e.g., "Large / Black"
  sku text unique,
  price decimal(10,2) not null check (price >= 0),
  compare_price decimal(10,2) check (compare_price >= price),
  cost_price decimal(10,2) check (cost_price >= 0),
  inventory_quantity integer default 0 check (inventory_quantity >= 0),
  weight decimal(8,2),
  barcode text,
  position integer default 0,
  is_active boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Create variant options (size, color, etc.)
create table if not exists public.variant_options (
  id uuid primary key default gen_random_uuid(),
  variant_id uuid not null references public.product_variants(id) on delete cascade,
  option_name text not null, -- e.g., "Size", "Color"
  option_value text not null, -- e.g., "Large", "Black"
  created_at timestamptz default now()
);

-- Enable RLS
alter table public.product_variants enable row level security;
alter table public.variant_options enable row level security;

-- RLS Policies for product variants
create policy "variants_select_active"
  on public.product_variants for select
  using (is_active = true or exists (
    select 1 from public.profiles 
    where id = auth.uid() and role in ('admin', 'super_admin')
  ));

create policy "variants_insert_admin"
  on public.product_variants for insert
  with check (exists (
    select 1 from public.profiles 
    where id = auth.uid() and role in ('admin', 'super_admin')
  ));

create policy "variants_update_admin"
  on public.product_variants for update
  using (exists (
    select 1 from public.profiles 
    where id = auth.uid() and role in ('admin', 'super_admin')
  ));

create policy "variants_delete_admin"
  on public.product_variants for delete
  using (exists (
    select 1 from public.profiles 
    where id = auth.uid() and role in ('admin', 'super_admin')
  ));

-- RLS Policies for variant options
create policy "variant_options_select_all"
  on public.variant_options for select
  using (true);

create policy "variant_options_insert_admin"
  on public.variant_options for insert
  with check (exists (
    select 1 from public.profiles 
    where id = auth.uid() and role in ('admin', 'super_admin')
  ));

create policy "variant_options_update_admin"
  on public.variant_options for update
  using (exists (
    select 1 from public.profiles 
    where id = auth.uid() and role in ('admin', 'super_admin')
  ));

create policy "variant_options_delete_admin"
  on public.variant_options for delete
  using (exists (
    select 1 from public.profiles 
    where id = auth.uid() and role in ('admin', 'super_admin')
  ));
