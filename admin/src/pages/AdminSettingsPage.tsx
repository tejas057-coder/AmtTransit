import React, { useState } from 'react';
import { Check, Settings } from 'lucide-react';
import { adminColors, adminSpacing, adminBorders } from '@/lib/adminDesignTokens';
import { useAdminSettings } from '../hooks/useAdminSettings';

import SettingsNav, { SettingsSectionId } from '../components/admin/settings/SettingsNav';
import ProfileSection from '../components/admin/settings/ProfileSection';
import FleetConfigSection from '../components/admin/settings/FleetConfigSection';
import RouteSettingsSection from '../components/admin/settings/RouteSettingsSection';
import NotificationSettingsSection from '../components/admin/settings/NotificationSettingsSection';
import SecuritySection from '../components/admin/settings/SecuritySection';
import DisplaySection from '../components/admin/settings/DisplaySection';
import AnalyticsSection from '../components/admin/settings/AnalyticsSection';
import DangerZoneSection from '../components/admin/settings/DangerZoneSection';

// ─── Section meta for title/description ──────────────────────────────────────
const SECTION_META: Record<
  SettingsSectionId,
  { title: string; description: string; emoji: string }
> = {
  profile:       { emoji: '👤', title: 'Admin Profile',       description: 'Your personal account details and display name.' },
  fleet:         { emoji: '🚌', title: 'Fleet Config',         description: 'Capacity, fuel thresholds, maintenance schedules, and automation.' },
  routes:        { emoji: '🗺️', title: 'Routes & Stops',       description: 'Frequency defaults, buffer times, and passenger-facing stop display.' },
  notifications: { emoji: '🔔', title: 'Notifications',        description: 'Alert preferences for delays, arrivals, and operational events.' },
  security:      { emoji: '🔒', title: 'Security',             description: 'Session control, two-factor auth, and access restrictions.' },
  display:       { emoji: '🎨', title: 'App Display',          description: 'Theme, map defaults, and sidebar layout preferences.' },
  analytics:     { emoji: '📊', title: 'Analytics',            description: 'Data retention, heatmap generation, and privacy controls.' },
  danger:        { emoji: '⚠️', title: 'Danger Zone',          description: 'Irreversible actions — proceed with care.' },
};

// ─── Main Page ────────────────────────────────────────────────────────────────
const AdminSettingsPage: React.FC = () => {
  const { settings, update, save, reset, saved } = useAdminSettings();
  const [activeSection, setActiveSection] = useState<SettingsSectionId>('profile');

  const meta = SECTION_META[activeSection];
  const isDanger = activeSection === 'danger';

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: adminColors.background.page,
        fontFamily: 'Inter, system-ui, sans-serif',
      }}
    >
      {/* ── PAGE HEADER ───────────────────────────────── */}
      <div
        style={{
          borderBottom: `1px solid ${adminColors.border.base}`,
          backgroundColor: adminColors.background.sidebar,
          padding: `${adminSpacing.lg} ${adminSpacing.xl}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          position: 'sticky',
          top: 0,
          zIndex: 20,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '10px',
              background: 'rgba(255,208,0,0.12)',
              border: '1px solid rgba(255,208,0,0.25)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Settings size={16} color="#FFD000" />
          </div>
          <div>
            <h1 style={{ margin: 0, fontSize: '18px', fontWeight: 700, color: '#FFFFFF', lineHeight: 1 }}>
              Settings
            </h1>
            <p style={{ margin: '4px 0 0', fontSize: '12px', color: '#888888' }}>
              AmravatiTransit Admin Panel
            </p>
          </div>
        </div>

        {/* Save button */}
        {!isDanger && (
          <button
            onClick={save}
            style={{
              height: '38px',
              borderRadius: adminBorders.radius.md,
              border: 'none',
              backgroundColor: saved ? '#22C55E' : '#FFD000',
              color: saved ? '#FFFFFF' : '#0D0D0D',
              fontWeight: 700,
              fontSize: '13px',
              padding: '0 20px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '7px',
              transition: 'background-color 300ms ease, color 300ms ease',
            }}
          >
            {saved ? <Check size={14} /> : null}
            {saved ? 'Saved!' : 'Save Changes'}
          </button>
        )}
      </div>

      {/* ── BODY ──────────────────────────────────────── */}
      <div
        style={{
          display: 'flex',
          gap: adminSpacing.xl,
          padding: adminSpacing.xl,
          maxWidth: '1100px',
          margin: '0 auto',
          alignItems: 'flex-start',
        }}
      >
        {/* Left Nav */}
        <SettingsNav activeSection={activeSection} onSelect={setActiveSection} />

        {/* Content Panel */}
        <div style={{ flex: 1, minWidth: 0 }}>
          {/* Section header */}
          <div style={{ marginBottom: adminSpacing.lg }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
              <span style={{ fontSize: '22px', lineHeight: 1 }}>{meta.emoji}</span>
              <h2
                style={{
                  margin: 0,
                  fontSize: '20px',
                  fontWeight: 700,
                  color: isDanger ? '#FF4444' : '#FFFFFF',
                }}
              >
                {meta.title}
              </h2>
            </div>
            <p style={{ margin: 0, fontSize: '13px', color: '#888888', lineHeight: 1.5 }}>
              {meta.description}
            </p>
          </div>

          {/* ── Section Content ── */}
          {activeSection === 'profile' && (
            <ProfileSection
              data={settings.profile}
              onChange={(patch) => update('profile', patch)}
            />
          )}
          {activeSection === 'fleet' && (
            <FleetConfigSection
              data={settings.fleet}
              onChange={(patch) => update('fleet', patch)}
            />
          )}
          {activeSection === 'routes' && (
            <RouteSettingsSection
              data={settings.routes}
              onChange={(patch) => update('routes', patch)}
            />
          )}
          {activeSection === 'notifications' && (
            <NotificationSettingsSection
              data={settings.notifications}
              onChange={(patch) => update('notifications', patch)}
            />
          )}
          {activeSection === 'security' && (
            <SecuritySection
              data={settings.security}
              onChange={(patch) => update('security', patch)}
            />
          )}
          {activeSection === 'display' && (
            <DisplaySection
              data={settings.display}
              onChange={(patch) => update('display', patch)}
            />
          )}
          {activeSection === 'analytics' && (
            <AnalyticsSection
              data={settings.analytics}
              onChange={(patch) => update('analytics', patch)}
            />
          )}
          {activeSection === 'danger' && (
            <DangerZoneSection onResetSettings={reset} />
          )}

          {/* Bottom save button (for non-danger sections) */}
          {!isDanger && (
            <div style={{ marginTop: adminSpacing.xl, display: 'flex', gap: adminSpacing.md }}>
              <button
                onClick={save}
                style={{
                  height: '40px',
                  borderRadius: adminBorders.radius.md,
                  border: 'none',
                  backgroundColor: saved ? '#22C55E' : '#FFD000',
                  color: saved ? '#FFFFFF' : '#0D0D0D',
                  fontWeight: 700,
                  fontSize: '13px',
                  padding: '0 24px',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '7px',
                  transition: 'background-color 300ms ease, color 300ms ease',
                }}
              >
                {saved && <Check size={14} />}
                {saved ? 'Changes Saved!' : 'Save Changes'}
              </button>
              <button
                onClick={() => update(activeSection as keyof typeof settings, {})}
                style={{
                  height: '40px',
                  borderRadius: adminBorders.radius.md,
                  border: `1px solid ${adminColors.border.base}`,
                  backgroundColor: 'transparent',
                  color: '#888888',
                  fontSize: '13px',
                  padding: '0 18px',
                  cursor: 'pointer',
                }}
              >
                Discard
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminSettingsPage;
