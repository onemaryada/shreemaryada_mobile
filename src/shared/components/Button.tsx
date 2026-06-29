import React from 'react';
import { TouchableOpacity, TouchableOpacityProps, StyleSheet, ActivityIndicator, ViewStyle } from 'react-native';
import { theme } from '../../core/theme';
import { Text } from './Text';

export interface ButtonProps extends TouchableOpacityProps {
  title: string;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  variant = 'primary',
  size = 'md',
  loading = false,
  fullWidth = false,
  style,
  disabled,
  ...props
}) => {
  const getBackgroundColor = () => {
    if (disabled) return theme.colors.border;
    switch (variant) {
      case 'primary': return theme.colors.primary;
      case 'secondary': return theme.colors.surfaceDark;
      case 'outline': return 'transparent';
      case 'ghost': return 'transparent';
      default: return theme.colors.primary;
    }
  };

  const getTextColor = () => {
    if (disabled) return theme.colors.textSecondary;
    switch (variant) {
      case 'primary': return theme.colors.white;
      case 'secondary': return theme.colors.white;
      case 'outline': return theme.colors.primary;
      case 'ghost': return theme.colors.primary;
      default: return theme.colors.white;
    }
  };

  const getBorderColor = () => {
    if (disabled) return theme.colors.border;
    if (variant === 'outline') return theme.colors.primary;
    return 'transparent';
  };

  const getPadding = () => {
    switch (size) {
      case 'sm': return { paddingVertical: theme.spacing.sm, paddingHorizontal: theme.spacing.md };
      case 'lg': return { paddingVertical: theme.spacing.lg, paddingHorizontal: theme.spacing.xl };
      case 'md':
      default: return { paddingVertical: theme.spacing.md, paddingHorizontal: theme.spacing.lg };
    }
  };

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      disabled={disabled || loading}
      style={[
        styles.container,
        getPadding(),
        {
          backgroundColor: getBackgroundColor(),
          borderColor: getBorderColor(),
          borderWidth: variant === 'outline' ? 1 : 0,
          width: fullWidth ? '100%' : 'auto',
        },
        style as ViewStyle,
      ]}
      {...props}
    >
      {loading ? (
        <ActivityIndicator color={getTextColor()} />
      ) : (
        <Text variant="button" color={getTextColor()} align="center">
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: theme.radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
});
