# Rapido Design System - Quick Reference

## 🎨 Color Tokens

```
Display Colors:
├─ Background   (#0D0D0D)  → bg-background
├─ Card         (#1A1A1A)  → bg-card
├─ Foreground   (#FFFFFF)  → text-foreground
├─ Muted        (#A0A0A0)  → text-muted-foreground
│
Accent Colors:
├─ Primary      (#FFD000)  → bg-primary, text-primary (Yellow)
├─ Success      (#22C55E)  → bg-success, text-success (Green)
└─ Danger       (#EF4444)  → bg-danger, text-destructive (Red)

Borders:
└─ border-white/8         → Subtle divider lines
```

## 📐 Layout

```
Mobile (< 1024px):          Desktop (≥ 1024px):
┌─────────────────┐         ┌─────────────────────────────┐
│ Top Nav (mobile)│         │ Sidebar (280px) │ Content    │
├─────────────────┤         ├──────────┬──────┤            │
│                 │         │          │      │            │
│     Content     │    →    │ Content Area    │            │
│                 │         │                 │            │
├─────────────────┤         └─────────────────┘
│  Bottom Nav     │         (Bottom nav hidden)
└─────────────────┘
```

## 🧩 Components Overview

### Base Components (rapido-components.tsx)

```
Card          → bg-card border border-white/8 rounded-[16px] p-4
Button        → PrimaryButton (yellow) or SecondaryButton (outlined)
Badge         → StatusBadge (on-time/delayed/arrived)
Chip          → Chip with optional icon and onRemove
Text          → Text(variant: heading|subheading|body|label|muted)
Input         → Input field with focus ring
Alert         → Alert(variant: default|danger|success|warning)
NavItem       → Navigation link with active state
Divider       → Simple border-t divider
IconButton    → Small icon-only button
```

### Page Components

```
SearchBar           → Search input with clear button
FilterChip          → Toggleable filter chips
BusInfoCard         → Detailed bus information card
LiveStatusBadge     → Pulsing live indicator
NoBusesEmpty        → Empty state illustration
```

## 📱 Spacing Scale

```
0    → 0px
px   → 1px
0.5  → 2px
1    → 4px
1.5  → 6px
2    → 8px
3    → 12px ← Common for space-y
4    → 16px ← Common for px-4, p-4
6    → 24px
8    → 32px
```

## 🔤 Typography

```
Font Family: Inter, Geist, system-ui, sans-serif

Weights:
- font-normal    (400) → body text
- font-medium    (500) → labels, button text
- font-bold      (700) → headings

Sizes:
- text-xs        (12px)
- text-sm        (14px)
- text-base      (16px)
- text-lg        (18px)
- text-xl        (20px)
- text-2xl       (24px)
- text-3xl       (30px)
- text-4xl       (36px)
```

## 🎯 Rounded Corners

```
rounded-[8px]      → Input, small elements
rounded-[12px]     → Buttons, filter chips, alerts
rounded-[16px]     → Cards, large components
rounded-[20px]     → Pills, badges, chips
rounded-full       → Circles (badges, avatars)
```

## 🎬 Common Patterns

### Page Structure

```tsx
<div className="bg-background min-h-screen pb-24 lg:pb-0">
  <section className="px-4 pt-6 pb-6">
    {/* Top section: header, search, filters */}
  </section>

  <section className="px-4 space-y-3">
    {/* Main content: cards, list items */}
  </section>
</div>
```

### Card with Badge

```tsx
<Card>
  <div className="flex justify-between items-start">
    <h3 className="text-foreground font-bold">Title</h3>
    <StatusBadge status="on-time" />
  </div>
</Card>
```

### Button Group

```tsx
<div className="flex gap-2">
  <PrimaryButton className="flex-1">Primary</PrimaryButton>
  <SecondaryButton className="flex-1">Secondary</SecondaryButton>
</div>
```

### Occupancy Bar

```tsx
<div className="w-full bg-muted/40 rounded-full h-2">
  <div
    className="h-2 rounded-full bg-primary"
    style={{ width: "75%" }}
  />
</div>
<p className="text-muted-foreground text-xs">75% full</p>
```

## 📋 Responsive Utilities

```
Mobile First (write these first):
- Default styles apply to mobile
- Use as-is

Desktop Overrides (add lg: prefix):
- lg:hidden        → Hide on desktop
- lg:block         → Show on desktop
- lg:ml-[280px]    → Account for sidebar
- lg:flex          → Change to flex layout
- lg:w-1/2         → Half width on desktop
```

## 🔌 Icons (lucide-react)

```
Always use:
import { IconName } from "lucide-react"

Common sizes:
- w-4 h-4    → Small inline icons
- w-5 h-5    → Standard icons
- w-6 h-6    → Large nav icons
- w-8 h-8    → Hero/display icons

Common icons in app:
Search, MapPin, Navigation2, Clock, Users,
Bell, Home, Route, Calendar, Menu, X,
ChevronRight, AlertCircle, Plus, LogOut, User
```

## ✅ Checklist for New Pages

```
[ ] Import AppLayout wrapper (auto-includes BottomNav)
[ ] Set bg-background on main container
[ ] Use px-4 for horizontal margins
[ ] Use pb-24 lg:pb-0 for bottom padding (mobile nav)
[ ] Create sections with <section> tags
[ ] Use proper spacing (space-y-3, space-y-4)
[ ] Use Card for grouped content
[ ] Use PrimaryButton for CTAs
[ ] Use StatusBadge for status indicators
[ ] Use Lucide icons only
[ ] Add responsive classes (lg:)
[ ] Test on mobile and desktop
```

## 🎨 Occupancy Color Coding

```
0-50% (Low)     → text-success green (#22C55E)
51-80% (Med)    → text-primary yellow (#FFD000)
81-100% (High)  → text-danger red (#EF4444)
```

## 🚀 Quick Start Component

```typescript
// Minimal working component
import { Card, CardTitle, PrimaryButton } from "@/components/ui/rapido-components";
import { MapPin } from "lucide-react";

export default function Example() {
  return (
    <div className="bg-background min-h-screen p-4">
      <Card>
        <CardTitle>Example Bus</CardTitle>
        <div className="flex items-center gap-2 text-muted-foreground text-sm my-3">
          <MapPin className="w-4 h-4" />
          Railway Station → CIDCO
        </div>
        <PrimaryButton className="w-full">Book Bus</PrimaryButton>
      </Card>
    </div>
  );
}
```

## 🔗 File Structure Reference

```
frontend/
├── src/
│   ├── components/
│   │   ├── ui/
│   │   │   └── rapido-components.tsx    ← Main design system
│   │   ├── layout/
│   │   │   ├── AppLayout.tsx
│   │   │   ├── AppSidebar.tsx
│   │   │   └── BottomNav.tsx
│   │   ├── tracking/
│   │   │   └── BusCard.tsx
│   │   └── SearchBar.tsx
│   ├── pages/
│   │   ├── Index.tsx                    ← Home page
│   │   ├── LiveMapPage.tsx
│   │   ├── RoutesPage.tsx
│   │   └── ... (other pages)
│   ├── App.tsx                          ← Router config
│   └── index.css                        ← CSS variables
├── tailwind.config.ts                   ← Tailwind setup
└── COMPONENTS_GUIDE.md                  ← Full guide
```

## 💡 Pro Tips

1. **Mobile First**: Write base styles, then add `lg:` variants
2. **Use Presets**: Copy existing patterns instead of building from scratch
3. **Check Types**: All components are TypeScript-typed, IDE autocomplete works
4. **Consistent Spacing**: Always use `space-y-3` or `space-y-4` for vertical lists
5. **Test Responsive**: Use browser DevTools responsive mode to test mobile/desktop
6. **Color Names**: Refer to color tokens (not hex values) in code
7. **Icon Sizing**: Usually `w-5 h-5` for UI, `w-4 h-4` for inline, `w-6 h-6` for nav
8. **CSS Variables**: All colors use CSS custom properties (accessible in Tailwind)

## 🐛 Common Issues & Fixes

```
❌ Colors look wrong
   → Check src/index.css CSS variables
   → Restart dev server (npm run dev)

❌ Responsive layout broken
   → Add lg:hidden / hidden lg:block
   → Check pb-24 lg:pb-0 for mobile nav offset
   → Test with actual viewport sizes

❌ Components don't import
   → Verify file path relative to current file
   → Check component is exported
   → Restart IDE autocomplete if needed

❌ Search/Inputs not working
   → Wrap in form or handle with onChange handler
   → Check value and onChange props are connected
```

## 📚 Related Docs

- [HOME_PAGE_GUIDE.md](./pages/HOME_PAGE_GUIDE.md) - Home page specifics
- [COMPONENTS_GUIDE.md](./COMPONENTS_GUIDE.md) - Detailed examples
- [../DESIGN_SYSTEM.md](../DESIGN_SYSTEM.md) - Complete design tokens
- [../DESIGN_IMPLEMENTATION.md](./DESIGN_IMPLEMENTATION.md) - Setup & configuration
