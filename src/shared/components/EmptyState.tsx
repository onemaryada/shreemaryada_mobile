import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { Text } from './Text';
import { Button } from './Button';
import { theme } from '../../core/theme';
import Icon from 'react-native-vector-icons/Feather';

export interface EmptyStateProps {
  icon?: string;
  title: string;
  description?: string;
  actionTitle?: string;
  onAction?: () => void;
  style?: ViewStyle;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon = 'inbox',
  title,
  description,
  actionTitle,
  onAction,
  style,
}) => {
  return (
    <View style={[styles.container, style]}>
      <View style={styles.iconContainer}>
        <Icon name={icon} size={48} color={theme.colors.primary} />
      </View>
      <Text variant="h3" align="center" style={styles.title}>
        {title}
      </Text>
      {description && (
        <Text variant="body" color={theme.colors.textSecondary} align="center" style={styles.description}>
          {description}
        </Text>
      )}
      {actionTitle && onAction && (
        <Button title={actionTitle} onPress={onAction} style={styles.button} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.xl,
  },
  iconContainer: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: theme.colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.xl,
  },
  title: {
    marginBottom: theme.spacing.sm,
  },
  description: {
    marginBottom: theme.spacing.xl,
  },
  button: {
    minWidth: 200,
  },
});
