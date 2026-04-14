# Admin Dashboard - Quick Reference

## 🚀 How to Open (3 Commands)

```powershell
# Terminal 1: Navigate to admin folder
cd admin

# Terminal 2: Install dependencies (first time only)
npm install

# Terminal 3: Start dev server
npm run dev
```

**Then open**: http://localhost:5174/

---

## 📊 Dashboard Layout Overview

```
┌─────────────────────────────────────────────────────────────┐
│                         HEADER (56px)                        │
│  "Good morning, Admin"    [Bell 🔔] [Avatar A]             │
├──────────────┬────────────────────────────────────────────────┤
│              │                                                │
│   SIDEBAR    │              MAIN CONTENT (24px padding)      │
│   (240px)    │                                                │
│              │  ┌─────────────────────────────────────────┐  │
│  AT          │  │  KPI STAT CARDS (4-column grid)        │  │
│              │  │  • Active Buses: 24/30              +2  │  │
│  Dashboard   │  │  • Total Routes: 12              maint. │  │
│  Routes      │  │  • Passengers: 4,821                +12%│  │
│  Buses       │  │  • Total Stops: 87              Amravati│  │
│  Stops       │  └─────────────────────────────────────────┘  │
│  Schedule    │                                                │
│  Trips       │  ┌──────────────────────┬──────────────────┐  │
│  Analytics   │  │  Live Fleet Overview │ Recent Alerts    │  │
│  Settings    │  │                      │                  │  │
│              │  │  [MAP PLACEHOLDER]   │ • Bus #12: delay│  │
│              │  │  6 buses active      │ • Bus #07: alert│  │
│              │  │  [View Full Map →]   │ • Bus #19: OK   │  │
│              │  └──────────────────────┴──────────────────┘  │
│              │                                                │
│              │  ┌────────────────────────────────────────┐   │
│              │  │      Route Health Table                │   │
│              │  │  Route | Buses | Delay | Passengers   │   │
│              │  │  ──────────────────────────────────    │   │
│              │  │  Navsari→Badnera | 5 | 2min | 142     │   │
│              │  │  Navsari→Surat   | 3 | 8min | 89      │   │
│              │  │  Navsari→Vapi    | 2 |  -   | 0       │   │
│              │  │  [View All Routes →]                  │   │
│              │  └────────────────────────────────────────┘   │
└──────────────┴────────────────────────────────────────────────┘
```

---

## 🎨 Color Scheme

| Element          | Color       | Hex Code    |
| ---------------- | ----------- | ----------- |
| Background       | Dark Black  | #0D0D0D     |
| Cards            | Dark Gray   | #1A1A1A     |
| Accent           | Yellow      | **#FFD000** |
| Success          | Green       | #22C55E     |
| Warning          | Orange      | #FF9900     |
| Danger           | Red         | #FF4444     |
| Text (Primary)   | White       | #FFFFFF     |
| Text (Secondary) | Light Gray  | #E5E5E5     |
| Text (Muted)     | Medium Gray | #888888     |

---

## 📱 Dashboard Sections

### Section 1: KPI Stat Cards (4 Cards)

- **Layout**: 4-column CSS grid, responsive
- **Each Card**:
  - Yellow left border (4px)
  - Title (uppercase, muted text)
  - Large number value
  - Subtitle text
  - Optional badge or trend
  - Hover effect (elevated, border highlight)

### Section 2: Fleet & Alerts (2/3 + 1/3 Split)

- **Left (2/3 width)**: Live Fleet Overview
  - Dark map placeholder (#111)
  - 6 yellow bus markers with glow
  - "View Full Map →" link
- **Right (1/3 width)**: Recent Alerts
  - Scrollable list
  - Colored dots (red/orange/green)
  - Bus number, message, timestamp
  - 3 sample alerts

### Section 3: Route Health Table

- Dark theme table with hover effects
- Columns: Route | Buses Assigned | Avg Delay | Passengers | Status
- 3 sample routes
- Status badges: Active (yellow), Delayed (orange), Maintenance (red)
- "View All Routes →" footer link

---

## ⌨️ Keyboard Shortcuts

| Command         | Result                  |
| --------------- | ----------------------- |
| `Ctrl+C`        | Stop dev server         |
| `npm run build` | Create production build |
| `npm run lint`  | Check code quality      |
| `Ctrl+Shift+I`  | Open DevTools (inspect) |
| `Ctrl+K Ctrl+C` | Comment code in VS Code |

---

## 🔗 Important Ports

| Service      | Port | URL                   |
| ------------ | ---- | --------------------- |
| Admin Panel  | 5174 | http://localhost:5174 |
| Frontend App | 8081 | http://localhost:8081 |
| Backend API  | 5000 | http://localhost:5000 |

---

## 📂 Main Files Created

| File                  | Purpose               | Lines |
| --------------------- | --------------------- | ----- |
| `pages/Dashboard.tsx` | Main dashboard page   | 650+  |
| `src/App.tsx`         | App routing setup     | 20    |
| `HOW_TO_RUN.md`       | This guide            | -     |
| `DESIGN_SYSTEM.md`    | Full design reference | 900+  |
| `README.md`           | Admin documentation   | 800+  |

---

## ✅ Features Included

- ✅ Responsive layout with sidebar
- ✅ Dynamic greeting based on time of day
- ✅ 4 KPI stat cards with icons and trends
- ✅ Live fleet overview with map placeholder
- ✅ Recent alerts feed with colored indicators
- ✅ Route health table with sortable data
- ✅ Hover effects on all interactive elements
- ✅ Rapido-inspired dark UI theme
- ✅ Yellow accent highlights
- ✅ Status badges (Active, Delayed, Maintenance)

---

## 🎯 Dashboard Components

### Reusable Components Used

```typescript
import { Button, Card, Badge, Alert, Table } from "@/components/common";
```

### Design Tokens Used

```typescript
import {
  adminColors,
  adminSpacing,
  adminBorders,
} from "@/lib/adminDesignTokens";
```

### Lucide Icons Used

- Bus, Map, Users, MapPin, Bell, Settings, BarChart3, Calendar, AlertCircle, Zap, ChevronRight, etc.

---

## 🚨 Common Issues & Solutions

### Issue: Port 5174 Already in Use

```bash
# Solution: Kill the process using port 5174
# macOS/Linux:
lsof -i :5174 | grep LISTEN | awk '{print $2}' | xargs kill -9

# Windows PowerShell:
netstat -ano | findstr :5174
taskkill /PID <PID> /F
```

### Issue: Dependencies Not Installed

```bash
# Solution: Reinstall everything
rm -rf node_modules package-lock.json
npm install
npm run dev
```

### Issue: Styles Not Loading

```bash
# Clear Tailwind cache
rm -rf .vite
npm run dev
```

---

## 📊 Sample Data Structure

```javascript
// KPI Cards
{
  title: "Active Buses",
  value: 24,
  subtitle: "of 30 total",
  icon: <Bus size={24} />,
  badgeLabel: "+2 today",
  badgeType: "success"
}

// Alerts
{
  busNumber: "Bus #12",
  message: "8 min delay on Route 5",
  timestamp: "2 min ago",
  type: "delay" // 'delay' | 'warning' | 'success'
}

// Routes
{
  route: "Navsari → Badnera",
  buses: 5,
  avgDelay: "2 min",
  passengers: 142,
  status: "Active" // 'Active' | 'Delayed' | 'Maintenance'
}
```

---

## 🎨 Customization Tips

### Change KPI Values

Edit `Dashboard.tsx` line ~490:

```typescript
const statCards = [
  { value: YOUR_NUMBER, ... }
]
```

### Add More Routes/Alerts

Edit respective data arrays in Dashboard.tsx

### Change Colors

Edit `adminDesignTokens.ts`:

```typescript
adminColors.primary.base = "#NEW_COLOR";
```

### Add New Nav Items

Edit sidebar menu in Dashboard.tsx (around line ~380)

---

## 📈 Next Features to Build

1. Routes Management Page
2. Buses Management Page
3. Stops Management Page
4. Real-time data integration
5. Charts and analytics
6. User authentication
7. Admin settings
8. Mobile responsiveness

---

## 🔗 Help & Documentation

| Resource           | Location                          |
| ------------------ | --------------------------------- |
| Full Design System | `DESIGN_SYSTEM.md`                |
| Admin README       | `README.md`                       |
| How to Run         | `HOW_TO_RUN.md` (this file)       |
| Project Docs       | `../PROJECT_DOCUMENTATION.md`     |
| Design Tokens Code | `src/lib/adminDesignTokens.ts`    |
| Components Code    | `src/components/common/index.tsx` |

---

**Created**: April 2025
**Status**: ✅ Ready to Use
**Version**: 1.0
