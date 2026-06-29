import React from 'react';
import { View, ViewProps, SafeAreaView, StyleSheet, StyleProp, ViewStyle, KeyboardAvoidingView, Platform } from 'react-native';
import { theme } from '../../core/theme';

export interface ContainerProps extends ViewProps {
  safeArea?: boolean;
  padding?: boolean;
  backgroundColor?: string;
  center?: boolean;
  keyboardAvoiding?: boolean;
}

export const Container: React.FC<ContainerProps> = ({
  safeArea = false,
  padding = true,
  backgroundColor = theme.colors.background,
  center = false,
  keyboardAvoiding = true,
  style,
  children,
  ...props
}) => {
  const customStyles: StyleProp<ViewStyle> = [
    styles.base,
    { backgroundColor },
    padding && { padding: theme.spacing.lg },
    center && { justifyContent: 'center', alignItems: 'center' },
    style,
  ];

  let content = (
    <View style={customStyles} {...props}>
      {children}
    </View>
  );

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
