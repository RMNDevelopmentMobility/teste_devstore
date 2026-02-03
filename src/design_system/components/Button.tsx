import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacityProps,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { theme } from '../theme';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost';
type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends Omit<TouchableOpacityProps, 'style'> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  loading?: boolean;
  disabled?: boolean;
  children: React.ReactNode;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  loading = false,
  disabled = false,
  children,
  style,
  textStyle,
  ...rest
}) => {
  const isDisabled = disabled || loading;

  const buttonStyle: ViewStyle = {
    ...styles.base,
    ...styles[`size_${size}`],
    ...styles[`variant_${variant}`],
    ...(fullWidth && styles.fullWidth),
    ...(isDisabled && styles.disabled),
    ...style,
  };

  const textStyleCombined: TextStyle = {
    ...styles.text,
    ...styles[`text_${size}`],
    ...styles[`text_${variant}`],
    ...(isDisabled && styles.textDisabled),
    ...textStyle,
  };

  return (
    <TouchableOpacity
      {...rest}
      style={buttonStyle}
      disabled={isDisabled}
      activeOpacity={0.7}
    >
      {loading ? (
        <ActivityIndicator
          color={variant === 'outline' || variant === 'ghost' ? theme.colors.primary.main : theme.colors.neutral.white}
        />
      ) : (
        <Text style={textStyleCombined}>{children}</Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  base: {
    borderRadius: theme.borderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },

  // Sizes
  size_sm: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    minHeight: 36,
  },

  size_md: {
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    minHeight: 44,
  },

  size_lg: {
    paddingHorizontal: theme.spacing.xl,
    paddingVertical: theme.spacing.lg,
    minHeight: 52,
  },

  // Variants
  variant_primary: {
    backgroundColor: theme.colors.primary.main,
  },

  variant_secondary: {
    backgroundColor: theme.colors.secondary.main,
  },

  variant_outline: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: theme.colors.primary.main,
  },

  variant_ghost: {
    backgroundColor: 'transparent',
  },

  // States
  disabled: {
    opacity: 0.5,
  },

  fullWidth: {
    width: '100%',
  },

  // Text styles
  text: {
    fontWeight: theme.typography.fontWeight.semibold,
  },

  text_sm: {
    fontSize: theme.typography.fontSize.sm,
    lineHeight: theme.typography.lineHeight.sm,
  },

  text_md: {
    fontSize: theme.typography.fontSize.md,
    lineHeight: theme.typography.lineHeight.md,
  },

  text_lg: {
    fontSize: theme.typography.fontSize.lg,
    lineHeight: theme.typography.lineHeight.lg,
  },

  text_primary: {
    color: theme.colors.neutral.white,
  },

  text_secondary: {
    color: theme.colors.neutral.white,
  },

  text_outline: {
    color: theme.colors.primary.main,
  },

  text_ghost: {
    color: theme.colors.primary.main,
  },

  textDisabled: {
    opacity: 1,
  },
});
