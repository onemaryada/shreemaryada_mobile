export const colors = {
  // Brand — derived from logo colors #0C5E2F (deep forest green) & #789E67 (sage green)
  primary: '#1E7A43',       // vibrant forest green (mid-point between logo colors)
  primaryLight: '#E8F5EC',  // very light green tint for chips, tags, highlights
  primaryDark: '#0C5E2F',   // deep forest green (dark logo color)
  primarySage: '#789E67',   // sage green (light logo color, used for accents)

  // Backgrounds
  background: '#FFFFFF',
  backgroundDark: '#0A1F0F',  // deep green-tinted dark background
  surface: '#F4FAF6',         // light green-tinted surface
  surfaceDark: '#122B1A',     // dark green-tinted card surface

  // Text
  text: '#0D1F14',            // near-black with green undertone
  textDark: '#F0FAF4',
  textSecondary: '#5A6E5F',   // muted green-grey
  textSecondaryDark: '#8FAF97',
  textTertiary: '#9DB5A3',
  textTertiaryDark: '#5A6E5F',

  // Borders
  border: '#D6EAD8',          // light green-tinted border
  borderDark: '#2A4733',      // dark green border

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

  // Badge backgrounds (with 20% opacity)
  badgePrimary: 'rgba(30, 122, 67, 0.15)',
  badgeSuccess: 'rgba(16, 185, 129, 0.15)',
  badgeWarning: 'rgba(245, 158, 11, 0.15)',
  badgeError: 'rgba(239, 68, 68, 0.15)',
  badgeInfo: 'rgba(59, 130, 246, 0.15)',

  // Badge text colors
  badgePrimaryText: '#1E7A43',
  badgeSuccessText: '#10B981',
  badgeWarningText: '#F59E0B',
  badgeErrorText: '#EF4444',
  badgeInfoText: '#3B82F6',

  // Task Status Badge Colors
  badgeTodo: 'rgba(107, 114, 128, 0.15)',      // Gray background
  badgeTodoText: '#4B5563',                     // Gray text

  badgeInProgress: 'rgba(59, 130, 246, 0.15)', // Blue background
  badgeInProgressText: '#2563EB',               // Darker blue text

  badgeReview: 'rgba(245, 158, 11, 0.15)',     // Amber background
  badgeReviewText: '#D97706',                   // Darker amber text

  badgeDone: 'rgba(16, 185, 129, 0.15)',       // Green background
  badgeDoneText: '#059669',                     // Darker green text

  // Project Status Badge Colors
  badgeActive: 'rgba(30, 122, 67, 0.15)',      // Primary green background
  badgeActiveText: '#1E7A43',                   // Primary green text

  badgeCompleted: 'rgba(16, 185, 129, 0.15)',  // Success green background
  badgeCompletedText: '#059669',                // Darker success green text

  badgeOnHold: 'rgba(245, 158, 11, 0.15)',     // Amber background
  badgeOnHoldText: '#D97706',                   // Darker amber text

  // Priority Badge Colors
  badgePriorityLow: 'rgba(16, 185, 129, 0.15)',    // Green background
  badgePriorityLowText: '#059669',                 // Darker green text

  badgePriorityMedium: 'rgba(245, 158, 11, 0.15)', // Amber background
  badgePriorityMediumText: '#D97706',              // Darker amber text

  badgePriorityHigh: 'rgba(239, 68, 68, 0.15)',    // Red background
  badgePriorityHighText: '#DC2626',                // Darker red text

  // Custom background overlays
  overlay: 'rgba(0, 0, 0, 0.5)',
  overlayLight: 'rgba(0, 0, 0, 0.25)',
  overlayDark: 'rgba(0, 0, 0, 0.75)',

  // Secondary backgrounds
  cardBackground: '#FAFBFC',
  cardBackgroundDark: '#1A2B23',
  shimmerBase: 'rgba(30, 122, 67, 0.1)',
  shimmerHighlight: 'rgba(30, 122, 67, 0.2)',
};

export const gradients = {
  // Primary gradients — logo-derived greens
  primary: ['#1E7A43', '#0C5E2F'],
  primaryAlt: ['#789E67', '#1E7A43'],

  // Glass effect overlay
  glassLight: ['rgba(255, 255, 255, 0.25)', 'rgba(255, 255, 255, 0.15)'],
  glassDark: ['rgba(255, 255, 255, 0.1)', 'rgba(255, 255, 255, 0.05)'],

  // Background gradients
  bgLight: ['#FFFFFF', '#F4FAF6'],
  bgDark: ['#122B1A', '#0A1F0F'],

  // Status gradients
  success: ['#10B981', '#059669'],
  warning: ['#F59E0B', '#D97706'],
  error: ['#EF4444', '#DC2626'],
  info: ['#3B82F6', '#2563EB'],
};

export type ThemeColors = typeof colors;
export type Gradients = typeof gradients;
