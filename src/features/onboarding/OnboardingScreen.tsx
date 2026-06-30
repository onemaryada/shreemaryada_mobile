import React, { useState, useRef } from 'react';
import { View, StyleSheet, Dimensions, TouchableOpacity, FlatList, ViewToken } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';
import { RootStackParamList } from '../../core/navigation/types';
import { storage, STORAGE_KEYS } from '../../core/storage/mmkv';
import { ScreenWrapper, Text, Button } from '../../shared/components';
import { theme } from '../../core/theme';
import Icon from 'react-native-vector-icons/Feather';

type Props = NativeStackScreenProps<RootStackParamList, 'Onboarding'>;

const { width, height } = Dimensions.get('window');

const ONBOARDING_DATA = [
  {
    id: '1',
    title: 'Manage Your Projects',
    description: 'Keep track of all your projects and deadlines in one centralized place with real-time updates.',
    icon: 'briefcase',
  },
  {
    id: '2',
    title: 'Track Your Tasks',
    description: 'Break down projects into manageable tasks and subtasks. Never miss a detail.',
    icon: 'check-square',
  },
  {
    id: '3',
    title: 'Collaborate Seamlessly',
    description: 'Work together with your team, share updates, and achieve your goals faster.',
    icon: 'users',
  },
];

export const OnboardingScreen: React.FC<Props> = ({ navigation }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);
  const scrollProgress = useSharedValue(0);

  const handleViewableItemsChanged = ({ viewableItems }: { viewableItems: ViewToken[] }) => {
    if (viewableItems.length > 0) {
      const index = viewableItems[0].index ?? 0;
      setCurrentIndex(index);
    }
  };

  const handleNext = () => {
    if (currentIndex < ONBOARDING_DATA.length - 1) {
      flatListRef.current?.scrollToIndex({
        index: currentIndex + 1,
        animated: true,
      });
    } else {
      handleFinish();
    }
  };


  const handleFinish = async () => {
    storage.set(STORAGE_KEYS.HAS_LAUNCHED, true);
    navigation.replace('Auth');
  };

  const renderSlide = ({ item }: { item: (typeof ONBOARDING_DATA)[0] }) => (
    <View style={styles.slide}>
      {/* Illustration */}
      <View style={styles.illustrationContainer}>
        <View style={styles.iconBox}>
          <Icon name={item.icon} size={100} color={theme.colors.primary} />
        </View>
      </View>

      {/* Text Content */}
      <View style={styles.textContainer}>
        <Text variant="h1" weight="bold" align="center" style={styles.title}>
          {item.title}
        </Text>
        <Text
          variant="body"
          color={theme.colors.textSecondary}
          align="center"
          style={styles.description}
        >
          {item.description}
        </Text>
      </View>
    </View>
  );

  const scrollAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: withTiming(1, { duration: 300 }),
    };
  });

  return (
    <ScreenWrapper
      safeArea
      paddingHorizontal={false}
      keyboardAvoiding={false}
      paddingVertical
    >
      {/* Header */}
      <View style={styles.header}>
        <Text variant="caption" color={theme.colors.primary} weight="bold">
          {currentIndex + 1}/{ONBOARDING_DATA.length}
        </Text>
      </View>

      {/* Slider */}
      <Animated.View style={[styles.sliderContainer, scrollAnimatedStyle]}>
        <FlatList
          ref={flatListRef}
          data={ONBOARDING_DATA}
          renderItem={renderSlide}
          keyExtractor={item => item.id}
          horizontal
          pagingEnabled
          scrollEventThrottle={16}
          onViewableItemsChanged={handleViewableItemsChanged}
          viewabilityConfig={{
            itemVisiblePercentThreshold: 50,
          }}
          showsHorizontalScrollIndicator={false}
          scrollEnabled={true}
          snapToInterval={width}
          decelerationRate="fast"
        />
      </Animated.View>

      {/* Dots Indicator */}
      <View style={styles.dotsContainer}>
        {ONBOARDING_DATA.map((_, index) => (
          <View
            key={index}
            style={[
              styles.dot,
              {
                backgroundColor:
                  index === currentIndex ? theme.colors.primary : theme.colors.border,
                width: index === currentIndex ? 32 : 8,
              },
            ]}
          />
        ))}
      </View>

      {/* Bottom Buttons */}
      <View style={styles.buttonContainer}>
        <Button
          title={currentIndex === ONBOARDING_DATA.length - 1 ? 'Get Started' : 'Next'}
          onPress={handleNext}
          fullWidth
        />

      </View>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.md,
    paddingBottom: theme.spacing.lg,
  },
  sliderContainer: {
    flex: 1,
    height: height * 0.6,
  },
  slide: {
    width,
    paddingHorizontal: theme.spacing.lg,
    justifyContent: 'space-between',
  },
  illustrationContainer: {
    flex: 0.5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconBox: {
    width: 250,
    height: 250,
    borderRadius: 75,
    backgroundColor: theme.colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textContainer: {
    flex: 0.5,
    justifyContent: 'flex-end',
    paddingBottom: theme.spacing.lg,
  },
  title: {
    marginBottom: theme.spacing.md,
  },
  description: {
    lineHeight: 24,
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: theme.spacing.lg,
    gap: theme.spacing.sm,
  },
  dot: {
    height: 8,
    borderRadius: 4,
  },
  buttonContainer: {
    paddingHorizontal: theme.spacing.lg,
    paddingBottom: theme.spacing.xl,
    gap: theme.spacing.md,
  },
  nextButton: {
    // marginBottom: theme.spacing.sm,
  },
  backButton: {
    marginBottom: theme.spacing.md,
  },
});
