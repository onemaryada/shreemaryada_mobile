// Environment configuration
export const Environment = {
  // App Info
  APP_NAME: 'ShreeMaryda',
  APP_VERSION: '1.0.0',

  // Firebase Configuration (loaded from .env)
  FIREBASE: {
    apiKey: process.env.FIREBASE_API_KEY || '',
    authDomain: process.env.FIREBASE_AUTH_DOMAIN || '',
    projectId: process.env.FIREBASE_PROJECT_ID || '',
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET || '',
    messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID || '',
    appId: process.env.FIREBASE_APP_ID || '',
  },

  // Google Sign-In Configuration
  GOOGLE_SIGNIN: {
    webClientId: '270903898759-jgq4j5it1bmbb4avmod5oigs3u8ejstq.apps.googleusercontent.com',
    iosClientId: process.env.GOOGLE_IOS_CLIENT_ID || '',
    androidClientId: process.env.GOOGLE_ANDROID_CLIENT_ID || '',
  },

  // Feature Flags
  FEATURES: {
    ENABLE_ANALYTICS: __DEV__ === false,
    ENABLE_CRASH_REPORTING: __DEV__ === false,
    ENABLE_PERFORMANCE_MONITORING: __DEV__ === false,
  },

  // API Configuration
  API: {
    TIMEOUT: 30000, // 30 seconds
    RETRY_ATTEMPTS: 3,
    RETRY_DELAY: 1000, // 1 second
  },

  // Storage Configuration
  STORAGE: {
    KEY_PREFIX: '@shreemaryda:',
  },

  // Animation Configuration
  ANIMATION: {
    ENABLE_ANIMATIONS: true,
    REDUCED_MOTION: false,
  },

  // Development/Production specific settings
  isDevelopment: __DEV__,
  isProduction: !__DEV__,

  // Get Firebase config as object (for easier Firebase initialization)
  getFirebaseConfig() {
    return {
      apiKey: this.FIREBASE.apiKey,
      authDomain: this.FIREBASE.authDomain,
      projectId: this.FIREBASE.projectId,
      storageBucket: this.FIREBASE.storageBucket,
      messagingSenderId: this.FIREBASE.messagingSenderId,
      appId: this.FIREBASE.appId,
    };
  },
};

// Validate required environment variables
export const validateEnvironment = (): boolean => {
  if (__DEV__) {
    return true; // Skip validation in development
  }

  const requiredVars = [
    Environment.FIREBASE.projectId,
    Environment.GOOGLE_SIGNIN.webClientId,
  ];

  return requiredVars.every(variable => variable && variable.length > 0);
};
