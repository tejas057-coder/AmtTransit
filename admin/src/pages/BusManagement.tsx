import React, { useMemo, useState } from 'react';
import { MoreVertical, Pencil, Plus, Search, Trash2, UserCircle2, X } from 'lucide-react';
import { adminBorders, adminColors, adminSpacing } from '@/lib/adminDesignTokens';

type BusStatus = 'Active' | 'Inactive' | 'Maintenance';

type Bus = {
  id: string;
  busNo: string;
  route: string;
  driverName: string;
  driverInitials: string;
  occupied: number;
  capacity: number;
  status: BusStatus;
  lastActive: string;
  registrationNo: string;
  model: string;
};

type FilterKey = 'all' | 'active' | 'inactive' | 'maintenance';

type NewBusForm = {
  busNumber: string;
  registrationNo: string;
  capacity: string;
  model: string;
  route: string;
  driver: string;
  status: 'Active' | 'Inactive';
};

const ROUTES = Array.from({ length: 12 }, (_, idx) => `Route ${idx + 1}`);

const DRIVERS = [
  'Amit Kulkarni',
  'Ravi Sharma',
  'Sanjay Patil',
  'Priya Deshmukh',
  'Nitin Rao',
  'Asha Joshi',
  'Vivek Jain',
  'Pooja Verma',
];

const INITIAL_BUSES: Bus[] = [
  {
    id: 'b-001',
    busNo: 'Bus #12',
    route: 'Route 4',
    driverName: 'Amit Kulkarni',
    driverInitials: 'AK',
    occupied: 42,
    capacity: 52,
    status: 'Active',
    lastActive: '2 min ago',
    registrationNo: 'MH27-AB-1012',
    model: 'Tata Starbus',
  },
  {
    id: 'b-002',
    busNo: 'Bus #07',
    route: 'Route 2',
    driverName: 'Ravi Sharma',
    driverInitials: 'RS',
    occupied: 36,
    capacity: 52,
    status: 'Active',
    lastActive: '5 min ago',
    registrationNo: 'MH27-AB-1007',
    model: 'Ashok Leyland City',
  },
  {
    id: 'b-003',
    busNo: 'Bus #03',
    route: 'Route 9',
    driverName: 'Sanjay Patil',
    driverInitials: 'SP',
    occupied: 28,
    capacity: 46,
    status: 'Inactive',
    lastActive: '1 hr ago',
    registrationNo: 'MH27-AB-1003',
    model: 'Eicher Skyline',
  },
  {
    id: 'b-004',
    busNo: 'Bus #15',
    route: 'Route 1',
    driverName: 'Priya Deshmukh',
    driverInitials: 'PD',
    occupied: 20,
    capacity: 42,
    status: 'Maintenance',
    lastActive: '3 hr ago',
    registrationNo: 'MH27-AB-1015',
    model: 'Volvo 8400',
  },
  {
    id: 'b-005',
    busNo: 'Bus #21',
    route: 'Route 7',
    driverName: 'Nitin Rao',
    driverInitials: 'NR',
    occupied: 48,
    capacity: 52,
    status: 'Active',
    lastActive: '1 min ago',
    registrationNo: 'MH27-AB-1021',
    model: 'Tata Starbus',
  },
  {
    id: 'b-006',
    busNo: 'Bus #28',
    route: 'Route 11',
    driverName: 'Asha Joshi',
    driverInitials: 'AJ',
    occupied: 39,
    capacity: 52,
    status: 'Active',
    lastActive: '8 min ago',
    registrationNo: 'MH27-AB-1028',
    model: 'Ashok Leyland City',
  },
  {
    id: 'b-007',
    busNo: 'Bus #19',
    route: 'Route 5',
    driverName: 'Vivek Jain',
    driverInitials: 'VJ',
    occupied: 31,
    capacity: 52,
    status: 'Inactive',
    lastActive: '2 hr ago',
    registrationNo: 'MH27-AB-1019',
    model: 'Eicher Skyline',
  },
  {
    id: 'b-008',
    busNo: 'Bus #30',
    route: 'Route 12',
    driverName: 'Pooja Verma',
    driverInitials: 'PV',
    occupied: 26,
    capacity: 42,
    status: 'Maintenance',
    lastActive: '5 hr ago',
    registrationNo: 'MH27-AB-1030',
    model: 'Tata Electric',
  },
];

const NEW_BUS_INITIAL: NewBusForm = {
  busNumber: '',
  registrationNo: '',
  capacity: '52',
  model: '',
  route: ROUTES[0],
  driver: DRIVERS[0],
  status: 'Active',
};

const filterTabs: Array<{ key: FilterKey; label: string }> = [
  { key: 'all', label: 'All (30)' },
  { key: 'active', label: 'Active (24)' },
  { key: 'inactive', label: 'Inactive (4)' },
  { key: 'maintenance', label: 'Maintenance (2)' },
];

const matchesStatusFilter = (filter: FilterKey, status: BusStatus) => {
  if (filter === 'all') return true;
  if (filter === 'active') return status === 'Active';
  if (filter === 'inactive') return status === 'Inactive';
  return status === 'Maintenance';
};

const getStatusBadgeStyle = (status: BusStatus): React.CSSProperties => {
  if (status === 'Active') {
    return {
      backgroundColor: 'rgba(255, 208, 0, 0.12)',
      border: '1px solid rgba(255, 208, 0, 0.5)',
      color: '#FFD000',
    };
  }
  if (status === 'Inactive') {
    return {
      backgroundColor: 'rgba(136, 136, 136, 0.12)',
      border: '1px solid rgba(136, 136, 136, 0.35)',
      color: '#888888',
    };
  }
  return {
    backgroundColor: 'rgba(255, 153, 0, 0.12)',
    border: '1px solid rgba(255, 153, 0, 0.4)',
    color: '#FF9900',
  };
};

const getInitials = (name: string) => {
  return name
    .split(' ')
    .map((part) => part[0])
    .filter(Boolean)
    .slice(0, 2)
    .join('')
    .toUpperCase();
};

const BusManagement: React.FC = () => {
  const [buses, setBuses] = useState<Bus[]>(INITIAL_BUSES);
  const [activeFilter, setActiveFilter] = useState<FilterKey>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBusIds, setSelectedBusIds] = useState<string[]>([]);
  const [openActionMenuId, setOpenActionMenuId] = useState<string | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newBus, setNewBus] = useState<NewBusForm>(NEW_BUS_INITIAL);

  const filteredBuses = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    return buses.filter((bus) => {
      const statusMatch = matchesStatusFilter(activeFilter, bus.status);
      const searchMatch = !term || bus.busNo.toLowerCase().includes(term);
      return statusMatch && searchMatch;
    });
  }, [activeFilter, buses, searchTerm]);

  const allFilteredSelected = filteredBuses.length > 0 && filteredBuses.every((bus) => selectedBusIds.includes(bus.id));

  const toggleSelectAll = () => {
    if (allFilteredSelected) {
      setSelectedBusIds((prev) => prev.filter((id) => !filteredBuses.some((bus) => bus.id === id)));
      return;
    }
    setSelectedBusIds((prev) => Array.from(new Set([...prev, ...filteredBuses.map((bus) => bus.id)])));
  };

  const toggleSelectOne = (id: string) => {
    setSelectedBusIds((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]));
  };

  const applyBulkStatus = (status: BusStatus) => {
    setBuses((prev) => prev.map((bus) => (selectedBusIds.includes(bus.id) ? { ...bus, status } : bus)));
    setSelectedBusIds([]);
  };

  const deleteSelected = () => {
    setBuses((prev) => prev.filter((bus) => !selectedBusIds.includes(bus.id)));
    setSelectedBusIds([]);
  };

  const deleteOne = (id: string) => {
    setBuses((prev) => prev.filter((bus) => bus.id !== id));
    setSelectedBusIds((prev) => prev.filter((item) => item !== id));
    setOpenActionMenuId(null);
  };

  const markMaintenance = (id: string) => {
    setBuses((prev) => prev.map((bus) => (bus.id === id ? { ...bus, status: 'Maintenance' } : bus)));
    setOpenActionMenuId(null);
  };

  const closeModal = () => {
    setIsAddModalOpen(false);
    setNewBus(NEW_BUS_INITIAL);
  };

  const saveBus = () => {
    const busNumber = newBus.busNumber.trim();
    const regNo = newBus.registrationNo.trim();
    const model = newBus.model.trim();
    const capacity = Number(newBus.capacity);

    if (!busNumber || !regNo || !model || Number.isNaN(capacity) || capacity <= 0) return;

    const occupied = Math.max(0, Math.min(capacity, Math.round(capacity * 0.68)));
    const created: Bus = {
      id: `b-${Date.now()}`,
      busNo: busNumber.startsWith('Bus #') ? busNumber : `Bus #${busNumber}`,
      route: newBus.route,
      driverName: newBus.driver,
      driverInitials: getInitials(newBus.driver),
      occupied,
      capacity,
      status: newBus.status,
      lastActive: 'Just now',
      registrationNo: regNo,
      model,
    };

    setBuses((prev) => [created, ...prev]);
    closeModal();
  };

  return (
    <div style={{ padding: adminSpacing.xl }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: adminSpacing.lg,
          marginBottom: adminSpacing.lg,
        }}
      >
        <div>
          <h1 style={{ margin: 0, color: '#FFFFFF', fontSize: '24px', fontWeight: 700 }}>Fleet Management</h1>
          <p style={{ margin: '4px 0 0', color: '#888888', fontSize: '13px' }}>30 buses registered</p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: adminSpacing.sm }}>
          <div
            style={{
              width: '240px',
              height: '40px',
              backgroundColor: '#1A1A1A',
              border: '1px solid #2A2A2A',
              borderRadius: adminBorders.radius.md,
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '0 12px',
            }}
          >
            <Search size={16} color="#888888" />
            <input
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Search bus number..."
              style={{
                flex: 1,
                background: 'transparent',
                border: 'none',
                outline: 'none',
                color: '#E5E5E5',
                fontSize: '13px',
              }}
            />
          </div>

          <button
            onClick={() => setIsAddModalOpen(true)}
            style={{
              height: '40px',
              border: 'none',
              borderRadius: adminBorders.radius.md,
              backgroundColor: '#FFD000',
              color: '#0D0D0D',
              fontWeight: 700,
              padding: '0 14px',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              cursor: 'pointer',
            }}
          >
            <Plus size={16} />
            Add Bus
          </button>
        </div>
      </div>

      <div style={{ display: 'flex', gap: adminSpacing.sm, marginBottom: adminSpacing.lg }}>
        {filterTabs.map((tab) => {
          const active = tab.key === activeFilter;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveFilter(tab.key)}
              style={{
                height: '34px',
                borderRadius: adminBorders.radius.full,
                border: active ? '1px solid #FFD000' : '1px solid #2A2A2A',
                backgroundColor: active ? '#FFD000' : '#1A1A1A',
                color: active ? '#0D0D0D' : '#888888',
                fontSize: '12px',
                fontWeight: 700,
                padding: '0 14px',
                cursor: 'pointer',
              }}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {selectedBusIds.length > 0 && (
        <div
          style={{
            marginBottom: adminSpacing.lg,
            border: '1px solid #2A2A2A',
            backgroundColor: '#1A1A1A',
            borderRadius: adminBorders.radius.lg,
            padding: adminSpacing.md,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: adminSpacing.md,
          }}
        >
          <span style={{ fontSize: '13px', color: '#E5E5E5', fontWeight: 600 }}>
            Bulk Actions ({selectedBusIds.length} selected)
          </span>
          <div style={{ display: 'flex', gap: adminSpacing.sm }}>
            <button onClick={() => applyBulkStatus('Active')} style={bulkButtonStyle}>
              Mark Active
            </button>
            <button onClick={() => applyBulkStatus('Inactive')} style={bulkButtonStyle}>
              Mark Inactive
            </button>
            <button
              onClick={deleteSelected}
              style={{ ...bulkButtonStyle, borderColor: 'rgba(255, 68, 68, 0.45)', color: '#FF4444' }}
            >
              Delete Selected
            </button>
          </div>
        </div>
      )}

      <div
        style={{
          backgroundColor: '#1A1A1A',
          border: '1px solid #2A2A2A',
          borderRadius: '14px',
          overflow: 'hidden',
        }}
      >
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '1080px' }}>
            <thead>
              <tr style={{ backgroundColor: '#141414', borderBottom: '1px solid #2A2A2A' }}>
                <th style={headerCellStyle}>
                  <input type="checkbox" checked={allFilteredSelected} onChange={toggleSelectAll} />
                </th>
                <th style={headerCellStyle}>Bus No.</th>
                <th style={headerCellStyle}>Route Assigned</th>
                <th style={headerCellStyle}>Driver</th>
                <th style={headerCellStyle}>Capacity</th>
                <th style={headerCellStyle}>Status</th>
                <th style={headerCellStyle}>Last Active</th>
                <th style={headerCellStyle}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredBuses.map((bus) => {
                const occupancyPercent = Math.round((bus.occupied / bus.capacity) * 100);
                const menuOpen = openActionMenuId === bus.id;
                return (
                  <tr key={bus.id} style={{ borderBottom: '1px solid #242424' }}>
                    <td style={bodyCellStyle}>
                      <input
                        type="checkbox"
                        checked={selectedBusIds.includes(bus.id)}
                        onChange={() => toggleSelectOne(bus.id)}
                      />
                    </td>
                    <td style={bodyCellStyle}>
                      <div style={{ color: '#FFFFFF', fontWeight: 700, fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace' }}>
                        {bus.busNo}
                      </div>
                    </td>
                    <td style={bodyCellStyle}>
                      <span
                        style={{
                          borderRadius: adminBorders.radius.full,
                          backgroundColor: 'rgba(255, 208, 0, 0.12)',
                          color: '#FFD000',
                          border: '1px solid rgba(255, 208, 0, 0.4)',
                          fontSize: '11px',
                          fontWeight: 700,
                          padding: '4px 10px',
                        }}
                      >
                        {bus.route}
                      </span>
                    </td>
                    <td style={bodyCellStyle}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div
                          style={{
                            width: '32px',
                            height: '32px',
                            borderRadius: '999px',
                            backgroundColor: '#222222',
                            color: '#888888',
                            display: 'grid',
                            placeItems: 'center',
                            fontSize: '11px',
                            fontWeight: 700,
                          }}
                        >
                          {bus.driverInitials}
                        </div>
                        <div style={{ color: '#E5E5E5', fontSize: '13px' }}>{bus.driverName}</div>
                      </div>
                    </td>
                    <td style={bodyCellStyle}>
                      <div style={{ color: '#E5E5E5', fontSize: '12px', marginBottom: '4px' }}>
                        {bus.occupied}/{bus.capacity}
                      </div>
                      <div
                        style={{
                          width: '88px',
                          height: '5px',
                          backgroundColor: '#262626',
                          borderRadius: adminBorders.radius.full,
                          overflow: 'hidden',
                        }}
                      >
                        <div
                          style={{
                            width: `${occupancyPercent}%`,
                            height: '100%',
                            backgroundColor: '#FFD000',
                          }}
                        />
                      </div>
                    </td>
                    <td style={bodyCellStyle}>
                      <span
                        style={{
                          ...getStatusBadgeStyle(bus.status),
                          borderRadius: adminBorders.radius.full,
                          padding: '4px 10px',
                          fontSize: '11px',
                          fontWeight: 700,
                        }}
                      >
                        {bus.status}
                      </span>
                    </td>
                    <td style={bodyCellStyle}>
                      <span style={{ color: '#A0A0A0', fontSize: '12px' }}>{bus.lastActive}</span>
                    </td>
                    <td style={{ ...bodyCellStyle, position: 'relative' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <button style={actionIconButtonStyle} title="Edit">
                          <Pencil size={14} />
                        </button>
                        <button
                          style={actionIconButtonStyle}
                          title="More"
                          onClick={() => setOpenActionMenuId((prev) => (prev === bus.id ? null : bus.id))}
                        >
                          <MoreVertical size={14} />
                        </button>
                      </div>

                      {menuOpen && (
                        <div
                          style={{
                            position: 'absolute',
                            right: '10px',
                            top: '38px',
                            width: '170px',
                            backgroundColor: '#1A1A1A',
                            border: '1px solid #2A2A2A',
                            borderRadius: adminBorders.radius.md,
                            overflow: 'hidden',
                            zIndex: 20,
                            boxShadow: '0 12px 24px rgba(0,0,0,0.45)',
                          }}
                        >
                          <button style={menuItemStyle}>View Details</button>
                          <button style={menuItemStyle}>Assign Driver</button>
                          <button style={menuItemStyle} onClick={() => markMaintenance(bus.id)}>
                            Mark Maintenance
                          </button>
                          <button style={{ ...menuItemStyle, color: '#FF4444' }} onClick={() => deleteOne(bus.id)}>
                            Delete
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {isAddModalOpen && (
        <div
          onClick={closeModal}
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            zIndex: 40,
            display: 'grid',
            placeItems: 'center',
            padding: adminSpacing.lg,
          }}
        >
          <div
            onClick={(event) => event.stopPropagation()}
            style={{
              width: '100%',
              maxWidth: '480px',
              backgroundColor: '#1A1A1A',
              border: '1px solid #2A2A2A',
              borderRadius: '16px',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                borderBottom: '1px solid #2A2A2A',
                padding: adminSpacing.lg,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <h3 style={{ margin: 0, color: '#FFFFFF', fontSize: '18px', fontWeight: 700 }}>Add New Bus</h3>
              <button onClick={closeModal} style={actionIconButtonStyle}>
                <X size={16} />
              </button>
            </div>

            <div style={{ padding: adminSpacing.lg, display: 'grid', gap: adminSpacing.md }}>
              <Field label="Bus Number">
                <input
                  value={newBus.busNumber}
                  onChange={(event) => setNewBus((prev) => ({ ...prev, busNumber: event.target.value }))}
                  placeholder="e.g. 32"
                  style={inputStyle}
                />
              </Field>

              <Field label="Registration No.">
                <input
                  value={newBus.registrationNo}
                  onChange={(event) => setNewBus((prev) => ({ ...prev, registrationNo: event.target.value }))}
                  placeholder="e.g. MH27-AB-1032"
                  style={inputStyle}
                />
              </Field>

              <Field label="Capacity">
                <input
                  type="number"
                  value={newBus.capacity}
                  onChange={(event) => setNewBus((prev) => ({ ...prev, capacity: event.target.value }))}
                  style={inputStyle}
                />
              </Field>

              <Field label="Model / Type">
                <input
                  value={newBus.model}
                  onChange={(event) => setNewBus((prev) => ({ ...prev, model: event.target.value }))}
                  placeholder="e.g. Tata Starbus"
                  style={inputStyle}
                />
              </Field>

              <Field label="Route Assignment">
                <select
                  value={newBus.route}
                  onChange={(event) => setNewBus((prev) => ({ ...prev, route: event.target.value }))}
                  style={inputStyle}
                >
                  {ROUTES.map((route) => (
                    <option key={route}>{route}</option>
                  ))}
                </select>
              </Field>

              <Field label="Driver Assignment">
                <select
                  value={newBus.driver}
                  onChange={(event) => setNewBus((prev) => ({ ...prev, driver: event.target.value }))}
                  style={inputStyle}
                >
                  {DRIVERS.map((driver) => (
                    <option key={driver}>{driver}</option>
                  ))}
                </select>
              </Field>

              <Field label="Status">
                <div style={{ display: 'flex', gap: adminSpacing.md }}>
                  {(['Active', 'Inactive'] as const).map((status) => (
                    <label key={status} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#E5E5E5' }}>
                      <input
                        type="radio"
                        name="new-bus-status"
                        checked={newBus.status === status}
                        onChange={() => setNewBus((prev) => ({ ...prev, status }))}
                      />
                      {status}
                    </label>
                  ))}
                </div>
              </Field>
            </div>

            <div
              style={{
                borderTop: '1px solid #2A2A2A',
                padding: adminSpacing.lg,
                display: 'flex',
                justifyContent: 'flex-end',
                gap: adminSpacing.sm,
              }}
            >
              <button onClick={closeModal} style={ghostButtonStyle}>
                Cancel
              </button>
              <button onClick={saveBus} style={primaryButtonStyle}>
                Save Bus
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const headerCellStyle: React.CSSProperties = {
  textAlign: 'left',
  color: '#888888',
  fontSize: '11px',
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
  fontWeight: 700,
  padding: '12px',
};

const bodyCellStyle: React.CSSProperties = {
  padding: '12px',
  fontSize: '13px',
  color: '#E5E5E5',
  verticalAlign: 'middle',
};

const actionIconButtonStyle: React.CSSProperties = {
  width: '30px',
  height: '30px',
  borderRadius: adminBorders.radius.md,
  border: '1px solid #2A2A2A',
  backgroundColor: 'transparent',
  color: '#888888',
  display: 'grid',
  placeItems: 'center',
  cursor: 'pointer',
};

const bulkButtonStyle: React.CSSProperties = {
  height: '32px',
  borderRadius: adminBorders.radius.md,
  border: '1px solid #2A2A2A',
  backgroundColor: '#111111',
  color: '#E5E5E5',
  fontWeight: 600,
  fontSize: '12px',
  padding: '0 12px',
  cursor: 'pointer',
};

const menuItemStyle: React.CSSProperties = {
  width: '100%',
  height: '34px',
  border: 'none',
  borderBottom: '1px solid #2A2A2A',
  backgroundColor: 'transparent',
  color: '#E5E5E5',
  textAlign: 'left',
  padding: '0 12px',
  fontSize: '12px',
  cursor: 'pointer',
};

const inputStyle: React.CSSProperties = {
  width: '100%',
  height: '38px',
  borderRadius: adminBorders.radius.md,
  border: '1px solid #2A2A2A',
  backgroundColor: '#111111',
  color: '#E5E5E5',
  padding: '0 10px',
  fontSize: '13px',
};

const primaryButtonStyle: React.CSSProperties = {
  height: '38px',
  border: 'none',
  borderRadius: adminBorders.radius.md,
  backgroundColor: '#FFD000',
  color: '#0D0D0D',
  padding: '0 16px',
  fontWeight: 700,
  cursor: 'pointer',
};

const ghostButtonStyle: React.CSSProperties = {
  height: '38px',
  border: '1px solid #2A2A2A',
  borderRadius: adminBorders.radius.md,
  backgroundColor: 'transparent',
  color: '#E5E5E5',
  padding: '0 16px',
  fontWeight: 600,
  cursor: 'pointer',
};

const Field: React.FC<{ label: string; children: React.ReactNode }> = ({ label, children }) => (
  <div>
    <label style={{ display: 'block', color: '#888888', fontSize: '12px', marginBottom: '6px' }}>{label}</label>
    {children}
  </div>
);

export default BusManagement;