export type BusStatus = "on-time" | "delayed" | "at-stop";

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
  status: BusStatus;
  nextStop: string;
  nextStopEta: number;
  latitude: number;
  longitude: number;
  speed: number;
  passengers: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  timestamp: string;
}

export interface BusUpdate {
  id: string;
  latitude: number;
  longitude: number;
  speed: number;
  nextStop: string;
  nextStopEta: number;
  status: BusStatus;
  passengers: number;
}
