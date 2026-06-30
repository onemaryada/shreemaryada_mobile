import React, { useEffect, useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Alert, BackHandler } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useFocusEffect } from '@react-navigation/native';
import { AuthStackParamList } from '../../core/navigation/types';
import { ScreenWrapper, Text, Input, Button, PolicyModal } from '../../shared/components';
import { theme } from '../../core/theme';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema, LoginFormData } from './schemas';
import auth from '@react-native-firebase/auth';
import { firebaseAuth, firebaseFirestore, COLLECTIONS } from '../../core/firebase';
import { getFirebaseErrorMessage } from '../../core/firebase/errors';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { PRIVACY_POLICY, TERMS_AND_CONDITIONS } from '../../core/policies/constants';

type Props = NativeStackScreenProps<AuthStackParamList, 'Login'>;

export const LoginScreen: React.FC<Props> = ({ navigation }) => {
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [serverError, setServerError] = useState('');
  const [showPrivacyPolicy, setShowPrivacyPolicy] = useState(false);
  const [showTerms, setShowTerms] = useState(false);

  const { control, handleSubmit, formState: { errors } } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        BackHandler.exitApp();
        return true;
      };

      const subscription = BackHandler.addEventListener('hardwareBackPress', onBackPress);

      return () => subscription.remove();
    }, [])
  );

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
    setServerError('');
    try {
      const userCredential = await firebaseAuth.signInWithEmailAndPassword(data.email, data.password);
      
      // Wait for Firebase Auth token to propagate to Firestore before querying
      await new Promise(resolve => setTimeout(resolve, 800));

      // Check if profile exists
      let profileExists = true;
      try {
        const userDoc = await firebaseFirestore.collection('users').doc(userCredential.user.uid).get();
        profileExists = userDoc.exists;
      } catch (err: any) {
        if (err.code === 'firestore/permission-denied' || err.message?.includes('permission')) {
          profileExists = false;
        } else {
          throw err;
        }
      }

      if (!profileExists) {
        navigation.replace('Signup', {
          email: userCredential.user.email || undefined,
          fullName: userCredential.user.displayName || undefined,
        });
      }
      // Navigation will be handled by the auth state listener in RootNavigator
    } catch (error: any) {
      setServerError(getFirebaseErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  const onGoogleButtonPress = async () => {
    setGoogleLoading(true);
    setServerError('');
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
      const response = await GoogleSignin.signIn();

      if (response.type === 'cancelled' || response.type === 'noSavedCredentialFound') {
        return; // User cancelled the flow, exit gracefully
      }

      const idToken = response.data?.idToken;

      // Get the access token required by recent Firebase SDKs
      const { accessToken } = await GoogleSignin.getTokens();

      if (!idToken) {
        throw new Error('No ID token found');
      }

      // Create a Google credential with both tokens
      const googleCredential = auth.GoogleAuthProvider.credential(idToken, accessToken);

      // Sign-in the user with the credential
      const userCredential = await firebaseAuth.signInWithCredential(googleCredential);

      // If this is a brand new user, we can immediately redirect them to Signup
      if (userCredential.additionalUserInfo?.isNewUser) {
        navigation.replace('Signup', {
          email: userCredential.user.email || undefined,
          fullName: userCredential.user.displayName || undefined,
          googleIdToken: 'already_authenticated'
        });
        return;
      }

      // Wait for Firebase Auth token to propagate to Firestore before querying
      await new Promise(resolve => setTimeout(resolve, 800));

      // Check if profile exists
      let profileExists = true;
      try {
        const userDoc = await firebaseFirestore.collection('users').doc(userCredential.user.uid).get();
        profileExists = userDoc.exists;
      } catch (err: any) {
        if (err.code === 'firestore/permission-denied' || err.message?.includes('permission')) {
          profileExists = false;
        } else {
          throw err;
        }
      }

      if (!profileExists) {
        navigation.replace('Signup', {
          email: userCredential.user.email || undefined,
          fullName: userCredential.user.displayName || undefined,
          googleIdToken: 'already_authenticated'
        });
      }
    } catch (error: any) {
      console.log(error);
      setServerError(getFirebaseErrorMessage(error));
    } finally {
      setGoogleLoading(false);
    }
  };

  const onGuestLogin = async () => {
    setServerError('');
    try {
      await firebaseAuth.signInAnonymously();
      // Navigation will be handled by RootNavigator detecting anonymous user
    } catch (error: any) {
      setServerError(getFirebaseErrorMessage(error));
    }
  };


  return (
    <ScreenWrapper
      keyboardAvoiding
      scrollable
      showGradient
      gradientColors={['#FFFFFF', theme.colors.primaryLight]}
    >
      <View style={styles.header}>
        <Text variant="h1" style={styles.title}>Welcome Back</Text>
        <Text variant="body" color={theme.colors.textSecondary}>
          Sign in to continue to Shree Maryada PMS
        </Text>
      </View>

      {!!serverError && (
        <View style={styles.errorBanner}>
          <Text variant="caption" color={theme.colors.error} align="center">
            {serverError}
          </Text>
        </View>
      )}

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
              editable={!loading && !googleLoading}
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
              isPassword
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              error={errors.password?.message}
              editable={!loading && !googleLoading}
            />
          )}
        />



        <Button
          title="Sign In"
          onPress={handleSubmit(onSubmit)}
          loading={loading}
          fullWidth
          disabled={loading || googleLoading}
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
          disabled={loading || googleLoading}
        />

        <Button
          title="Continue as Guest"
          onPress={onGuestLogin}
          variant="secondary"
          fullWidth
          disabled={loading || googleLoading}
          style={{ marginTop: theme.spacing.md }}
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

      {/* Policy Links Footer */}
      <View style={styles.policyFooter}>
        <TouchableOpacity onPress={() => setShowPrivacyPolicy(true)} style={styles.policyLink}>
          <Text variant="caption" color={theme.colors.primary}>
            Privacy Policy
          </Text>
        </TouchableOpacity>
        <Text variant="caption" color={theme.colors.textSecondary}>
          {' • '}
        </Text>
        <TouchableOpacity onPress={() => setShowTerms(true)} style={styles.policyLink}>
          <Text variant="caption" color={theme.colors.primary}>
            Terms & Conditions
          </Text>
        </TouchableOpacity>
      </View>

      {/* Policy Modals */}
      <PolicyModal
        visible={showPrivacyPolicy}
        onClose={() => setShowPrivacyPolicy(false)}
        title="Privacy Policy"
        content={PRIVACY_POLICY}
      />
      <PolicyModal
        visible={showTerms}
        onClose={() => setShowTerms(false)}
        title="Terms & Conditions"
        content={TERMS_AND_CONDITIONS}
      />
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  header: {
    marginTop: theme.spacing.xxl,
    marginBottom: theme.spacing.xl,
  },
  errorBanner: {
    backgroundColor: `${theme.colors.error}15`,
    padding: theme.spacing.md,
    borderRadius: theme.radius.md,
    marginBottom: theme.spacing.xl,
    borderWidth: 1,
    borderColor: `${theme.colors.error}50`,
  },
  title: {
    marginBottom: theme.spacing.sm,
  },
  form: {
    width: '100%',
  },
  signupContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: theme.spacing.xl
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: theme.spacing.xl,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: theme.colors.border,
  },
  dividerText: {
    marginHorizontal: theme.spacing.md,
  },
  policyFooter: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: theme.spacing.lg,
    paddingHorizontal: theme.spacing.md,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
    marginTop: theme.spacing.lg,
  },
  policyLink: {
    paddingHorizontal: theme.spacing.xs,
  },
});
