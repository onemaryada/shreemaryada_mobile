import React from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  ViewStyle,
  StyleProp,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { theme } from '../../core/theme';
import { Text } from './Text';

export interface HeaderProps {
  title: string;
  subtitle?: string;
  onBackPress?: () => void;
  rightIcon?: string;
  rightIconColor?: string;
  onRightPress?: () => void;
  showBack?: boolean;
  style?: StyleProp<ViewStyle>;
}

export const Header: React.FC<HeaderProps> = ({
  title,
  subtitle,
  onBackPress,
  rightIcon,
  rightIconColor = theme.colors.primary,
  onRightPress,
  showBack = true,
  style,
}) => {
  return (
    <View style={[styles.container, style]}>
      <View style={styles.content}>
        <View style={styles.leftSection}>
          {showBack && (
            <TouchableOpacity
              style={styles.backButton}
              onPress={onBackPress}
              activeOpacity={0.7}
            >
              <Icon
                name="chevron-left"
                size={28}
                color={theme.colors.primary}
              />
            </TouchableOpacity>
          )}
          <View style={styles.titleSection}>
            <Text
              variant="h2"
              weight="bold"
              numberOfLines={1}
              style={styles.title}
            >
              {title}
            </Text>
            {subtitle && (
              <Text
                variant="body"
                color={theme.colors.textSecondary}
                numberOfLines={1}
                style={styles.subtitle}
              >
                {subtitle}
              </Text>
            )}
          </View>
        </View>

        {rightIcon && (
          <TouchableOpacity
            style={styles.rightButton}
            onPress={onRightPress}
            activeOpacity={0.7}
          >
            <Icon
              name={rightIcon}
              size={24}
              color={rightIconColor}
            />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    marginBottom: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  leftSection: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.sm,
  },
  titleSection: {
    flex: 1,
  },
  title: {
    marginBottom: 2,
  },
  subtitle: {
    marginTop: 2,
  },
  rightButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: theme.spacing.sm,
  },
});
