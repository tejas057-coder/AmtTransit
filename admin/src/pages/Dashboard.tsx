/**
 * Admin Dashboard Page
 * Main dashboard for AmravatiTransit admin panel
 * Displays KPIs, fleet overview, alerts, and route health
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Bus,
  MapPin,
  Users,
  Map,
  Bell,
  Settings,
  BarChart3,
  Calendar,
  AlertCircle,
  CheckCircle,
  Clock,
  ChevronRight,
  Zap,
  LogOut,
} from 'lucide-react';
import { adminColors, adminSpacing, adminBorders, adminTypography, adminSizing } from '@/lib/adminDesignTokens';
import { Button, Card, Badge, Alert, SidebarItem } from '@/components/common';

// ============================================================================
// KPI STAT CARD COMPONENT
// ============================================================================

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle: string;
  icon: React.ReactNode;
  badgeLabel?: string;
  badgeType?: 'success' | 'warning' | 'danger';
  trend?: number;
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  icon,
  badgeLabel,
  badgeType = 'success',
  trend,
}) => {
  return (
    <div
      style={{
        backgroundColor: adminColors.background.card,
        border: `1px solid ${adminColors.border.base}`,
        borderRadius: adminBorders.radius.lg,
        padding: adminSpacing.lg,
        transition: `all 200ms ease-in-out`,
        position: 'relative',
        overflow: 'hidden',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = adminColors.background.elevated;
        e.currentTarget.style.borderColor = adminColors.primary.light;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = adminColors.background.card;
        e.currentTarget.style.borderColor = adminColors.border.base;
      }}
    >
      {/* Left accent bar */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          bottom: 0,
          width: '4px',
          backgroundColor: adminColors.primary.base,
        }}
      />

      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          marginBottom: adminSpacing.lg,
        }}
      >
        <p
          style={{
            fontSize: '12px',
            fontWeight: 500,
            color: adminColors.text.muted,
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
          }}
        >
          {title}
        </p>
        <div
          style={{
            color: adminColors.primary.base,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {icon}
        </div>
      </div>

      <div style={{ marginBottom: adminSpacing.md }}>
        <h3
          style={{
            fontSize: '32px',
            fontWeight: 600,
            color: adminColors.text.primary,
            marginBottom: '4px',
          }}
        >
          {value}
        </h3>
        <p
          style={{
            fontSize: '12px',
            color: adminColors.text.muted,
          }}
        >
          {subtitle}
        </p>
      </div>

      {(badgeLabel || trend !== undefined) && (
        <div
          style={{
            display: 'flex',
            gap: adminSpacing.md,
            alignItems: 'center',
          }}
        >
          {badgeLabel && (
            <span
              style={{
                display: 'inline-block',
                backgroundColor:
                  badgeType === 'success'
                    ? 'rgba(34, 197, 94, 0.13)'
                    : badgeType === 'warning'
                      ? 'rgba(255, 153, 0, 0.13)'
                      : 'rgba(255, 68, 68, 0.13)',
                color:
                  badgeType === 'success'
                    ? '#22C55E'
                    : badgeType === 'warning'
                      ? '#FF9900'
                      : '#FF4444',
                padding: `${adminSpacing.xs} ${adminSpacing.md}`,
                borderRadius: adminBorders.radius.full,
                fontSize: '11px',
                fontWeight: 600,
              }}
            >
              {badgeLabel}
            </span>
          )}
          {trend !== undefined && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                fontSize: '12px',
                color: trend >= 0 ? '#22C55E' : '#FF4444',
                fontWeight: 600,
              }}
            >
              <Zap size={14} />
              {trend >= 0 ? '+' : ''}{trend}%
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// ============================================================================
// ALERT ITEM COMPONENT
// ============================================================================

interface AlertItemProps {
  busNumber: string;
  message: string;
  timestamp: string;
  type: 'delay' | 'warning' | 'success';
}

const AlertItem: React.FC<AlertItemProps> = ({ busNumber, message, timestamp, type }) => {
  const getColor = () => {
    if (type === 'delay') return '#FF4444';
    if (type === 'warning') return '#FF9900';
    return '#22C55E';
  };

  return (
    <div
      style={{
        display: 'flex',
        gap: adminSpacing.md,
        padding: adminSpacing.md,
        borderBottom: `1px solid ${adminColors.border.muted}`,
        alignItems: 'flex-start',
      }}
    >
      <div
        style={{
          width: '10px',
          height: '10px',
          borderRadius: '50%',
          backgroundColor: getColor(),
          marginTop: '6px',
          flexShrink: 0,
        }}
      />
      <div style={{ flex: 1, minWidth: 0 }}>
        <p
          style={{
            fontSize: '13px',
            fontWeight: 600,
            color: adminColors.text.secondary,
            marginBottom: '2px',
          }}
        >
          {busNumber}
        </p>
        <p
          style={{
            fontSize: '12px',
            color: adminColors.text.muted,
            marginBottom: '4px',
          }}
        >
          {message}
        </p>
        <p
          style={{
            fontSize: '11px',
            color: adminColors.text.muted,
          }}
        >
          {timestamp}
        </p>
      </div>
    </div>
  );
};

// ============================================================================
// MAIN DASHBOARD COMPONENT
// ============================================================================

export function AdminDashboard() {
  const navigate = useNavigate();
  const [time] = useState(new Date());
  const [showLogoutMenu, setShowLogoutMenu] = useState(false);
  const hour = time.getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';

  const handleLogout = () => {
    try {
      localStorage.removeItem('adminAuth');
    } catch {
      // Ignore storage errors and continue logout navigation.
    }
    navigate('/login');
  };

  const statCards = [
    {
      title: 'Active Buses',
      value: 24,
      subtitle: 'of 30 total',
      icon: <Bus size={24} />,
      badgeLabel: '+2 today',
      badgeType: 'success' as const,
    },
    {
      title: 'Total Routes',
      value: 12,
      subtitle: '3 under maintenance',
      icon: <Map size={24} />,
    },
    {
      title: 'Passengers Today',
      value: '4,821',
      subtitle: '+12% vs yesterday',
      icon: <Users size={24} />,
      trend: 12,
    },
    {
      title: 'Total Stops',
      value: 87,
      subtitle: 'Amravati city',
      icon: <MapPin size={24} />,
    },
  ];

  const alerts = [
    { busNumber: 'Bus #12', message: '8 min delay on Route 5', timestamp: '2 min ago', type: 'delay' as const },
    { busNumber: 'Bus #07', message: 'Off route detected', timestamp: '5 min ago', type: 'warning' as const },
    { busNumber: 'Bus #19', message: 'On schedule', timestamp: '1 min ago', type: 'success' as const },
  ];

  const routes = [
    { route: 'Navsari → Badnera', buses: 5, avgDelay: '2 min', passengers: 142, status: 'Active' },
    { route: 'Navsari → Surat', buses: 3, avgDelay: '8 min', passengers: 89, status: 'Delayed' },
    { route: 'Navsari → Vapi', buses: 2, avgDelay: '-', passengers: 0, status: 'Maintenance' },
  ];

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: adminColors.background.page }}>
      {/* ====================================================================
          SIDEBAR
          ==================================================================== */}
      <aside
        style={{
          display: 'none',
          position: 'fixed',
          left: 0,
          top: 0,
          width: adminSizing.sidebarWidth,
          height: '100vh',
          backgroundColor: adminColors.background.sidebar,
          borderRight: `1px solid ${adminColors.border.base}`,
          overflowY: 'auto',
          overflowX: 'hidden',
          zIndex: 30,
        }}
      >
        {/* Logo */}
        <div
          style={{
            padding: adminSpacing.xl,
            display: 'flex',
            alignItems: 'center',
            gap: adminSpacing.md,
            borderBottom: `1px solid ${adminColors.border.base}`,
            marginBottom: adminSpacing.lg,
          }}
        >
          <div
            style={{
              width: '40px',
              height: '40px',
              backgroundColor: adminColors.primary.base,
              borderRadius: adminBorders.radius.md,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '18px',
              fontWeight: 700,
              color: adminColors.text.inverse,
            }}
          >
            AT
          </div>
          <div>
            <p
              style={{
                fontSize: '14px',
                fontWeight: 600,
                color: adminColors.text.primary,
              }}
            >
              AmravatiTransit
            </p>
            <p
              style={{
                fontSize: '11px',
                color: adminColors.text.muted,
              }}
            >
              Admin Panel
            </p>
          </div>
        </div>

        {/* Navigation */}
        <nav style={{ padding: `0 ${adminSpacing.sm}` }}>
          {[
            { label: 'Dashboard', icon: <BarChart3 size={18} />, isActive: true },
            { label: 'Routes', icon: <Map size={18} /> },
            { label: 'Buses', icon: <Bus size={18} /> },
            { label: 'Stops', icon: <MapPin size={18} /> },
            { label: 'Schedule', icon: <Calendar size={18} /> },
            { label: 'Trips', icon: <Users size={18} /> },
            { label: 'Analytics', icon: <BarChart3 size={18} /> },
            { label: 'Settings', icon: <Settings size={18} /> },
          ].map((item) => (
            <div
              key={item.label}
              style={{
                height: adminSizing.sidebarItemHeight,
                paddingLeft: adminSpacing.lg,
                paddingRight: adminSpacing.lg,
                display: 'flex',
                alignItems: 'center',
                gap: adminSpacing.md,
                cursor: 'pointer',
                backgroundColor: item.isActive ? adminColors.primary.light : 'transparent',
                color: item.isActive ? adminColors.primary.base : adminColors.text.secondary,
                fontWeight: item.isActive ? 600 : 400,
                fontSize: '14px',
                transition: `all 200ms ease-in-out`,
                borderRadius: adminBorders.radius.md,
                margin: `${adminSpacing.sm} 0`,
              }}
              onMouseEnter={(e) => {
                if (!item.isActive) {
                  e.currentTarget.style.backgroundColor = adminColors.background.elevated;
                }
              }}
              onMouseLeave={(e) => {
                if (!item.isActive) {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }
              }}
            >
              {item.icon}
              {item.label}
            </div>
          ))}
        </nav>
      </aside>

      {/* ====================================================================
          MAIN CONTENT
          ==================================================================== */}
      <div
        style={{
          marginLeft: 0,
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* Header */}
        <header
          style={{
            height: adminSizing.headerHeight,
            backgroundColor: adminColors.background.sidebar,
            borderBottom: `1px solid ${adminColors.border.base}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingLeft: adminSpacing.xl,
            paddingRight: adminSpacing.xl,
            zIndex: 40,
          }}
        >
          <div>
            <h2
              style={{
                fontSize: '18px',
                fontWeight: 600,
                color: adminColors.text.primary,
              }}
            >
              {greeting}, Admin
            </h2>
            <p
              style={{
                fontSize: '12px',
                color: adminColors.text.muted,
                marginTop: '2px',
              }}
            >
              {time.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
            </p>
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: adminSpacing.lg,
            }}
          >
            {/* Notification Bell */}
            <div
              style={{
                position: 'relative',
                cursor: 'pointer',
                padding: adminSpacing.sm,
                borderRadius: adminBorders.radius.md,
                transition: `all 200ms ease-in-out`,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = adminColors.background.elevated;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
              }}
            >
              <Bell size={20} style={{ color: adminColors.text.secondary }} />
              <div
                style={{
                  position: 'absolute',
                  top: '4px',
                  right: '4px',
                  width: '8px',
                  height: '8px',
                  backgroundColor: adminColors.status.danger,
                  borderRadius: '50%',
                }}
              />
            </div>

            {/* Avatar with Logout Menu */}
            <div
              style={{
                position: 'relative',
              }}
            >
              <div
                onClick={() => setShowLogoutMenu(!showLogoutMenu)}
                style={{
                  width: '36px',
                  height: '36px',
                  backgroundColor: adminColors.primary.base,
                  borderRadius: adminBorders.radius.full,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '16px',
                  fontWeight: 600,
                  color: adminColors.text.inverse,
                  cursor: 'pointer',
                  transition: `all 200ms ease-in-out`,
                }}
                onMouseEnter={(e) => {
                  if (!showLogoutMenu) {
                    e.currentTarget.style.backgroundColor = adminColors.primary.hover;
                  }
                }}
                onMouseLeave={(e) => {
                  if (!showLogoutMenu) {
                    e.currentTarget.style.backgroundColor = adminColors.primary.base;
                  }
                }}
              >
                A
              </div>

              {/* Logout Dropdown */}
              {showLogoutMenu && (
                <div
                  style={{
                    position: 'absolute',
                    right: 0,
                    top: '100%',
                    marginTop: adminSpacing.sm,
                    backgroundColor: adminColors.background.card,
                    border: `1px solid ${adminColors.border.base}`,
                    borderRadius: adminBorders.radius.md,
                    width: '160px',
                    zIndex: 100,
                    overflow: 'hidden',
                  }}
                >
                  <button
                    onClick={() => {
                      handleLogout();
                      setShowLogoutMenu(false);
                    }}
                    style={{
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      gap: adminSpacing.md,
                      padding: adminSpacing.md,
                      background: 'none',
                      border: 'none',
                      color: adminColors.status.danger,
                      cursor: 'pointer',
                      fontSize: '13px',
                      fontWeight: 500,
                      transition: `all 200ms ease-in-out`,
                      borderBottom: `1px solid ${adminColors.border.base}`,
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = adminColors.background.elevated;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'transparent';
                    }}
                  >
                    <LogOut size={14} />
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main
          style={{
            flex: 1,
            padding: adminSpacing.xl,
            overflowY: 'auto',
          }}
        >
          {/* ================================================================
              SECTION 1: KPI STAT CARDS
              ================================================================ */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
              gap: adminSpacing.lg,
              marginBottom: adminSpacing.xxl,
            }}
          >
            {statCards.map((card, idx) => (
              <StatCard
                key={idx}
                title={card.title}
                value={card.value}
                subtitle={card.subtitle}
                icon={card.icon}
                badgeLabel={card.badgeLabel}
                badgeType={card.badgeType}
                trend={card.trend}
              />
            ))}
          </div>

          {/* ================================================================
              SECTION 2: FLEET OVERVIEW & ALERTS (2/3 + 1/3 Layout)
              ================================================================ */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '2fr 1fr',
              gap: adminSpacing.lg,
              marginBottom: adminSpacing.xxl,
            }}
          >
            {/* Fleet Overview */}
            <div
              style={{
                backgroundColor: adminColors.background.card,
                border: `1px solid ${adminColors.border.base}`,
                borderRadius: adminBorders.radius.lg,
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  padding: adminSpacing.lg,
                  borderBottom: `1px solid ${adminColors.border.base}`,
                }}
              >
                <h3
                  style={{
                    fontSize: '16px',
                    fontWeight: 600,
                    color: adminColors.text.primary,
                  }}
                >
                  Live Fleet Overview
                </h3>
              </div>

              {/* Map Placeholder */}
              <div
                style={{
                  position: 'relative',
                  height: '280px',
                  backgroundColor: '#111111',
                  border: `1px solid ${adminColors.border.base}`,
                  margin: adminSpacing.lg,
                  borderRadius: adminBorders.radius.lg,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  overflow: 'hidden',
                }}
              >
                {/* Bus markers */}
                {[
                  { x: 20, y: 30 },
                  { x: 60, y: 40 },
                  { x: 40, y: 70 },
                  { x: 75, y: 50 },
                  { x: 30, y: 60 },
                  { x: 80, y: 20 },
                ].map((pos, idx) => (
                  <div
                    key={idx}
                    style={{
                      position: 'absolute',
                      left: `${pos.x}%`,
                      top: `${pos.y}%`,
                      width: '12px',
                      height: '12px',
                      backgroundColor: adminColors.primary.base,
                      borderRadius: '50%',
                      transform: 'translate(-50%, -50%)',
                      boxShadow: `0 0 10px ${adminColors.primary.base}66`,
                    }}
                  />
                ))}
                <p
                  style={{
                    position: 'absolute',
                    color: adminColors.text.muted,
                    fontSize: '13px',
                  }}
                >
                  6 buses active
                </p>
              </div>

              {/* Button */}
              <div
                style={{
                  padding: adminSpacing.lg,
                  borderTop: `1px solid ${adminColors.border.base}`,
                  textAlign: 'right',
                }}
              >
                <a
                  href="#"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    color: adminColors.primary.base,
                    fontSize: '14px',
                    fontWeight: 600,
                    textDecoration: 'none',
                    cursor: 'pointer',
                    transition: `color 200ms`,
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = adminColors.primary.hover;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = adminColors.primary.base;
                  }}
                >
                  View Full Map <ChevronRight size={16} />
                </a>
              </div>
            </div>

            {/* Recent Alerts */}
            <div
              style={{
                backgroundColor: adminColors.background.card,
                border: `1px solid ${adminColors.border.base}`,
                borderRadius: adminBorders.radius.lg,
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <div
                style={{
                  padding: adminSpacing.lg,
                  borderBottom: `1px solid ${adminColors.border.base}`,
                }}
              >
                <h3
                  style={{
                    fontSize: '16px',
                    fontWeight: 600,
                    color: adminColors.text.primary,
                  }}
                >
                  Recent Alerts
                </h3>
              </div>

              {/* Alerts List */}
              <div
                style={{
                  flex: 1,
                  overflowY: 'auto',
                }}
              >
                {alerts.map((alert, idx) => (
                  <AlertItem key={idx} {...alert} />
                ))}
              </div>
            </div>
          </div>

          {/* ================================================================
              SECTION 3: ROUTE HEALTH TABLE
              ================================================================ */}
          <div
            style={{
              backgroundColor: adminColors.background.card,
              border: `1px solid ${adminColors.border.base}`,
              borderRadius: adminBorders.radius.lg,
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                padding: adminSpacing.lg,
                borderBottom: `1px solid ${adminColors.border.base}`,
              }}
            >
              <h3
                style={{
                  fontSize: '16px',
                  fontWeight: 600,
                  color: adminColors.text.primary,
                }}
              >
                Route Health
              </h3>
            </div>

            {/* Table */}
            <div style={{ overflowX: 'auto' }}>
              <table
                style={{
                  width: '100%',
                  borderCollapse: 'collapse',
                }}
              >
                <thead>
                  <tr
                    style={{
                      backgroundColor: adminColors.background.sidebar,
                      borderBottom: `1px solid ${adminColors.border.base}`,
                    }}
                  >
                    {['Route', 'Buses Assigned', 'Avg Delay', 'Passengers', 'Status'].map((header) => (
                      <th
                        key={header}
                        style={{
                          padding: adminSpacing.md,
                          textAlign: 'left',
                          fontSize: '12px',
                          fontWeight: 600,
                          color: adminColors.text.muted,
                          textTransform: 'uppercase',
                          letterSpacing: '0.05em',
                        }}
                      >
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {routes.map((route, idx) => (
                    <tr
                      key={idx}
                      style={{
                        borderBottom: `1px solid ${adminColors.border.base}`,
                        transition: `background-color 200ms`,
                        backgroundColor: adminColors.background.card,
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = adminColors.background.elevated;
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = adminColors.background.card;
                      }}
                    >
                      <td
                        style={{
                          padding: adminSpacing.md,
                          fontSize: '14px',
                          color: adminColors.text.secondary,
                          fontWeight: 500,
                        }}
                      >
                        {route.route}
                      </td>
                      <td
                        style={{
                          padding: adminSpacing.md,
                          fontSize: '14px',
                          color: adminColors.text.secondary,
                        }}
                      >
                        {route.buses}
                      </td>
                      <td
                        style={{
                          padding: adminSpacing.md,
                          fontSize: '14px',
                          color: adminColors.text.secondary,
                        }}
                      >
                        {route.avgDelay}
                      </td>
                      <td
                        style={{
                          padding: adminSpacing.md,
                          fontSize: '14px',
                          color: adminColors.text.secondary,
                        }}
                      >
                        {route.passengers}
                      </td>
                      <td style={{ padding: adminSpacing.md }}>
                        <span
                          style={{
                            display: 'inline-block',
                            backgroundColor:
                              route.status === 'Active'
                                ? adminColors.primary.base
                                : route.status === 'Delayed'
                                  ? 'rgba(255, 153, 0, 0.8)'
                                  : 'rgba(255, 68, 68, 0.8)',
                            color:
                              route.status === 'Active' ? adminColors.text.inverse : 'white',
                            padding: `${adminSpacing.xs} ${adminSpacing.md}`,
                            borderRadius: adminBorders.radius.full,
                            fontSize: '11px',
                            fontWeight: 600,
                          }}
                        >
                          {route.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Footer */}
            <div
              style={{
                padding: adminSpacing.lg,
                borderTop: `1px solid ${adminColors.border.base}`,
                textAlign: 'right',
              }}
            >
              <a
                href="#"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  color: adminColors.primary.base,
                  fontSize: '14px',
                  fontWeight: 600,
                  textDecoration: 'none',
                  cursor: 'pointer',
                  transition: `color 200ms`,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = adminColors.primary.hover;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = adminColors.primary.base;
                }}
              >
                View All Routes <ChevronRight size={16} />
              </a>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default AdminDashboard;
