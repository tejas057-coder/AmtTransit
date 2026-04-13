import { useState, useMemo } from "react";
import { Search, Filter, MapPin, Clock, Users, Zap } from "lucide-react";
import { buses, stops, routes } from "@/data/mockData";
import { cn } from "@/lib/utils";
import { LeafletMap } from "@/components/map/LeafletMap";

const filterTabs = ["All Buses", "On Route", "Delayed", "At Stop"] as const;

export default function LiveMapPage() {
  const [filter, setFilter] = useState<string>("All Buses");
  const [search, setSearch] = useState("");
  const [selectedBusId, setSelectedBusId] = useState<string | null>(null);

  const filteredBuses = useMemo(() => {
    let result = buses;
    if (filter === "On Route") result = result.filter(b => b.status === "on-time");
    if (filter === "Delayed") result = result.filter(b => b.status === "delayed");
    if (filter === "At Stop") result = result.filter(b => b.status === "at-stop");
    if (search) result = result.filter(b => b.number.toLowerCase().includes(search.toLowerCase()) || b.nextStop.toLowerCase().includes(search.toLowerCase()));
    return result;
  }, [filter, search]);

  const activeBuses = buses.filter(b => b.status === "on-time" || b.status === "at-stop").length;
  const delayedBuses = buses.filter(b => b.status === "delayed").length;

  return (
    <div className="h-[calc(100vh-3.5rem)] lg:h-screen flex flex-col lg:flex-row">
      {/* Left Panel */}
      <div className="w-full lg:w-[420px] bg-card border-r flex flex-col h-[45vh] lg:h-full">
        {/* Search */}
        <div className="p-4 border-b">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search routes, stops in Amravati..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-background border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
            />
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="px-4 py-3 flex gap-2 overflow-x-auto border-b">
          {filterTabs.map(tab => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={cn(
                "px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all",
                filter === tab ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground hover:bg-accent"
              )}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Stats */}
        <div className="px-4 py-3 grid grid-cols-3 gap-2 border-b">
          <div className="bg-background rounded-xl p-2.5 text-center">
            <div className="flex items-center justify-center gap-1 mb-1">
              <div className="w-2 h-2 rounded-full bg-live pulse-ring" />
              <span className="text-xs text-muted-foreground">Active</span>
            </div>
            <p className="text-lg font-bold text-foreground">{activeBuses}</p>
          </div>
          <div className="bg-background rounded-xl p-2.5 text-center">
            <div className="flex items-center justify-center gap-1 mb-1">
              <div className="w-2 h-2 rounded-full bg-warning" />
              <span className="text-xs text-muted-foreground">Delayed</span>
            </div>
            <p className="text-lg font-bold text-foreground">{delayedBuses}</p>
          </div>
          <div className="bg-background rounded-xl p-2.5 text-center">
            <div className="flex items-center justify-center gap-1 mb-1">
              <MapPin className="w-3 h-3 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">Stops</span>
            </div>
            <p className="text-lg font-bold text-foreground">{stops.length}</p>
          </div>
        </div>

        {/* Bus List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {filteredBuses.map(bus => {
            const route = routes.find(r => r.id === bus.routeId);
            return (
              <button
                key={bus.id}
                onClick={() => setSelectedBusId(bus.id)}
                className={cn(
                  "w-full text-left bg-background rounded-2xl p-4 border transition-all hover:shadow-md",
                  selectedBusId === bus.id && "ring-2 ring-primary border-primary"
                )}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-foreground">🚌 Bus #{bus.number}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className={cn(
                      "w-2 h-2 rounded-full",
                      bus.status === "on-time" ? "bg-live pulse-ring" : bus.status === "delayed" ? "bg-warning" : "bg-primary"
                    )} />
                    <span className={cn(
                      "text-[10px] font-semibold uppercase",
                      bus.status === "on-time" ? "text-success" : bus.status === "delayed" ? "text-warning" : "text-primary"
                    )}>
                      {bus.status === "on-time" ? "LIVE" : bus.status === "delayed" ? "DELAYED" : "AT STOP"}
                    </span>
                  </div>
                </div>
                {route && (
                  <p className="text-xs text-muted-foreground mb-2">{route.from} → {route.to}</p>
                )}
                <div className="flex items-center gap-1 text-xs text-muted-foreground mb-2">
                  <Clock className="w-3 h-3" />
                  <span>Next: {bus.nextStop} — {bus.nextStopEta} min</span>
                </div>
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1"><Zap className="w-3 h-3" />{bus.speed} km/h</span>
                  <span className="flex items-center gap-1"><Users className="w-3 h-3" />{bus.passengers}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Right Panel - Map */}
      <div className="flex-1 h-[55vh] lg:h-full relative">
        <LeafletMap selectedBusId={selectedBusId} onSelectBus={setSelectedBusId} />
      </div>
    </div>
  );
}
