-- Create indexes for better performance

-- Products indexes
create index if not exists idx_products_category_id on public.products(category_id);
create index if not exists idx_products_slug on public.products(slug);
create index if not exists idx_products_sku on public.products(sku);
create index if not exists idx_products_is_active on public.products(is_active);
create index if not exists idx_products_is_featured on public.products(is_featured);
create index if not exists idx_products_created_at on public.products(created_at desc);

-- Product variants indexes
create index if not exists idx_product_variants_product_id on public.product_variants(product_id);
create index if not exists idx_product_variants_sku on public.product_variants(sku);
create index if not exists idx_product_variants_is_active on public.product_variants(is_active);

-- Product images indexes
create index if not exists idx_product_images_product_id on public.product_images(product_id);
create index if not exists idx_product_images_variant_id on public.product_images(variant_id);
create index if not exists idx_product_images_position on public.product_images(position);

-- Categories indexes
create index if not exists idx_categories_slug on public.categories(slug);
create index if not exists idx_categories_parent_id on public.categories(parent_id);
create index if not exists idx_categories_is_active on public.categories(is_active);

-- Cart items indexes
create index if not exists idx_cart_items_user_id on public.cart_items(user_id);
create index if not exists idx_cart_items_session_id on public.cart_items(session_id);
create index if not exists idx_cart_items_product_id on public.cart_items(product_id);

-- Orders indexes
create index if not exists idx_orders_user_id on public.orders(user_id);
create index if not exists idx_orders_order_number on public.orders(order_number);
create index if not exists idx_orders_status on public.orders(status);
create index if not exists idx_orders_payment_status on public.orders(payment_status);
create index if not exists idx_orders_created_at on public.orders(created_at desc);

-- Order items indexes
create index if not exists idx_order_items_order_id on public.order_items(order_id);
create index if not exists idx_order_items_product_id on public.order_items(product_id);

-- Events indexes
create index if not exists idx_events_slug on public.events(slug);
create index if not exists idx_events_is_active on public.events(is_active);
create index if not exists idx_events_start_date on public.events(start_date);
create index if not exists idx_events_end_date on public.events(end_date);

-- Event attendees indexes
create index if not exists idx_event_attendees_event_id on public.event_attendees(event_id);
create index if not exists idx_event_attendees_user_id on public.event_attendees(user_id);
create index if not exists idx_event_attendees_ticket_code on public.event_attendees(ticket_code);

-- Discount codes indexes
create index if not exists idx_discount_codes_code on public.discount_codes(code);
create index if not exists idx_discount_codes_is_active on public.discount_codes(is_active);
create index if not exists idx_discount_codes_start_date on public.discount_codes(start_date);
create index if not exists idx_discount_codes_end_date on public.discount_codes(end_date);

-- Profiles indexes
create index if not exists idx_profiles_role on public.profiles(role);
