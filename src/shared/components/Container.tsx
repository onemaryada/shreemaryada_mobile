import React from 'react';
import { View, ViewProps, SafeAreaView, StyleSheet, StyleProp, ViewStyle, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { theme } from '../../core/theme';

export interface ContainerProps extends ViewProps {
  safeArea?: boolean;
  padding?: boolean;
  backgroundColor?: string;
  center?: boolean;
  keyboardAvoiding?: boolean;
  scrollable?: boolean;
}

export const Container: React.FC<ContainerProps> = ({
  safeArea = false,
  padding = true,
  backgroundColor = theme.colors.background,
  center = false,
  keyboardAvoiding = true,
  scrollable = false,
  style,
  children,
  ...props
}) => {
  const baseStyle: StyleProp<ViewStyle> = [
    { backgroundColor },
    padding && { padding: theme.spacing.lg },
    center && { justifyContent: 'center', alignItems: 'center' },
    style,
  ];

  let content;
  if (scrollable) {
    content = (
      <ScrollView
        style={styles.base}
        contentContainerStyle={[{ flexGrow: 1 }, baseStyle]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        {...props}
      >
        {children}
      </ScrollView>
    );
  } else {
    content = (
      <View style={[styles.base, baseStyle]} {...props}>
        {children}
      </View>
    );
  }

  if (keyboardAvoiding) {
    content = (
      <KeyboardAvoidingView 
        style={styles.base}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        {content}
      </KeyboardAvoidingView>
    );
  }

  if (safeArea) {
    return (
      <SafeAreaView style={[styles.base, { backgroundColor }]}>
        {content}
      </SafeAreaView>
    );
  }

  return content;
};

const styles = StyleSheet.create({
  base: {
    flex: 1,
  },
});
