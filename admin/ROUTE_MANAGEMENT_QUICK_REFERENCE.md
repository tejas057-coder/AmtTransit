# Route Management — Quick Reference

## ASCII Layout Diagram

```
┌────────────────────────────────────────────────────────────────────────┐
│                        ROUTE MANAGEMENT PAGE                           │
├────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  Route Management                                   [+ Add Route]      │
│  ────────────────────────────────────────────────────────────────      │
│                                                                         │
│  ┌──────────────────────────────┐  ┌──────────────────────────────┐   │
│  │                              │  │                              │   │
│  │  Route #4  ● Active          │  │  Route #7  ● Active          │   │
│  │  Rajapeth – Cotton Market    │  │  Station – University        │   │
│  ├──────────────────────────────┤  ├──────────────────────────────┤   │
│  │ 🎯 Stops: 6                  │  │ 🎯 Stops: 4                  │   │
│  │ 📍 Distance: 8.4 km          │  │ 📍 Distance: 12.8 km         │   │
│  │ 🚌 Buses: 3                  │  │ 🚌 Buses: 2                  │   │
│  ├──────────────────────────────┤  ├──────────────────────────────┤   │
│  │ View Stops Timeline ▼        │  │ View Stops Timeline ▼        │   │
│  │                              │  │                              │   │
│  │ [Edit] [View Map] [Delete]   │  │ [Edit] [View Map] [Delete]   │   │
│  └──────────────────────────────┘  └──────────────────────────────┘   │
│                                                                         │
│  ┌──────────────────────────────┐                                      │
│  │                              │                                      │
│  │  Route #12 ⚠️ Maintenance     │                                      │
│  │  Airport – City Center       │                                      │
│  ├──────────────────────────────┤                                      │
│  │ 🎯 Stops: 4                  │                                      │
│  │ 📍 Distance: 22.5 km         │                                      │
│  │ 🚌 Buses: 4                  │                                      │
│  ├──────────────────────────────┤                                      │
│  │ View Stops Timeline ▼        │                                      │
│  │                              │                                      │
│  │ [Edit] [View Map] [Delete]   │                                      │
│  └──────────────────────────────┘                                      │
│                                                                         │
└────────────────────────────────────────────────────────────────────────┘
```

---

## Expanded Timeline View

```
┌──────────────────────────────────────────┐
│ Route #4 Card                             │
│  Rajapeth – Cotton Market                 │
│                                           │
│ View Stops Timeline ▲                     │
│                                           │
│ ●─────── Rajapeth Junction (00:00)        │
│ │        [First stop - larger dot]        │
│ │                                         │
│ ●─────── Rani Garden (05:00)              │
│ │                                         │
│ ●─────── Police Station (10:00)           │
│ │                                         │
│ ●─────── Hospital Road (15:00)            │
│ │                                         │
│ ●─────── Market Circle (20:00)            │
│ │                                         │
│ ●─────── Cotton Market (25:00)            │
│          [Last stop - larger dot]         │
│                                           │
│ [Edit] [View Map] [Delete]                │
└──────────────────────────────────────────┘
```

---

## Add/Edit Route Drawer

```
                              ┌──────────────────────────┐
                              │ Add Route            ✕   │
                              ├──────────────────────────┤
                              │                          │
                              │ ROUTE NAME               │
                              │ ┌────────────────────┐  │
                              │ │Navsari – Badnera  │  │
                              │ └────────────────────┘  │
                              │                          │
                              │ ROUTE NUMBER             │
                              │ ┌────────────────────┐  │
                              │ │4..................│  │
                              │ └────────────────────┘  │
                              │                          │
                              │ START STOP (Dropdown)    │
                              │ ┌────────────────────┐  │
                              │ │Rajapeth Junction▼ │  │
                              │ └────────────────────┘  │
                              │                          │
                              │ END STOP (Dropdown)      │
                              │ ┌────────────────────┐  │
                              │ │Cotton Market....▼ │  │
                              │ └────────────────────┘  │
                              │                          │
                              │ INTERMEDIATE STOPS +Add  │
                              │ ┌────────────────────┐  │
                              │ │⋮ Stop Name  ↑↓ ✕ │  │
                              │ │⋮ Stop Name  ↑↓ ✕ │  │
                              │ │⋮ Stop Name  ↑    ✕ │  │
                              │ └────────────────────┘  │
                              │                          │
                              │ ASSIGN BUSES             │
                              │ [AMT-001] [AMT-002]     │
                              │ [AMT-003] [AMT-004]     │
                              │                          │
                              │ SCHEDULE TYPE            │
                              │ [Weekday][Weekend][Both] │
                              │                          │
                              │ ACTIVE ROUTE             │
                              │ ◕ Active Route (toggle)  │
                              │                          │
                              ├──────────────────────────┤
                              │ [Cancel]    [Add Route]  │
                              └──────────────────────────┘
```

---

## Color Reference Chart

| Element | Color Code     | Usage                           |
| ------- | -------------- | ------------------------------- |
| #FFD000 | Primary Yellow | Badges, accents, highlights     |
| #FFE066 | Light Yellow   | Hover states, light backgrounds |
| #0D0D0D | Page Black     | Main background                 |
| #1A1A1A | Card Black     | Card background                 |
| #222222 | Card Hover     | Card hover background           |
| #111111 | Sidebar Black  | Drawer/sidebar background       |
| #2A2A2A | Border Gray    | Borders, dividers, timeline     |
| #FFFFFF | Pure White     | Primary text                    |
| #E5E5E5 | Light Gray     | Secondary text                  |
| #888888 | Medium Gray    | Muted text, labels              |
| #22C55E | Green          | Active status                   |
| #FF9900 | Orange         | Maintenance status              |
| #FF4444 | Red            | Danger/delete actions           |

---

## Component Structure

```
RouteManagement
├── [Header Section]
│   ├── "Route Management" Title (24px, bold)
│   └── "+ Add Route" Button (primary yellow)
│
├── [Routes Grid] (2 columns)
│   ├── Route Card #4
│   ├── Route Card #7
│   └── Route Card #12
│
└── [Drawer Overlay] (Right side, 400px)
    ├── [Header] Title + Close
    ├── [Content] Form fields (scrollable)
    └── [Footer] Cancel + Save buttons
```

---

## Key Interactions

### 1️⃣ View Route

- Route card displays all route info at a glance
- Click "View Stops Timeline" to expand accordion
- Shows vertical timeline with all stops

### 2️⃣ Add Route

- Click "+ Add Route" in header
- Drawer slides in from right with empty form
- Fill details and click "Add Route"

### 3️⃣ Edit Route

- Click "Edit" on any route card
- Drawer opens with pre-filled form
- Modify and click "Update Route"

### 4️⃣ Delete Route

- Click "Delete" on any route card
- Confirmation dialog appears
- Confirm to remove route from list

### 5️⃣ Manage Stops

- In drawer, add/remove intermediate stops
- Use ⋮ handle for future drag-and-drop
- Use ↑ ↓ arrows to reorder
- Click ✕ to remove stop

### 6️⃣ Assign Buses

- Click bus tags to select multiple buses
- Selected buses highlight in yellow
- Click again to deselect

---

## Status Badges

| Status      | Color     | Icon | Meaning                 |
| ----------- | --------- | ---- | ----------------------- |
| Active      | 🟢 Green  | ●    | Route is operational    |
| Maintenance | 🟠 Orange | ⚠️   | Route under maintenance |
| Inactive    | ⚫ Gray   | ◯    | Route is disabled       |

---

## Timeline Visualization

**Stop Timeline Details**:

- **Vertical Line**: #2A2A2A (border color)
- **Stop Dots**: #FFD000 (yellow)
- **Dot Glow**: #FFD000 at 60% opacity
- **First/Last Dots**: Slightly larger (16px vs 12px)
- **First/Last Ring**: Yellow border around dot

**Layout**:

- Stop name right of dot
- Estimated time below stop name (gray text)
- Smooth expand/collapse animation (200ms)

---

## Form Validation (Future)

- [ ] Route name: Required, min 3 characters
- [ ] Route number: Required, unique
- [ ] Start Stop: Required
- [ ] End Stop: Required, different from start
- [ ] Intermediate Stops: Optional
- [ ] Buses: At least one required
- [ ] Schedule Type: Required
- [ ] Status: Boolean toggle, default false

---

## Responsive Behavior

| Breakpoint | Layout                        |
| ---------- | ----------------------------- |
| < 900px    | 1 column layout (stack cards) |
| 900-1800px | 2 columns (default)           |
| 1800px+    | Could be 3 columns (future)   |

---

## Animation Timings

| Action          | Duration | Easing      |
| --------------- | -------- | ----------- |
| Card hover      | 200ms    | ease-in-out |
| Timeline expand | 200ms    | ease-in-out |
| Drawer slide    | 200ms    | ease-in-out |
| Button hover    | 200ms    | ease-in-out |
| Toggle switch   | 200ms    | ease-in-out |

---

## Quick Styling Reference

### Primary Button Style

```
Background: #FFD000
Color: #000000 (black text)
Padding: 0 24px
Height: 40px
Border: none
Border-radius: 12px
Hover: Background #FFE066
```

### Secondary Button Style

```
Background: transparent
Border: 1px solid #2A2A2A
Color: #E5E5E5
Height: 36px
Hover: Border #FFD000, Background #FFE066 (light)
```

### Card Style

```
Background: #1A1A1A
Border: 1px solid #2A2A2A
Border-radius: 12px
Padding: 16px
Hover: Background #222222, Border #FFD000
```

---

## Icons Used

| Icon         | Size | Color      | Component          |
| ------------ | ---- | ---------- | ------------------ |
| Plus         | 18px | White      | Add button         |
| Edit         | 14px | Gray       | Edit action        |
| MapPin       | 16px | Gray       | Stops stat         |
| Map          | 14px | Gray       | View on map button |
| Bus          | 16px | Gray       | Buses stat         |
| Trash2       | 14px | Gray → Red | Delete button      |
| ChevronDown  | 18px | Gray       | Collapse timeline  |
| ChevronUp    | 18px | Gray       | Expand timeline    |
| X            | 20px | Gray       | Close drawer       |
| GripVertical | 14px | Gray       | Drag handle        |
| ArrowUp      | 14px | Gray       | Move up            |
| ArrowDown    | 14px | Gray       | Move down          |
| Calendar     | 16px | Gray       | Schedule type icon |

---

## Data Flow

### Add Route Flow

```
User clicks "+ Add Route"
    ↓
Drawer opens with empty form
    ↓
User fills in all fields
    ↓
User clicks "Add Route"
    ↓
New route added to state
    ↓
Card appears in grid
    ↓
Drawer closes
```

### Edit Route Flow

```
User clicks "Edit" on card
    ↓
Drawer opens with pre-filled form
    ↓
User modifies fields
    ↓
User clicks "Update Route"
    ↓
Route updated in state
    ↓
Card displays new data
    ↓
Drawer closes
```

### Delete Route Flow

```
User clicks "Delete" on card
    ↓
Confirmation dialog appears
    ↓
User confirms deletion
    ↓
Route removed from state
    ↓
Card disappears from grid
```

---

## Mock Data Summary

### Available Buses (10 total)

AMT-001, AMT-002, AMT-003, AMT-004, AMT-005, AMT-006, AMT-007, AMT-008, AMT-009, AMT-010

### Available Stops (10 total)

- Rajapeth Junction
- Rani Garden
- Police Station
- Hospital Road
- Market Circle
- Cotton Market
- Railway Station
- City Center
- Sports Complex
- University Campus

### Sample Routes (3 total)

**Route 4: Rajapeth – Cotton Market**

- Stops: 6
- Distance: 8.4 km
- Buses: 3
- Status: Active

**Route 7: Station – University**

- Stops: 4
- Distance: 12.8 km
- Buses: 2
- Status: Active

**Route 12: Airport – City Center**

- Stops: 4
- Distance: 22.5 km
- Buses: 4
- Status: Maintenance

---

## Keyboard Shortcuts (Future Implementation)

| Key                | Action                |
| ------------------ | --------------------- |
| `Ctrl+K` / `Cmd+K` | Open add route drawer |
| `Escape`           | Close drawer          |
| `Enter`            | Save route in drawer  |
| `Ctrl+Shift+D`     | Delete selected route |

---

## Performance Tips

1. **For 100+ routes**: Implement virtual scrolling
2. **For large lists**: Use `React.memo()` on RouteCard
3. **For slow networks**: Add loading skeletons
4. **For real-time**: Add WebSocket updates
5. **For search**: Implement debounced filter

---

## File Location

📁 `admin/src/pages/RouteManagement.tsx`

**Export**: `RouteManagement` (as default)

**Route Path**: `/routes`

**Type Definitions**: Inside component file

**Styling**: Inline with `adminDesignTokens`

---

## Testing Checklist

- [ ] Add new route successfully
- [ ] Edit existing route
- [ ] Delete route with confirmation
- [ ] Expand/collapse timeline
- [ ] Reorder stops with arrows
- [ ] Select/deselect multiple buses
- [ ] Drawer opens/closes smoothly
- [ ] All colors match design
- [ ] Hover effects work
- [ ] Form fields are editable
- [ ] All icons display
- [ ] Responsive on mobile
- [ ] No console errors

---

## Common Tasks

### ✅ To add a real API endpoint:

Replace MOCK_ROUTES with:

```typescript
const [routes, setRoutes] = useState<Route[]>([]);

useEffect(() => {
  fetch("/api/routes")
    .then((r) => r.json())
    .then(setRoutes);
}, []);
```

### ✅ To connect delete action:

Replace in `handleDelete`:

```typescript
await fetch(`/api/routes/${routeId}`, {
  method: "DELETE",
});
setRoutes(routes.filter((r) => r.id !== routeId));
```

### ✅ To connect save action:

Add handler in drawer:

```typescript
const handleSave = async () => {
  const method = editingRoute ? "PUT" : "POST";
  const url = editingRoute ? `/api/routes/${editingRoute.id}` : "/api/routes";

  const response = await fetch(url, {
    method,
    body: JSON.stringify(formData),
  });
  // Update state...
  handleCloseDrawer();
};
```

---

_Last Updated: April 2025_  
_Status: Production Ready ✅_
