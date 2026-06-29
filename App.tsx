import React, { useEffect } from 'react';
import { StyleSheet } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RootNavigator } from './src/core/navigation';
import { theme } from './src/core/theme';
import { GoogleSignin } from '@react-native-google-signin/google-signin';

const queryClient = new QueryClient();

export default function App() {
  useEffect(() => {
    GoogleSignin.configure({
      webClientId: '270903898759-jgq4j5it1bmbb4avmod5oigs3u8ejstq.apps.googleusercontent.com', // User needs to replace this
      offlineAccess: true,
    });
  }, []);

  return (
    <GestureHandlerRootView style={styles.container}>
      <SafeAreaProvider>
        <QueryClientProvider client={queryClient}>
          <RootNavigator />
        </QueryClientProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
});