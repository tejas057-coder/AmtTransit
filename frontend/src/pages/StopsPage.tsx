import { useState, useEffect } from "react";
import { Search, MapPin, Star, ChevronDown, Clock } from "lucide-react";
import { stops, buses, routes } from "@/data/mockData";
import { BusStop } from "@/data/busScheduleData";

type SortType = "distance" | "alphabetical";

// Mock user location (Amravati city center)
const USER_LAT = 20.93;
const USER_LNG = 77.76;

// Haversine formula: calculate distance between two coordinates
const calculateDistance = (
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number => {
  const R = 6371; // Earth's radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

// Format distance for display
const formatDistance = (km: number): string => {
  if (km < 1) return `${(km * 1000).toFixed(0)}m`;
  return `${km.toFixed(1)}km`;
};

// Get arriving buses for a stop
const getArrivingBuses = (stopId: string, limit = 3) => {
  return buses
    .filter((bus) => {
      const route = routes.find((r) => r.id === bus.routeId);
      return route?.stops?.includes(stopId);
    })
    .slice(0, limit)
    .map((bus) => ({
      routeNumber: bus.number.split("-")[1] || "12",
      destination: "Badnera Station",
      eta: bus.nextStopEta,
    }));
};

export default function StopsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortType, setSortType] = useState<SortType>("distance");
  const [expandedStopId, setExpandedStopId] = useState<string | null>(null);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());

  // Load favorites from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("favoriteStops");
    if (saved) {
      setFavorites(new Set(JSON.parse(saved)));
    }
  }, []);

  // Save favorites to localStorage
  const toggleFavorite = (stopId: string) => {
    const updated = new Set(favorites);
    if (updated.has(stopId)) {
      updated.delete(stopId);
    } else {
      updated.add(stopId);
    }
    setFavorites(updated);
    localStorage.setItem("favoriteStops", JSON.stringify(Array.from(updated)));
  };

  // Calculate distances for all stops
  const stopsWithDistance = stops.map((stop) => ({
    ...stop,
    distance: calculateDistance(USER_LAT, USER_LNG, stop.lat, stop.lng),
  }));

  // Filter by search
  let filtered = stopsWithDistance.filter(
    (stop) =>
      stop.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      stop.routes.some((route) =>
        route.toLowerCase().includes(searchQuery.toLowerCase())
      )
  );

  // Sort
  if (sortType === "distance") {
    filtered.sort((a, b) => a.distance - b.distance);
  } else {
    filtered.sort((a, b) => a.name.localeCompare(b.name));
  }

  // Split into nearest (first 3 or all if < 3) and others
  const nearestStops = filtered.slice(0, 3);
  const otherStops = filtered.slice(3);

  const clearSearch = () => setSearchQuery("");

  return (
    <div className="w-full bg-background pb-24 lg:pb-0">
      {/* PAGE HEADER */}
      <div className="sticky top-0 z-40 bg-background/95 backdrop-blur-sm border-b border-white/8 px-4 py-4">
        <div className="flex items-center gap-2">
          <MapPin className="w-5 h-5 text-primary" />
          <h1 className="text-foreground font-bold text-lg">Bus Stops</h1>
        </div>
      </div>

      {/* SEARCH INPUT */}
      <div className="px-4 py-3 bg-background sticky top-16 z-40">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none" />
          <input
            type="text"
            placeholder="Search stops or routes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-card border border-white/8 rounded-[26px] px-4 py-3 pl-12 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
          />
          {searchQuery && (
            <button
              onClick={clearSearch}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* SORT ROW */}
      <div className="px-4 py-3 bg-background sticky top-28 z-40 flex items-center justify-between">
        <div className="flex gap-2">
          <button
            onClick={() => setSortType("distance")}
            className={`px-4 py-2 rounded-full font-bold text-sm transition-all ${
              sortType === "distance"
                ? "bg-primary text-primary-foreground"
                : "bg-card border border-white/10 text-muted-foreground hover:border-white/20"
            }`}
          >
            By Distance
          </button>
          <button
            onClick={() => setSortType("alphabetical")}
            className={`px-4 py-2 rounded-full font-bold text-sm transition-all ${
              sortType === "alphabetical"
                ? "bg-primary text-primary-foreground"
                : "bg-card border border-white/10 text-muted-foreground hover:border-white/20"
            }`}
          >
            Alphabetical
          </button>
        </div>
        <span className="text-muted-foreground text-xs font-medium">
          {filtered.length} {filtered.length === 1 ? "stop" : "stops"}
        </span>
      </div>

      {/* CONTENT */}
      <div className="px-4 py-4">
        {filtered.length === 0 ? (
          // EMPTY STATE
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <MapPin className="w-12 h-12 text-muted-foreground/50 mb-4" />
            <h2 className="text-foreground font-bold text-lg mb-1">No stops found</h2>
            <p className="text-muted-foreground text-sm mb-6">
              for "{searchQuery}"
            </p>
            <button
              onClick={clearSearch}
              className="px-6 py-2 bg-primary text-primary-foreground font-bold rounded-[12px] hover:opacity-90 transition-opacity text-sm"
            >
              Clear Search
            </button>
          </div>
        ) : (
          <>
            {/* NEAREST SECTION */}
            {nearestStops.length > 0 && !searchQuery && (
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
                    <h2 className="text-foreground font-bold text-sm">Nearest to you</h2>
                  </div>
                  <p className="text-muted-foreground text-xs ml-auto">Based on GPS</p>
                </div>

                <div className="space-y-2">
                  {nearestStops.map((stop) => (
                    <StopCard
                      key={stop.id}
                      stop={stop}
                      isFavorited={favorites.has(stop.id)}
                      onToggleFavorite={toggleFavorite}
                      isExpanded={expandedStopId === stop.id}
                      onToggleExpand={() =>
                        setExpandedStopId(expandedStopId === stop.id ? null : stop.id)
                      }
                    />
                  ))}
                </div>
              </div>
            )}

            {/* OTHER STOPS SECTION */}
            {otherStops.length > 0 && (
              <div>
                {nearestStops.length > 0 && !searchQuery && (
                  <h2 className="text-foreground font-bold text-sm mb-4">Other Stops</h2>
                )}
                <div className="space-y-2">
                  {otherStops.map((stop) => (
                    <StopCard
                      key={stop.id}
                      stop={stop}
                      isFavorited={favorites.has(stop.id)}
                      onToggleFavorite={toggleFavorite}
                      isExpanded={expandedStopId === stop.id}
                      onToggleExpand={() =>
                        setExpandedStopId(expandedStopId === stop.id ? null : stop.id)
                      }
                    />
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

// ────────────────────────────────────────────────────────────────
// Stop Card Component
// ────────────────────────────────────────────────────────────────
interface StopCardProps {
  stop: BusStop & { distance: number };
  isFavorited: boolean;
  onToggleFavorite: (id: string) => void;
  isExpanded: boolean;
  onToggleExpand: () => void;
}

function StopCard({
  stop,
  isFavorited,
  onToggleFavorite,
  isExpanded,
  onToggleExpand,
}: StopCardProps) {
  const arrivingBuses = getArrivingBuses(stop.id, 3);
  const routeIds = stop.routes;

  // Get route badges (max 3, then +X more)
  const displayedRoutes = routeIds.slice(0, 3);
  const moreCount = Math.max(0, routeIds.length - 3);

  return (
    <div
      className="bg-card border border-white/8 rounded-[16px] overflow-hidden transition-all"
      role="button"
      onClick={onToggleExpand}
    >
      {/* STOP CARD - Main */}
      <div className="px-4 py-4">
        {/* Top Row: Name + Star */}
        <div className="flex items-start justify-between mb-3">
          <h3 className="text-foreground font-bold text-[15px] flex-1">{stop.name}</h3>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleFavorite(stop.id);
            }}
            className="flex-shrink-0 ml-2 p-2 hover:bg-muted/50 rounded-lg transition-colors"
          >
            <Star
              className={`w-5 h-5 transition-all ${
                isFavorited
                  ? "fill-primary text-primary"
                  : "text-muted-foreground"
              }`}
            />
          </button>
        </div>

        {/* Middle Row: Location + Distance */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2 flex-1">
            <MapPin className="w-4 h-4 text-muted-foreground flex-shrink-0" />
            <span className="text-muted-foreground text-xs truncate">
              {stop.name.split("-")[0] || "Amravati"}
            </span>
          </div>
          <span className="flex-shrink-0 bg-primary/20 border border-primary/30 rounded-full px-3 py-1 text-primary font-bold text-xs ml-2">
            {formatDistance(stop.distance)}
          </span>
        </div>

        {/* Routes Chips Row */}
        <div className="flex gap-1.5 flex-wrap">
          {displayedRoutes.map((routeId) => (
            <span
              key={routeId}
              className="inline-flex items-center justify-center bg-primary text-primary-foreground font-bold text-xs w-8 h-6 rounded-[6px]"
            >
              R-0{routeId}
            </span>
          ))}
          {moreCount > 0 && (
            <span className="inline-flex items-center justify-center bg-white/10 text-muted-foreground font-bold text-xs px-2 h-6 rounded-[6px]">
              +{moreCount}
            </span>
          )}
        </div>
      </div>

      {/* EXPANDABLE ACCORDION */}
      {isExpanded && (
        <div className="border-t border-white/8 px-4 py-4 bg-black/20">
          {arrivingBuses.length > 0 ? (
            <>
              <h4 className="text-foreground font-bold text-xs mb-3">
                Arriving Buses
              </h4>

              <div className="space-y-2 mb-4">
                {arrivingBuses.map((bus, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between bg-card/50 rounded-[10px] p-2.5"
                  >
                    <div className="flex items-center gap-2 flex-1">
                      <span className="bg-primary text-primary-foreground font-bold text-xs w-7 h-6 rounded-[4px] flex items-center justify-center">
                        R-{bus.routeNumber}
                      </span>
                      <span className="text-foreground text-xs font-medium truncate">
                        {bus.destination}
                      </span>
                    </div>
                    <span className="text-primary font-bold text-xs ml-2">
                      {bus.eta} min
                    </span>
                  </div>
                ))}
              </div>

              <button className="w-full px-3 py-2 border-2 border-primary text-primary font-bold text-xs rounded-[10px] hover:bg-primary/10 transition-colors">
                View on Map
              </button>
            </>
          ) : (
            <p className="text-muted-foreground text-xs text-center py-2">
              No buses arriving soon
            </p>
          )}
        </div>
      )}
    </div>
  );
}
