import { CartItem } from '../entities/CartItem';

export class ClearCart {
  execute(_currentItems: CartItem[]): CartItem[] {
    return [];
  }
}
