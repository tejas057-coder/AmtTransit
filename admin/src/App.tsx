import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { AdminLogin } from './pages/AdminLogin';
import AdminDashboard from './pages/Dashboard';
import BusManagement from './pages/BusManagement';
import RouteManagement from './pages/RouteManagement';
import ScheduleManagement from './pages/ScheduleManagement';
import StopMapEditor from './pages/StopMapEditor';
import AdminBottomNav from './components/layout/AdminBottomNav';
import { adminColors } from './lib/adminDesignTokens';

const getAdminAuthState = () => {
  try {
    return localStorage.getItem('adminAuth') === 'true';
  } catch {
    return false;
  }
};

interface ProtectedLayoutProps {
  isAuthenticated: boolean;
}

const ProtectedLayout: React.FC<ProtectedLayoutProps> = ({ isAuthenticated }) => {
  if (!isAuthenticated) return <Navigate to="/login" replace />;

  return (
    <div style={{ minHeight: '100vh', paddingBottom: '72px' }}>
      <Outlet />
      <AdminBottomNav />
    </div>
  );
};

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => getAdminAuthState());

  useEffect(() => {
    const syncAuthState = () => setIsAuthenticated(getAdminAuthState());
    window.addEventListener('storage', syncAuthState);
    return () => window.removeEventListener('storage', syncAuthState);
  }, []);

  return (
    <div style={{ backgroundColor: adminColors.background.page, minHeight: '100vh' }}>
      <Router>
        <Routes>
          {/* Login Route */}
          <Route
            path="/login"
            element={
              isAuthenticated ? (
                <Navigate to="/dashboard" replace />
              ) : (
                <AdminLogin onLoginSuccess={() => setIsAuthenticated(true)} />
              )
            }
          />

          {/* Protected Routes */}
          <Route element={<ProtectedLayout isAuthenticated={isAuthenticated} />}>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<AdminDashboard />} />
            <Route path="/routes" element={<RouteManagement />} />
            <Route path="/buses" element={<BusManagement />} />
            <Route path="/stops" element={<StopMapEditor />} />
            <Route path="/stops-map" element={<StopMapEditor />} />
            <Route path="/schedule" element={<ScheduleManagement />} />
          </Route>

          {/* Default redirect */}
          <Route path="*" element={<Navigate to={isAuthenticated ? '/dashboard' : '/login'} replace />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
