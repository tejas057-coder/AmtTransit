# Rapido Design System - AmravatiTransit

## Color Palette

### Core Colors

- **Background**: `#0D0D0D` (near-black) - [page backgrounds]
- **Surface/Card**: `#1A1A1A` - [component cards, containers]
- **Primary/Accent**: `#FFD000` (Yellow) - [active states, CTAs, highlights]
- **Foreground**: `#FFFFFF` (White) - [primary text]
- **Muted Text**: `#A0A0A0` - [secondary text, disabled states]
- **Success**: `#22C55E` (Green) - ["Arrived" badge, success states]
- **Danger**: `#EF4444` (Red) - ["Delayed" badge, destructive actions]

### Semantic Usage

- `--background`: Page/body background (#0D0D0D)
- `--card`: Component cards, dropdowns (#1A1A1A)
- `--primary`: Yellow accent (#FFD000) for active nav, buttons, highlights
- `--destructive`: Red (#EF4444) for errors, delays, destructive actions
- `--success`: Green (#22C55E) for confirmations, arrivals
- `--muted-foreground`: Gray text (#A0A0A0) for secondary content

## Typography

### Font Family

- **Primary**: Inter, system-ui, sans-serif
- **Fallback**: System fonts

### Weight & Size

- **Headings (h1-h3)**: `font-weight: 700` (font-bold)
- **Body text**: `font-weight: 400` (default)
- **Labels/Buttons**: `font-weight: 500` (font-medium)

### Tailwind Classes

```
Font weights:
- font-bold (700) → headings
- font-medium (500) → labels, button text
- font-normal (400) → body text
```

## Border Radius

- **Cards/Containers**: `16px` → `rounded-[16px]`
- **Buttons**: `12px` → `rounded-[12px]`
- **Chips/Pills**: `20px` → `rounded-[20px]`
- **Form inputs**: `12px` → `rounded-[12px]`
- **Icons in circles**: `9999px` → `rounded-full`

## Component Specifications

### Buttons

#### Primary Button (CTA)

```tsx
className =
  "bg-primary text-primary-foreground font-bold rounded-[12px] px-4 py-3";
```

- Background: `#FFD000` (--primary)
- Text: Black (#000000) - `text-primary-foreground`
- Font: `font-bold`
- Border Radius: `12px`
- Hover: Slight opacity change

#### Secondary Button (Outlined)

```tsx
className =
  "border border-white/50 text-foreground font-medium rounded-[12px] px-4 py-3";
```

- Border: White with 50% opacity
- Text: White (#FFFFFF)
- Font: `font-medium`
- Border Radius: `12px`

### Status Badges

```tsx
// On Time (Yellow)
className =
  "bg-primary text-primary-foreground px-3 py-1 rounded-[20px] text-sm font-medium";

// Delayed (Red)
className =
  "bg-danger text-destructive-foreground px-3 py-1 rounded-[20px] text-sm font-medium";

// Arrived (Green)
className =
  "bg-success text-success-foreground px-3 py-1 rounded-[20px] text-sm font-medium";
```

### Cards

```tsx
className = "bg-card border border-white/8 rounded-[16px] p-4";
```

- Background: `#1A1A1A` (--card)
- Border: White with 8% opacity (subtle divider)
- Border Radius: `16px`
- Padding: Consistent `p-4` (1rem)

### Navigation Items (Active)

```tsx
className = "bg-primary text-primary-foreground rounded-[12px]";
```

- Background: `#FFD000` (--primary)
- Text: Black text on yellow
- Border Radius: `12px`

### Bottom Navigation

- 5 icons: Home, Map, Routes, Schedule, More
- Fixed at bottom on mobile
- Dark background matching theme
- Icons change color to yellow (#FFD000) when active
- Height: 5rem (20px padding)

## Global Styles

### Page Background

- All pages: `bg-background` class
- This applies `#0D0D0D` automatically

### Text Hierarchy

- Primary text: `text-foreground` (#FFFFFF)
- Secondary text: `text-muted-foreground` (#A0A0A0)
- Disabled text: `text-muted-foreground` with opacity

### Borders

- Subtle borders: `border-white/8` for card dividers
- Form borders: `border-white/20` for inputs
- Focus states: `ring-primary` (yellow)

## Spacing & Layout

### Padding/Margin

- Use Tailwind's default scale (0, 2, 4, 6, 8, 12, 16, 20, etc.)
- Cards: `p-4` or `p-6`
- Buttons: `px-4 py-3` or `px-6 py-4`
- Sections: `space-y-4` or `space-y-6`

### Mobile First

- Bottom navigation: Fixed 5-item nav bar on mobile
- Sidebar: Collapsible on mobile, fixed on desktop
- Full-width layouts on mobile with padding

## Transition & Motion

- Smooth transitions: `transition-all` or `transition-colors`
- Duration: Default `150ms` or `300ms`
- Hover effects: Subtle color changes, not scale transforms

## Dark Mode

- All components are dark by default
- No light mode toggle required
- Tailwind `darkMode: ["class"]` configured
- Use CSS custom properties for theme tokens

## Icons

- **Library**: Lucide React only
- **Size**:
  - Nav items: `w-5 h-5` or `w-6 h-6`
  - Buttons: `w-4 h-4`
  - Large: `w-8 h-8`
- **Color**: Inherit text color or use `text-primary`/`text-destructive`

## States

### Hover

```tsx
className = "hover:text-foreground hover:bg-muted/50 transition-colors";
```

### Active/Current

```tsx
className = "text-primary";
```

### Disabled

```tsx
className = "text-muted-foreground opacity-50 cursor-not-allowed";
```

### Loading

```tsx
className = "animate-pulse";
```

## Implementation Examples

### Card with Badge

```tsx
<div className="bg-card border border-white/8 rounded-[16px] p-4">
  <div className="flex justify-between items-start">
    <h3 className="text-foreground font-bold">Bus 45A</h3>
    <span className="bg-primary text-primary-foreground px-3 py-1 rounded-[20px] text-sm font-medium">
      On Time
    </span>
  </div>
</div>
```

### Action Button

```tsx
<button className="w-full bg-primary text-primary-foreground font-bold rounded-[12px] py-3 hover:opacity-90 transition-opacity">
  Request Bus
</button>
```

### Navigation Link (Active)

```tsx
<Link className="flex items-center gap-3 px-4 py-3 rounded-[12px] text-primary font-medium">
  <MapIcon className="w-5 h-5" />
  Map
</Link>
```

## CSS Custom Properties (Available in Tailwind)

Access these through Tailwind utilities:

- `bg-background` → `#0D0D0D`
- `bg-card` → `#1A1A1A`
- `text-foreground` → `#FFFFFF`
- `text-muted-foreground` → `#A0A0A0`
- `bg-primary` → `#FFD000`
- `text-destructive` → `#EF4444`
- `text-success` → `#22C55E`
- `border-white/8` → Subtle borders
