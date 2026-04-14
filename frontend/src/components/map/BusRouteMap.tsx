import { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

interface StopLocation {
  name: string;
  lat: number;
  lng: number;
}

interface RouteMapProps {
  from?: string;
  to?: string;
  stops?: string[];
  keyStops?: string[];
}

// Dark tile URL (CartoDB Dark Matter)
const TILE_URL =
  "https://{s}.basemaps.cartocdn.com/dark_matter/{z}/{x}/{y}{r}.png";
const TILE_ATTR =
  '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>';

// Fetch coordinates from Nominatim API
async function fetchCoordinates(stopName: string): Promise<StopLocation | null> {
  try {
    // Add "Amravati" to search for better location accuracy
    const query = `${stopName}, Amravati, Maharashtra, India`;
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=1`
    );
    const data = await response.json();

    if (data.length > 0) {
      const result = data[0];
      return {
        name: stopName,
        lat: parseFloat(result.lat),
        lng: parseFloat(result.lon),
      };
    }
    console.warn(`Could not find coordinates for ${stopName}`);
    return null;
  } catch (error) {
    console.error(`Error fetching coordinates for ${stopName}:`, error);
    return null;
  }
}

// Create marker icon based on position
function createMarkerIcon(position: "start" | "end" | "default", isKeyStop: boolean = false) {
  const colors = {
    start: "#22C55E", // Green
    end: "#EF4444", // Red
    default: "#FDB022", // Yellow
  };

  const color = colors[position];
  const size = isKeyStop ? 36 : 32;
  const pulse = position === "start" || position === "end";

  return L.divIcon({
    className: "",
    html: `
      <div style="
        position: relative;
        width: ${size}px;
        height: ${size}px;
        display: flex;
        align-items: center;
        justify-content: center;
      ">
        ${
          pulse
            ? `<div style="
            position: absolute;
            inset: -6px;
            border-radius: 50%;
            background: ${color};
            opacity: 0.3;
            animation: pulse-ring 1.5s ease-out infinite;
          "></div>`
            : ""
        }
        <div style="
          width: ${size}px;
          height: ${size}px;
          border-radius: 50%;
          background: ${color};
          border: 2px solid white;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.4);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 16px;
          position: relative;
          z-index: 10;
        ">
          ${position === "start" ? "🟢" : position === "end" ? "🔴" : isKeyStop ? "⭐" : "📍"}
        </div>
        <style>
          @keyframes pulse-ring {
            0% {
              transform: scale(1);
              opacity: 0.5;
            }
            100% {
              transform: scale(1.8);
              opacity: 0;
            }
          }
        </style>
      </div>
    `,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
    popupAnchor: [0, -(size / 2 + 10)],
  });
}

export function BusRouteMap({
  from = "Navsari",
  to = "Badnera",
  stops = [],
  keyStops = [],
}: RouteMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<L.Map | null>(null);
  const [routeStops, setRouteStops] = useState<StopLocation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Default stops for Navsari → Badnera route
  const defaultStops = [
    "Navsari Amravati,  Navsari Chowk",
    "Gupta Cement",
    "Kathora Naka",
    "VMV Road",
    "GCOEA College",
    "Shegaon Naka",
    "Rathi Nagar",
    "Gadge Nagar",
    "Panchavati",
    "Shivaji Science College",
    "ITI College",
    "Irwin Chowk",
    "Jaystambh Chowk",
    "Rajkamal",
    "Rajapeth",
    "Samarth High School",
    "Navathe",
    "Gopal Nagar",
    "Sai Nagar",
    "Sipna College",
    "Badnera Stop",
    "Badnera Railway Station",
  ];

  const stopsToUse = stops.length > 0 ? stops : defaultStops;

  const defaultKeyStops = [
    "Panchavati",
    "Irwin Chowk",
    "Jaystambh Chowk",
    "Sai Nagar",
    "Gopal Nagar",
    "Sipna College",
  ];

  const keyStopsToUse = keyStops.length > 0 ? keyStops : defaultKeyStops;

  // Fetch all stop coordinates
  useEffect(() => {
    const fetchAllCoordinates = async () => {
      setLoading(true);
      setError(null);
      try {
        // Add delay between requests to avoid rate limiting
        const locations: StopLocation[] = [];

        for (const stop of stopsToUse) {
          const location = await fetchCoordinates(stop);
          if (location) {
            locations.push(location);
          }
          // Small delay to avoid overloading Nominatim API
          await new Promise((resolve) => setTimeout(resolve, 200));
        }

        if (locations.length === 0) {
          setError("Could not fetch coordinates for any stops");
        } else {
          setRouteStops(locations);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch coordinates");
      } finally {
        setLoading(false);
      }
    };

    fetchAllCoordinates();
  }, [stopsToUse]);

  // Initialize and update map
  useEffect(() => {
    if (!mapRef.current || routeStops.length === 0 || mapInstance.current) return;

    try {
      // Create map centered on first stop
      const map = L.map(mapRef.current, {
        center: [routeStops[0].lat, routeStops[0].lng],
        zoom: 13,
        zoomControl: true,
        attributionControl: true,
      });

      // Add dark tile layer
      L.tileLayer(TILE_URL, {
        attribution: TILE_ATTR,
        subdomains: "abcd",
        maxZoom: 19,
        className: "grayscale",
      }).addTo(map);

      // Add markers for each stop
      routeStops.forEach((stop, index) => {
        const isStart = index === 0;
        const isEnd = index === routeStops.length - 1;
        const isKeyStop = keyStopsToUse.some((key) =>
          stop.name.toLowerCase().includes(key.toLowerCase())
        );

        const position = isStart ? "start" : isEnd ? "end" : "default";
        const marker = L.marker([stop.lat, stop.lng], {
          icon: createMarkerIcon(position, isKeyStop),
          title: stop.name,
        }).addTo(map);

        // Create popup content
        const popupContent = `
          <div style="
            background: #1a1a2e;
            color: #e8e8f0;
            border-radius: 12px;
            padding: 12px 14px;
            min-width: 200px;
            border: 1px solid rgba(255,255,255,0.08);
            font-family: 'DM Sans', system-ui, sans-serif;
            font-size: 12px;
          ">
            <div style="font-weight: 700; font-size: 13px; color: #fff; margin-bottom: 6px;">
              Stop ${index + 1} of ${routeStops.length}
            </div>
            <div style="color: #fff; margin-bottom: 6px;">
              ${stop.name}
            </div>
            <div style="font-size: 11px; color: rgba(255,255,255,0.6);">
              📍 ${stop.lat.toFixed(4)}°N, ${stop.lng.toFixed(4)}°E
            </div>
            ${
              isKeyStop
                ? '<div style="margin-top: 8px; background: rgba(255, 208, 0, 0.15); padding: 6px; border-radius: 6px; font-weight: 600; color: #FFD000;">⭐ Key Stop</div>'
                : ""
            }
          </div>
        `;

        marker.bindPopup(popupContent);
      });

      // Draw polyline connecting all stops
      const latlngs = routeStops.map((stop) => [stop.lat, stop.lng] as [number, number]);
      const polyline = L.polyline(latlngs, {
        color: "#FFD000",
        weight: 4,
        opacity: 0.8,
        lineCap: "round",
        lineJoin: "round",
        dashArray: "0",
      }).addTo(map);

      // Fit bounds to show entire route with padding
      const bounds = L.latLngBounds(latlngs);
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 15 });

      mapInstance.current = map;
    } catch (err) {
      console.error("Map initialization error:", err);
      setError("Failed to initialize map");
    }
  }, [routeStops, keyStopsToUse]);

  return (
    <div className="relative w-full h-full">
      {/* Map Container */}
      <div
        ref={mapRef}
        style={{
          width: "100%",
          height: "100%",
          borderRadius: "20px",
          overflow: "hidden",
        }}
      />

      {/* Loading State */}
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/30 backdrop-blur-sm rounded-[20px]">
          <div className="bg-card border border-white/10 rounded-lg px-6 py-4 flex flex-col items-center gap-3">
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            <p className="text-sm text-muted-foreground">Loading route coordinates...</p>
          </div>
        </div>
      )}

      {/* Error State */}
      {error && !loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/30 backdrop-blur-sm rounded-[20px]">
          <div className="bg-card border border-danger/20 rounded-lg px-6 py-4 flex flex-col items-center gap-2">
            <p className="text-sm text-danger font-semibold">Error Loading Route</p>
            <p className="text-xs text-muted-foreground">{error}</p>
          </div>
        </div>
      )}

      {/* Floating Route Info Card */}
      {!loading && routeStops.length > 0 && (
        <div className="absolute bottom-6 left-6 bg-card border border-white/10 rounded-xl px-5 py-4 backdrop-blur-sm max-w-sm shadow-lg">
          <div className="space-y-4">
            {/* Route Title */}
            <div>
              <h3 className="text-sm font-semibold text-white mb-1">Route Info</h3>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span className="text-green-500 font-bold">●</span>
                <span>{from}</span>
                <span className="text-primary">→</span>
                <span>{to}</span>
                <span className="text-red-500 font-bold">●</span>
              </div>
            </div>

            {/* General Info */}
            <div className="space-y-2 pt-2 border-t border-white/8">
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Total Stops</span>
                <span className="font-semibold text-white">{routeStops.length}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Key Stops</span>
                <span className="font-semibold text-white">{keyStopsToUse.length}</span>
              </div>
            </div>

            {/* Key Stops */}
            {keyStopsToUse.length > 0 && (
              <div className="pt-2 border-t border-white/8">
                <p className="text-xs font-semibold text-white mb-2">⭐ Key Stops</p>
                <div className="space-y-1">
                  {keyStopsToUse.map((keyStop, idx) => (
                    <div
                      key={idx}
                      className="text-xs text-muted-foreground flex items-start gap-2"
                    >
                      <span className="text-primary mt-0.5">•</span>
                      <span>{keyStop}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Legend */}
            <div className="pt-2 border-t border-white/8 space-y-1.5">
              <p className="text-xs font-semibold text-white mb-2">Legend</p>
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-xs">
                  <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-green-500 border border-white text-white text-[10px]">
                    🟢
                  </span>
                  <span className="text-muted-foreground">Start Point</span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-red-500 border border-white text-white text-[10px]">
                    🔴
                  </span>
                  <span className="text-muted-foreground">End Point</span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-yellow-400 border border-white text-white text-[10px]">
                    📍
                  </span>
                  <span className="text-muted-foreground">Regular Stop</span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-yellow-400 border border-white text-white text-[10px]">
                    ⭐
                  </span>
                  <span className="text-muted-foreground">Key Stop</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Attribution */}
      <style>{`
        .leaflet-control-attribution {
          background-color: rgba(26, 26, 46, 0.9) !important;
          border: 1px solid rgba(255, 255, 255, 0.1) !important;
          border-radius: 8px !important;
          font-size: 11px !important;
          color: rgba(255, 255, 255, 0.6) !important;
        }
        .leaflet-control-attribution a {
          color: #3b82f6 !important;
        }
      `}</style>
    </div>
  );
}
