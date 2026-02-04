import { AddToCart } from '../../use_cases/AddToCart';
import { CartItem } from '../../entities/CartItem';

describe('AddToCart Use Case', () => {
  let addToCart: AddToCart;

  beforeEach(() => {
    addToCart = new AddToCart();
  });

  const mockProductData = {
    productId: 1,
    title: 'Test Product',
    price: 99.99,
    imageUrl: 'https://example.com/image.jpg',
  };

  describe('when cart is empty', () => {
    it('should add new product to empty cart with quantity 1', () => {
      const currentItems: CartItem[] = [];

      const result = addToCart.execute(currentItems, mockProductData);

      expect(result).toHaveLength(1);
      expect(result[0].productId).toBe(1);
      expect(result[0].title).toBe('Test Product');
      expect(result[0].price).toBe(99.99);
      expect(result[0].quantity).toBe(1);
    });
  });

  describe('when product is not in cart', () => {
    it('should add new product to cart with existing items', () => {
      const currentItems: CartItem[] = [
        { productId: 2, title: 'Existing Product', price: 50, imageUrl: '', quantity: 2 },
      ];

      const result = addToCart.execute(currentItems, mockProductData);

      expect(result).toHaveLength(2);
      expect(result[1].productId).toBe(1);
      expect(result[1].quantity).toBe(1);
    });
  });

  describe('when product already exists in cart', () => {
    it('should increment quantity of existing product', () => {
      const currentItems: CartItem[] = [
        { productId: 1, title: 'Test Product', price: 99.99, imageUrl: '', quantity: 3 },
      ];

      const result = addToCart.execute(currentItems, mockProductData);

      expect(result).toHaveLength(1);
      expect(result[0].productId).toBe(1);
      expect(result[0].quantity).toBe(4);
    });

    it('should not mutate the original array', () => {
      const currentItems: CartItem[] = [
        { productId: 1, title: 'Test Product', price: 99.99, imageUrl: '', quantity: 1 },
      ];

      addToCart.execute(currentItems, mockProductData);

      expect(currentItems[0].quantity).toBe(1);
    });
  });
});
