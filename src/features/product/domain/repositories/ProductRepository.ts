import { Either } from '@core/either';
import { AppError } from '@core/errors';
import { Product } from '../entities/Product';

export interface GetProductsParams {
  limit?: number;
  offset?: number;
}

export interface ProductRepository {
  getProducts(params: GetProductsParams): Promise<Either<AppError, Product[]>>;
  getProductById(id: number): Promise<Either<AppError, Product>>;
}
