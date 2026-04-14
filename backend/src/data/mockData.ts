export interface Route {
  id: string;
  name: string;
  from: string;
  to: string;
  distance: string;
  frequency: string;
}

export interface Stop {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
}

export interface Bus {
  id: string;
  number: number;
  routeId: string;
  status: "on-time" | "delayed" | "at-stop";
  nextStop: string;
  nextStopEta: number;
  latitude: number;
  longitude: number;
  speed: number;
  passengers: number;
}

export const routes: Route[] = [
  {
    id: "route-001",
    name: "Route 1: Downtown Express",
    from: "Amravati Central",
    to: "Badnera Junction",
    distance: "22.5 km",
    frequency: "15 min"
  },
  {
    id: "route-002",
    name: "Route 2: City Loop",
    from: "Station Square",
    to: "University Campus",
    distance: "18.3 km",
    frequency: "20 min"
  },
  {
    id: "route-003",
    name: "Route 3: Metro Link",
    from: "Amravati Central",
    to: "Airport Road",
    distance: "25.8 km",
    frequency: "25 min"
  }
];

export const stops: Stop[] = [
  { id: "stop-001", name: "Amravati Central", latitude: 20.9517, longitude: 77.7597 },
  { id: "stop-002", name: "Railway Station", latitude: 20.9530, longitude: 77.7610 },
  { id: "stop-003", name: "Government Hospital", latitude: 20.9550, longitude: 77.7625 },
  { id: "stop-004", name: "City Market", latitude: 20.9570, longitude: 77.7640 },
  { id: "stop-005", name: "College Road", latitude: 20.9590, longitude: 77.7655 },
  { id: "stop-006", name: "Shopping District", latitude: 20.9610, longitude: 77.7670 },
  { id: "stop-007", name: "Stadium Gate", latitude: 20.9630, longitude: 77.7685 },
  { id: "stop-008", name: "Green Park", latitude: 20.9650, longitude: 77.7700 },
  { id: "stop-009", name: "Techno City", latitude: 20.9670, longitude: 77.7715 },
  { id: "stop-010", name: "Business Zone", latitude: 20.9690, longitude: 77.7730 },
  { id: "stop-011", name: "South Colony", latitude: 20.9710, longitude: 77.7745 },
  { id: "stop-012", name: "Garden Society", latitude: 20.9730, longitude: 77.7760 },
  { id: "stop-013", name: "Residential Area", latitude: 20.9750, longitude: 77.7775 },
  { id: "stop-014", name: "Industrial Park", latitude: 20.9770, longitude: 77.7790 },
  { id: "stop-015", name: "Warehouse Zone", latitude: 20.9790, longitude: 77.7805 },
  { id: "stop-016", name: "Highway Junction", latitude: 20.9810, longitude: 77.7820 },
  { id: "stop-017", name: "Service Station", latitude: 20.9830, longitude: 77.7835 },
  { id: "stop-018", name: "Commerce Hub", latitude: 20.9850, longitude: 77.7850 },
  { id: "stop-019", name: "Transit Center", latitude: 20.9870, longitude: 77.7865 },
  { id: "stop-020", name: "Badnera Branch", latitude: 20.9885, longitude: 77.7875 },
  { id: "stop-021", name: "Badnera Market", latitude: 20.9900, longitude: 77.7885 },
  { id: "stop-022", name: "Badnera Junction", latitude: 20.9915, longitude: 77.7895 }
];

export const buses: Bus[] = [
  {
    id: "bus-001",
    number: 1,
    routeId: "route-001",
    status: "on-time",
    nextStop: "City Market",
    nextStopEta: 5,
    latitude: 20.9570,
    longitude: 77.7640,
    speed: 35,
    passengers: 42
  },
  {
    id: "bus-002",
    number: 2,
    routeId: "route-001",
    status: "on-time",
    nextStop: "Shopping District",
    nextStopEta: 8,
    latitude: 20.9610,
    longitude: 77.7670,
    speed: 32,
    passengers: 38
  },
  {
    id: "bus-003",
    number: 3,
    routeId: "route-001",
    status: "delayed",
    nextStop: "Stadium Gate",
    nextStopEta: 12,
    latitude: 20.9630,
    longitude: 77.7685,
    speed: 28,
    passengers: 45
  },
  {
    id: "bus-004",
    number: 4,
    routeId: "route-001",
    status: "on-time",
    nextStop: "Green Park",
    nextStopEta: 3,
    latitude: 20.9650,
    longitude: 77.7700,
    speed: 40,
    passengers: 35
  },
  {
    id: "bus-005",
    number: 5,
    routeId: "route-002",
    status: "on-time",
    nextStop: "College Road",
    nextStopEta: 6,
    latitude: 20.9590,
    longitude: 77.7655,
    speed: 33,
    passengers: 48
  },
  {
    id: "bus-006",
    number: 6,
    routeId: "route-002",
    status: "at-stop",
    nextStop: "Shopping District",
    nextStopEta: 0,
    latitude: 20.9610,
    longitude: 77.7670,
    speed: 0,
    passengers: 52
  },
  {
    id: "bus-007",
    number: 7,
    routeId: "route-002",
    status: "on-time",
    nextStop: "Techno City",
    nextStopEta: 10,
    latitude: 20.9670,
    longitude: 77.7715,
    speed: 31,
    passengers: 41
  },
  {
    id: "bus-008",
    number: 8,
    routeId: "route-003",
    status: "on-time",
    nextStop: "Business Zone",
    nextStopEta: 7,
    latitude: 20.9690,
    longitude: 77.7730,
    speed: 36,
    passengers: 39
  },
  {
    id: "bus-009",
    number: 9,
    routeId: "route-003",
    status: "delayed",
    nextStop: "South Colony",
    nextStopEta: 15,
    latitude: 20.9710,
    longitude: 77.7745,
    speed: 25,
    passengers: 50
  },
  {
    id: "bus-010",
    number: 10,
    routeId: "route-003",
    status: "on-time",
    nextStop: "Garden Society",
    nextStopEta: 4,
    latitude: 20.9730,
    longitude: 77.7760,
    speed: 38,
    passengers: 36
  },
  {
    id: "bus-011",
    number: 11,
    routeId: "route-001",
    status: "on-time",
    nextStop: "Techno City",
    nextStopEta: 9,
    latitude: 20.9670,
    longitude: 77.7715,
    speed: 34,
    passengers: 44
  },
  {
    id: "bus-012",
    number: 12,
    routeId: "route-002",
    status: "at-stop",
    nextStop: "Business Zone",
    nextStopEta: 0,
    latitude: 20.9690,
    longitude: 77.7730,
    speed: 0,
    passengers: 55
  }
];
