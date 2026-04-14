/**
 * Bus Timetable Data for Amravati Transit Application
 * Includes routes, stops, schedules with departure/arrival times
 */

export interface Stop {
  id: string;
  name: string;
  lat: number;
  lng: number;
  isTerminus?: boolean;
}

export interface Schedule {
  direction: string;
  departureStop: string;
  arrivalStop: string;
  departureTimes: string[];
  arrivalTimes?: string[];
  estimatedDuration: number; // in minutes
}

export interface BusRoute {
  routeId: string;
  routeName: string;
  stops: Stop[];
  schedules: Schedule[];
  isFree: boolean;
  color: string;
  totalStops: number;
  frequencyMinutes?: number;
}

// Define all stops with coordinates (Amravati, Maharashtra region)
const stops: Record<string, Stop> = {
  busStand: {
    id: "stop-1",
    name: "Amravati Bus Stand",
    lat: 20.844,
    lng: 77.7499,
    isTerminus: true,
  },
  rajkamal: {
    id: "stop-2",
    name: "Rajkamal",
    lat: 20.8445,
    lng: 77.7505,
  },
  rajapeth: {
    id: "stop-3",
    name: "Rajapeth",
    lat: 20.845,
    lng: 77.751,
  },
  nawathe: {
    id: "stop-4",
    name: "Nawathe",
    lat: 20.8455,
    lng: 77.7515,
  },
  saiNagar: {
    id: "stop-5",
    name: "Sai Nagar",
    lat: 20.846,
    lng: 77.752,
  },
  oldTown: {
    id: "stop-6",
    name: "Old Town",
    lat: 20.8465,
    lng: 77.7525,
  },
  badneraRly: {
    id: "stop-7",
    name: "Badnera Rly.",
    lat: 20.847,
    lng: 77.753,
    isTerminus: true,
  },
  university: {
    id: "stop-8",
    name: "Amravati University",
    lat: 20.84,
    lng: 77.745,
    isTerminus: true,
  },
  biyaniSqr: {
    id: "stop-9",
    name: "Biyani Sqr",
    lat: 20.8425,
    lng: 77.7475,
  },
  navsari: {
    id: "stop-10",
    name: "Navsari",
    lat: 20.83,
    lng: 77.74,
    isTerminus: true,
  },
  panchawati: {
    id: "stop-11",
    name: "Panchawati",
    lat: 20.8325,
    lng: 77.7425,
  },
  irwinSq: {
    id: "stop-12",
    name: "Irwin Sq.",
    lat: 20.835,
    lng: 77.745,
  },
  prmit: {
    id: "stop-13",
    name: "PRMIT&R, Badnera",
    lat: 20.848,
    lng: 77.754,
    isTerminus: true,
  },
  badnera: {
    id: "stop-14",
    name: "Badnera",
    lat: 20.847,
    lng: 77.753,
    isTerminus: true,
  },
};

// Route 1: Amravati Bus Stand → Badnera Rly.
export const route1: BusRoute = {
  routeId: "route-1",
  routeName: "Bus Stand → Badnera Express",
  color: "#3B82F6", // Blue
  stops: [
    stops.busStand,
    stops.rajkamal,
    stops.rajapeth,
    stops.nawathe,
    stops.saiNagar,
    stops.oldTown,
    stops.badneraRly,
  ],
  totalStops: 7,
  frequencyMinutes: 15,
  isFree: false,
  schedules: [
    {
      direction: "To Badnera Rly.",
      departureStop: "Amravati Bus Stand",
      arrivalStop: "Badnera Rly.",
      departureTimes: ["06:50", "06:55", "07:00", "10:00", "10:15"],
      arrivalTimes: ["07:25", "07:30", "07:35", "10:35", "10:50"],
      estimatedDuration: 35,
    },
    {
      direction: "To Bus Stand",
      departureStop: "Old Town",
      arrivalStop: "Amravati Bus Stand",
      departureTimes: ["14:15", "14:25", "14:45", "17:35", "17:55"],
      arrivalTimes: ["14:50", "15:00", "15:20", "18:10", "18:30"],
      estimatedDuration: 35,
    },
  ],
};

// Route 2: Amravati University → Badnera
export const route2: BusRoute = {
  routeId: "route-2",
  routeName: "University → Badnera",
  color: "#10B981", // Green
  stops: [
    stops.university,
    stops.biyaniSqr,
    stops.busStand,
    stops.rajkamal,
    stops.saiNagar,
    stops.oldTown,
    stops.badnera,
  ],
  totalStops: 7,
  frequencyMinutes: 90,
  isFree: false,
  schedules: [
    {
      direction: "To Badnera",
      departureStop: "Amravati University",
      arrivalStop: "Badnera",
      departureTimes: ["08:35", "09:30", "09:45"],
      arrivalTimes: ["09:15", "10:10", "10:25"],
      estimatedDuration: 40,
    },
    {
      direction: "To University",
      departureStop: "Old Town",
      arrivalStop: "Amravati University",
      departureTimes: ["14:05", "14:35", "17:20"],
      arrivalTimes: ["14:45", "15:15", "18:00"],
      estimatedDuration: 40,
    },
  ],
};

// Route 3: Navsari → Badnera
export const route3: BusRoute = {
  routeId: "route-3",
  routeName: "Navsari → Badnera",
  color: "#F59E0B", // Orange
  stops: [
    stops.navsari,
    stops.panchawati,
    stops.irwinSq,
    stops.rajkamal,
    stops.saiNagar,
    stops.oldTown,
    stops.badnera,
  ],
  totalStops: 7,
  frequencyMinutes: 120,
  isFree: false,
  schedules: [
    {
      direction: "To Badnera",
      departureStop: "Navsari",
      arrivalStop: "Badnera",
      departureTimes: ["06:30", "06:55", "09:45", "10:00"],
      arrivalTimes: ["07:35", "08:00", "10:50", "11:05"],
      estimatedDuration: 65,
    },
    {
      direction: "To Navsari",
      departureStop: "Old Town",
      arrivalStop: "Navsari",
      departureTimes: ["14:05", "14:15", "17:35", "17:50"],
      arrivalTimes: ["15:10", "15:20", "18:40", "18:55"],
      estimatedDuration: 65,
    },
  ],
};

// Route 4: College Bus (Free) - PRMIT&R → Old Town
export const route4: BusRoute = {
  routeId: "route-4",
  routeName: "College Bus - PRMIT&R (FREE)",
  color: "#EC4899", // Pink
  stops: [stops.prmit, stops.badnera, stops.oldTown],
  totalStops: 3,
  frequencyMinutes: 180,
  isFree: true,
  schedules: [
    {
      direction: "To Old Town",
      departureStop: "PRMIT&R, Badnera",
      arrivalStop: "Old Town Badnera",
      departureTimes: ["07:00", "10:30", "14:30"],
      arrivalTimes: ["07:30", "11:00", "15:00"],
      estimatedDuration: 30,
    },
    {
      direction: "To PRMIT&R",
      departureStop: "Old Town Badnera",
      arrivalStop: "PRMIT&R, Badnera",
      departureTimes: ["08:30", "12:00", "16:00"],
      arrivalTimes: ["09:00", "12:30", "16:30"],
      estimatedDuration: 30,
    },
  ],
};

// All routes collection
export const allRoutes: BusRoute[] = [route1, route2, route3, route4];

// All stops collection
export const allStops: Stop[] = Object.values(stops);

// Export stops for easy access
export const stopsMap = stops;
