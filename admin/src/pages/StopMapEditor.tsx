import React, { useEffect, useMemo, useRef, useState, useCallback } from 'react';
import { MapContainer, Marker, Popup, TileLayer, Tooltip, useMap, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconRetina from 'leaflet/dist/images/marker-icon-2x.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

// Fix Leaflet default marker icon issue in webpack/vite
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: iconRetina,
  iconUrl: icon,
  shadowUrl: iconShadow,
});
import {
  ChevronDown,
  ChevronUp,
  Crosshair,
  Download,
  Filter,
  Layers,
  LocateFixed,
  Maximize2,
  MapPin,
  Pencil,
  Plus,
  Search,
  Sparkles,
  Star,
  Trash2,
  X,
  ZoomIn,
  ZoomOut,
  Clock,
} from 'lucide-react';
import { adminBorders, adminColors, adminSpacing } from '@/lib/adminDesignTokens';

// ─── Types ──────────────────────────────────────────────────────────────────

type Stop = {
  id: string;
  name: string;
  code: string;
  lat: number;
  lng: number;
  routes: string[];
  shelter: boolean;
  notes: string;
  area?: string;
};

type StopFormState = {
  name: string;
  code: string;
  lat: string;
  lng: string;
  routes: string[];
  shelter: boolean;
  notes: string;
  area: string;
};

type NewPin = { lat: number; lng: number } | null;
type SortMode = 'distance' | 'alphabetical';

type MapClickListenerProps = {
  isPlacingMode: boolean;
  onMapClick: (lat: number, lng: number) => void;
};

type MapBinderProps = {
  onBind: (map: L.Map) => void;
};

// ─── Constants ───────────────────────────────────────────────────────────────

const AMRAVATI_CENTER: [number, number] = [20.932, 77.7523];
const DEFAULT_ZOOM = 14;
const ROUTE_OPTIONS = Array.from({ length: 12 }, (_, i) => `R-${String(i + 1).padStart(2, '0')}`);

const SAMPLE_STOPS: Stop[] = [
  {
    id: 'stop-1',
    name: 'Rajapeth Square',
    code: 'AMR-001',
    lat: 20.932,
    lng: 77.7523,
    routes: ['R-01', 'R-04'],
    shelter: true,
    notes: 'Main transit junction near market road',
    area: 'Rajapeth',
  },
  {
    id: 'stop-2',
    name: 'Jaistambh Chowk',
    code: 'AMR-002',
    lat: 20.9335,
    lng: 77.7556,
    routes: ['R-02', 'R-07'],
    shelter: false,
    notes: 'Busy crossing, high evening traffic',
    area: 'Jaistambh',
  },
  {
    id: 'stop-3',
    name: 'Cotton Market',
    code: 'AMR-003',
    lat: 20.928,
    lng: 77.7489,
    routes: ['R-03', 'R-05', 'R-09', 'R-11', 'R-12'],
    shelter: true,
    notes: 'Peak demand during morning trade hours',
    area: 'Cotton Market',
  },
  {
    id: 'stop-4',
    name: 'Irwin Square',
    code: 'AMR-004',
    lat: 20.9298,
    lng: 77.7534,
    routes: ['R-06', 'R-08'],
    shelter: true,
    notes: 'Hospital access point',
    area: 'Civil Lines',
  },
  {
    id: 'stop-5',
    name: 'Sant Gadge Baba Chowk',
    code: 'AMR-005',
    lat: 20.931,
    lng: 77.7501,
    routes: ['R-10', 'R-11', 'R-12'],
    shelter: false,
    notes: 'Pedestrian-heavy zone',
    area: 'Gadge Nagar',
  },
  {
    id: 'stop-6',
    name: 'Badnera Railway Station',
    code: 'AMR-006',
    lat: 20.9048,
    lng: 77.7388,
    routes: ['R-01', 'R-02', 'R-03'],
    shelter: true,
    notes: 'Railway station terminus',
    area: 'Badnera',
  },
  {
    id: 'stop-7',
    name: 'VMV Road',
    code: 'AMR-007',
    lat: 20.9495,
    lng: 77.7826,
    routes: ['R-01'],
    shelter: false,
    notes: 'VMV road bus stop',
    area: 'VMV',
  },
];

const MOCK_ARRIVING_BUSES = [
  { routeNum: 'R-01', destination: 'Badnera Station', eta: 3 },
  { routeNum: 'R-04', destination: 'Bus Stand', eta: 7 },
  { routeNum: 'R-07', destination: 'Navsari', eta: 12 },
];

// ─── Haversine Distance ───────────────────────────────────────────────────────

function haversine(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function formatDist(km: number): string {
  if (km < 1) return `${(km * 1000).toFixed(0)} m`;
  return `${km.toFixed(1)} km`;
}

// ─── Map event helpers ────────────────────────────────────────────────────────

const MapClickListener: React.FC<MapClickListenerProps> = ({ isPlacingMode, onMapClick }) => {
  useMapEvents({
    click(event) {
      if (!isPlacingMode) return;
      onMapClick(event.latlng.lat, event.latlng.lng);
    },
  });
  return null;
};

const MapBinder: React.FC<MapBinderProps> = ({ onBind }) => {
  const map = useMap();
  useEffect(() => {
    onBind(map);
  }, [map, onBind]);
  return null;
};

// ─── Main Component ───────────────────────────────────────────────────────────

const StopMapEditor: React.FC = () => {
  const [stops, setStops] = useState<Stop[]>(SAMPLE_STOPS);
  const [isPlacingMode, setIsPlacingMode] = useState(false);
  const [selectedStop, setSelectedStop] = useState<Stop | null>(null);
  const [newPin, setNewPin] = useState<NewPin>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortMode, setSortMode] = useState<SortMode>('distance');
  const [showRouteDropdown, setShowRouteDropdown] = useState(false);
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [showDownloadMenu, setShowDownloadMenu] = useState(false);
  const [showLabels, setShowLabels] = useState(true);
  const [filterRoute, setFilterRoute] = useState('All Routes');
  const [editingStopId, setEditingStopId] = useState<string | null>(null);
  const [form, setForm] = useState<StopFormState>(createInitialForm());
  const [expandedStopId, setExpandedStopId] = useState<string | null>(null);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [showAddPanel, setShowAddPanel] = useState(false);
  const [filterDropdownRoute, setFilterDropdownRoute] = useState('All Routes');

  const mapRef = useRef<L.Map | null>(null);
  const markerRefs = useRef<Record<string, L.Marker | null>>({});
  const importFileRef = useRef<HTMLInputElement | null>(null);

  // Load favorites from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('admin_favoriteStops');
      if (saved) setFavorites(new Set(JSON.parse(saved)));
    } catch {
      // ignore
    }
  }, []);

  const toggleFavorite = (stopId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = new Set(favorites);
    if (updated.has(stopId)) updated.delete(stopId);
    else updated.add(stopId);
    setFavorites(updated);
    try {
      localStorage.setItem('admin_favoriteStops', JSON.stringify(Array.from(updated)));
    } catch {
      // ignore
    }
  };

  // ─── Icons ────────────────────────────────────────────────────────

  const stopIcon = useMemo(
    () =>
      L.divIcon({
        className: 'stop-marker-wrapper',
        html: '<div class="stop-marker-dark"><span class="stop-marker-dot"></span></div>',
        iconSize: [24, 24],
        iconAnchor: [12, 12],
      }),
    [],
  );

  const selectedStopIcon = useMemo(
    () =>
      L.divIcon({
        className: 'stop-marker-wrapper',
        html: '<div class="stop-marker-selected"><span class="stop-marker-dot-white"></span></div>',
        iconSize: [28, 28],
        iconAnchor: [14, 14],
      }),
    [],
  );

  const tempPinIcon = useMemo(
    () =>
      L.divIcon({
        className: 'temp-pin-wrapper',
        html: '<div class="temp-pin-core"></div><div class="temp-pin-ring"></div>',
        iconSize: [28, 28],
        iconAnchor: [14, 14],
      }),
    [],
  );

  // ─── Filter & Sort ────────────────────────────────────────────────

  const stopsWithDistance = useMemo(
    () =>
      stops.map((s) => ({
        ...s,
        distance: haversine(AMRAVATI_CENTER[0], AMRAVATI_CENTER[1], s.lat, s.lng),
      })),
    [stops],
  );

  const filteredStops = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    let result = stopsWithDistance.filter((stop) => {
      const matchesSearch =
        !term ||
        stop.name.toLowerCase().includes(term) ||
        stop.code.toLowerCase().includes(term) ||
        (stop.area || '').toLowerCase().includes(term) ||
        stop.routes.some((r) => r.toLowerCase().includes(term));
      const routeFilter = filterDropdownRoute === 'All Routes' || stop.routes.includes(filterDropdownRoute);
      return matchesSearch && routeFilter;
    });

    if (sortMode === 'distance') {
      result = result.sort((a, b) => a.distance - b.distance);
    } else {
      result = result.sort((a, b) => a.name.localeCompare(b.name));
    }
    return result;
  }, [stopsWithDistance, searchTerm, sortMode, filterDropdownRoute]);

  const nearestStops = useMemo(() => (!searchTerm ? filteredStops.slice(0, 3) : []), [filteredStops, searchTerm]);
  const otherStops = useMemo(() => (!searchTerm ? filteredStops.slice(3) : filteredStops), [filteredStops, searchTerm]);

  // Form state
  const hasPin = form.lat !== '' && form.lng !== '';
  const isFormVisible = editingStopId !== null || hasPin;

  const bindMap = useCallback((map: L.Map) => {
    mapRef.current = map;
  }, []);

  const generateStopCode = () => {
    const existing = new Set(stops.map((s) => s.code));
    let attempt = stops.length + 1;
    let code = '';
    while (!code || existing.has(code)) {
      code = `AMR-${String(attempt).padStart(3, '0')}`;
      attempt += 1;
    }
    setForm((prev) => ({ ...prev, code }));
  };

  const resetForm = () => {
    setForm(createInitialForm());
    setNewPin(null);
    setEditingStopId(null);
    setShowRouteDropdown(false);
    setShowAddPanel(false);
  };

  const centerOnStop = (stop: Stop & { distance?: number }) => {
    setSelectedStop(stop);
    mapRef.current?.flyTo([stop.lat, stop.lng], 16, { duration: 0.45 });
    markerRefs.current[stop.id]?.openPopup();
  };

  const enterEditMode = (stop: Stop) => {
    setEditingStopId(stop.id);
    setSelectedStop(stop);
    setShowAddPanel(true);
    setForm({
      name: stop.name,
      code: stop.code,
      lat: stop.lat.toFixed(6),
      lng: stop.lng.toFixed(6),
      routes: stop.routes,
      shelter: stop.shelter,
      notes: stop.notes,
      area: stop.area || '',
    });
    setNewPin({ lat: stop.lat, lng: stop.lng });
    mapRef.current?.flyTo([stop.lat, stop.lng], 16, { duration: 0.35 });
  };

  const removeStop = (id: string) => {
    setStops((prev) => prev.filter((s) => s.id !== id));
    if (selectedStop?.id === id) setSelectedStop(null);
    if (editingStopId === id) resetForm();
  };

  const handleMapClick = (lat: number, lng: number) => {
    setNewPin({ lat, lng });
    setForm((prev) => ({ ...prev, lat: lat.toFixed(6), lng: lng.toFixed(6) }));
    setIsPlacingMode(false);
    setShowAddPanel(true);
  };

  const saveStop = () => {
    if (!form.name.trim() || !form.code.trim() || !form.lat || !form.lng) return;

    const payload: Stop = {
      id: editingStopId ?? `stop-${Date.now()}`,
      name: form.name.trim(),
      code: form.code.trim().toUpperCase(),
      lat: Number(form.lat),
      lng: Number(form.lng),
      routes: form.routes,
      shelter: form.shelter,
      notes: form.notes.trim(),
      area: form.area.trim(),
    };

    setStops((prev) => {
      if (!editingStopId) return [...prev, payload];
      return prev.map((stop) => (stop.id === editingStopId ? payload : stop));
    });

    setSelectedStop(payload);
    mapRef.current?.flyTo([payload.lat, payload.lng], 16, { duration: 0.45 });
    resetForm();
  };

  const fitAllStops = () => {
    if (!mapRef.current || stops.length === 0) return;
    const bounds = L.latLngBounds(stops.map((s) => [s.lat, s.lng] as [number, number]));
    mapRef.current.fitBounds(bounds.pad(0.2));
  };

  const exportJson = () => {
    const blob = new Blob([JSON.stringify(stops, null, 2)], { type: 'application/json;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'amravati-stops.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportCsv = () => {
    const header = 'id,name,code,lat,lng,routes,shelter,notes,area';
    const rows = stops.map((stop) => {
      const safe = (v: string) => `"${v.replace(/"/g, '""')}"`;
      return [stop.id, safe(stop.name), stop.code, stop.lat.toFixed(6), stop.lng.toFixed(6),
        safe(stop.routes.join('|')), stop.shelter ? 'true' : 'false', safe(stop.notes), safe(stop.area || '')].join(',');
    });
    const blob = new Blob([[header, ...rows].join('\n')], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'amravati-stops.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  const importCsv = (raw: string) => {
    const lines = raw.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
    if (lines.length < 2) return;
    const imported: Stop[] = [];
    for (let i = 1; i < lines.length; i++) {
      const cols = lines[i].split(/,(?=(?:[^"]*"[^"]*")*[^"]*$)/).map((v) => v.replace(/^"|"$/g, '').replace(/""/g, '"'));
      if (cols.length < 8) continue;
      const lat = Number(cols[3]), lng = Number(cols[4]);
      if (isNaN(lat) || isNaN(lng)) continue;
      imported.push({ id: cols[0] || `imported-${Date.now()}-${i}`, name: cols[1], code: cols[2], lat, lng,
        routes: cols[5] ? cols[5].split('|').map((r) => r.trim()).filter(Boolean) : [],
        shelter: cols[6]?.toLowerCase() === 'true', notes: cols[7] ?? '', area: cols[8] ?? '' });
    }
    if (imported.length > 0) { setStops(imported); setSelectedStop(null); resetForm(); }
  };

  const handleCsvFileSelect: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => { if (typeof reader.result === 'string') importCsv(reader.result); };
    reader.readAsText(file);
    e.currentTarget.value = '';
  };

  // ─── Render ───────────────────────────────────────────────────────

  return (
    <div style={{ position: 'relative', display: 'flex', height: 'calc(100vh - 56px)', backgroundColor: adminColors.background.page, overflow: 'hidden' }}>
      <style>{`
        .leaflet-container { background: #0D0D0D; }
        .placing-mode .leaflet-container,
        .placing-mode .leaflet-interactive { cursor: crosshair !important; }
        .leaflet-popup-content-wrapper {
          background: #1A1A1A; color: #E5E5E5;
          border: 1px solid #2A2A2A; border-radius: 10px;
        }
        .leaflet-popup-tip { background: #1A1A1A; }
        .stop-marker-dark {
          width: 24px; height: 24px; border-radius: 999px;
          background: #1A1A1A; border: 2px solid #FFD000;
          display: flex; align-items: center; justify-content: center;
          box-shadow: 0 0 0 3px rgba(255,208,0,0.15);
        }
        .stop-marker-selected {
          width: 28px; height: 28px; border-radius: 999px;
          background: #FFD000; border: 2px solid #fff;
          display: flex; align-items: center; justify-content: center;
          box-shadow: 0 0 0 4px rgba(255,208,0,0.35), 0 4px 12px rgba(0,0,0,0.4);
        }
        .stop-marker-dot { width: 8px; height: 8px; border-radius: 999px; background: #FFD000; }
        .stop-marker-dot-white { width: 8px; height: 8px; border-radius: 999px; background: #0D0D0D; }
        .temp-pin-wrapper { position: relative; }
        .temp-pin-core {
          width: 14px; height: 14px; border-radius: 999px; background: #FFD000;
          position: absolute; top: 7px; left: 7px; transform: translate(-50%,-50%);
          box-shadow: 0 0 12px rgba(255,208,0,0.8);
        }
        .temp-pin-ring {
          width: 28px; height: 28px; border-radius: 999px;
          border: 2px solid rgba(255,208,0,0.8); animation: pinPulse 1.2s infinite;
        }
        @keyframes pinPulse {
          0% { transform: scale(0.8); opacity: 0.8; }
          100% { transform: scale(1.4); opacity: 0; }
        }
        @keyframes modePulse {
          0%, 100% { transform: scale(1); opacity: 0.6; }
          50% { transform: scale(1.2); opacity: 1; }
        }
        @keyframes nearPulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(34,197,94,0.6); }
          70% { box-shadow: 0 0 0 6px rgba(34,197,94,0); }
        }
        .stops-panel-scroll::-webkit-scrollbar { width: 4px; }
        .stops-panel-scroll::-webkit-scrollbar-track { background: transparent; }
        .stops-panel-scroll::-webkit-scrollbar-thumb { background: #2A2A2A; border-radius: 4px; }
        .stop-card { transition: border-color 180ms ease, background-color 180ms ease; }
        .stop-card:hover { background-color: #1D1D1D !important; border-color: #3A3A3A !important; }
      `}</style>

      {/* ── Left Panel ─────────────────────────────────────────────────────── */}
      <aside style={{ width: '340px', minWidth: '340px', backgroundColor: '#111111', borderRight: '1px solid #2A2A2A',
        display: 'flex', flexDirection: 'column', zIndex: 15, height: '100%' }}>

        {/* Panel Header */}
        <div style={{ padding: '16px', borderBottom: '1px solid #2A2A2A', flexShrink: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <MapPin size={18} color="#FFD000" />
              <h1 style={{ fontSize: '17px', fontWeight: 700, color: '#FFFFFF', margin: 0 }}>Bus Stops</h1>
            </div>
            <div style={{ display: 'flex', gap: '6px' }}>
              <button onClick={() => importFileRef.current?.click()} style={ghostTinyBtn} title="Import CSV">
                Import
              </button>
              <button onClick={exportJson} style={ghostTinyBtn} title="Export JSON">JSON</button>
              <button onClick={exportCsv} style={ghostTinyBtn} title="Export CSV">CSV</button>
              <input ref={importFileRef} type="file" accept=".csv" onChange={handleCsvFileSelect} style={{ display: 'none' }} />
            </div>
          </div>

          {/* Search */}
          <div style={{ position: 'relative' }}>
            <Search size={14} color="#888" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
            <input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search stops, routes, areas..."
              style={{
                width: '100%', height: '42px', borderRadius: '999px',
                border: '1px solid #2A2A2A', backgroundColor: '#1A1A1A',
                color: '#E5E5E5', paddingLeft: '38px', paddingRight: searchTerm ? '36px' : '14px',
                fontSize: '13px', outline: 'none', boxSizing: 'border-box',
              }}
            />
            {searchTerm && (
              <button onClick={() => setSearchTerm('')}
                style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)',
                  border: 'none', background: 'transparent', color: '#888', cursor: 'pointer', display: 'grid', placeItems: 'center' }}>
                <X size={14} />
              </button>
            )}
          </div>
        </div>

        {/* Sort Row */}
        <div style={{ padding: '10px 16px', borderBottom: '1px solid #2A2A2A', flexShrink: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={() => setSortMode('distance')}
              style={{
                height: '30px', padding: '0 12px', borderRadius: '999px', border: 'none',
                fontSize: '12px', fontWeight: 700, cursor: 'pointer',
                backgroundColor: sortMode === 'distance' ? '#FFD000' : '#1A1A1A',
                color: sortMode === 'distance' ? '#0D0D0D' : '#888888',
                outline: sortMode === 'distance' ? 'none' : '1px solid #2A2A2A',
              }}>
              By Distance
            </button>
            <button
              onClick={() => setSortMode('alphabetical')}
              style={{
                height: '30px', padding: '0 12px', borderRadius: '999px', border: 'none',
                fontSize: '12px', fontWeight: 700, cursor: 'pointer',
                backgroundColor: sortMode === 'alphabetical' ? '#FFD000' : '#1A1A1A',
                color: sortMode === 'alphabetical' ? '#0D0D0D' : '#888888',
                outline: sortMode === 'alphabetical' ? 'none' : '1px solid #2A2A2A',
              }}>
              Alphabetical
            </button>
          </div>
          <span style={{ fontSize: '11px', color: '#555', fontWeight: 500 }}>
            {filteredStops.length} stop{filteredStops.length !== 1 ? 's' : ''}
          </span>
        </div>

        {/* Add Stop CTA */}
        <div style={{ padding: '10px 16px', borderBottom: '1px solid #2A2A2A', flexShrink: 0 }}>
          <button
            onClick={() => { setIsPlacingMode(true); setShowAddPanel(true); setEditingStopId(null); setForm(createInitialForm()); }}
            style={{
              width: '100%', height: '40px', borderRadius: '10px', border: 'none',
              backgroundColor: isPlacingMode ? 'rgba(255,208,0,0.18)' : '#FFD000',
              color: isPlacingMode ? '#FFD000' : '#0D0D0D',
              outline: isPlacingMode ? '1px solid #FFD000' : 'none',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
              fontWeight: 700, fontSize: '13px', cursor: 'pointer',
            }}>
            <Crosshair size={15} />
            {isPlacingMode ? 'Placing Mode — Click the map…' : '+ Add New Stop on Map'}
            {isPlacingMode && (
              <span style={{ width: 7, height: 7, borderRadius: 999, backgroundColor: '#FFD000', animation: 'modePulse 1.2s infinite' }} />
            )}
          </button>
        </div>

        {/* Stop List */}
        <div className="stops-panel-scroll" style={{ flex: 1, overflowY: 'auto', padding: '12px 12px' }}>
          {filteredStops.length === 0 ? (
            // Empty state
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px 16px', textAlign: 'center' }}>
              <MapPin size={36} color="#333" style={{ marginBottom: '12px' }} />
              <p style={{ color: '#FFFFFF', fontWeight: 700, fontSize: '14px', margin: '0 0 6px' }}>No stops found</p>
              <p style={{ color: '#555', fontSize: '12px', margin: '0 0 16px' }}>for "{searchTerm}"</p>
              <button onClick={() => setSearchTerm('')} style={{ ...ghostTinyBtn, padding: '0 16px', height: '34px', borderRadius: '8px' }}>
                Clear Search
              </button>
            </div>
          ) : (
            <>
              {/* Nearest Section */}
              {nearestStops.length > 0 && (
                <div style={{ marginBottom: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                    <span style={{ width: 8, height: 8, borderRadius: 999, backgroundColor: '#22C55E',
                      display: 'inline-block', animation: 'nearPulse 1.5s infinite' }} />
                    <span style={{ color: '#FFFFFF', fontWeight: 700, fontSize: '12px' }}>Nearest to centre</span>
                    <span style={{ marginLeft: 'auto', color: '#555', fontSize: '11px' }}>Based on GPS</span>
                  </div>
                  {nearestStops.map((stop) => (
                    <StopCard
                      key={stop.id}
                      stop={stop}
                      isSelected={selectedStop?.id === stop.id}
                      isFavorited={favorites.has(stop.id)}
                      isExpanded={expandedStopId === stop.id}
                      onSelect={() => centerOnStop(stop)}
                      onToggleFavorite={(e) => toggleFavorite(stop.id, e)}
                      onToggleExpand={() => setExpandedStopId(expandedStopId === stop.id ? null : stop.id)}
                      onEdit={() => enterEditMode(stop)}
                      onDelete={() => removeStop(stop.id)}
                    />
                  ))}
                </div>
              )}

              {/* Other / All Stops */}
              {otherStops.length > 0 && (
                <div>
                  {nearestStops.length > 0 && !searchTerm && (
                    <p style={{ color: '#555', fontSize: '11px', fontWeight: 600, marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                      Other stops
                    </p>
                  )}
                  {otherStops.map((stop) => (
                    <StopCard
                      key={stop.id}
                      stop={stop}
                      isSelected={selectedStop?.id === stop.id}
                      isFavorited={favorites.has(stop.id)}
                      isExpanded={expandedStopId === stop.id}
                      onSelect={() => centerOnStop(stop)}
                      onToggleFavorite={(e) => toggleFavorite(stop.id, e)}
                      onToggleExpand={() => setExpandedStopId(expandedStopId === stop.id ? null : stop.id)}
                      onEdit={() => enterEditMode(stop)}
                      onDelete={() => removeStop(stop.id)}
                    />
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </aside>

      {/* ── Map Area ────────────────────────────────────────────────────────── */}
      <main style={{ flex: 1, position: 'relative', height: '100%' }} className={isPlacingMode ? 'placing-mode' : ''}>
        <MapContainer center={AMRAVATI_CENTER} zoom={DEFAULT_ZOOM} zoomControl={false} style={{ width: '100%', height: '100%' }}>
          <MapBinder onBind={bindMap} />
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; CARTO'
            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          />
          <MapClickListener isPlacingMode={isPlacingMode} onMapClick={handleMapClick} />

          {newPin && <Marker position={[newPin.lat, newPin.lng]} icon={tempPinIcon} />}

          {(searchTerm ? filteredStops : stops).map((stop) => (
            <Marker
              key={stop.id}
              position={[stop.lat, stop.lng]}
              icon={selectedStop?.id === stop.id ? selectedStopIcon : stopIcon}
              ref={(ref) => { markerRefs.current[stop.id] = ref; }}
              eventHandlers={{ click: () => setSelectedStop(stop) }}
            >
              {showLabels && (
                <Tooltip direction="top" offset={[0, -16]} opacity={1}>
                  <span style={{ fontSize: '11px', fontWeight: 600 }}>{stop.name}</span>
                </Tooltip>
              )}
              <Popup>
                <div style={{ backgroundColor: '#1A1A1A', color: '#E5E5E5', padding: '2px', minWidth: '220px' }}>
                  <div style={{ fontSize: '14px', fontWeight: 700, color: '#FFFFFF' }}>{stop.name}</div>
                  <div style={{ fontSize: '11px', color: '#888', fontFamily: 'monospace', marginBottom: '6px' }}>{stop.code}</div>
                  {stop.area && <div style={{ fontSize: '11px', color: '#666', marginBottom: '6px' }}>{stop.area}</div>}
                  <div style={{ marginTop: '6px', display: 'flex', flexWrap: 'wrap', gap: '4px', marginBottom: '10px' }}>
                    {stop.routes.map((r) => (
                      <span key={r} style={{ backgroundColor: '#FFD000', color: '#0D0D0D', fontSize: '10px', fontWeight: 700, borderRadius: 4, padding: '2px 6px' }}>{r}</span>
                    ))}
                  </div>
                  <div style={{ display: 'flex', gap: '6px' }}>
                    <button onClick={() => enterEditMode(stop)} style={popupActionBtn}>Edit</button>
                    <button onClick={() => removeStop(stop.id)} style={{ ...popupActionBtn, color: '#FF4444' }}>Delete</button>
                  </div>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>

        {/* ── Map Toolbar ────────────────────────────────────────────────── */}
        <div style={toolbarStyle}>
          <button title="Zoom in" onClick={() => mapRef.current?.zoomIn()} style={iconBtnStyle}><ZoomIn size={16} /></button>
          <button title="Zoom out" onClick={() => mapRef.current?.zoomOut()} style={iconBtnStyle}><ZoomOut size={16} /></button>
          <button title="Centre map" onClick={() => mapRef.current?.flyTo(AMRAVATI_CENTER, DEFAULT_ZOOM, { duration: 0.6 })} style={iconBtnStyle}>
            <LocateFixed size={16} />
          </button>
          <button title="Fit all stops" onClick={fitAllStops} style={iconBtnStyle}><Maximize2 size={16} /></button>
          <div style={{ height: '1px', backgroundColor: '#2A2A2A' }} />
          <div style={{ position: 'relative' }}>
            <button title="Filter by route" onClick={() => { setShowFilterDropdown((p) => !p); setShowDownloadMenu(false); }} style={iconBtnStyle}>
              <Filter size={16} />
            </button>
            {showFilterDropdown && (
              <div style={floatingMenuStyle}>
                <div style={{ fontSize: '11px', color: '#888', marginBottom: '6px' }}>Filter by route</div>
                <select value={filterDropdownRoute} onChange={(e) => setFilterDropdownRoute(e.target.value)} style={floatingSelectStyle}>
                  <option>All Routes</option>
                  {ROUTE_OPTIONS.map((r) => <option key={r}>{r}</option>)}
                </select>
              </div>
            )}
          </div>
          <button title="Toggle labels" onClick={() => setShowLabels((p) => !p)}
            style={{ ...iconBtnStyle, color: showLabels ? '#FFD000' : '#E5E5E5', borderColor: showLabels ? '#FFD00066' : '#2A2A2A' }}>
            <Layers size={16} />
          </button>
          <div style={{ position: 'relative' }}>
            <button title="Export" onClick={() => { setShowDownloadMenu((p) => !p); setShowFilterDropdown(false); }} style={iconBtnStyle}>
              <Download size={16} />
            </button>
            {showDownloadMenu && (
              <div style={{ ...floatingMenuStyle, width: '130px', display: 'grid', gap: '6px' }}>
                <button onClick={exportJson} style={menuBtnStyle}>Export JSON</button>
                <button onClick={exportCsv} style={menuBtnStyle}>Export CSV</button>
              </div>
            )}
          </div>
        </div>

        {/* ── Add / Edit Stop Panel ───────────────────────────────────────── */}
        {showAddPanel && (
          <div style={{
            position: 'absolute', top: '16px', left: '16px', width: '280px',
            backgroundColor: '#111111', border: '1px solid #2A2A2A', borderRadius: '14px',
            boxShadow: '0 8px 32px rgba(0,0,0,0.6)', zIndex: 30, overflow: 'hidden',
          }}>
            <div style={{ padding: '12px 14px', borderBottom: '1px solid #2A2A2A', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ color: '#FFFFFF', fontWeight: 700, fontSize: '14px' }}>
                {editingStopId ? 'Edit Stop' : 'New Stop'}
              </span>
              <button onClick={resetForm} style={{ border: 'none', background: 'transparent', color: '#888', cursor: 'pointer', display: 'grid', placeItems: 'center' }}>
                <X size={16} />
              </button>
            </div>

            <div style={{ padding: '12px 14px', display: 'grid', gap: '10px' }}>
              {!hasPin && !editingStopId && (
                <div style={{ backgroundColor: '#1A1A1A', border: '1px dashed #2A2A2A', borderRadius: '8px', padding: '14px 10px', textAlign: 'center' }}>
                  <Crosshair size={18} color="#FFD000" style={{ marginBottom: '6px' }} />
                  <p style={{ color: '#888', fontSize: '12px', margin: 0 }}>Click on the map to place the stop pin</p>
                </div>
              )}

              {isFormVisible && (
                <>
                  <div>
                    <label style={fieldLabel}>Stop Name *</label>
                    <input value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                      placeholder="e.g. Rajapeth Square" style={fieldInput} />
                  </div>
                  <div>
                    <label style={fieldLabel}>Area / Locality</label>
                    <input value={form.area} onChange={(e) => setForm((p) => ({ ...p, area: e.target.value }))}
                      placeholder="e.g. Rajapeth" style={fieldInput} />
                  </div>
                  <div>
                    <label style={fieldLabel}>Stop Code *</label>
                    <div style={{ display: 'flex', gap: '6px' }}>
                      <input value={form.code} onChange={(e) => setForm((p) => ({ ...p, code: e.target.value }))}
                        placeholder="e.g. AMR-042" style={{ ...fieldInput, flex: 1 }} />
                      <button onClick={generateStopCode} title="Auto-generate code"
                        style={{ width: '36px', height: '36px', borderRadius: '8px', border: '1px solid #2A2A2A', backgroundColor: '#1A1A1A', color: '#FFD000', cursor: 'pointer', display: 'grid', placeItems: 'center' }}>
                        <Sparkles size={14} />
                      </button>
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' }}>
                    <div>
                      <label style={fieldLabel}>Latitude</label>
                      <input value={form.lat} readOnly style={readonlyInput} />
                    </div>
                    <div>
                      <label style={fieldLabel}>Longitude</label>
                      <input value={form.lng} readOnly style={readonlyInput} />
                    </div>
                  </div>

                  {/* Route Tags */}
                  <div>
                    <label style={fieldLabel}>Route Tags</label>
                    <div style={{ position: 'relative' }}>
                      <button onClick={() => setShowRouteDropdown((p) => !p)} style={dropdownToggle}>
                        <span>{form.routes.length > 0 ? `${form.routes.length} selected` : 'Add routes…'}</span>
                        <ChevronDown size={13} />
                      </button>
                      {showRouteDropdown && (
                        <div style={routeDropdown}>
                          {ROUTE_OPTIONS.map((r) => {
                            const sel = form.routes.includes(r);
                            return (
                              <button key={r} onClick={() => setForm((p) => ({
                                ...p, routes: sel ? p.routes.filter((x) => x !== r) : [...p.routes, r]
                              }))}
                                style={{ width: '100%', border: 'none', background: sel ? 'rgba(255,208,0,0.16)' : 'transparent',
                                  color: sel ? '#FFD000' : '#E5E5E5', textAlign: 'left', padding: '7px 8px',
                                  borderRadius: '6px', cursor: 'pointer', fontSize: '12px' }}>
                                {r}
                              </button>
                            );
                          })}
                        </div>
                      )}
                      {form.routes.length > 0 && (
                        <div style={{ marginTop: '6px', display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
                          {form.routes.map((r) => (
                            <span key={r} style={{ backgroundColor: '#FFD000', color: '#0D0D0D', padding: '2px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: 700 }}>{r}</span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Shelter Toggle */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ color: '#E5E5E5', fontSize: '12px' }}>Shelter Available</span>
                    <button onClick={() => setForm((p) => ({ ...p, shelter: !p.shelter }))}
                      style={{ width: '42px', height: '22px', borderRadius: 999, border: '1px solid #2A2A2A',
                        backgroundColor: form.shelter ? '#FFD000' : '#1A1A1A', position: 'relative', cursor: 'pointer' }}>
                      <span style={{ position: 'absolute', top: '2px', left: form.shelter ? '21px' : '2px',
                        width: '16px', height: '16px', borderRadius: 999,
                        backgroundColor: form.shelter ? '#0D0D0D' : '#555', transition: 'left 160ms ease' }} />
                    </button>
                  </div>

                  {/* Notes */}
                  <div>
                    <label style={fieldLabel}>Landmark / Notes</label>
                    <textarea value={form.notes} onChange={(e) => setForm((p) => ({ ...p, notes: e.target.value }))}
                      rows={2} placeholder="Landmark or notes..."
                      style={{ ...fieldInput, padding: '8px 10px', resize: 'vertical', minHeight: '60px', height: 'auto' }} />
                  </div>

                  <button onClick={saveStop} disabled={!form.name.trim() || !form.code.trim() || !hasPin}
                    style={{ height: '38px', border: 'none', borderRadius: '9px', backgroundColor: '#FFD000', color: '#0D0D0D',
                      fontWeight: 700, fontSize: '13px', cursor: (!form.name.trim() || !form.code.trim() || !hasPin) ? 'not-allowed' : 'pointer',
                      opacity: (!form.name.trim() || !form.code.trim() || !hasPin) ? 0.5 : 1 }}>
                    {editingStopId ? 'Update Stop' : 'Save Stop'}
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

// ─── Stop Card ───────────────────────────────────────────────────────────────

interface StopCardProps {
  stop: Stop & { distance: number };
  isSelected: boolean;
  isFavorited: boolean;
  isExpanded: boolean;
  onSelect: () => void;
  onToggleFavorite: (e: React.MouseEvent) => void;
  onToggleExpand: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

function StopCard({ stop, isSelected, isFavorited, isExpanded, onSelect, onToggleFavorite, onToggleExpand, onEdit, onDelete }: StopCardProps) {
  const displayedRoutes = stop.routes.slice(0, 3);
  const moreCount = Math.max(0, stop.routes.length - 3);

  return (
    <div
      className="stop-card"
      style={{
        backgroundColor: isSelected ? '#1D1D1D' : '#151515',
        border: `1px solid ${isSelected ? '#FFD00055' : '#2A2A2A'}`,
        borderRadius: '16px', overflow: 'hidden', marginBottom: '8px', cursor: 'pointer',
      }}
      onClick={() => { onSelect(); onToggleExpand(); }}>

      {/* Card Body */}
      <div style={{ padding: '12px 14px' }}>
        {/* Top Row: Name + Star */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '8px' }}>
          <p style={{ color: '#FFFFFF', fontWeight: 700, fontSize: '14px', margin: 0, flex: 1, lineHeight: 1.3 }}>{stop.name}</p>
          <button onClick={onToggleFavorite} style={{ border: 'none', background: 'transparent', cursor: 'pointer', padding: '2px', display: 'grid', placeItems: 'center', flexShrink: 0, marginLeft: '6px' }}>
            <Star size={15} fill={isFavorited ? '#FFD000' : 'none'} color={isFavorited ? '#FFD000' : '#444'} style={{ transition: 'all 150ms' }} />
          </button>
        </div>

        {/* Middle Row: Area + Distance */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '9px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <MapPin size={12} color="#555" />
            <span style={{ color: '#666', fontSize: '11px' }}>{stop.area || stop.name.split(' ')[0]}</span>
          </div>
          <span style={{ backgroundColor: 'rgba(255,208,0,0.15)', border: '1px solid rgba(255,208,0,0.3)', borderRadius: '999px',
            padding: '2px 8px', fontSize: '11px', color: '#FFD000', fontWeight: 700, flexShrink: 0, marginLeft: '8px' }}>
            {formatDist(stop.distance)}
          </span>
        </div>

        {/* Bottom Row: Route Chips */}
        <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap', alignItems: 'center' }}>
          {displayedRoutes.map((r) => (
            <span key={r} style={{ backgroundColor: '#FFD000', color: '#0D0D0D', fontWeight: 700, fontSize: '10px',
              borderRadius: '4px', padding: '2px 7px', letterSpacing: '0.02em' }}>{r}</span>
          ))}
          {moreCount > 0 && (
            <span style={{ backgroundColor: '#1A1A1A', border: '1px solid #2A2A2A', color: '#666', fontWeight: 700, fontSize: '10px',
              borderRadius: '4px', padding: '2px 7px' }}>+{moreCount} more</span>
          )}
        </div>
      </div>

      {/* Accordion */}
      {isExpanded && (
        <div style={{ borderTop: '1px solid #2A2A2A', backgroundColor: 'rgba(0,0,0,0.3)', padding: '10px 14px' }}>
          <p style={{ color: '#888', fontSize: '11px', fontWeight: 700, margin: '0 0 8px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            Arriving Buses
          </p>
          <div style={{ display: 'grid', gap: '6px', marginBottom: '10px' }}>
            {MOCK_ARRIVING_BUSES.slice(0, 3).map((bus, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                backgroundColor: '#1A1A1A', borderRadius: '8px', padding: '7px 10px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ backgroundColor: '#FFD000', color: '#0D0D0D', fontWeight: 700, fontSize: '10px',
                    borderRadius: '4px', padding: '2px 6px' }}>{bus.routeNum}</span>
                  <span style={{ color: '#CCC', fontSize: '11px' }}>{bus.destination}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Clock size={10} color="#FFD000" />
                  <span style={{ color: '#FFD000', fontWeight: 700, fontSize: '11px' }}>{bus.eta} min</span>
                </div>
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', gap: '7px' }}>
            <button
              onClick={(e) => { e.stopPropagation(); onEdit(); }}
              style={{ flex: 1, height: '30px', borderRadius: '7px', border: '1px solid #2A2A2A', backgroundColor: 'transparent',
                color: '#E5E5E5', fontSize: '11px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
              <Pencil size={11} /> Edit
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); onEdit(); }}
              style={{ flex: 1, height: '30px', borderRadius: '7px', border: '1px solid #FFD00055', backgroundColor: 'rgba(255,208,0,0.08)',
                color: '#FFD000', fontSize: '11px', cursor: 'pointer', fontWeight: 600 }}>
              View on Map
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); onDelete(); }}
              style={{ width: '30px', height: '30px', borderRadius: '7px', border: '1px solid rgba(255,68,68,0.3)', backgroundColor: 'transparent',
                color: '#FF4444', cursor: 'pointer', display: 'grid', placeItems: 'center' }}>
              <Trash2 size={12} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

function createInitialForm(): StopFormState {
  return { name: '', code: '', lat: '', lng: '', routes: [], shelter: false, notes: '', area: '' };
}

const ghostTinyBtn: React.CSSProperties = {
  height: '28px', borderRadius: '7px', border: '1px solid #2A2A2A',
  color: '#888', background: 'transparent', fontSize: '11px',
  padding: '0 9px', cursor: 'pointer', whiteSpace: 'nowrap',
};

const popupActionBtn: React.CSSProperties = {
  flex: 1, border: '1px solid #2A2A2A', borderRadius: '8px',
  backgroundColor: '#111111', color: '#E5E5E5', fontSize: '11px',
  height: '30px', cursor: 'pointer',
};

const toolbarStyle: React.CSSProperties = {
  position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)',
  backgroundColor: '#1A1A1A', border: '1px solid #2A2A2A', borderRadius: '12px',
  padding: '8px', display: 'flex', flexDirection: 'column', gap: '8px', zIndex: 20, minWidth: '48px',
};

const iconBtnStyle: React.CSSProperties = {
  width: '32px', height: '32px', borderRadius: '8px', border: '1px solid #2A2A2A',
  backgroundColor: '#111111', color: '#E5E5E5', display: 'grid', placeItems: 'center', cursor: 'pointer',
};

const floatingMenuStyle: React.CSSProperties = {
  position: 'absolute', right: '46px', top: '0', backgroundColor: '#1A1A1A',
  border: '1px solid #2A2A2A', borderRadius: '10px', padding: '8px', width: '170px', zIndex: 40,
};

const floatingSelectStyle: React.CSSProperties = {
  width: '100%', height: '32px', borderRadius: '6px', border: '1px solid #2A2A2A',
  backgroundColor: '#111111', color: '#E5E5E5', padding: '0 8px', fontSize: '12px',
};

const menuBtnStyle: React.CSSProperties = {
  height: '30px', borderRadius: '8px', border: '1px solid #2A2A2A',
  backgroundColor: '#111111', color: '#E5E5E5', fontSize: '11px', cursor: 'pointer',
};

const fieldLabel: React.CSSProperties = {
  display: 'block', color: '#888', fontSize: '11px', fontWeight: 600, marginBottom: '4px',
};

const fieldInput: React.CSSProperties = {
  width: '100%', height: '36px', borderRadius: '8px', border: '1px solid #2A2A2A',
  backgroundColor: '#1A1A1A', color: '#E5E5E5', padding: '0 10px', fontSize: '12px',
  outline: 'none', boxSizing: 'border-box',
};

const readonlyInput: React.CSSProperties = {
  ...fieldInput, backgroundColor: '#141414', color: '#555',
};

const dropdownToggle: React.CSSProperties = {
  width: '100%', height: '36px', borderRadius: '8px', border: '1px solid #2A2A2A',
  backgroundColor: '#1A1A1A', color: '#E5E5E5', fontSize: '12px',
  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
  padding: '0 10px', cursor: 'pointer',
};

const routeDropdown: React.CSSProperties = {
  position: 'absolute', zIndex: 30, top: '40px', left: 0, right: 0,
  backgroundColor: '#1A1A1A', border: '1px solid #2A2A2A', borderRadius: '8px',
  maxHeight: '160px', overflowY: 'auto', padding: '6px',
};

export default StopMapEditor;
