import { useState } from "react";
import { routes, scheduleData } from "@/data/mockData";
import { Calendar, ChevronDown, CheckCircle, AlertCircle, Radio, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

const dayTabs = ["Today", "Tomorrow", "This Week"];
const statusFilters = ["All", "On-Time", "Delayed", "Cancelled"];

export default function SchedulePage() {
  const [selectedRoute, setSelectedRoute] = useState(routes[0].id);
  const [activeDay, setActiveDay] = useState("Today");
  const [statusFilter, setStatusFilter] = useState("All");

  const route = routes.find(r => r.id === selectedRoute)!;

  const statusIcon = (status: string) => {
    switch (status) {
      case 'done': return <CheckCircle className="w-4 h-4 text-muted-foreground" />;
      case 'delayed': return <AlertCircle className="w-4 h-4 text-destructive" />;
      case 'live': return <Radio className="w-4 h-4 text-success" />;
      default: return <Clock className="w-4 h-4 text-muted-foreground" />;
    }
  };

  const statusLabel = (status: string) => {
    switch (status) {
      case 'done': return <span className="text-muted-foreground text-xs">✅ Done</span>;
      case 'delayed': return <span className="text-destructive text-xs font-medium">🔴 -8m</span>;
      case 'live': return <span className="text-success text-xs font-medium flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-live pulse-ring" />Live</span>;
      default: return <span className="text-muted-foreground text-xs">🕐 Soon</span>;
    }
  };

  return (
    <div className="p-6 lg:p-8 max-w-5xl mx-auto animate-fade-in">
      <div className="mb-8">
        <h1 className="text-2xl font-extrabold text-foreground">Bus Schedule</h1>
        <p className="text-muted-foreground text-sm mt-1">View departure and arrival times</p>
      </div>

      {/* Route Selector */}
      <div className="mb-6">
        <label className="text-sm font-medium text-foreground mb-2 block">Select Route</label>
        <div className="relative max-w-md">
          <select
            value={selectedRoute}
            onChange={e => setSelectedRoute(e.target.value)}
            className="w-full appearance-none bg-card border rounded-xl px-4 py-3 pr-10 text-sm font-medium text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary cursor-pointer"
          >
            {routes.map(r => (
              <option key={r.id} value={r.id}>{r.name} — {r.from} → {r.to}</option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
        </div>
      </div>

      {/* Day Tabs */}
      <div className="flex gap-2 mb-4">
        {dayTabs.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveDay(tab)}
            className={cn(
              "px-4 py-2 rounded-xl text-sm font-medium transition-all",
              activeDay === tab ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground hover:bg-accent"
            )}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Status Filters */}
      <div className="flex gap-2 mb-6">
        {statusFilters.map(f => (
          <button
            key={f}
            onClick={() => setStatusFilter(f)}
            className={cn(
              "px-3 py-1.5 rounded-full text-xs font-medium transition-all",
              statusFilter === f ? "bg-foreground text-background" : "bg-secondary text-secondary-foreground hover:bg-accent"
            )}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Schedule Table */}
      <div className="bg-card rounded-2xl border overflow-hidden">
        <div className="grid grid-cols-4 gap-4 px-5 py-3 bg-secondary/50 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          <span>Trip #</span>
          <span>Departure</span>
          <span>Arrival</span>
          <span>Status</span>
        </div>
        {scheduleData.map((row, i) => (
          <div
            key={i}
            className={cn(
              "grid grid-cols-4 gap-4 px-5 py-4 border-t items-center hover:bg-accent/50 transition-colors cursor-pointer",
              row.status === 'live' && "bg-success/5"
            )}
          >
            <span className="text-sm font-medium text-foreground">{row.trip}</span>
            <span className="text-sm text-foreground">{row.departure}</span>
            <span className="text-sm text-foreground">{row.arrival}</span>
            <div className="flex items-center gap-1.5">
              {statusIcon(row.status)}
              {statusLabel(row.status)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
