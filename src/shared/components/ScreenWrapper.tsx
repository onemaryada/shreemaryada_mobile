import React, { useEffect } from 'react';
import {
  View,
  ViewProps,
  SafeAreaView,
  StyleSheet,
  StyleProp,
  ViewStyle,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  ScrollView,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { theme } from '../../core/theme';
import { gradients } from '../../core/theme/colors';

export interface ScreenWrapperProps extends ViewProps {
  safeArea?: boolean;
  paddingHorizontal?: boolean;
  paddingVertical?: boolean;
  keyboardAvoiding?: boolean;
  scrollable?: boolean;
  statusBarStyle?: 'light-content' | 'dark-content';
  statusBarBackgroundColor?: string;
  backgroundColor?: string;
  gradientColors?: string[];
  showGradient?: boolean;
}

export const ScreenWrapper: React.FC<ScreenWrapperProps> = ({
  safeArea = true,
  paddingHorizontal = true,
  paddingVertical = false,
  keyboardAvoiding = true,
  scrollable = false,
  statusBarStyle = 'dark-content',
  statusBarBackgroundColor = 'transparent',
  backgroundColor = theme.colors.background,
  gradientColors = gradients.bgLight as any,
  showGradient = false,
  style,
  children,
  ...props
}) => {
  useEffect(() => {
    // Set status bar style
    StatusBar.setBarStyle(statusBarStyle, true);
    if (Platform.OS === 'android') {
      StatusBar.setBackgroundColor(statusBarBackgroundColor, true);
      StatusBar.setTranslucent(true);
    }
  }, [statusBarStyle, statusBarBackgroundColor]);

  const baseStyle: StyleProp<ViewStyle> = [
    paddingHorizontal && { paddingHorizontal: theme.spacing.lg },
    paddingVertical && { paddingVertical: theme.spacing.lg },
    !showGradient && { backgroundColor },
    style,
  ];

  let content;
  if (scrollable) {
    content = (
      <ScrollView
        style={styles.container}
        contentContainerStyle={[{ flexGrow: 1 }, baseStyle]}
        keyboardShouldPersistTaps="handled"
        contentInsetAdjustmentBehavior='automatic'
        showsVerticalScrollIndicator={false}
        {...props}
      >
        {children}
      </ScrollView>
    );
  } else {
    content = (
      <View style={[styles.container, baseStyle]} {...props}>
        {children}
      </View>
    );
  }

  if (keyboardAvoiding) {
    content = (
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        enabled
      >
        {content}
      </KeyboardAvoidingView>
    );
  }

  const wrappedContent = showGradient ? (
    <LinearGradient
      colors={gradientColors}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.gradientContainer}
    >
      {content}
    </LinearGradient>
  ) : (
    content
  );

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor }]}>
      {wrappedContent}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  gradientContainer: {
    flex: 1,
  },
});
