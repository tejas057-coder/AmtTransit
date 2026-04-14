/**
 * Route Management Page
 * Manage bus routes with add/edit, view stops timeline, and route details
 */

import React, { useState, useCallback } from 'react';
import {
  Plus,
  Edit,
  Trash2,
  MapPin,
  Clock,
  Bus,
  ChevronDown,
  ChevronUp,
  X,
  GripVertical,
  ArrowUp,
  ArrowDown,
  Map,
  Calendar,
} from 'lucide-react';
import { adminColors, adminSpacing, adminBorders, adminSizing } from '@/lib/adminDesignTokens';
import { Button, Badge } from '@/components/common';

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

interface Stop {
  id: string;
  name: string;
  estimatedTime: string;
  order: number;
}

interface Route {
  id: string;
  number: string;
  name: string;
  startStop: string;
  endStop: string;
  distance: string;
  stops: Stop[];
  busesAssigned: number;
  status: 'active' | 'inactive' | 'maintenance';
  scheduleType: 'weekday' | 'weekend' | 'both';
  assignedBuses: string[];
}

interface FormData {
  routeName: string;
  routeNumber: string;
  startStop: string;
  endStop: string;
  via: Stop[];
  assignedBuses: string[];
  scheduleType: 'weekday' | 'weekend' | 'both';
  status: boolean;
}

// ============================================================================
// MOCK DATA
// ============================================================================

const MOCK_ROUTES: Route[] = [
  {
    id: 'route-1',
    number: '4',
    name: 'Rajapeth – Cotton Market',
    startStop: 'Rajapeth Junction',
    endStop: 'Cotton Market',
    distance: '8.4 km',
    stops: [
      { id: 's1', name: 'Rajapeth Junction', estimatedTime: '00:00', order: 1 },
      { id: 's2', name: 'Rani Garden', estimatedTime: '05:00', order: 2 },
      { id: 's3', name: 'Police Station', estimatedTime: '10:00', order: 3 },
      { id: 's4', name: 'Hospital Road', estimatedTime: '15:00', order: 4 },
      { id: 's5', name: 'Market Circle', estimatedTime: '20:00', order: 5 },
      { id: 's6', name: 'Cotton Market', estimatedTime: '25:00', order: 6 },
    ],
    busesAssigned: 3,
    status: 'active',
    scheduleType: 'both',
    assignedBuses: ['AMT-001', 'AMT-002', 'AMT-003'],
  },
  {
    id: 'route-2',
    number: '7',
    name: 'Station – University',
    startStop: 'Railway Station',
    endStop: 'University Campus',
    distance: '12.8 km',
    stops: [
      { id: 's7', name: 'Railway Station', estimatedTime: '00:00', order: 1 },
      { id: 's8', name: 'City Center', estimatedTime: '08:00', order: 2 },
      { id: 's9', name: 'Sports Complex', estimatedTime: '18:00', order: 3 },
      { id: 's10', name: 'University Campus', estimatedTime: '28:00', order: 4 },
    ],
    busesAssigned: 2,
    status: 'active',
    scheduleType: 'weekday',
    assignedBuses: ['AMT-004', 'AMT-005'],
  },
  {
    id: 'route-3',
    number: '12',
    name: 'Airport – City Center',
    startStop: 'Airport Terminal',
    endStop: 'City Center',
    distance: '22.5 km',
    stops: [
      { id: 's11', name: 'Airport Terminal', estimatedTime: '00:00', order: 1 },
      { id: 's12', name: 'Airport Road', estimatedTime: '10:00', order: 2 },
      { id: 's13', name: 'Highway Bypass', estimatedTime: '20:00', order: 3 },
      { id: 's14', name: 'City Center', estimatedTime: '35:00', order: 4 },
    ],
    busesAssigned: 4,
    status: 'maintenance',
    scheduleType: 'both',
    assignedBuses: ['AMT-006', 'AMT-007', 'AMT-008', 'AMT-009'],
  },
];

const MOCK_BUSES = [
  'AMT-001',
  'AMT-002',
  'AMT-003',
  'AMT-004',
  'AMT-005',
  'AMT-006',
  'AMT-007',
  'AMT-008',
  'AMT-009',
  'AMT-010',
];

const MOCK_STOPS = [
  { id: 'stop-1', name: 'Rajapeth Junction' },
  { id: 'stop-2', name: 'Rani Garden' },
  { id: 'stop-3', name: 'Police Station' },
  { id: 'stop-4', name: 'Hospital Road' },
  { id: 'stop-5', name: 'Market Circle' },
  { id: 'stop-6', name: 'Cotton Market' },
  { id: 'stop-7', name: 'Railway Station' },
  { id: 'stop-8', name: 'City Center' },
  { id: 'stop-9', name: 'Sports Complex' },
  { id: 'stop-10', name: 'University Campus' },
];

// ============================================================================
// STOP TIMELINE COMPONENT
// ============================================================================

interface StopTimelineProps {
  stops: Stop[];
  isExpanded: boolean;
}

const StopTimeline: React.FC<StopTimelineProps> = ({ stops, isExpanded }) => {
  if (!isExpanded) return null;

  return (
    <div
      style={{
        marginTop: adminSpacing.lg,
        paddingTop: adminSpacing.lg,
        borderTop: `1px solid ${adminColors.border.base}`,
        position: 'relative',
        paddingLeft: adminSpacing.xl,
      }}
    >
      {/* Vertical line */}
      <div
        style={{
          position: 'absolute',
          left: '12px',
          top: adminSpacing.xl,
          bottom: 0,
          width: '2px',
          backgroundColor: adminColors.border.base,
        }}
      />

      {/* Timeline stops */}
      {stops.map((stop, idx) => {
        const isFirst = idx === 0;
        const isLast = idx === stops.length - 1;

        return (
          <div
            key={stop.id}
            style={{
              display: 'flex',
              gap: adminSpacing.lg,
              marginBottom: adminSpacing.md,
              alignItems: 'flex-start',
              position: 'relative',
            }}
          >
            {/* Dot */}
            <div
              style={{
                position: 'absolute',
                left: '-20px',
                top: '2px',
                width: isFirst || isLast ? '16px' : '12px',
                height: isFirst || isLast ? '16px' : '12px',
                backgroundColor: adminColors.primary.base,
                borderRadius: '50%',
                border: isFirst || isLast ? `3px solid ${adminColors.primary.base}` : 'none',
                boxShadow: `0 0 8px ${adminColors.primary.base}66`,
                zIndex: 1,
              }}
            />

            {/* Stop details */}
            <div>
              <p
                style={{
                  fontSize: '13px',
                  fontWeight: 500,
                  color: adminColors.text.secondary,
                  marginBottom: '2px',
                }}
              >
                {stop.name}
              </p>
              <p
                style={{
                  fontSize: '11px',
                  color: adminColors.text.muted,
                }}
              >
                {stop.estimatedTime}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

// ============================================================================
// ROUTE CARD COMPONENT
// ============================================================================

interface RouteCardProps {
  route: Route;
  onEdit: (route: Route) => void;
  onDelete: (routeId: string) => void;
}

const RouteCard: React.FC<RouteCardProps> = ({ route, onEdit, onDelete }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const getStatusColor = (status: string) => {
    if (status === 'active') return adminColors.primary.base;
    if (status === 'inactive') return adminColors.border.base;
    return adminColors.status.warning;
  };

  const getStatusLabel = (status: string) => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  return (
    <div
      style={{
        backgroundColor: adminColors.background.card,
        border: `1px solid ${adminColors.border.base}`,
        borderRadius: adminBorders.radius.lg,
        padding: adminSpacing.lg,
        transition: `all 200ms ease-in-out`,
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
      {/* Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          marginBottom: adminSpacing.md,
        }}
      >
        <div>
          <div style={{ display: 'flex', gap: adminSpacing.sm, alignItems: 'center', marginBottom: adminSpacing.xs }}>
            <span
              style={{
                backgroundColor: adminColors.primary.light,
                color: adminColors.primary.base,
                padding: `${adminSpacing.xs} ${adminSpacing.md}`,
                borderRadius: adminBorders.radius.full,
                fontSize: '11px',
                fontWeight: 600,
              }}
            >
              Route {route.number}
            </span>
            <span
              style={{
                backgroundColor: getStatusColor(route.status),
                color:
                  route.status === 'active' || route.status === 'maintenance'
                    ? adminColors.text.inverse
                    : adminColors.text.muted,
                padding: `${adminSpacing.xs} ${adminSpacing.md}`,
                borderRadius: adminBorders.radius.full,
                fontSize: '11px',
                fontWeight: 600,
              }}
            >
              {getStatusLabel(route.status)}
            </span>
          </div>
          <h3
            style={{
              fontSize: '16px',
              fontWeight: 600,
              color: adminColors.text.primary,
              marginBottom: adminSpacing.sm,
            }}
          >
            {route.name}
          </h3>
        </div>
      </div>

      {/* Stats Row */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: adminSpacing.md,
          marginBottom: adminSpacing.lg,
          paddingBottom: adminSpacing.lg,
          borderBottom: `1px solid ${adminColors.border.base}`,
        }}
      >
        {/* Stops */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: adminSpacing.xs, marginBottom: '4px' }}>
            <MapPin size={16} style={{ color: adminColors.text.muted }} />
            <p
              style={{
                fontSize: '11px',
                color: adminColors.text.muted,
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
              }}
            >
              Stops
            </p>
          </div>
          <p
            style={{
              fontSize: '16px',
              fontWeight: 600,
              color: adminColors.text.primary,
            }}
          >
            {route.stops.length}
          </p>
        </div>

        {/* Distance */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: adminSpacing.xs, marginBottom: '4px' }}>
            <Map size={16} style={{ color: adminColors.text.muted }} />
            <p
              style={{
                fontSize: '11px',
                color: adminColors.text.muted,
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
              }}
            >
              Distance
            </p>
          </div>
          <p
            style={{
              fontSize: '16px',
              fontWeight: 600,
              color: adminColors.text.primary,
            }}
          >
            {route.distance}
          </p>
        </div>

        {/* Buses */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: adminSpacing.xs, marginBottom: '4px' }}>
            <Bus size={16} style={{ color: adminColors.text.muted }} />
            <p
              style={{
                fontSize: '11px',
                color: adminColors.text.muted,
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
              }}
            >
              Buses
            </p>
          </div>
          <p
            style={{
              fontSize: '16px',
              fontWeight: 600,
              color: adminColors.text.primary,
            }}
          >
            {route.busesAssigned}
          </p>
        </div>
      </div>

      {/* Timeline Accordion */}
      <div
        style={{
          marginBottom: adminSpacing.md,
          borderRadius: adminBorders.radius.md,
          backgroundColor: adminColors.background.page,
          padding: adminSpacing.md,
        }}
      >
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: 'none',
            border: 'none',
            color: adminColors.text.secondary,
            cursor: 'pointer',
            fontSize: '13px',
            fontWeight: 500,
            padding: 0,
          }}
        >
          <span>View Stops Timeline</span>
          {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </button>

        <StopTimeline stops={route.stops} isExpanded={isExpanded} />
      </div>

      {/* Action Buttons */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: adminSpacing.sm,
        }}
      >
        <button
          onClick={() => onEdit(route)}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: adminSpacing.xs,
            height: '36px',
            backgroundColor: 'transparent',
            border: `1px solid ${adminColors.border.base}`,
            borderRadius: adminBorders.radius.md,
            color: adminColors.text.secondary,
            cursor: 'pointer',
            fontSize: '12px',
            fontWeight: 500,
            transition: `all 200ms ease-in-out`,
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = adminColors.primary.base;
            e.currentTarget.style.color = adminColors.primary.base;
            e.currentTarget.style.backgroundColor = adminColors.primary.light;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = adminColors.border.base;
            e.currentTarget.style.color = adminColors.text.secondary;
            e.currentTarget.style.backgroundColor = 'transparent';
          }}
        >
          <Edit size={14} />
          Edit
        </button>

        <button
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: adminSpacing.xs,
            height: '36px',
            backgroundColor: 'transparent',
            border: `1px solid ${adminColors.border.base}`,
            borderRadius: adminBorders.radius.md,
            color: adminColors.text.secondary,
            cursor: 'pointer',
            fontSize: '12px',
            fontWeight: 500,
            transition: `all 200ms ease-in-out`,
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = adminColors.primary.base;
            e.currentTarget.style.color = adminColors.primary.base;
            e.currentTarget.style.backgroundColor = adminColors.primary.light;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = adminColors.border.base;
            e.currentTarget.style.color = adminColors.text.secondary;
            e.currentTarget.style.backgroundColor = 'transparent';
          }}
        >
          <Map size={14} />
          Map
        </button>

        <button
          onClick={() => onDelete(route.id)}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: adminSpacing.xs,
            height: '36px',
            backgroundColor: 'transparent',
            border: `1px solid ${adminColors.border.base}`,
            borderRadius: adminBorders.radius.md,
            color: adminColors.text.secondary,
            cursor: 'pointer',
            fontSize: '12px',
            fontWeight: 500,
            transition: `all 200ms ease-in-out`,
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = adminColors.status.danger;
            e.currentTarget.style.color = adminColors.status.danger;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = adminColors.border.base;
            e.currentTarget.style.color = adminColors.text.secondary;
          }}
        >
          <Trash2 size={14} />
          Delete
        </button>
      </div>
    </div>
  );
};

// ============================================================================
// ADD/EDIT ROUTE DRAWER COMPONENT
// ============================================================================

interface AddEditRouteDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  editingRoute?: Route;
}

const AddEditRouteDrawer: React.FC<AddEditRouteDrawerProps> = ({ isOpen, onClose, editingRoute }) => {
  const [formData, setFormData] = useState<FormData>({
    routeName: editingRoute?.name || '',
    routeNumber: editingRoute?.number || '',
    startStop: editingRoute?.startStop || '',
    endStop: editingRoute?.endStop || '',
    via: editingRoute?.stops || [],
    assignedBuses: editingRoute?.assignedBuses || [],
    scheduleType: editingRoute?.scheduleType || 'both',
    status: editingRoute?.status === 'active',
  });

  const [viaStops, setViaStops] = useState<Stop[]>(formData.via);

  const handleAddStop = () => {
    const newStop: Stop = {
      id: `stop-${Date.now()}`,
      name: '',
      estimatedTime: '',
      order: viaStops.length + 1,
    };
    setViaStops([...viaStops, newStop]);
  };

  const handleRemoveStop = (stopId: string) => {
    setViaStops(viaStops.filter((s) => s.id !== stopId));
  };

  const handleMoveStop = (index: number, direction: 'up' | 'down') => {
    if ((direction === 'up' && index === 0) || (direction === 'down' && index === viaStops.length - 1)) {
      return;
    }

    const newStops = [...viaStops];
    const swapIndex = direction === 'up' ? index - 1 : index + 1;
    [newStops[index], newStops[swapIndex]] = [newStops[swapIndex], newStops[index]];
    setViaStops(newStops);
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div
        onClick={onClose}
        style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          zIndex: 40,
          transition: `opacity 200ms ease-in-out`,
          opacity: isOpen ? 1 : 0,
        }}
      />

      {/* Drawer */}
      <div
        style={{
          position: 'fixed',
          right: 0,
          top: 0,
          bottom: 0,
          width: '400px',
          backgroundColor: adminColors.background.sidebar,
          border: `1px solid ${adminColors.border.base}`,
          borderLeft: `1px solid ${adminColors.border.base}`,
          zIndex: 50,
          display: 'flex',
          flexDirection: 'column',
          transform: isOpen ? 'translateX(0)' : 'translateX(100%)',
          transition: `transform 200ms ease-in-out`,
          boxShadow: '-4px 0 16px rgba(0, 0, 0, 0.3)',
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: adminSpacing.lg,
            borderBottom: `1px solid ${adminColors.border.base}`,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <h2
            style={{
              fontSize: '16px',
              fontWeight: 600,
              color: adminColors.text.primary,
            }}
          >
            {editingRoute ? 'Edit Route' : 'Add Route'}
          </h2>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              color: adminColors.text.muted,
              cursor: 'pointer',
              padding: adminSpacing.xs,
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: adminSpacing.lg,
            display: 'flex',
            flexDirection: 'column',
            gap: adminSpacing.lg,
          }}
        >
          {/* Route Name */}
          <div>
            <label
              style={{
                display: 'block',
                fontSize: '12px',
                fontWeight: 500,
                color: adminColors.text.muted,
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                marginBottom: adminSpacing.sm,
              }}
            >
              Route Name
            </label>
            <input
              type="text"
              value={formData.routeName}
              onChange={(e) => setFormData({ ...formData, routeName: e.target.value })}
              style={{
                width: '100%',
                backgroundColor: adminColors.background.elevated,
                border: `1px solid ${adminColors.border.base}`,
                color: adminColors.text.secondary,
                borderRadius: adminBorders.radius.md,
                height: '36px',
                padding: `0 ${adminSpacing.md}`,
                fontSize: '13px',
                fontFamily: 'inherit',
                boxSizing: 'border-box',
              }}
              placeholder="e.g., Navsari – Badnera"
            />
          </div>

          {/* Route Number */}
          <div>
            <label
              style={{
                display: 'block',
                fontSize: '12px',
                fontWeight: 500,
                color: adminColors.text.muted,
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                marginBottom: adminSpacing.sm,
              }}
            >
              Route Number
            </label>
            <input
              type="text"
              value={formData.routeNumber}
              onChange={(e) => setFormData({ ...formData, routeNumber: e.target.value })}
              style={{
                width: '100%',
                backgroundColor: adminColors.background.elevated,
                border: `1px solid ${adminColors.border.base}`,
                color: adminColors.text.secondary,
                borderRadius: adminBorders.radius.md,
                height: '36px',
                padding: `0 ${adminSpacing.md}`,
                fontSize: '13px',
                fontFamily: 'inherit',
                boxSizing: 'border-box',
              }}
              placeholder="e.g., 4"
            />
          </div>

          {/* Start Stop */}
          <div>
            <label
              style={{
                display: 'block',
                fontSize: '12px',
                fontWeight: 500,
                color: adminColors.text.muted,
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                marginBottom: adminSpacing.sm,
              }}
            >
              Start Stop
            </label>
            <select
              value={formData.startStop}
              onChange={(e) => setFormData({ ...formData, startStop: e.target.value })}
              style={{
                width: '100%',
                backgroundColor: adminColors.background.elevated,
                border: `1px solid ${adminColors.border.base}`,
                color: adminColors.text.secondary,
                borderRadius: adminBorders.radius.md,
                height: '36px',
                padding: `0 ${adminSpacing.md}`,
                fontSize: '13px',
                fontFamily: 'inherit',
                boxSizing: 'border-box',
              }}
            >
              <option value="">Select start stop...</option>
              {MOCK_STOPS.map((stop) => (
                <option key={stop.id} value={stop.name}>
                  {stop.name}
                </option>
              ))}
            </select>
          </div>

          {/* End Stop */}
          <div>
            <label
              style={{
                display: 'block',
                fontSize: '12px',
                fontWeight: 500,
                color: adminColors.text.muted,
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                marginBottom: adminSpacing.sm,
              }}
            >
              End Stop
            </label>
            <select
              value={formData.endStop}
              onChange={(e) => setFormData({ ...formData, endStop: e.target.value })}
              style={{
                width: '100%',
                backgroundColor: adminColors.background.elevated,
                border: `1px solid ${adminColors.border.base}`,
                color: adminColors.text.secondary,
                borderRadius: adminBorders.radius.md,
                height: '36px',
                padding: `0 ${adminSpacing.md}`,
                fontSize: '13px',
                fontFamily: 'inherit',
                boxSizing: 'border-box',
              }}
            >
              <option value="">Select end stop...</option>
              {MOCK_STOPS.map((stop) => (
                <option key={stop.id} value={stop.name}>
                  {stop.name}
                </option>
              ))}
            </select>
          </div>

          {/* Via Stops (Reorderable) */}
          <div>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: adminSpacing.sm,
              }}
            >
              <label
                style={{
                  fontSize: '12px',
                  fontWeight: 500,
                  color: adminColors.text.muted,
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                }}
              >
                Intermediate Stops
              </label>
              <button
                onClick={handleAddStop}
                style={{
                  background: 'none',
                  border: 'none',
                  color: adminColors.primary.base,
                  cursor: 'pointer',
                  fontSize: '12px',
                  fontWeight: 600,
                  padding: 0,
                }}
              >
                + Add Stop
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: adminSpacing.sm }}>
              {viaStops.map((stop, idx) => (
                <div
                  key={stop.id}
                  style={{
                    display: 'flex',
                    gap: adminSpacing.sm,
                    alignItems: 'center',
                    padding: adminSpacing.sm,
                    backgroundColor: adminColors.background.elevated,
                    borderRadius: adminBorders.radius.md,
                    border: `1px solid ${adminColors.border.base}`,
                  }}
                >
                  <GripVertical size={14} style={{ color: adminColors.text.muted }} />
                  <input
                    type="text"
                    value={stop.name}
                    placeholder="Stop name"
                    style={{
                      flex: 1,
                      background: 'none',
                      border: 'none',
                      color: adminColors.text.secondary,
                      fontSize: '12px',
                      outline: 'none',
                    }}
                  />

                  {idx > 0 && (
                    <button
                      onClick={() => handleMoveStop(idx, 'up')}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: adminColors.text.muted,
                        cursor: 'pointer',
                        padding: 0,
                      }}
                    >
                      <ArrowUp size={14} />
                    </button>
                  )}

                  {idx < viaStops.length - 1 && (
                    <button
                      onClick={() => handleMoveStop(idx, 'down')}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: adminColors.text.muted,
                        cursor: 'pointer',
                        padding: 0,
                      }}
                    >
                      <ArrowDown size={14} />
                    </button>
                  )}

                  <button
                    onClick={() => handleRemoveStop(stop.id)}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: adminColors.status.danger,
                      cursor: 'pointer',
                      padding: 0,
                    }}
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Assign Buses */}
          <div>
            <label
              style={{
                display: 'block',
                fontSize: '12px',
                fontWeight: 500,
                color: adminColors.text.muted,
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                marginBottom: adminSpacing.sm,
              }}
            >
              Assign Buses (Multi-select)
            </label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: adminSpacing.xs }}>
              {MOCK_BUSES.map((bus) => (
                <button
                  key={bus}
                  onClick={() => {
                    const isSelected = formData.assignedBuses.includes(bus);
                    setFormData({
                      ...formData,
                      assignedBuses: isSelected
                        ? formData.assignedBuses.filter((b) => b !== bus)
                        : [...formData.assignedBuses, bus],
                    });
                  }}
                  style={{
                    padding: `${adminSpacing.xs} ${adminSpacing.md}`,
                    borderRadius: adminBorders.radius.full,
                    border: `1px solid ${
                      formData.assignedBuses.includes(bus) ? adminColors.primary.base : adminColors.border.base
                    }`,
                    backgroundColor: formData.assignedBuses.includes(bus) ? adminColors.primary.light : 'transparent',
                    color: formData.assignedBuses.includes(bus)
                      ? adminColors.primary.base
                      : adminColors.text.secondary,
                    cursor: 'pointer',
                    fontSize: '11px',
                    fontWeight: 500,
                    transition: `all 200ms ease-in-out`,
                  }}
                >
                  {bus}
                </button>
              ))}
            </div>
          </div>

          {/* Schedule Type */}
          <div>
            <label
              style={{
                display: 'block',
                fontSize: '12px',
                fontWeight: 500,
                color: adminColors.text.muted,
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                marginBottom: adminSpacing.sm,
              }}
            >
              Schedule Type
            </label>
            <div style={{ display: 'flex', gap: adminSpacing.sm }}>
              {(['weekday', 'weekend', 'both'] as const).map((type) => (
                <button
                  key={type}
                  onClick={() => setFormData({ ...formData, scheduleType: type })}
                  style={{
                    flex: 1,
                    height: '36px',
                    borderRadius: adminBorders.radius.md,
                    border: `1px solid ${
                      formData.scheduleType === type ? adminColors.primary.base : adminColors.border.base
                    }`,
                    backgroundColor:
                      formData.scheduleType === type ? adminColors.primary.light : adminColors.background.elevated,
                    color:
                      formData.scheduleType === type ? adminColors.primary.base : adminColors.text.secondary,
                    cursor: 'pointer',
                    fontSize: '12px',
                    fontWeight: 500,
                    textTransform: 'capitalize',
                    transition: `all 200ms ease-in-out`,
                  }}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          {/* Status Toggle */}
          <div>
            <label
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: adminSpacing.md,
                cursor: 'pointer',
              }}
            >
              <div
                style={{
                  width: '48px',
                  height: '24px',
                  backgroundColor: formData.status ? adminColors.primary.base : adminColors.border.base,
                  borderRadius: adminBorders.radius.full,
                  position: 'relative',
                  transition: `background-color 200ms ease-in-out`,
                }}
              >
                <div
                  style={{
                    width: '20px',
                    height: '20px',
                    backgroundColor: adminColors.text.inverse,
                    borderRadius: '50%',
                    position: 'absolute',
                    top: '2px',
                    left: formData.status ? '26px' : '2px',
                    transition: `left 200ms ease-in-out`,
                  }}
                />
              </div>
              <span
                style={{
                  fontSize: '13px',
                  color: adminColors.text.secondary,
                  fontWeight: 500,
                }}
              >
                Active Route
              </span>
              <input
                type="checkbox"
                checked={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.checked })}
                style={{
                  display: 'none',
                }}
              />
            </label>
          </div>
        </div>

        {/* Footer Buttons */}
        <div
          style={{
            padding: adminSpacing.lg,
            borderTop: `1px solid ${adminColors.border.base}`,
            display: 'flex',
            gap: adminSpacing.md,
          }}
        >
          <button
            onClick={onClose}
            style={{
              flex: 1,
              height: '40px',
              backgroundColor: 'transparent',
              border: `1px solid ${adminColors.border.base}`,
              borderRadius: adminBorders.radius.md,
              color: adminColors.text.secondary,
              cursor: 'pointer',
              fontSize: '13px',
              fontWeight: 600,
              transition: `all 200ms ease-in-out`,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = adminColors.background.elevated;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
          >
            Cancel
          </button>
          <button
            style={{
              flex: 1,
              height: '40px',
              backgroundColor: adminColors.primary.base,
              border: 'none',
              borderRadius: adminBorders.radius.md,
              color: adminColors.text.inverse,
              cursor: 'pointer',
              fontSize: '13px',
              fontWeight: 600,
              transition: `all 200ms ease-in-out`,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = adminColors.primary.hover;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = adminColors.primary.base;
            }}
          >
            {editingRoute ? 'Update Route' : 'Add Route'}
          </button>
        </div>
      </div>
    </>
  );
};

// ============================================================================
// MAIN ROUTE MANAGEMENT COMPONENT
// ============================================================================

export function RouteManagement() {
  const [routes, setRoutes] = useState<Route[]>(MOCK_ROUTES);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [editingRoute, setEditingRoute] = useState<Route | undefined>(undefined);

  const handleEdit = (route: Route) => {
    setEditingRoute(route);
    setIsDrawerOpen(true);
  };

  const handleDelete = (routeId: string) => {
    if (confirm('Are you sure you want to delete this route?')) {
      setRoutes(routes.filter((r) => r.id !== routeId));
    }
  };

  const handleAddRoute = () => {
    setEditingRoute(undefined);
    setIsDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setIsDrawerOpen(false);
    setEditingRoute(undefined);
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: adminColors.background.page }}>
      {/* Main Content */}
      <div style={{ flex: 1, padding: adminSpacing.xl }}>
        {/* Header */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: adminSpacing.xxl,
          }}
        >
          <h1
            style={{
              fontSize: '24px',
              fontWeight: 600,
              color: adminColors.text.primary,
            }}
          >
            Route Management
          </h1>
          <button
            onClick={handleAddRoute}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: adminSpacing.sm,
              height: '40px',
              backgroundColor: adminColors.primary.base,
              border: 'none',
              borderRadius: adminBorders.radius.md,
              color: adminColors.text.inverse,
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: 600,
              padding: `0 ${adminSpacing.lg}`,
              transition: `all 200ms ease-in-out`,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = adminColors.primary.hover;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = adminColors.primary.base;
            }}
          >
            <Plus size={18} />
            Add Route
          </button>
        </div>

        {/* Route Cards Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(450px, 1fr))',
            gap: adminSpacing.lg,
          }}
        >
          {routes.map((route) => (
            <RouteCard key={route.id} route={route} onEdit={handleEdit} onDelete={handleDelete} />
          ))}
        </div>

        {/* Empty State */}
        {routes.length === 0 && (
          <div
            style={{
              textAlign: 'center',
              padding: adminSpacing.xxxl,
              backgroundColor: adminColors.background.card,
              borderRadius: adminBorders.radius.lg,
              border: `1px solid ${adminColors.border.base}`,
            }}
          >
            <p
              style={{
                fontSize: '16px',
                color: adminColors.text.muted,
                marginBottom: adminSpacing.lg,
              }}
            >
              No routes found
            </p>
            <button
              onClick={handleAddRoute}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: adminSpacing.sm,
                height: '40px',
                backgroundColor: adminColors.primary.base,
                border: 'none',
                borderRadius: adminBorders.radius.md,
                color: adminColors.text.inverse,
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: 600,
                padding: `0 ${adminSpacing.lg}`,
              }}
            >
              <Plus size={18} />
              Create First Route
            </button>
          </div>
        )}
      </div>

      {/* Add/Edit Drawer */}
      <AddEditRouteDrawer isOpen={isDrawerOpen} onClose={handleCloseDrawer} editingRoute={editingRoute} />
    </div>
  );
}

export default RouteManagement;
