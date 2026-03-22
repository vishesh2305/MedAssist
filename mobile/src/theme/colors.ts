export const lightColors = {
  primary: '#2563EB',
  primaryLight: '#3B82F6',
  primaryDark: '#1D4ED8',
  primaryFaded: '#DBEAFE',

  background: '#FFFFFF',
  backgroundSecondary: '#F8FAFC',
  backgroundTertiary: '#F1F5F9',

  surface: '#FFFFFF',
  surfaceSecondary: '#F8FAFC',

  text: '#0F172A',
  textSecondary: '#475569',
  textTertiary: '#94A3B8',
  textInverse: '#FFFFFF',

  border: '#E2E8F0',
  borderLight: '#F1F5F9',

  success: '#10B981',
  successLight: '#D1FAE5',
  warning: '#F59E0B',
  warningLight: '#FEF3C7',
  danger: '#EF4444',
  dangerLight: '#FEE2E2',
  info: '#3B82F6',
  infoLight: '#DBEAFE',

  shadow: 'rgba(0, 0, 0, 0.08)',
  overlay: 'rgba(0, 0, 0, 0.5)',

  card: '#FFFFFF',
  cardBorder: '#F1F5F9',

  tabBar: '#FFFFFF',
  tabBarBorder: '#E2E8F0',
  tabActive: '#2563EB',
  tabInactive: '#94A3B8',

  inputBackground: '#F8FAFC',
  inputBorder: '#E2E8F0',
  inputFocusBorder: '#2563EB',
  inputPlaceholder: '#94A3B8',

  skeleton: '#E2E8F0',
  skeletonHighlight: '#F1F5F9',

  star: '#F59E0B',
  starEmpty: '#E2E8F0',

  online: '#10B981',
  offline: '#94A3B8',

  emergency: '#EF4444',
  emergencyPulse: 'rgba(239, 68, 68, 0.3)',

  messageSent: '#2563EB',
  messageReceived: '#F1F5F9',
  messageSentText: '#FFFFFF',
  messageReceivedText: '#0F172A',
};

export const darkColors: typeof lightColors = {
  primary: '#3B82F6',
  primaryLight: '#60A5FA',
  primaryDark: '#2563EB',
  primaryFaded: '#1E3A5F',

  background: '#0F172A',
  backgroundSecondary: '#1E293B',
  backgroundTertiary: '#334155',

  surface: '#1E293B',
  surfaceSecondary: '#334155',

  text: '#F8FAFC',
  textSecondary: '#CBD5E1',
  textTertiary: '#64748B',
  textInverse: '#0F172A',

  border: '#334155',
  borderLight: '#1E293B',

  success: '#34D399',
  successLight: '#064E3B',
  warning: '#FBBF24',
  warningLight: '#78350F',
  danger: '#F87171',
  dangerLight: '#7F1D1D',
  info: '#60A5FA',
  infoLight: '#1E3A5F',

  shadow: 'rgba(0, 0, 0, 0.3)',
  overlay: 'rgba(0, 0, 0, 0.7)',

  card: '#1E293B',
  cardBorder: '#334155',

  tabBar: '#1E293B',
  tabBarBorder: '#334155',
  tabActive: '#3B82F6',
  tabInactive: '#64748B',

  inputBackground: '#334155',
  inputBorder: '#475569',
  inputFocusBorder: '#3B82F6',
  inputPlaceholder: '#64748B',

  skeleton: '#334155',
  skeletonHighlight: '#475569',

  star: '#FBBF24',
  starEmpty: '#475569',

  online: '#34D399',
  offline: '#64748B',

  emergency: '#F87171',
  emergencyPulse: 'rgba(248, 113, 113, 0.3)',

  messageSent: '#3B82F6',
  messageReceived: '#334155',
  messageSentText: '#FFFFFF',
  messageReceivedText: '#F8FAFC',
};

export type ColorPalette = typeof lightColors;
