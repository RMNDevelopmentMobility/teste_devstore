import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { asyncStorageService, zustandStorageAdapter } from '@core/storage';
import { CartItem } from '../../domain/entities/CartItem';
import { Cart, createCart, createEmptyCart } from '../../domain/entities/Cart';

interface ZustandCartState {
  cart: Cart;
  setCart: (cart: Cart) => void;
  setItems: (items: CartItem[]) => void;
}

const zustandStorage = zustandStorageAdapter(asyncStorageService);

export const useZustandCartStore = create<ZustandCartState>()(
  persist(
    (set) => ({
      cart: createEmptyCart(),

      setCart: (cart: Cart) => set({ cart }),

      setItems: (items: CartItem[]) =>
        set({ cart: createCart(items) }),
    }),
    {
      name: 'cart-storage',
      storage: createJSONStorage(() => zustandStorage),
    }
  )
);
