import { CartItem, createCartItem, updateQuantity } from '../entities/CartItem';

export class AddToCart {
  execute(
    currentItems: CartItem[],
    productData: {
      productId: number;
      title: string;
      price: number;
      imageUrl: string;
    }
  ): CartItem[] {
    const existingItemIndex = currentItems.findIndex(
      (item) => item.productId === productData.productId
    );

    if (existingItemIndex !== -1) {
      // Product already in cart, increment quantity
      const updatedItems = [...currentItems];
      updatedItems[existingItemIndex] = updateQuantity(
        updatedItems[existingItemIndex],
        updatedItems[existingItemIndex].quantity + 1
      );
      return updatedItems;
    }

    // Add new product to cart
    const newItem = createCartItem({ ...productData, quantity: 1 });
    return [...currentItems, newItem];
  }
}
