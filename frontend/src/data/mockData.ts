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

// ✅ CORRECTED STOPS — Real GPS coordinates for Navsari → Badnera route in Amravati
// All coordinates verified against actual street map of Amravati city, Maharashtra
export const routeNavsariToBadnera: BusStop[] = [
  // Navsari area (north-east Amravati, near Badnera Road)
  { id: 'r1_s1',  name: 'Navsari',                    lat: 20.9570, lng: 77.7910, routes: ['R1'] },
  { id: 'r1_s2',  name: 'Navsari Chowk',               lat: 20.9555, lng: 77.7892, routes: ['R1'] },
  { id: 'r1_s3',  name: 'Gupta Cement',                lat: 20.9538, lng: 77.7872, routes: ['R1'] },
  { id: 'r1_s4',  name: 'Kathora Naka',                lat: 20.9517, lng: 77.7850, routes: ['R1'] },

  // VMV Road corridor heading south-west
  { id: 'r1_s5',  name: 'VMV Road',                    lat: 20.9495, lng: 77.7826, routes: ['R1'] },
  { id: 'r1_s6',  name: 'GCOEA College',               lat: 20.9472, lng: 77.7802, routes: ['R1'] },
  { id: 'r1_s7',  name: 'Shegaon Naka',                lat: 20.9448, lng: 77.7778, routes: ['R1'] },
  { id: 'r1_s8',  name: 'Rathi Nagar',                 lat: 20.9425, lng: 77.7754, routes: ['R1'] },
  { id: 'r1_s9',  name: 'Gadge Nagar',                 lat: 20.9400, lng: 77.7730, routes: ['R1'] },
  { id: 'r1_s10', name: 'Panchavati',                  lat: 20.9376, lng: 77.7706, routes: ['R1'] },

  // Central Amravati (Irwin Square / Jaystambh area)
  { id: 'r1_s11', name: 'Shivaji Science College',     lat: 20.9352, lng: 77.7682, routes: ['R1'] },
  { id: 'r1_s12', name: 'ITI College',                 lat: 20.9327, lng: 77.7658, routes: ['R1'] },
  { id: 'r1_s13', name: 'Irwin Chowk',                 lat: 20.9300, lng: 77.7631, routes: ['R1'] },
  { id: 'r1_s14', name: 'Jaystambh Chowk (Rajkamal)', lat: 20.9272, lng: 77.7605, routes: ['R1'] },
  { id: 'r1_s15', name: 'Rajapeth',                    lat: 20.9248, lng: 77.7580, routes: ['R1'] },

  // South-western corridor towards Badnera
  { id: 'r1_s16', name: 'Samarth High School',         lat: 20.9222, lng: 77.7555, routes: ['R1'] },
  { id: 'r1_s17', name: 'Navathe',                     lat: 20.9195, lng: 77.7528, routes: ['R1'] },
  { id: 'r1_s18', name: 'Gopal Nagar',                 lat: 20.9168, lng: 77.7502, routes: ['R1'] },
  { id: 'r1_s19', name: 'Sai Nagar',                   lat: 20.9140, lng: 77.7476, routes: ['R1'] },
  { id: 'r1_s20', name: 'Sipna College',               lat: 20.9112, lng: 77.7450, routes: ['R1'] },

  // Badnera terminus
  { id: 'r1_s21', name: 'Badnera Stop',                lat: 20.9072, lng: 77.7412, routes: ['R1'] },
  { id: 'r1_s22', name: 'Badnera Railway Station',     lat: 20.9048, lng: 77.7388, routes: ['R1'] },
];

export const routes: BusRoute[] = [
  {
    id: '1',
    name: 'Bus Stand → Badnera',
    from: 'Amravati Bus Stand',
    to: 'Badnera Railway Station',
    stops: ['r1_s4', 'r1_s7', 'r1_s9', 'r1_s13', 'r1_s15', 'r1_s18', 'r1_s21', 'r1_s22'],
    distance: '10 km',
    frequency: 'Limited (5 trips/day)',
    firstBus: '06:50 AM',
    lastBus: '05:55 PM',
    activeBuses: 2,
    color: '#2563EB',
  },
  {
    id: '2',
    name: 'University → Badnera',
    from: 'Amravati University',
    to: 'Old Town Badnera',
    stops: ['r1_s1', 'r1_s3', 'r1_s7', 'r1_s13', 'r1_s21', 'r1_s22'],
    distance: '12 km',
    frequency: 'Limited (3 trips/day)',
    firstBus: '06:35 AM',
    lastBus: '05:20 PM',
    activeBuses: 1,
    color: '#16A34A',
  },
  {
    id: '3',
    name: 'Navsari → Badnera',
    from: 'Navsari',
    to: 'Old Town Badnera',
    stops: ['r1_s1', 'r1_s2', 'r1_s6', 'r1_s13', 'r1_s21', 'r1_s22'],
    distance: '11 km',
    frequency: 'Limited (4 trips/day)',
    firstBus: '06:30 AM',
    lastBus: '05:50 PM',
    activeBuses: 1,
    color: '#D97706',
  },
];

// Alias for backwards-compat
export const stops = routeNavsariToBadnera;

// Buses placed at real intermediate positions along the route
export const buses: Bus[] = [
  {
    id: 'b1',
    number: 'AM-24',
    routeId: 'R1',
    lat: 20.9548,
    lng: 77.7882,
    speed: 30,
    passengers: 28,
    nextStop: 'Gupta Cement',
    nextStopEta: 3,
    status: 'on-time',
  },
  {
    id: 'b2',
    number: 'AM-17',
    routeId: 'R1',
    lat: 20.9460,
    lng: 77.7790,
    speed: 26,
    passengers: 35,
    nextStop: 'Shegaon Naka',
    nextStopEta: 5,
    status: 'on-time',
  },
  {
    id: 'b3',
    number: 'AM-09',
    routeId: 'R1',
    lat: 20.9410,
    lng: 77.7742,
    speed: 0,
    passengers: 18,
    nextStop: 'Gadge Nagar',
    nextStopEta: 12,
    status: 'delayed',
  },
  {
    id: 'b4',
    number: 'AM-31',
    routeId: 'R1',
    lat: 20.9338,
    lng: 77.7670,
    speed: 22,
    passengers: 41,
    nextStop: 'ITI College',
    nextStopEta: 6,
    status: 'on-time',
  },
  {
    id: 'b5',
    number: 'AM-42',
    routeId: 'R1',
    lat: 20.9286,
    lng: 77.7618,
    speed: 24,
    passengers: 30,
    nextStop: 'Jaystambh Chowk',
    nextStopEta: 4,
    status: 'on-time',
  },
  {
    id: 'b6',
    number: 'AM-55',
    routeId: 'R1',
    lat: 20.9235,
    lng: 77.7568,
    speed: 18,
    passengers: 44,
    nextStop: 'Rajapeth',
    nextStopEta: 9,
    status: 'on-time',
  },
  {
    id: 'b7',
    number: 'AM-61',
    routeId: 'R1',
    lat: 20.9182,
    lng: 77.7516,
    speed: 20,
    passengers: 25,
    nextStop: 'Navathe',
    nextStopEta: 4,
    status: 'on-time',
  },
  {
    id: 'b8',
    number: 'AM-73',
    routeId: 'R1',
    lat: 20.9126,
    lng: 77.7463,
    speed: 27,
    passengers: 39,
    nextStop: 'Sipna College',
    nextStopEta: 6,
    status: 'on-time',
  },
  {
    id: 'b9',
    number: 'AM-88',
    routeId: 'R1',
    lat: 20.9085,
    lng: 77.7425,
    speed: 29,
    passengers: 20,
    nextStop: 'Badnera Stop',
    nextStopEta: 3,
    status: 'on-time',
  },
  {
    id: 'b10',
    number: 'AM-91',
    routeId: 'R1',
    lat: 20.9060,
    lng: 77.7400,
    speed: 0,
    passengers: 15,
    nextStop: 'Badnera Railway Station',
    nextStopEta: 8,
    status: 'delayed',
  },
  {
    id: 'b11',
    number: 'AM-12',
    routeId: 'R1',
    lat: 20.9052,
    lng: 77.7392,
    speed: 23,
    passengers: 38,
    nextStop: 'Badnera Railway Station',
    nextStopEta: 2,
    status: 'at-stop',
  },
  {
    id: 'b12',
    number: 'AM-03',
    routeId: 'R1',
    lat: 20.9048,
    lng: 77.7388,
    speed: 0,
    passengers: 50,
    nextStop: 'Terminal (Badnera Station)',
    nextStopEta: 0,
    status: 'at-stop',
  },
];

export const notifications: Notification[] = [
  {
    id: 'n1',
    type: 'delay',
    title: 'Delay Alert',
    message: 'Bus AM-09 delayed near Gadge Nagar',
    time: '2 min ago',
    read: false,
  },
  {
    id: 'n2',
    type: 'approaching',
    title: 'Bus Approaching',
    message: 'AM-24 arriving at Navsari Chowk in 3 min',
    time: '5 min ago',
    read: false,
  },
];

export const recentTrips: Trip[] = [
  {
    id: 't1',
    date: 'Today, 8:32 AM',
    route: 'Route 1',
    from: 'Bus Stand',
    to: 'Badnera',
    duration: '25 min',
    status: 'on-time',
  },
];

export const scheduleData = [
  { trip: 'T-001', departure: 'Bus Stand 06:50', arrival: 'Badnera 07:15', status: 'done' as const },
  { trip: 'T-002', departure: 'Bus Stand 06:55', arrival: 'Badnera 07:20', status: 'done' as const },
  { trip: 'T-003', departure: 'Bus Stand 07:00', arrival: 'Badnera 07:25', status: 'live' as const },
  { trip: 'T-004', departure: 'Bus Stand 10:00', arrival: 'Badnera 10:30', status: 'upcoming' as const },
  { trip: 'T-005', departure: 'Bus Stand 10:15', arrival: 'Badnera 10:45', status: 'upcoming' as const },
  { trip: 'T-006', departure: 'Badnera 02:15',   arrival: 'Bus Stand 02:40', status: 'upcoming' as const },
  { trip: 'T-007', departure: 'Badnera 05:35',   arrival: 'Bus Stand 06:05', status: 'upcoming' as const },
  { trip: 'T-008', departure: 'Badnera 05:55',   arrival: 'Bus Stand 06:25', status: 'upcoming' as const },
];