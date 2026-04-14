import React from 'react';
import { NavLink } from 'react-router-dom';
import { BarChart3, Bus, Calendar, Map, MapPin } from 'lucide-react';

type NavItem = {
  label: string;
  path: string;
  icon: React.ReactNode;
};

const navItems: NavItem[] = [
  { label: 'Dashboard', path: '/dashboard', icon: <BarChart3 size={16} /> },
  { label: 'Routes', path: '/routes', icon: <Map size={16} /> },
  { label: 'Buses', path: '/buses', icon: <Bus size={16} /> },
  { label: 'Stops', path: '/stops', icon: <MapPin size={16} /> },
  { label: 'Schedule', path: '/schedule', icon: <Calendar size={16} /> },
];

const AdminBottomNav: React.FC = () => {
  return (
    <nav
      style={{
        position: 'fixed',
        left: 0,
        right: 0,
        bottom: 0,
        height: '64px',
        backgroundColor: '#111111',
        borderTop: '1px solid #2A2A2A',
        zIndex: 120,
        display: 'grid',
        gridTemplateColumns: `repeat(${navItems.length}, minmax(0, 1fr))`,
      }}
    >
      {navItems.map((item) => (
        <NavLink
          key={item.path}
          to={item.path}
          style={({ isActive }) => ({
            textDecoration: 'none',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '4px',
            color: isActive ? '#FFD000' : '#888888',
            backgroundColor: isActive ? 'rgba(255, 208, 0, 0.08)' : 'transparent',
            borderTop: isActive ? '2px solid #FFD000' : '2px solid transparent',
            fontSize: '11px',
            fontWeight: isActive ? 700 : 500,
            transition: 'all 180ms ease-in-out',
          })}
        >
          {item.icon}
          <span>{item.label}</span>
        </NavLink>
      ))}
    </nav>
  );
};

export default AdminBottomNav;