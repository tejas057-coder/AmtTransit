# AmravatiTransit Frontend - Rapido Design System

This frontend is built with **React + TypeScript + Vite** and styled with a **Rapido-inspired dark theme** using **Tailwind CSS** and **shadcn/ui** components.

## 🎨 Design System

### Color Palette

- **Background**: `#0D0D0D` (near-black)
- **Cards/Surface**: `#1A1A1A` (dark gray)
- **Primary (Accent)**: `#FFD000` (bright yellow)
- **Text**: `#FFFFFF` (white)
- **Muted Text**: `#A0A0A0` (gray)
- **Success**: `#22C55E` (green)
- **Danger**: `#EF4444` (red)

### Border Radius

- Cards: `16px` → use `rounded-[16px]`
- Buttons: `12px` → use `rounded-[12px]`
- Pills/Chips: `20px` → use `rounded-[20px]`

### Typography

- **Font**: Inter or Geist, system-ui fallback
- **Headings**: `font-bold` (700)
- **Body**: `font-normal` (400)
- **Labels**: `font-medium` (500)

### Navigation

- **Desktop**: Sidebar with 7 navigation items (collapsible)
- **Mobile**: Bottom navigation bar with 5 icons (Home, Map, Routes, Schedule, More)

## 📁 Project Structure

```
frontend/
├── src/
│   ├── components/
│   │   ├── layout/
│   │   │   ├── AppLayout.tsx         # Main layout wrapper
│   │   │   ├── AppSidebar.tsx        # Desktop sidebar navigation
│   │   │   └── BottomNav.tsx         # Mobile bottom navigation
│   │   ├── ui/
│   │   │   ├── rapido-components.tsx # Reusable design system components
│   │   │   └── [other shadcn/ui components]
│   │   └── [other components]
│   ├── pages/
│   │   ├── Index.tsx                 # Home page
│   │   ├── LiveMapPage.tsx           # Map tracking
│   │   ├── RoutesPage.tsx            # Bus routes
│   │   ├── SchedulePage.tsx          # Schedules
│   │   ├── StopsPage.tsx             # Bus stops
│   │   ├── TripsPage.tsx             # User trips
│   │   ├── NotificationsPage.tsx     # Notifications
│   │   ├── HelpPage.tsx              # Help/Support
│   │   └── NotFound.tsx              # 404 page
│   ├── hooks/
│   ├── lib/                          # Utilities
│   ├── data/
│   ├── index.css                     # Global styles + CSS variables
│   └── main.tsx
├── tailwind.config.ts                # Tailwind configuration with design tokens
└── package.json
```

## 🚀 Getting Started

### Install Dependencies

```bash
npm install
```

### Development Mode

```bash
npm run dev
```

### Build for Production

```bash
npm run build
```

### Linting

```bash
npm run lint
```

### Testing

```bash
npm run test
npm run test:watch
```

## 🎯 Using Design System Components

### Import Rapido Components

```tsx
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  PrimaryButton,
  SecondaryButton,
  StatusBadge,
  Chip,
  Text,
  Input,
  NavItem,
  Alert,
  Divider,
  IconButton,
} from "@/components/ui/rapido-components";
```

### Example: Bus Card with Status Badge

```tsx
import {
  Card,
  CardHeader,
  CardTitle,
  StatusBadge,
} from "@/components/ui/rapido-components";

export function BusCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Bus 45A</CardTitle>
        <StatusBadge status="on-time" />
      </CardHeader>
      <p className="text-muted-foreground">Next Departure: 2:30 PM</p>
    </Card>
  );
}
```

### Example: Primary Button

```tsx
import { PrimaryButton } from "@/components/ui/rapido-components";

export function BookButton() {
  return (
    <PrimaryButton onClick={() => alert("Booked!")}>
      Book This Bus
    </PrimaryButton>
  );
}
```

### Example: Status Indicators

```tsx
import { StatusBadge } from "@/components/ui/rapido-components";

// Use: "on-time" | "delayed" | "arrived"
<StatusBadge status="on-time" />      {/* Yellow badge */}
<StatusBadge status="delayed" />      {/* Red badge */}
<StatusBadge status="arrived" />      {/* Green badge */}
```

## 🔧 CSS Variables (Available in Tailwind)

Access color system through CSS custom properties:

```css
/* Colors */
--background: #0d0d0d --foreground: #ffffff --card: #1a1a1a --primary: #ffd000
  /* Yellow */ --destructive: #ef4444 /* Red */ --success: #22c55e /* Green */
  --muted-foreground: #a0a0a0 /* Tailwind utilities */ bg-background
  /* Page background */ bg-card /* Card background */ text-foreground
  /* White text */ text-muted-foreground /* Gray text */ text-primary
  /* Yellow text */ text-destructive /* Red text */ border-white/8
  /* Subtle borders */;
```

## 🎭 Tailwind Classes Reference

### Colors

```tsx
// Text colors
<p className="text-foreground">White text</p>
<p className="text-muted-foreground">Gray text</p>
<p className="text-primary">Yellow text</p>

// Background colors
<div className="bg-background">Page background</div>
<div className="bg-card">Card background</div>
<div className="bg-primary">Yellow background</div>

// Border colors
<div className="border border-white/8">Subtle border</div>
```

### Typography

```tsx
<h1 className="text-foreground font-bold text-2xl">Heading</h1>
<p className="text-foreground font-normal">Body text</p>
<label className="text-foreground font-medium">Label</label>
```

### Components

```tsx
// Cards (16px radius)
<div className="bg-card border border-white/8 rounded-[16px] p-4"></div>

// Buttons (12px radius)
<button className="bg-primary text-primary-foreground rounded-[12px] px-4 py-3"></button>

// Chips (20px radius)
<div className="bg-primary/10 rounded-[20px] px-3 py-1"></div>
```

## 📱 Responsive Design

- **Mobile First**: Design starts with mobile layout
- **Breakpoints**: Tailwind defaults (sm: 640px, md: 768px, lg: 1024px, etc.)
- **Bottom Nav**: Hidden on desktop (`lg:hidden`), visible on mobile
- **Sidebar**: Collapsible drawer on mobile, fixed on desktop (`lg:translate-x-0`)

### Mobile-specific utilities

```tsx
// Show only on mobile
<div className="lg:hidden">Mobile only</div>

// Show only on desktop
<div className="hidden lg:block">Desktop only</div>

// Fixed bottom nav on mobile
<nav className="lg:hidden fixed bottom-0 left-0 right-0"></nav>
```

## 🔗 Integration with Backend

Frontend connects to backend API:

- Base URL: `http://localhost:5000` (default)
- Configure in environment variables (`.env.local`)

### Example API Call

```typescript
async function fetchBuses() {
  const response = await fetch("http://localhost:5000/api/buses");
  return response.json();
}
```

## 📦 Key Dependencies

- **React 18.x** - UI framework
- **React Router** - Client-side routing
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **shadcn/ui** - Component library
- **Lucide React** - Icons
- **Leaflet** - Map integration
- **React Hook Form** - Form handling

## 🐛 Troubleshooting

### Colors not applying correctly

- Ensure `tailwind.config.ts` has correct color definitions
- Check `src/index.css` for CSS variable definitions
- Rebuild: `npm run build`

### Responsive issues on mobile

- Use `lg:hidden` for mobile-specific UI
- Use `hidden lg:block` for desktop-specific UI
- Test with actual device or browser dev tools responsive mode

### Icons not showing

- Use only `lucide-react` icons
- Import: `import { IconName } from "lucide-react"`

## 📚 Resources

- [Tailwind CSS Documentation](https://tailwindcss.com)
- [shadcn/ui Component Library](https://ui.shadcn.com)
- [Lucide React Icons](https://lucide.dev)
- [Design System Tokens](../DESIGN_SYSTEM.md)

## 🎨 Customization

To modify the design system:

1. **Colors**: Edit CSS variables in `src/index.css`
2. **Typography**: Modify font settings in `tailwind.config.ts`
3. **Components**: Update `src/components/ui/rapido-components.tsx`
4. **Global Styles**: Edit `src/index.css` for base layer utilities

All changes automatically apply thanks to Tailwind's JIT compilation.
