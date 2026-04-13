import { routes, buses } from "@/data/mockData";
import { MapPin, Clock, Bus as BusIcon, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

export default function RoutesPage() {
  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto animate-fade-in">
      <div className="mb-8">
        <h1 className="text-2xl font-extrabold text-foreground">Bus Routes — Amravati City</h1>
        <p className="text-muted-foreground text-sm mt-1">{routes.length} routes operating</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {routes.map(route => {
          const routeBuses = buses.filter(b => b.routeId === route.id);
          return (
            <div key={route.id} className="bg-card rounded-2xl border p-5 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: route.color + '20', color: route.color }}>
                    <BusIcon className="w-4 h-4" />
                  </div>
                  <span className="font-bold text-foreground">{route.name}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-live pulse-ring" />
                  <span className="text-xs font-medium text-success">{route.activeBuses} Active</span>
                </div>
              </div>

              <div className="flex items-center gap-2 text-sm text-foreground mb-4">
                <span>{route.from}</span>
                <ArrowRight className="w-3 h-3 text-muted-foreground" />
                <span>{route.to}</span>
              </div>

              <div className="h-px bg-border mb-4" />

              <div className="grid grid-cols-2 gap-3 text-xs text-muted-foreground mb-4">
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-3 h-3" />
                  <span>Stops: {route.stops.length}</span>
                </div>
                <div>Distance: {route.distance}</div>
                <div className="flex items-center gap-1.5">
                  <Clock className="w-3 h-3" />
                  <span>{route.frequency}</span>
                </div>
                <div>First: {route.firstBus} • Last: {route.lastBus}</div>
              </div>

              <div className="flex gap-2">
                <button className="flex-1 py-2 bg-primary text-primary-foreground text-xs font-medium rounded-xl hover:opacity-90 transition-opacity">
                  View on Map
                </button>
                <button className="flex-1 py-2 bg-secondary text-secondary-foreground text-xs font-medium rounded-xl hover:bg-accent transition-colors">
                  See Schedule
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
