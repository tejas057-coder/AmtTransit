import React, { useEffect, useMemo, useRef, useState } from 'react';
import { MapContainer, Marker, Popup, TileLayer, Tooltip, useMap, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import {
  ChevronDown,
  Crosshair,
  Download,
  Filter,
  Layers,
  LocateFixed,
  Maximize2,
  Pencil,
  Search,
  Sparkles,
  Trash2,
  ZoomIn,
  ZoomOut,
} from 'lucide-react';
import { adminBorders, adminColors, adminSpacing } from '@/lib/adminDesignTokens';

type Stop = {
  id: string;
  name: string;
  code: string;
  lat: number;
  lng: number;
  routes: string[];
  shelter: boolean;
  notes: string;
};

type StopFormState = {
  name: string;
  code: string;
  lat: string;
  lng: string;
  routes: string[];
  shelter: boolean;
  notes: string;
};

type NewPin = { lat: number; lng: number } | null;

type MapClickListenerProps = {
  isPlacingMode: boolean;
  onMapClick: (lat: number, lng: number) => void;
};

type MapBinderProps = {
  onBind: (map: L.Map) => void;
};

const AMRAVATI_CENTER: [number, number] = [20.932, 77.7523];
const DEFAULT_ZOOM = 14;
const ROUTE_OPTIONS = Array.from({ length: 12 }, (_, i) => `Route ${i + 1}`);

const SAMPLE_STOPS: Stop[] = [
  {
    id: 'stop-1',
    name: 'Rajapeth Square',
    code: 'AMR-001',
    lat: 20.932,
    lng: 77.7523,
    routes: ['Route 1', 'Route 4'],
    shelter: true,
    notes: 'Main transit junction near market road',
  },
  {
    id: 'stop-2',
    name: 'Jaistambh Chowk',
    code: 'AMR-002',
    lat: 20.9335,
    lng: 77.7556,
    routes: ['Route 2', 'Route 7'],
    shelter: false,
    notes: 'Busy crossing, high evening traffic',
  },
  {
    id: 'stop-3',
    name: 'Cotton Market',
    code: 'AMR-003',
    lat: 20.928,
    lng: 77.7489,
    routes: ['Route 3', 'Route 5', 'Route 9'],
    shelter: true,
    notes: 'Peak demand during morning trade hours',
  },
  {
    id: 'stop-4',
    name: 'Irwin Square',
    code: 'AMR-004',
    lat: 20.9298,
    lng: 77.7534,
    routes: ['Route 6', 'Route 8'],
    shelter: true,
    notes: 'Hospital access point',
  },
  {
    id: 'stop-5',
    name: 'Sant Gadge Baba Chowk',
    code: 'AMR-005',
    lat: 20.931,
    lng: 77.7501,
    routes: ['Route 10', 'Route 11', 'Route 12'],
    shelter: false,
    notes: 'Pedestrian-heavy zone',
  },
];

const createInitialForm = (): StopFormState => ({
  name: '',
  code: '',
  lat: '',
  lng: '',
  routes: [],
  shelter: false,
  notes: '',
});

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

const StopMapEditor: React.FC = () => {
  const [stops, setStops] = useState<Stop[]>(SAMPLE_STOPS);
  const [isPlacingMode, setIsPlacingMode] = useState(false);
  const [selectedStop, setSelectedStop] = useState<Stop | null>(null);
  const [newPin, setNewPin] = useState<NewPin>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showRouteDropdown, setShowRouteDropdown] = useState(false);
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [showDownloadMenu, setShowDownloadMenu] = useState(false);
  const [showLabels, setShowLabels] = useState(true);
  const [filterRoute, setFilterRoute] = useState('All Routes');
  const [editingStopId, setEditingStopId] = useState<string | null>(null);
  const [form, setForm] = useState<StopFormState>(createInitialForm());

  const mapRef = useRef<L.Map | null>(null);
  const markerRefs = useRef<Record<string, L.Marker | null>>({});
  const importFileRef = useRef<HTMLInputElement | null>(null);

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

  const filteredStops = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    return stops.filter((stop) => {
      const matchesSearch = !term || stop.name.toLowerCase().includes(term) || stop.code.toLowerCase().includes(term);
      const matchesRoute = filterRoute === 'All Routes' || stop.routes.includes(filterRoute);
      return matchesSearch && matchesRoute;
    });
  }, [filterRoute, searchTerm, stops]);

  const hasPin = form.lat !== '' && form.lng !== '';
  const isFormVisible = editingStopId !== null || hasPin;

  const bindMap = (map: L.Map) => {
    mapRef.current = map;
  };

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
  };

  const centerOnStop = (stop: Stop) => {
    setSelectedStop(stop);
    mapRef.current?.flyTo([stop.lat, stop.lng], 16, { duration: 0.45 });
    markerRefs.current[stop.id]?.openPopup();
  };

  const enterEditMode = (stop: Stop) => {
    setEditingStopId(stop.id);
    setSelectedStop(stop);
    setForm({
      name: stop.name,
      code: stop.code,
      lat: stop.lat.toFixed(6),
      lng: stop.lng.toFixed(6),
      routes: stop.routes,
      shelter: stop.shelter,
      notes: stop.notes,
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
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = 'amravati-stops.json';
    anchor.click();
    URL.revokeObjectURL(url);
  };

  const exportCsv = () => {
    const header = 'id,name,code,lat,lng,routes,shelter,notes';
    const rows = stops.map((stop) => {
      const safe = (value: string) => `"${value.replace(/"/g, '""')}"`;
      return [
        stop.id,
        safe(stop.name),
        stop.code,
        stop.lat.toFixed(6),
        stop.lng.toFixed(6),
        safe(stop.routes.join('|')),
        stop.shelter ? 'true' : 'false',
        safe(stop.notes),
      ].join(',');
    });

    const blob = new Blob([[header, ...rows].join('\n')], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = 'amravati-stops.csv';
    anchor.click();
    URL.revokeObjectURL(url);
  };

  const importCsv = (raw: string) => {
    const lines = raw
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter(Boolean);

    if (lines.length < 2) return;

    const imported: Stop[] = [];
    for (let i = 1; i < lines.length; i += 1) {
      const cols = lines[i]
        .split(/,(?=(?:[^"]*"[^"]*")*[^"]*$)/)
        .map((v) => v.replace(/^"|"$/g, '').replace(/""/g, '"'));

      if (cols.length < 8) continue;
      const lat = Number(cols[3]);
      const lng = Number(cols[4]);
      if (Number.isNaN(lat) || Number.isNaN(lng)) continue;

      imported.push({
        id: cols[0] || `imported-${Date.now()}-${i}`,
        name: cols[1],
        code: cols[2],
        lat,
        lng,
        routes: cols[5] ? cols[5].split('|').map((route) => route.trim()).filter(Boolean) : [],
        shelter: cols[6]?.toLowerCase() === 'true',
        notes: cols[7] ?? '',
      });
    }

    if (imported.length > 0) {
      setStops(imported);
      setSelectedStop(null);
      resetForm();
      fitAllStops();
    }
  };

  const handleCsvFileSelect: React.ChangeEventHandler<HTMLInputElement> = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') importCsv(reader.result);
    };
    reader.readAsText(file);
    event.currentTarget.value = '';
  };

  return (
    <div style={{ position: 'relative', display: 'flex', height: '100vh', backgroundColor: adminColors.background.page }}>
      <style>{`
        .leaflet-container { background: #0D0D0D; }
        .placing-mode .leaflet-container,
        .placing-mode .leaflet-interactive { cursor: crosshair !important; }
        .leaflet-popup-content-wrapper {
          background: #1A1A1A;
          color: #E5E5E5;
          border: 1px solid #2A2A2A;
          border-radius: 10px;
        }
        .leaflet-popup-tip {
          background: #1A1A1A;
          border: 1px solid #2A2A2A;
        }
        .stop-marker-dark {
          width: 24px;
          height: 24px;
          border-radius: 999px;
          background: #1A1A1A;
          border: 2px solid #FFD000;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 0 0 2px rgba(255, 208, 0, 0.2);
        }
        .stop-marker-dot {
          width: 8px;
          height: 8px;
          border-radius: 999px;
          background: #FFD000;
        }
        .temp-pin-wrapper { position: relative; }
        .temp-pin-core {
          width: 14px;
          height: 14px;
          border-radius: 999px;
          background: #FFD000;
          position: absolute;
          top: 7px;
          left: 7px;
          transform: translate(-50%, -50%);
          box-shadow: 0 0 12px rgba(255, 208, 0, 0.8);
        }
        .temp-pin-ring {
          width: 28px;
          height: 28px;
          border-radius: 999px;
          border: 2px solid rgba(255, 208, 0, 0.8);
          animation: pinPulse 1.2s infinite;
        }
        @keyframes pinPulse {
          0% { transform: scale(0.8); opacity: 0.8; }
          100% { transform: scale(1.4); opacity: 0; }
        }
        @keyframes modePulse {
          0%, 100% { transform: scale(1); opacity: 0.6; }
          50% { transform: scale(1.2); opacity: 1; }
        }
      `}</style>

      <aside
        style={{
          width: '300px',
          minWidth: '300px',
          backgroundColor: '#111111',
          borderRight: '1px solid #2A2A2A',
          display: 'flex',
          flexDirection: 'column',
          zIndex: 15,
        }}
      >
        <div style={{ padding: adminSpacing.lg, borderBottom: '1px solid #2A2A2A' }}>
          <h1 style={{ fontSize: '16px', fontWeight: 700, color: '#FFFFFF', margin: 0 }}>Stop Map Editor</h1>
          <p style={{ margin: '6px 0 0', fontSize: '12px', color: '#888888' }}>Click map to place stop</p>

          <div style={{ marginTop: adminSpacing.md, display: 'flex', gap: adminSpacing.sm }}>
            <button onClick={() => importFileRef.current?.click()} style={ghostTinyButtonStyle}>Import CSV</button>
            <button onClick={exportJson} style={ghostTinyButtonStyle}>Export JSON</button>
            <button onClick={exportCsv} style={ghostTinyButtonStyle}>Export CSV</button>
            <input ref={importFileRef} type="file" accept=".csv" onChange={handleCsvFileSelect} style={{ display: 'none' }} />
          </div>
        </div>

        <div style={{ padding: adminSpacing.lg, borderBottom: '1px solid #2A2A2A' }}>
          <button
            onClick={() => setIsPlacingMode((prev) => !prev)}
            style={{
              width: '100%',
              minHeight: '42px',
              borderRadius: adminBorders.radius.md,
              border: isPlacingMode ? '1px solid #FFD000' : '1px solid #2A2A2A',
              background: isPlacingMode ? 'rgba(255, 208, 0, 0.16)' : '#1A1A1A',
              color: isPlacingMode ? '#FFD000' : '#E5E5E5',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              cursor: 'pointer',
              fontWeight: 600,
              fontSize: '12px',
            }}
          >
            <Crosshair size={14} />
            {isPlacingMode ? 'Placing Mode ON - Click map' : 'Click to Place Stop Mode'}
            {isPlacingMode && (
              <span
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: 999,
                  backgroundColor: '#FFD000',
                  animation: 'modePulse 1.2s infinite',
                }}
              />
            )}
          </button>

          <div style={{ marginTop: adminSpacing.md, display: 'grid', gap: adminSpacing.sm }}>
            {!isFormVisible ? (
              <div
                style={{
                  border: '1px dashed #2A2A2A',
                  borderRadius: adminBorders.radius.md,
                  backgroundColor: '#161616',
                  color: '#888888',
                  fontSize: '12px',
                  textAlign: 'center',
                  padding: '18px 10px',
                }}
              >
                Turn on placing mode and click the map to auto-fill latitude and longitude.
              </div>
            ) : (
              <>
                <label style={fieldLabelStyle}>Stop Name</label>
                <input
                  value={form.name}
                  onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
                  placeholder="e.g. Rajapeth Square"
                  style={fieldInputStyle}
                />

                <label style={fieldLabelStyle}>Stop Code</label>
                <div style={{ display: 'flex', gap: adminSpacing.sm }}>
                  <input
                    value={form.code}
                    onChange={(event) => setForm((prev) => ({ ...prev, code: event.target.value }))}
                    placeholder="e.g. AMR-042"
                    style={{ ...fieldInputStyle, flex: 1 }}
                  />
                  <button onClick={generateStopCode} style={sparkButtonStyle} title="Auto-generate stop code">
                    <Sparkles size={15} />
                  </button>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: adminSpacing.sm }}>
                  <div>
                    <label style={fieldLabelStyle}>Latitude</label>
                    <input value={form.lat} readOnly placeholder="Latitude" style={readonlyFieldInputStyle} />
                  </div>
                  <div>
                    <label style={fieldLabelStyle}>Longitude</label>
                    <input value={form.lng} readOnly placeholder="Longitude" style={readonlyFieldInputStyle} />
                  </div>
                </div>

                <label style={fieldLabelStyle}>Route Tags</label>
                <div style={{ position: 'relative' }}>
                  <button onClick={() => setShowRouteDropdown((prev) => !prev)} style={dropdownToggleStyle}>
                    <span>{form.routes.length > 0 ? `Route Tags (${form.routes.length})` : 'Route Tags'}</span>
                    <ChevronDown size={14} />
                  </button>

                  {showRouteDropdown && (
                    <div style={routeDropdownStyle}>
                      {ROUTE_OPTIONS.map((route) => {
                        const selected = form.routes.includes(route);
                        return (
                          <button
                            key={route}
                            onClick={() =>
                              setForm((prev) => ({
                                ...prev,
                                routes: selected ? prev.routes.filter((item) => item !== route) : [...prev.routes, route],
                              }))
                            }
                            style={{
                              width: '100%',
                              border: 'none',
                              background: selected ? 'rgba(255, 208, 0, 0.16)' : 'transparent',
                              color: selected ? '#FFD000' : '#E5E5E5',
                              textAlign: 'left',
                              padding: '8px',
                              borderRadius: adminBorders.radius.sm,
                              cursor: 'pointer',
                              fontSize: '12px',
                            }}
                          >
                            {route}
                          </button>
                        );
                      })}
                    </div>
                  )}

                  {form.routes.length > 0 && (
                    <div style={{ marginTop: '8px', display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                      {form.routes.map((route) => (
                        <span key={route} style={routeChipStyle}>{route}</span>
                      ))}
                    </div>
                  )}
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ color: '#E5E5E5', fontSize: '12px' }}>Shelter Available</span>
                  <button
                    onClick={() => setForm((prev) => ({ ...prev, shelter: !prev.shelter }))}
                    style={{
                      width: '44px',
                      height: '24px',
                      borderRadius: 999,
                      border: '1px solid #2A2A2A',
                      backgroundColor: form.shelter ? '#FFD000' : '#1A1A1A',
                      position: 'relative',
                      cursor: 'pointer',
                    }}
                  >
                    <span
                      style={{
                        position: 'absolute',
                        top: '2px',
                        left: form.shelter ? '22px' : '2px',
                        width: '18px',
                        height: '18px',
                        borderRadius: 999,
                        backgroundColor: form.shelter ? '#0D0D0D' : '#AAAAAA',
                        transition: 'left 160ms ease',
                      }}
                    />
                  </button>
                </div>

                <label style={fieldLabelStyle}>Landmark/Notes</label>
                <textarea
                  value={form.notes}
                  onChange={(event) => setForm((prev) => ({ ...prev, notes: event.target.value }))}
                  rows={2}
                  placeholder="Landmark / notes"
                  style={textareaStyle}
                />

                <button
                  onClick={saveStop}
                  disabled={!form.name.trim() || !form.code.trim() || !hasPin}
                  style={{
                    width: '100%',
                    height: '40px',
                    border: 'none',
                    borderRadius: adminBorders.radius.md,
                    backgroundColor: '#FFD000',
                    color: '#0D0D0D',
                    fontWeight: 700,
                    cursor: !form.name.trim() || !form.code.trim() || !hasPin ? 'not-allowed' : 'pointer',
                    opacity: !form.name.trim() || !form.code.trim() || !hasPin ? 0.5 : 1,
                  }}
                >
                  {editingStopId ? 'Update Stop' : 'Save Stop'}
                </button>

                <button onClick={resetForm} style={cancelButtonStyle}>Cancel</button>
              </>
            )}
          </div>
        </div>

        <div style={{ padding: adminSpacing.lg, borderBottom: '1px solid #2A2A2A' }}>
          <h2 style={{ color: '#FFFFFF', margin: 0, fontSize: '14px', fontWeight: 700 }}>All Stops (87)</h2>
          <div style={searchBoxStyle}>
            <Search size={14} color="#888888" />
            <input
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Search stops"
              style={searchInputStyle}
            />
          </div>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: adminSpacing.md }}>
          {filteredStops.map((stop) => (
            <div
              key={stop.id}
              onClick={() => centerOnStop(stop)}
              style={{
                backgroundColor: selectedStop?.id === stop.id ? '#1D1D1D' : '#151515',
                border: `1px solid ${selectedStop?.id === stop.id ? '#FFD00066' : '#2A2A2A'}`,
                borderRadius: adminBorders.radius.md,
                padding: adminSpacing.md,
                marginBottom: adminSpacing.sm,
                cursor: 'pointer',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: adminSpacing.sm }}>
                <div>
                  <div style={{ color: '#FFFFFF', fontWeight: 700, fontSize: '13px' }}>{stop.name}</div>
                  <div style={{ color: '#888888', fontSize: '11px', fontFamily: 'monospace' }}>{stop.code}</div>
                  <div style={{ color: '#777777', fontSize: '10px', marginTop: '4px' }}>
                    {stop.lat.toFixed(6)}, {stop.lng.toFixed(6)}
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'start', gap: '6px' }}>
                  <button
                    onClick={(event) => {
                      event.stopPropagation();
                      enterEditMode(stop);
                    }}
                    style={smallIconButtonStyle}
                  >
                    <Pencil size={13} />
                  </button>
                  <button
                    onClick={(event) => {
                      event.stopPropagation();
                      removeStop(stop.id);
                    }}
                    style={smallIconButtonStyle}
                    onMouseEnter={(event) => {
                      event.currentTarget.style.color = '#FF4444';
                    }}
                    onMouseLeave={(event) => {
                      event.currentTarget.style.color = '#888888';
                    }}
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            </div>
          ))}

          {filteredStops.length === 0 && (
            <div style={{ color: '#777777', fontSize: '12px', textAlign: 'center', padding: '16px 0' }}>
              No stops match your search/filter.
            </div>
          )}
        </div>
      </aside>

      <main style={{ flex: 1, position: 'relative' }} className={isPlacingMode ? 'placing-mode' : ''}>
        <MapContainer center={AMRAVATI_CENTER} zoom={DEFAULT_ZOOM} zoomControl={false} style={{ width: '100%', height: '100%' }}>
          <MapBinder onBind={bindMap} />
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; CARTO'
            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          />

          <MapClickListener isPlacingMode={isPlacingMode} onMapClick={handleMapClick} />

          {newPin && <Marker position={[newPin.lat, newPin.lng]} icon={tempPinIcon} />}

          {filteredStops.map((stop) => (
            <Marker
              key={stop.id}
              position={[stop.lat, stop.lng]}
              icon={stopIcon}
              ref={(ref) => {
                markerRefs.current[stop.id] = ref;
              }}
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
                  <div style={{ fontSize: '11px', color: '#888888', fontFamily: 'monospace' }}>{stop.code}</div>

                  <div style={{ marginTop: '8px', display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
                    {stop.routes.map((route) => (
                      <span key={route} style={popupRouteChipStyle}>{route}</span>
                    ))}
                  </div>

                  <div style={{ marginTop: '8px', display: 'flex', gap: '8px' }}>
                    <button onClick={() => enterEditMode(stop)} style={popupActionButtonStyle}>Edit</button>
                    <button onClick={() => removeStop(stop.id)} style={{ ...popupActionButtonStyle, color: '#FF4444' }}>
                      Delete
                    </button>
                  </div>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>

        <div style={toolbarStyle}>
          <button title="Zoom in" onClick={() => mapRef.current?.zoomIn()} style={iconButtonStyle}>
            <ZoomIn size={16} />
          </button>
          <button title="Zoom out" onClick={() => mapRef.current?.zoomOut()} style={iconButtonStyle}>
            <ZoomOut size={16} />
          </button>
          <button title="Locate me" onClick={() => mapRef.current?.flyTo(AMRAVATI_CENTER, DEFAULT_ZOOM, { duration: 0.6 })} style={iconButtonStyle}>
            <LocateFixed size={16} />
          </button>
          <button title="Show all stops" onClick={fitAllStops} style={iconButtonStyle}>
            <Maximize2 size={16} />
          </button>

          <div style={{ height: '1px', backgroundColor: '#2A2A2A' }} />

          <div style={{ position: 'relative' }}>
            <button
              title="Filter by Route"
              onClick={() => {
                setShowFilterDropdown((prev) => !prev);
                setShowDownloadMenu(false);
              }}
              style={iconButtonStyle}
            >
              <Filter size={16} />
            </button>
            {showFilterDropdown && (
              <div style={floatingMenuStyle}>
                <div style={{ fontSize: '11px', color: '#888888', marginBottom: '6px' }}>Filter by Route</div>
                <select value={filterRoute} onChange={(event) => setFilterRoute(event.target.value)} style={floatingSelectStyle}>
                  <option>All Routes</option>
                  {ROUTE_OPTIONS.map((route) => (
                    <option key={route}>{route}</option>
                  ))}
                </select>
              </div>
            )}
          </div>

          <button
            title="Toggle labels"
            onClick={() => setShowLabels((prev) => !prev)}
            style={{
              ...iconButtonStyle,
              color: showLabels ? '#FFD000' : '#E5E5E5',
              borderColor: showLabels ? '#FFD00066' : '#2A2A2A',
            }}
          >
            <Layers size={16} />
          </button>

          <div style={{ position: 'relative' }}>
            <button
              title="Export"
              onClick={() => {
                setShowDownloadMenu((prev) => !prev);
                setShowFilterDropdown(false);
              }}
              style={iconButtonStyle}
            >
              <Download size={16} />
            </button>

            {showDownloadMenu && (
              <div style={{ ...floatingMenuStyle, width: '140px', display: 'grid', gap: '6px' }}>
                <button onClick={exportJson} style={menuButtonStyle}>Export JSON</button>
                <button onClick={exportCsv} style={menuButtonStyle}>Export CSV</button>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

const ghostTinyButtonStyle: React.CSSProperties = {
  height: '30px',
  borderRadius: adminBorders.radius.md,
  border: '1px solid #2A2A2A',
  color: '#E5E5E5',
  background: 'transparent',
  fontSize: '11px',
  padding: '0 10px',
  cursor: 'pointer',
};

const sparkButtonStyle: React.CSSProperties = {
  borderRadius: adminBorders.radius.md,
  border: '1px solid #2A2A2A',
  backgroundColor: '#1A1A1A',
  color: '#FFD000',
  height: '38px',
  width: '38px',
  display: 'grid',
  placeItems: 'center',
  cursor: 'pointer',
};

const dropdownToggleStyle: React.CSSProperties = {
  width: '100%',
  height: '38px',
  borderRadius: adminBorders.radius.md,
  border: '1px solid #2A2A2A',
  backgroundColor: '#1A1A1A',
  color: '#E5E5E5',
  fontSize: '12px',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '0 10px',
  cursor: 'pointer',
};

const routeDropdownStyle: React.CSSProperties = {
  position: 'absolute',
  zIndex: 30,
  top: '42px',
  left: 0,
  right: 0,
  backgroundColor: '#1A1A1A',
  border: '1px solid #2A2A2A',
  borderRadius: adminBorders.radius.md,
  maxHeight: '168px',
  overflowY: 'auto',
  padding: '6px',
};

const routeChipStyle: React.CSSProperties = {
  backgroundColor: '#FFD000',
  color: '#0D0D0D',
  padding: '3px 8px',
  borderRadius: adminBorders.radius.full,
  fontSize: '11px',
  fontWeight: 700,
};

const textareaStyle: React.CSSProperties = {
  borderRadius: adminBorders.radius.md,
  border: '1px solid #2A2A2A',
  backgroundColor: '#1A1A1A',
  color: '#E5E5E5',
  padding: '8px 10px',
  fontSize: '12px',
  resize: 'vertical',
};

const cancelButtonStyle: React.CSSProperties = {
  width: '100%',
  height: '34px',
  borderRadius: adminBorders.radius.md,
  border: '1px solid #2A2A2A',
  backgroundColor: 'transparent',
  color: '#E5E5E5',
  cursor: 'pointer',
  fontSize: '12px',
};

const searchBoxStyle: React.CSSProperties = {
  marginTop: adminSpacing.sm,
  backgroundColor: '#1A1A1A',
  border: '1px solid #2A2A2A',
  borderRadius: adminBorders.radius.md,
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  padding: '0 10px',
  height: '36px',
};

const searchInputStyle: React.CSSProperties = {
  flex: 1,
  border: 'none',
  outline: 'none',
  background: 'transparent',
  color: '#E5E5E5',
  fontSize: '12px',
};

const smallIconButtonStyle: React.CSSProperties = {
  width: '28px',
  height: '28px',
  borderRadius: adminBorders.radius.sm,
  border: '1px solid #2A2A2A',
  backgroundColor: 'transparent',
  color: '#888888',
  cursor: 'pointer',
};

const popupRouteChipStyle: React.CSSProperties = {
  backgroundColor: '#FFD000',
  color: '#0D0D0D',
  fontSize: '10px',
  fontWeight: 700,
  borderRadius: 999,
  padding: '2px 7px',
};

const popupActionButtonStyle: React.CSSProperties = {
  flex: 1,
  border: '1px solid #2A2A2A',
  borderRadius: adminBorders.radius.md,
  backgroundColor: '#111111',
  color: '#E5E5E5',
  fontSize: '11px',
  height: '30px',
  cursor: 'pointer',
};

const toolbarStyle: React.CSSProperties = {
  position: 'absolute',
  right: '16px',
  top: '50%',
  transform: 'translateY(-50%)',
  backgroundColor: '#1A1A1A',
  border: '1px solid #2A2A2A',
  borderRadius: '12px',
  padding: '8px',
  display: 'flex',
  flexDirection: 'column',
  gap: '8px',
  zIndex: 20,
  minWidth: '48px',
};

const iconButtonStyle: React.CSSProperties = {
  width: '32px',
  height: '32px',
  borderRadius: '8px',
  border: '1px solid #2A2A2A',
  backgroundColor: '#111111',
  color: '#E5E5E5',
  display: 'grid',
  placeItems: 'center',
  cursor: 'pointer',
};

const floatingMenuStyle: React.CSSProperties = {
  position: 'absolute',
  right: '46px',
  top: '0',
  backgroundColor: '#1A1A1A',
  border: '1px solid #2A2A2A',
  borderRadius: adminBorders.radius.md,
  padding: '8px',
  width: '170px',
};

const floatingSelectStyle: React.CSSProperties = {
  width: '100%',
  height: '34px',
  borderRadius: adminBorders.radius.sm,
  border: '1px solid #2A2A2A',
  backgroundColor: '#111111',
  color: '#E5E5E5',
  padding: '0 8px',
};

const menuButtonStyle: React.CSSProperties = {
  height: '30px',
  borderRadius: '8px',
  border: '1px solid #2A2A2A',
  backgroundColor: '#111111',
  color: '#E5E5E5',
  fontSize: '11px',
  cursor: 'pointer',
};

const fieldLabelStyle: React.CSSProperties = {
  color: '#A0A0A0',
  fontSize: '11px',
  fontWeight: 600,
  marginBottom: '2px',
};

const fieldInputStyle: React.CSSProperties = {
  height: '38px',
  borderRadius: adminBorders.radius.md,
  border: '1px solid #2A2A2A',
  backgroundColor: '#1A1A1A',
  color: '#E5E5E5',
  padding: '0 10px',
  fontSize: '12px',
  width: '100%',
};

const readonlyFieldInputStyle: React.CSSProperties = {
  ...fieldInputStyle,
  backgroundColor: '#141414',
  color: '#999999',
};

export default StopMapEditor;
