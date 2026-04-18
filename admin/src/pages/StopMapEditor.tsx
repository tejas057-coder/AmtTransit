import { useEffect, useRef, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { supabase } from '../lib/supabase';
import { useToast } from '../hooks/use-toast';

// ─── Constants & Types ───────────────────────────────────────────────────────

interface Stop {
  id: string;
  name: string;
  route: string;
  lat: number;
  lng: number;
  created_at: string;
}

const ROUTE_COLORS: Record<string, string> = {
  'Route 1 — City Center': '#C8F135',
  'Route 2 — MIDC': '#7F77DD',
  'Route 3 — Airport': '#D85A30',
  'Route 4 — University': '#378ADD',
};

const getRouteColor = (route: string) => ROUTE_COLORS[route] ?? '#888888';

// ─── Helper Components ───────────────────────────────────────────────────────

const MapInstance = ({ mapRef }: { mapRef: React.MutableRefObject<L.Map | null> }) => {
  const map = useMap();
  useEffect(() => {
    if (map) mapRef.current = map;
  }, [map, mapRef]);
  return null;
};

const MapClickHandler = ({ onMapClick }: { onMapClick: (lat: number, lng: number) => void }) => {
  useMapEvents({
    click: (e) => {
      onMapClick(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
};

const StopIcon = (name: string, color: string) => {
  return L.divIcon({
    className: 'custom-stop-icon',
    html: `
      <div style="display: flex; flex-direction: column; align-items: center;">
        <div style="
          width: 14px;
          height: 14px;
          background-color: ${color};
          border-radius: 50%;
          border: 3px solid #0F0F0F;
          box-shadow: 0 0 10px ${color}88;
        "></div>
        <div style="
          margin-top: 4px;
          background-color: #0F0F0F;
          color: #fff;
          font-family: 'DM Sans', sans-serif;
          font-weight: 600;
          font-size: 10px;
          padding: 2px 8px;
          border-radius: 10px;
          white-space: nowrap;
          border: 1px solid ${color}44;
        ">${name}</div>
      </div>
    `,
    iconAnchor: [7, 7],
    popupAnchor: [0, -14],
  });
};

const PendingIcon = () => {
    return L.divIcon({
      className: 'pending-pin-icon',
      html: `
        <div style="display: flex; flex-direction: column; align-items: center;">
          <div style="
            width: 14px;
            height: 14px;
            background-color: #fff;
            border-radius: 50%;
            border: 2px dashed #C8F135;
            animation: pulse-pin 2s infinite;
          "></div>
          <div style="
            margin-top: 4px;
            background-color: #C8F135;
            color: #0F0F0F;
            font-family: 'DM Sans', sans-serif;
            font-weight: 600;
            font-size: 9px;
            padding: 2px 6px;
            border-radius: 4px;
            white-space: nowrap;
          ">Drop here</div>
        </div>
      `,
      iconAnchor: [7, 7],
    });
};

const StopMarker = ({ stop, isSelected, onClick }: { stop: Stop, isSelected: boolean, onClick: (stop: Stop) => void }) => {
  const markerRef = useRef<L.Marker | null>(null);

  useEffect(() => {
    if (isSelected && markerRef.current) {
      markerRef.current.openPopup();
    }
  }, [isSelected]);

  return (
    <Marker 
      ref={markerRef}
      position={[stop.lat, stop.lng]} 
      icon={StopIcon(stop.name, getRouteColor(stop.route))}
      eventHandlers={{
        click: () => onClick(stop)
      }}
    >
      <Popup closeButton={false}>
        <div style={{ fontFamily: "'DM Sans', sans-serif" }}>
          <div style={{ color: '#fff', fontSize: '13px', fontWeight: 600, marginBottom: '2px' }}>{stop.name}</div>
          <div style={{ color: '#888', fontSize: '11px', marginBottom: '4px' }}>{stop.route}</div>
          <div style={{ color: '#444', fontSize: '10px', fontFamily: 'monospace' }}>{stop.lat.toFixed(6)}, {stop.lng.toFixed(6)}</div>
        </div>
      </Popup>
    </Marker>
  );
};

// ─── Main Component ──────────────────────────────────────────────────────────

export default function StopMapEditor() {
  const [stops, setStops] = useState<Stop[]>([]);
  const [loading, setLoading] = useState(true);
  const [dbError, setDbError] = useState(false);
  const [search, setSearch] = useState('');
  const [selectedStop, setSelectedStop] = useState<Stop | null>(null);
  const [pendingPin, setPendingPin] = useState<{ lat: number; lng: number } | null>(null);
  const [formVisible, setFormVisible] = useState(false);
  const [stopName, setStopName] = useState('');
  const [route, setRoute] = useState('Route 1 — City Center');
  const [customRoute, setCustomRoute] = useState(false);
  const [customRouteName, setCustomRouteName] = useState('');
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const mapRef = useRef<L.Map | null>(null);
  const { toast } = useToast();

  const cardRefs = useRef<Map<string, HTMLDivElement>>(new Map());

  const filteredStops = stops
    .filter(s =>
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.route.toLowerCase().includes(search.toLowerCase())
    );

  // 1. Initial Load
  useEffect(() => {
    const fetchStops = async () => {
      setLoading(true);
      setDbError(false);
      try {
        const { data, error } = await supabase
          .from('stops')
          .select('*')
          .order('created_at', { ascending: true });

        if (error) {
          if (error.code === '42P01' || error.message?.includes('does not exist')) {
            setDbError(true);
          } else {
            toast({ title: 'Failed to load stops', description: error.message, variant: 'destructive' });
          }
        } else {
          setStops(data || []);
        }
      } catch (err: any) {
        toast({ title: 'Error', description: err.message, variant: 'destructive' });
      } finally {
        setLoading(false);
      }
    };
    fetchStops();
  }, [toast]);

  // 2. Realtime Subscriptions
  useEffect(() => {
    const channel = supabase
      .channel('stops-realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'stops' }, (payload) => {
        if (payload.eventType === 'INSERT') {
          setStops(prev => {
            if (prev.find(s => s.id === payload.new.id)) return prev;
            return [...prev, payload.new as Stop];
          });
        }
        if (payload.eventType === 'DELETE') {
          setStops(prev => prev.filter(s => s.id !== payload.old.id));
        }
        if (payload.eventType === 'UPDATE') {
          setStops(prev => prev.map(s => s.id === payload.new.id ? (payload.new as Stop) : s));
        }
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const handleMapClick = (lat: number, lng: number) => {
    setPendingPin({ lat, lng });
    setFormVisible(true);
  };

  const handleSave = async () => {
    const finalRoute = customRoute ? customRouteName : route;
    if (!stopName || !finalRoute || !pendingPin) {
        toast({ title: "Validation Error", description: "Name and Route are required", variant: "destructive" });
        return;
    }

    setSaving(true);
    try {
      const { data, error } = await supabase
        .from('stops')
        .insert({
          name: stopName,
          route: finalRoute,
          lat: pendingPin.lat,
          lng: pendingPin.lng
        })
        .select()
        .single();

      if (error) throw error;

      // Realtime will handle adding it, but we add it manually for responsiveness
      setStops(prev => {
        if (prev.find(s => s.id === data.id)) return prev;
        return [...prev, data];
      });

      setPendingPin(null);
      setFormVisible(false);
      setStopName('');
      setCustomRoute(false);
      setCustomRouteName('');
      toast({ title: "Stop saved", description: "Visible to all riders ✓" });
    } catch (err: any) {
      toast({ title: "Failed to save stop", description: err.message, variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setPendingPin(null);
    setFormVisible(false);
    setStopName('');
    setCustomRoute(false);
    setCustomRouteName('');
  };

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (!window.confirm("Are you sure you want to delete this stop?")) return;
    
    setDeleting(id);
    try {
      const { error } = await supabase.from('stops').delete().eq('id', id);
      if (error) throw error;

      // Realtime will handle removal
      toast({ title: "Stop deleted" });
    } catch (err: any) {
      toast({ title: "Failed to delete stop", description: err.message, variant: "destructive" });
    } finally {
      setDeleting(null);
    }
  };

  const handleStopClick = (stop: Stop) => {
    setSelectedStop(stop);
    mapRef.current?.flyTo([stop.lat, stop.lng], 16, { animate: true, duration: 0.8 });
    
    const card = cardRefs.current.get(stop.id);
    if (card) {
      card.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  };

  return (
    <div className="flex w-full h-[calc(100vh-56px)] bg-[#0F0F0F] text-white overflow-hidden font-['DM_Sans',_sans-serif]">
      <style>{`
        @keyframes slide-down {
          from { opacity: 0; transform: translateY(-8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulse-pin {
          0%, 100% { box-shadow: 0 0 0 0 rgba(200,241,53,0.4); }
          50% { box-shadow: 0 0 0 8px rgba(200,241,53,0); }
        }
        @keyframes skeleton-pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #2A2A2A; border-radius: 4px; }
        .leaflet-container { cursor: crosshair !important; background: #0D0D0D !important; width: 100%; height: 100%; }
      `}</style>

      {/* ─── LEFT PANEL ─────────────────────────────────────────────────── */}
      <aside className="w-[320px] flex-shrink-0 flex flex-col border-r border-[#1E1E1E] bg-[#0F0F0F] z-20 h-full">
        {/* Section 1: Header */}
        <div className="p-[20px_18px_14px] border-b border-[#1E1E1E]">
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-2">
              <span className="text-[20px]">📍</span>
              <h1 className="text-[18px] font-semibold text-white">Stop Manager</h1>
            </div>
            <div className="bg-[#C8F135] text-[#0F0F0F] text-[11px] font-bold px-[9px] py-[2px] rounded-[20px]">
              {stops.length} stops
            </div>
          </div>
          <p className="text-[#555] text-[12px]">Click on the map to place a new stop</p>
        </div>

        {/* Section 2: Create Stop Form */}
        <div className="overflow-y-auto flex-1 custom-scrollbar">
          {formVisible && (
            <div className="m-[12px_14px] bg-[#141414] border border-[#C8F13533] rounded-[12px] p-[14px] animate-[slide-down_0.25s_ease-out]">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-[8px] h-[8px] rounded-full bg-[#C8F135] shadow-[0_0_0_rgba(200,241,53,0.4)] animate-[pulse-pin_2s_infinite]"></div>
                <span className="text-[#C8F135] text-[12px] font-semibold tracking-wide">NEW STOP</span>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="block text-[#888] text-[11px] font-black uppercase mb-1 ml-1">STOP NAME *</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Rajapeth Bus Stand"
                    className="w-full bg-[#1A1A1A] border border-[#2A2A2A] rounded-[8px] p-[8px_10px] text-white text-[13px] outline-none focus:border-[#C8F135] transition-colors"
                    value={stopName}
                    onChange={e => setStopName(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleSave()}
                  />
                </div>

                <div>
                  <label className="block text-[#888] text-[11px] font-black uppercase mb-1 ml-1">ROUTE *</label>
                  <div className="flex gap-2 mb-2">
                    <button 
                      onClick={() => setCustomRoute(false)}
                      className={`flex-1 py-1 text-[11px] rounded-[6px] transition-all ${!customRoute ? "bg-[#C8F135] text-[#0F0F0F] font-semibold" : "bg-transparent text-[#888] border border-[#2A2A2A]"}`}
                    >
                      Preset
                    </button>
                    <button 
                      onClick={() => setCustomRoute(true)}
                      className={`flex-1 py-1 text-[11px] rounded-[6px] transition-all ${customRoute ? "bg-[#C8F135] text-[#0F0F0F] font-semibold" : "bg-transparent text-[#888] border border-[#2A2A2A]"}`}
                    >
                      Custom
                    </button>
                  </div>
                  {customRoute ? (
                    <input 
                      type="text" 
                      placeholder="e.g. Route 5 — Gandhi Nagar"
                      className="w-full bg-[#1A1A1A] border border-[#2A2A2A] rounded-[8px] p-[8px_10px] text-white text-[13px] outline-none focus:border-[#C8F135] transition-colors"
                      value={customRouteName}
                      onChange={e => setCustomRouteName(e.target.value)}
                    />
                  ) : (
                    <select 
                      className="w-full bg-[#1A1A1A] border border-[#2A2A2A] rounded-[8px] p-[8px_10px] text-white text-[13px] outline-none focus:border-[#C8F135] transition-colors"
                      value={route}
                      onChange={e => setRoute(e.target.value)}
                    >
                      <option>Route 1 — City Center</option>
                      <option>Route 2 — MIDC</option>
                      <option>Route 3 — Airport</option>
                      <option>Route 4 — University</option>
                    </select>
                  )}
                </div>

                <div>
                  <label className="block text-[#888] text-[11px] font-black uppercase mb-1 ml-1">COORDINATES (auto)</label>
                  <div className="flex gap-[6px]">
                    <input readOnly value={pendingPin?.lat.toFixed(6)} className="flex-1 bg-[#111] border border-[#1E1E1E] rounded-[8px] p-[7px_10px] text-[#555] text-[12px] font-mono outline-none" />
                    <input readOnly value={pendingPin?.lng.toFixed(6)} className="flex-1 bg-[#111] border border-[#1E1E1E] rounded-[8px] p-[7px_10px] text-[#555] text-[12px] font-mono outline-none" />
                  </div>
                </div>

                <div className="pt-1">
                  <button 
                    onClick={handleSave}
                    disabled={saving}
                    className={`w-full bg-[#C8F135] text-[#0F0F0F] rounded-[9px] py-[10px] text-[13px] font-bold transition-all ${saving ? "bg-[#8BAF25] cursor-not-allowed" : "hover:opacity-90"}`}
                  >
                    {saving ? "Saving..." : "Save Stop"}
                  </button>
                  <button 
                    onClick={handleCancel}
                    className="w-full bg-transparent text-[#888] border border-[#2A2A2A] rounded-[9px] py-[8px] text-[13px] mt-[7px] hover:bg-white/5 transition-all"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Section 3: DB Error Panel */}
          {dbError && (
            <div className="m-[10px_14px] bg-[#1A0A0A] border border-[#FF444433] rounded-[10px] p-[12px_14px]">
              <div className="text-[#FF4444] text-[13px] font-semibold">⚠ Database Table Missing</div>
              <p className="text-[#888] text-[11px] mt-1">Run this SQL in Supabase dashboard:</p>
              <pre className="mt-2 bg-[#111] border border-[#2A2A2A] rounded-[7px] p-[8px_10px] text-[#C8F135] text-[10px] font-mono whitespace-pre-wrap">
{`create table stops (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  route text not null,
  lat double precision not null,
  lng double precision not null,
  created_at timestamptz default now()
);`}
              </pre>
            </div>
          )}

          {/* Section 4: Search Input */}
          <div className="p-[10px_14px_6px]">
            <div className="relative">
              <span className="absolute left-[10px] top-1/2 -translate-y-1/2 text-[14px] text-[#555] pointer-events-none">🔍</span>
              <input 
                type="text" 
                placeholder="Filter stops..."
                className="w-full bg-[#1A1A1A] border border-[#2A2A2A] rounded-[8px] p-[8px_10px_8px_32px] text-white text-[13px] outline-none focus:border-[#C8F135] transition-colors"
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
          </div>

          {/* Section 5: Stop Count Line */}
          <div className="p-[4px_14px_6px] text-[#555] text-[11px]">
            {loading ? "Loading stops..." : `${filteredStops.length} of ${stops.length} stops`}
          </div>

          {/* Section 6: Scrollable Stop List */}
          <div className="p-[4px_14px_14px]">
            {loading ? (
              [1, 2, 3, 4].map(i => (
                <div key={i} className="bg-[#1A1A1A] rounded-[10px] border border-[#2A2A2A] border-l-4 border-l-[#2A2A2A] p-[12px_14px] mb-[8px] animate-[skeleton-pulse_1.5s_infinite]">
                  <div className="h-[13px] w-[65%] bg-[#2A2A2A] rounded-[6px] mb-2"></div>
                  <div className="h-[10px] w-[40%] bg-[#2A2A2A] rounded-[6px]"></div>
                </div>
              ))
            ) : filteredStops.length === 0 ? (
              <div className="flex flex-col items-center justify-center mt-10 text-center">
                <span className="text-[28px] mb-2">🗺️</span>
                <div className="text-[#555] text-[13px]">No stops found</div>
                {stops.length === 0 ? (
                  <p className="text-[#888] text-[11px] mt-1">Click the map to add the first stop</p>
                ) : (
                  <p className="text-[#888] text-[11px] mt-1">Try a different search</p>
                )}
              </div>
            ) : (
              filteredStops.map(stop => {
                const isSelected = selectedStop?.id === stop.id;
                const routeColor = getRouteColor(stop.route);
                return (
                  <div 
                    key={stop.id}
                    ref={el => { if (el) cardRefs.current.set(stop.id, el); }}
                    onClick={() => handleStopClick(stop)}
                    className={`group flex items-center gap-2 p-[11px_14px] mb-[7px] rounded-[10px] border transition-all cursor-pointer ${
                      isSelected 
                        ? "bg-[#1E2A1A] border-[#C8F135]/30 shadow-[0_4px_12px_rgba(0,0,0,0.5)]" 
                        : "bg-[#1A1A1A] border-[#2A2A2A] hover:bg-[#1F1F1F]"
                    }`}
                    style={{ borderLeft: `4px solid ${routeColor}` }}
                  >
                    <div className="flex-1 flex flex-col truncate">
                      <span className={`text-[13px] font-medium truncate ${isSelected ? "text-[#C8F135]" : "text-white"}`}>
                        {stop.name}
                      </span>
                      <span className="text-[#888] text-[11px] truncate">{stop.route}</span>
                    </div>
                    <div className="flex flex-col items-end gap-1 flex-shrink-0">
                      <div className="text-[9px] font-mono text-[#555] leading-none">{stop.lat.toFixed(4)}</div>
                      <div className="text-[9px] font-mono text-[#555] leading-none">{stop.lng.toFixed(4)}</div>
                    </div>
                    <div className="w-[28px] h-[28px] flex items-center justify-center flex-shrink-0 ml-1">
                      {deleting === stop.id ? (
                        <div className="w-4 h-4 border-2 border-[#FF4444] border-t-transparent rounded-full animate-spin"></div>
                      ) : (
                        <>
                          <span className="group-hover:hidden text-[14px] opacity-40">🚌</span>
                          <button 
                            onClick={(e) => handleDelete(e, stop.id)}
                            className="hidden group-hover:flex items-center justify-center w-full h-full bg-[#FF4444]/15 border border-[#FF4444]/25 rounded-[6px] text-[#FF4444] hover:bg-[#FF4444]/25 transition-all"
                          >
                            🗑
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </aside>

      {/* ─── RIGHT PANEL ────────────────────────────────────────────────── */}
      <main className="flex-1 relative h-full">
        <div className="absolute top-[12px] left-1/2 -translate-x-1/2 bg-[rgba(15,15,15,0.85)] border border-[#2A2A2A] rounded-[20px] p-[5px_14px] text-[#888] text-[11px] z-[1000] pointer-events-none font-semibold">
          Click anywhere to place a stop
        </div>

        <MapContainer 
          center={[20.9374, 77.7796]} 
          zoom={14} 
          zoomControl={false} 
          style={{ width: '100%', height: '100%' }}
        >
          <MapInstance mapRef={mapRef} />
          <TileLayer
            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>'
          />
          <MapClickHandler onMapClick={handleMapClick} />
          
          {stops.map(stop => (
            <StopMarker 
              key={stop.id}
              stop={stop}
              isSelected={selectedStop?.id === stop.id}
              onClick={handleStopClick}
            />
          ))}

          {pendingPin && (
            <Marker position={[pendingPin.lat, pendingPin.lng]} icon={PendingIcon()} />
          )}
        </MapContainer>
      </main>
    </div>
  );
}
