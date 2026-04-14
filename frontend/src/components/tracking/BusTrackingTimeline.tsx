"use client";

import { useState, useEffect } from "react";
import { buses, stops, routes } from "@/data/mockData";

type StopState = "passed" | "active" | "upcoming" | "terminus";
type BusFilterTab = "all" | "on-time" | "delayed" | "at-stop";

function getStatusColor(status: string): string {
  switch (status) {
    case "delayed":
      return "#EF4444";
    case "at-stop":
      return "#3B82F6";
    default:
      return "#10B981";
  }
}

// Route Card
function RouteCard({ route, onSelect }: { route: (typeof routes)[0]; onSelect: () => void }) {
  const activeBusCount = buses.filter((b) => b.routeId === route.id).length;

  return (
    <div 
      className="relative bg-gradient-to-br from-white via-gray-50 to-white border border-gray-200/60 rounded-lg p-4 hover:shadow-lg hover:border-orange-400 transition-all cursor-pointer overflow-hidden"
      onClick={onSelect}
    >
      <div className="absolute left-0 top-0 w-1 h-full bg-gradient-to-b from-orange-500 to-orange-400"></div>
      
      <div className="flex items-center gap-2 mb-2">
        <div className="w-2.5 h-2.5 rounded-full bg-orange-500"></div>
        <h3 className="text-sm font-bold text-gray-900">{route.name}</h3>
      </div>

      <div className="flex items-center gap-1.5 text-xs text-gray-600 mb-3">
        <span className="truncate">{route.from}</span>
        <span className="text-orange-500">→</span>
        <span className="truncate">{route.to}</span>
      </div>

      <div className="flex gap-1.5 mb-3">
        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-orange-100/60 text-orange-700">
          📏 {route.distance}
        </span>
        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-blue-100/60 text-blue-700">
          ⏱️ {route.frequency}
        </span>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div>
          <span className="text-xs font-semibold text-gray-700">{activeBusCount} active</span>
        </div>
        <button className="px-3 py-1 bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold rounded">
          Track
        </button>
      </div>
    </div>
  );
}

// Stop Node
function StopNode({ stop, index, totalStops }: { stop: (typeof stops)[0]; index: number; totalStops: number }) {
  const isTerminus = index === 0 || index === totalStops - 1;
  const busesAtStop = buses.filter((b) => b.nextStop === stop.name);

  return (
    <div className="flex gap-2.5 mb-4 relative">
      {index > 0 && <div className="absolute left-3.5 top-0 w-0.5 h-4 -translate-y-4 bg-gray-300"></div>}

      <div className="relative flex items-center justify-center flex-shrink-0">
        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${
          isTerminus
            ? "bg-orange-500 text-white shadow-md"
            : "bg-white border-1.5 border-orange-400 text-gray-900"
        }`}>
          {isTerminus ? "🏁" : "•"}
        </div>
      </div>

      <div className="flex-1 pt-0.5">
        <div className="flex items-center justify-between gap-2">
          <h4 className="font-semibold text-xs text-gray-900">{stop.name}</h4>
          <span className="text-xs font-semibold text-gray-500">0{index}:00</span>
        </div>
        {busesAtStop.length > 0 && (
          <div className="flex gap-1.5 mt-1.5">
            {busesAtStop.map((bus) => (
              <div key={bus.id} className="inline-flex items-center px-1.5 py-0.5 rounded-full bg-green-100 text-green-700 text-xs font-bold">
                🚌 {bus.number}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// Bus Card
function BusCard({ bus, isSelected, onSelect }: { bus: (typeof buses)[0]; isSelected: boolean; onSelect: () => void }) {
  const statusColor = getStatusColor(bus.status);
  const stopIndex = stops.findIndex((s) => s.name === bus.nextStop);
  const progress = ((stopIndex + 1) / stops.length) * 100;

  return (
    <div onClick={onSelect} className={`relative border rounded-lg p-2 cursor-pointer transition-all flex flex-col ${
      isSelected ? "border-orange-500 bg-orange-50 shadow-md" : "border-gray-200 bg-white hover:shadow-md"
    }`}>
      <div className="absolute left-0 top-0 w-0.5 h-full rounded-tl-lg rounded-bl-lg" style={{ background: statusColor }}></div>

      <div className="flex items-start justify-between gap-1.5 mb-1.5">
        <div className="flex items-center gap-1">
          <span className="text-sm">🚌</span>
          <div className="min-w-0">
            <h4 className="font-bold text-xs text-gray-900">AM-{bus.number}</h4>
          </div>
        </div>
        <span className="text-xs font-semibold px-1.5 py-0.5 rounded-full flex-shrink-0" style={{ background: `${statusColor}20`, color: statusColor }}>
          {bus.status === "on-time" ? "✓" : bus.status === "delayed" ? "⚠" : "⏹"}
        </span>
      </div>

      <p className="text-xs text-gray-700 mb-0.5 truncate">📍 {bus.nextStop}</p>
      <p className="text-xs text-gray-600 mb-1.5 font-semibold text-orange-600">⏭️ {bus.nextStopEta}m</p>

      <div className="mb-1.5">
        <div className="w-full h-1 bg-gray-200 rounded-full overflow-hidden">
          <div className="h-full bg-orange-500" style={{ width: `${progress}%` }}></div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-1 text-center mb-1.5">
        <div className="bg-blue-50 rounded px-1 py-0.5">
          <p className="text-xs text-gray-600">🚀</p>
          <p className="text-xs font-bold text-blue-600">{bus.speed}km</p>
        </div>
        <div className="bg-purple-50 rounded px-1 py-0.5">
          <p className="text-xs text-gray-600">👥</p>
          <p className="text-xs font-bold text-purple-600">{bus.passengers}</p>
        </div>
      </div>

      <div className="flex gap-1">
        <button className="flex-1 px-1.5 py-0.5 bg-orange-100 hover:bg-orange-200 text-orange-700 font-semibold rounded text-xs">
          📍
        </button>
        <button className="flex-1 px-1.5 py-0.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded text-xs">
          ℹ️
        </button>
      </div>
    </div>
  );
}

// Main Component
export function BusTrackingTimeline() {
  const [selectedRoute, setSelectedRoute] = useState<string | null>(null);
  const [selectedBus, setSelectedBus] = useState<string | null>(null);
  const [filterTab, setFilterTab] = useState<BusFilterTab>("all");
  const [refreshCountdown, setRefreshCountdown] = useState(30);

  const routeStops = selectedRoute ? stops : [];
  const routeBuses = selectedRoute ? buses.filter((b) => b.routeId === selectedRoute) : [];

  const filteredBuses = routeBuses.filter((bus) => {
    if (filterTab === "all") return true;
    if (filterTab === "on-time") return bus.status === "on-time";
    if (filterTab === "delayed") return bus.status === "delayed";
    if (filterTab === "at-stop") return bus.status === "at-stop";
    return true;
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setRefreshCountdown((prev) => (prev > 0 ? prev - 1 : 30));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  if (!selectedRoute) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 p-4">
        <div className="max-w-6xl mx-auto">
          <div className="mb-6">
            <h1 className="text-2xl font-black text-gray-900 mb-1">Select a Route</h1>
            <p className="text-xs text-gray-600">Live bus positions updated every 30 seconds</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {routes.map((route) => (
              <RouteCard key={route.id} route={route} onSelect={() => setSelectedRoute(route.id)} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  const currentRoute = routes.find((r) => r.id === selectedRoute);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      <div className="sticky top-0 bg-white/80 backdrop-blur-md border-b border-gray-200/50 shadow-sm z-10">
        <div className="px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => setSelectedRoute(null)} className="text-gray-600 hover:text-gray-900 text-xl p-1">
              ←
            </button>
            <div className="min-w-0">
              <h2 className="text-sm font-bold text-gray-900 truncate">{currentRoute?.name}</h2>
              <div className="flex items-center gap-2 text-xs">
                <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div>
                <span className="font-semibold text-green-600">LIVE</span>
                <span className="text-gray-600">{refreshCountdown}s</span>
              </div>
            </div>
          </div>
          <button className="p-1.5 hover:bg-gray-100 rounded-lg">🔄</button>
        </div>
      </div>

      <div className="flex h-[calc(100vh-60px)] gap-0">
        <div className="w-1/2 md:w-2/5 border-r border-gray-200 overflow-y-auto bg-gray-50/50 p-4">
          <h3 className="text-xs font-bold text-gray-900 mb-4 uppercase">Route Timeline</h3>
          {routeStops.map((stop, index) => (
            <StopNode key={stop.id} stop={stop} index={index} totalStops={routeStops.length} />
          ))}
        </div>

        <div className="w-1/2 md:w-3/5 overflow-y-auto p-4 bg-white">
          <div className="flex gap-1.5 mb-4 overflow-x-auto pb-2">
            {(["all", "on-time", "delayed", "at-stop"] as BusFilterTab[]).map((tab) => {
              const count = tab === "all" ? routeBuses.length : routeBuses.filter((b) => b.status === tab.replace("-", " ")).length;
              return (
                <button
                  key={tab}
                  onClick={() => setFilterTab(tab)}
                  className={`px-3 py-1.5 rounded-full font-semibold text-xs whitespace-nowrap ${
                    filterTab === tab ? "bg-orange-500 text-white shadow-md" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {tab === "all" ? "All" : tab === "on-time" ? "On Time" : tab === "delayed" ? "Delayed" : "At Stop"} ({count})
                </button>
              );
            })}
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5">
            {filteredBuses.length === 0 ? (
              <div className="col-span-full text-center py-8 text-gray-500">
                <p className="text-xs">No buses in this category</p>
              </div>
            ) : (
              filteredBuses.map((bus) => (
                <BusCard
                  key={bus.id}
                  bus={bus}
                  isSelected={selectedBus === bus.id}
                  onSelect={() => setSelectedBus(bus.id)}
                />
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
