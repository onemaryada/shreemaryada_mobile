export type RootStackParamList = {
  Onboarding: undefined;
  Auth: undefined; // AuthStack
  Main: undefined; // MainTabs
};

// We will expand these in the respective modules
export type AuthStackParamList = {
  Login: undefined;
  Signup: { 
    googleIdToken?: string; 
    googleAccessToken?: string; 
    email?: string; 
    fullName?: string;
  } | undefined;
};

export type MainTabParamList = {
  Home: undefined;
  Projects: undefined;
  Tasks: undefined;
  Profile: undefined;
};
