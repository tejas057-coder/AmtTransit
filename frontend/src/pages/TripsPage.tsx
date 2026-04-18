import { useState } from "react";
import { recentTrips, stops } from "@/data/mockData";
import { User, MapPin, Clock, Star, Plus, CheckCircle, AlertCircle, Mail, Route } from "lucide-react";
import { cn } from "@/lib/utils";

const tabs = ["Saved Stops", "Recent Trips", "Favourite Routes"];

const savedStops: any[] = [];

export default function TripsPage() {
  const [activeTab, setActiveTab] = useState("Saved Stops");

  return (
    <div className="p-6 lg:p-8 max-w-3xl mx-auto animate-fade-in">
      {/* User Card */}
      <div className="bg-card rounded-2xl border p-6 mb-8">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center">
            <User className="w-7 h-7 text-primary" />
          </div>
          <div>
            <h1 className="text-xl font-extrabold text-foreground">Rahul Sharma</h1>
            <div className="flex items-center gap-1 text-sm text-muted-foreground mt-0.5">
              <Mail className="w-3.5 h-3.5" />
              <span>rahul@gmail.com</span>
            </div>
          </div>
        </div>
        <div className="flex gap-6 mt-5">
          <div className="text-center">
            <p className="text-2xl font-bold text-foreground">3</p>
            <p className="text-xs text-muted-foreground">Saved Stops</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-foreground">47</p>
            <p className="text-xs text-muted-foreground">Total Trips</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-foreground">4</p>
            <p className="text-xs text-muted-foreground">Fav Routes</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        {tabs.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={cn(
              "px-4 py-2 rounded-xl text-sm font-medium transition-all",
              activeTab === tab ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground hover:bg-accent"
            )}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Saved Stops */}
      {activeTab === "Saved Stops" && (
        <div className="space-y-3">
          {savedStops.length > 0 ? (
            savedStops.map((stop, i) => (
              <div key={i} className="bg-card rounded-2xl border p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <MapPin className="w-5 h-5 text-primary" />
                  <div>
                    <span className="text-sm font-semibold text-foreground">{stop.name}</span>
                    {stop.isHome && <span className="ml-2 text-[10px] bg-primary/10 text-primary font-medium px-2 py-0.5 rounded-full">HOME</span>}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button className={cn("text-xs px-2 py-1 rounded-lg", stop.notify ? "bg-success/10 text-success" : "bg-secondary text-muted-foreground")}>
                    {stop.notify ? "Alerts On" : "Alerts Off"}
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-muted-foreground bg-card rounded-2xl border">
              <MapPin className="w-8 h-8 mx-auto mb-2 opacity-20" />
              <p className="text-sm">No saved stops yet</p>
            </div>
          )}
          <button className="w-full py-3 bg-secondary text-secondary-foreground rounded-2xl text-sm font-medium hover:bg-accent transition-colors flex items-center justify-center gap-2">
            <Plus className="w-4 h-4" />Add Stop
          </button>
        </div>
      )}

      {/* Recent Trips */}
      {activeTab === "Recent Trips" && (
        <div className="space-y-3">
          {recentTrips.map(trip => (
            <div key={trip.id} className="bg-card rounded-2xl border p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-muted-foreground">📅 {trip.date}</span>
                <div className="flex items-center gap-1">
                  {trip.status === 'on-time' ? (
                    <><CheckCircle className="w-3.5 h-3.5 text-success" /><span className="text-xs text-success font-medium">On Time</span></>
                  ) : (
                    <><AlertCircle className="w-3.5 h-3.5 text-warning" /><span className="text-xs text-warning font-medium">Delayed</span></>
                  )}
                </div>
              </div>
              <p className="text-sm font-semibold text-foreground">{trip.route} | {trip.from} → {trip.to}</p>
              <div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground">
                <Clock className="w-3 h-3" />
                <span>Duration: {trip.duration}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Favourite Routes */}
      {activeTab === "Favourite Routes" && (
        <div className="space-y-3">
          {[1, 2, 5].map(rId => (
            <div key={rId} className="bg-card rounded-2xl border p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Route className="w-5 h-5 text-primary" />
                <span className="text-sm font-semibold text-foreground">Route {rId}</span>
              </div>
              <Star className="w-5 h-5 text-warning fill-warning" />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
