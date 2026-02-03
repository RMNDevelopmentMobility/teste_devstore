import { CartItem } from '../entities/CartItem';

export class RemoveFromCart {
  execute(currentItems: CartItem[], productId: number): CartItem[] {
    return currentItems.filter((item) => item.productId !== productId);
  }
}
