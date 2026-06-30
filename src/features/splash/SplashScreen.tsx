import React, { useEffect } from 'react';
import { View, StyleSheet, Dimensions, Image } from 'react-native';
import Animated, {
  FadeIn,
  ZoomIn,
  SlideInDown,
  withTiming,
  withSpring,
  useAnimatedStyle,
  useSharedValue,
  interpolate,
  Extrapolate,
} from 'react-native-reanimated';
import LinearGradient from 'react-native-linear-gradient';
import { theme } from '../../core/theme';
import { gradients } from '../../core/theme/colors';
import { Text } from '../../shared/components';


const { width, height } = Dimensions.get('window');

interface SplashScreenProps {
  onFinish?: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onFinish }) => {
  const progress = useSharedValue(0);
  const scale = useSharedValue(0);
  const opacity = useSharedValue(0);

  useEffect(() => {
    // Start animations
    scale.value = withSpring(1, { damping: 8, mass: 1, overshootClamping: false });
    opacity.value = withTiming(1, { duration: 800 });

    // Progress animation
    progress.value = withTiming(1, { duration: 2000 });

    // Finish splash after 2.5 seconds
    const timer = setTimeout(() => {
      onFinish?.();
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  const logoAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  const progressBarAnimatedStyle = useAnimatedStyle(() => ({
    width: interpolate(progress.value, [0, 1], [0, width * 0.6], Extrapolate.CLAMP),
  }));

  return (
    <LinearGradient
      colors={[gradients.bgLight[0] as string, gradients.bgLight[1] as string]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}
    >
      {/* Animated Background Elements */}
      <Animated.View
        style={[
          styles.bgElement1,
          {
            opacity: useSharedValue(0.1),
          },
        ]}
        entering={FadeIn.duration(1000)}
      >
        <View style={styles.circle} />
      </Animated.View>

      <Animated.View
        style={[
          styles.bgElement2,
          {
            opacity: useSharedValue(0.08),
          },
        ]}
        entering={FadeIn.delay(200).duration(1000)}
      >
        <View style={[styles.circle, { width: 200, height: 200 }]} />
      </Animated.View>

      {/* Main Logo */}
      <Animated.View style={[styles.logoContainer, logoAnimatedStyle]} entering={ZoomIn.duration(600)}>
        <View style={styles.logoBox}>
          <Image
            source={require('../../../logo.png')}
            style={styles.logoImage}
            resizeMode="contain"
          />
        </View>
      </Animated.View>

      {/* App Name */}
      <Animated.View
        entering={SlideInDown.delay(400).duration(600)}
        style={styles.titleContainer}
      >
        <Text variant="h1" weight="bold" align="center" color={theme.colors.text}>
          ShreeMaryda
        </Text>
        <Text
          variant="body"
          color={theme.colors.textSecondary}
          align="center"
          style={styles.subtitle}
        >
          Project Management Made Simple
        </Text>
      </Animated.View>

      {/* Progress Bar */}
      <Animated.View style={[styles.progressContainer]}>
        <Animated.View
          style={[
            styles.progressBar,
            progressBarAnimatedStyle,
            { backgroundColor: theme.colors.primary },
          ]}
        />
      </Animated.View>

      {/* Loading Text */}
      <Animated.View entering={FadeIn.delay(800).duration(600)} style={styles.loadingText}>
        <Text variant="caption" color={theme.colors.textSecondary}>
          Loading...
        </Text>
      </Animated.View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  bgElement1: {
    position: 'absolute',
    top: -100,
    right: -50,
  },
  bgElement2: {
    position: 'absolute',
    bottom: -150,
    left: -100,
  },
  circle: {
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: theme.colors.primary,
  },
  logoContainer: {
    marginBottom: theme.spacing.xl * 2,
  },
  logoBox: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: 'rgba(30, 122, 67, 0.08)',
    justifyContent: 'center',
    alignItems: 'center',
    // borderWidth: 2,
    // borderColor: theme.colors.primary,
    // shadowColor: theme.colors.primary,
    // shadowOffset: { width: 0, height: 10 },
    // shadowOpacity: 0.25,
    // shadowRadius: 20,
    // elevation: 8,
    // overflow: 'hidden',
  },
  logoImage: {
    width: 110,
    height: 110,
  },
  titleContainer: {
    marginBottom: theme.spacing.xl * 3,
  },
  subtitle: {
    marginTop: theme.spacing.sm,
  },
  progressContainer: {
    position: 'absolute',
    bottom: 100,
    width: width * 0.6,
    height: 4,
    borderRadius: 2,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    borderRadius: 2,
  },
  loadingText: {
    position: 'absolute',
    bottom: 40,
  },
});
