-- Create function to calculate shipping based on Jos business location
create or replace function public.calculate_shipping_cost(
  p_subtotal decimal(10,2),
  p_total_weight decimal(8,2),
  p_destination_state text,
  p_destination_city text default null,
  p_method_code text default 'standard'
)
returns table (
  zone_name text,
  method_name text,
  calculated_rate decimal(10,2),
  is_free_shipping boolean,
  delivery_time text
) 
language plpgsql
security definer
as $$
declare
  v_zone_id uuid;
  v_method_id uuid;
  v_rate record;
  v_dimensional_weight decimal(8,2);
  v_billable_weight decimal(8,2);
  v_weight_charge decimal(8,2);
  v_final_rate decimal(10,2);
  v_is_free boolean;
begin
  -- Find appropriate zone based on state and city
  select sz.id into v_zone_id
  from public.shipping_zones sz
  where sz.states @> format('["%s"]', p_destination_state)::jsonb
    and (p_destination_city is null or sz.cities @> format('["%s"]', p_destination_city)::jsonb)
  order by 
    case 
      when sz.name like '%LGA' then 1  -- Plateau LGAs first
      when sz.name = p_destination_state || ' State' then 2  -- Exact state match
      else 3
    end
  limit 1;
  
  -- If no specific zone found, use a default
  if v_zone_id is null then
    select sz.id into v_zone_id
    from public.shipping_zones sz
    where sz.name = 'Other States'
    limit 1;
  end if;
  
  -- Get shipping method
  select id into v_method_id
  from public.shipping_methods
  where code = p_method_code and is_active = true;
  
  if v_method_id is null then
    select id into v_method_id
    from public.shipping_methods
    where code = 'standard' and is_active = true
    limit 1;
  end if;
  
  -- Get shipping rate
  select * into v_rate
  from public.shipping_rates sr
  where sr.zone_id = v_zone_id 
    and sr.method_id = v_method_id
    and sr.is_active = true;
  
  if not found then
    -- Return default rate if no specific rate found
    return query select 
      'Unknown Zone'::text,
      'Standard'::text,
      2000.00::decimal(10,2),
      false::boolean,
      '3-5 days'::text;
    return;
  end if;
  
  -- Calculate dimensional weight (length × width × height ÷ dimensional_factor)
  v_dimensional_weight := greatest(p_total_weight, 0);
  
  -- Use higher of actual weight or dimensional weight
  v_billable_weight := greatest(p_total_weight, v_dimensional_weight);
  
  -- Calculate weight charge
  if v_billable_weight > v_rate.weight_threshold then
    v_weight_charge := (v_billable_weight - v_rate.weight_threshold) * v_rate.weight_rate;
  else
    v_weight_charge := 0;
  end if;
  
  -- Calculate final rate
  v_final_rate := v_rate.base_rate + v_weight_charge;
  
  -- Apply surge pricing if active
  if v_rate.surge_active and 
     v_rate.surge_start_time <= now() and 
     v_rate.surge_end_time >= now() then
    v_final_rate := v_final_rate * v_rate.surge_multiplier;
  end if;
  
  -- Check for free shipping
  v_is_free := p_subtotal >= v_rate.free_shipping_threshold;
  if v_is_free then
    v_final_rate := 0;
  end if;
  
  -- Return result
  return query 
  select 
    sz.name,
    sm.name,
    v_final_rate,
    v_is_free,
    case 
      when sm.delivery_time_min = sm.delivery_time_max then 
        sm.delivery_time_min || ' day' || case when sm.delivery_time_min > 1 then 's' else '' end
      else 
        sm.delivery_time_min || '-' || sm.delivery_time_max || ' days'
    end
  from public.shipping_zones sz, public.shipping_methods sm
  where sz.id = v_zone_id and sm.id = v_method_id;
  
end;
$$;

-- Grant execute permission to authenticated users
grant execute on function public.calculate_shipping_cost to authenticated;
