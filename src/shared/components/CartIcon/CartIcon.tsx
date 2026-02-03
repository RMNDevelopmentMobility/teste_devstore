import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Pressable, Animated } from 'react-native';
import { router } from 'expo-router';
import { useCart } from '@features/cart/presentation/hooks/useCart';
import { theme } from '@design-system/theme';

const ShoppingCartIcon: React.FC = () => (
  <View style={cartIconStyles.container}>
    <View style={cartIconStyles.handle} />
    <View style={cartIconStyles.basket}>
      <View style={cartIconStyles.basketInner} />
    </View>
    <View style={cartIconStyles.wheelsContainer}>
      <View style={cartIconStyles.wheel} />
      <View style={cartIconStyles.wheel} />
    </View>
  </View>
);

const cartIconStyles = StyleSheet.create({
  container: {
    width: 24,
    height: 24,
    alignItems: 'center',
  },
  handle: {
    position: 'absolute',
    top: -2,
    right: -4,
    width: 12,
    height: 10,
    borderLeftWidth: 2.5,
    borderTopWidth: 2.5,
    borderColor: theme.colors.neutral.white,
    borderTopLeftRadius: 6,
  },
  basket: {
    marginTop: 4,
    width: 20,
    height: 14,
    backgroundColor: theme.colors.neutral.white,
    borderBottomLeftRadius: 4,
    borderBottomRightRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  basketInner: {
    width: 14,
    height: 8,
    backgroundColor: theme.colors.primary.main,
    borderBottomLeftRadius: 2,
    borderBottomRightRadius: 2,
  },
  wheelsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: 16,
    marginTop: 2,
  },
  wheel: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: theme.colors.neutral.white,
  },
});

export const CartIcon: React.FC = () => {
  const { cart } = useCart();
  const totalItems = cart.totalItems;
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const prevTotalRef = useRef(totalItems);

  useEffect(() => {
    if (totalItems > prevTotalRef.current) {
      Animated.sequence([
        Animated.spring(scaleAnim, {
          toValue: 1.2,
          useNativeDriver: true,
          friction: 4,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          useNativeDriver: true,
          friction: 4,
        }),
      ]).start();
    }
    prevTotalRef.current = totalItems;
  }, [totalItems, scaleAnim]);

  const handlePress = (): void => {
    router.navigate('/cart');
  };

  return (
    <Pressable onPress={handlePress} style={styles.container}>
      <View style={styles.iconContainer}>
        <ShoppingCartIcon />
        {totalItems > 0 && (
          <Animated.View
            style={[
              styles.badge,
              {
                transform: [{ scale: scaleAnim }],
              },
            ]}
          >
            <Text style={styles.badgeText}>
              {totalItems > 99 ? '99+' : totalItems}
            </Text>
          </Animated.View>
        )}
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    marginRight: 4,
    paddingTop: 8,
    paddingRight: 12,
    paddingBottom: 8,
    paddingLeft: 8,
  },
  iconContainer: {
    position: 'relative',
    overflow: 'visible',
  },
  badge: {
    position: 'absolute',
    top: -6,
    left: -8,
    backgroundColor: theme.colors.warning.main,
    borderRadius: 10,
    minWidth: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  badgeText: {
    color: theme.colors.neutral.white,
    fontSize: 10,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
