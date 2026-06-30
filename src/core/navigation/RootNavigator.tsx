import React, { useEffect, useState } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import BootSplash from 'react-native-bootsplash';
import { RootStackParamList } from './types';
import { storage, STORAGE_KEYS } from '../storage/mmkv';
import { View } from 'react-native';
import { OnboardingScreen } from '../../features/onboarding';
import { SplashScreen } from '../../features/splash';
import { AuthNavigator } from '../../features/auth';
import { MainNavigator } from './MainNavigator';
import { firebaseAuth, firebaseFirestore } from '../firebase';
import { FirebaseAuthTypes } from '@react-native-firebase/auth';
import { AuthProvider } from '../auth/AuthContext';

const Stack = createNativeStackNavigator<RootStackParamList>();

export const RootNavigator = () => {
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState<FirebaseAuthTypes.User | null>(null);
  const [hasProfile, setHasProfile] = useState<boolean>(false);
  const [checkingProfile, setCheckingProfile] = useState<boolean>(true);
  const [showSplash, setShowSplash] = useState(true);

  // Handle user state changes
  useEffect(() => {
    let unsubscribeSnapshot: (() => void) | undefined;
    let timeoutId: NodeJS.Timeout;

    const unsubscribeAuth = firebaseAuth.onAuthStateChanged((authUser) => {
      if (authUser) {
        setUser(authUser);
        // Guest (anonymous) users can access the app without a profile
        if (authUser.isAnonymous) {
          setHasProfile(true);
          setCheckingProfile(false);
        } else {
          // Add a small delay to allow Firebase Auth token to propagate to Firestore
          // This prevents the "permission-denied" race condition on new logins
          timeoutId = setTimeout(() => {
            unsubscribeSnapshot = firebaseFirestore
              .collection('users')
              .doc(authUser.uid)
              .onSnapshot(
                (doc) => {
                  setHasProfile(doc.exists);
                  setCheckingProfile(false);
                },
                (error: any) => {
                  if (error.code === 'firestore/permission-denied') {
                    // Ignore this error, it happens during logout
                    setHasProfile(false);
                    setCheckingProfile(false);
                    return;
                  }
                  console.error('Error checking profile:', error);
                  setHasProfile(false);
                  setCheckingProfile(false);
                }
              );
          }, 800);
        }
      } else {
        setUser(null);
        setHasProfile(false);
        setCheckingProfile(false);
        if (unsubscribeSnapshot) {
          unsubscribeSnapshot();
        }
      }
      if (initializing) setInitializing(false);
    });

    return () => {
      unsubscribeAuth();
      if (timeoutId) clearTimeout(timeoutId);
      if (unsubscribeSnapshot) {
        unsubscribeSnapshot();
      }
    };
  }, [initializing]);

  useEffect(() => {
    const hideSplash = async () => {
      if (!initializing && !checkingProfile) {
        // Hide react-native-bootsplash
        await BootSplash.hide({ fade: true });
        // Keep custom splash for 2.5 seconds then hide
        setTimeout(() => {
          setShowSplash(false);
        }, 2500);
      }
    };

    hideSplash();
  }, [initializing, checkingProfile]);

  // Show custom splash screen
  if (showSplash) {
    return <SplashScreen />;
  }

  // Show loading while checking auth and profile
  if (initializing || checkingProfile) {
    return <View style={{ flex: 1 }} />;
  }

  const hasLaunched = storage.getBoolean(STORAGE_KEYS.HAS_LAUNCHED);
  const isLoading = initializing || checkingProfile;

  return (
    <AuthProvider user={user} isLoading={isLoading}>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          {!hasLaunched && !user ? (
            <Stack.Screen
              name="Onboarding"
              component={OnboardingScreen}
              options={{ animationEnabled: false }}
            />
          ) : null}

          {user && hasProfile ? (
            <Stack.Screen
              name="Main"
              component={MainNavigator}
              options={{ animationEnabled: false }}
            />
          ) : (
            <Stack.Screen
              name="Auth"
              component={AuthNavigator}
              options={{ animationEnabled: false }}
            />
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </AuthProvider>
  );
};
