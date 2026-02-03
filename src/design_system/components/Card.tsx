import React from 'react';
import { View, StyleSheet, ViewProps, ViewStyle } from 'react-native';
import { theme } from '../theme';

export interface CardProps extends ViewProps {
  elevation?: keyof typeof theme.shadows;
  padding?: keyof typeof theme.spacing;
  children: React.ReactNode;
  style?: ViewStyle;
}

export const Card: React.FC<CardProps> = ({
  elevation = 'md',
  padding = 'md',
  children,
  style,
  ...rest
}) => {
  const cardStyle: ViewStyle = {
    ...styles.base,
    ...theme.shadows[elevation],
    padding: theme.spacing[padding],
    ...style,
  };

  return (
    <View {...rest} style={cardStyle}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  base: {
    backgroundColor: theme.colors.background.paper,
    borderRadius: theme.borderRadius.lg,
    overflow: 'hidden',
  },
});
