import { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { buses, stops, routes } from "@/data/mockData";

interface LeafletMapProps {
  selectedBusId?: string | null;
  onSelectBus?: (id: string) => void;
  showOnly?: "buses" | "stops" | "all";
  center?: [number, number];
  zoom?: number;
}

// ─── Rapido-style dark map tile (CartoDB Dark Matter) ───────────────────────
const TILE_URL =
  "https://{s}.basemaps.cartocdn.com/dark_matter/{z}/{x}/{y}{r}.png";
const TILE_ATTR =
  '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>';

// ─── Bus marker ─────────────────────────────────────────────────────────────
const busIcon = (status: string, isSelected = false) => {
  const size = isSelected ? 52 : 42;
  const bg =
    status === "delayed"
      ? "#EF4444"
      : status === "at-stop"
      ? "#3B82F6"
      : "#00C853";
  const glow =
    status === "delayed"
      ? "rgba(239,68,68,0.45)"
      : status === "at-stop"
      ? "rgba(59,130,246,0.45)"
      : "rgba(0,200,83,0.45)";

  return L.divIcon({
    className: "",
    html: `
      <div style="
        position:relative;
        width:${size}px;
        height:${size}px;
        display:flex;
        align-items:center;
        justify-content:center;
        margin:0;
        padding:0;
      ">
        ${
          isSelected
            ? `<div style="
            position:absolute;
            inset:-8px;
            border-radius:50%;
            background:${glow};
            animation:rapido-pulse 1.4s ease-in-out infinite;
          "></div>`
            : ""
        }
        <div style="
          width:${size}px;
          height:${size}px;
          border-radius:50%;
          background:${bg};
          display:flex;
          align-items:center;
          justify-content:center;
          font-size:${isSelected ? "22px" : "18px"};
          box-shadow:0 0 0 3px rgba(255,255,255,0.9),
                     0 4px 16px rgba(0,0,0,0.5),
                     0 0 20px ${glow};
          position:relative;
          z-index:1;
          transition:all 0.25s ease;
          margin:0;
          padding:0;
        ">🚌</div>
        <style>
          @keyframes rapido-pulse {
            0%,100% { transform:scale(1); opacity:0.7; }
            50%      { transform:scale(1.45); opacity:0; }
          }
        </style>
      </div>`,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
    popupAnchor: [0, -(size / 2 + 8)],
  });
};

// ─── Stop marker ─────────────────────────────────────────────────────────────
const stopIcon = (isTerminus = false) => {
  const size = isTerminus ? 20 : 14;
  const halfSize = size / 2;
  return L.divIcon({
    className: "",
    html: `<div style="
      position:absolute;
      top:50%;
      left:50%;
      transform:translate(-50%, -50%);
      width:${size}px;
      height:${size}px;
      border-radius:50%;
      background:${isTerminus ? "#FF6B35" : "#FFB347"};
      border:${isTerminus ? "3px" : "2.5px"} solid rgba(255,255,255,0.95);
      box-shadow:0 0 8px ${isTerminus ? "rgba(255,107,53,0.7)" : "rgba(255,179,71,0.5)"},
                 0 2px 6px rgba(0,0,0,0.4);
      transition:all 0.2s ease;
      margin:0;
      padding:0;
    "></div>`,
    iconSize: [size, size],
    iconAnchor: [halfSize, halfSize],
    popupAnchor: [0, isTerminus ? -14 : -10],
  });
};

// ─── Popup HTML ──────────────────────────────────────────────────────────────
const popupBase = `
  font-family:'DM Sans',system-ui,sans-serif;
  background:#1a1a2e;
  color:#e8e8f0;
  border-radius:12px;
  padding:14px 16px;
  min-width:210px;
  border:1px solid rgba(255,255,255,0.08);
  box-shadow:0 8px 32px rgba(0,0,0,0.6);
`;

function buildStopPopup(stop: (typeof stops)[0], index: number) {
  const routeNames = stop.routes
    .map((rId) => {
      const r = routes.find((r) => r.id === rId || r.id === rId.replace("R", ""));
      return r ? r.name : `Route ${rId}`;
    })
    .join(", ");

  const isTerminus = index === 0 || index === stops.length - 1;

  return `
    <div style="${popupBase}">
      <div style="display:flex;align-items:center;gap:8px;margin-bottom:8px;">
        <div style="
          width:32px;height:32px;border-radius:50%;
          background:${isTerminus ? "rgba(255,107,53,0.25)" : "rgba(255,179,71,0.18)"};
          display:flex;align-items:center;justify-content:center;font-size:16px;
        ">${isTerminus ? "🏁" : "📍"}</div>
        <div>
          <div style="font-weight:700;font-size:13px;color:#fff;">${stop.name}</div>
          <div style="font-size:11px;color:rgba(255,255,255,0.45);margin-top:1px;">
            Stop ${index + 1} of ${stops.length}
          </div>
        </div>
      </div>
      <div style="height:1px;background:rgba(255,255,255,0.07);margin:8px 0;"></div>
      <div style="font-size:11px;color:rgba(255,255,255,0.55);line-height:1.7;">
        <span>🛣️ ${routeNames}</span><br/>
        <span>📌 ${stop.lat.toFixed(4)}°N, ${stop.lng.toFixed(4)}°E</span>
      </div>
    </div>`;
}

function buildBusPopup(bus: (typeof buses)[0]) {
  const route = routes.find(
    (r) => r.id === bus.routeId || r.id === bus.routeId.replace("R", "")
  );
  const statusColors = {
    delayed:  { bg: "rgba(239,68,68,0.22)",  text: "#FCA5A5", label: "⚠️ Delayed" },
    "at-stop":{ bg: "rgba(59,130,246,0.22)", text: "#93C5FD", label: "⏹️ At Stop" },
    "on-time":{ bg: "rgba(0,200,83,0.18)",   text: "#6EE7B7", label: "✅ On Time" },
  };
  const sc = statusColors[bus.status];

  return `
    <div style="${popupBase}">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;">
        <div style="display:flex;align-items:center;gap:8px;">
          <div style="
            width:36px;height:36px;border-radius:10px;
            background:rgba(255,255,255,0.07);
            display:flex;align-items:center;justify-content:center;font-size:20px;
          ">🚌</div>
          <div>
            <div style="font-weight:800;font-size:14px;color:#fff;">Bus #${bus.number}</div>
            <div style="font-size:11px;color:rgba(255,255,255,0.4);">ID: ${bus.id}</div>
          </div>
        </div>
        <span style="
          background:${sc.bg};color:${sc.text};
          padding:3px 10px;border-radius:20px;font-size:11px;font-weight:600;
        ">${sc.label}</span>
      </div>

      <div style="height:1px;background:rgba(255,255,255,0.07);margin:8px 0;"></div>

      <div style="font-size:12px;color:rgba(255,255,255,0.65);line-height:1.8;">
        ${route ? `<div>🗺️ <strong style="color:#fff;">${route.from}</strong> → <strong style="color:#fff;">${route.to}</strong></div>` : ""}
        <div>⏭️ Next: <strong style="color:#fff;">${bus.nextStop}</strong></div>
        <div>⏱️ ETA: <strong style="color:#fff;">${bus.nextStopEta} min</strong></div>
      </div>

      <div style="
        display:flex;gap:8px;margin-top:10px;
      ">
        <div style="
          flex:1;background:rgba(255,255,255,0.05);border-radius:8px;
          padding:6px 10px;text-align:center;
        ">
          <div style="font-size:10px;color:rgba(255,255,255,0.4);">SPEED</div>
          <div style="font-size:13px;font-weight:700;color:#fff;">${bus.speed} km/h</div>
        </div>
        <div style="
          flex:1;background:rgba(255,255,255,0.05);border-radius:8px;
          padding:6px 10px;text-align:center;
        ">
          <div style="font-size:10px;color:rgba(255,255,255,0.4);">PASSENGERS</div>
          <div style="font-size:13px;font-weight:700;color:#fff;">${bus.passengers}</div>
        </div>
      </div>
    </div>`;
}

// ─── Component ───────────────────────────────────────────────────────────────
export function LeafletMap({
  selectedBusId,
  onSelectBus,
  showOnly = "all",
  // Center between Navsari and Badnera
  center = [20.9310, 77.7650],
  zoom = 13,
}: LeafletMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<L.Map | null>(null);
  const markersRef = useRef<Map<string, L.Marker>>(new Map());
  const adminLayerGroupRef = useRef<L.LayerGroup | null>(null);

  const [adminStops, setAdminStops] = useState<any[]>([]);

  // Fetch admin stops from the REAL database periodically
  useEffect(() => {
    const fetchStops = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/stops");
        const json = await res.json();
        if (json.success && Array.isArray(json.data)) {
          setAdminStops(json.data);
        }
      } catch (e) {
        // Backend not available
      }
    };
    fetchStops();
    const int = setInterval(fetchStops, 2000);
    return () => clearInterval(int);
  }, []);

  useEffect(() => {
    if (!mapRef.current || mapInstance.current) return;

    const map = L.map(mapRef.current, {
      center,
      zoom,
      zoomControl: false,
      attributionControl: true,
    });

    // Dark CartoDB tile layer (Rapido-style)
    L.tileLayer(TILE_URL, {
      attribution: TILE_ATTR,
      subdomains: "abcd",
      maxZoom: 20,
    }).addTo(map);

    // Custom zoom control
    L.control.zoom({ position: "bottomright" }).addTo(map);

    // Inject global popup styles
    const style = document.createElement("style");
    style.textContent = `
      .rapido-popup .leaflet-popup-content-wrapper {
        background:transparent !important;
        padding:0 !important;
        border-radius:12px !important;
        box-shadow:none !important;
      }
      .rapido-popup .leaflet-popup-content {
        margin:0 !important;
        line-height:1.5 !important;
      }
      .rapido-popup .leaflet-popup-tip-container {
        display:none !important;
      }
      .rapido-popup .leaflet-popup-close-button {
        color:rgba(255,255,255,0.5) !important;
        font-size:18px !important;
        top:6px !important;
        right:8px !important;
      }
      .leaflet-control-attribution {
        background:rgba(0,0,0,0.5) !important;
        color:rgba(255,255,255,0.35) !important;
        font-size:9px !important;
      }
      .leaflet-control-attribution a { color:rgba(255,255,255,0.5) !important; }
      .leaflet-control-zoom a {
        background:#1e1e2e !important;
        color:#fff !important;
        border-color:rgba(255,255,255,0.1) !important;
      }
      .leaflet-control-zoom a:hover { background:#2d2d3e !important; }
    `;
    document.head.appendChild(style);

    // ── Admin Plotted Stops (Dynamic) ───────────────────────────────────
    if (!adminLayerGroupRef.current) {
      adminLayerGroupRef.current = L.layerGroup().addTo(map);
    }

    // ── Buses ─────────────────────────────────────────────────────────────
    if (showOnly !== "stops") {
      buses.forEach((bus) => {
        const marker = L.marker([bus.lat, bus.lng], {
          icon: busIcon(bus.status, false),
          zIndexOffset: 1000,
        }).addTo(map);

        markersRef.current.set(bus.id, marker);

        marker.bindPopup(buildBusPopup(bus), {
          maxWidth: 280,
          className: "rapido-popup",
        });

        marker.on("click", () => onSelectBus?.(bus.id));
        marker.on("mouseover", function () { this.openPopup(); });
      });
    }

    mapInstance.current = map;

    return () => {
      map.remove();
      mapInstance.current = null;
      markersRef.current.clear();
      style.remove();
    };
  }, []);

  // ── React to bus selection ───────────────────────────────────────────────
  useEffect(() => {
    if (!mapInstance.current) return;

    markersRef.current.forEach((marker, busId) => {
      const bus = buses.find((b) => b.id === busId);
      if (!bus) return;
      const isSelected = busId === selectedBusId;
      marker.setIcon(busIcon(bus.status, isSelected));
      marker.setZIndexOffset(isSelected ? 2000 : 1000);
    });

    if (selectedBusId) {
      const bus = buses.find((b) => b.id === selectedBusId);
      if (bus) {
        mapInstance.current.flyTo([bus.lat, bus.lng], 16, {
          duration: 1.2,
          easeLinearity: 0.25,
        });
        // Open the popup after flight
        setTimeout(() => {
          markersRef.current.get(selectedBusId)?.openPopup();
        }, 1300);
      }
    }
  }, [selectedBusId]);

  // ── Sync Admin Stops to Map ──────────────────────────────────────────────
  useEffect(() => {
    if (!mapInstance.current || !adminLayerGroupRef.current) return;
    const layerGrp = adminLayerGroupRef.current;
    
    // Clear old stops layers
    layerGrp.clearLayers();

    if (showOnly !== "buses" && adminStops && adminStops.length > 0) {
      // 1. Draw connecting polyline
      const path: [number, number][] = adminStops.map(s => [s.lat, s.lng]);
      if (path.length > 1) {
        L.polyline(path, {
          color: "#D97706", // Custom orange glow
          weight: 10,
          opacity: 0.12,
        }).addTo(layerGrp);

        L.polyline(path, {
          color: "#FFB347", // Vibrant route color
          weight: 4,
          opacity: 0.85,
          dashArray: "6, 6",
          lineCap: "round",
          lineJoin: "round",
        }).addTo(layerGrp);
      }

      // 2. Draw stop pins
      adminStops.forEach((stop, index) => {
        const isTerminus = index === 0 || index === adminStops.length - 1;
        const marker = L.marker([stop.lat, stop.lng], {
          icon: stopIcon(isTerminus),
        }).addTo(layerGrp);

        marker.bindPopup(buildStopPopup(stop, index), {
          maxWidth: 280,
          className: "rapido-popup",
        });

        marker.on("mouseover", function () {
          this.openPopup();
        });
        marker.on("mouseout", function () {
          this.closePopup();
        });
      });
    }
  }, [adminStops, showOnly]);

  return <div ref={mapRef} className="w-full h-full" style={{ background: "#0d0d1a" }} />;
}