import { useColorScheme } from 'react-native';
import { lightColors, darkColors, ColorPalette } from './colors';
import { spacing, borderRadius } from './spacing';
import { typography } from './typography';
import { useSettingsStore } from '../store/settingsStore';

export interface Theme {
  colors: ColorPalette;
  spacing: typeof spacing;
  borderRadius: typeof borderRadius;
  typography: typeof typography;
  isDark: boolean;
}

export const lightTheme: Theme = {
  colors: lightColors,
  spacing,
  borderRadius,
  typography,
  isDark: false,
};

export const darkTheme: Theme = {
  colors: darkColors,
  spacing,
  borderRadius,
  typography,
  isDark: true,
};

export function useTheme(): Theme {
  const systemScheme = useColorScheme();
  const themeMode = useSettingsStore((s) => s.theme);

  if (themeMode === 'dark') return darkTheme;
  if (themeMode === 'light') return lightTheme;
  return systemScheme === 'dark' ? darkTheme : lightTheme;
}

export { lightColors, darkColors, spacing, borderRadius, typography };
export type { ColorPalette };
