import React, { useMemo, useState } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import {
  BarChart3,
  Bell,
  Bus,
  Calendar,
  LayoutDashboard,
  LogOut,
  Map,
  MapPin,
  Menu,
  Route,
  Search,
  Settings,
  X,
} from 'lucide-react';

type AdminLayoutProps = {
  children: React.ReactNode;
};

type NavItem = {
  label: string;
  path: string;
  icon: React.ReactNode;
  withDivider?: boolean;
};

const navItems: NavItem[] = [
  { label: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard size={20} /> },
  { label: 'Routes', path: '/routes', icon: <Map size={20} /> },
  { label: 'Buses', path: '/buses', icon: <Bus size={20} /> },
  { label: 'Stops', path: '/stops', icon: <MapPin size={20} /> },
  { label: 'Schedule', path: '/schedule', icon: <Calendar size={20} /> },
  { label: 'Trips', path: '/trips', icon: <Route size={20} /> },
  { label: 'Analytics', path: '/analytics', icon: <BarChart3 size={20} /> },
  { label: 'Settings', path: '/settings', icon: <Settings size={20} />, withDivider: true },
];

const prettyPageName = (path: string) => {
  if (path === '/' || path === '/dashboard') return 'Dashboard';
  const part = path.split('/').filter(Boolean)[0] ?? 'Dashboard';
  return part.charAt(0).toUpperCase() + part.slice(1);
};

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const pageName = useMemo(() => prettyPageName(location.pathname), [location.pathname]);

  const handleLogout = () => {
    try {
      localStorage.removeItem('adminAuth');
    } catch {
      // Ignore storage errors and continue logout navigation.
    }
    navigate('/login');
  };

  return (
    <>
      <style>{`
        .admin-shell { min-height: 100vh; background: #0D0D0D; }
        .admin-sidebar {
          position: fixed;
          left: 0;
          top: 0;
          width: 240px;
          height: 100vh;
          background: #111111;
          border-right: 1px solid #2A2A2A;
          z-index: 50;
          display: flex;
          flex-direction: column;
          transition: transform 200ms ease-in-out;
        }
        .admin-main {
          margin-left: 240px;
          min-height: 100vh;
          padding-top: 56px;
        }
        .admin-topbar {
          position: fixed;
          top: 0;
          left: 240px;
          right: 0;
          height: 56px;
          background: #111111;
          border-bottom: 1px solid #2A2A2A;
          z-index: 40;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 16px;
        }
        .admin-sidebar-overlay {
          display: none;
        }
        @media (max-width: 960px) {
          .admin-sidebar {
            transform: translateX(-100%);
          }
          .admin-sidebar.open {
            transform: translateX(0);
          }
          .admin-main {
            margin-left: 0;
          }
          .admin-topbar {
            left: 0;
          }
          .admin-sidebar-overlay {
            display: block;
            position: fixed;
            inset: 0;
            background: rgba(0,0,0,0.45);
            z-index: 45;
          }
        }
      `}</style>

      <div className="admin-shell">
        {isSidebarOpen && <div className="admin-sidebar-overlay" onClick={() => setIsSidebarOpen(false)} />}

        <aside className={`admin-sidebar ${isSidebarOpen ? 'open' : ''}`}>
          <div
            style={{
              height: '64px',
              borderBottom: '1px solid #2A2A2A',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '0 14px',
            }}
          >
            <Bus size={24} color="#FFD000" />
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
              <span style={{ color: '#FFFFFF', fontSize: '16px', fontWeight: 700 }}>Amravati</span>
              <span style={{ color: '#FFD000', fontSize: '16px', fontWeight: 700 }}>Transit</span>
            </div>
          </div>

          <div style={{ padding: '12px 0', display: 'flex', flexDirection: 'column', gap: '4px', flex: 1, overflowY: 'auto' }}>
            {navItems.map((item) => (
              <React.Fragment key={item.path}>
                {item.withDivider && <div style={{ borderTop: '1px solid #2A2A2A', margin: '6px 8px 8px' }} />}
                <NavLink
                  to={item.path}
                  onClick={() => setIsSidebarOpen(false)}
                  style={({ isActive }) => ({
                    margin: '0 8px',
                    height: '44px',
                    padding: '0 16px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    borderRadius: '10px',
                    textDecoration: 'none',
                    fontSize: '14px',
                    color: isActive ? '#FFD000' : '#888888',
                    backgroundColor: isActive ? 'rgba(255, 208, 0, 0.08)' : 'transparent',
                    borderLeft: isActive ? '3px solid #FFD000' : '3px solid transparent',
                    fontWeight: isActive ? 700 : 500,
                  })}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </NavLink>
              </React.Fragment>
            ))}
          </div>

          <div
            style={{
              margin: '12px',
              padding: '10px 12px',
              borderRadius: '10px',
              backgroundColor: '#1A1A1A',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
            }}
          >
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '999px',
                backgroundColor: 'rgba(255,208,0,0.13)',
                color: '#FFD000',
                fontWeight: 700,
                display: 'grid',
                placeItems: 'center',
                fontSize: '12px',
              }}
            >
              SA
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ color: '#FFFFFF', fontWeight: 700, fontSize: '13px' }}>Super Admin</div>
              <div style={{ color: '#888888', fontSize: '11px' }}>Administrator</div>
            </div>
            <button
              onClick={handleLogout}
              style={{
                width: '28px',
                height: '28px',
                border: '1px solid #2A2A2A',
                borderRadius: '8px',
                backgroundColor: 'transparent',
                color: '#888888',
                display: 'grid',
                placeItems: 'center',
                cursor: 'pointer',
              }}
              title="Logout"
            >
              <LogOut size={14} />
            </button>
          </div>
        </aside>

        <header className="admin-topbar">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <button
              onClick={() => setIsSidebarOpen(true)}
              style={{
                width: '30px',
                height: '30px',
                border: '1px solid #2A2A2A',
                borderRadius: '8px',
                background: 'transparent',
                color: '#888888',
                display: 'none',
                placeItems: 'center',
                cursor: 'pointer',
              }}
              className="mobile-menu-btn"
              title="Open navigation"
            >
              <Menu size={16} />
            </button>
            <div style={{ color: '#888888', fontSize: '12px' }}>
              Admin / <span style={{ color: '#FFFFFF', fontWeight: 700 }}>{pageName}</span>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <button onClick={() => setIsSearchOpen(true)} style={topIconButtonStyle} title="Search">
              <Search size={16} />
            </button>

            <button style={{ ...topIconButtonStyle, position: 'relative' }} title="Notifications">
              <Bell size={16} />
              <span
                style={{
                  position: 'absolute',
                  top: '5px',
                  right: '6px',
                  width: '7px',
                  height: '7px',
                  borderRadius: '999px',
                  backgroundColor: '#FF4444',
                }}
              />
            </button>

            <div
              style={{
                height: '30px',
                borderRadius: '999px',
                backgroundColor: 'rgba(34, 197, 94, 0.13)',
                border: '1px solid rgba(34, 197, 94, 0.35)',
                color: '#22C55E',
                fontWeight: 700,
                fontSize: '11px',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '0 10px',
              }}
            >
              <span
                style={{
                  width: '7px',
                  height: '7px',
                  borderRadius: '999px',
                  backgroundColor: '#22C55E',
                  boxShadow: '0 0 0 0 rgba(34, 197, 94, 0.6)',
                  animation: 'livePulse 1.4s infinite',
                }}
              />
              Live
            </div>

            <div
              style={{
                width: '30px',
                height: '30px',
                borderRadius: '999px',
                backgroundColor: '#FFD00022',
                color: '#FFD000',
                fontWeight: 700,
                display: 'grid',
                placeItems: 'center',
                fontSize: '11px',
              }}
            >
              SA
            </div>
          </div>
        </header>

        <main className="admin-main">{children}</main>

        {isSearchOpen && (
          <div
            onClick={() => setIsSearchOpen(false)}
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 130,
              backgroundColor: 'rgba(0,0,0,0.7)',
              display: 'grid',
              placeItems: 'start center',
              paddingTop: '80px',
              paddingLeft: '16px',
              paddingRight: '16px',
            }}
          >
            <div
              onClick={(event) => event.stopPropagation()}
              style={{
                width: 'min(760px, 100%)',
                backgroundColor: '#111111',
                border: '1px solid #2A2A2A',
                borderRadius: '14px',
                padding: '14px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Search size={18} color="#888" />
                <input
                  autoFocus
                  placeholder="Search routes, buses, stops, trips..."
                  style={{
                    flex: 1,
                    height: '42px',
                    border: '1px solid #2A2A2A',
                    borderRadius: '10px',
                    backgroundColor: '#1A1A1A',
                    color: '#E5E5E5',
                    padding: '0 12px',
                    fontSize: '14px',
                    outline: 'none',
                  }}
                />
                <button onClick={() => setIsSearchOpen(false)} style={topIconButtonStyle}>
                  <X size={16} />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes livePulse {
          0% { box-shadow: 0 0 0 0 rgba(34, 197, 94, 0.55); }
          70% { box-shadow: 0 0 0 8px rgba(34, 197, 94, 0); }
          100% { box-shadow: 0 0 0 0 rgba(34, 197, 94, 0); }
        }
        @media (max-width: 960px) {
          .mobile-menu-btn { display: grid !important; }
        }
      `}</style>
    </>
  );
};

const topIconButtonStyle: React.CSSProperties = {
  width: '30px',
  height: '30px',
  border: '1px solid #2A2A2A',
  borderRadius: '8px',
  backgroundColor: 'transparent',
  color: '#888888',
  display: 'grid',
  placeItems: 'center',
  cursor: 'pointer',
};

export default AdminLayout;