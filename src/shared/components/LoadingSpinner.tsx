import React from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { Typography } from '@design-system';
import { theme } from '@design-system/theme';

interface LoadingSpinnerProps {
  message?: string;
  size?: 'small' | 'large';
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  message = 'Carregando...',
  size = 'large',
}) => {
  return (
    <View style={styles.container}>
      <ActivityIndicator size={size} color={theme.colors.primary.main} />
      {message && (
        <Typography variant="body1" color="secondary" style={styles.message}>
          {message}
        </Typography>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.background.default,
  },

  message: {
    marginTop: theme.spacing.md,
  },
});
