import React, { useEffect, useMemo, useRef, useState } from 'react';
import { MapContainer, Marker, TileLayer, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { MapPin, Trash2, Search, X, Plus, Save, Loader2 } from 'lucide-react';
import { supabase } from '../lib/supabase';

// ─── Constants ───────────────────────────────────────────────────────────────
const AMRAVATI_CENTER: [number, number] = [20.9374, 77.7796];
const RAPIDO_ACCENT = "#C8F135";
const RAPIDO_BG = "#0F0F0F";
const RAPIDO_SURFACE = "#1A1A1A";

// ─── Types ──────────────────────────────────────────────────────────────────
type Stop = {
  id: string;
  name: string;
  route: string;
  lat: number;
  lng: number;
  created_at?: string;
};

// ─── Map Click Listener ──────────────────────────────────────────────────────
const MapClickListener: React.FC<{ onMapClick: (lat: number, lng: number) => void }> = ({ onMapClick }) => {
  useMapEvents({
    click(e) {
      onMapClick(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
};

// ─── Custom Marker Icon ──────────────────────────────────────────────────────
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
        ">${stopName}</div>
      </div>
    `,
    iconSize: [14, 14],
    iconAnchor: [7, 7], // Center of the 14x14 circle
    popupAnchor: [0, -10],
  });
};

const StopMapEditor: React.FC = () => {
  const [stops, setStops] = useState<Stop[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [newStopPos, setNewStopPos] = useState<{ lat: number; lng: number } | null>(null);
  const [stopName, setStopName] = useState('');
  const [stopRoute, setStopRoute] = useState('');
  const [saving, setSaving] = useState(false);
  const [errorStatus, setErrorStatus] = useState<string | null>(null);

  // ─── Data Actions ──────────────────────────────────────────────────────────
  const fetchStops = async () => {
    try {
      const { data, error } = await supabase
        .from('stops')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        if (error.code === 'PGRST205') setErrorStatus('TABLE_MISSING');
        throw error;
      }
      setStops(data || []);
      setErrorStatus(null);
    } catch (err) {
      console.error('Fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStops();
  }, []);

  const handleMapClick = (lat: number, lng: number) => {
    setNewStopPos({ lat, lng });
    setStopName('');
    setStopRoute('');
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!stopName || !stopRoute || !newStopPos) return;
    setSaving(true);
    try {
      const { error } = await supabase.from('stops').insert({
        name: stopName,
        route: stopRoute,
        lat: newStopPos.lat,
        lng: newStopPos.lng
      });
      if (error) throw error;
      
      setShowModal(false);
      fetchStops();
    } catch (err) {
      alert('Error saving stop');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this stop?')) return;
    try {
      const { error } = await supabase.from('stops').delete().eq('id', id);
      if (error) throw error;
      fetchStops();
    } catch (err) {
      alert('Error deleting stop');
    }
  };

  const filteredStops = stops.filter(s => 
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    s.route.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex h-screen bg-[#0F0F0F] text-white font-['DM_Sans']">
      <style>{`
        .leaflet-container { background: #0D0D0D; }
        .stops-panel-scroll::-webkit-scrollbar { width: 4px; }
        .stops-panel-scroll::-webkit-scrollbar-track { background: transparent; }
        .stops-panel-scroll::-webkit-scrollbar-thumb { background: #2A2A2A; border-radius: 4px; }
      `}</style>
      
      {/* ── Sidebar ───────────────────────────────────────────────────────── */}
      <aside className="w-80 border-r border-white/5 bg-[#111111] flex flex-col z-20">
        <div className="p-6 border-b border-white/5">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-[#C8F135]/10 p-2 rounded-xl">
              <MapPin className="text-[#C8F135] w-5 h-5" />
            </div>
            <h1 className="text-xl font-bold tracking-tight">Stop Manager</h1>
          </div>
          
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
            <input 
              type="text" 
              placeholder="Filter stops..."
              className="w-full bg-[#1A1A1A] border border-white/5 rounded-xl py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:border-[#C8F135]/50 transition-colors"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto stops-panel-scroll p-4 space-y-2">
          {loading ? (
            <div className="flex justify-center py-10"><Loader2 className="animate-spin text-white/20" /></div>
          ) : filteredStops.length === 0 ? (
            <div className="text-center py-10 text-white/20 text-sm">No stops found</div>
          ) : (
            filteredStops.map(stop => (
              <div key={stop.id} className="group relative bg-[#1A1A1A] border border-white/5 p-4 rounded-xl hover:border-[#C8F135]/30 transition-all">
                <div className="pr-10">
                  <div className="font-bold text-sm truncate">{stop.name}</div>
                  <div className="text-[10px] text-white/40 uppercase tracking-widest font-black mt-1">Route: {stop.route}</div>
                </div>
                <button 
                  onClick={() => handleDelete(stop.id)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-2 opacity-0 group-hover:opacity-100 hover:bg-red-500/10 hover:text-red-500 rounded-lg transition-all"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))
          )}
        </div>
        
        <div className="p-6 border-t border-white/5 bg-[#0F0F0F]">
          {errorStatus === 'TABLE_MISSING' ? (
            <div className="text-red-400 text-[9px] text-center uppercase tracking-widest font-bold">
              Database Table Missing! Run SQL Setup.
            </div>
          ) : (
            <div className="text-[10px] text-white/30 text-center uppercase tracking-widest font-black">
              Click Map to Add Stop
            </div>
          )}
        </div>
      </aside>

      {/* ── Map ───────────────────────────────────────────────────────────── */}
      <main className="flex-1 relative cursor-crosshair">
        <MapContainer 
          center={AMRAVATI_CENTER} 
          zoom={14} 
          zoomControl={false} 
          style={{ width: '100%', height: 'calc(100vh - 64px)' }}
        >
          <TileLayer
            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          />
          <MapClickListener onMapClick={handleMapClick} />
          {stops.map(stop => (
            <Marker 
              key={stop.id} 
              position={[stop.lat, stop.lng]} 
              icon={stopIcon(stop.name)} 
            />
          ))}
        </MapContainer>

        {/* Modal */}
        {showModal && (
          <div className="absolute inset-0 z-[1000] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <div className="bg-[#1A1A1A] border border-white/10 rounded-2xl w-full max-w-sm overflow-hidden shadow-2xl">
              <div className="p-6 border-b border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="bg-[#C8F135] p-2 rounded-lg">
                    <Plus className="text-black w-4 h-4" />
                  </div>
                  <h2 className="text-lg font-bold">Add New Stop</h2>
                </div>
                <button onClick={() => setShowModal(false)} className="text-white/40 hover:text-white transition-colors">
                  <X size={20} />
                </button>
              </div>
              
              <div className="p-6 space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase tracking-widest font-black text-white/40 ml-1">Stop Name</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Rajkamal Chowk"
                    className="w-full bg-[#0F0F0F] border border-white/5 rounded-xl py-3 px-4 text-sm focus:outline-none focus:border-[#C8F135]/50 transition-colors"
                    value={stopName}
                    onChange={(e) => setStopName(e.target.value)}
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase tracking-widest font-black text-white/40 ml-1">Route Identifier</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Loop 1B"
                    className="w-full bg-[#0F0F0F] border border-white/5 rounded-xl py-3 px-4 text-sm focus:outline-none focus:border-[#C8F135]/50 transition-colors"
                    value={stopRoute}
                    onChange={(e) => setStopRoute(e.target.value)}
                  />
                </div>
                <div className="flex gap-4 pt-2">
                  <div className="flex-1 bg-[#0F0F0F] border border-white/5 p-3 rounded-xl">
                    <div className="text-[9px] text-white/30 uppercase font-black mb-1">Latitude</div>
                    <div className="text-xs font-mono text-[#C8F135]">{newStopPos?.lat.toFixed(6)}</div>
                  </div>
                  <div className="flex-1 bg-[#0F0F0F] border border-white/5 p-3 rounded-xl">
                    <div className="text-[9px] text-white/30 uppercase font-black mb-1">Longitude</div>
                    <div className="text-xs font-mono text-[#C8F135]">{newStopPos?.lng.toFixed(6)}</div>
                  </div>
                </div>
              </div>
              
              <div className="p-6 bg-[#0D0D0D] flex gap-3">
                <button 
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-4 py-3 rounded-xl text-sm font-bold border border-white/5 hover:bg-white/5 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleSave}
                  disabled={saving || !stopName || !stopRoute}
                  className="flex-1 px-4 py-3 rounded-xl text-sm font-bold bg-[#C8F135] text-black hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-all"
                >
                  {saving ? <Loader2 className="animate-spin w-4 h-4" /> : <Save size={18} />}
                  {saving ? 'Saving...' : 'Create Stop'}
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default StopMapEditor;
