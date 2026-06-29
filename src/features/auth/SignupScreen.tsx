import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Alert, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../../core/navigation/types';
import { Container, Text, Input, Button } from '../../shared/components';
import { theme } from '../../core/theme';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { signupSchema, SignupFormData } from './schemas';
import { firebaseAuth, firebaseFirestore, COLLECTIONS } from '../../core/firebase';

import auth from '@react-native-firebase/auth';

type Props = NativeStackScreenProps<AuthStackParamList, 'Signup'>;

export const SignupScreen: React.FC<Props> = ({ route, navigation }) => {
  const [loading, setLoading] = useState(false);
  const params = route.params;
  const isGoogleSignup = !!params?.googleIdToken;

  const { control, handleSubmit, formState: { errors } } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      fullName: params?.fullName || '',
      email: params?.email || '',
      gender: 'Male',
      role: 'Employee',
      status: 'Active',
      accountType: 'Savings',
    },
  });

  const onSubmit = async (data: SignupFormData) => {
    setLoading(true);
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
      Alert.alert('Registration Failed', error.message || 'An error occurred during registration.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      style={styles.keyboardView} 
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <Container safeArea padding={false} keyboardAvoiding={false} style={styles.container}>
          <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
              <Text variant="body" color={theme.colors.primary}>← Back</Text>
            </TouchableOpacity>
            <Text variant="h1" style={styles.title}>Create Account</Text>
            <Text variant="body" color={theme.colors.textSecondary}>
              Fill in your details to join Shree Maryada EMS
            </Text>
          </View>

          <View style={styles.formSection}>
            <Text variant="h3" style={styles.sectionTitle}>Personal Details</Text>
            <Controller control={control} name="fullName" render={({ field: { onChange, value } }) => (
              <Input label="Full Name" placeholder="John Doe" onChangeText={onChange} value={value} error={errors.fullName?.message} />
            )} />
            <Controller control={control} name="email" render={({ field: { onChange, value } }) => (
              <Input label="Email Address" placeholder="john@example.com" keyboardType="email-address" autoCapitalize="none" onChangeText={onChange} value={value} error={errors.email?.message} editable={!isGoogleSignup} />
            )} />
            {!isGoogleSignup && (
              <Controller control={control} name="password" render={({ field: { onChange, value } }) => (
                <Input label="Password" placeholder="Create a strong password" secureTextEntry onChangeText={onChange} value={value} error={errors.password?.message} />
              )} />
            )}
            <Controller control={control} name="phone" render={({ field: { onChange, value } }) => (
              <Input label="Phone Number" placeholder="+1234567890" keyboardType="phone-pad" onChangeText={onChange} value={value} error={errors.phone?.message} />
            )} />
            <Controller control={control} name="address" render={({ field: { onChange, value } }) => (
              <Input label="Address" placeholder="Full residential address" multiline onChangeText={onChange} value={value} error={errors.address?.message} />
            )} />
            <Controller control={control} name="dob" render={({ field: { onChange, value } }) => (
              <Input label="Date of Birth" placeholder="YYYY-MM-DD" onChangeText={onChange} value={value} error={errors.dob?.message} />
            )} />
          </View>

          <View style={styles.formSection}>
            <Text variant="h3" style={styles.sectionTitle}>Employment Details</Text>
            <Controller control={control} name="employeeId" render={({ field: { onChange, value } }) => (
              <Input label="Employee ID" placeholder="EMP-001" onChangeText={onChange} value={value} error={errors.employeeId?.message} />
            )} />
            <Controller control={control} name="department" render={({ field: { onChange, value } }) => (
              <Input label="Department" placeholder="e.g. Engineering" onChangeText={onChange} value={value} error={errors.department?.message} />
            )} />
            <Controller control={control} name="designation" render={({ field: { onChange, value } }) => (
              <Input label="Designation" placeholder="e.g. Senior Developer" onChangeText={onChange} value={value} error={errors.designation?.message} />
            )} />
            <Controller control={control} name="joiningDate" render={({ field: { onChange, value } }) => (
              <Input label="Joining Date" placeholder="YYYY-MM-DD" onChangeText={onChange} value={value} error={errors.joiningDate?.message} />
            )} />
          </View>

          <View style={styles.formSection}>
            <Text variant="h3" style={styles.sectionTitle}>Banking Details</Text>
            <Controller control={control} name="bankName" render={({ field: { onChange, value } }) => (
              <Input label="Bank Name" placeholder="e.g. HDFC Bank" onChangeText={onChange} value={value} error={errors.bankName?.message} />
            )} />
            <Controller control={control} name="accountHolder" render={({ field: { onChange, value } }) => (
              <Input label="Account Holder Name" placeholder="John Doe" onChangeText={onChange} value={value} error={errors.accountHolder?.message} />
            )} />
            <Controller control={control} name="accountNumber" render={({ field: { onChange, value } }) => (
              <Input label="Account Number" placeholder="Enter account number" keyboardType="numeric" onChangeText={onChange} value={value} error={errors.accountNumber?.message} />
            )} />
            <Controller control={control} name="ifsc" render={({ field: { onChange, value } }) => (
              <Input label="IFSC Code" placeholder="Enter IFSC" autoCapitalize="characters" onChangeText={onChange} value={value} error={errors.ifsc?.message} />
            )} />
            <Controller control={control} name="branch" render={({ field: { onChange, value } }) => (
              <Input label="Branch Name" placeholder="e.g. Main Branch" onChangeText={onChange} value={value} error={errors.branch?.message} />
            )} />
          </View>

          <Button
            title="Create Account"
            onPress={handleSubmit(onSubmit)}
            loading={loading}
            fullWidth
            style={styles.submitButton}
          />

        </Container>
      </ScrollView>
    </KeyboardAvoidingView>
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
    marginBottom: theme.spacing.xl,
    marginTop: theme.spacing.sm,
  },
  backButton: {
    marginBottom: theme.spacing.md,
  },
  title: {
    marginBottom: theme.spacing.sm,
  },
  formSection: {
    marginBottom: theme.spacing.xl,
  },
  sectionTitle: {
    marginBottom: theme.spacing.md,
    color: theme.colors.primary,
  },
  submitButton: {
    marginBottom: theme.spacing.xxl,
  },
});
