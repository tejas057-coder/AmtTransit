import { useEffect, useState, useRef, useMemo } from 'react';
import { Bus } from 'lucide-react';
import L from 'leaflet';
import { supabase } from '@/lib/supabase';
import { MainLayout } from '@/components/layout/MainLayout';
import { SearchBar } from '@/components/SearchBar';
import { LeafletMap } from '@/components/map/LeafletMap';
import { useToast } from '@/hooks/use-toast';
import { colors } from '@/lib/designTokens';

interface Stop {
  id: string;
  stop_name: string;
  stop_code: string;
  zone: string;
  latitude: number;
  longitude: number;
  is_active: boolean;
  created_at: string;
  // Legacy compatibility
  name?: string;
  route?: string;
  lat?: number;
  lng?: number;
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

export default function StopsPage() {
  const [stops, setStops] = useState<Stop[]>([]);
  const [search, setSearch] = useState('');
  const [activeZone, setActiveZone] = useState('All');
  const [selectedStop, setSelectedStop] = useState<Stop | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  
  const mapRef = useRef<L.Map | null>(null);

  useEffect(() => {
    const fetchStops = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('stops')
          .select('*')
          .eq('is_active', true) // Only show active stops to users
          .order('created_at', { ascending: true });

        if (error) {
           toast({ 
              title: "Failed to load stops", 
              description: "Please try again.",
              variant: "destructive" 
           });
        } else {
          // Normalize data to handle both old and new schema
          const normalizedStops = (data || []).map((s: any) => ({
            ...s,
            stop_name: s.stop_name || s.name || 'Unknown Stop',
            stop_code: s.stop_code || `STOP-${s.id.slice(0, 4)}`,
            zone: s.zone || s.route || 'Other',
            latitude: s.latitude ?? s.lat ?? 20.9374,
            longitude: s.longitude ?? s.lng ?? 77.7796,
            is_active: s.is_active ?? true
          }));
          setStops(normalizedStops);
        }
      } catch (err: any) {
        toast({ 
           title: "Failed to load stops", 
           description: "Please try again.",
           variant: "destructive" 
        });
      } finally {
        setLoading(false);
      }
    };

    fetchStops();
  }, []);

  const uniqueZones = useMemo(() => {
    const zSet = new Set(stops.map(s => s.zone));
    const sorted = Array.from(zSet).filter(Boolean).sort();
    return ['All', ...sorted];
  }, [stops]);

  const filteredStops = useMemo(() => {
    return stops
      .filter(s => activeZone === 'All' || s.zone === activeZone)
      .filter(s =>
        s.stop_name.toLowerCase().includes(search.toLowerCase()) ||
        s.stop_code.toLowerCase().includes(search.toLowerCase()) ||
        (s.zone && s.zone.toLowerCase().includes(search.toLowerCase()))
      );
  }, [stops, activeZone, search]);

  const handleStopClick = (stop: Stop) => {
    setSelectedStop(stop);
    // LeafletMap useEffect handles the flyTo when selectedStop changes
  };

  return (
    <MainLayout>
      <div className="flex flex-col lg:flex-row h-screen lg:h-[calc(100vh-64px)] w-full bg-[#0F0F0F] text-white overflow-hidden">
        
        {/* TOP HALF (MOBILE) / LEFT PANEL (DESKTOP) - MAP */}
        <div className="w-full lg:w-[60%] h-[55vh] lg:h-full relative overflow-hidden">
          <LeafletMap
            stops={filteredStops}
            selectedStop={selectedStop}
            mapRef={mapRef}
            center={[20.9374, 77.7796]}
            zoom={13}
            className="w-full h-full"
          />
        </div>

        {/* BOTTOM HALF (MOBILE) / RIGHT PANEL (DESKTOP) - CONTROLS & LIST */}
        <div className="flex-1 flex flex-col h-[45vh] lg:h-full bg-[#0F0F0F] overflow-hidden border-t lg:border-t-0 lg:border-l border-[#2A2A2A]">
          
          {/* Section 2: Search Bar */}
          <div className="p-4">
            <SearchBar 
              placeholder="Search stops or routes..." 
              onSearch={(query) => setSearch(query)}
              onClear={() => setSearch('')}
            />
          </div>

          {/* Section 3: Zone Filter Pills */}
          <div className="px-4 pb-4 overflow-x-auto whitespace-nowrap scrollbar-none flex gap-2">
            <style>{`
              .scrollbar-none::-webkit-scrollbar { display: none; }
              .scrollbar-none { -ms-overflow-style: none; scrollbar-width: none; }
            `}</style>
            {uniqueZones.map((zone) => {
               const isActive = activeZone === zone;
               return (
                 <button
                   key={zone}
                   onClick={() => setActiveZone(zone)}
                   className={`px-[14px] py-[6px] rounded-full text-[12px] transition-all border ${
                     isActive
                       ? "bg-[#C8F135] text-[#0F0F0F] font-semibold border-transparent"
                       : "bg-[#1A1A1A] text-white border-[#2A2A2A]"
                   }`}
                 >
                   {zone}
                 </button>
               );
            })}
          </div>

          {/* Section 4: Stop Cards List */}
          <div className="flex-1 overflow-y-auto px-4 pb-20 lg:pb-6 space-y-3">
            {loading ? (
              // Loading State: 4 skeletons (56px)
              [1, 2, 3, 4].map((i) => (
                <div 
                  key={i} 
                  className="h-[56px] bg-[#1A1A1A] rounded-[12px] border border-[#2A2A2A] animate-pulse"
                />
              ))
            ) : filteredStops.length > 0 ? (
              filteredStops.map((stop) => {
                const zoneColor = getZoneColor(stop.zone);
                return (
                  <div
                    key={stop.id}
                    onClick={() => handleStopClick(stop)}
                    id={`stop-card-${stop.id}`}
                    className={`flex items-center justify-between bg-[#1A1A1A] h-[56px] px-4 rounded-[12px] border transition-all cursor-pointer hover:border-white/10 active:scale-[0.98] ${
                      selectedStop?.id === stop.id ? "ring-1 ring-[#C8F135]/50 border-[#C8F135]/30" : "border-[#2A2A2A]"
                    }`}
                    style={{ borderLeft: `4px solid ${zoneColor}` }}
                  >
                    <div className="flex flex-col truncate pr-4">
                      <span className="text-[13px] font-medium text-white truncate">{stop.stop_name}</span>
                      <span className="text-[11px] text-[#888] truncate">{stop.zone} • {stop.stop_code}</span>
                    </div>
                    <div className="flex-shrink-0">
                        <Bus className="w-4 h-4 text-[#888]" />
                    </div>
                  </div>
                );
              })
            ) : (
              // Empty State
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="mb-4">
                  <Bus className="w-10 h-10 text-[#888] opacity-50" />
                </div>
                <h3 className="text-[13px] text-[#888] font-medium">No stops found</h3>
                <p className="text-[12px] text-[#888]/60 mt-1">Try a different search or route filter</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
