# Bus Route Map - Quick Start Guide

## Overview

The Bus Route Map is a feature that displays an interactive, geocoded map of the Navsari to Badnera bus route with real coordinates fetched from OpenStreetMap's Nominatim API.

## Quick Setup (5 minutes)

### 1. View the Route Map

Navigate to the home page and click on the **"Route Map"** featured card or visit:

```
http://localhost:5173/route/navsari-badnera
```

### 2. Key Features to Explore

- ✅ **Green Marker**: Starting point (Navsari)
- ✅ **Red Marker**: Ending point (Badnera)
- ✅ **Yellow Markers**: Regular stops
- ✅ **Star Markers**: Key stops (Panchavati, Irwin Chowk, etc.)
- ✅ **Golden Polyline**: Route path connecting all stops
- ✅ **Floating Card**: Route information and legend

### 3. Interactive Features

- **Click any marker** to see stop details and coordinates
- **Scroll to zoom** in/out
- **Drag to pan** across the map
- **Use controls** in top-right corner for zoom and full screen

## For Developers

### Import and Use

```typescript
import { BusRouteMap } from "@/components/map/BusRouteMap";

export function MyComponent() {
  return (
    <div className="w-full h-screen">
      <BusRouteMap
        from="Navsari"
        to="Badnera"
        keyStops={["Panchavati", "Irwin Chowk", "Sipna College"]}
      />
    </div>
  );
}
```

### Customize the Route

```typescript
// Custom stops
<BusRouteMap
  from="Your Start"
  to="Your End"
  stops={["Stop A", "Stop B", "Stop C"]}
  keyStops={["Stop B"]}
/>
```

### Add to a Page

```typescript
// In your page component
import { BusRouteMap } from "@/components/map/BusRouteMap";

export default function YourPage() {
  return (
    <div className="h-full">
      <BusRouteMap />
    </div>
  );
}
```

## File Structure

```
frontend/
├── src/
│   ├── components/
│   │   └── map/
│   │       ├── LeafletMap.tsx (existing live tracking)
│   │       └── BusRouteMap.tsx (NEW - route map component)
│   ├── pages/
│   │   └── RouteDetailsPage.tsx (NEW - full-page route view)
│   └── App.tsx (updated with new route)
```

## Component Props Reference

```typescript
interface RouteMapProps {
  from?: string; // Starting location label
  to?: string; // Ending location label
  stops?: string[]; // Array of stop names
  keyStops?: string[]; // Array of key stops to highlight
}
```

## Default Route Configuration

- **From**: Navsari Amravati, Navsari Chowk
- **To**: Badnera Railway Station
- **Total Stops**: 22
- **Key Stops**: 6 (Panchavati, Irwin Chowk, Jaystambh Chowk, Sai Nagar, Gopal Nagar, Sipna College)

## Styling & Theming

### Colors Used

```css
/* Start marker */
background: #22c55e; /* Green */

/* End marker */
background: #ef4444; /* Red */

/* Route line & default markers */
color: #fdb022; /* Yellow */

/* Popup background */
background: #1a1a2e; /* Dark background */
```

### Dark Theme

The component automatically uses dark theme tiles and styling that matches your application's dark mode.

## API Integration

### Nominatim API

- **Endpoint**: `https://nominatim.openstreetmap.org/search`
- **Rate Limit**: ~1 request per second (we use 200ms delays)
- **Format**: JSON
- **Query**: `"{stopName}, Amravati, Maharashtra, India"`

**Example Request**:

```
https://nominatim.openstreetmap.org/search?format=json&q=Panchavati,Amravati,Maharashtra,India&limit=1
```

**Example Response**:

```json
[
  {
    "lat": "20.8908",
    "lon": "77.7539",
    "name": "Panchavati, Amravati, Maharashtra, India",
    "type": "locality"
  }
]
```

## Troubleshooting

### Map doesn't appear?

1. Check browser console (F12) for errors
2. Verify Leaflet CSS is loaded: `import "leaflet/dist/leaflet.css"`
3. Ensure container has height: `<div style={{ height: "100%" }}>`

### Markers loading slowly?

1. Normal behavior - fetching 22 coordinates takes ~4-5 seconds
2. Check internet connection
3. Check if Nominatim API is accessible

### Wrong coordinates?

1. Stop names must be spelled exactly as configured
2. Try searching manually on OpenStreetMap to verify
3. Consider adding ", Amravati" to stop names for better accuracy

## Testing

### Manual Testing Checklist

- [ ] Map loads and shows all 22 stops
- [ ] Green marker is at first stop (Navsari)
- [ ] Red marker is at last stop (Badnera)
- [ ] Polyline connects all stops in golden color
- [ ] Floating card shows route info
- [ ] Click on markers to show popups
- [ ] Zoom works smoothly
- [ ] Responsive on mobile

### Browser DevTools

1. Open **Network** tab to see Nominatim API calls
2. Open **Console** to check for errors
3. Use **Device Emulation** to test mobile responsiveness

## Performance Tips

### Optimize Load Time

- Component caches coordinates after first fetch
- Consider pre-fetching coordinates for frequently viewed routes
- Use React.memo() if route props don't change often

### Memory Usage

- Each marker instance uses ~2-3KB
- With 22 stops: ~50-60KB for markers
- Tiles are cached by browser

## Deployment Checklist

- [ ] Build completes without errors: `npm run build`
- [ ] No TypeScript errors: `npm run lint`
- [ ] Nominatim API is accessible from production domain
- [ ] Dark theme CSS is included
- [ ] Responsive design tested on mobile/tablet
- [ ] Error handling works (test with offline API)
- [ ] Performance acceptable (~3-5s load time)

## Related Features

### Integration with Other Components

- **LiveMapPage**: Real-time bus tracking (similar map)
- **RoutesPage**: List of all routes
- **StopsPage**: Stop-specific information
- **Index Page**: Featured route card link

### Navigation Routes

```
/           - Home (featured route card)
/route/navsari-badnera  - Full route map
/routes     - All routes list
/map        - Live bus tracking
```

## Need Help?

### Development Resources

- [Leaflet Documentation](https://leafletjs.com/)
- [Nominatim API Docs](https://nominatim.org/release-docs/latest/api/Search/)
- [React Router Documentation](https://reactrouter.com/)
- [Tailwind CSS](https://tailwindcss.com/)

### Code Examples

See `BusRouteMap.tsx` for:

- Custom marker icons
- Polyline styling
- Popup HTML templates
- API integration pattern
- Error handling

### Common Issues

See `BUS_ROUTE_MAP_DOCUMENTATION.md` FAQ section

---

**Last Updated**: April 14, 2026  
**Version**: 1.0.0
