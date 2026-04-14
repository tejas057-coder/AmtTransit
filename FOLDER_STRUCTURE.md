# AmravatiTransit - Folder Structure Guide

Complete guide to understanding and navigating the AmravatiTransit project structure.

## 📊 Root Level

```
AmravatiTransit/
├── frontend/                  # React user-facing app
├── backend/                   # Node.js/Express API
├── admin/                     # React admin dashboard
├── docs/                      # Project documentation
├── README.md                  # Root README
├── PROJECT_DOCUMENTATION.md   # This comprehensive guide
├── FOLDER_STRUCTURE.md        # Folder organization guide
├── .gitignore                 # Git ignore rules
├── package.json               # Root package.json (if monorepo)
└── LICENSE                    # MIT License
```

## 📁 Frontend Directory Structure

```
frontend/
├── src/
│   ├── components/
│   │   ├── layout/
│   │   │   ├── AppLayout.tsx          # Main app layout wrapper
│   │   │   ├── AppSidebar.tsx         # Sidebar component
│   │   │   ├── BottomNav.tsx          # Bottom navigation (mobile)
│   │   │   └── MainLayout.tsx         # Persistent layout with Outlet
│   │   │
│   │   ├── map/
│   │   │   ├── LeafletMap.tsx         # Base map component
│   │   │   ├── BusRouteMap.tsx        # Interactive route map with geocoding
│   │   │   └── ...                    # Other map components
│   │   │
│   │   ├── tracking/
│   │   │   ├── BusTrackingTimeline.tsx # Bus tracking visualization
│   │   │   └── ...
│   │   │
│   │   ├── ui/                        # shadcn/ui components
│   │   │   ├── accordion.tsx
│   │   │   ├── alert.tsx
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── (and 30+ more UI components)
│   │   │   └── use-toast.ts
│   │   │
│   │   └── NavLink.tsx                # Navigation link component
│   │
│   ├── pages/                         # Page components (1 per route)
│   │   ├── Index.tsx                  # Home page
│   │   ├── SchedulePage.tsx           # Bus schedule view
│   │   ├── StopsPage.tsx              # Bus stops directory
│   │   ├── RoutesPage.tsx             # Routes listing
│   │   ├── LiveMapPage.tsx            # Live map view
│   │   ├── TripsPage.tsx              # User's trips
│   │   ├── NotificationsPage.tsx      # Notifications center
│   │   ├── HelpPage.tsx               # Help/support center
│   │   ├── NotFound.tsx               # 404 page
│   │   └── RouteDetailsPage.tsx       # Full-screen route map
│   │
│   ├── data/
│   │   ├── busScheduleData.ts         # Mock schedule data
│   │   ├── mockData.ts                # Mock buses, routes, stops
│   │   └── ...
│   │
│   ├── hooks/
│   │   ├── use-mobile.tsx             # Mobile detection hook
│   │   ├── use-toast.ts               # Toast notification hook
│   │   └── ...                        # Custom hooks
│   │
│   ├── lib/
│   │   ├── designTokens.ts            # Frontend design system tokens
│   │   └── utils.ts                   # Utility functions
│   │
│   ├── types/
│   │   └── index.ts                   # TypeScript type definitions
│   │
│   ├── test/
│   │   ├── example.test.ts            # Example tests
│   │   └── setup.ts                   # Test configuration
│   │
│   ├── App.tsx                        # Root app component
│   ├── main.tsx                       # Vite entry point
│   ├── index.css                      # Global styles
│   ├── App.css                        # App-specific styles
│   └── vite-env.d.ts                  # Vite type definitions
│
├── public/
│   └── robots.txt                     # SEO robots file
│
├── README.md                          # Frontend documentation
├── package.json                       # Dependencies & scripts
├── index.html                         # HTML template
├── vite.config.ts                     # Vite configuration
├── vitest.config.ts                   # Vitest configuration
├── tailwind.config.ts                 # Tailwind CSS config
├── postcss.config.js                  # PostCSS config
├── tsconfig.json                      # TypeScript config
├── tsconfig.app.json                  # App TypeScript config
├── tsconfig.node.json                 # Node TypeScript config
├── eslint.config.js                   # ESLint config
├── components.json                    # shadcn/ui config
├── bun.lockb                          # Lock file
└── .env.local                         # Environment variables
```

## 🔧 Backend Directory Structure

```
backend/
├── src/
│   ├── controllers/
│   │   ├── busController.ts           # Bus API logic
│   │   ├── routeController.ts         # Route API logic
│   │   ├── stopController.ts          # Stop API logic
│   │   └── ...
│   │
│   ├── routes/
│   │   ├── busesRoute.ts              # /api/buses endpoints
│   │   ├── routesRoute.ts             # /api/routes endpoints
│   │   ├── stopsRoute.ts              # /api/stops endpoints
│   │   └── ...
│   │
│   ├── models/
│   │   ├── Bus.ts                     # Bus data model
│   │   ├── Route.ts                   # Route data model
│   │   ├── Stop.ts                    # Stop data model
│   │   └── ...
│   │
│   ├── types/
│   │   └── index.ts                   # TypeScript type definitions
│   │
│   ├── data/
│   │   └── mockData.ts                # Mock data for testing
│   │
│   ├── config/
│   │   └── database.ts                # MongoDB configuration
│   │
│   ├── index.ts                       # Server entry point
│   └── seed.ts                        # Database seeding script
│
├── README.md                          # Backend documentation
├── MONGODB_SETUP.md                   # MongoDB setup guide
├── MONGODB_QUICK_START.md             # Quick MongoDB guide
├── package.json                       # Dependencies & scripts
├── tsconfig.json                      # TypeScript config
├── .env                               # Environment variables
└── .gitignore
```

## 🎛️ Admin Directory Structure

```
admin/
├── src/
│   ├── components/
│   │   ├── common/
│   │   │   └── index.tsx              # Reusable components
│   │   │       ├── Button
│   │   │       ├── Input
│   │   │       ├── Card
│   │   │       ├── Badge
│   │   │       ├── Alert
│   │   │       ├── Table
│   │   │       ├── SidebarItem
│   │   │       └── ...
│   │   │
│   │   ├── layout/
│   │   │   ├── MainLayout.tsx         # Main admin layout
│   │   │   ├── Sidebar.tsx            # Navigation sidebar
│   │   │   ├── Header.tsx             # Top header
│   │   │   └── ...
│   │   │
│   │   └── features/
│   │       ├── buses/                 # Bus management components
│   │       ├── routes/                # Route management components
│   │       ├── stops/                 # Stop management components
│   │       └── ...
│   │
│   ├── pages/
│   │   ├── Dashboard.tsx              # Dashboard page
│   │   ├── BusesPage.tsx              # Buses management page
│   │   ├── RoutesPage.tsx             # Routes management page
│   │   ├── StopsPage.tsx              # Stops management page
│   │   └── ...
│   │
│   ├── lib/
│   │   ├── adminDesignTokens.ts       # Admin design system tokens
│   │   ├── api.ts                     # API client
│   │   └── utils.ts                   # Utility functions
│   │
│   ├── hooks/
│   │   ├── useAuth.ts                 # Authentication hook
│   │   ├── useFetch.ts                # Data fetching hook
│   │   └── ...
│   │
│   ├── types/
│   │   ├── index.ts                   # Type definitions
│   │   └── api.ts                     # API type definitions
│   │
│   ├── App.tsx                        # Root app component
│   ├── main.tsx                       # Vite entry point
│   ├── index.css                      # Global styles
│   └── vite-env.d.ts                  # Vite type definitions
│
├── public/                            # Static assets
│   └── robots.txt
│
├── README.md                          # Admin documentation
├── DESIGN_SYSTEM.md                   # Comprehensive design guide
├── package.json                       # Dependencies & scripts
├── index.html                         # HTML template
├── vite.config.ts                     # Vite configuration
├── tailwind.config.ts                 # Tailwind CSS config
├── tsconfig.json                      # TypeScript config
├── tsconfig.app.json                  # App TypeScript config
├── tsconfig.node.json                 # Node TypeScript config
├── eslint.config.js                   # ESLint config
├── .env.local                         # Environment variables
└── bun.lockb                          # Lock file
```

## 📚 Documentation Directory

```
docs/
├── ARCHITECTURE.md                    # System architecture overview
├── API_DOCUMENTATION.md               # Complete API documentation
├── DEPLOYMENT.md                      # Deployment guide
├── CONTRIBUTING.md                    # Contributing guidelines
├── DATABASE_SCHEMA.md                 # MongoDB schema documentation
├── TESTING.md                         # Testing guide
└── TROUBLESHOOTING.md                 # Common issues & solutions
```

## 🗂️ Complete File Manifest

### Core Documentation Files

| File                           | Purpose                | Location |
| ------------------------------ | ---------------------- | -------- |
| README.md                      | Root project overview  | `/`      |
| PROJECT_DOCUMENTATION.md       | Complete project guide | `/`      |
| FOLDER_STRUCTURE.md            | This file              | `/`      |
| BUS_ROUTE_MAP_DOCUMENTATION.md | Map feature docs       | `/`      |
| ROUTE_MAP_QUICK_START.md       | Map quick start        | `/`      |
| ARCHITECTURE_DIAGRAM.md        | System diagrams        | `/`      |
| IMPLEMENTATION_SUMMARY.md      | Implementation details | `/`      |

### Frontend Files

| Category       | Files                                            | Location                   |
| -------------- | ------------------------------------------------ | -------------------------- |
| **Pages**      | Index.tsx, SchedulePage.tsx, StopsPage.tsx, etc. | `frontend/src/pages/`      |
| **Components** | Button.tsx, Card.tsx, etc. (40+ files)           | `frontend/src/components/` |
| **Styles**     | index.css, App.css, + Tailwind                   | `frontend/src/`            |
| **Types**      | Type definitions                                 | `frontend/src/types/`      |
| **Data**       | Mock data, utilities                             | `frontend/src/data/`       |
| **Config**     | Vite, TypeScript, Tailwind                       | `frontend/*.config.*`      |

### Backend Files

| Category        | Files                                                   | Location                   |
| --------------- | ------------------------------------------------------- | -------------------------- |
| **Controllers** | busController.ts, routeController.ts, stopController.ts | `backend/src/controllers/` |
| **Routes**      | busesRoute.ts, routesRoute.ts, stopsRoute.ts            | `backend/src/routes/`      |
| **Models**      | Bus.ts, Route.ts, Stop.ts                               | `backend/src/models/`      |
| **Config**      | database.ts                                             | `backend/src/config/`      |
| **Scripts**     | seed.ts, index.ts                                       | `backend/src/`             |
| **Docs**        | README.md, MONGODB_SETUP.md, MONGODB_QUICK_START.md     | `backend/`                 |

### Admin Files

| Category          | Files                                          | Location                       |
| ----------------- | ---------------------------------------------- | ------------------------------ |
| **Components**    | Button, Input, Card, Badge, Alert, Table, etc. | `admin/src/components/common/` |
| **Design Tokens** | adminDesignTokens.ts                           | `admin/src/lib/`               |
| **Pages**         | Dashboard.tsx, BusesPage.tsx, etc.             | `admin/src/pages/`             |
| **Styles**        | index.css, Tailwind config                     | `admin/`                       |
| **Types**         | Type definitions                               | `admin/src/types/`             |
| **Docs**          | README.md, DESIGN_SYSTEM.md                    | `admin/`                       |

## 🔍 Different File Types

### TypeScript/React

- `.tsx` - TypeScript React components
- `.ts` - TypeScript files and utilities
- Extension used for type safety and JSX

### Styling

- `.css` - CSS stylesheets (global & component)
- `.config.js` / `.config.ts` - Configuration for styling tools

### Configuration

- `*.config.*` - Build and tool configurations
- `.env` - Environment variables
- `tsconfig.json` - TypeScript configuration
- `package.json` - NPM dependencies and scripts

### Documentation

- `.md` - Markdown documentation files
- Comprehensive guides and references

## 📍 Key File Locations

### Design Systems

```
Frontend:  frontend/src/lib/designTokens.ts
Admin:     admin/src/lib/adminDesignTokens.ts
           admin/DESIGN_SYSTEM.md
```

### API Implementation

```
Controllers: backend/src/controllers/
Routes:      backend/src/routes/
Models:      backend/src/models/
Database:    backend/src/config/database.ts
```

### Pages

```
Frontend: frontend/src/pages/*Page.tsx
Admin:    admin/src/pages/*Page.tsx
```

### Components

```
Frontend UI:      frontend/src/components/ui/
Frontend Layout:  frontend/src/components/layout/
Frontend Map:     frontend/src/components/map/
Admin Components: admin/src/components/common/
Admin Layout:     admin/src/components/layout/
```

## 🚀 Navigation Guide

### For Frontend Development

1. Start: `frontend/README.md`
2. Design: `frontend/src/lib/designTokens.ts`
3. Pages: `frontend/src/pages/`
4. Components: `frontend/src/components/`
5. Config: `frontend/*.config.ts`

### For Backend Development

1. Start: `backend/README.md`
2. Database: `backend/MONGODB_SETUP.md`
3. Models: `backend/src/models/`
4. Controllers: `backend/src/controllers/`
5. Routes: `backend/src/routes/`

### For Admin Development

1. Start: `admin/README.md`
2. Design: `admin/DESIGN_SYSTEM.md`
3. Tokens: `admin/src/lib/adminDesignTokens.ts`
4. Components: `admin/src/components/common/`
5. Pages: `admin/src/pages/`

### For System Overview

1. Start: `PROJECT_DOCUMENTATION.md`
2. Architecture: `ARCHITECTURE_DIAGRAM.md` or `docs/ARCHITECTURE.md`
3. Deployment: `docs/DEPLOYMENT.md`
4. Contributing: `docs/CONTRIBUTING.md`

## 📦 Organization Principles

### 1. **By Feature** (Scalability)

- Each feature has its own folder
- Contains related components, routes, types
- Example: `routes/`, `components/layout/`, `components/map/`

### 2. **By Type** (Clarity)

- Similar files grouped together
- Controllers, routes, models in separate folders
- Components further organized by category
- Example: `src/controllers/`, `src/routes/`, `src/components/`

### 3. **Configuration at Root**

- All tool configurations at project root
- Easy to modify build and development settings
- Clear separation from source code

### 4. **Documentation Close to Code**

- README in each major folder
- Design tokens documented in code
- Architecture documented separately

## 🔄 Modification Guidelines

### Adding New Pages

```
frontend/src/pages/NewPage.tsx
- Add to: frontend/src/App.tsx routing
- Import from: frontend/src/pages/
- Use: Components from frontend/src/components/
```

### Adding New API Endpoint

```
backend/src/routes/newRoute.ts
backend/src/controllers/newController.ts
backend/src/models/NewModel.ts
- Register route in: backend/src/index.ts
- Follow existing patterns
```

### Adding New Admin Section

```
admin/src/pages/NewPage.tsx
admin/src/components/features/new/
- Use design tokens: admin/src/lib/adminDesignTokens.ts
- Use components: admin/src/components/common/
- Follow design system
```

## 📊 Statistics

### Frontend

- **Pages**: 9
- **Component Folders**: 4
- **UI Components**: 40+
- **Custom Hooks**: 2+
- **Total .tsx Files**: 50+

### Backend

- **Controllers**: 3+
- **Routes**: 3+
- **Models**: 3+
- **API Endpoints**: 15+

### Admin

- **Pages**: Planned
- **Component Folders**: 3
- **Reusable Components**: 7+
- **Design Token Categories**: 12

## 🎯 Best Practices

### File Naming

- Use PascalCase for components: `BusRouteMap.tsx`
- Use camelCase for utilities: `busScheduleData.ts`
- Use kebab-case for config files: `tailwind.config.ts`

### Organization

- Keep related files together
- Use meaningful folder names
- Avoid deeply nested structures (max 4 levels)

### Imports

- Use absolute imports with `@/` alias
- Group imports: React, libraries, local
- Sort imports alphabetically

### Documentation

- Add README to each major folder
- Include JSDoc for complex functions
- Keep documentation up-to-date

## 🔗 Cross-References

### File Dependencies

```
App.tsx
  → pages/* (Page components)
  → components/* (UI components)
  → lib/designTokens.ts (Design system)

pages/*
  → components/* (Specific components)
  → data/* (Mock data)
  → hooks/* (Custom hooks)

components/*
  → lib/designTokens.ts (Design tokens)
  → types/* (Type definitions)
  → lib/utils.ts (Utilities)
```

---

## 📞 Questions?

Refer to individual README files:

- **Frontend**: [frontend/README.md](./frontend/README.md)
- **Backend**: [backend/README.md](./backend/README.md)
- **Admin**: [admin/README.md](./admin/README.md)
- **Main Project**: [PROJECT_DOCUMENTATION.md](./PROJECT_DOCUMENTATION.md)

---

**Last Updated**: April 2025
**Document Version**: 1.0
**Status**: Complete
