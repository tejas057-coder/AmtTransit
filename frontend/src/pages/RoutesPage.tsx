import { useState } from "react";
import { routes, routeNavsariToBadnera, buses } from "@/data/mockData";
import {
  Search,
  ChevronRight,
  ChevronDown,
  AlertCircle,
  Clock,
  MapPin,
} from "lucide-react";

type FilterType = "all" | "running" | "express" | "city-loop";

const FILTERS: { id: FilterType; label: string }[] = [
  { id: "all", label: "All" },
  { id: "running", label: "Currently Running" },
  { id: "express", label: "Express" },
  { id: "city-loop", label: "City Loop" },
];

// Helper: Calculate distance between two coordinate pairs (simple approximation)
const calculateDistance = (
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): string => {
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
  const distance = R * c;
  return distance < 1 ? `${(distance * 1000).toFixed(0)}m` : `${distance.toFixed(1)}km`;
};

export default function RoutesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState<FilterType>("all");
  const [expandedRouteId, setExpandedRouteId] = useState<string | null>(null);

  // Filter logic
  const filteredRoutes = routes.filter((route) => {
    // Search filter
    const matchesSearch =
      route.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      route.from.toLowerCase().includes(searchQuery.toLowerCase()) ||
      route.to.toLowerCase().includes(searchQuery.toLowerCase());

    // Status filter
    let matchesFilter = true;
    if (selectedFilter === "running") {
      matchesFilter = route.activeBuses > 0;
    } else if (selectedFilter === "express") {
      matchesFilter = route.name.includes("Express") || route.distance.includes("12");
    } else if (selectedFilter === "city-loop") {
      matchesFilter = route.name.includes("Loop") || route.name.includes("Circular");
    }

    return matchesSearch && matchesFilter;
  });

  const getStopDetails = (stopIds: string[]) => {
    return stopIds
      .map((id) => routeNavsariToBadnera.find((s) => s.id === id))
      .filter(Boolean);
  };

  const toggleExpand = (routeId: string) => {
    setExpandedRouteId(expandedRouteId === routeId ? null : routeId);
  };

  return (
    <div className="w-full bg-background pb-24 lg:pb-0">
      {/* STICKY HEADER */}
      <div className="sticky top-0 z-40 bg-background/95 backdrop-blur-sm border-b border-white/8 px-4 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-[22px] font-bold text-foreground">All Routes</h1>
          </div>
          <div className="bg-primary/20 border border-primary/30 rounded-full px-3 py-1">
            <span className="text-primary font-bold text-sm">{filteredRoutes.length}</span>
          </div>
        </div>
      </div>

      {/* SEARCH BAR */}
      <div className="px-4 py-3 bg-background sticky top-16 z-40">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none" />
          <input
            type="text"
            placeholder="Search by route name or number"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-card border border-white/8 rounded-[26px] px-4 py-3 pl-12 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* FILTER CHIPS ROW */}
      <div className="px-4 py-3 bg-background sticky top-32 z-40 overflow-x-auto no-scrollbar">
        <div className="flex gap-2 flex-nowrap">
          {FILTERS.map((filter) => (
            <button
              key={filter.id}
              onClick={() => setSelectedFilter(filter.id)}
              className={`flex-shrink-0 px-4 py-2 rounded-[20px] font-medium text-sm transition-all whitespace-nowrap ${
                selectedFilter === filter.id
                  ? "bg-primary text-primary-foreground font-bold"
                  : "bg-card border border-white/10 text-muted-foreground hover:border-white/20"
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </div>

      {/* ROUTES LIST */}
      <div className="px-4 py-4 space-y-2">
        {filteredRoutes.length === 0 ? (
          // EMPTY STATE
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="flex justify-center mb-4">
              <AlertCircle className="w-12 h-12 text-muted-foreground/50" />
            </div>
            <h2 className="text-foreground font-bold text-lg mb-1">No routes found</h2>
            <p className="text-muted-foreground text-sm mb-6">Try adjusting your search or filters</p>
            {(searchQuery || selectedFilter !== "all") && (
              <button
                onClick={() => {
                  setSearchQuery("");
                  setSelectedFilter("all");
                }}
                className="px-6 py-2 bg-primary text-primary-foreground font-bold rounded-[12px] hover:opacity-90 transition-opacity text-sm"
              >
                Clear Filters
              </button>
            )}
          </div>
        ) : (
          filteredRoutes.map((route) => {
            const isExpanded = expandedRouteId === route.id;
            const stopDetails = getStopDetails(route.stops);
            const status = route.activeBuses > 0 ? "running" : "stopped";

            return (
              <div
                key={route.id}
                className="bg-card border border-white/8 rounded-[16px] overflow-hidden transition-all"
              >
                {/* ROUTE CARD - Main */}
                <button
                  onClick={() => toggleExpand(route.id)}
                  className="w-full px-4 py-4 flex items-start gap-3 hover:bg-white/2 transition-colors text-left border-l-4 border-primary"
                >
                  {/* Left: Route Badge */}
                  <div className="flex-shrink-0 w-12 h-8 bg-primary rounded-[8px] flex items-center justify-center">
                    <span className="text-primary-foreground font-bold text-xs">R-{route.id}</span>
                  </div>

                  {/* Middle: Route Info */}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-foreground font-bold text-[15px] mb-1 truncate">
                      {route.name}
                    </h3>
                    <div className="flex gap-2 flex-wrap">
                      <span className="inline-flex items-center gap-1 text-xs text-muted-foreground bg-muted/20 px-2 py-1 rounded-[8px]">
                        <MapPin className="w-3 h-3" />
                        {route.stops.length} stops
                      </span>
                      <span className="inline-flex items-center gap-1 text-xs text-muted-foreground bg-muted/20 px-2 py-1 rounded-[8px]">
                        <Clock className="w-3 h-3" />
                        {route.frequency
                          .replace("Limited (", "")
                          .replace(")", "")
                          .toLowerCase()}
                      </span>
                    </div>
                  </div>

                  {/* Right: Status & Expand Icon */}
                  <div className="flex-shrink-0 flex flex-col items-end gap-2">
                    <span
                      className={`text-xs font-bold px-2 py-1 rounded-[8px] ${
                        status === "running"
                          ? "bg-success/20 text-success"
                          : "bg-danger/20 text-danger"
                      }`}
                    >
                      {status === "running" ? "Running" : "Stopped"}
                    </span>
                    <ChevronRight
                      className={`w-5 h-5 text-muted-foreground transition-transform ${
                        isExpanded ? "rotate-90" : ""
                      }`}
                    />
                  </div>
                </button>

                {/* ACCORDION EXPANDED CONTENT */}
                {isExpanded && (
                  <div className="border-t border-white/8 px-4 py-4 bg-black/20 max-h-96 overflow-y-auto">
                    {/* Route Details Summary */}
                    <div className="mb-4 pb-4 border-b border-white/8">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-muted-foreground text-xs">From</span>
                        <span className="text-foreground text-sm font-medium">{route.from}</span>
                      </div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-muted-foreground text-xs">To</span>
                        <span className="text-foreground text-sm font-medium">{route.to}</span>
                      </div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-muted-foreground text-xs">Distance</span>
                        <span className="text-foreground text-sm font-medium">{route.distance}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground text-xs">Active Buses</span>
                        <span className="text-primary font-bold text-sm">{route.activeBuses}</span>
                      </div>
                    </div>

                    {/* STOPS TIMELINE */}
                    <div className="relative">
                      <h4 className="text-foreground font-bold text-xs mb-4">Stops ({stopDetails.length})</h4>

                      <div className="space-y-4">
                        {stopDetails.map((stop, idx) => {
                          const isFirst = idx === 0;
                          const isLast = idx === stopDetails.length - 1;
                          const nextStop = stopDetails[idx + 1];
                          const distance = nextStop
                            ? calculateDistance(stop!.lat, stop!.lng, nextStop.lat, nextStop.lng)
                            : "—";

                          return (
                            <div key={stop?.id} className="flex gap-3 relative">
                              {/* Timeline Line - connects dots */}
                              {!isLast && (
                                <div
                                  className="absolute left-1.5 top-6 w-0.5 h-12 bg-transparent"
                                  style={{
                                    backgroundImage:
                                      "repeating-linear-gradient(to bottom, #FFD000 0px, #FFD000 4px, transparent 4px, transparent 8px)",
                                  }}
                                />
                              )}

                              {/* DOT */}
                              <div className="relative flex-shrink-0 mt-1">
                                <div
                                  className={`w-3 h-3 rounded-full border-2 border-card ${
                                    isFirst
                                      ? "bg-success"
                                      : isLast
                                        ? "bg-danger"
                                        : "bg-foreground"
                                  }`}
                                />
                              </div>

                              {/* STOP INFO */}
                              <div className="flex-1 pb-4">
                                <h5 className="text-foreground font-medium text-xs">{stop?.name}</h5>
                                {!isLast && (
                                  <p className="text-muted-foreground text-xs mt-0.5">
                                    {distance} to next stop
                                  </p>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2 mt-6 pt-4 border-t border-white/8">
                      <button className="flex-1 px-3 py-2 bg-primary text-primary-foreground font-bold rounded-[12px] text-xs hover:opacity-90 transition-opacity">
                        View on Map
                      </button>
                      <button className="flex-1 px-3 py-2 bg-white/8 text-foreground font-bold rounded-[12px] text-xs hover:bg-white/12 transition-colors">
                        Schedule
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
