-- Update shipping rates for Jos-based business with Plateau LGA focus
-- New rate structure based on Jos business location

-- Seed shipping rates with Jos/Plateau focus
with zones as (
  select id, name from public.shipping_zones
), methods as (
  select id, code from public.shipping_methods
)
insert into public.shipping_rates (
  zone_id, method_id, base_rate, free_shipping_threshold, 
  weight_rate, weight_threshold, dimensional_factor, 
  use_dimensional_weight, min_order_value
)
select 
  z.id,
  m.id,
  case 
    -- Jos North LGA (business location) - cheapest rates
    when z.name = 'Jos North LGA' and m.code = 'standard' then 800.00
    when z.name = 'Jos North LGA' and m.code = 'express' then 1200.00
    when z.name = 'Jos North LGA' and m.code = 'same_day' then 1500.00
    
    -- Other Plateau LGAs - local rates
    when z.name like '%LGA' and m.code = 'standard' then 1200.00
    when z.name like '%LGA' and m.code = 'express' then 1800.00
    when z.name like '%LGA' and m.code = 'same_day' then 2200.00
    
    -- Major commercial centers
    when z.name = 'Lagos State' and m.code = 'standard' then 2500.00
    when z.name = 'Lagos State' and m.code = 'express' then 3500.00
    when z.name = 'Abuja FCT' and m.code = 'standard' then 2000.00
    when z.name = 'Abuja FCT' and m.code = 'express' then 3000.00
    
    -- Major cities in neighboring states
    when z.name in ('Rivers State', 'Kano State', 'Oyo State', 'Kaduna State') and m.code = 'standard' then 2800.00
    when z.name in ('Rivers State', 'Kano State', 'Oyo State', 'Kaduna State') and m.code = 'express' then 4000.00
    
    -- Other states - standard rates
    when m.code = 'standard' then 3200.00
    when m.code = 'express' then 4500.00
    else 2000.00
  end as base_rate,
  case 
    -- Lower free shipping threshold for Plateau State
    when z.name like '%LGA' then 18000.00
    when z.name in ('Lagos State', 'Abuja FCT') then 25000.00
    else 30000.00
  end as free_shipping_threshold,
  case 
    when m.code = 'standard' then 150.00
    when m.code = 'express' then 250.00
    when m.code = 'same_day' then 350.00
    else 150.00
  end as weight_rate,
  2.0 as weight_threshold, -- 2kg free weight allowance
  5000.0 as dimensional_factor,
  true as use_dimensional_weight,
  0 as min_order_value
from zones z
cross join methods m
where not (z.name not like '%LGA' and z.name != 'Lagos State' and m.code = 'same_day')
on conflict (zone_id, method_id) do nothing;
