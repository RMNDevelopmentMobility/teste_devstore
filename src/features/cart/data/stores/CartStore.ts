import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CartItem } from '../../domain/entities/CartItem';
import { Cart, createCart, createEmptyCart } from '../../domain/entities/Cart';
import { AddToCart } from '../../domain/use_cases/AddToCart';
import { RemoveFromCart } from '../../domain/use_cases/RemoveFromCart';
import { UpdateCartItemQuantity } from '../../domain/use_cases/UpdateQuantity';
import { ClearCart } from '../../domain/use_cases/ClearCart';
import { logger } from '@core/logger';

interface CartState {
  cart: Cart;
  addToCart: (product: {
    productId: number;
    title: string;
    price: number;
    imageUrl: string;
  }) => void;
  removeFromCart: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
}

const addToCartUseCase = new AddToCart();
const removeFromCartUseCase = new RemoveFromCart();
const updateQuantityUseCase = new UpdateCartItemQuantity();
const clearCartUseCase = new ClearCart();

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      cart: createEmptyCart(),

      addToCart: (product) =>
        set((state) => {
          const items = [...state.cart.items] as CartItem[];
          const updatedItems = addToCartUseCase.execute(items, product);
          const newCart = createCart(updatedItems);

          logger.info('Product added to cart', {
            productId: product.productId,
            totalItems: newCart.totalItems,
          });

          return { cart: newCart };
        }),

      removeFromCart: (productId) =>
        set((state) => {
          const items = [...state.cart.items] as CartItem[];
          const updatedItems = removeFromCartUseCase.execute(items, productId);
          const newCart = createCart(updatedItems);

          logger.info('Product removed from cart', {
            productId,
            totalItems: newCart.totalItems,
          });

          return { cart: newCart };
        }),

      updateQuantity: (productId, quantity) =>
        set((state) => {
          const items = [...state.cart.items] as CartItem[];
          const updatedItems = updateQuantityUseCase.execute(items, productId, quantity);
          const newCart = createCart(updatedItems);

          logger.info('Cart quantity updated', {
            productId,
            quantity,
            totalItems: newCart.totalItems,
          });

          return { cart: newCart };
        }),

      clearCart: () =>
        set(() => {
          const items: CartItem[] = [];
          const updatedItems = clearCartUseCase.execute(items);
          const newCart = createCart(updatedItems);

          logger.info('Cart cleared');

          return { cart: newCart };
        }),
    }),
    {
      name: 'cart-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
