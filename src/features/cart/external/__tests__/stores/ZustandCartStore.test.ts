import { createCart, createEmptyCart } from '../../../domain/entities/Cart';
import { CartItem } from '../../../domain/entities/CartItem';

// Mock the storage adapter before importing the store
jest.mock('@core/storage', () => ({
  asyncStorageService: {
    getItem: jest.fn(),
    setItem: jest.fn(),
    removeItem: jest.fn(),
  },
  zustandStorageAdapter: () => ({
    getItem: jest.fn().mockResolvedValue(null),
    setItem: jest.fn().mockResolvedValue(undefined),
    removeItem: jest.fn().mockResolvedValue(undefined),
  }),
}));

// Need to import after mocking
import { useZustandCartStore } from '../../stores/ZustandCartStore';

describe('ZustandCartStore', () => {
  beforeEach(() => {
    // Reset store state before each test
    useZustandCartStore.setState({ cart: createEmptyCart() });
  });

  describe('initial state', () => {
    it('should have empty cart on initialization', () => {
      const { cart } = useZustandCartStore.getState();

      expect(cart.items).toEqual([]);
      expect(cart.totalItems).toBe(0);
      expect(cart.totalPrice).toBe(0);
    });
  });

  describe('setCart', () => {
    it('should set the entire cart', () => {
      const items: CartItem[] = [
        { productId: 1, title: 'Product 1', price: 100, imageUrl: '', quantity: 2 },
      ];
      const newCart = createCart(items);

      useZustandCartStore.getState().setCart(newCart);

      const { cart } = useZustandCartStore.getState();
      expect(cart.items).toHaveLength(1);
      expect(cart.totalItems).toBe(2);
      expect(cart.totalPrice).toBe(200);
    });
  });

  describe('setItems', () => {
    it('should set items and recalculate totals', () => {
      const items: CartItem[] = [
        { productId: 1, title: 'Product 1', price: 50, imageUrl: '', quantity: 2 },
        { productId: 2, title: 'Product 2', price: 30, imageUrl: '', quantity: 3 },
      ];

      useZustandCartStore.getState().setItems(items);

      const { cart } = useZustandCartStore.getState();
      expect(cart.items).toHaveLength(2);
      expect(cart.totalItems).toBe(5); // 2 + 3
      expect(cart.totalPrice).toBe(190); // (50*2) + (30*3)
    });

    it('should handle empty items array', () => {
      // First add some items
      const items: CartItem[] = [
        { productId: 1, title: 'Product', price: 100, imageUrl: '', quantity: 1 },
      ];
      useZustandCartStore.getState().setItems(items);

      // Then clear
      useZustandCartStore.getState().setItems([]);

      const { cart } = useZustandCartStore.getState();
      expect(cart.items).toEqual([]);
      expect(cart.totalItems).toBe(0);
      expect(cart.totalPrice).toBe(0);
    });

    it('should create frozen items array', () => {
      const items: CartItem[] = [
        { productId: 1, title: 'Product', price: 100, imageUrl: '', quantity: 1 },
      ];

      useZustandCartStore.getState().setItems(items);

      const { cart } = useZustandCartStore.getState();
      expect(Object.isFrozen(cart.items)).toBe(true);
    });
  });

  describe('subscriptions', () => {
    it('should notify subscribers on state change', () => {
      const listener = jest.fn();
      const unsubscribe = useZustandCartStore.subscribe(listener);

      const items: CartItem[] = [
        { productId: 1, title: 'Product', price: 100, imageUrl: '', quantity: 1 },
      ];
      useZustandCartStore.getState().setItems(items);

      expect(listener).toHaveBeenCalled();

      unsubscribe();
    });

    it('should not notify after unsubscribe', () => {
      const listener = jest.fn();
      const unsubscribe = useZustandCartStore.subscribe(listener);

      unsubscribe();
      listener.mockClear();

      const items: CartItem[] = [
        { productId: 1, title: 'Product', price: 100, imageUrl: '', quantity: 1 },
      ];
      useZustandCartStore.getState().setItems(items);

      expect(listener).not.toHaveBeenCalled();
    });
  });
});
