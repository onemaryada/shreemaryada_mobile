import React from 'react';
import { View, ViewProps, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import { theme } from '../../core/theme';

export interface GlassCardProps extends ViewProps {
  backgroundColor?: string;
  borderColor?: string;
}

export const GlassCard: React.FC<GlassCardProps> = ({
  backgroundColor = theme.colors.surface,
  borderColor = theme.colors.border,
  style,
  children,
  ...props
}) => {
  const getStyleArray = (): StyleProp<ViewStyle> => [
    styles.container,
    {
      backgroundColor,
      borderColor,
    },
    style,
  ];

  return (
    <View
      style={getStyleArray()}
      {...props}
    >
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: theme.radius.md,
    borderWidth: 1,
    overflow: 'hidden',
  },
});
