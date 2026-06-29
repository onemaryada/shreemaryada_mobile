import React, { useState } from 'react';
import { View, StyleSheet, Dimensions, ScrollView } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../core/navigation/types';
import { storage, STORAGE_KEYS } from '../../core/storage/mmkv';
import { Text, Button, Container } from '../../shared/components';
import { theme } from '../../core/theme';
import Icon from 'react-native-vector-icons/Feather';

type Props = NativeStackScreenProps<RootStackParamList, 'Onboarding'>;

const { width } = Dimensions.get('window');

const ONBOARDING_DATA = [
  {
    title: 'Manage Your Projects',
    description: 'Keep track of all your projects and deadlines in one centralized place with real-time updates.',
    icon: 'briefcase',
  },
  {
    title: 'Track Your Tasks',
    description: 'Break down projects into manageable tasks and subtasks. Never miss a detail.',
    icon: 'check-square',
  },
  {
    title: 'Collaborate Seamlessly',
    description: 'Work together with your team, share updates, and achieve your goals faster.',
    icon: 'users',
  },
];

export const OnboardingScreen: React.FC<Props> = ({ navigation }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleNext = () => {
    if (currentIndex < ONBOARDING_DATA.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      // Finish onboarding
      storage.set(STORAGE_KEYS.HAS_LAUNCHED, true);
      navigation.replace('Auth');
    }
  };

  const currentSlide = ONBOARDING_DATA[currentIndex];

  return (
    <Container safeArea center padding={false}>
      <View style={styles.topSection}>
        <View style={styles.iconContainer}>
          <Icon name={currentSlide.icon} size={80} color={theme.colors.primary} />
        </View>
      </View>
      
      <View style={styles.bottomSection}>
        <View style={styles.dotsContainer}>
          {ONBOARDING_DATA.map((_, index) => (
            <View
              key={index}
              style={[
                styles.dot,
                index === currentIndex && styles.activeDot
              ]}
            />
          ))}
        </View>

        <Text variant="h2" align="center" style={styles.title}>
          {currentSlide.title}
        </Text>
        <Text variant="body" color={theme.colors.textSecondary} align="center" style={styles.description}>
          {currentSlide.description}
        </Text>

        <Button
          title={currentIndex === ONBOARDING_DATA.length - 1 ? "Get Started" : "Next"}
          onPress={handleNext}
          fullWidth
          size="lg"
          style={styles.button}
        />
      </View>
    </Container>
  );
};

const styles = StyleSheet.create({
  topSection: {
    flex: 3,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.primaryLight,
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
  },
  iconContainer: {
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: theme.colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: theme.colors.black,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 5,
  },
  bottomSection: {
    flex: 2,
    width: '100%',
    padding: theme.spacing.xl,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  dotsContainer: {
    flexDirection: 'row',
    marginBottom: theme.spacing.xl,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: theme.colors.border,
    marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: theme.colors.primary,
    width: 24,
  },
  title: {
    marginBottom: theme.spacing.md,
  },
  description: {
    marginBottom: theme.spacing.xl,
    paddingHorizontal: theme.spacing.md,
  },
  button: {
    marginTop: 'auto',
    marginBottom: theme.spacing.xl,
  },
});
