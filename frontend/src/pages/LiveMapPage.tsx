import { useState, useRef, useEffect, useCallback } from "react";
import { ChevronLeft, SlidersHorizontal, Navigation2, LogIn, PlusCircle, Trash2, X, Zap, MapPin, Clock, Star } from "lucide-react";
import { useNavigate } from "react-router-dom";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { supabase } from "@/lib/supabase";

// ─── Dynamic bus icon with pulsing yellow circle ───────────────────────────
const BusMarkerIcon = (routeNumber: string) => {
  return L.divIcon({
    className: "",
    html: `
      <div style="
        position: relative;
        width: 36px;
        height: 36px;
        display: flex;
        align-items: center;
        justify-content: center;
        margin: 0;
        padding: 0;
      ">
        <!-- Pulsing outer ring -->
        <div style="
          position: absolute;
          inset: -6px;
          border-radius: 50%;
          background: rgba(255, 208, 0, 0.3);
          animation: bus-pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        "></div>
        
        <!-- Main circle with route number -->
        <div style="
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: #FFD000;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 14px;
          font-weight: bold;
          color: #000000;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
          position: relative;
          z-index: 1;
        ">
          R-${routeNumber}
        </div>

        <style>
          @keyframes bus-pulse {
            0%, 100% {
              transform: scale(1);
              opacity: 0.7;
            }
            50% {
              transform: scale(1.4);
              opacity: 0;
            }
          }
        </style>
      </div>
    `,
    iconSize: [36, 36],
    iconAnchor: [18, 18],
    popupAnchor: [0, -18],
  });
};

interface SelectedBus {
  id: string;
  number: string;
  nextStop: string;
  nextStopEta: number;
  routeInfo: string;
}

export default function LiveMapPage() {
  const navigate = useNavigate();
  const mapRef = useRef<L.Map | null>(null);
  const markersRef = useRef<{ [key: string]: L.Marker }>({});
  const adminLayerGroupRef = useRef<L.LayerGroup | null>(null);
  const [selectedBus, setSelectedBus] = useState<SelectedBus | null>(null);
  const [adminStops, setAdminStops] = useState<any[]>([]);
  const [apiBuses, setApiBuses] = useState<any[]>([]);
  const [apiRoutes, setApiRoutes] = useState<any[]>([]);
  const [bottomSheetHeight, setBottomSheetHeight] = useState(120);
  const [isDragging, setIsDragging] = useState(false);
  const [token, setToken] = useState<string | null>(localStorage.getItem("at_token"));
  const [user, setUser] = useState<any>(JSON.parse(localStorage.getItem("at_user") || "null"));
  const [newStopCoords, setNewStopCoords] = useState<{lat: number, lng: number} | null>(null);
  const [stopName, setStopName] = useState("");
  const [stopDesc, setStopDesc] = useState("");
  
  const bottomSheetRef = useRef<HTMLDivElement>(null);
  const dragStartY = useRef(0);

  // Initialize map
  useEffect(() => {
    const mapElement = document.getElementById("live-map");
    if (!mapElement || mapRef.current) return;

    // Create map centered on Amravati
    mapRef.current = L.map(mapElement, {
      center: [20.93, 77.76],
      zoom: 14,
      zoomControl: false,
      attributionControl: false,
    });

    // Add dark tile layer
    L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>',
      subdomains: "abcd",
      maxZoom: 20,
    }).addTo(mapRef.current);

    return () => {
      mapRef.current?.remove();
      mapRef.current = null;
      adminLayerGroupRef.current = null;
    };
  }, []);

  // ── Sync Data: Realtime + Initial Fetch ────────────────────────────────
  useEffect(() => {
    const fetchData = async () => {
      try {
        const headers: any = {};
        if (token) headers["Authorization"] = `Bearer ${token}`;
        
        const [stopRes, busRes, routeRes] = await Promise.all([
          fetch("http://localhost:5000/api/stops", { headers }),
          fetch("http://localhost:5000/api/buses", { headers }),
          fetch("http://localhost:5000/api/routes", { headers })
        ]);

        const [stopJson, busJson, routeJson] = await Promise.all([
          stopRes.json(), busRes.json(), routeRes.json()
        ]);

        if (stopJson.success) setAdminStops(stopJson.data);
        if (busJson.success) setApiBuses(busJson.data);
        if (routeJson.success) setApiRoutes(routeJson.data);
      } catch (e) {}
    };

    // 1. Initial Fetch
    fetchData();

    // 2. Subscribe to Realtime changes (No more polling!)
    const stopsChannel = supabase
      .channel('schema-db-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'stops' }, () => fetchData())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'buses' }, () => fetchData())
      .subscribe();

    return () => {
      supabase.removeChannel(stopsChannel);
    };
  }, [token]);

  // ── Render Admin Stops ──────────────────────────────────────────────────
  useEffect(() => {
    if (!mapRef.current) return;
    
    // Create layer group if not exists
    if (!adminLayerGroupRef.current) {
      adminLayerGroupRef.current = L.layerGroup().addTo(mapRef.current);
    }
    
    const layerGrp = adminLayerGroupRef.current;
    layerGrp.clearLayers();

    console.log("Rendering Admin Stops:", adminStops.length);
    
    if (adminStops.length > 0) {
      // Filter out invalid coordinates
      const validStops = adminStops.filter(s => s.lat && s.lng);
      
      // 1. Draw route line
      const path: [number, number][] = validStops.map(s => [s.lat, s.lng]);
      if (path.length > 1) {
        L.polyline(path, {
          color: "#D97706",
          weight: 10,
          opacity: 0.12,
        }).addTo(layerGrp);

        L.polyline(path, {
          color: "#FFB347",
          weight: 4,
          opacity: 0.85,
          dashArray: "6, 6",
        }).addTo(layerGrp);
      }

      // 2. Draw stop circles
      adminStops.forEach((stop, index) => {
        const isAdmin = stop.role === "admin";
        const isMine = stop.createdBy === user?.id;
        
        const icon = L.divIcon({
          className: "",
          html: `
            <div style="
              width: 16px;
              height: 16px;
              background: ${isAdmin ? "#EF4444" : "#3B82F6"};
              border: 3px solid #1a1a1a;
              border-radius: 50%;
              box-shadow: 0 0 10px ${isAdmin ? "rgba(239,68,68,0.5)" : "rgba(59,130,246,0.5)"};
            "></div>
          `,
          iconSize: [16, 16],
          iconAnchor: [8, 8],
        });

        const marker = L.marker([stop.latitude || stop.lat, stop.longitude || stop.lng], { icon }).addTo(layerGrp);
        
        marker.bindPopup(`
          <div style="background:#1a1a2e; color:#fff; padding:12px; border-radius:12px; font-size:12px; min-width:150px;">
            <div style="font-weight:bold; font-size:14px; color:${isAdmin ? "#FCA5A5" : "#93C5FD"}; mb:4px;">
              ${stop.name}
            </div>
            ${stop.description ? `<div style="color:rgba(255,255,255,0.6); margin-bottom:8px;">${stop.description}</div>` : ""}
            <div style="font-size:10px; opacity:0.5; margin-top:8px;">
              Created by: ${isAdmin ? "Official" : "User"}
            </div>
          </div>
        `, { className: "rapido-popup" });
      });
    }
  }, [adminStops, user]);

  // Handle map clicks for stop creation
  useEffect(() => {
    if (!mapRef.current) return;
    
    const onMapClick = (e: L.LeafletMouseEvent) => {
      if (!token) {
        alert("Please login first to create stops.");
        return;
      }
      setNewStopCoords({ lat: e.latlng.lat, lng: e.latlng.lng });
    };

    mapRef.current.on("click", onMapClick);
    return () => { mapRef.current?.off("click", onMapClick); };
  }, [token]);

  const saveNewStop = async () => {
    if (!newStopCoords || !token) return;
    try {
      const res = await fetch("http://localhost:5000/api/stops", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          name: stopName,
          description: stopDesc,
          latitude: newStopCoords.lat,
          longitude: newStopCoords.lng
        })
      });
      if (res.ok) {
        setNewStopCoords(null);
        setStopName("");
        setStopDesc("");
        // stops will auto-refresh via polling
      }
    } catch (e) {
      alert("Failed to save stop.");
    }
  };

  // Add bus markers
  useEffect(() => {
    if (!mapRef.current) return;

    // Clear old bus markers
    Object.values(markersRef.current).forEach(m => m.remove());
    markersRef.current = {};

    apiBuses.forEach((bus) => {
      const marker = L.marker([bus.latitude || bus.lat, bus.longitude || bus.lng], {
        icon: BusMarkerIcon(bus.number?.toString() || "12"),
      }).addTo(mapRef.current!);

      marker.on("click", () => {
        setSelectedBus({
          id: bus.id,
          number: bus.number?.toString(),
          nextStop: bus.nextStop,
          nextStopEta: bus.nextStopEta,
          routeInfo: `Real-time Bus tracking active`,
        });
        setBottomSheetHeight(120);
      });

      markersRef.current[bus.id] = marker;
    });
  }, [apiBuses]);

  // Handle bottom sheet drag
  const handleDragStart = (e: React.MouseEvent) => {
    setIsDragging(true);
    dragStartY.current = e.clientY;
  };

  const handleDragMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    const delta = dragStartY.current - e.clientY;
    const newHeight = Math.max(120, Math.min(window.innerHeight - 100, 120 + delta));
    setBottomSheetHeight(newHeight);
  };

  const handleDragEnd = () => {
    setIsDragging(false);
    // Snap to peek or full height
    if (bottomSheetHeight < 300) {
      setBottomSheetHeight(120);
    } else if (bottomSheetHeight > window.innerHeight - 200) {
      setBottomSheetHeight(window.innerHeight - 100);
    }
  };

  return (
    <div className="relative w-full h-screen bg-background overflow-hidden">
      {/* FULL-SCREEN MAP */}
      <div
        id="live-map"
        className="absolute inset-0 w-full h-screen"
        style={{ zIndex: 0 }}
      />

      {/* FLOATING TOP BAR */}
      <div
        className="absolute top-0 left-0 right-0 bg-background/80 backdrop-blur-md border-b border-white/8 px-4 py-3 flex items-center justify-between z-10"
        style={{
          borderBottomLeftRadius: "0",
          borderBottomRightRadius: "16px",
          background: "rgba(13, 13, 13, 0.8)",
          backdropFilter: "blur(12px)",
        }}
      >
        <button
          onClick={() => navigate("/")}
          className="p-2 hover:bg-muted/50 rounded-lg transition-colors"
        >
          <ChevronLeft className="w-6 h-6 text-foreground" />
        </button>
        <h1 className="text-foreground font-bold text-lg flex-1 text-center">
          Live Tracking
        </h1>
        <div className="w-10" /> {/* Spacer for symmetry */}
      </div>

      {/* MAP LEGEND CARD - Top Right */}
      <div className="absolute top-20 right-4 bg-card border border-white/8 rounded-[12px] p-3 z-20 space-y-2 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-primary animate-pulse" />
          <span className="text-muted-foreground">Moving</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-danger" />
          <span className="text-muted-foreground">Stopped</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-success" />
          <span className="text-muted-foreground">At Stop</span>
        </div>
      </div>

      {/* MY LOCATION FAB - Bottom Left */}
      <button
        className="absolute bottom-32 left-4 w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center hover:scale-110 transition-transform z-20 shadow-lg"
        style={{ zIndex: 20 }}
      >
        <Navigation2 className="w-5 h-5" />
      </button>

      {/* DRAGGABLE BOTTOM SHEET */}
      <div
        ref={bottomSheetRef}
        onMouseMove={handleDragMove}
        onMouseUp={handleDragEnd}
        onMouseLeave={handleDragEnd}
        className="absolute bottom-0 left-0 right-0 bg-card border-t border-white/8 rounded-t-[24px] transition-all"
        style={{
          height: `${bottomSheetHeight}px`,
          zIndex: 30,
          cursor: isDragging ? "grabbing" : "grab",
        }}
      >
        {/* Drag Handle */}
        <div
          onMouseDown={handleDragStart}
          className="flex justify-center pt-3 pb-4 cursor-grab active:cursor-grabbing"
        >
          <div className="w-10 h-1 bg-white/20 rounded-full" />
        </div>

        {/* Content - Only visible when expanded */}
        {bottomSheetHeight > 150 && (
          <div className="px-4 pb-4 overflow-y-auto" style={{ height: `${bottomSheetHeight - 70}px` }}>
            {selectedBus ? (
              <>
                {/* Route Chip */}
                <div className="bg-primary/20 border border-primary/30 rounded-[12px] px-3 py-2 mb-4 flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-primary animate-pulse" />
                  <span className="text-primary font-medium text-sm">{selectedBus.routeInfo}</span>
                </div>

                  {/* Next Stop (Dynamic) */}
                  <div className="bg-primary/10 border border-primary/20 rounded-[12px] p-4 text-center">
                    <div className="text-muted-foreground text-xs uppercase tracking-widest font-bold mb-1">Next Destination</div>
                    <div className="text-white font-bold text-lg">{selectedBus.nextStop}</div>
                    <div className="text-primary font-black text-2xl mt-1">{selectedBus.nextStopEta} MIN</div>
                  </div>

                {/* Track Button */}
                <button className="w-full bg-primary text-primary-foreground font-bold rounded-[12px] py-3 hover:opacity-90 transition-opacity mt-4">
                  Track This Bus
                </button>
              </>
            ) : (
              <>
                {/* Default State: Active Buses Summary */}
                <div className="text-center mb-4">
                  <h2 className="text-foreground font-bold text-lg">
                    {buses.length} Buses Active Now
                  </h2>
                  <p className="text-muted-foreground text-sm">Tap a bus marker to track</p>
                </div>

                {/* Route Filter Chips */}
                <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
                  {apiRoutes.map((route) => (
                    <button
                      key={route.id}
                      className="flex-shrink-0 bg-card border border-white/10 hover:border-primary/50 rounded-[20px] px-3 py-1.5 text-xs font-medium text-foreground transition-all"
                    >
                      {route.name}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        )}

        {/* Peek Mode Label */}
        {bottomSheetHeight <= 150 && !selectedBus && (
          <div className="px-4 text-center">
            <p className="text-muted-foreground text-sm">
              Drag up to see {apiBuses.length} dynamic buses
            </p>
          </div>
        )}
      </div>

      {/* NEW STOP MODAL */}
      {newStopCoords && (
        <div className="absolute inset-x-0 bottom-4 px-4 z-[100] animate-in slide-in-from-bottom-2 duration-300">
           <div className="bg-[#1a1a2e] border border-white/10 rounded-2xl shadow-2xl p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-white font-bold flex items-center gap-2">
                  <PlusCircle className="text-primary w-5 h-5" />
                  New Location Stop
                </h3>
                <button onClick={() => setNewStopCoords(null)} className="text-white/40"><X /></button>
              </div>
              
              <div className="space-y-4">
                <input 
                  autoFocus
                  className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white placeholder:text-white/20 focus:outline-none focus:border-primary"
                  placeholder="Stop Name (e.g. Near My House)"
                  value={stopName}
                  onChange={e => setStopName(e.target.value)}
                />
                <textarea 
                  className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white placeholder:text-white/20 focus:outline-none focus:border-primary text-sm h-20 resize-none"
                  placeholder="Additional details / description..."
                  value={stopDesc}
                  onChange={e => setStopDesc(e.target.value)}
                />
                <div className="flex items-center gap-3">
                   <button 
                     onClick={saveNewStop}
                     className="flex-1 bg-primary text-black font-extrabold py-3 rounded-xl transition-transform active:scale-95"
                    >
                      Save Global Stop
                   </button>
                   <button 
                     onClick={() => setNewStopCoords(null)}
                     className="px-6 bg-white/5 text-white/60 py-3 rounded-xl"
                    >
                      Cancel
                   </button>
                </div>
                <p className="text-[10px] text-white/30 text-center uppercase tracking-widest font-bold">
                  Pinned at: {newStopCoords.lat.toFixed(6)}, {newStopCoords.lng.toFixed(6)}
                </p>
              </div>
           </div>
        </div>
      )}
    </div>
  );
}

