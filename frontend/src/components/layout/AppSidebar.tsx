import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Bus, Map, Route, MapPin, Calendar, Bell, User, HelpCircle, LogOut, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { label: "Live Map", icon: Map, path: "/" },
  { label: "Routes", icon: Route, path: "/routes" },
  { label: "Bus Stops", icon: MapPin, path: "/stops" },
  { label: "Schedule", icon: Calendar, path: "/schedule" },
  { label: "Notifications", icon: Bell, path: "/notifications", badge: 3 },
  { label: "My Trips", icon: User, path: "/trips" },
  { label: "Help", icon: HelpCircle, path: "/help" },
];

export function AppSidebar() {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      {/* Mobile header */}
      <header className="lg:hidden fixed top-0 left-0 right-0 z-50 h-14 bg-card border-b flex items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <Bus className="w-6 h-6 text-primary" />
          <span className="font-extrabold text-foreground">AmravatiTransit</span>
        </div>
        <div className="flex items-center gap-3">
          <Link to="/notifications" className="relative">
            <Bell className="w-5 h-5 text-muted-foreground" />
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-destructive text-destructive-foreground text-[10px] font-bold rounded-full flex items-center justify-center">3</span>
          </Link>
          <button onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </header>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-40 bg-foreground/20 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={cn(
        "fixed top-0 left-0 h-full w-[280px] bg-card border-r z-50 flex flex-col transition-transform duration-300",
        "lg:translate-x-0",
        mobileOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        {/* Logo */}
        <div className="h-16 flex items-center gap-3 px-6 border-b">
          <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center">
            <Bus className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="font-black text-lg text-foreground tracking-tight">AmravatiTransit</span>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const active = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-medium transition-all",
                  active
                    ? "bg-primary text-primary-foreground shadow-lg"
                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                )}
              >
                <item.icon className="w-5 h-5" />
                <span>{item.label}</span>
                {item.badge && (
                  <span className={cn(
                    "ml-auto w-5 h-5 rounded-full text-[10px] font-bold flex items-center justify-center",
                    active ? "bg-primary-foreground/20 text-primary-foreground" : "bg-destructive text-destructive-foreground"
                  )}>
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* User */}
        <div className="p-4 border-t">
          <div className="flex items-center gap-3 px-2">
            <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center">
              <User className="w-4 h-4 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-foreground truncate">Rahul Sharma</p>
              <p className="text-xs text-muted-foreground truncate">rahul@gmail.com</p>
            </div>
            <button className="p-1.5 rounded-lg hover:bg-accent transition-colors">
              <LogOut className="w-4 h-4 text-muted-foreground" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
