-- Create the stops table exactly as requested
CREATE TABLE IF NOT EXISTS stops (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  route text not null,
  lat double precision not null,
  lng double precision not null,
  created_at timestamp with time zone default now()
);

-- Basic RLS (Row Level Security) - Simplified for your current development
ALTER TABLE stops ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read" ON stops FOR SELECT USING (true);
CREATE POLICY "Allow public insert" ON stops FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public delete" ON stops FOR DELETE USING (true);
CREATE POLICY "Allow public update" ON stops FOR UPDATE USING (true);

