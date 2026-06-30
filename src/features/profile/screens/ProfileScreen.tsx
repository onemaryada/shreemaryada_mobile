import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Image, Alert } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ProfileStackParamList } from '../ProfileNavigator';
import { ScreenWrapper, Text, Button } from '../../../shared/components';
import { theme } from '../../../core/theme';
import { firebaseAuth, firebaseFirestore, COLLECTIONS } from '../../../core/firebase';
import { getFirebaseErrorMessage } from '../../../core/firebase/errors';
import Icon from 'react-native-vector-icons/Feather';

type Props = NativeStackScreenProps<ProfileStackParamList, 'Profile'>;

export const ProfileScreen: React.FC<Props> = ({ navigation }) => {
  const [profileData, setProfileData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const isGuest = firebaseAuth.currentUser?.isAnonymous;

  useEffect(() => {
    const fetchProfile = async () => {
      const user = firebaseAuth.currentUser;
      if (user && !user.isAnonymous) {
        const doc = await firebaseFirestore.collection(COLLECTIONS.USERS).doc(user.uid).get();
        if (doc.exists) {
          setProfileData(doc.data());
        }
      } else if (user?.isAnonymous) {
        setProfileData({ fullName: 'Guest User', email: 'guest@local' });
      }
      setLoading(false);
    };

    fetchProfile();

    // Cleanup on unmount
    return () => {
      setProfileData(null);
    };
  }, []);

  useEffect(() => {
    const unsubscribe = navigation.addListener('beforeRemove', () => {
      // Clear profile data when leaving the screen
      setProfileData(null);
    });

    return unsubscribe;
  }, [navigation]);

  const handleLogout = async () => {
    try {
      const user = firebaseAuth.currentUser;
      // If user is anonymous (guest), delete the account from Firebase Auth
      if (user?.isAnonymous) {
        await user.delete();
        // user.delete() automatically signs out, so we're done
        return;
      }
      // For regular users, just sign out
      await firebaseAuth.signOut();
    } catch (error: any) {
      console.error('Logout error:', error);
      // Try to sign out anyway
      try {
        await firebaseAuth.signOut();
      } catch (e) {
        // Ignore if already signed out
      }
    }
  };

  const handleDeleteAccount = async () => {
    const user = firebaseAuth.currentUser;
    if (!user) return;

    Alert.alert(
      'Delete Account',
      'Are you sure you want to delete your account? All your data will be permanently removed. This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            setDeleting(true);
            // Clear profile data immediately to prevent stale data from showing
            setProfileData(null);
            try {
              // Delete user's projects and tasks
              const projectsSnapshot = await firebaseFirestore
                .collection(COLLECTIONS.PROJECTS)
                .where('ownerId', '==', user.uid)
                .get();

              for (const doc of projectsSnapshot.docs) {
                // Delete tasks related to this project
                const tasksSnapshot = await firebaseFirestore
                  .collection(COLLECTIONS.TASKS)
                  .where('projectId', '==', doc.id)
                  .get();

                for (const taskDoc of tasksSnapshot.docs) {
                  await taskDoc.ref.delete();
                }

                // Delete the project
                await doc.ref.delete();
              }

              // Delete Firestore user document
              await firebaseFirestore.collection(COLLECTIONS.USERS).doc(user.uid).delete();

              // Small delay to ensure Firestore operations complete
              await new Promise(resolve => setTimeout(resolve, 500));

              // Delete Firebase Auth account
              await user.delete();

              // Explicitly sign out to ensure proper cleanup
              await firebaseAuth.signOut();
            } catch (error: any) {
              Alert.alert('Error', getFirebaseErrorMessage(error));
              setProfileData(null);
              setDeleting(false);
            }
          },
        },
      ]
    );
  };

  if (loading) {
    return (
      <ScreenWrapper safeArea>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
        </View>
      </ScreenWrapper>
    );
  }

  return (
    <ScreenWrapper safeArea paddingHorizontal={false} scrollable={true} >
      <View style={styles.header}>
        <Text variant="h2" style={styles.title}>Profile</Text>
        <Text variant="body" color={theme.colors.textSecondary}>Manage your account and settings</Text>
      </View>

      <View style={styles.avatarSection}>
        <View style={styles.avatarPlaceholder}>
          {profileData?.photoURL ? (
            <Image source={{ uri: profileData.photoURL }} style={styles.avatarImage} />
          ) : (
            <Text variant="h1" color={theme.colors.white}>
              {profileData?.fullName?.charAt(0) || 'U'}
            </Text>
          )}
        </View>
        <Text variant="h2" style={styles.name}>{profileData?.fullName || 'User Name'}</Text>
        <Text variant="body" color={theme.colors.textSecondary}>{profileData?.designation || 'Designation'}</Text>
      </View>

      <View style={styles.infoSection}>
        <Text variant="h3" style={styles.sectionTitle}>Personal Information</Text>
        <InfoRow icon="mail" label="Email" value={profileData?.email || firebaseAuth.currentUser?.email} />
        <InfoRow icon="phone" label="Phone" value={profileData?.phone || 'Not set'} />
        <InfoRow icon="map-pin" label="Address" value={profileData?.address || 'Not set'} />
        <InfoRow icon="calendar" label="Date of Birth" value={profileData?.dob || 'Not set'} />
      </View>

      <View style={styles.infoSection}>
        <Text variant="h3" style={styles.sectionTitle}>Employment Details</Text>
        <InfoRow icon="briefcase" label="Employee ID" value={profileData?.employeeId || 'Not set'} />
        <InfoRow icon="users" label="Department" value={profileData?.department || 'Not set'} />
        <InfoRow icon="calendar" label="Joining Date" value={profileData?.joiningDate || 'Not set'} />
      </View>

      <View style={styles.infoSection}>
        <Text variant="h3" style={styles.sectionTitle}>Banking Details</Text>
        <InfoRow icon="credit-card" label="Bank Name" value={profileData?.bankName || 'Not set'} />
        <InfoRow icon="hash" label="Account Number" value={profileData?.accountNumber ? `••••${profileData.accountNumber.slice(-4)}` : 'Not set'} />
      </View>

      <View style={styles.logoutSection}>
        <Button
          title="Logout"
          variant="outline"
          onPress={handleLogout}
          disabled={deleting}
          fullWidth
        />
        {!isGuest && (
          <View style={{ marginTop: theme.spacing.md }}>
            <Button
              title="Delete Account"
              variant="outline"
              onPress={handleDeleteAccount}
              disabled={deleting}
              loading={deleting}
              fullWidth
            />
          </View>
        )}
      </View>
    </ScreenWrapper>
  );
};

const InfoRow = ({ icon, label, value }: { icon: string; label: string; value: string }) => (
  <View style={styles.infoRow}>
    <Icon name={icon} size={20} color={theme.colors.textSecondary} style={styles.infoIcon} />
    <View>
      <Text variant="caption" color={theme.colors.textSecondary}>{label}</Text>
      <Text variant="body" weight="medium">{value}</Text>
    </View>
  </View>
);

const styles = StyleSheet.create({
  header: {
    marginTop: theme.spacing.xxl,
    marginBottom: theme.spacing.xl,
    paddingHorizontal: theme.spacing.lg,
  },
  title: {
    // marginBottom: theme.spacing.sm,
  },
  avatarSection: {
    alignItems: 'center',
    paddingBottom: theme.spacing.xl,
    paddingTop: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  avatarPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
    overflow: 'hidden',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
  },
  name: {
    marginBottom: theme.spacing.xs,
  },
  infoSection: {
    padding: theme.spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  sectionTitle: {
    marginBottom: theme.spacing.md,
    color: theme.colors.primary,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  infoIcon: {
    marginRight: theme.spacing.md,
    width: 24,
    textAlign: 'center',
  },
  logoutSection: {
    padding: theme.spacing.xl,
    // paddingBottom: theme.spacing.xxxl,
  },
});
