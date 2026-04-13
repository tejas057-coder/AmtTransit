# 🚌 AmravatiTransit — Real-Time Bus Tracking System

> A civic technology platform for real-time public bus tracking in **Amravati, Maharashtra**, built for passengers, drivers, and city administrators.

---

## 📌 Overview

AmravatiTransit is a full-stack web application that provides live GPS-based tracking of MSRTC/city buses across Amravati city. The platform serves three distinct user roles — **passengers**, **bus drivers**, and **administrators** — each with a dedicated interface tailored to their needs.

The system combines real-time location broadcasting, intelligent notification delivery, and interactive maps to make public bus travel in Amravati more predictable and accessible.

---

## 🎯 Problem Statement

Public bus commuters in Amravati lack reliable information about:
- Where their bus currently is
- When it will arrive at their stop
- Whether it is delayed or cancelled

AmravatiTransit solves this by placing live, GPS-accurate bus data directly in the hands of every commuter via a simple web interface.

---

## ✨ Key Features

- **Live Bus Tracking** — Real-time GPS position of every active bus on an interactive Leaflet map centered on Amravati
- **ETA Notifications** — Automatic alerts when a bus is approaching a saved stop
- **Route & Schedule Management** — Full timetable for all city routes with weekday and weekend schedules
- **Delay Alerts** — Instant push notifications when a bus falls behind schedule
- **Driver Portal** — Dedicated interface for drivers to broadcast location, report delays, and manage trips
- **Admin Dashboard** — Fleet-wide monitoring, route management, driver assignment, and analytics
- **Geolocation Support** — Auto-detects the nearest bus stop based on the passenger's live location
- **Notification System** — Categorized, real-time alerts for delays, diversions, arrivals, and announcements

---

## 🗺️ Coverage Area

**City:** Amravati, Maharashtra, India  
**Map Center:** `[20.9320, 77.7523]`  
**Map Bounds:** SW `[20.88, 77.68]` → NE `[20.98, 77.82]`

### Covered Routes (Phase 1)

| Route | From | To |
|-------|------|----|
| Route 1 | Rajkamal Chowk | Badnera Railway Station |
| Route 2 | SICOM | Amravati Railway Station via Cotton Market |
| Route 3 | Jaistambh Chowk | VNIT Campus via Shivajinagar |
| Route 4 | Fruit Market | Engineering College via Fawara Chowk |
| Route 5 | Irwin Square | Sant Gadge Baba Amravati University |
| Route 6 | Gandhi Bagh | Morshi Road via Cidco |

### Key Stops

Rajkamal Chowk · Jaistambh Chowk · Irwin Square · Fawara Chowk · SICOM · Cotton Market · Badnera Station · Amravati Railway Station · Sant Gadge Baba University · Tapadia Stadium · Gandhi Bagh · VNIT Campus · Morshi Naka · Engineering College Chowk · Shivajinagar

---

## 🖥️ Application Pages

| # | Page | Access | Description |
|---|------|--------|-------------|
| 1 | **Live Map** | Public | Interactive map with real-time bus positions and nearby stop ETAs |
| 2 | **Routes** | Public | All city routes with stop details, frequency, and operating hours |
| 3 | **Bus Stops** | Public | Searchable stop directory with next-bus countdowns |
| 4 | **Schedule** | Public | Route-wise timetable with live status (on-time / delayed / cancelled) |
| 5 | **Notifications** | Passenger | Categorized alerts — delays, arrivals, diversions, announcements |
| 6 | **My Trips** | Passenger | Saved stops, trip history, and favourite routes |
| 7 | **Driver Portal** | Driver | Trip management, GPS broadcasting, delay reporting, stop marking |
| 8 | **Admin Dashboard** | Admin | Fleet overview, route/stop management, driver assignment, analytics |

---

## 🔔 Notification System

Notifications are delivered in real-time via WebSocket and categorized as:

| Type | Trigger |
|------|---------|
| 🔴 Delay Alert | Bus is more than 5 minutes behind schedule |
| 🟢 Bus Approaching | Bus is within 5 minutes of a saved stop |
| 🟡 Route Diversion | Route path temporarily altered |
| 🔴 Service Cancelled | A scheduled trip has been cancelled |
| 🟢 Service Restored | A previously delayed/cancelled bus is back on schedule |
| 🔵 Peak Hours Warning | High passenger load expected |
| ⚪ System Announcement | General information from admin |

Passengers can configure notification preferences — per category, per stop, with quiet hours and custom alert thresholds.

---

## 🧑‍💼 User Roles

### Passenger
Browse live map, view schedules, save stops, receive arrival/delay alerts, track trip history.

### Driver
Log in to Driver Portal, start/end trips, broadcast live GPS, mark stops as reached, report delays or route deviations, send emergency alerts.

### Admin
Access the Admin Dashboard to monitor the entire fleet, manage routes and stops, assign drivers to buses, and view ridership and performance analytics.

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js (App Router) + Tailwind CSS |
| Map | Leaflet.js / React-Leaflet + OpenStreetMap |
| Real-time | Socket.IO (client + server) |
| Animations | Framer Motion |
| Icons | Lucide React |
| Charts | Recharts |
| Font | Inter (Google Fonts) |
| State Management | Zustand / Context API |
| Backend | Node.js + Express |
| Database | MongoDB Atlas |
| Authentication | JWT + bcrypt (role-based) |

---

## 🗄️ Database Collections

- `buses` — vehicle registry, current assignment, live status
- `routes` — route definitions, stop sequences, schedules
- `stops` — GPS coordinates, routes served, metadata
- `trips` — individual scheduled and historical trip records
- `drivers` — driver profiles, assigned vehicle, trip history
- `users` — passenger accounts, saved stops, preferences
- `notifications` — event log for all alerts dispatched

---

## 🎨 Design System

| Token | Value |
|-------|-------|
| Primary Blue | `#2563EB` |
| Background | `#F8FAFC` |
| Surface | `#FFFFFF` |
| Success Green | `#16A34A` |
| Warning Amber | `#D97706` |
| Danger Red | `#DC2626` |
| Live Indicator | `#22C55E` (pulsing) |
| Font | Inter — 400 / 500 / 600 / 700 |
| Border Radius | `rounded-2xl` (cards), `rounded-full` (badges) |

UI inspiration: [CivicPulse](https://github.com/hashirkonnola2006-design/CivicPulse) — clean white/slate sidebar layout with blue accent system.

---

## 📂 Project Structure

```
amravatitransit/
├── frontend/               # Next.js app
│   ├── app/                # App Router pages
│   ├── components/
│   │   ├── layout/         # Sidebar, TopHeader, NotificationPanel
│   │   ├── map/            # LiveMap, BusMarker, StopMarker, RoutePolyline
│   │   ├── bus/            # BusCard, BusListPanel, ETABadge
│   │   ├── notifications/  # NotificationToast, NotificationFeed, AlertBadge
│   │   ├── schedule/       # ScheduleTable, TripRow
│   │   └── admin/          # FleetMap, StatsCard, DriverTable
│   └── public/
├── backend/                # Node.js + Express server
│   ├── routes/             # REST API routes
│   ├── models/             # Mongoose schemas
│   ├── sockets/            # Socket.IO event handlers
│   └── middleware/         # Auth, role guards
└── README.md
```

---

## ⚡ Real-Time Events (Socket.IO)

| Event | Direction | Description |
|-------|-----------|-------------|
| `bus:location_update` | Server → Client | Move bus marker on map |
| `bus:delay` | Server → Client | Update ETAs + trigger notification |
| `bus:arrived` | Server → Client | Mark stop reached, trigger alert |
| `bus:trip_started` | Server → Client | Add bus to live map |
| `bus:trip_ended` | Server → Client | Remove bus from map |
| `route:diversion` | Server → Client | Update polyline + notify passengers |
| `admin:broadcast` | Server → Client | System-wide announcement toast |
| `driver:location_ping` | Client → Server | Driver app sends GPS coordinates |
| `driver:report_delay` | Client → Server | Driver reports delay |
| `driver:emergency` | Client → Server | Emergency alert to admin |

---

## 🚀 Getting Started

### Prerequisites
- Node.js v18+
- MongoDB Atlas account
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/amravatitransit.git
cd amravatitransit

# Install backend dependencies
cd backend && npm install

# Install frontend dependencies
cd ../frontend && npm install
```

### Environment Variables

Create `.env` files in both `backend/` and `frontend/` directories. Refer to `.env.example` in each folder for required keys (MongoDB URI, JWT secret, Socket.IO origin, etc.).

### Running the App

```bash
# Start backend (from /backend)
npm run dev

# Start frontend (from /frontend)
npm run dev
```

Frontend runs on `http://localhost:3000`  
Backend runs on `http://localhost:5000`

---

## 🗺️ Amravati Key Coordinates

| Landmark | Latitude | Longitude |
|----------|----------|-----------|
| Amravati Railway Station | 20.9356 | 77.7695 |
| Rajkamal Chowk | 20.9343 | 77.7601 |
| Badnera Railway Station | 20.9145 | 77.8042 |
| Sant Gadge Baba University | 20.9264 | 77.7476 |
| SICOM | 20.9401 | 77.7534 |
| Jaistambh Chowk | 20.9323 | 77.7574 |
| Irwin Square | 20.9337 | 77.7618 |
| Cotton Market | 20.9271 | 77.7652 |
| Tapadia Stadium | 20.9289 | 77.7509 |
| VNIT Campus | 20.9242 | 77.7502 |

---

## 🤝 Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

---

## 📄 License

This project is licensed under the MIT License. See [LICENSE](LICENSE) for details.

---

## 👨‍💻 Author

Built for Amravati city commuters.  
Inspired by the CivicPulse open-source civic tech design system.

---

*AmravatiTransit — Making public transit smarter, one stop at a time. 🚌*
