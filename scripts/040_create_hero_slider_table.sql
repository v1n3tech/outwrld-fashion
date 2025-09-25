-- Create hero_slider table for managing slider images
CREATE TABLE IF NOT EXISTS hero_slider (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  subtitle TEXT,
  image_url TEXT NOT NULL,
  alt_text TEXT NOT NULL,
  button_text TEXT,
  button_link TEXT,
  position INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id)
);

-- Create index for ordering
CREATE INDEX IF NOT EXISTS idx_hero_slider_position ON hero_slider(position);
CREATE INDEX IF NOT EXISTS idx_hero_slider_active ON hero_slider(is_active);

-- Enable RLS
ALTER TABLE hero_slider ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Anyone can view active slider images" ON hero_slider
  FOR SELECT USING (is_active = true);

CREATE POLICY "Admins can manage slider images" ON hero_slider
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role IN ('admin', 'super_admin')
    )
  );

-- Create trigger for updated_at
CREATE OR REPLACE FUNCTION update_hero_slider_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_hero_slider_updated_at
  BEFORE UPDATE ON hero_slider
  FOR EACH ROW
  EXECUTE FUNCTION update_hero_slider_updated_at();
