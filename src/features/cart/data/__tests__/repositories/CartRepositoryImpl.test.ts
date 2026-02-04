import { CartRepositoryImpl } from '../../repositories/CartRepositoryImpl';
import { createEmptyCart, createCart } from '../../../domain/entities/Cart';
import { CartItem } from '../../../domain/entities/CartItem';

// Mock state - must be defined before jest.mock due to hoisting
const mockState = {
  cart: createEmptyCart(),
  setItems: jest.fn(),
};

const mockSubscribe = jest.fn(() => jest.fn()); // Returns unsubscribe function

jest.mock('../../../external/stores/ZustandCartStore', () => ({
  useZustandCartStore: {
    getState: () => mockState,
    subscribe: (...args: unknown[]) => mockSubscribe(...args),
  },
}));

describe('CartRepositoryImpl', () => {
  let repository: CartRepositoryImpl;

  beforeEach(() => {
    jest.clearAllMocks();
    mockState.cart = createEmptyCart();
    mockState.setItems = jest.fn();
    repository = new CartRepositoryImpl();
  });

  describe('getCart', () => {
    it('should return the current cart from store', () => {
      const result = repository.getCart();

      expect(result.items).toEqual([]);
      expect(result.totalItems).toBe(0);
      expect(result.totalPrice).toBe(0);
    });

    it('should return cart with items when store has items', () => {
      const items: CartItem[] = [
        { productId: 1, title: 'Product', price: 100, imageUrl: '', quantity: 2 },
      ];
      mockState.cart = createCart(items);

      const result = repository.getCart();

      expect(result.items).toHaveLength(1);
      expect(result.totalItems).toBe(2);
      expect(result.totalPrice).toBe(200);
    });
  });

  describe('addToCart', () => {
    it('should add a new product to empty cart', () => {
      const params = {
        productId: 1,
        title: 'New Product',
        price: 50,
        imageUrl: 'https://example.com/image.jpg',
      };

      repository.addToCart(params);

      expect(mockState.setItems).toHaveBeenCalledWith(
        expect.arrayContaining([
          expect.objectContaining({
            productId: 1,
            title: 'New Product',
            price: 50,
            quantity: 1,
          }),
        ])
      );
    });

    it('should increment quantity when product already exists', () => {
      const existingItems: CartItem[] = [
        { productId: 1, title: 'Existing Product', price: 50, imageUrl: '', quantity: 2 },
      ];
      mockState.cart = createCart(existingItems);

      const params = {
        productId: 1,
        title: 'Existing Product',
        price: 50,
        imageUrl: '',
      };

      repository.addToCart(params);

      expect(mockState.setItems).toHaveBeenCalledWith(
        expect.arrayContaining([
          expect.objectContaining({
            productId: 1,
            quantity: 3,
          }),
        ])
      );
    });
  });

  describe('removeFromCart', () => {
    it('should remove product from cart', () => {
      const existingItems: CartItem[] = [
        { productId: 1, title: 'Product 1', price: 100, imageUrl: '', quantity: 1 },
        { productId: 2, title: 'Product 2', price: 50, imageUrl: '', quantity: 1 },
      ];
      mockState.cart = createCart(existingItems);

      repository.removeFromCart(1);

      expect(mockState.setItems).toHaveBeenCalledWith(
        expect.arrayContaining([
          expect.objectContaining({ productId: 2 }),
        ])
      );
      expect(mockState.setItems).toHaveBeenCalledWith(
        expect.not.arrayContaining([
          expect.objectContaining({ productId: 1 }),
        ])
      );
    });
  });

  describe('updateQuantity', () => {
    it('should update quantity of existing product', () => {
      const existingItems: CartItem[] = [
        { productId: 1, title: 'Product', price: 100, imageUrl: '', quantity: 1 },
      ];
      mockState.cart = createCart(existingItems);

      repository.updateQuantity(1, 5);

      expect(mockState.setItems).toHaveBeenCalledWith(
        expect.arrayContaining([
          expect.objectContaining({
            productId: 1,
            quantity: 5,
          }),
        ])
      );
    });

    it('should remove product when quantity is set to 0', () => {
      const existingItems: CartItem[] = [
        { productId: 1, title: 'Product', price: 100, imageUrl: '', quantity: 1 },
      ];
      mockState.cart = createCart(existingItems);

      repository.updateQuantity(1, 0);

      expect(mockState.setItems).toHaveBeenCalledWith([]);
    });
  });

  describe('clearCart', () => {
    it('should clear all items from cart', () => {
      const existingItems: CartItem[] = [
        { productId: 1, title: 'Product 1', price: 100, imageUrl: '', quantity: 1 },
        { productId: 2, title: 'Product 2', price: 50, imageUrl: '', quantity: 2 },
      ];
      mockState.cart = createCart(existingItems);

      repository.clearCart();

      expect(mockState.setItems).toHaveBeenCalledWith([]);
    });
  });

  describe('subscribe', () => {
    it('should subscribe to cart changes', () => {
      const listener = jest.fn();

      repository.subscribe(listener);

      expect(mockSubscribe).toHaveBeenCalled();
    });
  });
});
