import React from 'react';
import { Text as RNText, TextProps as RNTextProps, StyleSheet, TextStyle } from 'react-native';
import { theme } from '../theme';

type TypographyVariant = 'h1' | 'h2' | 'h3' | 'body1' | 'body2' | 'caption' | 'overline';
type TextColor = 'primary' | 'secondary' | 'disabled' | 'inverse';

export interface TypographyProps extends RNTextProps {
  variant?: TypographyVariant;
  color?: TextColor;
  align?: 'left' | 'center' | 'right';
  children: React.ReactNode;
  style?: TextStyle;
}

export const Typography: React.FC<TypographyProps> = ({
  variant = 'body1',
  color = 'primary',
  align = 'left',
  children,
  style,
  ...rest
}) => {
  const textStyle: TextStyle = {
    ...styles[variant],
    ...styles[`color_${color}`],
    textAlign: align,
    ...style,
  };

  return (
    <RNText {...rest} style={textStyle}>
      {children}
    </RNText>
  );
};

const styles = StyleSheet.create({
  // Variants
  h1: {
    fontSize: theme.typography.fontSize.xxxl,
    lineHeight: theme.typography.lineHeight.xxxl,
    fontWeight: theme.typography.fontWeight.bold,
  },

  h2: {
    fontSize: theme.typography.fontSize.xxl,
    lineHeight: theme.typography.lineHeight.xxl,
    fontWeight: theme.typography.fontWeight.bold,
  },

  h3: {
    fontSize: theme.typography.fontSize.xl,
    lineHeight: theme.typography.lineHeight.xl,
    fontWeight: theme.typography.fontWeight.semibold,
  },

  body1: {
    fontSize: theme.typography.fontSize.md,
    lineHeight: theme.typography.lineHeight.md,
    fontWeight: theme.typography.fontWeight.regular,
  },

  body2: {
    fontSize: theme.typography.fontSize.sm,
    lineHeight: theme.typography.lineHeight.sm,
    fontWeight: theme.typography.fontWeight.regular,
  },

  caption: {
    fontSize: theme.typography.fontSize.xs,
    lineHeight: theme.typography.lineHeight.xs,
    fontWeight: theme.typography.fontWeight.regular,
  },

  overline: {
    fontSize: theme.typography.fontSize.xs,
    lineHeight: theme.typography.lineHeight.xs,
    fontWeight: theme.typography.fontWeight.semibold,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },

  // Colors
  color_primary: {
    color: theme.colors.text.primary,
  },

  color_secondary: {
    color: theme.colors.text.secondary,
  },

  color_disabled: {
    color: theme.colors.text.disabled,
  },

  color_inverse: {
    color: theme.colors.text.inverse,
  },
});
