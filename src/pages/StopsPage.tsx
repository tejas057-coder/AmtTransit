import { useState } from "react";
import { stops, routes, buses } from "@/data/mockData";
import { Search, MapPin, Bell, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { LeafletMap } from "@/components/map/LeafletMap";

export default function StopsPage() {
  const [search, setSearch] = useState("");
  const filtered = stops.filter(s => s.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="h-[calc(100vh-3.5rem)] lg:h-screen flex flex-col lg:flex-row animate-fade-in">
      {/* Left List */}
      <div className="w-full lg:w-[420px] bg-card border-r flex flex-col h-[50vh] lg:h-full">
        <div className="p-4 border-b">
          <h1 className="text-xl font-extrabold text-foreground mb-3">Bus Stops — Amravati</h1>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search stops..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-background border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {filtered.map(stop => {
            const stopRoutes = stop.routes.map(rId => routes.find(r => r.id === rId)).filter(Boolean);
            // Simulate ETAs
            const etas = stopRoutes.slice(0, 3).map((r, i) => ({
              route: r!.name,
              eta: [3, 7, 12][i],
              status: i === 1 ? 'delayed' : 'on-time' as const
            }));

            return (
              <div key={stop.id} className="bg-background rounded-2xl border p-4 hover:shadow-md transition-shadow">
                <div className="flex items-center gap-2 mb-2">
                  <MapPin className="w-4 h-4 text-primary" />
                  <span className="font-bold text-sm text-foreground">{stop.name}</span>
                </div>
                <p className="text-xs text-muted-foreground mb-3">
                  Routes: {stop.routes.join(', ')}
                </p>
                <div className="space-y-1.5 mb-3">
                  {etas.map((eta, i) => (
                    <div key={i} className="flex items-center justify-between text-xs">
                      <span className="text-foreground">{eta.route}</span>
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3 h-3 text-muted-foreground" />
                        <span className="text-muted-foreground">{eta.eta} min</span>
                        <div className={cn(
                          "w-2 h-2 rounded-full",
                          eta.status === 'on-time' ? "bg-live" : "bg-warning"
                        )} />
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex gap-2">
                  <button className="flex-1 py-1.5 bg-primary text-primary-foreground text-xs font-medium rounded-xl hover:opacity-90 transition-opacity">View on Map</button>
                  <button className="flex-1 py-1.5 bg-secondary text-secondary-foreground text-xs font-medium rounded-xl hover:bg-accent transition-colors flex items-center justify-center gap-1">
                    <Bell className="w-3 h-3" />Set Alert
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Right Map */}
      <div className="flex-1 h-[50vh] lg:h-full">
        <LeafletMap showOnly="stops" />
      </div>
    </div>
  );
}
