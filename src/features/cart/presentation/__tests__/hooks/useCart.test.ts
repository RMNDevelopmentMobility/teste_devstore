import { renderHook, act } from '@testing-library/react-native';
import { createEmptyCart, createCart } from '../../../domain/entities/Cart';
import { CartItem } from '../../../domain/entities/CartItem';

// Mock cart state
let mockCartState = createEmptyCart();
const mockAddToCart = jest.fn();
const mockRemoveFromCart = jest.fn();
const mockUpdateQuantity = jest.fn();
const mockClearCart = jest.fn();
const mockSubscribe = jest.fn((callback: () => void) => {
  // Return unsubscribe function
  return () => {};
});

// Mock the cart container
jest.mock('../../../injection/CartContainer', () => ({
  cartContainer: {
    repository: {
      getCart: () => mockCartState,
      addToCart: (...args: unknown[]) => mockAddToCart(...args),
      removeFromCart: (...args: unknown[]) => mockRemoveFromCart(...args),
      updateQuantity: (...args: unknown[]) => mockUpdateQuantity(...args),
      clearCart: () => mockClearCart(),
      subscribe: (callback: (cart: unknown) => void) => mockSubscribe(callback),
    },
  },
}));

// Import after mocking
import { useCart } from '../../hooks/useCart';

describe('useCart Hook', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockCartState = createEmptyCart();
  });

  describe('cart state', () => {
    it('should return empty cart initially', () => {
      const { result } = renderHook(() => useCart());

      expect(result.current.cart.items).toEqual([]);
      expect(result.current.cart.totalItems).toBe(0);
      expect(result.current.cart.totalPrice).toBe(0);
    });

    it('should return cart with items when store has items', () => {
      const items: CartItem[] = [
        { productId: 1, title: 'Product', price: 100, imageUrl: '', quantity: 2 },
      ];
      mockCartState = createCart(items);

      const { result } = renderHook(() => useCart());

      expect(result.current.cart.items).toHaveLength(1);
      expect(result.current.cart.totalItems).toBe(2);
      expect(result.current.cart.totalPrice).toBe(200);
    });
  });

  describe('addToCart', () => {
    it('should call repository addToCart with correct params', () => {
      const { result } = renderHook(() => useCart());

      const productParams = {
        productId: 1,
        title: 'New Product',
        price: 50,
        imageUrl: 'https://example.com/image.jpg',
      };

      act(() => {
        result.current.addToCart(productParams);
      });

      expect(mockAddToCart).toHaveBeenCalledWith(productParams);
    });

    it('should be a stable function reference', () => {
      const { result, rerender } = renderHook(() => useCart());

      const firstRef = result.current.addToCart;
      rerender({});
      const secondRef = result.current.addToCart;

      expect(firstRef).toBe(secondRef);
    });
  });

  describe('removeFromCart', () => {
    it('should call repository removeFromCart with correct productId', () => {
      const { result } = renderHook(() => useCart());

      act(() => {
        result.current.removeFromCart(42);
      });

      expect(mockRemoveFromCart).toHaveBeenCalledWith(42);
    });

    it('should be a stable function reference', () => {
      const { result, rerender } = renderHook(() => useCart());

      const firstRef = result.current.removeFromCart;
      rerender({});
      const secondRef = result.current.removeFromCart;

      expect(firstRef).toBe(secondRef);
    });
  });

  describe('updateQuantity', () => {
    it('should call repository updateQuantity with correct params', () => {
      const { result } = renderHook(() => useCart());

      act(() => {
        result.current.updateQuantity(1, 5);
      });

      expect(mockUpdateQuantity).toHaveBeenCalledWith(1, 5);
    });

    it('should be a stable function reference', () => {
      const { result, rerender } = renderHook(() => useCart());

      const firstRef = result.current.updateQuantity;
      rerender({});
      const secondRef = result.current.updateQuantity;

      expect(firstRef).toBe(secondRef);
    });
  });

  describe('clearCart', () => {
    it('should call repository clearCart', () => {
      const { result } = renderHook(() => useCart());

      act(() => {
        result.current.clearCart();
      });

      expect(mockClearCart).toHaveBeenCalled();
    });

    it('should be a stable function reference', () => {
      const { result, rerender } = renderHook(() => useCart());

      const firstRef = result.current.clearCart;
      rerender({});
      const secondRef = result.current.clearCart;

      expect(firstRef).toBe(secondRef);
    });
  });

  describe('subscription', () => {
    it('should subscribe to store changes', () => {
      renderHook(() => useCart());

      expect(mockSubscribe).toHaveBeenCalled();
    });
  });
});
