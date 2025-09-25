-- Create product images table
create table if not exists public.product_images (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  variant_id uuid references public.product_variants(id) on delete cascade,
  image_url text not null,
  alt_text text,
  position integer default 0,
  is_primary boolean default false,
  created_at timestamptz default now()
);

-- Enable RLS
alter table public.product_images enable row level security;

-- RLS Policies for product images
create policy "product_images_select_all"
  on public.product_images for select
  using (true);

create policy "product_images_insert_admin"
  on public.product_images for insert
  with check (exists (
    select 1 from public.profiles 
    where id = auth.uid() and role in ('admin', 'super_admin')
  ));

create policy "product_images_update_admin"
  on public.product_images for update
  using (exists (
    select 1 from public.profiles 
    where id = auth.uid() and role in ('admin', 'super_admin')
  ));

create policy "product_images_delete_admin"
  on public.product_images for delete
  using (exists (
    select 1 from public.profiles 
    where id = auth.uid() and role in ('admin', 'super_admin')
  ));
