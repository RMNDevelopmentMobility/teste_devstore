import { CartRepository, AddToCartParams } from '../../domain/repositories/CartRepository';
import { Cart } from '../../domain/entities/Cart';
import { CartItem } from '../../domain/entities/CartItem';
import { AddToCart } from '../../domain/use_cases/AddToCart';
import { RemoveFromCart } from '../../domain/use_cases/RemoveFromCart';
import { UpdateCartItemQuantity } from '../../domain/use_cases/UpdateQuantity';
import { ClearCart } from '../../domain/use_cases/ClearCart';
import { useZustandCartStore } from '../../external/stores/ZustandCartStore';
import { logger } from '@core/logger';

export class CartRepositoryImpl implements CartRepository {
  private readonly addToCartUseCase = new AddToCart();
  private readonly removeFromCartUseCase = new RemoveFromCart();
  private readonly updateQuantityUseCase = new UpdateCartItemQuantity();
  private readonly clearCartUseCase = new ClearCart();

  getCart(): Cart {
    return useZustandCartStore.getState().cart;
  }

  addToCart(params: AddToCartParams): void {
    const currentItems = [...this.getCart().items] as CartItem[];
    const updatedItems = this.addToCartUseCase.execute(currentItems, params);
    useZustandCartStore.getState().setItems(updatedItems);

    logger.info('Product added to cart', {
      productId: params.productId,
      totalItems: useZustandCartStore.getState().cart.totalItems,
    });
  }

  removeFromCart(productId: number): void {
    const currentItems = [...this.getCart().items] as CartItem[];
    const updatedItems = this.removeFromCartUseCase.execute(currentItems, productId);
    useZustandCartStore.getState().setItems(updatedItems);

    logger.info('Product removed from cart', {
      productId,
      totalItems: useZustandCartStore.getState().cart.totalItems,
    });
  }

  updateQuantity(productId: number, quantity: number): void {
    const currentItems = [...this.getCart().items] as CartItem[];
    const updatedItems = this.updateQuantityUseCase.execute(currentItems, productId, quantity);
    useZustandCartStore.getState().setItems(updatedItems);

    logger.info('Cart quantity updated', {
      productId,
      quantity,
      totalItems: useZustandCartStore.getState().cart.totalItems,
    });
  }

  clearCart(): void {
    const updatedItems = this.clearCartUseCase.execute([]);
    useZustandCartStore.getState().setItems(updatedItems);

    logger.info('Cart cleared');
  }

  subscribe(listener: (cart: Cart) => void): () => void {
    return useZustandCartStore.subscribe((state) => listener(state.cart));
  }
}
