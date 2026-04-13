import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { buses, stops, routes } from "@/data/mockData";

interface LeafletMapProps {
  selectedBusId?: string | null;
  onSelectBus?: (id: string) => void;
  showOnly?: 'buses' | 'stops' | 'all';
  center?: [number, number];
  zoom?: number;
}

const busIcon = (status: string) => L.divIcon({
  className: 'custom-bus-marker',
  html: `<div style="
    width:32px;height:32px;border-radius:50%;
    background:${status === 'delayed' ? '#D97706' : status === 'at-stop' ? '#2563EB' : '#16A34A'};
    display:flex;align-items:center;justify-content:center;
    color:white;font-size:14px;font-weight:700;
    box-shadow:0 2px 8px rgba(0,0,0,0.3);
    border:2px solid white;
  ">🚌</div>`,
  iconSize: [32, 32],
  iconAnchor: [16, 16],
});

const stopIcon = L.divIcon({
  className: 'custom-stop-marker',
  html: `<div style="
    width:20px;height:20px;border-radius:50%;
    background:#F97316;border:2px solid white;
    box-shadow:0 1px 4px rgba(0,0,0,0.3);
  "></div>`,
  iconSize: [20, 20],
  iconAnchor: [10, 10],
});

export function LeafletMap({ selectedBusId, onSelectBus, showOnly = 'all', center = [20.9320, 77.7523], zoom = 13 }: LeafletMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!mapRef.current || mapInstance.current) return;

    const map = L.map(mapRef.current, {
      center,
      zoom,
      zoomControl: false,
    });

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '© OpenStreetMap contributors',
    }).addTo(map);

    L.control.zoom({ position: 'topright' }).addTo(map);

    // Add stops
    if (showOnly !== 'buses') {
      stops.forEach(stop => {
        const marker = L.marker([stop.lat, stop.lng], { icon: stopIcon }).addTo(map);
        const routeNames = stop.routes.map(rId => {
          const r = routes.find(r => r.id === rId);
          return r ? r.name : `Route ${rId}`;
        }).join(', ');
        marker.bindPopup(`
          <div style="font-family:Inter,sans-serif;min-width:160px">
            <strong style="font-size:13px">📍 ${stop.name}</strong><br/>
            <span style="font-size:11px;color:#64748b">Routes: ${routeNames}</span>
          </div>
        `);
      });
    }

    // Add buses
    if (showOnly !== 'stops') {
      buses.forEach(bus => {
        const marker = L.marker([bus.lat, bus.lng], { icon: busIcon(bus.status) }).addTo(map);
        const route = routes.find(r => r.id === bus.routeId);
        marker.bindPopup(`
          <div style="font-family:Inter,sans-serif;min-width:180px">
            <strong style="font-size:13px">🚌 Bus #${bus.number}</strong><br/>
            <span style="font-size:11px;color:#64748b">${route?.from} → ${route?.to}</span><br/>
            <span style="font-size:11px">Next: ${bus.nextStop} (${bus.nextStopEta} min)</span><br/>
            <span style="font-size:11px">${bus.speed} km/h • ${bus.passengers} passengers</span>
          </div>
        `);
        marker.on('click', () => onSelectBus?.(bus.id));
      });
    }

    mapInstance.current = map;

    return () => {
      map.remove();
      mapInstance.current = null;
    };
  }, []);

  useEffect(() => {
    if (!mapInstance.current || !selectedBusId) return;
    const bus = buses.find(b => b.id === selectedBusId);
    if (bus) {
      mapInstance.current.flyTo([bus.lat, bus.lng], 15, { duration: 0.8 });
    }
  }, [selectedBusId]);

  return <div ref={mapRef} className="w-full h-full" />;
}
