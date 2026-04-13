export interface BusStop {
  id: string;
  name: string;
  lat: number;
  lng: number;
  routes: string[];
}

export interface BusRoute {
  id: string;
  name: string;
  from: string;
  to: string;
  stops: string[];
  distance: string;
  frequency: string;
  firstBus: string;
  lastBus: string;
  activeBuses: number;
  color: string;
}

export interface Bus {
  id: string;
  number: string;
  routeId: string;
  lat: number;
  lng: number;
  speed: number;
  passengers: number;
  nextStop: string;
  nextStopEta: number;
  status: 'on-time' | 'delayed' | 'at-stop';
}

export interface Notification {
  id: string;
  type: 'delay' | 'approaching' | 'diversion' | 'cancelled' | 'restored' | 'system';
  title: string;
  message: string;
  time: string;
  read: boolean;
}

export interface Trip {
  id: string;
  date: string;
  route: string;
  from: string;
  to: string;
  duration: string;
  status: 'on-time' | 'delayed';
}

// ✅ UPDATED STOPS
export const stops: BusStop[] = [
  { id: 's1', name: 'Amravati Bus Stand', lat: 20.9320, lng: 77.7523, routes: ['1', '2'] },
  { id: 's2', name: 'Irwin Square', lat: 20.9337, lng: 77.7618, routes: ['1', '3'] },
  { id: 's3', name: 'Rajkamal Square', lat: 20.9343, lng: 77.7601, routes: ['1', '2', '3'] },
  { id: 's4', name: 'Rajapeth Square', lat: 20.9305, lng: 77.7560, routes: ['1'] },
  { id: 's5', name: 'Nawathe Square', lat: 20.9250, lng: 77.7700, routes: ['1'] },
  { id: 's6', name: 'Panchavati', lat: 20.9225, lng: 77.7750, routes: ['3'] },
  { id: 's7', name: 'Sai Nagar', lat: 20.9200, lng: 77.7800, routes: ['1', '2', '3'] },
  { id: 's8', name: 'Old Town Badnera', lat: 20.9155, lng: 77.8000, routes: ['1', '2', '3'] },
  { id: 's9', name: 'Badnera Railway Station', lat: 20.9145, lng: 77.8042, routes: ['1'] },
  { id: 's10', name: 'Amravati University', lat: 20.9264, lng: 77.7476, routes: ['2'] },
  { id: 's11', name: 'Biyani Square', lat: 20.9280, lng: 77.7500, routes: ['2'] },
  { id: 's12', name: 'Navsari', lat: 20.9400, lng: 77.7700, routes: ['3'] },
];

// ✅ UPDATED ROUTES
export const routes: BusRoute[] = [
  {
    id: '1',
    name: 'Bus Stand → Badnera',
    from: 'Amravati Bus Stand',
    to: 'Badnera Railway Station',
    stops: ['s1', 's2', 's3', 's4', 's5', 's7', 's8', 's9'],
    distance: '10 km',
    frequency: 'Limited (5 trips/day)',
    firstBus: '06:50 AM',
    lastBus: '05:55 PM',
    activeBuses: 2,
    color: '#2563EB'
  },
  {
    id: '2',
    name: 'University → Badnera',
    from: 'Amravati University',
    to: 'Old Town Badnera',
    stops: ['s10', 's11', 's1', 's3', 's7', 's8'],
    distance: '12 km',
    frequency: 'Limited (3 trips/day)',
    firstBus: '06:35 AM',
    lastBus: '05:20 PM',
    activeBuses: 1,
    color: '#16A34A'
  },
  {
    id: '3',
    name: 'Navsari → Badnera',
    from: 'Navsari',
    to: 'Old Town Badnera',
    stops: ['s12', 's6', 's2', 's3', 's7', 's8'],
    distance: '11 km',
    frequency: 'Limited (4 trips/day)',
    firstBus: '06:30 AM',
    lastBus: '05:50 PM',
    activeBuses: 1,
    color: '#D97706'
  }
];

// (UNCHANGED BUSES - keeping your simulation data)
export const buses: Bus[] = [
  { id: 'b1', number: 'AM-24', routeId: '2', lat: 20.9350, lng: 77.7610, speed: 28, passengers: 34, nextStop: 'Irwin Square', nextStopEta: 4, status: 'on-time' },
  { id: 'b2', number: 'AM-17', routeId: '1', lat: 20.9300, lng: 77.7650, speed: 32, passengers: 22, nextStop: 'Rajkamal Square', nextStopEta: 6, status: 'on-time' },
  { id: 'b3', number: 'AM-09', routeId: '1', lat: 20.9200, lng: 77.7800, speed: 0, passengers: 18, nextStop: 'Badnera Railway Station', nextStopEta: 12, status: 'delayed' },
  { id: 'b4', number: 'AM-31', routeId: '3', lat: 20.9280, lng: 77.7550, speed: 25, passengers: 41, nextStop: 'Panchavati', nextStopEta: 8, status: 'on-time' },
];

// (UNCHANGED NOTIFICATIONS)
export const notifications: Notification[] = [
  { id: 'n1', type: 'delay', title: 'Delay Alert', message: 'Bus delayed near Irwin Square', time: '2 min ago', read: false },
];

// (UNCHANGED TRIPS)
export const recentTrips: Trip[] = [
  { id: 't1', date: 'Today, 8:32 AM', route: 'Route 1', from: 'Bus Stand', to: 'Badnera', duration: '25 min', status: 'on-time' },
];

// ✅ UPDATED SCHEDULE
export const scheduleData = [
  { trip: 'T-001', departure: 'Bus Stand 06:50', arrival: 'Badnera 07:15', status: 'done' as const },
  { trip: 'T-002', departure: 'Bus Stand 06:55', arrival: 'Badnera 07:20', status: 'done' as const },
  { trip: 'T-003', departure: 'Bus Stand 07:00', arrival: 'Badnera 07:25', status: 'live' as const },
  { trip: 'T-004', departure: 'Bus Stand 10:00', arrival: 'Badnera 10:30', status: 'upcoming' as const },
  { trip: 'T-005', departure: 'Bus Stand 10:15', arrival: 'Badnera 10:45', status: 'upcoming' as const },
  { trip: 'T-006', departure: 'Badnera 02:15', arrival: 'Bus Stand 02:40', status: 'upcoming' as const },
  { trip: 'T-007', departure: 'Badnera 05:35', arrival: 'Bus Stand 06:05', status: 'upcoming' as const },
  { trip: 'T-008', departure: 'Badnera 05:55', arrival: 'Bus Stand 06:25', status: 'upcoming' as const },
];