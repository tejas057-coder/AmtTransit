-- ============================================
-- AMRAVATI TRANSIT - COMPLETE DATABASE SETUP
-- ============================================
-- ⚠️  IMPORTANT: Run this ENTIRE script in your Supabase dashboard!
-- 
-- HOW TO RUN:
-- 1. Go to: https://app.supabase.com
-- 2. Click on your project: vcahhbylqrlqntnibjzt
-- 3. Go to "SQL Editor" (left sidebar)
-- 4. Click "New Query"
-- 5. Copy and paste this ENTIRE file
-- 6. Click "Run" button (or Ctrl+Enter)
-- ============================================

-- ============================================
-- TABLE 1: STOPS
-- ============================================
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

-- ============================================
-- TABLE 2: ROUTES
-- ============================================
CREATE TABLE IF NOT EXISTS routes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  route_number TEXT NOT NULL UNIQUE,
  from_stop TEXT NOT NULL,
  to_stop TEXT NOT NULL,
  distance_km FLOAT8 DEFAULT 0,
  estimated_time_min INTEGER DEFAULT 0,
  color TEXT DEFAULT '#C8F135',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- TABLE 3: BUSES
-- ============================================
CREATE TABLE IF NOT EXISTS buses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  bus_number TEXT NOT NULL UNIQUE,
  route_id UUID REFERENCES routes(id) ON DELETE SET NULL,
  driver_name TEXT,
  driver_phone TEXT,
  capacity INTEGER DEFAULT 50,
  status TEXT DEFAULT 'on-time', -- 'on-time', 'delayed', 'at-stop', 'maintenance'
  latitude FLOAT8,
  longitude FLOAT8,
  speed FLOAT8 DEFAULT 0,
  passengers INTEGER DEFAULT 0,
  last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- ENABLE ROW LEVEL SECURITY
-- ============================================
ALTER TABLE stops ENABLE ROW LEVEL SECURITY;
ALTER TABLE routes ENABLE ROW LEVEL SECURITY;
ALTER TABLE buses ENABLE ROW LEVEL SECURITY;

-- ============================================
-- CREATE POLICIES (Allow all operations for development)
-- ============================================

-- Stops policies
CREATE POLICY "Allow all operations on stops" ON stops FOR ALL TO anon USING (true) WITH CHECK (true);

-- Routes policies
CREATE POLICY "Allow all operations on routes" ON routes FOR ALL TO anon USING (true) WITH CHECK (true);

-- Buses policies
CREATE POLICY "Allow all operations on buses" ON buses FOR ALL TO anon USING (true) WITH CHECK (true);

-- ============================================
-- CREATE INDEXES for faster searches
-- ============================================

-- Stops indexes
CREATE INDEX IF NOT EXISTS idx_stop_code ON stops(stop_code);
CREATE INDEX IF NOT EXISTS idx_stop_name ON stops(stop_name);
CREATE INDEX IF NOT EXISTS idx_stop_zone ON stops(zone);
CREATE INDEX IF NOT EXISTS idx_stop_active ON stops(is_active);

-- Routes indexes
CREATE INDEX IF NOT EXISTS idx_route_number ON routes(route_number);
CREATE INDEX IF NOT EXISTS idx_route_active ON routes(is_active);

-- Buses indexes
CREATE INDEX IF NOT EXISTS idx_bus_number ON buses(bus_number);
CREATE INDEX IF NOT EXISTS idx_bus_route ON buses(route_id);
CREATE INDEX IF NOT EXISTS idx_bus_status ON buses(status);
CREATE INDEX IF NOT EXISTS idx_bus_active ON buses(is_active);

-- ============================================
-- INSERT SAMPLE DATA
-- ============================================

-- Sample Stops (6 stops in Amravati)
INSERT INTO stops (stop_name, stop_code, latitude, longitude, zone, is_active)
VALUES
  ('Rajapeth Chowk', 'AMR01', 20.9320, 77.7750, 'Rajapeth', true),
  ('Civil Lines Circle', 'AMR02', 20.9374, 77.7796, 'Civil Lines', true),
  ('Badnera Station', 'AMR03', 20.9450, 77.7650, 'Badnera', true),
  ('Camp Area', 'AMR04', 20.9280, 77.7820, 'Camp', true),
  ('MIDC Industrial', 'AMR05', 20.9500, 77.7900, 'MIDC', true),
  ('University Gate', 'AMR06', 20.9200, 77.7700, 'University', true)
ON CONFLICT (stop_code) DO NOTHING;

-- Sample Routes (4 routes)
INSERT INTO routes (name, route_number, from_stop, to_stop, distance_km, estimated_time_min, color, is_active)
VALUES
  ('City Center Express', 'R01', 'Rajapeth Chowk', 'Civil Lines Circle', 5.2, 15, '#C8F135', true),
  ('MIDC Connector', 'R02', 'Civil Lines Circle', 'MIDC Industrial', 8.5, 25, '#7F77DD', true),
  ('University Line', 'R03', 'University Gate', 'Badnera Station', 12.3, 35, '#D85A30', true),
  ('Camp Shuttle', 'R04', 'Camp Area', 'Rajapeth Chowk', 3.8, 10, '#378ADD', true)
ON CONFLICT (route_number) DO NOTHING;

-- Sample Buses (6 buses)
-- Note: We need to get route IDs first, so we'll use a simpler approach
INSERT INTO buses (bus_number, driver_name, driver_phone, capacity, status, latitude, longitude, speed, passengers, is_active)
VALUES
  ('MH-27-AB-1234', 'Ramesh Kumar', '+91 98765 43210', 52, 'on-time', 20.9320, 77.7750, 35, 28, true),
  ('MH-27-AB-1235', 'Suresh Patil', '+91 98765 43211', 48, 'on-time', 20.9374, 77.7796, 40, 35, true),
  ('MH-27-AB-1236', 'Amit Sharma', '+91 98765 43212', 50, 'delayed', 20.9450, 77.7650, 25, 42, true),
  ('MH-27-AB-1237', 'Vikram Deshmukh', '+91 98765 43213', 52, 'at-stop', 20.9280, 77.7820, 0, 15, true),
  ('MH-27-AB-1238', 'Prakash Jadhav', '+91 98765 43214', 45, 'on-time', 20.9500, 77.7900, 45, 30, true),
  ('MH-27-AB-1239', 'Sanjay Rao', '+91 98765 43215', 50, 'maintenance', 20.9200, 77.7700, 0, 0, false)
ON CONFLICT (bus_number) DO NOTHING;

-- ============================================
-- VERIFICATION QUERIES
-- ============================================
-- Run these to verify everything was created:

-- Check tables exist:
-- SELECT tablename FROM pg_tables WHERE schemaname = 'public';

-- Count records:
SELECT 
  (SELECT COUNT(*) FROM stops) as total_stops,
  (SELECT COUNT(*) FROM routes) as total_routes,
  (SELECT COUNT(*) FROM buses) as total_buses;

-- View all stops:
-- SELECT * FROM stops;

-- View all routes:
-- SELECT * FROM routes;

-- View all buses:
-- SELECT * FROM buses;

-- ============================================
-- SUCCESS!
-- ============================================
-- If you see counts > 0 above, your database is ready!
-- 
-- Expected output:
-- total_stops | total_routes | total_buses
-- ------------|--------------|------------
-- 6           | 4            | 6
--
-- Now all API endpoints will work:
-- ✅ GET /api/stops
-- ✅ GET /api/routes  
-- ✅ GET /api/buses
-- ============================================
