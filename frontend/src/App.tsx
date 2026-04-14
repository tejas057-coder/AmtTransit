import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { MainLayout } from "@/components/layout/MainLayout";
import LiveMapPage from "./pages/LiveMapPage";
import RoutesPage from "./pages/RoutesPage";
import TripsPage from "./pages/TripsPage";
import SchedulePage from "./pages/SchedulePage";
import ProfilePage from "./pages/ProfilePage";
import NotificationsPage from "./pages/NotificationsPage";
import HelpPage from "./pages/HelpPage";
import StopsPage from "./pages/StopsPage";
import RouteDetailsPage from "./pages/RouteDetailsPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Main Tab Navigation Routes - with persistent BottomNav */}
          <Route element={<MainLayout />}>
            <Route path="/" element={<LiveMapPage />} />
            <Route path="/routes" element={<RoutesPage />} />
            <Route path="/trips" element={<TripsPage />} />
            <Route path="/schedule" element={<SchedulePage />} />
            <Route path="/profile" element={<ProfilePage />} />
          </Route>

          {/* Secondary Routes - without BottomNav (modal/overlay pages) */}
          <Route path="/stops" element={<StopsPage />} />
          <Route path="/notifications" element={<NotificationsPage />} />
          <Route path="/help" element={<HelpPage />} />
          <Route path="/route/:routeId" element={<RouteDetailsPage />} />

          {/* 404 Not Found */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

