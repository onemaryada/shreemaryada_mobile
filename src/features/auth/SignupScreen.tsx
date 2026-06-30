import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Alert, BackHandler, Platform } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useFocusEffect } from '@react-navigation/native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { format } from 'date-fns';
import { AuthStackParamList } from '../../core/navigation/types';
import { ScreenWrapper, Text, Input, Button, PolicyModal } from '../../shared/components';
import { theme } from '../../core/theme';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { signupSchema, SignupFormData } from './schemas';
import { firebaseAuth, firebaseFirestore, COLLECTIONS } from '../../core/firebase';
import { getFirebaseErrorMessage } from '../../core/firebase/errors';
import { PRIVACY_POLICY, TERMS_AND_CONDITIONS } from '../../core/policies/constants';
import Icon from 'react-native-vector-icons/Feather';

import auth from '@react-native-firebase/auth';

type Props = NativeStackScreenProps<AuthStackParamList, 'Signup'>;

export const SignupScreen: React.FC<Props> = ({ route, navigation }) => {
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState('');
  const [showDobPicker, setShowDobPicker] = useState(false);
  const [showJoiningPicker, setShowJoiningPicker] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [privacyAccepted, setPrivacyAccepted] = useState(false);
  const [showPrivacyPolicy, setShowPrivacyPolicy] = useState(false);
  const [showTerms, setShowTerms] = useState(false);
  const params = route.params;
  const isGoogleSignup = !!params?.googleIdToken;

  const { control, handleSubmit, formState: { errors } } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      fullName: params?.fullName || '',
      email: params?.email || '',
      password: '',
      phone: '',
      address: '',
      gender: 'Male',
      dob: '',
      department: '',
      designation: '',
      role: 'Employee',
      status: 'Active',
      employeeId: '',
      joiningDate: '',
      bankName: '',
      accountHolder: '',
      ifsc: '',
      accountNumber: '',
      accountType: 'Savings',
      branch: '',
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

  const onSubmit = async (data: SignupFormData) => {
    if (!termsAccepted || !privacyAccepted) {
      setServerError('You must accept both Privacy Policy and Terms & Conditions to proceed');
      return;
    }

    setLoading(true);
    setServerError('');
    try {
      let uid = firebaseAuth.currentUser?.uid;

      if (!uid) {
        // 1. Create Auth User with Email/Password
        const userCredential = await firebaseAuth.createUserWithEmailAndPassword(data.email, data.password || '');
        uid = userCredential.user.uid;
      }

      // 2. Remove password from data before saving to Firestore
      const { password, ...profileData } = data;

      // 3. Save to Firestore
      await firebaseFirestore.collection(COLLECTIONS.USERS).doc(uid).set({
        ...profileData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });

      // 4. Trigger RootNavigator to re-evaluate hasProfile by updating the auth profile
      await firebaseAuth.currentUser?.updateProfile({
        displayName: profileData.fullName,
      });

      // Navigation will be handled by RootNavigator reacting to the profile update
    } catch (error: any) {
      setServerError(getFirebaseErrorMessage(error));
    } finally {
      setLoading(false);
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
        <Text variant="h1" style={styles.title}>Create Account</Text>
        <Text variant="body" color={theme.colors.textSecondary}>
          Fill in your details to join Shree Maryada PMS
        </Text>
      </View>

      {!!serverError && (
        <View style={styles.errorBanner}>
          <Text variant="caption" color={theme.colors.error} align="center">
            {serverError}
          </Text>
        </View>
      )}

      <View style={styles.formSection}>
        <Text variant="h3" style={styles.sectionTitle}>Personal Details</Text>
        <Controller control={control} name="fullName" render={({ field: { onChange, value } }) => (
          <Input label="Full Name" placeholder="John Doe" onChangeText={onChange} value={value} error={errors.fullName?.message} editable={!loading} />
        )} />
        <Controller control={control} name="email" render={({ field: { onChange, value } }) => (
          <Input label="Email Address" placeholder="john@example.com" keyboardType="email-address" autoCapitalize="none" onChangeText={onChange} value={value} error={errors.email?.message} editable={!isGoogleSignup && !loading} />
        )} />
        {!isGoogleSignup && (
          <Controller control={control} name="password" render={({ field: { onChange, value } }) => (
            <Input label="Password" placeholder="Create a strong password" isPassword onChangeText={onChange} value={value} error={errors.password?.message} editable={!loading} />
          )} />
        )}
        <Controller control={control} name="phone" render={({ field: { onChange, value } }) => (
          <Input label="Phone Number" placeholder="+1234567890" keyboardType="phone-pad" onChangeText={onChange} value={value} error={errors.phone?.message} editable={!loading} />
        )} />
        <Controller control={control} name="address" render={({ field: { onChange, value } }) => (
          <Input label="Address" placeholder="Full residential address" multiline onChangeText={onChange} value={value} error={errors.address?.message} editable={!loading} />
        )} />
        <Controller control={control} name="dob" render={({ field: { onChange, value } }) => (
          <View>
            <TouchableOpacity onPress={() => !loading && setShowDobPicker(true)}>
              <View pointerEvents="none">
                <Input label="Date of Birth" placeholder="YYYY-MM-DD" onChangeText={onChange} value={value} error={errors.dob?.message} editable={!loading} />
              </View>
            </TouchableOpacity>
            {showDobPicker && (
              <DateTimePicker
                value={value ? new Date(value) : new Date(2000, 0, 1)}
                mode="date"
                display="default"
                onChange={(event, selectedDate) => {
                  setShowDobPicker(Platform.OS === 'ios');
                  if (selectedDate) onChange(format(selectedDate, 'yyyy-MM-dd'));
                }}
              />
            )}
          </View>
        )} />
      </View>

      <View style={styles.formSection}>
        <Text variant="h3" style={styles.sectionTitle}>Employment Details</Text>
        <Controller control={control} name="employeeId" render={({ field: { onChange, value } }) => (
          <Input label="Employee ID" placeholder="EMP-001" onChangeText={onChange} value={value} error={errors.employeeId?.message} editable={!loading} />
        )} />
        <Controller control={control} name="department" render={({ field: { onChange, value } }) => (
          <Input label="Department" placeholder="e.g. Engineering" onChangeText={onChange} value={value} error={errors.department?.message} editable={!loading} />
        )} />
        <Controller control={control} name="designation" render={({ field: { onChange, value } }) => (
          <Input label="Designation" placeholder="e.g. Senior Developer" onChangeText={onChange} value={value} error={errors.designation?.message} editable={!loading} />
        )} />
        <Controller control={control} name="joiningDate" render={({ field: { onChange, value } }) => (
          <View>
            <TouchableOpacity onPress={() => !loading && setShowJoiningPicker(true)}>
              <View pointerEvents="none">
                <Input label="Joining Date" placeholder="YYYY-MM-DD" onChangeText={onChange} value={value} error={errors.joiningDate?.message} editable={!loading} />
              </View>
            </TouchableOpacity>
            {showJoiningPicker && (
              <DateTimePicker
                value={value ? new Date(value) : new Date()}
                mode="date"
                display="default"
                onChange={(event, selectedDate) => {
                  setShowJoiningPicker(Platform.OS === 'ios');
                  if (selectedDate) onChange(format(selectedDate, 'yyyy-MM-dd'));
                }}
              />
            )}
          </View>
        )} />
      </View>

      <View style={styles.formSection}>
        <Text variant="h3" style={styles.sectionTitle}>Banking Details</Text>
        <Controller control={control} name="bankName" render={({ field: { onChange, value } }) => (
          <Input label="Bank Name" placeholder="e.g. HDFC Bank" onChangeText={onChange} value={value} error={errors.bankName?.message} editable={!loading} />
        )} />
        <Controller control={control} name="accountHolder" render={({ field: { onChange, value } }) => (
          <Input label="Account Holder Name" placeholder="John Doe" onChangeText={onChange} value={value} error={errors.accountHolder?.message} editable={!loading} />
        )} />
        <Controller control={control} name="accountNumber" render={({ field: { onChange, value } }) => (
          <Input label="Account Number" placeholder="Enter account number" keyboardType="numeric" onChangeText={onChange} value={value} error={errors.accountNumber?.message} editable={!loading} />
        )} />
        <Controller control={control} name="ifsc" render={({ field: { onChange, value } }) => (
          <Input label="IFSC Code" placeholder="Enter IFSC" autoCapitalize="characters" onChangeText={onChange} value={value} error={errors.ifsc?.message} editable={!loading} />
        )} />
        <Controller control={control} name="branch" render={({ field: { onChange, value } }) => (
          <Input label="Branch Name" placeholder="e.g. Main Branch" onChangeText={onChange} value={value} error={errors.branch?.message} editable={!loading} />
        )} />
      </View>

      {/* Policy Acceptance */}
      <View style={styles.policySection}>
        <TouchableOpacity
          style={styles.checkboxRow}
          onPress={() => setPrivacyAccepted(!privacyAccepted)}
          disabled={loading}
        >
          <View style={[styles.checkbox, privacyAccepted && styles.checkboxChecked]}>
            {privacyAccepted && (
              <Icon name="check" size={16} color={theme.colors.white} />
            )}
          </View>
          <View style={styles.checkboxText}>
            <Text variant="caption" color={theme.colors.textSecondary}>
              I agree to the{' '}
            </Text>
            <TouchableOpacity onPress={() => setShowPrivacyPolicy(true)} disabled={loading}>
              <Text variant="caption" color={theme.colors.primary} weight="bold">
                Privacy Policy
              </Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.checkboxRow}
          onPress={() => setTermsAccepted(!termsAccepted)}
          disabled={loading}
        >
          <View style={[styles.checkbox, termsAccepted && styles.checkboxChecked]}>
            {termsAccepted && (
              <Icon name="check" size={16} color={theme.colors.white} />
            )}
          </View>
          <View style={styles.checkboxText}>
            <Text variant="caption" color={theme.colors.textSecondary}>
              I agree to the{' '}
            </Text>
            <TouchableOpacity onPress={() => setShowTerms(true)} disabled={loading}>
              <Text variant="caption" color={theme.colors.primary} weight="bold">
                Terms & Conditions
              </Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </View>

      <Button
        title="Create Account"
        onPress={handleSubmit(onSubmit)}
        loading={loading}
        fullWidth
        disabled={loading || !termsAccepted || !privacyAccepted}
      />

      <View style={styles.loginContainer}>
        <Text variant="body" color={theme.colors.textSecondary}>
          Already have an account?{' '}
        </Text>
        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
          <Text variant="body" color={theme.colors.primary} weight="bold">
            Login
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
  keyboardView: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  scrollContent: {
    flexGrow: 1,
  },
  container: {
    padding: theme.spacing.lg,
  },
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
  formSection: {
    // marginBottom: theme.spacing.xl,
  },
  sectionTitle: {
    marginBottom: theme.spacing.md,
    color: theme.colors.primary,
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: theme.spacing.xl
  },
  policySection: {
    marginVertical: theme.spacing.lg,
    backgroundColor: `${theme.colors.primary}10`,
    padding: theme.spacing.md,
    borderRadius: theme.radius.md,
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: theme.spacing.md,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: theme.radius.sm,
    borderWidth: 2,
    borderColor: theme.colors.primary,
    marginRight: theme.spacing.md,
    marginTop: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  checkboxText: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
});
