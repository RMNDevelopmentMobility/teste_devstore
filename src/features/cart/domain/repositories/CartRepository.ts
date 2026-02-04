import { Cart } from '../entities/Cart';

export interface AddToCartParams {
  productId: number;
  title: string;
  price: number;
  imageUrl: string;
}

export interface CartRepository {
  getCart(): Cart;
  addToCart(params: AddToCartParams): void;
  removeFromCart(productId: number): void;
  updateQuantity(productId: number, quantity: number): void;
  clearCart(): void;
  subscribe(listener: (cart: Cart) => void): () => void;
}
