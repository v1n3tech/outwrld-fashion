-- Function to auto-create user profile on signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  -- Fixed to use correct profile table columns and add admin role logic
  insert into public.profiles (id, first_name, last_name, role)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'first_name', ''),
    coalesce(new.raw_user_meta_data ->> 'last_name', ''),
    case 
      when new.email = 'mantimdanzaki@gmail.com' then 'admin'
      else 'customer'
    end
  )
  on conflict (id) do update set
    role = case 
      when new.email = 'mantimdanzaki@gmail.com' then 'admin'
      else profiles.role
    end,
    updated_at = now();

  return new;
exception
  when others then
    -- Added error handling to prevent user creation failure
    raise warning 'Failed to create profile for user %: %', new.id, sqlerrm;
    return new;
end;
$$;

-- Trigger to create profile on user signup
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row
  execute function public.handle_new_user();

-- Function to update updated_at timestamp
create or replace function public.update_updated_at_column()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- Add updated_at triggers to relevant tables
create trigger update_profiles_updated_at
  before update on public.profiles
  for each row
  execute function public.update_updated_at_column();

create trigger update_categories_updated_at
  before update on public.categories
  for each row
  execute function public.update_updated_at_column();

create trigger update_products_updated_at
  before update on public.products
  for each row
  execute function public.update_updated_at_column();

create trigger update_product_variants_updated_at
  before update on public.product_variants
  for each row
  execute function public.update_updated_at_column();

create trigger update_cart_items_updated_at
  before update on public.cart_items
  for each row
  execute function public.update_updated_at_column();

create trigger update_orders_updated_at
  before update on public.orders
  for each row
  execute function public.update_updated_at_column();

create trigger update_events_updated_at
  before update on public.events
  for each row
  execute function public.update_updated_at_column();

create trigger update_discount_codes_updated_at
  before update on public.discount_codes
  for each row
  execute function public.update_updated_at_column();

-- Function to generate order numbers
create or replace function public.generate_order_number()
returns text
language plpgsql
as $$
declare
  new_number text;
  counter integer;
begin
  -- Get current date in YYYYMMDD format
  select to_char(now(), 'YYYYMMDD') into new_number;
  
  -- Get count of orders today
  select count(*) + 1 into counter
  from public.orders
  where date(created_at) = current_date;
  
  -- Combine date with padded counter
  new_number := 'OW' || new_number || lpad(counter::text, 4, '0');
  
  return new_number;
end;
$$;

-- Function to auto-generate order number
create or replace function public.set_order_number()
returns trigger
language plpgsql
as $$
begin
  if new.order_number is null or new.order_number = '' then
    new.order_number := public.generate_order_number();
  end if;
  return new;
end;
$$;

-- Trigger to set order number
create trigger set_order_number_trigger
  before insert on public.orders
  for each row
  execute function public.set_order_number();
