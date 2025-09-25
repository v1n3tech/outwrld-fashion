-- Add created_by column to products table
ALTER TABLE products ADD COLUMN created_by UUID REFERENCES auth.users(id);

-- Update existing products to have a created_by value (set to first admin user if exists)
UPDATE products 
SET created_by = (
  SELECT p.id 
  FROM profiles p 
  WHERE p.role IN ('admin', 'super_admin') 
  LIMIT 1
)
WHERE created_by IS NULL;

-- Add index for better performance
CREATE INDEX idx_products_created_by ON products(created_by);

-- Update RLS policies to include created_by checks if needed
DROP POLICY IF EXISTS "Admin users can manage products" ON products;
CREATE POLICY "Admin users can manage products" ON products
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.role IN ('admin', 'super_admin')
  )
);

-- Allow users to view active products
DROP POLICY IF EXISTS "Users can view active products" ON products;
CREATE POLICY "Users can view active products" ON products
FOR SELECT USING (is_active = true);
