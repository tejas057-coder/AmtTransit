import { useState, useEffect, useMemo, useRef } from "react";
import {
  Search,
  MapPin,
  Star,
  ChevronDown,
  ChevronUp,
  Clock,
  Navigation,
  Map,
  X,
  Zap,
} from "lucide-react";
import { stops, buses, routes, BusStop } from "@/data/mockData";

// ─────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────
type SortType = "distance" | "alphabetical";

interface StopWithDistance extends BusStop {
  distance: number;
}

interface ArrivingBus {
  busNumber: string;
  routeLabel: string;
  destination: string;
  eta: number;
  status: "on-time" | "delayed" | "at-stop";
}

// ─────────────────────────────────────────────
// Constants
// ─────────────────────────────────────────────
// Mock user GPS location (Amravati city centre ~Irwin Chowk)
const USER_LAT = 20.9300;
const USER_LNG = 77.7631;
const FAVORITES_KEY = "amravati_favorite_stops";

// ─────────────────────────────────────────────
// Utilities
// ─────────────────────────────────────────────
function haversine(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371;
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function formatDist(km: number): string {
  if (km < 1) return `${Math.round(km * 1000)} m`;
  return `${km.toFixed(1)} km`;
}

function getArrivingBuses(stopId: string, limit = 3): ArrivingBus[] {
  const result: ArrivingBus[] = [];
  for (const bus of buses) {
    const route = routes.find((r) => r.id === bus.routeId || `R${r.id}` === bus.routeId);
    if (!route?.stops?.includes(stopId)) continue;
    result.push({
      busNumber: bus.number,
      routeLabel: route.name.split("→")[0].trim(),
      destination: route.to,
      eta: bus.nextStopEta,
      status: bus.status,
    });
    if (result.length >= limit) break;
  }
  // Pad with mock data if the mock buses don't cover all stops  
  if (result.length === 0) {
    result.push(
      { busNumber: "AM-24", routeLabel: "Bus Stand", destination: "Badnera Station", eta: 4, status: "on-time" },
      { busNumber: "AM-17", routeLabel: "Navsari", destination: "Badnera Station", eta: 11, status: "on-time" },
      { busNumber: "AM-09", routeLabel: "Bus Stand", destination: "Badnera Station", eta: 18, status: "delayed" },
    );
  }
  return result.slice(0, limit);
}

// ─────────────────────────────────────────────
// Main Component
// ─────────────────────────────────────────────
export default function StopsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortType, setSortType] = useState<SortType>("distance");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const searchRef = useRef<HTMLInputElement>(null);

  // Load favorites from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(FAVORITES_KEY);
      if (saved) setFavorites(new Set(JSON.parse(saved) as string[]));
    } catch {
      /* ignore parse errors */
    }
  }, []);

  const toggleFavorite = (id: string) => {
    setFavorites((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      localStorage.setItem(FAVORITES_KEY, JSON.stringify(Array.from(next)));
      return next;
    });
  };

  const stopsWithDist = useMemo<StopWithDistance[]>(
    () =>
      stops.map((s) => ({
        ...s,
        distance: haversine(USER_LAT, USER_LNG, s.lat, s.lng),
      })),
    [],
  );

  const filtered = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    let list = q
      ? stopsWithDist.filter(
          (s) =>
            s.name.toLowerCase().includes(q) ||
            s.routes.some((r) => r.toLowerCase().includes(q)),
        )
      : [...stopsWithDist];

    if (sortType === "distance") list.sort((a, b) => a.distance - b.distance);
    else list.sort((a, b) => a.name.localeCompare(b.name));

    return list;
  }, [stopsWithDist, searchQuery, sortType]);

  const nearestStops = !searchQuery ? filtered.slice(0, 3) : [];
  const otherStops = !searchQuery ? filtered.slice(3) : filtered;
  const isEmpty = filtered.length === 0;

  return (
    <div className="w-full min-h-screen bg-background pb-28 lg:pb-6">
      {/* ── STICKY HEADER + SEARCH ────────────────── */}
      <div className="sticky top-0 z-40 bg-background/98 backdrop-blur-md border-b border-white/[0.06]">
        {/* Title row */}
        <div className="px-4 pt-5 pb-3 flex items-center gap-3">
          <div
            className="w-9 h-9 rounded-[10px] flex items-center justify-center flex-shrink-0"
            style={{ background: "rgba(255,208,0,0.15)", border: "1px solid rgba(255,208,0,0.25)" }}
          >
            <MapPin className="w-4 h-4 text-primary" />
          </div>
          <div>
            <h1 className="text-foreground font-extrabold text-[18px] leading-tight tracking-tight">
              Bus Stops
            </h1>
            <p className="text-muted-foreground text-[11px] leading-none mt-0.5">
              {stops.length} stops · Amravati City
            </p>
          </div>
        </div>

        {/* Search input */}
        <div className="px-4 pb-3">
          <div
            className="relative flex items-center"
            style={{
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: "26px",
              transition: "border-color 0.2s",
            }}
          >
            <Search className="absolute left-4 w-4 h-4 text-muted-foreground flex-shrink-0 pointer-events-none" />
            <input
              ref={searchRef}
              type="text"
              placeholder="Search stops, areas or routes…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-transparent py-3 pl-11 pr-10 text-foreground text-[13px] placeholder-muted-foreground focus:outline-none"
              style={{ caretColor: "#FFD000" }}
            />
            {searchQuery && (
              <button
                onClick={() => {
                  setSearchQuery("");
                  searchRef.current?.focus();
                }}
                className="absolute right-3 w-6 h-6 rounded-full flex items-center justify-center transition-colors hover:bg-white/10"
                aria-label="Clear search"
              >
                <X className="w-3.5 h-3.5 text-muted-foreground" />
              </button>
            )}
          </div>
        </div>

        {/* Sort row */}
        <div className="px-4 pb-3 flex items-center justify-between">
          <div className="flex gap-2">
            <SortChip
              label="By Distance"
              icon={<Navigation className="w-3 h-3" />}
              active={sortType === "distance"}
              onClick={() => setSortType("distance")}
            />
            <SortChip
              label="Alphabetical"
              icon={<span className="text-[10px] font-black leading-none">A–Z</span>}
              active={sortType === "alphabetical"}
              onClick={() => setSortType("alphabetical")}
            />
          </div>
          <span className="text-muted-foreground text-[11px] font-medium tabular-nums">
            {filtered.length} {filtered.length === 1 ? "stop" : "stops"}
          </span>
        </div>
      </div>

      {/* ── CONTENT ───────────────────────────────── */}
      <div className="px-4 pt-4">
        {isEmpty ? (
          <EmptyState query={searchQuery} onClear={() => setSearchQuery("")} />
        ) : (
          <>
            {/* NEAREST SECTION */}
            {nearestStops.length > 0 && (
              <section className="mb-6">
                <SectionHeader
                  label="Nearest to you"
                  sub="Based on GPS"
                  pulse="green"
                />
                <div className="space-y-2.5">
                  {nearestStops.map((stop) => (
                    <StopCard
                      key={stop.id}
                      stop={stop}
                      isFav={favorites.has(stop.id)}
                      onToggleFav={toggleFavorite}
                      isExpanded={expandedId === stop.id}
                      onToggleExpand={() =>
                        setExpandedId(expandedId === stop.id ? null : stop.id)
                      }
                      highlight
                    />
                  ))}
                </div>
              </section>
            )}

            {/* FAVORITES (shown only when no active search) */}
            {!searchQuery &&
              Array.from(favorites).filter((id) =>
                otherStops.some((s) => s.id === id),
              ).length > 0 && (
                <section className="mb-6">
                  <SectionHeader
                    label="Saved Stops"
                    sub="Your favourites"
                    pulse="yellow"
                  />
                  <div className="space-y-2.5">
                    {otherStops
                      .filter((s) => favorites.has(s.id))
                      .map((stop) => (
                        <StopCard
                          key={stop.id}
                          stop={stop}
                          isFav
                          onToggleFav={toggleFavorite}
                          isExpanded={expandedId === stop.id}
                          onToggleExpand={() =>
                            setExpandedId(expandedId === stop.id ? null : stop.id)
                          }
                        />
                      ))}
                  </div>
                </section>
              )}

            {/* OTHER / ALL STOPS */}
            {(otherStops.length > 0 || searchQuery) && (
              <section>
                {!searchQuery && nearestStops.length > 0 && (
                  <SectionHeader label="All Stops" sub="Full network listing" />
                )}
                <div className="space-y-2.5">
                  {(searchQuery ? filtered : otherStops)
                    .filter(
                      (s) =>
                        searchQuery || !favorites.has(s.id),
                    )
                    .map((stop) => (
                      <StopCard
                        key={stop.id}
                        stop={stop}
                        isFav={favorites.has(stop.id)}
                        onToggleFav={toggleFavorite}
                        isExpanded={expandedId === stop.id}
                        onToggleExpand={() =>
                          setExpandedId(expandedId === stop.id ? null : stop.id)
                        }
                      />
                    ))}
                </div>
              </section>
            )}
          </>
        )}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// Sub-components
// ─────────────────────────────────────────────

function SortChip({
  label,
  icon,
  active,
  onClick,
}: {
  label: string;
  icon: React.ReactNode;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full font-semibold text-[12px] transition-all duration-200"
      style={{
        background: active ? "#FFD000" : "rgba(255,255,255,0.06)",
        color: active ? "#0D0D0D" : "rgba(255,255,255,0.5)",
        border: active ? "1px solid #FFD000" : "1px solid rgba(255,255,255,0.1)",
        boxShadow: active ? "0 0 16px rgba(255,208,0,0.3)" : "none",
      }}
    >
      {icon}
      {label}
    </button>
  );
}

function SectionHeader({
  label,
  sub,
  pulse,
}: {
  label: string;
  sub: string;
  pulse?: "green" | "yellow";
}) {
  const dotColor =
    pulse === "green"
      ? "bg-emerald-400"
      : pulse === "yellow"
      ? "bg-primary"
      : "bg-muted-foreground";

  return (
    <div className="flex items-center justify-between mb-3">
      <div className="flex items-center gap-2">
        {pulse && (
          <span className="relative flex h-2 w-2">
            <span
              className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${dotColor}`}
            />
            <span className={`relative inline-flex rounded-full h-2 w-2 ${dotColor}`} />
          </span>
        )}
        <h2 className="text-foreground font-bold text-[13px] tracking-tight">{label}</h2>
      </div>
      <p className="text-muted-foreground text-[10px] font-medium">{sub}</p>
    </div>
  );
}

function EmptyState({ query, onClear }: { query: string; onClear: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center gap-4">
      <div
        className="w-16 h-16 rounded-2xl flex items-center justify-center"
        style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}
      >
        <MapPin className="w-7 h-7 text-muted-foreground/40" />
      </div>
      <div>
        <h2 className="text-foreground font-bold text-base mb-1">No stops found</h2>
        <p className="text-muted-foreground text-sm leading-relaxed">
          No results for{" "}
          <span
            className="font-semibold"
            style={{ color: "rgba(255,208,0,0.8)" }}
          >
            "{query}"
          </span>
        </p>
      </div>
      <button
        onClick={onClear}
        className="px-6 py-2.5 font-bold text-sm rounded-[12px] transition-opacity hover:opacity-85"
        style={{ background: "#FFD000", color: "#0D0D0D" }}
      >
        Clear Search
      </button>
    </div>
  );
}

// ─────────────────────────────────────────────
// Stop Card
// ─────────────────────────────────────────────
interface StopCardProps {
  stop: StopWithDistance;
  isFav: boolean;
  onToggleFav: (id: string) => void;
  isExpanded: boolean;
  onToggleExpand: () => void;
  highlight?: boolean;
}

function StopCard({ stop, isFav, onToggleFav, isExpanded, onToggleExpand, highlight }: StopCardProps) {
  const arrivingBuses = useMemo(() => getArrivingBuses(stop.id, 3), [stop.id]);

  // Display up to 3 route badges, then +N
  const ROUTE_LIMIT = 3;
  const displayRoutes = stop.routes.slice(0, ROUTE_LIMIT);
  const extraCount = Math.max(0, stop.routes.length - ROUTE_LIMIT);

  // Derive a short locality label from stop name
  const locality = stop.name.includes(" ")
    ? stop.name.split(" ").slice(-1)[0] + " area"
    : "Amravati";

  return (
    <div
      style={{
        background: "#1A1A1A",
        borderRadius: "16px",
        border: highlight
          ? "1px solid rgba(255,208,0,0.18)"
          : "1px solid rgba(255,255,255,0.07)",
        overflow: "hidden",
        transition: "border-color 0.2s, box-shadow 0.2s",
        boxShadow: isExpanded ? "0 0 0 1px rgba(255,208,0,0.15), 0 4px 24px rgba(0,0,0,0.4)" : "none",
      }}
    >
      {/* ── MAIN CARD BODY ─────────────────── */}
      <div
        role="button"
        tabIndex={0}
        onClick={onToggleExpand}
        onKeyDown={(e) => e.key === "Enter" && onToggleExpand()}
        className="px-4 py-4 cursor-pointer select-none"
      >
        {/* TOP ROW: name + star */}
        <div className="flex items-start justify-between gap-2 mb-2.5">
          <h3
            className="text-foreground font-bold leading-snug flex-1"
            style={{ fontSize: "15px" }}
          >
            {stop.name}
          </h3>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleFav(stop.id);
            }}
            className="p-1.5 rounded-lg transition-colors flex-shrink-0"
            style={{
              background: isFav ? "rgba(255,208,0,0.12)" : "transparent",
              border: isFav ? "1px solid rgba(255,208,0,0.25)" : "1px solid transparent",
            }}
            aria-label={isFav ? "Remove from favourites" : "Add to favourites"}
          >
            <Star
              className="w-4 h-4 transition-all duration-200"
              style={{
                fill: isFav ? "#FFD000" : "transparent",
                color: isFav ? "#FFD000" : "rgba(255,255,255,0.3)",
              }}
            />
          </button>
        </div>

        {/* MIDDLE ROW: locality + distance badge */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-1.5 flex-1 min-w-0">
            <MapPin className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0" />
            <span className="text-muted-foreground text-[12px] truncate">{locality}</span>
          </div>
          <span
            className="flex-shrink-0 ml-2 font-bold text-[11px] px-2.5 py-1 rounded-full"
            style={{
              background: "rgba(255,208,0,0.12)",
              border: "1px solid rgba(255,208,0,0.28)",
              color: "#FFD000",
            }}
          >
            {formatDist(stop.distance)}
          </span>
        </div>

        {/* BOTTOM ROW: route chips + expand indicator */}
        <div className="flex items-center justify-between">
          <div className="flex gap-1.5 flex-wrap">
            {displayRoutes.map((r) => (
              <RouteBadge key={r} label={r} />
            ))}
            {extraCount > 0 && (
              <span
                className="inline-flex items-center justify-center text-[10px] font-bold px-2 h-6 rounded-[6px]"
                style={{
                  background: "rgba(255,255,255,0.08)",
                  color: "rgba(255,255,255,0.45)",
                }}
              >
                +{extraCount}
              </span>
            )}
          </div>
          <div
            className="ml-2 flex-shrink-0 transition-transform duration-200"
            style={{ transform: isExpanded ? "rotate(180deg)" : "rotate(0deg)" }}
          >
            <ChevronDown className="w-4 h-4 text-muted-foreground" />
          </div>
        </div>
      </div>

      {/* ── ACCORDION: ARRIVING BUSES ──────── */}
      {isExpanded && (
        <div
          style={{
            borderTop: "1px solid rgba(255,255,255,0.07)",
            background: "rgba(0,0,0,0.25)",
            padding: "16px",
          }}
        >
          <div className="flex items-center gap-2 mb-3">
            <Zap className="w-3.5 h-3.5 text-primary" />
            <h4 className="text-foreground font-bold text-[12px] tracking-tight">
              Arriving Buses
            </h4>
          </div>

          {arrivingBuses.length > 0 ? (
            <>
              <div className="space-y-2 mb-4">
                {arrivingBuses.map((bus, idx) => (
                  <ArrivingBusRow key={idx} bus={bus} />
                ))}
              </div>

              <button
                className="w-full py-2.5 font-bold text-[12px] rounded-[10px] transition-colors hover:opacity-90"
                style={{
                  border: "1.5px solid #FFD000",
                  color: "#FFD000",
                  background: "transparent",
                }}
                onClick={(e) => e.stopPropagation()}
              >
                <Map className="w-3.5 h-3.5 inline mr-1.5 -mt-0.5" />
                View on Map
              </button>
            </>
          ) : (
            <p className="text-muted-foreground text-[12px] text-center py-3">
              No buses arriving soon
            </p>
          )}
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────
// Route Badge
// ─────────────────────────────────────────────
function RouteBadge({ label }: { label: string }) {
  // Normalise: "R1" → "R-01", "Route 3" → "R-03"
  const short = label
    .replace(/^Route\s+/i, "R-")
    .replace(/^R(\d+)$/, (_, n) => `R-${n.padStart(2, "0")}`);

  return (
    <span
      className="inline-flex items-center justify-center font-bold text-[10px] h-6 px-2 rounded-[6px]"
      style={{
        background: "#FFD000",
        color: "#0D0D0D",
        minWidth: "36px",
        letterSpacing: "0.02em",
      }}
    >
      {short}
    </span>
  );
}

// ─────────────────────────────────────────────
// Arriving Bus Row
// ─────────────────────────────────────────────
function ArrivingBusRow({ bus }: { bus: ArrivingBus }) {
  const statusColor =
    bus.status === "delayed"
      ? "#FF5757"
      : bus.status === "at-stop"
      ? "#4ADE80"
      : "#FFD000";
  const etaLabel =
    bus.status === "at-stop"
      ? "At stop"
      : bus.eta === 0
      ? "Arriving"
      : `${bus.eta} min`;

  return (
    <div
      className="flex items-center justify-between rounded-[10px] px-3 py-2.5"
      style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)" }}
    >
      <div className="flex items-center gap-2.5 flex-1 min-w-0">
        <span
          className="font-bold text-[10px] h-6 px-2 rounded-[5px] flex-shrink-0 flex items-center"
          style={{ background: "#FFD000", color: "#0D0D0D" }}
        >
          {bus.busNumber.split("-").pop()}
        </span>
        <span className="text-foreground text-[12px] font-medium truncate">
          → {bus.destination}
        </span>
      </div>

      <div className="flex items-center gap-1.5 ml-2 flex-shrink-0">
        <Clock className="w-3 h-3" style={{ color: statusColor }} />
        <span className="font-bold text-[11px] tabular-nums" style={{ color: statusColor }}>
          {etaLabel}
        </span>
      </div>
    </div>
  );
}
