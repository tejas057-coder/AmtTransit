import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { MapContainer, Marker, Popup, TileLayer, useMap, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import { MapPin, Trash2, Edit2, GripVertical, X } from 'lucide-react';

// ─── Types ──────────────────────────────────────────────────────────────────

type TripStop = {
  id: string;
  name: string;
  lat: number;
  lng: number;
  order: number;
};

type MapClickListenerProps = {
  onMapClick: (lat: number, lng: number) => void;
};

type MapBinderProps = {
  onBind: (map: L.Map) => void;
};

// ─── Constants ───────────────────────────────────────────────────────────────

const AMRAVATI_CENTER: [number, number] = [20.932, 77.7523];
const DEFAULT_ZOOM = 14;

// ─── Map event helpers ────────────────────────────────────────────────────────

const MapClickListener: React.FC<MapClickListenerProps> = ({ onMapClick }) => {
  useMapEvents({
    click(event) {
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

const TripStopCreator: React.FC = () => {
  const [stops, setStops] = useState<TripStop[]>([]);
  const [selectedStopId, setSelectedStopId] = useState<string | null>(null);
  const [editingStopId, setEditingStopId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const mapRef = useRef<L.Map | null>(null);

  const bindMap = useCallback((map: L.Map) => {
    mapRef.current = map;
  }, []);

  // ─── Icons ────────────────────────────────────────────────────────

  const stopIcon = useMemo(
    () =>
      L.divIcon({
        className: 'trip-stop-marker',
        html: '<div class="trip-stop-dot"><span class="trip-stop-number"></span></div>',
        iconSize: [28, 28],
        iconAnchor: [14, 14],
      }),
    [],
  );

  const selectedStopIcon = useMemo(
    () =>
      L.divIcon({
        className: 'trip-stop-marker-selected',
        html: '<div class="trip-stop-dot-selected"><span class="trip-stop-number-selected"></span></div>',
        iconSize: [32, 32],
        iconAnchor: [16, 16],
      }),
    [],
  );

  // ─── Handlers ─────────────────────────────────────────────────────

  const handleMapClick = (lat: number, lng: number) => {
    const newStop: TripStop = {
      id: `stop-${Date.now()}`,
      name: `Stop ${stops.length + 1}`,
      lat,
      lng,
      order: stops.length + 1,
    };
    setStops((prev) => [...prev, newStop]);
  };

  const removeStop = (id: string) => {
    setStops((prev) => {
      const filtered = prev.filter((s) => s.id !== id);
      return filtered.map((s, idx) => ({ ...s, order: idx + 1 }));
    });
    if (selectedStopId === id) setSelectedStopId(null);
    if (editingStopId === id) {
      setEditingStopId(null);
      setEditName('');
    }
  };

  const startEditing = (stop: TripStop) => {
    setEditingStopId(stop.id);
    setEditName(stop.name);
  };

  const saveEdit = () => {
    if (!editingStopId || !editName.trim()) return;
    setStops((prev) =>
      prev.map((s) => (s.id === editingStopId ? { ...s, name: editName.trim() } : s))
    );
    setEditingStopId(null);
    setEditName('');
  };

  const cancelEdit = () => {
    setEditingStopId(null);
    setEditName('');
  };

  const moveStop = (id: string, direction: 'up' | 'down') => {
    setStops((prev) => {
      const index = prev.findIndex((s) => s.id === id);
      if (index === -1) return prev;
      if (direction === 'up' && index === 0) return prev;
      if (direction === 'down' && index === prev.length - 1) return prev;
      
      const newStops = [...prev];
      const swapIndex = direction === 'up' ? index - 1 : index + 1;
      [newStops[index], newStops[swapIndex]] = [newStops[swapIndex], newStops[index]];
      return newStops.map((s, idx) => ({ ...s, order: idx + 1 }));
    });
  };

  const fitAllStops = () => {
    if (!mapRef.current || stops.length === 0) return;
    const bounds = L.latLngBounds(stops.map((s) => [s.lat, s.lng] as [number, number]));
    mapRef.current.fitBounds(bounds.pad(0.3));
  };

  const clearAllStops = () => {
    setStops([]);
    setSelectedStopId(null);
    setEditingStopId(null);
    setEditName('');
  };

  // ─── Render ───────────────────────────────────────────────────────

  return (
    <div style={{ display: 'flex', height: 'calc(100vh - 56px)', backgroundColor: '#0D0D0D', overflow: 'hidden' }}>
      <style>{`
        .leaflet-container { background: #0D0D0D; }
        .trip-stop-dot {
          width: 28px; height: 28px; border-radius: 999px;
          background: #FFD000; border: 3px solid #fff;
          display: flex; align-items: center; justify-content: center;
          box-shadow: 0 2px 8px rgba(0,0,0,0.4);
        }
        .trip-stop-number {
          color: #0D0D0D; font-size: 11px; font-weight: 800;
        }
        .trip-stop-dot-selected {
          width: 32px; height: 32px; border-radius: 999px;
          background: #FF4444; border: 3px solid #fff;
          display: flex; align-items: center; justify-content: center;
          box-shadow: 0 4px 12px rgba(255,68,68,0.5);
        }
        .trip-stop-number-selected {
          color: #fff; font-size: 12px; font-weight: 800;
        }
        .stops-list-scroll::-webkit-scrollbar { width: 4px; }
        .stops-list-scroll::-webkit-scrollbar-track { background: transparent; }
        .stops-list-scroll::-webkit-scrollbar-thumb { background: #2A2A2A; border-radius: 4px; }
        .stop-item { transition: all 150ms ease; }
        .stop-item:hover { background-color: #1D1D1D !important; }
      `}</style>

      {/* ── Map Area (Main Focus) ──────────────────────────────────── */}
      <main style={{ flex: 1, position: 'relative', height: '100%' }}>
        <MapContainer 
          center={AMRAVATI_CENTER} 
          zoom={DEFAULT_ZOOM} 
          zoomControl={false} 
          style={{ width: '100%', height: '100%' }}
        >
          <MapBinder onBind={bindMap} />
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          />
          <MapClickListener onMapClick={handleMapClick} />

          {stops.map((stop, index) => (
            <Marker
              key={stop.id}
              position={[stop.lat, stop.lng]}
              icon={selectedStopId === stop.id ? selectedStopIcon : stopIcon}
              eventHandlers={{ click: () => setSelectedStopId(stop.id) }}
            >
              <Popup>
                <div style={{ backgroundColor: '#1A1A1A', color: '#E5E5E5', padding: '4px', minWidth: '180px' }}>
                  <div style={{ fontSize: '13px', fontWeight: 700, color: '#FFFFFF', marginBottom: '4px' }}>
                    {stop.name}
                  </div>
                  <div style={{ fontSize: '10px', color: '#888', marginBottom: '6px' }}>
                    #{stop.order} • {stop.lat.toFixed(5)}, {stop.lng.toFixed(5)}
                  </div>
                  <div style={{ display: 'flex', gap: '6px' }}>
                    <button 
                      onClick={() => startEditing(stop)} 
                      style={{
                        flex: 1, height: '26px', borderRadius: '6px', border: '1px solid #2A2A2A',
                        backgroundColor: '#111111', color: '#E5E5E5', fontSize: '10px', cursor: 'pointer',
                      }}
                    >
                      Rename
                    </button>
                    <button 
                      onClick={() => removeStop(stop.id)} 
                      style={{
                        flex: 1, height: '26px', borderRadius: '6px', border: '1px solid rgba(255,68,68,0.3)',
                        backgroundColor: 'transparent', color: '#FF4444', fontSize: '10px', cursor: 'pointer',
                      }}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>

        {/* Map Controls */}
        <div style={{
          position: 'absolute', right: '16px', top: '16px',
          backgroundColor: '#1A1A1A', border: '1px solid #2A2A2A', borderRadius: '10px',
          padding: '8px', display: 'flex', flexDirection: 'column', gap: '6px', zIndex: 20,
        }}>
          <button 
            title="Zoom in" 
            onClick={() => mapRef.current?.zoomIn()}
            style={{
              width: '36px', height: '36px', borderRadius: '8px', border: '1px solid #2A2A2A',
              backgroundColor: '#111111', color: '#E5E5E5', display: 'grid', placeItems: 'center', cursor: 'pointer',
            }}
          >
            +
          </button>
          <button 
            title="Zoom out" 
            onClick={() => mapRef.current?.zoomOut()}
            style={{
              width: '36px', height: '36px', borderRadius: '8px', border: '1px solid #2A2A2A',
              backgroundColor: '#111111', color: '#E5E5E5', display: 'grid', placeItems: 'center', cursor: 'pointer',
            }}
          >
            −
          </button>
          <div style={{ height: '1px', backgroundColor: '#2A2A2A' }} />
          <button 
            title="Fit all stops" 
            onClick={fitAllStops}
            style={{
              width: '36px', height: '36px', borderRadius: '8px', border: '1px solid #2A2A2A',
              backgroundColor: '#111111', color: '#E5E5E5', display: 'grid', placeItems: 'center', cursor: 'pointer',
              fontSize: '14px',
            }}
          >
            ⊡
          </button>
        </div>

        {/* Map Instructions */}
        {stops.length === 0 && (
          <div style={{
            position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
            backgroundColor: 'rgba(17,17,17,0.95)', border: '1px solid #2A2A2A', borderRadius: '14px',
            padding: '24px', textAlign: 'center', zIndex: 10, minWidth: '280px',
          }}>
            <MapPin size={32} color="#FFD000" style={{ marginBottom: '12px' }} />
            <p style={{ color: '#FFFFFF', fontWeight: 700, fontSize: '16px', margin: '0 0 8px' }}>
              Create Trip Stops
            </p>
            <p style={{ color: '#888', fontSize: '13px', margin: '0 0 16px' }}>
              Click anywhere on the map to add a stop
            </p>
            <div style={{ 
              width: '48px', height: '48px', borderRadius: '999px', 
              backgroundColor: 'rgba(255,208,0,0.15)', border: '2px dashed #FFD000',
              display: 'grid', placeItems: 'center', margin: '0 auto',
              animation: 'pulse 2s infinite',
            }}>
              <span style={{ color: '#FFD000', fontSize: '20px', fontWeight: 700 }}>+</span>
            </div>
          </div>
        )}
      </main>

      {/* ── Right Panel: Stop List ─────────────────────────────────── */}
      <aside style={{ 
        width: '300px', minWidth: '300px', backgroundColor: '#111111', 
        borderLeft: '1px solid #2A2A2A', display: 'flex', flexDirection: 'column', 
        zIndex: 15, height: '100%',
      }}>
        {/* Panel Header */}
        <div style={{ 
          padding: '16px', borderBottom: '1px solid #2A2A2A', flexShrink: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <MapPin size={18} color="#FFD000" />
            <h2 style={{ fontSize: '15px', fontWeight: 700, color: '#FFFFFF', margin: 0 }}>
              Trip Stops
            </h2>
          </div>
          {stops.length > 0 && (
            <button 
              onClick={clearAllStops}
              style={{
                height: '28px', padding: '0 10px', borderRadius: '6px', border: '1px solid rgba(255,68,68,0.3)',
                backgroundColor: 'transparent', color: '#FF4444', fontSize: '11px', cursor: 'pointer',
                fontWeight: 600,
              }}
            >
              Clear All
            </button>
          )}
        </div>

        {/* Stop Count */}
        <div style={{ 
          padding: '10px 16px', borderBottom: '1px solid #2A2A2A', flexShrink: 0,
        }}>
          <span style={{ fontSize: '12px', color: '#888', fontWeight: 500 }}>
            {stops.length} stop{stops.length !== 1 ? 's' : ''} created
          </span>
        </div>

        {/* Stop List */}
        <div className="stops-list-scroll" style={{ flex: 1, overflowY: 'auto', padding: '12px' }}>
          {stops.length === 0 ? (
            <div style={{ 
              display: 'flex', flexDirection: 'column', alignItems: 'center', 
              justifyContent: 'center', padding: '40px 16px', textAlign: 'center',
            }}>
              <MapPin size={28} color="#333" style={{ marginBottom: '12px' }} />
              <p style={{ color: '#555', fontSize: '12px', margin: 0 }}>
                No stops added yet
              </p>
              <p style={{ color: '#444', fontSize: '11px', margin: '4px 0 0' }}>
                Click on the map to start
              </p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {stops.map((stop, index) => (
                <div
                  key={stop.id}
                  className="stop-item"
                  style={{
                    backgroundColor: selectedStopId === stop.id ? '#1D1D1D' : '#151515',
                    border: `1px solid ${selectedStopId === stop.id ? '#FFD00055' : '#2A2A2A'}`,
                    borderRadius: '10px', padding: '12px', cursor: 'pointer',
                  }}
                  onClick={() => {
                    setSelectedStopId(stop.id);
                    mapRef.current?.flyTo([stop.lat, stop.lng], 16, { duration: 0.4 });
                  }}
                >
                  {editingStopId === stop.id ? (
                    // Edit Mode
                    <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                      <input
                        autoFocus
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') saveEdit();
                          if (e.key === 'Escape') cancelEdit();
                        }}
                        style={{
                          flex: 1, height: '30px', borderRadius: '6px', border: '1px solid #FFD000',
                          backgroundColor: '#1A1A1A', color: '#E5E5E5', padding: '0 8px',
                          fontSize: '12px', outline: 'none',
                        }}
                      />
                      <button 
                        onClick={(e) => { e.stopPropagation(); saveEdit(); }}
                        style={{
                          width: '28px', height: '28px', borderRadius: '6px', border: '1px solid #22C55E',
                          backgroundColor: 'rgba(34,197,94,0.1)', color: '#22C55E', 
                          display: 'grid', placeItems: 'center', cursor: 'pointer',
                        }}
                      >
                        ✓
                      </button>
                      <button 
                        onClick={(e) => { e.stopPropagation(); cancelEdit(); }}
                        style={{
                          width: '28px', height: '28px', borderRadius: '6px', border: '1px solid #2A2A2A',
                          backgroundColor: 'transparent', color: '#888', 
                          display: 'grid', placeItems: 'center', cursor: 'pointer',
                        }}
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ) : (
                    // Display Mode
                    <>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <GripVertical size={14} color="#555" />
                          <span style={{ 
                            backgroundColor: '#FFD000', color: '#0D0D0D', 
                            fontWeight: 800, fontSize: '11px', borderRadius: '50%',
                            width: '22px', height: '22px', display: 'grid', placeItems: 'center',
                          }}>
                            {stop.order}
                          </span>
                          <span style={{ color: '#FFFFFF', fontWeight: 700, fontSize: '13px' }}>
                            {stop.name}
                          </span>
                        </div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <span style={{ color: '#666', fontSize: '10px', fontFamily: 'monospace' }}>
                          {stop.lat.toFixed(5)}, {stop.lng.toFixed(5)}
                        </span>
                        <div style={{ display: 'flex', gap: '4px' }}>
                          <button
                            onClick={(e) => { e.stopPropagation(); moveStop(stop.id, 'up'); }}
                            disabled={index === 0}
                            style={{
                              width: '24px', height: '24px', borderRadius: '4px', border: '1px solid #2A2A2A',
                              backgroundColor: 'transparent', color: index === 0 ? '#333' : '#888',
                              display: 'grid', placeItems: 'center', cursor: index === 0 ? 'not-allowed' : 'pointer',
                              fontSize: '10px',
                            }}
                          >
                            ↑
                          </button>
                          <button
                            onClick={(e) => { e.stopPropagation(); moveStop(stop.id, 'down'); }}
                            disabled={index === stops.length - 1}
                            style={{
                              width: '24px', height: '24px', borderRadius: '4px', border: '1px solid #2A2A2A',
                              backgroundColor: 'transparent', color: index === stops.length - 1 ? '#333' : '#888',
                              display: 'grid', placeItems: 'center', cursor: index === stops.length - 1 ? 'not-allowed' : 'pointer',
                              fontSize: '10px',
                            }}
                          >
                            ↓
                          </button>
                          <button
                            onClick={(e) => { e.stopPropagation(); startEditing(stop); }}
                            style={{
                              width: '24px', height: '24px', borderRadius: '4px', border: '1px solid #2A2A2A',
                              backgroundColor: 'transparent', color: '#888',
                              display: 'grid', placeItems: 'center', cursor: 'pointer',
                            }}
                          >
                            <Edit2 size={10} />
                          </button>
                          <button
                            onClick={(e) => { e.stopPropagation(); removeStop(stop.id); }}
                            style={{
                              width: '24px', height: '24px', borderRadius: '4px', border: '1px solid rgba(255,68,68,0.3)',
                              backgroundColor: 'transparent', color: '#FF4444',
                              display: 'grid', placeItems: 'center', cursor: 'pointer',
                            }}
                          >
                            <Trash2 size={10} />
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </aside>

      <style>{`
        @keyframes pulse {
          0%, 100% { transform: scale(1); opacity: 0.6; }
          50% { transform: scale(1.1); opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default TripStopCreator;
