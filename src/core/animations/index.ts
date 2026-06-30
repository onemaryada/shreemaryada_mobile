import { Easing } from 'react-native-reanimated';

export const AnimationConfig = {
  // Timing durations (in milliseconds)
  DURATION: {
    SHORT: 200,
    MEDIUM: 400,
    LONG: 600,
    EXTRA_LONG: 1000,
  },

  // Spring physics configurations
  SPRING: {
    // Standard spring for UI elements
    STANDARD: {
      damping: 10,
      mass: 1,
      overshootClamping: false,
    },
    // Bouncy spring for playful interactions
    BOUNCY: {
      damping: 6,
      mass: 1,
      overshootClamping: false,
    },
    // Stiff spring for snappy interactions
    STIFF: {
      damping: 15,
      mass: 1,
      overshootClamping: false,
    },
    // Heavy spring for slow animations
    HEAVY: {
      damping: 12,
      mass: 1.5,
      overshootClamping: false,
    },
  },

  // Easing functions
  EASING: {
    EASE_IN_OUT: Easing.inOut(Easing.ease),
    EASE_IN: Easing.in(Easing.ease),
    EASE_OUT: Easing.out(Easing.ease),
    LINEAR: Easing.linear,
    CUBIC_IN_OUT: Easing.inOut(Easing.cubic),
    QUAD_IN_OUT: Easing.inOut(Easing.quad),
  },

  // Preset animation delays (for staggering)
  DELAY: {
    NONE: 0,
    VERY_SHORT: 50,
    SHORT: 100,
    MEDIUM: 150,
    LONG: 200,
    EXTRA_LONG: 300,
  },
};

// Common animation timings
export const TIMINGS = {
  screen: {
    duration: AnimationConfig.DURATION.MEDIUM,
    easing: AnimationConfig.EASING.EASE_OUT,
  },
  modal: {
    duration: AnimationConfig.DURATION.MEDIUM,
    easing: AnimationConfig.EASING.EASE_IN_OUT,
  },
  listItem: {
    duration: AnimationConfig.DURATION.SHORT,
    easing: AnimationConfig.EASING.EASE_OUT,
  },
  button: {
    duration: AnimationConfig.DURATION.SHORT,
    easing: AnimationConfig.EASING.EASE_OUT,
  },
};
