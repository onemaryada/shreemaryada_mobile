import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Image } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ProfileStackParamList } from '../ProfileNavigator';
import { Container, Text, Button } from '../../../shared/components';
import { theme } from '../../../core/theme';
import { firebaseAuth, firebaseFirestore, COLLECTIONS } from '../../../core/firebase';
import Icon from 'react-native-vector-icons/Feather';

type Props = NativeStackScreenProps<ProfileStackParamList, 'Profile'>;

export const ProfileScreen: React.FC<Props> = ({ navigation }) => {
  const [profileData, setProfileData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      const user = firebaseAuth.currentUser;
      if (user) {
        const doc = await firebaseFirestore.collection(COLLECTIONS.USERS).doc(user.uid).get();
        if (doc.exists) {
          setProfileData(doc.data());
        }
      }
      setLoading(false);
    };

    fetchProfile();
  }, []);

  const handleLogout = async () => {
    await firebaseAuth.signOut();
  };

  if (loading) {
    return (
      <Container center>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </Container>
    );
  }

  return (
    <Container safeArea padding={false}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text variant="h1">Profile</Text>
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
          <Button title="Logout" variant="outline" onPress={handleLogout} />
        </View>
      </ScrollView>
    </Container>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: theme.spacing.lg,
  },
  avatarSection: {
    alignItems: 'center',
    paddingVertical: theme.spacing.xl,
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
    paddingBottom: theme.spacing.xxxl,
  },
});
