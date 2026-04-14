import { useNavigate, useLocation } from "react-router-dom";
import { Map, Route, Clock, Navigation2, User } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * BottomNav Component - Rapido-style persistent mobile navigation
 * 
 * Features:
 * - Fixed bottom positioning (mobile only)
 * - Active route highlighting (yellow #FFD000)
 * - Smooth transitions between tabs
 * - No page reload feeling (uses useNavigate)
 * 
 * Routes:
 * - / → Live Map
 * - /routes → Routes
 * - /trips → Trips
 * - /schedule → Schedule
 * - (future) /profile → Profile
 */

const navItems = [
  { label: "Map", icon: Map, path: "/" },
  { label: "Routes", icon: Route, path: "/routes" },
  { label: "Trips", icon: Navigation2, path: "/trips" },
  { label: "Schedule", icon: Clock, path: "/schedule" },
  { label: "Profile", icon: User, path: "/profile" },
];

export function BottomNav() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleNavigate = (path: string) => {
    navigate(path);
  };

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-card border-t border-white/8 safe-area-inset-bottom">
      <div className="flex items-center justify-around h-20">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;

          return (
            <button
              key={item.path}
              onClick={() => handleNavigate(item.path)}
              aria-label={item.label}
              className={cn(
                "flex flex-col items-center justify-center gap-1.5 px-3 py-2 transition-all relative",
                "hover:text-foreground active:scale-95",
                isActive
                  ? "text-primary"
                  : "text-muted-foreground"
              )}
            >
              {/* Icon */}
              <Icon className="w-6 h-6 transition-all" />

              {/* Label */}
              <span className="text-xs font-bold tracking-wide">
                {item.label}
              </span>

              {/* Active Indicator - Yellow line at bottom */}
              {isActive && (
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 bg-primary rounded-full" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
}

