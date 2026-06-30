import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { ScreenWrapper, Text, Button } from '../components';
import { theme } from '../../core/theme';
import Icon from 'react-native-vector-icons/Feather';

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
    };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <ScreenWrapper safeArea paddingHorizontal>
          <View style={styles.container}>
            <Icon name="alert-circle" size={80} color={theme.colors.error} />
            <Text variant="h2" align="center" style={styles.title} weight="bold">
              Oops! Something went wrong
            </Text>
            <Text
              variant="body"
              color={theme.colors.textSecondary}
              align="center"
              style={styles.message}
            >
              We encountered an unexpected error. Please try again.
            </Text>

            {__DEV__ && this.state.error && (
              <View style={styles.errorDetails}>
                <Text variant="caption" color={theme.colors.error} weight="bold">
                  Error Details:
                </Text>
                <Text variant="caption" color={theme.colors.error} style={styles.errorText}>
                  {this.state.error.toString()}
                </Text>
              </View>
            )}

            <Button title="Try Again" onPress={this.handleReset} fullWidth style={styles.button} />
          </View>
        </ScreenWrapper>
      );
    }

    return this.props.children;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.lg,
  },
  title: {
    marginTop: theme.spacing.lg,
    marginBottom: theme.spacing.md,
  },
  message: {
    marginBottom: theme.spacing.xl,
    lineHeight: 24,
  },
  errorDetails: {
    width: '100%',
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    borderRadius: theme.radius.md,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.xl,
    maxHeight: 150,
  },
  errorText: {
    marginTop: theme.spacing.sm,
  },
  button: {
    width: '100%',
  },
});
