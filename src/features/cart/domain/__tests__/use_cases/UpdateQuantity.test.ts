import { UpdateCartItemQuantity } from '../../use_cases/UpdateQuantity';
import { CartItem } from '../../entities/CartItem';

describe('UpdateCartItemQuantity Use Case', () => {
  let updateQuantity: UpdateCartItemQuantity;

  beforeEach(() => {
    updateQuantity = new UpdateCartItemQuantity();
  });

  const mockCartItems: CartItem[] = [
    { productId: 1, title: 'Product 1', price: 100, imageUrl: '', quantity: 2 },
    { productId: 2, title: 'Product 2', price: 50, imageUrl: '', quantity: 1 },
  ];

  describe('when updating quantity to a positive number', () => {
    it('should update the quantity of the specified product', () => {
      const result = updateQuantity.execute([...mockCartItems], 1, 5);

      expect(result).toHaveLength(2);
      expect(result[0].quantity).toBe(5);
      expect(result[1].quantity).toBe(1);
    });
  });

  describe('when updating quantity to zero', () => {
    it('should remove the item from the cart', () => {
      const result = updateQuantity.execute([...mockCartItems], 1, 0);

      expect(result).toHaveLength(1);
      expect(result[0].productId).toBe(2);
    });
  });

  describe('when updating quantity to negative number', () => {
    it('should remove the item from the cart', () => {
      const result = updateQuantity.execute([...mockCartItems], 1, -1);

      expect(result).toHaveLength(1);
      expect(result[0].productId).toBe(2);
    });
  });

  describe('when product is not in cart', () => {
    it('should return items unchanged', () => {
      const result = updateQuantity.execute([...mockCartItems], 999, 5);

      expect(result).toHaveLength(2);
      expect(result).toEqual(mockCartItems);
    });
  });

  describe('immutability', () => {
    it('should not mutate the original array', () => {
      const originalItems = [...mockCartItems];

      updateQuantity.execute(originalItems, 1, 10);

      expect(originalItems[0].quantity).toBe(2);
    });
  });
});
