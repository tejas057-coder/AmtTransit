// ─────────────────────────────────────────────────────────────────────────────
// Admin Settings Types — AmravatiTransit
// ─────────────────────────────────────────────────────────────────────────────

export interface AdminProfile {
  name: string;
  email: string;
  phone: string;
  role: 'Super Admin' | 'Admin' | 'Operator';
  avatar: string; // initials fallback
}

export interface FleetConfig {
  maxPassengerCapacity: number;
  lowFuelThreshold: number;       // %
  maintenanceIntervalKm: number;
  speedLimitKmh: number;
  autoAssignDrivers: boolean;
}

export interface RouteSettings {
  defaultFrequencyMinutes: number;
  bufferTimeMinutes: number;
  enableDynamicRerouting: boolean;
  showStopCodes: boolean;
}

export interface NotificationSettings {
  delayAlerts: boolean;
  busApproachingAlerts: boolean;
  maintenanceDueAlerts: boolean;
  emailDigest: boolean;
  emailDigestFrequency: 'daily' | 'weekly' | 'never';
}

export interface SecuritySettings {
  sessionTimeoutMinutes: number;
  requireTwoFactor: boolean;
  ipWhitelistEnabled: boolean;
  auditLogEnabled: boolean;
}

export interface DisplaySettings {
  theme: 'dark' | 'system';
  mapDefaultZoom: number;
  compactSidebar: boolean;
}

export interface AnalyticsSettings {
  retentionDays: number;
  enableHeatmaps: boolean;
  shareAnonymousData: boolean;
}

export interface AdminSettings {
  profile: AdminProfile;
  fleet: FleetConfig;
  routes: RouteSettings;
  notifications: NotificationSettings;
  security: SecuritySettings;
  display: DisplaySettings;
  analytics: AnalyticsSettings;
}

export const DEFAULT_SETTINGS: AdminSettings = {
  profile: {
    name: 'Rajan Deshmukh',
    email: 'admin@amravaticitybus.in',
    phone: '+91 98765 43210',
    role: 'Super Admin',
    avatar: 'RD',
  },
  fleet: {
    maxPassengerCapacity: 52,
    lowFuelThreshold: 15,
    maintenanceIntervalKm: 5000,
    speedLimitKmh: 60,
    autoAssignDrivers: true,
  },
  routes: {
    defaultFrequencyMinutes: 20,
    bufferTimeMinutes: 3,
    enableDynamicRerouting: false,
    showStopCodes: true,
  },
  notifications: {
    delayAlerts: true,
    busApproachingAlerts: true,
    maintenanceDueAlerts: true,
    emailDigest: false,
    emailDigestFrequency: 'daily',
  },
  security: {
    sessionTimeoutMinutes: 60,
    requireTwoFactor: false,
    ipWhitelistEnabled: false,
    auditLogEnabled: true,
  },
  display: {
    theme: 'dark',
    mapDefaultZoom: 14,
    compactSidebar: false,
  },
  analytics: {
    retentionDays: 90,
    enableHeatmaps: true,
    shareAnonymousData: false,
  },
};
