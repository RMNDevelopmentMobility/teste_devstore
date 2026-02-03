export interface CartItem {
  readonly productId: number;
  readonly title: string;
  readonly price: number;
  readonly imageUrl: string;
  readonly quantity: number;
}

export const createCartItem = (data: {
  productId: number;
  title: string;
  price: number;
  imageUrl: string;
  quantity: number;
}): CartItem => ({
  productId: data.productId,
  title: data.title,
  price: data.price,
  imageUrl: data.imageUrl,
  quantity: data.quantity,
});

export const updateQuantity = (item: CartItem, quantity: number): CartItem => ({
  ...item,
  quantity,
});
