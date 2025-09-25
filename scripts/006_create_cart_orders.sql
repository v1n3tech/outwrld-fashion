-- Create shopping cart table
create table if not exists public.cart_items (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  session_id text, -- For guest users
  product_id uuid not null references public.products(id) on delete cascade,
  variant_id uuid references public.product_variants(id) on delete cascade,
  quantity integer not null check (quantity > 0),
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  constraint cart_user_or_session check (
    (user_id is not null and session_id is null) or 
    (user_id is null and session_id is not null)
  )
);

-- Create orders table
create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  order_number text not null unique,
  user_id uuid references auth.users(id) on delete set null,
  email text not null,
  status text not null default 'pending' check (status in (
    'pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded'
  )),
  payment_status text not null default 'pending' check (payment_status in (
    'pending', 'paid', 'failed', 'refunded', 'partially_refunded'
  )),
  subtotal decimal(10,2) not null check (subtotal >= 0),
  tax_amount decimal(10,2) default 0 check (tax_amount >= 0),
  shipping_amount decimal(10,2) default 0 check (shipping_amount >= 0),
  discount_amount decimal(10,2) default 0 check (discount_amount >= 0),
  total_amount decimal(10,2) not null check (total_amount >= 0),
  currency text default 'NGN',
  
  -- Shipping address
  shipping_first_name text,
  shipping_last_name text,
  shipping_company text,
  shipping_address_1 text,
  shipping_address_2 text,
  shipping_city text,
  shipping_state text,
  shipping_postal_code text,
  shipping_country text default 'Nigeria',
  shipping_phone text,
  
  -- Billing address
  billing_first_name text,
  billing_last_name text,
  billing_company text,
  billing_address_1 text,
  billing_address_2 text,
  billing_city text,
  billing_state text,
  billing_postal_code text,
  billing_country text default 'Nigeria',
  billing_phone text,
  
  notes text,
  tracking_number text,
  shipped_at timestamptz,
  delivered_at timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Create order items table
create table if not exists public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  product_id uuid not null references public.products(id) on delete restrict,
  variant_id uuid references public.product_variants(id) on delete restrict,
  product_name text not null,
  variant_name text,
  sku text,
  price decimal(10,2) not null check (price >= 0),
  quantity integer not null check (quantity > 0),
  total decimal(10,2) not null check (total >= 0),
  created_at timestamptz default now()
);

-- Enable RLS
alter table public.cart_items enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;

-- RLS Policies for cart items
create policy "cart_items_select_own"
  on public.cart_items for select
  using (
    auth.uid() = user_id or 
    exists (
      select 1 from public.profiles 
      where id = auth.uid() and role in ('admin', 'super_admin')
    )
  );

create policy "cart_items_insert_own"
  on public.cart_items for insert
  with check (auth.uid() = user_id or user_id is null);

create policy "cart_items_update_own"
  on public.cart_items for update
  using (
    auth.uid() = user_id or 
    exists (
      select 1 from public.profiles 
      where id = auth.uid() and role in ('admin', 'super_admin')
    )
  );

create policy "cart_items_delete_own"
  on public.cart_items for delete
  using (
    auth.uid() = user_id or 
    exists (
      select 1 from public.profiles 
      where id = auth.uid() and role in ('admin', 'super_admin')
    )
  );

-- RLS Policies for orders
create policy "orders_select_own"
  on public.orders for select
  using (
    auth.uid() = user_id or 
    exists (
      select 1 from public.profiles 
      where id = auth.uid() and role in ('admin', 'super_admin')
    )
  );

create policy "orders_insert_own"
  on public.orders for insert
  with check (auth.uid() = user_id or user_id is null);

create policy "orders_update_admin"
  on public.orders for update
  using (
    auth.uid() = user_id or 
    exists (
      select 1 from public.profiles 
      where id = auth.uid() and role in ('admin', 'super_admin')
    )
  );

-- RLS Policies for order items
create policy "order_items_select_via_order"
  on public.order_items for select
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
    )
  );

create policy "order_items_insert_via_order"
  on public.order_items for insert
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
    )
  );
