import React from 'react';
import { View, Text, StyleSheet, Animated, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useToast } from './ToastContext';
import { theme } from '@design-system/theme';

export const Toast: React.FC = () => {
  const { currentToast, opacity, translateY, hideToast } = useToast();
  const insets = useSafeAreaInsets();

  if (!currentToast) return null;

  const backgroundColor = {
    success: theme.colors.success.main,
    error: theme.colors.error.main,
    info: theme.colors.primary.main,
  }[currentToast.type];

  return (
    <Animated.View
      style={[
        styles.container,
        {
          opacity,
          transform: [{ translateY }],
          top: insets.top + 60,
          backgroundColor,
        },
      ]}
    >
      <Pressable onPress={hideToast} style={styles.pressable}>
        <View style={styles.content}>
          <Text style={styles.icon}>
            {currentToast.type === 'success' && '✓'}
            {currentToast.type === 'error' && '✕'}
            {currentToast.type === 'info' && 'ℹ'}
          </Text>
          <Text style={styles.message}>{currentToast.message}</Text>
        </View>
      </Pressable>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: theme.spacing.md,
    right: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    zIndex: 9999,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  pressable: {
    padding: theme.spacing.md,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    fontSize: 18,
    color: theme.colors.neutral.white,
    marginRight: theme.spacing.sm,
    fontWeight: 'bold',
  },
  message: {
    flex: 1,
    color: theme.colors.neutral.white,
    fontSize: theme.typography.fontSize.md,
    fontWeight: theme.typography.fontWeight.medium,
  },
});
