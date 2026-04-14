import { useState, useEffect } from "react";
import { Bell, MapPin, Navigation2, Clock, Map, ChevronDown } from "lucide-react";
import { Link } from "react-router-dom";
import { buses } from "@/data/mockData";

interface QuickAction {
  label: string;
  icon: React.ReactNode;
  path: string;
}

interface OccupancyDot {
  color: string;
}

// Calculate occupancy level (0-60 passengers → 1-3 dots, with color change)
function getOccupancyDots(passengers: number): OccupancyDot[] {
  if (passengers <= 20) return [{ color: "bg-success" }]; // Green - 1 dot
  if (passengers <= 35) return [{ color: "bg-success" }, { color: "bg-primary" }]; // Green + Yellow - 2 dots
  return [{ color: "bg-success" }, { color: "bg-primary" }, { color: "bg-danger" }]; // All 3 - Red
}

// Calculate bus progress percentage along route
function getBusProgress(passengers: number): number {
  return Math.min((passengers / 60) * 100, 100);
}

const quickActions: QuickAction[] = [
  { label: "Live Map", icon: <Map className="w-5 h-5" />, path: "/map" },
  { label: "All Routes", icon: <Navigation2 className="w-5 h-5" />, path: "/routes" },
  { label: "Schedule", icon: <Clock className="w-5 h-5" />, path: "/schedule" },
  { label: "Nearby Stop", icon: <MapPin className="w-5 h-5" />, path: "/stops" },
];

export default function Index() {
  const [notificationCount, setNotificationCount] = useState(3);

  useEffect(() => {
    // Simulate notification updates
    setNotificationCount(Math.floor(Math.random() * 5) + 1);
  }, []);

  return (
    <div className="bg-background min-h-screen pb-24 lg:pb-8">
      {/* ===== TOP HEADER ===== */}
      <header className="sticky top-0 z-40 bg-card border-b border-white/8 px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Left: Location Chip */}
          <div className="flex items-center gap-2 bg-muted/30 border border-white/10 rounded-[20px] px-3 py-1.5 cursor-pointer hover:border-white/20 transition-colors">
            <MapPin className="w-4 h-4 text-primary" />
            <span className="text-foreground font-medium text-sm">Amravati</span>
            <ChevronDown className="w-3 h-3 text-muted-foreground" />
          </div>

          {/* Right: Notification Bell */}
          <div className="relative">
            <button className="p-2 hover:bg-muted/50 rounded-lg transition-colors">
              <Bell className="w-5 h-5 text-foreground" />
            </button>
            {notificationCount > 0 && (
              <div className="absolute -top-1 -right-1 w-5 h-5 bg-primary text-primary-foreground rounded-full text-xs font-bold flex items-center justify-center">
                {notificationCount}
              </div>
            )}
          </div>
        </div>
      </header>

      {/* ===== HERO SEARCH BAR ===== */}
      <section className="px-4 pt-6 pb-5">
        <div className="relative">
          <div className="absolute left-4 top-1/2 -translate-y-1/2">
            <svg
              className="w-5 h-5 text-muted-foreground"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            type="text"
            placeholder="Where do you want to go?"
            className="w-full bg-card border border-white/10 hover:border-white/20 focus:border-primary/50 text-foreground placeholder-muted-foreground rounded-[26px] pl-12 pr-4 py-3.5 h-[52px] focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all font-normal text-base"
          />
        </div>
      </section>

      {/* ===== QUICK ACTIONS ROW ===== */}
      <section className="pb-6">
        <div className="overflow-x-auto no-scrollbar">
          <div className="flex gap-2 px-4 snap-x snap-mandatory">
            {quickActions.map((action) => (
              <Link
                key={action.label}
                to={action.path}
                className="flex-shrink-0 flex items-center gap-2 bg-card border border-white/10 hover:border-primary/50 rounded-[24px] px-4 py-2.5 transition-all snap-start group"
              >
                <div className="text-muted-foreground group-hover:text-primary transition-colors">
                  {action.icon}
                </div>
                <span className="text-foreground text-sm font-medium whitespace-nowrap">
                  {action.label}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ===== FEATURED ROUTE: NAVSARI TO BADNERA ===== */}
      <section className="px-4 pb-6">
        <Link to="/route/navsari-badnera" className="block">
          <div className="bg-gradient-to-br from-primary/20 via-card to-card border border-primary/30 hover:border-primary/50 rounded-[16px] overflow-hidden transition-all group">
            <div className="px-5 py-4 space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-white font-bold text-base mb-1">Route Map</h3>
                  <p className="text-muted-foreground text-xs">Navsari → Badnera with real coordinates</p>
                </div>
                <div className="bg-primary/20 text-primary rounded-lg p-2 group-hover:bg-primary/30 transition-colors">
                  <Navigation2 className="w-4 h-4" />
                </div>
              </div>
              <div className="flex gap-2 flex-wrap">
                <span className="bg-primary/30 text-primary text-xs font-semibold px-3 py-1 rounded-full">22 Stops</span>
                <span className="bg-success/20 text-success text-xs font-semibold px-3 py-1 rounded-full">📍 Geocoded</span>
              </div>
              <div className="pt-2 border-t border-white/8 flex items-center gap-2 text-xs text-muted-foreground">
                <span>View interactive map</span>
                <span className="text-primary">→</span>
              </div>
            </div>
          </div>
        </Link>
      </section>

      {/* ===== SECTION TITLE: "Buses Near You" ===== */}
      <section className="px-4 pb-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h2 className="text-foreground font-bold text-lg">Buses Near You</h2>
          {/* Live pulsing dot */}
          <div className="relative w-2 h-2 rounded-full bg-success animate-pulse">
            <div className="absolute inset-0 w-2 h-2 rounded-full bg-success opacity-30 animate-ping"></div>
          </div>
          {/* Yellow badge count */}
          <span className="bg-primary text-primary-foreground px-2 py-0.5 rounded-full text-xs font-bold">
            {buses.length}
          </span>
        </div>
      </section>

      {/* ===== BUS CARDS LIST ===== */}
      <section className="px-4 space-y-3">
        {buses.map((bus) => {
          const occupancyDots = getOccupancyDots(bus.passengers);
          const progress = getBusProgress(bus.passengers);

          return (
            <Link key={bus.id} to={`/bus/${bus.id}`}>
              <div className="bg-card border border-white/8 hover:border-white/15 rounded-[16px] overflow-hidden transition-all cursor-pointer group">
                <div className="px-3 py-4 flex gap-3">
                  {/* LEFT: Route Badge */}
                  <div className="flex-shrink-0">
                    <div className="bg-primary text-primary-foreground rounded-[8px] w-14 h-14 flex items-center justify-center">
                      <span className="font-bold text-base text-center">
                        R-
                        <br />
                        {bus.number.split("-")[1]}
                      </span>
                    </div>
                  </div>

                  {/* CENTER: Route Info */}
                  <div className="flex-1 min-w-0">
                    <div className="text-white font-bold text-[15px] mb-1">
                      {bus.id === "b1"
                        ? "Navsari → CIDCO"
                        : bus.id === "b2"
                          ? "Navsari → Badnera"
                          : bus.id === "b3"
                            ? "University → Badnera"
                            : bus.id === "b4"
                              ? "Bus Stand → Badnera"
                              : "Route Stop"}
                    </div>
                    <div className="text-muted-foreground text-xs">
                      {bus.id === "b1" || bus.id === "b2"
                        ? "6 stops"
                        : bus.id === "b3"
                          ? "5 stops"
                          : "4 stops"}
                    </div>
                  </div>

                  {/* RIGHT: ETA + Occupancy Dots */}
                  <div className="flex-shrink-0 flex flex-col items-end justify-center gap-2">
                    <div className="text-primary font-bold text-lg">
                      {bus.nextStopEta} min
                    </div>
                    {/* Occupancy dots */}
                    <div className="flex gap-1">
                      {occupancyDots.map((dot, idx) => (
                        <div
                          key={idx}
                          className={`w-2 h-2 rounded-full ${dot.color}`}
                        ></div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* BOTTOM: Progress Bar */}
                <div className="h-1 bg-muted/40">
                  <div
                    className="h-1 bg-primary transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
              </div>
            </Link>
          );
        })}
      </section>

      {/* Additional spacing for bottom nav on mobile */}
      <div className="h-4" />
    </div>
  );
}
