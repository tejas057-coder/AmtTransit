import { useState, useMemo } from "react";
import {
  Bell,
  AlertTriangle,
  Clock,
  Info,
  X,
} from "lucide-react";

type NotificationType = "alert" | "schedule" | "info";
type FilterType = "all" | "alerts" | "updates";

interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  description: string;
  timeAgo: string;
  read: boolean;
}

// Mock notifications data
const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: "1",
    type: "alert",
    title: "Bus AM-24 Delayed",
    description: "Route R-07 is running 8 minutes late due to traffic on Rajapeth.",
    timeAgo: "2 min ago",
    read: false,
  },
  {
    id: "2",
    type: "schedule",
    title: "Schedule Changed",
    description: "Bus Stand → Badnera route now has 15-min frequency (was 20 min).",
    timeAgo: "15 min ago",
    read: false,
  },
  {
    id: "3",
    type: "alert",
    title: "Route Diversion",
    description: "R-12 taking alternate route due to construction on VMV Road.",
    timeAgo: "45 min ago",
    read: true,
  },
  {
    id: "4",
    type: "info",
    title: "Maintenance Notice",
    description: "Live tracking temporarily unavailable for Route R-03 (9-10 PM).",
    timeAgo: "1 hour ago",
    read: true,
  },
  {
    id: "5",
    type: "schedule",
    title: "New Route Launched",
    description: "Express R-15 now available: Airport → City Center (45 min).",
    timeAgo: "Yesterday",
    read: true,
  },
  {
    id: "6",
    type: "info",
    title: "System Maintenance",
    description: "App updated to v2.1 with improved real-time tracking.",
    timeAgo: "2 days ago",
    read: true,
  },
];

// Get icon for notification type
const getNotificationIcon = (type: NotificationType) => {
  switch (type) {
    case "alert":
      return AlertTriangle;
    case "schedule":
      return Clock;
    case "info":
      return Info;
    default:
      return Bell;
  }
};

// Get icon and background color for notification type
const getIconStyle = (type: NotificationType, isRead: boolean) => {
  if (isRead) {
    return {
      bgClass: "bg-muted/20",
      textClass: "text-muted-foreground",
    };
  }

  switch (type) {
    case "alert":
      return {
        bgClass: "bg-danger/20",
        textClass: "text-danger",
      };
    case "schedule":
      return {
        bgClass: "bg-primary/20",
        textClass: "text-primary",
      };
    case "info":
      return {
        bgClass: "bg-blue-500/20",
        textClass: "text-blue-400",
      };
  }
};

// Group notifications by time
const groupNotificationsByTime = (notifications: Notification[]) => {
  const today = new Date();
  const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000);

  const groups: { label: string; notifications: Notification[] }[] = [
    { label: "Today", notifications: [] },
    { label: "Yesterday", notifications: [] },
    { label: "Earlier", notifications: [] },
  ];

  notifications.forEach((notif) => {
    if (notif.timeAgo.includes("min ago") || notif.timeAgo.includes("hour ago")) {
      groups[0].notifications.push(notif);
    } else if (notif.timeAgo.includes("Yesterday")) {
      groups[1].notifications.push(notif);
    } else {
      groups[2].notifications.push(notif);
    }
  });

  return groups.filter((g) => g.notifications.length > 0);
};

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>(MOCK_NOTIFICATIONS);
  const [selectedFilter, setSelectedFilter] = useState<FilterType>("all");
  const [dismissingId, setDismissingId] = useState<string | null>(null);

  // Filter notifications
  const filteredNotifications = useMemo(() => {
    let filtered = notifications.filter((n) => !notifications.find((f) => f.id === n.id && dismissingId === n.id));

    if (selectedFilter === "alerts") {
      filtered = filtered.filter((n) => n.type === "alert");
    } else if (selectedFilter === "updates") {
      filtered = filtered.filter((n) => n.type === "schedule" || n.type === "info");
    }

    return filtered;
  }, [notifications, selectedFilter, dismissingId]);

  // Group filtered notifications
  const groupedNotifications = groupNotificationsByTime(filteredNotifications);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleMarkAllRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, read: true })));
  };

  const handleToggleRead = (id: string) => {
    setNotifications(
      notifications.map((n) => (n.id === id ? { ...n, read: !n.read } : n))
    );
  };

  const handleDismiss = (id: string) => {
    setDismissingId(id);
    // Remove after animation
    setTimeout(() => {
      setNotifications(notifications.filter((n) => n.id !== id));
      setDismissingId(null);
    }, 300);
  };

  return (
    <div className="w-full bg-background pb-24 lg:pb-0">
      {/* HEADER */}
      <div className="sticky top-0 z-40 bg-background/95 backdrop-blur-sm border-b border-white/8 px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h1 className="text-foreground font-bold text-lg">Notifications</h1>
            {unreadCount > 0 && (
              <span className="bg-primary text-primary-foreground font-bold text-xs px-2.5 py-1 rounded-full">
                {unreadCount}
              </span>
            )}
          </div>
          {unreadCount > 0 && (
            <button
              onClick={handleMarkAllRead}
              className="text-primary font-bold text-sm hover:opacity-80 transition-opacity"
            >
              Mark all read
            </button>
          )}
        </div>
      </div>

      {/* FILTER TABS */}
      <div className="sticky top-16 z-40 bg-background border-b border-white/8 px-4 py-3 flex gap-6">
        {(["all", "alerts", "updates"] as const).map((filter) => (
          <button
            key={filter}
            onClick={() => setSelectedFilter(filter)}
            className={`text-sm font-bold pb-2 transition-all relative ${
              selectedFilter === filter
                ? "text-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {filter.charAt(0).toUpperCase() + filter.slice(1)}
            {selectedFilter === filter && (
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-primary" />
            )}
          </button>
        ))}
      </div>

      {/* NOTIFICATIONS LIST */}
      <div className="px-4 py-4">
        {filteredNotifications.length === 0 ? (
          // EMPTY STATE
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <Bell className="w-12 h-12 text-muted-foreground/30 mb-4" />
            <h2 className="text-foreground font-bold text-lg mb-1">
              You're all caught up
            </h2>
            <p className="text-muted-foreground text-sm">
              No new notifications
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {groupedNotifications.map((group) => (
              <div key={group.label}>
                {/* TIME SECTION DIVIDER */}
                <h3 className="text-muted-foreground text-xs font-bold uppercase tracking-wide mb-3 px-1">
                  {group.label}
                </h3>

                {/* NOTIFICATIONS IN GROUP */}
                <div className="space-y-2 mb-4">
                  {group.notifications.map((notif) => {
                    const Icon = getNotificationIcon(notif.type);
                    const iconStyle = getIconStyle(notif.type, notif.read);
                    const isDismissing = dismissingId === notif.id;

                    return (
                      <div
                        key={notif.id}
                        onClick={() => handleToggleRead(notif.id)}
                        className={`bg-card border rounded-[12px] p-4 flex items-start gap-3 cursor-pointer transition-all ${
                          notif.read
                            ? "border-white/8 bg-card"
                            : "border-primary border-l-4 bg-[#1E1A00]"
                        } ${isDismissing ? "opacity-0 max-h-0" : "opacity-100"}`}
                        style={{
                          transition: "opacity 0.3s ease, max-height 0.3s ease",
                        }}
                      >
                        {/* ICON */}
                        <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${iconStyle.bgClass}`}>
                          <Icon className={`w-5 h-5 ${iconStyle.textClass}`} />
                        </div>

                        {/* CONTENT */}
                        <div className="flex-1 min-w-0">
                          <h4 className="text-foreground font-bold text-sm mb-1">
                            {notif.title}
                          </h4>
                          <p className="text-muted-foreground text-xs leading-relaxed mb-1">
                            {notif.description}
                          </p>
                          <p className="text-muted-foreground text-xs">
                            {notif.timeAgo}
                          </p>
                        </div>

                        {/* DISMISS BUTTON */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDismiss(notif.id);
                          }}
                          className="flex-shrink-0 p-2 ml-2 hover:bg-muted/50 rounded-lg transition-colors"
                        >
                          <X className="w-4 h-4 text-muted-foreground" />
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
