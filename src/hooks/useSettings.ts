import { useState, useEffect, useCallback } from 'react';
import type { AppSettings } from '../types/schema';
import { settingsDB } from '../lib/db';

const defaultSettings: AppSettings = {
  theme: 'dark',
  defaultView: 'dashboard',
  notifications: true,
};

export function useSettings() {
  const [settings, setSettings] = useState<AppSettings>(defaultSettings);
  const [loading, setLoading] = useState(true);

  // Load settings from IndexedDB
  const loadSettings = useCallback(async () => {
    try {
      setLoading(true);
      const stored = await settingsDB.get();
      if (stored) {
        setSettings(stored);
        // Apply theme immediately
        applyTheme(stored.theme);
      } else {
        // Save default settings
        await settingsDB.set(defaultSettings);
        applyTheme(defaultSettings.theme);
      }
    } catch (err) {
      console.error('Error loading settings:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial load
  useEffect(() => {
    loadSettings();
  }, [loadSettings]);

  // Apply theme to document
  const applyTheme = (theme: 'light' | 'dark') => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  // Update settings
  const updateSettings = useCallback(
    async (updates: Partial<AppSettings>) => {
      const newSettings = { ...settings, ...updates };
      setSettings(newSettings);
      await settingsDB.set(newSettings);

      // Apply theme if changed
      if (updates.theme) {
        applyTheme(updates.theme);
      }
    },
    [settings]
  );

  // Toggle theme
  const toggleTheme = useCallback(() => {
    const newTheme = settings.theme === 'dark' ? 'light' : 'dark';
    updateSettings({ theme: newTheme });
  }, [settings.theme, updateSettings]);

  return {
    settings,
    loading,
    updateSettings,
    toggleTheme,
  };
}
