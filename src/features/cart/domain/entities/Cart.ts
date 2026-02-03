import { CartItem } from './CartItem';

export interface Cart {
  readonly items: readonly CartItem[];
  readonly totalItems: number;
  readonly totalPrice: number;
}

export const createEmptyCart = (): Cart => ({
  items: [],
  totalItems: 0,
  totalPrice: 0,
});

export const calculateTotals = (items: CartItem[]): Pick<Cart, 'totalItems' | 'totalPrice'> => {
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return { totalItems, totalPrice };
};

export const createCart = (items: CartItem[]): Cart => {
  const { totalItems, totalPrice } = calculateTotals(items);

  return {
    items: Object.freeze([...items]),
    totalItems,
    totalPrice,
  };
};
