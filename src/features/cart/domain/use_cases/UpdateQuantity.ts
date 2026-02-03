import { CartItem, updateQuantity } from '../entities/CartItem';

export class UpdateCartItemQuantity {
  execute(currentItems: CartItem[], productId: number, quantity: number): CartItem[] {
    if (quantity <= 0) {
      // Remove item if quantity is 0 or negative
      return currentItems.filter((item) => item.productId !== productId);
    }

    const itemIndex = currentItems.findIndex((item) => item.productId === productId);

    if (itemIndex === -1) {
      return currentItems;
    }

    const updatedItems = [...currentItems];
    updatedItems[itemIndex] = updateQuantity(updatedItems[itemIndex], quantity);
    return updatedItems;
  }
}
