import React, { useMemo, useRef, useState } from 'react';
import { CalendarDays, Plus, Upload } from 'lucide-react';
import { adminBorders, adminSpacing } from '@/lib/adminDesignTokens';

type DayType = 'Weekday' | 'Saturday' | 'Sunday';
type RepeatType = 'One-time' | 'Daily' | 'Weekdays only' | 'Custom days';
type SortKey = 'id' | 'bus' | 'departure' | 'arrival' | 'driver';

type Trip = {
  id: string;
  route: string;
  bus: string;
  departure: string;
  arrival: string;
  driver: string;
  repeat: RepeatType;
  customDays: string[];
  date?: string;
};

type TripForm = {
  route: string;
  bus: string;
  departure: string;
  arrival: string;
  driver: string;
  repeat: RepeatType;
  customDays: string[];
  date: string;
};

const ROUTES = Array.from({ length: 12 }, (_, i) => `Route ${i + 1}`);
const BUSES = ['Bus #04', 'Bus #07', 'Bus #09', 'Bus #12', 'Bus #15', 'Bus #21', 'Bus #28', 'Bus #30'];
const DRIVERS = ['Amit Kulkarni', 'Ravi Sharma', 'Sanjay Patil', 'Priya Deshmukh', 'Nitin Rao', 'Asha Joshi'];
const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const ROUTE_DURATION_MIN: Record<string, number> = {
  'Route 1': 42,
  'Route 2': 35,
  'Route 3': 50,
  'Route 4': 40,
  'Route 5': 38,
  'Route 6': 46,
  'Route 7': 34,
  'Route 8': 44,
  'Route 9': 52,
  'Route 10': 39,
  'Route 11': 47,
  'Route 12': 56,
};

const SAMPLE_TRIPS: Trip[] = [
  { id: 'TRP-001', route: 'Route 4', bus: 'Bus #04', departure: '05:30', arrival: '06:10', driver: 'Amit Kulkarni', repeat: 'Weekdays only', customDays: [] },
  { id: 'TRP-002', route: 'Route 4', bus: 'Bus #07', departure: '05:30', arrival: '06:10', driver: 'Ravi Sharma', repeat: 'Weekdays only', customDays: [] },
  { id: 'TRP-003', route: 'Route 4', bus: 'Bus #09', departure: '06:00', arrival: '06:40', driver: 'Sanjay Patil', repeat: 'Daily', customDays: [] },
  { id: 'TRP-004', route: 'Route 4', bus: 'Bus #12', departure: '07:30', arrival: '08:10', driver: 'Priya Deshmukh', repeat: 'Weekdays only', customDays: [] },
  { id: 'TRP-005', route: 'Route 4', bus: 'Bus #15', departure: '09:00', arrival: '09:40', driver: 'Nitin Rao', repeat: 'Weekdays only', customDays: [] },
  { id: 'TRP-006', route: 'Route 7', bus: 'Bus #21', departure: '10:30', arrival: '11:04', driver: 'Asha Joshi', repeat: 'Daily', customDays: [] },
  { id: 'TRP-007', route: 'Route 4', bus: 'Bus #28', departure: '12:00', arrival: '12:40', driver: 'Ravi Sharma', repeat: 'Custom days', customDays: ['Sat'] },
  { id: 'TRP-008', route: 'Route 4', bus: 'Bus #30', departure: '16:30', arrival: '17:10', driver: 'Amit Kulkarni', repeat: 'Weekdays only', customDays: [] },
];

const pad2 = (num: number) => String(num).padStart(2, '0');

const toMinutes = (hhmm: string) => {
  const [h, m] = hhmm.split(':').map(Number);
  return h * 60 + m;
};

const toTime = (minutes: number) => {
  const m = ((minutes % 1440) + 1440) % 1440;
  return `${pad2(Math.floor(m / 60))}:${pad2(m % 60)}`;
};

const addMinutes = (hhmm: string, delta: number) => toTime(toMinutes(hhmm) + delta);

const prettyTime = (hhmm: string) => {
  const [hRaw, m] = hhmm.split(':').map(Number);
  const suffix = hRaw >= 12 ? 'PM' : 'AM';
  const h = hRaw % 12 || 12;
  return `${h}:${pad2(m)} ${suffix}`;
};

const createTimeSlots = () => {
  const slots: string[] = [];
  for (let t = toMinutes('05:30'); t <= toMinutes('22:30'); t += 30) {
    slots.push(toTime(t));
  }
  return slots;
};

const TIME_SLOTS = createTimeSlots();

const appliesToDayType = (trip: Trip, dayType: DayType, dateISO: string) => {
  if (trip.repeat === 'Daily') return true;
  if (trip.repeat === 'Weekdays only') return dayType === 'Weekday';
  if (trip.repeat === 'Custom days') {
    const dayIndex = new Date(dateISO).getDay();
    const key = DAYS[(dayIndex + 6) % 7];
    return trip.customDays.includes(key);
  }
  if (trip.repeat === 'One-time') {
    return trip.date === dateISO;
  }
  return false;
};

const defaultDate = new Date().toISOString().slice(0, 10);

const emptyForm: TripForm = {
  route: 'Route 4',
  bus: BUSES[0],
  departure: '05:30',
  arrival: '06:10',
  driver: DRIVERS[0],
  repeat: 'One-time',
  customDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
  date: defaultDate,
};

const ScheduleManagement: React.FC = () => {
  const [selectedRoute, setSelectedRoute] = useState('Route 4');
  const [dayType, setDayType] = useState<DayType>('Weekday');
  const [selectedDate, setSelectedDate] = useState(defaultDate);
  const [busFilter, setBusFilter] = useState('All Buses');
  const [trips, setTrips] = useState<Trip[]>(SAMPLE_TRIPS);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTripId, setEditingTripId] = useState<string | null>(null);
  const [form, setForm] = useState<TripForm>(emptyForm);
  const [sortKey, setSortKey] = useState<SortKey>('departure');
  const [sortAsc, setSortAsc] = useState(true);

  const csvInputRef = useRef<HTMLInputElement | null>(null);

  const filteredTrips = useMemo(() => {
    return trips.filter((trip) => {
      if (trip.route !== selectedRoute) return false;
      if (busFilter !== 'All Buses' && trip.bus !== busFilter) return false;
      return appliesToDayType(trip, dayType, selectedDate);
    });
  }, [busFilter, dayType, selectedDate, selectedRoute, trips]);

  const conflictTimes = useMemo(() => {
    const counts: Record<string, number> = {};
    filteredTrips.forEach((trip) => {
      counts[trip.departure] = (counts[trip.departure] ?? 0) + 1;
    });
    return new Set(Object.entries(counts).filter(([, count]) => count > 1).map(([time]) => time));
  }, [filteredTrips]);

  const sortedTripList = useMemo(() => {
    const list = [...filteredTrips];
    list.sort((a, b) => {
      const left = a[sortKey];
      const right = b[sortKey];
      if (left < right) return sortAsc ? -1 : 1;
      if (left > right) return sortAsc ? 1 : -1;
      return 0;
    });
    return list;
  }, [filteredTrips, sortAsc, sortKey]);

  const busRows = useMemo(() => {
    if (busFilter !== 'All Buses') return [busFilter];
    return BUSES;
  }, [busFilter]);

  const updateAutoArrival = (route: string, departure: string) => {
    const duration = ROUTE_DURATION_MIN[route] ?? 40;
    return addMinutes(departure, duration);
  };

  const openAddModal = (preset?: Partial<TripForm>) => {
    const route = preset?.route ?? selectedRoute;
    const departure = preset?.departure ?? '05:30';
    const nextForm: TripForm = {
      ...emptyForm,
      route,
      bus: preset?.bus ?? emptyForm.bus,
      departure,
      arrival: updateAutoArrival(route, departure),
      driver: preset?.driver ?? emptyForm.driver,
      date: selectedDate,
    };
    setEditingTripId(null);
    setForm(nextForm);
    setModalOpen(true);
  };

  const openEditModal = (trip: Trip) => {
    setEditingTripId(trip.id);
    setForm({
      route: trip.route,
      bus: trip.bus,
      departure: trip.departure,
      arrival: trip.arrival,
      driver: trip.driver,
      repeat: trip.repeat,
      customDays: trip.customDays,
      date: trip.date ?? selectedDate,
    });
    setModalOpen(true);
  };

  const saveTrip = () => {
    const payload: Trip = {
      id: editingTripId ?? `TRP-${String(Date.now()).slice(-6)}`,
      route: form.route,
      bus: form.bus,
      departure: form.departure,
      arrival: form.arrival,
      driver: form.driver,
      repeat: form.repeat,
      customDays: form.repeat === 'Custom days' ? form.customDays : [],
      date: form.repeat === 'One-time' ? form.date : undefined,
    };

    setTrips((prev) => {
      if (!editingTripId) return [...prev, payload];
      return prev.map((trip) => (trip.id === editingTripId ? payload : trip));
    });

    setModalOpen(false);
    setEditingTripId(null);
  };

  const removeTrip = (id: string) => setTrips((prev) => prev.filter((trip) => trip.id !== id));

  const onSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortAsc((prev) => !prev);
      return;
    }
    setSortKey(key);
    setSortAsc(true);
  };

  const importCsv = (raw: string) => {
    const lines = raw.split(/\r?\n/).map((line) => line.trim()).filter(Boolean);
    if (lines.length < 2) return;

    const imported: Trip[] = [];
    lines.slice(1).forEach((line, idx) => {
      const cols = line.split(',').map((col) => col.trim());
      if (cols.length < 4) return;
      const bus = cols[0];
      const departure = cols[1];
      const driver = cols[2];
      const route = cols[3] || selectedRoute;
      if (!bus || !departure || !driver) return;

      imported.push({
        id: `TRP-IMP-${Date.now()}-${idx}`,
        route,
        bus,
        departure,
        arrival: updateAutoArrival(route, departure),
        driver,
        repeat: 'Weekdays only',
        customDays: [],
      });
    });

    if (imported.length > 0) setTrips((prev) => [...prev, ...imported]);
  };

  const onCsvSelected: React.ChangeEventHandler<HTMLInputElement> = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') importCsv(reader.result);
    };
    reader.readAsText(file);
    event.currentTarget.value = '';
  };

  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      <aside
        style={{
          width: '220px',
          minWidth: '220px',
          backgroundColor: '#111111',
          borderRight: '1px solid #2A2A2A',
          padding: adminSpacing.lg,
          display: 'grid',
          gridTemplateRows: 'auto auto auto auto 1fr',
          gap: adminSpacing.lg,
        }}
      >
        <div>
          <label style={labelStyle}>Route</label>
          <select
            value={selectedRoute}
            onChange={(event) => setSelectedRoute(event.target.value)}
            style={inputStyle}
          >
            {ROUTES.map((route) => (
              <option key={route}>{route}</option>
            ))}
          </select>
        </div>

        <div>
          <label style={labelStyle}>Day Type</label>
          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
            {(['Weekday', 'Saturday', 'Sunday'] as DayType[]).map((item) => {
              const active = dayType === item;
              return (
                <button
                  key={item}
                  onClick={() => setDayType(item)}
                  style={{
                    ...pillStyle,
                    backgroundColor: active ? '#FFD000' : '#1A1A1A',
                    color: active ? '#0D0D0D' : '#888888',
                    borderColor: active ? '#FFD000' : '#2A2A2A',
                  }}
                >
                  {item}
                </button>
              );
            })}
          </div>
        </div>

        <div>
          <label style={labelStyle}>Date</label>
          <div style={{ position: 'relative' }}>
            <CalendarDays size={14} color="#888" style={{ position: 'absolute', top: 11, left: 10 }} />
            <input
              type="date"
              value={selectedDate}
              onChange={(event) => setSelectedDate(event.target.value)}
              style={{ ...inputStyle, paddingLeft: '32px' }}
            />
          </div>
        </div>

        <div>
          <label style={labelStyle}>Bus Filter</label>
          <select value={busFilter} onChange={(event) => setBusFilter(event.target.value)} style={inputStyle}>
            <option>All Buses</option>
            {BUSES.map((bus) => (
              <option key={bus}>{bus}</option>
            ))}
          </select>
        </div>
      </aside>

      <section style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', padding: adminSpacing.xl, gap: adminSpacing.lg }}>
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: adminSpacing.lg }}>
          <h1 style={{ margin: 0, color: '#FFFFFF', fontSize: '22px', fontWeight: 700 }}>
            Schedule - {selectedRoute}, {dayType}
          </h1>
          <div style={{ display: 'flex', gap: adminSpacing.sm }}>
            <button onClick={() => openAddModal()} style={primaryButtonStyle}>
              <Plus size={15} />
              Add Trip
            </button>
            <button onClick={() => csvInputRef.current?.click()} style={ghostButtonStyle}>
              <Upload size={15} />
              Bulk Import CSV
            </button>
            <input ref={csvInputRef} type="file" accept=".csv" onChange={onCsvSelected} style={{ display: 'none' }} />
          </div>
        </header>

        <div style={{ display: 'flex', gap: adminSpacing.sm }}>
          <button onClick={() => setViewMode('grid')} style={{ ...pillStyle, ...(viewMode === 'grid' ? selectedPillStyle : unselectedPillStyle) }}>
            Grid View
          </button>
          <button onClick={() => setViewMode('list')} style={{ ...pillStyle, ...(viewMode === 'list' ? selectedPillStyle : unselectedPillStyle) }}>
            List View
          </button>
        </div>

        <div
          style={{
            backgroundColor: '#1A1A1A',
            border: '1px solid #2A2A2A',
            borderRadius: '14px',
            overflow: 'hidden',
            display: viewMode === 'grid' ? 'block' : 'none',
          }}
        >
          <div style={{ overflow: 'auto' }}>
            <table style={{ borderCollapse: 'collapse', minWidth: '1700px', width: '100%' }}>
              <thead>
                <tr style={{ backgroundColor: '#141414' }}>
                  <th style={{ ...thStyle, position: 'sticky', left: 0, zIndex: 2, backgroundColor: '#141414', minWidth: '130px' }}>Bus</th>
                  {TIME_SLOTS.map((slot) => (
                    <th key={slot} style={thStyle}>{prettyTime(slot)}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {busRows.map((bus) => (
                  <tr key={bus}>
                    <td style={{ ...busLabelCellStyle, position: 'sticky', left: 0, zIndex: 1 }}>{bus}</td>
                    {TIME_SLOTS.map((slot) => {
                      const trip = filteredTrips.find((item) => item.bus === bus && item.departure === slot);
                      const conflict = trip && conflictTimes.has(slot);
                      return (
                        <td
                          key={`${bus}-${slot}`}
                          style={{
                            ...gridCellStyle,
                            border: conflict ? '1px solid #FF4444' : gridCellStyle.border,
                            position: 'relative',
                          }}
                        >
                          {trip ? (
                            <button
                              onClick={() => openEditModal(trip)}
                              style={{
                                border: '1px solid rgba(255,208,0,0.6)',
                                backgroundColor: 'rgba(255,208,0,0.18)',
                                borderRadius: '999px',
                                color: '#FFD000',
                                fontSize: '10px',
                                fontWeight: 700,
                                padding: '4px 8px',
                                cursor: 'pointer',
                              }}
                            >
                              {prettyTime(trip.departure)}
                            </button>
                          ) : (
                            <button
                              onClick={() => openAddModal({ bus, route: selectedRoute, departure: slot })}
                              style={{
                                width: '22px',
                                height: '22px',
                                borderRadius: '999px',
                                border: '1px dashed #3A3A3A',
                                backgroundColor: 'transparent',
                                color: '#777',
                                cursor: 'pointer',
                                opacity: 0.15,
                              }}
                              onMouseEnter={(event) => {
                                event.currentTarget.style.opacity = '1';
                                event.currentTarget.style.borderColor = '#FFD000';
                                event.currentTarget.style.color = '#FFD000';
                              }}
                              onMouseLeave={(event) => {
                                event.currentTarget.style.opacity = '0.15';
                                event.currentTarget.style.borderColor = '#3A3A3A';
                                event.currentTarget.style.color = '#777';
                              }}
                            >
                              +
                            </button>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div style={{ color: '#888', fontSize: '12px' }}>
          Conflict highlighting is active when two buses share the same route and departure slot.
        </div>

        <div
          style={{
            backgroundColor: '#1A1A1A',
            border: '1px solid #2A2A2A',
            borderRadius: '14px',
            overflow: 'hidden',
          }}
        >
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ backgroundColor: '#141414' }}>
                <SortTh label="Trip ID" onClick={() => onSort('id')} />
                <SortTh label="Bus" onClick={() => onSort('bus')} />
                <SortTh label="Departure" onClick={() => onSort('departure')} />
                <SortTh label="Arrival" onClick={() => onSort('arrival')} />
                <SortTh label="Driver" onClick={() => onSort('driver')} />
                <th style={thStyle}>Days</th>
                <th style={thStyle}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {sortedTripList.map((trip) => (
                <tr key={trip.id}>
                  <td style={tdStyle}>{trip.id}</td>
                  <td style={tdStyle}>{trip.bus}</td>
                  <td style={tdStyle}>{prettyTime(trip.departure)}</td>
                  <td style={tdStyle}>{prettyTime(trip.arrival)}</td>
                  <td style={tdStyle}>{trip.driver}</td>
                  <td style={tdStyle}>
                    {trip.repeat === 'Custom days' ? trip.customDays.join(', ') : trip.repeat}
                  </td>
                  <td style={tdStyle}>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button onClick={() => openEditModal(trip)} style={miniButtonStyle}>Edit</button>
                      <button onClick={() => removeTrip(trip.id)} style={{ ...miniButtonStyle, color: '#FF4444' }}>Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
              {sortedTripList.length === 0 && (
                <tr>
                  <td colSpan={7} style={{ ...tdStyle, textAlign: 'center', color: '#777' }}>
                    No trips found for selected filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {modalOpen && (
        <div
          onClick={() => setModalOpen(false)}
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0,0,0,0.7)',
            zIndex: 50,
            display: 'grid',
            placeItems: 'center',
            padding: adminSpacing.lg,
          }}
        >
          <div
            onClick={(event) => event.stopPropagation()}
            style={{
              width: '100%',
              maxWidth: '520px',
              backgroundColor: '#1A1A1A',
              border: '1px solid #2A2A2A',
              borderRadius: '16px',
              overflow: 'hidden',
            }}
          >
            <div style={{ padding: adminSpacing.lg, borderBottom: '1px solid #2A2A2A' }}>
              <h3 style={{ margin: 0, color: '#FFFFFF', fontSize: '18px' }}>{editingTripId ? 'Edit Trip' : 'Add Trip'}</h3>
            </div>

            <div style={{ padding: adminSpacing.lg, display: 'grid', gap: adminSpacing.md }}>
              <Field label="Select Bus">
                <select value={form.bus} onChange={(event) => setForm((prev) => ({ ...prev, bus: event.target.value }))} style={inputStyle}>
                  {BUSES.map((bus) => <option key={bus}>{bus}</option>)}
                </select>
              </Field>

              <Field label="Departure Time">
                <input
                  type="time"
                  value={form.departure}
                  onChange={(event) => {
                    const departure = event.target.value;
                    setForm((prev) => ({
                      ...prev,
                      departure,
                      arrival: updateAutoArrival(prev.route, departure),
                    }));
                  }}
                  style={inputStyle}
                />
              </Field>

              <Field label="Arrival Time (auto)">
                <input type="time" value={form.arrival} readOnly style={{ ...inputStyle, color: '#999', backgroundColor: '#151515' }} />
              </Field>

              <Field label="Driver">
                <select value={form.driver} onChange={(event) => setForm((prev) => ({ ...prev, driver: event.target.value }))} style={inputStyle}>
                  {DRIVERS.map((driver) => <option key={driver}>{driver}</option>)}
                </select>
              </Field>

              <Field label="Repeat Options">
                <div style={{ display: 'grid', gap: '8px' }}>
                  {(['One-time', 'Daily', 'Weekdays only', 'Custom days'] as RepeatType[]).map((item) => (
                    <label key={item} style={{ display: 'inline-flex', gap: '8px', alignItems: 'center', color: '#E5E5E5', fontSize: '13px' }}>
                      <input
                        type="radio"
                        name="repeat"
                        checked={form.repeat === item}
                        onChange={() => setForm((prev) => ({ ...prev, repeat: item }))}
                      />
                      {item}
                    </label>
                  ))}
                </div>
              </Field>

              {form.repeat === 'One-time' && (
                <Field label="Date">
                  <input type="date" value={form.date} onChange={(event) => setForm((prev) => ({ ...prev, date: event.target.value }))} style={inputStyle} />
                </Field>
              )}

              {form.repeat === 'Custom days' && (
                <Field label="Custom Days">
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                    {DAYS.map((day) => {
                      const selected = form.customDays.includes(day);
                      return (
                        <button
                          key={day}
                          onClick={() =>
                            setForm((prev) => ({
                              ...prev,
                              customDays: selected
                                ? prev.customDays.filter((d) => d !== day)
                                : [...prev.customDays, day],
                            }))
                          }
                          style={{
                            ...pillStyle,
                            height: '28px',
                            backgroundColor: selected ? '#FFD000' : '#1A1A1A',
                            color: selected ? '#0D0D0D' : '#888',
                            borderColor: selected ? '#FFD000' : '#2A2A2A',
                          }}
                        >
                          {day}
                        </button>
                      );
                    })}
                  </div>
                </Field>
              )}
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: adminSpacing.sm, padding: adminSpacing.lg, borderTop: '1px solid #2A2A2A' }}>
              <button onClick={() => setModalOpen(false)} style={ghostButtonStyle}>Cancel</button>
              <button onClick={saveTrip} style={primaryButtonStyle}>Save Trip</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const labelStyle: React.CSSProperties = {
  display: 'block',
  color: '#888888',
  fontSize: '12px',
  marginBottom: '6px',
  fontWeight: 600,
};

const inputStyle: React.CSSProperties = {
  width: '100%',
  height: '36px',
  borderRadius: adminBorders.radius.md,
  border: '1px solid #2A2A2A',
  backgroundColor: '#1A1A1A',
  color: '#E5E5E5',
  padding: '0 10px',
  fontSize: '13px',
};

const pillStyle: React.CSSProperties = {
  height: '32px',
  borderRadius: adminBorders.radius.full,
  border: '1px solid #2A2A2A',
  backgroundColor: '#1A1A1A',
  color: '#888888',
  fontSize: '12px',
  fontWeight: 700,
  padding: '0 12px',
  cursor: 'pointer',
};

const selectedPillStyle: React.CSSProperties = {
  borderColor: '#FFD000',
  backgroundColor: '#FFD000',
  color: '#0D0D0D',
};

const unselectedPillStyle: React.CSSProperties = {
  borderColor: '#2A2A2A',
  backgroundColor: '#1A1A1A',
  color: '#888888',
};

const primaryButtonStyle: React.CSSProperties = {
  height: '36px',
  borderRadius: adminBorders.radius.md,
  border: 'none',
  backgroundColor: '#FFD000',
  color: '#0D0D0D',
  display: 'inline-flex',
  alignItems: 'center',
  gap: '8px',
  padding: '0 12px',
  cursor: 'pointer',
  fontWeight: 700,
};

const ghostButtonStyle: React.CSSProperties = {
  height: '36px',
  borderRadius: adminBorders.radius.md,
  border: '1px solid #2A2A2A',
  backgroundColor: 'transparent',
  color: '#E5E5E5',
  display: 'inline-flex',
  alignItems: 'center',
  gap: '8px',
  padding: '0 12px',
  cursor: 'pointer',
  fontWeight: 600,
};

const thStyle: React.CSSProperties = {
  borderBottom: '1px solid #2A2A2A',
  borderRight: '1px solid #2A2A2A',
  color: '#888888',
  fontSize: '11px',
  fontWeight: 700,
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
  padding: '8px',
  whiteSpace: 'nowrap',
  textAlign: 'center',
};

const busLabelCellStyle: React.CSSProperties = {
  borderBottom: '1px solid #2A2A2A',
  borderRight: '1px solid #2A2A2A',
  color: '#FFFFFF',
  fontWeight: 700,
  fontSize: '13px',
  backgroundColor: '#161616',
  padding: '10px',
  textAlign: 'left',
};

const gridCellStyle: React.CSSProperties = {
  borderBottom: '1px solid #2A2A2A',
  borderRight: '1px solid #2A2A2A',
  height: '44px',
  padding: '6px',
  textAlign: 'center',
};

const tdStyle: React.CSSProperties = {
  borderBottom: '1px solid #2A2A2A',
  color: '#E5E5E5',
  fontSize: '13px',
  padding: '10px 12px',
};

const miniButtonStyle: React.CSSProperties = {
  height: '28px',
  border: '1px solid #2A2A2A',
  borderRadius: adminBorders.radius.md,
  backgroundColor: '#111111',
  color: '#E5E5E5',
  cursor: 'pointer',
  fontSize: '11px',
  padding: '0 10px',
};

const SortTh: React.FC<{ label: string; onClick: () => void }> = ({ label, onClick }) => (
  <th style={thStyle}>
    <button
      onClick={onClick}
      style={{
        border: 'none',
        background: 'transparent',
        color: '#888888',
        cursor: 'pointer',
        fontSize: '11px',
        textTransform: 'uppercase',
        letterSpacing: '0.05em',
        fontWeight: 700,
      }}
    >
      {label}
    </button>
  </th>
);

const Field: React.FC<{ label: string; children: React.ReactNode }> = ({ label, children }) => (
  <div>
    <label style={labelStyle}>{label}</label>
    {children}
  </div>
);

export default ScheduleManagement;