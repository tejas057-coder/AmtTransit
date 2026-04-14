# How to Open & Run the Admin Panel

Complete guide to set up and access the AmravatiTransit Admin Dashboard.

## 📋 Prerequisites

- Node.js 16+ installed
- npm or yarn package manager
- Backend API running (optional, but recommended)
- Git

## 🚀 Quick Start (3 Steps)

### Step 1: Navigate to Admin Directory

```bash
cd AmravatiTransit/admin
```

### Step 2: Install Dependencies

```bash
npm install
```

This installs all required packages:

- React 18+
- Vite (build tool)
- TypeScript
- Tailwind CSS
- Lucide React icons
- React Router

### Step 3: Start Development Server

```bash
npm run dev
```

You should see:

```
  VITE v5.4.19  ready in 2915 ms

  ➜  Local:   http://localhost:5174/
  ➜  Network: http://192.168.x.x:5174/
```

## 🌐 Access the Admin Panel

### In VS Code Browser

1. Click "Open in Browser" when prompted in terminal
2. Or open the integrated browser
3. Navigate to: **http://localhost:5174**

### In External Browser

1. Open your web browser (Chrome, Firefox, Safari, Edge)
2. Go to: **http://localhost:5174**
3. You'll see the Admin Dashboard with:
   - Sidebar on the left (240px wide, dark background)
   - Top header with greeting and notifications
   - Dashboard with KPI cards, fleet overview, alerts, and route health table

## 📊 What You'll See

### Dashboard Sections (from top to bottom):

1. **Sidebar Navigation** (Left)
   - AmravatiTransit logo "AT" in yellow
   - Menu items: Dashboard (active), Routes, Buses, Stops, Schedule, Trips, Analytics, Settings

2. **Header** (Top)
   - Greeting: "Good morning/afternoon/evening, Admin"
   - Current date
   - Notification bell with indicator
   - Admin avatar

3. **KPI Stat Cards** (4-column grid)
   - Active Buses: 24 / 30
   - Total Routes: 12
   - Passengers Today: 4,821 (+12% trend)
   - Total Stops: 87

4. **Fleet Overview & Alerts** (2-column section)
   - Left: Live map placeholder with 6 bus markers
   - Right: Recent alerts feed with 3 sample alerts

5. **Route Health Table**
   - Route names, buses assigned, delays, passengers, status

## 🔧 Available Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run linter
npm run lint

# Type check
npm run type-check
```

## 🔌 Connect to Backend

If you want to connect the admin panel to your backend API:

### 1. Create `.env.local` in admin folder

```bash
echo "VITE_API_URL=http://localhost:5000/api" > .env.local
```

### 2. Update API client (optional)

Edit `admin/src/lib/api.ts`:

```typescript
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
});
```

### 3. Start backend server

In a separate terminal:

```bash
cd backend
npm run dev
# Server runs on http://localhost:5000
```

Now admin panel can fetch data from your backend API.

## 🗂️ Project Structure

```
admin/
├── src/
│   ├── pages/
│   │   └── Dashboard.tsx          # ✨ Current page (just created!)
│   ├── components/
│   │   └── common/
│   │       └── index.tsx          # Reusable components
│   ├── lib/
│   │   ├── adminDesignTokens.ts  # Design system
│   │   └── api.ts                # API client
│   ├── App.tsx                    # Root component
│   ├── main.tsx                   # Entry point
│   └── index.css                  # Global styles
├── DESIGN_SYSTEM.md              # Complete design reference
├── README.md                      # Full documentation
└── package.json
```

## 🎨 Design System

The dashboard uses Rapido-inspired design with:

- **Dark theme**: Background #0D0D0D, Cards #1A1A1A
- **Yellow accent**: #FFD000 for highlights and CTAs
- **Status colors**: Green (#22C55E), Red (#FF4444), Orange (#FF9900)
- **Typography**: Inter font, professional hierarchy
- **Components**: Buttons, cards, badges, tables, alerts

📚 See [DESIGN_SYSTEM.md](./DESIGN_SYSTEM.md) for complete reference.

## 🐛 Troubleshooting

### Port Already in Use

If port 5174 is already in use:

```bash
# Find process using port 5174 (macOS/Linux)
lsof -i :5174

# Kill process (replace PID)
kill -9 <PID>

# Or let Vite use next available port
npm run dev
```

### Module Not Found

```bash
# Clear dependencies and reinstall
rm -rf node_modules package-lock.json
npm install
npm run dev
```

### TypeScript Errors

```bash
# Check for type issues
npm run type-check

# Fix ESLint issues
npm run lint
```

### Build Issues

```bash
# Clear cache and rebuild
rm -rf dist .vite
npm run build
```

## 📱 Responsive Design

The admin dashboard is responsive and works on:

- ✅ Desktop (1920px+)
- ✅ Laptop (1366px+)
- ✅ Tablet (768px+)
- 🔜 Mobile (planned enhancement)

## 🔐 Authentication (Placeholder)

Currently, the dashboard loads without authentication. To add auth:

1. Create `src/hooks/useAuth.ts`
2. Implement login/logout logic
3. Protect dashboard route
4. Store JWT token in localStorage

See [README.md](./README.md) for authentication example.

## 🚀 Next Steps

1. ✅ Dashboard created - you're here!
2. 📝 Create Routes page (next)
3. 🚌 Create Buses management page
4. 📍 Create Stops management page
5. 🔗 Connect to real backend API
6. 🔐 Add authentication
7. 📊 Add data visualization charts
8. 📱 Add mobile responsiveness

## 📚 File Reference

### Key Files

| File                                    | Purpose               |
| --------------------------------------- | --------------------- |
| `admin/src/pages/Dashboard.tsx`         | Main dashboard page   |
| `admin/src/App.tsx`                     | Root app with routing |
| `admin/src/lib/adminDesignTokens.ts`    | All design tokens     |
| `admin/src/components/common/index.tsx` | Reusable components   |
| `admin/DESIGN_SYSTEM.md`                | Design documentation  |

### Configuration

| File                 | Purpose                  |
| -------------------- | ------------------------ |
| `tailwind.config.ts` | Tailwind CSS theme       |
| `vite.config.ts`     | Vite configuration       |
| `tsconfig.json`      | TypeScript configuration |
| `eslint.config.js`   | ESLint configuration     |
| `.env.local`         | Environment variables    |

## 🔗 Useful Links

- **Local Admin Panel**: http://localhost:5174/
- **Backend API**: http://localhost:5000/api
- **Frontend App**: http://localhost:8081/
- **Design System**: [DESIGN_SYSTEM.md](./DESIGN_SYSTEM.md)
- **Admin README**: [README.md](./README.md)

## 💡 Tips

1. **Hot Module Replacement (HMR)**
   - Changes in code instantly reload in browser
   - No need to restart dev server

2. **DevTools**
   - Right-click → Inspect to see element styling
   - Check Console for errors
   - Use Network tab to debug API calls

3. **Component Development**
   - Keep components in `src/components/`
   - Use design tokens from `adminDesignTokens.ts`
   - Follow component patterns in `common/index.tsx`

4. **Styling**
   - Use Tailwind classes when possible
   - Use design tokens for consistency
   - Check `DESIGN_SYSTEM.md` for available utilities

## ✅ Verification Checklist

After starting the admin panel, verify:

- [ ] Page loads at http://localhost:5174/
- [ ] Sidebar visible on left with "AT" logo
- [ ] Header shows greeting and date
- [ ] 4 KPI stat cards displayed
- [ ] Fleet map placeholder visible
- [ ] Recent alerts section visible
- [ ] Route health table with 3 rows
- [ ] All colors match design system
- [ ] No console errors

## 🎉 Success!

If you see all the above, your admin panel is running successfully!

---

## 📞 Support

- **Design Questions**: See [DESIGN_SYSTEM.md](./DESIGN_SYSTEM.md)
- **Component Usage**: See `src/components/common/index.tsx`
- **General Help**: Check [README.md](./README.md)
- **Project Info**: See [../PROJECT_DOCUMENTATION.md](../PROJECT_DOCUMENTATION.md)

---

**Last Updated**: April 2025
**Admin Panel Version**: 1.0
**Status**: Ready to Use ✅
