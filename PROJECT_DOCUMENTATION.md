# AmravatiTransit - Complete Project Documentation

A modern, full-stack transit management and booking system inspired by Rapido, featuring real-time bus tracking, route management, and an admin panel.

## 📋 Quick Navigation

- **[Frontend Documentation](./frontend/README.md)** - React transit app
- **[Backend Documentation](./backend/README.md)** - Node.js/Express API
- **[Admin Panel Documentation](./admin/README.md)** - Admin dashboard
- **[Project Structure](#-project-structure)** - Directory organization
- **[Architecture](#-architecture)** - System design

## 📁 Project Structure

```
AmravatiTransit/
├── frontend/                      # React transit app for users
│   ├── src/
│   │   ├── components/            # React components
│   │   │   ├── layout/           # Layout components (AppLayout, BottomNav, etc.)
│   │   │   ├── map/              # Map components (LeafletMap, BusRouteMap)
│   │   │   ├── tracking/         # Tracking components (BusTrackingTimeline)
│   │   │   ├── ui/               # shadcn/ui components (Button, Card, etc.)
│   │   │   └── NavLink.tsx
│   │   ├── pages/                # Page components
│   │   │   ├── Index.tsx         # Home page
│   │   │   ├── SchedulePage.tsx  # Schedule view
│   │   │   ├── StopsPage.tsx     # Stops listing
│   │   │   ├── RoutesPage.tsx    # Routes view
│   │   │   ├── NotificationsPage.tsx
│   │   │   ├── HelpPage.tsx
│   │   │   ├── TripsPage.tsx
│   │   │   ├── LiveMapPage.tsx
│   │   │   └── NotFound.tsx
│   │   ├── data/                 # Mock data & utilities
│   │   ├── hooks/                # React hooks
│   │   ├── lib/                  # Utilities & libraries
│   │   │   ├── designTokens.ts  # Design system tokens
│   │   │   └── utils.ts
│   │   ├── types/                # TypeScript type definitions
│   │   ├── App.tsx               # Root component
│   │   ├── main.tsx              # Entry point
│   │   ├── index.css             # Global styles
│   │   └── vite-env.d.ts
│   ├── public/                   # Static assets
│   ├── README.md                 # Frontend documentation
│   ├── package.json
│   ├── vite.config.ts
│   ├── tailwind.config.ts
│   ├── tsconfig.json
│   └── vitest.config.ts
│
├── backend/                       # Node.js/Express API server
│   ├── src/
│   │   ├── controllers/          # Route controllers
│   │   │   ├── busController.ts
│   │   │   ├── routeController.ts
│   │   │   └── stopController.ts
│   │   ├── routes/               # API routes
│   │   │   ├── busesRoute.ts
│   │   │   ├── routesRoute.ts
│   │   │   └── stopsRoute.ts
│   │   ├── models/               # Data models
│   │   │   ├── Bus.ts
│   │   │   ├── Route.ts
│   │   │   └── Stop.ts
│   │   ├── types/                # TypeScript types
│   │   ├── data/                 # Mock data
│   │   ├── config/               # Configuration
│   │   │   └── database.ts
│   │   ├── index.ts              # Server entry point
│   │   └── seed.ts               # Database seeding
│   ├── README.md                 # Backend documentation
│   ├── package.json
│   ├── tsconfig.json
│   └── MONGODB_SETUP.md          # Database setup guide
│
├── admin/                         # Admin dashboard
│   ├── src/
│   │   ├── components/           # Admin components
│   │   │   ├── common/          # Reusable components
│   │   │   ├── layout/          # Layout components
│   │   │   └── features/        # Feature-specific components
│   │   ├── pages/               # Page components
│   │   ├── lib/                 # Utilities & libraries
│   │   │   └── adminDesignTokens.ts  # Admin design system
│   │   ├── hooks/               # React hooks
│   │   ├── types/               # TypeScript types
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   └── index.css
│   ├── public/
│   ├── README.md                # Admin panel documentation
│   ├── DESIGN_SYSTEM.md         # Admin design system guide
│   ├── package.json
│   ├── tailwind.config.ts
│   ├── tsconfig.json
│   └── vite.config.ts
│
├── docs/                        # Project documentation
│   ├── ARCHITECTURE.md          # System architecture
│   ├── API_DOCUMENTATION.md     # API endpoints
│   ├── DEPLOYMENT.md            # Deployment guide
│   └── CONTRIBUTING.md          # Contributing guidelines
│
├── README.md                    # This file
├── package.json                 # Root package.json (if monorepo)
└── .gitignore
```

## 🏗️ Architecture

### System Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    User Client Layer                         │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌─────────────────────────────────────────────────────┐    │
│  │            Frontend (React + Vite)                  │    │
│  │  - Pages: Home, Schedule, Stops, Routes, etc.      │    │
│  │  - Components: Maps, Navigation, Tracking          │    │
│  │  - Design: Rapido-inspired dark UI                 │    │
│  │  - Port: localhost:8081                            │    │
│  └─────────────────────────────────────────────────────┘    │
│                                                               │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                   API Layer (REST)                           │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌─────────────────────────────────────────────────────┐    │
│  │      Backend (Node.js + Express + TypeScript)      │    │
│  │  - Controllers: Buses, Routes, Stops               │    │
│  │  - APIs: GET/POST/PUT/DELETE endpoints             │    │
│  │  - Port: localhost:5000                            │    │
│  └─────────────────────────────────────────────────────┘    │
│                                                               │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                   Data Layer                                 │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌─────────────────────────────────────────────────────┐    │
│  │         MongoDB Database                            │    │
│  │  - Collections: buses, routes, stops, users         │    │
│  │  - Indexes: Route optimization, querying            │    │
│  └─────────────────────────────────────────────────────┘    │
│                                                               │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                 Admin Client Layer                           │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌─────────────────────────────────────────────────────┐    │
│  │         Admin Panel (React + Vite)                  │    │
│  │  - Dashboard: Stats, monitoring                     │    │
│  │  - Management: Buses, Routes, Stops CRUD           │    │
│  │  - Design: Rapido-inspired dark UI                 │    │
│  │  - Port: localhost:5174                            │    │
│  └─────────────────────────────────────────────────────┘    │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

### Key Technologies

| Layer        | Technology   | Version | Purpose                 |
| ------------ | ------------ | ------- | ----------------------- |
| **Frontend** | React        | 18+     | User-facing transit app |
|              | TypeScript   | 5.x     | Type-safe JavaScript    |
|              | Vite         | 5.x     | Fast build tool         |
|              | Tailwind CSS | 3.x     | Utility-first CSS       |
|              | Leaflet.js   | Latest  | Interactive maps        |
|              | Lucide React | Latest  | Icons                   |
| **Backend**  | Node.js      | 18+     | Runtime                 |
|              | Express      | 4.x     | Web framework           |
|              | TypeScript   | 5.x     | Type-safe JavaScript    |
|              | MongoDB      | 5.x+    | NoSQL database          |
| **Admin**    | React        | 18+     | Admin dashboard         |
|              | TypeScript   | 5.x     | Type-safe JavaScript    |
|              | Vite         | 5.x     | Fast build tool         |
|              | Tailwind CSS | 3.x     | Utility-first CSS       |
|              | Lucide React | Latest  | Icons                   |

## 🎨 Design System

### Frontend Design (Rapido-inspired)

- **Theme**: Dark mode with yellow accents
- **Primary Colors**: `#FFD000` (yellow), `#0D0D0D` (black)
- **Typography**: Inter font family, 14px body text
- **Components**: Custom dark UI cards, buttons, navigation
- **Documentation**: See [frontend/lib/designTokens.ts](./frontend/src/lib/designTokens.ts)

### Admin Panel Design (Rapido-inspired)

- **Theme**: Dark mode with yellow accents
- **Page Background**: `#0D0D0D`
- **Card Background**: `#1A1A1A`
- **Primary Accent**: `#FFD000` (yellow)
- **Sidebar**: 240px fixed left, navigation
- **Documentation**: See [admin/DESIGN_SYSTEM.md](./admin/DESIGN_SYSTEM.md)

## 🚀 Getting Started

### Prerequisites

- Node.js 16+
- npm or yarn
- MongoDB 5.0+
- Git

### Quick Start

#### 1. Clone Repository

```bash
git clone https://github.com/tejas-jalit-057/AmravatiTransit.git
cd AmravatiTransit
```

#### 2. Setup Backend

```bash
cd backend
npm install
npm run dev
# Server runs on http://localhost:5000
```

#### 3. Setup Frontend

```bash
cd ../frontend
npm install
npm run dev
# App runs on http://localhost:8081
```

#### 4. Setup Admin Panel

```bash
cd ../admin
npm install
npm run dev
# Admin runs on http://localhost:5174
```

### Environment Variables

#### Backend (.env)

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/amravati_transit
NODE_ENV=development
```

#### Frontend (.env.local)

```env
VITE_API_URL=http://localhost:5000/api
```

#### Admin (.env.local)

```env
VITE_API_URL=http://localhost:5000/api
```

## 📦 Scripts

### Root Level

```bash
# Install all dependencies
npm install

# Start all services (if configured as monorepo)
npm run dev

# Build all projects
npm run build
```

### Frontend

```bash
cd frontend
npm run dev       # Start dev server
npm run build     # Production build
npm run preview   # Preview build
npm run lint      # Run ESLint
npm run type-check # TypeScript check
```

### Backend

```bash
cd backend
npm run dev       # Start dev server with nodemon
npm run build     # Compile TypeScript
npm run seed      # Seed database
```

### Admin

```bash
cd admin
npm run dev       # Start dev server
npm run build     # Production build
npm run preview   # Preview build
npm run lint      # Run ESLint
```

## 📡 API Endpoints

All endpoints documented in [backend/README.md](./backend/README.md)

### Buses

- `GET /api/buses` - List all buses
- `GET /api/buses/:id` - Get bus details
- `POST /api/buses` - Create bus
- `PUT /api/buses/:id` - Update bus
- `DELETE /api/buses/:id` - Delete bus

### Routes

- `GET /api/routes` - List all routes
- `GET /api/routes/:id` - Get route details
- `POST /api/routes` - Create route
- `PUT /api/routes/:id` - Update route
- `DELETE /api/routes/:id` - Delete route

### Stops

- `GET /api/stops` - List all stops
- `GET /api/stops/:id` - Get stop details
- `POST /api/stops` - Create stop
- `PUT /api/stops/:id` - Update stop
- `DELETE /api/stops/:id` - Delete stop

## 🎯 Key Features

### Frontend Features

- ✅ Home page with featured routes
- ✅ Live schedule with day/time selection
- ✅ Bus stop directory with GPS-based sorting
- ✅ Real-time notifications center
- ✅ Interactive bus route map with geocoding
- ✅ Help/support center
- ✅ Trip booking interface
- ✅ Persistent bottom navigation (Rapido-style)
- ✅ Dark mode throughout

### Backend Features

- ✅ RESTful API with Express
- ✅ MongoDB database integration
- ✅ Type-safe with TypeScript
- ✅ Data validation
- ✅ Error handling
- ✅ CORS enabled

### Admin Features

- 🔄 Coming Soon: Dashboard with stats
- 🔄 Coming Soon: Bus management CRUD
- 🔄 Coming Soon: Route management CRUD
- 🔄 Coming Soon: Stop management CRUD
- 🔄 Coming Soon: Driver management
- 🔄 Coming Soon: Trip scheduling

## 🗺️ Map & Geocoding

The frontend includes an interactive bus route map:

- **Technology**: Leaflet.js + OpenStreetMap
- **Geocoding**: Nominatim API for address → coordinates
- **Route**: Navsari → Badnera with 22 stops
- **Features**:
  - Stop markers with different colors
  - Polyline route visualization
  - Interactive popups
  - Automatic bounds fitting

See [BUS_ROUTE_MAP_DOCUMENTATION.md](./BUS_ROUTE_MAP_DOCUMENTATION.md) for details.

## 📚 Documentation

### Project Docs

- **Project README**: This file
- **Architecture**: See `docs/ARCHITECTURE.md`
- **API Docs**: See `backend/README.md`

### Frontend Docs

- **Frontend README**: [frontend/README.md](./frontend/README.md)
- **Design Tokens**: [frontend/src/lib/designTokens.ts](./frontend/src/lib/designTokens.ts)

### Backend Docs

- **Backend README**: [backend/README.md](./backend/README.md)
- **MongoDB Setup**: [backend/MONGODB_SETUP.md](./backend/MONGODB_SETUP.md)
- **Models**: See `backend/src/models/`

### Admin Docs

- **Admin README**: [admin/README.md](./admin/README.md)
- **Design System**: [admin/DESIGN_SYSTEM.md](./admin/DESIGN_SYSTEM.md)
- **Design Tokens**: [admin/src/lib/adminDesignTokens.ts](./admin/src/lib/adminDesignTokens.ts)

## 🔄 Development Workflow

### Making Changes

1. **Create a feature branch**

   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes**
   - Frontend: Update components in `frontend/src/`
   - Backend: Update API in `backend/src/`
   - Admin: Update admin in `admin/src/`

3. **Test your changes**

   ```bash
   # In respective directory
   npm run dev      # Start dev server
   npm run lint     # Check code quality
   npm run type-check # TypeScript validation
   ```

4. **Commit changes**

   ```bash
   git add .
   git commit -m "feat: add new feature"
   ```

5. **Push to main**
   ```bash
   git push origin feature/your-feature-name
   ```

## 🚢 Deployment

### Frontend Deployment

- Deploy `frontend/dist/` to Vercel, Netlify, or similar
- Set `VITE_API_URL` environment variable

### Backend Deployment

- Deploy to Heroku, Railway, or similar
- Set `PORT`, `MONGODB_URI`, `NODE_ENV` environment variables

### Admin Deployment

- Deploy `admin/dist/` to Vercel, Netlify, or similar
- Set `VITE_API_URL` environment variable

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

See [CONTRIBUTING.md](./docs/CONTRIBUTING.md) for detailed guidelines.

## 📞 Support

For questions or issues:

1. Check the relevant README in each folder
2. Review documentation in `docs/` folder
3. Open an issue on GitHub

## 📄 License

This project is licensed under the MIT License. See LICENSE file for details.

## 👥 Contributors

- **Tejas Jalit** - Project Lead
- Contributors welcome! See [CONTRIBUTING.md](./docs/CONTRIBUTING.md)

---

## 🔗 Quick Links

| Resource     | Link                                                      |
| ------------ | --------------------------------------------------------- |
| Frontend App | http://localhost:8081                                     |
| Backend API  | http://localhost:5000                                     |
| Admin Panel  | http://localhost:5174                                     |
| GitHub       | https://github.com/tejas-jalit-057/AmravatiTransit        |
| Issues       | https://github.com/tejas-jalit-057/AmravatiTransit/issues |

---

**Last Updated**: April 2025
**Version**: 1.0.0
**Status**: Active Development

📝 For more information, see individual README files in each folder.
