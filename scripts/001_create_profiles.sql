-- Create user profiles table extending auth.users
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  first_name text,
  last_name text,
  phone text,
  avatar_url text,
  role text default 'customer' check (role in ('customer', 'admin', 'super_admin')),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Enable RLS
alter table public.profiles enable row level security;

-- RLS Policies for profiles
create policy "profiles_select_own"
  on public.profiles for select
  using (auth.uid() = id or exists (
    select 1 from public.profiles 
    where id = auth.uid() and role in ('admin', 'super_admin')
  ));

create policy "profiles_insert_own"
  on public.profiles for insert
  with check (auth.uid() = id);

create policy "profiles_update_own"
  on public.profiles for update
  using (auth.uid() = id or exists (
    select 1 from public.profiles 
    where id = auth.uid() and role in ('admin', 'super_admin')
  ));

create policy "profiles_delete_own"
  on public.profiles for delete
  using (auth.uid() = id or exists (
    select 1 from public.profiles 
    where id = auth.uid() and role = 'super_admin'
  ));
