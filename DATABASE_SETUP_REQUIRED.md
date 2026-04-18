# 🗄️ DATABASE SETUP REQUIRED

## ⚠️ CRITICAL: The `stops` table does NOT exist in your Supabase database!

You MUST create the table before any stops can be saved or displayed.

---

## ✅ QUICK SETUP (5 minutes)

### Step 1: Open Supabase Dashboard
1. Go to: **https://app.supabase.com**
2. Click on your project: `vcahhbylqrlqntnibjzt`

### Step 2: Go to SQL Editor
1. On the left sidebar, click **"SQL Editor"**
2. Click **"New Query"** button (top right)

### Step 3: Copy & Run This SQL

Copy the ENTIRE SQL script below and paste it into the SQL Editor:

```sql
-- Create the stops table
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

-- Enable Row Level Security
ALTER TABLE stops ENABLE ROW LEVEL SECURITY;

-- Create policies to allow all operations
CREATE POLICY "Allow all operations" ON stops FOR ALL TO anon USING (true) WITH CHECK (true);

-- Create indexes for faster searches
CREATE INDEX IF NOT EXISTS idx_stop_code ON stops(stop_code);
CREATE INDEX IF NOT EXISTS idx_stop_name ON stops(stop_name);
CREATE INDEX IF NOT EXISTS idx_stop_zone ON stops(zone);

-- Insert sample stops (6 stops in Amravati)
INSERT INTO stops (stop_name, stop_code, latitude, longitude, zone, is_active)
VALUES
  ('Rajapeth Chowk', 'AMR01', 20.9320, 77.7750, 'Rajapeth', true),
  ('Civil Lines Circle', 'AMR02', 20.9374, 77.7796, 'Civil Lines', true),
  ('Badnera Station', 'AMR03', 20.9450, 77.7650, 'Badnera', true),
  ('Camp Area', 'AMR04', 20.9280, 77.7820, 'Camp', true),
  ('MIDC Industrial', 'AMR05', 20.9500, 77.7900, 'MIDC', true),
  ('University Gate', 'AMR06', 20.9200, 77.7700, 'University', true)
ON CONFLICT (stop_code) DO NOTHING;
```

### Step 4: Click "Run"
- Click the **"Run"** button (or press `Ctrl+Enter`)
- Wait for the success message

### Step 5: Verify the Table
Run this query to verify:
```sql
SELECT * FROM stops;
```

You should see **6 stops** in the results!

---

## 🧪 Test the Connection

After creating the table, run this command to verify:

```bash
cd c:\Users\user\Desktop\WORKING\AmravatiTransit\backend
npx tsx test_db_connection.ts
```

You should see:
```
✅ Connection successful!
✅ Insert successful!
✅ Found 6 stops in database
✅ Test stop deleted successfully
🎉 All tests passed!
```

---

## 🚀 After Setup

Once the table is created:

1. **Start Backend:**
   ```bash
   cd backend
   npm run dev
   ```

2. **Start Frontend:**
   ```bash
   cd frontend
   npm run dev
   ```

3. **Start Admin Panel:**
   ```bash
   cd admin
   npm run dev
   ```

4. **View Stops in User Frontend:**
   - Navigate to: `http://localhost:5173/stops`
   - You should see the 6 sample stops on the map and in the list!

5. **Add New Stops from Admin:**
   - Navigate to: `http://localhost:5173/stops-map` (admin)
   - Click "+ Create New Stop"
   - Click on the map
   - Fill in the form
   - Click "COMMIT TO DATABASE"
   - The new stop will appear in the user frontend automatically!

---

## 📋 What Happens After Setup

✅ **Admin Panel:** Can create, edit, delete stops  
✅ **User Frontend:** Displays all active stops from database  
✅ **Map View:** Shows stops with colored markers by zone  
✅ **Search & Filter:** Works by stop name, code, or zone  
✅ **Real-time Sync:** New stops appear immediately after saving  

---

## ❓ Troubleshooting

### "Table already exists" error
- That's good! The table is already created.
- Just proceed to testing.

### "Permission denied" error
- Make sure RLS policies are created (included in SQL above)
- Check that you're using the correct Supabase project

### Stops not showing in frontend
- Make sure `is_active` is set to `true` in the database
- Check browser console for errors
- Verify the frontend is connecting to the correct Supabase URL

---

**Once you run the SQL script, everything will work!** 🎉
