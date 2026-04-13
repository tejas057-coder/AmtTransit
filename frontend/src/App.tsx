import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AppLayout } from "@/components/layout/AppLayout";
import LiveMapPage from "./pages/LiveMapPage";
import RoutesPage from "./pages/RoutesPage";
import StopsPage from "./pages/StopsPage";
import SchedulePage from "./pages/SchedulePage";
import NotificationsPage from "./pages/NotificationsPage";
import TripsPage from "./pages/TripsPage";
import HelpPage from "./pages/HelpPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AppLayout>
          <Routes>
            <Route path="/" element={<LiveMapPage />} />
            <Route path="/routes" element={<RoutesPage />} />
            <Route path="/stops" element={<StopsPage />} />
            <Route path="/schedule" element={<SchedulePage />} />
            <Route path="/notifications" element={<NotificationsPage />} />
            <Route path="/trips" element={<TripsPage />} />
            <Route path="/help" element={<HelpPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AppLayout>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
