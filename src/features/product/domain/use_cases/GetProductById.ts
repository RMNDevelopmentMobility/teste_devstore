import { Either } from '@core/either';
import { AppError } from '@core/errors';
import { Product } from '../entities/Product';
import { ProductRepository } from '../repositories/ProductRepository';

export class GetProductById {
  constructor(private readonly repository: ProductRepository) {}

  async execute(id: number): Promise<Either<AppError, Product>> {
    return this.repository.getProductById(id);
  }
}
