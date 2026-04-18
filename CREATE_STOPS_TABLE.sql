-- ============================================
-- AMRAVATI TRANSIT - STOPS TABLE SETUP
-- ============================================
-- ⚠️  IMPORTANT: Run this SQL in your Supabase dashboard!
-- 
-- HOW TO RUN:
-- 1. Go to: https://app.supabase.com
-- 2. Click on your project
-- 3. Go to "SQL Editor" (left sidebar)
-- 4. Click "New Query"
-- 5. Copy and paste this entire file
-- 6. Click "Run" button (or Ctrl+Enter)
-- ============================================

-- Step 1: Create the stops table
CREATE TABLE IF NOT EXISTS stops (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  stop_name TEXT NOT NULL,
  stop_code TEXT NOT NULL UNIQUE,
  latitude FLOAT8,
  longitude FLOAT8,
  zone TEXT DEFAULT 'Other',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Step 2: Enable Row Level Security (RLS)
ALTER TABLE stops ENABLE ROW LEVEL SECURITY;

-- Step 3: Create policies to allow all operations
-- This allows anyone to read/write/delete stops
-- For production, you should restrict this with authentication

-- Allow anyone to READ stops
CREATE POLICY "Allow public read access"
  ON stops
  FOR SELECT
  TO anon
  USING (true);

-- Allow anyone to INSERT new stops
CREATE POLICY "Allow public insert access"
  ON stops
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Allow anyone to UPDATE stops
CREATE POLICY "Allow public update access"
  ON stops
  FOR UPDATE
  TO anon
  USING (true)
  WITH CHECK (true);

-- Allow anyone to DELETE stops
CREATE POLICY "Allow public delete access"
  ON stops
  FOR DELETE
  TO anon
  USING (true);

-- Step 4: Create indexes for faster searches
CREATE INDEX IF NOT EXISTS idx_stop_code ON stops(stop_code);
CREATE INDEX IF NOT EXISTS idx_stop_name ON stops(stop_name);
CREATE INDEX IF NOT EXISTS idx_stop_zone ON stops(zone);
CREATE INDEX IF NOT EXISTS idx_stop_active ON stops(is_active);

-- Step 5: Insert sample data (optional - you can remove this section)
INSERT INTO stops (stop_name, stop_code, latitude, longitude, zone, is_active)
VALUES
  ('Rajapeth Chowk', 'AMR01', 20.9320, 77.7750, 'Rajapeth', true),
  ('Civil Lines Circle', 'AMR02', 20.9374, 77.7796, 'Civil Lines', true),
  ('Badnera Station', 'AMR03', 20.9450, 77.7650, 'Badnera', true),
  ('Camp Area', 'AMR04', 20.9280, 77.7820, 'Camp', true),
  ('MIDC Industrial', 'AMR05', 20.9500, 77.7900, 'MIDC', true),
  ('University Gate', 'AMR06', 20.9200, 77.7700, 'University', true)
ON CONFLICT (stop_code) DO NOTHING;

-- ============================================
-- VERIFICATION
-- ============================================
-- After running the script above, run this to verify:
-- SELECT * FROM stops;
-- 
-- You should see 6 stops in the results!
-- ============================================
