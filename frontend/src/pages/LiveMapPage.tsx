import { useState, useRef, useEffect } from "react";
import { ChevronLeft, SlidersHorizontal, Navigation2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { buses, stops, routes } from "@/data/mockData";

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
  const [selectedBus, setSelectedBus] = useState<SelectedBus | null>(null);
  const [bottomSheetHeight, setBottomSheetHeight] = useState(120);
  const [isDragging, setIsDragging] = useState(false);
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
    };
  }, []);

  // Add bus markers
  useEffect(() => {
    if (!mapRef.current) return;

    buses.forEach((bus) => {
      const marker = L.marker([bus.lat, bus.lng], {
        icon: BusMarkerIcon(bus.number.split("-")[1] || "12"),
      }).addTo(mapRef.current!);

      marker.on("click", () => {
        setSelectedBus({
          id: bus.id,
          number: bus.number,
          nextStop: bus.nextStop,
          nextStopEta: bus.nextStopEta,
          routeInfo: `Route R-${bus.number.split("-")[1]} · Amravati Central → VNIT`,
        });
        setBottomSheetHeight(120);
      });

      markersRef.current[bus.id] = marker;
    });

    return () => {
      Object.values(markersRef.current).forEach((marker) => marker.remove());
      markersRef.current = {};
    };
  }, []);

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
          background: "rgba(13, 13, 13, 0.9)",
          backdropFilter: "blur(8px)",
        }}
      >
        {/* Back Button */}
        <button
          onClick={() => navigate("/")}
          className="p-2 hover:bg-muted/50 rounded-lg transition-colors"
        >
          <ChevronLeft className="w-6 h-6 text-foreground" />
        </button>

        {/* Title */}
        <h1 className="text-foreground font-bold text-lg flex-1 text-center">
          Live Tracking
        </h1>

        {/* Filter Button */}
        <button className="p-2 hover:bg-muted/50 rounded-lg transition-colors">
          <SlidersHorizontal className="w-5 h-5 text-foreground" />
        </button>
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

                {/* Next Stops List */}
                <div className="space-y-3 mb-4">
                  <h3 className="text-foreground font-bold text-sm">Next Stops</h3>

                  {/* Stop 1 */}
                  <div className="bg-muted/20 rounded-[12px] p-3">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-foreground font-medium text-sm">
                        {selectedBus.nextStop}
                      </span>
                      <span className="text-primary font-bold text-sm">
                        {selectedBus.nextStopEta} min
                      </span>
                    </div>
                    <span className="text-muted-foreground text-xs">2.4 km away</span>
                  </div>

                  {/* Stop 2 */}
                  <div className="bg-muted/20 rounded-[12px] p-3">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-foreground font-medium text-sm">
                        Rajapeth Chowk
                      </span>
                      <span className="text-primary font-bold text-sm">
                        {selectedBus.nextStopEta + 5} min
                      </span>
                    </div>
                    <span className="text-muted-foreground text-xs">4.1 km away</span>
                  </div>

                  {/* Stop 3 */}
                  <div className="bg-muted/20 rounded-[12px] p-3">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-foreground font-medium text-sm">
                        VNIT Gate
                      </span>
                      <span className="text-primary font-bold text-sm">
                        {selectedBus.nextStopEta + 12} min
                      </span>
                    </div>
                    <span className="text-muted-foreground text-xs">6.8 km away</span>
                  </div>
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
                  {routes.map((route) => (
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
              Drag up to see {buses.length} active buses
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
