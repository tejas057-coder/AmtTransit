# 🚌 AmravatiTransit — Real-Time Bus Tracking System
### Complete UI Design Prompt & Developer Reference

> **Inspired by:** CivicPulse UI (clean white + blue civic app aesthetic)
> **City:** Amravati, Maharashtra, India
> **Stack:** Next.js · Tailwind CSS · Leaflet.js · Socket.IO · MongoDB Atlas · Node.js/Express

---

## 🎨 Theme & Design Language

| Token | Value | Usage |
|---|---|---|
| Primary | `#2563EB` (Blue-600) | Buttons, active nav, live indicators |
| Background | `#F8FAFC` (Slate-50) | Page backgrounds |
| Surface | `#FFFFFF` | Cards, panels |
| Sidebar | `#FFFFFF` + `border-r border-slate-200` | Left navigation |
| Text Primary | `#0F172A` (Slate-900) | Headings, body |
| Text Muted | `#94A3B8` (Slate-400) | Labels, placeholders |
| Success | `#16A34A` (Green-600) | On-time buses |
| Warning | `#D97706` (Amber-600) | Delayed buses |
| Danger | `#DC2626` (Red-600) | Cancelled / emergency |
| Live Dot | `#22C55E` (Green-500) | Pulsing real-time animation |

```css
/* Pulsing live indicator */
@keyframes pulse-live {
  0%, 100% { opacity: 1; transform: scale(1); }
  50%       { opacity: 0.5; transform: scale(1.4); }
}
.live-dot { animation: pulse-live 1.5s ease-in-out infinite; }
```

**Font:** Inter — weights 400, 500, 600, 700, 800, 900  
**Border Radius:** `rounded-2xl` cards · `rounded-full` badges/avatars  
**Shadows:** `shadow-sm` cards · `shadow-xl` active nav items  
**Icons:** Lucide React throughout

---

## 🗺️ Map Configuration — Amravati

```js
// Default map config
const MAP_CENTER = [20.9320, 77.7523]; // Amravati city center
const DEFAULT_ZOOM = 13;
const TILE_URL = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";

// Bounding box
const BOUNDS = {
  sw: [20.88, 77.68],
  ne: [20.98, 77.82],
};
```

### Key Stop Coordinates

| Stop Name | Latitude | Longitude |
|---|---|---|
| Rajkamal Chowk | 20.9343 | 77.7601 |
| Jaistambh Chowk | 20.9323 | 77.7574 |
| Irwin Square | 20.9337 | 77.7618 |
| Fawara Chowk | 20.9298 | 77.7589 |
| SICOM | 20.9401 | 77.7534 |
| Cotton Market | 20.9271 | 77.7652 |
| Amravati Railway Station | 20.9356 | 77.7695 |
| Badnera Railway Station | 20.9145 | 77.8042 |
| Sant Gadge Baba University | 20.9264 | 77.7476 |
| Tapadia Stadium | 20.9289 | 77.7509 |
| VNIT Campus | 20.9242 | 77.7502 |
| Gandhi Bagh | 20.9312 | 77.7541 |
| Morshi Naka | 20.9198 | 77.7688 |
| Engineering College Chowk | 20.9231 | 77.7467 |
| Shivajinagar | 20.9278 | 77.7485 |

---

## 📐 Global Layout Structure

```
Root Layout
├── Sidebar (fixed · 280px · hidden on mobile)
│   ├── Logo: Bus icon + "AmravatiTransit" font-black
│   ├── Nav Items (rounded-2xl · blue bg + white text when active)
│   │   🗺️  Live Map
│   │   🚌  Routes
│   │   🛑  Bus Stops
│   │   📅  Schedule
│   │   🔔  Notifications   ← badge with unread count
│   │   🧳  My Trips
│   │   ℹ️  Help
│   └── Bottom: avatar + name + logout button
│
├── Top Header (h-16 · white · border-b · mobile only)
│   ├── Left: Bus icon + "AmravatiTransit"
│   └── Right: Bell icon (badge) + User avatar
│
└── Main Content (flex-1 · overflow-y-auto · bg-slate-50)
    └── [Page Content renders here]
```

---

## 📄 Page 1 — Live Map (Default Home)

**Route:** `/` or `/live-map`

```
Layout: Full-height horizontal split

LEFT PANEL (420px · scrollable · bg-white · border-r)
├── Search Bar
│   • Input: "Search routes, stops in Amravati..."
│   • Lucide Search icon left · clear X icon right
│   • On focus: dropdown with recent/saved stops
│
├── Filter Pill Tabs
│   [All Buses]  [On Route]  [Delayed]  [At Stop]
│
├── Live Stats Row (3 mini stat cards · bg-slate-50)
│   ┌─────────────┐ ┌─────────────┐ ┌─────────────┐
│   │ 🟢 12       │ │ 🟡 3        │ │ 🛑 5        │
│   │ Buses Active│ │ Delayed     │ │ Stops Nearby│
│   └─────────────┘ └─────────────┘ └─────────────┘
│
├── Active Bus Cards (scrollable list)
│   ┌──────────────────────────────────────────┐
│   │  🚌 Bus #AM-24           [● LIVE]        │
│   │  Route: Rajkamal Chowk → SICOM          │
│   │  Next Stop: Irwin Square — 4 min         │
│   │  Speed: 28 km/h   Passengers: 34 / 50   │
│   │  ──────────────────────────────────────  │
│   │  [Track Bus]              [View Route]   │
│   └──────────────────────────────────────────┘
│   (● live dot pulses green · on-time = green border · delayed = amber)
│
└── Nearby Stops Section (geolocation-detected)
    Each stop card:
    ┌──────────────────────────────────────────┐
    │ 📍 Rajkamal Chowk           0.3 km away  │
    │ Routes: 1 · 2 · 4 · 6                   │
    │ Next: Route 1 → 3 min 🟢                │
    │       Route 4 → 7 min 🟡                │
    │       Route 6 → 12 min 🟢              │
    │ [Set Alert]                             │
    └──────────────────────────────────────────┘

RIGHT PANEL (flex-1) — Leaflet Map
├── Centered: Amravati [20.9320, 77.7523] zoom 13
├── Bus Markers: animated SVG bus icons · move smoothly between coords
│   • Green marker = on-time
│   • Amber marker = delayed (> 5 min)
│   • Red marker   = emergency / cancelled
│   • Pulsing ring = last update < 10 seconds
├── Stop Markers: orange pins · click → popup
│   Popup: stop name · routes passing · next 3 ETAs
├── Route Polyline: blue dashed line (shown on route select)
├── User Location: pulsing blue dot (navigator.geolocation.watchPosition)
└── Map Controls (top-right overlay)
    • [📍 My Location] button
    • [🗺️ Route Mode] toggle
    • Standard zoom +/−
```

---

## 📄 Page 2 — Routes

**Route:** `/routes`

```
Header: "Bus Routes — Amravati City"
Subtitle: "6 routes currently operating"

Search + Filter bar:
• Input: "Search route name or destination..."
• Sort: [Nearest Stop] [Route Number] [Most Active]

Route Cards Grid (2 columns on desktop · 1 on mobile):
┌────────────────────────────────────────────┐
│  🚌 Route 1                                │
│  Rajkamal Chowk → Badnera Railway Station  │
│  ─────────────────────────────────────     │
│  Stops: 14  ·  Distance: 8.2 km           │
│  Frequency: Every 15 min                  │
│  First Bus: 06:00 AM  Last Bus: 10:30 PM  │
│  ● 2 Buses Active right now               │
│  ─────────────────────────────────────     │
│  [View on Map]         [See Schedule]      │
└────────────────────────────────────────────┘

Amravati Routes Reference:
• Route 1: Rajkamal Chowk → Fawara → Irwin → Badnera Station
• Route 2: SICOM → Jaistambh → Amravati Station → Cotton Market
• Route 3: Jaistambh Chowk → Shivajinagar → VNIT Campus
• Route 4: Fruit Market → Fawara Chowk → Engineering College
• Route 5: Irwin Square → Tapadia Stadium → SGBAMravati University
• Route 6: Gandhi Bagh → Cidco Colony → Morshi Road

Route Detail Modal/Drawer (slides from right on card click):
├── Mini Leaflet map (350px tall) — route polyline highlighted
├── Stop Timeline (vertical)
│   ● Rajkamal Chowk         06:00 AM
│   ● Fawara Chowk           06:08 AM
│   ● Irwin Square           06:14 AM
│   ● Cotton Market          06:22 AM
│   ● Amravati Station       06:35 AM
├── Schedule tabs: [Weekday] [Saturday] [Sunday]
├── Live buses on this route right now (mini cards)
└── [Close]  [Set Route Alert]  [View Full Schedule]
```

---

## 📄 Page 3 — Bus Stops

**Route:** `/stops`

```
Header: "Bus Stops — Amravati"
Right of header: [📍 Find Nearest Stop] button

Layout: Left panel (420px) + Right Leaflet map

LEFT — Stops list
Search: "Search stop name..."
Sort: [A–Z] [Nearest First] [Most Routes]

Stop Card:
┌──────────────────────────────────────────────┐
│ 📍 Rajkamal Chowk                            │
│ Routes passing: 1 · 2 · 4 · 6               │
│ ──────────────────────────────────────────   │
│ Upcoming buses:                              │
│  Route 1 → Bus AM-24 — 3 min  🟢 On Time    │
│  Route 4 → Bus AM-11 — 7 min  🟡 Delayed    │
│  Route 6 → Bus AM-33 — 12 min 🟢 On Time    │
│ ──────────────────────────────────────────   │
│ [View on Map]    [🔔 Set Arrival Alert]      │
└──────────────────────────────────────────────┘

RIGHT — Leaflet Map
• All stop markers rendered as orange pins
• Click pin → left panel scrolls to + highlights that stop card
• [Near Me] button → sorts list by geolocation proximity
• User location shown as pulsing blue dot
```

---

## 📄 Page 4 — Schedule

**Route:** `/schedule`

```
Header: "Bus Schedule"
Controls row:
  • Route selector: [Route 1 — Rajkamal → Badnera ▾]
  • Date picker: [Today · Mon 14 Apr ▾]
  • Tabs: [Today] [Tomorrow] [This Week]

Schedule Table:
┌────────┬─────────────────────┬──────────────────┬──────────┐
│ Trip # │ Departure            │ Arrival          │ Status   │
├────────┼─────────────────────┼──────────────────┼──────────┤
│ T-001  │ Rajkamal  06:00 AM  │ Badnera 06:35 AM │ ✅ Done  │
│ T-002  │ Rajkamal  06:30 AM  │ Badnera 07:05 AM │ 🔴 -8m  │
│ T-003  │ Rajkamal  07:00 AM  │ Badnera 07:35 AM │ 🟢 Live  │
│ T-004  │ Rajkamal  07:30 AM  │ Badnera 08:05 AM │ 🕐 Soon  │
│ T-005  │ Rajkamal  08:00 AM  │ Badnera 08:35 AM │ 🕐 Sched │
└────────┴─────────────────────┴──────────────────┴──────────┘

Status legend: ✅ Completed · 🟢 Live · 🕐 Scheduled · 🟡 Delayed · 🔴 Cancelled

Row click → expands accordion:
  • All intermediate stops with timestamps
  • Assigned bus number + driver name
  • Real-time delay reason (if any)
  • Progress bar showing trip completion %

Filter bar: [All] [On-Time] [Delayed] [Cancelled]
Export button: [↓ Download PDF Schedule]
```

---

## 📄 Page 5 — Notifications

**Route:** `/notifications`

```
Header: "Notifications"
Right: [✓ Mark All Read]  [⚙ Notification Settings]

Filter tabs (pill style):
[All]  [Delays 🔴]  [Alerts 🟡]  [Updates 🔵]  [My Routes ⭐]

──────────────────────────────────────────────────────
Notification Card anatomy:
┌───────────────────────────────────────────────────┐
│ [TYPE BADGE]                          [timestamp] │
│ Title line (font-semibold)                        │
│ Body text description (text-slate-600)            │
│ Affected: stop name / route number                │
│ [Primary CTA]                  [Dismiss]          │
└───────────────────────────────────────────────────┘

Notification Types & Colors:

🔴 DELAY ALERT
   "Bus #AM-24 on Route 2 is running 12 minutes behind schedule
    near Irwin Square. Affected stop: Fawara Chowk."
   CTA: [View on Map]

🟢 BUS APPROACHING
   "Route 4 bus is arriving at Rajkamal Chowk in ~3 minutes.
    Bus: AM-11 · Seats available: 16"
   CTA: [View Bus]

🟡 ROUTE DIVERSION
   "Route 3 temporarily diverted via Shivajinagar due to road
    work near VNIT. Expected: 2 hours."
   CTA: [View Alternate Route]

🔴 SERVICE CANCELLED
   "Trip T-006 on Route 1 (08:30 AM) has been cancelled.
    Next available: 09:00 AM."
   CTA: [See Alternatives]

🟢 SERVICE RESTORED
   "Route 2 is back on normal schedule. Delays resolved."
   CTA: [View Route]

🔵 PEAK HOURS WARNING
   "High passenger load expected on Route 5 (5:30–7:30 PM).
    Consider Route 3 as alternate."
   CTA: [Plan Journey]

⚫ SYSTEM ANNOUNCEMENT
   "AmravatiTransit will undergo maintenance on Sunday 20 Apr
    from 11 PM – 2 AM. Services reduced."
   CTA: [Read More]

──────────────────────────────────────────────────────
Notification Settings Panel (slide-in drawer):
  Toggle per-type:
    ☑ Delay Alerts
    ☑ Bus Approaching (my saved stops)
    ☑ Route Diversions
    ☑ Cancellations
    ☐ Peak Hour Warnings
    ☑ System Announcements

  Saved Stops for alerts:
    📍 Rajkamal Chowk  [Remove]
    📍 SICOM           [Remove]
    [+ Add Stop]

  Alert threshold:
    ○ 2 min before  ● 5 min before  ○ 10 min before

  Quiet Hours:
    From [10:00 PM] To [06:00 AM]  [Toggle ON/OFF]
```

---

## 📄 Page 6 — My Trips (Passenger Profile)

**Route:** `/my-trips`

```
Top: Profile Card (bg-white · rounded-2xl · shadow-sm)
┌────────────────────────────────────────────┐
│  👤  Rahul Sharma                          │
│  📧  rahul@gmail.com                       │
│  Saved Stops: 3  ·  Total Trips: 47       │
│  Member since: Jan 2025                    │
│  [Edit Profile]                            │
└────────────────────────────────────────────┘

Tabs: [Saved Stops]  [Recent Trips]  [Favourite Routes]

── SAVED STOPS tab ──────────────────────────────────
Each row:
  📍 Rajkamal Chowk
     Next bus: Route 1 → 4 min  🟢
     [🗺 View]  [🔔 Notify]  [🗑 Remove]  [🏠 Set as Home]

[+ Add New Stop] button → opens stop search modal

── RECENT TRIPS tab ─────────────────────────────────
Trip card:
┌──────────────────────────────────────────────────┐
│ 📅 Today · 8:32 AM                               │
│ Route 2 · Rajkamal Chowk → Amravati Station      │
│ Duration: 22 min  ·  ✅ On Time                  │
│ Bus: AM-24  ·  Driver: Suresh Patil              │
└──────────────────────────────────────────────────┘

── FAVOURITE ROUTES tab ─────────────────────────────
Route card with ⭐ toggle
One-tap [View on Map] per route
Quick ETA for next departure shown inline
```

---

## 📄 Page 7 — Driver Dashboard

**Route:** `/driver`  ← separate login, role = `driver`

```
Layout: Full screen · clean white · no sidebar

Top Bar (blue · h-16):
  Left:  🚌 "AmravatiTransit — Driver Portal"
  Right: Status badge [● Active] or [○ Off Duty]  ·  Avatar

Main Panel (centered card · max-w-2xl):
┌────────────────────────────────────────────────────┐
│  Driver: Suresh Patil                              │
│  Bus:    AM-24   ·   Route: 2                     │
│  ──────────────────────────────────────────────   │
│  [ ▶  START TRIP ]      [ ⏹  END TRIP ]          │
│  ──────────────────────────────────────────────   │
│  Status:   Broadcasting GPS  ●  (live pulsing)    │
│  Speed:    34 km/h                                │
│  Next Stop: Irwin Square                          │
│  Passengers Onboard: 28 / 50                      │
│  Trip Duration: 00:18:42  (timer counting up)     │
└────────────────────────────────────────────────────┘

Mini Leaflet Map (400px tall):
  • Centered on bus's own GPS position
  • Route polyline shown · completed stops grayed out
  • Current position = blue animated bus marker

Trip Progress Timeline (horizontal stepper):
  Rajkamal ✅ → Fawara ✅ → Irwin [current] → SICOM → Cotton Mkt → ...
  Each reached stop turns green · current stop pulses

Quick Action Buttons (2×2 grid):
  ┌─────────────────────┐  ┌──────────────────────┐
  │ 🟡 Report Delay      │  │ 🔀 Route Deviation    │
  │ Broadcasts to users  │  │ Mark path change      │
  └─────────────────────┘  └──────────────────────┘
  ┌─────────────────────┐  ┌──────────────────────┐
  │ 🚨 Emergency Alert   │  │ ✅ Mark Stop Reached  │
  │ Notifies admin       │  │ Tap at each stop      │
  └─────────────────────┘  └──────────────────────┘

Report Delay Modal (on button click):
  • Reason dropdown: Traffic · Road Block · Mechanical · Weather · Other
  • Estimated delay: [__] minutes
  • Note (optional textarea)
  • [Submit & Notify Passengers]
```

---

## 📄 Page 8 — Admin Dashboard

**Route:** `/admin`  ← separate login, role = `admin`

```
Layout: Full screen · sidebar same as passenger but with admin nav items

Admin Nav Items:
  📊  Overview
  🗺️  Fleet Monitor
  🚌  Manage Routes
  🛑  Manage Stops
  👨‍✈️  Drivers
  📋  Reports
  ⚙️  Settings

── OVERVIEW tab ─────────────────────────────────────
Stats Row (4 cards · bg-white · shadow-sm):
  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐
  │ 🚌 12    │ │ 🛣 6     │ │ 🛑 15    │ │ 🔴 3     │
  │ Active   │ │ Routes   │ │ Stops    │ │ Alerts   │
  │ Buses    │ │Operating │ │Monitored │ │ Pending  │
  └──────────┘ └──────────┘ └──────────┘ └──────────┘

Quick alert feed (right side · 300px panel):
  Recent system events streamed via socket

── FLEET MONITOR tab ────────────────────────────────
Full-viewport Leaflet map
  • ALL active buses shown simultaneously
  • Color: 🟢 on-time · 🟡 delayed · 🔴 emergency
  • Click any bus → info popup:
      Bus number · Driver name · Route · Speed · Passengers
      [Message Driver]  [Mark Alert]  [End Trip]
  • Sidebar list (200px) of all buses · quick status scan
  • Filter: [All] [Delayed Only] [Emergency]

── MANAGE ROUTES tab ─────────────────────────────────
Table:
  ID · Name · From → To · Stops · Status · Actions
  [+ Add New Route] button → form modal:
    Route number · Name · Start stop · End stop
    Add stops (drag to reorder) · Set schedule
    [Save Route]

── MANAGE STOPS tab ──────────────────────────────────
Table: ID · Name · Coordinates · Routes · Actions
[+ Add Stop] → map-click picker to drop pin + fill name
Edit: rename, update coordinates, assign/remove routes

── DRIVERS tab ───────────────────────────────────────
Table: Name · ID · Assigned Bus · Status · Today's Trips
[Assign Bus] dropdown per driver
[View Trip History] → modal with date-filtered trips

── REPORTS tab ───────────────────────────────────────
Recharts visualizations:
  1. Daily Ridership Bar Chart (7-day range)
  2. On-Time % per Route (horizontal bar)
  3. Most Used Stops (top 10 · horizontal bar)
  4. Peak Hours Heatmap (hour vs. day grid)
  5. Delay Frequency Line Chart

Date range picker: [Last 7 Days ▾]
Export: [↓ CSV] [↓ PDF Report]
```

---

## ⚡ Real-Time System — Socket.IO Events

### Server → Client Events

```js
// Bus location update — move marker on map
socket.on('bus:location_update', ({ busId, lat, lng, speed, heading }) => {
  // Smoothly animate bus marker to new coords
  // Update ETA for all downstream stops
  // Refresh left panel bus card
});

// Bus is delayed
socket.on('bus:delay', ({ busId, routeId, delayMinutes, nearStop }) => {
  // Update ETA badges (amber color)
  // Push notification toast
  // Update notification feed
  // Increment notification badge count
});

// Bus arrived at stop
socket.on('bus:arrived', ({ busId, stopId, timestamp }) => {
  // Mark stop as reached on driver timeline
  // Trigger arrival alerts for users who saved this stop
  // Update stop's upcoming bus list
});

// New trip started
socket.on('bus:trip_started', ({ busId, routeId, driverId }) => {
  // Add bus marker to live map
  // Update active buses count in stats row
});

// Trip ended
socket.on('bus:trip_ended', ({ busId }) => {
  // Remove bus marker from map
  // Decrease active buses count
});

// Route diversion
socket.on('route:diversion', ({ routeId, newPolyline, reason, duration }) => {
  // Update route polyline on map
  // Push diversion notification to all route subscribers
});

// Admin broadcast
socket.on('admin:broadcast', ({ title, message, type }) => {
  // Show full-width system alert banner
  // Add to notification feed as system announcement
});
```

### Client → Server Events

```js
// Driver: update GPS position (every 5 seconds)
socket.emit('driver:location', { busId, lat, lng, speed, heading });

// Driver: mark stop reached
socket.emit('driver:stop_reached', { busId, stopId });

// Driver: report delay
socket.emit('driver:report_delay', { busId, delayMinutes, reason });

// Passenger: subscribe to stop alerts
socket.emit('passenger:watch_stop', { stopId, userId });

// Passenger: unsubscribe
socket.emit('passenger:unwatch_stop', { stopId, userId });
```

---

## 🔔 Notification Toast Component

```jsx
// Slides in from top-right · auto-dismisses after 5s
// Stacks up to 3 toasts simultaneously

<NotificationToast
  type="delay"           // delay | approaching | diversion | cancelled | info
  title="Bus Delayed"
  body="Route 2 delayed by 8 min near Irwin Square"
  cta={{ label: "View Map", action: () => navigate('/live-map?bus=AM-24') }}
  duration={5000}
/>

// Types map to colors:
// delay      → red-50 border-red-400
// approaching→ green-50 border-green-400
// diversion  → amber-50 border-amber-400
// cancelled  → red-50 border-red-600
// info       → blue-50 border-blue-400
```

---

## 📦 Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 14 (App Router) + Tailwind CSS |
| Map | Leaflet.js + React-Leaflet |
| Real-time | Socket.IO client |
| Animations | Framer Motion |
| Icons | Lucide React |
| Charts | Recharts (admin) |
| Font | Inter via Google Fonts |
| State | Zustand |
| Backend | Node.js + Express |
| WebSockets | Socket.IO server |
| Database | MongoDB Atlas |
| Auth | JWT + bcrypt (roles: passenger / driver / admin) |
| Version Control | Git + GitHub |

---

## 🗂️ MongoDB Collections

```js
// buses
{ _id, busNumber, capacity, status, assignedDriver, currentRoute }

// routes
{ _id, routeNumber, name, startStop, endStop, stops: [stopId], schedule, isActive }

// stops
{ _id, name, coordinates: { lat, lng }, routes: [routeId] }

// trips
{ _id, busId, routeId, driverId, startTime, endTime, status, stopsReached: [], delayLog: [] }

// drivers
{ _id, name, email, phone, licenseNo, assignedBus, isActive }

// users
{ _id, name, email, passwordHash, role, savedStops: [stopId], savedRoutes: [routeId] }

// notifications
{ _id, type, title, body, targetUsers, routeId, stopId, read: [userId], createdAt }

// liveLocations (ephemeral · TTL index 30s)
{ busId, lat, lng, speed, heading, timestamp }
```

---

## 🧩 Component Structure

```
/src
├── app/
│   ├── (passenger)/
│   │   ├── page.jsx                  ← Live Map
│   │   ├── routes/page.jsx
│   │   ├── stops/page.jsx
│   │   ├── schedule/page.jsx
│   │   ├── notifications/page.jsx
│   │   └── my-trips/page.jsx
│   ├── driver/page.jsx
│   ├── admin/
│   │   ├── page.jsx                  ← Overview
│   │   ├── fleet/page.jsx
│   │   ├── routes/page.jsx
│   │   ├── stops/page.jsx
│   │   ├── drivers/page.jsx
│   │   └── reports/page.jsx
│   └── auth/
│       ├── login/page.jsx
│       └── register/page.jsx
│
├── components/
│   ├── layout/
│   │   ├── Sidebar.jsx
│   │   ├── TopHeader.jsx
│   │   └── NotificationPanel.jsx     ← slide-in drawer
│   ├── map/
│   │   ├── LiveMap.jsx               ← main Leaflet map
│   │   ├── BusMarker.jsx             ← animated marker
│   │   ├── StopMarker.jsx
│   │   └── RoutePolyline.jsx
│   ├── bus/
│   │   ├── BusCard.jsx
│   │   ├── BusListPanel.jsx
│   │   └── ETABadge.jsx
│   ├── notifications/
│   │   ├── NotificationToast.jsx     ← auto-dismiss popup
│   │   ├── NotificationFeed.jsx
│   │   └── AlertBadge.jsx
│   ├── schedule/
│   │   ├── ScheduleTable.jsx
│   │   └── TripRow.jsx
│   └── admin/
│       ├── FleetMap.jsx
│       ├── StatsCard.jsx
│       └── DriverTable.jsx
│
├── hooks/
│   ├── useSocket.js                  ← Socket.IO connection
│   ├── useGeolocation.js             ← navigator.geolocation
│   ├── useNearbyStops.js             ← proximity detection
│   └── useNotifications.js          ← notification state
│
├── store/
│   ├── busStore.js                   ← Zustand: live buses
│   ├── notificationStore.js          ← Zustand: notifications
│   └── userStore.js                  ← Zustand: auth/profile
│
└── lib/
    ├── socket.js                     ← Socket.IO client init
    ├── amravatiData.js               ← Static stops/routes seed
    └── etaCalculator.js              ← ETA logic
```

---

## 🚀 Pages Summary

| # | Page | Route | Role |
|---|---|---|---|
| 1 | Live Map | `/` | Passenger |
| 2 | Routes | `/routes` | Passenger |
| 3 | Bus Stops | `/stops` | Passenger |
| 4 | Schedule | `/schedule` | Passenger |
| 5 | Notifications | `/notifications` | Passenger |
| 6 | My Trips | `/my-trips` | Passenger |
| 7 | Driver Dashboard | `/driver` | Driver |
| 8 | Admin Overview | `/admin` | Admin |
| 9 | Fleet Monitor | `/admin/fleet` | Admin |
| 10 | Manage Routes | `/admin/routes` | Admin |
| 11 | Manage Stops | `/admin/stops` | Admin |
| 12 | Manage Drivers | `/admin/drivers` | Admin |
| 13 | Reports | `/admin/reports` | Admin |
| 14 | Login | `/auth/login` | All |
| 15 | Register | `/auth/register` | Passenger |

---

*AmravatiTransit — Real-Time Bus Tracking System for Amravati, Maharashtra*  
*Powered by Next.js · Socket.IO · Leaflet.js · MongoDB Atlas*
