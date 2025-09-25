-- Seed initial shipping zones for Nigeria
insert into public.shipping_zones (name, description, countries, states) values
('Lagos Metro', 'Lagos Island, Victoria Island, Ikoyi, Lekki', '{"Nigeria"}', '{"Lagos"}'),
('Lagos Mainland', 'Ikeja, Surulere, Yaba, Maryland', '{"Nigeria"}', '{"Lagos"}'),
('Abuja FCT', 'Federal Capital Territory', '{"Nigeria"}', '{"FCT"}'),
('Major Cities', 'Port Harcourt, Kano, Ibadan, Kaduna', '{"Nigeria"}', '{"Rivers", "Kano", "Oyo", "Kaduna"}'),
('Other States', 'All other Nigerian states', '{"Nigeria"}', '{"Abia", "Adamawa", "Akwa Ibom", "Anambra", "Bauchi", "Bayelsa", "Benue", "Borno", "Cross River", "Delta", "Ebonyi", "Edo", "Ekiti", "Enugu", "Gombe", "Imo", "Jigawa", "Kebbi", "Kogi", "Kwara", "Nasarawa", "Niger", "Ondo", "Osun", "Ogun", "Plateau", "Sokoto", "Taraba", "Yobe", "Zamfara"}')
on conflict do nothing;

-- Seed shipping methods
insert into public.shipping_methods (name, description, code, delivery_time_min, delivery_time_max, sort_order) values
('Standard Delivery', 'Regular delivery within business days', 'standard', 2, 5, 1),
('Express Delivery', 'Fast delivery for urgent orders', 'express', 1, 2, 2),
('Same Day Delivery', 'Delivery within the same day (Lagos only)', 'same_day', 0, 1, 3)
on conflict (code) do nothing;

-- Seed shipping rates with Bolt-inspired dynamic pricing
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
    when z.name = 'Lagos Metro' and m.code = 'standard' then 1500.00
    when z.name = 'Lagos Metro' and m.code = 'express' then 2500.00
    when z.name = 'Lagos Metro' and m.code = 'same_day' then 3500.00
    when z.name = 'Lagos Mainland' and m.code = 'standard' then 2000.00
    when z.name = 'Lagos Mainland' and m.code = 'express' then 3000.00
    when z.name = 'Abuja FCT' and m.code = 'standard' then 2500.00
    when z.name = 'Abuja FCT' and m.code = 'express' then 4000.00
    when z.name = 'Major Cities' and m.code = 'standard' then 3000.00
    when z.name = 'Major Cities' and m.code = 'express' then 4500.00
    when z.name = 'Other States' and m.code = 'standard' then 3500.00
    when z.name = 'Other States' and m.code = 'express' then 5000.00
    else 2000.00
  end as base_rate,
  case 
    when z.name in ('Lagos Metro', 'Lagos Mainland') then 25000.00
    else 30000.00
  end as free_shipping_threshold,
  case 
    when m.code = 'standard' then 200.00
    when m.code = 'express' then 300.00
    when m.code = 'same_day' then 400.00
    else 200.00
  end as weight_rate,
  2.0 as weight_threshold, -- 2kg free weight allowance
  5000.0 as dimensional_factor,
  true as use_dimensional_weight,
  0 as min_order_value
from zones z
cross join methods m
where not (z.name != 'Lagos Metro' and z.name != 'Lagos Mainland' and m.code = 'same_day')
on conflict (zone_id, method_id) do nothing;
