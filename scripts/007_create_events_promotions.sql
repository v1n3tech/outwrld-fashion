-- Create events table
create table if not exists public.events (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  description text,
  image_url text,
  event_type text not null check (event_type in ('sale', 'launch', 'collection', 'collaboration', 'other')),
  start_date timestamptz not null,
  end_date timestamptz not null,
  is_paid boolean default false,
  ticket_price decimal(10,2) check (ticket_price >= 0),
  max_attendees integer check (max_attendees > 0),
  current_attendees integer default 0 check (current_attendees >= 0),
  location text,
  is_active boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  constraint valid_date_range check (end_date > start_date)
);

-- Create discount codes table
create table if not exists public.discount_codes (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  name text not null,
  description text,
  discount_type text not null check (discount_type in ('percentage', 'fixed_amount')),
  discount_value decimal(10,2) not null check (discount_value > 0),
  minimum_order_amount decimal(10,2) default 0 check (minimum_order_amount >= 0),
  usage_limit integer check (usage_limit > 0),
  used_count integer default 0 check (used_count >= 0),
  start_date timestamptz not null,
  end_date timestamptz not null,
  is_active boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  constraint valid_discount_date_range check (end_date > start_date)
);

-- Create event attendees table
create table if not exists public.event_attendees (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references public.events(id) on delete cascade,
  user_id uuid references auth.users(id) on delete cascade,
  email text not null,
  first_name text,
  last_name text,
  phone text,
  ticket_code text unique,
  payment_status text default 'pending' check (payment_status in ('pending', 'paid', 'failed', 'refunded')),
  attended boolean default false,
  attended_at timestamptz,
  created_at timestamptz default now()
);

-- Enable RLS
alter table public.events enable row level security;
alter table public.discount_codes enable row level security;
alter table public.event_attendees enable row level security;

-- RLS Policies for events
create policy "events_select_active"
  on public.events for select
  using (
    (is_active = true and start_date <= now() and end_date >= now()) or 
    exists (
      select 1 from public.profiles 
      where id = auth.uid() and role in ('admin', 'super_admin')
    )
  );

create policy "events_insert_admin"
  on public.events for insert
  with check (exists (
    select 1 from public.profiles 
    where id = auth.uid() and role in ('admin', 'super_admin')
  ));

create policy "events_update_admin"
  on public.events for update
  using (exists (
    select 1 from public.profiles 
    where id = auth.uid() and role in ('admin', 'super_admin')
  ));

create policy "events_delete_admin"
  on public.events for delete
  using (exists (
    select 1 from public.profiles 
    where id = auth.uid() and role in ('admin', 'super_admin')
  ));

-- RLS Policies for discount codes
create policy "discount_codes_select_active"
  on public.discount_codes for select
  using (
    (is_active = true and start_date <= now() and end_date >= now()) or 
    exists (
      select 1 from public.profiles 
      where id = auth.uid() and role in ('admin', 'super_admin')
    )
  );

create policy "discount_codes_insert_admin"
  on public.discount_codes for insert
  with check (exists (
    select 1 from public.profiles 
    where id = auth.uid() and role in ('admin', 'super_admin')
  ));

create policy "discount_codes_update_admin"
  on public.discount_codes for update
  using (exists (
    select 1 from public.profiles 
    where id = auth.uid() and role in ('admin', 'super_admin')
  ));

create policy "discount_codes_delete_admin"
  on public.discount_codes for delete
  using (exists (
    select 1 from public.profiles 
    where id = auth.uid() and role in ('admin', 'super_admin')
  ));

-- RLS Policies for event attendees
create policy "event_attendees_select_own"
  on public.event_attendees for select
  using (
    auth.uid() = user_id or 
    exists (
      select 1 from public.profiles 
      where id = auth.uid() and role in ('admin', 'super_admin')
    )
  );

create policy "event_attendees_insert_own"
  on public.event_attendees for insert
  with check (auth.uid() = user_id or user_id is null);

create policy "event_attendees_update_admin"
  on public.event_attendees for update
  using (exists (
    select 1 from public.profiles 
    where id = auth.uid() and role in ('admin', 'super_admin')
  ));
