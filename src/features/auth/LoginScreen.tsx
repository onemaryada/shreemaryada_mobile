import React, { useEffect, useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../../core/navigation/types';
import { Container, Text, Input, Button } from '../../shared/components';
import { theme } from '../../core/theme';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema, LoginFormData } from './schemas';
import auth from '@react-native-firebase/auth';
import { firebaseAuth, firebaseFirestore, COLLECTIONS } from '../../core/firebase';
import { GoogleSignin } from '@react-native-google-signin/google-signin';

type Props = NativeStackScreenProps<AuthStackParamList, 'Login'>;

export const LoginScreen: React.FC<Props> = ({ navigation }) => {
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const { control, handleSubmit, formState: { errors } } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  useEffect(() => {
    // If the user is on the Login Screen but is already authenticated,
    // it means RootNavigator blocked them because they don't have a profile.
    const user = firebaseAuth.currentUser;
    if (user) {
      navigation.replace('Signup', {
        email: user.email || undefined,
        fullName: user.displayName || undefined,
        googleIdToken: 'already_authenticated' // flag to indicate google signup
      });
    }
  }, []);

  const onSubmit = async (data: LoginFormData) => {
    setLoading(true);
    try {
      await firebaseAuth.signInWithEmailAndPassword(data.email, data.password);
      // Navigation will be handled by the auth state listener in RootNavigator
    } catch (error: any) {
      Alert.alert('Login Failed', error.message || 'An error occurred during login.');
    } finally {
      setLoading(false);
    }
  };

  const onGoogleButtonPress = async () => {
    setGoogleLoading(true);
    try {
      // Check if device supports Google Play
      await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
      
      // Force account picker by signing out first
      try {
        await GoogleSignin.signOut();
      } catch (e) {
        // Ignore if not signed in
      }

      // Get the users ID token
      const { data } = await GoogleSignin.signIn();
      const idToken = data?.idToken;
      
      // Get the access token required by recent Firebase SDKs
      const { accessToken } = await GoogleSignin.getTokens();

      if (!idToken) {
        throw new Error('No ID token found');
      }

      // Create a Google credential with both tokens
      const googleCredential = auth.GoogleAuthProvider.credential(idToken, accessToken);

      // Sign-in the user with the credential
      await firebaseAuth.signInWithCredential(googleCredential);
      
      // The RootNavigator will take over, check profile, and if missing, remount this screen
      // which will trigger the useEffect above to navigate to Signup.
    } catch (error: any) {
      console.log(error);
      Alert.alert('Google Sign-In Failed', error.message || 'An error occurred.');
    } finally {
      setGoogleLoading(false);
    }
  };


  return (
    <Container safeArea padding center={false}>
      <View style={styles.header}>
        <Text variant="h1" style={styles.title}>Welcome Back</Text>
        <Text variant="body" color={theme.colors.textSecondary}>
          Sign in to continue to Shree Maryada EMS
        </Text>
      </View>

      <View style={styles.form}>
        <Controller
          control={control}
          name="email"
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              label="Email Address"
              placeholder="Enter your email"
              keyboardType="email-address"
              autoCapitalize="none"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              error={errors.email?.message}
            />
          )}
        />

        <Controller
          control={control}
          name="password"
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              label="Password"
              placeholder="Enter your password"
              secureTextEntry
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              error={errors.password?.message}
            />
          )}
        />



        <Button
          title="Sign In"
          onPress={handleSubmit(onSubmit)}
          loading={loading}
          fullWidth
          style={styles.loginButton}
        />

        <View style={styles.dividerContainer}>
          <View style={styles.divider} />
          <Text variant="caption" color={theme.colors.textSecondary} style={styles.dividerText}>OR</Text>
          <View style={styles.divider} />
        </View>

        <Button
          title="Continue with Google"
          onPress={onGoogleButtonPress}
          loading={googleLoading}
          variant="outline"
          fullWidth
          style={styles.googleButton}
        />

        <View style={styles.signupContainer}>
          <Text variant="body" color={theme.colors.textSecondary}>
            Don't have an account?{' '}
          </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
            <Text variant="body" color={theme.colors.primary} weight="bold">
              Sign Up
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Container>
  );
};

const styles = StyleSheet.create({
  header: {
    marginTop: theme.spacing.xxl,
    marginBottom: theme.spacing.xl,
  },
  title: {
    marginBottom: theme.spacing.sm,
  },
  form: {
    width: '100%',
  },

  loginButton: {
    marginBottom: theme.spacing.xl,
  },
  signupContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.xl,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: theme.colors.border,
  },
  dividerText: {
    marginHorizontal: theme.spacing.md,
  },
  googleButton: {
    marginBottom: theme.spacing.xl,
  },
});
