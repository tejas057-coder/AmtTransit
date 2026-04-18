import { useEffect, useRef, useState, useMemo } from 'react';
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
  latitude?: number;
  longitude?: number;
  role?: string;
  createdBy?: string;
  created_at?: string;
}

const ROUTE_COLORS: Record<string, string> = {
  'Route 1 — City Center': '#C8F135',
  'Route 2 — MIDC': '#7F77DD',
  'Route 3 — Airport': '#D85A30',
  'Route 4 — University': '#378ADD',
};

const PRESET_ROUTES = Object.keys(ROUTE_COLORS);

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
  const position: [number, number] = [stop.lat || stop.latitude || 0, stop.lng || stop.longitude || 0];

  useEffect(() => {
    if (isSelected && markerRef.current) {
      markerRef.current.openPopup();
    }
  }, [isSelected]);

  return (
    <Marker 
      ref={markerRef}
      position={position} 
      icon={StopIcon(stop.name, getRouteColor(stop.route))}
      eventHandlers={{
        click: () => onClick(stop)
      }}
    >
      <Popup closeButton={false}>
        <div style={{ fontFamily: "'DM Sans', sans-serif" }}>
          <div style={{ color: '#fff', fontSize: '13px', fontWeight: 600, marginBottom: '2px' }}>{stop.name}</div>
          <div style={{ color: '#888', fontSize: '11px', marginBottom: '4px' }}>{stop.route}</div>
          <div style={{ color: '#444', fontSize: '10px', fontFamily: 'monospace' }}>{position[0].toFixed(6)}, {position[1].toFixed(6)}</div>
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
  const [activeRouteFilter, setActiveRouteFilter] = useState('All');
  const [selectedStop, setSelectedStop] = useState<Stop | null>(null);
  const [editingStop, setEditingStop] = useState<Stop | null>(null);
  const [pendingPin, setPendingPin] = useState<{ lat: number; lng: number } | null>(null);
  const [formVisible, setFormVisible] = useState(false);
  const [stopName, setStopName] = useState('');
  const [route, setRoute] = useState('Route 1 — City Center');
  const [customRoute, setCustomRoute] = useState(false);
  const [customRouteName, setCustomRouteName] = useState('');
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);
  const mapRef = useRef<L.Map | null>(null);
  const { toast } = useToast();

  const cardRefs = useRef<Map<string, HTMLDivElement>>(new Map());

  const filteredStops = useMemo(() => {
    return stops
      .filter(s => activeRouteFilter === 'All' || s.route === activeRouteFilter)
      .filter(s =>
        s.name.toLowerCase().includes(search.toLowerCase()) ||
        s.route.toLowerCase().includes(search.toLowerCase())
      );
  }, [stops, activeRouteFilter, search]);

  const duplicateWarning = useMemo(() => {
    const finalRoute = customRoute ? customRouteName : route;
    if (!stopName || !finalRoute) return null;
    const exists = stops.find(s => 
      s.name.trim().toLowerCase() === stopName.trim().toLowerCase() && 
      s.route === finalRoute &&
      s.id !== editingStop?.id
    );
    return exists ? `Note: A stop with this name already exists on ${finalRoute.split(' — ')[0]}` : null;
  }, [stops, stopName, route, customRoute, customRouteName, editingStop]);

  const fetchStops = async (silent = false) => {
    if (!silent) setLoading(true);
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
        const normalized = (data || []).map((s: any) => ({
           ...s,
           lat: s.lat ?? s.latitude,
           lng: s.lng ?? s.longitude
        }));
        setStops(normalized);
      }
    } catch (err: any) {
      toast({ title: 'Error', description: err.message, variant: 'destructive' });
    } finally {
      if (!silent) setLoading(false);
    }
  };

  useEffect(() => {
    fetchStops();
  }, [toast]);

  useEffect(() => {
    const channel = supabase
      .channel('stops-realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'stops' }, (payload) => {
        if (payload.eventType === 'INSERT') {
          const newStop = { ...payload.new, lat: payload.new.lat ?? payload.new.latitude, lng: payload.new.lng ?? payload.new.longitude } as Stop;
          setStops(prev => {
            if (prev.find(s => s.id === newStop.id)) return prev;
            return [...prev, newStop];
          });
        }
        if (payload.eventType === 'DELETE') {
          setStops(prev => prev.filter(s => s.id !== payload.old.id));
        }
        if (payload.eventType === 'UPDATE') {
          const updStop = { ...payload.new, lat: payload.new.lat ?? payload.new.latitude, lng: payload.new.lng ?? payload.new.longitude } as Stop;
          setStops(prev => prev.map(s => s.id === updStop.id ? updStop : s));
        }
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const handleMapClick = (lat: number, lng: number) => {
    setPendingPin({ lat, lng });
    setEditingStop(null);
    setFormVisible(true);
    setValidationError(null);
  };

  const handleSave = async () => {
    const finalRoute = customRoute ? customRouteName : route;
    
    // VALIDATION (Issue #1)
    if (!stopName.trim()) {
      setValidationError("Stop Name is required");
      return;
    }
    
    if (!finalRoute || (!pendingPin && !editingStop)) {
        toast({ title: "Operation Error", description: "Route and Location are required", variant: "destructive" });
        return;
    }

    setSaving(true);
    setValidationError(null);
    try {
      const payload: any = {
        name: stopName.trim(),
        route: finalRoute,
        latitude: pendingPin?.lat ?? editingStop?.lat,
        longitude: pendingPin?.lng ?? editingStop?.lng,
        lat: pendingPin?.lat ?? editingStop?.lat,
        lng: pendingPin?.lng ?? editingStop?.lng,
        role: 'admin',
        createdBy: 'admin_panel'
      };
      
      let response;
      if (editingStop) {
        response = await supabase.from('stops').update(payload).eq('id', editingStop.id).select().single();
      } else {
        response = await supabase.from('stops').insert(payload).select().single();
      }

      if (response.error) throw response.error;

      toast({ title: editingStop ? "Stop updated" : "Stop saved" });
      handleCancel();
      fetchStops(true); // REFRESH LIST (Issue #3 partial - handled by state and realtime too)
    } catch (err: any) {
      toast({ title: "Operation failed", description: err.message, variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setPendingPin(null);
    setEditingStop(null);
    setFormVisible(false);
    setStopName('');
    setCustomRoute(false);
    setCustomRouteName('');
    setValidationError(null);
    setConfirmDelete(null);
  };

  const handleDelete = async (id: string) => {
    setDeleting(id);
    try {
      const { error } = await supabase.from('stops').delete().eq('id', id);
      if (error) throw error;
      toast({ title: "Stop deleted" });
      handleCancel();
    } catch (err: any) {
      toast({ title: "Failed to delete stop", description: err.message, variant: "destructive" });
    } finally {
      setDeleting(null);
    }
  };

  const handleEdit = (stop: Stop) => {
    setEditingStop(stop);
    setStopName(stop.name);
    setRoute(PRESET_ROUTES.includes(stop.route) ? stop.route : 'Route 1 — City Center');
    if (!PRESET_ROUTES.includes(stop.route)) {
        setCustomRoute(true);
        setCustomRouteName(stop.route);
    } else {
        setCustomRoute(false);
    }
    setFormVisible(true);
    setPendingPin(null);
    setValidationError(null);
  };

  const handleStopClick = (stop: Stop) => {
    setSelectedStop(stop);
    const pos: [number, number] = [stop.lat || stop.latitude || 0, stop.lng || stop.longitude || 0];
    mapRef.current?.flyTo(pos, 16, { animate: true, duration: 0.8 });
    
    // (Issue #4) Open edit mode when marker clicked
    handleEdit(stop);

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
        .leaflet-popup-content-wrapper { background: #1A1A1A !important; color: white !important; border: 1px solid #2A2A2A !important; border-radius: 8px !important; }
        .leaflet-popup-tip { background: #1A1A1A !important; }
      `}</style>

      {/* ─── LEFT PANEL ─────────────────────────────────────────────────── */}
      <aside className="w-[350px] flex-shrink-0 flex flex-col border-r border-[#1E1E1E] bg-[#0F0F0F] z-20 h-full">
        {/* Section 1: Header (Issue #8) */}
        <div className="p-[20px_18px_14px] border-b border-[#1E1E1E]">
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-2">
              <span className="text-[20px]">📍</span>
              <h1 className="text-[18px] font-semibold text-white">Stop Manager</h1>
            </div>
            <div className="bg-[#C8F135] text-[#0F0F0F] text-[11px] font-bold px-[9px] py-[2px] rounded-[20px] transition-all duration-300">
              {stops.length} stops
            </div>
          </div>
          <p className="text-[#555] text-[12px]">Click on the map to place a new stop</p>
        </div>

        {/* Section 2: Create/Edit Stop Form (Issue #4) */}
        <div className="overflow-y-auto flex-1 custom-scrollbar">
          {formVisible && (
            <div className="m-[12px_14px] bg-[#141414] border border-[#C8F13533] rounded-[12px] p-[14px] animate-[slide-down_0.25s_ease-out]">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-[8px] h-[8px] rounded-full bg-[#C8F135] shadow-[0_0_0_rgba(200,241,53,0.4)] animate-[pulse-pin_2s_infinite]"></div>
                <span className="text-[#C8F135] text-[12px] font-semibold tracking-wide uppercase">
                    {editingStop ? "EDIT STOP" : "NEW STOP"}
                </span>
              </div>

              <div className="space-y-3">
                {/* Field 1: Name (Issue #1) */}
                <div>
                  <label className="block text-[#888] text-[11px] font-black uppercase mb-1 ml-1">STOP NAME *</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Rajapeth Bus Stand"
                    className={`w-full bg-[#1A1A1A] border rounded-[8px] p-[8px_10px] text-white text-[13px] outline-none transition-all ${validationError ? "border-[#FF4444] shadow-[0_0_0_1px_#FF444433]" : "border-[#2A2A2A] focus:border-[#C8F135]"}`}
                    value={stopName}
                    onChange={e => { setStopName(e.target.value); if(validationError) setValidationError(null); }}
                  />
                  {validationError && <p className="text-[#FF4444] text-[10px] mt-1 ml-1 font-medium">{validationError}</p>}
                </div>

                {/* Field 2: Route & Duplicate Check (Issue #2) */}
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
                      {PRESET_ROUTES.map(r => <option key={r} value={r}>{r}</option>)}
                    </select>
                  )}
                  {duplicateWarning && (
                    <div className="mt-2 bg-[#C8F135]/5 border border-[#C8F135]/20 rounded-[8px] p-[8px_10px] flex gap-2 items-center">
                        <span className="text-[14px]">⚠️</span>
                        <p className="text-[#C8F135] text-[10px] font-medium leading-tight">{duplicateWarning}</p>
                    </div>
                  )}
                </div>

                {/* Field 3: Coordinates (Issue #7) */}
                <div>
                  <label className="block text-[#888] text-[11px] font-black uppercase mb-1 ml-1 flex items-center gap-1">
                    <span className="text-[10px]">📍</span> COORDINATES (AUTO)
                  </label>
                  <div className="flex gap-[6px]">
                    <div className="flex-1 relative group">
                        <input readOnly value={(pendingPin?.lat ?? editingStop?.lat ?? 0).toFixed(6)} className="w-full bg-[#111] border border-[#1E1E1E] rounded-[8px] p-[7px_10px] text-[#555] text-[12px] font-mono outline-none" />
                        <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] opacity-0 group-hover:opacity-40 transition-opacity">copy</span>
                    </div>
                    <div className="flex-1 relative group">
                        <input readOnly value={(pendingPin?.lng ?? editingStop?.lng ?? 0).toFixed(6)} className="w-full bg-[#111] border border-[#1E1E1E] rounded-[8px] p-[7px_10px] text-[#555] text-[12px] font-mono outline-none" />
                        <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] opacity-0 group-hover:opacity-40 transition-opacity">copy</span>
                    </div>
                  </div>
                </div>

                {/* Buttons (Issue #4 & Issue #5) */}
                <div className="pt-1 space-y-2">
                  <button 
                    onClick={handleSave}
                    disabled={saving}
                    className="w-full bg-[#C8F135] text-[#0F0F0F] rounded-[9px] py-[10px] text-[13px] font-bold transition-all hover:opacity-90 active:scale-[0.98]"
                  >
                    {saving ? "Processing..." : editingStop ? "Update Stop" : "Save Stop"}
                  </button>
                  
                  {editingStop && !confirmDelete && (
                     <button 
                        onClick={() => setConfirmDelete(editingStop.id)}
                        className="w-full bg-transparent text-[#FF4444] border border-[#FF444433] rounded-[9px] py-[8px] text-[13px] hover:bg-[#FF4444]/5 transition-all"
                    >
                        Delete Stop
                    </button>
                  )}

                  {confirmDelete && (
                    <div className="bg-[#FF4444]/5 border border-[#FF444433] rounded-[9px] p-2 animate-[slide-down_0.2s_ease-out]">
                        <p className="text-[#FF4444] text-[11px] font-bold text-center mb-2 uppercase tracking-tight">Are you sure about this?</p>
                        <div className="flex gap-2">
                            <button 
                                onClick={(e) => { e.stopPropagation(); handleDelete(confirmDelete); }}
                                disabled={deleting !== null}
                                className="flex-1 bg-[#FF4444] text-white rounded-[7px] py-[6px] text-[11px] font-bold hover:opacity-90"
                            >
                                Yes, Delete
                            </button>
                            <button 
                                onClick={() => setConfirmDelete(null)}
                                className="flex-1 bg-white/5 text-white rounded-[7px] py-[6px] text-[11px] border border-white/10"
                            >
                                Keep Stop
                            </button>
                        </div>
                    </div>
                  )}

                  <button 
                    onClick={handleCancel}
                    className="w-full bg-transparent text-[#888] border border-[#2A2A2A] rounded-[9px] py-[8px] text-[13px] hover:bg-white/5 transition-all"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Search & List Filter (Issue #3) */}
          <div className="p-[10px_14px_6px]">
            <div className="relative mb-3">
              <span className="absolute left-[10px] top-1/2 -translate-y-1/2 text-[14px] text-[#555] pointer-events-none">🔍</span>
              <input 
                type="text" 
                placeholder="Search by name..."
                className="w-full bg-[#1A1A1A] border border-[#2A2A2A] rounded-[8px] p-[8px_10px_8px_32px] text-white text-[13px] outline-none focus:border-[#C8F135] transition-colors"
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
            
            <div className="flex gap-2 pb-2 overflow-x-auto custom-scrollbar whitespace-nowrap">
                {['All', ...PRESET_ROUTES].map(r => (
                    <button
                        key={r}
                        onClick={() => setActiveRouteFilter(r)}
                        className={`px-[10px] py-[4px] rounded-full text-[10px] font-semibold border transition-all ${
                            activeRouteFilter === r
                                ? "bg-[#C8F135] text-[#0F0F0F] border-transparent"
                                : "bg-[#1A1A1A] text-[#555] border-[#2A2A2A] hover:text-white"
                        }`}
                    >
                        {r.split(' — ')[0]}
                    </button>
                ))}
            </div>
          </div>

          {/* List Status (Issue #3 Fixed) */}
          <div className="p-[4px_14px_6px] text-[#555] text-[11px] flex justify-between items-center">
            <span>{loading ? "Syncing database..." : `${filteredStops.length} of ${stops.length} stops available`}</span>
             <button onClick={() => fetchStops()} className="hover:text-white transition-colors">Refresh List</button>
          </div>

          {/* Stop Card List (Issue #3 realtime update verified) */}
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
                <div className="text-[#555] text-[13px]">No stops matching criteria</div>
              </div>
            ) : (
              filteredStops.map(stop => {
                const isSelected = selectedStop?.id === stop.id;
                const routeColor = getRouteColor(stop.route);
                const pos = { lat: stop.lat || stop.latitude || 0, lng: stop.lng || stop.longitude || 0 };
                return (
                  <div 
                    key={stop.id}
                    ref={el => { if (el) cardRefs.current.set(stop.id, el); }}
                    onClick={() => handleStopClick(stop)}
                    className={`group flex items-center gap-2 p-[11px_14px] mb-[7px] rounded-[10px] border transition-all cursor-pointer ${
                      isSelected 
                        ? "bg-[#1E2A1A] border-[#C8F135]/30 shadow-[0_4px_12px_rgba(0,0,0,0.5)] scale-[1.02]" 
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
                      <div className="text-[9px] font-mono text-[#555] leading-none">{pos.lat.toFixed(4)}</div>
                      <div className="text-[9px] font-mono text-[#555] leading-none">{pos.lng.toFixed(4)}</div>
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
        {/* Map Legend (Issue #6) */}
        <div className="absolute top-[12px] right-[12px] bg-[rgba(15,15,15,0.9)] border border-[#2A2A2A] rounded-[12px] p-[10px_14px] z-[1000] shadow-2xl backdrop-blur-md">
            <h3 className="text-[10px] font-black uppercase text-[#888] mb-2 tracking-widest">Route Legend</h3>
            <div className="space-y-2">
                {PRESET_ROUTES.map(r => (
                    <div key={r} className="flex items-center gap-2">
                        <div className="w-[8px] h-[8px] rounded-full" style={{ backgroundColor: getRouteColor(r) }}></div>
                        <span className="text-[10px] font-medium text-white/80">{r.split(' — ')[1]}</span>
                    </div>
                ))}
                 <div className="flex items-center gap-2 pt-1 border-t border-white/5">
                    <div className="w-[8px] h-[8px] rounded-full bg-[#888]"></div>
                    <span className="text-[10px] font-medium text-white/50">Custom</span>
                </div>
            </div>
        </div>

        <div className="absolute top-[12px] left-1/2 -translate-x-1/2 bg-[rgba(15,15,15,0.85)] border border-[#2A2A2A] rounded-[20px] p-[5px_14px] text-[#888] text-[11px] z-[1000] pointer-events-none font-semibold shadow-xl">
          Click map to place stop • Click marker to edit
        </div>

        <MapContainer 
          center={[20.9374, 77.7796]} 
          zoom={13} 
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
