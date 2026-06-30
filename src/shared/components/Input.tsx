import React, { useState } from 'react';
import { View, TextInput, TextInputProps, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { theme } from '../../core/theme';
import { Text } from './Text';

export interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  isPassword?: boolean;
  containerStyle?: any;
}

export const Input = React.forwardRef<TextInput, InputProps>(({ label, error, isPassword, style, containerStyle, ...props }, ref) => {
  const [isSecure, setIsSecure] = useState(isPassword);

  return (
    <View style={[styles.container, containerStyle]}>
      {label && (
        <Text variant="caption" weight="medium" style={styles.label}>
          {label}
        </Text>
      )}
      <View style={[
        styles.inputWrapper,
        error ? styles.inputError : null,
        props.editable === false ? styles.inputDisabled : null,
        style
      ]}>
        <TextInput
          ref={ref}
          style={styles.input}
          placeholderTextColor={theme.colors.textTertiary}
          secureTextEntry={isSecure}
          {...props}
        />
        {isPassword && (
          <TouchableOpacity
            style={styles.iconContainer}
            onPress={() => setIsSecure(!isSecure)}
          >
            <Icon name={isSecure ? 'eye-off' : 'eye'} size={20} color={theme.colors.textSecondary} />
          </TouchableOpacity>
        )}
      </View>
      {error && (
        <Text variant="caption" color={theme.colors.error} style={styles.errorText}>
          {error}
        </Text>
      )}
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    marginBottom: theme.spacing.md,
    width: '100%',
  },
  label: {
    marginBottom: theme.spacing.xs,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.md,
    backgroundColor: theme.colors.background,
  },
  input: {
    flex: 1,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.md,
    fontSize: theme.typography.size.md,
    color: theme.colors.text,
  },
  iconContainer: {
    padding: theme.spacing.md,
  },
  inputError: {
    borderColor: theme.colors.error,
  },
  inputDisabled: {
    opacity: 0.6,
  },
  errorText: {
    marginTop: theme.spacing.xs,
  },
});
