import { useNavigate } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import { BusRouteMap } from "@/components/map/BusRouteMap";

export default function RouteDetailsPage() {
  const navigate = useNavigate();

  return (
    <div className="bg-background min-h-screen flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-card border-b border-white/8 px-4 py-4">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate(-1)}
              className="p-2 hover:bg-muted rounded-lg transition-colors"
              aria-label="Go back"
            >
              <ChevronLeft className="w-5 h-5 text-primary" />
            </button>
            <div>
              <h1 className="text-lg font-bold text-white">Route Details</h1>
              <p className="text-xs text-muted-foreground">Navsari → Badnera</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-hidden">
        <div className="w-full h-[calc(100vh-80px)]">
          <BusRouteMap
            from="Navsari"
            to="Badnera"
            keyStops={[
              "Panchavati",
              "Irwin Chowk",
              "Jaystambh Chowk",
              "Sai Nagar",
              "Gopal Nagar",
              "Sipna College",
            ]}
          />
        </div>
      </main>

      {/* Info Badge */}
      <style>{`
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .route-info-card {
          animation: slideUp 0.4s ease-out;
        }

        /* Improve leaflet controls styling */
        .leaflet-control-zoom {
          border: 1px solid rgba(255, 255, 255, 0.1) !important;
          border-radius: 12px !important;
          background-color: rgba(26, 26, 46, 0.95) !important;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3) !important;
        }

        .leaflet-control-zoom a {
          background-color: transparent !important;
          color: #fff !important;
          border: none !important;
          width: 36px !important;
          height: 36px !important;
          line-height: 36px !important;
          font-size: 16px !important;
          transition: all 0.2s ease;
        }

        .leaflet-control-zoom a:hover {
          background-color: rgba(255, 255, 255, 0.1) !important;
          color: #3b82f6 !important;
        }

        .leaflet-container {
          font-family: "DM Sans", system-ui, sans-serif;
        }
      `}</style>
    </div>
  );
}
