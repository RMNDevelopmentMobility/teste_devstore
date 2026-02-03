import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Typography, Button } from '@design-system';
import { theme } from '@design-system/theme';
import { AppError, ErrorType } from '@core/errors';

interface ErrorDisplayProps {
  error: AppError;
  onRetry?: () => void;
}

export const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ error, onRetry }) => {
  const getErrorMessage = (errorType: ErrorType): string => {
    switch (errorType) {
      case ErrorType.NETWORK:
        return 'Não foi possível conectar ao servidor. Verifique sua conexão com a internet.';
      case ErrorType.NOT_FOUND:
        return 'O conteúdo solicitado não foi encontrado.';
      case ErrorType.VALIDATION:
        return 'Os dados recebidos são inválidos.';
      case ErrorType.TIMEOUT:
        return 'A operação demorou muito para responder. Tente novamente.';
      case ErrorType.UNAUTHORIZED:
        return 'Você não tem permissão para acessar este conteúdo.';
      default:
        return 'Ocorreu um erro inesperado. Por favor, tente novamente.';
    }
  };

  return (
    <View style={styles.container}>
      <Typography variant="h3" color="primary" align="center" style={styles.title}>
        Erro
      </Typography>
      <Typography variant="body1" color="secondary" align="center" style={styles.message}>
        {error.message || getErrorMessage(error.type)}
      </Typography>
      {onRetry && (
        <Button variant="primary" onPress={onRetry} style={styles.button}>
          Tentar Novamente
        </Button>
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
    backgroundColor: theme.colors.background.default,
  },

  title: {
    marginBottom: theme.spacing.md,
  },

  message: {
    marginBottom: theme.spacing.xl,
    maxWidth: 300,
  },

  button: {
    minWidth: 200,
  },
});
