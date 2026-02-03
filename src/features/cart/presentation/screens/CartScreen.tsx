import React from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useCart } from '../hooks/useCart';
import { CartItem } from '../components/CartItem';
import { Typography, Button } from '@design-system';
import { theme } from '@design-system/theme';
import { CartItem as CartItemEntity } from '../../domain/entities/CartItem';

export const CartScreen: React.FC = () => {
  const { cart, updateQuantity, removeFromCart, clearCart } = useCart();
  const insets = useSafeAreaInsets();

  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(price);
  };

  const handleIncrement = (item: CartItemEntity): void => {
    updateQuantity(item.productId, item.quantity + 1);
  };

  const handleDecrement = (item: CartItemEntity): void => {
    if (item.quantity > 1) {
      updateQuantity(item.productId, item.quantity - 1);
    } else {
      removeFromCart(item.productId);
    }
  };

  const handleRemove = (productId: number): void => {
    removeFromCart(productId);
  };

  const handleClearCart = (): void => {
    clearCart();
  };

  const handleContinueShopping = (): void => {
    router.replace('/');
  };

  if (cart.items.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Typography variant="h2" align="center" style={styles.emptyTitle}>
          Seu carrinho está vazio
        </Typography>
        <Typography variant="body1" color="secondary" align="center" style={styles.emptyMessage}>
          Adicione produtos para começar suas compras
        </Typography>
        <Button variant="primary" onPress={handleContinueShopping} style={styles.emptyButton}>
          Continuar Comprando
        </Button>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Typography variant="h3">
          {cart.totalItems} {cart.totalItems === 1 ? 'item' : 'itens'}
        </Typography>
        <Button variant="ghost" size="sm" onPress={handleClearCart}>
          Limpar Carrinho
        </Button>
      </View>

      <FlatList
        data={cart.items}
        renderItem={({ item }) => (
          <CartItem
            item={item}
            onIncrement={() => handleIncrement(item)}
            onDecrement={() => handleDecrement(item)}
            onRemove={() => handleRemove(item.productId)}
          />
        )}
        keyExtractor={(item) => item.productId.toString()}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />

      <View style={[styles.footer, { paddingBottom: insets.bottom + theme.spacing.sm }]}>
        <View style={styles.totalRow}>
          <Typography variant="h3">Total</Typography>
          <Typography variant="h2" style={styles.totalPrice}>
            {formatPrice(cart.totalPrice)}
          </Typography>
        </View>

        <Button variant="primary" size="md" fullWidth style={styles.checkoutButton}>
          Finalizar Compra
        </Button>

        <Button variant="outline" size="sm" fullWidth onPress={handleContinueShopping}>
          Continuar Comprando
        </Button>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background.default,
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border.default,
  },

  listContent: {
    padding: theme.spacing.md,
  },

  footer: {
    paddingHorizontal: theme.spacing.md,
    paddingTop: theme.spacing.sm,
    backgroundColor: theme.colors.background.paper,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border.default,
    ...theme.shadows.lg,
  },

  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },

  totalPrice: {
    color: theme.colors.primary.main,
  },

  checkoutButton: {
    marginBottom: theme.spacing.sm,
  },

  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.xl,
    backgroundColor: theme.colors.background.default,
  },

  emptyTitle: {
    marginBottom: theme.spacing.md,
  },

  emptyMessage: {
    marginBottom: theme.spacing.xl,
  },

  emptyButton: {
    minWidth: 200,
  },
});
