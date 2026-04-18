import { useEffect, useRef, useState, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { supabase } from '../lib/supabase';
import { useToast } from '../hooks/use-toast';

// ─── Constants & Types ───────────────────────────────────────────────────────

interface Stop {
  id: string;
  stop_name: string;
  stop_code: string;
  zone: string;
  latitude: number;
  longitude: number;
  is_active: boolean;
  created_at?: string;
  name?: string;
  lat?: number;
  lng?: number;
}

const ZONE_COLORS: Record<string, string> = {
  'Civil Lines': '#C8F135',
  'Rajapeth': '#7F77DD',
  'Badnera': '#D85A30',
  'Camp': '#378ADD',
  'MIDC': '#FF9F1C',
  'University': '#2EC4B6'
};

const getZoneColor = (zone: string) => ZONE_COLORS[zone] ?? '#888888';

// ─── Helper Components ───────────────────────────────────────────────────────

const MapInstance = ({ mapRef }: { mapRef: React.MutableRefObject<L.Map | null> }) => {
  const map = useMap();
  useEffect(() => {
    if (map) mapRef.current = map;
  }, [map, mapRef]);
  return null;
};

const MapClickHandler = ({ onMapClick, enabled }: { onMapClick: (lat: number, lng: number) => void, enabled: boolean }) => {
  useMapEvents({
    click: (e) => {
      if (enabled) onMapClick(e.latlng.lat, e.latlng.lng);
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
          ">Place Here</div>
        </div>
      `,
      iconAnchor: [7, 7],
    });
};

const StopMarker = ({ stop, isSelected, onClick }: { stop: Stop, isSelected: boolean, onClick: (stop: Stop) => void }) => {
  const markerRef = useRef<L.Marker | null>(null);
  const position: [number, number] = [stop.latitude, stop.longitude];

  useEffect(() => {
    if (isSelected && markerRef.current) {
      markerRef.current.openPopup();
    }
  }, [isSelected]);

  return (
    <Marker 
      ref={markerRef}
      position={position} 
      icon={StopIcon(stop.stop_name || stop.name || 'Stop', getZoneColor(stop.zone))}
      eventHandlers={{
        click: () => onClick(stop)
      }}
    >
      <Popup closeButton={false}>
        <div className="p-1">
          <div className="text-white font-bold text-sm mb-0.5">{stop.stop_name || stop.name}</div>
          <div className="text-gray-400 text-[10px] mb-1 uppercase tracking-wider">{stop.zone} • {stop.stop_code}</div>
          <div className={`text-[9px] font-black inline-block px-1.5 py-0.5 rounded ${stop.is_active ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-500'}`}>
            {stop.is_active ? 'ACTIVE' : 'INACTIVE'}
          </div>
        </div>
      </Popup>
    </Marker>
  );
};

// ─── Main Component ──────────────────────────────────────────────────────────

export default function StopMapEditor() {
  const [stops, setStops] = useState<Stop[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'map' | 'table'>('map');
  const [placementMode, setPlacementMode] = useState(false);
  const [search, setSearch] = useState('');
  const [activeZoneFilter, setActiveZoneFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Active' | 'Inactive'>('All');
  
  const [selectedStop, setSelectedStop] = useState<Stop | null>(null);
  const [editingStop, setEditingStop] = useState<Stop | null>(null);
  const [pendingPin, setPendingPin] = useState<{ lat: number; lng: number } | null>(null);
  const [formVisible, setFormVisible] = useState(false);
  
  const [stopName, setStopName] = useState('');
  const [stopCode, setStopCode] = useState('');
  const [zone, setZone] = useState('Civil Lines');
  const [isActive, setIsActive] = useState(true);
  
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [recentlySavedId, setRecentlySavedId] = useState<string | null>(null);
  
  const mapRef = useRef<L.Map | null>(null);
  const { toast } = useToast();
  const cardRefs = useRef<Map<string, HTMLDivElement>>(new Map());

  const filteredStops = useMemo(() => {
    return stops
      .filter(s => activeZoneFilter === 'All' || s.zone === activeZoneFilter)
      .filter(s => {
          if (statusFilter === 'All') return true;
          if (statusFilter === 'Active') return s.is_active;
          return !s.is_active;
      })
      .filter(s =>
        (s.stop_name || s.name || '').toLowerCase().includes(search.toLowerCase()) ||
        (s.stop_code || '').toLowerCase().includes(search.toLowerCase()) ||
        (s.zone || '').toLowerCase().includes(search.toLowerCase())
      );
  }, [stops, activeZoneFilter, statusFilter, search]);

  const stats = useMemo(() => ({
    total: stops.length,
    active: stops.filter(s => s.is_active).length,
    inactive: stops.filter(s => !s.is_active).length
  }), [stops]);

  const fetchStops = async (silent = false) => {
    if (!silent) setLoading(true);
    try {
      console.log('Fetching stops from backend API...');
      
      // Fetch from backend API instead of direct Supabase
      const response = await fetch('http://localhost:5000/api/stops');
      const result = await response.json();
      
      console.log('Backend response:', result);
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to fetch stops');
      }
      
      const data = result.data || [];
      console.log(`Found ${data.length} stops in database`);
      
      const normalized = data.map((s: any) => ({
           ...s,
           stop_name: s.stop_name || s.name || 'Unknown Stop',
           stop_code: s.stop_code || `STP-${s.id.slice(0,4)}`,
           latitude: s.latitude ?? s.lat ?? 0,
           longitude: s.longitude ?? s.lng ?? 0,
           is_active: s.is_active ?? true,
           zone: s.zone || 'Other'
      }));
      
      console.log('Normalized stops:', normalized);
      setStops(normalized);
    } catch (err: any) {
      console.error("Fetch stops error:", err.message);
      toast({ 
        title: "Failed to load stops", 
        description: err.message || "Make sure backend server is running",
        variant: "destructive" 
      });
    } finally {
      if (!silent) setLoading(false);
    }
  };

  useEffect(() => {
    fetchStops();
  }, [toast]);

  const handleAddButtonClick = () => {
    setPlacementMode(true);
    setFormVisible(false);
    setPendingPin(null);
    setEditingStop(null);
    toast({ 
        title: "Manual Creation Started", 
        description: "Click anywhere on the map to set the stop location.",
    });
  };

  const handleMapClick = (lat: number, lng: number) => {
    console.log('Map clicked at:', lat, lng);
    setPendingPin({ lat, lng });
    setEditingStop(null);
    setPlacementMode(false);
    setFormVisible(true);
    setValidationError(null);
    setStopName('');
    setStopCode('');
    setZone('Civil Lines');
    setIsActive(true);
    toast({ 
        title: "Location Marked", 
        description: `Pin placed at ${lat.toFixed(5)}, ${lng.toFixed(5)}. Fill in the details below.`,
    });
  };

  const handleSave = async () => {
    if (!stopName.trim() || !stopCode.trim()) {
      setValidationError("Name and Code are required");
      return;
    }
    
    if (!pendingPin && !editingStop) {
      setValidationError("Please click on the map to place a pin first");
      toast({ 
        title: "Location Required", 
        description: "Click anywhere on the map to mark the stop location before saving.",
        variant: "destructive"
      });
      return;
    }
    
    const finalLat = pendingPin?.lat ?? editingStop?.latitude;
    const finalLng = pendingPin?.lng ?? editingStop?.longitude;
    
    console.log('Saving stop with coordinates:', finalLat, finalLng);
    
    if (!finalLat || !finalLng) {
      setValidationError("Invalid coordinates");
      toast({ 
        title: "Error", 
        description: "Coordinates are missing or invalid.",
        variant: "destructive"
      });
      return;
    }
    
    setSaving(true);
    try {
      const payload = {
        stop_name: stopName.trim(),
        stop_code: stopCode.trim().toUpperCase(),
        zone: zone,
        latitude: finalLat,
        longitude: finalLng,
        is_active: isActive
      };
      
      console.log('Sending payload:', payload);
      
      let url = 'http://localhost:5000/api/stops';
      let method = 'POST';

      if (editingStop) {
        url = `http://localhost:5000/api/stops/${editingStop.id}`;
        method = 'PUT';
      }

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const result = await response.json();
      console.log('Server response:', result);

      if (!response.ok || !result.success) {
        throw new Error(result.error || "Server rejection");
      }

      toast({ 
        title: editingStop ? "Stop Updated" : "Stop Created", 
        description: `Successfully saved ${stopName} to database.`,
      });
      
      const newStopId = result.data?.id || editingStop?.id;
      handleCancel();
      await fetchStops(true);
      
      // Highlight the newly saved/updated stop
      if (newStopId) {
        setRecentlySavedId(newStopId);
        setTimeout(() => setRecentlySavedId(null), 3000); // Remove highlight after 3 seconds
        
        // Auto-scroll to the new stop card
        setTimeout(() => {
          const card = cardRefs.current.get(newStopId);
          if (card) {
            card.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
        }, 100);
      }
    } catch (err: any) {
      console.error("Save error:", err);
      toast({ 
        title: "Failed to save", 
        description: err.message || "Check if backend server is running and database table exists.", 
        variant: "destructive" 
      });
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setPendingPin(null);
    setEditingStop(null);
    setPlacementMode(false);
    setFormVisible(false);
    setStopName('');
    setStopCode('');
    setValidationError(null);
    setConfirmDelete(null);
  };

  const handleDelete = async (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setDeleting(id);
    try {
      const { error } = await supabase.from('stops').delete().eq('id', id);
      if (error) throw error;
      toast({ title: "Stop removed" });
      handleCancel();
      fetchStops(true);
    } catch (err: any) {
      toast({ title: "Operation failed", description: err.message, variant: "destructive" });
    } finally {
      setDeleting(null);
    }
  };

  const handleEdit = (stop: Stop, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setEditingStop(stop);
    setStopName(stop.stop_name || stop.name || '');
    setStopCode(stop.stop_code || '');
    setZone(stop.zone || 'Civil Lines');
    setIsActive(stop.is_active);
    setFormVisible(true);
    setPendingPin(null);
    setValidationError(null);
    setPlacementMode(false);
  };

  const handleStopClick = (stop: Stop) => {
    setSelectedStop(stop);
    const pos: [number, number] = [stop.latitude, stop.longitude];
    if (viewMode === 'map') {
        mapRef.current?.flyTo(pos, 16, { animate: true, duration: 0.8 });
    }
    handleEdit(stop);

    const card = cardRefs.current.get(stop.id);
    if (card) {
      card.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  };

  return (
    <div className="flex w-full h-[calc(100vh-56px)] bg-[#0F0F0F] text-white overflow-hidden font-['DM_Sans',_sans-serif]">
      <style>{`
        @keyframes slide-down { from { opacity: 0; transform: translateY(-8px); } to { opacity: 1; transform: translateY(0); } }
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #2A2A2A; border-radius: 4px; }
        .leaflet-container { cursor: crosshair !important; height: 100% !important; background: #0D0D0D !important; }
        .leaflet-popup-content-wrapper { background: #1A1A1A !important; color: white !important; border-radius: 12px !important; border: 1px solid #2A2A2A !important; }
      `}</style>

      {/* ─── LEFT PANEL ─────────────────────────────────────────────────── */}
      <aside className="w-[380px] flex-shrink-0 flex flex-col border-r border-[#1E1E1E] bg-[#0F0F0F] z-20 h-full">
        {/* Header Controls */}
        <div className="p-6 border-b border-[#1E1E1E]">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-xl font-black text-white tracking-tight">Stop Manager</h1>
            <div className="flex bg-[#1A1A1A] p-1 rounded-xl border border-[#2A2A2A]">
                <button 
                    onClick={() => setViewMode('map')}
                    className={`px-3 py-1.5 rounded-lg text-[10px] font-black transition-all ${viewMode === 'map' ? 'bg-[#C8F135] text-[#0F0F0F]' : 'text-[#555] hover:text-white'}`}
                >MAP</button>
                <button 
                    onClick={() => setViewMode('table')}
                    className={`px-3 py-1.5 rounded-lg text-[10px] font-black transition-all ${viewMode === 'table' ? 'bg-[#C8F135] text-[#0F0F0F]' : 'text-[#555] hover:text-white'}`}
                >TABLE</button>
            </div>
          </div>
          
          <button 
            onClick={handleAddButtonClick}
            className={`w-full group relative overflow-hidden rounded-2xl py-3.5 mb-4 text-xs font-black uppercase tracking-[0.2em] transition-all active:scale-[0.98] ${placementMode ? 'bg-[#333] text-[#777] border border-[#444]' : 'bg-[#C8F135] text-[#0F0F0F] shadow-lg shadow-[#C8F13522]'}`}
          >
            {placementMode ? "CLICK MAP TO PLACE..." : "+ Create New Stop"}
          </button>

          <div className="grid grid-cols-3 gap-2">
            <div className="bg-[#141414] p-2 rounded-xl border border-[#1E1E1E] text-center">
                <div className="text-[9px] font-black text-[#444] uppercase mb-1">Total</div>
                <div className="text-lg font-black text-white">{stats.total}</div>
            </div>
            <div className="bg-[#141414] p-2 rounded-xl border border-[#1E1E1E] text-center border-b-2 border-b-green-500/30">
                <div className="text-[9px] font-black text-[#666] uppercase mb-1">Active</div>
                <div className="text-lg font-black text-green-400">{stats.active}</div>
            </div>
            <div className="bg-[#141414] p-2 rounded-xl border border-[#1E1E1E] text-center border-b-2 border-b-red-500/30">
                <div className="text-[9px] font-black text-[#666] uppercase mb-1">Off</div>
                <div className="text-lg font-black text-red-500">{stats.inactive}</div>
            </div>
          </div>
        </div>

        {/* Form Overlay Section */}
        <div className="overflow-y-auto flex-1 custom-scrollbar">
          {formVisible && (
            <div className="m-4 bg-[#141414] border border-[#C8F13533] rounded-2xl p-5 animate-[slide-down_0.25s_ease-out] shadow-2xl ring-1 ring-white/5 mx-6">
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-[#C8F135] animate-pulse"></div>
                    <span className="text-[#C8F135] text-[10px] font-black uppercase tracking-[0.2em]">
                        {editingStop ? "EDIT STOP" : "NEW STOP"}
                    </span>
                </div>
                <button onClick={handleCancel} className="text-[#333] hover:text-white transition-colors">✕</button>
              </div>

              <div className="space-y-4">
                <div>
                    <label className="block text-[#444] text-[9px] font-black uppercase mb-1 ml-1">Stop Name *</label>
                    <input 
                        type="text" 
                        className={`w-full bg-[#1A1A1A] border rounded-xl p-3 text-white text-xs outline-none transition-all ${validationError ? "border-red-500" : "border-[#2A2A2A] focus:border-[#C8F135]"}`}
                        value={stopName}
                        onChange={e => { setStopName(e.target.value); if(validationError) setValidationError(null); }}
                    />
                </div>
                <div className="grid grid-cols-2 gap-3">
                    <div>
                        <label className="block text-[#444] text-[9px] font-black uppercase mb-1 ml-1">Stop Code *</label>
                        <input 
                            type="text" 
                            className="w-full bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl p-3 text-white text-xs font-mono outline-none focus:border-[#C8F135]"
                            value={stopCode}
                            onChange={e => setStopCode(e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="block text-[#444] text-[9px] font-black uppercase mb-1 ml-1">Zone</label>
                        <select 
                            className="w-full bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl p-3 text-white text-xs outline-none focus:border-[#C8F135] cursor-pointer"
                            value={zone}
                            onChange={e => setZone(e.target.value)}
                        >
                            {Object.keys(ZONE_COLORS).map(z => <option key={z} value={z}>{z}</option>)}
                        </select>
                    </div>
                </div>

                <div className="flex items-center justify-between p-3 bg-[#1A1A1A] rounded-xl border border-[#2A2A2A]">
                    <span className="text-[10px] font-bold text-[#555] uppercase">Operational</span>
                    <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" checked={isActive} onChange={e => setIsActive(e.target.checked)} />
                        <div className="w-9 h-5 bg-[#333] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-[#666] after:border-gray-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-[#C8F135] peer-checked:after:bg-black"></div>
                    </label>
                </div>

                <div className="pt-2 space-y-2">
                  <button 
                    onClick={handleSave}
                    disabled={saving}
                    className="w-full bg-[#C8F135] text-[#0F0F0F] rounded-xl py-3.5 text-xs font-black uppercase tracking-[0.1em] shadow-lg shadow-[#C8F13511] transition-all hover:brightness-110"
                  >
                    {saving ? "SAVING..." : "COMMIT TO DATABASE"}
                  </button>
                  
                  {editingStop && !confirmDelete && (
                    <button onClick={() => setConfirmDelete(editingStop.id)} className="w-full text-red-500 py-1 text-[9px] font-black uppercase tracking-widest hover:bg-red-500/5 rounded-lg">Delete Permanently</button>
                  )}
                  {confirmDelete && (
                    <div className="flex gap-2 animate-in slide-in-from-top-2 duration-200">
                        <button onClick={() => handleDelete(confirmDelete)} className="flex-1 bg-red-600 text-white py-2 rounded-lg text-[9px] font-black uppercase">Yes, Kill it</button>
                        <button onClick={() => setConfirmDelete(null)} className="flex-1 bg-[#222] text-white py-2 rounded-lg text-[9px] font-black uppercase">Cancel</button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Search & List */}
          <div className="p-4 space-y-4">
            <div className="space-y-2">
                <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm opacity-20">🔍</span>
                    <input 
                        type="text" 
                        placeholder="Search name, code, or zone..."
                        className="w-full bg-[#141414] border border-[#1E1E1E] rounded-2xl p-4 pl-12 text-white text-xs outline-none focus:border-[#C8F135] shadow-inner placeholder:text-[#333]"
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                    />
                </div>
                
                <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar px-1">
                    {['All', 'Active', 'Inactive'].map(s => (
                        <button 
                            key={s}
                            onClick={() => setStatusFilter(s as any)}
                            className={`px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest border transition-all ${
                                statusFilter === s ? 'bg-white text-black border-white' : 'text-[#444] border-transparent hover:text-[#888]'
                            }`}
                        >{s}</button>
                    ))}
                </div>
            </div>

            <div className="space-y-2 pb-10">
              {filteredStops.map(stop => {
                const isSelected = selectedStop?.id === stop.id;
                const isRecentlySaved = recentlySavedId === stop.id;
                const zoneColor = getZoneColor(stop.zone);
                return (
                  <div 
                    key={stop.id}
                    ref={el => { if (el) cardRefs.current.set(stop.id, el); }}
                    onClick={() => handleStopClick(stop)}
                    className={`group relative p-4 rounded-2xl border transition-all cursor-pointer overflow-hidden ${
                      isRecentlySaved
                        ? "bg-[#C8F135]/10 border-[#C8F135] shadow-2xl shadow-[#C8F135]/20 animate-pulse"
                        : isSelected 
                          ? "bg-[#1A1A1A] border-[#C8F13533] shadow-2xl" 
                          : "bg-[#141414] border-[#1E1E1E] hover:border-[#2A2A2A]"
                    }`}
                  >
                    <div 
                        className="absolute left-0 top-0 w-1 h-full opacity-60"
                        style={{ backgroundColor: zoneColor }}
                    ></div>
                    
                    <div className="flex justify-between items-start mb-2">
                        <div className="flex flex-col">
                            <div className="flex items-center gap-2">
                                <span className={`text-[13px] font-bold leading-tight ${isSelected || isRecentlySaved ? "text-[#C8F135]" : "text-white"}`}>
                                    {stop.stop_name || stop.name}
                                </span>
                                {isRecentlySaved && (
                                    <span className="text-[8px] font-black uppercase bg-[#C8F135] text-black px-2 py-0.5 rounded-full animate-pulse">
                                        ✓ Saved
                                    </span>
                                )}
                            </div>
                            <span className="text-[9px] font-mono text-[#444] uppercase font-black">{stop.stop_code}</span>
                        </div>
                        
                        {/* Quick Action Icons visible on hover/select */}
                        <div className={`flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity ${isSelected ? 'opacity-100' : ''}`}>
                            <button 
                                onClick={(e) => handleEdit(stop, e)}
                                className="w-7 h-7 flex items-center justify-center bg-[#222] border border-white/5 rounded-lg hover:bg-[#C8F135] hover:text-black transition-all"
                            >✏️</button>
                            <button 
                                onClick={(e) => handleDelete(stop.id, e)}
                                className="w-7 h-7 flex items-center justify-center bg-[#222] border border-white/5 rounded-lg hover:bg-red-600 hover:text-white transition-all text-[10px]"
                            >🗑️</button>
                        </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                        <span className="text-[9px] text-[#555] font-black uppercase tracking-widest leading-none">{stop.zone}</span>
                        <div className={`flex items-center gap-1.5`}>
                            <span className={`text-[8px] font-black uppercase ${stop.is_active ? 'text-green-500' : 'text-red-500'}`}>{stop.is_active ? 'ON' : 'OFF'}</span>
                            <div className={`w-1 h-1 rounded-full ${stop.is_active ? 'bg-green-500 shadow-[0_0_8px_#22C55E]' : 'bg-red-500 shadow-[0_0_8px_#EF4444]'}`}></div>
                        </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </aside>

      {/* ─── RIGHT PANEL ────────────────────────────────────────────────── */}
      <main className="flex-1 relative h-full">
        {loading && (
            <div className="absolute inset-0 z-[2000] bg-[#0F0F0F] flex items-center justify-center opacity-80">
                <div className="w-8 h-8 border-2 border-[#C8F135] border-t-transparent rounded-full animate-spin"></div>
            </div>
        )}

        {viewMode === 'map' ? (
            <MapContainer 
              center={[20.9374, 77.7796]} 
              zoom={13} 
              zoomControl={false} 
              style={{ width: '100%', height: '100%', zIndex: 1 }}
            >
              <MapInstance mapRef={mapRef} />
              <TileLayer
                url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                attribution='&copy; CARTO'
              />
              <MapClickHandler onMapClick={handleMapClick} enabled={placementMode} />
              
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
        ) : (
            <div className="w-full h-full bg-[#111] p-10 overflow-y-auto no-scrollbar animate-in zoom-in-95 duration-300">
                <div className="max-w-6xl mx-auto">
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex flex-col">
                            <h2 className="text-3xl font-black text-white tracking-tighter">Transit Points Registry</h2>
                            <p className="text-[#555] text-xs font-bold uppercase tracking-widest">Database State History</p>
                        </div>
                        <button 
                            onClick={handleAddButtonClick}
                            className="bg-[#C8F135] text-black px-6 py-2.5 rounded-2xl text-[11px] font-black uppercase tracking-widest shadow-xl shadow-[#C8F13511]"
                        >+ New Entry</button>
                    </div>

                    <div className="bg-[#141414] border border-[#1E1E1E] rounded-3xl overflow-hidden shadow-2xl">
                        <table className="w-full text-left">
                            <thead className="bg-[#1A1A1A] border-b border-[#2A2A2A]">
                                <tr>
                                    <th className="px-6 py-5 text-[9px] font-black text-[#555] uppercase tracking-widest text-center w-16">PIN</th>
                                    <th className="px-6 py-5 text-[9px] font-black text-[#555] uppercase tracking-widest">Identifier</th>
                                    <th className="px-6 py-5 text-[9px] font-black text-[#555] uppercase tracking-widest">Description</th>
                                    <th className="px-6 py-5 text-[9px] font-black text-[#555] uppercase tracking-widest">Zone</th>
                                    <th className="px-6 py-5 text-[9px] font-black text-[#555] uppercase tracking-widest">Status</th>
                                    <th className="px-6 py-5 text-[9px] font-black text-[#555] uppercase tracking-widest text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#1E1E1E]">
                                {filteredStops.map(stop => (
                                    <tr 
                                        key={stop.id} 
                                        className="hover:bg-white/[0.02] transition-all group"
                                    >
                                        <td className="px-6 py-5 text-center">
                                            <div className="w-2 h-2 rounded-full mx-auto" style={{ backgroundColor: getZoneColor(stop.zone) }}></div>
                                        </td>
                                        <td className="px-6 py-5 font-mono text-[10px] text-[#C8F135]/60">{stop.stop_code}</td>
                                        <td className="px-6 py-5">
                                            <div className="text-[13px] font-bold text-white mb-0.5">{stop.stop_name || stop.name}</div>
                                            <div className="text-[9px] font-mono text-[#333]">{(stop.latitude).toFixed(5)}, {(stop.longitude).toFixed(5)}</div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <span className="text-[10px] font-bold text-[#666] uppercase tracking-tighter">{stop.zone}</span>
                                        </td>
                                        <td className="px-6 py-5">
                                            <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase ${stop.is_active ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-500'}`}>
                                                {stop.is_active ? 'Active' : 'Offline'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-5 text-right">
                                            <div className="flex gap-2 justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button onClick={() => handleEdit(stop)} className="p-2 hover:bg-white/5 rounded-lg transition-all">✏️</button>
                                                <button onClick={() => handleDelete(stop.id)} className="p-2 hover:bg-red-500/10 rounded-lg text-red-500">🗑️</button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        )}

        {placementMode && (
            <div className="absolute inset-0 z-[1001] bg-[#C8F135]/5 pointer-events-none ring-inset ring-8 ring-[#C8F135]/20 animate-pulse">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-black text-[#C8F135] px-8 py-4 rounded-3xl text-xs font-black uppercase tracking-[0.3em] shadow-2xl skew-x-[-12deg] border border-[#C8F13533]">
                    PLACEMENT MODE ENABLED
                </div>
            </div>
        )}
      </main>
    </div>
  );
}
