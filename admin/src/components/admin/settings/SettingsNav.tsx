import React from 'react';
import { User, Bus, Map, Bell, Lock, Palette, BarChart2, AlertTriangle } from 'lucide-react';
import { adminColors, adminBorders, adminSpacing } from '@/lib/adminDesignTokens';

export type SettingsSectionId =
  | 'profile'
  | 'fleet'
  | 'routes'
  | 'notifications'
  | 'security'
  | 'display'
  | 'analytics'
  | 'danger';

interface NavItem {
  id: SettingsSectionId;
  label: string;
  icon: React.ReactNode;
  danger?: boolean;
}

const NAV_ITEMS: NavItem[] = [
  { id: 'profile', label: 'Admin Profile', icon: <User size={15} /> },
  { id: 'fleet', label: 'Fleet Config', icon: <Bus size={15} /> },
  { id: 'routes', label: 'Routes & Stops', icon: <Map size={15} /> },
  { id: 'notifications', label: 'Notifications', icon: <Bell size={15} /> },
  { id: 'security', label: 'Security', icon: <Lock size={15} /> },
  { id: 'display', label: 'App Display', icon: <Palette size={15} /> },
  { id: 'analytics', label: 'Analytics', icon: <BarChart2 size={15} /> },
  { id: 'danger', label: 'Danger Zone', icon: <AlertTriangle size={15} />, danger: true },
];

interface Props {
  activeSection: SettingsSectionId;
  onSelect: (id: SettingsSectionId) => void;
}

const SettingsNav: React.FC<Props> = ({ activeSection, onSelect }) => (
  <nav
    style={{
      width: '210px',
      flexShrink: 0,
      backgroundColor: '#111111',
      border: `1px solid ${adminColors.border.base}`,
      borderRadius: '12px',
      padding: adminSpacing.sm,
      alignSelf: 'flex-start',
      position: 'sticky',
      top: '24px',
    }}
  >
    {NAV_ITEMS.map((item) => {
      const isActive = activeSection === item.id;
      const isDanger = item.danger;
      return (
        <button
          key={item.id}
          onClick={() => onSelect(item.id)}
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            padding: `10px ${adminSpacing.md}`,
            borderRadius: adminBorders.radius.md,
            border: 'none',
            cursor: 'pointer',
            fontSize: '13px',
            fontWeight: isActive ? 600 : 400,
            textAlign: 'left',
            transition: 'all 150ms ease',
            backgroundColor: isActive
              ? isDanger
                ? 'rgba(255,68,68,0.12)'
                : 'rgba(255,208,0,0.12)'
              : 'transparent',
            color: isActive
              ? isDanger
                ? '#FF4444'
                : '#FFD000'
              : isDanger
              ? '#FF444499'
              : '#888888',
          }}
        >
          <span style={{ flexShrink: 0, opacity: isActive ? 1 : 0.6 }}>{item.icon}</span>
          {item.label}
        </button>
      );
    })}
  </nav>
);

export default SettingsNav;
