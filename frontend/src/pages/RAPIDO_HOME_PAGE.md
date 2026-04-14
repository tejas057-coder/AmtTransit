# Rapido Home Page Implementation - AmravatiTransit

## Overview

The Home page (Index.tsx) has been completely redesigned to match **Rapido's UI/UX design language**, India's leading ride-hailing app, with a focus on bus tracking and transit information discovery.

## Key Features

### 1. **Top Header**

```
┌────────────────────────────────────────┐
│  📍 Amravati ▼          🔔 3           │
└────────────────────────────────────────┘
```

- **Left**: Location chip with pin icon + city name + dropdown chevron
- **Right**: Notification bell with yellow badge counter
- Sticky positioning (stays at top while scrolling)
- Dark background with subtle borders

### 2. **Hero Search Bar**

```
┌──────────────────────────────────────┐
│ 🔍 Where do you want to go?           │
└──────────────────────────────────────┘
```

- Full-width rounded pill design (`rounded-[26px]`)
- Height: 52px (`h-[52px]`)
- Large, inviting placeholder text
- Search icon on left side
- Focus state: Yellow ring + border (`focus:ring-primary/30`)
- Hover effect on border

### 3. **Quick Actions Row**

```
[🗺 Live Map] [🛣 All Routes] [🕐 Schedule] [📍 Nearby Stop]
```

- Horizontal scrollable row with `snap-x snap-mandatory` (smooth snapping)
- Hidden scrollbar (`no-scrollbar` utility class)
- 4 action pills with:
  - Dark background (`bg-card`)
  - Icon + label format
  - Hover effect: Border color changes to yellow (`hover:border-primary/50`)
  - Icon color transitions to yellow on hover

### 4. **"Buses Near You" Section Header**

```
🟢 Buses Near You  [💛 6]
```

- Title with animated live dot (green pulsing circle)
- Yellow count badge showing number of buses
- Pulsing animation: `animate-pulse` + `animate-ping`

### 5. **Bus Cards** (Main Content)

Each card displays detailed bus information in a compact layout:

```
┌──────────────────────────────────────────────┐
│ [R-24]  │  Navsari → CIDCO        │ 4 min 🟢🟡│
│         │  6 stops                 │        │
├──────────────────────────────────────────────┤
│ ████████████░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ │  Progress
└──────────────────────────────────────────────┘
```

**Layout:**

- **Left Section**: Yellow route badge
  - Format: `R-{number}` stacked vertically
  - Background: `bg-primary` (#FFD000)
  - Size: 56x56px
  - Border radius: 8px

- **Center Section**: Route information
  - Origin → Destination in bold white text (15px)
  - Stop count in muted gray below

- **Right Section**: ETA + Occupancy dots
  - Large yellow ETA text (e.g., "4 min")
  - Three occupancy dots below:
    - Green (bg-success): 0-20 passengers (1 dot)
    - Green + Yellow (bg-primary): 21-35 passengers (2 dots)
    - All three (+ bg-danger): 36+ passengers (3 dots)

- **Bottom**: Progress bar
  - Thin yellow bar showing bus position along route
  - Width: `passengers / 60 * 100%`
  - Smooth transition animation

### 6. **Bottom Navigation** (Mobile)

```
[🏠] [🗺️] [🛣️] [📅] [⋯]
Home (active = yellow)
```

- Fixed at bottom on mobile (`fixed bottom-0 left-0 right-0`)
- Hidden on desktop (`lg:hidden`)
- 5 main navigation items
- Active state: Yellow highlight

## Data Source

Uses real mock data from `src/data/mockData.ts`:

- **Bus array**: 7 real buses with realistic data
- **Bus properties**:
  ```typescript
  id: string;           // Unique identifier
  number: string;       // Display number (e.g., "AM-24")
  routeId: string;      // Route identifier
  lat/lng: number;      // GPS coordinates
  speed: number;        // Current speed
  passengers: number;   // Current occupants (used for occupancy calculation)
  nextStop: string;     // Next destination stop
  nextStopEta: number;  // Estimated time in minutes
  status: string;       // "on-time" | "delayed" | "at-stop"
  ```

## Design System Integration

**Colors Used:**

- Background: `bg-background` (#0D0D0D)
- Cards: `bg-card` (#1A1A1A)
- Primary: `bg-primary`, `text-primary` (#FFD000 - Yellow)
- Success: `bg-success` (#22C55E - Green)
- Danger: `bg-danger` (#EF4444 - Red)
- Muted: `text-muted-foreground` (#A0A0A0)
- Borders: `border-white/8`, `border-white/10`

**Typography:**

- Font: Inter, Geist, system-ui
- Headings: `font-bold`
- Body: `font-normal`
- Labels: `font-medium`

**Border Radius:**

- Cards: `rounded-[16px]`
- Pills: `rounded-[26px]`, `rounded-[24px]`
- Route badge: `rounded-[8px]`

## Responsive Design

- **Mobile (< 1024px)**:
  - Full width layouts with `px-4` padding
  - Bottom navigation visible (`pb-24` padding to avoid overlap)
  - Quick actions: horizontal scroll with snap

- **Desktop (≥ 1024px)**:
  - Sidebar visible on left (280px)
  - Bottom navigation hidden (`lg:hidden`)
  - Page padding adjusts with `lg:pb-8`

## Interactive Features

1. **Live Notification Badge**: Shows count of notifications (dynamic)
2. **Animated Live Dot**: Pulsing green indicator next to section title
3. **Bus Card Hover**: Border color brightens, slightly more visible
4. **Hero Search**: Focus state with yellow ring animation
5. **Quick Actions**: Hover effect with icon color change to yellow
6. **Snap Scroll**: Quick actions row snaps smoothly to one action at a time
7. **Link Navigation**: Bus cards link to `/bus/{id}` for detailed view

## CSS Utilities Added

### `no-scrollbar`

Hides scrollbar while preserving scroll functionality (for quick actions row):

```css
.no-scrollbar {
  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */
}

.no-scrollbar::-webkit-scrollbar {
  display: none; /* Chrome, Safari, Opera */
}
```

## Code Structure

```typescript
// Main page component
export default function Index() {
  // State management
  const [notificationCount, setNotificationCount] = useState(3);

  // Helper functions
  function getOccupancyDots(passengers: number): OccupancyDot[]
  function getBusProgress(passengers: number): number

  // UI sections
  // 1. Top header (location + notifications)
  // 2. Hero search bar
  // 3. Quick actions row
  // 4. "Buses Near You" title with live indicator
  // 5. Bus cards list (mapping over buses array)
  // 6. Additional spacing for mobile nav

  return (
    <div className="bg-background min-h-screen pb-24 lg:pb-0">
      {/* Header, search, actions, buses, spacing */}
    </div>
  )
}
```

## Key Tailwind Classes

```
Layout:
- bg-background, bg-card, bg-primary
- px-4 (horizontal padding)
- pb-24 lg:pb-0 (mobile nav offset)
- sticky top-0 z-40 (header positioning)
- overflow-x-auto, no-scrollbar (smooth scroll)

Typography:
- text-foreground, text-muted-foreground, text-primary
- font-bold, font-medium, font-normal
- text-lg, text-base, text-sm, text-xs

Interactive:
- hover:border-white/20, hover:bg-muted/50
- focus:ring-2 focus:ring-primary/30
- transition-all, transition-colors
- cursor-pointer

Animations:
- animate-pulse (live dot)
- animate-ping (live dot outer ring)
```

## Browser Compatibility

- Modern browsers (Chrome, Firefox, Safari, Edge)
- CSS custom properties (CSS Variables)
- CSS Grid/Flexbox for layout
- CSS animations (`@keyframes`)
- CSS snap scrolling (`snap-x`)

## Performance Considerations

- Uses mock data (no API calls on initial load)
- Efficient state management (minimal re-renders)
- CSS-based animations (smooth 60fps)
- Responsive images via Lucide React icons (SVG)
- Lazy loading friendly (vertical scrolling list)

## Future Enhancements

1. **Real-time updates**: WebSocket integration for live ETA updates
2. **Search functionality**: Filter buses by route or stop
3. **Notification click**: Navigate to notification details
4. **Location selection**: Allow users to change city/location
5. **Bookmarked routes**: Show recently used routes
6. **Analytics**: Track most used routes/stops

## Testing Checklist

- [ ] Header positioning (sticky at top)
- [ ] Search bar focus states and animations
- [ ] Quick actions scroll without visible scrollbar
- [ ] Bus cards display correct data
- [ ] Occupancy dots show correct colors
- [ ] Progress bar fills based on passenger count
- [ ] Mobile layout with bottom nav offset
- [ ] Desktop layout with sidebar
- [ ] All links navigate correctly
- [ ] Notification badge displays and updates
- [ ] Animations smooth and performant

## Dependencies

- React Router (Link component for navigation)
- Lucide React (icons: Bell, MapPin, Navigation2, Clock, Map, ChevronDown)
- Tailwind CSS (all styling)
- Mock data from `src/data/mockData.ts`
