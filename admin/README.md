# AmravatiTransit Admin Panel

Rapido-inspired dark UI admin dashboard for the AmravatiTransit transit management system. Built with React, TypeScript, and Tailwind CSS.

## 📁 Project Structure

```
admin/
├── src/
│   ├── components/
│   │   ├── common/
│   │   │   ├── index.tsx              # Reusable components (Button, Input, Card, Badge, etc.)
│   │   │   └── ...
│   │   ├── layout/
│   │   │   ├── MainLayout.tsx         # Main layout wrapper
│   │   │   ├── Sidebar.tsx            # Sidebar navigation
│   │   │   ├── Header.tsx             # Top header bar
│   │   │   └── ...
│   │   └── features/
│   │       ├── buses/                 # Bus management features
│   │       ├── routes/                # Route management features
│   │       ├── stops/                 # Stop management features
│   │       └── ...
│   ├── pages/
│   │   ├── Dashboard.tsx              # Dashboard page
│   │   ├── BusesPage.tsx              # Buses listing/management
│   │   ├── RoutesPage.tsx             # Routes listing/management
│   │   ├── StopsPage.tsx              # Stops listing/management
│   │   └── ...
│   ├── lib/
│   │   ├── adminDesignTokens.ts       # Design system tokens & utilities
│   │   ├── api.ts                     # API client
│   │   └── utils.ts                   # Helper utilities
│   ├── hooks/
│   │   ├── useAuth.ts                 # Authentication hook
│   │   ├── useFetch.ts                # Data fetching hook
│   │   └── ...
│   ├── types/
│   │   ├── index.ts                   # TypeScript types
│   │   └── api.ts                     # API types
│   ├── App.tsx                        # Root app component
│   ├── main.tsx                       # Entry point
│   ├── index.css                      # Global styles
│   └── vite-env.d.ts
├── public/
│   └── ...
├── tailwind.config.ts                 # Tailwind CSS configuration
├── tsconfig.json                      # TypeScript configuration
├── vite.config.ts                     # Vite configuration
├── eslint.config.js                   # ESLint configuration
├── DESIGN_SYSTEM.md                   # Complete design system documentation
└── README.md                          # This file
```

## 🎨 Design System

This admin panel implements a comprehensive Rapido-inspired dark UI design system. All design tokens, color schemes, typography, components, and utilities are defined in:

📄 **[DESIGN_SYSTEM.md](./DESIGN_SYSTEM.md)** - Complete design system documentation

### Quick Reference

**Key Design Files:**

- `src/lib/adminDesignTokens.ts` - All design tokens (colors, typography, spacing, components)
- `src/index.css` - Global styles and Tailwind utilities
- `tailwind.config.ts` - Tailwind CSS theme configuration
- `src/components/common/index.tsx` - Reusable component examples

**Color Palette:**

- Page background: `#0D0D0D`
- Card background: `#1A1A1A`
- Primary accent: `#FFD000` (yellow)
- Status colors: Success `#22C55E`, Danger `#FF4444`, Warning `#FF9900`
- Text: Primary `#FFFFFF`, Secondary `#E5E5E5`, Muted `#888888`

**Layout:**

- Sidebar: 240px fixed left, `#111111`
- Header: 56px top, `#111111`
- Main content: Full remaining space with 24px padding

## 🚀 Getting Started

### Prerequisites

- Node.js 16+
- npm or yarn
- Git

### Installation

```bash
# Navigate to admin directory
cd admin

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run tests (if configured)
npm run test

# Lint code
npm run lint
```

### Development Server

```bash
npm run dev
```

The server starts at `http://localhost:5173` (or the next available port).

### Production Build

```bash
npm run build
```

Creates an optimized production build in the `dist/` directory.

## 📦 Available Scripts

| Script               | Description                       |
| -------------------- | --------------------------------- |
| `npm run dev`        | Start development server with HMR |
| `npm run build`      | Build for production              |
| `npm run preview`    | Preview production build locally  |
| `npm run test`       | Run tests                         |
| `npm run lint`       | Run ESLint                        |
| `npm run type-check` | Run TypeScript type checking      |
| `npm run format`     | Format code with Prettier         |

## 🧩 Component Structure

### Common Components

Located in `src/components/common/index.tsx`

```tsx
import { Button, Input, Card, Badge, Alert, Table } from '@/components/common';

// Button
<Button variant="primary">Primary Action</Button>
<Button variant="ghost">Secondary</Button>
<Button variant="danger">Delete</Button>

// Input
<Input label="Bus ID" placeholder="AMT-001" />
<Input label="Email" type="email" error="Invalid email" />

// Card
<Card title="Buses" footer={<Button>Add Bus</Button>}>
  Card content
</Card>

// Badge
<Badge variant="active">Active</Badge>
<Badge variant="warning">Pending</Badge>

// Alert
<Alert type="success">Operation successful</Alert>
<Alert type="danger" onClose={() => {}}>An error occurred</Alert>

// Table
<Table
  headers={['Bus ID', 'Route', 'Status']}
  rows={[
    ['AMT-001', 'Navsari → Badnera', <Badge variant="active">Active</Badge>],
    ['AMT-002', 'Navsari → Surat', <Badge variant="active">Active</Badge>],
  ]}
/>
```

### Layout Components

```tsx
// MainLayout
<MainLayout>
  {/* Page content */}
</MainLayout>

// Sidebar with navigation
<Sidebar>
  <SidebarItem icon={<Home />} label="Dashboard" isActive />
  <SidebarItem icon={<Bus />} label="Buses" />
  <SidebarItem icon={<MapPin />} label="Routes" />
</Sidebar>

// Page Header
<Header title="Dashboard" subtitle="Welcome to admin panel" />
```

## 📝 Usage Examples

### Creating a Dashboard Page

```tsx
import { Button, Card, Table, Badge } from "@/components/common";
import { adminDesignSystem } from "@/lib/adminDesignTokens";

export function Dashboard() {
  return (
    <div style={adminDesignSystem.layouts.mainLayout.main}>
      {/* Hero Section */}
      <h1 style={adminDesignSystem.typography.styles.pageTitle}>Dashboard</h1>

      {/* Stats Grid */}
      <div className="grid-3 mb-xxl">
        <Card title="Total Buses">
          <h2 className="text-3xl font-bold">485</h2>
          <p className="text-text-muted text-xs mt-md">+12 this month</p>
        </Card>
        <Card title="Active Routes">
          <h2 className="text-3xl font-bold">28</h2>
          <p className="text-text-muted text-xs mt-md">All operational</p>
        </Card>
        <Card title="Daily Trips">
          <h2 className="text-3xl font-bold">342</h2>
          <p className="text-text-muted text-xs mt-md">On schedule</p>
        </Card>
      </div>

      {/* Recent Buses */}
      <Card title="Recently Added Buses">
        <Table
          headers={["Bus ID", "Route", "Status", "Added"]}
          rows={[
            [
              "AMT-001",
              "Navsari → Badnera",
              <Badge variant="active">Active</Badge>,
              "Feb 2, 2025",
            ],
            [
              "AMT-002",
              "Navsari → Surat",
              <Badge variant="active">Active</Badge>,
              "Feb 1, 2025",
            ],
          ]}
        />
      </Card>
    </div>
  );
}
```

### Creating a Form Page

```tsx
import { useState } from "react";
import { Button, Input, Card, Alert } from "@/components/common";

export function AddBusPage() {
  const [form, setForm] = useState({ busId: "", route: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async () => {
    if (!form.busId) {
      setError("Bus ID is required");
      return;
    }
    // Submit logic
    setSuccess(true);
  };

  return (
    <div style={{ maxWidth: "600px", margin: "0 auto", paddingTop: "40px" }}>
      <Card
        title="Add New Bus"
        subtitle="Register a new bus to the system"
        footer={
          <>
            <Button variant="ghost">Cancel</Button>
            <Button variant="primary" onClick={handleSubmit}>
              Add Bus
            </Button>
          </>
        }
      >
        {success && <Alert type="success">Bus added successfully!</Alert>}
        {error && (
          <Alert type="danger" onClose={() => setError("")}>
            {error}
          </Alert>
        )}

        <Input
          label="Bus ID"
          placeholder="AMT-001"
          value={form.busId}
          onChange={(e) => setForm({ ...form, busId: e.target.value })}
          error={
            error && "Bus ID is required" ? "Bus ID is required" : undefined
          }
        />

        <Input
          label="Route"
          placeholder="Select route..."
          value={form.route}
          onChange={(e) => setForm({ ...form, route: e.target.value })}
        />
      </Card>
    </div>
  );
}
```

## 🎯 Design System Integration

### Using Design Tokens

```tsx
import {
  adminDesignSystem,
  adminColors,
  createAdminTransition,
} from "@/lib/adminDesignTokens";

// Direct token access
const primaryColor = adminColors.primary.base;
const spacing = adminDesignSystem.spacing.lg;
const shadow = adminDesignSystem.shadows.lg;

// Utility functions
const transition = createAdminTransition("background-color", "normal");
const glow = createAdminGlow("#FFD000", 20);
```

### With Tailwind CSS

All colors and utilities are available as Tailwind classes:

```tsx
<div className="bg-background-card text-text-secondary rounded-lg p-lg border border-border">
  <h2 className="text-primary font-semibold">Title</h2>
  <p className="text-text-muted text-xs">Subtitle</p>
</div>

<button className="btn-primary">Primary Button</button>
<button className="btn-ghost">Ghost Button</button>
<button className="btn-danger">Danger Button</button>

<span className="badge-active">Active</span>
<span className="badge-warning">Warning</span>
```

### Global CSS Classes

All CSS component classes are available in `src/index.css`:

```tsx
// Form classes
<input className="form-input" />
<label className="form-label">Label</label>
<div className="form-group">
  <label className="form-label">Field</label>
  <input className="form-input" />
  <p className="form-hint">Helper text</p>
</div>

// Card classes
<div className="card">
  <div className="card-header">Header</div>
  <div className="card-body">Body</div>
  <div className="card-footer">Footer</div>
</div>

// Table classes
<div className="table-container">
  <table className="table">...</table>
</div>

// Grid classes
<div className="grid-auto">
  <div>Item 1</div>
  <div>Item 2</div>
  <div>Item 3</div>
</div>
```

## 🔌 API Integration

### Creating an API Client

```tsx
// src/lib/api.ts
import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
});

export const busesAPI = {
  getAll: () => api.get("/buses"),
  get: (id: string) => api.get(`/buses/${id}`),
  create: (data: any) => api.post("/buses", data),
  update: (id: string, data: any) => api.put(`/buses/${id}`, data),
  delete: (id: string) => api.delete(`/buses/${id}`),
};

export default api;
```

### Using the API in Components

```tsx
import { useEffect, useState } from "react";
import { busesAPI } from "@/lib/api";
import { Table, Badge, Button, Alert } from "@/components/common";

export function BusesList() {
  const [buses, setBuses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    busesAPI
      .getAll()
      .then((res) => setBuses(res.data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (error) return <Alert type="danger">{error}</Alert>;
  if (loading) return <div>Loading...</div>;

  return (
    <Table
      headers={["Bus ID", "Route", "Status", "Actions"]}
      rows={buses.map((bus) => [
        bus.id,
        bus.route,
        <Badge variant={bus.isActive ? "active" : "inactive"}>
          {bus.isActive ? "Active" : "Inactive"}
        </Badge>,
        <Button size="sm">Edit</Button>,
      ])}
    />
  );
}
```

## 🔐 Authentication

### Creating an Auth Hook

```tsx
// src/hooks/useAuth.ts
import { useState, useEffect } from "react";

export function useAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem("authToken");
    if (token) {
      // Verify token
      setUser({ id: "1", name: "Admin" });
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    // Login logic
  };

  const logout = () => {
    localStorage.removeItem("authToken");
    setUser(null);
  };

  return { user, loading, login, logout };
}
```

## 📱 Responsive Design

The design system is fully responsive with mobile-first approach:

```tsx
// Mobile first, scales up
<div className="grid-1 md:grid-2 lg:grid-3">
  <Card>Item 1</Card>
  <Card>Item 2</Card>
  <Card>Item 3</Card>
</div>

// Desktop classes
<div className="hidden-mobile">Only on desktop</div>
<div className="visible-mobile">Only on mobile</div>
```

## 🧪 Testing

### Unit Tests

```tsx
import { render, screen } from "@testing-library/react";
import { Button } from "@/components/common";

describe("Button", () => {
  it("renders button text", () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText("Click me")).toBeInTheDocument();
  });

  it("applies primary variant", () => {
    const { container } = render(<Button variant="primary">Click</Button>);
    const button = container.querySelector("button");
    // Assert styles...
  });
});
```

### Component Story

```tsx
// Button.stories.tsx
import { Button } from "@/components/common";

export default {
  component: Button,
  title: "Components/Button",
};

export const Primary = () => <Button variant="primary">Primary</Button>;
export const Ghost = () => <Button variant="ghost">Ghost</Button>;
export const Danger = () => <Button variant="danger">Danger</Button>;
```

## 🚢 Deployment

### Build for Production

```bash
npm run build
```

### Deploy to Vercel

```bash
npm install -g vercel
vercel deploy
```

### Deploy to Netlify

```bash
npm install -g netlify-cli
netlify deploy --prod --dir=dist
```

## 🛠️ Configuration

### Tailwind CSS

Edit `tailwind.config.ts` to customize theme:

```ts
theme: {
  extend: {
    colors: {
      primary: {
        DEFAULT: '#FFD000',
        hover: '#E6BB00',
      },
      // Add more colors...
    },
  },
}
```

### Vite

Edit `vite.config.ts` to customize build options:

```ts
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      "/api": "http://localhost:5000",
    },
  },
});
```

## 📚 Documentation

- **[DESIGN_SYSTEM.md](./DESIGN_SYSTEM.md)** - Complete design system reference
- **[../docs/](../docs/)** - Main project documentation
- **[../README.md](../README.md)** - Root project README

## 🤝 Contributing

1. Follow the design system guidelines
2. Use existing components from `src/components/common/`
3. Maintain consistency with color palette and typography
4. Add proper TypeScript types
5. Test components before committing

## 📝 Code Standards

- Use functional components with hooks
- Use TypeScript for type safety
- Follow design system tokens
- Keep components reusable
- Write meaningful prop interfaces
- Add JSDoc comments for complex functions

### ESLint & Prettier

```bash
# Check code style
npm run lint

# Format code
npm run format
```

## 🆘 Troubleshooting

### Tailwind classes not working

1. Ensure `tailwind.config.ts` includes correct content paths
2. Check that `@import` statements are in `src/index.css`
3. Rebuild the project: `npm run build`

### Design tokens not importing

1. Verify import path: `from '@/lib/adminDesignTokens'`
2. Check TypeScript paths in `tsconfig.json`
3. Ensure file exists at correct location

### Dev server issues

1. Clear node_modules: `rm -rf node_modules && npm install`
2. Clear cache: `rm -rf dist .vite`
3. Restart dev server: `npm run dev`

## 📞 Support

For questions about the admin panel:

1. Check [DESIGN_SYSTEM.md](./DESIGN_SYSTEM.md)
2. Review component examples in `src/components/common/index.tsx`
3. Check existing page implementations
4. Review the main project documentation

## 📄 License

This project is part of AmravatiTransit. See LICENSE file in root project directory.

---

**Last Updated**: April 2025
**Admin Panel Version**: 1.0
**Built with**: React 18+ | TypeScript | Tailwind CSS | Vite
