-- Insert initial categories
insert into public.categories (name, slug, description, sort_order) values
('Hoodies', 'hoodies', 'Premium streetwear hoodies with Nigerian cultural flair', 1),
('T-Shirts', 'tshirts', 'Avant-garde tees blending urban edge with heritage', 2),
('Accessories', 'accessories', 'Unique accessories to complete your Outwrld look', 3),
('Limited Edition', 'limited-edition', 'Exclusive drops and collaborations', 4)
on conflict (slug) do nothing;

-- Insert sample products with Nigerian streetwear aesthetic
insert into public.products (
  name, slug, description, short_description, category_id, base_price, 
  compare_price, sku, inventory_quantity, is_featured, tags
) 
select 
  'Lagos Nights Hoodie',
  'lagos-nights-hoodie',
  'Premium heavyweight hoodie featuring abstract Lagos skyline print. Crafted from sustainable cotton blend with kangaroo pocket and adjustable drawstring hood. Represents the vibrant energy of Nigerian nightlife.',
  'Premium hoodie with Lagos skyline print',
  c.id,
  25000.00,
  32000.00,
  'OW-HOOD-001',
  50,
  true,
  array['hoodie', 'lagos', 'streetwear', 'premium']
from public.categories c where c.slug = 'hoodies'
on conflict (slug) do nothing;

insert into public.products (
  name, slug, description, short_description, category_id, base_price, 
  sku, inventory_quantity, is_featured, tags
) 
select 
  'Afrobeat Rhythm Tee',
  'afrobeat-rhythm-tee',
  'Soft cotton tee celebrating Nigerian music culture. Features minimalist sound wave design inspired by Afrobeat legends. Perfect for everyday wear with cultural pride.',
  'Afrobeat-inspired cotton tee',
  c.id,
  12000.00,
  'OW-TEE-001',
  100,
  true,
  array['tshirt', 'afrobeat', 'music', 'culture']
from public.categories c where c.slug = 'tshirts'
on conflict (slug) do nothing;

insert into public.products (
  name, slug, description, short_description, category_id, base_price, 
  sku, inventory_quantity, tags
) 
select 
  'Yoruba Pattern Snapback',
  'yoruba-pattern-snapback',
  'Structured snapback cap featuring traditional Yoruba geometric patterns in modern colorways. Embroidered Outwrld logo with cultural authenticity.',
  'Traditional pattern snapback cap',
  c.id,
  8000.00,
  'OW-CAP-001',
  75,
  array['cap', 'yoruba', 'traditional', 'accessories']
from public.categories c where c.slug = 'accessories'
on conflict (slug) do nothing;

-- Insert product variants (sizes for hoodie and tee)
insert into public.product_variants (product_id, name, sku, price, inventory_quantity, position)
select 
  p.id, 'Small', p.sku || '-S', p.base_price, 10, 1
from public.products p where p.slug = 'lagos-nights-hoodie'
on conflict (sku) do nothing;

insert into public.product_variants (product_id, name, sku, price, inventory_quantity, position)
select 
  p.id, 'Medium', p.sku || '-M', p.base_price, 15, 2
from public.products p where p.slug = 'lagos-nights-hoodie'
on conflict (sku) do nothing;

insert into public.product_variants (product_id, name, sku, price, inventory_quantity, position)
select 
  p.id, 'Large', p.sku || '-L', p.base_price, 20, 3
from public.products p where p.slug = 'lagos-nights-hoodie'
on conflict (sku) do nothing;

insert into public.product_variants (product_id, name, sku, price, inventory_quantity, position)
select 
  p.id, 'X-Large', p.sku || '-XL', p.base_price, 5, 4
from public.products p where p.slug = 'lagos-nights-hoodie'
on conflict (sku) do nothing;

-- Add variant options for hoodie sizes
insert into public.variant_options (variant_id, option_name, option_value)
select pv.id, 'Size', 'Small'
from public.product_variants pv 
join public.products p on p.id = pv.product_id
where p.slug = 'lagos-nights-hoodie' and pv.name = 'Small';

insert into public.variant_options (variant_id, option_name, option_value)
select pv.id, 'Size', 'Medium'
from public.product_variants pv 
join public.products p on p.id = pv.product_id
where p.slug = 'lagos-nights-hoodie' and pv.name = 'Medium';

insert into public.variant_options (variant_id, option_name, option_value)
select pv.id, 'Size', 'Large'
from public.product_variants pv 
join public.products p on p.id = pv.product_id
where p.slug = 'lagos-nights-hoodie' and pv.name = 'Large';

insert into public.variant_options (variant_id, option_name, option_value)
select pv.id, 'Size', 'X-Large'
from public.product_variants pv 
join public.products p on p.id = pv.product_id
where p.slug = 'lagos-nights-hoodie' and pv.name = 'X-Large';

-- Insert product images with Unsplash URLs for streetwear
insert into public.product_images (product_id, image_url, alt_text, position, is_primary)
select 
  p.id,
  'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=800&h=800&fit=crop',
  'Lagos Nights Hoodie - Front View',
  1,
  true
from public.products p where p.slug = 'lagos-nights-hoodie';

insert into public.product_images (product_id, image_url, alt_text, position, is_primary)
select 
  p.id,
  'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=800&h=800&fit=crop',
  'Afrobeat Rhythm Tee - Front View',
  1,
  true
from public.products p where p.slug = 'afrobeat-rhythm-tee';

insert into public.product_images (product_id, image_url, alt_text, position, is_primary)
select 
  p.id,
  'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=800&h=800&fit=crop',
  'Yoruba Pattern Snapback - Front View',
  1,
  true
from public.products p where p.slug = 'yoruba-pattern-snapback';

-- Insert sample event
insert into public.events (
  name, slug, description, event_type, start_date, end_date, 
  is_paid, ticket_price, max_attendees, location
) values (
  'Outwrld Lagos Fashion Week',
  'outwrld-lagos-fashion-week',
  'Exclusive showcase of our latest collection featuring collaborations with Nigerian artists and designers. Experience the fusion of traditional craftsmanship with contemporary streetwear.',
  'launch',
  now() + interval '30 days',
  now() + interval '32 days',
  true,
  5000.00,
  200,
  'Victoria Island, Lagos'
) on conflict (slug) do nothing;

-- Insert sample discount code
insert into public.discount_codes (
  code, name, description, discount_type, discount_value, 
  minimum_order_amount, usage_limit, start_date, end_date
) values (
  'WELCOME10',
  'Welcome Discount',
  '10% off your first order',
  'percentage',
  10.00,
  10000.00,
  1000,
  now(),
  now() + interval '90 days'
) on conflict (code) do nothing;
