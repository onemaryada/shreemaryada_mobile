import React, { useEffect, useState } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import BootSplash from 'react-native-bootsplash';
import { RootStackParamList } from './types';
import { storage, STORAGE_KEYS } from '../storage/mmkv';
import { View, Text, ActivityIndicator } from 'react-native';
import { OnboardingScreen } from '../../features/onboarding';
import { AuthNavigator } from '../../features/auth';
import { MainNavigator } from './MainNavigator';
import { firebaseAuth, firebaseFirestore } from '../firebase';
import { FirebaseAuthTypes } from '@react-native-firebase/auth';

const Stack = createNativeStackNavigator<RootStackParamList>();

export const RootNavigator = () => {
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState<FirebaseAuthTypes.User | null>(null);
  const [hasProfile, setHasProfile] = useState<boolean>(false);
  const [checkingProfile, setCheckingProfile] = useState<boolean>(true);

  // Handle user state changes
  useEffect(() => {
    let unsubscribeSnapshot: (() => void) | undefined;

    const unsubscribeAuth = firebaseAuth.onAuthStateChanged((authUser) => {
      if (authUser) {
        setUser(authUser);
        // Listen to the user's document in real-time
        unsubscribeSnapshot = firebaseFirestore
          .collection('users')
          .doc(authUser.uid)
          .onSnapshot(
            (doc) => {
              setHasProfile(doc.exists);
              setCheckingProfile(false);
            },
            (error) => {
              console.error("Error checking profile:", error);
              setHasProfile(false);
              setCheckingProfile(false);
            }
          );
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
      if (unsubscribeSnapshot) {
        unsubscribeSnapshot();
      }
    };
  }, [initializing]);

  useEffect(() => {
    const hideSplash = async () => {
      if (!initializing && !checkingProfile) {
        await BootSplash.hide({ fade: true });
      }
    };
    
    hideSplash();
  }, [initializing, checkingProfile]);

  // When auth state changes after initial load, we can programmatically navigate
  // but react-navigation handles it well if we just conditionally render the stack or let the initial route handle the first render.
  // Actually, standard pattern is conditional rendering of screens:
  
  // We wait for both auth state initialization and profile checking
  if (initializing || checkingProfile) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  const hasLaunched = storage.getBoolean(STORAGE_KEYS.HAS_LAUNCHED);

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!hasLaunched && !user ? (
          <Stack.Screen name="Onboarding" component={OnboardingScreen} />
        ) : null}
        
        {user && hasProfile ? (
          <Stack.Screen name="Main" component={MainNavigator} />
        ) : (
          <Stack.Screen name="Auth" component={AuthNavigator} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};
