import { CartRepository } from '../domain/repositories/CartRepository';
import { CartRepositoryImpl } from '../data/repositories/CartRepositoryImpl';

class CartContainer {
  private static instance: CartContainer | null = null;

  private _repository: CartRepository | null = null;

  private constructor() {}

  static getInstance(): CartContainer {
    if (!CartContainer.instance) {
      CartContainer.instance = new CartContainer();
    }
    return CartContainer.instance;
  }

  get repository(): CartRepository {
    if (!this._repository) {
      this._repository = new CartRepositoryImpl();
    }
    return this._repository;
  }
}

export const cartContainer = CartContainer.getInstance();
