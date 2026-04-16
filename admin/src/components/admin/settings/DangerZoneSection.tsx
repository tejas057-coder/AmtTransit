import React, { useState } from 'react';
import { AlertTriangle, Trash2, RefreshCw, Download } from 'lucide-react';
import { adminColors, adminBorders, adminSpacing } from '@/lib/adminDesignTokens';

interface Props {
  onResetSettings: () => void;
}

const DangerZoneSection: React.FC<Props> = ({ onResetSettings }) => {
  const [confirmReset, setConfirmReset] = useState(false);

  const handleReset = () => {
    if (!confirmReset) {
      setConfirmReset(true);
      setTimeout(() => setConfirmReset(false), 4000);
      return;
    }
    onResetSettings();
    setConfirmReset(false);
  };

  return (
    <div
      style={{
        backgroundColor: '#1A1A1A',
        border: `1px solid rgba(255,68,68,0.25)`,
        borderRadius: '12px',
        overflow: 'hidden',
      }}
    >
      {/* Header banner */}
      <div
        style={{
          backgroundColor: 'rgba(255,68,68,0.08)',
          borderBottom: '1px solid rgba(255,68,68,0.2)',
          padding: `${adminSpacing.md} ${adminSpacing.lg}`,
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
        }}
      >
        <AlertTriangle size={14} color="#FF4444" />
        <span style={{ color: '#FF4444', fontWeight: 700, fontSize: '12px', letterSpacing: '0.04em' }}>
          DANGER ZONE — These actions cannot be undone
        </span>
      </div>

      <div style={{ padding: `0 ${adminSpacing.lg}` }}>
        {/* Reset Settings */}
        <DangerRow
          icon={<RefreshCw size={16} color="#FF9900" />}
          label="Reset All Settings"
          description="Restore all settings to factory defaults. Your profile info is preserved."
          actionLabel={confirmReset ? 'Click again to confirm reset' : 'Reset Settings'}
          actionColor="#FF9900"
          onAction={handleReset}
          confirming={confirmReset}
        />

        {/* Export Data */}
        <DangerRow
          icon={<Download size={16} color="#3B82F6" />}
          label="Export Admin Data"
          description="Download a full JSON export of all stops, routes, and schedules."
          actionLabel="Export Data"
          actionColor="#3B82F6"
          onAction={() => {
            const data = {
              exportedAt: new Date().toISOString(),
              settings: JSON.parse(localStorage.getItem('amravati_admin_settings') || '{}'),
            };
            const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url; a.download = 'amravati-admin-export.json'; a.click();
            URL.revokeObjectURL(url);
          }}
        />

        {/* Delete All Data */}
        <DangerRow
          icon={<Trash2 size={16} color="#FF4444" />}
          label="Clear All Cached Data"
          description="Wipe locally stored stops, schedules, and preferences from this browser."
          actionLabel="Clear Data"
          actionColor="#FF4444"
          last
          onAction={() => {
            const keys = Object.keys(localStorage).filter((k) =>
              k.startsWith('amravati'),
            );
            keys.forEach((k) => localStorage.removeItem(k));
            window.location.reload();
          }}
        />
      </div>
    </div>
  );
};

interface DangerRowProps {
  icon: React.ReactNode;
  label: string;
  description: string;
  actionLabel: string;
  actionColor: string;
  onAction: () => void;
  last?: boolean;
  confirming?: boolean;
}
const DangerRow: React.FC<DangerRowProps> = ({
  icon, label, description, actionLabel, actionColor, onAction, last, confirming,
}) => (
  <div
    style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: adminSpacing.lg,
      paddingTop: adminSpacing.lg,
      paddingBottom: adminSpacing.lg,
      borderBottom: last ? 'none' : `1px solid ${adminColors.border.base}`,
    }}
  >
    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', flex: 1, minWidth: 0 }}>
      <div style={{ marginTop: '1px', flexShrink: 0 }}>{icon}</div>
      <div>
        <div style={{ color: '#E5E5E5', fontWeight: 600, fontSize: '13px' }}>{label}</div>
        <div style={{ color: '#888888', fontSize: '11px', marginTop: '3px', lineHeight: 1.5 }}>
          {description}
        </div>
      </div>
    </div>
    <button
      onClick={onAction}
      style={{
        flexShrink: 0,
        height: '34px',
        borderRadius: adminBorders.radius.md,
        border: `1px solid ${actionColor}44`,
        backgroundColor: `${actionColor}18`,
        color: actionColor,
        fontSize: '12px',
        fontWeight: 600,
        padding: '0 14px',
        cursor: 'pointer',
        whiteSpace: 'nowrap',
        transition: 'all 150ms ease',
        animation: confirming ? 'dangerPulse 0.5s ease' : 'none',
      }}
    >
      {actionLabel}
    </button>
    <style>{`
      @keyframes dangerPulse {
        0% { transform: scale(1); }
        50% { transform: scale(1.04); }
        100% { transform: scale(1); }
      }
    `}</style>
  </div>
);

export default DangerZoneSection;
