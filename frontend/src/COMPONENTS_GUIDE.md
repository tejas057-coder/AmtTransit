# Rapido Components - Implementation Guide

This guide demonstrates how to use all the Rapido design system components across different pages.

## Quick Reference

### Component Imports

```typescript
// Design System Components
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  PrimaryButton,
  SecondaryButton,
  IconButton,
  StatusBadge,
  Chip,
  Text,
  Input,
  NavItem,
  Alert,
  Divider,
} from "@/components/ui/rapido-components";

// Bus Tracking Components
import {
  BusInfoCard,
  LiveStatusBadge,
  NoBusesEmpty,
} from "@/components/tracking/BusCard";

// Search Components
import { SearchBar, FilterChip } from "@/components/SearchBar";

// Icons from Lucide React
import {
  MapPin,
  Navigation2,
  Clock,
  Users,
  AlertCircle,
  Plus,
} from "lucide-react";
```

## Component Examples

### 1. Card with Header and Content

```typescript
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/rapido-components";

export function BusDetailsExample() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Next Bus Arriving</CardTitle>
      </CardHeader>
      <CardDescription>Route 45A • 5 minutes away</CardDescription>
    </Card>
  );
}
```

### 2. Status Badges

```typescript
import { StatusBadge } from "@/components/ui/rapido-components";

export function BusStatusExample() {
  return (
    <div className="flex gap-2">
      <StatusBadge status="on-time" />      {/* Yellow "On Time" */}
      <StatusBadge status="delayed" />      {/* Red "Delayed" */}
      <StatusBadge status="arrived" />      {/* Green "Arrived" */}
    </div>
  );
}
```

### 3. Primary and Secondary Buttons

```typescript
import { PrimaryButton, SecondaryButton } from "@/components/ui/rapido-components";

export function ButtonExample() {
  return (
    <div className="space-y-3">
      {/* Yellow button with black text */}
      <PrimaryButton onClick={() => alert("Booked!")}>
        Book Bus
      </PrimaryButton>

      {/* Outlined button */}
      <SecondaryButton onClick={() => console.log("Cancelled")}>
        Cancel
      </SecondaryButton>

      {/* Disabled state */}
      <PrimaryButton disabled>
        Unavailable
      </PrimaryButton>
    </div>
  );
}
```

### 4. Search Bar with Filters

```typescript
import { SearchBar, FilterChip } from "@/components/SearchBar";
import { useState } from "react";

export function SearchExample() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<"all" | "nearby" | "favorites">("all");

  return (
    <div className="space-y-4">
      <SearchBar
        placeholder="Search stops or routes"
        onSearch={(query) => setSearchQuery(query)}
        onClear={() => setSearchQuery("")}
      />

      {/* Filter Chips */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        <FilterChip
          label="All Buses"
          active={activeFilter === "all"}
          onClick={() => setActiveFilter("all")}
        />
        <FilterChip
          label="Nearby"
          active={activeFilter === "nearby"}
          onClick={() => setActiveFilter("nearby")}
        />
        <FilterChip
          label="Favorites"
          active={activeFilter === "favorites"}
          onClick={() => setActiveFilter("favorites")}
        />
      </div>
    </div>
  );
}
```

### 5. Bus Info Card (Detailed View)

```typescript
import { BusInfoCard } from "@/components/tracking/BusCard";

export function BusDetailExample() {
  return (
    <BusInfoCard
      route="45A"
      source="Railway Station"
      destination="CIDCO"
      eta={5}
      occupancy={75}
      passengers={45}
      capacity={60}
      status="on-time"
      nextStop="Central Bus Stand"
    />
  );
}
```

### 6. Live Status Badge

```typescript
import { LiveStatusBadge } from "@/components/tracking/BusCard";

export function LiveTrackingExample() {
  return (
    <div className="space-y-4">
      <LiveStatusBadge />
      <p className="text-muted-foreground text-sm">
        Real-time location updates enabled
      </p>
    </div>
  );
}
```

### 7. Text Variants

```typescript
import { Text } from "@/components/ui/rapido-components";

export function TextVariantsExample() {
  return (
    <div className="space-y-4">
      <Text variant="heading">Page Heading</Text>
      <Text variant="subheading">Section Subtitle</Text>
      <Text variant="body">Regular body text goes here</Text>
      <Text variant="label">Label or caption text</Text>
      <Text variant="muted">Secondary or muted text</Text>
    </div>
  );
}
```

### 8. Alert Messages

```typescript
import { Alert } from "@/components/ui/rapido-components";

export function AlertExample() {
  return (
    <div className="space-y-3">
      <Alert variant="default">No buses available at this time</Alert>
      <Alert variant="danger">Bus service delayed by 10 minutes</Alert>
      <Alert variant="success">Bus has arrived at your stop</Alert>
      <Alert variant="warning">Peak hours - buses may be crowded</Alert>
    </div>
  );
}
```

### 9. Chips/Tags

```typescript
import { Chip } from "@/components/ui/rapido-components";
import { Plus } from "lucide-react";

export function ChipExample() {
  return (
    <div className="flex gap-2 flex-wrap">
      <Chip
        label="Favorite Stops"
        icon={<Plus className="w-4 h-4" />}
        onRemove={() => console.log("Removed")}
      />
      <Chip label="Route 45A" />
      <Chip label="Morning Schedule" onRemove={() => console.log("Removed")} />
    </div>
  );
}
```

### 10. Full Page Example: Routes Page

```typescript
import { useState } from "react";
import { SearchBar, FilterChip } from "@/components/SearchBar";
import { Card, CardTitle, PrimaryButton, StatusBadge } from "@/components/ui/rapido-components";
import { Clock, MapPin } from "lucide-react";

export function RoutesPageExample() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");

  const routes = [
    { id: 1, number: "45A", source: "Railway", dest: "CIDCO", status: "on-time" },
    { id: 2, number: "12B", source: "Medical", dest: "Jail Rd", status: "delayed" },
    { id: 3, number: "7", source: "CIDCO", dest: "Chowk", status: "on-time" },
  ];

  return (
    <div className="bg-background min-h-screen pb-24 lg:pb-8 px-4 py-6">
      {/* Header */}
      <h1 className="text-foreground font-bold text-2xl mb-4">Available Routes</h1>

      {/* Search + Filters */}
      <div className="space-y-4 mb-6">
        <SearchBar onSearch={setSearchQuery} />
        <div className="flex gap-2 overflow-x-auto pb-2">
          <FilterChip
            label="All"
            active={activeFilter === "all"}
            onClick={() => setActiveFilter("all")}
          />
          <FilterChip
            label="Nearby"
            active={activeFilter === "nearby"}
            onClick={() => setActiveFilter("nearby")}
          />
        </div>
      </div>

      {/* Routes List */}
      <div className="space-y-3">
        {routes.map((route) => (
          <Card key={route.id}>
            <div className="flex items-start justify-between mb-3">
              <CardTitle>{`Route ${route.number}`}</CardTitle>
              <StatusBadge status={route.status as any} />
            </div>

            <div className="space-y-2 mb-4">
              <div className="flex items-center gap-2 text-muted-foreground text-sm">
                <MapPin className="w-4 h-4" />
                {route.source} → {route.dest}
              </div>
              <div className="flex items-center gap-2 text-muted-foreground text-sm">
                <Clock className="w-4 h-4" />
                Runs daily • 5:00 AM - 11:00 PM
              </div>
            </div>

            <PrimaryButton className="w-full">View Schedule</PrimaryButton>
          </Card>
        ))}
      </div>
    </div>
  );
}
```

## Page Layout Pattern

Every page follows this structure:

```typescript
import { useEffect, useState } from "react";
import { [required components] } from "@/components/...";

export default function PageName() {
  const [data, setData] = useState([]);

  useEffect(() => {
    // Fetch data from API
  }, []);

  return (
    <div className="bg-background min-h-screen pb-24 lg:pb-8">
      {/* Top Section */}
      <section className="px-4 pt-6 pb-6">
        {/* Header or Search */}
      </section>

      {/* Main Content */}
      <section className="px-4 space-y-3">
        {/* Cards or List */}
      </section>
    </div>
  );
}
```

## Common Tailwind Patterns

### Spacing

```tsx
// Vertical spacing
<div className="space-y-3">           {/* 12px gap */}
<div className="space-y-4">           {/* 16px gap */}
<div className="space-y-6">           {/* 24px gap */}

// Horizontal padding
<section className="px-4">            {/* 16px left + right */}
<section className="px-6">            {/* 24px left + right */}

// Top/Bottom padding
<div className="py-4">                {/* 16px top + bottom */}
```

### Text Styles

```tsx
// Headings
text-2xl font-bold text-foreground

// Body
text-base font-normal text-foreground

// Secondary
text-sm font-normal text-muted-foreground

// Labels
text-sm font-medium text-foreground
```

### Interactive States

```tsx
// Hover effect
hover:bg-muted/50 transition-colors

// Focus state
focus:ring-2 focus:ring-primary/50

// Disabled
disabled:opacity-50 disabled:cursor-not-allowed

// Active
active:scale-95 transition-transform
```

## Theme Colors - Quick Lookup

| Token                            | Value   | Usage                              |
| -------------------------------- | ------- | ---------------------------------- |
| `bg-background`                  | #0D0D0D | Page background                    |
| `bg-card`                        | #1A1A1A | Card backgrounds                   |
| `text-foreground`                | #FFFFFF | Primary text                       |
| `text-muted-foreground`          | #A0A0A0 | Secondary text                     |
| `bg-primary` / `text-primary`    | #FFD000 | Yellow accent (active, highlights) |
| `bg-success` / `text-success`    | #22C55E | Green (positive, arrived)          |
| `bg-danger` / `text-destructive` | #EF4444 | Red (negative, delayed)            |
| `border-white/8`                 | -       | Subtle borders                     |

## Best Practices

1. **Always use responsive classes**

   ```tsx
   className = "hidden lg:block"; // Desktop only
   className = "lg:hidden"; // Mobile only
   ```

2. **Consistent spacing**

   ```tsx
   // Use space-y-3 or space-y-4 for vertical lists
   // Use px-4 for page margins
   // Use p-4 for card padding
   ```

3. **Color consistency**

   ```tsx
   // Use predefined colors, not arbitrary hex
   className = "text-primary"; // ✓ Good
   className = "text-[#FFD000]"; // ✗ Avoid
   ```

4. **Accessibility**

   ```tsx
   // Always include labels with inputs
   // Combine color with text (not color alone)
   // Use semantic HTML (Link for navigation, Button for actions)
   ```

5. **Mobile-first**
   ```tsx
   // Design for mobile first, then add lg: variants
   className = "w-full lg:w-1/2";
   className = "flex-col lg:flex-row";
   ```

## Troubleshooting

**Colors not applying?**

- Check CSS variables are defined in `src/index.css`
- Ensure Tailwind config includes the color tokens
- Run `npm run dev` to restart Vite HMR

**Spacing looks off?**

- Use consistent space-y or gap values
- Match padding/margin between similar components
- Use px-4 for page margins across all pages

**Components not importing?**

- Check file path is correct (relative to current file)
- Ensure component is exported as default or named export
- Verify TypeScript paths in tsconfig.json

**Responsive issues?**

- Mobile-first: write base styles, then add lg: variants
- Test with actual mobile device or browser dev tools
- Use `hidden lg:block` and `lg:hidden` for layout changes
