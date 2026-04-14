import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/Dashboard';
import RouteManagement from './pages/RouteManagement';
import { adminColors } from './lib/adminDesignTokens';

// Protected Route Component
interface ProtectedRouteProps {
  element: React.ReactElement;
  isAuthenticated: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ element, isAuthenticated }) => {
  return isAuthenticated ? element : <Navigate to="/login" replace />;
};

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Check authentication on mount
  useEffect(() => {
    const auth = localStorage.getItem('adminAuth');
    if (auth === 'true') {
      setIsAuthenticated(true);
    }
    setIsLoading(false);
  }, []);

  if (isLoading) {
    return (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          backgroundColor: adminColors.background.page,
        }}
      >
        <div style={{ textAlign: 'center' }}>
          <div
            style={{
              fontSize: '24px',
              color: adminColors.primary.base,
              marginBottom: '16px',
            }}
          >
            Loading...
          </div>
        </div>
      </div>
    );
  }

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
          <Route path="/" element={<ProtectedRoute element={<AdminDashboard />} isAuthenticated={isAuthenticated} />} />
          <Route
            path="/dashboard"
            element={<ProtectedRoute element={<AdminDashboard />} isAuthenticated={isAuthenticated} />}
          />
          <Route
            path="/routes"
            element={<ProtectedRoute element={<RouteManagement />} isAuthenticated={isAuthenticated} />}
          />

          {/* Default redirect */}
          <Route path="*" element={<Navigate to={isAuthenticated ? '/dashboard' : '/login'} replace />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
