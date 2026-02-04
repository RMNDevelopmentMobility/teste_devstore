import { createCartItem, updateQuantity, CartItem } from '../../entities/CartItem';

describe('CartItem Entity', () => {
  describe('createCartItem', () => {
    it('should create a cart item with all properties', () => {
      const itemData = {
        productId: 1,
        title: 'Test Product',
        price: 99.99,
        imageUrl: 'https://example.com/image.jpg',
        quantity: 2,
      };

      const cartItem = createCartItem(itemData);

      expect(cartItem.productId).toBe(1);
      expect(cartItem.title).toBe('Test Product');
      expect(cartItem.price).toBe(99.99);
      expect(cartItem.imageUrl).toBe('https://example.com/image.jpg');
      expect(cartItem.quantity).toBe(2);
    });

    it('should create a cart item with minimum quantity', () => {
      const itemData = {
        productId: 1,
        title: 'Test Product',
        price: 10,
        imageUrl: '',
        quantity: 1,
      };

      const cartItem = createCartItem(itemData);

      expect(cartItem.quantity).toBe(1);
    });
  });

  describe('updateQuantity', () => {
    it('should update the quantity of a cart item', () => {
      const originalItem: CartItem = {
        productId: 1,
        title: 'Test Product',
        price: 50,
        imageUrl: 'https://example.com/image.jpg',
        quantity: 1,
      };

      const updatedItem = updateQuantity(originalItem, 5);

      expect(updatedItem.quantity).toBe(5);
      expect(updatedItem.productId).toBe(originalItem.productId);
      expect(updatedItem.title).toBe(originalItem.title);
      expect(updatedItem.price).toBe(originalItem.price);
    });

    it('should not mutate the original item', () => {
      const originalItem: CartItem = {
        productId: 1,
        title: 'Test Product',
        price: 50,
        imageUrl: 'https://example.com/image.jpg',
        quantity: 1,
      };

      updateQuantity(originalItem, 10);

      expect(originalItem.quantity).toBe(1);
    });
  });
});
