import { useEffect, useRef, useImperativeHandle, forwardRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

interface Stop {
  id: string;
  stop_name: string;
  stop_code: string;
  zone: string;
  latitude: number;
  longitude: number;
  is_active?: boolean;
  // Legacy compatibility
  name?: string;
  route?: string;
  lat?: number;
  lng?: number;
}

interface LeafletMapProps {
  stops: Stop[];
  selectedStop: Stop | null;
  mapRef: React.MutableRefObject<L.Map | null>;
  showOnly?: "buses" | "stops" | "all";
  center?: [number, number];
  zoom?: number;
  className?: string;
}

const zoneColors: Record<string, string> = {
  'Civil Lines': '#C8F135',
  'Rajapeth': '#7F77DD',
  'Badnera': '#D85A30',
  'Camp': '#378ADD',
  'MIDC': '#FF9F1C',
  'University': '#2EC4B6',
  'Other': '#888888'
};

const getZoneColor = (zone: string) => zoneColors[zone] ?? '#888888';

export const LeafletMap = forwardRef<L.Map | null, LeafletMapProps>(
  ({ stops = [], selectedStop, mapRef, center = [20.9374, 77.7796], zoom = 13, className }, ref) => {
    const mapContainerRef = useRef<HTMLDivElement>(null);
    const markersLayerRef = useRef<L.LayerGroup | null>(null);
    const markersMap = useRef<Map<string, L.Marker>>(new Map());

    // Expose map instance via both ref and mapRef prop
    useImperativeHandle(ref, () => mapRef.current);

    // Initialize Map
    useEffect(() => {
      if (!mapContainerRef.current || mapRef.current) return;

      mapRef.current = L.map(mapContainerRef.current, {
        center,
        zoom,
        zoomControl: false,
        attributionControl: false,
      });

      L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>'
      }).addTo(mapRef.current);

      markersLayerRef.current = L.layerGroup().addTo(mapRef.current);

      // Add custom styles for popups
      const style = document.createElement('style');
      style.id = 'leaflet-custom-styles';
      style.innerHTML = `
        .leaflet-popup-content-wrapper {
          background: #1A1A1A !important;
          color: white !important;
          border-radius: 12px !important;
          border: 1px solid #2A2A2A !important;
          padding: 0 !important;
        }
        .leaflet-popup-content {
          margin: 0 !important;
          padding: 12px !important;
          width: auto !important;
          min-width: 180px !important;
        }
        .leaflet-popup-tip {
          background: #1A1A1A !important;
          border: 1px solid #2A2A2A !important;
        }
      `;
      document.head.appendChild(style);

      return () => {
        mapRef.current?.remove();
        mapRef.current = null;
        const styleEl = document.getElementById('leaflet-custom-styles');
        if (styleEl) document.head.removeChild(styleEl);
      };
    }, []);

    // Render Markers
    useEffect(() => {
      if (!mapRef.current || !markersLayerRef.current) return;

      markersLayerRef.current.clearLayers();
      markersMap.current.clear();

      stops.forEach((stop) => {
        const stopName = stop.stop_name || stop.name || 'Unknown Stop';
        const zone = stop.zone || stop.route || 'Other';
        const zoneColor = getZoneColor(zone);
        
        const icon = L.divIcon({
          className: '',
          html: `<div style="
            background:${zoneColor};
            width:12px;height:12px;
            border-radius:50%;
            border:2px solid #0F0F0F;
            box-shadow:0 0 0 2px ${zoneColor};
          "></div>
          <div style="
            color:#fff;font-size:10px;
            margin-top:4px;white-space:nowrap;
            font-family:'DM Sans',sans-serif;
            text-shadow:0 1px 2px rgba(0,0,0,0.8);
          ">${stopName}</div>`,
          iconAnchor: [6, 6]
        });

        const lat = stop.latitude ?? (stop as any).lat;
        const lng = stop.longitude ?? (stop as any).lng;

        if (lat === undefined || lng === undefined) return;

        const marker = L.marker([lat, lng], { icon })
          .addTo(markersLayerRef.current!)
          .bindPopup(`
            <div style="font-family:'DM Sans',sans-serif;">
              <div style="font-weight:700; font-size:14px; color:#fff; margin-bottom:4px;">${stopName}</div>
              <div style="display:flex; align-items:center; gap:6px;">
                <div style="font-size:11px; color:#888;">${zone} • ${stop.stop_code}</div>
                <div style="
                  background:${zoneColor};
                  width:8px; height:8px; border-radius:50%;
                "></div>
              </div>
            </div>
          `, { closeButton: false });

        markersMap.current.set(stop.id, marker);
      });
    }, [stops]);

    // Handle selection and flyTo
    useEffect(() => {
      if (!mapRef.current || !selectedStop) return;

      const lat = selectedStop.latitude || (selectedStop as any).lat;
      const lng = selectedStop.longitude || (selectedStop as any).lng;

      if (lat !== undefined && lng !== undefined) {
        mapRef.current.flyTo([lat, lng], 16, { animate: true, duration: 0.8 });
        
        // Open popup after a short delay to ensure flyTo started
        setTimeout(() => {
          markersMap.current.get(selectedStop.id)?.openPopup();
        }, 300);
      }
    }, [selectedStop]);

    return (
      <div 
        ref={mapContainerRef} 
        className={`w-full h-full ${className}`}
      />
    );
  }
);

export default LeafletMap;
