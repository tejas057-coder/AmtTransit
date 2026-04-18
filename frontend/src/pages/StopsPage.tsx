import { useEffect, useState } from 'react';
import { Search, MapPin, Activity } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { LeafletMap } from '@/components/map/LeafletMap';

// ─── Constants ───────────────────────────────────────────────────────────────
const AMRAVATI_CENTER: [number, number] = [20.9374, 77.7796];

export default function StopsPage() {
  const [stops, setStops] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [errorStatus, setErrorStatus] = useState<string | null>(null);

  // ─── Fetch Stops from Supabase ──────────────────────────────────────────────
  useEffect(() => {
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
        console.error('Error fetching stops:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchStops();

    // Subscribe to realtime updates
    const channel = supabase
      .channel('public:stops')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'stops' }, payload => {
        fetchStops();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // ─── Filter Logic ───────────────────────────────────────────────────────────
  const filteredStops = stops.filter(stop => 
    stop.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    stop.route.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex flex-col h-screen bg-[#0F0F0F] text-white">
      {/* ── Header ────────────────────────────────────────────────────────── */}
      <header className="p-4 border-b border-white/5 bg-[#0F0F0F] z-10">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="bg-[#C8F135]/10 p-2 rounded-xl">
              <MapPin className="text-[#C8F135] w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold font-['DM_Sans']">Transit Stops</h1>
              <p className="text-xs text-white/40 tracking-wide">Network Information</p>
            </div>
          </div>
          <div className="flex items-center gap-2 bg-[#1A1A1A] px-3 py-1.5 rounded-full border border-white/5">
            <div className="w-1.5 h-1.5 rounded-full bg-[#C8F135] animate-pulse" />
            <span className="text-[10px] font-bold text-[#C8F135] uppercase tracking-widest">Live Sync</span>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
          <input
            type="text"
            placeholder="Search stops or routes..."
            className="w-full bg-[#1A1A1A] border border-white/5 rounded-2xl py-3.5 pl-11 pr-4 text-sm font-medium focus:outline-none focus:border-[#C8F135]/50 transition-colors"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </header>

      {/* ── Main Content ─────────────────────────────────────────────────── */}
      <main className="flex-1 relative">
        <div className="absolute inset-0">
          <LeafletMap 
            center={AMRAVATI_CENTER} 
            zoom={14} 
            stops={filteredStops} 
            showOnly="stops" 
          />
        </div>

        {/* Stats Overlay */}
        <div className="absolute bottom-6 left-6 right-6 flex gap-4 pointer-events-none">
          <div className="bg-[#1A1A1A]/90 backdrop-blur-md border border-white/5 px-5 py-4 rounded-2xl flex-1 flex items-center gap-4">
            <div className="bg-[#C8F135] w-1 h-8 rounded-full" />
            <div>
              <div className="text-[10px] text-white/40 uppercase font-black tracking-widest leading-none mb-1">Total Stops</div>
              <div className="text-2xl font-black tabular-nums">{stops.length}</div>
            </div>
          </div>
          <div className="bg-[#1A1A1A]/90 backdrop-blur-md border border-white/5 px-5 py-4 rounded-2xl flex-1 flex items-center gap-4 text-right justify-end">
            <div>
              <div className="text-[10px] text-white/40 uppercase font-black tracking-widest leading-none mb-1">Status</div>
              <div className={`text-sm font-bold ${errorStatus === 'TABLE_MISSING' ? 'text-red-500' : 'text-[#C8F135]'}`}>
                {errorStatus === 'TABLE_MISSING' ? 'SETUP REQUIRED' : 'CONNECTED'}
              </div>
            </div>
            <div className={`w-1 h-8 rounded-full ${errorStatus === 'TABLE_MISSING' ? 'bg-red-500' : 'bg-[#C8F135]'}`} />
          </div>
        </div>
      </main>

      {/* Loading State */}
      {loading && (
        <div className="absolute inset-0 bg-[#0F0F0F] z-50 flex flex-col items-center justify-center gap-4">
          <div className="relative">
            <div className="w-16 h-16 border-2 border-white/5 rounded-full" />
            <div className="absolute inset-0 border-t-2 border-[#C8F135] rounded-full animate-spin" />
            <Activity className="absolute inset-0 m-auto w-6 h-6 text-[#C8F135] opacity-50" />
          </div>
          <p className="text-sm font-bold text-white/40 tracking-widest uppercase">Fetching Transit Data</p>
        </div>
      )}
    </div>
  );
}
