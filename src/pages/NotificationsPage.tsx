import { useState } from "react";
import { notifications } from "@/data/mockData";
import { Bell, Settings, CheckCheck, AlertCircle, Bus, Route, Info, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";

const categories = ["All", "Delays", "Alerts", "Updates", "My Routes"];

const typeConfig: Record<string, { color: string; icon: typeof Bell; bg: string }> = {
  delay: { color: "text-destructive", icon: AlertCircle, bg: "bg-destructive/10" },
  approaching: { color: "text-success", icon: Bus, bg: "bg-success/10" },
  diversion: { color: "text-warning", icon: Route, bg: "bg-warning/10" },
  cancelled: { color: "text-destructive", icon: AlertCircle, bg: "bg-destructive/10" },
  restored: { color: "text-success", icon: Bus, bg: "bg-success/10" },
  system: { color: "text-muted-foreground", icon: Info, bg: "bg-muted" },
};

export default function NotificationsPage() {
  const [category, setCategory] = useState("All");
  const [items, setItems] = useState(notifications);

  const markAllRead = () => setItems(items.map(n => ({ ...n, read: true })));
  const unreadCount = items.filter(n => !n.read).length;

  return (
    <div className="p-6 lg:p-8 max-w-3xl mx-auto animate-fade-in">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-extrabold text-foreground">Notifications</h1>
          <p className="text-muted-foreground text-sm mt-1">{unreadCount} unread</p>
        </div>
        <div className="flex gap-2">
          <button onClick={markAllRead} className="flex items-center gap-1.5 px-3 py-2 bg-secondary text-secondary-foreground text-xs font-medium rounded-xl hover:bg-accent transition-colors">
            <CheckCheck className="w-3.5 h-3.5" />Mark All Read
          </button>
          <button className="p-2 bg-secondary text-secondary-foreground rounded-xl hover:bg-accent transition-colors">
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className={cn(
              "px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all",
              category === cat ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground hover:bg-accent"
            )}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Notifications List */}
      <div className="space-y-3">
        {items.map(notif => {
          const config = typeConfig[notif.type] || typeConfig.system;
          const Icon = config.icon;
          return (
            <div
              key={notif.id}
              className={cn(
                "bg-card rounded-2xl border p-4 transition-all hover:shadow-md",
                !notif.read && "border-l-4 border-l-primary"
              )}
            >
              <div className="flex items-start gap-3">
                <div className={cn("w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5", config.bg)}>
                  <Icon className={cn("w-4 h-4", config.color)} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <span className={cn("text-xs font-semibold uppercase", config.color)}>
                      {notif.title}
                    </span>
                    <span className="text-[10px] text-muted-foreground">{notif.time}</span>
                  </div>
                  <p className="text-sm text-foreground leading-relaxed">{notif.message}</p>
                  <button className="mt-2 text-xs text-primary font-medium hover:underline flex items-center gap-1">
                    <MapPin className="w-3 h-3" />View on Map
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
