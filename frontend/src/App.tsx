import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useEffect } from "react";
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

const AdminLoginRedirect = () => {
  const adminLoginUrl = import.meta.env.VITE_ADMIN_LOGIN_URL ?? "http://localhost:5184/login";

  useEffect(() => {
    window.location.replace(adminLoginUrl);
  }, [adminLoginUrl]);

  return null;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <Routes>
          {/* Main Tab Navigation Routes - with persistent BottomNav */}
          <Route element={<MainLayout />}>
            <Route path="/" element={<LiveMapPage />} />
            <Route path="/routes" element={<RoutesPage />} />
            <Route path="/trips" element={<TripsPage />} />
            <Route path="/schedule" element={<SchedulePage />} />
            <Route path="/profile" element={<ProfilePage />} />
          </Route>

          {/* Secondary Routes - with BottomNav for consistent nav experience */}
          <Route element={<MainLayout />}>
            <Route path="/stops" element={<StopsPage />} />
            <Route path="/notifications" element={<NotificationsPage />} />
            <Route path="/help" element={<HelpPage />} />
            <Route path="/route/:routeId" element={<RouteDetailsPage />} />
          </Route>
          <Route path="/login" element={<AdminLoginRedirect />} />
          <Route path="/admin/login" element={<AdminLoginRedirect />} />

          {/* 404 Not Found */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

