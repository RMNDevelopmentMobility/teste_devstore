import { Either } from '@core/either';
import { AppError } from '@core/errors';
import { Product } from '../entities/Product';
import { ProductRepository, GetProductsParams } from '../repositories/ProductRepository';

export class GetProducts {
  constructor(private readonly repository: ProductRepository) {}

  async execute(params: GetProductsParams = {}): Promise<Either<AppError, Product[]>> {
    const { limit = 20, offset = 0 } = params;
    return this.repository.getProducts({ limit, offset });
  }
}
