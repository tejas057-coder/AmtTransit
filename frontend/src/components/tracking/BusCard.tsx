import { MapPin, Navigation2, Users, Clock, AlertCircle } from "lucide-react";

interface BusDetailsProps {
  route: string;
  source: string;
  destination: string;
  eta: number;
  occupancy: number;
  passengers: number;
  capacity: number;
  status: "on-time" | "delayed" | "arrived";
  nextStop?: string;
}

/**
 * Reusable bus information card component
 * Displays detailed bus information with status and occupancy
 */
export function BusInfoCard({
  route,
  source,
  destination,
  eta,
  occupancy,
  passengers,
  capacity,
  status,
  nextStop,
}: BusDetailsProps) {
  const statusConfig = {
    "on-time": {
      bg: "bg-primary/10",
      text: "text-primary",
      label: "On Time",
      icon: "✓",
    },
    delayed: {
      bg: "bg-danger/10",
      text: "text-danger",
      label: "Delayed",
      icon: "!",
    },
    arrived: {
      bg: "bg-success/10",
      text: "text-success",
      label: "Arrived",
      icon: "✓",
    },
  };

  const config = statusConfig[status];

  const occupancyColor =
    occupancy > 80 ? "text-danger" : occupancy > 50 ? "text-primary" : "text-success";

  return (
    <div className="bg-card border border-white/8 rounded-[16px] p-6 space-y-5">
      {/* Route Header */}
      <div className="flex items-start justify-between">
        <div>
          <p className="text-muted-foreground text-xs font-medium mb-1">Route</p>
          <h3 className="text-foreground font-bold text-3xl">{route}</h3>
        </div>
        <div className={`${config.bg} ${config.text} px-3 py-1.5 rounded-[20px] font-medium text-sm`}>
          {config.label}
        </div>
      </div>

      {/* Route Details */}
      <div className="space-y-3">
        <div className="flex items-center gap-3">
          <MapPin className="w-5 h-5 text-muted-foreground flex-shrink-0" />
          <div>
            <p className="text-muted-foreground text-xs font-normal">From</p>
            <p className="text-foreground font-medium">{source}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Navigation2 className="w-5 h-5 text-primary flex-shrink-0" />
          <div>
            <p className="text-muted-foreground text-xs font-normal">To</p>
            <p className="text-foreground font-medium">{destination}</p>
          </div>
        </div>
      </div>

      {/* ETA and Time */}
      <div className="bg-muted/30 rounded-[12px] p-4 flex items-center justify-between">
        <div>
          <p className="text-muted-foreground text-xs font-normal">Estimated Arrival</p>
          <p className="text-foreground font-bold text-lg">{eta} minutes</p>
        </div>
        <Clock className="w-6 h-6 text-primary" />
      </div>

      {/* Occupancy */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <p className="text-muted-foreground text-sm font-normal">Occupancy</p>
          <p className={`font-bold text-lg ${occupancyColor}`}>{occupancy}%</p>
        </div>
        <div className="w-full bg-muted/40 rounded-full h-3">
          <div
            className={`h-3 rounded-full transition-all ${
              occupancy > 80 ? "bg-danger" : occupancy > 50 ? "bg-primary" : "bg-success"
            }`}
            style={{ width: `${occupancy}%` }}
          />
        </div>
        <div className="flex items-center gap-2">
          <Users className="w-4 h-4 text-muted-foreground" />
          <p className="text-muted-foreground text-sm font-normal">
            {passengers} passengers / {capacity} capacity
          </p>
        </div>
      </div>

      {/* Next Stop (if provided) */}
      {nextStop && (
        <div className="bg-primary/10 border border-primary/20 rounded-[12px] p-4 flex items-start gap-3">
          <MapPin className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-primary font-medium text-sm">Next Stop</p>
            <p className="text-foreground font-semibold">{nextStop}</p>
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * Live tracking status indicator
 */
export function LiveStatusBadge() {
  return (
    <div className="flex items-center gap-2 bg-primary/15 text-primary px-3 py-1.5 rounded-[20px] font-medium text-sm inline-flex">
      <span className="relative inline-flex">
        <span className="absolute w-2 h-2 bg-primary rounded-full animate-pulse"></span>
        <span className="block w-2 h-2 bg-primary rounded-full opacity-0"></span>
      </span>
      Live Tracking
    </div>
  );
}

/**
 * Empty state for when no buses are nearby
 */
export function NoBusesEmpty() {
  return (
    <div className="bg-card border border-white/8 rounded-[16px] p-12 text-center space-y-3">
      <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto opacity-50" />
      <h3 className="text-foreground font-bold text-lg">No buses nearby</h3>
      <p className="text-muted-foreground text-sm">Try a different location or check the schedule</p>
    </div>
  );
}
