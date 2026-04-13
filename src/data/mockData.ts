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

export const stops: BusStop[] = [
  { id: 's1', name: 'Rajkamal Chowk', lat: 20.9343, lng: 77.7601, routes: ['1', '2', '4', '6'] },
  { id: 's2', name: 'Jaistambh Chowk', lat: 20.9323, lng: 77.7574, routes: ['3', '5'] },
  { id: 's3', name: 'Irwin Square', lat: 20.9337, lng: 77.7618, routes: ['1', '2', '5'] },
  { id: 's4', name: 'Fawara Chowk', lat: 20.9310, lng: 77.7590, routes: ['4', '6'] },
  { id: 's5', name: 'SICOM', lat: 20.9401, lng: 77.7534, routes: ['2', '3'] },
  { id: 's6', name: 'Cotton Market', lat: 20.9271, lng: 77.7652, routes: ['2'] },
  { id: 's7', name: 'Badnera Station', lat: 20.9145, lng: 77.8042, routes: ['1'] },
  { id: 's8', name: 'Amravati Railway Station', lat: 20.9356, lng: 77.7695, routes: ['2', '5'] },
  { id: 's9', name: 'Sant Gadge Baba University', lat: 20.9264, lng: 77.7476, routes: ['5'] },
  { id: 's10', name: 'Tapadia Stadium', lat: 20.9289, lng: 77.7509, routes: ['5'] },
  { id: 's11', name: 'Gandhi Bagh', lat: 20.9330, lng: 77.7550, routes: ['6'] },
  { id: 's12', name: 'VNIT Campus', lat: 20.9242, lng: 77.7502, routes: ['3'] },
  { id: 's13', name: 'Morshi Naka', lat: 20.9380, lng: 77.7450, routes: ['6'] },
  { id: 's14', name: 'Engineering College Chowk', lat: 20.9220, lng: 77.7580, routes: ['4'] },
  { id: 's15', name: 'Shivajinagar', lat: 20.9280, lng: 77.7540, routes: ['3'] },
];

export const routes: BusRoute[] = [
  { id: '1', name: 'Route 1', from: 'Rajkamal Chowk', to: 'Badnera Railway Station', stops: ['s1', 's3', 's7'], distance: '8.2 km', frequency: 'Every 15 min', firstBus: '06:00 AM', lastBus: '10:30 PM', activeBuses: 2, color: '#2563EB' },
  { id: '2', name: 'Route 2', from: 'SICOM', to: 'Cotton Market', stops: ['s5', 's1', 's3', 's8', 's6'], distance: '6.5 km', frequency: 'Every 20 min', firstBus: '06:30 AM', lastBus: '10:00 PM', activeBuses: 3, color: '#16A34A' },
  { id: '3', name: 'Route 3', from: 'Jaistambh Chowk', to: 'VNIT Campus', stops: ['s2', 's15', 's12', 's5'], distance: '5.1 km', frequency: 'Every 25 min', firstBus: '07:00 AM', lastBus: '09:30 PM', activeBuses: 1, color: '#D97706' },
  { id: '4', name: 'Route 4', from: 'Fruit Market', to: 'Engineering College', stops: ['s4', 's1', 's14'], distance: '7.8 km', frequency: 'Every 18 min', firstBus: '06:15 AM', lastBus: '10:00 PM', activeBuses: 2, color: '#DC2626' },
  { id: '5', name: 'Route 5', from: 'Irwin Square', to: 'Sant Gadge Baba University', stops: ['s3', 's2', 's10', 's9', 's8'], distance: '9.3 km', frequency: 'Every 22 min', firstBus: '06:00 AM', lastBus: '10:15 PM', activeBuses: 2, color: '#7C3AED' },
  { id: '6', name: 'Route 6', from: 'Gandhi Bagh', to: 'Morshi Road', stops: ['s11', 's4', 's1', 's13'], distance: '6.9 km', frequency: 'Every 20 min', firstBus: '06:30 AM', lastBus: '09:45 PM', activeBuses: 2, color: '#0891B2' },
];

export const buses: Bus[] = [
  { id: 'b1', number: 'AM-24', routeId: '2', lat: 20.9350, lng: 77.7610, speed: 28, passengers: 34, nextStop: 'Irwin Square', nextStopEta: 4, status: 'on-time' },
  { id: 'b2', number: 'AM-17', routeId: '1', lat: 20.9300, lng: 77.7650, speed: 32, passengers: 22, nextStop: 'Fawara Chowk', nextStopEta: 6, status: 'on-time' },
  { id: 'b3', number: 'AM-09', routeId: '1', lat: 20.9200, lng: 77.7800, speed: 0, passengers: 18, nextStop: 'Badnera Station', nextStopEta: 12, status: 'delayed' },
  { id: 'b4', number: 'AM-31', routeId: '3', lat: 20.9280, lng: 77.7550, speed: 25, passengers: 41, nextStop: 'VNIT Campus', nextStopEta: 8, status: 'on-time' },
  { id: 'b5', number: 'AM-12', routeId: '4', lat: 20.9320, lng: 77.7580, speed: 30, passengers: 27, nextStop: 'Rajkamal Chowk', nextStopEta: 3, status: 'on-time' },
  { id: 'b6', number: 'AM-45', routeId: '2', lat: 20.9380, lng: 77.7540, speed: 15, passengers: 38, nextStop: 'SICOM', nextStopEta: 2, status: 'at-stop' },
  { id: 'b7', number: 'AM-08', routeId: '5', lat: 20.9340, lng: 77.7620, speed: 22, passengers: 19, nextStop: 'Jaistambh Chowk', nextStopEta: 5, status: 'on-time' },
  { id: 'b8', number: 'AM-33', routeId: '6', lat: 20.9310, lng: 77.7560, speed: 0, passengers: 31, nextStop: 'Fawara Chowk', nextStopEta: 1, status: 'at-stop' },
  { id: 'b9', number: 'AM-19', routeId: '5', lat: 20.9270, lng: 77.7490, speed: 18, passengers: 15, nextStop: 'Sant Gadge Baba University', nextStopEta: 7, status: 'delayed' },
  { id: 'b10', number: 'AM-41', routeId: '2', lat: 20.9290, lng: 77.7660, speed: 35, passengers: 29, nextStop: 'Cotton Market', nextStopEta: 4, status: 'on-time' },
  { id: 'b11', number: 'AM-55', routeId: '4', lat: 20.9240, lng: 77.7570, speed: 20, passengers: 23, nextStop: 'Engineering College Chowk', nextStopEta: 9, status: 'delayed' },
  { id: 'b12', number: 'AM-28', routeId: '6', lat: 20.9360, lng: 77.7470, speed: 27, passengers: 36, nextStop: 'Morshi Naka', nextStopEta: 6, status: 'on-time' },
];

export const notifications: Notification[] = [
  { id: 'n1', type: 'delay', title: 'Delay Alert', message: 'Bus #AM-24 on Route 2 is running 12 minutes behind schedule near Irwin Square. Affected stop: Fawara Chowk', time: '2 min ago', read: false },
  { id: 'n2', type: 'approaching', title: 'Bus Approaching', message: 'Route 4 bus arriving at Rajkamal Chowk in approximately 3 minutes.', time: '5 min ago', read: false },
  { id: 'n3', type: 'diversion', title: 'Route Change', message: 'Route 3 is temporarily diverted via Shivajinagar due to road work near VNIT. Expected duration: 2 hours', time: '1 hour ago', read: false },
  { id: 'n4', type: 'restored', title: 'Service Restored', message: 'Route 1 service to Badnera has resumed normal operations after earlier delays.', time: '2 hours ago', read: true },
  { id: 'n5', type: 'system', title: 'System Update', message: 'New schedule effective from Monday. Check Route 5 for updated timings.', time: '3 hours ago', read: true },
  { id: 'n6', type: 'delay', title: 'Delay Alert', message: 'Bus #AM-09 on Route 1 delayed by 8 minutes near Badnera due to traffic congestion.', time: '4 hours ago', read: true },
  { id: 'n7', type: 'cancelled', title: 'Trip Cancelled', message: 'Route 6 Trip T-018 (7:30 PM departure) has been cancelled due to vehicle maintenance.', time: '5 hours ago', read: true },
];

export const recentTrips: Trip[] = [
  { id: 't1', date: 'Today, 8:32 AM', route: 'Route 2', from: 'Rajkamal Chowk', to: 'Amravati Station', duration: '22 min', status: 'on-time' },
  { id: 't2', date: 'Yesterday, 5:15 PM', route: 'Route 1', from: 'Irwin Square', to: 'Badnera Station', duration: '35 min', status: 'delayed' },
  { id: 't3', date: 'Apr 11, 9:00 AM', route: 'Route 5', from: 'Irwin Square', to: 'University', duration: '28 min', status: 'on-time' },
  { id: 't4', date: 'Apr 10, 6:45 PM', route: 'Route 4', from: 'Rajkamal Chowk', to: 'Engineering College', duration: '25 min', status: 'on-time' },
  { id: 't5', date: 'Apr 9, 8:10 AM', route: 'Route 3', from: 'Jaistambh Chowk', to: 'VNIT Campus', duration: '18 min', status: 'on-time' },
];

export const scheduleData = [
  { trip: 'T-001', departure: 'Rajkamal 06:00', arrival: 'Badnera 06:35', status: 'done' as const },
  { trip: 'T-002', departure: 'Rajkamal 06:30', arrival: 'Badnera 07:05', status: 'delayed' as const },
  { trip: 'T-003', departure: 'Rajkamal 07:00', arrival: 'Badnera 07:35', status: 'live' as const },
  { trip: 'T-004', departure: 'Rajkamal 07:30', arrival: 'Badnera 08:05', status: 'upcoming' as const },
  { trip: 'T-005', departure: 'Rajkamal 08:00', arrival: 'Badnera 08:35', status: 'upcoming' as const },
  { trip: 'T-006', departure: 'Rajkamal 08:30', arrival: 'Badnera 09:05', status: 'upcoming' as const },
  { trip: 'T-007', departure: 'Rajkamal 09:00', arrival: 'Badnera 09:35', status: 'upcoming' as const },
  { trip: 'T-008', departure: 'Rajkamal 09:30', arrival: 'Badnera 10:05', status: 'upcoming' as const },
];
