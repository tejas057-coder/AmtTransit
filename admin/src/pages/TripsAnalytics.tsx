import React, { useMemo, useState } from 'react';
import {
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { adminBorders, adminSpacing } from '@/lib/adminDesignTokens';

type TabKey = 'recentTrips' | 'busiestStops';

type TripRow = {
  tripId: string;
  passengerId: string;
  route: string;
  boardedAt: string;
  alightedAt: string;
  time: string;
  duration: string;
};

type StopLoad = {
  stop: string;
  boardings: number;
};

const dateRanges = ['Last 7 days', 'Today', 'Last 30 days', 'This month'];
const routeFilters = ['All Routes', 'Route 1', 'Route 2', 'Route 3', 'Route 4', 'Route 7', 'Route 12'];

const passengerCountPerHour = [
  { hour: '5 AM', count: 42 },
  { hour: '6 AM', count: 88 },
  { hour: '7 AM', count: 152 },
  { hour: '8 AM', count: 224 },
  { hour: '9 AM', count: 198 },
  { hour: '10 AM', count: 174 },
  { hour: '11 AM', count: 166 },
  { hour: '12 PM', count: 190 },
  { hour: '1 PM', count: 212 },
  { hour: '2 PM', count: 186 },
  { hour: '3 PM', count: 168 },
  { hour: '4 PM', count: 194 },
  { hour: '5 PM', count: 238 },
  { hour: '6 PM', count: 266 },
  { hour: '7 PM', count: 220 },
  { hour: '8 PM', count: 182 },
  { hour: '9 PM', count: 128 },
  { hour: '10 PM', count: 84 },
];

const tripsByRoute = [
  { name: 'Route 4', value: 312 },
  { name: 'Route 7', value: 258 },
  { name: 'Route 1', value: 192 },
  { name: 'Route 12', value: 164 },
  { name: 'Route 3', value: 140 },
  { name: 'Route 2', value: 108 },
];

const recentTripsData: TripRow[] = [
  {
    tripId: 'TR-91284',
    passengerId: 'P-4921',
    route: 'Route 4',
    boardedAt: 'Rajapeth Junction',
    alightedAt: 'Cotton Market',
    time: '08:22 AM',
    duration: '31m',
  },
  {
    tripId: 'TR-91283',
    passengerId: 'P-3018',
    route: 'Route 7',
    boardedAt: 'Railway Station',
    alightedAt: 'University Campus',
    time: '08:18 AM',
    duration: '28m',
  },
  {
    tripId: 'TR-91282',
    passengerId: 'P-2877',
    route: 'Route 1',
    boardedAt: 'City Center',
    alightedAt: 'Sports Complex',
    time: '08:11 AM',
    duration: '15m',
  },
  {
    tripId: 'TR-91281',
    passengerId: 'P-5130',
    route: 'Route 12',
    boardedAt: 'Airport Road',
    alightedAt: 'City Center',
    time: '08:03 AM',
    duration: '37m',
  },
  {
    tripId: 'TR-91280',
    passengerId: 'P-4322',
    route: 'Route 4',
    boardedAt: 'Hospital Road',
    alightedAt: 'Market Circle',
    time: '07:54 AM',
    duration: '13m',
  },
  {
    tripId: 'TR-91279',
    passengerId: 'P-1198',
    route: 'Route 3',
    boardedAt: 'Bus Depot',
    alightedAt: 'Rani Garden',
    time: '07:48 AM',
    duration: '23m',
  },
  {
    tripId: 'TR-91278',
    passengerId: 'P-7842',
    route: 'Route 2',
    boardedAt: 'Market Circle',
    alightedAt: 'Civil Lines',
    time: '07:40 AM',
    duration: '18m',
  },
];

const busiestStopsData: StopLoad[] = [
  { stop: 'Rajapeth Junction', boardings: 864 },
  { stop: 'Cotton Market', boardings: 812 },
  { stop: 'Railway Station', boardings: 768 },
  { stop: 'City Center', boardings: 742 },
  { stop: 'University Campus', boardings: 689 },
  { stop: 'Hospital Road', boardings: 632 },
  { stop: 'Sports Complex', boardings: 588 },
  { stop: 'Market Circle', boardings: 556 },
];

const routePalette = ['#FFD000', '#CFAE4A', '#9A8E5E', '#6D7A7A', '#5F6C82', '#7B6A58'];

const panelStyle: React.CSSProperties = {
  backgroundColor: '#1A1A1A',
  border: '1px solid #2A2A2A',
  borderRadius: adminBorders.radius.lg,
};

const TripsAnalytics: React.FC = () => {
  const [selectedDateRange, setSelectedDateRange] = useState('Last 7 days');
  const [selectedRoute, setSelectedRoute] = useState('All Routes');
  const [activeTab, setActiveTab] = useState<TabKey>('recentTrips');

  const topBoardingCount = useMemo(
    () => busiestStopsData.reduce((max, item) => (item.boardings > max ? item.boardings : max), 0),
    [],
  );

  const filteredRecentTrips = useMemo(() => {
    if (selectedRoute === 'All Routes') return recentTripsData;
    return recentTripsData.filter((trip) => trip.route === selectedRoute);
  }, [selectedRoute]);

  const filteredTripsByRoute = useMemo(() => {
    if (selectedRoute === 'All Routes') return tripsByRoute;
    return tripsByRoute.filter((item) => item.name === selectedRoute);
  }, [selectedRoute]);

  const handleExport = () => {
    const rows =
      activeTab === 'recentTrips'
        ? [
            ['Trip ID', 'Passenger ID', 'Route', 'Boarded At', 'Alighted At', 'Time', 'Duration'],
            ...filteredRecentTrips.map((trip) => [
              trip.tripId,
              trip.passengerId,
              trip.route,
              trip.boardedAt,
              trip.alightedAt,
              trip.time,
              trip.duration,
            ]),
          ]
        : [
            ['Rank', 'Stop Name', 'Total Boardings'],
            ...busiestStopsData.map((item, index) => [String(index + 1), item.stop, String(item.boardings)]),
          ];

    const csv = rows
      .map((row) => row.map((value) => `"${String(value).replace(/"/g, '""')}"`).join(','))
      .join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = `trips-analytics-${activeTab}-${selectedDateRange.replace(/\s+/g, '-').toLowerCase()}.csv`;
    anchor.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div style={{ padding: adminSpacing.xl, color: '#E5E5E5' }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: adminSpacing.md,
          flexWrap: 'wrap',
          marginBottom: adminSpacing.lg,
        }}
      >
        <h1 style={{ margin: 0, color: '#FFFFFF', fontSize: '24px', fontWeight: 700 }}>Trips Analytics</h1>

        <div style={{ display: 'flex', alignItems: 'center', gap: adminSpacing.sm, flexWrap: 'wrap' }}>
          <select
            value={selectedDateRange}
            onChange={(event) => setSelectedDateRange(event.target.value)}
            style={filterControlStyle}
            aria-label="Date range"
          >
            {dateRanges.map((range) => (
              <option key={range} value={range} style={{ backgroundColor: '#1A1A1A', color: '#E5E5E5' }}>
                {range}
              </option>
            ))}
          </select>

          <select
            value={selectedRoute}
            onChange={(event) => setSelectedRoute(event.target.value)}
            style={filterControlStyle}
            aria-label="Route filter"
          >
            {routeFilters.map((route) => (
              <option key={route} value={route} style={{ backgroundColor: '#1A1A1A', color: '#E5E5E5' }}>
                {route}
              </option>
            ))}
          </select>

          <button style={exportButtonStyle} type="button" onClick={handleExport}>
            Export
          </button>
        </div>
      </div>

      <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: adminSpacing.md, marginBottom: adminSpacing.lg }}>
        <StatCard label="Total Trips" value="1,284" />
        <StatCard label="Unique Passengers" value="4,821" />
        <StatCard label="Peak Hour" value="8:30 AM" />
        <StatCard label="Busiest Route" value="Route 4" />
      </section>

      <section
        style={{
          display: 'grid',
          gridTemplateColumns: '2fr 1fr',
          gap: adminSpacing.md,
          marginBottom: adminSpacing.lg,
        }}
      >
        <article style={{ ...panelStyle, padding: adminSpacing.lg, minHeight: '360px' }}>
          <h2 style={sectionTitleStyle}>Passenger count per hour</h2>
          <div style={{ width: '100%', height: '300px' }}>
            <ResponsiveContainer>
              <LineChart data={passengerCountPerHour} margin={{ top: 12, right: 12, left: 4, bottom: 8 }}>
                <CartesianGrid stroke="#2A2A2A" strokeDasharray="3 3" />
                <XAxis dataKey="hour" stroke="#888888" tick={{ fill: '#888888', fontSize: 12 }} axisLine={{ stroke: '#2A2A2A' }} />
                <YAxis stroke="#888888" tick={{ fill: '#888888', fontSize: 12 }} axisLine={{ stroke: '#2A2A2A' }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#1A1A1A', border: '1px solid #FFD000', borderRadius: '8px' }}
                  itemStyle={{ color: '#E5E5E5' }}
                  labelStyle={{ color: '#FFD000' }}
                />
                <Line type="monotone" dataKey="count" stroke="#FFD000" strokeWidth={3} dot={{ r: 3, fill: '#FFD000' }} activeDot={{ r: 5 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </article>

        <article style={{ ...panelStyle, padding: adminSpacing.lg, minHeight: '360px' }}>
          <h2 style={sectionTitleStyle}>Trips by route</h2>
          <div style={{ width: '100%', height: '240px' }}>
            <ResponsiveContainer>
              <PieChart>
                <Pie data={filteredTripsByRoute} dataKey="value" nameKey="name" innerRadius={56} outerRadius={88} paddingAngle={3}>
                  {filteredTripsByRoute.map((_, index) => (
                    <Cell key={`slice-${index}`} fill={routePalette[index % routePalette.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#1A1A1A', border: '1px solid #FFD000', borderRadius: '8px' }}
                  itemStyle={{ color: '#E5E5E5' }}
                  labelStyle={{ color: '#FFD000' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div style={{ marginTop: '8px' }}>
            <LegendList data={filteredTripsByRoute} />
          </div>
        </article>
      </section>

      <section style={{ ...panelStyle, padding: adminSpacing.lg }}>
        <div style={{ display: 'flex', gap: adminSpacing.sm, marginBottom: adminSpacing.md, borderBottom: '1px solid #2A2A2A', paddingBottom: adminSpacing.sm }}>
          <button type="button" style={tabButtonStyle(activeTab === 'recentTrips')} onClick={() => setActiveTab('recentTrips')}>
            Recent Trips
          </button>
          <button type="button" style={tabButtonStyle(activeTab === 'busiestStops')} onClick={() => setActiveTab('busiestStops')}>
            Busiest Stops
          </button>
        </div>

        {activeTab === 'recentTrips' ? (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', minWidth: '900px', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #2A2A2A' }}>
                  <th style={tableHeaderStyle}>Trip ID</th>
                  <th style={tableHeaderStyle}>Passenger ID</th>
                  <th style={tableHeaderStyle}>Route</th>
                  <th style={tableHeaderStyle}>Boarded At (stop)</th>
                  <th style={tableHeaderStyle}>Alighted At (stop)</th>
                  <th style={tableHeaderStyle}>Time</th>
                  <th style={tableHeaderStyle}>Duration</th>
                </tr>
              </thead>
              <tbody>
                {filteredRecentTrips.map((trip) => (
                  <tr key={trip.tripId} style={{ borderBottom: '1px solid #2A2A2A' }}>
                    <td style={tableCellStyle}>{trip.tripId}</td>
                    <td style={tableCellStyle}>{trip.passengerId}</td>
                    <td style={tableCellStyle}>{trip.route}</td>
                    <td style={tableCellStyle}>{trip.boardedAt}</td>
                    <td style={tableCellStyle}>{trip.alightedAt}</td>
                    <td style={tableCellStyle}>{trip.time}</td>
                    <td style={tableCellStyle}>{trip.duration}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div style={{ display: 'grid', gap: adminSpacing.sm }}>
            {busiestStopsData.map((item, index) => {
              const width = Math.max(8, Math.round((item.boardings / topBoardingCount) * 100));
              return (
                <article key={item.stop} style={{ display: 'grid', gridTemplateColumns: '56px minmax(0, 1fr) auto', gap: adminSpacing.md, alignItems: 'center' }}>
                  <div
                    style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '50%',
                      display: 'grid',
                      placeItems: 'center',
                      fontWeight: 700,
                      color: '#0D0D0D',
                      backgroundColor: '#FFD000',
                      border: '1px solid #E6BB00',
                    }}
                  >
                    {index + 1}
                  </div>

                  <div>
                    <div style={{ color: '#FFFFFF', fontWeight: 600, fontSize: '14px', marginBottom: '6px' }}>{item.stop}</div>
                    <div style={{ height: '10px', borderRadius: '999px', backgroundColor: '#222222', overflow: 'hidden' }}>
                      <div style={{ width: `${width}%`, height: '100%', backgroundColor: '#FFD000' }} />
                    </div>
                  </div>

                  <div style={{ color: '#E5E5E5', fontWeight: 600, minWidth: '96px', textAlign: 'right' }}>{item.boardings.toLocaleString()} boardings</div>
                </article>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
};

const StatCard: React.FC<{ label: string; value: string }> = ({ label, value }) => {
  return (
    <article style={{ ...panelStyle, padding: adminSpacing.md }}>
      <div style={{ color: '#888888', fontSize: '12px', marginBottom: '6px' }}>{label}</div>
      <div style={{ color: '#FFFFFF', fontSize: '26px', fontWeight: 700 }}>{value}</div>
    </article>
  );
};

const LegendList: React.FC<{ data: Array<{ name: string; value: number }> }> = ({ data }) => {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '6px' }}>
      {data.map((item, index) => (
        <div key={item.name} style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#E5E5E5', fontSize: '12px' }}>
          <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: routePalette[index % routePalette.length] }} />
          <span style={{ flex: 1 }}>{item.name}</span>
          <span style={{ color: '#888888' }}>{item.value}</span>
        </div>
      ))}
    </div>
  );
};

const sectionTitleStyle: React.CSSProperties = {
  margin: 0,
  marginBottom: adminSpacing.md,
  color: '#FFFFFF',
  fontSize: '15px',
  fontWeight: 700,
};

const filterControlStyle: React.CSSProperties = {
  backgroundColor: '#1A1A1A',
  color: '#E5E5E5',
  border: '1px solid #2A2A2A',
  borderRadius: adminBorders.radius.md,
  height: '38px',
  padding: '0 12px',
  minWidth: '160px',
  fontSize: '13px',
};

const exportButtonStyle: React.CSSProperties = {
  height: '38px',
  border: '1px solid #FFD000',
  borderRadius: adminBorders.radius.md,
  backgroundColor: '#FFD000',
  color: '#0D0D0D',
  padding: '0 16px',
  fontWeight: 700,
  cursor: 'pointer',
};

const tabButtonStyle = (active: boolean): React.CSSProperties => ({
  height: '34px',
  padding: '0 14px',
  borderRadius: adminBorders.radius.md,
  border: active ? '1px solid #FFD000' : '1px solid #2A2A2A',
  backgroundColor: active ? '#FFD000' : '#1A1A1A',
  color: active ? '#0D0D0D' : '#E5E5E5',
  fontWeight: 700,
  fontSize: '12px',
  cursor: 'pointer',
});

const tableHeaderStyle: React.CSSProperties = {
  textAlign: 'left',
  color: '#888888',
  fontSize: '12px',
  fontWeight: 600,
  padding: '10px 8px',
};

const tableCellStyle: React.CSSProperties = {
  color: '#E5E5E5',
  fontSize: '13px',
  padding: '12px 8px',
  whiteSpace: 'nowrap',
};

export default TripsAnalytics;
