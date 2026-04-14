# Home Page (Index) - Rapido Design Implementation

## Overview

The Home page displays the Amravati transit app with live bus tracking, search functionality, and quick access to key features.

## Layout Sections

### 1. Greeting Card Section

```tsx
Location: Top of page
Height: Auto
Content:
  - Large city name: "Amravati" (font-bold text-4xl text-foreground)
  - Current date (natural language format)
  - Current time (IST format, updated every minute)
  - Live status chip: "3 buses nearby" with animated pulse dot
```

**Features:**

- Dynamic time update every 60 seconds
- Pulsing green/yellow dot indicator
- Semi-transparent background with subtle border

### 2. Search Bar

```tsx
Location: Below greeting card
Height: 56px (py-3.5)
Style: Dark pill (rounded-[20px])
Features:
  - Search icon on left
  - Placeholder: "Search stops or routes"
  - Clear button (X icon) appears when text entered
  - Focus state: Yellow ring and border
```

### 3. Quick Actions Row

```tsx
Location: Below search bar
Layout: Horizontal scroll (overflow-x-auto)
Items: 4 action cards
  1. Live Map
  2. My Routes
  3. Schedule
  4. Nearest Stop

Each action:
  - Icon from lucide-react
  - Label text
  - Hover effect: Background highlight + icon color change to yellow
  - Border radius: 12px (rounded-[12px])
```

### 4. Nearby Buses Section

#### Header

- Title: "Nearby Buses" (font-bold text-lg)
- Link: "View Map" with chevron (right aligned)

#### Bus Cards (Vertical Stack)

```tsx
Layout: space-y-3 (12px gap between cards)
Card styling:
  - Background: bg-card (#1A1A1A)
  - Border: border-white/8 (subtle)
  - Radius: rounded-[16px]
  - Padding: p-4 (16px)
  - Hover: border-white/15 (slightly more visible)
```

**Card Content Layout:**

```
┌──────────────────────────────────────────────┐
│  [45A Badge]              5 min (ETA)        │  ← Route + Time Row
│                           Now (Last update)   │
│  📍 Railway Station                          │  ← Source
│      ▁                                        │  ← Connecting line
│  🧭 CIDCO                                    │  ← Destination
│  👥 [====== 75% ==════] 45/60                 │  ← Occupancy bar + count
│     75% full                                  │  ← Occupancy percentage
└──────────────────────────────────────────────┘
```

### 5. Load More Button Section

```tsx
Location: Bottom of buses list
Style: Secondary/outlined
Text: "Load More Buses"
Action: Fetches additional nearby buses
```

## Data Structure

```typescript
interface Bus {
  id: string;
  route: string; // "45A", "12B"
  source: string; // "Railway Station"
  destination: string; // "CIDCO"
  eta: number; // 5 (minutes)
  occupancy: number; // 75 (0-100 percentage)
  passengers: number; // 45 (current passengers)
  capacity: number; // 60 (total capacity)
  lastUpdate: string; // "Now", "2 min ago"
}
```

## Color Coding

### Route Badges

- Background: `bg-primary` (#FFD000)
- Text: `text-primary-foreground` (black)
- Font: Bold (font-bold)
- Size: text-base

### Occupancy Bar

- **0-50%**: Green (bg-success #22C55E) - Low occupancy
- **51-80%**: Yellow (bg-primary #FFD000) - Moderate occupancy
- **81-100%**: Red (bg-danger #EF4444) - High occupancy

### Occupancy Text

- Changes color based on percentage (text-success, text-primary, text-danger)

## Responsive Behavior

### Mobile (< 1024px)

- Full width with padding (px-4)
- Bottom navigation visible
- Greeting card full width
- Search bar full width
- Quick actions: horizontal scroll
- Bus cards: full width

### Desktop (≥ 1024px)

- Sidebar visible on left (280px)
- Main content margin-left: ml-[280px] (auto)
- Bottom navigation: hidden (lg:hidden)
- Cards can be wider

## Component Dependencies

```
Index.tsx (this page)
├── lucide-react icons (Search, MapPin, Navigation2, Clock, Users, ChevronRight)
├── React Router (Link)
└── Mock data: nearbyBuses[], quickActions[]
```

## Interactive Features

1. **Time Updates**: Auto-update every 60 seconds
2. **Search**: Input field with live search query state
3. **Quick Actions**: Clickable links to routes
4. **Bus Cards**: Clickable to navigate to `/bus/{id}`
5. **View Map Link**: Navigation to map view
6. **Hover Effects**: Cards and action items respond to hover
7. **Responsive Scroll**: Quick actions have horizontal scroll on mobile

## CSS Classes Used

```
Layout:
- bg-background (page background)
- px-4 (horizontal padding)
- pb-24 lg:pb-0 (bottom padding for mobile nav)
- min-h-screen (full height)

Cards:
- bg-card border border-white/8 rounded-[16px] p-4
- hover:border-white/15

Text:
- text-foreground (white text)
- text-muted-foreground (gray text)
- font-bold / font-medium / font-normal
- text-4xl / text-lg / text-sm

Colors:
- text-primary (yellow)
- text-success / text-danger
- bg-primary/10 / bg-primary/15

Groups & Transitions:
- group hover:(properties)
- transition-all / transition-colors
```

## Example: Adding Real Data

Replace mock data with API calls:

```typescript
const [nearbyBuses, setNearbyBuses] = useState<Bus[]>([]);

useEffect(() => {
  async function fetchBuses() {
    const response = await fetch("http://localhost:5000/api/buses/nearby");
    const data = await response.json();
    setNearbyBuses(data);
  }
  fetchBuses();
}, []);
```

## Accessibility Features

- Search input has clear label (placeholder)
- Color not the only indicator (e.g., occupancy combined with percentage text)
- Icons paired with text labels
- Semantic HTML structure
- Proper focus states for inputs and buttons

## Performance Notes

- Time update uses interval (updates every 60 seconds, not every render)
- Mock data is hardcoded (replace with API calls)
- Quick actions use Link (client-side navigation, no reload)
- Bus cards are clickable links (not buttons, proper semantic HTML)

## Related Components

- `BusCard.tsx` - For detailed bus information display
- `SearchBar.tsx` - Reusable search component
- `BottomNav.tsx` - Mobile navigation bar
- `rapido-components.tsx` - Design system utilities
