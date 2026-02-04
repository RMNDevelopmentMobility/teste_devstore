import { useSyncExternalStore, useCallback } from 'react';
import { cartContainer } from '../../injection/CartContainer';
import { AddToCartParams } from '../../domain/repositories/CartRepository';

const repository = cartContainer.repository;

export const useCart = () => {
  const cart = useSyncExternalStore(
    (onStoreChange) => repository.subscribe(onStoreChange),
    () => repository.getCart(),
    () => repository.getCart()
  );

  const addToCart = useCallback(
    (product: AddToCartParams) => repository.addToCart(product),
    []
  );

  const removeFromCart = useCallback(
    (productId: number) => repository.removeFromCart(productId),
    []
  );

  const updateQuantity = useCallback(
    (productId: number, quantity: number) => repository.updateQuantity(productId, quantity),
    []
  );

  const clearCart = useCallback(() => repository.clearCart(), []);

  return {
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
  };
};
