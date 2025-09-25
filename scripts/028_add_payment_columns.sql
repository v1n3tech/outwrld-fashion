-- Add missing payment columns to orders table
ALTER TABLE public.orders 
ADD COLUMN IF NOT EXISTS payment_reference text,
ADD COLUMN IF NOT EXISTS payment_method text;

-- Add index for payment reference for faster lookups
CREATE INDEX IF NOT EXISTS idx_orders_payment_reference ON public.orders(payment_reference);
