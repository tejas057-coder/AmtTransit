<<<<<<< HEAD
import { useEffect, useRef, forwardRef, useImperativeHandle } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { buses as mockBuses, stops as mockStops, routes as mockRoutes } from "@/data/mockData";
=======
import { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { buses, routes } from "@/data/mockData";
>>>>>>> ft-trip

interface LeafletMapProps {
  stops?: any[];
  selectedStop?: any | null;
  onSelectStop?: (stop: any) => void;
  selectedBusId?: string | null;
  onSelectBus?: (id: string) => void;
  showOnly?: "buses" | "stops" | "all";
  center?: [number, number];
  zoom?: number;
  stops?: any[]; // Dynamic stops from Supabase
}

// ─── Rapido-style dark map tile (CartoDB Dark Matter) ───────────────────────
const TILE_URL =
  "https://{s}.basemaps.cartocdn.com/dark_matter/{z}/{x}/{y}{r}.png";
const TILE_ATTR =
  '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>';

// ─── Symbols & Colors ───────────────────────────────────────────────────────
const RAPIDO_ACCENT = "#C8F135"; // Yellow-Green

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

<<<<<<< HEAD
// ─── Stop marker (Rapido Style - Yellow Green) ──────────────────────────────
const stopIcon = (name: string, isSelected = false) => {
  const size = isSelected ? 18 : 12;
  const color = "#C8F135";
  return L.divIcon({
    className: "",
    html: `
      <div style="display: flex; flex-direction: column; align-items: center;">
        <div style="
          width:${size}px;
          height:${size}px;
          background:${color};
          border: 2px solid #000;
          border-radius: 50%;
          box-shadow: 0 0 10px ${color}88;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          transform: scale(${isSelected ? 1.4 : 1});
        "></div>
        <div style="
          margin-top: 4px;
          background: rgba(0,0,0,0.85);
          color: #fff;
          font-size: 10px;
          font-weight: 700;
          padding: 2px 6px;
          border-radius: 4px;
          white-space: nowrap;
          pointer-events: none;
          box-shadow: 0 2px 4px rgba(0,0,0,0.3);
          border: 1px solid rgba(255,255,255,0.1);
        ">${name}</div>
      </div>`,
    iconSize: [120, 40],
    iconAnchor: [60, 6],
=======
// ─── Stop marker (Rapido Style) ──────────────────────────────────────────────
const stopIcon = (stopName: string) => {
  return L.divIcon({
    className: "rapido-stop-icon",
    html: `
      <div style="display: flex; flex-direction: column; align-items: center;">
        <div style="
          width: 14px;
          height: 14px;
          background-color: ${RAPIDO_ACCENT};
          border-radius: 50%;
          border: 3px solid #000;
          box-shadow: 0 0 10px ${RAPIDO_ACCENT}88;
        "></div>
        <div style="
          margin-top: 4px;
          background-color: #000;
          color: ${RAPIDO_ACCENT};
          font-family: 'DM Sans', sans-serif;
          font-weight: 800;
          font-size: 10px;
          padding: 2px 6px;
          border-radius: 4px;
          white-space: nowrap;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        ">${stopName}</div>
      </div>
    `,
    iconSize: [14, 14],
    iconAnchor: [7, 7], // Center of the 14x14 circle
>>>>>>> ft-trip
    popupAnchor: [0, -10],
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

function buildStopPopup(stop: any) {
  return `
    <div style="${popupBase}">
      <div style="display:flex;align-items:center;gap:8px;margin-bottom:8px;">
        <div style="
          width:32px;height:32px;border-radius:50%;
          background: rgba(200, 241, 53, 0.2);
          display:flex;align-items:center;justify-content:center;font-size:16px;
        ">📍</div>
        <div>
          <div style="font-weight:700;font-size:13px;color:#fff;">${stop.name}</div>
          <div style="font-size:11px;color:rgba(255,255,255,0.45);margin-top:1px;">
<<<<<<< HEAD
            ${stop.route}
=======
            Official Stop
>>>>>>> ft-trip
          </div>
        </div>
      </div>
      <div style="height:1px;background:rgba(255,255,255,0.07);margin:8px 0;"></div>
      <div style="font-size:11px;color:rgba(255,255,255,0.55);line-height:1.7;">
<<<<<<< HEAD
=======
        <span>🛣️ Route: ${stop.route}</span><br/>
>>>>>>> ft-trip
        <span>📌 ${stop.lat.toFixed(4)}°N, ${stop.lng.toFixed(4)}°E</span>
      </div>
    </div>`;
}

<<<<<<< HEAD
=======
function buildBusPopup(bus: any) {
  const route = routes.find(
    (r) => r.id === bus.routeId || r.id === bus.routeId.replace("R", "")
  );
  const statusColors = {
    delayed:  { bg: "rgba(239,68,68,0.22)",  text: "#FCA5A5", label: "⚠️ Delayed" },
    "at-stop":{ bg: "rgba(59,130,246,0.22)", text: "#93C5FD", label: "⏹️ At Stop" },
    "on-time":{ bg: "rgba(0,200,83,0.18)",   text: "#6EE7B7", label: "✅ On Time" },
  };
  const sc = statusColors[bus.status as keyof typeof statusColors];

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
    </div>`;
}

>>>>>>> ft-trip
// ─── Component ───────────────────────────────────────────────────────────────
export const LeafletMap = forwardRef<L.Map | null, LeafletMapProps>(({
  stops = [],
  selectedStop,
  onSelectStop,
  selectedBusId,
  onSelectBus,
  showOnly = "all",
<<<<<<< HEAD
  center = [20.9374, 77.7796],
  zoom = 13,
}, ref) => {
  const mapElementRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<L.Map | null>(null);
  const stopMarkersRef = useRef<Map<string, L.Marker>>(new Map());

  // Expose map instance via ref
  useImperativeHandle(ref, () => mapInstance.current!);
=======
  center = [20.9310, 77.7650],
  zoom = 13,
  stops: propStops = [],
}: LeafletMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<L.Map | null>(null);
  const markersRef = useRef<Map<string, L.Marker>>(new Map());
  const adminLayerGroupRef = useRef<L.LayerGroup | null>(null);
>>>>>>> ft-trip

  useEffect(() => {
    if (!mapElementRef.current || mapInstance.current) return;

    const map = L.map(mapElementRef.current, {
      center,
      zoom,
      zoomControl: false,
      attributionControl: true,
    });

    L.tileLayer(TILE_URL, {
      attribution: TILE_ATTR,
      maxZoom: 20,
    }).addTo(map);

    L.control.zoom({ position: "bottomright" }).addTo(map);

<<<<<<< HEAD
    // Global popup styles
=======
>>>>>>> ft-trip
    const style = document.createElement("style");
    style.textContent = `
      .rapido-popup .leaflet-popup-content-wrapper { background:transparent !important; padding:0 !important; border-radius:12px !important; box-shadow:none !important; }
      .rapido-popup .leaflet-popup-content { margin:0 !important; line-height:1.5 !important; }
      .rapido-popup .leaflet-popup-tip-container { display:none !important; }
      .rapido-popup .leaflet-popup-close-button { color:rgba(255,255,255,0.5) !important; font-size:18px !important; top:6px !important; right:8px !important; }
<<<<<<< HEAD
      .leaflet-control-attribution { background:rgba(0,0,0,0.5) !important; color:rgba(255,255,255,0.35) !important; font-size:9px !important; }
      .leaflet-control-zoom a { background:#1e1e2e !important; color:#fff !important; border-color:rgba(255,255,255,0.1) !important; }
    `;
    document.head.appendChild(style);

=======
    `;
    document.head.appendChild(style);

    if (!adminLayerGroupRef.current) {
      adminLayerGroupRef.current = L.layerGroup().addTo(map);
    }

    if (showOnly !== "stops") {
      buses.forEach((bus) => {
        const marker = L.marker([bus.lat, bus.lng], {
          icon: busIcon(bus.status, false),
          zIndexOffset: 1000,
        }).addTo(map);

        markersRef.current.set(bus.id, marker);
        marker.bindPopup(buildBusPopup(bus), { maxWidth: 280, className: "rapido-popup" });
        marker.on("click", () => onSelectBus?.(bus.id));
        marker.on("mouseover", function () { this.openPopup(); });
      });
    }

>>>>>>> ft-trip
    mapInstance.current = map;

    return () => {
      map.remove();
      mapInstance.current = null;
      style.remove();
    };
  }, []);

<<<<<<< HEAD
  // Update stop markers when stops list changes
  useEffect(() => {
    const map = mapInstance.current;
    if (!map) return;

    // Clear old stops
    stopMarkersRef.current.forEach(m => m.remove());
    stopMarkersRef.current.clear();

    if (showOnly !== "buses") {
      stops.forEach(stop => {
        const marker = L.marker([stop.lat, stop.lng], {
          icon: stopIcon(stop.name, selectedStop?.id === stop.id),
        }).addTo(map);

        marker.bindPopup(buildStopPopup(stop), {
          maxWidth: 280,
          className: "rapido-popup",
        });

        marker.on('click', () => onSelectStop?.(stop));
        
        stopMarkersRef.current.set(stop.id, marker);
      });
    }
  }, [stops, showOnly]);

  // Handle selected stop change
  useEffect(() => {
    stopMarkersRef.current.forEach((marker, id) => {
      const stop = stops.find(s => s.id === id);
      if (stop) {
        const isSelected = selectedStop?.id === id;
        marker.setIcon(stopIcon(stop.name, isSelected));
        if (isSelected) {
          marker.openPopup();
        }
      }
    });

    if (selectedStop) {
      mapInstance.current?.flyTo([selectedStop.lat, selectedStop.lng], 16, {
        animate: true,
        duration: 0.8
      });
    }
  }, [selectedStop, stops]);

  return <div ref={mapElementRef} className="w-full h-full" style={{ background: "#0d0d1a" }} />;
});
�──────────
=======
>>>>>>> ft-trip
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
        mapInstance.current.flyTo([bus.lat, bus.lng], 16, { duration: 1.2 });
        setTimeout(() => { markersRef.current.get(selectedBusId)?.openPopup(); }, 1300);
      }
    }
  }, [selectedBusId]);

  useEffect(() => {
    if (!mapInstance.current || !adminLayerGroupRef.current) return;
    const layerGrp = adminLayerGroupRef.current;
    layerGrp.clearLayers();

    if (showOnly !== "buses" && propStops && propStops.length > 0) {
      propStops.forEach((stop) => {
        const marker = L.marker([stop.lat, stop.lng], { icon: stopIcon(stop.name) }).addTo(layerGrp);
        marker.bindPopup(buildStopPopup(stop), { maxWidth: 280, className: "rapido-popup" });
        marker.on("mouseover", function () { this.openPopup(); });
      });
    }
  }, [propStops, showOnly]);

  return <div ref={mapRef} className="w-full h-full" style={{ background: "#0d0d1a" }} />;
}