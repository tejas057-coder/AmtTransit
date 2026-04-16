import { useState, useCallback } from 'react';
import { AdminSettings, DEFAULT_SETTINGS } from '../types/adminSettings.types';

const STORAGE_KEY = 'amravati_admin_settings';

function loadSettings(): AdminSettings {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_SETTINGS;
    // Deep merge so new fields from DEFAULT_SETTINGS don't get lost
    const parsed = JSON.parse(raw) as Partial<AdminSettings>;
    return {
      profile: { ...DEFAULT_SETTINGS.profile, ...parsed.profile },
      fleet: { ...DEFAULT_SETTINGS.fleet, ...parsed.fleet },
      routes: { ...DEFAULT_SETTINGS.routes, ...parsed.routes },
      notifications: { ...DEFAULT_SETTINGS.notifications, ...parsed.notifications },
      security: { ...DEFAULT_SETTINGS.security, ...parsed.security },
      display: { ...DEFAULT_SETTINGS.display, ...parsed.display },
      analytics: { ...DEFAULT_SETTINGS.analytics, ...parsed.analytics },
    };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

function persistSettings(settings: AdminSettings) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  } catch {
    /* ignore quota errors */
  }
}

export function useAdminSettings() {
  const [settings, setSettings] = useState<AdminSettings>(() => loadSettings());
  const [saved, setSaved] = useState(false);

  const update = useCallback(<K extends keyof AdminSettings>(
    section: K,
    patch: Partial<AdminSettings[K]>,
  ) => {
    setSettings((prev) => {
      const next = {
        ...prev,
        [section]: { ...(prev[section] as object), ...(patch as object) },
      } as AdminSettings;
      return next;
    });
    setSaved(false);
  }, []);

  const save = useCallback(() => {
    setSettings((prev) => {
      persistSettings(prev);
      return prev;
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2200);
  }, []);

  const reset = useCallback(() => {
    setSettings(DEFAULT_SETTINGS);
    persistSettings(DEFAULT_SETTINGS);
    setSaved(false);
  }, []);

  return { settings, update, save, reset, saved };
}
