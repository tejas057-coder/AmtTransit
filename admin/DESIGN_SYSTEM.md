# AmravatiTransit Admin Panel Design System

Rapido-inspired dark UI design system for the AmravatiTransit admin panel with comprehensive design tokens and component presets.

## 📋 Table of Contents

- [Quick Start](#quick-start)
- [Design Tokens](#design-tokens)
- [Colors](#colors)
- [Typography](#typography)
- [Components](#components)
- [Layout](#layout)
- [Usage Examples](#usage-examples)
- [Utilities](#utilities)

## 🚀 Quick Start

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

### Import Design Tokens

```typescript
import {
  adminDesignSystem,
  adminColors,
  adminTypography,
} from "@/lib/adminDesignTokens";

// Access any token
const pageBackground = adminColors.background.page; // '#0D0D0D'
const primaryColor = adminColors.primary.base; // '#FFD000'
```

## 🎨 Design Tokens

### Colors

#### Backgrounds

- **Page Background**: `#0D0D0D` - Main page background
- **Card Background**: `#1A1A1A` - Card/panel background
- **Elevated Background**: `#222222` - Elevated card on hover
- **Sidebar Background**: `#111111` - Sidebar background

#### Primary Accent (Yellow)

- **Primary Base**: `#FFD000` - Primary accent color
- **Primary Hover**: `#E6BB00` - Hover state color
- **Primary Light**: `#FFD00022` - 13% opacity variant

#### Status Colors

- **Danger**: `#FF4444` - Error/delete actions
- **Success**: `#22C55E` - Success states
- **Warning**: `#FF9900` - Warning states
- **Info**: `#3B82F6` - Information states

#### Text

- **Primary Text**: `#FFFFFF` - Main text color
- **Secondary Text**: `#E5E5E5` - Body text color
- **Muted Text**: `#888888` - Labels and captions
- **Inverse Text**: `#0D0D0D` - Text on primary accent

#### Borders

- **Border Base**: `#2A2A2A` - Standard border color
- **Border Muted**: `#1A1A1A` - Subtle border color

### Typography

#### Font Stack

```
Inter, system-ui, -apple-system, sans-serif
```

#### Font Weights

- **Light**: 300
- **Normal**: 400
- **Medium**: 500
- **Semibold**: 600
- **Bold**: 700

#### Text Styles

| Style           | Size | Weight | Color     | Usage                    |
| --------------- | ---- | ------ | --------- | ------------------------ |
| Page Title      | 22px | 600    | Primary   | Page headers             |
| Section Heading | 16px | 600    | Primary   | Section titles           |
| Body            | 14px | 400    | Secondary | Main content             |
| Card Label      | 12px | 500    | Muted     | Field labels (uppercase) |
| Caption         | 12px | 400    | Muted     | Helper text              |

### Spacing

```typescript
// Use these consistent spacing values
xs: "4px";
sm: "8px";
md: "12px";
lg: "16px"; // Primary spacing
xl: "24px"; // Section spacing
xxl: "32px"; // Large sections
xxxl: "40px"; // Extra large spacing
```

### Sizing

```typescript
headerHeight: "56px";
sidebarWidth: "240px";
sidebarItemHeight: "44px";
inputHeight: "40px";
buttonHeight: "40px";
gridGap: "16px";
gridGapSmall: "12px";
```

### Borders & Radius

```typescript
// Border radius
sm: "4px";
md: "8px";
lg: "12px";
full: "9999px";

// Border width
thin: "1px";
medium: "2px";
```

### Shadows

```typescript
sm: "0 1px 2px rgba(0, 0, 0, 0.05)";
base: "0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06)";
md: "0 4px 6px rgba(0, 0, 0, 0.1), 0 2px 4px rgba(0, 0, 0, 0.06)";
lg: "0 10px 15px rgba(0, 0, 0, 0.1), 0 4px 6px rgba(0, 0, 0, 0.05)";
xl: "0 20px 25px rgba(0, 0, 0, 0.1), 0 10px 10px rgba(0, 0, 0, 0.04)";
primaryGlow: "0 0 20px rgba(255, 208, 0, 0.15)";
dangerGlow: "0 0 20px rgba(255, 68, 68, 0.15)";
```

### Transitions

```typescript
fast: "150ms ease-in-out";
normal: "200ms ease-in-out"; // Default
slow: "300ms ease-in-out";
slowest: "500ms ease-in-out";
```

### Z-Index

```typescript
base: 0;
dropdown: 10;
sticky: 20;
sidebar: 30;
header: 40;
modal: 50;
tooltip: 60;
notification: 70;
```

## 🧩 Components

### Buttons

#### Primary Button

```tsx
<button className="btn-primary">Action Button</button>
```

- Background: `#FFD000`
- Hover: `#E6BB00` with glow
- Text: `#0D0D0D` (bold)

#### Ghost Button

```tsx
<button className="btn-ghost">Secondary Action</button>
```

- Border: 1px solid `#2A2A2A`
- Hover: Border + text turn `#FFD000`, light yellow background

#### Danger Button

```tsx
<button className="btn-danger">Delete</button>
```

- Background: `#FF4444`
- Hover: `#FF2222` with danger glow
- Text: White

#### Button Sizes

```tsx
<button className="btn-primary btn-sm">Small</button>
<button className="btn-primary">Normal</button>
<button className="btn-primary btn-lg">Large</button>
```

### Input Fields

```tsx
<input type="text" className="form-input" placeholder="Enter text..." />
```

- Background: `#222222`
- Border: 1px solid `#2A2A2A`
- Focus: Border + ring turn `#FFD000`
- Height: 40px
- Radius: 12px

### Cards

```tsx
<div className="card">
  <div className="card-header">
    <h3>Card Title</h3>
  </div>
  <div className="card-body">Card content</div>
  <div className="card-footer">
    <button className="btn-ghost">Cancel</button>
    <button className="btn-primary">Save</button>
  </div>
</div>
```

### Badges

```tsx
<span className="badge-active">Active</span>
<span className="badge-inactive">Inactive</span>
<span className="badge-warning">Warning</span>
<span className="badge-danger">Danger</span>
<span className="badge-success">Success</span>
```

### Tables

```tsx
<div className="table-container">
  <table className="table">
    <thead>
      <tr>
        <th>Column 1</th>
        <th>Column 2</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>Data 1</td>
        <td>Data 2</td>
      </tr>
    </tbody>
  </table>
</div>
```

## 📐 Layout

### Main Admin Layout

```tsx
import { adminLayouts } from "@/lib/adminDesignTokens";

<div style={adminLayouts.mainLayout.wrapper}>
  {/* Sidebar */}
  <aside style={adminLayouts.mainLayout.sidebar}>
    <nav>
      <div className="sidebar-item active">Dashboard</div>
      <div className="sidebar-item">Buses</div>
      <div className="sidebar-item">Routes</div>
    </nav>
  </aside>

  {/* Content */}
  <div style={adminLayouts.mainLayout.content}>
    {/* Header */}
    <header style={adminLayouts.mainLayout.header}>
      <h1>Dashboard</h1>
    </header>

    {/* Main Content */}
    <main style={adminLayouts.mainLayout.main}>
      <div className="section">
        <h2>Section Title</h2>
      </div>
    </main>
  </div>
</div>;
```

**Layout Specifications:**

- Sidebar: Fixed left, 240px wide, `#111111`
- Header: Height 56px, `#111111`
- Content: Full remaining space with 24px padding
- Sidebar items: 44px height, yellow highlight when active

### Responsive Grids

```tsx
{
  /* Auto-responsive 3-column */
}
<div className="grid-auto">
  <div className="card">Item 1</div>
  <div className="card">Item 2</div>
  <div className="card">Item 3</div>
</div>;

{
  /* 2-column grid */
}
<div className="grid-2">
  <div className="card">Left</div>
  <div className="card">Right</div>
</div>;

{
  /* 3-column grid (desktop) */
}
<div className="grid-3">
  <div className="card">Col 1</div>
  <div className="card">Col 2</div>
  <div className="card">Col 3</div>
</div>;

{
  /* 4-column grid (desktop) */
}
<div className="grid-4">
  <div className="card">1</div>
  <div className="card">2</div>
  <div className="card">3</div>
  <div className="card">4</div>
</div>;
```

## 💡 Usage Examples

### Complete Page Component

```tsx
import { adminColors, adminDesignSystem } from "@/lib/adminDesignTokens";

export function Dashboard() {
  return (
    <div style={adminDesignSystem.layouts.mainLayout.wrapper}>
      {/* Sidebar */}
      <aside style={adminDesignSystem.layouts.mainLayout.sidebar}>
        <nav className="space-y-0">
          <div className="sidebar-item active">
            <Home size={20} className="mr-md" />
            Dashboard
          </div>
          <div className="sidebar-item">
            <Bus size={20} className="mr-md" />
            Buses
          </div>
          <div className="sidebar-item">
            <MapPin size={20} className="mr-md" />
            Routes
          </div>
        </nav>
      </aside>

      {/* Content */}
      <div style={adminDesignSystem.layouts.mainLayout.content}>
        {/* Header */}
        <header style={adminDesignSystem.layouts.mainLayout.header}>
          <h1>Dashboard</h1>
        </header>

        {/* Main */}
        <main style={adminDesignSystem.layouts.mainLayout.main}>
          {/* Stats Grid */}
          <div className="grid-3 mb-xxl">
            <div className="card">
              <div className="flex-between mb-lg">
                <p className="text-text-muted text-xs uppercase tracking-wider">
                  Total Buses
                </p>
                <Bus size={24} style={{ color: adminColors.primary.base }} />
              </div>
              <h2 className="text-3xl font-bold">485</h2>
              <p className="text-text-muted text-xs mt-md">+12 this month</p>
            </div>

            <div className="card">
              <div className="flex-between mb-lg">
                <p className="text-text-muted text-xs uppercase tracking-wider">
                  Active Routes
                </p>
                <MapPin
                  size={24}
                  style={{ color: adminColors.status.success }}
                />
              </div>
              <h2 className="text-3xl font-bold">28</h2>
              <p className="text-text-muted text-xs mt-md">All operational</p>
            </div>

            <div className="card">
              <div className="flex-between mb-lg">
                <p className="text-text-muted text-xs uppercase tracking-wider">
                  Daily Trips
                </p>
                <Clock
                  size={24}
                  style={{ color: adminColors.status.warning }}
                />
              </div>
              <h2 className="text-3xl font-bold">342</h2>
              <p className="text-text-muted text-xs mt-md">On schedule</p>
            </div>
          </div>

          {/* Recently Added Buses */}
          <div className="card">
            <div className="card-header">
              <h3>Recently Added Buses</h3>
            </div>
            <div className="card-body">
              <div className="table-container">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Bus ID</th>
                      <th>Route</th>
                      <th>Status</th>
                      <th>Added</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>AMT-001</td>
                      <td>Navsari → Badnera</td>
                      <td>
                        <span className="badge-active">Active</span>
                      </td>
                      <td>Feb 2, 2025</td>
                    </tr>
                    <tr>
                      <td>AMT-002</td>
                      <td>Navsari → Surat</td>
                      <td>
                        <span className="badge-active">Active</span>
                      </td>
                      <td>Feb 1, 2025</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
```

### Form Example

```tsx
export function AddBusForm() {
  const [formData, setFormData] = React.useState({
    busId: "",
    route: "",
    status: "active",
  });

  return (
    <div className="card max-w-md mx-auto">
      <div className="card-header">
        <h3>Add New Bus</h3>
      </div>

      <div className="card-body">
        <div className="form-group">
          <label className="form-label">Bus ID</label>
          <input
            type="text"
            className="form-input"
            placeholder="AMT-001"
            value={formData.busId}
            onChange={(e) =>
              setFormData({ ...formData, busId: e.target.value })
            }
          />
          <p className="form-hint">Unique identifier for the bus</p>
        </div>

        <div className="form-group">
          <label className="form-label">Route</label>
          <select
            className="form-select"
            value={formData.route}
            onChange={(e) =>
              setFormData({ ...formData, route: e.target.value })
            }
          >
            <option value="">Select a route...</option>
            <option value="navsari-badnera">Navsari → Badnera</option>
            <option value="navsari-surat">Navsari → Surat</option>
          </select>
        </div>

        <div className="form-group">
          <label className="form-label">Status</label>
          <select
            className="form-select"
            value={formData.status}
            onChange={(e) =>
              setFormData({ ...formData, status: e.target.value })
            }
          >
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="maintenance">Maintenance</option>
          </select>
        </div>
      </div>

      <div className="card-footer">
        <button className="btn-ghost">Cancel</button>
        <button className="btn-primary">Add Bus</button>
      </div>
    </div>
  );
}
```

## 🛠️ Utilities

### TypeScript Utility Functions

```typescript
import {
  createAdminTransition,
  createAdminGlow,
  getAdminBadgeStyle,
  getAdminButtonStyle,
  createAdminGrid,
} from "@/lib/adminDesignTokens";

// Create custom transition
const myTransition = createAdminTransition("background-color", "slow");
// Output: "background-color 300ms ease-in-out"

// Create glow effect
const glowShadow = createAdminGlow("#FFD000", 20);
// Output: "0 0 20px rgba(255, 208, 0, 0.2)"

// Get badge styles
const activeStyle = getAdminBadgeStyle("active");

// Get button styles
const primaryStyle = getAdminButtonStyle("primary");

// Create responsive grid
const gridStyle = createAdminGrid(3, "normal");
```

### Tailwind Utility Classes

```tsx
{/* Flexbox utilities */}
<div className="flex-center">Centered</div>          {/* Center flex */}
<div className="flex-between">Left <Right /></div>   {/* Space between */}
<div className="flex-col-center">Flex Column</div>   {/* Column flex center */}

{/* Text utilities */}
<div className="text-truncate">Very long text...</div>  {/* Truncate with ellipsis */}
<div className="text-clamp-2">Multi-line clamped</div> {/* Clamp to 2 lines */}

{/* Sizing utilities */}
<div className="size-full">Full size</div>  {/* width & height 100% */}
<div className="square">Square box</div>    {/* aspect-square */}

{/* Visibility utilities */}
<div className="hidden-mobile">Hidden on mobile</div>
<div className="visible-mobile">Only on mobile</div>

{/* Transition utilities */}
<div className="transition-fast">Fast animation</div>
<div className="transition-normal">Normal animation</div>
<div className="transition-slow">Slow animation</div>
```

### Alert/Status Boxes

```tsx
<div className="alert alert-success">
  <CheckCircle size={16} className="inline mr-md" />
  Operation completed successfully
</div>

<div className="alert alert-danger">
  <AlertCircle size={16} className="inline mr-md" />
  An error occurred
</div>

<div className="alert alert-warning">
  <AlertTriangle size={16} className="inline mr-md" />
  Please review this warning
</div>

<div className="alert alert-info">
  <Info size={16} className="inline mr-md" />
  This is informational
</div>
```

## 🎯 Best Practices

1. **Color Usage**
   - Use `#FFD000` (yellow) for primary actions and highlights
   - Reserve `#22C55E` (green) for success states
   - Use `#FF4444` (red) only for destructive actions
   - Keep backgrounds consistent with dark theme

2. **Typography**
   - Enable font smoothing with `antialiased` class
   - Use proper text hierarchy (h1 → h6)
   - Always label form inputs with proper `<label>` tags
   - Use uppercase, letter-spaced text for labels and captions

3. **Spacing**
   - Use consistent spacing values (xs, sm, md, lg, xl, xxl)
   - Maintain vertical rhythm with consistent line heights
   - Use grid gap for consistent spacing in layouts

4. **Components**
   - Use provided button classes (.btn-primary, .btn-ghost, .btn-danger)
   - Always use form classes (.form-input, .form-label, .form-group)
   - Combine card classes for consistent card styling
   - Use badge classes for status indicators

5. **Accessibility**
   - Always include proper label elements for inputs
   - Use semantic HTML (button, input, select, etc.)
   - Maintain sufficient color contrast
   - Provide error/success messages for form validation

6. **Performance**
   - Use CSS classes instead of inline styles where possible
   - Leverage Tailwind's utility classes for responsive design
   - Use transitions sparingly for smooth UX
   - Minimize direct style object usage

## 📚 File Structure

```
admin/
├── src/
│   ├── lib/
│   │   └── adminDesignTokens.ts    # Design system tokens
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Sidebar.tsx
│   │   │   ├── Header.tsx
│   │   │   └── MainLayout.tsx
│   │   ├── common/
│   │   │   ├── Button.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Card.tsx
│   │   │   └── Badge.tsx
│   │   └── ...
│   ├── pages/
│   │   ├── Dashboard.tsx
│   │   ├── BusesPage.tsx
│   │   └── RoutesPage.tsx
│   └── index.css
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

## 🔗 Integration

### With React Components

```tsx
import { adminColors } from "@/lib/adminDesignTokens";

interface CardProps {
  title: string;
  children: React.ReactNode;
}

export function Card({ title, children }: CardProps) {
  return (
    <div
      style={{
        backgroundColor: adminColors.background.card,
        border: `1px solid ${adminColors.border.base}`,
        borderRadius: "12px",
        padding: "16px",
      }}
    >
      <h3 style={{ color: adminColors.text.primary }}>{title}</h3>
      {children}
    </div>
  );
}
```

### With CSS Modules

```css
/* AdminCard.module.css */
.card {
  background-color: var(--bg-card, #1a1a1a);
  border: 1px solid var(--border, #2a2a2a);
  border-radius: 12px;
  padding: 16px;
}

.card:hover {
  background-color: var(--bg-elevated, #222222);
}
```

## 📞 Support

For questions or suggestions about the design system:

1. Check this documentation
2. Review component examples
3. Reference the token definitions in `adminDesignTokens.ts`
4. Check Tailwind CSS classes in `index.css`

---

**Last Updated**: April 2025
**Design System Version**: 1.0
**Framework**: React 18+ with TypeScript
**Styling**: Tailwind CSS 3.x + Custom CSS
