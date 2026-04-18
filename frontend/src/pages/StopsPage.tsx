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
  name: string;
  route: string;
  lat: number;
  lng: number;
  latitude?: number;  // for compatibility
  longitude?: number; // for compatibility
  created_at: string;
}

const routeColors: Record<string, string> = {
  'Route 1 — City Center': '#C8F135',
  'Route 2 — MIDC': '#7F77DD',
  'Route 3 — Airport': '#D85A30',
  'Route 4 — University': '#378ADD',
};

const getRouteColor = (route: string) => routeColors[route] ?? '#888888';

export default function StopsPage() {
  const [stops, setStops] = useState<Stop[]>([]);
  const [search, setSearch] = useState('');
  const [activeRoute, setActiveRoute] = useState('All');
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
          .order('created_at', { ascending: true });

        if (error) {
           toast({ 
              title: "Failed to load stops", 
              description: "Please try again.",
              variant: "destructive" 
           });
        } else {
          setStops(data || []);
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

  const uniqueRoutes = useMemo(() => {
    const rSet = new Set(stops.map(s => s.route));
    const sorted = Array.from(rSet).filter(Boolean).sort();
    return ['All', ...sorted];
  }, [stops]);

  const filteredStops = useMemo(() => {
    return stops
      .filter(s => activeRoute === 'All' || s.route === activeRoute)
      .filter(s =>
        s.name.toLowerCase().includes(search.toLowerCase()) ||
        (s.route && s.route.toLowerCase().includes(search.toLowerCase()))
      );
  }, [stops, activeRoute, search]);

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

          {/* Section 3: Route Filter Pills */}
          <div className="px-4 pb-4 overflow-x-auto whitespace-nowrap scrollbar-none flex gap-2">
            <style>{`
              .scrollbar-none::-webkit-scrollbar { display: none; }
              .scrollbar-none { -ms-overflow-style: none; scrollbar-width: none; }
            `}</style>
            {uniqueRoutes.map((route) => {
               const isActive = activeRoute === route;
               return (
                 <button
                   key={route}
                   onClick={() => setActiveRoute(route)}
                   className={`px-[14px] py-[6px] rounded-full text-[12px] transition-all border ${
                     isActive
                       ? "bg-[#C8F135] text-[#0F0F0F] font-semibold border-transparent"
                       : "bg-[#1A1A1A] text-white border-[#2A2A2A]"
                   }`}
                 >
                   {route}
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
              filteredStops.map((stop) => (
                <div
                  key={stop.id}
                  onClick={() => handleStopClick(stop)}
                  id={`stop-card-${stop.id}`}
                  className={`flex items-center justify-between bg-[#1A1A1A] h-[56px] px-4 rounded-[12px] border transition-all cursor-pointer hover:border-white/10 active:scale-[0.98] ${
                    selectedStop?.id === stop.id ? "ring-1 ring-[#C8F135]/50 border-[#C8F135]/30" : "border-[#2A2A2A]"
                  }`}
                  style={{ borderLeft: `4px solid ${getRouteColor(stop.route)}` }}
                >
                  <div className="flex flex-col truncate pr-4">
                    <span className="text-[13px] font-medium text-white truncate">{stop.name}</span>
                    <span className="text-[11px] text-[#888] truncate">{stop.route}</span>
                  </div>
                  <div className="flex-shrink-0">
                      <Bus className="w-4 h-4 text-[#888]" />
                  </div>
                </div>
              ))
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
