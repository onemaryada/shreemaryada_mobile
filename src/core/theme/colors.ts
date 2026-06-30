export const colors = {
  // Brand
  primary: '#5E6AD2',
  primaryLight: '#E8EAFA',
  primaryDark: '#3A449A',

  // Backgrounds
  background: '#FFFFFF',
  backgroundDark: '#0F1115',
  surface: '#F8F9FA',
  surfaceDark: '#1A1D24',

  // Text
  text: '#111827',
  textDark: '#F9FAFB',
  textSecondary: '#6B7280',
  textSecondaryDark: '#9CA3AF',
  textTertiary: '#9CA3AF',
  textTertiaryDark: '#6B7280',

  // Borders
  border: '#E5E7EB',
  borderDark: '#374151',

  // Status
  success: '#10B981',
  successLight: '#D1FAE5',
  warning: '#F59E0B',
  warningLight: '#FEF3C7',
  error: '#EF4444',
  errorLight: '#FEE2E2',
  info: '#3B82F6',
  infoLight: '#DBEAFE',

  // Neutrals
  white: '#FFFFFF',
  black: '#000000',
  transparent: 'transparent',
};

export const gradients = {
  // Primary gradients
  primary: ['#5E6AD2', '#3A449A'],
  primaryAlt: ['#6B7DD9', '#5E6AD2'],

  // Glass effect overlay
  glassLight: ['rgba(255, 255, 255, 0.25)', 'rgba(255, 255, 255, 0.15)'],
  glassDark: ['rgba(255, 255, 255, 0.1)', 'rgba(255, 255, 255, 0.05)'],

  // Background gradients
  bgLight: ['#FFFFFF', '#F8F9FA'],
  bgDark: ['#1A1D24', '#0F1115'],

  // Status gradients
  success: ['#10B981', '#059669'],
  warning: ['#F59E0B', '#D97706'],
  error: ['#EF4444', '#DC2626'],
  info: ['#3B82F6', '#2563EB'],
};

export type ThemeColors = typeof colors;
export type Gradients = typeof gradients;
