import { createEmptyCart, calculateTotals, createCart, Cart } from '../../entities/Cart';
import { CartItem } from '../../entities/CartItem';

describe('Cart Entity', () => {
  describe('createEmptyCart', () => {
    it('should create an empty cart with zero items and price', () => {
      const cart = createEmptyCart();

      expect(cart.items).toEqual([]);
      expect(cart.totalItems).toBe(0);
      expect(cart.totalPrice).toBe(0);
    });
  });

  describe('calculateTotals', () => {
    it('should calculate totals correctly for multiple items', () => {
      const items: CartItem[] = [
        { productId: 1, title: 'Product 1', price: 100, imageUrl: '', quantity: 2 },
        { productId: 2, title: 'Product 2', price: 50, imageUrl: '', quantity: 3 },
      ];

      const totals = calculateTotals(items);

      expect(totals.totalItems).toBe(5); // 2 + 3
      expect(totals.totalPrice).toBe(350); // (100 * 2) + (50 * 3)
    });

    it('should return zero totals for empty items array', () => {
      const totals = calculateTotals([]);

      expect(totals.totalItems).toBe(0);
      expect(totals.totalPrice).toBe(0);
    });

    it('should calculate totals for single item', () => {
      const items: CartItem[] = [
        { productId: 1, title: 'Product 1', price: 25.50, imageUrl: '', quantity: 4 },
      ];

      const totals = calculateTotals(items);

      expect(totals.totalItems).toBe(4);
      expect(totals.totalPrice).toBe(102); // 25.50 * 4
    });
  });

  describe('createCart', () => {
    it('should create a cart with items and calculated totals', () => {
      const items: CartItem[] = [
        { productId: 1, title: 'Product 1', price: 100, imageUrl: '', quantity: 1 },
        { productId: 2, title: 'Product 2', price: 200, imageUrl: '', quantity: 2 },
      ];

      const cart = createCart(items);

      expect(cart.items).toHaveLength(2);
      expect(cart.totalItems).toBe(3);
      expect(cart.totalPrice).toBe(500);
    });

    it('should freeze the items array', () => {
      const items: CartItem[] = [
        { productId: 1, title: 'Product 1', price: 100, imageUrl: '', quantity: 1 },
      ];

      const cart = createCart(items);

      expect(Object.isFrozen(cart.items)).toBe(true);
    });

    it('should not be affected by mutations to the original array', () => {
      const items: CartItem[] = [
        { productId: 1, title: 'Product 1', price: 100, imageUrl: '', quantity: 1 },
      ];

      const cart = createCart(items);
      items.push({ productId: 2, title: 'Product 2', price: 50, imageUrl: '', quantity: 1 });

      expect(cart.items).toHaveLength(1);
    });
  });
});
