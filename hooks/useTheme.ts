import { useEffect, useState } from 'react';
import { Appearance, ColorSchemeName } from 'react-native';
import { AppSettings } from '@/types/bible';

export function useTheme(settings: AppSettings) {
  const [systemTheme, setSystemTheme] = useState<ColorSchemeName>(
    Appearance.getColorScheme()
  );

  useEffect(() => {
    const subscription = Appearance.addChangeListener(({ colorScheme }) => {
      setSystemTheme(colorScheme);
    });

    return () => subscription?.remove();
  }, []);

  const getEffectiveTheme = () => {
    if (settings.theme === 'system') {
      return systemTheme === 'dark' ? 'dark' : 'light';
    }
    if (settings.theme === 'custom' && settings.customTheme) {
      return 'custom';
    }
    return settings.theme;
  };

  const isDark = getEffectiveTheme() === 'dark';
  const isCustom = getEffectiveTheme() === 'custom';
  const effectiveTheme = getEffectiveTheme();

  const getThemeColors = () => {
    if (isCustom && settings.customTheme) {
      return {
        background: settings.customTheme.backgroundColor,
        text: settings.customTheme.textColor,
        card: settings.customTheme.cardColor,
        border: settings.customTheme.borderColor,
        accent: settings.customTheme.accentColor,
      };
    }

    if (isDark) {
      return {
        background: '#111827', // gray-900
        text: '#ffffff',
        card: '#1f2937', // gray-800
        border: '#374151', // gray-700
        accent: '#3b82f6', // blue-500
      };
    }

    return {
      background: '#ffffff',
      text: '#111827', // gray-900
      card: '#f9fafb', // gray-50
      border: '#e5e7eb', // gray-200
      accent: '#3b82f6', // blue-500
    };
  };

  return {
    isDark,
    isCustom,
    effectiveTheme,
    colors: getThemeColors(),
  };
}
