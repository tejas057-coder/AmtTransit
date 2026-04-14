import { useState, useEffect, useRef } from "react";
import { Calendar, Clock, ChevronDown, Bell } from "lucide-react";
import { allRoutes, BusRoute } from "@/data/busScheduleData";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Parse time string "HH:MM" to minutes since midnight
const timeToMinutes = (time: string): number => {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
};

// Get current time in minutes since midnight
const getCurrentMinutes = (): number => {
  const now = new Date();
  return now.getHours() * 60 + now.getMinutes();
};

// Format minutes to "HH:MM"
const minutesToTime = (minutes: number): string => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${String(hours).padStart(2, "0")}:${String(mins).padStart(2, "0")}`;
};

// Get day of week (0 = Monday, 6 = Sunday)
const getDayOfWeek = (): number => {
  const today = new Date();
  return today.getDay() === 0 ? 6 : today.getDay() - 1; // Convert JS Sunday=0 to Mon=0
};

export default function SchedulePage() {
  const [selectedRouteId, setSelectedRouteId] = useState<string>("route-1");
  const [selectedDayIndex, setSelectedDayIndex] = useState<number>(getDayOfWeek());
  const [countdownTime, setCountdownTime] = useState<string>("0:00");
  const countdownIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const dayLabels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const today = new Date();
  const todayIndex = getDayOfWeek();

  const selectedRoute = allRoutes.find((r) => r.routeId === selectedRouteId) || allRoutes[0];
  const currentMinutes = getCurrentMinutes();

  // Get schedules for selected day (simplified - using all schedules for demo)
  const upcomingSchedules = selectedRoute.schedules
    .flatMap((schedule) =>
      schedule.departureTimes.map((depTime, idx) => ({
        departureTime: depTime,
        arrivalTime: schedule.arrivalTimes?.[idx] || "",
        direction: schedule.direction,
        departureStop: schedule.departureStop,
        arrivalStop: schedule.arrivalStop,
        estimatedDuration: schedule.estimatedDuration,
      }))
    )
    .sort((a, b) => timeToMinutes(a.departureTime) - timeToMinutes(b.departureTime));

  // Find next bus
  const nextBusEntry = upcomingSchedules.find(
    (s) => timeToMinutes(s.departureTime) > currentMinutes
  );

  // Update countdown timer
  useEffect(() => {
    const updateCountdown = () => {
      if (!nextBusEntry) {
        setCountdownTime("—");
        return;
      }

      const nextBusMinutes = timeToMinutes(nextBusEntry.departureTime);
      const remaining = nextBusMinutes - getCurrentMinutes();

      if (remaining <= 0) {
        setCountdownTime("Now");
      } else {
        const minutes = Math.floor(remaining);
        const seconds = remaining > 0 ? Math.round((remaining - minutes) * 60) : 0;
        setCountdownTime(`${minutes}:${String(seconds).padStart(2, "0")}`);
      }
    };

    updateCountdown();
    countdownIntervalRef.current = setInterval(updateCountdown, 1000);

    return () => {
      if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);
    };
  }, [nextBusEntry]);

  return (
    <div className="w-full bg-background pb-32 lg:pb-0">
      {/* PAGE HEADER */}
      <div className="sticky top-0 z-40 bg-background/95 backdrop-blur-sm border-b border-white/8 px-4 py-4 flex items-center justify-between">
        <h1 className="text-foreground font-bold text-lg">Schedule</h1>
        <button className="p-2 hover:bg-muted/50 rounded-lg transition-colors">
          <Calendar className="w-5 h-5 text-foreground" />
        </button>
      </div>

      {/* DAY SELECTOR - 7 Pills */}
      <div className="px-4 py-3 bg-background sticky top-16 z-40">
        <div className="flex gap-2 overflow-x-auto no-scrollbar snap-x snap-mandatory">
          {dayLabels.map((day, idx) => {
            const isToday = idx === todayIndex;
            const date = new Date(today);
            date.setDate(today.getDate() + (idx - todayIndex));

            return (
              <button
                key={day}
                onClick={() => setSelectedDayIndex(idx)}
                className={`flex-shrink-0 px-4 py-2.5 rounded-full font-bold text-sm snap-center whitespace-nowrap transition-all ${
                  selectedDayIndex === idx
                    ? "bg-primary text-primary-foreground"
                    : "bg-card border border-white/10 text-muted-foreground hover:border-white/20"
                }`}
              >
                {day}
              </button>
            );
          })}
        </div>
      </div>

      {/* ROUTE SELECTOR */}
      <div className="px-4 py-4 bg-background sticky top-28 z-40">
        <label className="text-muted-foreground text-xs font-medium block mb-2">
          Select Route
        </label>
        <Select value={selectedRouteId} onValueChange={setSelectedRouteId}>
          <SelectTrigger className="w-full bg-card border-white/8 text-foreground rounded-[12px]">
            <SelectValue placeholder="Choose route..." />
          </SelectTrigger>
          <SelectContent className="bg-card border-white/8">
            {allRoutes.map((route) => (
              <SelectItem key={route.routeId} value={route.routeId}>
                {route.routeName}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* TIMETABLE LIST */}
      <div className="px-4 py-6">
        {upcomingSchedules.length === 0 ? (
          // EMPTY STATE
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="flex justify-center mb-4">
              <Calendar className="w-12 h-12 text-muted-foreground/50" />
            </div>
            <h2 className="text-foreground font-bold text-lg mb-1">No schedules</h2>
            <p className="text-muted-foreground text-sm">
              No buses for this route on selected day
            </p>
          </div>
        ) : (
          <div className="relative">
            {/* Timeline vertical connector */}
            <div className="absolute left-9 top-0 bottom-0 w-0.5 bg-primary/30" />

            <div className="space-y-1">
              {upcomingSchedules.map((entry, idx) => {
                const depMinutes = timeToMinutes(entry.departureTime);
                const isPast = depMinutes < currentMinutes;
                const isNext = entry === nextBusEntry;

                return (
                  <div
                    key={idx}
                    className="flex gap-3 relative"
                    style={{ opacity: isPast ? 0.4 : 1 }}
                  >
                    {/* TIME DOT & TEXT */}
                    <div className="flex-shrink-0 w-20 flex flex-col items-center pt-2">
                      <div
                        className={`w-5 h-5 rounded-full border-2 transition-all ${
                          isNext
                            ? "bg-primary border-primary ring-2 ring-primary/50"
                            : "bg-card border-primary"
                        }`}
                      />
                      <span className="text-primary font-bold text-lg mt-1">
                        {entry.departureTime}
                      </span>
                    </div>

                    {/* CARD */}
                    <div
                      className={`flex-1 bg-card rounded-[12px] p-3 transition-all ${
                        isNext
                          ? "border-2 border-primary shadow-[0_0_12px_rgba(255,208,0,0.2)]"
                          : "border border-white/8"
                      }`}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <p className="text-foreground font-medium text-sm">
                            {entry.departureStop} → {entry.arrivalStop}
                          </p>
                          <p className="text-muted-foreground text-xs mt-0.5">
                            {entry.estimatedDuration} min
                          </p>
                        </div>
                        <span
                          className={`text-xs font-bold px-2 py-1 rounded-[6px] ${
                            isPast
                              ? "bg-muted/20 text-muted-foreground"
                              : isNext
                                ? "bg-primary/20 text-primary"
                                : "bg-success/20 text-success"
                          }`}
                        >
                          {isPast ? "Completed" : isNext ? "Next" : "Upcoming"}
                        </span>
                      </div>

                      {/* Arrival time */}
                      <div className="text-muted-foreground text-xs flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        Arrives {entry.arrivalTime}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* STICKY BOTTOM BANNER */}
      {nextBusEntry && (
        <div className="fixed bottom-24 lg:bottom-0 left-0 right-0 bg-card border-t border-white/8 px-4 py-3 flex items-center justify-between backdrop-blur-sm">
          {/* Left: Clock Icon (Animated) */}
          <div className="flex-shrink-0">
            <Clock
              className="w-6 h-6 text-muted-foreground"
              style={{
                animation: "spin 3s linear infinite",
              }}
            />
          </div>

          {/* Center: Countdown */}
          <div className="flex-1 text-center mx-4">
            <p className="text-muted-foreground text-xs mb-0.5">Next bus in</p>
            <p className="text-primary font-bold text-xl">{countdownTime}</p>
          </div>

          {/* Right: Set Reminder Button */}
          <button className="flex-shrink-0 px-3 py-2 border-2 border-primary text-primary font-bold rounded-[8px] text-xs hover:bg-primary/10 transition-colors flex items-center gap-1">
            <Bell className="w-3 h-3" />
            Remind
          </button>

          <style>{`
            @keyframes spin {
              from {
                transform: rotate(0deg);
              }
              to {
                transform: rotate(360deg);
              }
            }
          `}</style>
        </div>
      )}
    </div>
  );
}
