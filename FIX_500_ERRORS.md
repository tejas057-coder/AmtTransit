# 🚨 URGENT: Fix 500 Errors - Database Tables Missing!

## Problem
All API endpoints are returning **500 Internal Server Error**:
- ❌ `GET /api/stops` → 500 Error
- ❌ `GET /api/buses` → 500 Error  
- ❌ `GET /api/routes` → 500 Error

## Root Cause
**Database tables don't exist!** The backend is trying to query tables that haven't been created yet.

---

## ✅ QUICK FIX (2 minutes)

### Step 1: Open Supabase
1. Go to: **https://app.supabase.com**
2. Click your project

### Step 2: Open SQL Editor
1. Click **"SQL Editor"** (left sidebar)
2. Click **"New Query"**

### Step 3: Copy & Run Complete Setup
Open this file: 📄 **[COMPLETE_DATABASE_SETUP.sql](file:///c:/Users/user/Desktop/WORKING/AmravatiTransit/COMPLETE_DATABASE_SETUP.sql)**

**Copy the ENTIRE file** and paste it into SQL Editor.

Click **"Run"** (or Ctrl+Enter)

### Step 4: Verify
You should see this output:
```
total_stops | total_routes | total_buses
------------|--------------|------------
6           | 4            | 6
```

---

## 🎯 What Gets Created

### **3 Tables:**
1. ✅ **`stops`** - Bus stops (6 sample stops)
2. ✅ **`routes`** - Bus routes (4 sample routes)
3. ✅ **`buses`** - Bus information (6 sample buses)

### **Sample Data:**
- 6 stops in Amravati
- 4 bus routes
- 6 buses with drivers

### **Security:**
- Row Level Security enabled
- Policies allow all operations (for development)
- Indexes for fast queries

---

## 🧪 After Setup - Test Everything

### 1. Refresh your app
The 500 errors should be gone!

### 2. Check LiveMapPage
- Should now show stops on map
- Should show buses
- Should show routes

### 3. Check Admin Panel
- Go to: `http://localhost:5173/stops-map`
- Should load all stops
- Can create new stops

---

## 📊 Database Schema

### **stops** table:
```
- id (UUID)
- stop_name (TEXT)
- stop_code (TEXT, UNIQUE)
- latitude (FLOAT)
- longitude (FLOAT)
- zone (TEXT)
- is_active (BOOLEAN)
- created_at (TIMESTAMP)
```

### **routes** table:
```
- id (UUID)
- name (TEXT)
- route_number (TEXT, UNIQUE)
- from_stop (TEXT)
- to_stop (TEXT)
- distance_km (FLOAT)
- estimated_time_min (INTEGER)
- color (TEXT)
- is_active (BOOLEAN)
- created_at (TIMESTAMP)
```

### **buses** table:
```
- id (UUID)
- bus_number (TEXT, UNIQUE)
- route_id (UUID, FK → routes)
- driver_name (TEXT)
- driver_phone (TEXT)
- capacity (INTEGER)
- status (TEXT: 'on-time', 'delayed', 'at-stop', 'maintenance')
- latitude (FLOAT)
- longitude (FLOAT)
- speed (FLOAT)
- passengers (INTEGER)
- last_updated (TIMESTAMP)
- is_active (BOOLEAN)
- created_at (TIMESTAMP)
```

---

## 🔍 Troubleshooting

### "Table already exists" error
That's OK! Just continue running the script.

### Still getting 500 errors after setup?
1. Restart backend server:
   ```bash
   cd backend
   npm run dev
   ```
2. Hard refresh browser: `Ctrl + Shift + R`
3. Check browser console for new errors

### Permission denied errors?
The SQL script includes RLS policies. If you still get permission errors:
1. Go to Supabase → Authentication → Policies
2. Verify policies exist for all 3 tables

---

## ✅ Success Checklist

After running the SQL script, you should have:

- [x] 3 tables created (stops, routes, buses)
- [x] Sample data inserted
- [x] RLS policies enabled
- [x ] Indexes created
- [x] No more 500 errors
- [x] LiveMapPage shows data
- [x] Admin panel works
- [x] Can create/edit/delete stops

---

**Run the SQL script and all 500 errors will be fixed!** 🎉
